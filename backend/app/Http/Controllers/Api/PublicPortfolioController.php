<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PublicPortfolioResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

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

    public function contact(Request $request, string $slug): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string|max:10000',
        ], [
            'name.required' => 'Le nom est obligatoire.',
            'email.required' => 'L\'email est obligatoire.',
            'email.email' => 'L\'email doit être valide.',
            'message.required' => 'Le message est obligatoire.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Données invalides.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::where('slug', $slug)
            ->where('status', 'active')
            ->with('portfolio')
            ->first();

        if (!$user || !$user->portfolio || $user->portfolio->status !== 'published') {
            return response()->json(['message' => 'Portfolio non trouvé.'], 404);
        }

        $contactInfo = is_array($user->portfolio->contact_info)
            ? $user->portfolio->contact_info
            : (json_decode($user->portfolio->contact_info, true) ?: []);
        $toEmail = $contactInfo['email'] ?? $user->email;

        if (empty($toEmail)) {
            return response()->json([
                'message' => 'Aucune adresse email configurée pour ce portfolio.',
            ], 503);
        }

        $data = $validator->validated();
        $displayName = $user->portfolio->display_name ?? $user->first_name . ' ' . $user->last_name;

        try {
            Mail::raw(
                "Message envoyé depuis le portfolio « {$displayName} ».\n\n"
                . "---\nNom : {$data['name']}\nEmail : {$data['email']}\n"
                . ($data['subject'] ? "Sujet : {$data['subject']}\n" : '')
                . "---\n\n{$data['message']}",
                function ($message) use ($toEmail, $data, $displayName) {
                    $message->to($toEmail)
                        ->replyTo($data['email'], $data['name'])
                        ->subject($data['subject'] ?? 'Message depuis votre portfolio');
                }
            );
        } catch (\Throwable $e) {
            report($e);
            return response()->json([
                'message' => 'Impossible d\'envoyer le message. Réessayez plus tard.',
            ], 500);
        }

        return response()->json([
            'message' => 'Votre message a bien été envoyé.',
        ], 200);
    }
}
