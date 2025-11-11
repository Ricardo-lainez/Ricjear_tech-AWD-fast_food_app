/**
 * ========================================
 * CONFIGURACIÓN DE URLs - BOCATTO VALLEY
 * ========================================
 * Este archivo maneja las URLs del API según el entorno
 */

const CONFIG = {
    // Detectar si estamos en desarrollo o producción
    isDevelopment: window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1',

    // URLs del API
    API: {
        // En desarrollo: backend local
        // En producción: backend desplegado en Render
        BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:3000/api'
            : 'https://bocatto-valley-api.onrender.com/api', // URL del backend en Render

        // Endpoints
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            LOGOUT: '/auth/logout',
            ME: '/auth/me'
        }
        // Aquí puedes agregar más endpoints cuando los crees
        // MENU: '/menu',
        // RESERVAS: '/reservas',
        // etc.
    },

    // Configuración de cookies/tokens
    TOKEN_KEY: 'token',
    
    // Tiempo de expiración de sesión (7 días en milisegundos)
    SESSION_EXPIRATION: 7 * 24 * 60 * 60 * 1000
};

// Función helper para construir URLs completas
CONFIG.getApiUrl = function(endpoint) {
    return `${this.API.BASE_URL}${endpoint}`;
};

// Logs para debugging (solo en desarrollo)
if (CONFIG.isDevelopment) {
    console.log('🔧 Modo:', CONFIG.isDevelopment ? 'Desarrollo' : 'Producción');
    console.log('🌐 API Base URL:', CONFIG.API.BASE_URL);
}

// Exportar configuración
window.APP_CONFIG = CONFIG;
