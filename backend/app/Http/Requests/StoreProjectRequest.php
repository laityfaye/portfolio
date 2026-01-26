<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:2000',
            'category' => 'required|in:web,mobile,fullstack,other',
            'tags' => 'nullable|array|max:10',
            'tags.*' => 'string|max:50',
            'github_url' => 'nullable|url|max:255',
            'demo_url' => 'nullable|url|max:255',
            'featured' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Le titre du projet est requis',
            'description.required' => 'La description du projet est requise',
            'category.required' => 'La categorie est requise',
            'category.in' => 'La categorie doit etre web, mobile, fullstack ou other',
        ];
    }
}
