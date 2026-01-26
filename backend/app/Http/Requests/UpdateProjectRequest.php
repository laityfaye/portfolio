<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|max:2000',
            'category' => 'sometimes|in:web,mobile,fullstack,other',
            'tags' => 'nullable|array|max:10',
            'tags.*' => 'string|max:50',
            'github_url' => 'nullable|url|max:255',
            'demo_url' => 'nullable|url|max:255',
            'featured' => 'boolean',
        ];
    }
}
