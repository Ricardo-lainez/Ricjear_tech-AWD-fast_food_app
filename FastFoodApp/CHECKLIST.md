# ✅ CHECKLIST DE VERIFICACIÓN

## 📋 Lista de Verificación Completa

Usa este checklist para asegurarte de que todo esté configurado correctamente.

---

## 🎯 FASE 1: Configuración Inicial

### MongoDB Atlas
- [ ] Cuenta creada en MongoDB Atlas
- [ ] Cluster M0 (gratuito) creado
- [ ] Usuario de base de datos creado
- [ ] Contraseña guardada de forma segura
- [ ] IP permitida en Network Access (0.0.0.0/0 para desarrollo)
- [ ] URI de conexión copiada

### Node.js y Dependencias
- [ ] Node.js 18+ instalado
- [ ] npm funcionando correctamente
- [ ] Navegaste a la carpeta `backend`
- [ ] Ejecutaste `npm install`
- [ ] Todas las dependencias instaladas sin errores

### Variables de Entorno
- [ ] Archivo `backend/.env` existe
- [ ] `MONGODB_URI` configurado con tu URI real
- [ ] Contraseña reemplazada (sin `<password>`)
- [ ] Nombre de base de datos agregado (`/bocatto_valley`)
- [ ] `JWT_SECRET` cambiado (no usar el de ejemplo)
- [ ] `COOKIE_SECRET` cambiado
- [ ] `CORS_ORIGIN` configurado

---

## 🗄️ FASE 2: Base de Datos

### Poblar Datos Iniciales
- [ ] Ejecutaste `npm run seed` en la carpeta backend
- [ ] Viste mensaje: "✅ MongoDB Atlas Conectado Exitosamente"
- [ ] Viste mensaje: "✅ 3 usuarios creados exitosamente"
- [ ] Sin errores de conexión

### Verificar en MongoDB Atlas
- [ ] Accediste a MongoDB Atlas Dashboard
- [ ] Database > Browse Collections
- [ ] Base de datos `bocatto_valley` existe
- [ ] Colección `users` existe
- [ ] Hay 3 documentos en `users`

---

## 🚀 FASE 3: Backend API

### Iniciar Servidor
- [ ] Ejecutaste `npm run dev` en carpeta backend
- [ ] Servidor inició sin errores
- [ ] Viste mensaje: "🚀 SERVIDOR INICIADO CORRECTAMENTE"
- [ ] Puerto 3000 disponible

### Verificar Endpoints
- [ ] Abriste http://localhost:3000 en navegador
- [ ] Viste mensaje de bienvenida JSON
- [ ] Probaste http://localhost:3000/api/health
- [ ] Respuesta exitosa (`"success": true`)

### Logs del Servidor
- [ ] Consola muestra conexión exitosa a MongoDB
- [ ] No hay errores en consola
- [ ] Servidor responde a peticiones

---

## 💻 FASE 4: Frontend

### Actualizar Archivos
- [ ] Archivo `js/api-client.js` existe
- [ ] Archivo `js/auth-api.js` existe
- [ ] `index.html` actualizado con nuevos scripts
- [ ] `auth.js` antiguo comentado o removido

### Verificar Configuración
- [ ] `API_CONFIG.baseURL` apunta a `http://localhost:3000/api`
- [ ] Scripts cargados en el orden correcto:
  1. `api-client.js`
  2. `auth-api.js`
  3. Otros scripts

### Abrir Frontend
- [ ] Abriste `index.html` con Live Server (puerto 5500)
- [ ] O abriste con navegador directamente
- [ ] Página carga sin errores visibles

---

## 🧪 FASE 5: Probar Funcionalidad

### Consola del Navegador (F12)
- [ ] Abriste DevTools
- [ ] Tab "Console" sin errores rojos
- [ ] Viste: "🌐 API Client configurado..."
- [ ] Viste: "🔐 Sistema de autenticación con API cargado"

### Probar Login
- [ ] Click en botón "Ingresar"
- [ ] Modal de login se abre
- [ ] Usaste: admin@adminbocatto.com / adminPass123
- [ ] Login exitoso
- [ ] Menú de usuario aparece con nombre "Raul"
- [ ] No hay errores en consola

### Probar Registro
- [ ] Click en "Regístrate aquí"
- [ ] Modal de registro se abre
- [ ] Llenaste todos los campos requeridos
- [ ] Click en "Crear Cuenta"
- [ ] Registro exitoso
- [ ] Automáticamente logueado
- [ ] Usuario aparece en menú

### Verificar Network (DevTools)
- [ ] Tab "Network" en DevTools
- [ ] Peticiones a `http://localhost:3000/api/auth/...`
- [ ] Status Code: 200 (éxito)
- [ ] Response contiene `"success": true`
- [ ] Token JWT recibido

### Verificar en MongoDB
- [ ] Atlas > Database > Browse Collections
- [ ] Nuevo usuario aparece en colección `users`
- [ ] Contraseña está hasheada (no en texto plano)
- [ ] Todos los campos guardados correctamente

---

## 🔐 FASE 6: Seguridad y Mejores Prácticas

