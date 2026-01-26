<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portfolios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Hero section
            $table->string('display_name');
            $table->string('job_title')->default('Ingenieur Logiciel');
            $table->text('hero_description')->nullable();
            $table->string('profile_image')->nullable();
            $table->json('hero_stats')->nullable();

            // About section
            $table->text('about_paragraph_1')->nullable();
            $table->text('about_paragraph_2')->nullable();
            $table->json('about_highlights')->nullable();
            $table->json('about_stats')->nullable();
            $table->string('cv_file')->nullable();

            // Contact section
            $table->json('contact_info')->nullable();
            $table->json('social_links')->nullable();

            // Branding
            $table->string('brand_name')->default('<Portfolio />');

            // Theme settings
            $table->enum('theme_color', [
                'cyan', 'purple', 'green', 'orange', 'pink', 'blue',
                'red', 'yellow', 'indigo', 'teal', 'amber', 'rose', 'emerald'
            ])->default('cyan');
            $table->enum('theme_mode', ['light', 'dark'])->default('dark');

            // Portfolio state
            $table->enum('status', ['draft', 'pending', 'published'])->default('draft');
            $table->timestamp('published_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolios');
    }
};
