import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Menu as MenuIcon, User, Settings, LogOut, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../App';

const Navbar = () => {
  const { user, isAuthenticated, logoutUsuario } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUsuario();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 rounded-xl px-4 py-2.5 font-medium transition-all duration-200'
      : 'text-white/90 hover:bg-white/10 hover:text-white rounded-xl px-4 py-2.5 font-medium transition-all duration-200';

  return (
    <nav className="relative z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            <NavLink to="/" className="flex flex-shrink-0 items-center mr-8 group">
              <div className="relative">
                <img className="h-8 w-auto transition-transform duration-200 group-hover:scale-110" src={logo} alt="Latis" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 rounded-full blur-xl transition-opacity duration-300"></div>
              </div>
            </NavLink>
            
            <div className="md:ml-auto">
              <div className="flex items-center space-x-1">
                {isAuthenticated && (
                  <>
                    <NavLink to="/" className={linkClass}>
                      Inicio
                    </NavLink>
                    <NavLink to="/procesos" className={linkClass}>
                      Procesos
                    </NavLink>
                    <NavLink to="/monitor-ventanilla" className={linkClass}>
                      Monitor Ventanilla
                    </NavLink>
                    <NavLink to="/generar-turno" className={linkClass}>
                      Generar Turno
                    </NavLink>
                  </>
                )}
                
                <Menu as="div" className="relative inline-block text-left ml-4">
                  <div>
                    <MenuButton className="inline-flex items-center justify-center gap-x-2 rounded-xl bg-white/10 backdrop-blur-sm px-4 py-2.5 text-sm font-medium text-white shadow-lg ring-1 ring-white/20 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 group">
                      {isAuthenticated && user ? (
                        <>
                          <div className="size-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold">
                            {user.name?.charAt(0)?.toUpperCase() || user.username?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <span className="hidden sm:inline">{user.name || user.username}</span>
                        </>
                      ) : (
                        <MenuIcon className="size-4 text-white/90 group-hover:text-white transition-colors duration-200" />
                      )}
                      <span className="sr-only">Abrir menú de usuario</span>
                    </MenuButton>
                    
                    <MenuItems
                      transition
                      className="absolute right-0 z-50 mt-3 w-64 origin-top-right rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 transition-all duration-200 ease-out data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                    >
                      <div className="py-2">
                        {!isAuthenticated ? (
                          <>
                            <MenuItem>
                              {({ focus }) => (
                                <Link
                                  to="/login"
                                  className={`${
                                    focus ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                                  } group flex items-center px-4 py-3 text-sm font-medium transition-colors duration-150`}
                                >
                                  <LogIn className="mr-3 size-4 text-gray-400 group-hover:text-gray-600" />
                                  Iniciar sesión
                                </Link>
                              )}
                            </MenuItem>

                            <MenuItem>
                              {({ focus }) => (
                                <Link
                                  to="/crear-usuario"
                                  className={`${
                                    focus ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                                  } group flex items-center px-4 py-3 text-sm font-medium transition-colors duration-150`}
                                >
                                  <UserPlus className="mr-3 size-4 text-gray-400 group-hover:text-gray-600" />
                                  Registrarse
                                </Link>
                              )}
                            </MenuItem>
                          </>
                        ) : (
                          <>
                            {/* User info section */}
                            <div className="px-4 py-3 border-b border-gray-100">
                              <p className="text-sm font-medium text-gray-900">{user.name || user.username}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>

                            <MenuItem>
                              {({ focus }) => (
                                <Link
                                  to="/perfil"
                                  className={`${
                                    focus ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                                  } group flex items-center px-4 py-3 text-sm font-medium transition-colors duration-150`}
                                >
                                  <User className="mr-3 size-4 text-gray-400 group-hover:text-gray-600" />
                                  Perfil
                                </Link>
                              )}
                            </MenuItem>

                            {/* <MenuItem>
                              {({ focus }) => (
                                <Link
                                  to="/crear-usuario"
                                  className={`${
                                    focus ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                                  } group flex items-center px-4 py-3 text-sm font-medium transition-colors duration-150`}
                                >
                                  <UserPlus className="mr-3 size-4 text-gray-400 group-hover:text-gray-600" />
                                  Crear Usuario
                                </Link>
                              )}
                            </MenuItem> */}
                            
                            <MenuItem>
                              {({ focus }) => (
                                <Link
                                  to="/configuracion"
                                  className={`${
                                    focus ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                                  } group flex items-center px-4 py-3 text-sm font-medium transition-colors duration-150`}
                                >
                                  <Settings className="mr-3 size-4 text-gray-400 group-hover:text-gray-600" />
                                  Configuración
                                </Link>
                              )}
                            </MenuItem>
                            
                            <div className="my-1 h-px bg-gray-200"></div>
                            
                            <MenuItem>
                              {({ focus }) => (
                                <button
                                  onClick={handleLogout}
                                  className={`${
                                    focus ? 'bg-red-50 text-red-700' : 'text-red-600'
                                  } group flex w-full items-center px-4 py-3 text-sm font-medium transition-colors duration-150`}
                                >
                                  <LogOut className="mr-3 size-4 text-red-400 group-hover:text-red-600" />
                                  Cerrar sesión
                                </button>
                              )}
                            </MenuItem>
                          </>
                        )}
                      </div>
                    </MenuItems>
                  </div>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;