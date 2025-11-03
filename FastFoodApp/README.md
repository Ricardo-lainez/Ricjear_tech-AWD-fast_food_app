# 🍔 Bocatto Valley - Fast Food Application

**Proyecto de Programación Web Avanzada**  
Universidad de las Fuerzas Armadas ESPE - Quinto Semestre Ing. Software

---

## 📌 Descripción del Proyecto

Bocatto Valley es una aplicación web completa para un restaurante de comida rápida que incluye:

- 🏠 **Sitio Web Público:** Menú, reservaciones, ubicaciones, contacto
- 👨‍💼 **Panel de Administración:** Gestión de productos, pedidos, usuarios
- 🔐 **Sistema de Autenticación:** Login/Registro con roles (Admin/Cliente)
- 🗄️ **Base de Datos Cloud:** MongoDB Atlas
- 🚀 **API REST:** Backend con Node.js + Express

---

## 🛠️ Stack Tecnológico

### Frontend
- HTML5
- CSS3 (Responsive Design)
- JavaScript Vanilla (ES6+)
- Live Server

### Backend
- Node.js (v18+)
- Express.js
- Mongoose (ODM)
- JSON Web Tokens (JWT)
- bcryptjs (Hashing de contraseñas)

### Base de Datos
- MongoDB Atlas (Cloud)
- 3 colecciones principales:
  - `users` (Administradores y Clientes)
  - `reservations` (Reservaciones)
  - `orders` (Pedidos)

---

## 🚀 Inicio Rápido para el Equipo

### 1️⃣ Pre-requisitos

