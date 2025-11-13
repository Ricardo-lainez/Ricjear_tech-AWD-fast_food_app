/**
 * ofertas.js
 * - Control automático de ofertas según el día
 * - Funcionalidad de carousel/slider para imágenes
 */

// Estado de los carousels
let sliderIndex = {
    miercoles: 0,
    sabado: 0
};

// Inicializar cuando el DOM carga
document.addEventListener('DOMContentLoaded', function(){
    // Control de día para mostrar/ocultar ofertas
    const dayOfWeek = new Date().getDay();
    const ofertaMiercoles = document.getElementById('oferta-miercoles');
    const ofertaSabado = document.getElementById('oferta-sabado');
    
    if(dayOfWeek === 3){ // Miércoles
        if(ofertaMiercoles) ofertaMiercoles.style.display = 'block';
        if(ofertaSabado) ofertaSabado.style.display = 'none';
        console.log('✅ Oferta de Miércoles (Comida) - Activa');
    } else if(dayOfWeek === 6){ // Sábado
        if(ofertaMiercoles) ofertaMiercoles.style.display = 'none';
        if(ofertaSabado) ofertaSabado.style.display = 'block';
        console.log('✅ Oferta de Sábado (Bebidas) - Activa');
    } else {
        // Otros días: mostrar ambas (configurable)
        if(ofertaMiercoles) ofertaMiercoles.style.display = 'block';
        if(ofertaSabado) ofertaSabado.style.display = 'block';
        console.log('📅 Hoy no es miércoles ni sábado. Mostrando todas las ofertas.');
    }
    
    // Inicializar carousels
    mostrarSlide(0, 'miercoles');
    mostrarSlide(0, 'sabado');
    
    // Logging
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    console.log(`Día actual: ${days[dayOfWeek]}`);
});

/**
 * Cambiar slide del carousel (siguiente/anterior)
 */
function cambiarSlide(event, n, oferta){
    event.preventDefault();
    sliderIndex[oferta] += n;
    mostrarSlide(sliderIndex[oferta], oferta);
}

/**
 * Ir a un slide específico
 */
function irAlSlide(n, oferta){
    sliderIndex[oferta] = n;
    mostrarSlide(n, oferta);
}

/**
 * Mostrar un slide específico del carousel
 */
function mostrarSlide(n, oferta){
    const carousel = document.querySelector(`.oferta-${oferta} .carousel-container`);
    const slides = carousel ? carousel.querySelectorAll('.carousel-slide') : [];
    const indicators = document.querySelectorAll(`.oferta-${oferta} .indicator`);
    
    if(slides.length === 0) return;
    
    // Loop infinito (si n > total, vuelve al inicio)
    if(n >= slides.length){
        sliderIndex[oferta] = 0;
    } else if(n < 0){
        sliderIndex[oferta] = slides.length - 1;
    }
    
    // Remover clase active de todos los slides e indicadores
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(ind => ind.classList.remove('active'));
    
    // Activar slide actual e indicador
    if(slides[sliderIndex[oferta]]){
        slides[sliderIndex[oferta]].classList.add('active');
    }
    if(indicators[sliderIndex[oferta]]){
        indicators[sliderIndex[oferta]].classList.add('active');
    }
}
