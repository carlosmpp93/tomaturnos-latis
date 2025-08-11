import React, { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Search, X, Loader2, AlertTriangle, User, Briefcase, ArrowLeft } from 'lucide-react';

const CustomerSearchModal = ({ isOpen, onClose, onSearch, isLoading, error }) => {
  const [view, setView] = useState('initial'); // 'initial' or 'external_form'
  const [customerId, setCustomerId] = useState('');
  const [externalClientName, setExternalClientName] = useState('');
  const [externalClientPaterno, setExternalClientPaterno] = useState('');
  const [externalClientMaterno, setExternalClientMaterno] = useState('');
  const [externalClientRfc, setExternalClientRfc] = useState('');

  useEffect(() => {
    // Reset state when modal is opened/closed
    if (!isOpen) {
      setTimeout(() => {
        setView('initial');
        setCustomerId('');
        setExternalClientName('');
        setExternalClientPaterno('');
        setExternalClientMaterno('');
        setExternalClientRfc('');
      }, 300); // Delay to allow closing animation
    }
  }, [isOpen]);

  const handleInternalSearch = (e) => {
    e.preventDefault();
    if (customerId.trim()) {
      onSearch({ type: 'interno', payload: customerId.trim() });
    }
  };

  const handleExternalSubmit = (e) => {
    e.preventDefault();
    if (externalClientName.trim() && externalClientPaterno.trim()) {
      onSearch({
        type: 'externo',
        payload: {
          nombre: externalClientName.trim(),
          apellido_paterno: externalClientPaterno.trim(),
          apellido_materno: externalClientMaterno.trim(),
          rfc: externalClientRfc.trim(),
        },
      });
    }
  };

  const renderInitialView = () => (
    <form onSubmit={handleInternalSearch}>
      <p className="text-sm text-gray-500 mb-4">
        Ingrese el número de cliente para recuperar su información.
      </p>
      <div className="relative">
        <input
          type="text"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          placeholder="Número de Cliente"
          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
          disabled={isLoading}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="submit"
          className="inline-flex w-full justify-center items-center rounded-lg border border-transparent bg-gray-900 px-4 py-3 text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          disabled={isLoading || !customerId.trim()}
        >
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Buscando...</>
          ) : (
            <><Search className="mr-2 h-4 w-4" /> Buscar Cliente</>
          )}
        </button>
        <button
          type="button"
          onClick={() => setView('external_form')}
          className="inline-flex w-full justify-center items-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:bg-gray-400 transition-colors"
          disabled={isLoading}
        >
          <Briefcase className="mr-2 h-4 w-4" />
          Cliente Externo
        </button>
      </div>
    </form>
  );

  const renderExternalForm = () => (
    <form onSubmit={handleExternalSubmit}>
        <div className="flex items-center mb-4">
            <button type="button" onClick={() => setView('initial')} className="p-2 rounded-full hover:bg-gray-100 mr-2">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h4 className="text-md font-medium text-gray-800">Datos del Cliente Externo</h4>
        </div>
        <div className="space-y-4">
            <div>
                <label htmlFor="externalName" className="block text-sm font-medium text-gray-700 mb-1">Nombre(s) *</label>
                <input id="externalName" type="text" value={externalClientName} onChange={(e) => setExternalClientName(e.target.value)} placeholder="Ej: Juan" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
            </div>
            <div>
                <label htmlFor="externalPaterno" className="block text-sm font-medium text-gray-700 mb-1">Apellido Paterno *</label>
                <input id="externalPaterno" type="text" value={externalClientPaterno} onChange={(e) => setExternalClientPaterno(e.target.value)} placeholder="Ej: Pérez" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
            </div>
            <div>
                <label htmlFor="externalMaterno" className="block text-sm font-medium text-gray-700 mb-1">Apellido Materno</label>
                <input id="externalMaterno" type="text" value={externalClientMaterno} onChange={(e) => setExternalClientMaterno(e.target.value)} placeholder="Ej: García" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
            </div>
            <div>
                <label htmlFor="externalRfc" className="block text-sm font-medium text-gray-700 mb-1">RFC (Opcional)</label>
                <input id="externalRfc" type="text" value={externalClientRfc} onChange={(e) => setExternalClientRfc(e.target.value)} placeholder="Ej: PEGA123456H78" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
            </div>
        </div>
        <div className="mt-6">
            <button type="submit" className="inline-flex w-full justify-center items-center rounded-lg border border-transparent bg-gray-900 px-4 py-3 text-base font-medium text-white hover:bg-gray-800 disabled:bg-gray-400">
                Continuar
            </button>
        </div>
    </form>
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center">
                  Identificación del Cliente
                  <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" aria-label="Cerrar">
                    <X className="h-5 w-5" />
                  </button>
                </Dialog.Title>
                <div className="mt-4">
                  {view === 'initial' ? renderInitialView() : renderExternalForm()}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CustomerSearchModal;

