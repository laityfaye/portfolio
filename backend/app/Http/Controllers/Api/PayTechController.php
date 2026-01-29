<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Services\PayTechService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Contrôleur PayTech - Gestion des paiements via l'API PayTech
 * Documentation: https://doc.intech.sn/doc_paytech.php
 */
class PayTechController extends Controller
{
    public function __construct(
        protected PayTechService $payTechService
    ) {}

    /**
     * Initier un paiement PayTech - Crée la demande et retourne l'URL de redirection
     * POST /api/payments/paytech/request
     */
    public function requestPayment(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            // Vérifier si l'utilisateur a déjà un paiement en attente ou approuvé
            $existingPayment = $user->payments()
                ->whereIn('status', ['pending', 'approved'])
                ->first();

            if ($existingPayment) {
                if ($existingPayment->isApproved()) {
                    return response()->json([
                        'message' => 'Votre paiement a déjà été approuvé',
                    ], 400);
                }
                return response()->json([
                    'message' => 'Vous avez déjà un paiement en attente',
                ], 400);
            }

            $amount = config('paytech.default_amount', 2500);
            $refCommand = 'PAY_' . $user->id . '_' . time() . '_' . bin2hex(random_bytes(4));

            $params = [
                'item_name' => 'Activation Portfolio - ' . config('app.name'),
                'item_price' => $amount,
                'ref_command' => $refCommand,
                'command_name' => 'Paiement activation portfolio',
                'custom_field' => json_encode([
                    'user_id' => $user->id,
                    'email' => $user->email,
                ]),
                'target_payment' => $request->input('target_payment', 'Orange Money, Wave, Free Money'),
            ];

            $response = $this->payTechService->requestPayment($params);
        } catch (\RuntimeException $e) {
            Log::error('PayTech configuration error', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => $e->getMessage(),
                'error_code' => 'PAYTECH_CONFIG_ERROR',
            ], 400);
        } catch (\Exception $e) {
            Log::error('PayTech request error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'message' => 'Erreur lors de la création du paiement: ' . $e->getMessage(),
            ], 500);
        }

        if (($response['success'] ?? 0) !== 1) {
            Log::error('PayTech request failed', ['response' => $response]);
            return response()->json([
                'message' => $response['message'] ?? 'Erreur lors de la création du paiement',
            ], 400);
        }

        // Créer l'enregistrement Payment en attente
        $payment = $user->payments()->create([
            'ref_command' => $refCommand,
            'token' => $response['token'] ?? null,
            'amount' => $amount,
            'currency' => 'XOF',
            'status' => 'pending',
            'type' => 'paytech',
        ]);

        return response()->json([
            'success' => true,
            'redirect_url' => $response['redirect_url'] ?? $response['redirectUrl'],
            'token' => $response['token'] ?? null,
            'payment_id' => $payment->id,
        ]);
    }

    /**
     * Webhook IPN - Notifications PayTech (sale_complete, sale_canceled)
     * POST /api/payments/paytech/ipn
     *
     * PayTech envoie les données en JSON ou form-urlencoded selon la doc
     */
    public function handleIpn(Request $request): JsonResponse|string
    {
        // PayTech peut envoyer en JSON ou form - récupérer les données
        $data = $request->all();

        Log::info('PayTech IPN received', ['type_event' => $data['type_event'] ?? 'unknown']);

        if (!$this->payTechService->verifyIpn($data)) {
            Log::warning('PayTech IPN verification failed');
            return response('IPN KO', 403);
        }

        $typeEvent = $data['type_event'] ?? '';
        $refCommand = $data['ref_command'] ?? '';

        if ($typeEvent === 'sale_complete') {
            $this->handleSaleComplete($data);
        } elseif ($typeEvent === 'sale_canceled') {
            $this->handleSaleCanceled($data);
        }

        return response('IPN OK', 200);
    }

    /**
     * Webhook Remboursement - refund_complete
     * POST /api/payments/paytech/refund-ipn
     */
    public function handleRefundIpn(Request $request): JsonResponse|string
    {
        $data = $request->isJson() ? $request->all() : $request->all();

        if (!$this->payTechService->verifyIpn($data)) {
            return response('IPN KO', 403);
        }

        if (($data['type_event'] ?? '') === 'refund_complete') {
            $refCommand = $data['ref_command'] ?? '';
            $payment = Payment::where('ref_command', $refCommand)->first();
            if ($payment) {
                Log::info('PayTech refund received', ['ref_command' => $refCommand]);
                // Note: Pour ajouter le statut 'refunded', une migration serait nécessaire
            }
        }

        return response('IPN OK', 200);
    }

    protected function handleSaleComplete(array $data): void
    {
        $refCommand = $data['ref_command'] ?? '';
        $payment = Payment::where('ref_command', $refCommand)->first();

        if (!$payment) {
            Log::warning('PayTech IPN: Payment not found', ['ref_command' => $refCommand]);
            return;
        }

        $payment->update([
            'status' => 'approved',
            'payment_method' => $data['payment_method'] ?? null,
            'verified_at' => now(),
        ]);

        // Activer l'utilisateur
        $payment->user->update(['status' => 'active']);

        Log::info('PayTech payment approved', ['ref_command' => $refCommand]);
    }

    protected function handleSaleCanceled(array $data): void
    {
        $refCommand = $data['ref_command'] ?? '';
        $payment = Payment::where('ref_command', $refCommand)->first();

        if ($payment && $payment->status === 'pending') {
            $payment->update(['status' => 'rejected']);
            Log::info('PayTech payment canceled', ['ref_command' => $refCommand]);
        }
    }
}
