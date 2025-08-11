<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Sucursal;

class SucursalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Sucursal::create(['unidad' => 'Sucursal Centro', 'codigo_depto' => 'SC01']);
        Sucursal::create(['unidad' => 'Sucursal Norte', 'codigo_depto' => 'SN02']);
    }
}
