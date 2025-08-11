<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProcesoController;
use App\Http\Controllers\Api\TurnoController;
use App\Http\Controllers\Api\PublicDataController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/turnos', [TurnoController::class, 'store'])->name('turnos.store');
Route::get('/servicios', [PublicDataController::class, 'servicios'])->name('servicios.index');
Route::get('/sucursales', [PublicDataController::class, 'sucursales'])->name('sucursales.index');

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Rutas para el monitor de ventanilla
    Route::get('/monitor/turno', [TurnoController::class, 'monitor'])->name('monitor.turno');
    Route::post('/turnos/{turno}/aceptar', [TurnoController::class, 'aceptar'])->name('turnos.aceptar');
    Route::post('/turnos/{turno}/finalizar', [TurnoController::class, 'finalizar'])->name('turnos.finalizar');

    // Add your other protected routes here
    Route::apiResource('procesos', ProcesoController::class);
});