import mongoose from 'mongoose';

/**
 * Modelo de Reservación
 * Gestiona las reservas de los clientes en diferentes ambientes
 */
const reservacionSchema = new mongoose.Schema({
  numeroReservacion: {
    type: String,
    unique: true,
    required: true
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El cliente es requerido']
  },
  ambiente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ambiente',
    required: [true, 'El ambiente es requerido']
  },
  fechaReservacion: {
    type: Date,
    required: [true, 'La fecha de reservación es requerida']
  },
  horaInicio: {
    type: String,
    required: [true, 'La hora de inicio es requerida'],
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido (HH:MM)']
  },
  horaFin: {
    type: String,
    required: [true, 'La hora de fin es requerida'],
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido (HH:MM)']
  },
  numeroPersonas: {
    type: Number,
    required: [true, 'El número de personas es requerido'],
    min: [1, 'Debe haber al menos 1 persona']
  },
  ocasionEspecial: {
    type: String,
    enum: ['', 'cumpleaños', 'aniversario', 'cita-romantica', 'negocios', 'otro'],
    default: ''
  },
  comentarios: {
    type: String,
    maxlength: [500, 'Los comentarios no pueden exceder 500 caracteres']
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmada', 'cancelada', 'completada', 'no-asistio'],
    default: 'confirmada'
  },
  pagado: {
    type: Boolean,
    default: false
  },
  montoPago: {
    type: Number,
    default: 0
  },
  metodoPago: {
    type: String,
    enum: ['', 'efectivo', 'tarjeta', 'transferencia'],
    default: ''
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para mejorar rendimiento
// Nota: `numeroReservacion` se define con `unique: true` en el schema,
// lo que ya crea un índice único. Evitar volver a declararlo con
// `schema.index(...)` para no generar warnings de índices duplicados.
reservacionSchema.index({ cliente: 1, fechaReservacion: -1 });
reservacionSchema.index({ ambiente: 1, fechaReservacion: 1 });
reservacionSchema.index({ estado: 1 });
reservacionSchema.index({ fechaReservacion: 1, horaInicio: 1 });

// Pre-save: Generar número de reservación único
reservacionSchema.pre('save', async function(next) {
  if (this.isNew && !this.numeroReservacion) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.numeroReservacion = `RES-${timestamp.slice(-6)}${random}`;
  }
  next();
});

// Método para verificar disponibilidad
reservacionSchema.statics.verificarDisponibilidad = async function(ambienteId, fecha, horaInicio, horaFin, reservacionId = null) {
  const query = {
    ambiente: ambienteId,
    fechaReservacion: new Date(fecha),
    estado: { $in: ['pendiente', 'confirmada'] },
    $or: [
      {
        // La nueva reserva inicia durante una reserva existente
        $and: [
          { horaInicio: { $lte: horaInicio } },
          { horaFin: { $gt: horaInicio } }
        ]
      },
      {
        // La nueva reserva termina durante una reserva existente
        $and: [
          { horaInicio: { $lt: horaFin } },
          { horaFin: { $gte: horaFin } }
        ]
      },
      {
        // La nueva reserva contiene completamente a una existente
        $and: [
          { horaInicio: { $gte: horaInicio } },
          { horaFin: { $lte: horaFin } }
        ]
      }
    ]
  };

  // Si es una actualización, excluir la reserva actual
  if (reservacionId) {
    query._id = { $ne: reservacionId };
  }

  const conflictos = await this.find(query);
  return conflictos.length === 0;
};

// Método para cancelar reservación
reservacionSchema.methods.cancelar = async function(motivo = '') {
  this.estado = 'cancelada';
  if (motivo) {
    this.comentarios = this.comentarios 
      ? `${this.comentarios}\n\nMotivo de cancelación: ${motivo}`
      : `Motivo de cancelación: ${motivo}`;
  }
  await this.save();
  return this;
};

// Método para confirmar reservación
reservacionSchema.methods.confirmar = async function() {
  this.estado = 'confirmada';
  await this.save();
  return this;
};

// Virtual para obtener fecha formateada
reservacionSchema.virtual('fechaFormateada').get(function() {
  return this.fechaReservacion.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

const Reservacion = mongoose.model('Reservacion', reservacionSchema);

export default Reservacion;
