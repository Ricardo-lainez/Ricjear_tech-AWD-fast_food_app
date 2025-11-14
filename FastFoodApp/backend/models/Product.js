/**
 * Modelo para gestionar productos del menú
 */

import mongoose from 'mongoose';

// Schema para información nutricional
const nutritionalInfoSchema = new mongoose.Schema({
    calories: {
        type: Number,
        min: 0
    },
    protein: {
        type: String,
        trim: true
    },
    carbs: {
        type: String,
        trim: true
    },
    fat: {
        type: String,
        trim: true
    }
}, { _id: false });

// Schema principal del producto
const productSchema = new mongoose.Schema({
    // ==========================================
    // ID NUMÉRICO PERSONALIZADO
    // ==========================================
    productId: {
        type: Number,
        unique: true
    },

    // ==========================================
    // INFORMACIÓN BÁSICA
    // ==========================================
    name: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
        trim: true,
        maxLength: [100, 'El nombre no puede exceder 100 caracteres']
    },

    description: {
        type: String,
        required: [true, 'La descripción del producto es obligatoria'],
        trim: true,
        maxLength: [500, 'La descripción no puede exceder 500 caracteres']
    },

    price: {
        type: Number,
        required: [true, 'El precio del producto es obligatorio'],
        min: [0, 'El precio no puede ser negativo']
    },

    img: {
        type: String,
        required: [true, 'La imagen del producto es obligatoria'],
        trim: true
    },

    // ==========================================
    // DISPONIBILIDAD E INVENTARIO
    // ==========================================
    available: {
        type: Boolean,
        default: true
    },

    currentStock: {
        type: Number,
        default: 0,
        min: [0, 'El stock no puede ser negativo']
    },

    // ==========================================
    // CATEGORIZACIÓN
    // ==========================================
    category: {
        type: String,
        required: [true, 'La categoría del producto es obligatoria'],
        enum: {
            values: [
                'Entradas y Snacks',
                'Platos principales o combos',
                'Postres',
                'Bebidas',
                'Cócteles'
            ],
            message: 'La categoría debe ser una de las opciones válidas'
        }
    },

    subcategory: {
        type: String,
        trim: true,
        validate: {
            validator: function(subcategory) {
                // Validar subcategorías según la categoría
                const validSubcategories = {
                    'Entradas y Snacks': ['Alitas', 'Nuggets', 'Dedos de queso', 'Aros de cebolla'],
                    'Platos principales o combos': [
                        'Combos de Alitas',
                        'Combos de Pizza', 
                        'Combos de Hamburguesas',
                        'Platos fuertes estilo americano',
                        'Combos Tex-Mex'
                    ],
                    'Postres': ['Brownies', 'Cheesecake'],
                    'Bebidas': ['Gaseosas', 'Agua natural'],
                    'Cócteles': ['Mojito', 'Margarita', 'Cuba libre']
                };

                if (!subcategory) return true; // Subcategoría es opcional

                const validSubs = validSubcategories[this.category] || [];
                return validSubs.includes(subcategory);
            },
            message: 'La subcategoría no es válida para esta categoría'
        }
    },

    // ==========================================
    // INFORMACIÓN ADICIONAL
    // ==========================================
    ingredients: [{
        type: String,
        trim: true
    }],

    nutritionalInfo: nutritionalInfoSchema,

    allergens: [{
        type: String,
        enum: ['gluten', 'lactosa', 'nueces', 'mariscos', 'huevo', 'soja'],
        trim: true
    }],

    spiceLevel: {
        type: String,
        enum: ['sin picante', 'suave', 'medio', 'picante', 'muy picante'],
        default: 'sin picante'
    },

    preparationTime: {
        type: Number,
        min: [1, 'El tiempo de preparación debe ser al menos 1 minuto'],
        max: [120, 'El tiempo de preparación no puede exceder 120 minutos']
    },

    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],

    creationDate: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ==========================================
// ÍNDICES PARA OPTIMIZAR CONSULTAS
// ==========================================
productSchema.index({ category: 1 });
productSchema.index({ subcategory: 1 });
productSchema.index({ available: 1 });
productSchema.index({ name: 'text', description: 'text' });

// ==========================================
// MÉTODOS ESTÁTICOS (Para usar en controladores)
// ==========================================

/**
 * Obtener todos los productos disponibles
 */
productSchema.statics.obtenerDisponibles = function() {
    return this.find({ available: true })
               .sort({ category: 1, name: 1 });
};

/**
 * Filtrar productos por categoría
 */
productSchema.statics.filtrarPorCategoria = function(categoria) {
    return this.find({ 
        category: categoria,
        available: true 
    }).sort({ name: 1 });
};

/**
 * Filtrar productos por subcategoría
 */
productSchema.statics.filtrarPorSubcategoria = function(subcategoria) {
    return this.find({ 
        subcategory: subcategoria,
        available: true 
    }).sort({ name: 1 });
};

/**
 * Obtener todas las categorías disponibles
 */
productSchema.statics.obtenerCategorias = function() {
    return this.distinct('category', { available: true });
};

/**
 * Obtener subcategorías por categoría
 */
productSchema.statics.obtenerSubcategoriasPorCategoria = function(categoria) {
    return this.distinct('subcategory', { 
        category: categoria,
        available: true,
        subcategory: { $ne: null, $ne: '' }
    });
};

/**
 * Buscar productos por texto
 */
productSchema.statics.buscarPorTexto = function(texto) {
    return this.find({
        $text: { $search: texto },
        available: true
    }).sort({ score: { $meta: 'textScore' } });
};

/**
 * Obtener productos populares (por tags)
 */
productSchema.statics.obtenerPopulares = function() {
    return this.find({
        tags: 'popular',
        available: true
    }).limit(6).sort({ name: 1 });
};

// ==========================================
// MÉTODOS DE INSTANCIA
// ==========================================

/**
 * Actualizar stock del producto
 */
productSchema.methods.actualizarStock = function(nuevaCantidad) {
    this.currentStock = nuevaCantidad;
    
    // Auto-actualizar disponibilidad según stock
    this.available = nuevaCantidad > 0;
    
    return this.save();
};

/**
 * Cambiar disponibilidad
 */
productSchema.methods.cambiarDisponibilidad = function(disponible) {
    this.available = disponible;
    return this.save();
};

/**
 * Verificar si el producto está en stock
 */
productSchema.methods.enStock = function() {
    return this.currentStock > 0 && this.available;
};

// ==========================================
// MIDDLEWARE PRE-SAVE
// ==========================================

// Auto-incrementar productId antes de crear nuevo producto
productSchema.pre('save', async function(next) {
    // Solo generar productId si es un documento nuevo
    if (this.isNew && !this.productId) {
        try {
            const Product = this.constructor;
            
            // Buscar el máximo productId actual
            const maxProduct = await Product.findOne()
                .sort({ productId: -1 })
                .select('productId')
                .lean();
            
            // Contar total de productos
            const totalProductos = await Product.countDocuments();
            
            // Usar el mayor entre el max productId y el total de productos
            const maxId = maxProduct?.productId || 0;
            this.productId = Math.max(maxId, totalProductos) + 1;
        } catch (error) {
            return next(error);
        }
    }
    
    // Si no hay stock, marcar como no disponible
    if (this.currentStock <= 0) {
        this.available = false;
    }
    
    next();
});

// ==========================================
// EXPORTAR MODELO
// ==========================================

const Product = mongoose.model('Product', productSchema);

export default Product;