<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Str;

class SlugService
{
    public function generate(string $firstName, string $lastName): string
    {
        $baseSlug = Str::slug($firstName . '-' . $lastName);
        $slug = $baseSlug;
        $counter = 1;

        while (User::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}
