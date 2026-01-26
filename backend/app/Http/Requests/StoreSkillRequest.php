<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSkillRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:100',
            'icon' => 'required|string|max:50',
            'level' => 'required|integer|min:0|max:100',
            'category' => 'required|string|max:50|regex:/^[a-z][a-z0-9_]*$/',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom de la competence est requis',
            'icon.required' => 'L\'icone est requise',
            'level.required' => 'Le niveau est requis',
            'level.min' => 'Le niveau doit etre entre 0 et 100',
            'level.max' => 'Le niveau doit etre entre 0 et 100',
            'category.required' => 'La categorie est requise',
            'category.regex' => 'La categorie doit etre en minuscules sans espaces (ex: frontend, backend, reseau)',
        ];
    }
}
