/**
 * ========================================
 * LIMPIEZA DE DATOS VIEJOS (UNA SOLA VEZ)
 * ========================================
 * Limpia localStorage y sessionStorage de versiones anteriores
 * Se ejecuta solo UNA VEZ por navegador
 */

(function() {
    // Verificar si ya se ejecutó la limpieza
    const cleanupVersion = 'v1.0.0';
    const cleanupKey = 'bocatto_cleanup_done';
    
    if (localStorage.getItem(cleanupKey) === cleanupVersion) {
        console.log('✅ Sistema ya está limpio (v1.0.0)');
        return; // Ya se limpió anteriormente
    }
    
    console.log('🧹 Iniciando limpieza de datos viejos (única vez)...');
    
    // Lista de claves a eliminar (de la versión antigua)
    // IMPORTANTE: NO eliminar 'bocatto_session' porque es la sesión ACTUAL de la API
    const keysToRemove = [
        'bocatto_users',           // Usuarios simulados viejos (Raul, María)
        'bocatto_session_old',     // Sesión vieja alternativa
        'user_session',            // Posibles variantes
        'current_user',
        'auth_token_old',
        'simulated_users',         // Por si acaso
        'admin_session',           // Sesiones alternativas
        'client_session'
    ];

    let cleaned = 0;

    // Limpiar localStorage
    keysToRemove.forEach(key => {
        if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
            console.log(`🗑️  Eliminado de localStorage: ${key}`);
            cleaned++;
        }
    });

    // Limpiar sessionStorage
    keysToRemove.forEach(key => {
        if (sessionStorage.getItem(key)) {
            sessionStorage.removeItem(key);
            console.log(`🗑️  Eliminado de sessionStorage: ${key}`);
            cleaned++;
        }
    });

    if (cleaned > 0) {
        console.log(`✅ Limpieza completada: ${cleaned} elementos eliminados`);
        console.log('🔄 Sistema ahora usa 100% MongoDB Atlas');
    } else {
        console.log('✅ No había datos viejos que limpiar');
    }
    
    // Marcar como limpiado
    localStorage.setItem(cleanupKey, cleanupVersion);
    console.log('📦 Limpieza registrada - No se volverá a ejecutar');
})();

