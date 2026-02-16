<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\Portfolio;
use App\Models\PricingModel;
use App\Models\User;
use App\Services\SlugService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

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

        // Create empty portfolio (amount/currency laissés à null : le prix sera déduit
        // automatiquement du modèle de portfolio choisi par le client lors du paiement)
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

    /** Demande de réinitialisation du mot de passe (envoi du lien par email). */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email']);

        $email = $request->email;
        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Si cet email existe, un lien de réinitialisation vous a été envoyé.',
            ], 200);
        }

        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $email],
            ['token' => Hash::make($token), 'created_at' => now()]
        );

        $resetUrl = rtrim(config('app.frontend_url'), '/') . '/p/reset-password?token=' . urlencode($token) . '&email=' . urlencode($email);

        try {
            Mail::raw(
                "Bonjour,\n\nVous avez demandé à réinitialiser votre mot de passe.\n\nCliquez sur le lien suivant (valide 1 heure) :\n{$resetUrl}\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez cet email.",
                function ($message) use ($email) {
                    $message->to($email)->subject('Réinitialisation de votre mot de passe - InnoSoft');
                }
            );
        } catch (\Throwable $e) {
            report($e);
            return response()->json([
                'message' => 'Impossible d\'envoyer l\'email. Réessayez plus tard.',
            ], 500);
        }

        return response()->json([
            'message' => 'Si cet email existe, un lien de réinitialisation vous a été envoyé.',
        ], 200);
    }

    /** Réinitialisation du mot de passe avec le token reçu par email. */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $email = $request->email;
        $token = $request->token;

        $record = DB::table('password_reset_tokens')->where('email', $email)->first();
        if (!$record || !Hash::check($token, $record->token)) {
            return response()->json([
                'message' => 'Lien invalide ou expiré. Demandez un nouveau lien.',
            ], 400);
        }

        $createdAt = $record->created_at ? \Carbon\Carbon::parse($record->created_at) : null;
        if ($createdAt && $createdAt->copy()->addMinutes(60)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $email)->delete();
            return response()->json([
                'message' => 'Ce lien a expiré. Demandez un nouveau lien.',
            ], 400);
        }

        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json(['message' => 'Utilisateur introuvable.'], 404);
        }

        $user->update(['password' => Hash::make($request->password)]);
        DB::table('password_reset_tokens')->where('email', $email)->delete();

        return response()->json([
            'message' => 'Mot de passe mis à jour. Vous pouvez vous connecter.',
        ], 200);
    }
}
