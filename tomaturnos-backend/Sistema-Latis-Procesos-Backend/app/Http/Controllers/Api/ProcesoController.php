<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Proceso;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProcesoController extends Controller
{
    public function index()
    {
        try {
            $user = Auth::user();
            
            // Build query based on user role
            $query = Proceso::with(['createdBy:id,name,email']);
            
            // Apply filtering based on role
            if (!$user->isAdmin()) {
                $query->where('created_by', $user->id);
            }
            
            $procesos = $query->orderBy('created_at', 'desc')->get();

            // Format response
            $formattedProcesos = $procesos->map(function ($proceso) use ($user) {
                $data = [
                    'id' => $proceso->id,
                    'clave_proceso' => $proceso->clave_proceso,
                    'nombre' => $proceso->nombre,
                    'descripcion' => $proceso->descripcion,
                    'tipo' => $proceso->tipo,
                    'created_at' => $proceso->created_at->format('Y-m-d H:i:s'),
                ];
                
                // Include creator info for admins
                if ($user->isAdmin() && $proceso->createdBy) {
                    $data['created_by'] = $proceso->created_by;
                    $data['created_by_name'] = $proceso->createdBy->name;
                    $data['created_by_email'] = $proceso->createdBy->email;
                }
                
                return $data;
            });

            return response()->json([
                'success' => true,
                'data' => $formattedProcesos,
                'total' => $formattedProcesos->count(),
                'user_role' => $user->role,
                'message' => 'Procesos retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error retrieving processes',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'clave_proceso' => 'required|string|max:50|unique:procesos',
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'tipo' => 'required|in:gestion-documental,normal,proyecto',
        ]);

        try {
            $proceso = Proceso::create([
                'clave_proceso' => $request->clave_proceso,
                'nombre' => $request->nombre,
                'descripcion' => $request->descripcion,
                'tipo' => $request->tipo,
                'created_by' => Auth::id(), // Automatically set creator
            ]);

            return response()->json([
                'success' => true,
                'data' => $proceso,
                'message' => 'Proceso created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error creating process',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = Auth::user();
            $proceso = Proceso::findOrFail($id);
            
            // Check permissions
            if (!$user->isAdmin() && $proceso->created_by !== $user->id) {
                return response()->json([
                    'success' => false,
                    'error' => 'Unauthorized',
                    'message' => 'You do not have permission to update this process'
                ], 403);
            }
            
            $request->validate([
                'clave_proceso' => 'required|string|max:50|unique:procesos,clave_proceso,' . $id,
                'nombre' => 'required|string|max:255',
                'descripcion' => 'nullable|string',
                'tipo' => 'required|in:gestion-documental,normal,proyecto',
            ]);

            $proceso->update($request->all());

            return response()->json([
                'success' => true,
                'data' => $proceso,
                'message' => 'Proceso updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error updating process',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = Auth::user();
            $proceso = Proceso::findOrFail($id);
            
            // Check permissions
            if (!$user->isAdmin() && $proceso->created_by !== $user->id) {
                return response()->json([
                    'success' => false,
                    'error' => 'Unauthorized',
                    'message' => 'You do not have permission to delete this process'
                ], 403);
            }

            $proceso->delete();

            return response()->json([
                'success' => true,
                'message' => 'Proceso deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error deleting process',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}