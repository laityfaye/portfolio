<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Service PayTech - Documentation officielle: https://doc.intech.sn/doc_paytech.php
 * Collection Postman: https://doc.intech.sn/PayTech%20x%20DOC.postman_collection.json
 *
 * IMPORTANT: CORS n'est pas activé sur les serveurs PayTech.
 * Les clés API doivent rester confidentielles - toujours utiliser un contrôleur côté serveur.
 */
class PayTechService
{
    protected string $baseUrl;
    protected string $apiKey;
    protected string $apiSecret;
    protected string $env;
    protected string $ipnUrl;
    protected string $successUrl;
    protected string $cancelUrl;
    protected ?string $refundNotifUrl;

    public function __construct()
    {
        $this->baseUrl = config('paytech.base_url', 'https://paytech.sn/api');
        $this->apiKey = config('paytech.api_key');
        $this->apiSecret = config('paytech.api_secret');
        $this->env = config('paytech.env', 'test');
        $this->ipnUrl = config('paytech.ipn_url');
        $this->successUrl = config('paytech.success_url');
        $this->cancelUrl = config('paytech.cancel_url');
        $this->refundNotifUrl = config('paytech.refund_notif_url');

        // Validation des clés API
        if (empty($this->apiKey) || empty($this->apiSecret)) {
            throw new \RuntimeException('Les clés PayTech ne sont pas configurées. Vérifiez vos variables PAYTECH_API_KEY et PAYTECH_API_SECRET dans le fichier .env');
        }
    }

    /**
     * Créer une demande de paiement - POST /payment/request-payment
     *
     * @param array $params Paramètres selon la documentation PayTech
     * @return array Réponse de l'API (success, token, redirect_url)
     */
    public function requestPayment(array $params): array
    {
        $url = $this->baseUrl . '/payment/request-payment';

        // Récupérer les URLs avec fallback
        $ipnUrl = $params['ipn_url'] ?? $this->ipnUrl;
        $refundNotifUrl = $params['refund_notif_url'] ?? $this->refundNotifUrl;

        // Vérifier que les URLs IPN sont en HTTPS (requis par PayTech)
        if ($ipnUrl && !str_starts_with($ipnUrl, 'https://')) {
            Log::warning('PayTech IPN URL must be HTTPS', ['ipn_url' => $ipnUrl]);
            throw new \RuntimeException(
                'L\'URL IPN doit être en HTTPS. ' .
                'En développement local, utilisez ngrok: https://ngrok.com/ ' .
                'Puis configurez PAYTECH_IPN_URL avec l\'URL ngrok HTTPS.'
            );
        }

        if ($refundNotifUrl && !str_starts_with($refundNotifUrl, 'https://')) {
            Log::warning('PayTech Refund Notification URL must be HTTPS', ['refund_notif_url' => $refundNotifUrl]);
            // Ne pas bloquer pour refund_notif_url car c'est optionnel
            $refundNotifUrl = null;
        }

        // Récupérer les URLs de redirection
        $successUrl = $params['success_url'] ?? $this->successUrl;
        $cancelUrl = $params['cancel_url'] ?? $this->cancelUrl;

        // Vérifier que les URLs sont valides
        if (empty($successUrl) || !filter_var($successUrl, FILTER_VALIDATE_URL)) {
            throw new \RuntimeException('L\'URL success_url n\'est pas valide: ' . $successUrl);
        }

        if (empty($cancelUrl) || !filter_var($cancelUrl, FILTER_VALIDATE_URL)) {
            throw new \RuntimeException('L\'URL cancel_url n\'est pas valide: ' . $cancelUrl);
        }

        // NOTE: PayTech peut exiger HTTPS pour toutes les URLs selon leur configuration
        // Si vous obtenez l'erreur "successRedirectUrl doit être un URL", 
        // essayez d'utiliser ngrok pour le frontend aussi ou une URL HTTPS en production

        // Construire le payload - s'assurer que les URLs sont bien formatées
        $payload = [
            'item_name' => $params['item_name'] ?? 'Paiement Portfolio',
            'item_price' => $params['item_price'] ?? config('paytech.default_amount', 2500),
            'currency' => strtoupper($params['currency'] ?? config('paytech.currency', 'XOF')),
            'ref_command' => $params['ref_command'],
            'command_name' => $params['command_name'] ?? ($params['item_name'] ?? 'Paiement Portfolio'),
            'env' => $params['env'] ?? $this->env,
            'ipn_url' => $ipnUrl,
            'success_url' => $successUrl,
            'cancel_url' => $cancelUrl,
        ];

        // Ajouter refund_notif_url seulement si défini et valide
        if ($refundNotifUrl) {
            $payload['refund_notif_url'] = $refundNotifUrl;
        }

        // Ajouter custom_field si défini
        if (isset($params['custom_field'])) {
            $payload['custom_field'] = is_array($params['custom_field']) 
                ? json_encode($params['custom_field']) 
                : $params['custom_field'];
        }

        // Ajouter target_payment si défini
        if (isset($params['target_payment']) && !empty($params['target_payment'])) {
            $payload['target_payment'] = $params['target_payment'];
        }

        // Log pour debug
        Log::info('PayTech request payload', [
            'success_url' => $successUrl,
            'cancel_url' => $cancelUrl,
            'ipn_url' => $ipnUrl,
            'payload_keys' => array_keys($payload),
        ]);

        // Log du payload avant envoi pour debug
        Log::info('PayTech request payload before send', [
            'url' => $url,
            'payload' => $payload,
            'success_url' => $successUrl,
            'cancel_url' => $cancelUrl,
        ]);

        $response = Http::withHeaders([
            'API_KEY' => $this->apiKey,
            'API_SECRET' => $this->apiSecret,
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ])->post($url, $payload);

        $data = $response->json();

        if (!$response->successful()) {
            Log::error('PayTech request-payment failed', [
                'status' => $response->status(),
                'response' => $data,
                'payload_sent' => $payload,
            ]);
        }

        return $data;
    }

