import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Package,
  ArrowUpRight,
} from 'lucide-react';

const HomePage = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Bienvenido a <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Latis</span>
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                Tu plataforma integral para la gestión de procesos empresariales. Simplifica tu trabajo y mejora tu productividad con nuestras herramientas avanzadas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavLink
                to="/dashboard"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-white/90 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Ver resumen
                <ArrowUpRight className="ml-2 size-5" />
              </NavLink>
              <NavLink
                to="/demo"
                className="inline-flex items-center justify-center px-8 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/20"
              >
                Ver notificaciones
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white/30 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Características innovadoras</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Todo lo que necesitas para gestionar tu negocio de forma eficiente</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="size-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Estadísticas y reportes</h3>
              <p className="text-slate-600">Generación de reportes y estadísticas avanzadas</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="size-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Gestión de equipo</h3>
              <p className="text-slate-600">Colabora eficientemente con manejo de roles y permisos del equipo</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="size-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Control de inventario</h3>
              <p className="text-slate-600">Trazabilidad de inventario en tiempo real</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;