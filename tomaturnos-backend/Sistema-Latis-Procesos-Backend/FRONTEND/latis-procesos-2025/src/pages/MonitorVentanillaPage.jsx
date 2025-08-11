import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../App';
import { AlertCircle, CheckCircle, Play, Check, X, RefreshCw } from 'lucide-react';

const API_URL = 'http://127.0.0.1:8000/api';

const MonitorVentanillaPage = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [currentTurn, setCurrentTurn] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchCurrentTurn = useCallback(async () => {
    if (!isAuthenticated || !user || !user.ventanilla_id) {
      setIsLoading(false);
      setError('No estás asignado a una ventanilla o no has iniciado sesión.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_URL}/monitor/turno`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentTurn(response.data);
    } catch (err) {
      console.error('Error fetching current turn:', err);
      setError(err.response?.data?.message || 'Error al cargar el turno actual.');
      setCurrentTurn(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!authLoading) {
      fetchCurrentTurn();
    }
  }, [fetchCurrentTurn, authLoading]);

  const handleAcceptTurn = async () => {
    if (!currentTurn || currentTurn.status !== 'en_espera') return;

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(`${API_URL}/turnos/${currentTurn.id}/aceptar`, {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage('Turno aceptado exitosamente.');
      setCurrentTurn(response.data);
    } catch (err) {
      console.error('Error accepting turn:', err);
      setError(err.response?.data?.message || 'Error al aceptar el turno.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalizeTurn = async () => {
    if (!currentTurn || currentTurn.status !== 'atendiendo') return;

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const token = localStorage.getItem('auth_token');
      await axios.post(`${API_URL}/turnos/${currentTurn.id}/finalizar`, {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage('Turno finalizado. Buscando el siguiente...');
      setCurrentTurn(null); // Clear current turn to fetch next one
      fetchCurrentTurn(); // Fetch next turn immediately
    } catch (err) {
      console.error('Error finalizing turn:', err);
      setError(err.response?.data?.message || 'Error al finalizar el turno.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center shadow-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-semibold text-red-800 mb-2">Error</p>
          <p className="text-sm text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchCurrentTurn}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center mx-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-4 rounded-t-lg">
            <h2 className="text-xl font-semibold text-white">Monitor de Ventanilla: {user?.ventanilla?.numero || 'N/A'}</h2>
          </div>

          <div className="p-6 space-y-6">
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                  <p className="text-sm font-medium text-green-800">{successMessage}</p>
                </div>
              </div>
            )}

            {currentTurn ? (
              <div className="border border-gray-200 rounded-lg p-6 text-center bg-blue-50">
                <p className="text-sm font-medium text-gray-600 mb-2">Turno Actual</p>
                <h3 className="text-5xl font-bold text-blue-800 mb-4">{currentTurn.numero_turno}</h3>
                <p className="text-xl text-gray-800 mb-2">{currentTurn.cliente_nombre} {currentTurn.cliente_apellido_paterno} {currentTurn.cliente_apellido_materno}</p>
                <p className="text-md text-gray-700 mb-4">Trámite: <span className="font-semibold">{currentTurn.servicio?.nombre || 'N/A'}</span></p>
                <p className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
                  currentTurn.status === 'atendiendo' ? 'bg-green-200 text-green-800' :
                  currentTurn.status === 'en_espera' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-gray-200 text-gray-800'
                }`}>
                  Estado: {currentTurn.status === 'en_espera' ? 'En Espera' : currentTurn.status === 'atendiendo' ? 'Atendiendo' : 'Finalizado'}
                </p>

                <div className="mt-6 flex justify-center space-x-4">
                  {currentTurn.status === 'en_espera' && (
                    <button
                      onClick={handleAcceptTurn}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center"
                      disabled={isLoading}
                    >
                      <Play className="h-5 w-5 mr-2" /> Aceptar Turno
                    </button>
                  )}
                  {currentTurn.status === 'atendiendo' && (
                    <button
                      onClick={handleFinalizeTurn}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center"
                      disabled={isLoading}
                    >
                      <Check className="h-5 w-5 mr-2" /> Finalizar Turno
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-6 text-center bg-gray-50">
                <p className="text-lg font-semibold text-gray-700 mb-4">No hay turnos asignados a esta ventanilla.</p>
                <button
                  onClick={fetchCurrentTurn}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center mx-auto"
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> Buscar Turno
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitorVentanillaPage;
