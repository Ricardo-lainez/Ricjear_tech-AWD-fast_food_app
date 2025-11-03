# 🏗️ ARQUITECTURA DEL SISTEMA

## 📊 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                          USUARIO                                │
│                     (Navegador Web)                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP/HTTPS Requests
                         │ (Fetch API)
                         │
        ┌────────────────▼─────────────────┐
        │                                  │
        │         FRONTEND                 │
        │     (HTML + CSS + JS)            │
        │                                  │
        │  ┌────────────────────────┐     │
        │  │  index.html            │     │
        │  │  - Interfaz de usuario │     │
        │  │  - Formularios         │     │
        │  └────────────────────────┘     │
        │                                  │
        │  ┌────────────────────────┐     │
        │  │  api-client.js         │     │
        │  │  - Cliente HTTP        │     │
        │  │  - Manejo de tokens    │     │
        │  └────────────────────────┘     │
        │                                  │
        │  ┌────────────────────────┐     │
        │  │  auth-api.js           │     │
        │  │  - Login/Registro      │     │
        │  │  - Gestión de sesión   │     │
        │  └────────────────────────┘     │
        │                                  │
        └────────────────┬─────────────────┘
                         │
                         │ JSON + JWT Token
                         │
        ┌────────────────▼─────────────────┐
        │                                  │
        │         BACKEND API              │
        │     (Node.js + Express)          │
        │                                  │
        │  ┌────────────────────────┐     │
        │  │  server.js             │     │
        │  │  - Servidor Express    │     │
        │  │  - CORS, Middleware    │     │
        │  └────────────────────────┘     │
        │                                  │
        │  ┌────────────────────────┐     │
        │  │  authRoutes.js         │     │
        │  │  - /api/auth/register  │     │
        │  │  - /api/auth/login     │     │
        │  │  - /api/auth/logout    │     │
        │  │  - /api/auth/me        │     │
        │  └────────────────────────┘     │
        │                                  │
        │  ┌────────────────────────┐     │
        │  │  authController.js     │     │
        │  │  - Lógica de negocio   │     │
        │  │  - Validaciones        │     │
        │  └────────────────────────┘     │
        │                                  │
        │  ┌────────────────────────┐     │
        │  │  auth.js (middleware)  │     │
        │  │  - Verificar JWT       │     │
        │  │  - Proteger rutas      │     │
        │  └────────────────────────┘     │
        │                                  │
        └────────────────┬─────────────────┘
                         │
                         │ Mongoose ODM
                         │
        ┌────────────────▼─────────────────┐
        │                                  │
        │      CAPA DE DATOS               │
        │        (Mongoose)                │
        │                                  │
        │  ┌────────────────────────┐     │
        │  │  User.js (Model)       │     │
        │  │  - Schema de usuario   │     │
        │  │  - Validaciones        │     │
        │  │  - Métodos de instancia│     │
        │  │  - Hash de password    │     │
        │  └────────────────────────┘     │
        │                                  │
        └────────────────┬─────────────────┘
                         │
                         │ MongoDB Protocol
                         │ (Secure Connection)
                         │
        ┌────────────────▼─────────────────┐
        │                                  │
        │      MONGODB ATLAS               │
        │     (Base de Datos Cloud)        │
        │                                  │
        │  📦 Cluster: cluster0            │
        │  📊 Database: bocatto_valley     │
        │                                  │
        │  Collections:                    │
        │  ├─ users                        │
        │  ├─ reservations (futuro)        │
        │  ├─ products (futuro)            │
        │  └─ orders (futuro)              │
        │                                  │
        └──────────────────────────────────┘
```

## 🔐 Flujo de Autenticación

### 1. Registro de Usuario

```
Usuario            Frontend            Backend API         MongoDB Atlas
  │                   │                     │                   │
  │  Llenar form      │                     │                   │
  ├──────────────────>│                     │                   │
  │                   │                     │                   │
  │                   │  POST /api/auth/   │                   │
  │                   │      register       │                   │
  │                   ├────────────────────>│                   │
  │                   │  {userData}         │                   │
  │                   │                     │                   │
  │                   │                     │  Validar datos    │
  │                   │                     │  Hash password    │
  │                   │                     │                   │
  │                   │                     │  CREATE user      │
  │                   │                     ├──────────────────>│
  │                   │                     │                   │
  │                   │                     │  Usuario creado   │
  │                   │                     │<──────────────────┤
  │                   │                     │                   │
  │                   │                     │  Generar JWT      │
  │                   │                     │                   │
  │                   │  {success, token,   │                   │
  │                   │   user}             │                   │
  │                   │<────────────────────┤                   │
  │                   │                     │                   │
  │  Guardar token    │                     │                   │
  │  Redireccionar    │                     │                   │
  │<──────────────────┤                     │                   │
  │                   │                     │                   │
