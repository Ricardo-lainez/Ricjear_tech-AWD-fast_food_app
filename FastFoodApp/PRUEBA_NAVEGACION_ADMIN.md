# 🧪 PRUEBA DE NAVEGACIÓN ADMIN

## 🐛 Bug Resuelto: Admin Pierde Sesión al Ver Sitio Web

### ❌ Problema Original:
Cuando el administrador hacía clic en **"Ver Sitio Web"** desde el panel de administración, se cerraba automáticamente la sesión.

### ✅ Causa Raíz Identificada:
El script `cleanup.js` estaba eliminando la clave `'bocatto_session'` cada vez que se cargaba `index.html`, pero esa es la clave que usa el sistema **ACTUAL** para mantener las sesiones activas de MongoDB Atlas.

**Flujo del Bug:**
1. Admin hace login → Se guarda sesión en `localStorage.bocatto_session`
2. Admin hace clic en "Ver Sitio Web" → Se carga `index.html`
3. `cleanup.js` se ejecuta → Elimina `bocatto_session` (¡sesión activa!)
4. Sistema no encuentra sesión → Muestra como "no autenticado"
5. Admin aparece deslogueado ❌

### 🔧 Solución Aplicada:

#### 1. Eliminada `'bocatto_session'` de la lista de limpieza
```javascript
// ANTES (INCORRECTO)
const keysToRemove = [
    'bocatto_session',  // ❌ Borraba la sesión activa
    ...
];

// AHORA (CORRECTO)
const keysToRemove = [
    'bocatto_session_old',  // ✅ Solo viejas
    'user_session',
    // NO incluye 'bocatto_session' ✅
    ...
];
```

#### 2. Limpieza inteligente (solo una vez)
```javascript
// Verifica si ya se limpió antes
if (localStorage.getItem('bocatto_cleanup_done') === 'v1.0.0') {
    return; // No vuelve a limpiar
}

// Limpia...

// Marca como completado
localStorage.setItem('bocatto_cleanup_done', 'v1.0.0');
```

---

## 🧪 PLAN DE PRUEBA

### Pre-requisitos:
1. ✅ Servidor backend corriendo en `http://localhost:3000`
2. ✅ MongoDB Atlas conectado
3. ✅ Live Server en puerto 5500

### Paso 1: Limpiar Navegador (SOLO PRIMERA VEZ)
Presiona `F12` para abrir DevTools → Consola → Ejecuta:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload(true);
```

---

### Paso 2: Login como Administrador

1. Abre `index.html` en el navegador (http://127.0.0.1:5500)
2. Haz clic en **"Ingresar"**
3. Ingresa credenciales de admin:
   ```
   Email: admin@adminbocatto.com
   Password: adminPass123
   ```
4. Haz clic en **"Iniciar Sesión"**

**✅ Resultado Esperado:**
- Login exitoso
- Redirección automática a `AdminProfile.html`
- Mensaje: "¡Bienvenido, Admin!"
- Menú de usuario muestra "Admin Bocatto" con avatar "A"

---

### Paso 3: Verificar Panel de Administración

En `AdminProfile.html`:

1. Verifica que aparezca:
   - ✅ "¡Bienvenido, Admin!"
   - ✅ Avatar con inicial "A"
   - ✅ Nombre "Admin Bocatto" en el header

2. Haz clic en el **nombre del admin** (dropdown)

**✅ Resultado Esperado:**
```
Mi Perfil
Configuración
Ver Sitio Web    ← Este es el que vamos a probar
Cerrar Sesión
```

---

### Paso 4: Hacer Clic en "Ver Sitio Web" (PRUEBA CRÍTICA)

1. Haz clic en **"Ver Sitio Web"**

**✅ Resultado Esperado:**
- Se redirige a `index.html`
- **LA SESIÓN SE MANTIENE** ✅
- En el menú superior derecha aparece el avatar "A" con "Admin"
- NO aparece el botón "Ingresar"

**❌ Si el bug NO estuviera resuelto (comportamiento anterior):**
- Se redirige a `index.html`
- La sesión se cierra
- Aparece botón "Ingresar" en lugar del usuario
- El admin debe volver a loguearse

---

### Paso 5: Verificar en DevTools (Opcional)

Presiona `F12` → Pestaña **Console**

Busca estos mensajes:
```
✅ Sistema ya está limpio (v1.0.0)
```

**NO** debe aparecer:
```
🗑️ Eliminado de localStorage: bocatto_session
```

Si aparece ese mensaje, significa que está borrando la sesión activa (bug no resuelto).

---

### Paso 6: Verificar localStorage

Presiona `F12` → Pestaña **Application** → Storage → **Local Storage** → `http://127.0.0.1:5500`

**✅ Debe contener:**
```
bocatto_session          → { "user": {...}, "timestamp": ... }
bocatto_cleanup_done     → v1.0.0
```

**❌ NO debe contener (datos viejos eliminados):**
```
bocatto_users
bocatto_session_old
user_session
simulated_users
```

---

### Paso 7: Navegar de Vuelta al Panel Admin

