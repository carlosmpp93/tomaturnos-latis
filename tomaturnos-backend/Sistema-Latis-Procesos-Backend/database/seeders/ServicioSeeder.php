<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Servicio;

class ServicioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Servicio::create(['nombre' => 'Solicitud de crédito', 'descripcion' => 'Proceso para solicitar un nuevo crédito.']);
        Servicio::create(['nombre' => 'Reembolsos', 'descripcion' => 'Gestión de solicitudes de reembolso.']);
        Servicio::create(['nombre' => 'Afiliación o actualiación de Centros de Trabajo', 'descripcion' => 'Proceso de afiliación o actualización de datos de centros de trabajo.']);
        Servicio::create(['nombre' => 'Aclaraciones de Crédito', 'descripcion' => 'Aclaraciones sobre el estado o condiciones de un crédito.']);
        Servicio::create(['nombre' => 'Reestructuración de adeudo', 'descripcion' => 'Proceso para reestructurar deudas existentes.']);
        Servicio::create(['nombre' => 'Aclaraciones de Pagos de Cédula', 'descripcion' => 'Aclaraciones sobre pagos relacionados con cédulas.']);
        Servicio::create(['nombre' => 'Servicios Electrónicos FONACOT', 'descripcion' => 'Asistencia con los servicios electrónicos de FONACOT.']);
        Servicio::create(['nombre' => 'Alta y Activación de la App FONACOT', 'descripcion' => 'Ayuda con el registro y activación de la aplicación FONACOT.']);
    }
}
