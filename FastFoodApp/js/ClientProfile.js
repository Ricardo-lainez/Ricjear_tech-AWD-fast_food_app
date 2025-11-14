/**
 * ========================================
 * CLIENTE PROFILE - JAVASCRIPT
 * Panel de Cliente para FastFoodApp
 * ========================================
 */

class ClientProfile {
    constructor() {
        this.currentUser = null;
        this.currentSection = 'dashboard';
        this.apiBaseURL = 'http://localhost:3000/api';
        
        // Elementos del DOM
        this.initializeDOMElements();
        
        // Event listeners
        this.initializeEventListeners();
        
        // Inicializar aplicación
        this.init();
    }

    /**
     * Inicializar elementos del DOM
     */
    initializeDOMElements() {
        // Navegación
        this.navItems = document.querySelectorAll('.nav-item');
        this.contentSections = document.querySelectorAll('.content-section');
        
        // Header - buscar en diferentes lugares
        this.userDropdown = document.querySelector('.user-dropdown, .client-user-info, #clientUserInfo');
        this.userNameSpan = document.querySelector('.user-name');
        this.userEmailSpan = document.querySelector('.user-email');
        
        // Dashboard
        this.dashboardStats = {
            totalOrders: document.querySelector('[data-stat="total-orders"]'),
            totalReservations: document.querySelector('[data-stat="total-reservations"]'),
            totalReviews: document.querySelector('[data-stat="total-reviews"]'),
            totalPoints: document.querySelector('[data-stat="total-points"]')
        };

        // Formularios
        this.profileForm = document.getElementById('profile-form');
        this.passwordForm = document.getElementById('change-password-form');
        
        // Botones de acción (se buscarán dinámicamente después de updateAuthUI)
        this.logoutBtn = null; // Se asignará dinámicamente
        this.editProfileBtn = document.getElementById('edit-profile-btn');
        
        // Contenedores de datos dinámicos
        this.ordersContainer = document.querySelector('.orders-grid');
        this.reservationsContainer = document.querySelector('.reservations-grid');
        this.reviewsContainer = document.querySelector('.reviews-grid');

        console.log('Elementos DOM inicializados:', {
            navItems: this.navItems.length,
            userDropdown: !!this.userDropdown,
            profileForm: !!this.profileForm
        });
    }

