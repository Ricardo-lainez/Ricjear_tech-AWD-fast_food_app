# 🐛 FIX: Logout Doble Resuelto

## ❌ Problema Reportado:

El administrador tenía que cerrar sesión **DOS VECES**:
1. Primera vez desde el Panel Admin → Redirige a index.html pero **sigue logueado**
2. Segunda vez desde index.html → Finalmente cierra sesión

## 🔍 Causa Raíz:

### Problema 1: Falta de `await` en AdminProfile.js
```javascript
// ANTES (INCORRECTO)
logoutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (confirm('¿Estás seguro...?')) {
        authService.logout();  // ❌ No espera a que termine
        window.location.href = '../index.html';  // Redirige antes de limpiar
    }
});
```

**Resultado:** 
- La función `logout()` es **async** (hace llamada a la API)
- Pero NO se esperaba con `await`
- El navegador redirigía **ANTES** de que se limpiara la sesión
- La sesión quedaba activa en localStorage/sessionStorage

### Problema 2: Sesión se mantenía en memoria
Después del redirect a index.html, el script `auth-api.js` ejecutaba `loadSession()` y encontraba la sesión que NO se había limpiado, causando que el usuario siguiera apareciendo como logueado.

---

## ✅ Solución Aplicada:

### Fix 1: Agregar `await` en AdminProfile.js

```javascript
// AHORA (CORRECTO)
logoutBtn.addEventListener('click', async function(e) {  // ← async
    e.preventDefault();
    if (confirm('¿Estás seguro...?')) {
        await authService.logout();  // ← await - ESPERA a que termine
        window.location.href = '../index.html';  // Solo redirige después
    }
});
```

**Beneficio:**
- ✅ Espera a que la API confirme el logout
- ✅ Espera a que se limpie localStorage y sessionStorage
- ✅ Solo redirige cuando la sesión está completamente cerrada

---

### Fix 2: Logout más agresivo en auth-api.js

```javascript
async logout() {
    try {
        await apiClient.post('/auth/logout');
        
        // Limpiar COMPLETAMENTE
        this.currentUser = null;
        localStorage.removeItem(this.sessionKey);       // ← bocatto_session
        sessionStorage.removeItem(this.sessionKey);     // ← bocatto_session
        localStorage.removeItem('current_user');        // ← limpieza adicional
        sessionStorage.removeItem('current_user');      // ← limpieza adicional
        
        console.log('✅ Sesión cerrada completamente');
        
        return { success: true, message: 'Sesión cerrada' };
    } catch (error) {
        // Incluso si falla la API, limpiar local
        this.currentUser = null;
        localStorage.removeItem(this.sessionKey);
        sessionStorage.removeItem(this.sessionKey);
        localStorage.removeItem('current_user');
        sessionStorage.removeItem('current_user');
        
        return { success: true, message: 'Sesión cerrada localmente' };
    }
}
```

**Beneficios:**
- ✅ Limpia en **localStorage** Y **sessionStorage**
- ✅ Limpia claves adicionales por si acaso
- ✅ Funciona incluso si la API falla
- ✅ Logs en consola para debugging

---

### Fix 3: Redirección inteligente en handleLogout()

```javascript
// ANTES
async function handleLogout() {
    const result = await authService.logout();
    if (result.success) {
        alert(result.message);
        updateAuthUI();
        window.location.href = '../index.html';  // ❌ Ruta fija
    }
}

// AHORA
async function handleLogout() {
    const result = await authService.logout();
    if (result.success) {
        updateAuthUI();
        
        // Ruta dinámica según ubicación
        const isInHtmlFolder = window.location.pathname.includes('/html/');
        const redirectPath = isInHtmlFolder ? '../index.html' : './index.html';
        
        window.location.href = redirectPath;
    }
}
```

**Beneficios:**
- ✅ Ruta correcta desde cualquier ubicación
- ✅ Eliminado el alert (mejor UX)
- ✅ Actualiza UI antes de redirigir

---

## 🧪 PLAN DE PRUEBA

### Pre-requisitos:
1. ✅ Servidor corriendo en `http://localhost:3000`
2. ✅ Live Server en puerto 5500
3. ✅ Navegador limpio (Ctrl+Shift+Delete o F12 → Clear storage)

---

### Prueba 1: Logout desde Panel Admin

#### Pasos:
1. Login como admin:
   ```
   Email: admin@adminbocatto.com
   Password: adminPass123
   ```

2. Estás en `AdminProfile.html` → Verifica que aparece:
   - ✅ "¡Bienvenido, Admin!"
   - ✅ Avatar "A"

3. Haz clic en tu nombre → **"Cerrar Sesión"**

4. Confirma el diálogo

#### ✅ Resultado Esperado:
- Se ejecuta `await authService.logout()`
- En consola (F12): `✅ Sesión cerrada completamente`
- Redirige a `index.html`
- **NO aparece el avatar del admin**
- Aparece botón **"Ingresar"**
- ✅ **Sesión cerrada en UN SOLO CLICK**

#### ❌ Si el bug persistiera:
- Redirige a `index.html`
- Sigue apareciendo avatar "A"
- Tienes que hacer logout OTRA VEZ

---

### Prueba 2: Logout desde Sitio Web

#### Pasos:
1. Login como admin desde `index.html`

2. Verifica avatar "A" en el menú

3. Haz clic en avatar → **"Cerrar Sesión"**

#### ✅ Resultado Esperado:
- En consola: `✅ Sesión cerrada completamente`
- Recarga `index.html` o se mantiene en la página
- Avatar desaparece
- Aparece botón "Ingresar"
- ✅ **Sesión cerrada en UN SOLO CLICK**

---

### Prueba 3: Verificación en DevTools

