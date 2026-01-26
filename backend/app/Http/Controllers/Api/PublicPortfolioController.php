<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PublicPortfolioResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class PublicPortfolioController extends Controller
{
    public function show(string $slug): JsonResponse
    {
        $user = User::where('slug', $slug)
            ->where('status', 'active')
            ->with(['portfolio' => function ($query) {
                $query->where('status', 'published')
                    ->with(['skills' => function ($q) {
                        $q->orderBy('category')->orderBy('sort_order');
                    }, 'projects' => function ($q) {
                        $q->orderBy('sort_order');
                    }]);
            }])
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'Portfolio non trouve',
            ], 404);
        }

        if (!$user->portfolio || $user->portfolio->status !== 'published') {
            return response()->json([
                'message' => 'Ce portfolio n\'est pas encore publie',
            ], 404);
        }

        return response()->json([
            'data' => new PublicPortfolioResource($user->portfolio),
        ]);
    }
}
