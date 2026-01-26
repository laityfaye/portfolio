<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\Portfolio;
use App\Models\User;
use App\Services\SlugService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function __construct(
        private SlugService $slugService
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $slug = $this->slugService->generate(
            $request->first_name,
            $request->last_name
        );

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'slug' => $slug,
            'status' => 'pending',
        ]);

        // Create empty portfolio
        Portfolio::create([
            'user_id' => $user->id,
            'display_name' => $request->first_name . ' ' . $request->last_name,
            'hero_stats' => [
                ['value' => 1, 'suffix' => '+', 'label' => "Annees d'experience"],
                ['value' => 10, 'suffix' => '+', 'label' => 'Projets realises'],
                ['value' => 100, 'suffix' => '%', 'label' => 'Satisfaction client'],
            ],
            'about_highlights' => [
                ['icon' => 'FaUser', 'title' => 'Qui suis-je ?', 'description' => 'Developpeur passionne avec une expertise en developpement web.'],
                ['icon' => 'FaBriefcase', 'title' => 'Experience', 'description' => 'Experience dans la creation d\'applications web modernes.'],
                ['icon' => 'FaGraduationCap', 'title' => 'Formation', 'description' => 'Formation en informatique et developpement logiciel.'],
            ],
            'about_stats' => ['commits' => 50, 'technologies' => 10],
            'contact_info' => [
                'email' => $request->email,
                'phone' => $request->phone ?? '',
                'location' => '',
            ],
            'social_links' => [
                'github' => '',
                'linkedin' => '',
                'twitter' => '',
            ],
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user->load('portfolio')),
            'token' => $token,
            'message' => 'Inscription reussie. Veuillez telecharger votre preuve de paiement.',
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Identifiants invalides'
            ], 401);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user->load('portfolio')),
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Deconnexion reussie'
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => new UserResource($request->user()->load('portfolio', 'payments')),
        ]);
    }
}
