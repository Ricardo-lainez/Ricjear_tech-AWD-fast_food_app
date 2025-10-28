/**
 * ========================================
 * SISTEMA DE AUTENTICACIÓN SIMULADO
 * ========================================
 * Este archivo maneja toda la lógica de autenticación.
 * Está preparado para futura integración con backend/BD.
 * 
 * Basado en el UML:
 * - User (clase base)
 * - Client (hereda de User)
 * - Administrator (hereda de User)
 */

// ==========================================
// CONFIGURACIÓN Y DATOS SIMULADOS
// ==========================================

/**
 * Usuarios simulados para desarrollo
 * En producción, estos datos vendrán de la base de datos
 * Estructura basada en el UML: User -> Client/Administrator
 */
const SIMULATED_USERS = [
    {
        id: 1,
        firstName: 'Raul',
        lastName: 'Administrador',
        email: 'admin@adminbocatto.com',
        password: 'adminPass123', // En producción estará hasheada
        phone: '0999999999',
        address: 'Quito, Ecuador',
        registrationDate: new Date('2024-01-01'),
        isActive: true,
        role: 'administrator', // Diferenciador de tipo de usuario
        // Campos específicos de Administrator (según UML)
        acceso: 'FULL_ACCESS',
        adminAcceso: 'SUPER_ADMIN'
    },
    {
        id: 2,
        firstName: 'María',
        lastName: 'Cliente',
        email: 'cliente@bocatto.com',
        password: 'cliente123',
        phone: '0988888888',
        address: 'Guayaquil, Ecuador',
        registrationDate: new Date('2024-06-15'),
        isActive: true,
        role: 'client', // Cliente regular
        // Campos específicos de Client (según UML)
        loyaltyPoints: 150,
        preferences: 'Sin gluten, vegetariano'
    },
    {
        id: 3,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        password: '123456',
        phone: '0987654321',
        address: 'Cuenca, Ecuador',
        registrationDate: new Date('2024-10-01'),
        isActive: true,
        role: 'client',
        loyaltyPoints: 50,
        preferences: ''
    }
];

// ==========================================
// CLASE AuthService - Servicio de Autenticación
// ==========================================

class AuthService {
    constructor() {
        this.currentUser = null;
        this.sessionKey = 'bocatto_session';
        this.usersKey = 'bocatto_users'; // Para almacenar usuarios registrados temporalmente
        this.init();
    }

    /**
     * Inicializa el servicio de autenticación
     * Verifica si hay una sesión activa
     */
    init() {
        this.initializeUsersStorage();
        this.loadSession();
    }

    /**
     * Inicializa el almacenamiento de usuarios
     * Carga usuarios simulados si no existen
     */
    initializeUsersStorage() {
        const existingUsers = localStorage.getItem(this.usersKey);
        
        if (!existingUsers) {
            // Guardar usuarios simulados iniciales
            localStorage.setItem(this.usersKey, JSON.stringify(SIMULATED_USERS));
        } else {
            // ACTUALIZAR credenciales del administrador si existe versión antigua
            try {
                const users = JSON.parse(existingUsers);
                let updated = false;
                
                // Buscar y actualizar admin con credenciales antiguas
                const adminIndex = users.findIndex(u => 
                    u.email === 'admin@bocatto.com' || u.role === 'administrator'
                );
                
                if (adminIndex !== -1) {
                    // Actualizar con las nuevas credenciales
                    users[adminIndex] = SIMULATED_USERS[0]; // Raul con nuevas credenciales
                    updated = true;
                }
                
                if (updated) {
                    localStorage.setItem(this.usersKey, JSON.stringify(users));
                    console.log('✅ Credenciales de administrador actualizadas');
                }
            } catch (error) {
                console.error('Error al actualizar usuarios:', error);
                // En caso de error, resetear con usuarios simulados
                localStorage.setItem(this.usersKey, JSON.stringify(SIMULATED_USERS));
            }
        }
    }

    /**
     * Obtiene todos los usuarios registrados
     * @returns {Array}
     */
    getAllUsers() {
        try {
            const users = localStorage.getItem(this.usersKey);
            return users ? JSON.parse(users) : SIMULATED_USERS;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            return SIMULATED_USERS;
        }
    }

    /**
     * Guarda la lista de usuarios
     * @param {Array} users 
     */
    saveUsers(users) {
        try {
            localStorage.setItem(this.usersKey, JSON.stringify(users));
        } catch (error) {
            console.error('Error al guardar usuarios:', error);
        }
    }

