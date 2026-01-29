<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdatePortfolioRequest;
use App\Http\Resources\PortfolioResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PortfolioController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $portfolio = $request->user()->portfolio()->with(['skills', 'projects'])->firstOrFail();

        return response()->json([
            'data' => new PortfolioResource($portfolio),
        ]);
    }

    public function update(UpdatePortfolioRequest $request): JsonResponse
    {
        $portfolio = $request->user()->portfolio;

        $portfolio->update($request->validated());

        return response()->json([
            'data' => new PortfolioResource($portfolio->fresh(['skills', 'projects'])),
            'message' => 'Portfolio mis a jour avec succes',
        ]);
    }

    public function uploadProfileImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $portfolio = $request->user()->portfolio;

        // Delete old image if exists
        if ($portfolio->profile_image) {
            Storage::disk('public')->delete($portfolio->profile_image);
        }

        $path = $request->file('image')->store('profiles/' . $portfolio->id, 'public');

        $portfolio->update(['profile_image' => $path]);

        return response()->json([
            'data' => new PortfolioResource($portfolio->fresh()),
            'message' => 'Photo de profil mise a jour',
            'image_url' => Storage::disk('public')->url($path),
        ]);
    }

    public function uploadCv(Request $request): JsonResponse
    {
        $request->validate([
            'cv' => 'required|mimes:pdf|max:5120',
        ]);

        $portfolio = $request->user()->portfolio;

        // Delete old CV if exists
        if ($portfolio->cv_file) {
            Storage::disk('public')->delete($portfolio->cv_file);
        }

        $path = $request->file('cv')->store('cvs/' . $portfolio->id, 'public');

        $portfolio->update(['cv_file' => $path]);

        return response()->json([
            'data' => new PortfolioResource($portfolio->fresh()),
            'message' => 'CV mis a jour',
            'cv_url' => Storage::disk('public')->url($path),
        ]);
    }

    public function updateTheme(Request $request): JsonResponse
    {
        $request->validate([
            'theme_color' => 'required|in:cyan,purple,green,orange,pink,blue,red,yellow,indigo,teal,amber,rose,emerald',
            'theme_mode' => 'required|in:light,dark',
            'template' => 'sometimes|in:classic,minimal',
        ]);

        $portfolio = $request->user()->portfolio;

        $data = [
            'theme_color' => $request->theme_color,
            'theme_mode' => $request->theme_mode,
        ];
        if ($request->has('template')) {
            $data['template'] = $request->template;
        }
        $portfolio->update($data);

        return response()->json([
            'data' => new PortfolioResource($portfolio->fresh()),
            'message' => 'Theme mis a jour',
        ]);
    }

    public function publish(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isActive()) {
            return response()->json([
                'message' => 'Votre compte doit etre actif pour publier votre portfolio',
            ], 403);
        }

        $portfolio = $user->portfolio;
        $portfolio->publish();

        return response()->json([
            'data' => new PortfolioResource($portfolio->fresh(['skills', 'projects'])),
            'message' => 'Portfolio publie avec succes',
            'public_url' => config('app.frontend_url') . '/p/' . $user->slug,
        ]);
    }
}
