import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Save, AlertCircle } from 'lucide-react';

const FormNuevoProceso = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    clave_proceso: '',
    nombre: '',
    descripcion: '',
    tipo: 'normal'
  });

  const API_URL = 'http://127.0.0.1:8000/api';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.clave_proceso.trim()) {
      newErrors.clave_proceso = 'La clave del proceso es requerida';
    } else if (formData.clave_proceso.length > 50) {
      newErrors.clave_proceso = 'La clave no puede exceder 50 caracteres';
    }
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del proceso es requerido';
    } else if (formData.nombre.length > 255) {
      newErrors.nombre = 'El nombre no puede exceder 255 caracteres';
    }
    
    if (!formData.tipo) {
      newErrors.tipo = 'El tipo de proceso es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');
    
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/procesos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          clave_proceso: formData.clave_proceso.trim(),
          nombre: formData.nombre.trim(),
          descripcion: formData.descripcion.trim(),
          tipo: formData.tipo
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 422 && data.errors) {
          // Validation errors from Laravel
          const validationErrors = {};
          Object.keys(data.errors).forEach(key => {
            validationErrors[key] = data.errors[key][0];
          });
          setErrors(validationErrors);
        } else {
          setErrors({ general: data.message || 'Error al crear el proceso' });
        }
        return;
      }
      
      setSuccessMessage('¡Proceso creado exitosamente!');
      
      // Reset form
      setFormData({
        clave_proceso: '',
        nombre: '',
        descripcion: '',
        tipo: 'normal'
      });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/procesos');
      }, 2000);
      
    } catch (error) {
      console.error('Error:', error);
      setErrors({ general: 'Error de conexión. Por favor, intente nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/procesos');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-4 rounded-t-lg">
            <h2 className="text-xl font-semibold text-white">Registrar Nuevo Proceso</h2>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">{successMessage}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{errors.general}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Clave del Proceso */}
              <div>
                <label htmlFor="clave_proceso" className="block text-sm font-medium text-gray-700 mb-2">
                  Clave del Proceso *
                </label>
                <input
                  type="text"
                  name="clave_proceso"
                  id="clave_proceso"
                  value={formData.clave_proceso}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors ${
                    errors.clave_proceso ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ej: PRO-001"
                  disabled={isLoading}
                />
                {errors.clave_proceso && (
                  <p className="mt-1 text-sm text-red-600">{errors.clave_proceso}</p>
                )}
              </div>
              
              {/* Tipo de Proceso */}
              <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Proceso *
                </label>
                <select
                  name="tipo"
                  id="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors ${
                    errors.tipo ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                >
                  <option value="normal">Normal</option>
                  <option value="gestion-documental">Gestión Documental</option>
                  <option value="proyecto">Proyecto</option>
                </select>
                {errors.tipo && (
                  <p className="mt-1 text-sm text-red-600">{errors.tipo}</p>
                )}
              </div>
              
              {/* Nombre del Proceso */}
              <div className="sm:col-span-2">
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Proceso *
                </label>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors ${
                    errors.nombre ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ingrese el nombre del proceso"
                  disabled={isLoading}
                />
                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                )}
              </div>
              
              {/* Descripción */}
              <div className="sm:col-span-2">
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  id="descripcion"
                  rows={4}
                  value={formData.descripcion}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors resize-none ${
                    errors.descripcion ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Describa el proceso detalladamente (opcional)"
                  disabled={isLoading}
                />
                {errors.descripcion && (
                  <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {formData.descripcion.length} caracteres
                </p>
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <div className="flex items-center">
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </div>
              </button>
              
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Proceso
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Help Text */}
        <div className="mt-4 text-sm text-gray-600 text-center">
          Los campos marcados con * son obligatorios
        </div>
      </div>
    </div>
  );
};

export default FormNuevoProceso;