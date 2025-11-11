# 🚀 GUÍA DE DESPLIEGUE - BOCATTO VALLEY

Esta guía te ayudará a desplegar tu aplicación completa en la nube de forma GRATUITA.

## 📋 ARQUITECTURA DEL DESPLIEGUE

```
┌─────────────────────────────────────────────────────────────┐
│                      BOCATTO VALLEY                          │
└─────────────────────────────────────────────────────────────┘
         │                                    │
         ▼                                    ▼
┌──────────────────┐                ┌──────────────────┐
│    FRONTEND      │                │     BACKEND      │
│   (Vercel)       │◄──────────────►│    (Render)      │
│  HTML/CSS/JS     │      API       │  Node.js/Express │
└──────────────────┘    Calls       └──────────────────┘
                                              │
                                              ▼
                                    ┌──────────────────┐
                                    │    BASE DATOS    │
                                    │  MongoDB Atlas   │
                                    └──────────────────┘
```

**Frontend**: https://bocatto-valley.vercel.app (Vercel)
**Backend**: https://bocatto-valley-api.onrender.com (Render)
**Database**: MongoDB Atlas (ya configurado)

---

## 🎯 PARTE 1: DESPLEGAR BACKEND EN RENDER

### Paso 1: Crear cuenta en Render
1. Ve a: https://render.com/
2. Click en "Get Started for Free"
3. Regístrate con GitHub (recomendado)

### Paso 2: Conectar repositorio
1. En el dashboard de Render, click en "New +"
2. Selecciona "Web Service"
3. Conecta tu repositorio de GitHub: `Ricardo-lainez/Ricjear_tech-AWD-fast_food_app`
4. Selecciona la rama: `jean` (o la rama principal)

### Paso 3: Configurar el servicio
Usa esta configuración:

```yaml
Name: bocatto-valley-api
Region: Oregon (us-west)
Branch: jean
Root Directory: FastFoodApp/backend
Runtime: Node
Build Command: npm install
Start Command: npm start
Plan: Free
```

### Paso 4: Variables de entorno
Agrega estas variables en "Environment Variables":

**IMPORTANTE**: Copia estos valores de tu archivo `.env` local:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=tu_uri_de_mongodb_atlas
JWT_SECRET=tu_jwt_secret_aqui
JWT_EXPIRE=7d
COOKIE_SECRET=tu_cookie_secret_aqui
CORS_ORIGIN=https://bocatto-valley.vercel.app
```

⚠️ **IMPORTANTE**: 
- NO uses las credenciales que estaban en CREDENCIALES_EQUIPO.md (ya fueron expuestas)
- Debes haber cambiado la contraseña de MongoDB Atlas primero
- El `CORS_ORIGIN` lo cambiarás después cuando tengas la URL de Vercel

### Paso 5: Desplegar
1. Click en "Create Web Service"
2. Espera 5-10 minutos mientras se despliega
3. Una vez completado, verás: "Your service is live 🎉"
4. **COPIA LA URL**: Será algo como `https://bocatto-valley-api.onrender.com`

### Paso 6: Verificar que funcione
Abre en tu navegador:
```
https://bocatto-valley-api.onrender.com/api/health
```

Deberías ver:
```json
{
  "success": true,
  "message": "API funcionando correctamente",
  "timestamp": "2025-11-11T...",
  "database": "connected"
}
```

---

## 🎨 PARTE 2: DESPLEGAR FRONTEND EN VERCEL

### Paso 1: Crear cuenta en Vercel
1. Ve a: https://vercel.com/
2. Click en "Sign Up"
3. Regístrate con GitHub (recomendado)

### Paso 2: Importar proyecto
1. En el dashboard de Vercel, click en "Add New..."
2. Selecciona "Project"
3. Importa tu repositorio: `Ricardo-lainez/Ricjear_tech-AWD-fast_food_app`
4. Click en "Import"

### Paso 3: Configurar el proyecto
Usa esta configuración:

```yaml
Project Name: bocatto-valley
Framework Preset: Other
Root Directory: FastFoodApp
Build Command: (dejar vacío)
Output Directory: (dejar vacío)
Install Command: (dejar vacío)
```

### Paso 4: Desplegar
1. Click en "Deploy"
2. Espera 1-2 minutos
3. Una vez completado, verás: "Your project is live! 🎉"
4. **COPIA LA URL**: Será algo como `https://bocatto-valley.vercel.app`

---

## 🔗 PARTE 3: CONECTAR FRONTEND CON BACKEND

### Paso 1: Actualizar config.js
Abre el archivo `js/config.js` y actualiza la URL del backend:

```javascript
// Busca esta línea (alrededor de la línea 19):
: 'https://bocatto-valley-api.onrender.com/api', // Cambiarás esta URL después del deploy

// Reemplázala con la URL que copiaste de Render:
: 'https://TU-URL-DE-RENDER.onrender.com/api',
```

