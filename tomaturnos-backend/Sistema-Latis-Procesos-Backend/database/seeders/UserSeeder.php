<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Sucursal;
use App\Models\Ventanilla;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Obtener IDs de sucursales y ventanillas (asumiendo que ya fueron creadas por sus seeders)
        $sucursalCentro = Sucursal::where('codigo_depto', 'SC01')->first();
        $sucursalNorte = Sucursal::where('codigo_depto', 'SN02')->first();

        $ventanillaCentro1 = Ventanilla::where('numero', 'V1')->where('sucursal_id', $sucursalCentro->id)->first();
        $ventanillaCentro2 = Ventanilla::where('numero', 'V2')->where('sucursal_id', $sucursalCentro->id)->first();
        $ventanillaNorte1 = Ventanilla::where('numero', 'V1')->where('sucursal_id', $sucursalNorte->id)->first();

        // Create admin user
        User::create([
            'name' => 'Admin User',
            'username' => 'admin',
            'email' => 'admin@latis.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'nombre' => 'Administrador',
            'apellido_paterno' => 'General',
            'apellido_materno' => 'Sistema',
        ]);

        // Create regular user
        User::create([
            'name' => 'Regular User',
            'username' => 'user',
            'email' => 'user@latis.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'nombre' => 'Usuario',
            'apellido_paterno' => 'Común',
            'apellido_materno' => 'App',
        ]);

        // Agente de Ventanilla 1 (Sucursal Centro, Ventanilla V1)
        if ($sucursalCentro && $ventanillaCentro1) {
            User::create([
                'name' => 'Agente Centro V1',
                'username' => 'agente1',
                'email' => 'agente1@latis.com',
                'password' => Hash::make('password'),
                'role' => 'agente',
                'nombre' => 'Agente',
                'apellido_paterno' => 'Uno',
                'apellido_materno' => 'Centro',
                'sucursal_id' => $sucursalCentro->id,
                'ventanilla_id' => $ventanillaCentro1->id,
            ]);
        }

        // Agente de Ventanilla 2 (Sucursal Centro, Ventanilla V2)
        if ($sucursalCentro && $ventanillaCentro2) {
            User::create([
                'name' => 'Agente Centro V2',
                'username' => 'agente2',
                'email' => 'agente2@latis.com',
                'password' => Hash::make('password'),
                'role' => 'agente',
                'nombre' => 'Agente',
                'apellido_paterno' => 'Dos',
                'apellido_materno' => 'Centro',
                'sucursal_id' => $sucursalCentro->id,
                'ventanilla_id' => $ventanillaCentro2->id,
            ]);
        }

        // Agente de Ventanilla 3 (Sucursal Norte, Ventanilla V1)
        if ($sucursalNorte && $ventanillaNorte1) {
            User::create([
                'name' => 'Agente Norte V1',
                'username' => 'agente3',
                'email' => 'agente3@latis.com',
                'password' => Hash::make('password'),
                'role' => 'agente',
                'nombre' => 'Agente',
                'apellido_paterno' => 'Tres',
                'apellido_materno' => 'Norte',
                'sucursal_id' => $sucursalNorte->id,
                'ventanilla_id' => $ventanillaNorte1->id,
            ]);
        }
    }
}