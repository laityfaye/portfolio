<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminUserController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = User::with('portfolio');

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(15);

        return UserResource::collection($users);
    }

    public function show(User $user): UserResource
    {
        $user->load(['portfolio', 'payments']);

        return new UserResource($user);
    }

    public function activate(User $user): JsonResponse
    {
        $user->update(['status' => 'active']);

        return response()->json([
            'message' => 'Compte utilisateur active avec succes',
            'user' => new UserResource($user),
        ]);
    }

    public function suspend(User $user): JsonResponse
    {
        $user->update(['status' => 'suspended']);

        return response()->json([
            'message' => 'Compte utilisateur suspendu',
            'user' => new UserResource($user),
        ]);
    }

    public function destroy(User $user): JsonResponse
    {
        // Delete related data
        $user->portfolio?->skills()->delete();
        $user->portfolio?->projects()->delete();
        $user->portfolio?->delete();
        $user->payments()->delete();
        $user->delete();

        return response()->json([
            'message' => 'Utilisateur supprime avec succes',
        ]);
    }

    public function stats(): JsonResponse
    {
        return response()->json([
            'total' => User::count(),
            'active' => User::where('status', 'active')->count(),
            'pending' => User::where('status', 'pending')->count(),
            'suspended' => User::where('status', 'suspended')->count(),
        ]);
    }
}
