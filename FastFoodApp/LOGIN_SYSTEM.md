# 🔐 Sistema de Autenticación - Bocatto Valley

## 📋 Descripción General

Sistema de autenticación simulado que diferencia entre **Clientes** y **Administradores**, preparado para futura integración con backend y base de datos MongoDB.

## 🎯 Características Implementadas

### ✅ Funcionalidades Actuales

1. **Login con Email y Contraseña**
   - Validación de credenciales
   - Checkbox "Recordarme"
   - Mensajes de error personalizados
   - Animación shake en caso de error

2. **Gestión de Sesión**
   - localStorage (Recordar sesión)
   - sessionStorage (Sesión temporal)
   - Expiración automática (24 horas)
   - Verificación de sesión activa

3. **Roles de Usuario**
   - **Cliente**: Acceso al sitio web normal
   - **Administrador**: Acceso al Panel de Administración (AdminProfile)

4. **Panel de Administración**
   - Diseño profesional con sidebar y header
   - Mensaje de bienvenida personalizado
   - Información de fecha y hora en tiempo real
   - Protección de acceso (solo administradores)
   - Accesos rápidos a funcionalidades futuras

5. **Menú de Usuario**
   - Dropdown con opciones personalizadas
   - Avatar con inicial del nombre
   - Botón de cerrar sesión
   - Enlaces según el rol

## 👥 Usuarios de Prueba

### Administrador
```
Email: admin@adminbocatto.com
Contraseña: adminPass123
```

### Cliente
```
Email: cliente@bocatto.com
Contraseña: cliente123
```

### Cliente Adicional
```
Email: juan.perez@example.com
Contraseña: 123456
```

## 📂 Estructura de Archivos

```
FastFoodApp/
├── index.html                          # Página principal (actualizada con login)
├── html/
│   └── AdminProfile.html              # Panel de Administración
├── js/
│   ├── auth.js                        # 🆕 Sistema de autenticación
│   ├── login-modal.js                 # 🔄 Gestión del modal de login
│   └── AdminProfile.js                # 🆕 Funcionalidad del panel admin
└── styles/
    ├── login-modal.css                # 🔄 Estilos del modal y menú usuario
    └── AdminProfile.css               # 🆕 Estilos del panel admin
```

## 🔧 Implementación Basada en UML

### Clases Implementadas

#### 1. **User** (Clase Base)
```javascript
{
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    password: string,          // En producción: hasheada
    phone: string,
    address: string,
    registrationDate: Date,
    isActive: boolean,
    role: 'client' | 'administrator'
}
```

**Métodos Implementados:**
- ✅ `login()` - Autenticación de usuario
- ✅ `validateCredentials()` - Validación de credenciales
- ✅ `changePassword()` - Cambio de contraseña
- ⚠️ `updateProfile()` - Actualización de perfil (simulado)

#### 2. **Client** (Hereda de User)
```javascript
{
    ...User,
    loyaltyPoints: number,     // Puntos de fidelidad
    preferences: string        // Preferencias del cliente
}
```

**Métodos del UML (Preparados para implementación):**
- `placeOrder()` - Realizar pedido
- `viewOrderHistory()` - Ver historial de pedidos
- `viewReservationHistory()` - Ver historial de reservaciones
- `updateProfile()` - Actualizar perfil

#### 3. **Administrator** (Hereda de User)
```javascript
{
    ...User,
    acceso: string,           // Nivel de acceso
    adminAcceso: string       // Permisos de administrador
}
```

**Métodos del UML (Preparados para implementación):**
- `generateSalesReport()` - Generar reporte de ventas
- `generateOrderReport()` - Generar reporte de pedidos
- `generateReservationReport()` - Generar reporte de reservaciones
- `generateEmployeeReport()` - Generar reporte de empleados
- `configureSystem()` - Configurar sistema
- `exportPDF()` - Exportar a PDF
- `exportExcel()` - Exportar a Excel

## 🔄 Flujo de Autenticación

### 1. Login
```
Usuario ingresa credenciales
    ↓
AuthService.login(email, password, rememberMe)
    ↓
Validación de credenciales
    ↓
¿Credenciales válidas?
    ↓ SÍ                          ↓ NO
Guardar sesión                  Mostrar error
    ↓
¿Es administrador?
    ↓ SÍ                          ↓ NO (Cliente)
Redirigir a AdminProfile      Recargar página (index.html)
```

### 2. Verificación de Sesión
```
Al cargar página
    ↓
AuthService.loadSession()
    ↓
¿Existe sesión guardada?
    ↓ SÍ                          ↓ NO
¿Sesión válida (<24hrs)?        Usuario no autenticado
    ↓ SÍ                          
Cargar usuario
    ↓
Actualizar UI
```

