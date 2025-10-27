/**
 * ========================================
 * REGISTER MODAL - Gestión del Modal de Registro
 * ========================================
 * Maneja el registro de nuevos usuarios (solo clientes)
 */

document.addEventListener('DOMContentLoaded', function() {
    // ==========================================
    // ELEMENTOS DEL DOM
    // ==========================================

    const registerModal = document.getElementById('registerModal');
    const openRegisterModal = document.getElementById('openRegisterModal');
    const closeRegisterModal = document.getElementById('closeRegisterModal');
    const backToLogin = document.getElementById('backToLogin');
    const registerForm = document.getElementById('registerForm');
    const registerError = document.getElementById('registerError');
    const registerSuccess = document.getElementById('registerSuccess');

    // Campos del formulario
    const firstNameInput = document.getElementById('registerFirstName');
    const lastNameInput = document.getElementById('registerLastName');
    const emailInput = document.getElementById('registerEmail');
    const passwordInput = document.getElementById('registerPassword');
    const confirmPasswordInput = document.getElementById('registerConfirmPassword');
    const phoneInput = document.getElementById('registerPhone');
    const addressInput = document.getElementById('registerAddress');
    const termsAccept = document.getElementById('termsAccept');
    const newsletterAccept = document.getElementById('newsletterAccept');

    // Botones sociales
    const googleRegisterBtn = document.getElementById('googleRegisterBtn');
    const facebookRegisterBtn = document.getElementById('facebookRegisterBtn');

    // Toggle password
    const toggleRegisterPassword = document.getElementById('toggleRegisterPassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');

    // Password strength
    const passwordStrength = document.getElementById('passwordStrength');

    // ==========================================
    // GESTIÓN DEL MODAL
    // ==========================================

    // Abrir modal de registro
    if (openRegisterModal) {
        openRegisterModal.addEventListener('click', function(e) {
            e.preventDefault();
            closeLoginModal();
            openRegisterModalFunc();
        });
    }

    // Cerrar modal de registro
    if (closeRegisterModal) {
        closeRegisterModal.addEventListener('click', function() {
            closeRegisterModalFunc();
        });
    }

    // Volver al login
    if (backToLogin) {
        backToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            closeRegisterModalFunc();
            openLoginModalFunc();
        });
    }

    // Cerrar modal al hacer clic fuera
    if (registerModal) {
        window.addEventListener('click', function(e) {
            if (e.target === registerModal) {
                closeRegisterModalFunc();
            }
        });
    }

    // Cerrar modal con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && registerModal && registerModal.style.display === 'flex') {
            closeRegisterModalFunc();
        }
    });

    // ==========================================
    // TOGGLE PASSWORD VISIBILITY
    // ==========================================

    if (toggleRegisterPassword) {
        toggleRegisterPassword.addEventListener('click', function() {
            togglePasswordVisibility(passwordInput, this);
        });
    }

    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', function() {
            togglePasswordVisibility(confirmPasswordInput, this);
        });
    }

    // ==========================================
    // PASSWORD STRENGTH INDICATOR
    // ==========================================

    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            updatePasswordStrength(this.value);
        });
    }

    // ==========================================
    // VALIDACIÓN EN TIEMPO REAL
    // ==========================================

    // Validar email
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            validateEmail(this.value);
        });
    }

    // Validar confirmación de contraseña
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            validatePasswordMatch();
        });
    }

    // Validar teléfono
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            // Solo permitir números
            this.value = this.value.replace(/[^0-9]/g, '');
            // Limitar a 10 dígitos
            if (this.value.length > 10) {
                this.value = this.value.slice(0, 10);
            }
        });
    }

    // ==========================================
    // REGISTRO CON REDES SOCIALES (Simulado)
    // ==========================================

    if (googleRegisterBtn) {
        googleRegisterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleSocialRegister('google');
        });
    }

    if (facebookRegisterBtn) {
        facebookRegisterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleSocialRegister('facebook');
        });
    }

    // ==========================================
    // ENVÍO DEL FORMULARIO
    // ==========================================

    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await handleRegister();
        });
    }

    // ==========================================
    // FUNCIONES
    // ==========================================

    /**
     * Abre el modal de registro
     */
    function openRegisterModalFunc() {
        if (registerModal) {
            registerModal.style.display = 'flex';
            hideMessages();
            
            // Focus en el primer campo
            if (firstNameInput) {
                setTimeout(() => firstNameInput.focus(), 100);
            }
        }
    }

    /**
     * Cierra el modal de registro
     */
    function closeRegisterModalFunc() {
        if (registerModal) {
            registerModal.style.display = 'none';
            if (registerForm) {
                registerForm.reset();
            }
            hideMessages();
            resetPasswordStrength();
        }
    }

    /**
     * Abre el modal de login
     */
    function openLoginModalFunc() {
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            loginModal.style.display = 'flex';
        }
    }

    /**
     * Cierra el modal de login
     */
    function closeLoginModal() {
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            loginModal.style.display = 'none';
        }
    }

    /**
     * Maneja el registro del usuario
     */
    async function handleRegister() {
        // Validar términos y condiciones
        if (!termsAccept.checked) {
            showError('Debes aceptar los Términos y Condiciones para continuar.');
            termsAccept.focus();
            return;
        }

        // Obtener datos del formulario
        const userData = {
            firstName: firstNameInput.value.trim(),
            lastName: lastNameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value,
            confirmPassword: confirmPasswordInput.value,
            phone: phoneInput.value.trim(),
            address: addressInput.value.trim(),
            newsletter: newsletterAccept.checked
        };

        // Validación adicional
        if (!validateFormData(userData)) {
            return;
        }

        // Mostrar loading
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Creando cuenta...';
        submitBtn.disabled = true;

        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 800));

        // Registrar usuario usando el servicio de autenticación
        const result = window.authService.register(userData);

        // Restaurar botón
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Manejar resultado
        if (result.success) {
            showSuccess(result.message);

            // Limpiar formulario
            registerForm.reset();
            resetPasswordStrength();

            // Cerrar modal y actualizar UI después de 2 segundos
            setTimeout(() => {
                closeRegisterModalFunc();
                
                // Actualizar UI
                if (window.updateAuthUI) {
                    window.updateAuthUI();
                }

                // Mostrar mensaje de bienvenida
                alert(`¡Bienvenido, ${result.user.firstName}! Tu cuenta ha sido creada exitosamente.`);
                
                // Recargar página para mostrar usuario logueado
                location.reload();
            }, 2000);

        } else {
            showError(result.message);
            
            // Shake effect
            registerForm.classList.add('shake');
            setTimeout(() => registerForm.classList.remove('shake'), 500);
        }
    }

    /**
     * Valida los datos del formulario
     * @param {Object} userData 
     * @returns {boolean}
     */
    function validateFormData(userData) {
        // Validar nombres
        if (!userData.firstName || userData.firstName.length < 2) {
            showError('El nombre debe tener al menos 2 caracteres.');
            firstNameInput.focus();
            return false;
        }

        if (!userData.lastName || userData.lastName.length < 2) {
            showError('El apellido debe tener al menos 2 caracteres.');
            lastNameInput.focus();
            return false;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            showError('Por favor, ingresa un email válido.');
            emailInput.focus();
            return false;
        }

        // Validar contraseña
        if (userData.password.length < 6) {
            showError('La contraseña debe tener al menos 6 caracteres.');
            passwordInput.focus();
            return false;
        }

        // Validar que las contraseñas coincidan
        if (userData.password !== userData.confirmPassword) {
            showError('Las contraseñas no coinciden.');
            confirmPasswordInput.focus();
            return false;
        }

        // Validar teléfono (si se proporciona)
        if (userData.phone && !/^\d{10}$/.test(userData.phone)) {
            showError('El teléfono debe tener exactamente 10 dígitos.');
            phoneInput.focus();
            return false;
        }

        return true;
    }

    /**
     * Valida el email
     * @param {string} email 
     */
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            emailInput.style.borderColor = '#dc3545';
        } else {
            emailInput.style.borderColor = '#ddd';
        }
    }

    /**
     * Valida que las contraseñas coincidan
     */
    function validatePasswordMatch() {
        if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.style.borderColor = '#dc3545';
        } else {
            confirmPasswordInput.style.borderColor = '#ddd';
        }
    }

    /**
     * Actualiza el indicador de fortaleza de la contraseña
     * @param {string} password 
     */
    function updatePasswordStrength(password) {
        if (!password) {
            resetPasswordStrength();
            return;
        }

        passwordStrength.classList.add('show');

        let strength = 0;
        
        // Longitud
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        
        // Mayúsculas y minúsculas
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        
        // Números
        if (/\d/.test(password)) strength++;
        
        // Caracteres especiales
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

        // Clasificar
        passwordStrength.classList.remove('weak', 'medium', 'strong');
        
        if (strength <= 2) {
            passwordStrength.classList.add('weak');
        } else if (strength <= 4) {
            passwordStrength.classList.add('medium');
        } else {
            passwordStrength.classList.add('strong');
        }
    }

    /**
     * Resetea el indicador de fortaleza
     */
    function resetPasswordStrength() {
        if (passwordStrength) {
            passwordStrength.classList.remove('show', 'weak', 'medium', 'strong');
        }
    }

    /**
     * Alterna la visibilidad de la contraseña
     * @param {HTMLElement} input 
     * @param {HTMLElement} button 
     */
    function togglePasswordVisibility(input, button) {
        if (input.type === 'password') {
            input.type = 'text';
            button.innerHTML = '<i class="fa fa-eye-slash"></i>';
            button.classList.add('active');
        } else {
            input.type = 'password';
            button.innerHTML = '<i class="fa fa-eye"></i>';
            button.classList.remove('active');
        }
    }

    /**
     * Maneja el registro con redes sociales (simulado)
     * @param {string} provider 
     */
    function handleSocialRegister(provider) {
        const providerNames = {
            google: 'Google',
            facebook: 'Facebook'
        };

        alert(`Registro con ${providerNames[provider]} estará disponible próximamente.\n\nPor ahora, usa el formulario de registro tradicional.`);
    }

    /**
     * Muestra un mensaje de error
     * @param {string} message 
     */
    function showError(message) {
        if (registerError) {
            registerError.textContent = message;
            registerError.style.display = 'block';
            registerSuccess.style.display = 'none';
            
            // Scroll al error
            registerError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    /**
     * Muestra un mensaje de éxito
     * @param {string} message 
     */
    function showSuccess(message) {
        if (registerSuccess) {
            registerSuccess.textContent = message;
            registerSuccess.style.display = 'block';
            registerError.style.display = 'none';
            
            // Scroll al mensaje
            registerSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    /**
     * Oculta todos los mensajes
     */
    function hideMessages() {
        if (registerError) {
            registerError.style.display = 'none';
            registerError.textContent = '';
        }
        if (registerSuccess) {
            registerSuccess.style.display = 'none';
            registerSuccess.textContent = '';
        }
    }

    // ==========================================
    // LOG DE INICIO
    // ==========================================

    console.log('📝 Modal de registro cargado correctamente');
});
