import Ambiente from '../models/Ambiente.js';

/**
 * @desc    Obtener ambientes activos (para clientes)
 * @route   GET /api/ambientes
 * @access  Public
 */
export const obtenerAmbientes = async (req, res) => {
  try {
    const ambientes = await Ambiente.obtenerActivos();
    
    res.status(200).json({
      success: true,
      count: ambientes.length,
      data: ambientes
    });
  } catch (error) {
    console.error('Error al obtener ambientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los ambientes',
      error: error.message
    });
  }
};

/**
 * @desc    Obtener un ambiente por ID
 * @route   GET /api/ambientes/:id
 * @access  Public
 */
export const obtenerAmbiente = async (req, res) => {
  try {
    const ambiente = await Ambiente.findById(req.params.id);
    
    if (!ambiente) {
      return res.status(404).json({
        success: false,
        message: 'Ambiente no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: ambiente
    });
  } catch (error) {
    console.error('Error al obtener ambiente:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el ambiente',
      error: error.message
    });
  }
};

/**
 * @desc    Crear un nuevo ambiente
 * @route   POST /api/ambientes
 * @access  Private/Admin
 */
export const crearAmbiente = async (req, res) => {
  try {
    // Verificar que el usuario sea admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para crear ambientes'
      });
    }

    const ambiente = await Ambiente.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Ambiente creado exitosamente',
      data: ambiente
    });
  } catch (error) {
    console.error('Error al crear ambiente:', error);
    
    // Manejar error de duplicado
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un ambiente con ese nombre'
      });
    }
    
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
      message: 'Error al crear el ambiente',
      error: error.message
    });
  }
};

/**
 * @desc    Actualizar un ambiente
 * @route   PUT /api/ambientes/:id
 * @access  Private/Admin
 */
export const actualizarAmbiente = async (req, res) => {
  try {
    // Verificar que el usuario sea admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para actualizar ambientes'
      });
    }

    const ambiente = await Ambiente.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!ambiente) {
      return res.status(404).json({
        success: false,
        message: 'Ambiente no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Ambiente actualizado exitosamente',
      data: ambiente
    });
  } catch (error) {
    console.error('Error al actualizar ambiente:', error);
    
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
      message: 'Error al actualizar el ambiente',
      error: error.message
    });
  }
};

/**
 * @desc    Eliminar (desactivar) un ambiente
 * @route   DELETE /api/ambientes/:id
 * @access  Private/Admin
 */
export const eliminarAmbiente = async (req, res) => {
  try {
    // Verificar que el usuario sea admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar ambientes'
      });
    }

    const ambiente = await Ambiente.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );
    
    if (!ambiente) {
      return res.status(404).json({
        success: false,
        message: 'Ambiente no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Ambiente desactivado exitosamente',
      data: ambiente
    });
  } catch (error) {
    console.error('Error al eliminar ambiente:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el ambiente',
      error: error.message
    });
  }
};

/**
 * @desc    Obtener todos los ambientes (incluyendo inactivos)
 * @route   GET /api/ambientes/admin/todos
 * @access  Private/Admin
 */
export const obtenerTodosAmbientes = async (req, res) => {
  try {
    // Verificar que el usuario sea admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver todos los ambientes'
      });
    }

    const ambientes = await Ambiente.find().sort({ orden: 1, nombre: 1 });
    
    res.status(200).json({
      success: true,
      count: ambientes.length,
      data: ambientes
    });
  } catch (error) {
    console.error('Error al obtener ambientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los ambientes',
      error: error.message
    });
  }
};
