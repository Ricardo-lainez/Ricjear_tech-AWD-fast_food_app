# 🚀 GUÍA DE INSTALACIÓN PARA EL EQUIPO

## 📋 Índice
1. [Pre-requisitos](#pre-requisitos)
2. [Instalación Inicial](#instalación-inicial)
3. [Configuración del Backend](#configuración-del-backend)
4. [Ejecutar el Proyecto](#ejecutar-el-proyecto)
5. [Flujo de Trabajo Git](#flujo-de-trabajo-git)
6. [Solución de Problemas](#solución-de-problemas)

---

## 📌 Pre-requisitos

Antes de empezar, asegúrate de tener instalado:

### 1. Node.js (v18 o superior)
**Verificar si está instalado:**
```bash
node --version
```
Debe mostrar algo como: `v18.x.x` o superior

**Si no está instalado:**
- Descargar de: https://nodejs.org/
- Instalar la versión LTS (Long Term Support)

### 2. Git
**Verificar si está instalado:**
```bash
git --version
```

**Si no está instalado:**
- Descargar de: https://git-scm.com/

### 3. Visual Studio Code
**Recomendado con las siguientes extensiones:**
- Live Server (Ritwick Dey)
- ESLint
- Prettier
- Git Graph (opcional, útil para ver el historial)

### 4. MongoDB Compass (Opcional)
- Para visualizar la base de datos
- Descargar de: https://www.mongodb.com/try/download/compass

---

## 🔧 Instalación Inicial

### Paso 1: Clonar el Repositorio

```bash
# Navegar a tu carpeta de proyectos
cd "C:\Users\TU_USUARIO\Desktop\Universidad ESPE\Quinto Semestre Ing.Software\Web Avanzada\Proyecto"

# Clonar el repositorio
git clone https://github.com/Ricardo-lainez/Ricjear_tech-AWD-fast_food_app.git

# Entrar a la carpeta del proyecto
cd Ricjear_tech-AWD-fast_food_app\FastFoodApp
```

### Paso 2: Verificar la Estructura

Deberías ver esta estructura:
```
FastFoodApp/
├── backend/              ← Servidor Node.js + API
│   ├── config/
│   ├── controllers/
│   ├── database/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js         ← Archivo principal del servidor
│   ├── package.json      ← Dependencias del backend
│   └── .env.example      ← Ejemplo de configuración
├── html/                 ← Páginas HTML
├── js/                   ← JavaScript del frontend
├── styles/               ← CSS
├── images/               ← Imágenes
├── index.html            ← Página principal
└── README.md
```

---

## ⚙️ Configuración del Backend

### Paso 1: Instalar Dependencias

```bash
# Navegar a la carpeta backend
cd backend

# Instalar todas las dependencias
npm install
```

**Esto instalará:**
- Express (servidor web)
- Mongoose (ODM para MongoDB)
- bcryptjs (hash de contraseñas)
- jsonwebtoken (autenticación)
- cors (comunicación frontend-backend)
- dotenv (variables de entorno)
- Y más...

**Resultado esperado:**
```
added 140 packages
✓ 0 vulnerabilities
```

### Paso 2: Configurar Variables de Entorno

**Opción A: Usar las credenciales compartidas del equipo**

1. **Copia el archivo de ejemplo:**
   ```bash
   copy .env.example .env
   ```

2. **El archivo `.env` ya está configurado con las credenciales compartidas:**
   ```properties
   MONGODB_URI=mongodb+srv://jeancarlo:jean12345@cluster0.3ixvnnj.mongodb.net/FastFoodApp
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=bocatto_valley_secret_key_2024
   ```

3. **¡Listo!** No necesitas cambiar nada si usarás la base de datos compartida.

**Opción B: Crear tu propia base de datos MongoDB Atlas (opcional)**

<details>
<summary>Click aquí para ver cómo crear tu propia DB</summary>

1. Ve a https://www.mongodb.com/cloud/atlas
2. Crea una cuenta gratuita
3. Crea un nuevo cluster (tier gratuito)
4. Crea un usuario de base de datos
5. Agrega tu IP a la whitelist (o permite 0.0.0.0/0 para desarrollo)
6. Obtén la URI de conexión
7. Reemplaza `MONGODB_URI` en el archivo `.env`

</details>

### Paso 3: Poblar la Base de Datos (Solo la primera vez)

**Solo UNA persona del equipo debe hacer esto, o todos tendrán que hacerlo si usan DBs separadas**

```bash
# Estando en la carpeta backend
npm run seed
```

**Resultado esperado:**
```
========================================
✅ 3 usuarios creados exitosamente
========================================

👤 Admin Bocatto
   📧 Email: admin@adminbocatto.com
   🔑 Rol: administrator
   🆔 ID: 6904d9703a86fdfdd14a5c90

👤 Cliente Demo
   📧 Email: cliente@bocatto.com
   🔑 Rol: client

👤 Juan Pérez
   📧 Email: juan.perez@example.com
   🔑 Rol: client
========================================
```

---

## 🚀 Ejecutar el Proyecto

### Backend (Servidor Node.js)

**Terminal 1: Iniciar el servidor backend**

```bash
# Navegar a la carpeta backend
cd backend

# Iniciar el servidor
npm start
```

**O con auto-reload (recomendado durante desarrollo):**
```bash
npm run dev
```

**Resultado esperado:**
```
========================================
🚀 SERVIDOR INICIADO CORRECTAMENTE
========================================
📍 Entorno: development
🌐 Puerto: 3000
🔗 URL: http://localhost:3000
📡 API: http://localhost:3000/api
========================================

========================================
✅ MongoDB Atlas Conectado Exitosamente
========================================
📍 Host: cluster0.3ixvnnj.mongodb.net
📊 Base de Datos: FastFoodApp
🔗 Puerto: 27017
📡 Estado: Conectado
========================================
```

⚠️ **IMPORTANTE:** Mantén esta terminal abierta mientras trabajas.

### Frontend (Live Server)

**En VS Code:**

1. Abre el archivo `index.html`
2. Click derecho → **"Open with Live Server"**
3. Se abrirá en `http://127.0.0.1:5500`

**O desde la terminal:**
```bash
# Instalar Live Server globalmente (solo una vez)
npm install -g live-server

# Ejecutar desde la raíz del proyecto
live-server --port=5500
```

---

## 🔄 Flujo de Trabajo Git

### Configuración Inicial

```bash
# Configurar tu nombre y email (solo la primera vez)
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@espe.edu.ec"
```

### Antes de Empezar a Trabajar

```bash
# 1. Asegúrate de estar en la rama correcta
git branch

# 2. Actualizar tu rama con los últimos cambios
git pull origin jean
```

### Durante el Desarrollo

```bash
# Ver qué archivos has modificado
git status

# Agregar archivos modificados
git add .

# O agregar archivos específicos
git add js/auth-api.js
git add styles/stylesMenu.css

# Hacer commit con mensaje descriptivo
git commit -m "feat: Agregar validación de formulario de reservas"

# Subir cambios a GitHub
git push origin jean
```

### Mensajes de Commit Recomendados

**Formato:** `tipo: descripción corta`

**Tipos:**
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `style:` Cambios de estilo/CSS
- `refactor:` Refactorización de código
- `docs:` Documentación
- `test:` Tests

**Ejemplos:**
```bash
git commit -m "feat: Agregar página de ubicaciones"
git commit -m "fix: Corregir logout doble en AdminProfile"
git commit -m "style: Mejorar responsive en menu.html"
git commit -m "refactor: Limpiar código de auth-api.js"
git commit -m "docs: Actualizar README con instrucciones"
```

### Resolver Conflictos

Si aparece un conflicto al hacer `git pull`:

```bash
# 1. Ver qué archivos tienen conflicto
git status

# 2. Abrir los archivos en VS Code
# Busca las marcas: <<<<<<< HEAD, =======, >>>>>>> origin/jean

# 3. Edita el archivo manualmente para resolver el conflicto

# 4. Una vez resuelto:
git add archivo-resuelto.js
git commit -m "merge: Resolver conflicto en archivo-resuelto.js"
git push origin jean
```

---

## 🧪 Verificar que Todo Funciona

### 1. Backend Funcionando

Abre en el navegador: http://localhost:3000

Deberías ver:
```json
{
  "success": true,
  "message": "Bocatto Valley API v1.0.0",
  "status": "running"
}
```

### 2. Frontend Funcionando

Abre: http://127.0.0.1:5500

Deberías ver la página principal de Bocatto Valley.

### 3. Login Funcionando

1. Click en **"Ingresar"**
2. Usar credenciales de admin:
   ```
   Email: admin@adminbocatto.com
   Password: adminPass123
   ```
3. Debería redirigir a `AdminProfile.html`
4. Deberías ver: "¡Bienvenido, Admin!"

### 4. Base de Datos Funcionando

**Opción A: Desde la aplicación**
- Login exitoso confirma que MongoDB funciona

**Opción B: MongoDB Compass**
1. Abre MongoDB Compass
2. Conecta con la URI:
   ```
   mongodb+srv://jeancarlo:jean12345@cluster0.3ixvnnj.mongodb.net/
   ```
3. Deberías ver la base de datos `FastFoodApp`
4. Dentro: colección `users` con 3 usuarios

---

## 🐛 Solución de Problemas

### Problema 1: `npm install` falla

**Error:** `npm ERR! code ENOENT`

**Solución:**
```bash
# Asegúrate de estar en la carpeta backend
cd backend

# Verifica que existe package.json
ls package.json

# Intenta de nuevo
npm install
```

---

### Problema 2: Puerto 3000 ya está en uso

**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solución Windows:**
```bash
# Encontrar qué proceso usa el puerto 3000
netstat -ano | findstr :3000

# Matar el proceso (reemplaza PID con el número que te dio)
taskkill /PID <PID> /F

# O cambiar el puerto en .env
PORT=3001
```

**Solución Mac/Linux:**
```bash
# Matar proceso en puerto 3000
lsof -ti:3000 | xargs kill -9
```

---

### Problema 3: No se conecta a MongoDB

**Error:** `MongoServerError: bad auth`

**Causas posibles:**
1. **Credenciales incorrectas** en `.env`
   - Verifica usuario y password
   - No debe tener espacios extras

2. **IP no está en whitelist de MongoDB Atlas**
   - Ve a MongoDB Atlas → Network Access
   - Agrega tu IP o permite `0.0.0.0/0` (solo para desarrollo)

3. **URI mal formateada**
   - Debe tener formato: `mongodb+srv://usuario:password@cluster.mongodb.net/database`

**Solución:**
```bash
# Verifica el archivo .env
cat .env

# Debe tener:
MONGODB_URI=mongodb+srv://jeancarlo:jean12345@cluster0.3ixvnnj.mongodb.net/FastFoodApp?retryWrites=true&w=majority&appName=Cluster0
```

---

### Problema 4: Live Server no funciona

**Solución:**
1. **Instalar la extensión:**
   - VS Code → Extensions → Buscar "Live Server"
   - Instalar (Ritwick Dey)

2. **Usar puerto correcto:**
   - Debe ser puerto 5500 (configurado en CORS del backend)

3. **Alternativa - HTTP Server:**
   ```bash
   npm install -g http-server
   cd FastFoodApp
   http-server -p 5500
   ```

---

### Problema 5: CORS Error en el navegador

**Error en consola:**
```
Access to fetch at 'http://localhost:3000/api/auth/login' from origin 'http://127.0.0.1:5501' has been blocked by CORS policy
```

**Causa:** Frontend corriendo en puerto diferente al 5500

**Solución:**
1. **Cambiar puerto de Live Server a 5500**
   - VS Code → Settings → Buscar "Live Server"
   - Cambiar port a 5500

2. **O agregar tu puerto al backend .env:**
   ```properties
   CORS_ORIGIN=http://localhost:5500,http://127.0.0.1:5500,http://127.0.0.1:5501
   ```

---

### Problema 6: Git push rechazado

**Error:** `! [rejected] jean -> jean (fetch first)`

**Solución:**
```bash
# Primero traer los cambios remotos
git pull origin jean

# Si hay conflictos, resolverlos

# Luego subir tus cambios
git push origin jean
```

---

### Problema 7: `module not found` en Node

**Error:** `Error: Cannot find module 'express'`

**Solución:**
```bash
# Reinstalar dependencias
cd backend
rm -rf node_modules
npm install
```

---

## 📚 Recursos Útiles

### Documentación
- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [MongoDB Atlas](https://www.mongodb.com/docs/atlas/)
- [Git](https://git-scm.com/doc)

### Comandos Rápidos

```bash
# Ver estado de Git
git status

# Ver ramas
git branch

# Cambiar de rama
git checkout nombre-rama

# Ver logs
git log --oneline

# Ver cambios no commiteados
git diff

# Descartar cambios en un archivo
git checkout -- archivo.js

# Ver qué está corriendo en puertos
netstat -ano | findstr :3000
netstat -ano | findstr :5500
```

---

## 👥 Coordinación del Equipo

### Roles Sugeridos

1. **Backend Lead:** Maneja server.js, modelos, controladores
2. **Frontend Lead:** Coordina HTML, CSS, JavaScript
3. **Database Lead:** Maneja seed.js, schemas, migraciones
4. **Git Master:** Resuelve conflictos, mantiene repositorio limpio

### Comunicación

**Antes de trabajar en un archivo:**
1. Avisar en el grupo
2. Hacer `git pull` para tener última versión
3. Trabajar en tu copia
4. Hacer commit y push rápido
5. Avisar que terminaste

**Para evitar conflictos:**
- No editen el mismo archivo simultáneamente
- Hagan commits pequeños y frecuentes
- Usen ramas si van a trabajar en features grandes

---

## ✅ Checklist de Instalación

Marca cada paso conforme lo completes:

### Instalación Base
- [ ] Node.js instalado (v18+)
- [ ] Git instalado
- [ ] VS Code instalado
- [ ] Live Server extension instalada

### Configuración del Proyecto
- [ ] Repositorio clonado
- [ ] `cd backend && npm install` ejecutado exitosamente
- [ ] Archivo `.env` creado (copiado de `.env.example`)
- [ ] Variables de entorno configuradas

### Primera Ejecución
- [ ] `npm run seed` ejecutado (base de datos poblada)
- [ ] `npm start` ejecuta sin errores
- [ ] Servidor backend corre en http://localhost:3000
- [ ] Frontend abre con Live Server en http://127.0.0.1:5500
- [ ] Login funciona correctamente

### Git
- [ ] `git config` configurado con tu nombre y email
- [ ] `git pull origin jean` ejecutado exitosamente
- [ ] Puedes hacer commits y push

---

## 🆘 Soporte

**Si tienes problemas:**

1. **Revisa esta guía** en la sección de Solución de Problemas
2. **Verifica la consola** del navegador (F12)
3. **Verifica la terminal** del servidor backend
4. **Pregunta en el grupo** del equipo
5. **Revisa los archivos `.md`** de documentación:
   - `README.md`
   - `LIMPIEZA_COMPLETA.md`
   - `FIX_LOGOUT_DOBLE.md`
   - `PRUEBA_NAVEGACION_ADMIN.md`

---

## 🎯 Siguiente Paso

Una vez que todo funcione:

1. **Familiarízate con el código:**
   - Lee `backend/server.js`
   - Explora `js/auth-api.js`
   - Revisa `html/AdminProfile.html`

2. **Prueba todas las funcionalidades:**
   - Login/Logout
   - Registro
   - Panel Admin
   - Navegación entre páginas

3. **Coordina con tu equipo:**
   - Decide quién trabajará en qué
   - Establece una frecuencia de commits
   - Define una hora de integración diaria

**¡Listo para colaborar! 🚀**

---

**Actualizado:** 31 de Octubre, 2025  
**Versión:** 1.0.0  
**Equipo:** Ricjear Tech - AWD Fast Food App
