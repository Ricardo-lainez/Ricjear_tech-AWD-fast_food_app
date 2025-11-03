# 🍔 Bocatto Valley - Backend API

Backend API para el sistema de Fast Food con autenticación, gestión de usuarios y conexión a MongoDB Atlas.

## 📋 Tabla de Contenidos

- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Configuración de MongoDB Atlas](#configuración-de-mongodb-atlas)
- [Variables de Entorno](#variables-de-entorno)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Despliegue](#despliegue)

## 🛠️ Tecnologías

- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **MongoDB Atlas** - Base de datos en la nube
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación con tokens
- **bcryptjs** - Hash de contraseñas

## 📦 Instalación

### 1. Requisitos previos

- Node.js 18+ instalado
- Cuenta en MongoDB Atlas (gratuita)
- Git

### 2. Clonar e instalar dependencias

```powershell
# Navegar a la carpeta backend
cd backend

# Instalar dependencias
npm install
```

## 🗄️ Configuración de MongoDB Atlas

### Paso 1: Crear cuenta y cluster

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Crea una cuenta gratuita (o inicia sesión)
3. Crea un nuevo proyecto llamado "Bocatto Valley"
4. Crea un cluster gratuito (M0):
   - Provider: AWS, Google Cloud o Azure
   - Region: Elige la más cercana a ti
   - Cluster Name: `Cluster0` (o el nombre que prefieras)

### Paso 2: Configurar seguridad

#### A. Database Access (Usuario)

1. Ve a **Security > Database Access**
2. Click en **Add New Database User**
3. Elige **Password** como método de autenticación
4. Usuario: `bocatto_user` (o el que prefieras)
5. Contraseña: Genera una segura o crea una personalizada
6. **¡GUARDA ESTA CONTRASEÑA!** La necesitarás después
7. Database User Privileges: `Atlas admin` o `Read and write to any database`
8. Click en **Add User**

#### B. Network Access (IP Whitelist)

1. Ve a **Security > Network Access**
2. Click en **Add IP Address**
3. Para desarrollo local:
   - Click en **Allow Access from Anywhere**
   - Esto agregará `0.0.0.0/0`
4. Para producción:
   - Agrega solo las IPs de tu servidor
5. Click en **Confirm**

### Paso 3: Obtener URI de conexión

1. Ve a **Deployment > Database**
2. Click en **Connect** en tu cluster
3. Selecciona **Connect your application**
4. Driver: **Node.js**
5. Version: **5.5 or later**
6. Copia la cadena de conexión, se verá así:

```
mongodb+srv://bocatto_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Paso 4: Configurar .env

1. Copia el archivo `.env.example` a `.env`:

```powershell
cp .env.example .env
```

2. Abre `.env` y modifica la URI:

```env
MONGODB_URI=mongodb+srv://bocatto_user:TU_CONTRASEÑA_REAL@cluster0.xxxxx.mongodb.net/bocatto_valley?retryWrites=true&w=majority
```

**Importante:** Reemplaza:
- `bocatto_user` con tu nombre de usuario
- `TU_CONTRASEÑA_REAL` con la contraseña que guardaste
- `cluster0.xxxxx` con tu cluster real
- Agrega `/bocatto_valley` después del `.net/` para especificar la base de datos

3. Genera claves secretas para JWT:

```powershell
# En Node.js REPL
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copia el resultado y pégalo en `JWT_SECRET` en tu `.env`

## ⚙️ Variables de Entorno

Tu archivo `.env` debe verse así:

```env
# MongoDB
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster0.xxxxx.mongodb.net/bocatto_valley?retryWrites=true&w=majority

# Servidor
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=tu_clave_secreta_generada_aqui
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:5500
CORS_ORIGIN=http://localhost:5500,http://127.0.0.1:5500

# Cookies
COOKIE_SECRET=otra_clave_secreta
```

## 🚀 Ejecución

### 1. Poblar base de datos (primera vez)

```powershell
npm run seed
```

Esto creará usuarios de prueba:
- **Admin:** admin@adminbocatto.com / adminPass123
- **Cliente:** cliente@bocatto.com / cliente123

### 2. Iniciar servidor

```powershell
# Modo producción
npm start

# Modo desarrollo (con nodemon - auto-reinicio)
npm run dev
```

Deberías ver:

```
========================================
✅ MongoDB Atlas Conectado Exitosamente
========================================
🚀 SERVIDOR INICIADO CORRECTAMENTE
========================================
```

### 3. Verificar funcionamiento

Abre tu navegador en: http://localhost:3000

Deberías ver:
```json
{
  "success": true,
  "message": "🍔 Bienvenido a Bocatto Valley API",
  "version": "1.0.0"
}
```

## 📁 Estructura del Proyecto

```
backend/
├── config/
│   └── database.js          # Configuración de MongoDB
├── controllers/
│   └── authController.js    # Lógica de autenticación
├── database/
│   └── seed.js             # Poblar DB con datos iniciales
├── middleware/
│   └── auth.js             # Middleware de autenticación
├── models/
│   └── User.js             # Modelo de usuario (UML)
├── routes/
│   └── authRoutes.js       # Rutas de autenticación
├── utils/
│   └── jwt.js              # Utilidades JWT
├── .env                    # Variables de entorno (NO subir a Git)
├── .env.example            # Ejemplo de variables
├── .gitignore              # Archivos ignorados por Git
├── package.json            # Dependencias
├── README.md               # Este archivo
└── server.js               # Servidor principal
```

## 🔌 API Endpoints

### Autenticación (Públicos)

#### Registro
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "password": "123456",
  "phone": "0987654321",
  "address": "Quito, Ecuador"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@adminbocatto.com",
  "password": "adminPass123"
}
```

### Usuario Autenticado (Privados)

#### Obtener usuario actual
```http
GET /api/auth/me
Authorization: Bearer {token}
```

#### Actualizar perfil
```http
PUT /api/auth/update-profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "Juan Carlos",
  "phone": "0999999999"
}
```

#### Cambiar contraseña
```http
PUT /api/auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "123456",
  "newPassword": "newpass123"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

