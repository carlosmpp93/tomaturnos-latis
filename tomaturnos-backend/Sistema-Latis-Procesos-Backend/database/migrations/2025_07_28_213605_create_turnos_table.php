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
        Schema::create('turnos', function (Blueprint $table) {
            $table->id();
            $table->string('numero_turno')->unique();
            $table->string('cliente_nombre');
            $table->string('cliente_apellido_paterno');
            $table->string('cliente_apellido_materno');
            $table->foreignId('servicio_id')->constrained('servicios');
            $table->foreignId('ventanilla_id')->nullable()->constrained('ventanillas');
            $table->foreignId('sucursal_id')->constrained('sucursales');
            $table->enum('status', ['en_espera', 'atendiendo', 'finalizado', 'cancelado'])->default('en_espera');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('turnos');
    }
};
