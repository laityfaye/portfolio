<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePortfolioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'display_name' => 'sometimes|string|max:255',
            'job_title' => 'sometimes|string|max:255',
            'hero_description' => 'sometimes|nullable|string|max:1000',
            'hero_stats' => 'sometimes|array|max:5',
            'hero_stats.*.value' => 'required_with:hero_stats|integer|min:0',
            'hero_stats.*.suffix' => 'required_with:hero_stats|string|max:10',
            'hero_stats.*.label' => 'required_with:hero_stats|string|max:50',
            'about_paragraph_1' => 'sometimes|nullable|string|max:2000',
            'about_paragraph_2' => 'sometimes|nullable|string|max:2000',
            'about_highlights' => 'sometimes|array|max:5',
            'about_highlights.*.icon' => 'required_with:about_highlights|string|max:50',
            'about_highlights.*.title' => 'required_with:about_highlights|string|max:100',
            'about_highlights.*.description' => 'required_with:about_highlights|string|max:500',
            'about_stats' => 'sometimes|array',
            'about_stats.commits' => 'sometimes|integer|min:0',
            'about_stats.technologies' => 'sometimes|integer|min:0',
            'contact_info' => 'sometimes|array',
            'contact_info.email' => 'sometimes|nullable|email|max:255',
            'contact_info.phone' => 'sometimes|nullable|string|max:30',
            'contact_info.location' => 'sometimes|nullable|string|max:255',
            'social_links' => 'sometimes|array',
            'social_links.github' => 'sometimes|nullable|url|max:255',
            'social_links.linkedin' => 'sometimes|nullable|url|max:255',
            'social_links.twitter' => 'sometimes|nullable|url|max:255',
            'brand_name' => 'sometimes|string|max:50',
        ];
    }
}
