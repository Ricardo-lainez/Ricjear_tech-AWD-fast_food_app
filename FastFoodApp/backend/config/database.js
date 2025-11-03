/**
 * ========================================
 * CONFIGURACIÓN DE CONEXIÓN A MONGODB ATLAS
 * ========================================
 * Maneja la conexión a la base de datos MongoDB Atlas
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Establece la conexión con MongoDB Atlas
 * @returns {Promise<void>}
 */
const connectDB = async () => {
    try {
        // Opciones de conexión
        const options = {
            // useNewUrlParser y useUnifiedTopology ya no son necesarios en Mongoose 6+
            // pero las incluimos por compatibilidad
            maxPoolSize: 10, // Número máximo de conexiones en el pool
            serverSelectionTimeoutMS: 5000, // Timeout para seleccionar servidor
            socketTimeoutMS: 45000, // Timeout para operaciones
        };

        // Conectar a MongoDB Atlas
        const conn = await mongoose.connect(process.env.MONGODB_URI, options);

        console.log('========================================');
        console.log('✅ MongoDB Atlas Conectado Exitosamente');
        console.log('========================================');
        console.log(`📍 Host: ${conn.connection.host}`);
        console.log(`📊 Base de Datos: ${conn.connection.name}`);
        console.log(`🔗 Puerto: ${conn.connection.port}`);
        console.log(`📡 Estado: ${conn.connection.readyState === 1 ? 'Conectado' : 'Desconectado'}`);
        console.log('========================================\n');

    } catch (error) {
        console.error('========================================');
        console.error('❌ ERROR AL CONECTAR A MONGODB ATLAS');
        console.error('========================================');
        console.error('Mensaje:', error.message);
        console.error('\n🔧 Posibles soluciones:');
        console.error('1. Verifica que tu MONGODB_URI sea correcta en el archivo .env');
        console.error('2. Asegúrate de haber reemplazado <password> con tu contraseña real');
        console.error('3. Verifica que tu IP esté en la whitelist de MongoDB Atlas');
        console.error('4. Comprueba tu conexión a internet');
        console.error('5. Revisa que el nombre de usuario y contraseña sean correctos');
        console.error('========================================\n');
        
        // Salir del proceso con error
        process.exit(1);
    }
};

/**
 * Maneja el cierre graceful de la conexión
 */
const gracefulShutdown = async () => {
    try {
        await mongoose.connection.close();
        console.log('\n🔌 Conexión a MongoDB cerrada correctamente');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error al cerrar la conexión:', error);
        process.exit(1);
    }
};

// Event listeners para la conexión
mongoose.connection.on('error', (err) => {
    console.error('❌ Error en la conexión de MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB desconectado');
});

mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconectado');
});

// Manejo de señales de terminación
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

export default connectDB;
