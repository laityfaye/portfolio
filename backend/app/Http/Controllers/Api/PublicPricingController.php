<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PricingModel;
use Illuminate\Http\JsonResponse;

class PublicPricingController extends Controller
{
    /**
     * Liste des modèles de tarification actifs (pour affichage public).
     */
    public function index(): JsonResponse
    {
        $models = PricingModel::where('is_active', true)
            ->orderByRaw("CASE WHEN template IS NULL THEN 0 ELSE 1 END")
            ->orderBy('sort_order')
            ->get(['id', 'name', 'slug', 'template', 'amount', 'currency', 'duration_days']);

        return response()->json([
            'data' => $models,
        ]);
    }
}
