import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* Warning Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl mb-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 group-hover:from-orange-600/30 group-hover:to-red-600/30 transition-all duration-500"></div>
            <AlertTriangle className="size-8 text-white relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-red-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          </div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Página no encontrada
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Lo sentimos, la página que estás buscando no existe o ha sido movida. Por favor, verifica la URL o vuelve a la página de inicio.
          </p>
        </div>

        {/* Return Button */}
        <NavLink
          to="/"
          className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl font-semibold hover:from-slate-800 hover:to-slate-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 group"
        >
          <ArrowLeft className="mr-2 size-5 group-hover:-translate-x-1 transition-transform duration-200" />
          Volver a la página de inicio
        </NavLink>
      </div>
    </div>
  );
};

export default NotFoundPage;