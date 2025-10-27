// Sistema de Reservaciones - Bocatto Valley
// ==========================================
// CONFIGURACIÓN DE AMBIENTES
// ==========================================

/**
 * Definición de ambientes con sus capacidades
 * Basado en el UML: Reservation -> Table
 * En el futuro, esto vendrá de la base de datos
 */
const AMBIENTES_CONFIG = {
    'salon-principal': {
        nombre: 'Salón Principal',
        capacidadMin: 2,
        capacidadMax: 8,
        descripcion: 'Ambiente acogedor y elegante ideal para cenas románticas o reuniones íntimas'
    },
    'terraza-vip': {
        nombre: 'Terraza VIP',
        capacidadMin: 4,
        capacidadMax: 12,
        descripcion: 'Espacio premium al aire libre con vista panorámica'
    },
    'salon-familiar': {
        nombre: 'Salón Familiar',
        capacidadMin: 6,
        capacidadMax: 15,
        descripcion: 'Espacio amplio y confortable diseñado para grupos grandes y familias'
    },
    'bar-lounge': {
        nombre: 'Bar Lounge',
        capacidadMin: 2,
        capacidadMax: 6,
        descripcion: 'Ambiente relajado con cócteles premium y música en vivo'
    }
};

// Datos de ejemplo de comentarios por ambiente
const comentariosPorAmbiente = {
    'salon-principal': [
        {
            usuario: 'María González',
            fecha: '15 Oct 2025',
            rating: 5,
            texto: 'Excelente ambiente para una cena romántica. La atención fue impecable y la comida deliciosa. Totalmente recomendado.'
        },
        {
            usuario: 'Carlos Mendoza',
            fecha: '10 Oct 2025',
            rating: 5,
            texto: 'Perfecto para celebraciones íntimas. El servicio es excepcional y la atmósfera muy acogedora.'
        },
        {
            usuario: 'Ana Torres',
            fecha: '05 Oct 2025',
            rating: 4,
            texto: 'Muy buena experiencia. La música ambiental y la decoración crean un ambiente muy agradable.'
        }
    ],
    'terraza-vip': [
        {
            usuario: 'Roberto Silva',
            fecha: '18 Oct 2025',
            rating: 5,
            texto: 'La terraza VIP superó nuestras expectativas. La vista es espectacular y el servicio exclusivo hace que valga totalmente la pena.'
        },
        {
            usuario: 'Laura Martínez',
            fecha: '12 Oct 2025',
            rating: 5,
            texto: 'Celebramos nuestro aniversario aquí y fue perfecto. La decoración personalizada y la atención al detalle son increíbles.'
        },
        {
            usuario: 'Diego Ramírez',
            fecha: '08 Oct 2025',
            rating: 5,
            texto: 'Ambiente premium en todo sentido. Ideal para ocasiones especiales. El staff es muy profesional.'
        }
    ],
    'salon-familiar': [
        {
            usuario: 'Patricia Vargas',
            fecha: '16 Oct 2025',
            rating: 5,
            texto: 'Perfecto para ir con niños. El área de juegos mantuvo a mis hijos entretenidos mientras disfrutábamos la comida.'
        },
        {
            usuario: 'Fernando López',
            fecha: '11 Oct 2025',
            rating: 4,
            texto: 'Espacio amplio y cómodo para grupos grandes. El menú infantil es variado y saludable.'
        },
        {
            usuario: 'Sofía Herrera',
            fecha: '06 Oct 2025',
            rating: 5,
            texto: 'Organizamos la reunión familiar aquí y fue excelente. Todos quedamos muy contentos con la atención y la comida.'
        }
    ],
    'bar-lounge': [
        {
            usuario: 'Andrés Morales',
            fecha: '17 Oct 2025',
            rating: 5,
            texto: 'El mejor bar lounge de la zona. Los cócteles son espectaculares y la música en vivo es increíble.'
        },
        {
            usuario: 'Valentina Cruz',
            fecha: '13 Oct 2025',
            rating: 5,
            texto: 'Ambiente nocturno perfecto. El happy hour ofrece excelentes promociones y el bartender es muy creativo.'
        },
        {
            usuario: 'Javier Ruiz',
            fecha: '09 Oct 2025',
            rating: 4,
            texto: 'Gran lugar para una salida con amigos. La variedad de bebidas es impresionante y el ambiente muy relajado.'
        }
    ]
};