- [Node.js](https://nodejs.org/) v18 o superior
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
- Extensión: Live Server

### 2️⃣ Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Ricardo-lainez/Ricjear_tech-AWD-fast_food_app.git

# Navegar al proyecto
cd Ricjear_tech-AWD-fast_food_app/FastFoodApp

# Instalar dependencias del backend
cd backend
npm install

# Configurar variables de entorno
copy .env.example .env

# Poblar base de datos (solo primera vez)
npm run seed

# Iniciar servidor
npm start
```

### 3️⃣ Abrir Frontend

1. Abre `index.html` en VS Code
2. Click derecho → **"Open with Live Server"**
3. Navega a: http://127.0.0.1:5500

---

## 📚 Documentación Completa

### Para Miembros del Equipo

| Archivo | Descripción |
|---------|-------------|
| **[GUIA_INSTALACION_EQUIPO.md](./GUIA_INSTALACION_EQUIPO.md)** | 📖 **LEE ESTO PRIMERO** - Guía completa de instalación |
| [CREDENCIALES_EQUIPO.md](./CREDENCIALES_EQUIPO.md) | 🔐 Credenciales de MongoDB y usuarios |
| [backend/.env.example](./backend/.env.example) | ⚙️ Ejemplo de configuración |

### Documentación Técnica

| Archivo | Descripción |
|---------|-------------|
| [ARQUITECTURA.md](./ARQUITECTURA.md) | 🏗️ Arquitectura del sistema |
| [LIMPIEZA_COMPLETA.md](./LIMPIEZA_COMPLETA.md) | 🧹 Limpieza de código obsoleto |
| [FIX_LOGOUT_DOBLE.md](./FIX_LOGOUT_DOBLE.md) | 🐛 Fix del bug de logout doble |
| [PRUEBA_NAVEGACION_ADMIN.md](./PRUEBA_NAVEGACION_ADMIN.md) | 🧪 Pruebas de navegación admin |

---

## 🎯 Funcionalidades Principales

### Sitio Público
- ✅ Página de inicio con slider
- ✅ Menú de productos (categorías: entradas, principales, bebidas, postres)
- ✅ Sistema de reservaciones
- ✅ Formulario de contacto
- ✅ Ubicaciones del restaurante
- ✅ Ofertas y promociones
- ✅ Quiénes somos

### Autenticación
- ✅ Login con validación
- ✅ Registro de clientes
- ✅ Logout con un solo click
- ✅ Sesiones persistentes (7 días)
- ✅ Protección de rutas por rol

### Panel de Administración
- ✅ Dashboard con estadísticas
- ✅ Gestión de usuarios
- ✅ Gestión de productos
- ✅ Visualización de pedidos
- ✅ Reportes y analytics

---

## 👥 Equipo de Desarrollo

**Ricjear Tech**

- **Ricardo** - [GitHub](https://github.com/Ricardo-lainez)
- **Jeancarlo** - Backend Lead
- **Otros miembros** - (Agregar aquí)

---

## 🔐 Credenciales de Prueba

### Administrador
```
Email: admin@adminbocatto.com
Password: adminPass123
```

### Cliente
```
Email: cliente@bocatto.com
Password: cliente123
```

> **Nota:** Ver [CREDENCIALES_EQUIPO.md](./CREDENCIALES_EQUIPO.md) para más detalles.

---

## 📁 Estructura del Proyecto

```
FastFoodApp/
├── backend/                 # Servidor Node.js + API
│   ├── config/             # Configuración (DB, etc.)
│   ├── controllers/        # Lógica de negocio
│   ├── database/           # Seeds y migraciones
│   ├── middleware/         # Auth, validaciones
│   ├── models/             # Esquemas Mongoose
│   ├── routes/             # Rutas de la API
│   ├── utils/              # Utilidades
│   ├── server.js           # Punto de entrada
│   ├── package.json        # Dependencias
│   └── .env.example        # Ejemplo de variables
│
├── html/                   # Páginas HTML
│   ├── AdminProfile.html   # Panel admin
│   ├── menu.html          # Menú de productos
│   ├── reservaciones.html  # Sistema de reservas
│   └── ...
│
├── js/                     # JavaScript del frontend
│   ├── api-client.js      # Cliente HTTP
│   ├── auth-api.js        # Autenticación
│   ├── login-modal.js     # Modal de login
│   ├── AdminProfile.js    # Lógica del panel admin
│   └── ...
│
├── styles/                 # CSS
├── images/                 # Imágenes y assets
├── index.html             # Página principal
└── README.md              # Este archivo
```

---

## 🌐 URLs de Desarrollo

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://127.0.0.1:5500 | Live Server |
| **Backend API** | http://localhost:3000/api | Endpoints REST |
| **Health Check** | http://localhost:3000 | Estado del servidor |
| **MongoDB** | Atlas Cloud | Base de datos |

---

## 🔄 Flujo de Trabajo Git

### Comandos Básicos

```bash
# Actualizar tu código
git pull origin jean

# Ver cambios
git status

# Agregar archivos
git add .

# Commit
git commit -m "feat: descripción del cambio"

# Subir cambios
git push origin jean
```

### Convención de Commits

```
feat:     Nueva funcionalidad
fix:      Corrección de bug
style:    Cambios de CSS/estilos
refactor: Refactorización de código
docs:     Documentación
test:     Tests
```

**Ejemplos:**
```bash
git commit -m "feat: Agregar filtro de categorías en menú"
git commit -m "fix: Corregir validación en formulario de reservas"
git commit -m "style: Mejorar responsive en AdminProfile"
```

---

## 🧪 Testing

### Verificar que todo funciona:

1. **Backend:**
   ```bash
   cd backend
   npm start
   ```
   Abre: http://localhost:3000 (debe mostrar JSON con status)

2. **Frontend:**
   - Abre `index.html` con Live Server
   - Navega a http://127.0.0.1:5500

3. **Login:**
   - Click en "Ingresar"
   - Usa credenciales de admin
   - Debe redirigir a AdminProfile.html

4. **Base de Datos:**
   - Login exitoso confirma conexión a MongoDB

---

## 🐛 Solución de Problemas Comunes

### Error: Puerto 3000 en uso
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Error: MongoDB no conecta
1. Verifica que `.env` tenga la URI correcta
2. Revisa que tu IP esté en la whitelist de MongoDB Atlas
3. Verifica credenciales (usuario/password)

### Error: CORS
- Verifica que Live Server esté en puerto 5500
- O agrega tu puerto a `CORS_ORIGIN` en `.env`

> **Más ayuda:** Ver [GUIA_INSTALACION_EQUIPO.md](./GUIA_INSTALACION_EQUIPO.md) sección "Solución de Problemas"

---

## 📦 Scripts Disponibles

```bash
# Iniciar servidor
npm start

# Modo desarrollo (auto-reload)
npm run dev

# Poblar/resetear base de datos
npm run seed

# Eliminar datos de BD
npm run seed -- -d
```

---

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Autenticación JWT
- ✅ Variables de entorno (.env)
- ✅ CORS configurado
- ✅ Validación de inputs
- ✅ Protección de rutas por rol

**IMPORTANTE:**
- ❌ NUNCA subir `.env` a Git
- ❌ NUNCA hardcodear credenciales
- ✅ SIEMPRE usar variables de entorno

---

## 📈 Estado del Proyecto

- ✅ **Backend:** Completamente funcional
- ✅ **Autenticación:** Sistema completo con JWT
- ✅ **Base de Datos:** MongoDB Atlas configurado
- ✅ **Frontend:** Estructura base completa
- 🚧 **Panel Admin:** En desarrollo
- 🚧 **Reservaciones:** En desarrollo
- 🚧 **Pedidos:** Pendiente

---

## 📞 Soporte

**Canales de comunicación del equipo:**
- GitHub Issues (para bugs/features)
- WhatsApp/Discord (para coordinación)

**Recursos:**
1. Lee primero: [GUIA_INSTALACION_EQUIPO.md](./GUIA_INSTALACION_EQUIPO.md)
2. Revisa: Sección de Solución de Problemas
3. Pregunta en el grupo del equipo

---

## 📄 Licencia

Proyecto académico - Universidad de las Fuerzas Armadas ESPE  
Quinto Semestre - Ingeniería en Software  
Materia: Programación Web Avanzada

---

## 🎓 Institución

**Universidad de las Fuerzas Armadas ESPE**  
Departamento de Ciencias de la Computación  
Ingeniería en Software  
2025

---

**¿Nuevo en el equipo? 👉 Empieza por [GUIA_INSTALACION_EQUIPO.md](./GUIA_INSTALACION_EQUIPO.md)**