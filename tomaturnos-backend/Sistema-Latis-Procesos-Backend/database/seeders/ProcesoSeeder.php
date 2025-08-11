<?php

namespace Database\Seeders;

use App\Models\Proceso;
use Illuminate\Database\Seeder;

class ProcesoSeeder extends Seeder
{
    public function run(): void
    {
        $procesos = [
            [
                'clave_proceso' => 'PRO-001',
                'nombre' => 'Proceso de Facturación',
                'descripcion' => 'Proceso para generar facturas mensuales de clientes',
                'tipo' => 'gestion-documental',
            ],
            [
                'clave_proceso' => 'PRO-002',
                'nombre' => 'Proceso de Inventario',
                'descripcion' => 'Control y actualización del inventario de productos',
                'tipo' => 'normal',
            ],
            [
                'clave_proceso' => 'PRO-003',
                'nombre' => 'Proceso de Auditoría',
                'descripcion' => 'Revisión manual de documentos y transacciones',
                'tipo' => 'proyecto',
            ],
        ];

        foreach ($procesos as $proceso) {
            Proceso::create($proceso);
        }
    }
}