### Administrador (Requieren rol admin)

#### Obtener todos los usuarios
```http
GET /api/auth/users
Authorization: Bearer {token}
```

#### Estadísticas de usuarios
```http
GET /api/auth/statistics
Authorization: Bearer {token}
```

## 🌐 Despliegue a la Nube

### Opción 1: Render.com (Recomendado)

1. Ve a [Render.com](https://render.com)
2. Crea una cuenta y conecta tu GitHub
3. Click en **New +** > **Web Service**
4. Conecta tu repositorio
5. Configuración:
   - **Name:** bocatto-valley-api
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
6. En **Environment Variables**, agrega:
   ```
   MONGODB_URI=tu_uri_de_mongodb_atlas
   JWT_SECRET=tu_jwt_secret
   NODE_ENV=production
   FRONTEND_URL=https://tu-frontend.netlify.app
   ```
7. Click en **Create Web Service**

### Opción 2: Railway.app

1. Ve a [Railway.app](https://railway.app)
2. Conecta con GitHub
3. **New Project** > **Deploy from GitHub repo**
4. Selecciona tu repositorio
5. Agrega variables de entorno
6. Despliega

### Opción 3: Fly.io

1. Instala Fly CLI: https://fly.io/docs/hands-on/install-flyctl/
2. En la carpeta backend:
```powershell
fly launch
fly secrets set MONGODB_URI="tu_uri"
fly secrets set JWT_SECRET="tu_secret"
fly deploy
```

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ JWT para autenticación
- ✅ HTTP-only cookies
- ✅ CORS configurado
- ✅ Validación de datos
- ✅ Variables de entorno seguras

## 🐛 Troubleshooting

### Error: "MongoServerError: bad auth"
- Verifica que usuario y contraseña sean correctos
- Asegúrate de haber creado el usuario en Database Access

### Error: "Connection timeout"
- Verifica que tu IP esté en Network Access
- Comprueba tu conexión a internet
- Revisa que el URI sea correcto

### Error: "Cannot find module"
- Ejecuta `npm install` nuevamente
- Verifica que estés usando Node.js 18+

## 📞 Soporte

Para problemas o preguntas:
- Revisa la [documentación de MongoDB Atlas](https://docs.atlas.mongodb.com/)
- Consulta los logs del servidor
- Verifica las variables de entorno

---

**Desarrollado por Ricjear Tech** 🚀
