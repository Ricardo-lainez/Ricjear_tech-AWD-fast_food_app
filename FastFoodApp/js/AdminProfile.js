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
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                    authService.logout();
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
