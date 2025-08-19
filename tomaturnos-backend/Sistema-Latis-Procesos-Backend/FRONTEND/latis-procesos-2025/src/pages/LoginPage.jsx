import React, { useState, useCallback, useRef, useEffect } from 'react';
import logo from '../assets/images/logo.png';

const LoginPage = ({ loginUsuarioSubmit }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Refs for form inputs
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  
  // Focus on username field on mount
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    const trimmedUsername = formData.username.trim();
    
    if (!trimmedUsername) {
      newErrors.username = 'El nombre de usuario es requerido';
    } else if (trimmedUsername.length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Focus on first error field
      if (errors.username) {
        usernameRef.current?.focus();
      } else if (errors.password) {
        passwordRef.current?.focus();
      }
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const sanitizedData = {
        username: formData.username.trim(),
        password: formData.password,
        rememberMe: formData.rememberMe
      };
      
      const result = await loginUsuarioSubmit(sanitizedData);

      if (!result || result.error) {
        setErrors({ general: result?.error || 'Usuario o contraseña inválidos' });
        // Clear password on error for security
        setFormData(prev => ({ ...prev, password: '' }));
        passwordRef.current?.focus();
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ 
        general: error.message || 'Error al iniciar sesión. Por favor, intente nuevamente.' 
      });
      setFormData(prev => ({ ...prev, password: '' }));
    } finally {
      setIsLoading(false);
    }
  }, [formData, loginUsuarioSubmit, validateForm, errors]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // Prevent form submission on Enter if there are errors
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && Object.keys(errors).length > 0) {
      e.preventDefault();
    }
  }, [errors]);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center">
      <div className="w-full max-w-sm mx-auto px-6">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <img 
            src={logo}
            alt="Latis" 
            className="h-20 w-auto mx-auto mb-8"
            loading="eager"
          />
        </div>

        {/* Error Message */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl" role="alert">
            <p className="text-sm text-red-600 text-center">{errors.general}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-6" noValidate>
          {/* Username Field */}
          <div>
            <input
              ref={usernameRef}
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Usuario o Email"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
                errors.username ? 'border-red-300' : 'border-gray-200'
              }`}
              autoComplete="username"
              aria-label="Nombre de usuario o email"
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? "username-error" : undefined}
              disabled={isLoading}
            />
            {errors.username && (
              <p id="username-error" className="mt-2 text-sm text-red-600" role="alert">
                {errors.username}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="relative">
              <input
                ref={passwordRef}
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Contraseña"
                className={`w-full px-4 py-3 pr-12 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
                  errors.password ? 'border-red-300' : 'border-gray-200'
                }`}
                autoComplete="current-password"
                aria-label="Contraseña"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="mt-2 text-sm text-red-600" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900 cursor-pointer"
                disabled={isLoading}
              />
              <span className="ml-2 text-sm text-gray-600 select-none">Recordarme</span>
            </label>
            
            <a 
              href="/forgot-password" 
              className="text-sm text-gray-900 hover:underline focus:outline-none focus:ring-2 focus:ring-gray-900 rounded"
              tabIndex={isLoading ? -1 : 0}
            >
              ¿Olvidó su contraseña?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 text-white font-medium rounded-xl transition-all duration-200 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gray-900 hover:bg-gray-800 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900'
            }`}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Ingresando...
              </span>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-500">
            © 2025 Grupo Corporativo Latis. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;