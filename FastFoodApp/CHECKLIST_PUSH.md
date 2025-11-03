# ✅ CHECKLIST ANTES DE HACER PUSH

## 📋 Verificación Pre-Push

Marca cada item antes de hacer `git push`:

### 🔐 Seguridad

- [ ] ✅ Verificar que `.env` NO está en los archivos a subir
  ```bash
  git status
  # NO debe aparecer: backend/.env
  ```

- [ ] ✅ Verificar que `node_modules/` NO está incluido
  ```bash
  git status
  # NO debe aparecer: backend/node_modules/
  ```

- [ ] ✅ `.gitignore` está configurado correctamente
  ```bash
  # Debe contener:
  # .env
  # node_modules/
  ```

- [ ] ✅ No hay credenciales hardcodeadas en el código
  ```bash
  # Buscar en todos los archivos:
  grep -r "jean12345" .
  grep -r "mongodb+srv" . --exclude-dir=node_modules
  # Solo deben aparecer en .env y .env.example
  ```

---

### 📁 Archivos Importantes

- [ ] ✅ `backend/.env.example` existe y está actualizado
- [ ] ✅ `README.md` está actualizado
- [ ] ✅ `GUIA_INSTALACION_EQUIPO.md` existe
- [ ] ✅ `CREDENCIALES_EQUIPO.md` existe (opcional: puede estar en .gitignore)
- [ ] ✅ `package.json` tiene todas las dependencias

---

### 🧪 Testing Local

- [ ] ✅ Backend funciona correctamente
  ```bash
  cd backend
  npm start
  # Debe mostrar: "SERVIDOR INICIADO CORRECTAMENTE"
  ```

- [ ] ✅ Frontend funciona con Live Server
  ```
  http://127.0.0.1:5500
  ```

- [ ] ✅ Login funciona correctamente
  ```
  Email: admin@adminbocatto.com
  Password: adminPass123
  ```

- [ ] ✅ No hay errores en la consola del navegador (F12)

- [ ] ✅ No hay errores en la terminal del servidor

---

### 📝 Git

- [ ] ✅ Commit tiene un mensaje descriptivo
  ```bash
  # Formato: tipo: descripción
  # Ejemplos:
  git commit -m "feat: Agregar sistema de reservaciones"
  git commit -m "fix: Corregir logout doble en admin panel"
  git commit -m "docs: Actualizar guía de instalación"
  ```

- [ ] ✅ Estás en la rama correcta
  ```bash
  git branch
  # Debe mostrar: * jean
  ```

- [ ] ✅ Has hecho pull antes de push
  ```bash
  git pull origin jean
  ```

- [ ] ✅ No hay conflictos
  ```bash
  git status
  # No debe decir: "You have unmerged paths"
  ```

---

### 🔍 Verificación de Archivos

Ejecuta estos comandos para verificar que no subes archivos sensibles:

```bash
# Ver qué archivos vas a subir
git status

# Ver el contenido exacto que se subirá
git diff --cached

# Verificar que .env NO está
git ls-files | grep .env
# Resultado esperado: solo .env.example

# Verificar que node_modules NO está
git ls-files | grep node_modules
# Resultado esperado: vacío
```

---

### 📊 Archivos que SÍ deben subirse

- ✅ `backend/server.js`
- ✅ `backend/package.json`
- ✅ `backend/.env.example` (sin credenciales reales)
- ✅ `backend/config/`
- ✅ `backend/controllers/`
- ✅ `backend/models/`
- ✅ `backend/routes/`
- ✅ `backend/middleware/`
- ✅ `backend/utils/`
- ✅ `backend/database/seed.js`
- ✅ `js/*.js`
- ✅ `html/*.html`
- ✅ `styles/*.css`
- ✅ `images/`
- ✅ `index.html`
- ✅ `README.md`
- ✅ `*.md` (documentación)

---

### ❌ Archivos que NO deben subirse

- ❌ `backend/.env` (credenciales reales)
- ❌ `backend/node_modules/`
- ❌ `.vscode/` (configuración personal)
- ❌ `.DS_Store` (macOS)
- ❌ `Thumbs.db` (Windows)
- ❌ `*.log` (logs)
- ❌ `package-lock.json` (se genera automáticamente)

---

## 🚀 Comandos para Push

Una vez que todo esté verificado:

```bash
# 1. Ver estado
git status

# 2. Agregar archivos
git add .

# 3. Verificar qué se agregó
git status

# 4. Commit
git commit -m "tipo: descripción clara del cambio"

# 5. Pull (por si hay cambios nuevos)
git pull origin jean

# 6. Push
git push origin jean
```

---

## ⚠️ Si encuentras algo mal

### Si agregaste .env por error:

```bash
# Quitar del staged
git reset backend/.env

# Verificar que ya no está
git status
```

### Si agregaste node_modules por error:

```bash
# Quitar del staged
git reset backend/node_modules

# Asegurar que está en .gitignore
echo "node_modules/" >> backend/.gitignore
```

### Si hay conflictos después de pull:

```bash
# Ver archivos con conflicto
git status

# Abrir archivos y resolver manualmente
# Buscar: <<<<<<< HEAD

# Después de resolver:
git add archivo-resuelto.js
git commit -m "merge: Resolver conflicto en archivo-resuelto"
git push origin jean
```

---

## 📞 Comunicación con el Equipo

Antes de push:

- [ ] ✅ Avisar en el grupo qué vas a subir
- [ ] ✅ Verificar que nadie esté editando los mismos archivos
- [ ] ✅ Documentar cambios importantes en el commit message

Después de push:

- [ ] ✅ Avisar en el grupo que hiciste push
- [ ] ✅ Mencionar qué archivos cambiaron
- [ ] ✅ Indicar si hay que hacer algo especial (npm install, etc.)

---

## 🆘 Soporte

Si algo sale mal:

1. **NO hagas push si no estás seguro**
2. Revisa esta checklist
3. Pregunta en el grupo del equipo
4. Lee `GUIA_INSTALACION_EQUIPO.md`

---

## ✅ Ejemplo de Flujo Completo

```bash
# 1. Actualizar código
git pull origin jean

# 2. Hacer cambios en archivos...
# (editar, agregar, etc.)

# 3. Verificar cambios
git status

# 4. Verificar que .env NO está
git status | grep .env
# Solo debe aparecer .env.example

# 5. Agregar archivos
git add .

# 6. Verificar qué se agregó
git status

# 7. Commit
git commit -m "feat: Agregar funcionalidad X"

# 8. Pull por si hay cambios
git pull origin jean

# 9. Push
git push origin jean

# 10. Avisar al equipo
# "✅ Push realizado: Agregué funcionalidad X en archivo Y"
```

---

**Última actualización:** 31 de Octubre, 2025  
**Equipo:** Ricjear Tech - Bocatto Valley
