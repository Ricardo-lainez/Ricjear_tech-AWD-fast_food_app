/**
 * ========================================
 * SEED - POBLAR BASE DE DATOS
 * ========================================
 * Crea usuarios iniciales para testing
 */

import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import User from '../models/User.js';

// Cargar variables de entorno
dotenv.config();

// Usuarios iniciales para la base de datos
const users = [
    {
        firstName: 'Admin',
        lastName: 'Bocatto',
        email: 'admin@adminbocatto.com',
        password: 'adminPass123',
        phone: '0999999999',
        address: 'Quito, Ecuador',
        isActive: true,
        role: 'administrator',
        acceso: 'FULL_ACCESS',
        adminAcceso: 'SUPER_ADMIN'
    },
    {
        firstName: 'Cliente',
        lastName: 'Demo',
        email: 'cliente@bocatto.com',
        password: 'cliente123',
        phone: '0988888888',
        address: 'Guayaquil, Ecuador',
        isActive: true,
        role: 'client',
        loyaltyPoints: 100,
        preferences: ''
    },
    {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        password: '123456',
        phone: '0987654321',
        address: 'Cuenca, Ecuador',
        isActive: true,
        role: 'client',
        loyaltyPoints: 50,
        preferences: ''
    }
];

/**
 * Importar datos a la base de datos
 */
const importData = async () => {
    try {
        await connectDB();

        // Limpiar usuarios existentes
        await User.deleteMany();
        console.log('🗑️  Usuarios anteriores eliminados');

        // Crear nuevos usuarios
        const createdUsers = await User.create(users);
        console.log(`✅ ${createdUsers.length} usuarios creados exitosamente`);

        console.log('\n========================================');
        console.log('USUARIOS CREADOS:');
        console.log('========================================');
        createdUsers.forEach(user => {
            console.log(`\n👤 ${user.fullName}`);
            console.log(`   📧 Email: ${user.email}`);
            console.log(`   🔑 Rol: ${user.role}`);
            console.log(`   🆔 ID: ${user._id}`);
        });
        console.log('========================================\n');

        process.exit(0);

    } catch (error) {
        console.error('❌ Error al importar datos:', error);
        process.exit(1);
    }
};

/**
 * Eliminar todos los datos
 */
const deleteData = async () => {
    try {
        await connectDB();

        await User.deleteMany();
        console.log('🗑️  Todos los usuarios eliminados');

        process.exit(0);

    } catch (error) {
        console.error('❌ Error al eliminar datos:', error);
        process.exit(1);
    }
};

// Ejecutar según argumento de línea de comandos
if (process.argv[2] === '-d' || process.argv[2] === '--delete') {
    deleteData();
} else {
    importData();
}
