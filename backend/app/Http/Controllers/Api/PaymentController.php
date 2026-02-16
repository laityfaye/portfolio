<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Models\PricingModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PaymentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $payments = $request->user()->payments()->orderByDesc('created_at')->get();

        return response()->json([
            'data' => PaymentResource::collection($payments),
        ]);
    }

    public function uploadProof(Request $request): JsonResponse
    {
        $request->validate([
            'proof' => 'required|image|mimes:jpeg,png,jpg|max:5120',
        ]);

        $user = $request->user();

        $existingPayment = $user->payments()
            ->whereIn('status', ['pending', 'approved'])
            ->first();

        if ($existingPayment) {
            if ($existingPayment->isPending()) {
                return response()->json([
                    'message' => 'Vous avez deja une preuve de paiement en attente de validation',
                ], 400);
            }
            // Paiement déjà approuvé : autoriser un nouveau seulement si le portfolio est expiré (renouvellement)
            if ($existingPayment->isApproved() && !$user->portfolio?->isExpired()) {
                return response()->json([
                    'message' => 'Votre paiement a deja ete approuve et votre portfolio est en ligne',
                ], 400);
            }
        }

        $path = $request->file('proof')->store('payments/' . $user->id, 'public');

        $portfolio = $user->portfolio;
        $amount = $portfolio ? $portfolio->getPriceAmount() : (float) PricingModel::getPortfolioYearlyAmount();
        $currency = $portfolio ? $portfolio->getPriceCurrency() : (PricingModel::getBySlug('portfolio_1y')?->currency ?? 'FCFA');

        $payment = $user->payments()->create([
            'proof_image' => $path,
            'amount' => $amount,
            'currency' => $currency,
            'status' => 'pending',
            'type' => 'manual',
        ]);

        return response()->json([
            'data' => new PaymentResource($payment),
            'message' => 'Preuve de paiement envoyee. Elle sera verifiee sous peu.',
        ], 201);
    }
}
