/**
 * ========================================
 * CONTROLADOR PRODUCTOS - BOCATTO VALLEY
 * ========================================
 * Maneja todas las operaciones relacionadas con productos del menú
 */

import Product from '../models/Product.js';

// ==========================================
// OBTENER TODOS LOS PRODUCTOS DISPONIBLES
// ==========================================

/**
 * @desc    Obtener todos los productos disponibles
 * @route   GET /api/products
 * @access  Public
 */
export const obtenerTodosLosProductos = async (req, res) => {
    try {
        const productos = await Product.find().sort({ creationDate: 1 });
        
        // Actualizar productos sin productId en la base de datos
        let needsUpdate = false;
        const productosConId = await Promise.all(productos.map(async (producto, index) => {
            const productoObj = producto.toObject();
            if (!productoObj.productId || productoObj.productId === 0) {
                const nuevoId = index + 1;
                productoObj.productId = nuevoId;
                // Actualizar en la base de datos
                await Product.findByIdAndUpdate(producto._id, { productId: nuevoId });
                needsUpdate = true;
            }
            return productoObj;
        }));
        
        res.status(200).json({
            success: true,
            count: productosConId.length,
            data: productosConId
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los productos',
            error: error.message
        });
    }
};

// ==========================================
// OBTENER PRODUCTO POR ID
// ==========================================

/**
 * @desc    Obtener un producto específico por ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const obtenerProductoPorId = async (req, res) => {
    try {
        const producto = await Product.findById(req.params.id);
        
        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        if (!producto.available) {
            return res.status(404).json({
                success: false,
                message: 'Producto no disponible actualmente'
            });
        }

        res.status(200).json({
            success: true,
            data: producto
        });
    } catch (error) {
        console.error('Error al obtener producto por ID:', error);
        
        // Error de ObjectId inválido
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID de producto inválido'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al obtener el producto',
            error: error.message
        });
    }
};

// ==========================================
// FILTRAR POR CATEGORÍA
// ==========================================

/**
 * @desc    Filtrar productos por categoría
 * @route   GET /api/products/category/:categoria
 * @access  Public
 */
export const obtenerProductosPorCategoria = async (req, res) => {
    try {
        const { categoria } = req.params;
        
        // Validar que la categoría sea válida
        const categoriasValidas = [
            'Entradas y Snacks',
            'Platos principales o combos',
            'Postres',
            'Bebidas',
            'Cócteles'
        ];

        if (!categoriasValidas.includes(categoria)) {
            return res.status(400).json({
                success: false,
                message: 'Categoría no válida',
                categoriasDisponibles: categoriasValidas
            });
        }

        const productos = await Product.filtrarPorCategoria(categoria);
        
        res.status(200).json({
            success: true,
            categoria: categoria,
            count: productos.length,
            data: productos
        });
    } catch (error) {
        console.error('Error al filtrar productos por categoría:', error);
        res.status(500).json({
            success: false,
            message: 'Error al filtrar productos por categoría',
            error: error.message
        });
    }
};

// ==========================================
// FILTRAR POR SUBCATEGORÍA
// ==========================================

/**
 * @desc    Filtrar productos por subcategoría
 * @route   GET /api/products/subcategory/:subcategoria
 * @access  Public
 */
export const obtenerProductosPorSubcategoria = async (req, res) => {
    try {
        const { subcategoria } = req.params;
        
        const productos = await Product.filtrarPorSubcategoria(subcategoria);
        
        res.status(200).json({
            success: true,
            subcategoria: subcategoria,
            count: productos.length,
            data: productos
        });
    } catch (error) {
        console.error('Error al filtrar productos por subcategoría:', error);
        res.status(500).json({
            success: false,
            message: 'Error al filtrar productos por subcategoría',
            error: error.message
        });
    }
};

// ==========================================
// OBTENER CATEGORÍAS DISPONIBLES
// ==========================================

/**
 * @desc    Obtener lista de categorías con productos disponibles
 * @route   GET /api/products/categories
 * @access  Public
 */
export const obtenerCategorias = async (req, res) => {
    try {
        const categorias = await Product.obtenerCategorias();
        
        res.status(200).json({
            success: true,
            count: categorias.length,
            data: categorias
        });
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las categorías',
            error: error.message
        });
    }
};

// ==========================================
// OBTENER SUBCATEGORÍAS POR CATEGORÍA
// ==========================================

/**
 * @desc    Obtener subcategorías de una categoría específica
 * @route   GET /api/products/category/:categoria/subcategories
 * @access  Public
 */
