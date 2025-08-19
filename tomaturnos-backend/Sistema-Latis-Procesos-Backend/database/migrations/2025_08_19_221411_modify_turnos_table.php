<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('turnos', function (Blueprint $table) {
            $table->renameColumn('cliente_nombre', 'cliente_primer_nombre');
            $table->string('cliente_segundo_nombre')->nullable()->after('cliente_primer_nombre');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('turnos', function (Blueprint $table) {
            $table->renameColumn('cliente_primer_nombre', 'cliente_nombre');
            $table->dropColumn('cliente_segundo_nombre');
        });
    }
};