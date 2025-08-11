<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sucursal extends Model
{
    use HasFactory;

    protected $table = 'sucursales'; // Especifica el nombre de la tabla

    protected $fillable = ['unidad', 'codigo_depto'];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function ventanillas()
    {
        return $this->hasMany(Ventanilla::class);
    }
}