    /**
     * Registra un nuevo usuario (solo clientes)
     * Basado en UML: User -> Client
     * @param {Object} userData 
     * @returns {Object}
     */
    register(userData) {
        const users = this.getAllUsers();

        // 1. Validar que el email no exista
        const existingUser = users.find(u => 
            u.email.toLowerCase() === userData.email.toLowerCase()
        );

        if (existingUser) {
            return {
                success: false,
                message: 'Este correo electrónico ya está registrado. Por favor, inicia sesión.'
            };
        }

        // 2. Validar campos requeridos
        if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
            return {
                success: false,
                message: 'Por favor, completa todos los campos requeridos.'
            };
        }

        // 3. Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            return {
                success: false,
                message: 'Por favor, ingresa un email válido.'
            };
        }

        // 4. Validar contraseña
        if (userData.password.length < 6) {
            return {
                success: false,
                message: 'La contraseña debe tener al menos 6 caracteres.'
            };
        }

        // 5. Validar que las contraseñas coincidan
        if (userData.password !== userData.confirmPassword) {
            return {
                success: false,
                message: 'Las contraseñas no coinciden.'
            };
        }

        // 6. Validar teléfono si se proporciona
        if (userData.phone && !/^\d{10}$/.test(userData.phone.replace(/\s/g, ''))) {
            return {
                success: false,
                message: 'El teléfono debe tener 10 dígitos.'
            };
        }

        // 7. Crear nuevo usuario (siempre como CLIENTE)
        const newUser = {
            id: this.generateUserId(users),
            firstName: userData.firstName.trim(),
            lastName: userData.lastName.trim(),
            email: userData.email.toLowerCase().trim(),
            password: userData.password, // En producción: bcrypt.hash(password)
            phone: userData.phone ? userData.phone.trim() : '',
            address: userData.address ? userData.address.trim() : '',
            registrationDate: new Date(),
            isActive: true,
            role: 'client', // SIEMPRE cliente en el registro público
            // Campos específicos de Client (según UML)
            loyaltyPoints: 0, // Puntos iniciales
            preferences: ''
        };

        // 8. Agregar usuario a la lista
        users.push(newUser);
        this.saveUsers(users);

        // 9. Login automático después del registro
        this.currentUser = newUser;
        this.saveSession(true);

        return {
            success: true,
            message: '¡Cuenta creada exitosamente! Bienvenido a Bocatto Valley.',
            user: this.getSafeUserData(newUser)
        };
    }

    /**
     * Genera un ID único para el nuevo usuario
     * @param {Array} users 
     * @returns {number}
     */
    generateUserId(users) {
        if (users.length === 0) return 1;
        const maxId = Math.max(...users.map(u => u.id));
        return maxId + 1;
    }

    /**
     * Método de login (basado en UML: User.login())
     * @param {string} email 
     * @param {string} password 
     * @param {boolean} rememberMe 
     * @returns {Object} Resultado del login
     */
    login(email, password, rememberMe = false) {
        // Validación de credenciales (UML: User.validateCredentials())
        const user = this.validateCredentials(email, password);

        if (!user) {
            return {
                success: false,
                message: 'Credenciales incorrectas. Verifica tu email y contraseña.'
            };
        }

        if (!user.isActive) {
            return {
                success: false,
                message: 'Esta cuenta ha sido desactivada. Contacta con soporte.'
            };
        }

        // Login exitoso
        this.currentUser = user;
        this.saveSession(rememberMe);

        return {
            success: true,
            message: 'Inicio de sesión exitoso',
            user: this.getSafeUserData(user),
            redirectTo: this.getRedirectUrl(user.role)
        };
    }

    /**
     * Valida las credenciales del usuario (UML: User.validateCredentials())
     * En producción, esto se hará en el backend con hash de contraseñas
     * @param {string} email 
     * @param {string} password 
     * @returns {Object|null} Usuario si las credenciales son válidas
     */
    validateCredentials(email, password) {
        const users = this.getAllUsers();
        const user = users.find(u => 
            u.email.toLowerCase() === email.toLowerCase() && 
            u.password === password
        );
        return user || null;
    }

    /**
     * Cierra la sesión del usuario
     */
    logout() {
        this.currentUser = null;
        localStorage.removeItem(this.sessionKey);
        sessionStorage.removeItem(this.sessionKey);
        
        return {
            success: true,
            message: 'Sesión cerrada correctamente'
        };
    }

    /**
     * Guarda la sesión en localStorage o sessionStorage
     * @param {boolean} rememberMe 
     */
    saveSession(rememberMe = false) {
        const sessionData = {
            user: this.getSafeUserData(this.currentUser),
            timestamp: new Date().getTime()
        };

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(this.sessionKey, JSON.stringify(sessionData));
    }

    /**
     * Carga la sesión guardada
     */
    loadSession() {
        let sessionData = localStorage.getItem(this.sessionKey) || 
                         sessionStorage.getItem(this.sessionKey);

        if (!sessionData) {
            return false;
        }

        try {
            const parsed = JSON.parse(sessionData);
            
            // Verificar que la sesión no haya expirado (24 horas)
            const now = new Date().getTime();
            const sessionAge = now - parsed.timestamp;
            const maxAge = 24 * 60 * 60 * 1000; // 24 horas

            if (sessionAge > maxAge) {
                this.logout();
                return false;
            }

            // Buscar el usuario completo
            const users = this.getAllUsers();
            const fullUser = users.find(u => u.id === parsed.user.id);
            if (fullUser && fullUser.isActive) {
                this.currentUser = fullUser;
                return true;
            }

            return false;
        } catch (error) {
            console.error('Error al cargar sesión:', error);
            return false;
        }
    }

    /**
     * Obtiene datos seguros del usuario (sin contraseña)
     * @param {Object} user 
     * @returns {Object}
     */
    getSafeUserData(user) {
        const { password, ...safeData } = user;
        return safeData;
    }

    /**
     * Determina la URL de redirección según el rol
     * @param {string} role 
     * @returns {string}
     */
    getRedirectUrl(role) {
        switch (role) {
            case 'administrator':
                return './html/AdminProfile.html';
            case 'client':
                return './index.html'; // Por ahora redirige al home
            default:
                return './index.html';
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
     * Obtiene el usuario actual
     * @returns {Object|null}
     */
    getCurrentUser() {
        return this.currentUser ? this.getSafeUserData(this.currentUser) : null;
    }

    /**
     * Actualiza el perfil del usuario (UML: Client.updateProfile())
     * Por ahora solo simula, en producción hará llamada al backend
     * @param {Object} userData 
     * @returns {Object}
     */
    updateProfile(userData) {
        if (!this.isAuthenticated()) {
            return {
                success: false,
                message: 'Debes iniciar sesión para actualizar el perfil'
            };
        }

        // Simular actualización
        Object.assign(this.currentUser, userData);
        this.saveSession(true);

        return {
            success: true,
            message: 'Perfil actualizado correctamente',
            user: this.getSafeUserData(this.currentUser)
        };
    }

    /**
     * Cambia la contraseña del usuario (UML: User.changePassword())
     * @param {string} oldPassword 
     * @param {string} newPassword 
     * @returns {Object}
     */
    changePassword(oldPassword, newPassword) {
        if (!this.isAuthenticated()) {
            return {
                success: false,
                message: 'Debes iniciar sesión'
            };
        }

        if (this.currentUser.password !== oldPassword) {
            return {
                success: false,
                message: 'La contraseña actual es incorrecta'
            };
        }

        if (newPassword.length < 6) {
            return {
                success: false,
                message: 'La nueva contraseña debe tener al menos 6 caracteres'
            };
        }

        // Simular cambio de contraseña
        this.currentUser.password = newPassword;
        
        return {
            success: true,
            message: 'Contraseña cambiada correctamente'
        };
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
// FUNCIONES DE UI
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

        userMenuItem.innerHTML = `
            <div class="user-menu-dropdown">
                <div class="user-info" id="userInfo">
                    <div class="user-avatar">${initial}</div>
                    <span class="user-name">${firstName}</span>
                    <i class="fa fa-chevron-down" style="font-size: 12px; color: white;"></i>
                </div>
                <div class="dropdown-menu" id="dropdownMenu">
                    <a href="#"><i class="fa fa-user"></i> Mi Perfil</a>
                    <a href="#"><i class="fa fa-heart"></i> Favoritos</a>
                    <a href="#"><i class="fa fa-shopping-bag"></i> Mis Pedidos</a>
                    <a href="#"><i class="fa fa-calendar"></i> Mis Reservas</a>
                    <a href="#"><i class="fa fa-cog"></i> Configuración</a>
                    <a href="#" class="logout-btn" id="logoutBtn"><i class="fa fa-sign-out"></i> Cerrar Sesión</a>
                </div>
            </div>
        `;

        // Event listeners para el menú desplegable
        const userInfo = document.getElementById('userInfo');
        const dropdownMenu = document.getElementById('dropdownMenu');
        const logoutBtn = document.getElementById('logoutBtn');

        if (userInfo && dropdownMenu) {
            userInfo.addEventListener('click', (e) => {
                e.preventDefault();
                dropdownMenu.classList.toggle('show');
            });

            // Cerrar dropdown al hacer click fuera
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
        
        // Re-asignar event listener para abrir modal
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
function handleLogout() {
    const result = authService.logout();
    
    if (result.success) {
        // Mostrar mensaje
        alert(result.message);
        
        // Actualizar UI
        updateAuthUI();
        
        // Redirigir al home
        window.location.href = '../index.html';
    }
}

/**
 * Protege páginas que requieren autenticación
 * @param {string} requiredRole - 'client', 'administrator', o null para cualquiera
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

console.log('🔐 Sistema de autenticación cargado correctamente');
