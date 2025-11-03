# ========================================
# COMANDOS ÚTILES - BOCATTO VALLEY
# ========================================

## 🚀 INICIO RÁPIDO

### Instalar dependencias
```powershell
cd backend
npm install
```

### Iniciar backend (desarrollo)
```powershell
cd backend
npm run dev
```

### Iniciar backend (producción)
```powershell
cd backend
npm start
```

### Poblar base de datos
```powershell
cd backend
npm run seed
```

### Limpiar base de datos
```powershell
cd backend
npm run seed -- -d
```

---

## 🔧 COMANDOS DE NODE.JS

### Ver versión de Node
```powershell
node --version
npm --version
```

### Limpiar caché de npm
```powershell
npm cache clean --force
```

### Reinstalar dependencias
```powershell
cd backend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

## 🗄️ COMANDOS DE MONGODB

### Verificar conexión (Node REPL)
```powershell
cd backend
node
```
```javascript
require('dotenv').config()
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ Conectado'))
```

---

## 🧪 PROBAR API CON CURL

### Health Check
```powershell
curl http://localhost:3000/api/health
```

### Registro de usuario
```powershell
curl -X POST http://localhost:3000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"firstName\":\"Test\",\"lastName\":\"User\",\"email\":\"test@example.com\",\"password\":\"123456\"}'
```

### Login
```powershell
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"admin@adminbocatto.com\",\"password\":\"adminPass123\"}'
```

---

## 🌐 NETLIFY (Frontend)

### Instalar Netlify CLI
```powershell
npm install -g netlify-cli
```

### Login en Netlify
```powershell
netlify login
```

### Deploy manual
```powershell
netlify deploy --prod
```

---

## 🚂 RENDER (Backend)

### Instalar Render CLI
```powershell
npm install -g render-cli
```

### Variables de entorno necesarias
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=tu_secret
NODE_ENV=production
FRONTEND_URL=https://tu-frontend.netlify.app
CORS_ORIGIN=https://tu-frontend.netlify.app
```

---

## 📦 GIT

### Inicializar repositorio
```powershell
git init
git add .
git commit -m "Conexión a MongoDB Atlas implementada"
```

### Subir a GitHub
```powershell
git remote add origin https://github.com/tu-usuario/tu-repo.git
git branch -M main
git push -u origin main
```

### Verificar qué archivos se subirán
```powershell
git status
```

### Asegurar que .env NO se suba
```powershell
# Verificar que .gitignore incluya .env
Get-Content backend\.gitignore | Select-String ".env"
```

---

## 🐛 DEBUG

### Ver logs del backend
```powershell
cd backend
npm run dev
# Los logs aparecerán en consola
```

### Ver variables de entorno
```powershell
cd backend
node -e "require('dotenv').config(); console.log(process.env.MONGODB_URI)"
```

### Probar conexión a MongoDB
```powershell
cd backend
node -e "require('dotenv').config(); require('./config/database.js').default()"
```

---

## 📊 MONITOREO

### Ver tamaño de base de datos
En MongoDB Atlas:
```
Deployment > Database > Collections
```

### Ver logs de aplicación
En Render:
```
Dashboard > tu-servicio > Logs
```

---

## 🔐 SEGURIDAD

### Generar JWT Secret seguro
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Generar contraseña segura
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 💡 TIPS

### Abrir VS Code en carpeta actual
```powershell
code .
```

### Abrir backend en VS Code
```powershell
code backend
```

### Ver puerto 3000 en uso (Windows)
```powershell
netstat -ano | findstr :3000
```

### Matar proceso en puerto 3000
```powershell
# Obtener PID del comando anterior
Stop-Process -Id [PID]
```

### Ver todos los procesos de Node
```powershell
Get-Process | Where-Object {$_.ProcessName -eq "node"}
```

---

## 🔄 ACTUALIZAR PROYECTO

### Actualizar dependencias
```powershell
cd backend
npm update
```

### Ver dependencias desactualizadas
```powershell
cd backend
npm outdated
```

---

## 📝 NOTAS

- Siempre ejecuta `npm run dev` en modo desarrollo
- Usa `npm start` solo en producción
- No olvides configurar `.env` antes de iniciar
- Mantén tu `MONGODB_URI` seguro (nunca lo compartas)
- Usa diferentes claves `JWT_SECRET` en dev y prod

---

**Documentación completa:** Ver `GUIA_MONGODB_ATLAS.md`
