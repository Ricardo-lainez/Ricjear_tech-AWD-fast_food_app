# 🍽️ Bocatto Valley - Arquitectura del Proyecto

## 📋 Información General

**Nombre del Proyecto:** Bocatto Valley Fast Food App  
**Tipo:** Aplicación Web de Restaurante con Sistema de Reservaciones  
**Stack:** MERN (MongoDB, Express, React-like Vanilla JS, Node.js)  
**Versión:** 2.0.0  
**Universidad:** ESPE - Quinto Semestre Ingeniería de Software  
**Materia:** Web Avanzada

---

## 🌐 URLs y Despliegue

### **Producción (Cloud)**
- **Frontend:** https://bocatto-valley.vercel.app
  - **Servidor:** Vercel
  - **Framework:** Static Site (HTML/CSS/JS puro)
  - **Región:** Auto (Global CDN)
  
- **Backend API:** https://bocatto-valley-api.onrender.com
  - **Servidor:** Render
  - **Framework:** Node.js + Express
  - **Región:** Oregon, USA
  - **Health Check:** https://bocatto-valley-api.onrender.com/api/health

- **Base de Datos:** MongoDB Atlas
  - **Cluster:** Shared M0 (Free Tier)
  - **Región:** AWS us-east-1
  - **Nombre BD:** bocatto_valley_db
  - **String de Conexión:** mongodb+srv://bocattovalley:...@cluster.mongodb.net/bocatto_valley_db

### **Desarrollo (Local)**
- **Frontend:** `http://localhost:5500` o `file:///...` (Live Server)
- **Backend API:** `http://localhost:3000`
- **Base de Datos:** MongoDB Atlas (compartida con producción)

---

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Vercel)                        │
│              https://bocatto-valley.vercel.app              │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  HTML    │  │   CSS    │  │    JS    │  │  Images  │  │
│  │  Pages   │  │  Styles  │  │  Scripts │  │  Assets  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                             │
│  • Páginas estáticas HTML5                                 │
│  • Estilos CSS3 responsivos                                │
│  • JavaScript Vanilla (sin frameworks)                     │
│  • API Client (fetch API)                                  │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTPS Requests
                      │ (JSON)
┌─────────────────────▼───────────────────────────────────────┐
│                  BACKEND (Render)                           │
│        https://bocatto-valley-api.onrender.com              │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Express.js Server                       │  │
│  │                                                      │  │
│  │  PORT: 3000 (local) / Dynamic (Render)             │  │
│  │                                                      │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐            │  │
│  │  │  Auth   │  │  Users  │  │Reservas │            │  │
│  │  │  Routes │  │  Routes │  │ Routes  │   + más    │  │
│  │  └─────────┘  └─────────┘  └─────────┘            │  │
│  │                                                      │  │
│  │  Middlewares: CORS, JSON Parser, JWT Auth          │  │
│  │  Seguridad: bcrypt, JWT, rate limiting             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────────┘
                      │ MongoDB Driver
                      │ (Mongoose ODM)
┌─────────────────────▼───────────────────────────────────────┐
│               BASE DE DATOS (MongoDB Atlas)                 │
│                                                             │
│  Cluster: bocatto-valley-cluster                           │
│  Region: AWS us-east-1                                     │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Collections:                                        │  │
│  │                                                      │  │
│  │  • users          - Clientes y administradores      │  │
│  │  • ambientes      - Espacios disponibles            │  │
│  │  • reservaciones  - Reservas de clientes            │  │
│  │  • productos      - Menú del restaurante            │  │
│  │  • pedidos        - Órdenes de comida               │  │
│  │  • comentarios    - Reseñas de clientes             │  │
│  │  • contactos      - Formularios de contacto         │  │
│  │  • solicitudes    - Aplicaciones de empleo          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura del Proyecto

