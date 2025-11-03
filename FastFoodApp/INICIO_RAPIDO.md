# 🚀 GUÍA RÁPIDA DE INICIO

## ⚡ Inicio Rápido (5 minutos)

### 1️⃣ Configurar MongoDB Atlas

```
1. Ve a: https://mongodb.com/cloud/atlas/register
2. Crea cuenta GRATIS
3. Crear Cluster (M0 - FREE)
4. Security > Database Access > Crear usuario
   - User: bocatto_admin
   - Password: [guardar!]
5. Security > Network Access > Allow 0.0.0.0/0
6. Connect > Connect App > Copiar URI
```

### 2️⃣ Configurar Backend

```powershell
# Paso 1: Navegar a backend
cd backend

# Paso 2: Instalar dependencias
npm install

# Paso 3: Configurar .env
# Abrir backend/.env y pegar tu URI de MongoDB

# Paso 4: Poblar base de datos
npm run seed

# Paso 5: Iniciar servidor
npm run dev
```

### 3️⃣ Actualizar Frontend

En `index.html`, antes de `</body>`:

```html
<!-- Reemplazar esto: -->
<script src="js/auth.js"></script>

<!-- Por esto: -->
<script src="js/api-client.js"></script>
<script src="js/auth-api.js"></script>
```

### 4️⃣ Probar

1. Abre `index.html` con Live Server
2. Click en "Ingresar"
3. Usa: admin@adminbocatto.com / adminPass123

---

## 📂 Archivos Importantes

| Archivo | Descripción |
|---------|-------------|
| `backend/server.js` | Servidor principal |
| `backend/.env` | ⚠️ Configuración (NO subir a Git) |
| `backend/models/User.js` | Modelo de usuario |
| `js/api-client.js` | Cliente HTTP para API |
| `js/auth-api.js` | Autenticación con API |
| `GUIA_MONGODB_ATLAS.md` | Guía completa detallada |

---

## 🔑 Credenciales de Prueba

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@adminbocatto.com | adminPass123 |
| Cliente | cliente@bocatto.com | cliente123 |

---

## ✅ Verificar que Todo Funciona

### Backend
```powershell
cd backend
npm run dev
```
✅ Deberías ver: "MongoDB Atlas Conectado Exitosamente"

### Frontend
1. Abrir DevTools (F12)
2. Console debe mostrar:
   ```
   🌐 API Client configurado: http://localhost:3000/api
   🔐 Sistema de autenticación con API cargado
   ```

### Base de Datos
1. Ve a MongoDB Atlas
2. Database > Browse Collections
3. Verás: `bocatto_valley` > `users`

---

## 🆘 Solución Rápida de Problemas

### ❌ "No se pudo conectar con el servidor"
```powershell
cd backend
npm run dev
```

### ❌ "MongoServerError: bad auth"
→ Revisar contraseña en `backend/.env`

### ❌ "Connection timeout"
→ MongoDB Atlas > Security > Network Access > Add 0.0.0.0/0

### ❌ Error CORS
→ Verificar `CORS_ORIGIN=http://localhost:5500` en `.env`

---

## 🌐 Despliegue

### Frontend → Netlify
1. Arrastrar carpeta a netlify.com
2. ¡Listo!

### Backend → Render
1. Subir código a GitHub
2. New Web Service en render.com
3. Agregar variables de entorno
4. Deploy

**Guía completa:** Ver `GUIA_MONGODB_ATLAS.md`

---

## 📚 Documentación Completa

- 📖 **Guía detallada**: `GUIA_MONGODB_ATLAS.md`
- 📖 **Backend README**: `backend/README.md`

---

**¿Problemas?** Lee `GUIA_MONGODB_ATLAS.md` (sección Troubleshooting)
