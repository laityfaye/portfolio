<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Pour PostgreSQL, on doit d'abord supprimer l'enum et créer une colonne string
        // Puis ajouter une contrainte CHECK pour valider le format
        
        // Étape 1: Créer une nouvelle colonne temporaire de type string
        Schema::table('skills', function (Blueprint $table) {
            $table->string('category_new', 50)->nullable()->after('level');
        });
        
        // Étape 2: Copier les données de l'ancienne colonne vers la nouvelle
        DB::statement('UPDATE skills SET category_new = category::text');
        
        // Étape 3: Supprimer l'ancienne colonne enum
        Schema::table('skills', function (Blueprint $table) {
            $table->dropColumn('category');
        });
        
        // Étape 4: Renommer la nouvelle colonne en utilisant DB::statement pour PostgreSQL
        DB::statement('ALTER TABLE skills RENAME COLUMN category_new TO category');
        
        // Étape 5: Rendre la colonne non nullable
        DB::statement('ALTER TABLE skills ALTER COLUMN category SET NOT NULL');
        
        // Étape 6: Ajouter une contrainte CHECK pour valider le format (minuscules, lettres, chiffres, underscore)
        DB::statement("ALTER TABLE skills ADD CONSTRAINT skills_category_check CHECK (category ~ '^[a-z][a-z0-9_]*$')");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Supprimer la contrainte CHECK
        DB::statement('ALTER TABLE skills DROP CONSTRAINT IF EXISTS skills_category_check');
        
        // Recréer l'enum avec les valeurs originales
        Schema::table('skills', function (Blueprint $table) {
            $table->dropColumn('category');
        });
        
        Schema::table('skills', function (Blueprint $table) {
            $table->enum('category', ['frontend', 'backend', 'database_tools'])->after('level');
        });
    }
};
