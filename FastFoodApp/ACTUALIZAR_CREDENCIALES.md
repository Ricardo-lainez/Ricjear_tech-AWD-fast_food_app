# 🔄 Actualizar Credenciales del Administrador

## Problema
Las credenciales antiguas del administrador están guardadas en el `localStorage` del navegador y necesitan ser actualizadas.

## Solución Rápida

### Opción 1: Limpiar LocalStorage (MÁS RÁPIDO)

1. Abre `index.html` en el navegador
2. Presiona `F12` para abrir las DevTools
3. Ve a la pestaña **Console**
4. Pega y ejecuta este comando:

```javascript
localStorage.clear();
location.reload();
```

Esto limpiará todo el localStorage y al recargar se cargarán las nuevas credenciales.

### Opción 2: Actualizar Solo el Administrador

1. Abre `index.html` en el navegador
2. Presiona `F12` para abrir las DevTools
3. Ve a la pestaña **Console**
4. Pega y ejecuta este código:

```javascript
// Obtener usuarios actuales
let users = JSON.parse(localStorage.getItem('bocatto_users'));

// Actualizar admin
const adminIndex = users.findIndex(u => u.role === 'administrator');
if (adminIndex !== -1) {
    users[adminIndex] = {
        id: 1,
        firstName: 'Raul',
        lastName: 'Administrador',
        email: 'admin@adminbocatto.com',
        password: 'adminPass123',
        phone: '0999999999',
        address: 'Quito, Ecuador',
        registrationDate: new Date('2024-01-01'),
        isActive: true,
        role: 'administrator',
        acceso: 'FULL_ACCESS',
        adminAcceso: 'SUPER_ADMIN'
    };
}

// Guardar cambios
localStorage.setItem('bocatto_users', JSON.stringify(users));

// Cerrar sesión si está activa
localStorage.removeItem('bocatto_session');
sessionStorage.removeItem('bocatto_session');

console.log('✅ Credenciales actualizadas correctamente');
console.log('📧 Nuevo email: admin@adminbocatto.com');
console.log('🔑 Nueva contraseña: adminPass123');

// Recargar página
location.reload();
```

## Nuevas Credenciales

Después de ejecutar cualquiera de las opciones, usa estas credenciales:

**Administrador (Raul):**
- Email: `admin@adminbocatto.com`
- Contraseña: `adminPass123`

**Cliente:**
- Email: `cliente@bocatto.com`
- Contraseña: `cliente123`

## Verificación

1. Recarga la página (`Ctrl + R` o `F5`)
2. Click en "Ingresar"
3. Usa las nuevas credenciales del admin
4. Deberías ser redirigido a `AdminProfile.html`
5. Deberías ver: "¡Bienvenido, Raul!"

## Nota Técnica

El código en `auth.js` ya fue actualizado para que automáticamente detecte y actualice las credenciales antiguas del administrador en futuras cargas. Sin embargo, para que funcione de inmediato, es necesario limpiar el localStorage una vez.
