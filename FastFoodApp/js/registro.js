// Espera a que el contenido del DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {

    const registerForm = document.getElementById('registerForm');
    const messageDiv = document.getElementById('message');

    // Escucha el evento 'submit' del formulario
    registerForm.addEventListener('submit', async (e) => {
        // Previene que el formulario se envíe de la forma tradicional
        e.preventDefault();

        // Limpia mensajes anteriores
        messageDiv.textContent = '';
        messageDiv.className = 'message';

        // 1. Obtener los valores del formulario
        const name = document.getElementById('name').value;
        const surname = document.getElementById('surname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;

        // 2. Validación simple del frontend
        if (!name || !surname || !email || !password) {
            showMessage('Por favor, completa todos los campos obligatorios.', 'error');
            return;
        }

        if (password.length < 6) {
            showMessage('La contraseña debe tener al menos 6 caracteres.', 'error');
            return;
        }

        // 3. Crear el objeto con los datos del usuario
        const userData = {
            name,
            surname,
            email,
            password,
            phone,
            address
        };

        // 4. Enviar los datos al backend (la "cocina")
        try {
            // Construimos la URL del API. Si se abre el HTML vía file:// usamos localhost.
            const apiUrl = (window.location.protocol === 'file:')
                ? 'http://localhost:3000/api/register'
                : `${window.location.protocol}//${window.location.hostname}:3000/api/register`;

            // Mostrar la URL y body para depuración (no mostramos la contraseña)
            console.log('Registro: construyendo petición...');
            const safeUserData = Object.assign({}, userData);
            if (safeUserData.password) safeUserData.password = '[REDACTED]';
            console.log('API URL ->', apiUrl);
            console.log('Body ->', safeUserData);

            // Hacemos la petición POST a la ruta de nuestro backend
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            // Si la respuesta no es OK (status fuera de 200-299), intentamos leer el mensaje de error
            if (!response.ok) {
                let errorMsg = `Error ${response.status}`;
                try {
                    const errData = await response.json();
                    errorMsg = errData.message || errorMsg;
                } catch (e) {
                    // Si no es JSON, leemos texto plano
                    try { errorMsg = await response.text(); } catch (e) { /* ignore */ }
                }
                console.error('Respuesta de error del servidor:', response.status, errorMsg);
                showMessage(errorMsg, 'error');
                return;
            }

            // Intentamos parsear JSON de la respuesta (si falla, asumimos éxito pero notificamos)
            let data;
            try {
                data = await response.json();
            } catch (e) {
                data = { message: 'Registro completado (respuesta no-JSON del servidor).' };
            }

            showMessage(data.message || '¡Usuario registrado con éxito!', 'success');
            registerForm.reset(); // Limpia el formulario

        } catch (error) {
            // Errores de red o de fetch
            console.error('Error de conexión al intentar registrar:', error);
            // Mostrar mensaje más informativo en desarrollo (mantener en español)
            const userMsg = error && error.message ? `No se pudo conectar con el servidor. ${error.message}` : 'No se pudo conectar con el servidor. Inténtalo más tarde.';
            showMessage(userMsg, 'error');
        }
    });

    // Función para mostrar mensajes en el div 'message'
    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`; // 'message success' o 'message error'
    }
});