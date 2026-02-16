<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pricing_models', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // ex: "Portfolio 1 an"
            $table->string('slug')->unique(); // ex: portfolio_1y
            $table->decimal('amount', 12, 2);
            $table->string('currency', 10)->default('FCFA');
            $table->unsignedInteger('duration_days')->default(365); // durée en jours
            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        DB::table('pricing_models')->insert([
            'name' => 'Portfolio 1 an',
            'slug' => 'portfolio_1y',
            'amount' => 2500,
            'currency' => 'FCFA',
            'duration_days' => 365,
            'is_active' => true,
            'sort_order' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('pricing_models');
    }
};
