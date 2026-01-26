<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Http\Resources\UserResource;
use App\Models\Payment;
use App\Models\Portfolio;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        return response()->json([
            'users' => [
                'total' => User::count(),
                'active' => User::where('status', 'active')->count(),
                'pending' => User::where('status', 'pending')->count(),
                'suspended' => User::where('status', 'suspended')->count(),
            ],
            'payments' => [
                'total' => Payment::count(),
                'pending' => Payment::where('status', 'pending')->count(),
                'approved' => Payment::where('status', 'approved')->count(),
                'rejected' => Payment::where('status', 'rejected')->count(),
                'total_amount' => Payment::where('status', 'approved')->sum('amount'),
            ],
            'portfolios' => [
                'total' => Portfolio::count(),
                'draft' => Portfolio::where('status', 'draft')->count(),
                'published' => Portfolio::where('status', 'published')->count(),
            ],
        ]);
    }

    public function pendingPayments(): JsonResponse
    {
        $payments = Payment::with('user')
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'payments' => PaymentResource::collection($payments),
        ]);
    }

    public function recentUsers(): JsonResponse
    {
        $users = User::with('portfolio')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'users' => UserResource::collection($users),
        ]);
    }
}