// Datos de mesas reservadas (simulación para frontend)
const reservasExistentes = {
    '2025-10-20': {
        '19:00': ['salon-principal', 'terraza-vip'],
        '20:00': ['bar-lounge'],
        '21:00': ['salon-familiar']
    },
    '2025-10-21': {
        '13:00': ['salon-principal'],
        '19:00': ['terraza-vip', 'salon-familiar'],
        '20:30': ['bar-lounge']
    }
};

let ambienteSeleccionado = '';
let capacidadActual = { min: 1, max: 10 }; // Se actualizará según el ambiente

// ==========================================
// FUNCIONES PRINCIPALES
// ==========================================

/**
 * Abre el modal de reserva y configura el ambiente seleccionado
 * Basado en UML: Reservation.checkAvailability()
 * @param {string} ambiente - ID del ambiente
 */
function abrirModalReserva(ambiente) {
    ambienteSeleccionado = ambiente;
    const config = AMBIENTES_CONFIG[ambiente];
    
    if (!config) {
        console.error('Ambiente no encontrado:', ambiente);
        return;
    }
    
    const modal = document.getElementById('modalReserva');
    const titulo = document.getElementById('modalAmbienteTitulo');
    
    // Actualizar título
    titulo.textContent = `Reservar Mesa - ${config.nombre}`;
    
    // Actualizar capacidad actual
    capacidadActual = {
        min: config.capacidadMin,
        max: config.capacidadMax
    };
    
    // Actualizar selector de personas según capacidad del ambiente
    actualizarSelectorPersonas(config.capacidadMin, config.capacidadMax);
    
    // Cargar comentarios del ambiente
    cargarComentarios(ambiente);
    
    // Configurar fecha mínima (hoy)
    const fechaInput = document.getElementById('fecha');
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.setAttribute('min', hoy);
    
    modal.style.display = 'block';
}

/**
 * Actualiza dinámicamente el selector de personas según la capacidad del ambiente
 * @param {number} min - Capacidad mínima
 * @param {number} max - Capacidad máxima
 */
