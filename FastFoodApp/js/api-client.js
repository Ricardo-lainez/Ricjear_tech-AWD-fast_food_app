/**
 * ========================================
 * CONFIGURACIÓN DE LA API
 * ========================================
 * Centraliza la configuración de conexión con el backend
 * NOTA: Este archivo usa la configuración de js/config.js
 */

// Usar configuración centralizada
const API_CONFIG = {
    // Usar la URL del archivo config.js
    baseURL: window.APP_CONFIG ? window.APP_CONFIG.API.BASE_URL : 'http://localhost:3000/api',
    
    // Timeout para peticiones
    timeout: 10000, // 10 segundos

    // Headers por defecto
    headers: {
        'Content-Type': 'application/json'
    }
};

/**
 * Clase para manejar peticiones HTTP a la API
 */
class ApiClient {
    constructor(config) {
        this.baseURL = config.baseURL;
        this.timeout = config.timeout;
        this.headers = config.headers;
    }

    /**
     * Obtiene el token de autenticación del localStorage
     * @returns {string|null}
     */
    getToken() {
        const session = localStorage.getItem('bocatto_session') || sessionStorage.getItem('bocatto_session');
        if (session) {
            try {
                const parsed = JSON.parse(session);
                return parsed.token;
            } catch (error) {
                return null;
            }
        }
        return null;
    }

    /**
     * Realiza una petición HTTP
     * @param {string} endpoint - Ruta del endpoint (ej: '/auth/login')
     * @param {Object} options - Opciones de fetch
     * @returns {Promise<Object>}
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        // Headers por defecto + headers personalizados
        const headers = {
            ...this.headers,
            ...options.headers
        };

        // Agregar token si existe
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Configuración de la petición
        const config = {
            ...options,
            headers,
            credentials: 'include' // Importante para cookies
        };

        try {
            // Timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(url, {
                ...config,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            // Parsear respuesta JSON
            const data = await response.json();

            // Verificar si la respuesta fue exitosa
            if (!response.ok) {
                throw new Error(data.message || 'Error en la petición');
            }

            return data;

        } catch (error) {
            // Manejar errores
            if (error.name === 'AbortError') {
                throw new Error('La petición tardó demasiado. Verifica tu conexión.');
            }

            if (error.message.includes('Failed to fetch')) {
                throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.');
            }

            throw error;
        }
    }

    /**
     * Métodos HTTP
     */
    get(endpoint, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'GET'
        });
    }

    post(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    put(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    delete(endpoint, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'DELETE'
        });
    }
}

// Crear instancia global del cliente API
const apiClient = new ApiClient(API_CONFIG);

// Hacer disponible globalmente
window.apiClient = apiClient;
window.API_CONFIG = API_CONFIG;

console.log('🌐 API Client configurado:', API_CONFIG.baseURL);
