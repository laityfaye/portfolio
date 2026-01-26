<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSkillRequest;
use App\Http\Requests\UpdateSkillRequest;
use App\Http\Resources\SkillResource;
use App\Models\Skill;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $skills = $request->user()->portfolio->skills()
            ->orderBy('category')
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => SkillResource::collection($skills),
        ]);
    }

    public function store(StoreSkillRequest $request): JsonResponse
    {
        $portfolio = $request->user()->portfolio;

        $maxOrder = $portfolio->skills()
            ->where('category', $request->category)
            ->max('sort_order') ?? 0;

        $skill = $portfolio->skills()->create([
            ...$request->validated(),
            'sort_order' => $maxOrder + 1,
        ]);

        return response()->json([
            'data' => new SkillResource($skill),
            'message' => 'Competence ajoutee avec succes',
        ], 201);
    }

    public function show(Request $request, Skill $skill): JsonResponse
    {
        $this->authorize('view', $skill);

        return response()->json([
            'data' => new SkillResource($skill),
        ]);
    }

    public function update(UpdateSkillRequest $request, Skill $skill): JsonResponse
    {
        $this->authorize('update', $skill);

        $skill->update($request->validated());

        return response()->json([
            'data' => new SkillResource($skill->fresh()),
            'message' => 'Competence mise a jour avec succes',
        ]);
    }

    public function destroy(Request $request, Skill $skill): JsonResponse
    {
        $this->authorize('delete', $skill);

        $skill->delete();

        return response()->json([
            'message' => 'Competence supprimee avec succes',
        ]);
    }

    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'skills' => 'required|array',
            'skills.*.id' => 'required|integer|exists:skills,id',
            'skills.*.sort_order' => 'required|integer|min:0',
        ]);

        $portfolio = $request->user()->portfolio;

        foreach ($request->skills as $item) {
            $portfolio->skills()->where('id', $item['id'])->update([
                'sort_order' => $item['sort_order'],
            ]);
        }

        return response()->json([
            'message' => 'Ordre des competences mis a jour',
        ]);
    }
}
