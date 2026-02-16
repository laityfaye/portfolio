<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pricing_models', function (Blueprint $table) {
            $table->string('template', 20)->nullable()->after('slug'); // classic, minimal, elegant, luxe
        });

        $templates = [
            ['name' => 'Portfolio Classic 1 an', 'slug' => 'portfolio_classic_1y', 'template' => 'classic'],
            ['name' => 'Portfolio Minimal 1 an', 'slug' => 'portfolio_minimal_1y', 'template' => 'minimal'],
            ['name' => 'Portfolio Elegant 1 an', 'slug' => 'portfolio_elegant_1y', 'template' => 'elegant'],
            ['name' => 'Portfolio Luxe 1 an', 'slug' => 'portfolio_luxe_1y', 'template' => 'luxe'],
        ];

        foreach ($templates as $i => $row) {
            DB::table('pricing_models')->insert([
                'name' => $row['name'],
                'slug' => $row['slug'],
                'template' => $row['template'],
                'amount' => 2500,
                'currency' => 'FCFA',
                'duration_days' => 365,
                'is_active' => true,
                'sort_order' => $i + 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        DB::table('pricing_models')->whereNotNull('template')->delete();
        Schema::table('pricing_models', function (Blueprint $table) {
            $table->dropColumn('template');
        });
    }
};
