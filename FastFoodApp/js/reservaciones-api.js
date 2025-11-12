// API Service para Reservaciones - Bocatto Valley
// ================================================

// Configuración de la API
const API_CONFIG = {
    // Usar API local en desarrollo, producción en deploy
    baseURL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000/api'
        : 'https://bocatto-valley-api.onrender.com/api',
    
    endpoints: {
        ambientes: '/ambientes',
        reservaciones: '/reservaciones',
        verificarDisponibilidad: '/reservaciones/verificar-disponibilidad'
    }
};

// Clase para manejar las peticiones a la API
class ReservacionesAPI {
    constructor() {
        this.baseURL = API_CONFIG.baseURL;
        this.token = localStorage.getItem('token');
    }

    /**
     * Método genérico para hacer peticiones HTTP
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Agregar token si existe
        if (this.token) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error en la petición');
            }

            return data;
        } catch (error) {
            console.error('Error en la petición:', error);
            throw error;
        }
    }

    /**
     * Obtener todos los ambientes activos
     */
    async obtenerAmbientes() {
        try {
            const response = await this.request(API_CONFIG.endpoints.ambientes);
            return response.data || [];
        } catch (error) {
            console.error('Error al obtener ambientes:', error);
            throw error;
        }
    }

    /**
     * Obtener un ambiente específico por ID
     */
    async obtenerAmbiente(id) {
        try {
            const response = await this.request(`${API_CONFIG.endpoints.ambientes}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener ambiente:', error);
            throw error;
        }
    }

    /**
     * Verificar disponibilidad de un ambiente
     */
    async verificarDisponibilidad(ambienteId, fechaReservacion, horaInicio, horaFin) {
        try {
            const response = await this.request(API_CONFIG.endpoints.verificarDisponibilidad, {
                method: 'POST',
                body: JSON.stringify({
                    ambienteId,
                    fechaReservacion,
                    horaInicio,
                    horaFin
                })
            });
            return response.disponible;
        } catch (error) {
            console.error('Error al verificar disponibilidad:', error);
            throw error;
        }
    }

    /**
     * Crear una nueva reservación
     */
    async crearReservacion(datosReservacion) {
        try {
            const response = await this.request(API_CONFIG.endpoints.reservaciones, {
                method: 'POST',
                body: JSON.stringify(datosReservacion)
            });
            return response.data;
        } catch (error) {
            console.error('Error al crear reservación:', error);
            throw error;
        }
    }

    /**
     * Obtener mis reservaciones
     */
    async obtenerMisReservaciones() {
        try {
            const response = await this.request(`${API_CONFIG.endpoints.reservaciones}/mis-reservaciones`);
            return response.data || [];
        } catch (error) {
            console.error('Error al obtener reservaciones:', error);
            throw error;
        }
    }

    /**
     * Cancelar una reservación
     */
    async cancelarReservacion(id) {
        try {
            const response = await this.request(`${API_CONFIG.endpoints.reservaciones}/${id}/cancelar`, {
                method: 'PATCH'
            });
            return response.data;
        } catch (error) {
            console.error('Error al cancelar reservación:', error);
            throw error;
        }
    }
}

// Crear instancia global de la API
window.reservacionesAPI = new ReservacionesAPI();