```

### 2. Login de Usuario

```
Usuario            Frontend            Backend API         MongoDB Atlas
  │                   │                     │                   │
  │  Email/Password   │                     │                   │
  ├──────────────────>│                     │                   │
  │                   │                     │                   │
  │                   │  POST /api/auth/   │                   │
  │                   │      login          │                   │
  │                   ├────────────────────>│                   │
  │                   │  {email, password}  │                   │
  │                   │                     │                   │
  │                   │                     │  Buscar usuario   │
  │                   │                     ├──────────────────>│
  │                   │                     │  by email         │
  │                   │                     │                   │
  │                   │                     │  Usuario          │
  │                   │                     │<──────────────────┤
  │                   │                     │                   │
  │                   │                     │  Validar password │
  │                   │                     │  (bcrypt.compare) │
  │                   │                     │                   │
  │                   │                     │  Generar JWT      │
  │                   │                     │                   │
  │                   │  {success, token,   │                   │
  │                   │   user, redirectTo} │                   │
  │                   │<────────────────────┤                   │
  │                   │                     │                   │
  │  Guardar token    │                     │                   │
  │  Redireccionar    │                     │                   │
  │<──────────────────┤                     │                   │
  │                   │                     │                   │
```

### 3. Petición Autenticada

```
Usuario            Frontend            Backend API         MongoDB Atlas
  │                   │                     │                   │
  │  Acción           │                     │                   │
  ├──────────────────>│                     │                   │
  │                   │                     │                   │
  │                   │  GET /api/auth/me   │                   │
  │                   ├────────────────────>│                   │
  │                   │  Authorization:     │                   │
  │                   │  Bearer <token>     │                   │
  │                   │                     │                   │
  │                   │                     │  Verificar JWT    │
  │                   │                     │  Extraer user ID  │
  │                   │                     │                   │
  │                   │                     │  GET user by ID   │
  │                   │                     ├──────────────────>│
  │                   │                     │                   │
  │                   │                     │  Usuario          │
  │                   │                     │<──────────────────┤
  │                   │                     │                   │
  │                   │  {success, user}    │                   │
  │                   │<────────────────────┤                   │
  │                   │                     │                   │
  │  Mostrar datos    │                     │                   │
  │<──────────────────┤                     │                   │
  │                   │                     │                   │
