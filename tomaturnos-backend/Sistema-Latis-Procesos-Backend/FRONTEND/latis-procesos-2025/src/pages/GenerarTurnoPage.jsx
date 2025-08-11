import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Save, AlertCircle, User as UserIcon, FileText } from 'lucide-react';
import { useAuth } from '../App';
import CustomerSearchModal from '../components/CustomerSearchModal';

const API_URL = 'http://127.0.0.1:8000/api';

// Mock function to simulate fetching customer data
const mockFetchCustomerData = (customerId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (customerId === '12345') {
        resolve({
          nombre: 'Juan',
          apellido_paterno: 'Pérez',
          apellido_materno: 'García',
          rfc: 'PEGA123456H78',
          email: 'juan.perez@example.com',
        });
      } else {
        reject(new Error('Cliente no encontrado. Verifique el número e intente de nuevo.'));
      }
    }, 1500); // Simulate network delay
  });
};

const GenerarTurnoPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [customerData, setCustomerData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [modalError, setModalError] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const [formData, setFormData] = useState({
    servicio_id: '',
    sucursal_id: '',
  });
  const [servicios, setServicios] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [turnoGenerado, setTurnoGenerado] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?.sucursal_id) {
      setFormData((prev) => ({ ...prev, sucursal_id: user.sucursal_id }));
    }

    const fetchInitialData = async () => {
      try {
        const [serviciosRes, sucursalesRes] = await Promise.all([
          axios.get(`${API_URL}/servicios`),
          axios.get(`${API_URL}/sucursales`),
        ]);
        setServicios(serviciosRes.data);
        setSucursales(sucursalesRes.data);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setErrors({ general: 'Error al cargar los datos iniciales.' });
      }
    };
    fetchInitialData();
  }, [isAuthenticated, user]);

  const handleSearchCustomer = async (customerId) => {
    setIsModalLoading(true);
    setModalError(null);
    try {
      const data = await mockFetchCustomerData(customerId);
      setCustomerData(data);
      setIsModalOpen(false);
    } catch (error) {
      setModalError(error.message);
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleServiceSelect = (serviceId) => {
    setFormData((prev) => ({ ...prev, servicio_id: serviceId }));
    if (errors.servicio_id) {
      setErrors((prev) => ({ ...prev, servicio_id: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!customerData) newErrors.general = 'No se han cargado los datos del cliente.';
    if (!formData.servicio_id) newErrors.servicio_id = 'Debe seleccionar un trámite.';
    if (!isAuthenticated || !user?.sucursal_id) {
      if (!formData.sucursal_id) newErrors.sucursal_id = 'Debe seleccionar una sucursal.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');
    setTurnoGenerado(null);

    const postData = {
      ...formData,
      cliente_nombre: customerData.nombre,
      cliente_apellido_paterno: customerData.apellido_paterno,
      cliente_apellido_materno: customerData.apellido_materno,
    };

    try {
      const response = await axios.post(`${API_URL}/turnos`, postData);
      setSuccessMessage('¡Turno generado exitosamente!');
      setTurnoGenerado(response.data);
      setCustomerData(null); // Reset customer data
      setFormData({
        servicio_id: '',
        sucursal_id: isAuthenticated && user?.sucursal_id ? user.sucursal_id : '',
      });
      setTimeout(() => setIsModalOpen(true), 2000); // Re-open modal after success
    } catch (error) {
      console.error('Error al generar turno:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: error.message || 'Error al generar el turno.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CustomerSearchModal
        isOpen={isModalOpen}
        onClose={() => !customerData && navigate('/')} // Close redirects to home if no customer is loaded
        onSearch={handleSearchCustomer}
        isLoading={isModalLoading}
        error={modalError}
      />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`bg-white rounded-lg shadow-xl transition-opacity duration-500 ${isModalOpen ? 'opacity-20' : 'opacity-100'}`}>
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-4 rounded-t-lg">
              <h2 className="text-xl font-semibold text-white">Generar Nuevo Turno</h2>
            </div>

            {customerData ? (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Customer Info Display */}
                <div className="border-b pb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <UserIcon className="w-5 h-5 mr-2 text-gray-500" />
                        Información del Cliente
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="font-medium text-gray-500">Nombre Completo</p>
                            <p className="text-gray-800 font-semibold">{`${customerData.nombre} ${customerData.apellido_paterno} ${customerData.apellido_materno}`}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="font-medium text-gray-500">RFC</p>
                            <p className="text-gray-800 font-semibold">{customerData.rfc}</p>
                        </div>
                    </div>
                </div>

                {successMessage && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-green-800">{successMessage}</p>
                    {turnoGenerado && (
                      <p className="text-sm text-green-700">
                        Tu turno es: <span className="font-bold">{turnoGenerado.numero_turno}</span>
                      </p>
                    )}
                  </div>
                )}

                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-red-800">{errors.general}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {(!isAuthenticated || !user?.sucursal_id) && (
                    <div>
                      <label htmlFor="sucursal_id" className="block text-sm font-medium text-gray-700 mb-2">Sucursal *</label>
                      <select name="sucursal_id" id="sucursal_id" value={formData.sucursal_id} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg ${errors.sucursal_id ? 'border-red-300' : 'border-gray-300'}`} disabled={isLoading}>
                        <option value="">Seleccione una sucursal</option>
                        {sucursales.map((s) => <option key={s.id} value={s.id}>{s.unidad}</option>)}
                      </select>
                      {errors.sucursal_id && <p className="mt-1 text-sm text-red-600">{errors.sucursal_id}</p>}
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <label htmlFor="servicio_id" className="block text-sm font-medium text-gray-700 mb-4">Trámite a Realizar *</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {servicios.map((servicio) => (
                        <button
                          key={servicio.id}
                          type="button"
                          onClick={() => handleServiceSelect(servicio.id)}
                          className={`p-4 rounded-xl text-center transition-all duration-200 border-2 ${formData.servicio_id === servicio.id
                              ? 'bg-gray-900 text-white border-gray-900 shadow-lg'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-gray-900 hover:bg-gray-50'
                            }`}
                          disabled={isLoading}
                        >
                          <FileText className="w-8 h-8 mx-auto mb-2" />
                          <span className="font-semibold text-sm">{servicio.nombre}</span>
                        </button>
                      ))}
                    </div>
                    {errors.servicio_id && <p className="mt-2 text-sm text-red-600">{errors.servicio_id}</p>}
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50">
                    {isLoading ? 'Generando...' : <div className="flex items-center"><Save className="w-4 h-4 mr-2" />Generar Turno</div>}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>Por favor, busque un cliente para continuar.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GenerarTurnoPage;
