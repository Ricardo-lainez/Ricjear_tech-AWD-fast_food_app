/**
 * AdminProfile.js
 * Gestiona la funcionalidad del panel de administrador
 */

// Proteger la página - solo administradores pueden acceder
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación y rol
    if (!authService.isAuthenticated() || !authService.isAdmin()) {
        console.log('Acceso denegado: usuario no autorizado');
        window.location.href = '../index.html';
        return;
    }

    // Cargar información del administrador
    loadAdminInfo();
    
    // Inicializar reloj
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Event listeners para el menú desplegable
    setupUserMenu();
});

/**
 * Carga la información del administrador en el header
 */
function loadAdminInfo() {
    const user = authService.getCurrentUser();
    
    if (!user) {
        window.location.href = '../index.html';
        return;
    }

    // Actualizar nombre en el mensaje de bienvenida
    const adminNameElement = document.getElementById('adminName');
    if (adminNameElement) {
        adminNameElement.textContent = user.firstName;
    }

    // Crear el menú de usuario en el header
    const adminUserInfo = document.getElementById('adminUserInfo');
    if (adminUserInfo) {
        const initial = user.firstName.charAt(0).toUpperCase();
        
        adminUserInfo.innerHTML = `
            <div class="user-avatar">${initial}</div>
            <span class="user-name">${user.firstName} ${user.lastName}</span>
            <i class="fa fa-chevron-down" style="font-size: 12px; color: white; margin-left: 8px;"></i>
        `;
    }
}

/**
 * Configura el menú desplegable del usuario
 */
function setupUserMenu() {
    const adminUserInfo = document.getElementById('adminUserInfo');
    
    if (adminUserInfo) {
        // Crear el dropdown menu si no existe
        let dropdownMenu = document.querySelector('.dropdown-menu');
        
        if (!dropdownMenu) {
            dropdownMenu = document.createElement('div');
            dropdownMenu.className = 'dropdown-menu';
            dropdownMenu.innerHTML = `
                <a href="#"><i class="fa fa-user"></i> Mi Perfil</a>
                <a href="#"><i class="fa fa-cog"></i> Configuración</a>
                <a href="../index.html"><i class="fa fa-globe"></i> Ver Sitio Web</a>
                <a href="#" id="logoutBtn"><i class="fa fa-sign-out"></i> Cerrar Sesión</a>
            `;
            document.body.appendChild(dropdownMenu);
        }

        // Toggle del menú
        adminUserInfo.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
        });

        // Cerrar menú al hacer click fuera
        document.addEventListener('click', function() {
            dropdownMenu.classList.remove('active');
        });

        // Prevenir que el menú se cierre al hacer click dentro
        dropdownMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async function(e) {
                e.preventDefault();
                
                if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                    await authService.logout();
                    window.location.href = '../index.html';
                }
            });
        }
    }
}

/**
 * Actualiza la fecha y hora en tiempo real
 */
function updateDateTime() {
    const now = new Date();
    
    // Actualizar fecha
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        dateElement.textContent = now.toLocaleDateString('es-ES', options);
    }
    
    // Actualizar hora
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        const options = { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        };
        timeElement.textContent = now.toLocaleTimeString('es-ES', options);
    }
}

/**
 * Función auxiliar para mostrar notificaciones (para futuro uso)
 */
function showNotification(message, type = 'info') {
    // TODO: Implementar sistema de notificaciones
    console.log(`[${type.toUpperCase()}] ${message}`);
}

/**
 * Función auxiliar para cargar datos (para futuro uso)
 */
async function loadDashboardData() {
    // TODO: Implementar carga de datos del dashboard
    // Aquí se cargarán estadísticas, gráficos, etc.
    console.log('Cargando datos del dashboard...');
}

// ==========================================
// GESTIÓN DE RESERVACIONES
// ==========================================

let todasLasReservaciones = [];
let reservacionesFiltradas = [];

/**
 * Carga todas las reservaciones desde la API
 */