    /**
     * Vérifier le statut d'un paiement - GET /payment/get-status
     */
    public function getPaymentStatus(string $token): array
    {
        $url = $this->baseUrl . '/payment/get-status';
        $response = Http::withHeaders([
            'API_KEY' => $this->apiKey,
            'API_SECRET' => $this->apiSecret,
        ])->get($url, ['token_payment' => $token]);

        return $response->json();
    }

    /**
     * Vérifier l'authenticité d'une notification IPN - Méthode HMAC-SHA256 (recommandée)
     *
     * Message pour paiements: amount|ref_command|api_key
     * Message pour transfers: amount|id_transfer|api_key
     */
    public function verifyIpnHmac(array $data): bool
    {
        $hmacCompute = $data['hmac_compute'] ?? null;
        if (!$hmacCompute) {
            return false;
        }

        $typeEvent = $data['type_event'] ?? '';

        if (str_starts_with($typeEvent, 'transfer_')) {
            $amount = $data['amount'] ?? $data['amount_xof'] ?? 0;
            $idTransfer = $data['id_transfer'] ?? '';
            $message = "{$amount}|{$idTransfer}|{$this->apiKey}";
        } else {
            $amount = $data['final_item_price'] ?? $data['item_price'] ?? 0;
            $refCommand = $data['ref_command'] ?? '';
            $message = "{$amount}|{$refCommand}|{$this->apiKey}";
        }

        $expectedHmac = hash_hmac('sha256', $message, $this->apiSecret);

        return hash_equals($expectedHmac, $hmacCompute);
    }

    /**
     * Vérifier l'authenticité d'une notification IPN - Méthode SHA256 (alternative)
     */
    public function verifyIpnSha256(array $data): bool
    {
        $receivedKeyHash = $data['api_key_sha256'] ?? null;
        $receivedSecretHash = $data['api_secret_sha256'] ?? null;

        if (!$receivedKeyHash || !$receivedSecretHash) {
            return false;
        }

        $expectedKeyHash = hash('sha256', $this->apiKey);
        $expectedSecretHash = hash('sha256', $this->apiSecret);

        return hash_equals($expectedKeyHash, $receivedKeyHash)
            && hash_equals($expectedSecretHash, $receivedSecretHash);
    }

    /**
     * Vérifier l'authenticité d'une notification IPN (essaie HMAC puis SHA256)
     */
    public function verifyIpn(array $data): bool
    {
        if ($this->verifyIpnHmac($data)) {
            return true;
        }
        return $this->verifyIpnSha256($data);
    }

    /**
     * Initier un remboursement - POST /payment/refund-payment
     */
    public function refundPayment(string $refCommand): array
    {
        $url = $this->baseUrl . '/payment/refund-payment';
        $response = Http::asForm()->withHeaders([
            'API_KEY' => $this->apiKey,
            'API_SECRET' => $this->apiSecret,
        ])->post($url, ['ref_command' => $refCommand]);

        return $response->json();
    }
}
