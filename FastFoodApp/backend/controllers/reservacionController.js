import Reservacion from '../models/Reservacion.js';
import Ambiente from '../models/Ambiente.js';

// @desc    Obtener todas las reservaciones (Admin: todas, Cliente: solo sus reservaciones)
// @route   GET /api/reservaciones
// @access  Private
export const obtenerReservaciones = async (req, res) => {
    try {
        const { estado, fechaDesde, fechaHasta, ambienteId } = req.query;
        
        // Construir filtro
        let filtro = {};
        
        // Si no es admin, solo puede ver sus propias reservaciones
        if (req.user.role !== 'admin') {
            filtro.cliente = req.user._id;
        }
        
        // Filtros adicionales
        if (estado) {
            filtro.estado = estado;
        }
        
        if (ambienteId) {
            filtro.ambiente = ambienteId;
        }
        
        if (fechaDesde || fechaHasta) {
            filtro.fechaReservacion = {};
            if (fechaDesde) {
                filtro.fechaReservacion.$gte = new Date(fechaDesde);
            }
            if (fechaHasta) {
                filtro.fechaReservacion.$lte = new Date(fechaHasta);
            }
        }
        
        const reservaciones = await Reservacion.find(filtro)
            .populate('cliente', 'nombre apellido email telefono')
            .populate('ambiente', 'nombre imagenUrl capacidadMax')
            .sort({ fechaReservacion: -1, horaInicio: -1 });
        
        res.json({
            success: true,
            count: reservaciones.length,
            data: reservaciones
        });
    } catch (error) {
        console.error('Error al obtener reservaciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las reservaciones',
            error: error.message
        });
    }
};

// @desc    Obtener una reservación por ID
// @route   GET /api/reservaciones/:id
// @access  Private
export const obtenerReservacion = async (req, res) => {
    try {
        const reservacion = await Reservacion.findById(req.params.id)
            .populate('cliente', 'nombre apellido email telefono')
            .populate('ambiente', 'nombre descripcion imagenUrl capacidadMin capacidadMax caracteristicas');
        
        if (!reservacion) {
            return res.status(404).json({
                success: false,
                message: 'Reservación no encontrada'
            });
        }
        
        // Verificar permisos: solo el cliente dueño o admin pueden ver
        if (req.user.role !== 'admin' && reservacion.cliente._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para ver esta reservación'
            });
        }
        
        res.json({
            success: true,
            data: reservacion
        });
    } catch (error) {
        console.error('Error al obtener reservación:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la reservación',
            error: error.message
        });
    }
};

// @desc    Crear nueva reservación
// @route   POST /api/reservaciones
// @access  Private
export const crearReservacion = async (req, res) => {
    try {
        const {
            ambienteId,
            fechaReservacion,
            horaInicio,
            horaFin,
            numeroPersonas,
            ocasionEspecial,
            comentarios
        } = req.body;
        
        // Validar que el ambiente existe
        const ambiente = await Ambiente.findById(ambienteId);
        if (!ambiente) {
            return res.status(404).json({
                success: false,
                message: 'Ambiente no encontrado'
            });
        }
        
        if (!ambiente.activo) {
            return res.status(400).json({
                success: false,
                message: 'Este ambiente no está disponible actualmente'
            });
        }
        
        // Validar capacidad
        if (numeroPersonas < ambiente.capacidadMin || numeroPersonas > ambiente.capacidadMax) {
            return res.status(400).json({
                success: false,
                message: `El número de personas debe estar entre ${ambiente.capacidadMin} y ${ambiente.capacidadMax}`
            });
        }
        
        // Verificar disponibilidad
        const disponible = await Reservacion.verificarDisponibilidad(
            ambienteId,
            new Date(fechaReservacion),
            horaInicio,
            horaFin
        );
        
        if (!disponible) {
            return res.status(400).json({
                success: false,
                message: 'El ambiente no está disponible en el horario seleccionado'
            });
        }
        
        // Crear reservación
        const reservacion = await Reservacion.create({
            cliente: req.user._id,
            ambiente: ambienteId,
            fechaReservacion,
            horaInicio,
            horaFin,
            numeroPersonas,
            ocasionEspecial: ocasionEspecial || '',
            comentarios: comentarios || '',
            estado: 'pendiente'
        });
        
        // Poblar datos para respuesta
        await reservacion.populate([
            { path: 'cliente', select: 'nombre apellido email telefono' },
            { path: 'ambiente', select: 'nombre descripcion imagenUrl' }
        ]);
        
        res.status(201).json({
            success: true,
            message: 'Reservación creada exitosamente',
            data: reservacion
        });
    } catch (error) {
        console.error('Error al crear reservación:', error);
        
        // Manejar errores de validación
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
            message: 'Error al crear la reservación',
            error: error.message
        });
    }
};

