# 🚀 GUÍA COMPLETA: Migración a MongoDB Atlas

## 📋 Resumen

He creado una **arquitectura completa** para conectar tu aplicación Bocatto Valley con **MongoDB Atlas**. Tu proyecto ahora tiene:

✅ **Backend API** con Node.js + Express + MongoDB  
✅ **Autenticación JWT** segura  
✅ **Modelos de datos** basados en tu UML  
✅ **Frontend actualizado** para consumir la API  
✅ **Listo para despliegue en la nube**

---

## 📁 Estructura Creada

```
FastFoodApp/
├── backend/                    # ⭐ NUEVO: API Backend
│   ├── config/
│   │   └── database.js        # Conexión a MongoDB Atlas
│   ├── controllers/
│   │   └── authController.js  # Lógica de autenticación
│   ├── database/
│   │   └── seed.js           # Datos iniciales
│   ├── middleware/
│   │   └── auth.js           # Protección de rutas
│   ├── models/
│   │   └── User.js           # Modelo de usuario (UML)
│   ├── routes/
│   │   └── authRoutes.js     # Endpoints API
│   ├── utils/
│   │   └── jwt.js            # Utilidades JWT
│   ├── .env                  # Variables de entorno
│   ├── .env.example          # Ejemplo de configuración
│   ├── package.json          # Dependencias
│   ├── server.js             # Servidor principal
│   └── README.md             # Documentación completa
│
├── js/
│   ├── api-client.js         # ⭐ NUEVO: Cliente HTTP
│   ├── auth-api.js           # ⭐ NUEVO: Auth con API
│   └── auth.js               # Versión anterior (localStorage)
│
└── index.html                # Tu frontend existente
```

---

## 🎯 PASO A PASO: Configuración

### **PASO 1: Instalar Node.js**

Si no lo tienes instalado:

1. Ve a https://nodejs.org/
2. Descarga la versión LTS
3. Instálalo
4. Verifica en PowerShell:

```powershell
node --version
npm --version
```

### **PASO 2: Configurar MongoDB Atlas**

#### A. Crear cuenta y cluster

1. **Ir a** https://www.mongodb.com/cloud/atlas/register
2. **Crear cuenta** gratuita o iniciar sesión
3. **Crear organización** (si es primera vez)
4. **Crear proyecto**: "Bocatto Valley"
5. **Crear Cluster GRATIS (M0)**:
   - Provider: AWS (o el que prefieras)
   - Region: La más cercana (ej: São Paulo)
   - Cluster Name: `Cluster0`
   - Click en **Create Cluster** (toma 3-5 minutos)

#### B. Configurar seguridad

**1. Crear usuario de base de datos:**

```
Security > Database Access > Add New Database User
  ├─ Authentication Method: Password
  ├─ Username: bocatto_admin
  ├─ Password: [Genera una segura o escribe una]
  │   ⚠️ GUARDA ESTA CONTRASEÑA!
  └─ Database User Privileges: Atlas admin
```

Click en **Add User**

**2. Permitir acceso desde tu IP:**

```
Security > Network Access > Add IP Address
  ├─ Para desarrollo: Allow Access from Anywhere (0.0.0.0/0)
  └─ Para producción: Agrega solo la IP de tu servidor
```

Click en **Confirm**

#### C. Obtener URI de conexión

```
Deployment > Database > Connect (botón en tu cluster)
  └─ Connect your application
      ├─ Driver: Node.js
      ├─ Version: 5.5 or later
      └─ Copiar la cadena de conexión
```

Se verá así:
```
mongodb+srv://bocatto_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### **PASO 3: Configurar Backend**

#### A. Instalar dependencias

```powershell
# Navegar a la carpeta backend
cd backend

# Instalar todas las dependencias
npm install
```

Esto instalará:
- express (servidor web)
- mongoose (ODM para MongoDB)
- bcryptjs (encriptación de contraseñas)
- jsonwebtoken (autenticación JWT)
- cors (permitir peticiones del frontend)
- dotenv (variables de entorno)

#### B. Configurar variables de entorno

Abre el archivo `backend/.env` y modifica:

```env
# ⚠️ REEMPLAZA CON TU URI REAL
MONGODB_URI=mongodb+srv://bocatto_admin:TU_CONTRASEÑA_AQUI@cluster0.xxxxx.mongodb.net/bocatto_valley?retryWrites=true&w=majority

# Configuración del servidor
PORT=3000
NODE_ENV=development

# JWT Secret (genera uno único)
JWT_SECRET=tu_clave_super_secreta_cambiala_12345
JWT_EXPIRE=7d