async function cargarReservaciones() {
    const loading = document.getElementById('reservationsLoading');
    const error = document.getElementById('reservationsError');
    const empty = document.getElementById('reservationsEmpty');
    const table = document.getElementById('reservationsTable');
    
    try {
        // Mostrar loading
        loading.style.display = 'flex';
        error.style.display = 'none';
        empty.style.display = 'none';
        table.style.display = 'none';
        
        // Obtener reservaciones desde la API
        const reservaciones = await window.reservacionesAPI.obtenerTodasReservaciones();
        todasLasReservaciones = reservaciones;
        reservacionesFiltradas = reservaciones;
        
        // Ocultar loading
        loading.style.display = 'none';
        
        if (reservaciones.length === 0) {
            empty.style.display = 'flex';
        } else {
            table.style.display = 'table';
            renderizarReservaciones(reservaciones);
            actualizarEstadisticas(reservaciones);
        }
        
    } catch (error) {
        console.error('Error al cargar reservaciones:', error);
        loading.style.display = 'none';
        error.style.display = 'flex';
    }
}

/**
 * Renderiza las reservaciones en la tabla
 */
function renderizarReservaciones(reservaciones) {
    const tbody = document.getElementById('reservationsTableBody');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    reservaciones.forEach(reserva => {
        const tr = document.createElement('tr');
        
        // Formatear fecha
        const fecha = new Date(reserva.fechaReservacion);
        const fechaStr = fecha.toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
        });
        
        // Clase de estado
        let estadoClass = '';
        let estadoTexto = '';
        switch(reserva.estado) {
            case 'pendiente':
                estadoClass = 'status-pending';
                estadoTexto = 'Pendiente';
                break;
            case 'confirmada':
                estadoClass = 'status-confirmed';
                estadoTexto = 'Confirmada';
                break;
            case 'cancelada':
                estadoClass = 'status-cancelled';
                estadoTexto = 'Cancelada';
                break;
            default:
                estadoClass = 'status-pending';
                estadoTexto = reserva.estado;
        }
        
        // Construir fila
        tr.innerHTML = `
            <td><span class="reservation-id">${reserva.numeroReservacion || 'N/A'}</span></td>
            <td>${fechaStr}</td>
            <td><strong>${reserva.horaInicio}</strong> - ${reserva.horaFin}</td>
            <td>
                <div class="client-info">
                    <strong>${reserva.cliente?.firstName || 'N/A'} ${reserva.cliente?.lastName || ''}</strong>
                    <small>${reserva.cliente?.email || 'Sin email'}</small>
                </div>
            </td>
            <td>${reserva.ambiente?.nombre || 'N/A'}</td>
            <td><span class="badge-persons"><i class="fas fa-users"></i> ${reserva.numeroPersonas}</span></td>
            <td><span class="status-badge ${estadoClass}">${estadoTexto}</span></td>
            <td>
                <div class="action-buttons">
                    ${reserva.estado === 'pendiente' ? `
                        <button class="btn-action btn-confirm" onclick="cambiarEstadoReservacion('${reserva._id}', 'confirmada')" title="Confirmar">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn-action btn-cancel" onclick="cambiarEstadoReservacion('${reserva._id}', 'cancelada')" title="Cancelar">
                            <i class="fas fa-times"></i>
                        </button>
                    ` : ''}
                    <button class="btn-action btn-info" onclick="verDetallesReservacion('${reserva._id}')" title="Ver detalles">
                        <i class="fas fa-info-circle"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

/**
 * Actualiza las estadísticas de reservaciones
 */
function actualizarEstadisticas(reservaciones) {
    const pendientes = reservaciones.filter(r => r.estado === 'pendiente').length;
    const confirmadas = reservaciones.filter(r => r.estado === 'confirmada').length;
    const canceladas = reservaciones.filter(r => r.estado === 'cancelada').length;
    
    document.getElementById('statPendientes').textContent = pendientes;
    document.getElementById('statConfirmadas').textContent = confirmadas;
    document.getElementById('statCanceladas').textContent = canceladas;
    document.getElementById('statTotal').textContent = reservaciones.length;
}

/**
 * Aplica los filtros seleccionados
 */
function aplicarFiltros() {
    const filterFecha = document.getElementById('filterFecha').value;
    const filterAmbiente = document.getElementById('filterAmbiente').value;
    const filterEstado = document.getElementById('filterEstado').value;
    
    reservacionesFiltradas = todasLasReservaciones.filter(reserva => {
        // Filtro por fecha
        if (filterFecha) {
            const fechaReserva = new Date(reserva.fechaReservacion).toISOString().split('T')[0];
            if (fechaReserva !== filterFecha) return false;
        }
        
        // Filtro por ambiente
        if (filterAmbiente && reserva.ambiente?.nombre !== filterAmbiente) {
            return false;
        }
        
        // Filtro por estado
        if (filterEstado && reserva.estado !== filterEstado) {
            return false;
        }
        
        return true;
    });
    
    renderizarReservaciones(reservacionesFiltradas);
    actualizarEstadisticas(reservacionesFiltradas);
}

/**
 * Limpia todos los filtros
 */
function limpiarFiltros() {
    document.getElementById('filterFecha').value = '';
    document.getElementById('filterAmbiente').value = '';
    document.getElementById('filterEstado').value = '';
    
    reservacionesFiltradas = todasLasReservaciones;
    renderizarReservaciones(reservacionesFiltradas);
    actualizarEstadisticas(reservacionesFiltradas);
}

/**
 * Cambia el estado de una reservación
 */
async function cambiarEstadoReservacion(reservacionId, nuevoEstado) {
    const confirmar = confirm(`¿Estás seguro de que deseas ${nuevoEstado === 'confirmada' ? 'confirmar' : 'cancelar'} esta reservación?`);
    
    if (!confirmar) return;
    
    try {
        // TODO: Implementar endpoint en el backend para actualizar estado
        // Por ahora solo simulamos la actualización
        
        // Actualizar en el array local
        const index = todasLasReservaciones.findIndex(r => r._id === reservacionId);
        if (index !== -1) {
            todasLasReservaciones[index].estado = nuevoEstado;
        }
        
        aplicarFiltros();
        
        alert(`Reservación ${nuevoEstado} exitosamente`);
    } catch (error) {
        console.error('Error al actualizar reservación:', error);
        alert('Error al actualizar la reservación');
    }
}

/**
 * Muestra los detalles completos de una reservación
 */
function verDetallesReservacion(reservacionId) {
    const reserva = todasLasReservaciones.find(r => r._id === reservacionId);
    
    if (!reserva) {
        alert('Reservación no encontrada');
        return;
    }
    
    const fecha = new Date(reserva.fechaReservacion);
    const fechaStr = fecha.toLocaleDateString('es-ES', { 
        weekday: 'long',
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
    });
    
    let mensaje = `📋 DETALLES DE RESERVACIÓN\n\n`;
    mensaje += `Número: ${reserva.numeroReservacion || 'N/A'}\n`;
    mensaje += `Estado: ${reserva.estado.toUpperCase()}\n\n`;
    mensaje += `👤 CLIENTE:\n`;
    mensaje += `Nombre: ${reserva.cliente?.firstName || 'N/A'} ${reserva.cliente?.lastName || ''}\n`;
    mensaje += `Email: ${reserva.cliente?.email || 'N/A'}\n\n`;
    mensaje += `📍 RESERVACIÓN:\n`;
    mensaje += `Ambiente: ${reserva.ambiente?.nombre || 'N/A'}\n`;
    mensaje += `Fecha: ${fechaStr}\n`;
    mensaje += `Hora: ${reserva.horaInicio} - ${reserva.horaFin}\n`;
    mensaje += `Personas: ${reserva.numeroPersonas}\n`;
    if (reserva.ocasionEspecial) {
        mensaje += `Ocasión: ${reserva.ocasionEspecial}\n`;
    }
    if (reserva.comentarios) {
        mensaje += `\n📝 COMENTARIOS:\n${reserva.comentarios}`;
    }
    
    alert(mensaje);
}

// Cargar reservaciones al iniciar la página
document.addEventListener('DOMContentLoaded', function() {
    // Solo cargar si el elemento existe (estamos en la página de admin)
    if (document.getElementById('reservationsTable')) {
        cargarReservaciones();
    }
});

