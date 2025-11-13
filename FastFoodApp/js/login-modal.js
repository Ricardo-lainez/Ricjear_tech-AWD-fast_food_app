/**
 * ========================================
 * LOGIN MODAL - Gestión del Modal de Login
 * ========================================
 * Versión actualizada con API - MongoDB Atlas
 */

document.addEventListener('DOMContentLoaded', function() {
    const loginModal = document.getElementById('loginModal');
    const loginBtn = document.getElementById('loginBtn');
    const closeModal = document.getElementById('closeModal');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    // Abrir modal
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openLoginModal();
        });
    }

    // Cerrar modal con X
    if (closeModal) {
        closeModal.addEventListener('click', closeLoginModal);
    }

    // Cerrar modal al hacer clic fuera
    if (loginModal) {
        window.addEventListener('click', function(e) {
            if (e.target === loginModal) closeLoginModal();
        });
    }

    // Cerrar modal con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && loginModal && loginModal.style.display === 'flex') {
            closeLoginModal();
        }
    });

    // Formulario de login
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    function openLoginModal() {
        if (loginModal) {
            loginModal.style.display = 'flex';
            hideError();
            const emailInput = document.getElementById('loginEmail');
            if (emailInput) setTimeout(() => emailInput.focus(), 100);
        }
    }

    function closeLoginModal() {
        if (loginModal) {
            loginModal.style.display = 'none';
            if (loginForm) loginForm.reset();
            hideError();
        }
    }

    async function handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        if (!email || !password) {
            showError('Por favor, completa todos los campos');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('Por favor, ingresa un email válido');
            return;
        }

        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Iniciando sesión...';
        submitBtn.disabled = true;

        try {
            const result = await window.authService.login(email, password, rememberMe);

            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            if (result.success) {
                hideError();
                showSuccess(`¡Bienvenido, ${result.user.firstName}!`);

                setTimeout(() => {
                    closeLoginModal();
                    if (window.updateAuthUI) window.updateAuthUI();

                    // NO redirigir automáticamente, solo recargar la página actual
                    // para actualizar el menú de usuario
                    location.reload();
                }, 800);
            } else {
                showError(result.message);
                shake();
            }
        } catch (error) {
            console.error('Error en login:', error);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            showError('Error al conectar con el servidor. Verifica que esté corriendo.');
            shake();
        }
    }

    function showError(message) {
        if (loginError) {
            loginError.textContent = message;
            loginError.style.display = 'block';
            loginError.style.backgroundColor = '#f8d7da';
            loginError.style.color = '#721c24';
            loginError.style.borderLeft = '4px solid #dc3545';
        }
    }

    function hideError() {
        if (loginError) {
            loginError.style.display = 'none';
            loginError.textContent = '';
        }
    }

    function showSuccess(message) {
        if (loginError) {
            loginError.textContent = message;
            loginError.style.display = 'block';
            loginError.style.backgroundColor = '#d4edda';
            loginError.style.color = '#155724';
            loginError.style.borderLeft = '4px solid #28a745';
        }
    }

    function shake() {
        if (loginForm) {
            loginForm.classList.add('shake');
            setTimeout(() => loginForm.classList.remove('shake'), 500);
        }
    }

    // Limpiar localStorage viejo
    ['bocatto_users'].forEach(key => localStorage.removeItem(key));

    // Actualizar UI
    if (window.updateAuthUI) window.updateAuthUI();
});

// Estilos shake
if (!document.getElementById('shake-styles')) {
    const style = document.createElement('style');
    style.id = 'shake-styles';
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        .shake { animation: shake 0.5s; }
    `;
    document.head.appendChild(style);
}