```
FastFoodApp/
│
├── 📄 index.html                    # Página principal
├── 📄 README.md                     # Documentación básica
├── 📄 README_ARQUITECTURA.md        # Este archivo (arquitectura detallada)
├── 📄 LOGIN_SYSTEM.md               # Documentación del sistema de login
├── 📄 ACTUALIZAR_CREDENCIALES.md    # Guía para cambiar credenciales
│
├── 📂 html/                         # Páginas HTML
│   ├── menu.html                    # Página del menú
│   ├── reservaciones.html           # Sistema de reservaciones
│   ├── ofertas.html                 # Ofertas y promociones
│   ├── ubicaciones.html             # Mapa de ubicaciones
│   ├── quienesSomos.html           # Información de la empresa
│   ├── contactenos.html            # Formulario de contacto
│   ├── trabajaConNosotros.html     # Formulario de empleo
│   ├── AdminProfile.html           # Panel de administración
│   └── ClientProfile.html          # Perfil de cliente
│
├── 📂 js/                           # JavaScript
│   ├── api-client.js               # Cliente HTTP genérico
│   ├── auth-api.js                 # API de autenticación
│   ├── auth.js                     # Lógica de autenticación
│   ├── menu.js                     # Gestión del menú nav
│   ├── login-modal.js              # Modal de inicio de sesión
│   ├── register-modal.js           # Modal de registro
│   ├── reservaciones-api.js        # API de reservaciones
│   ├── reservaciones.js            # Lógica de reservaciones
│   ├── AdminProfile.js             # Lógica del panel admin
│   ├── filtro-platos.js            # Filtros del menú
│   ├── modal-plato.js              # Modal de detalles de plato
│   ├── slider.js                   # Carrusel de imágenes
│   └── validaciones/               # Validaciones de formularios
│       ├── validacionesContactenos.js
│       ├── validacionessolicitudtrabajo.js
│       └── validacionReserva.js
│
├── 📂 styles/                       # Hojas de estilo CSS
│   ├── stylesIndex.css             # Estilos de la página principal
│   ├── stylesMenu.css              # Estilos del menú
│   ├── stylesReservaciones.css     # Estilos de reservaciones
│   ├── stylesOfertas.css           # Estilos de ofertas
│   ├── stylesUbicaciones.css       # Estilos de ubicaciones
│   ├── stylesQuienesSomos.css      # Estilos de quiénes somos
│   ├── stylesContactenos.css       # Estilos de contacto
│   ├── stylesTrabajaConNosotros.css # Estilos de empleo
│   ├── AdminProfile.css            # Estilos del panel admin
│   ├── header-menu.css             # Estilos del header/nav
│   └── login-modal.css             # Estilos de modales de login
│
├── 📂 images/                       # Recursos multimedia
│   ├── home/                       # Imágenes de inicio
│   ├── slider/                     # Imágenes del carrusel
│   ├── platos/                     # Fotos de platillos
│   │   ├── bebidas/
│   │   ├── Entradas_Snacks/
│   │   ├── Platos_Principales/
│   │   ├── Combos_Especialidades/
│   │   └── postres/
│   ├── chefs/                      # Fotos del equipo
│   ├── promociones/                # Banners de ofertas
│   └── quienesSomos/              # Imágenes corporativas
│
├── 📂 backend/                      # Servidor Node.js
│   ├── server.js                   # Punto de entrada principal
│   ├── package.json                # Dependencias de Node
│   ├── .env                        # Variables de entorno (NO en git)
│   │
│   ├── 📂 config/                  # Configuraciones
│   │   └── database.js             # Conexión a MongoDB
│   │
│   ├── 📂 models/                  # Modelos de Mongoose
│   │   ├── User.js                 # Modelo de usuario
│   │   ├── Ambiente.js             # Modelo de ambiente
│   │   ├── Reservacion.js          # Modelo de reservación
│   │   ├── Producto.js             # Modelo de producto
│   │   ├── Pedido.js               # Modelo de pedido
│   │   ├── Comentario.js           # Modelo de comentario
│   │   └── Contacto.js             # Modelo de contacto
│   │
│   ├── 📂 routes/                  # Rutas de la API
│   │   ├── authRoutes.js           # Rutas de autenticación
│   │   ├── userRoutes.js           # Rutas de usuarios
│   │   ├── ambienteRoutes.js       # Rutas de ambientes
│   │   ├── reservacionRoutes.js    # Rutas de reservaciones
│   │   ├── productoRoutes.js       # Rutas de productos
│   │   ├── pedidoRoutes.js         # Rutas de pedidos
│   │   └── contactoRoutes.js       # Rutas de contacto
│   │
│   ├── 📂 middleware/              # Middlewares
│   │   ├── auth.js                 # Verificación de JWT
│   │   ├── adminAuth.js            # Verificación de admin
│   │   └── errorHandler.js         # Manejo de errores
│   │
│   ├── 📂 controllers/             # Controladores
│   │   ├── authController.js       # Lógica de auth
│   │   ├── userController.js       # Lógica de usuarios
│   │   ├── reservacionController.js # Lógica de reservaciones
│   │   └── ...                     # Otros controladores
│   │
│   └── 📂 scripts/                 # Scripts de utilidad
│       └── seedAmbientes.js        # Seed de ambientes iniciales
│
└── 📂 database/                     # Documentación de BD
    ├── schema.sql                  # Esquema conceptual (referencia)
    └── README.md                   # Documentación de la BD
```

