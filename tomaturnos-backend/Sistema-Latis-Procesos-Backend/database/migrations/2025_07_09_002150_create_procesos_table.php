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
        Schema::create('procesos', function (Blueprint $table) {
            $table->id();
            $table->string('clave_proceso', 50)->unique()->comment('Clave única del proceso');
            $table->string('nombre', 255)->comment('Nombre del proceso');
            $table->text('descripcion')->nullable()->comment('Descripción detallada del proceso');
            $table->enum('tipo', ['gestion-documental', 'normal', 'proyecto'])
                  ->default('gestion-documental')
                  ->comment('Tipo de proceso');
            $table->timestamps();
            
            // Add indexes for better performance
            $table->index('clave_proceso');
            $table->index('tipo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('procesos');
    }
};