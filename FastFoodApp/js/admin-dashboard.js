/**
 * ========================================
 * ADMIN DASHBOARD - JavaScript
 * Funcionalidad del panel de administración
 * ========================================
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // PROTECCIÓN DE PÁGINA
    // ==========================================
    
    // Verificar que el usuario esté logueado y sea administrador
    if (!window.authService || !window.protectPage) {
        console.error('Servicio de autenticación no disponible');
        window.location.href = '../index.html';
        return;
    }

    // Proteger la página - solo administradores
    if (!window.protectPage('administrator')) {
        return; // La función protectPage redirige automáticamente
    }

    // ==========================================
    // INICIALIZACIÓN
    // ==========================================

    const currentUser = window.authService.getCurrentUser();
    
    // Actualizar nombre del admin en el header
    const adminNameElement = document.getElementById('adminName');
    const userAvatarAdmin = document.querySelector('.user-avatar-admin');
    
    if (currentUser && adminNameElement) {
        adminNameElement.textContent = currentUser.firstName;
        if (userAvatarAdmin) {
            userAvatarAdmin.textContent = currentUser.firstName.charAt(0).toUpperCase();
        }
    }

    // ==========================================
    // MENÚ DESPLEGABLE
    // ==========================================

    const userInfoAdmin = document.getElementById('userInfoAdmin');
    const dropdownMenuAdmin = document.getElementById('dropdownMenuAdmin');
    const logoutBtnAdmin = document.getElementById('logoutBtnAdmin');

    if (userInfoAdmin && dropdownMenuAdmin) {
        userInfoAdmin.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenuAdmin.classList.toggle('show');
        });

        // Cerrar dropdown al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!userInfoAdmin.contains(e.target) && !dropdownMenuAdmin.contains(e.target)) {
                dropdownMenuAdmin.classList.remove('show');
            }
        });
    }

    // Logout
    if (logoutBtnAdmin) {
        logoutBtnAdmin.addEventListener('click', function(e) {
            e.preventDefault();
            handleAdminLogout();
        });
    }

    // ==========================================
    // NAVEGACIÓN DEL SIDEBAR
    // ==========================================

    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const contentSections = document.querySelectorAll('.content-section');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtener la sección objetivo
            const targetSection = this.getAttribute('data-section');
            
            // Remover clase active de todos los links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            
            // Añadir clase active al link clickeado
            this.classList.add('active');
            
            // Ocultar todas las secciones
            contentSections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Mostrar la sección objetivo
            const targetElement = document.getElementById(targetSection + '-section');
            if (targetElement) {
                targetElement.classList.add('active');
                
                // Scroll al top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // ==========================================
    // FUNCIONES
    // ==========================================

    /**
     * Maneja el cierre de sesión del administrador
     */
    function handleAdminLogout() {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            const result = window.authService.logout();
            
            if (result.success) {
                alert('Sesión cerrada correctamente');
                window.location.href = '../index.html';
            }
        }
    }

    // ==========================================
    // DATOS SIMULADOS Y ACTUALIZACIÓN
    // ==========================================

    /**
     * Actualiza las estadísticas del dashboard
     * En producción, estos datos vendrán del backend
     */
    function updateDashboardStats() {
        // Por ahora son estáticos, en el futuro se obtendrán de la API
        console.log('📊 Stats actualizadas');
    }

    /**
     * Carga la actividad reciente
     */
    function loadRecentActivity() {
        // Simulado - en producción vendrá del backend
        console.log('📋 Actividad reciente cargada');
    }

    /**
     * Carga los productos populares
     */
    function loadPopularProducts() {
        // Simulado - en producción vendrá del backend
        console.log('⭐ Productos populares cargados');
    }

    // Cargar datos iniciales
    updateDashboardStats();
    loadRecentActivity();
    loadPopularProducts();

    // ==========================================
    // RESPONSIVE - Toggle Sidebar Mobile
    // ==========================================

    // Crear botón de menú para móvil (si no existe)
    const adminHeader = document.querySelector('.admin-header-content');
    if (window.innerWidth <= 768 && adminHeader) {
        const menuToggle = document.createElement('button');
        menuToggle.className = 'mobile-menu-toggle';
        menuToggle.innerHTML = '<i class="fa fa-bars"></i>';
        menuToggle.style.cssText = `
            background: none;
            border: none;
            font-size: 24px;
            color: var(--text-dark);
            cursor: pointer;
            display: none;
        `;
        
        adminHeader.insertBefore(menuToggle, adminHeader.firstChild);

        // Toggle sidebar en móvil
        menuToggle.addEventListener('click', function() {
            const sidebar = document.querySelector('.admin-sidebar');
            if (sidebar) {
                sidebar.classList.toggle('show');
            }
        });

        // Mostrar botón en móvil
        if (window.innerWidth <= 768) {
            menuToggle.style.display = 'block';
        }

        // Cerrar sidebar al hacer clic en un link (móvil)
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    const sidebar = document.querySelector('.admin-sidebar');
                    if (sidebar) {
                        sidebar.classList.remove('show');
                    }
                }
            });
        });
    }

    // ==========================================
    // LOG DE INICIO
    // ==========================================

    console.log('🎛️ Admin Dashboard cargado correctamente');
    console.log('👤 Usuario:', currentUser.firstName, currentUser.lastName);
    console.log('🔑 Rol:', currentUser.role);
    console.log('✅ Acceso autorizado');
});
