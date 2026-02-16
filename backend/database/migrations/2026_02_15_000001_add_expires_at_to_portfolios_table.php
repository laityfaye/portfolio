<?php

use App\Models\Portfolio;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Durée de vie des portfolios : 1 an. Au-delà, le client doit repayer
     * pour remettre son portfolio en ligne.
     */
    public function up(): void
    {
        Schema::table('portfolios', function (Blueprint $table) {
            $table->timestamp('expires_at')->nullable()->after('published_at');
        });

        // Portfolios déjà publiés : 1 an à partir de published_at (ou maintenant)
        Portfolio::where('status', 'published')
            ->whereNull('expires_at')
            ->each(function (Portfolio $p) {
                $base = $p->published_at ?? now();
                $p->update(['expires_at' => $base->copy()->addYear()]);
            });
    }

    public function down(): void
    {
        Schema::table('portfolios', function (Blueprint $table) {
            $table->dropColumn('expires_at');
        });
    }
};