# CORS (dominios permitidos)
FRONTEND_URL=http://localhost:5500
CORS_ORIGIN=http://localhost:5500,http://127.0.0.1:5500

# Cookie Secret
COOKIE_SECRET=otra_clave_secreta_para_cookies
```

**Importante:**
- Reemplaza `TU_CONTRASEÑA_AQUI` con la contraseña que creaste
- Reemplaza `cluster0.xxxxx` con tu cluster real
- Cambia las claves `JWT_SECRET` y `COOKIE_SECRET`

#### C. Poblar base de datos

```powershell
# Crear usuarios de prueba en MongoDB
npm run seed
```

Deberías ver:
```
✅ MongoDB Atlas Conectado Exitosamente
✅ 3 usuarios creados exitosamente
```

Usuarios creados:
- **Admin**: admin@adminbocatto.com / adminPass123
- **Cliente**: cliente@bocatto.com / cliente123
- **Cliente 2**: juan.perez@example.com / 123456

#### D. Iniciar servidor

```powershell
# Modo producción
npm start

# O modo desarrollo (con auto-reinicio)
npm run dev
```

Deberías ver:
```
========================================
✅ MongoDB Atlas Conectado Exitosamente
========================================
🚀 SERVIDOR INICIADO CORRECTAMENTE
🌐 Puerto: 3000
🔗 URL: http://localhost:3000
========================================
```

#### E. Verificar que funciona

Abre tu navegador en: **http://localhost:3000**

Deberías ver:
```json
{
  "success": true,
  "message": "🍔 Bienvenido a Bocatto Valley API"
}
```

### **PASO 4: Actualizar Frontend**

Necesitas modificar tu `index.html` para usar la nueva autenticación con API:

#### Opción A: Usar nueva versión (Recomendado)

En `index.html`, **ANTES** de `</body>`, cambia:

```html
<!-- ❌ Versión anterior (localStorage) -->
<script src="js/auth.js"></script>

<!-- ✅ Nueva versión (API) -->
<script src="js/api-client.js"></script>
<script src="js/auth-api.js"></script>
```

#### Opción B: Mantener ambas versiones temporalmente

Puedes mantener ambas mientras migras:

```html
<!-- API Client (nuevo) -->
<script src="js/api-client.js"></script>

<!-- Auth con API (nuevo) - comentar auth.js viejo -->
<!-- <script src="js/auth.js"></script> -->
<script src="js/auth-api.js"></script>
```

**Importante:** Solo usa UNA versión a la vez (auth.js O auth-api.js)

### **PASO 5: Configurar URL de la API**

Abre `js/api-client.js` y verifica la configuración:

```javascript
const API_CONFIG = {
    baseURL: window.location.hostname === 'localhost' 
        ? 'http://localhost:3000/api'  // ✅ Desarrollo
        : 'https://tu-api-en-produccion.com/api', // ⚠️ Cambiar cuando despliegues
    // ...
};
```

---

## 🧪 Probar la Aplicación

### 1. Abrir frontend

Abre tu `index.html` con Live Server (puerto 5500 por defecto)

### 2. Verificar consola del navegador

Deberías ver:
```
🌐 API Client configurado: http://localhost:3000/api
🔐 Sistema de autenticación con API cargado correctamente
```

### 3. Probar registro

1. Click en **"Ingresar"**
2. Click en **"Regístrate aquí"**
3. Completa el formulario
4. Click en **"Crear Cuenta"**

Si todo funciona, verás un mensaje de éxito y se creará el usuario en MongoDB.

### 4. Probar login

Usa las credenciales de prueba:
- **Admin**: admin@adminbocatto.com / adminPass123
- **Cliente**: cliente@bocatto.com / cliente123

### 5. Verificar en MongoDB Atlas

1. Ve a MongoDB Atlas
2. **Database > Browse Collections**
3. Verás la base de datos `bocatto_valley`
4. Colección `users` con tus usuarios

---

## 🔧 Troubleshooting (Solución de Problemas)

### ❌ Error: "No se pudo conectar con el servidor"

**Causa:** El backend no está ejecutándose

**Solución:**
```powershell
cd backend
npm run dev
```

### ❌ Error: "MongoServerError: bad auth"

**Causa:** Usuario o contraseña incorrectos

**Solución:**
1. Verifica que la contraseña en `.env` sea correcta
2. Verifica que hayas creado el usuario en Database Access
3. Asegúrate de NO tener `<password>` en el URI

### ❌ Error: "Connection timeout"

**Causa:** IP no permitida

**Solución:**
1. Ve a MongoDB Atlas > Security > Network Access
2. Agrega `0.0.0.0/0` para permitir todas las IPs (desarrollo)

### ❌ Error: CORS

**Causa:** Frontend y backend en diferentes puertos

**Solución:**
Verifica que en `backend/.env` tengas:
```env
CORS_ORIGIN=http://localhost:5500,http://127.0.0.1:5500
```

### ❌ Los datos no se guardan

**Verifica:**
1. Backend está ejecutándose (`npm run dev`)
2. Consola del navegador no muestra errores
3. Network tab en DevTools muestra peticiones exitosas (status 200)

---

## 🌐 Despliegue a la Nube

### Frontend (Netlify - GRATIS)

1. **Crear cuenta en** https://www.netlify.com
2. **Arrastra tu carpeta** `FastFoodApp` (solo frontend)
3. **Configurar:**
   - Build command: (dejar vacío)
   - Publish directory: `.`
4. **Deploy**
5. **Obtén tu URL:** `https://tu-app.netlify.app`

