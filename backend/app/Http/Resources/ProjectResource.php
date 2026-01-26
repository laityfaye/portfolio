<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'image' => $this->image ? Storage::disk('public')->url($this->image) : null,
            'category' => $this->category,
            'tags' => $this->tags ?? [],
            'github_url' => $this->github_url,
            'demo_url' => $this->demo_url,
            'featured' => $this->featured,
            'sort_order' => $this->sort_order,
        ];
    }
}
