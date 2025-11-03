/**
 * ========================================
 * UTILIDADES JWT - JSON WEB TOKEN
 * ========================================
 * Genera y verifica tokens de autenticación
 */

import jwt from 'jsonwebtoken';

/**
 * Genera un JWT token para el usuario
 * @param {string} userId - ID del usuario
 * @returns {string} Token JWT
 */
export const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE || '7d'
        }
    );
};

/**
 * Verifica un JWT token
 * @param {string} token - Token a verificar
 * @returns {Object} Payload del token decodificado
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Token inválido o expirado');
    }
};

/**
 * Envía token en cookie y respuesta JSON
 * @param {Object} user - Usuario
 * @param {number} statusCode - Código de estado HTTP
 * @param {Object} res - Objeto response de Express
 * @param {string} message - Mensaje de respuesta
 */
export const sendTokenResponse = (user, statusCode, res, message) => {
    // Generar token
    const token = generateToken(user._id);

    // Opciones de cookie
    const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
        httpOnly: true, // Previene XSS attacks
        secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
        sameSite: 'strict' // Previene CSRF attacks
    };

    // Obtener datos seguros del usuario
    const userData = user.getSafeData ? user.getSafeData() : user;

    res
        .status(statusCode)
        .cookie('token', token, cookieOptions)
        .json({
            success: true,
            message,
            token,
            user: userData
        });
};
