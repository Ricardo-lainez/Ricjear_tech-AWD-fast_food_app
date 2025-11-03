# 🔐 CREDENCIALES COMPARTIDAS DEL EQUIPO

**⚠️ IMPORTANTE: Este archivo NO debe subirse a Git público**

## 📋 Información para el Equipo

### MongoDB Atlas - Base de Datos Compartida

**Conexión:**
```
URI: mongodb+srv://jeancarlo:jean12345@cluster0.3ixvnnj.mongodb.net/FastFoodApp?retryWrites=true&w=majority&appName=Cluster0
```

**Desglose:**
- **Usuario:** `jeancarlo`
- **Password:** `jean12345`
- **Cluster:** `cluster0.3ixvnnj.mongodb.net`
- **Base de Datos:** `FastFoodApp`

---

## 👤 Usuarios de la Aplicación

### Administrador
```
Email: admin@adminbocatto.com
Password: adminPass123
Rol: administrator
```

### Cliente Demo
```
Email: cliente@bocatto.com
Password: cliente123
Rol: client
```

### Cliente de Prueba
```
Email: juan.perez@example.com
Password: 123456
Rol: client
```

---

## ⚙️ Configuración del Backend

### Variables de Entorno (.env)

Copiar esto en tu archivo `.env` en la carpeta `backend/`:

```properties
# MongoDB Atlas
MONGODB_URI=mongodb+srv://jeancarlo:jean12345@cluster0.3ixvnnj.mongodb.net/FastFoodApp?retryWrites=true&w=majority&appName=Cluster0

# Servidor
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=bocatto_valley_secret_key_2024_change_in_production
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:5500
CORS_ORIGIN=http://localhost:5500,http://127.0.0.1:5500

# Cookies
COOKIE_SECRET=bocatto_cookie_secret_2024
```

---

## 🌐 URLs del Proyecto

### Desarrollo Local
- **Frontend:** http://127.0.0.1:5500 (Live Server)
- **Backend API:** http://localhost:3000
- **Backend Health:** http://localhost:3000/api

---

## 📌 Puertos Usados

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| Backend  | 3000   | API Node.js + Express |
| Frontend | 5500   | Live Server (VS Code) |
| MongoDB  | 27017  | Base de datos (Atlas Cloud) |

---

## 🔧 Configuración Rápida

### 1. Clonar el Repositorio
```bash
git clone https://github.com/Ricardo-lainez/Ricjear_tech-AWD-fast_food_app.git
cd Ricjear_tech-AWD-fast_food_app/FastFoodApp
```

### 2. Instalar Dependencias
```bash
cd backend
npm install
```

### 3. Configurar .env
```bash
# Copiar el ejemplo
copy .env.example .env

# El archivo ya tiene las credenciales correctas, no necesitas cambiarlo
```

### 4. Poblar Base de Datos (Solo primera vez o si quieres resetear)
```bash
npm run seed
```

### 5. Iniciar Servidor
```bash
npm start
```

### 6. Abrir Frontend
- Abre `index.html` con Live Server en VS Code
- Puerto: 5500

---

## 📊 MongoDB Atlas - Gestión

### Acceso a MongoDB Atlas Dashboard
**URL:** https://cloud.mongodb.com/

**Para ver la base de datos:**
1. Inicia sesión en MongoDB Atlas (credenciales del dueño del cluster)
2. Ve a "Database" → "Browse Collections"
3. Selecciona cluster `Cluster0`
4. Base de datos: `FastFoodApp`
5. Colecciones: `users`

### Usando MongoDB Compass (Opcional)
1. Descarga MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Conecta con la URI completa
3. Explora la base de datos visualmente

---

## 🚨 IMPORTANTE - Seguridad

### ⚠️ NUNCA hacer esto:
- ❌ Subir el archivo `.env` a Git
- ❌ Compartir credenciales en GitHub Issues/PRs públicos
- ❌ Hardcodear credenciales en el código
- ❌ Compartir capturas con credenciales visibles

### ✅ SIEMPRE hacer esto:
- ✅ Usar variables de entorno (`.env`)
- ✅ Mantener `.env` en `.gitignore`
- ✅ Compartir credenciales solo por canales privados (WhatsApp, Discord)
- ✅ Usar `.env.example` para documentar sin exponer datos

---

## 📞 Contacto del Equipo

### Dueño del MongoDB Atlas
- **Nombre:** Jeancarlo
- **Cluster:** cluster0.3ixvnnj.mongodb.net

### Git Repository
- **Owner:** Ricardo-lainez
- **Repo:** Ricjear_tech-AWD-fast_food_app
- **Branch principal:** jean

---

## 🔄 Flujo de Trabajo

### Antes de trabajar:
```bash
git pull origin jean
```

### Después de trabajar:
```bash
git add .
git commit -m "feat: descripción de tu cambio"
git push origin jean
```

---

## 🆘 Soporte

**Si tienes problemas:**
1. Lee `GUIA_INSTALACION_EQUIPO.md`
2. Revisa la sección de "Solución de Problemas"
3. Pregunta en el grupo del equipo
4. Verifica que el servidor backend esté corriendo

---

**Fecha de creación:** 31 de Octubre, 2025  
**Última actualización:** 31 de Octubre, 2025  
**Equipo:** Ricjear Tech - Bocatto Valley Fast Food App
