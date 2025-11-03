/**
 * ========================================
 * CONTROLADOR DE AUTENTICACIÓN
 * ========================================
 * Maneja login, registro, logout y operaciones de usuarios
 */

import User from '../models/User.js';
import { sendTokenResponse } from '../utils/jwt.js';

/**
 * @desc    Registrar nuevo usuario (cliente)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, address, preferences } = req.body;

        // Validar campos requeridos
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Por favor, completa todos los campos requeridos'
            });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Este correo electrónico ya está registrado'
            });
        }

        // Crear nuevo usuario (siempre como cliente)
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            phone,
            address,
            preferences,
            role: 'client',
            loyaltyPoints: 0
        });

        // Actualizar último login
        await user.updateLastLogin();

        // Enviar token de autenticación
        sendTokenResponse(
            user,
            201,
            res,
            '¡Cuenta creada exitosamente! Bienvenido a Bocatto Valley.'
        );

    } catch (error) {
        console.error('Error en registro:', error);
        
        // Errores de validación de Mongoose
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al crear la cuenta. Por favor, intenta nuevamente.'
        });
    }
};

/**
 * @desc    Login de usuario
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar que se proporcionen email y password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Por favor, proporciona email y contraseña'
            });
        }

        // Buscar usuario y incluir password (normalmente excluido)
        const user = await User.findOne({ email: email.toLowerCase() })
            .select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }

        // Verificar que el usuario esté activo
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Esta cuenta ha sido desactivada. Contacta con soporte.'
            });
        }

        // Validar contraseña
        const isPasswordValid = await user.validateCredentials(password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }

        // Actualizar último login
        await user.updateLastLogin();

        // Enviar token de autenticación
        sendTokenResponse(
            user,
            200,
            res,
            'Inicio de sesión exitoso'
        );

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión. Por favor, intenta nuevamente.'
        });
    }
};

/**
 * @desc    Logout de usuario
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res) => {
    try {
        // Limpiar cookie del token
        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 1000), // Expira en 1 segundo
            httpOnly: true
        });

        res.status(200).json({
            success: true,
            message: 'Sesión cerrada correctamente'
        });

    } catch (error) {
        console.error('Error en logout:', error);
        res.status(500).json({
            success: false,
            message: 'Error al cerrar sesión'
        });
    }
};

/**
 * @desc    Obtener usuario actual
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getCurrentUser = async (req, res) => {
    try {
        // El usuario viene del middleware de autenticación
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            user: user.getSafeData()
        });

    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener información del usuario'
        });
    }
};

/**
 * @desc    Actualizar perfil de usuario
 * @route   PUT /api/auth/update-profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone, address, preferences } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Actualizar perfil
        await user.updateProfile({
            firstName,
            lastName,
            phone,
            address,
            preferences
        });

        res.status(200).json({
            success: true,
            message: 'Perfil actualizado correctamente',
            user: user.getSafeData()
        });

    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al actualizar el perfil'
        });
    }
};

/**
 * @desc    Cambiar contraseña
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Proporciona la contraseña actual y la nueva'
            });
        }

        // Obtener usuario con password
        const user = await User.findById(req.user.id).select('+password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Verificar contraseña actual
        const isPasswordValid = await user.validateCredentials(currentPassword);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'La contraseña actual es incorrecta'
            });
        }

        // Validar nueva contraseña
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'La nueva contraseña debe tener al menos 6 caracteres'
            });
        }

        // Cambiar contraseña
        await user.changePassword(newPassword);

        res.status(200).json({
            success: true,
            message: 'Contraseña cambiada correctamente'
        });

    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        res.status(500).json({
            success: false,
            message: 'Error al cambiar la contraseña'
        });
    }
};

/**
 * @desc    Obtener todos los usuarios (solo admin)
 * @route   GET /api/auth/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})
            .select('-password')
            .sort({ registrationDate: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuarios'
        });
    }
};

/**
 * @desc    Obtener estadísticas de usuarios (solo admin)
 * @route   GET /api/auth/statistics
 * @access  Private/Admin
 */
export const getUserStatistics = async (req, res) => {
    try {
        const stats = await User.getStatistics();

        res.status(200).json({
            success: true,
            statistics: stats
        });

    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas'
        });
    }
};
