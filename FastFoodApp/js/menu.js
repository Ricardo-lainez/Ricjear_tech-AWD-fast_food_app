/**
 * ========================================
 * MENÚ COMPLETO - BOCATTO VALLEY
 * ========================================
 * Maneja tanto el menú sticky como la carga dinámica de productos
 */

// Variables globales
let todosLosProductos = [];
let categoriaActual = 'Todo';

// ==========================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando funcionalidad completa del menú...');
    
    // Configurar menú sticky
    configurarMenuFijo();
    
    // Solo cargar productos dinámicos si estamos en la página de menú
    if (document.getElementById('productsList')) {
        cargarProductosDesdeAPI();
        configurarFiltrosCategorias();
    }
});

// ==========================================
// MENÚ STICKY (FUNCIONALIDAD ORIGINAL)
// ==========================================

function configurarMenuFijo() {
    var menu = document.getElementById('menu_list');
    if (menu) {
        var altura = menu.offsetTop;
        window.addEventListener('scroll', function(){
            if(window.pageYOffset > altura){
                menu.classList.add('menu_fixed');
            }else{
                menu.classList.remove('menu_fixed');
            }
        });
    }
}

// ==========================================
// CARGA DE PRODUCTOS DESDE API
// ==========================================

/**
 * Obtener todos los productos desde la API
 */
async function cargarProductosDesdeAPI() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const productsList = document.getElementById('productsList');
    
    try {
        console.log('Cargando productos desde API...');
        
        // Hacer petición a la API
        const response = await fetch(APP_CONFIG.getApiUrl(APP_CONFIG.API.PRODUCTS.ALL));
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
            todosLosProductos = data.data;
            console.log(`${todosLosProductos.length} productos cargados exitosamente`);
            
            // Ocultar spinner y mostrar productos
            loadingSpinner.style.display = 'none';
            mostrarProductos(todosLosProductos);
            
            // Cargar categorías dinámicamente
            cargarCategoriasDinamicas();
        } else {
            throw new Error('Respuesta de API inválida');
        }
        
    } catch (error) {
        console.error('Error cargando productos:', error);
        mostrarErrorCarga(error.message);
    }
}

/**
 * Mostrar productos en la interfaz
 */
function mostrarProductos(productos) {
    const productsList = document.getElementById('productsList');
    
    if (productos.length === 0) {
        productsList.innerHTML = '<p class="no-products">No se encontraron productos para esta categoría.</p>';
        return;
    }
    
    // Organizar productos por categoría
    const productosOrganizados = organizarPorCategorias(productos);
    
    let htmlContent = '';
    
    if (categoriaActual === 'Todo') {
        // Mostrar todas las categorías en el orden especificado
        const categoriasOrdenadas = obtenerCategoriasOrdenadas();
        
        categoriasOrdenadas.forEach(categoria => {
            if (productosOrganizados[categoria] && productosOrganizados[categoria].length > 0) {
                htmlContent += `<h2 class="categoria-header">${categoria}</h2>`;
                
                // Solo para "Platos principales o combos" mostrar subcategorías
                if (categoria === 'Platos principales o combos') {
                    const subcategorias = agruparPorSubcategorias(productosOrganizados[categoria]);
                    
                    Object.keys(subcategorias).forEach(subcategoria => {
                        if (subcategoria !== 'undefined' && subcategoria !== 'null' && subcategoria !== 'General') {
                            htmlContent += `<h3 class="subcategoria-platos">${subcategoria}</h3>`;
                        }
                        htmlContent += `<div class="categoria-productos">`;
                        subcategorias[subcategoria].forEach(producto => {
                            htmlContent += generarHTMLProducto(producto);
                        });
                        htmlContent += `</div>`;
                    });
                } else {
                    // Para otras categorías, mostrar productos normalmente
                    htmlContent += `<div class="categoria-productos">`;
                    productosOrganizados[categoria].forEach(producto => {
                        htmlContent += generarHTMLProducto(producto);
                    });
                    htmlContent += `</div>`;
                }
            }
        });
    } else {
        // Vista de categoría específica
        if (productosOrganizados[categoriaActual]) {
            // Si es la categoría de platos, mostrar subcategorías
            if (categoriaActual === 'Platos principales o combos') {
                const subcategorias = agruparPorSubcategorias(productosOrganizados[categoriaActual]);
                
                Object.keys(subcategorias).forEach(subcategoria => {
                    if (subcategoria !== 'undefined' && subcategoria !== 'null' && subcategoria !== 'General') {
                        htmlContent += `<h3 class="subcategoria-platos">${subcategoria}</h3>`;
                    }
                    htmlContent += `<div class="categoria-productos">`;
                    subcategorias[subcategoria].forEach(producto => {
                        htmlContent += generarHTMLProducto(producto);
                    });
                    htmlContent += `</div>`;
                });
            } else {
                // Para otras categorías específicas, mostrar normalmente
                htmlContent += `<div class="categoria-productos">`;
                productosOrganizados[categoriaActual].forEach(producto => {
                    htmlContent += generarHTMLProducto(producto);
                });
                htmlContent += `</div>`;
            }
        }
    }
    
    productsList.innerHTML = htmlContent;
}