### Seguridad Básica
- [ ] Archivo `.env` en `.gitignore`
- [ ] Contraseñas hasheadas en base de datos (no texto plano)
- [ ] JWT tokens funcionando
- [ ] CORS configurado correctamente

### Verificar .gitignore
- [ ] Archivo `backend/.gitignore` existe
- [ ] Contiene `.env`
- [ ] Contiene `node_modules/`
- [ ] Ejecutaste `git status` (si usas Git)
- [ ] `.env` NO aparece en archivos para commit

### Variables Secretas
- [ ] `JWT_SECRET` es único (no el de ejemplo)
- [ ] `COOKIE_SECRET` es único
- [ ] Contraseña de MongoDB es segura
- [ ] Credenciales NO están en el código

---

## 📚 FASE 7: Documentación

### Archivos Creados
- [ ] `INICIO_RAPIDO.md` existe
- [ ] `GUIA_MONGODB_ATLAS.md` existe
- [ ] `ARQUITECTURA.md` existe
- [ ] `COMANDOS_UTILES.md` existe
- [ ] `backend/README.md` existe
- [ ] Este checklist (`CHECKLIST.md`) existe

### Lectura
- [ ] Leíste `INICIO_RAPIDO.md`
- [ ] Revisaste `GUIA_MONGODB_ATLAS.md`
- [ ] Entiendes la arquitectura (`ARQUITECTURA.md`)
- [ ] Tienes a mano `COMANDOS_UTILES.md`

---

## 🌐 FASE 8: Preparación para Producción (Opcional)

### Git y GitHub
- [ ] Repositorio Git inicializado
- [ ] Código subido a GitHub
- [ ] `.env` NO está en el repositorio
- [ ] README.md actualizado

### Despliegue Frontend (Netlify)
- [ ] Cuenta creada en Netlify
- [ ] Proyecto desplegado
- [ ] URL de producción obtenida
- [ ] Sitio web funcionando

### Despliegue Backend (Render)
- [ ] Cuenta creada en Render
- [ ] Web Service creado
- [ ] Repositorio conectado
- [ ] Variables de entorno configuradas:
  - [ ] MONGODB_URI
  - [ ] JWT_SECRET
  - [ ] NODE_ENV=production
  - [ ] FRONTEND_URL (URL de Netlify)
  - [ ] CORS_ORIGIN (URL de Netlify)
- [ ] Deploy exitoso
- [ ] API funcionando en producción

### Actualizar Frontend para Producción
- [ ] `js/api-client.js` actualizado con URL de Render
- [ ] Re-desplegado en Netlify
- [ ] Probado en producción
- [ ] Login/Registro funciona en producción

---

## 🎯 Resumen de Estado

Marca el estado general de cada fase:

| Fase | Estado | Notas |
|------|--------|-------|
| 1. Configuración Inicial | ⬜ En progreso / ✅ Completo | |
| 2. Base de Datos | ⬜ En progreso / ✅ Completo | |
| 3. Backend API | ⬜ En progreso / ✅ Completo | |
| 4. Frontend | ⬜ En progreso / ✅ Completo | |
| 5. Probar Funcionalidad | ⬜ En progreso / ✅ Completo | |
| 6. Seguridad | ⬜ En progreso / ✅ Completo | |
| 7. Documentación | ⬜ En progreso / ✅ Completo | |
| 8. Producción | ⬜ En progreso / ✅ Completo / ⬜ No necesario | |

---

## 🐛 Solución Rápida de Problemas

Si algo no funciona, verifica en orden:

1. **Backend corriendo?**
   ```powershell
   cd backend
   npm run dev
   ```

2. **MongoDB conectado?**
   - Verifica logs del backend
   - Busca: "✅ MongoDB Atlas Conectado"

3. **Variables de entorno correctas?**
   - Revisa `backend/.env`
   - Contraseña sin `<password>`

4. **Frontend apuntando al backend correcto?**
   - Verifica `js/api-client.js`
   - `baseURL: 'http://localhost:3000/api'`

5. **CORS configurado?**
   - `CORS_ORIGIN` en `.env` incluye tu puerto frontend

6. **Puertos en uso?**
   - Backend: 3000
   - Frontend: 5500 (Live Server)

---

## 📞 Ayuda Adicional

Si tienes problemas:

1. **Revisa logs del backend** en la terminal
2. **Revisa consola del navegador** (F12)
3. **Revisa Network tab** en DevTools
4. **Consulta** `GUIA_MONGODB_ATLAS.md` sección Troubleshooting
5. **Consulta** `COMANDOS_UTILES.md` para comandos de debug

---

## ✨ ¡Felicidades!

Si completaste todas las fases, ¡tu aplicación está lista! 🎉

**Próximos pasos sugeridos:**
- Agregar más modelos (Productos, Pedidos, Reservaciones)
- Implementar panel de administrador
- Agregar sistema de roles más detallado
- Implementar reset de contraseña
- Agregar upload de imágenes
- Implementar sistema de notificaciones

---

**Última actualización:** Octubre 2025
**Versión:** 1.0.0