### Backend (Render - GRATIS)

1. **Crear cuenta en** https://render.com
2. **New +** > **Web Service**
3. **Conectar con GitHub** (sube tu código a un repo)
4. **Configurar:**
   - Name: `bocatto-valley-api`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: `Free`
5. **Variables de entorno:**
   ```
   MONGODB_URI=tu_uri_completa
   JWT_SECRET=tu_secret
   NODE_ENV=production
   FRONTEND_URL=https://tu-app.netlify.app
   CORS_ORIGIN=https://tu-app.netlify.app
   ```
6. **Create Web Service**
7. **Obtén tu URL:** `https://bocatto-valley-api.onrender.com`

### Actualizar Frontend con URL de producción

En `js/api-client.js`:

```javascript
const API_CONFIG = {
    baseURL: window.location.hostname === 'localhost' 
        ? 'http://localhost:3000/api'
        : 'https://bocatto-valley-api.onrender.com/api', // ✅ URL de Render
    // ...
};
```

---

## 📊 Arquitectura del Sistema

```
┌─────────────┐         HTTP/HTTPS        ┌─────────────┐
│   FRONTEND  │ ────────────────────────> │   BACKEND   │
│  (HTML/JS)  │   Fetch API (JWT Token)   │  (Express)  │
└─────────────┘ <──────────────────────── └─────────────┘
                     JSON Response               │
                                                 │
                                           Mongoose ODM
                                                 │
                                                 ▼
                                        ┌─────────────────┐
                                        │  MongoDB Atlas  │
                                        │    (Cloud DB)   │
                                        └─────────────────┘
```

---

## 📝 Próximos Pasos

Ahora que tienes la autenticación funcionando, puedes agregar:

1. **Modelos adicionales** (según tu UML):
   - Reservaciones
   - Productos/Menú
   - Pedidos
   - Comentarios
   - Etc.

2. **Más endpoints API**:
   - CRUD de productos
   - Sistema de reservaciones
   - Procesamiento de pedidos

3. **Características avanzadas**:
   - Reset de contraseña por email
   - Upload de imágenes
   - Notificaciones en tiempo real
   - Pagos online

---

## 🎓 Recursos de Aprendizaje

- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
- **Mongoose Docs**: https://mongoosejs.com/docs/
- **Express Docs**: https://expressjs.com/
- **JWT.io**: https://jwt.io/

---

## 💡 Consejos Importantes

1. **NUNCA** subas el archivo `.env` a Git
2. **Cambia** las claves secretas en producción
3. **Limita** las IPs en Network Access para producción
4. **Usa HTTPS** en producción (Render y Netlify lo hacen automático)
5. **Monitorea** tu cluster en MongoDB Atlas (uso, queries lentas, etc.)

---

## ✅ Checklist de Verificación

- [ ] MongoDB Atlas cluster creado
- [ ] Usuario de base de datos configurado
- [ ] IP permitida en Network Access
- [ ] Variables de entorno configuradas (`.env`)
- [ ] Dependencias instaladas (`npm install`)
- [ ] Base de datos poblada (`npm run seed`)
- [ ] Backend funcionando (`npm run dev`)
- [ ] Frontend actualizado (usando `auth-api.js`)
- [ ] API Client configurado (`api-client.js`)
- [ ] Login/Registro funcionando
- [ ] Datos guardándose en MongoDB Atlas

---

**🎉 ¡Felicidades!** Tu aplicación ahora está conectada a MongoDB Atlas y lista para la nube.

¿Necesitas ayuda con algún paso? Pregunta sin dudas. 🚀
