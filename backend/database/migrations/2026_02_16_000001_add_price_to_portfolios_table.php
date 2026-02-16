<?php

use App\Models\PricingModel;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('portfolios', function (Blueprint $table) {
            $table->decimal('amount', 12, 2)->nullable()->after('expires_at');
            $table->string('currency', 10)->nullable()->after('amount');
        });

        $default = PricingModel::getBySlug('portfolio_1y');
        $amount = $default ? (float) $default->amount : 2500;
        $currency = $default?->currency ?? 'FCFA';

        \DB::table('portfolios')->whereNull('amount')->update([
            'amount' => $amount,
            'currency' => $currency,
        ]);
    }

    public function down(): void
    {
        Schema::table('portfolios', function (Blueprint $table) {
            $table->dropColumn(['amount', 'currency']);
        });
    }
};