---

## 🔧 Configuración de Puertos y URLs

### **Variables de Entorno (Backend)**

#### **Desarrollo Local** (.env)
```env
# Puerto del servidor
PORT=3000

# Base de datos
MONGODB_URI=mongodb+srv://bocattovalley:[PASSWORD]@cluster.rkwqj.mongodb.net/bocatto_valley_db

# JWT Secret
JWT_SECRET=tu_clave_secreta_super_segura_aqui_cambiar_en_produccion

# Entorno
NODE_ENV=development

# CORS Origins (local)
CORS_ORIGIN=http://localhost:5500,http://127.0.0.1:5500,file://
```

#### **Producción Render** (Environment Variables)
```env
# Puerto dinámico (Render lo asigna automáticamente)
PORT=auto

# Base de datos (MongoDB Atlas)
MONGODB_URI=mongodb+srv://bocattovalley:[PASSWORD]@cluster.rkwqj.mongodb.net/bocatto_valley_db

# JWT Secret (cambiar en producción)
JWT_SECRET=[SECRET_KEY_PRODUCTION]

# Entorno
NODE_ENV=production

# CORS Origins (Vercel)
CORS_ORIGIN=https://bocatto-valley.vercel.app,https://*.vercel.app
```

### **Configuración del Frontend** (js/api-client.js)

```javascript
const API_CONFIG = {
    baseURL: window.location.hostname === 'localhost' || 
             window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000/api'  // Desarrollo
        : 'https://bocatto-valley-api.onrender.com/api', // Producción
    
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
};
```

---

## 📡 Endpoints de la API

### **Base URL**
- **Local:** `http://localhost:3000/api`
- **Producción:** `https://bocatto-valley-api.onrender.com/api`

### **Autenticación** (`/api/auth`)

| Método | Endpoint | Descripción | Auth Requerida |
|--------|----------|-------------|----------------|
| POST | `/auth/register` | Registrar nuevo usuario | ❌ No |
| POST | `/auth/login` | Iniciar sesión | ❌ No |
| GET | `/auth/me` | Obtener usuario actual | ✅ Sí (JWT) |
| PUT | `/auth/update-profile` | Actualizar perfil | ✅ Sí (JWT) |
| POST | `/auth/logout` | Cerrar sesión | ✅ Sí (JWT) |

### **Usuarios** (`/api/users`)

| Método | Endpoint | Descripción | Auth Requerida |
|--------|----------|-------------|----------------|
| GET | `/users` | Listar todos los usuarios | ✅ Admin |
| GET | `/users/:id` | Obtener usuario por ID | ✅ Admin |
| PUT | `/users/:id` | Actualizar usuario | ✅ Admin |
| DELETE | `/users/:id` | Eliminar usuario | ✅ Admin |

### **Ambientes** (`/api/ambientes`)

| Método | Endpoint | Descripción | Auth Requerida |
|--------|----------|-------------|----------------|
| GET | `/ambientes` | Listar ambientes activos | ❌ No |
| GET | `/ambientes/:id` | Obtener ambiente por ID | ❌ No |
| POST | `/ambientes` | Crear ambiente | ✅ Admin |
| PUT | `/ambientes/:id` | Actualizar ambiente | ✅ Admin |
| DELETE | `/ambientes/:id` | Eliminar ambiente | ✅ Admin |

### **Reservaciones** (`/api/reservaciones`)

| Método | Endpoint | Descripción | Auth Requerida |
|--------|----------|-------------|----------------|
| POST | `/reservaciones` | Crear reservación | ✅ Usuario |
| GET | `/reservaciones` | Listar todas (admin) | ✅ Admin |
| GET | `/reservaciones/mis-reservaciones` | Mis reservaciones | ✅ Usuario |
| GET | `/reservaciones/:id` | Obtener reservación | ✅ Usuario/Admin |
| PATCH | `/reservaciones/:id/cancelar` | Cancelar reservación | ✅ Usuario/Admin |
| PATCH | `/reservaciones/:id/confirmar` | Confirmar reservación | ✅ Admin |
| POST | `/reservaciones/verificar-disponibilidad` | Verificar disponibilidad | ❌ No |

