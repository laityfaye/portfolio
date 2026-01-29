<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PortfolioResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'display_name' => $this->display_name,
            'job_title' => $this->job_title,
            'hero_description' => $this->hero_description,
            'profile_image' => $this->profile_image ? Storage::disk('public')->url($this->profile_image) : null,
            'hero_stats' => $this->hero_stats,
            'about_paragraph_1' => $this->about_paragraph_1,
            'about_paragraph_2' => $this->about_paragraph_2,
            'about_highlights' => $this->about_highlights,
            'about_stats' => $this->about_stats,
            'cv_file' => $this->cv_file ? Storage::disk('public')->url($this->cv_file) : null,
            'contact_info' => $this->contact_info,
            'social_links' => $this->social_links,
            'brand_name' => $this->brand_name,
            'theme_color' => $this->theme_color,
            'theme_mode' => $this->theme_mode,
            'template' => $this->template ?? 'classic',
            'status' => $this->status,
            'published_at' => $this->published_at,
            'skills' => SkillResource::collection($this->whenLoaded('skills')),
            'projects' => ProjectResource::collection($this->whenLoaded('projects')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
