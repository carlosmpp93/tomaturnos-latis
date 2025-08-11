<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Turno;
use App\Models\Servicio;
use App\Models\Ventanilla;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TurnoController extends Controller
{
    /**
     * Genera un nuevo turno y lo asigna a una ventanilla o lo pone en cola.
     */
    public function store(Request $request)
    {
        $request->validate([
            'cliente_nombre' => 'required|string|max:255',
            'cliente_apellido_paterno' => 'required|string|max:255',
            'cliente_apellido_materno' => 'required|string|max:255',
            'servicio_id' => 'required|exists:servicios,id',
            'sucursal_id' => 'required|exists:sucursales,id',
        ]);

        $servicio = Servicio::findOrFail($request->servicio_id);

        // Lógica de asignación de turno
        $turno = DB::transaction(function () use ($request, $servicio) {
            // 1. Encontrar una ventanilla disponible para el servicio y sucursal solicitados.
            $ventanilla = Ventanilla::query()
                ->where('sucursal_id', $request->sucursal_id)
                ->whereHas('servicios', function ($query) use ($servicio) {
                    $query->where('servicios.id', $servicio->id);
                })
                ->whereDoesntHave('turnos', function ($query) {
                    $query->where('status', 'atendiendo');
                })
                ->orderBy('updated_at', 'asc') // Prioriza la que ha estado libre más tiempo
                ->first();

            // 2. Generar el número de turno (ej. A001)
            $prefix = strtoupper(substr($servicio->nombre, 0, 1));
            $count = Turno::whereDate('created_at', Carbon::today())
                        ->count() + 1;
            $numeroTurno = $prefix . str_pad($count, 3, '0', STR_PAD_LEFT);

            // 3. Crear el turno
            $turno = Turno::create([
                'cliente_nombre' => $request->cliente_nombre,
                'cliente_apellido_paterno' => $request->cliente_apellido_paterno,
                'cliente_apellido_materno' => $request->cliente_apellido_materno,
                'servicio_id' => $servicio->id,
                'sucursal_id' => $request->sucursal_id,
                'ventanilla_id' => $ventanilla ? $ventanilla->id : null, // Asignar si se encontró una
                'numero_turno' => $numeroTurno,
                'status' => $ventanilla ? 'en_espera' : 'en_espera', // Siempre en espera inicialmente
            ]);

            return $turno;
        });

        return response()->json($turno->load('servicio', 'ventanilla'), 201);
    }

    /**
     * Muestra el turno actual para la ventanilla del usuario autenticado.
     */
    public function monitor(Request $request)
    {
        $user = $request->user();
        if (!$user->ventanilla_id) {
            return response()->json(['message' => 'Usuario no asignado a una ventanilla.'], 403);
        }

        $turno = Turno::where('ventanilla_id', $user->ventanilla_id)
            ->where('status', 'atendiendo')
            ->with('servicio', 'cliente')
            ->first();

        if (!$turno) {
            // Si no hay turno "atendiendo", busca el siguiente "en_espera" para esa ventanilla
            $turno = Turno::where('ventanilla_id', $user->ventanilla_id)
                ->where('status', 'en_espera')
                ->orderBy('created_at', 'asc')
                ->with('servicio')
                ->first();
        }

        return response()->json($turno);
    }

    /**
     * Acepta un turno, cambiando su estado a "atendiendo".
     */
    public function aceptar(Request $request, Turno $turno)
    {
        $user = $request->user();
        // Validar que el turno pertenece a la ventanilla del usuario
        if ($user->ventanilla_id !== $turno->ventanilla_id) {
            return response()->json(['message' => 'Este turno no está asignado a tu ventanilla.'], 403);
        }

        // Validar que no haya otro turno siendo atendido en la misma ventanilla
        $isAttendingAnother = Turno::where('ventanilla_id', $user->ventanilla_id)
                                    ->where('status', 'atendiendo')
                                    ->where('id', '!=', $turno->id)
                                    ->exists();

        if ($isAttendingAnother) {
            return response()->json(['message' => 'Ya estás atendiendo otro turno.'], 409); // 409 Conflict
        }

        $turno->status = 'atendiendo';
        $turno->save();

        return response()->json($turno->load('servicio'));
    }

    /**
     * Finaliza un turno y asigna el siguiente de la cola si existe.
     */
    public function finalizar(Request $request, Turno $turno)
    {
        $user = $request->user();
        if ($user->ventanilla_id !== $turno->ventanilla_id) {
            return response()->json(['message' => 'Este turno no pertenece a tu ventanilla.'], 403);
        }

        DB::transaction(function () use ($turno, $user) {
            // 1. Finalizar el turno actual
            $turno->status = 'finalizado';
            $turno->save();

            // 2. Buscar el siguiente turno en la cola para los servicios de esta ventanilla
            $siguienteTurno = Turno::where('sucursal_id', $user->sucursal_id)
                ->where('status', 'en_espera')
                ->whereNull('ventanilla_id') // Solo turnos que no han sido asignados
                ->whereIn('servicio_id', $user->ventanilla->servicios->pluck('id'))
                ->orderBy('created_at', 'asc')
                ->first();

            // 3. Si se encuentra un siguiente turno, asignarlo a esta ventanilla
            if ($siguienteTurno) {
                $siguienteTurno->ventanilla_id = $user->ventanilla_id;
                $siguienteTurno->save();
            }
        });

        return response()->json(['message' => 'Turno finalizado correctamente.']);
    }
}
