/**
 * ========================================
 * RUTAS DE AUTENTICACIÓN
 * ========================================
 */

import express from 'express';
import {
    register,
    login,
    logout,
    getCurrentUser,
    updateProfile,
    changePassword,
    getAllUsers,
    getUserStatistics
} from '../controllers/authController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// ==========================================
// RUTAS PÚBLICAS (sin autenticación)
// ==========================================
router.post('/register', register);
router.post('/login', login);

// ==========================================
// RUTAS PRIVADAS (requieren autenticación)
// ==========================================
router.post('/logout', protect, logout);
router.get('/me', protect, getCurrentUser);
router.put('/update-profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

// ==========================================
// RUTAS DE ADMINISTRADOR
// ==========================================
router.get('/users', protect, isAdmin, getAllUsers);
router.get('/statistics', protect, isAdmin, getUserStatistics);

export default router;
