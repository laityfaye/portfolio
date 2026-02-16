<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminPaymentController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Payment::with(['user', 'verifier']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $payments = $query->orderBy('created_at', 'desc')->paginate(15);

        return PaymentResource::collection($payments);
    }

    public function show(Payment $payment): PaymentResource
    {
        $payment->load(['user', 'verifier']);

        return new PaymentResource($payment);
    }

    public function approve(Request $request, Payment $payment): JsonResponse
    {
        if ($payment->status !== 'pending') {
            return response()->json([
                'message' => 'Ce paiement a deja ete traite',
            ], 400);
        }

        $payment->update([
            'status' => 'approved',
            'verified_by' => $request->user()->id,
            'verified_at' => now(),
            'admin_notes' => $request->admin_notes,
        ]);

        // Activate user account
        $payment->user->update(['status' => 'active']);

        // Durée de vie portfolio : 1 an. Publier le portfolio dès que le paiement est approuvé.
        $portfolio = $payment->user->portfolio;
        if ($portfolio) {
            $portfolio->update(['expires_at' => now()->addYear()]);
            $portfolio->publish();
        }

        return response()->json([
            'message' => 'Paiement approuve. Le compte utilisateur a ete active. Le portfolio est publie et en ligne pour 1 an.',
            'payment' => new PaymentResource($payment->fresh(['user', 'verifier'])),
        ]);
    }

    public function reject(Request $request, Payment $payment): JsonResponse
    {
        $request->validate([
            'admin_notes' => 'required|string|max:500',
        ]);

        if ($payment->status !== 'pending') {
            return response()->json([
                'message' => 'Ce paiement a deja ete traite',
            ], 400);
        }

        $payment->update([
            'status' => 'rejected',
            'verified_by' => $request->user()->id,
            'verified_at' => now(),
            'admin_notes' => $request->admin_notes,
        ]);

        return response()->json([
            'message' => 'Paiement rejete',
            'payment' => new PaymentResource($payment->fresh(['user', 'verifier'])),
        ]);
    }

    public function stats(): JsonResponse
    {
        return response()->json([
            'total' => Payment::count(),
            'pending' => Payment::where('status', 'pending')->count(),
            'approved' => Payment::where('status', 'approved')->count(),
            'rejected' => Payment::where('status', 'rejected')->count(),
            'total_approved_amount' => Payment::where('status', 'approved')->sum('amount'),
        ]);
    }
}
