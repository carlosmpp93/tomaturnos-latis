<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Turno extends Model
{
    use HasFactory;

    protected $fillable = [
        'numero_turno',
        'cliente_nombre',
        'cliente_apellido_paterno',
        'cliente_apellido_materno',
        'servicio_id',
        'ventanilla_id',
        'sucursal_id',
        'status',
    ];

    public function servicio()
    {
        return $this->belongsTo(Servicio::class);
    }

    public function ventanilla()
    {
        return $this->belongsTo(Ventanilla::class);
    }

    public function sucursal()
    {
        return $this->belongsTo(Sucursal::class);
    }
}