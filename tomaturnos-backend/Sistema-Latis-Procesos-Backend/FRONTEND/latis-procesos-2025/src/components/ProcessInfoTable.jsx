import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';

const ProcessInfoTable = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Base URL
  const API_URL = 'http://127.0.0.1:8000/api';

  // Fetch data from API
  const fetchProcesses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/procesos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch processes');
      }

      const result = await response.json();
      setData(result.data || result);
      setError(null);
    } catch (err) {
      console.error('Error fetching processes:', err);
      setError(err.message || 'Error loading processes');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchProcesses();
  }, []);

  // Handle delete process
  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este proceso?')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/procesos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete process');
      }

      // Remove from local state
      setData(data.filter(proceso => proceso.id !== id));
      alert('Proceso eliminado exitosamente');
    } catch (err) {
      console.error('Error deleting process:', err);
      alert('Error al eliminar el proceso');
    }
  };

  // Handle edit process
  const handleEdit = (id) => {
    // Navigate to edit form or open modal
    alert(`Edit process ${id} - Navigate to edit form`);
  };

  // Handle add new process
  const handleAddNew = () => {
    navigate('/procesos/nuevo');
  };

  // Handle view process details
  const handleView = (id) => {
    alert(`View process ${id} details`);
  };

  // Get type badge color
  const getTypeColor = (type) => {
    const colors = {
      'gestion-documental': 'bg-blue-100 text-blue-800',
      'normal': 'bg-green-100 text-green-800',
      'proyecto': 'bg-yellow-100 text-yellow-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  // Get type name
  const getNameFromType = (type) => {
    const names = {
      'gestion-documental': 'Gestión Documental',
      'normal': 'Normal',
      'proyecto': 'Proyecto',
    };
    return names[type] || 'Otro';
  };

  // Loading component
  if (loading) {
    return (
      <div className="w-full p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error component
  if (error) {
    return (
      <div className="w-full p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
            <button 
              onClick={fetchProcesses}
              className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Información de Procesos</h2>
          <button 
            onClick={handleAddNew}
            className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar Nuevo Proceso
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-center font-medium text-gray-700">Acciones</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">ID</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Clave Proceso</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Nombre</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Descripción</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Tipo</th>
                  {isAdmin && (
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Creado Por</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((row, index) => (
                  <tr 
                    key={row.id} 
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                    }`}
                    onClick={() => handleView(row.id)}
                  >
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(row.id);
                          }}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200 cursor-pointer hover:scale-110 transform"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(row.id);
                          }}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200 cursor-pointer hover:scale-110 transform"
                          title="Eliminar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {row.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                        {row.clave_proceso}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {row.nombre}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs">
                      <div className="truncate" title={row.descripcion}>
                        {row.descripcion || 'Sin descripción'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getTypeColor(row.tipo)}`}>
                        {getNameFromType(row.tipo)}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {row.created_by_name || 'Sistema'}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {data.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No hay procesos disponibles</p>
              <button 
                onClick={handleAddNew}
                className="mt-4 bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Agregar Primer Proceso
              </button>
            </div>
          )}
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          Mostrando {data.length} proceso{data.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};

export default ProcessInfoTable;