/**
 * Organizar productos por categorías con orden específico
 */
function organizarPorCategorias(productos) {
    const organizados = {};
    
    productos.forEach(producto => {
        const categoria = producto.category;
        if (!organizados[categoria]) {
            organizados[categoria] = [];
        }
        organizados[categoria].push(producto);
    });
    
    return organizados;
}

/**
 * Obtener categorías en el orden correcto
 */
function obtenerCategoriasOrdenadas() {
    return [
        'Platos principales o combos',
        'Entradas y Snacks',
        'Postres',
        'Cócteles',
        'Bebidas'
    ];
}

/**
 * Agrupar productos por subcategorías
 */
function agruparPorSubcategorias(productos) {
    const agrupados = {};
    
    productos.forEach(producto => {
        const subcategoria = producto.subcategory || 'General';
        if (!agrupados[subcategoria]) {
            agrupados[subcategoria] = [];
        }
        agrupados[subcategoria].push(producto);
    });
    
    return agrupados;
}

/**
 * Generar HTML para un producto individual
 */
function generarHTMLProducto(producto) {
    return `
        <div class="item" 
             data-categoria="${producto.category}" 
             data-subcategoria="${producto.subcategory || ''}" 
             data-id="${producto._id}" 
             data-name="${producto.name}"
             data-price="${producto.price}"
             data-description="${producto.description}"
             data-image="${producto.img || producto.image}"
             data-extras='${JSON.stringify(producto.extras || [])}'
             onclick="abrirModalProducto('${producto._id}')" 
             style="cursor: pointer;">
            <img src="${producto.img}" alt="${producto.name}" onerror="this.src='../images/placeholder-food.jpg'">
            <div class="item-content">
                <h3 class="producto-nombre">${producto.name}</h3>
                <p class="producto-descripcion">${producto.description}</p>
                <div class="item-footer">
                    <span class="producto-precio">$${producto.price.toFixed(2)}</span>
                    <button class="btn-agregar" onclick="event.stopPropagation(); abrirModalProducto('${producto._id}')" ${!producto.available ? 'disabled' : ''}>
                        ${!producto.available ? 'No disponible' : 'Agregar'}
                    </button>
                </div>
            </div>
            ${!producto.available ? '<span class="no-disponible">No disponible</span>' : ''}
            ${producto.tags && producto.tags.includes('popular') ? '<span class="producto-popular">Popular</span>' : ''}
        </div>
    `;
}

// ==========================================
// MODAL DE PRODUCTO
// ==========================================

/**
 * Función para abrir el modal de un producto específico
 */
