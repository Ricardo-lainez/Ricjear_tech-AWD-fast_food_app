// Sistema de Reservaciones - Bocatto Valley
let ambientesData = [];
let ambienteSeleccionado = null;

async function cargarAmbientes() {
    try {
        const container = document.querySelector('.ambientes-grid');
        if (!container) return;
        container.innerHTML = '<div class="loading">Cargando ambientes...</div>';
        if (!window.reservacionesAPI) throw new Error('API no disponible');
        ambientesData = await window.reservacionesAPI.obtenerAmbientes();
        console.log('Ambientes cargados:', ambientesData.length);
        renderizarAmbientes();
    } catch (error) {
        console.error('Error al cargar ambientes:', error);
        const container = document.querySelector('.ambientes-grid');
        if (container) {
            container.innerHTML = '<div class="error-message"><p>Error al cargar los ambientes.</p><button onclick="cargarAmbientes()" class="btn-retry">Reintentar</button></div>';
        }
    }
}

function renderizarAmbientes() {
    const container = document.querySelector('.ambientes-grid');
    if (!container || !ambientesData.length) return;
    container.innerHTML = '';
    ambientesData.forEach(ambiente => {
        const card = document.createElement('div');
        card.className = 'ambiente-card';
        const stars = Math.round(ambiente.rating?.promedio || 0);
        const starsHTML = ''.repeat(stars);
        card.innerHTML = `
            ${ambiente.badge?.texto ? `<span class="badge ${ambiente.badge.clase || ''}"><i class="fa ${ambiente.badge.icono || 'fa-users'}"></i> ${ambiente.badge.texto}</span>` : ''}
            <div class="ambiente-imagen"><img src="${ambiente.imagenUrl}" alt="${ambiente.nombre}" onerror="this.src='../images/home/plato-destac.jpg'"></div>
            <div class="ambiente-info">
                <h3>${ambiente.nombre}</h3>
                <p class="descripcion">${ambiente.descripcion}</p>
                <div class="capacidad-info"><i class="fa fa-users"></i><span>Capacidad: ${ambiente.capacidadMin}-${ambiente.capacidadMax} personas</span></div>
                ${ambiente.caracteristicas?.length ? `<div class="caracteristicas">${ambiente.caracteristicas.slice(0, 3).map(c => `<span class="caracteristica"><i class="fa fa-check"></i> ${c}</span>`).join('')}</div>` : ''}
                <div class="rating"><span class="stars">${starsHTML}</span><span class="rating-text">${ambiente.rating?.promedio || 0} (${ambiente.rating?.totalResenas || 0} reseñas)</span></div>
                <button class="btn-reservar" onclick="abrirModalReserva('${ambiente._id}')"><i class="fa fa-calendar"></i> Reservar Ahora</button>
            </div>
        `;
        container.appendChild(card);
    });
}

async function abrirModalReserva(ambienteId) {
    try {
        const usuario = window.authAPI?.getCurrentUser();
        if (!usuario) {
            alert('Debes iniciar sesión para hacer una reservación');
            const loginModal = document.getElementById('loginModal');
            if (loginModal) loginModal.style.display = 'flex';
            return;
        }
        ambienteSeleccionado = ambientesData.find(a => a._id === ambienteId);
        if (!ambienteSeleccionado) {
            alert('Ambiente no disponible');
            return;
        }
        const modal = document.getElementById('modalReserva');
        const titulo = document.getElementById('modalAmbienteTitulo');
        titulo.textContent = `Reservar - ${ambienteSeleccionado.nombre}`;
        actualizarSelectorPersonas(ambienteSeleccionado.capacidadMin, ambienteSeleccionado.capacidadMax);
        const fechaInput = document.getElementById('fecha');
        fechaInput.min = new Date().toISOString().split('T')[0];
        fechaInput.value = '';
        document.getElementById('formReserva').reset();
        const disponibilidadTexto = document.getElementById('disponibilidadTexto');
        if (disponibilidadTexto) {
            disponibilidadTexto.textContent = 'Selecciona fecha y hora para verificar disponibilidad';
            disponibilidadTexto.parentElement.className = 'disponibilidad-info';
        }
        modal.style.display = 'block';
    } catch (error) {
        console.error('Error al abrir modal:', error);
        alert('Error al abrir el formulario de reservación');
    }
}

function actualizarSelectorPersonas(min, max) {
    const select = document.getElementById('personas');
    const hint = document.getElementById('capacityHint');
    if (!select) return;
    select.innerHTML = '<option value="">Seleccionar</option>';
    for (let i = min; i <= max; i++) {
        select.innerHTML += `<option value="${i}">${i} ${i === 1 ? 'persona' : 'personas'}</option>`;
    }
    if (hint) {
        hint.textContent = `Este ambiente permite entre ${min} y ${max} personas`;
        hint.style.color = '#28a745';
    }
}

function cerrarModalReserva() {
    const modal = document.getElementById('modalReserva');
    if (modal) modal.style.display = 'none';
    const form = document.getElementById('formReserva');
    if (form) form.reset();
    ambienteSeleccionado = null;
}

window.onclick = function(event) {
    const modal = document.getElementById('modalReserva');
    if (event.target === modal) cerrarModalReserva();
}

