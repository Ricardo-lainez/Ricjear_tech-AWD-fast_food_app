/**
 * ========================================
 * CONFIGURACIÓN DE URLs - BOCATTO VALLEY
 * ========================================
 * Este archivo maneja las URLs del API según el entorno
 * Última actualización: 2025-11-11
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
            : 'https://bocatto-valley-api.onrender.com/api', // ✅ URL del backend en Render (actualizado 2025-11-11)

        // Endpoints
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            LOGOUT: '/auth/logout',
            ME: '/auth/me'
        },
        
        // Endpoints para productos del menú
        PRODUCTS: {
            ALL: '/products',
            BY_ID: '/products',
            BY_CATEGORY: '/products/category',
            BY_SUBCATEGORY: '/products/subcategory',
            CATEGORIES: '/products/categories',
            SUBCATEGORIES: '/products/category', // + /:categoria/subcategories
            SEARCH: '/products/search',
            POPULAR: '/products/popular',
            STATS: '/products/stats'
        }
        
        // Otros endpoints futuros:
        // RESERVAS: '/reservas',
        // ORDERS: '/orders'
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
