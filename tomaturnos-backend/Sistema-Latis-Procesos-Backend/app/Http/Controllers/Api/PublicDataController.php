<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Servicio;
use App\Models\Sucursal;
use Illuminate\Http\Request;

class PublicDataController extends Controller
{
    /**
     * Display a listing of the servicios.
     */
    public function servicios()
    {
        return response()->json(Servicio::all());
    }

    /**
     * Display a listing of the sucursales.
     */
    public function sucursales()
    {
        return response()->json(Sucursal::all());
    }
}