### **Productos** (`/api/productos`)

| Método | Endpoint | Descripción | Auth Requerida |
|--------|----------|-------------|----------------|
| GET | `/productos` | Listar productos activos | ❌ No |
| GET | `/productos/:id` | Obtener producto | ❌ No |
| POST | `/productos` | Crear producto | ✅ Admin |
| PUT | `/productos/:id` | Actualizar producto | ✅ Admin |
| DELETE | `/productos/:id` | Eliminar producto | ✅ Admin |

### **Pedidos** (`/api/pedidos`)

| Método | Endpoint | Descripción | Auth Requerida |
|--------|----------|-------------|----------------|
| POST | `/pedidos` | Crear pedido | ✅ Usuario |
| GET | `/pedidos` | Listar todos (admin) | ✅ Admin |
| GET | `/pedidos/mis-pedidos` | Mis pedidos | ✅ Usuario |
| GET | `/pedidos/:id` | Obtener pedido | ✅ Usuario/Admin |
| PATCH | `/pedidos/:id/estado` | Actualizar estado | ✅ Admin |

### **Contacto** (`/api/contacto`)

| Método | Endpoint | Descripción | Auth Requerida |
|--------|----------|-------------|----------------|
| POST | `/contacto` | Enviar formulario | ❌ No |
| GET | `/contacto` | Listar mensajes | ✅ Admin |
| PATCH | `/contacto/:id/leido` | Marcar como leído | ✅ Admin |

### **Health Check**

| Método | Endpoint | Descripción | Auth Requerida |
|--------|----------|-------------|----------------|
| GET | `/api/health` | Estado del servidor | ❌ No |

