# ========================================
# SCRIPT DE INICIO - BOCATTO VALLEY
# ========================================
# Ejecuta este script para iniciar el backend
# Uso: .\start-backend.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   BOCATTO VALLEY - INICIANDO BACKEND   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navegar a la carpeta backend
Set-Location -Path ".\backend"

# Verificar que existan las dependencias
if (-Not (Test-Path ".\node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Verificar que exista .env
if (-Not (Test-Path ".\.env")) {
    Write-Host "⚠️  ADVERTENCIA: No se encontró archivo .env" -ForegroundColor Red
    Write-Host "📝 Copia .env.example a .env y configura tu MONGODB_URI" -ForegroundColor Yellow
    Write-Host ""
    
    $response = Read-Host "¿Quieres crear .env ahora? (s/n)"
    if ($response -eq "s" -or $response -eq "S") {
        Copy-Item ".\.env.example" -Destination ".\.env"
        Write-Host "✅ Archivo .env creado" -ForegroundColor Green
        Write-Host "⚠️  IMPORTANTE: Edita .env y configura MONGODB_URI" -ForegroundColor Yellow
        Write-Host ""
        Start-Process notepad ".\.env"
        Read-Host "Presiona ENTER cuando hayas configurado .env"
    } else {
        Write-Host "❌ No se puede iniciar sin .env configurado" -ForegroundColor Red
        exit
    }
}

Write-Host "🚀 Iniciando servidor..." -ForegroundColor Green
Write-Host ""

# Iniciar servidor en modo desarrollo
npm run dev
