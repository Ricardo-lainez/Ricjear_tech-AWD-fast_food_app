/**
 * ========================================
 * SISTEMA DE AUTENTICACIÓN CON API
 * ========================================
 * Versión actualizada que consume el backend de MongoDB Atlas
 * 
 * IMPORTANTE: Este archivo reemplaza la versión anterior que usaba localStorage
 * Ahora todas las operaciones se realizan contra la API REST
 */

// ==========================================
// CLASE AuthService - Servicio de Autenticación con API
// ==========================================

class AuthService {
    constructor() {
        this.currentUser = null;
        this.sessionKey = 'bocatto_session';
        this.init();
    }

    /**
     * Inicializa el servicio de autenticación
     */
    init() {
        this.loadSession();
    }

    /**
     * Registra un nuevo usuario (solo clientes)
     * Ahora se comunica con la API
     * @param {Object} userData 
     * @returns {Promise<Object>}
     */
    async register(userData) {
        try {
            // Validaciones básicas del lado del cliente
            if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
                return {
                    success: false,
                    message: 'Por favor, completa todos los campos requeridos.'
                };
            }

            if (userData.password !== userData.confirmPassword) {
                return {
                    success: false,
                    message: 'Las contraseñas no coinciden.'
                };
            }

            if (userData.password.length < 6) {
                return {
                    success: false,
                    message: 'La contraseña debe tener al menos 6 caracteres.'
                };
            }

            // Llamar a la API
            const response = await apiClient.post('/auth/register', {
                firstName: userData.firstName.trim(),
                lastName: userData.lastName.trim(),
                email: userData.email.toLowerCase().trim(),
                password: userData.password,
                phone: userData.phone ? userData.phone.trim() : '',
                address: userData.address ? userData.address.trim() : '',
                preferences: userData.preferences || ''
            });

            // Si el registro fue exitoso, guardar sesión
            if (response.success) {
                this.currentUser = response.user;
                this.saveSession(response.token, true);
            }

            return response;

        } catch (error) {
            console.error('Error en registro:', error);
            return {
                success: false,
                message: error.message || 'Error al crear la cuenta. Por favor, intenta nuevamente.'
            };
        }
    }

    /**
     * Inicia sesión con email y contraseña
     * @param {string} email 
     * @param {string} password 
     * @param {boolean} rememberMe 
     * @returns {Promise<Object>}
     */
    async login(email, password, rememberMe = false) {
        try {
            // Validaciones básicas
            if (!email || !password) {
                return {
                    success: false,
                    message: 'Por favor, proporciona email y contraseña'
                };
            }

            // Llamar a la API
            const response = await apiClient.post('/auth/login', {
                email: email.toLowerCase().trim(),
                password
            });

            // Si el login fue exitoso, guardar sesión
            if (response.success) {
                this.currentUser = response.user;
                this.saveSession(response.token, rememberMe);

                return {
                    success: true,
                    message: response.message,
                    user: response.user,
                    redirectTo: this.getRedirectUrl(response.user.role)
                };
            }

            return response;

        } catch (error) {
            console.error('Error en login:', error);
            return {
                success: false,
                message: error.message || 'Error al iniciar sesión. Por favor, intenta nuevamente.'
            };
        }
    }

    /**
     * Cierra la sesión del usuario
     * @returns {Promise<Object>}
     */
    async logout() {
        try {
            // Llamar a la API para invalidar el token
            await apiClient.post('/auth/logout');

            // Limpiar sesión local en AMBOS storages
            this.currentUser = null;
            localStorage.removeItem(this.sessionKey);
            sessionStorage.removeItem(this.sessionKey);
            
            // Limpiar cualquier otra clave relacionada con sesión
            localStorage.removeItem('current_user');
            sessionStorage.removeItem('current_user');

            console.log('✅ Sesión cerrada completamente');

            return {
                success: true,
                message: 'Sesión cerrada correctamente'
            };

        } catch (error) {
            console.error('Error en logout:', error);
            
            // Aunque haya error en la API, limpiar sesión local
            this.currentUser = null;
            localStorage.removeItem(this.sessionKey);
            sessionStorage.removeItem(this.sessionKey);
            localStorage.removeItem('current_user');
            sessionStorage.removeItem('current_user');

            console.log('⚠️ Sesión cerrada localmente (sin confirmación del servidor)');

            return {
                success: true,
                message: 'Sesión cerrada localmente'
            };
        }
    }

    /**
     * Obtiene el usuario actual desde la API
     * @returns {Promise<Object|null>}
     */
    async getCurrentUserFromAPI() {
        try {
            const response = await apiClient.get('/auth/me');
            
            if (response.success) {
                this.currentUser = response.user;
                return response.user;
            }

            return null;

        } catch (error) {
            console.error('Error al obtener usuario actual:', error);
            // Si hay error, limpiar sesión (token probablemente inválido)
            this.logout();
            return null;
        }
    }

    /**
     * Actualiza el perfil del usuario
     * @param {Object} userData 
     * @returns {Promise<Object>}
     */
    async updateProfile(userData) {
        try {
            if (!this.isAuthenticated()) {
                return {
                    success: false,
                    message: 'Debes iniciar sesión para actualizar el perfil'
                };
            }

            const response = await apiClient.put('/auth/update-profile', userData);

            if (response.success) {
                this.currentUser = response.user;
                // Actualizar sesión local
                const storage = localStorage.getItem(this.sessionKey) ? localStorage : sessionStorage;
                const session = JSON.parse(storage.getItem(this.sessionKey));
                session.user = response.user;
                storage.setItem(this.sessionKey, JSON.stringify(session));
            }

            return response;

        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            return {
                success: false,
                message: error.message || 'Error al actualizar el perfil'
            };
        }
    }

    /**
     * Cambia la contraseña del usuario
     * @param {string} currentPassword 
     * @param {string} newPassword 
     * @returns {Promise<Object>}
     */
    async changePassword(currentPassword, newPassword) {
        try {
            if (!this.isAuthenticated()) {
                return {
                    success: false,
                    message: 'Debes iniciar sesión'
                };
            }

            if (newPassword.length < 6) {
                return {
                    success: false,
                    message: 'La nueva contraseña debe tener al menos 6 caracteres'
                };
            }

            const response = await apiClient.put('/auth/change-password', {
                currentPassword,
                newPassword
            });

            return response;

        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            return {
                success: false,
                message: error.message || 'Error al cambiar la contraseña'
            };
        }
    }

    /**
     * Guarda la sesión localmente (solo token y datos básicos)
     * @param {string} token 
     * @param {boolean} rememberMe 
     */
    saveSession(token, rememberMe = false) {
        const sessionData = {
            token,
            user: this.currentUser,
            timestamp: new Date().getTime()
        };

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(this.sessionKey, JSON.stringify(sessionData));
    }

    /**
     * Carga la sesión guardada y verifica con la API
     */
    loadSession() {
        let sessionData = localStorage.getItem(this.sessionKey) || 
                         sessionStorage.getItem(this.sessionKey);

        if (!sessionData) {
            return false;
        }

        try {
            const parsed = JSON.parse(sessionData);
            
            // Verificar que la sesión no haya expirado (7 días)
            const now = new Date().getTime();
            const sessionAge = now - parsed.timestamp;
            const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 días

            if (sessionAge > maxAge) {
                this.logout();
                return false;
            }

            // Cargar usuario temporalmente
            this.currentUser = parsed.user;

            // Verificar con la API en segundo plano
            this.getCurrentUserFromAPI().catch(err => {
                console.error('Error al verificar sesión:', err);
            });

            return true;

        } catch (error) {
            console.error('Error al cargar sesión:', error);
            return false;
        }
    }

    /**
     * Determina la URL de redirección según el rol
     * @param {string} role 
     * @returns {string}
     */
    getRedirectUrl(role) {
        const isInHtmlFolder = window.location.pathname.includes('/html/');
        
        switch (role) {
            case 'administrator':
                return isInHtmlFolder ? './AdminProfile.html' : './html/AdminProfile.html';
            case 'client':
                return isInHtmlFolder ? './ClientProfile.html' : './html/ClientProfile.html';
            default:
                return isInHtmlFolder ? '../index.html' : './index.html';
        }
    }

    /**
     * Verifica si el usuario está logueado
     * @returns {boolean}
     */
    isAuthenticated() {
        return this.currentUser !== null;
    }

    /**
     * Verifica si el usuario actual es administrador
     * @returns {boolean}
     */
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'administrator';
    }

    /**
     * Verifica si el usuario actual es cliente
     * @returns {boolean}
     */
    isClient() {
        return this.currentUser && this.currentUser.role === 'client';
    }

    /**
     * Obtiene el usuario actual (sin contraseña)
     * @returns {Object|null}
     */
    getCurrentUser() {
        return this.currentUser;
    }
}

