<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PublicPortfolioResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'user' => [
                'first_name' => $this->user->first_name,
                'last_name' => $this->user->last_name,
                'slug' => $this->user->slug,
            ],
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
            'skills' => SkillResource::collection($this->skills),
            'projects' => ProjectResource::collection($this->projects),
        ];
    }
}