```

## 📁 Estructura de Archivos

```
FastFoodApp/
│
├── 📄 index.html                    # Página principal
├── 📄 INICIO_RAPIDO.md              # Guía de inicio rápido
├── 📄 GUIA_MONGODB_ATLAS.md         # Guía completa
├── 📄 COMANDOS_UTILES.md            # Comandos útiles
├── 📄 start-backend.ps1             # Script de inicio
│
├── 📂 backend/                      # API Backend
│   ├── 📂 config/
│   │   └── database.js              # Conexión MongoDB
│   │
│   ├── 📂 controllers/
│   │   └── authController.js        # Lógica de autenticación
│   │
│   ├── 📂 database/
│   │   └── seed.js                  # Datos iniciales
│   │
│   ├── 📂 middleware/
│   │   └── auth.js                  # Middleware de auth
│   │
│   ├── 📂 models/
│   │   └── User.js                  # Modelo de usuario
│   │
│   ├── 📂 routes/
│   │   └── authRoutes.js            # Rutas API
│   │
│   ├── 📂 utils/
│   │   └── jwt.js                   # Utilidades JWT
│   │
│   ├── 📄 .env                      # ⚠️ Variables de entorno
│   ├── 📄 .env.example              # Ejemplo de .env
│   ├── 📄 .gitignore                # Archivos ignorados
│   ├── 📄 package.json              # Dependencias
│   ├── 📄 server.js                 # Servidor principal
│   └── 📄 README.md                 # Docs del backend
│
├── 📂 js/
│   ├── api-client.js                # Cliente HTTP
│   ├── auth-api.js                  # Auth con API (NUEVO)
│   ├── auth.js                      # Auth local (ANTIGUO)
│   ├── login-modal.js               # Modal de login
│   ├── register-modal.js            # Modal de registro
│   └── ...                          # Otros scripts
│
├── 📂 html/                         # Páginas HTML
├── 📂 styles/                       # Estilos CSS
└── 📂 images/                       # Imágenes
```

## 🔄 Tecnologías y Versiones

| Capa | Tecnología | Versión | Propósito |
|------|------------|---------|-----------|
| **Frontend** | HTML5/CSS3/JS | ES6+ | Interfaz de usuario |
| **Frontend** | Fetch API | Nativo | Peticiones HTTP |
| **Backend** | Node.js | 18+ | Runtime JavaScript |
| **Backend** | Express | 4.18+ | Framework web |
| **Backend** | Mongoose | 8.0+ | ODM para MongoDB |
| **Seguridad** | bcryptjs | 2.4+ | Hash de passwords |
| **Auth** | jsonwebtoken | 9.0+ | Tokens JWT |
| **DB** | MongoDB Atlas | Cloud | Base de datos |

## 🛡️ Capas de Seguridad

```
┌──────────────────────────────────────┐
│  1. HTTPS (en producción)            │ ← Encriptación en tránsito
├──────────────────────────────────────┤
│  2. CORS                             │ ← Solo dominios permitidos
├──────────────────────────────────────┤
│  3. JWT Tokens                       │ ← Autenticación stateless
├──────────────────────────────────────┤
│  4. bcrypt Password Hash             │ ← Passwords nunca en texto plano
├──────────────────────────────────────┤
│  5. Mongoose Validations             │ ← Validación de datos
├──────────────────────────────────────┤
│  6. MongoDB Atlas Network Access     │ ← IP Whitelist
├──────────────────────────────────────┤
│  7. Environment Variables (.env)     │ ← Secrets no en código
└──────────────────────────────────────┘
```

## 📊 Modelo de Datos (UML Simplificado)

```
┌─────────────────────┐
│       User          │
├─────────────────────┤
│ -id: ObjectId       │
│ -firstName: String  │
│ -lastName: String   │
│ -email: String      │
│ -password: String   │
│ -phone: String      │
│ -address: String    │
│ -registrationDate   │
│ -isActive: Boolean  │
│ -role: String       │ ◄──┐
├─────────────────────┤    │ Discriminador
│ +login()            │    │
│ +validateCreds()    │    │
│ +changePassword()   │    │
│ +updateProfile()    │    │
└─────────────────────┘    │
         ▲                 │
         │                 │
    ┌────┴────┐            │
    │         │            │
┌───┴───┐ ┌──┴────┐       │
│Client │ │ Admin │       │
├───────┤ ├───────┤       │
│-loyal │ │-acceso│◄──────┘
│Points │ │-admin │
│-prefe │ │Acceso │
│rences │ │       │
└───────┘ └───────┘
```

## 🌐 Endpoints API

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Registrar usuario |
| POST | `/api/auth/login` | No | Iniciar sesión |
| POST | `/api/auth/logout` | Sí | Cerrar sesión |
| GET | `/api/auth/me` | Sí | Obtener usuario actual |
| PUT | `/api/auth/update-profile` | Sí | Actualizar perfil |
| PUT | `/api/auth/change-password` | Sí | Cambiar contraseña |
| GET | `/api/auth/users` | Admin | Listar usuarios |
| GET | `/api/auth/statistics` | Admin | Estadísticas |

## 🚀 Flujo de Despliegue

```
Desarrollo Local                Cloud
     │                            │
     │   1. Código               │
     ├──────────────────────────>│
     │   Git Push                │
     │                            │
     │                      ┌─────▼─────┐
     │                      │  GitHub   │
     │                      └─────┬─────┘
     │                            │
     │                   ┌────────┴────────┐
     │                   │                 │
     │              ┌────▼────┐      ┌────▼────┐
     │              │ Netlify │      │ Render  │
     │              │Frontend │      │ Backend │
     │              └────┬────┘      └────┬────┘
     │                   │                │
     │                   │                │
     │                   │           ┌────▼────────┐
     │                   │           │ MongoDB     │
     │                   │           │ Atlas       │
     │                   │           └─────────────┘
     │                   │
     ▼                   ▼
   Usuario       https://tu-app.netlify.app
                        │
                        │ API Calls
                        │
                 https://tu-api.onrender.com
```

---

**Documentación completa en:** `GUIA_MONGODB_ATLAS.md`
