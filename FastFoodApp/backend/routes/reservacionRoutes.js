import express from 'express';
import {
    obtenerReservaciones,
    obtenerReservacion,
    crearReservacion,
    actualizarReservacion,
    cancelarReservacion,
    confirmarReservacion,
    completarReservacion,
    obtenerMisReservaciones,
    verificarDisponibilidad
} from '../controllers/reservacionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Rutas publicas
router.post('/verificar-disponibilidad', verificarDisponibilidad);

// Rutas protegidas
router.use(protect); // Todas las rutas siguientes requieren autenticacion

router.get('/', obtenerReservaciones);
router.get('/mis-reservaciones', obtenerMisReservaciones);
router.get('/:id', obtenerReservacion);
router.post('/', crearReservacion);
router.put('/:id', actualizarReservacion);
router.patch('/:id/cancelar', cancelarReservacion);
router.patch('/:id/confirmar', confirmarReservacion);
router.patch('/:id/completar', completarReservacion);

export default router;