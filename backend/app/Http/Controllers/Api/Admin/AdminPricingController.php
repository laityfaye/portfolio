<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\PricingModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminPricingController extends Controller
{
    public function index(): JsonResponse
    {
        $models = PricingModel::orderBy('sort_order')->orderBy('id')->get();

        return response()->json([
            'data' => $models,
        ]);
    }

    public function update(Request $request, PricingModel $pricingModel): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'amount' => 'sometimes|numeric|min:0',
            'currency' => 'sometimes|string|max:10',
            'duration_days' => 'sometimes|integer|min:1',
            'is_active' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer|min:0',
        ]);

        $pricingModel->update($validated);

        return response()->json([
            'message' => 'Tarif mis à jour.',
            'data' => $pricingModel->fresh(),
        ]);
    }
}