export const obtenerSubcategoriasPorCategoria = async (req, res) => {
    try {
        const { categoria } = req.params;
        
        const subcategorias = await Product.obtenerSubcategoriasPorCategoria(categoria);
        
        res.status(200).json({
            success: true,
            categoria: categoria,
            count: subcategorias.length,
            data: subcategorias
        });
    } catch (error) {
        console.error('Error al obtener subcategorías:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las subcategorías',
            error: error.message
        });
    }
};

// ==========================================
// BUSCAR PRODUCTOS POR TEXTO
// ==========================================

/**
 * @desc    Buscar productos por nombre o descripción
 * @route   GET /api/products/search?q=texto
 * @access  Public
 */
export const buscarProductos = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q || q.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: 'El término de búsqueda debe tener al menos 2 caracteres'
            });
        }

        const productos = await Product.buscarPorTexto(q.trim());
        
        res.status(200).json({
            success: true,
            query: q,
            count: productos.length,
            data: productos
        });
    } catch (error) {
        console.error('Error al buscar productos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al buscar productos',
            error: error.message
        });
    }
};

// ==========================================
// OBTENER PRODUCTOS POPULARES
// ==========================================

/**
 * @desc    Obtener productos marcados como populares
 * @route   GET /api/products/popular
 * @access  Public
 */
export const obtenerProductosPopulares = async (req, res) => {
    try {
        const productos = await Product.obtenerPopulares();
        
        res.status(200).json({
            success: true,
            count: productos.length,
            data: productos
        });
    } catch (error) {
        console.error('Error al obtener productos populares:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener productos populares',
            error: error.message
        });
    }
};

// ==========================================
// OBTENER ESTADÍSTICAS DE PRODUCTOS
// ==========================================

/**
 * @desc    Obtener estadísticas generales de productos
 * @route   GET /api/products/stats
 * @access  Public
 */
export const obtenerEstadisticasProductos = async (req, res) => {
    try {
        const totalProductos = await Product.countDocuments();
        const productosDisponibles = await Product.countDocuments({ available: true });
        const productosSinStock = await Product.countDocuments({ currentStock: 0 });
        
        // Contar productos por categoría
        const productosPorCategoria = await Product.aggregate([
            {
                $match: { available: true }
            },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    averagePrice: { $avg: '$price' }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalProductos,
                productosDisponibles,
                productosSinStock,
                productosPorCategoria
            }
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas de productos',
            error: error.message
        });
    }
};

// ==========================================
// CREAR NUEVO PRODUCTO (ADMIN)
// ==========================================

/**
 * @desc    Crear un nuevo producto
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const crearProducto = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            img,
            available,
            currentStock,
            category,
            subcategory,
            ingredients,
            nutritionalInfo,
            allergens,
            spiceLevel,
            preparationTime,
            tags
        } = req.body;

        // Validar campos requeridos
        if (!name || !description || !price || !img || !category) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos: name, description, price, img, category'
            });
        }

        // Crear producto
        const producto = await Product.create({
            name,
            description,
            price,
            img,
            available: available !== undefined ? available : true,
            currentStock: currentStock || 0,
            category,
            subcategory,
            ingredients,
            nutritionalInfo,
            allergens,
            spiceLevel,
            preparationTime,
            tags
        });

        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: producto
        });
    } catch (error) {
        console.error('Error al crear producto:', error);
        
        // Error de validación de Mongoose
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Error de validación',
                errors: messages
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al crear el producto',
            error: error.message
        });
    }
};

// ==========================================
// ACTUALIZAR PRODUCTO (ADMIN)
// ==========================================

/**
 * @desc    Actualizar un producto existente
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Buscar y actualizar producto
        const producto = await Product.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true, // Devolver el documento actualizado
                runValidators: true // Ejecutar validaciones del schema
            }
        );

        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Producto actualizado exitosamente',
            data: producto
        });
    } catch (error) {
        console.error('Error al actualizar producto:', error);

        // Error de ObjectId inválido
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID de producto inválido'
            });
        }

        // Error de validación
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Error de validación',
                errors: messages
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al actualizar el producto',
            error: error.message
        });
    }
};

// ==========================================
// ELIMINAR PRODUCTO (ADMIN)
// ==========================================

/**
 * @desc    Eliminar un producto
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const producto = await Product.findByIdAndDelete(id);

        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Producto eliminado exitosamente',
            data: producto
        });
    } catch (error) {
        console.error('Error al eliminar producto:', error);

        // Error de ObjectId inválido
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID de producto inválido'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al eliminar el producto',
            error: error.message
        });
    }
};