async function verificarDisponibilidad() {
    const fecha = document.getElementById('fecha')?.value;
    const hora = document.getElementById('hora')?.value;
    const disponibilidadDiv = document.querySelector('.disponibilidad-info');
    const disponibilidadTexto = document.getElementById('disponibilidadTexto');
    const btnConfirmar = document.querySelector('.btn-confirmar-reserva');
    if (!fecha || !hora) {
        if (disponibilidadTexto) disponibilidadTexto.textContent = 'Selecciona fecha y hora para verificar disponibilidad';
        if (disponibilidadDiv) disponibilidadDiv.className = 'disponibilidad-info';
        if (btnConfirmar) btnConfirmar.disabled = false;
        return;
    }
    if (!ambienteSeleccionado) {
        if (disponibilidadTexto) disponibilidadTexto.textContent = 'Error: Ambiente no seleccionado';
        if (disponibilidadDiv) disponibilidadDiv.className = 'disponibilidad-info no-disponible';
        if (btnConfirmar) btnConfirmar.disabled = true;
        return;
    }
    if (disponibilidadTexto) disponibilidadTexto.textContent = 'Verificando disponibilidad...';
    if (disponibilidadDiv) disponibilidadDiv.className = 'disponibilidad-info';
    if (btnConfirmar) btnConfirmar.disabled = true;
    try {
        const resultado = await window.reservacionesAPI.verificarDisponibilidad({
            ambienteId: ambienteSeleccionado._id,
            fechaReservacion: fecha,
            horaInicio: hora
        });
        if (resultado.disponible) {
            if (disponibilidadTexto) disponibilidadTexto.textContent = 'Disponible! Puedes proceder con tu reserva';
            if (disponibilidadDiv) disponibilidadDiv.className = 'disponibilidad-info disponible';
            if (btnConfirmar) btnConfirmar.disabled = false;
        } else {
            if (disponibilidadTexto) disponibilidadTexto.textContent = 'No disponible - ' + (resultado.mensaje || 'Este horario ya está reservado');
            if (disponibilidadDiv) disponibilidadDiv.className = 'disponibilidad-info no-disponible';
            if (btnConfirmar) btnConfirmar.disabled = true;
        }
    } catch (error) {
        console.error('Error:', error);
        if (disponibilidadTexto) disponibilidadTexto.textContent = 'Error al verificar disponibilidad';
        if (disponibilidadDiv) disponibilidadDiv.className = 'disponibilidad-info no-disponible';
        if (btnConfirmar) btnConfirmar.disabled = true;
    }
}

async function confirmarReserva() {
    const fecha = document.getElementById('fecha')?.value;
    const hora = document.getElementById('hora')?.value;
    const personas = parseInt(document.getElementById('personas')?.value);
    const ocasion = document.getElementById('ocasion')?.value;
    const comentarios = document.getElementById('comentarios')?.value;
    if (!fecha || !hora || !personas) {
        alert('Por favor completa todos los campos requeridos');
        return;
    }
    if (!ambienteSeleccionado) {
        alert('Error: No se ha seleccionado un ambiente');
        return;
    }
    if (personas < ambienteSeleccionado.capacidadMin || personas > ambienteSeleccionado.capacidadMax) {
        alert(`Este ambiente solo permite entre ${ambienteSeleccionado.capacidadMin} y ${ambienteSeleccionado.capacidadMax} personas.`);
        return;
    }
    const usuario = window.authAPI?.getCurrentUser();
    if (!usuario) {
        alert('Debes iniciar sesión para hacer una reservación');
        cerrarModalReserva();
        const loginModal = document.getElementById('loginModal');
        if (loginModal) loginModal.style.display = 'flex';
        return;
    }
    try {
        const btnConfirmar = document.querySelector('.btn-confirmar-reserva');
        if (btnConfirmar) {
            btnConfirmar.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Procesando...';
            btnConfirmar.disabled = true;
        }
        const [horas, minutos] = hora.split(':');
        const horaFin = `${String((parseInt(horas) + 2) % 24).padStart(2, '0')}:${minutos}`;
        const reservaData = {
            ambienteId: ambienteSeleccionado._id,
            fechaReservacion: fecha,
            horaInicio: hora,
            horaFin: horaFin,
            numeroPersonas: personas,
            ocasionEspecial: ocasion || undefined,
            comentarios: comentarios || undefined
        };
        const reserva = await window.reservacionesAPI.crearReservacion(reservaData);
        const fechaObj = new Date(fecha + 'T00:00:00');
        const fechaFormateada = fechaObj.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        alert(`Reserva Confirmada!\n\nNumero: ${reserva.numeroReservacion || 'N/A'}\nAmbiente: ${ambienteSeleccionado.nombre}\nFecha: ${fechaFormateada}\nHora: ${hora} - ${horaFin}\nPersonas: ${personas}\n\nTe esperamos en Bocatto Valley!`);
        cerrarModalReserva();
        if (btnConfirmar) {
            btnConfirmar.innerHTML = '<i class="fa fa-check"></i> Confirmar Reserva';
            btnConfirmar.disabled = false;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al procesar la reservación: ' + (error.message || 'Por favor, intenta de nuevo'));
        const btnConfirmar = document.querySelector('.btn-confirmar-reserva');
        if (btnConfirmar) {
            btnConfirmar.innerHTML = '<i class="fa fa-check"></i> Confirmar Reserva';
            btnConfirmar.disabled = false;
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    cargarAmbientes();
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) fechaInput.addEventListener('change', verificarDisponibilidad);
    const horaSelect = document.getElementById('hora');
    if (horaSelect) horaSelect.addEventListener('change', verificarDisponibilidad);
    const formReserva = document.getElementById('formReserva');
    if (formReserva) {
        formReserva.addEventListener('submit', function(e) {
            e.preventDefault();
            confirmarReserva();
        });
    }
});

console.log('Sistema de Reservaciones cargado');