function actualizarSelectorPersonas(min, max) {
    const personasSelect = document.getElementById('personas');
    const capacityHint = document.getElementById('capacityHint');
    
    if (!personasSelect) return;
    
    // Limpiar opciones existentes
    personasSelect.innerHTML = '<option value="">Seleccionar</option>';
    
    // Generar opciones según capacidad
    for (let i = min; i <= max; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} ${i === 1 ? 'persona' : 'personas'}`;
        personasSelect.appendChild(option);
    }
    
    // Actualizar hint de capacidad
    if (capacityHint) {
        capacityHint.textContent = `Este ambiente permite entre ${min} y ${max} personas`;
        capacityHint.style.color = '#28a745';
    }
    
    // Agregar opción informativa si alguien necesita más espacio
    if (max < 15) {
        const optionInfo = document.createElement('option');
        optionInfo.value = '';
        optionInfo.textContent = `¿Más de ${max} personas? Contáctanos`;
        optionInfo.disabled = true;
        optionInfo.style.fontStyle = 'italic';
        personasSelect.appendChild(optionInfo);
    }
}

/**
 * Cierra el modal de reserva y resetea el formulario
 */
function cerrarModalReserva() {
    const modal = document.getElementById('modalReserva');
    modal.style.display = 'none';
    document.getElementById('formReserva').reset();
    document.getElementById('disponibilidadTexto').textContent = 'Selecciona fecha y hora para verificar disponibilidad';
    document.getElementById('disponibilidadTexto').parentElement.className = 'disponibilidad-info';
    
    // Resetear variables
    ambienteSeleccionado = '';
    capacidadActual = { min: 1, max: 10 };
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modalReserva = document.getElementById('modalReserva');
    if (event.target === modalReserva) {
        cerrarModalReserva();
    }
}

// Función para cargar comentarios
function cargarComentarios(ambiente) {
    const comentariosLista = document.getElementById('comentariosLista');
    const comentarios = comentariosPorAmbiente[ambiente] || [];
    
    if (comentarios.length === 0) {
        comentariosLista.innerHTML = '<p style="color: #888; text-align: center;">No hay reseñas aún para este ambiente.</p>';
        return;
    }
    
    let html = '';
    comentarios.forEach(comentario => {
        const estrellas = '★'.repeat(comentario.rating) + '☆'.repeat(5 - comentario.rating);
        html += `
            <div class="comentario-item">
                <div class="comentario-header">
                    <span class="comentario-usuario">${comentario.usuario}</span>
                    <span class="comentario-fecha">${comentario.fecha}</span>
                </div>
                <div class="comentario-rating">
                    ${[...Array(comentario.rating)].map(() => '<i class="fa fa-star"></i>').join('')}
                    ${[...Array(5 - comentario.rating)].map(() => '<i class="fa fa-star-o"></i>').join('')}
                </div>
                <p class="comentario-texto">${comentario.texto}</p>
            </div>
        `;
    });
    
    comentariosLista.innerHTML = html;
}

/**
 * Verifica la disponibilidad del ambiente en la fecha y hora seleccionadas
 * Basado en UML: Reservation.checkAvailability()
 * En producción, consultará la base de datos
 */
function verificarDisponibilidad() {
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const disponibilidadDiv = document.querySelector('.disponibilidad-info');
    const disponibilidadTexto = document.getElementById('disponibilidadTexto');
    const btnConfirmar = document.querySelector('.btn-confirmar-reserva');
    
    if (!fecha || !hora) {
        disponibilidadTexto.textContent = 'Selecciona fecha y hora para verificar disponibilidad';
        disponibilidadDiv.className = 'disponibilidad-info';
        btnConfirmar.disabled = false;
        return;
    }
    
    // Verificar si existe reserva (simulado - en producción será consulta a BD)
    const reservado = reservasExistentes[fecha]?.[hora]?.includes(ambienteSeleccionado);
    
    if (reservado) {
        disponibilidadTexto.textContent = '⚠️ No disponible - Esta mesa ya está reservada para la fecha y hora seleccionadas';
        disponibilidadDiv.className = 'disponibilidad-info no-disponible';
        btnConfirmar.disabled = true;
    } else {
        disponibilidadTexto.textContent = '✓ ¡Disponible! Puedes proceder con tu reserva';
        disponibilidadDiv.className = 'disponibilidad-info disponible';
        btnConfirmar.disabled = false;
    }
}

// Event listeners para verificar disponibilidad
document.addEventListener('DOMContentLoaded', function() {
    const fechaInput = document.getElementById('fecha');
    const horaSelect = document.getElementById('hora');
    
    if (fechaInput) {
        fechaInput.addEventListener('change', verificarDisponibilidad);
    }
    
    if (horaSelect) {
        horaSelect.addEventListener('change', verificarDisponibilidad);
    }
    
    // Manejar envío del formulario
    const formReserva = document.getElementById('formReserva');
    if (formReserva) {
        formReserva.addEventListener('submit', function(e) {
            e.preventDefault();
            confirmarReserva();
        });
    }
});

/**
 * Confirma y guarda la reserva
 * Basado en UML: Reservation.confirmReservation() y Reservation.sendConfirmation()
 * En producción, guardará en base de datos y enviará confirmación por email
 */
function confirmarReserva() {
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const personas = document.getElementById('personas').value;
    const ocasion = document.getElementById('ocasion').value;
    const comentarios = document.getElementById('comentarios').value;
    
    // Validar campos requeridos
    if (!fecha || !hora || !personas) {
        alert('Por favor completa todos los campos requeridos');
        return;
    }
    
    // Validar que el número de personas esté dentro del rango
    const numPersonas = parseInt(personas);
    if (numPersonas < capacidadActual.min || numPersonas > capacidadActual.max) {
        alert(`Este ambiente solo permite entre ${capacidadActual.min} y ${capacidadActual.max} personas.\nPor favor, selecciona un número válido.`);
        return;
    }
    
    // TODO: Cuando se implemente BD, aquí se hará:
    // 1. POST /api/reservations
    // 2. Reservation.blockTimeSlot()
    // 3. Reservation.sendConfirmation()
    // 4. Payment.processPayment() si requiere pago adelantado
    
    const config = AMBIENTES_CONFIG[ambienteSeleccionado];
    
    // Crear objeto de reserva según estructura del UML
    const reservaData = {
        // id: generado por BD
        // reservationNumber: generado por BD
        clienteID: null, // Obtener del usuario logueado
        ambiente: config.nombre,
        ambienteID: ambienteSeleccionado,
        reservationDate: new Date(fecha + 'T' + hora),
        startTime: hora,
        endTime: calcularHoraFin(hora), // Agregar 2 horas por defecto
        numberOfPeople: numPersonas,
        status: 'confirmed', // pending, confirmed, cancelled
        specialNotes: comentarios || '',
        ocasion: ocasion || '',
        isPaid: false,
        createdAt: new Date()
    };
    
    // Mensaje de confirmación
    const mensaje = `
        ✅ ¡Reserva Confirmada! 
        
        📍 Ambiente: ${config.nombre}
        📅 Fecha: ${new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        ⏰ Hora: ${hora}
        👥 Personas: ${numPersonas}
        ${ocasion ? `🎉 Ocasión: ${ocasion}` : ''}
        ${comentarios ? `📝 Notas: ${comentarios}` : ''}
        
        ¡Te esperamos en Bocatto Valley!
        
        Recibirás un correo de confirmación con los detalles de tu reserva.
    `;
    
    alert(mensaje);
    
    // Simular guardado en BD (localStorage temporal)
    guardarReservaLocal(reservaData);
    
    // Actualizar reservas existentes para simular ocupación
    if (!reservasExistentes[fecha]) {
        reservasExistentes[fecha] = {};
    }
    if (!reservasExistentes[fecha][hora]) {
        reservasExistentes[fecha][hora] = [];
    }
    reservasExistentes[fecha][hora].push(ambienteSeleccionado);
    
    cerrarModalReserva();
}

/**
 * Calcula la hora de fin de la reserva (2 horas después por defecto)
 * @param {string} horaInicio - Hora en formato HH:MM
 * @returns {string} Hora de fin en formato HH:MM
 */
function calcularHoraFin(horaInicio) {
    const [horas, minutos] = horaInicio.split(':').map(Number);
    const horaFin = new Date();
    horaFin.setHours(horas + 2, minutos, 0);
    return horaFin.toTimeString().slice(0, 5);
}

/**
 * Guarda la reserva en localStorage (temporal hasta tener BD)
 * @param {Object} reservaData 
 */
function guardarReservaLocal(reservaData) {
    try {
        let reservas = localStorage.getItem('bocatto_reservations');
        reservas = reservas ? JSON.parse(reservas) : [];
        
        // Agregar ID temporal
        reservaData.id = Date.now();
        reservaData.reservationNumber = `RES-${Date.now().toString().slice(-6)}`;
        
        reservas.push(reservaData);
        localStorage.setItem('bocatto_reservations', JSON.stringify(reservas));
        
        console.log('✅ Reserva guardada localmente:', reservaData);
    } catch (error) {
        console.error('Error al guardar reserva:', error);
    }
}

/**
 * Verifica si el usuario está logueado antes de permitir acciones
 * Integración con sistema de autenticación
 */
function verificarLogin() {
    // Verificar si existe el servicio de autenticación
    if (window.authService && window.authService.isAuthenticated()) {
        // Usuario logueado, permitir acción
        abrirFormularioComentario();
    } else {
        // No logueado, abrir modal de login
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            loginModal.style.display = 'flex';
        }
        alert('Debes iniciar sesión para dejar una reseña');
    }
}

/**
 * Abre formulario para comentar (requiere autenticación)
 * Basado en UML: Comment y Rating
 */
function abrirFormularioComentario() {
    // TODO: Implementar formulario de comentarios
    // Estructura según UML:
    // - Comment: clientId, productId/reservationId, text, commentDate, isApproved, commentType
    // - Rating: clientId, productId, stars, rateDate
    alert('Formulario de reseña (funcionalidad disponible próximamente con autenticación completa)');
}

// ==========================================
// LOG DE INICIALIZACIÓN
// ==========================================

console.log('📅 Sistema de Reservaciones cargado');
console.log('🏠 Ambientes disponibles:', Object.keys(AMBIENTES_CONFIG).length);
console.log('📋 Preparado para integración con BD');