// ==========================================
// INICIALIZACIÓN GLOBAL
// ==========================================

// Crear instancia global del servicio de autenticación
const authService = new AuthService();

// Hacer disponible globalmente para otros scripts
window.authService = authService;

// ==========================================
// FUNCIONES DE UI (mantienen compatibilidad con código existente)
// ==========================================

/**
 * Actualiza la interfaz según el estado de autenticación
 */
function updateAuthUI() {
    const userMenuItem = document.getElementById('userMenuItem');
    
    if (!userMenuItem) return;

    if (authService.isAuthenticated()) {
        const user = authService.getCurrentUser();
        const firstName = user.firstName || 'Usuario';
        const initial = firstName.charAt(0).toUpperCase();

        const isInAdminPanel = window.location.pathname.includes('AdminProfile.html');
        const isInHtmlFolder = window.location.pathname.includes('/html/');
        
        let menuOptions = '';
        
        if (user.role === 'administrator') {
            if (isInAdminPanel) {
                menuOptions = `
                    <a href="#"><i class="fa fa-user"></i> Mi Perfil</a>
                    <a href="#"><i class="fa fa-cog"></i> Configuración</a>
                    <a href="../index.html"><i class="fa fa-globe"></i> Ver Sitio Web</a>
                    <a href="#" class="logout-btn" id="logoutBtn"><i class="fa fa-sign-out"></i> Cerrar Sesión</a>
                `;
            } else {
                const adminPanelPath = isInHtmlFolder ? './AdminProfile.html' : './html/AdminProfile.html';
                menuOptions = `
                    <a href="${adminPanelPath}"><i class="fa fa-tachometer"></i> Panel Admin</a>
                    <a href="#"><i class="fa fa-user"></i> Mi Perfil</a>
                    <a href="#"><i class="fa fa-cog"></i> Configuración</a>
                    <a href="#" class="logout-btn" id="logoutBtn"><i class="fa fa-sign-out"></i> Cerrar Sesión</a>
                `;
            }
        } else {
            // Para clientes
            const isInHtmlFolder = window.location.pathname.includes('/html/');
            const isInClientPanel = window.location.pathname.includes('ClientProfile.html');
            
            if (isInClientPanel) {
                menuOptions = `
                    <a href="#"><i class="fa fa-user"></i> Mi Perfil</a>
                    <a href="#"><i class="fa fa-cog"></i> Configuración</a>
                    <a href="../index.html"><i class="fa fa-globe"></i> Ver Sitio Web</a>
                    <a href="#" class="logout-btn" id="logoutBtn"><i class="fa fa-sign-out"></i> Cerrar Sesión</a>
                `;
            } else {
                const clientPanelPath = isInHtmlFolder ? './ClientProfile.html' : './html/ClientProfile.html';
                menuOptions = `
                    <a href="${clientPanelPath}"><i class="fa fa-tachometer"></i> Panel Cliente</a>
                    <a href="#"><i class="fa fa-user"></i> Mi Perfil</a>
                    <a href="#"><i class="fa fa-heart"></i> Favoritos</a>
                    <a href="#"><i class="fa fa-shopping-bag"></i> Mis Pedidos</a>
                    <a href="#"><i class="fa fa-calendar"></i> Mis Reservas</a>
                    <a href="#"><i class="fa fa-cog"></i> Configuración</a>
                    <a href="#" class="logout-btn" id="logoutBtn"><i class="fa fa-sign-out"></i> Cerrar Sesión</a>
                `;
            }
        }

        userMenuItem.innerHTML = `
            <div class="user-menu-dropdown">
                <div class="user-info" id="userInfo">
                    <div class="user-avatar">${initial}</div>
                    <span class="user-name">${firstName}</span>
                    <i class="fa fa-chevron-down" style="font-size: 12px; color: white;"></i>
                </div>
                <div class="dropdown-menu" id="dropdownMenu">
                    ${menuOptions}
                </div>
            </div>
        `;

        const userInfo = document.getElementById('userInfo');
        const dropdownMenu = document.getElementById('dropdownMenu');
        const logoutBtn = document.getElementById('logoutBtn');

        if (userInfo && dropdownMenu) {
            userInfo.addEventListener('click', (e) => {
                e.preventDefault();
                dropdownMenu.classList.toggle('show');
            });

            document.addEventListener('click', (e) => {
                if (!userInfo.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    dropdownMenu.classList.remove('show');
                }
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                handleLogout();
            });
        }
    } else {
        userMenuItem.innerHTML = '<a href="#" class="login-btn" id="loginBtn">Ingresar</a>';
        
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const loginModal = document.getElementById('loginModal');
                if (loginModal) {
                    loginModal.style.display = 'flex';
                }
            });
        }
    }
}

/**
 * Maneja el cierre de sesión
 */
/**
 * Maneja el cierre de sesión
 */
async function handleLogout() {
    const result = await authService.logout();
    
    if (result.success) {
        // Actualizar UI primero
        updateAuthUI();
        
        // Determinar ruta correcta según ubicación actual
        const isInHtmlFolder = window.location.pathname.includes('/html/');
        const redirectPath = isInHtmlFolder ? '../index.html' : './index.html';
        
        // Redirigir al home
        window.location.href = redirectPath;
    }
}

/**
 * Protege páginas que requieren autenticación
 * @param {string} requiredRole 
 */
function protectPage(requiredRole = null) {
    if (!authService.isAuthenticated()) {
        alert('Debes iniciar sesión para acceder a esta página');
        window.location.href = '../index.html';
        return false;
    }

    if (requiredRole && authService.getCurrentUser().role !== requiredRole) {
        alert('No tienes permisos para acceder a esta página');
        window.location.href = '../index.html';
        return false;
    }

    return true;
}

// Hacer disponibles las funciones globalmente
window.updateAuthUI = updateAuthUI;
window.handleLogout = handleLogout;
window.protectPage = protectPage;

console.log('🔐 Sistema de autenticación con API cargado correctamente');