    /**
     * Inicializar event listeners
     */
    initializeEventListeners() {
        // Navegación lateral
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Dropdown de usuario
        if (this.userDropdown) {
            this.userDropdown.addEventListener('click', (e) => this.toggleUserDropdown(e));
        }

        // Formulario de perfil
        if (this.profileForm) {
            this.profileForm.addEventListener('submit', (e) => this.handleUpdateProfile(e));
        }

        // Formulario de cambio de contraseña
        if (this.passwordForm) {
            this.passwordForm.addEventListener('submit', (e) => this.handleChangePassword(e));
        }

        // Inicializar botones del dropdown del header después de updateAuthUI
        this.initializeHeaderButtons();

        // Cerrar dropdown al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!this.userDropdown?.contains(e.target)) {
                this.closeUserDropdown();
            }
        });

        // Botones de acción rápida
        this.initializeQuickActions();
    }

    /**
     * Inicializar botones del header (se ejecuta después de updateAuthUI)
     */
    initializeHeaderButtons() {
        // Usar setTimeout para asegurar que updateAuthUI haya terminado
        setTimeout(() => {
            // Botón de logout - ser más específico para evitar conflictos
            const logoutBtns = document.querySelectorAll('#logoutBtn, .logout-item');
            logoutBtns.forEach(btn => {
                // Verificar que realmente es el botón de logout por su texto
                const text = btn.textContent.toLowerCase();
                if (text.includes('cerrar sesión') || text.includes('logout')) {
                    btn.addEventListener('click', (e) => this.handleLogout(e));
                }
            });

            // Botón "Editar Perfil" - redirigir a sección profile
            const editProfileBtns = document.querySelectorAll('a[data-section="profile"], .dropdown-item[href="#"]');
            editProfileBtns.forEach(btn => {
                // Solo agregar listener si el texto contiene "Editar" o "Perfil"
                const text = btn.textContent.toLowerCase();
                if (text.includes('editar') || text.includes('perfil')) {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.showSection('profile');
                        this.closeUserDropdown();
                        console.log(' Navegando a sección de perfil');
                    });
                }
            });

            // Botón "Ver Sitio Web" 
            const siteBtns = document.querySelectorAll('a[href="../index.html"]');
            siteBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = '../index.html';
                });
            });

            // Botón "Panel Cliente" (si está en otra página)
            const panelBtns = document.querySelectorAll('a[href*="ClientProfile.html"]');
            panelBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isInHtmlFolder = window.location.pathname.includes('/html/');
                    const targetUrl = isInHtmlFolder ? './ClientProfile.html' : './html/ClientProfile.html';
                    window.location.href = targetUrl;
                });
            });

            console.log('Botones del header inicializados');
        }, 100);
    }

    /**
     * Inicializar botones de acción rápida
     */
    initializeQuickActions() {
        // Editar perfil (desde dashboard)
        const editProfileBtn = document.querySelector('.quick-action-card[onclick*="profile"], button[onclick*="profile"]');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection('profile');
                console.log('Navegando a perfil desde acción rápida');
            });
        }

        // Hacer pedido
        const orderBtn = document.querySelector('[data-action="new-order"]');
        if (orderBtn) {
            orderBtn.addEventListener('click', () => this.redirectToOrder());
        }

        // Nueva reserva
        const reservationBtn = document.querySelector('[data-action="new-reservation"]');
        if (reservationBtn) {
            reservationBtn.addEventListener('click', () => this.redirectToReservation());
        }

        // Ver menú
        const menuBtn = document.querySelector('[data-action="view-menu"]');
        if (menuBtn) {
            menuBtn.addEventListener('click', () => this.redirectToMenu());
        }

        // Contacto
        const contactBtn = document.querySelector('[data-action="contact"]');
        if (contactBtn) {
            contactBtn.addEventListener('click', () => this.redirectToContact());
        }
    }

    /**
     * Inicializar aplicación
     */
    async init() {
        try {
            console.log(' Iniciando ClientProfile...');
            
            // Verificar autenticación
            console.log(' Obteniendo usuario actual...');
            await this.getCurrentUser();
            console.log(' Usuario obtenido:', this.currentUser);
            
            // Cargar datos del dashboard
            console.log(' Cargando datos del dashboard...');
            await this.loadDashboardData();
            
            // Mostrar sección por defecto
            console.log(' Mostrando sección dashboard...');
            this.showSection('dashboard');

            console.log(' ClientProfile inicializado correctamente');

        } catch (error) {
            console.error('Error al inicializar el panel:', error);
            console.log('Redirigiendo al login...');
            this.redirectToLogin();
        }
    }

    // ==========================================
    // MÉTODOS UML IMPLEMENTADOS
    // ==========================================

    /**
     * UML: placeOrder() - Hacer pedidos
     * Redirige al menú para realizar un pedido
     */
    placeOrder() {
        window.location.href = './menu.html';
    }

    /**
     * UML: makeReservation() - Hacer reservas
     * Redirige a la página de reservaciones
     */
    makeReservation() {
        window.location.href = '../reservaciones.html';
    }

    /**
     * UML: addComment() - Comentarios/reviews
     * ADAPTADO: Por ahora muestra mensaje de funcionalidad futura
     * @param {Object} reviewData - Datos de la reseña
     */
    async addComment(reviewData) {
        try {
            // TODO: Implementar cuando se tenga estructura de productos en MongoDB
            this.showSuccessMessage('Funcionalidad de reseñas disponible próximamente');
            
            // En el futuro, esto se agregará al array de reviews del usuario
            return { success: true, message: 'Reseña guardada' };
        } catch (error) {
            this.showErrorMessage('Error al enviar la reseña: ' + error.message);
            throw error;
        }
    }

    /**
     * UML: viewReservations() - Ver sus reservas
     * ADAPTADO: Usa datos simulados almacenados en el usuario
     */
    async viewReservations() {
        try {
            // Por ahora, usar datos simulados del usuario
            // En el futuro, estos datos pueden estar en el documento del usuario en MongoDB
            const reservations = this.currentUser?.reservations || this.generateMockReservations();
            this.displayReservations(reservations);
            
            return reservations;
        } catch (error) {
            this.showErrorMessage('Error al cargar reservaciones: ' + error.message);
            this.displayReservations([]); // Mostrar estado vacío
            throw error;
        }
    }

    /**
     * UML: updateProfile() - Actualizar perfil
     * CORREGIDO: Usa el authService existente
     * @param {Object} profileData - Datos del perfil
     */
    async updateProfile(profileData) {
        try {
            // Usar authService si está disponible
            if (window.authService) {
                const result = await window.authService.updateProfile(profileData);
                
                if (result.success) {
                    this.currentUser = result.user;
                    this.updateUserDisplay();
                    this.showSuccessMessage('Perfil actualizado exitosamente');
                    return result;
                } else {
                    throw new Error(result.message || 'Error al actualizar perfil');
                }
            } else {
                // Fallback a API directa
                const response = await fetch(`${this.apiBaseURL}/auth/update-profile`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(profileData)
                });

                if (!response.ok) {
                    throw new Error('Error al actualizar el perfil');
                }

                const result = await response.json();
                this.currentUser = result.user;
                this.updateUserDisplay();
                this.showSuccessMessage('Perfil actualizado exitosamente');
                
                return result;
            }
        } catch (error) {
            this.showErrorMessage('Error al actualizar perfil: ' + error.message);
            throw error;
        }
    }

    /**
     * UML: changePassword() - Cambiar contraseña
     * CORREGIDO: Usa el authService existente
     * @param {Object} passwordData - Datos de contraseña
     */
    async changePassword(passwordData) {
        try {
            // Usar authService si está disponible
            if (window.authService) {
                const result = await window.authService.changePassword(
                    passwordData.currentPassword,
                    passwordData.newPassword
                );
                
                if (result.success) {
                    this.showSuccessMessage('Contraseña cambiada exitosamente');
                    
                    // Limpiar formulario
                    if (this.passwordForm) {
                        this.passwordForm.reset();
                    }
                    
                    return result;
                } else {
                    throw new Error(result.message || 'Error al cambiar contraseña');
                }
            } else {
                // Fallback a API directa
                const response = await fetch(`${this.apiBaseURL}/auth/change-password`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(passwordData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al cambiar la contraseña');
                }

                const result = await response.json();
                this.showSuccessMessage('Contraseña cambiada exitosamente');
                
                // Limpiar formulario
                if (this.passwordForm) {
                    this.passwordForm.reset();
                }
                
                return result;
            }
        } catch (error) {
            this.showErrorMessage('Error al cambiar contraseña: ' + error.message);
            throw error;
        }
    }

    /**
     * UML: viewOrderDetails() - Ver historial de pedidos
     * ADAPTADO: Usa datos simulados almacenados en el usuario
     */
    async viewOrderDetails() {
        try {
            // Por ahora, usar datos simulados del usuario
            // En el futuro, estos datos pueden estar en el documento del usuario en MongoDB
            const orders = this.currentUser?.orders || this.generateMockOrders();
            this.displayOrders(orders);
            
            return orders;
        } catch (error) {
            this.showErrorMessage('Error al cargar pedidos: ' + error.message);
            this.displayOrders([]); // Mostrar estado vacío
            throw error;
        }
    }

    // ==========================================
    // MÉTODOS DE UTILIDAD Y UI
    // ==========================================

    /**
     * TEMPORAL: Generar datos simulados de pedidos
     * Estos datos se almacenarán en el documento del usuario en MongoDB
     */
    generateMockOrders() {
        return [
            {
                _id: 'order_001',
                orderNumber: 'ORD-001',
                createdAt: new Date('2024-11-02'),
                status: 'delivered',
                items: [
                    { name: 'Pizza Margherita', quantity: 2, price: 18.00 },
                    { name: 'Coca Cola', quantity: 2, price: 4.00 }
                ],
                total: 22.00
            },
            {
                _id: 'order_002', 
                orderNumber: 'ORD-002',
                createdAt: new Date('2024-10-28'),
                status: 'completed',
                items: [
                    { name: 'Hamburguesa Clásica', quantity: 1, price: 12.00 },
                    { name: 'Papas Fritas', quantity: 1, price: 5.00 }
                ],
                total: 17.00
            }
        ];
    }

    /**
     * TEMPORAL: Generar datos simulados de reservaciones
     */
    generateMockReservations() {
        return [
            {
                _id: 'reservation_001',
                reservationNumber: 'RES-001',
                date: new Date('2024-11-15'),
                time: '19:00',
                partySize: 4,
                location: 'Sede Principal',
                status: 'confirmed',
                specialRequests: 'Mesa cerca de la ventana'
            },
            {
                _id: 'reservation_002',
                reservationNumber: 'RES-002', 
                date: new Date('2024-11-10'),
                time: '20:30',
                partySize: 2,
                location: 'Sede Centro',
                status: 'completed',
                specialRequests: null
            }
        ];
    }

    /**
     * TEMPORAL: Generar datos simulados de reseñas
     */
    generateMockReviews() {
        return [
            {
                _id: 'review_001',
                product: {
                    _id: 'product_001',
                    name: 'Pizza Margherita',
                    image: '../images/platos/pizza-margherita.jpg'
                },
                rating: 5,
                comment: '¡Absolutamente deliciosa! La masa estaba perfecta, crujiente por fuera y suave por dentro.',
                tags: ['Deliciosa', 'Masa perfecta', 'Ingredientes frescos'],
                createdAt: new Date('2024-11-02'),
                helpfulCount: 8
            },
            {
                _id: 'review_002',
                product: {
                    _id: 'product_002', 
                    name: 'Hamburguesa Clásica',
                    image: '../images/platos/hamburguesa-clasica.jpg'
                },
                rating: 4,
                comment: 'Muy buena hamburguesa, la carne estaba jugosa y bien sazonada.',
                tags: ['Carne jugosa', 'Bien sazonada', 'Papas perfectas'],
                createdAt: new Date('2024-10-28'),
                helpfulCount: 5
            }
        ];
    }

    /**
     * Obtener usuario actual
     * CORREGIDO: Usa el authService existente en lugar de fetch directo
     */
    async getCurrentUser() {
        try {
            // Verificar si hay un authService disponible
            if (window.authService) {
                // Verificar si está autenticado
                if (!window.authService.isAuthenticated()) {
                    throw new Error('Usuario no autenticado');
                }
                
                // Obtener usuario del servicio
                this.currentUser = window.authService.getCurrentUser();
                
                if (!this.currentUser) {
                    throw new Error('No se pudo obtener información del usuario');
                }
                
                this.updateUserDisplay();
                return this.currentUser;
            } else {
                // Fallback a la API directa si no hay authService
                const response = await fetch(`${this.apiBaseURL}/auth/me`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Usuario no autenticado');
                }

                const userData = await response.json();
                this.currentUser = userData.user;
                this.updateUserDisplay();
                
                return this.currentUser;
            }
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            throw error;
        }
    }

    /**
     * Cargar datos del dashboard
     * ADAPTADO: Usa datos simulados y información del usuario actual
     */
    async loadDashboardData() {
        try {
            // Cargar datos simulados para mostrar funcionalidad
            const [orders, reservations, reviews] = await Promise.allSettled([
                this.viewOrderDetails(),
                this.viewReservations(), 
                this.viewReviews()
            ]);

            // Actualizar estadísticas del dashboard
            this.updateDashboardStats({
                totalOrders: orders.status === 'fulfilled' ? orders.value.length : 0,
                totalReservations: reservations.status === 'fulfilled' ? reservations.value.length : 0,
                totalReviews: reviews.status === 'fulfilled' ? reviews.value.length : 0,
                totalPoints: this.currentUser?.loyaltyPoints || 1250 // Valor por defecto
            });

        } catch (error) {
            console.error('Error al cargar datos del dashboard:', error);
        }
    }

    /**
     * Ver reseñas del usuario
     * ADAPTADO: Usa datos simulados almacenados en el usuario
     */
    async viewReviews() {
        try {
            // Por ahora, usar datos simulados del usuario
            // En el futuro, estos datos pueden estar en el documento del usuario en MongoDB
            const reviews = this.currentUser?.reviews || this.generateMockReviews();
            this.displayReviews(reviews);
            
            return reviews;
        } catch (error) {
            this.showErrorMessage('Error al cargar reseñas: ' + error.message);
            this.displayReviews([]); // Mostrar estado vacío
            throw error;
        }
    }

    /**
     * Manejar navegación entre secciones
     */
    handleNavigation(e) {
        e.preventDefault();
        const section = e.currentTarget.dataset.section;
        this.showSection(section);
    }

    /**
     * Mostrar sección específica
     */
    async showSection(sectionName) {
        // Actualizar navegación activa
        this.navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.section === sectionName);
        });

        // Mostrar sección correspondiente
        this.contentSections.forEach(section => {
            section.classList.toggle('active', section.id === `${sectionName}-section`);
        });

        this.currentSection = sectionName;

        // Cargar datos específicos de la sección
        switch (sectionName) {
            case 'orders':
                await this.viewOrderDetails();
                break;
            case 'reservations':
                await this.viewReservations();
                break;
            case 'reviews':
                await this.viewReviews();
                break;
            case 'profile':
                await this.loadProfileData();
                break;
            case 'dashboard':
                await this.loadDashboardData();
                break;
        }
    }

    /**
     * Manejar toggle del dropdown de usuario
     */
    toggleUserDropdown(e) {
        e.stopPropagation();
        
        // Buscar dropdown en diferentes estructuras HTML
        let dropdown = this.userDropdown?.querySelector('.dropdown-menu');
        
        // Si no encuentra el dropdown, buscar en otros lugares
        if (!dropdown) {
            dropdown = document.querySelector('#userDropdownMenu, .dropdown-menu');
        }
        
        if (dropdown) {
            dropdown.classList.toggle('show');
            dropdown.classList.toggle('active');
        } else {
            console.warn('⚠️ Dropdown menu no encontrado');
        }
    }

    /**
     * Cargar datos del perfil del usuario
     * Muestra los datos del usuario actual en el formulario de perfil
     */
    async loadProfileData() {
        try {
            console.log(' Cargando datos del perfil...');
            
            if (!this.currentUser) {
                console.log(' Usuario no disponible, obteniendo datos...');
                await this.getCurrentUser();
            }

            if (this.currentUser) {
                // Buscar el formulario de perfil
                const profileForm = document.getElementById('profileForm') || document.querySelector('#profile-form, .profile-form');
                
                if (profileForm) {
                    console.log(' Actualizando formulario de perfil...');
                    
                    // Mapeo de campos del backend con el frontend
                    const fieldMapping = {
                        'firstName': this.currentUser.firstName || '',
                        'lastName': this.currentUser.lastName || '',
                        'email': this.currentUser.email || '',
                        'phone': this.currentUser.phone || '',
                        'address': this.currentUser.address || '',
                        'preferences': this.currentUser.preferences || ''
                    };

                    // Llenar cada campo del formulario
                    Object.entries(fieldMapping).forEach(([fieldName, value]) => {
                        const input = profileForm.querySelector(`input[name="${fieldName}"], textarea[name="${fieldName}"], input[id="${fieldName}"], textarea[id="${fieldName}"]`);
                        if (input) {
                            input.value = value;
                            console.log(` Campo ${fieldName}: ${value}`);
                        } else {
                            console.log(` Campo ${fieldName} no encontrado en el formulario`);
                        }
                    });

                    // Actualizar información adicional en la sidebar
                    this.updateProfileSidebar();
                    
                    console.log(' Datos del perfil cargados correctamente');
                } else {
                    console.warn(' Formulario de perfil no encontrado');
                }
            } else {
                console.error(' No hay usuario actual disponible');
            }
        } catch (error) {
            console.error(' Error al cargar datos del perfil:', error);
        }
    }

    /**
     * Actualizar información del perfil en la sidebar
     */
    updateProfileSidebar() {
        if (!this.currentUser) return;

        // Actualizar información de estadísticas del usuario
        const userStatsElements = {
            memberSince: document.querySelector('[data-info="member-since"]'),
            totalOrders: document.querySelector('[data-info="total-orders"]'),
            loyaltyPoints: document.querySelector('[data-info="loyalty-points"]'),
            favoriteCategory: document.querySelector('[data-info="favorite-category"]')
        };

        // Calcular fecha de registro
        const memberSince = this.currentUser.createdAt ? 
            new Date(this.currentUser.createdAt).toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long' 
            }) : 'No disponible';

        // Actualizar valores
        if (userStatsElements.memberSince) {
            userStatsElements.memberSince.textContent = memberSince;
        }

        if (userStatsElements.totalOrders) {
            userStatsElements.totalOrders.textContent = '0'; // Por ahora 0, se actualizará cuando haya pedidos reales
        }

        if (userStatsElements.loyaltyPoints) {
            userStatsElements.loyaltyPoints.textContent = this.currentUser.loyaltyPoints || '1250';
        }

        if (userStatsElements.favoriteCategory) {
            userStatsElements.favoriteCategory.textContent = 'Por definir'; // Se calculará con pedidos reales
        }

        console.log(' Sidebar del perfil actualizada');
    }

    /**
     * Cerrar dropdown de usuario
     */
    closeUserDropdown() {
        // Buscar todos los posibles dropdowns
        const dropdowns = document.querySelectorAll('.dropdown-menu, #userDropdownMenu');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
            dropdown.classList.remove('active');
        });
    }

    /**
     * Manejar actualización de perfil
     */
    async handleUpdateProfile(e) {
        e.preventDefault();
        
        const formData = new FormData(this.profileForm);
        const profileData = Object.fromEntries(formData.entries());
        
        try {
            await this.updateProfile(profileData);
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
        }
    }

    /**
     * Manejar cambio de contraseña
     */
    async handleChangePassword(e) {
        e.preventDefault();
        
        const formData = new FormData(this.passwordForm);
        const passwordData = Object.fromEntries(formData.entries());
        
        // Validar que las contraseñas coincidan
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            this.showErrorMessage('Las contraseñas no coinciden');
            return;
        }
        
        try {
            await this.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
        }
    }

    /**
     * Manejar logout
     * CORREGIDO: Usa el authService existente
     */
    async handleLogout(e) {
        e.preventDefault();
        
        try {
            // Usar authService si está disponible
            if (window.authService) {
                const result = await window.authService.logout();
                
                if (result.success) {
                    // Limpiar datos locales
                    this.currentUser = null;
                    
                    // Redirigir al login
                    this.redirectToLogin();
                } else {
                    this.showErrorMessage('Error al cerrar sesión');
                }
            } else {
                // Fallback a API directa
                const response = await fetch(`${this.apiBaseURL}/auth/logout`, {
                    method: 'POST',
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Error al cerrar sesión');
                }

                // Limpiar datos locales
                this.currentUser = null;
                
                // Redirigir al login
                this.redirectToLogin();
            }
            
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            this.showErrorMessage('Error al cerrar sesión');
        }
    }

    /**
     * Actualizar display del usuario en el header
     * ADAPTADO: Usa los campos correctos del modelo de usuario de MongoDB
     */
    updateUserDisplay() {
        if (this.currentUser) {
            // Actualizar nombre en header y mensaje de bienvenida
            const userNameElements = document.querySelectorAll('.user-name, #userName, #sidebarUserName, #welcomeUserName');
            userNameElements.forEach(element => {
                if (element) {
                    // Para el mensaje de bienvenida, usar solo el primer nombre
                    if (element.id === 'welcomeUserName') {
                        element.textContent = this.currentUser.firstName || 'Cliente';
                    } else {
                        // Para otros elementos, usar nombre completo
                        element.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}` || 'Usuario';
                    }
                }
            });

            // Actualizar email en header
            if (this.userEmailSpan) {
                this.userEmailSpan.textContent = this.currentUser.email || '';
            }

            // Actualizar formulario de perfil si existe
            const profileForm = document.getElementById('profileForm') || document.getElementById('profile-form') || document.querySelector('.profile-form');
            if (profileForm) {
                const fields = ['firstName', 'lastName', 'email', 'phone', 'address', 'preferences'];
                fields.forEach(field => {
                    const input = profileForm.querySelector(`[name="${field}"], [id="${field}"]`);
                    if (input && this.currentUser[field]) {
                        input.value = this.currentUser[field];
                    }
                });
            }

            // Actualizar puntos de lealtad
            const loyaltyElements = document.querySelectorAll('#loyaltyPoints, #dashboardPoints, #profileLoyaltyPoints');
            loyaltyElements.forEach(element => {
                if (element) {
                    element.textContent = this.currentUser.loyaltyPoints || '1250';
                }
            });

            // Re-inicializar botones del header después de actualizar UI
            this.initializeHeaderButtons();
        }
    }

    /**
     * Actualizar estadísticas del dashboard
     */
    updateDashboardStats(stats) {
        if (this.dashboardStats.totalOrders) {
            this.dashboardStats.totalOrders.textContent = stats.totalOrders;
        }
        if (this.dashboardStats.totalReservations) {
            this.dashboardStats.totalReservations.textContent = stats.totalReservations;
        }
        if (this.dashboardStats.totalReviews) {
            this.dashboardStats.totalReviews.textContent = stats.totalReviews;
        }
        if (this.dashboardStats.totalPoints) {
            this.dashboardStats.totalPoints.textContent = stats.totalPoints;
        }
    }

    /**
     * Mostrar pedidos en la UI
     */
    displayOrders(orders) {
        if (!this.ordersContainer) return;

        if (orders.length === 0) {
            this.ordersContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-bag"></i>
                    <h3>No tienes pedidos aún</h3>
                    <p>¡Realiza tu primer pedido desde nuestro menú!</p>
                    <a href="./menu.html" class="btn-primary">
                        <i class="fas fa-utensils"></i>
                        Ver Menú
                    </a>
                </div>
            `;
            return;
        }

        // Generar HTML para pedidos reales
        this.ordersContainer.innerHTML = orders.map(order => `
            <div class="order-card" data-order-id="${order._id}">
                <div class="order-header">
                    <div class="order-info">
                        <span class="order-number">#${order.orderNumber || order._id.slice(-6).toUpperCase()}</span>
                        <span class="order-date">${new Date(order.createdAt).toLocaleDateString('es-ES')}</span>
                    </div>
                    <div class="order-status status-${order.status.toLowerCase()}">
                        <i class="fas fa-circle"></i>
                        ${this.getOrderStatusText(order.status)}
                    </div>
                </div>
                <div class="order-content">
                    <div class="order-items">
                        ${order.items.map(item => `
                            <div class="order-item">
                                <span class="item-name">${item.name}</span>
                                <span class="item-quantity">x${item.quantity}</span>
                                <span class="item-price">$${item.price}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="order-total">
                        <strong>Total: $${order.total}</strong>
                    </div>
                </div>
                <div class="order-actions">
                    <button class="btn-secondary btn-sm" onclick="clientProfile.viewOrderDetail('${order._id}')">
                        <i class="fas fa-eye"></i>
                        Ver Detalles
                    </button>
                    <button class="btn-primary btn-sm" onclick="clientProfile.reorderItems('${order._id}')">
                        <i class="fas fa-redo"></i>
                        Pedir de Nuevo
                    </button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Mostrar reservaciones en la UI
     */
    displayReservations(reservations) {
        if (!this.reservationsContainer) return;

        if (reservations.length === 0) {
            this.reservationsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-alt"></i>
                    <h3>No tienes reservaciones</h3>
                    <p>¡Haz tu primera reservación!</p>
                    <a href="../reservaciones.html" class="btn-primary">
                        <i class="fas fa-calendar-plus"></i>
                        Hacer Reservación
                    </a>
                </div>
            `;
            return;
        }

        // Generar HTML para reservaciones reales
        this.reservationsContainer.innerHTML = reservations.map(reservation => `
            <div class="reservation-card" data-reservation-id="${reservation._id}">
                <div class="reservation-header">
                    <div class="reservation-info">
                        <span class="reservation-number">#${reservation.reservationNumber || reservation._id.slice(-6).toUpperCase()}</span>
                        <span class="reservation-date">${new Date(reservation.date).toLocaleDateString('es-ES')}</span>
                        <span class="reservation-time">${reservation.time}</span>
                    </div>
                    <div class="reservation-status status-${reservation.status.toLowerCase()}">
                        <i class="fas fa-circle"></i>
                        ${this.getReservationStatusText(reservation.status)}
                    </div>
                </div>
                <div class="reservation-content">
                    <div class="reservation-details">
                        <div class="detail-item">
                            <i class="fas fa-users"></i>
                            <span>${reservation.partySize} personas</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${reservation.location || 'Sede Principal'}</span>
                        </div>
                        ${reservation.specialRequests ? `
                            <div class="detail-item">
                                <i class="fas fa-comment"></i>
                                <span>${reservation.specialRequests}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                <div class="reservation-actions">
                    <button class="btn-secondary btn-sm" onclick="clientProfile.viewReservationDetail('${reservation._id}')">
                        <i class="fas fa-eye"></i>
                        Ver Detalles
                    </button>
                    ${reservation.status === 'confirmed' ? `
                        <button class="btn-primary btn-sm" onclick="clientProfile.modifyReservation('${reservation._id}')">
                            <i class="fas fa-edit"></i>
                            Modificar
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    /**
     * Mostrar reseñas en la UI
     */
    displayReviews(reviews) {
        if (!this.reviewsContainer) return;

        if (reviews.length === 0) {
            this.reviewsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-star"></i>
                    <h3>No has escrito reseñas</h3>
                    <p>¡Comparte tu experiencia con otros clientes!</p>
                    <a href="./menu.html" class="btn-primary">
                        <i class="fas fa-star"></i>
                        Ver Productos para Reseñar
                    </a>
                </div>
            `;
            return;
        }

        // Generar HTML para reseñas reales
        this.reviewsContainer.innerHTML = reviews.map(review => `
            <div class="review-card" data-review-id="${review._id}">
                <div class="review-header">
                    <div class="review-product">
                        <img src="${review.product.image}" alt="${review.product.name}" class="product-image" onerror="this.style.display='none'">
                        <div class="product-info">
                            <span class="product-name">${review.product.name}</span>
                            <span class="review-date">${new Date(review.createdAt).toLocaleDateString('es-ES')}</span>
                        </div>
                    </div>
                    <div class="review-rating">
                        <div class="stars">
                            ${this.generateStars(review.rating)}
                        </div>
                        <span class="rating-text">${review.rating}/5</span>
                    </div>
                </div>
                <div class="review-content">
                    <p class="review-text">"${review.comment}"</p>
                    ${review.tags && review.tags.length > 0 ? `
                        <div class="review-tags">
                            ${review.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="review-footer">
                    <div class="review-stats">
                        <span class="helpful">
                            <i class="fas fa-thumbs-up"></i>
                            ${review.helpfulCount || 0} personas encontraron esto útil
                        </span>
                    </div>
                    <div class="review-actions">
                        <button class="btn-secondary btn-sm" onclick="clientProfile.editReview('${review._id}')">
                            <i class="fas fa-edit"></i>
                            Editar
                        </button>
                        <button class="btn-primary btn-sm" onclick="clientProfile.reorderFromReview('${review.product._id}')">
                            <i class="fas fa-redo"></i>
                            Pedir de Nuevo
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // ==========================================
    // MÉTODOS DE UTILIDAD
    // ==========================================

    /**
     * Generar estrellas para rating
     */
    generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }

    /**
     * Obtener texto del estado del pedido
     */
    getOrderStatusText(status) {
        const statusMap = {
            'pending': 'En Preparación',
            'preparing': 'En Preparación', 
            'ready': 'Listo para Entrega',
            'delivered': 'Entregado',
            'completed': 'Completado',
            'cancelled': 'Cancelado'
        };
        return statusMap[status] || status;
    }

    /**
     * Obtener texto del estado de la reservación
     */
    getReservationStatusText(status) {
        const statusMap = {
            'pending': 'Pendiente',
            'confirmed': 'Confirmada',
            'completed': 'Completada',
            'cancelled': 'Cancelada'
        };
        return statusMap[status] || status;
    }

    /**
     * Redirigir a diferentes páginas
     */
    redirectToOrder() { window.location.href = './menu.html'; }
    redirectToReservation() { window.location.href = './reservaciones.html'; }
    redirectToMenu() { window.location.href = './menu.html'; }
    redirectToContact() { window.location.href = './contactenos.html'; }
    redirectToLogin() { window.location.href = '../index.html'; }

    /**
     * Mostrar mensajes de éxito y error
     */
    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }

    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Agregar al DOM
        document.body.appendChild(notification);

        // Auto-remove después de 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// ==========================================
// INICIALIZACIÓN
// ==========================================

// Instancia global
let clientProfile;

// Función para inicializar cuando todo esté listo
function initializeClientProfile() {
    // Verificar que authService esté disponible
    if (window.authService) {
        console.log(' AuthService encontrado, inicializando ClientProfile...');
        clientProfile = new ClientProfile();
    } else {
        console.log(' Esperando authService...');
        // Reintentar después de un breve delay
        setTimeout(initializeClientProfile, 100);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log(' DOM listo, iniciando ClientProfile...');
    initializeClientProfile();
});

// Exportar para uso global
window.ClientProfile = ClientProfile;

// Función global para compatibilidad con HTML existente
window.switchSection = function(sectionName) {
    if (window.clientProfile) {
        window.clientProfile.showSection(sectionName);
        // Cerrar dropdown si está abierto
        window.clientProfile.closeUserDropdown();
        console.log(' Cambiando a sección:', sectionName);
    } else {
        console.log(' ClientProfile no inicializado aún, esperando...');
        setTimeout(() => window.switchSection(sectionName), 100);
    }
};

// Función global para volver al sitio principal
window.returnToSite = function(e) {
    if (e) e.preventDefault(); // Prevenir comportamiento por defecto del link
    console.log('✅ Volviendo al sitio principal (manteniendo sesión)...');
    // Simplemente redirigir - la sesión ya está guardada en localStorage/sessionStorage
    window.location.href = '../index.html';
};

/* ==========================================
   NOTAS DE IMPLEMENTACIÓN
   ==========================================
   
   Este archivo está adaptado para trabajar con la estructura de MongoDB existente
   que solo tiene la colección 'users'. Las siguientes consideraciones:

   1. DATOS SIMULADOS:
      - Los pedidos, reservas y reseñas se generan de forma simulada
      - En el futuro pueden almacenarse como arrays dentro del documento del usuario
      
   2. APIS COHERENTES:
      - Solo usa las APIs existentes: /auth/me, /auth/update-profile, /auth/change-password
      - No requiere endpoints adicionales por ahora
      
   3. ESTRUCTURA ESCALABLE:
      - El código está preparado para cuando se implementen colecciones separadas
      - Solo cambiarían los métodos de obtención de datos, no la lógica de UI
      
   4. CAMPOS DE USUARIO:
      - Usa firstName, lastName, email (campos existentes en el modelo)
      - loyaltyPoints se puede agregar al esquema cuando sea necesario
*/