function abrirModalProducto(productId) {
    console.log('Abriendo modal para producto ID:', productId);
    
    // Buscar el producto en todosLosProductos
    const producto = todosLosProductos.find(p => p._id === productId);
    
    if (!producto) {
        console.error('Producto no encontrado:', productId);
        alert('Error: Producto no encontrado');
        return;
    }
    
    // Verificar si el producto está disponible
    if (!producto.available) {
        alert('Este producto no está disponible en este momento');
        return;
    }
    
    // Usar la función del modal-plato.js si está disponible
    if (window.configurarModalProducto) {
        window.configurarModalProducto(producto);
    } else {
        console.error('Sistema de modal no inicializado');
        alert('Error: No se puede mostrar el detalle del producto');
    }
}

// Exponer funciones globalmente
window.abrirModalProducto = abrirModalProducto;

// ==========================================
// FILTROS DE CATEGORÍAS
// ==========================================

/**
 * Configurar eventos de los filtros de categorías
 */
function configurarFiltrosCategorias() {
    const filtros = document.querySelectorAll('.tipo-item');
    
    filtros.forEach(filtro => {
        filtro.addEventListener('click', function() {
            const categoria = this.dataset.categoria;
            
            // Actualizar estado visual
            filtros.forEach(f => f.classList.remove('tipo-item_activado'));
            this.classList.add('tipo-item_activado');
            
            // Filtrar productos
            filtrarPorCategoria(categoria);
        });
    });
}

/**
 * Filtrar productos por categoría
 */
async function filtrarPorCategoria(categoria) {
    categoriaActual = categoria;
    
    try {
        if (categoria === 'Todo') {
            mostrarProductos(todosLosProductos);
        } else {
            console.log(`Filtrando por categoría: ${categoria}`);
            
            // Filtrar localmente (más rápido)
            const productosFiltrados = todosLosProductos.filter(p => p.category === categoria);
            mostrarProductos(productosFiltrados);
        }
    } catch (error) {
        console.error('Error filtrando productos:', error);
    }
}

/**
 * Cargar categorías disponibles dinámicamente
 */
async function cargarCategoriasDinamicas() {
    try {
        const response = await fetch(APP_CONFIG.getApiUrl(APP_CONFIG.API.PRODUCTS.CATEGORIES));
        const data = await response.json();
        
        if (data.success && data.data) {
            console.log('Categorías disponibles:', data.data);
        }
    } catch (error) {
        console.error('Error cargando categorías:', error);
    }
}

// ==========================================
// MANEJO DE ERRORES
// ==========================================

/**
 * Mostrar mensaje de error en la carga
 */
function mostrarErrorCarga(mensaje) {
    const productsList = document.getElementById('productsList');
    productsList.innerHTML = `
        <div class="error-container">
            <h3>Error cargando el menú</h3>
            <p>${mensaje}</p>
            <button onclick="cargarProductosDesdeAPI()" class="btn-retry">🔄 Reintentar</button>
        </div>
    `;
}

// ==========================================
// BÚSQUEDA DE PRODUCTOS (OPCIONAL)
// ==========================================

/**
 * Buscar productos por texto
 */
async function buscarProductos(texto) {
    try {
        if (!texto || texto.length < 2) {
            mostrarProductos(todosLosProductos);
            return;
        }
        
        const response = await fetch(APP_CONFIG.getApiUrl(APP_CONFIG.API.PRODUCTS.SEARCH + '?q=' + encodeURIComponent(texto)));
        const data = await response.json();
        
        if (data.success) {
            console.log(`🔍 Encontrados ${data.count} productos para "${texto}"`);
            mostrarProductos(data.data);
        }
    } catch (error) {
        console.error('Error en búsqueda:', error);
    }
}

// Exponer funciones globalmente si es necesario
window.buscarProductos = buscarProductos;
window.filtrarPorCategoria = filtrarPorCategoria;