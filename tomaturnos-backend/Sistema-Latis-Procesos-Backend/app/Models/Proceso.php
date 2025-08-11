<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class Proceso extends Model
{
    use HasFactory;

    protected $table = 'procesos';

    protected $fillable = [
        'clave_proceso',
        'nombre',
        'descripcion',
        'tipo',
        'created_by'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationship with user
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Global scope to filter by user (optional)
    protected static function booted()
    {
        // Automatically add created_by when creating
        static::creating(function ($proceso) {
            if (Auth::check() && !$proceso->created_by) {
                $proceso->created_by = Auth::id();
            }
        });
    }

    // Scope to filter by user
    public function scopeVisibleTo(Builder $query, User $user)
    {
        if ($user->isAdmin()) {
            return $query;
        }

        return $query->where('created_by', $user->id);
    }
}