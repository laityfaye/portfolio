<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            // Rendre proof_image nullable pour les paiements PayTech (pas d'upload)
            $table->string('proof_image')->nullable()->change();

            // Colonnes PayTech (documentation: https://doc.intech.sn/doc_paytech.php)
            $table->string('ref_command')->nullable()->unique()->after('user_id');
            $table->string('token')->nullable()->after('ref_command');
            $table->string('payment_method')->nullable()->after('token');
            $table->string('type')->default('manual')->after('status'); // manual | paytech
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->string('proof_image')->nullable(false)->change();
            $table->dropColumn(['ref_command', 'token', 'payment_method', 'type']);
        });
    }
};
