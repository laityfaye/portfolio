<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PortfolioResource;
use App\Models\Portfolio;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminPortfolioController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Portfolio::with('user');

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('display_name', 'like', "%{$search}%")
                    ->orWhere('job_title', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('email', 'like', "%{$search}%");
                    });
            });
        }

        $portfolios = $query->orderBy('created_at', 'desc')->paginate(15);

        return PortfolioResource::collection($portfolios);
    }

    public function show(Portfolio $portfolio): PortfolioResource
    {
        $portfolio->load(['user', 'skills', 'projects']);

        return new PortfolioResource($portfolio);
    }

    public function publish(Portfolio $portfolio): JsonResponse
    {
        // Check if user is active
        if ($portfolio->user->status !== 'active') {
            return response()->json([
                'message' => 'Le compte utilisateur doit etre actif pour publier le portfolio',
            ], 400);
        }

        $portfolio->update([
            'status' => 'published',
            'published_at' => now(),
        ]);

        return response()->json([
            'message' => 'Portfolio publie avec succes',
            'portfolio' => new PortfolioResource($portfolio),
        ]);
    }

    public function unpublish(Portfolio $portfolio): JsonResponse
    {
        $portfolio->update([
            'status' => 'draft',
            'published_at' => null,
        ]);

        return response()->json([
            'message' => 'Portfolio depublie',
            'portfolio' => new PortfolioResource($portfolio),
        ]);
    }

    public function destroy(Portfolio $portfolio): JsonResponse
    {
        $portfolio->skills()->delete();
        $portfolio->projects()->delete();
        $portfolio->delete();

        return response()->json([
            'message' => 'Portfolio supprime avec succes',
        ]);
    }

    public function stats(): JsonResponse
    {
        return response()->json([
            'total' => Portfolio::count(),
            'draft' => Portfolio::where('status', 'draft')->count(),
            'pending' => Portfolio::where('status', 'pending')->count(),
            'published' => Portfolio::where('status', 'published')->count(),
        ]);
    }
}