**Respuesta ejemplo:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-11T10:30:00.000Z",
  "database": "connected",
  "environment": "production"
}
```

---

## 🗄️ Modelos de Base de Datos

### **User (Usuario)**
```javascript
{
  _id: ObjectId,
  nombre: String (required),
  apellido: String (required),
  email: String (required, unique),
  password: String (required, hashed con bcrypt),
  telefono: String,
  direccion: String,
  rol: String (enum: ['cliente', 'admin'], default: 'cliente'),
  activo: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### **Ambiente**
```javascript
{
  _id: ObjectId,
  nombre: String (required),
  descripcion: String (required),
  capacidadMin: Number (required),
  capacidadMax: Number (required),
  imagenUrl: String,
  caracteristicas: [String],
  badge: {
    texto: String,
    clase: String,
    icono: String
  },
  rating: {
    promedio: Number (default: 0),
    totalResenas: Number (default: 0)
  },
  activo: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### **Reservacion**
```javascript
{
  _id: ObjectId,
  numeroReservacion: String (unique, auto-generado),
  clienteId: ObjectId (ref: 'User'),
  ambienteId: ObjectId (ref: 'Ambiente'),
  fechaReservacion: Date (required),
  horaInicio: String (required, formato HH:MM),
  horaFin: String (required, formato HH:MM),
  numeroPersonas: Number (required),
  ocasionEspecial: String,
  comentarios: String,
  estado: String (enum: ['pendiente', 'confirmada', 'cancelada'], default: 'pendiente'),
  createdAt: Date,
  updatedAt: Date
}

// Índice: { ambienteId: 1, fechaReservacion: 1, horaInicio: 1 }
// Para búsquedas rápidas de disponibilidad
```

### **Producto**
```javascript
{
  _id: ObjectId,
  nombre: String (required),
  descripcion: String,
  categoria: String (enum: ['Entradas', 'Platos Principales', 'Combos', 'Postres', 'Bebidas']),
  precio: Number (required),
  imagenUrl: String,
  ingredientes: [String],
  disponible: Boolean (default: true),
  destacado: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### **Pedido**
```javascript
{
  _id: ObjectId,
  numeroPedido: String (unique, auto-generado),
  clienteId: ObjectId (ref: 'User'),
  items: [
    {
      productoId: ObjectId (ref: 'Producto'),
      nombre: String,
      cantidad: Number,
      precioUnitario: Number,
      subtotal: Number
    }
  ],
  total: Number (required),
  estado: String (enum: ['pendiente', 'preparando', 'listo', 'entregado', 'cancelado']),
  metodoPago: String,
  direccionEntrega: String,
  comentarios: String,
  createdAt: Date,
  updatedAt: Date
}
```

### **Comentario**
```javascript
{
  _id: ObjectId,
  clienteId: ObjectId (ref: 'User'),
  ambienteId: ObjectId (ref: 'Ambiente'),
  texto: String (required),
  rating: Number (required, 1-5),
  aprobado: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### **Contacto**
```javascript
{
  _id: ObjectId,
  nombre: String (required),
  email: String (required),
  telefono: String,
  asunto: String (required),
  mensaje: String (required),
  leido: Boolean (default: false),
  respondido: Boolean (default: false),
  createdAt: Date
}
```

---

## 🔐 Sistema de Autenticación

### **Flujo de Autenticación**

1. **Registro de Usuario**
   - Usuario completa formulario en modal de registro
   - Frontend: POST `/api/auth/register` con datos del usuario
   - Backend: Valida datos, hashea contraseña con bcrypt (salt: 10)
   - Backend: Crea usuario en BD y genera JWT token
   - Backend: Retorna token y datos del usuario
   - Frontend: Guarda token en `localStorage` o `sessionStorage`
   - Frontend: Redirige a página principal o perfil

2. **Inicio de Sesión**
   - Usuario ingresa email y contraseña en modal de login
   - Frontend: POST `/api/auth/login` con credenciales
   - Backend: Busca usuario por email
   - Backend: Compara contraseña con bcrypt.compare()
   - Backend: Si coincide, genera JWT token (expires: 7 días)
   - Backend: Retorna token y datos del usuario
   - Frontend: Guarda token en `localStorage` (si "Recordarme") o `sessionStorage`
   - Frontend: Actualiza UI (muestra nombre de usuario, oculta login)

3. **Autenticación de Peticiones**
   - Frontend: Obtiene token de `localStorage` o `sessionStorage`
   - Frontend: Incluye token en header: `Authorization: Bearer [TOKEN]`
   - Backend: Middleware `auth.js` verifica token
   - Backend: Decodifica JWT y obtiene userId
   - Backend: Busca usuario en BD
   - Backend: Si válido, continúa con la petición
   - Backend: Si inválido, retorna 401 Unauthorized

4. **Cierre de Sesión**
   - Usuario hace clic en "Cerrar Sesión"
   - Frontend: Elimina token de `localStorage` y `sessionStorage`
   - Frontend: Limpia datos de usuario de memoria
   - Frontend: Actualiza UI (muestra botón "Ingresar")
   - Frontend: Redirige a página principal

### **Tokens JWT**

**Estructura del Token:**
```javascript
{
  header: {
    alg: 'HS256',
    typ: 'JWT'
  },
  payload: {
    id: '507f1f77bcf86cd799439011', // userId
    email: 'usuario@example.com',
    rol: 'cliente',
    iat: 1699689600,  // Issued at
    exp: 1700294400   // Expiration (7 días)
  },
  signature: 'HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)'
}
```

**Secret Key:** Almacenado en variable de entorno `JWT_SECRET`  
**Expiración:** 7 días (configurable en `authRoutes.js`)  
**Algoritmo:** HMAC SHA-256

### **Seguridad**

- ✅ Contraseñas hasheadas con bcrypt (costo: 10)
- ✅ Tokens JWT con firma HMAC SHA-256
- ✅ CORS configurado para orígenes específicos
- ✅ Validación de entradas con express-validator
- ✅ Sanitización de datos
- ✅ Headers de seguridad (Helmet)
- ✅ Rate limiting (100 peticiones por 15 min)
- ✅ HTTPS en producción (Vercel + Render)
- ⚠️ Sin refresh tokens (implementar en v3.0)
- ⚠️ Sin 2FA (implementar en v3.0)

---

## 🚀 Despliegue

### **Frontend (Vercel)**

#### **Paso 1: Preparar Repositorio**
```bash
cd FastFoodApp
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/[USUARIO]/Ricjear_tech-AWD-fast_food_app.git
git push -u origin main
```

#### **Paso 2: Configurar Vercel**
1. Ir a https://vercel.com y conectar GitHub
2. Importar repositorio `Ricjear_tech-AWD-fast_food_app`
3. **Framework Preset:** Other
4. **Root Directory:** `FastFoodApp`
5. **Build Command:** (dejar vacío - es static site)
6. **Output Directory:** `.` (root)
7. **Install Command:** (dejar vacío)

#### **Paso 3: Desplegar**
```bash
# Vercel lo hace automáticamente en cada push a main
git add .
git commit -m "Update frontend"
git push origin main
```

**URL Resultante:** https://bocatto-valley.vercel.app

---

### **Backend (Render)**

#### **Paso 1: Preparar Código**
Asegurarse de que `backend/server.js` tenga:
```javascript
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### **Paso 2: Configurar Render**
1. Ir a https://render.com y crear cuenta
2. New → Web Service
3. Conectar repositorio de GitHub
4. **Name:** `bocatto-valley-api`
5. **Region:** Oregon (USA)
6. **Branch:** `main`
7. **Root Directory:** `FastFoodApp/backend`
8. **Runtime:** Node
9. **Build Command:** `npm install`
10. **Start Command:** `node server.js`
11. **Instance Type:** Free

#### **Paso 3: Variables de Entorno**
En Render Dashboard → Environment:
```
MONGODB_URI=mongodb+srv://bocattovalley:[PASSWORD]@cluster.rkwqj.mongodb.net/bocatto_valley_db
JWT_SECRET=[TU_SECRET_KEY_SEGURO]
NODE_ENV=production
CORS_ORIGIN=https://bocatto-valley.vercel.app
```

#### **Paso 4: Deploy**
```bash
# Render lo hace automáticamente
git add backend/
git commit -m "Update backend"
git push origin main
```

**URL Resultante:** https://bocatto-valley-api.onrender.com

---

### **Base de Datos (MongoDB Atlas)**

#### **Paso 1: Crear Cluster**
1. Ir a https://www.mongodb.com/cloud/atlas
2. Crear cuenta gratuita
3. Build a Database → Shared (M0 Free)
4. Provider: AWS, Region: us-east-1
5. Cluster Name: `bocatto-valley-cluster`

#### **Paso 2: Configurar Acceso**
1. Database Access → Add New User
   - Username: `bocattovalley`
   - Password: (generar seguro)
   - Role: Atlas Admin
2. Network Access → Add IP Address
   - IP: `0.0.0.0/0` (permitir todas - solo para dev)
   - O agregar IPs específicas de Render

#### **Paso 3: Obtener Connection String**
1. Connect → Connect your application
2. Driver: Node.js, Version: 4.1 or later
3. Copiar string: 
   ```
   mongodb+srv://bocattovalley:[PASSWORD]@cluster.rkwqj.mongodb.net/bocatto_valley_db
   ```

#### **Paso 4: Seed Inicial**
```bash
cd backend
node scripts/seedAmbientes.js
```

---

## 🛠️ Instalación y Ejecución Local

### **Requisitos Previos**
- Node.js v18+ (https://nodejs.org)
- npm v9+ (incluido con Node.js)
- Git (https://git-scm.com)
- Navegador moderno (Chrome, Firefox, Edge)
- Editor de código (VS Code recomendado)

### **Paso 1: Clonar Repositorio**
```bash
git clone https://github.com/Ricardo-lainez/Ricjear_tech-AWD-fast_food_app.git
cd Ricjear_tech-AWD-fast_food_app/FastFoodApp
```

### **Paso 2: Configurar Backend**
```bash
cd backend
npm install
```

Crear archivo `.env`:
```env
PORT=3000
MONGODB_URI=mongodb+srv://bocattovalley:[PASSWORD]@cluster.rkwqj.mongodb.net/bocatto_valley_db
JWT_SECRET=tu_clave_secreta_local_cambiar_en_produccion
NODE_ENV=development
CORS_ORIGIN=http://localhost:5500,http://127.0.0.1:5500,file://
```

Ejecutar seed de datos:
```bash
node scripts/seedAmbientes.js
```

Iniciar servidor:
```bash
npm start
# O con nodemon para auto-reload:
npm run dev
```

**Backend corriendo en:** `http://localhost:3000`

### **Paso 3: Configurar Frontend**
```bash
# Volver a la raíz del proyecto
cd ..
```

**Opción A: Usando Live Server (VS Code)**
1. Instalar extensión "Live Server" en VS Code
2. Abrir `index.html`
3. Click derecho → "Open with Live Server"
4. Se abrirá en `http://localhost:5500`

**Opción B: Abrir directamente**
1. Navegar a la carpeta `FastFoodApp`
2. Doble clic en `index.html`
3. Se abrirá con protocolo `file://`

### **Paso 4: Probar la Aplicación**

**Credenciales de Prueba:**

Cliente:
- Email: `cliente@bocatto.com`
- Password: `cliente123`

Administrador:
- Email: `admin@adminbocatto.com`
- Password: `adminPass123`

---

## 📦 Dependencias del Proyecto

### **Backend (Node.js)**

```json
{
  "dependencies": {
    "express": "^4.18.2",        // Framework web
    "mongoose": "^7.6.3",        // ODM para MongoDB
    "bcryptjs": "^2.4.3",        // Hash de contraseñas
    "jsonwebtoken": "^9.0.2",    // Generación de JWT
    "cors": "^2.8.5",            // CORS middleware
    "dotenv": "^16.3.1",         // Variables de entorno
    "express-validator": "^7.0.1", // Validación de datos
    "helmet": "^7.1.0",          // Headers de seguridad
    "express-rate-limit": "^7.1.5" // Rate limiting
  },
  "devDependencies": {
    "nodemon": "^3.0.1"          // Auto-reload en desarrollo
  }
}
```

### **Frontend (Vanilla JS)**

- ✅ Sin dependencias npm
- ✅ Sin frameworks (React, Vue, Angular)
- ✅ Sin bundlers (Webpack, Vite)
- ✅ JavaScript puro ES6+
- ✅ CSS3 nativo (sin Sass/LESS)
- ✅ HTML5 semántico

**Librerías Externas (CDN):**
- Font Awesome 4.7.0 (iconos)
- Google Fonts (tipografías)

---

## 🧪 Testing

### **Testing Manual**

#### **Funcionalidades a Probar:**

**1. Sistema de Autenticación**
- [ ] Registro de nuevo usuario
- [ ] Inicio de sesión con credenciales correctas
- [ ] Inicio de sesión con credenciales incorrectas (debe fallar)
- [ ] Cerrar sesión
- [ ] Recordar sesión (checkbox "Recordarme")
- [ ] Expiración de token (después de 7 días)

**2. Sistema de Reservaciones**
- [ ] Ver lista de ambientes disponibles
- [ ] Abrir modal de reservación
- [ ] Seleccionar fecha futura (hoy + 1 día)
- [ ] Seleccionar hora disponible
- [ ] Verificar disponibilidad (margen 2 horas)
- [ ] Crear reservación con datos válidos
- [ ] Intentar reservar horario ocupado (debe fallar)
- [ ] Ver mis reservaciones en perfil de cliente
- [ ] Cancelar reservación

**3. Panel de Administración**
- [ ] Login como admin
- [ ] Ver todas las reservaciones
- [ ] Filtrar reservaciones por fecha
- [ ] Filtrar reservaciones por ambiente
- [ ] Filtrar reservaciones por estado
- [ ] Confirmar reservación pendiente
- [ ] Cancelar reservación
- [ ] Ver estadísticas (pendientes, confirmadas, canceladas)

**4. Navegación y UI**
- [ ] Login funciona desde TODAS las páginas
- [ ] Menú de navegación responsive
- [ ] Imágenes se cargan correctamente
- [ ] Modales se abren y cierran correctamente
- [ ] Formularios tienen validación
- [ ] Mensajes de error se muestran correctamente

### **Testing de API (Postman/cURL)**

```bash
# Health Check
curl https://bocatto-valley-api.onrender.com/api/health

# Registrar usuario
curl -X POST https://bocatto-valley-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test",
    "apellido": "User",
    "email": "test@test.com",
    "password": "test123"
  }'

# Login
curl -X POST https://bocatto-valley-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "test123"
  }'

# Obtener ambientes
curl https://bocatto-valley-api.onrender.com/api/ambientes

# Crear reservación (requiere token)
curl -X POST https://bocatto-valley-api.onrender.com/api/reservaciones \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [TU_TOKEN]" \
  -d '{
    "ambienteId": "507f1f77bcf86cd799439011",
    "fechaReservacion": "2025-11-15",
    "horaInicio": "19:00",
    "horaFin": "21:00",
    "numeroPersonas": 4
  }'
```

---

## 🐛 Troubleshooting

### **Problema: Reservaciones no se cargan**

**Causa:** API de reservaciones no está inicializada o hay error de configuración

**Solución:**
1. Verificar que `reservaciones-api.js` esté incluido ANTES de `reservaciones.js`
2. Abrir consola del navegador (F12) y buscar errores
3. Verificar que el backend esté corriendo
4. Probar endpoint: `curl http://localhost:3000/api/ambientes`

```bash
# Verificar backend local
cd backend
npm start

# Verificar endpoint
curl http://localhost:3000/api/ambientes
```

### **Problema: Login solo funciona desde INICIO**

**Causa:** Falta incluir scripts en otras páginas HTML

**Solución:**
1. Verificar que TODAS las páginas HTML tengan estos scripts en este orden:
```html
<script src="../js/api-client.js"></script>
<script src="../js/auth-api.js"></script>
<script src="../js/menu.js"></script>
<script src="../js/login-modal.js"></script>
<script src="../js/register-modal.js"></script>
```

2. Verificar ruta relativa correcta (usar `../js/` si estás en `html/`)

### **Problema: CORS Error en producción**

**Causa:** Orígenes no configurados correctamente

**Solución:**
1. Ir a Render Dashboard → Environment
2. Verificar `CORS_ORIGIN` incluya: `https://bocatto-valley.vercel.app`
3. Reiniciar servidor en Render: Manual Deploy → Deploy latest commit

### **Problema: MongoDB Connection Error**

**Causa:** IP no autorizada o credenciales incorrectas

**Solución:**
1. MongoDB Atlas → Network Access
2. Verificar que `0.0.0.0/0` esté en la lista (o IPs específicas)
3. Verificar `MONGODB_URI` en `.env` tenga password correcto
4. Verificar que no haya espacios en la connection string

### **Problema: Token Expirado**

**Causa:** JWT expiró después de 7 días

**Solución:**
1. Cerrar sesión y volver a iniciar sesión
2. O borrar `localStorage` en DevTools: `localStorage.clear()`

---

## 📚 Recursos Adicionales

### **Documentación Oficial**
- Express.js: https://expressjs.com
- Mongoose: https://mongoosejs.com
- MongoDB Atlas: https://www.mongodb.com/docs/atlas
- JWT: https://jwt.io
- Vercel: https://vercel.com/docs
- Render: https://render.com/docs

### **Tutoriales Relacionados**
- MERN Stack: https://www.mongodb.com/mern-stack
- REST API Best Practices: https://restfulapi.net
- JWT Authentication: https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs

### **Archivos de Documentación Interna**
- `LOGIN_SYSTEM.md` - Sistema de autenticación detallado
- `ACTUALIZAR_CREDENCIALES.md` - Guía para cambiar credenciales
- `README.md` - Documentación básica del proyecto

---

## 👥 Equipo de Desarrollo

**Universidad:** ESPE (Universidad de las Fuerzas Armadas)  
**Carrera:** Ingeniería de Software  
**Semestre:** Quinto  
**Materia:** Web Avanzada  
**Año:** 2025

---

## 📝 Notas Importantes

### **Para Desarrollo Local:**
1. ✅ Siempre ejecutar backend ANTES de abrir frontend
2. ✅ Usar Live Server para evitar problemas de CORS con `file://`
3. ✅ Verificar que MongoDB Atlas permita tu IP
4. ✅ Mantener `.env` fuera de git (ya está en `.gitignore`)

### **Para Despliegue en Nube:**
1. ✅ Verificar que Render tenga variables de entorno correctas
2. ✅ Esperar 5-10 minutos después de deploy en Render (cold start)
3. ✅ Verificar CORS origins incluyan dominio de Vercel
4. ✅ Probar health check antes de usar la app: `/api/health`

### **Próximas Mejoras (v3.0)**
- [ ] Implementar refresh tokens
- [ ] Agregar autenticación 2FA
- [ ] Implementar chat en tiempo real
- [ ] Sistema de puntos/recompensas
- [ ] Integración con pasarelas de pago
- [ ] App móvil con React Native
- [ ] Panel de analytics avanzado
- [ ] Sistema de notificaciones push
- [ ] Modo offline (PWA)
- [ ] Tests automatizados (Jest, Cypress)

---

**Última actualización:** 11 de noviembre de 2025  
**Versión:** 2.0.0  
**Licencia:** MIT (Uso educativo)

---

## 🎯 Resumen Ejecutivo

Este proyecto es una aplicación web completa de restaurante con sistema de reservaciones, autenticación, panel de administración y gestión de menú. Utiliza arquitectura cliente-servidor con frontend desplegado en Vercel (HTML/CSS/JS), backend en Render (Node.js/Express), y base de datos en MongoDB Atlas. El sistema está optimizado tanto para desarrollo local como para producción en la nube, con configuración automática de URLs según el entorno.

**Stack:** MongoDB + Express + Vanilla JS + Node.js (MERN modificado)  
**Despliegue:** Frontend (Vercel) + Backend (Render) + BD (MongoDB Atlas)  
**Estado:** ✅ Funcional en producción y desarrollo local