// @desc    Actualizar reservación
// @route   PUT /api/reservaciones/:id
// @access  Private
export const actualizarReservacion = async (req, res) => {
    try {
        let reservacion = await Reservacion.findById(req.params.id);
        
        if (!reservacion) {
            return res.status(404).json({
                success: false,
                message: 'Reservación no encontrada'
            });
        }
        
        // Verificar permisos
        if (req.user.role !== 'admin' && reservacion.cliente.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para modificar esta reservación'
            });
        }
        
        // No permitir modificar reservaciones canceladas o completadas
        if (['cancelada', 'completada'].includes(reservacion.estado)) {
            return res.status(400).json({
                success: false,
                message: `No se puede modificar una reservación ${reservacion.estado}`
            });
        }
        
        const {
            fechaReservacion,
            horaInicio,
            horaFin,
            numeroPersonas,
            ocasionEspecial,
            comentarios
        } = req.body;
        
        // Si se modifican fecha u horario, verificar disponibilidad
        if (fechaReservacion || horaInicio || horaFin) {
            const nuevaFecha = fechaReservacion ? new Date(fechaReservacion) : reservacion.fechaReservacion;
            const nuevaHoraInicio = horaInicio || reservacion.horaInicio;
            const nuevaHoraFin = horaFin || reservacion.horaFin;
            
            const disponible = await Reservacion.verificarDisponibilidad(
                reservacion.ambiente,
                nuevaFecha,
                nuevaHoraInicio,
                nuevaHoraFin,
                reservacion._id // Excluir la reservación actual de la verificación
            );
            
            if (!disponible) {
                return res.status(400).json({
                    success: false,
                    message: 'El ambiente no está disponible en el nuevo horario seleccionado'
                });
            }
        }
        
        // Si se modifica el número de personas, verificar capacidad
        if (numeroPersonas) {
            const ambiente = await Ambiente.findById(reservacion.ambiente);
            if (numeroPersonas < ambiente.capacidadMin || numeroPersonas > ambiente.capacidadMax) {
                return res.status(400).json({
                    success: false,
                    message: `El número de personas debe estar entre ${ambiente.capacidadMin} y ${ambiente.capacidadMax}`
                });
            }
        }
        
        // Actualizar campos permitidos
        const camposActualizables = {
            fechaReservacion,
            horaInicio,
            horaFin,
            numeroPersonas,
            ocasionEspecial,
            comentarios
        };
        
        // Filtrar undefined
        Object.keys(camposActualizables).forEach(key => 
            camposActualizables[key] === undefined && delete camposActualizables[key]
        );
        
        reservacion = await Reservacion.findByIdAndUpdate(
            req.params.id,
            camposActualizables,
            { new: true, runValidators: true }
        ).populate([
            { path: 'cliente', select: 'nombre apellido email telefono' },
            { path: 'ambiente', select: 'nombre descripcion imagenUrl' }
        ]);
        
        res.json({
            success: true,
            message: 'Reservación actualizada exitosamente',
            data: reservacion
        });
    } catch (error) {
        console.error('Error al actualizar reservación:', error);
        
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
            message: 'Error al actualizar la reservación',
            error: error.message
        });
    }
};

