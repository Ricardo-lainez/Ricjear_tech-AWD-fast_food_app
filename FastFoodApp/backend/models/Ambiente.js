import mongoose from 'mongoose';

/**
 * Modelo de Ambiente para Reservaciones
 * Representa los diferentes espacios disponibles en el restaurante
 */
const ambienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del ambiente es requerido'],
    unique: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true
  },
  capacidadMin: {
    type: Number,
    required: [true, 'La capacidad mínima es requerida'],
    min: [1, 'La capacidad mínima debe ser al menos 1']
  },
  capacidadMax: {
    type: Number,
    required: [true, 'La capacidad máxima es requerida'],
    min: [1, 'La capacidad máxima debe ser al menos 1'],
    validate: {
      validator: function(value) {
        return value >= this.capacidadMin;
      },
      message: 'La capacidad máxima debe ser mayor o igual a la capacidad mínima'
    }
  },
  caracteristicas: [{
    type: String,
    trim: true
  }],
  imagenUrl: {
    type: String,
    default: '../images/home/menu.jpg'
  },
  badge: {
    icono: {
      type: String,
      default: 'fa-users'
    },
    texto: {
      type: String
    },
    clase: {
      type: String,
      default: ''
    }
  },
  rating: {
    promedio: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalResenas: {
      type: Number,
      default: 0
    }
  },
  activo: {
    type: Boolean,
    default: true
  },
  orden: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para mejorar búsquedas
// Nota: `nombre` ya declara `unique: true` en el schema, lo que crea
// automáticamente un índice. Evitamos crear el mismo índice dos veces.
ambienteSchema.index({ activo: 1, orden: 1 });

// Virtual para generar el ID del ambiente (slug)
ambienteSchema.virtual('ambienteId').get(function() {
  return this.nombre.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/[^a-z0-9-]/g, '');
});

// Virtual para texto del badge
ambienteSchema.virtual('badgeTexto').get(function() {
  if (this.badge && this.badge.texto) {
    return this.badge.texto;
  }
  return `${this.capacidadMin}-${this.capacidadMax} personas`;
});

// Método para actualizar rating
ambienteSchema.methods.actualizarRating = async function(nuevoRating) {
  const totalActual = this.rating.promedio * this.rating.totalResenas;
  this.rating.totalResenas += 1;
  this.rating.promedio = (totalActual + nuevoRating) / this.rating.totalResenas;
  await this.save();
};

// Método estático para obtener ambientes activos
ambienteSchema.statics.obtenerActivos = function() {
  return this.find({ activo: true }).sort({ orden: 1, nombre: 1 });
};

const Ambiente = mongoose.model('Ambiente', ambienteSchema);

export default Ambiente;
