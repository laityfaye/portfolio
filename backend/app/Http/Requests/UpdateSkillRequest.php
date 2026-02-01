<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSkillRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:100',
            'icon' => 'nullable|sometimes|string|max:50',
            'level' => 'sometimes|integer|min:0|max:100',
            'category' => 'sometimes|string|max:50|regex:/^[a-z][a-z0-9_]*$/',
        ];
    }

    public function messages(): array
    {
        return [
            'category.regex' => 'La categorie doit etre en minuscules sans espaces (ex: frontend, backend, reseau)',
        ];
    }
}
