// Sistema de Reservaciones - Bocatto Valley
// ==========================================
// CONFIGURACIÓN DINÁMICA DESDE LA BASE DE DATOS
// ==========================================

/**
 * Los ambientes ahora se cargan desde la API
 * Ya no se usan datos simulados
 */
let AMBIENTES_CONFIG = {};
let ambientesData = [];

/**
 * Cargar ambientes desde la API al iniciar la página
 */
async function cargarAmbientes() {
    try {
        // Mostrar loader
        const container = document.querySelector('.ambientes-grid');
        if (container) {
            container.innerHTML = '<div class="loading">Cargando ambientes...</div>';
        }

        // Verificar que la API esté disponible
        if (!window.reservacionesAPI) {
            console.error('❌ reservacionesAPI no está disponible');
            throw new Error('API no inicializada');
        }

        // Obtener ambientes desde la API
        ambientesData = await window.reservacionesAPI.obtenerAmbientes();
        
        // Convertir a formato compatible con el código existente
        AMBIENTES_CONFIG = {};
        ambientesData.forEach(ambiente => {
            const slug = ambiente.nombre.toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[áàä]/g, 'a')
                .replace(/[éèë]/g, 'e')
                .replace(/[íìï]/g, 'i')
                .replace(/[óòö]/g, 'o')
                .replace(/[úùü]/g, 'u');
            
            AMBIENTES_CONFIG[slug] = {
                id: ambiente._id,
                nombre: ambiente.nombre,
                capacidadMin: ambiente.capacidadMin,
                capacidadMax: ambiente.capacidadMax,
                descripcion: ambiente.descripcion,
                caracteristicas: ambiente.caracteristicas || [],
                imagenUrl: ambiente.imagenUrl,
                badge: ambiente.badge || {},
                rating: ambiente.rating || { promedio: 0, totalResenas: 0 }
            };
        });

        // Renderizar ambientes en el DOM
        renderizarAmbientes();
        
        console.log('✅ Ambientes cargados desde la base de datos:', ambientesData.length);
    } catch (error) {
        console.error('❌ Error al cargar ambientes:', error);
        
        // Mostrar mensaje de error
        const container = document.querySelector('.ambientes-grid');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <p>⚠️ Error al cargar los ambientes. Por favor, intenta más tarde.</p>
                    <button onclick="cargarAmbientes()" class="btn-retry">Reintentar</button>
                </div>
            `;
        }
    }
}

/**
 * Renderizar ambientes en el DOM
 */
function renderizarAmbientes() {
    const container = document.querySelector('.ambientes-grid');
    if (!container) return;

    container.innerHTML = '';

    Object.entries(AMBIENTES_CONFIG).forEach(([slug, ambiente]) => {
        const card = document.createElement('div');
        card.className = 'ambiente-card';
        card.setAttribute('data-ambiente', slug);
        
        // Badge
        let badgeHTML = '';
        if (ambiente.badge && ambiente.badge.texto) {
            badgeHTML = `<span class="badge ${ambiente.badge.clase}">
                <i class="fa ${ambiente.badge.icono}"></i> ${ambiente.badge.texto}
            </span>`;
        }

        // Rating
        const stars = Math.round(ambiente.rating.promedio);
        const starsHTML = '⭐'.repeat(stars);

        card.innerHTML = `
            ${badgeHTML}
            <div class="ambiente-imagen">
                <img src="../${ambiente.imagenUrl}" alt="${ambiente.nombre}" onerror="this.src='../images/home/plato-destac.jpg'">
            </div>
            <div class="ambiente-info">
                <h3>${ambiente.nombre}</h3>
                <p class="descripcion">${ambiente.descripcion}</p>
                <div class="capacidad-info">
                    <i class="fa fa-users"></i>
                    <span>Capacidad: ${ambiente.capacidadMin}-${ambiente.capacidadMax} personas</span>
                </div>
                ${ambiente.caracteristicas && ambiente.caracteristicas.length > 0 ? `
                    <div class="caracteristicas">
                        ${ambiente.caracteristicas.slice(0, 3).map(c => 
                            `<span class="caracteristica"><i class="fa fa-check"></i> ${c}</span>`
                        ).join('')}
                    </div>
                ` : ''}
                <div class="rating">
                    <span class="stars">${starsHTML}</span>
                    <span class="rating-text">${ambiente.rating.promedio} (${ambiente.rating.totalResenas} reseñas)</span>
                </div>
                <button class="btn-reservar" onclick="abrirModalReserva('${slug}')">
                    <i class="fa fa-calendar"></i> Reservar Ahora
                </button>
            </div>
        `;

        container.appendChild(card);
    });
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', cargarAmbientes);

// Datos de ejemplo de comentarios por ambiente
const comentariosPorAmbiente = {
    'salon-principal': [
        {
            usuario: 'Andrea López',
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

// Variables globales
let ambienteSeleccionado = null; // Objeto completo del ambiente seleccionado
let horariosOcupados = []; // Array de horarios ya reservados

// ==========================================
// FUNCIONES PRINCIPALES
// ==========================================

/**
 * Abre el modal de reserva y configura el ambiente seleccionado
 * @param {string} ambienteSlug - slug del ambiente
 */
async function abrirModalReserva(ambienteSlug) {
    try {
        // Verificar si el usuario está autenticado
        const usuario = window.authAPI ? window.authAPI.getCurrentUser() : null;
        if (!usuario) {
            alert('Debes iniciar sesión para hacer una reservación');
            // Abrir modal de login si existe
            const loginModal = document.getElementById('loginModal');
            if (loginModal) {
                loginModal.style.display = 'flex';
            }
            return;
        }

        // Buscar el ambiente en los datos cargados
        ambienteSeleccionado = ambientesData.find(a => 
            a.nombre.toLowerCase().replace(/\s+/g, '-') === ambienteSlug
        );

        if (!ambienteSeleccionado) {
            console.error('Ambiente no encontrado:', ambienteSlug);
            alert('Error: Ambiente no disponible');
            return;
        }

        const modal = document.getElementById('modalReserva');
        const titulo = document.getElementById('modalAmbienteTitulo');
        
        // Actualizar título
        titulo.textContent = `Reservar - ${ambienteSeleccionado.nombre}`;
        
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
        // Actualizar selector de personas según capacidad del ambiente
        actualizarSelectorPersonas(ambienteSeleccionado.capacidadMin, ambienteSeleccionado.capacidadMax);
        
        // Establecer fecha mínima (hoy)
        const fechaInput = document.getElementById('fecha');
        const hoy = new Date().toISOString().split('T')[0];
        fechaInput.setAttribute('min', hoy);
        
        // Limpiar formulario
        document.getElementById('formReserva').reset();
        fechaInput.value = '';
        
        // Resetear texto de disponibilidad
        const disponibilidadTexto = document.getElementById('disponibilidadTexto');
        if (disponibilidadTexto) {
            disponibilidadTexto.textContent = 'Selecciona fecha y hora para verificar disponibilidad';
            disponibilidadTexto.parentElement.className = 'disponibilidad-info';
        }
        
        modal.style.display = 'block';
    } catch (error) {
        console.error('Error al abrir modal de reserva:', error);
        alert('Error al abrir el formulario de reservación');
    }
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
}

/**
 * Cierra el modal de reserva y resetea el formulario
 */
function cerrarModalReserva() {
    const modal = document.getElementById('modalReserva');
    modal.style.display = 'none';
    document.getElementById('formReserva').reset();
    
    // Resetear variables
    ambienteSeleccionado = null;
    horariosOcupados = [];
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
 * Conectado con la API real - verifica margen de 2 horas
 */
async function verificarDisponibilidad() {
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

    if (!ambienteSeleccionado) {
        disponibilidadTexto.textContent = 'Error: Ambiente no seleccionado';
        disponibilidadDiv.className = 'disponibilidad-info no-disponible';
        btnConfirmar.disabled = true;
        return;
    }
    
    // Mostrar loading
    disponibilidadTexto.textContent = 'Verificando disponibilidad...';
    disponibilidadDiv.className = 'disponibilidad-info';
    btnConfirmar.disabled = true;
    
    try {
        const resultado = await window.reservacionesAPI.verificarDisponibilidad({
            ambienteId: ambienteSeleccionado._id,
            fechaReservacion: fecha,
            horaInicio: hora
        });
        
        if (resultado.disponible) {
            disponibilidadTexto.textContent = '✓ ¡Disponible! Puedes proceder con tu reserva';
            disponibilidadDiv.className = 'disponibilidad-info disponible';
            btnConfirmar.disabled = false;
        } else {
            disponibilidadTexto.textContent = '⚠️ No disponible - ' + (resultado.mensaje || 'Este horario ya está reservado (margen de 2 horas)');
            disponibilidadDiv.className = 'disponibilidad-info no-disponible';
            btnConfirmar.disabled = true;
        }
    } catch (error) {
        console.error('Error al verificar disponibilidad:', error);
        disponibilidadTexto.textContent = '⚠️ No se pudo verificar la disponibilidad. Por favor, intenta de nuevo.';
        disponibilidadDiv.className = 'disponibilidad-info no-disponible';
        btnConfirmar.disabled = true;
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
 * Confirma y guarda la reserva en la base de datos
 * Conectado con la API real
 */
async function confirmarReserva() {
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

    if (!ambienteSeleccionado) {
        alert('Error: No se ha seleccionado un ambiente');
        return;
    }
    
    // Validar que el número de personas esté dentro del rango
    const numPersonas = parseInt(personas);
    if (numPersonas < ambienteSeleccionado.capacidadMin || numPersonas > ambienteSeleccionado.capacidadMax) {
        alert(`Este ambiente solo permite entre ${ambienteSeleccionado.capacidadMin} y ${ambienteSeleccionado.capacidadMax} personas.\nPor favor, selecciona un número válido.`);
        return;
    }
    
    // Verificar que el usuario esté autenticado
    const usuario = window.authAPI ? window.authAPI.getCurrentUser() : null;
    if (!usuario) {
        alert('⚠️ Debes iniciar sesión para hacer una reservación');
        cerrarModalReserva();
        const loginModal = document.getElementById('loginModal');
        if (loginModal) loginModal.style.display = 'flex';
        return;
    }
    
    try {
        // Mostrar loading
        const btnConfirmar = document.querySelector('.btn-confirmar-reserva');
        const textoOriginal = btnConfirmar.innerHTML;
        btnConfirmar.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Procesando...';
        btnConfirmar.disabled = true;
        
        // Calcular hora de fin (2 horas después)
        const [horas, minutos] = hora.split(':');
        const horaFin = `${String((parseInt(horas) + 2) % 24).padStart(2, '0')}:${minutos}`;
        
        // Crear objeto de reserva para la API
        const reservaData = {
            ambienteId: ambienteSeleccionado._id,
            fechaReservacion: fecha,
            horaInicio: hora,
            horaFin: horaFin,
            numeroPersonas: numPersonas,
            ocasionEspecial: ocasion || undefined,
            comentarios: comentarios || undefined
        };
        
        // Enviar a la API
        const reservaCreada = await window.reservacionesAPI.crearReservacion(reservaData);
        
        // Formatear fecha para mostrar
        const fechaObj = new Date(fecha + 'T00:00:00');
        const fechaFormateada = fechaObj.toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Mensaje de confirmación
        let mensaje = `✅ ¡Reserva Confirmada!\n\n`;
        mensaje += `📋 Número: ${reservaCreada.numeroReservacion || 'N/A'}\n`;
        mensaje += `📍 Ambiente: ${ambienteSeleccionado.nombre}\n`;
        mensaje += `📅 Fecha: ${fechaFormateada}\n`;
        mensaje += `⏰ Hora: ${hora} - ${horaFin}\n`;
        mensaje += `👥 Personas: ${numPersonas}\n`;
        if (ocasion) mensaje += `🎉 Ocasión: ${ocasion}\n`;
        if (comentarios) mensaje += `📝 Notas: ${comentarios}\n`;
        mensaje += `\n¡Te esperamos en Bocatto Valley!`;
        
        alert(mensaje);
        cerrarModalReserva();
        
        // Restaurar botón
        btnConfirmar.innerHTML = textoOriginal;
        btnConfirmar.disabled = false;
        
    } catch (error) {
        console.error('Error al crear reservación:', error);
        alert('❌ Error al procesar la reservación: ' + (error.message || 'Por favor, intenta de nuevo'));
        
        // Restaurar botón
        const btnConfirmar = document.querySelector('.btn-confirmar-reserva');
        btnConfirmar.innerHTML = '<i class="fa fa-check"></i> Confirmar Reserva';
        btnConfirmar.disabled = false;
    }
}

/**
 * Calcula la hora de fin de la reserva (2 horas después por defecto)
 * @param {string} horaInicio - Hora en formato HH:MM
 * @returns {string} Hora de fin en formato HH:MM
 */
// Funciones auxiliares eliminadas: 
// - calcularHoraFin() y guardarReservaLocal() ya no son necesarias
// - La API ahora maneja toda la lógica de reservaciones

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
