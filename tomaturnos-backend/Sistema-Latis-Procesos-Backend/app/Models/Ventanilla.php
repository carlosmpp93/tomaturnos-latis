<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ventanilla extends Model
{
    use HasFactory;

    protected $fillable = ['numero', 'sucursal_id'];

    public function sucursal()
    {
        return $this->belongsTo(Sucursal::class);
    }

    public function servicios()
    {
        return $this->belongsToMany(Servicio::class, 'servicio_ventanilla');
    }

    public function turnos()
    {
        return $this->hasMany(Turno::class);
    }
}
