<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Ventanilla;
use App\Models\Servicio;

class VentanillaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Sucursal 1 (Centro)
        $ventanilla1 = Ventanilla::create(['numero' => 'V1', 'sucursal_id' => 1]);
        $ventanilla2 = Ventanilla::create(['numero' => 'V2', 'sucursal_id' => 1]);
        $ventanilla3 = Ventanilla::create(['numero' => 'V3', 'sucursal_id' => 1]);

        // Sucursal 2 (Norte)
        $ventanilla4 = Ventanilla::create(['numero' => 'V1', 'sucursal_id' => 2]);

        // Asignar servicios a ventanillas
        $servicioCredito = Servicio::where('nombre', 'Solicitud de crédito')->first();
        $servicioReembolsos = Servicio::where('nombre', 'Reembolsos')->first();
        $servicioAfiliacion = Servicio::where('nombre', 'Afiliación o actualiación de Centros de Trabajo')->first();
        $servicioAclaracionesCredito = Servicio::where('nombre', 'Aclaraciones de Crédito')->first();

        // Ventanilla 1 (Centro) atiende Solicitud de crédito
        if ($servicioCredito) {
            $ventanilla1->servicios()->attach($servicioCredito->id);
        }

        // Ventanilla 2 (Centro) atiende Reembolsos y Aclaraciones de Crédito
        if ($servicioReembolsos) {
            $ventanilla2->servicios()->attach($servicioReembolsos->id);
        }
        if ($servicioAclaracionesCredito) {
            $ventanilla2->servicios()->attach($servicioAclaracionesCredito->id);
        }

        // Ventanilla 3 (Centro) atiende Solicitud de crédito y Afiliación
        if ($servicioCredito) {
            $ventanilla3->servicios()->attach($servicioCredito->id);
        }
        if ($servicioAfiliacion) {
            $ventanilla3->servicios()->attach($servicioAfiliacion->id);
        }

        // Ventanilla 1 (Norte) atiende Solicitud de crédito y Reembolsos
        if ($servicioCredito) {
            $ventanilla4->servicios()->attach($servicioCredito->id);
        }
        if ($servicioReembolsos) {
            $ventanilla4->servicios()->attach($servicioReembolsos->id);
        }
    }
}