Desde `index.html`:

1. Haz clic en el **avatar "A"** o nombre "Admin"
2. Haz clic en **"Panel Admin"**

**✅ Resultado Esperado:**
- Redirige a `AdminProfile.html`
- Sesión sigue activa
- Mensaje: "¡Bienvenido, Admin!"

---

### Paso 8: Cerrar Sesión (Verificación Final)

1. En `AdminProfile.html` o `index.html`
2. Haz clic en el nombre/avatar
3. Haz clic en **"Cerrar Sesión"**

**✅ Resultado Esperado:**
- Sesión cerrada correctamente
- Redirige a `index.html`
- Aparece botón **"Ingresar"**
- Avatar desaparece del menú

---

## 📊 CHECKLIST DE VERIFICACIÓN

### ✅ Funcionalidades que DEBEN funcionar:

- [ ] Login como admin exitoso
- [ ] Redirección a AdminProfile.html
- [ ] Nombre dinámico "Admin" (no "Raul")
- [ ] Clic en "Ver Sitio Web" → **Sesión se mantiene** ✅
- [ ] En index.html aparece avatar "A" y nombre "Admin"
- [ ] Clic en "Panel Admin" → Regresa sin problemas
- [ ] Navegación fluida Admin Panel ↔ Sitio Web
- [ ] Logout funciona correctamente
- [ ] cleanup.js se ejecuta solo 1 vez
- [ ] No se borran sesiones activas

### ❌ Comportamientos que NO deben ocurrir:

- [ ] ❌ Sesión se cierra al ir a index.html
- [ ] ❌ Aparece "Ingresar" cuando admin está logueado
- [ ] ❌ Aparece "Raul" o "María" en cualquier parte
- [ ] ❌ cleanup.js se ejecuta en cada carga de página
- [ ] ❌ Se borra 'bocatto_session' del localStorage

---

## 🎯 RESULTADO FINAL ESPERADO

### Escenario: Admin navega libremente

```
1. Admin hace login
   ✅ Sesión guardada en localStorage.bocatto_session

2. Admin en AdminProfile.html
   ✅ Panel carga correctamente
   ✅ "¡Bienvenido, Admin!"

3. Admin → "Ver Sitio Web"
   ✅ Redirige a index.html
   ✅ SESIÓN SE MANTIENE ← FIX APLICADO
   ✅ Avatar "A" visible

4. Admin → "Panel Admin"
   ✅ Regresa a AdminProfile.html
   ✅ Sesión intacta

5. Admin → "Cerrar Sesión"
   ✅ Sesión eliminada correctamente
   ✅ Redirige a index.html
   ✅ Botón "Ingresar" visible
```

---

## 🔍 DIAGNÓSTICO SI FALLA

### Si la sesión se sigue cerrando:

1. **Verifica que cleanup.js esté actualizado:**
   ```javascript
   // NO debe incluir 'bocatto_session'
   const keysToRemove = [
       'bocatto_session_old',  // ✅
       // 'bocatto_session',   // ❌ NO debe estar aquí
   ];
   ```

2. **Verifica en la consola:**
   ```
   ✅ Sistema ya está limpio (v1.0.0)  ← Correcto
   🗑️ Eliminado: bocatto_session       ← ERROR!
   ```

3. **Hard refresh:**
   - `Ctrl + Shift + R` (forzar recarga)
   - Vaciar caché del navegador

4. **Verificar que index.html cargue cleanup.js primero:**
   ```html
   <script src="js/cleanup.js"></script>      ← Primero
   <script src="js/api-client.js"></script>
   <script src="js/auth-api.js"></script>
   ```

---

## 📝 NOTAS TÉCNICAS

### Clave de Sesión Actual:
```javascript
// En auth-api.js (línea 51)
this.sessionKey = 'bocatto_session';  // ← Esta es la clave ACTIVA
```

### Contenido de bocatto_session:
```json
{
  "user": {
    "id": "6904d9703a86fdfdd14a5c90",
    "firstName": "Admin",
    "lastName": "Bocatto",
    "email": "admin@adminbocatto.com",
    "role": "administrator"
  },
  "timestamp": 1730339845123
}
```

### Duración de Sesión:
- **7 días** (definido en auth-api.js línea 297)
- Verificación automática con API en cada carga

---

## ✅ ESTADO DEL FIX

**Fecha:** 31 de Octubre, 2025  
**Estado:** ✅ RESUELTO  
**Versión:** v1.0.0  

**Archivos Modificados:**
1. ✅ `js/cleanup.js` - Eliminado 'bocatto_session' de lista de limpieza
2. ✅ `js/cleanup.js` - Implementada limpieza inteligente (solo 1 vez)

**Causa Raíz:** cleanup.js borraba sesión activa en cada carga  
**Solución:** Preservar 'bocatto_session' + ejecutar limpieza solo una vez  
**Resultado:** Admin puede navegar libremente sin perder sesión ✅

---

**¡Bug crítico resuelto! El administrador ahora puede navegar entre el Panel Admin y el Sitio Web sin perder la sesión.** 🎉
