<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $projects = $request->user()->portfolio->projects()->orderBy('sort_order')->get();

        return response()->json([
            'data' => ProjectResource::collection($projects),
        ]);
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        $portfolio = $request->user()->portfolio;

        $maxOrder = $portfolio->projects()->max('sort_order') ?? 0;

        $project = $portfolio->projects()->create([
            ...$request->validated(),
            'sort_order' => $maxOrder + 1,
        ]);

        return response()->json([
            'data' => new ProjectResource($project),
            'message' => 'Projet cree avec succes',
        ], 201);
    }

    public function show(Request $request, Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        return response()->json([
            'data' => new ProjectResource($project),
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);

        $project->update($request->validated());

        return response()->json([
            'data' => new ProjectResource($project->fresh()),
            'message' => 'Projet mis a jour avec succes',
        ]);
    }

    public function destroy(Request $request, Project $project): JsonResponse
    {
        $this->authorize('delete', $project);

        // Delete image if exists
        if ($project->image) {
            Storage::disk('public')->delete($project->image);
        }

        $project->delete();

        return response()->json([
            'message' => 'Projet supprime avec succes',
        ]);
    }

    public function uploadImage(Request $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);

        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        // Delete old image if exists
        if ($project->image) {
            Storage::disk('public')->delete($project->image);
        }

        $path = $request->file('image')->store('projects/' . $project->portfolio_id, 'public');

        $project->update(['image' => $path]);

        return response()->json([
            'data' => new ProjectResource($project->fresh()),
            'message' => 'Image du projet mise a jour',
            'image_url' => Storage::disk('public')->url($path),
        ]);
    }

    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'projects' => 'required|array',
            'projects.*.id' => 'required|integer|exists:projects,id',
            'projects.*.sort_order' => 'required|integer|min:0',
        ]);

        $portfolio = $request->user()->portfolio;

        foreach ($request->projects as $item) {
            $portfolio->projects()->where('id', $item['id'])->update([
                'sort_order' => $item['sort_order'],
            ]);
        }

        return response()->json([
            'message' => 'Ordre des projets mis a jour',
        ]);
    }
}
