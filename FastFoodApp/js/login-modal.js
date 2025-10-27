/**
 * ========================================
 * LOGIN MODAL - Gestión del Modal de Login
 * ========================================
 * Maneja la apertura/cierre del modal y el formulario de login
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const loginModal = document.getElementById('loginModal');
    const loginBtn = document.getElementById('loginBtn');
    const closeModal = document.getElementById('closeModal');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    // ==========================================
    // GESTIÓN DEL MODAL
    // ==========================================

    // Abrir modal
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openLoginModal();
        });
    }

    // Cerrar modal con X
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            closeLoginModal();
        });
    }

    // Cerrar modal al hacer clic fuera
    if (loginModal) {
        window.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                closeLoginModal();
            }
        });
    }

    // Cerrar modal con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && loginModal && loginModal.style.display === 'flex') {
            closeLoginModal();
        }
    });

    // ==========================================
    // FORMULARIO DE LOGIN
    // ==========================================

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await handleLogin();
        });
    }

    // ==========================================
    // FUNCIONES
    // ==========================================

    /**
     * Abre el modal de login
     */
    function openLoginModal() {
        if (loginModal) {
            loginModal.style.display = 'flex';
            hideError();
            
            // Focus en el primer campo
            const emailInput = document.getElementById('loginEmail');
            if (emailInput) {
                setTimeout(() => emailInput.focus(), 100);
            }
        }
    }

    /**
     * Cierra el modal de login
     */
    function closeLoginModal() {
        if (loginModal) {
            loginModal.style.display = 'none';
            if (loginForm) {
                loginForm.reset();
            }
            hideError();
        }
    }

    /**
     * Maneja el proceso de login
     */
    async function handleLogin() {
        // Obtener valores del formulario
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Validación básica
        if (!email || !password) {
            showError('Por favor, completa todos los campos');
            return;
        }

        if (!isValidEmail(email)) {
            showError('Por favor, ingresa un email válido');
            return;
        }

        // Mostrar loading (opcional)
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Iniciando sesión...';
        submitBtn.disabled = true;

        // Simular delay de red (para hacer más realista)
        await new Promise(resolve => setTimeout(resolve, 500));

        // Intentar login usando el servicio de autenticación
        const result = window.authService.login(email, password, rememberMe);

        // Restaurar botón
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Manejar resultado
        if (result.success) {
            // Login exitoso
            hideError();
            
            // Mostrar mensaje de bienvenida
            const user = result.user;
            showSuccess(`¡Bienvenido, ${user.firstName}!`);

            // Cerrar modal después de 1 segundo
            setTimeout(() => {
                closeLoginModal();
                
                // Actualizar UI
                if (window.updateAuthUI) {
                    window.updateAuthUI();
                }

                // Redirigir según el rol
                if (user.role === 'administrator') {
                    // Redirigir al dashboard de admin
                    window.location.href = result.redirectTo;
                } else {
                    // Para cliente, solo recargar la página para actualizar UI
                    // En el futuro aquí podrían desbloquearse funcionalidades
                    location.reload();
                }
            }, 1000);

        } else {
            // Login fallido
            showError(result.message);
            
            // Shake effect en el formulario
            loginForm.classList.add('shake');
            setTimeout(() => loginForm.classList.remove('shake'), 500);
        }
    }

    /**
     * Muestra un mensaje de error
     * @param {string} message 
     */
    function showError(message) {
        if (loginError) {
            loginError.textContent = message;
            loginError.style.display = 'block';
        }
    }

    /**
     * Oculta el mensaje de error
     */
    function hideError() {
        if (loginError) {
            loginError.style.display = 'none';
            loginError.textContent = '';
        }
    }

    /**
     * Muestra un mensaje de éxito
     * @param {string} message 
     */
    function showSuccess(message) {
        if (loginError) {
            loginError.textContent = message;
            loginError.style.display = 'block';
            loginError.style.backgroundColor = '#d4edda';
            loginError.style.color = '#155724';
            loginError.style.borderLeft = '4px solid #28a745';
        }
    }

    /**
     * Valida formato de email
     * @param {string} email 
     * @returns {boolean}
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ==========================================
    // INICIALIZACIÓN
    // ==========================================

    // Actualizar UI según estado de autenticación
    if (window.updateAuthUI) {
        window.updateAuthUI();
    }
});

// Añadir estilos para el efecto shake
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
    .shake {
        animation: shake 0.5s;
    }
`;
document.head.appendChild(style);

