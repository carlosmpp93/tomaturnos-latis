import React, { createContext, useContext, useState, useEffect } from 'react'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Navigate, useNavigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import AdminProcesses from './pages/AdminProcesses'
import FormNuevoUsuario from './pages/FormNuevoUsuario';
import LoginPage from './pages/LoginPage'
import FormNuevoProceso from './pages/FormNuevoProceso'
import GenerarTurnoPage from './pages/GenerarTurnoPage'
import MonitorVentanillaPage from './pages/MonitorVentanillaPage'

// API Base URL
const API_URL = 'http://127.0.0.1:8000/api';

// Create Auth Context
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const loginUsuario = async (usuario) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(usuario),
      });

      const data = await res.json();

      if (res.ok && data.access_token) {
        // Store authentication data
        localStorage.setItem('auth_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Update state
        setUser(data.user);
        setIsAuthenticated(true);
        
        return { success: true, data };
      } else {
        // Handle API errors
        return { 
          error: data.error || data.message || 'Invalid credentials',
          errors: data.errors || {}
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        error: 'Error de conexión. Por favor, verifica tu conexión e intenta nuevamente.' 
      };
    }
  };

  const registrarUsuario = async (nuevoUsuario) => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(nuevoUsuario),
      });

      const data = await res.json();

      if (res.ok) {
        return { success: true, data };
      } else {
        return { 
          error: data.error || data.message || 'Error al registrar usuario',
          errors: data.errors || {}
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        error: 'Error de conexión. Por favor, verifica tu conexión e intenta nuevamente.' 
      };
    }
  };

  const logoutUsuario = async () => {
    const token = localStorage.getItem('auth_token');
    
    // Call logout endpoint if token exists
    if (token) {
      try {
        await fetch(`${API_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
      } catch (error) {
        console.error('Logout API error:', error);
      }
    }
    
    // Clear local storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    
    // Reset state
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    loginUsuario,
    registrarUsuario,
    logoutUsuario,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to home if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

// Login Page Wrapper to pass auth functions
const LoginPageWrapper = () => {
  const { loginUsuario } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    const result = await loginUsuario(formData);
    if (result.success) {
      navigate('/');
    }
    return result;
  };

  return <LoginPage loginUsuarioSubmit={handleLogin} />;
};

// Form Registration Wrapper
const FormRegistroUsuarioWrapper = () => {
  const { registrarUsuario } = useAuth();
  const navigate = useNavigate();

  const handleRegistration = async (formData) => {
    const result = await registrarUsuario(formData);
    if (result.success) {
      // Show success message or redirect
      navigate('/');
      // Or show a success notification
    }
    return result;
  };

  return <FormRegistroUsuario registrarUsuarioSubmit={handleRegistration} />;
};

// Main App Component
const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<AuthProvider><MainLayout /></AuthProvider>}>
        {/* Protected Routes */}
        <Route index element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/procesos" element={
          <ProtectedRoute>
            <AdminProcesses />
          </ProtectedRoute>
        } />
        <Route path="/crear-usuario" element={
          <ProtectedRoute>
            <FormRegistroUsuarioWrapper />
          </ProtectedRoute>
        } />
        <Route path="/procesos/nuevo" element={
          <ProtectedRoute>
            <FormNuevoProceso />
          </ProtectedRoute>
        } />
        <Route path="/monitor-ventanilla" element={
          <ProtectedRoute>
            <MonitorVentanillaPage />
          </ProtectedRoute>
        } />
        
        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <LoginPageWrapper />
          </PublicRoute>
        } />
        <Route path="/generar-turno" element={
            <GenerarTurnoPage />
        } />
        
        {/* 404 Route */}
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;