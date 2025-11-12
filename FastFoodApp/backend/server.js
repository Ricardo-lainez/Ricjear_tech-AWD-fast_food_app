/**
 * ========================================
 * SERVIDOR EXPRESS - BOCATTO VALLEY API
 * ========================================
 */

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/database.js';

// Importar rutas
import authRoutes from './routes/authRoutes.js';
import ambienteRoutes from './routes/ambienteRoutes.js';
import reservacionRoutes from './routes/reservacionRoutes.js';

// Cargar variables de entorno
dotenv.config();

// Conectar a MongoDB Atlas
connectDB();

// Inicializar Express
const app = express();

// ==========================================
// MIDDLEWARES
// ==========================================

// Body parser - Leer datos del body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser(process.env.COOKIE_SECRET));

// CORS - Permitir peticiones desde el frontend
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = process.env.CORS_ORIGIN 
            ? process.env.CORS_ORIGIN.split(',') 
            : ['http://localhost:5500', 'http://127.0.0.1:5500'];

        // Permitir requests sin origin (como mobile apps o curl)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true, // Permitir cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Logging en desarrollo
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// ==========================================
// RUTAS
// ==========================================

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🍔 Bienvenido a Bocatto Valley API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            ambientes: '/api/ambientes',
            reservaciones: '/api/reservaciones'
        }
    });
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de ambientes
app.use('/api/ambientes', ambienteRoutes);

// Rutas de reservaciones
app.use('/api/reservaciones', reservacionRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'API funcionando correctamente',
        timestamp: new Date().toISOString(),
        database: 'connected'
    });
});

// ==========================================
// MANEJO DE ERRORES
// ==========================================

// Ruta no encontrada
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Ruta no encontrada: ${req.originalUrl}`
    });
});

// Manejador de errores general
app.use((err, req, res, next) => {
    console.error('Error:', err);

    // Error de CORS
    if (err.message === 'No permitido por CORS') {
        return res.status(403).json({
            success: false,
            message: 'Acceso CORS denegado'
        });
    }

    // Error de MongoDB
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'ID de recurso inválido'
        });
    }

    // Error de validación de Mongoose
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            success: false,
            message: messages.join(', ')
        });
    }

    // Error de duplicado (email único, etc.)
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            success: false,
            message: `El ${field} ya está registrado`
        });
    }

    // Error genérico
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Error del servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log('========================================');
    console.log('🚀 SERVIDOR INICIADO CORRECTAMENTE');
    console.log('========================================');
    console.log(`📍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Puerto: ${PORT}`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api`);
    console.log('========================================\n');
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
    console.error('❌ ERROR NO MANEJADO:', err.message);
    console.error(err);
    server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
    console.error('❌ EXCEPCIÓN NO CAPTURADA:', err.message);
    console.error(err);
    process.exit(1);
});

export default app;
