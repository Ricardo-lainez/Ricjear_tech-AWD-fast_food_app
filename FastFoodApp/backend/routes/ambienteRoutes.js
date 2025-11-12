import express from 'express';
import {
    obtenerAmbientes,
    obtenerAmbiente,
    crearAmbiente,
    actualizarAmbiente,
    eliminarAmbiente,
    obtenerTodosAmbientes
} from '../controllers/ambienteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.get('/', obtenerAmbientes);
router.get('/:id', obtenerAmbiente);

// Rutas protegidas (Admin)
router.post('/', protect, crearAmbiente);
router.put('/:id', protect, actualizarAmbiente);
router.delete('/:id', protect, eliminarAmbiente);
router.get('/admin/todos', protect, obtenerTodosAmbientes);

export default router;
