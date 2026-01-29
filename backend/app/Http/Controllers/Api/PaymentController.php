<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
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

        // Check if user already has a pending or approved payment
        $existingPayment = $user->payments()
            ->whereIn('status', ['pending', 'approved'])
            ->first();

        if ($existingPayment) {
            if ($existingPayment->isApproved()) {
                return response()->json([
                    'message' => 'Votre paiement a deja ete approuve',
                ], 400);
            }

            return response()->json([
                'message' => 'Vous avez deja une preuve de paiement en attente de validation',
            ], 400);
        }

        $path = $request->file('proof')->store('payments/' . $user->id, 'public');

        $payment = $user->payments()->create([
            'proof_image' => $path,
            'amount' => 2500,
            'currency' => 'FCFA',
            'status' => 'pending',
            'type' => 'manual',
        ]);

        return response()->json([
            'data' => new PaymentResource($payment),
            'message' => 'Preuve de paiement envoyee. Elle sera verifiee sous peu.',
        ], 201);
    }
}