### 3. Protección de Páginas
```
AdminProfile.html
    ↓
protectPage('administrator')
    ↓
¿Usuario autenticado?
    ↓ NO → Redirigir a index.html
    ↓ SÍ
¿Es administrador?
    ↓ NO → Redirigir a index.html
    ↓ SÍ
Permitir acceso
```

## 🎨 Interfaz de Usuario

### Modal de Login
- Formulario con email y contraseña
- Checkbox "Recordarme"
- Link "¿Olvidaste tu contraseña?"
- Credenciales de prueba visibles
- Link de registro
- Animaciones suaves

### Menú de Usuario (Logueado)
- Avatar con inicial del nombre
- Nombre del usuario
- Dropdown con opciones:
  - Mi Perfil, Favoritos, Mis Pedidos, Mis Reservas, Configuración
  - Cerrar Sesión

### Panel de Administración (AdminProfile.html)
- Header con logo y menú de usuario
- Sidebar con navegación a diferentes secciones
- Mensaje de bienvenida personalizado con el nombre del administrador (Raul)
- Información en tiempo real: fecha, hora y nivel de acceso
- Accesos rápidos a funcionalidades (en desarrollo)
- Diseño responsive y profesional
- Protección de acceso (solo administradores autenticados)

## 🔮 Preparación para Backend

### Cambios Necesarios al Integrar BD

1. **auth.js**
   ```javascript
   // ACTUAL (Simulado)
   const user = SIMULATED_USERS.find(...)
   
   // FUTURO (Con Backend)
   const response = await fetch('/api/auth/login', {
       method: 'POST',
       body: JSON.stringify({ email, password })
   });
   const user = await response.json();
   ```

2. **Gestión de Tokens**
   ```javascript
   // Agregar al login exitoso
   localStorage.setItem('token', user.token);
   
   // Usar en peticiones
   headers: {
       'Authorization': `Bearer ${token}`
   }
   ```

3. **Endpoints Necesarios**
   - `POST /api/auth/login` - Login
   - `POST /api/auth/logout` - Logout
   - `POST /api/auth/refresh` - Refrescar token
   - `GET /api/auth/me` - Obtener usuario actual
   - `PUT /api/auth/profile` - Actualizar perfil
   - `PUT /api/auth/password` - Cambiar contraseña

## 📝 Notas de Implementación

### ✅ Cumple con UML
- Estructura de datos User/Client/Administrator
- Métodos login() y validateCredentials()
- Campos requeridos por el diagrama

### 🔄 Diferencias con Cliente No Logueado
**Actualmente:** Mínimas (solo UI diferente)
**Futuro:** 
- Acceso a reservaciones
- Realización de pedidos
- Ver historial
- Gestión de perfil
- Programa de fidelidad

### 🛡️ Seguridad
**Actual (Simulado):**
- Contraseñas en texto plano
- Validación solo en frontend

**Futuro (Con BD):**
- Contraseñas hasheadas (bcrypt)
- Validación en backend
- Tokens JWT
- HTTPS obligatorio
- Rate limiting
- Protección CSRF

## 🚀 Próximos Pasos

1. ✅ Sistema de Login - **COMPLETADO**
2. ⏳ Integración con Base de Datos
3. ⏳ Sistema de Reservaciones (Backend)
4. ⏳ CRUD de Productos/Categorías
5. ⏳ Sistema de Carrito y Pedidos
6. ⏳ Panel de Administración Completo
7. ⏳ Sistema de Reportes
8. ⏳ Sistema de Pagos

## 🐛 Cómo Probar

1. Abrir `index.html` en el navegador
2. Click en "Ingresar" en el menú
3. Usar credenciales de prueba:
   - Admin: `admin@adminbocatto.com` / `adminPass123`
   - Cliente: `cliente@bocatto.com` / `cliente123`
4. Verificar redirección:
   - Administrador → AdminProfile.html con mensaje "¡Bienvenido, Raul!"
   - Cliente → index.html
5. Probar el menú de usuario
6. Cerrar sesión

## 📚 Archivos Modificados/Creados

### 🆕 Nuevos
- `js/auth.js`
- `js/AdminProfile.js`
- `html/AdminProfile.html`
- `styles/AdminProfile.css`
- `LOGIN_SYSTEM.md` (este archivo)

### 🔄 Modificados
- `index.html`
- `js/login-modal.js`
- `styles/login-modal.css`

---

**Desarrollado para:** Bocatto Valley - Sistema de Gestión de Restaurante  
**Versión:** 1.0.0  
**Fecha:** Octubre 2025  
**Preparado para:** Integración futura con MongoDB + Node.js Backend