// @desc    Cancelar reservación
// @route   PATCH /api/reservaciones/:id/cancelar
// @access  Private
export const cancelarReservacion = async (req, res) => {
    try {
        const reservacion = await Reservacion.findById(req.params.id);
        
        if (!reservacion) {
            return res.status(404).json({
                success: false,
                message: 'Reservación no encontrada'
            });
        }
        
        // Verificar permisos
        if (req.user.role !== 'admin' && reservacion.cliente.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para cancelar esta reservación'
            });
        }
        
        // Usar método del modelo
        await reservacion.cancelar();
        
        await reservacion.populate([
            { path: 'cliente', select: 'nombre apellido email telefono' },
            { path: 'ambiente', select: 'nombre descripcion imagenUrl' }
        ]);
        
        res.json({
            success: true,
            message: 'Reservación cancelada exitosamente',
            data: reservacion
        });
    } catch (error) {
        console.error('Error al cancelar reservación:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Confirmar reservación (Admin only)
// @route   PATCH /api/reservaciones/:id/confirmar
// @access  Private/Admin
export const confirmarReservacion = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Solo los administradores pueden confirmar reservaciones'
            });
        }
        
        const reservacion = await Reservacion.findById(req.params.id);
        
        if (!reservacion) {
            return res.status(404).json({
                success: false,
                message: 'Reservación no encontrada'
            });
        }
        
        await reservacion.confirmar();
        
        await reservacion.populate([
            { path: 'cliente', select: 'nombre apellido email telefono' },
            { path: 'ambiente', select: 'nombre descripcion imagenUrl' }
        ]);
        
        res.json({
            success: true,
            message: 'Reservación confirmada exitosamente',
            data: reservacion
        });
    } catch (error) {
        console.error('Error al confirmar reservación:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Marcar reservación como completada (Admin only)
// @route   PATCH /api/reservaciones/:id/completar
// @access  Private/Admin
export const completarReservacion = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Solo los administradores pueden completar reservaciones'
            });
        }
        
        const reservacion = await Reservacion.findById(req.params.id);
        
        if (!reservacion) {
            return res.status(404).json({
                success: false,
                message: 'Reservación no encontrada'
            });
        }
        
        if (reservacion.estado !== 'confirmada') {
            return res.status(400).json({
                success: false,
                message: 'Solo se pueden completar reservaciones confirmadas'
            });
        }
        
        reservacion.estado = 'completada';
        await reservacion.save();
        
        await reservacion.populate([
            { path: 'cliente', select: 'nombre apellido email telefono' },
            { path: 'ambiente', select: 'nombre descripcion imagenUrl' }
        ]);
        
        res.json({
            success: true,
            message: 'Reservación completada exitosamente',
            data: reservacion
        });
    } catch (error) {
        console.error('Error al completar reservación:', error);
        res.status(500).json({
            success: false,
            message: 'Error al completar la reservación',
            error: error.message
        });
    }
};

// @desc    Obtener reservaciones del cliente autenticado
// @route   GET /api/reservaciones/mis-reservaciones
// @access  Private
export const obtenerMisReservaciones = async (req, res) => {
    try {
        const { estado } = req.query;
        
        const filtro = { cliente: req.user._id };
        
        if (estado) {
            filtro.estado = estado;
        }
        
        const reservaciones = await Reservacion.find(filtro)
            .populate('ambiente', 'nombre imagenUrl capacidadMax badge rating')
            .sort({ fechaReservacion: -1, horaInicio: -1 });
        
        res.json({
            success: true,
            count: reservaciones.length,
            data: reservaciones
        });
    } catch (error) {
        console.error('Error al obtener mis reservaciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener tus reservaciones',
            error: error.message
        });
    }
};

// @desc    Verificar disponibilidad de un ambiente
// @route   POST /api/reservaciones/verificar-disponibilidad
// @access  Public
export const verificarDisponibilidad = async (req, res) => {
    try {
        const { ambienteId, fechaReservacion, horaInicio, horaFin } = req.body;
        
        if (!ambienteId || !fechaReservacion || !horaInicio || !horaFin) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }
        
        const disponible = await Reservacion.verificarDisponibilidad(
            ambienteId,
            new Date(fechaReservacion),
            horaInicio,
            horaFin
        );
        
        res.json({
            success: true,
            disponible,
            message: disponible 
                ? 'El ambiente está disponible' 
                : 'El ambiente no está disponible en ese horario'
        });
    } catch (error) {
        console.error('Error al verificar disponibilidad:', error);
        res.status(500).json({
            success: false,
            message: 'Error al verificar disponibilidad',
            error: error.message
        });
    }
};
