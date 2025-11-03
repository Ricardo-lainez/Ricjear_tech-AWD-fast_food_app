/**
 * ========================================
 * MODELO DE USUARIO - BASADO EN UML
 * ========================================
 * Implementa la jerarquía User -> Client/Administrator del diagrama UML
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

/**
 * Schema base de Usuario (según UML: User)
 * Campos comunes a Client y Administrator
 */
const userSchema = new Schema({
    // Campos básicos del UML: User
    firstName: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        maxlength: [50, 'El nombre no puede tener más de 50 caracteres']
    },
    lastName: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
        trim: true,
        maxlength: [50, 'El apellido no puede tener más de 50 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Por favor ingresa un email válido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
        select: false // No incluir password en las consultas por defecto
    },
    phone: {
        type: String,
        trim: true,
        match: [/^\d{10}$/, 'El teléfono debe tener 10 dígitos']
    },
    address: {
        type: String,
        trim: true,
        maxlength: [200, 'La dirección no puede tener más de 200 caracteres']
    },
    registrationDate: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    
    // Discriminador de tipo: 'client' o 'administrator'
    role: {
        type: String,
        enum: ['client', 'administrator'],
        required: true,
        default: 'client'
    },

    // ==========================================
    // CAMPOS ESPECÍFICOS DE CLIENT (UML: Client)
    // ==========================================
    loyaltyPoints: {
        type: Number,
        default: 0,
        min: [0, 'Los puntos de lealtad no pueden ser negativos']
    },
    preferences: {
        type: String,
        trim: true,
        maxlength: [500, 'Las preferencias no pueden tener más de 500 caracteres']
    },

    // ==========================================
    // CAMPOS ESPECÍFICOS DE ADMINISTRATOR (UML: Administrator)
    // ==========================================
    acceso: {
        type: String,
        enum: ['FULL_ACCESS', 'LIMITED_ACCESS', 'READ_ONLY'],
        default: function() {
            return this.role === 'administrator' ? 'LIMITED_ACCESS' : undefined;
        }
    },
    adminAcceso: {
        type: String,
        enum: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'],
        default: function() {
            return this.role === 'administrator' ? 'ADMIN' : undefined;
        }
    },

    // ==========================================
    // CAMPOS ADICIONALES ÚTILES
    // ==========================================
    lastLogin: {
        type: Date
    },
    passwordChangedAt: {
        type: Date
    },
    passwordResetToken: String,
    passwordResetExpires: Date

}, {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    collection: 'users' // Nombre de la colección en MongoDB
});

// ==========================================
// MIDDLEWARE PRE-SAVE: Hash de contraseña
// ==========================================
userSchema.pre('save', async function(next) {
    // Solo hashear si la contraseña fue modificada
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generar salt y hashear
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        
        // Actualizar fecha de cambio de contraseña
        if (!this.isNew) {
            this.passwordChangedAt = Date.now() - 1000; // -1s para asegurar que el token JWT sea posterior
        }
        
        next();
    } catch (error) {
        next(error);
    }
});

// ==========================================
// MÉTODOS DE INSTANCIA (UML: User methods)
// ==========================================

/**
 * Valida las credenciales del usuario (UML: validateCredentials())
 * @param {string} candidatePassword - Contraseña a validar
 * @returns {Promise<boolean>}
 */
userSchema.methods.validateCredentials = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Actualiza el perfil del usuario (UML: Client.updateProfile())
 * @param {Object} updates - Campos a actualizar
 * @returns {Promise<Object>}
 */
userSchema.methods.updateProfile = async function(updates) {
    const allowedUpdates = ['firstName', 'lastName', 'phone', 'address', 'preferences'];
    
    Object.keys(updates).forEach(key => {
        if (allowedUpdates.includes(key)) {
            this[key] = updates[key];
        }
    });

    return await this.save();
};

/**
 * Cambia la contraseña del usuario (UML: User.changePassword())
 * @param {string} newPassword - Nueva contraseña
 * @returns {Promise<void>}
 */
userSchema.methods.changePassword = async function(newPassword) {
    this.password = newPassword;
    this.passwordChangedAt = Date.now();
    return await this.save();
};

/**
 * Actualiza fecha del último login (UML: User.login())
 * @returns {Promise<void>}
 */
userSchema.methods.updateLastLogin = async function() {
    this.lastLogin = Date.now();
    return await this.save({ validateBeforeSave: false });
};

/**
 * Obtiene datos seguros del usuario (sin contraseña)
 * @returns {Object}
 */
userSchema.methods.getSafeData = function() {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.passwordResetToken;
    delete userObject.passwordResetExpires;
    delete userObject.__v;
    return userObject;
};

// ==========================================
// MÉTODOS ESTÁTICOS (consultas a nivel de modelo)
// ==========================================

/**
 * Busca un usuario por email
 * @param {string} email 
 * @returns {Promise<Object>}
 */
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email.toLowerCase() });
};

/**
 * Busca usuarios por rol
 * @param {string} role - 'client' o 'administrator'
 * @returns {Promise<Array>}
 */
userSchema.statics.findByRole = function(role) {
    return this.find({ role, isActive: true });
};

/**
 * Obtiene estadísticas de usuarios
 * @returns {Promise<Object>}
 */
userSchema.statics.getStatistics = async function() {
    const total = await this.countDocuments();
    const clients = await this.countDocuments({ role: 'client', isActive: true });
    const admins = await this.countDocuments({ role: 'administrator', isActive: true });
    const inactive = await this.countDocuments({ isActive: false });

    return { total, clients, admins, inactive };
};

// ==========================================
// ÍNDICES PARA OPTIMIZAR CONSULTAS
// ==========================================
userSchema.index({ email: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ registrationDate: -1 });

// ==========================================
// VIRTUAL PROPERTIES
// ==========================================
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Asegurar que los virtuals se incluyan en JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// ==========================================
// EXPORTAR MODELO
// ==========================================
const User = mongoose.model('User', userSchema);

export default User;
