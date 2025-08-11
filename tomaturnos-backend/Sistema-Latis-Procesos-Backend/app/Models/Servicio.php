<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Servicio extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'descripcion'];

    public function ventanillas()
    {
        return $this->belongsToMany(Ventanilla::class, 'servicio_ventanilla');
    }
}