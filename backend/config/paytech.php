<?php

return [

    /*
    |--------------------------------------------------------------------------
    | PayTech API Configuration
    |--------------------------------------------------------------------------
    | Configuration basée sur la documentation officielle PayTech
    | https://doc.intech.sn/doc_paytech.php
    */

    'api_key' => env('PAYTECH_API_KEY'),
    'api_secret' => env('PAYTECH_API_SECRET'),
    'base_url' => 'https://paytech.sn/api',

    /*
    |--------------------------------------------------------------------------
    | Environment (test | prod)
    |--------------------------------------------------------------------------
    | test: Sandbox - montant aléatoire 100-150 CFA débité
    | prod: Production - montant exact (compte activé requis)
    */

    'env' => env('PAYTECH_ENV', 'test'),

    /*
    |--------------------------------------------------------------------------
    | URLs de callback (redirection frontend après paiement)
    |--------------------------------------------------------------------------
    | Ces URLs pointent vers le FRONTEND (ex: http://localhost:5173 en dev)
    | L'IPN pointe vers le BACKEND (APP_URL)
    */

    'success_url' => env('PAYTECH_SUCCESS_URL', env('FRONTEND_URL', env('APP_URL')) . '/dashboard/payment/success'),
    'cancel_url' => env('PAYTECH_CANCEL_URL', env('FRONTEND_URL', env('APP_URL')) . '/dashboard/payment/cancel'),
    'ipn_url' => env('PAYTECH_IPN_URL', env('APP_URL') . '/api/payments/paytech/ipn'),
    'refund_notif_url' => env('PAYTECH_REFUND_NOTIF_URL', env('APP_URL') . '/api/payments/paytech/refund-ipn'),

    /*
    |--------------------------------------------------------------------------
    | Montant par défaut (FCFA)
    |--------------------------------------------------------------------------
    */

    'default_amount' => 2500,
    'currency' => 'XOF',

];
