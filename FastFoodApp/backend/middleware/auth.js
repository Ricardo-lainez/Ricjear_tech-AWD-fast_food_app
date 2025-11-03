/**
 * ========================================
 * MIDDLEWARE DE AUTENTICACIÓN
 * ========================================
 * Protege rutas y verifica permisos de usuario
 */

import User from '../models/User.js';
import { verifyToken } from '../utils/jwt.js';

/**
 * Protege rutas - Verifica que el usuario esté autenticado
 */
export const protect = async (req, res, next) => {
    try {
        let token;

        // Verificar si el token viene en el header Authorization
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // O si viene en cookies
        else if (req.cookies.token) {
            token = req.cookies.token;
        }

        // Verificar que existe el token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado. Por favor, inicia sesión.'
            });
        }

        try {
            // Verificar token
            const decoded = verifyToken(token);

            // Obtener usuario del token
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            if (!user.isActive) {
                return res.status(403).json({
                    success: false,
                    message: 'Cuenta desactivada'
                });
            }

            // Agregar usuario al request
            req.user = user;
            next();

        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido o expirado. Por favor, inicia sesión nuevamente.'
            });
        }

    } catch (error) {
        console.error('Error en middleware de autenticación:', error);
        res.status(500).json({
            success: false,
            message: 'Error en la autenticación'
        });
    }
};

/**
 * Verifica que el usuario tenga ciertos roles
 * @param  {...string} roles - Roles permitidos ('client', 'administrator')
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `El rol '${req.user.role}' no tiene permisos para acceder a este recurso`
            });
        }
        next();
    };
};

/**
 * Middleware específico para rutas de administrador
 */
export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'administrator') {
        return res.status(403).json({
            success: false,
            message: 'Acceso denegado. Se requieren permisos de administrador.'
        });
    }
    next();
};

/**
 * Middleware para verificar que el usuario sea dueño del recurso o admin
 */
export const isOwnerOrAdmin = (paramName = 'id') => {
    return (req, res, next) => {
        const resourceUserId = req.params[paramName];
        
        // Si es admin, permitir acceso
        if (req.user.role === 'administrator') {
            return next();
        }

        // Si es el dueño del recurso, permitir acceso
        if (req.user.id === resourceUserId || req.user._id.toString() === resourceUserId) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: 'No tienes permisos para acceder a este recurso'
        });
    };
};