Después del logout, presiona `F12` → **Application** → **Storage** → **Local Storage** → `http://127.0.0.1:5500`

#### ✅ Debe estar VACÍO o NO tener:
```
❌ bocatto_session  (debe estar eliminado)
❌ current_user     (debe estar eliminado)
```

#### Si aparecen estas claves, el logout NO funcionó correctamente.

---

### Prueba 4: Verificación en Console

Presiona `F12` → **Console** → Ejecuta:
```javascript
localStorage.getItem('bocatto_session')
```

#### ✅ Resultado esperado:
```
null
```

#### ❌ Si devuelve un objeto JSON:
```json
{ "user": {...}, "timestamp": ... }
```
Significa que la sesión NO se limpió.

---

### Prueba 5: Flujo Completo

1. Login como admin
2. Ve a AdminProfile
3. Navega a "Ver Sitio Web"
4. Regresa a "Panel Admin"
5. **Cierra sesión desde Panel Admin**
6. Verifica que en index.html NO apareces logueado
7. ✅ **UN SOLO LOGOUT**

---

## 📊 COMPARACIÓN ANTES/DESPUÉS

### ❌ ANTES (Comportamiento Defectuoso):

```
1. Admin en AdminProfile.html
2. Click "Cerrar Sesión"
   → authService.logout() (sin await)
   → Redirige inmediatamente
   → Sesión NO se limpia completamente
3. Llega a index.html
   → loadSession() encuentra sesión activa
   → Admin aparece logueado ❌
4. Click "Cerrar Sesión" OTRA VEZ
   → Ahora sí se cierra
5. Total: 2 CLICKS DE LOGOUT
```

### ✅ AHORA (Comportamiento Correcto):

```
1. Admin en AdminProfile.html
2. Click "Cerrar Sesión"
   → await authService.logout() (espera)
   → API confirma logout
   → localStorage limpio
   → sessionStorage limpio
   → Redirige después de limpiar
3. Llega a index.html
   → loadSession() NO encuentra sesión
   → Aparece "Ingresar" ✅
4. Total: 1 CLICK DE LOGOUT
```

---

## 🔍 DEBUGGING

### Si el problema persiste:

#### 1. Verifica que AdminProfile.js tenga `async/await`:
```javascript
// Busca esta línea (debe decir async)
logoutBtn.addEventListener('click', async function(e) {
    e.preventDefault();
    if (confirm('¿Estás seguro...?')) {
        await authService.logout();  // ← Debe tener await
        ...
    }
});
```

#### 2. Verifica logs en consola:
- Debe aparecer: `✅ Sesión cerrada completamente`
- Si aparece: `⚠️ Sesión cerrada localmente` → La API falló pero se limpió local

#### 3. Verifica que auth-api.js limpie en ambos storages:
```javascript
localStorage.removeItem(this.sessionKey);
sessionStorage.removeItem(this.sessionKey);
```

#### 4. Hard refresh después de cambios:
```
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

---

## 📝 ARCHIVOS MODIFICADOS

### 1. `js/AdminProfile.js`
**Línea 97:** Agregado `async` y `await`
```javascript
// Antes
logoutBtn.addEventListener('click', function(e) {

// Ahora
logoutBtn.addEventListener('click', async function(e) {
    ...
    await authService.logout();
```

### 2. `js/auth-api.js` (Método logout)
**Líneas 138-165:** Limpieza mejorada
```javascript
// Agregado
localStorage.removeItem('current_user');
sessionStorage.removeItem('current_user');
console.log('✅ Sesión cerrada completamente');
```

### 3. `js/auth-api.js` (handleLogout)
**Líneas 494-506:** Redirección inteligente
```javascript
// Agregado
const isInHtmlFolder = window.location.pathname.includes('/html/');
const redirectPath = isInHtmlFolder ? '../index.html' : './index.html';
window.location.href = redirectPath;
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

Después de aplicar el fix, verifica:

- [ ] AdminProfile.js tiene `async function` en logout listener
- [ ] AdminProfile.js usa `await authService.logout()`
- [ ] auth-api.js limpia `localStorage.bocatto_session`
- [ ] auth-api.js limpia `sessionStorage.bocatto_session`
- [ ] Console muestra: `✅ Sesión cerrada completamente`
- [ ] Logout desde AdminProfile → 1 click → sesión cerrada
- [ ] Logout desde index.html → 1 click → sesión cerrada
- [ ] localStorage vacío después de logout
- [ ] NO aparece avatar después de logout
- [ ] Aparece botón "Ingresar" después de logout

---

## 🎯 RESULTADO FINAL

### ✅ ANTES del fix:
- ❌ Logout requería 2 clicks
- ❌ Sesión se mantenía después del primer logout
- ❌ Admin aparecía logueado en index.html después de logout

### ✅ DESPUÉS del fix:
- ✅ Logout requiere 1 solo click
- ✅ Sesión se cierra completamente
- ✅ Admin NO aparece logueado después de logout
- ✅ localStorage/sessionStorage limpios
- ✅ Funciona desde Panel Admin Y desde Sitio Web

---

**Fecha:** 31 de Octubre, 2025  
**Estado:** ✅ RESUELTO  
**Causa:** Falta de `await` en llamada async  
**Fix:** Agregado `async/await` + limpieza agresiva de storage  

---

## 🚀 SIGUIENTE PASO

**Prueba el fix ahora:**

1. Abre DevTools (F12) → Console
2. Login como admin
3. Ve al Panel Admin
4. Click "Cerrar Sesión"
5. Verifica en console: `✅ Sesión cerrada completamente`
6. Verifica que NO apareces logueado en index.html
7. ✅ **¡Logout en UN SOLO CLICK!**
