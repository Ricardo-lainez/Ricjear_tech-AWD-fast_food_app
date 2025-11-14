/**
 * ========================================
 * RUTAS PRODUCTOS - BOCATTO VALLEY
 * ========================================
 * Define todos los endpoints relacionados con productos del menú
 */

import express from 'express';
import {
    obtenerTodosLosProductos,
    obtenerProductoPorId,
    obtenerProductosPorCategoria,
    obtenerProductosPorSubcategoria,
    obtenerCategorias,
    obtenerSubcategoriasPorCategoria,
    buscarProductos,
    obtenerProductosPopulares,
    obtenerEstadisticasProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} from '../controllers/productController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// ==========================================
// RUTAS PÚBLICAS - NO REQUIEREN AUTENTICACIÓN
// ==========================================

/**
 * @route   GET /api/products
 * @desc    Obtener todos los productos disponibles
 * @access  Public
 */
router.get('/', obtenerTodosLosProductos);

/**
 * @route   GET /api/products/categories
 * @desc    Obtener lista de categorías disponibles
 * @access  Public
 */
router.get('/categories', obtenerCategorias);

/**
 * @route   GET /api/products/popular
 * @desc    Obtener productos populares/destacados
 * @access  Public
 */
router.get('/popular', obtenerProductosPopulares);

/**
 * @route   GET /api/products/stats
 * @desc    Obtener estadísticas generales de productos
 * @access  Public
 */
router.get('/stats', obtenerEstadisticasProductos);

/**
 * @route   GET /api/products/search
 * @desc    Buscar productos por nombre o descripción
 * @query   ?q=texto_busqueda
 * @access  Public
 */
router.get('/search', buscarProductos);

/**
 * @route   GET /api/products/category/:categoria
 * @desc    Filtrar productos por categoría
 * @params  categoria - Nombre de la categoría
 * @access  Public
 */
router.get('/category/:categoria', obtenerProductosPorCategoria);

/**
 * @route   GET /api/products/category/:categoria/subcategories
 * @desc    Obtener subcategorías de una categoría específica
 * @params  categoria - Nombre de la categoría
 * @access  Public
 */
router.get('/category/:categoria/subcategories', obtenerSubcategoriasPorCategoria);

/**
 * @route   GET /api/products/subcategory/:subcategoria
 * @desc    Filtrar productos por subcategoría
 * @params  subcategoria - Nombre de la subcategoría
 * @access  Public
 */
router.get('/subcategory/:subcategoria', obtenerProductosPorSubcategoria);

/**
 * @route   GET /api/products/:id
 * @desc    Obtener un producto específico por ID
 * @params  id - ID del producto
 * @access  Public
 * @note    Esta ruta debe ir al final para evitar conflictos con otras rutas
 */
router.get('/:id', obtenerProductoPorId);

// ==========================================
// RUTAS PROTEGIDAS - SOLO ADMINISTRADORES
// ==========================================

/**
 * @route   POST /api/products
 * @desc    Crear un nuevo producto
 * @access  Private/Admin
 */
router.post('/', protect, isAdmin, crearProducto);

/**
 * @route   PUT /api/products/:id
 * @desc    Actualizar un producto existente
 * @params  id - ID del producto
 * @access  Private/Admin
 */
router.put('/:id', protect, isAdmin, actualizarProducto);

/**
 * @route   DELETE /api/products/:id
 * @desc    Eliminar un producto
 * @params  id - ID del producto
 * @access  Private/Admin
 */
router.delete('/:id', protect, isAdmin, eliminarProducto);

// ==========================================
// EXPORTAR ROUTER
// ==========================================

export default router;