### Paso 2: Actualizar CORS en el backend
Regresa a Render y actualiza la variable de entorno `CORS_ORIGIN`:

```env
CORS_ORIGIN=https://TU-URL-DE-VERCEL.vercel.app
```

Ejemplo:
```env
CORS_ORIGIN=https://bocatto-valley.vercel.app
```

Luego click en "Manual Deploy" → "Deploy latest commit"

### Paso 3: Hacer commit y push
```powershell
git add .
git commit -m "feat: Configurar URLs de producción para despliegue"
git push origin jean
```

Vercel detectará automáticamente el cambio y re-desplegará en 1-2 minutos.

---

## ✅ PARTE 4: VERIFICAR QUE TODO FUNCIONE

### 1. Verificar Backend
```
https://TU-BACKEND.onrender.com/api/health
```
✅ Debe responder con JSON

### 2. Verificar Frontend
```
https://TU-FRONTEND.vercel.app
```
✅ Debe cargar la página correctamente

### 3. Verificar Login
1. Abre el frontend en el navegador
2. Click en "Ingresar"
3. Ingresa credenciales de prueba
4. Abre la consola del navegador (F12)
5. Deberías ver: "🌐 API Base URL: https://tu-backend.onrender.com/api"
6. Deberías ver: "✅ Login exitoso"

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "No se pudo conectar con el servidor"
**Causa**: El backend no está corriendo o la URL es incorrecta

**Solución**:
1. Verifica que el backend esté "live" en Render
2. Verifica la URL en `js/config.js`
3. Abre la consola del navegador (F12) y revisa los errores

### Error: "No permitido por CORS"
**Causa**: El CORS_ORIGIN no está configurado correctamente

**Solución**:
1. Ve a Render → Environment Variables
2. Verifica que `CORS_ORIGIN` tenga la URL exacta de Vercel
3. Haz un "Manual Deploy" después de cambiar

### Error: "MongoServerError: Authentication failed"
**Causa**: Las credenciales de MongoDB son incorrectas

**Solución**:
1. Ve a MongoDB Atlas
2. Verifica que el usuario y contraseña sean correctos
3. Actualiza `MONGODB_URI` en Render
4. Haz un "Manual Deploy"

### Backend se duerme después de 15 minutos
**Causa**: Plan gratuito de Render

**Solución**:
- Es normal en el plan gratuito
- El backend se "despierta" automáticamente cuando recibe una petición (tarda 30-60 segundos)
- Opción: Usar un servicio de "ping" gratuito como https://uptimerobot.com/

---

## 📊 MONITOREO Y LOGS

### Ver logs del backend (Render)
1. Ve a tu servicio en Render
2. Click en "Logs" en el menú lateral
3. Verás todos los console.log() de tu backend

### Ver logs del frontend (Vercel)
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Verás los console.log() del frontend

### Ver logs de MongoDB
1. Ve a MongoDB Atlas
2. Click en tu cluster
3. Click en "Monitoring"
4. Podrás ver todas las conexiones y queries

---

## 🎉 ¡LISTO!

Tu aplicación ahora está completamente desplegada:

**🌐 URLs Públicas:**
- Frontend: https://bocatto-valley.vercel.app
- Backend: https://bocatto-valley-api.onrender.com
- Database: MongoDB Atlas (privada)

**🔐 Credenciales:**
- Compártelas solo de forma privada (WhatsApp, Discord)
- NUNCA las subas a GitHub

**📝 Actualizaciones futuras:**
1. Haz cambios en local
2. Commit y push a GitHub
3. Vercel y Render se actualizan automáticamente

---

## 📱 COMPARTIR CON TU EQUIPO

Envía este mensaje a tu equipo:

```
🎉 ¡La app ya está en línea!

🌐 Frontend: https://bocatto-valley.vercel.app
📡 Backend: https://bocatto-valley-api.onrender.com/api

Para hacer cambios:
1. Clona el repo
2. Haz tus cambios en local
3. Prueba que funcione
4. Haz commit y push
5. Se actualiza automáticamente en la nube

Cualquier duda, revisa: GUIA_DESPLIEGUE.md
```

---

## 🚀 PRÓXIMOS PASOS (OPCIONAL)

1. **Dominio personalizado**: Conectar un dominio .com (gratuito con GitHub Student Pack)
2. **Analytics**: Agregar Google Analytics para ver visitantes
3. **SEO**: Optimizar meta tags para buscadores
4. **Performance**: Optimizar imágenes y código
5. **CI/CD**: Agregar tests automáticos antes del deploy

---

**¿Necesitas ayuda?**
- Revisa los logs en Render y Vercel
- Abre la consola del navegador (F12)
- Verifica que todas las URLs estén correctas
- Asegúrate de haber cambiado la contraseña de MongoDB Atlas

¡Éxito con tu proyecto! 🚀
