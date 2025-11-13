// ==========================================
// CONFIGURACIÓN Y ESTADO GLOBAL
// ==========================================
const API_BASE_URL = 'http://localhost:3000/api';
let productosData = [];
let productosFiltrados = [];
let paginaActual = 1;
const productosPorPagina = 10;
let productoIdEliminar = null;
let buscarTimer = null;
const BUSCAR_DEBOUNCE_MS = 150;
let lastRenderKey = '';

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    inicializarEventListeners();
});

function inicializarEventListeners() {
    // Cerrar modales al hacer clic fuera
    window.onclick = (event) => {
        const modalProducto = document.getElementById('productoModal');
        const modalDelete = document.getElementById('deleteModal');
        
        if (event.target === modalProducto) {
            cerrarModal();
        }
        if (event.target === modalDelete) {
            cerrarModalDelete();
        }
    };
}

// ==========================================
// CRUD - READ (Cargar productos)
// ==========================================
async function cargarProductos() {
    try {
        mostrarCargando();
        
        // Simulación de llamada a API (reemplazar con fetch real)
        // const response = await fetch(`${API_BASE_URL}/products`);
        // const data = await response.json();
        
        // Datos de ejemplo mientras se conecta al backend
        productosData = generarProductosEjemplo();
        productosFiltrados = [...productosData];
        
        renderizarProductos();
    } catch (error) {
        console.error('Error al cargar productos:', error);
        mostrarError('Error al cargar los productos. Intenta nuevamente.');
    }
}

function generarProductosEjemplo() {
    return [
        {
            id: 1,
            nombre: 'Hamburguesa Clásica',
            categoria: 'Platos Principales',
            precio: 8.99,
            stock: 45,
            disponible: true,
            descripcion: 'Deliciosa hamburguesa con carne de res, lechuga, tomate y queso',
            imagen: '../images/platos/platos2.0/hmb_platos_1.jpg'
        },
        {
            id: 2,
            nombre: 'Alitas BBQ',
            categoria: 'Entradas',
            precio: 6.50,
            stock: 30,
            disponible: true,
            descripcion: 'Alitas crujientes con salsa barbecue casera',
            imagen: '../images/platos/platos2.0/alitas_clasicas_platos.jpg'
        },
        {
            id: 3,
            nombre: 'Coca Cola',
            categoria: 'Bebidas',
            precio: 2.50,
            stock: 100,
            disponible: true,
            descripcion: 'Refresco clásico 500ml',
            imagen: '../images/platos/bebidas/pepsi.jpg'
        },
        {
            id: 4,
            nombre: 'Brownie con Helado',
            categoria: 'Postres',
            precio: 5.99,
            stock: 20,
            disponible: true,
            descripcion: 'Brownie de chocolate caliente con helado de vainilla',
            imagen: '../images/platos/postres/brownie.jpg'
        },
        {
            id: 5,
            nombre: 'Combo Familiar',
            categoria: 'Combos',
            precio: 29.99,
            stock: 15,
            disponible: true,
            descripcion: '4 hamburguesas + papas fritas grandes + 4 bebidas',
            imagen: '../images/platos/Combos_Especialidades/combo1.jpg'
        }
    ];
}

function mostrarCargando() {
    const tbody = document.getElementById('productosTableBody');
    tbody.innerHTML = `
        <tr>
            <td colspan="8" class="loading-row">
                <i class="fas fa-spinner fa-spin"></i> Cargando productos...
            </td>
        </tr>
    `;
}

function mostrarError(mensaje) {
    const tbody = document.getElementById('productosTableBody');
    tbody.innerHTML = `
        <tr>
            <td colspan="8" class="loading-row">
                <i class="fas fa-exclamation-circle" style="color: var(--danger-color);"></i> ${mensaje}
            </td>
        </tr>
    `;
}

// ==========================================
// RENDERIZADO DE PRODUCTOS
// ==========================================
function renderizarProductos() {
    const tbody = document.getElementById('productosTableBody');

    if (productosFiltrados.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="loading-row">
                    <i class="fas fa-inbox"></i> No se encontraron productos
                </td>
            </tr>
        `;
        return;
    }

    const inicio = (paginaActual - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    const productosPagina = productosFiltrados.slice(inicio, fin);

    // Evitar rerender si nada cambió
    const currentKey = `${paginaActual}|${productosFiltrados.length}|` + productosPagina.map(p => `${p.id}-${p.precio}-${p.stock}-${p.disponible?1:0}`).join('|');
    if (currentKey === lastRenderKey) {
        return;
    }
    lastRenderKey = currentKey;

    const rows = productosPagina.map(producto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>#${producto.id}</strong></td>
            <td>
                 <img src="${producto.imagen || '../images/placeholder.jpg'}" 
                     alt="${producto.nombre}" 
                     loading="lazy" width="50" height="50"
                     onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Crect width='100%25' height='100%25' fill='%23eaeef3'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='10' fill='%2399a3b1'%3ENo Img%3C/text%3E%3C/svg%3E'">
            </td>
            <td><strong>${producto.nombre}</strong></td>
            <td>${producto.categoria}</td>
            <td><strong>$${producto.precio.toFixed(2)}</strong></td>
            <td>${producto.stock} unidades</td>
            <td>
                <span class="badge ${producto.disponible ? 'badge-success' : 'badge-danger'}">
                    <i class="fas ${producto.disponible ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                    ${producto.disponible ? 'Disponible' : 'No disponible'}
                </span>
            </td>
            <td>
                <div class="action-btns">
                    <button class="btn-icon btn-edit" onclick="editarProducto(${producto.id})" title="Editar producto">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="confirmarEliminarProducto(${producto.id})" title="Eliminar producto">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>`;
        return tr;
    });
        requestAnimationFrame(() => {
            tbody.replaceChildren(...rows);
            actualizarPaginacion();
        });
}

function actualizarPaginacion() {
    const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
    const paginationInfo = document.getElementById('paginationInfo');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    
    paginationInfo.textContent = `Página ${paginaActual} de ${totalPaginas || 1}`;
    btnPrev.disabled = paginaActual === 1;
    btnNext.disabled = paginaActual >= totalPaginas;
}

function cambiarPagina(direccion) {
    const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
    
    paginaActual += direccion;
    if (paginaActual < 1) paginaActual = 1;
    if (paginaActual > totalPaginas) paginaActual = totalPaginas;
    
    renderizarProductos();
    window.scrollTo({ top: 0, behavior: 'auto' });
}

// ==========================================
// BÚSQUEDA Y FILTROS
// ==========================================
function buscarProductos() {
    if (buscarTimer) clearTimeout(buscarTimer);
    buscarTimer = setTimeout(() => {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
        const categoriaFiltro = document.getElementById('filterCategoria').value;

        productosFiltrados = productosData.filter(producto => {
            const coincideBusqueda = producto.nombre.toLowerCase().includes(searchTerm) ||
                                    producto.descripcion.toLowerCase().includes(searchTerm);
            const coincideCategoria = !categoriaFiltro || producto.categoria === categoriaFiltro;
            return coincideBusqueda && coincideCategoria;
        });

        paginaActual = 1;
        renderizarProductos();
    }, BUSCAR_DEBOUNCE_MS);
}

function filtrarPorCategoria() {
    buscarProductos();
}

// ==========================================
// CRUD - CREATE & UPDATE
// ==========================================
function abrirModalCrear() {
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-plus-circle"></i> Nuevo Producto';
    document.getElementById('productoForm').reset();
    document.getElementById('productoId').value = '';
    limpiarErrores();
    mostrarModal();
}

function editarProducto(id) {
    const producto = productosData.find(p => p.id === id);
    if (!producto) return;

    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Editar Producto';
    document.getElementById('productoId').value = producto.id;
    document.getElementById('nombre').value = producto.nombre;
    document.getElementById('categoria').value = producto.categoria;
    document.getElementById('precio').value = producto.precio;
    document.getElementById('stock').value = producto.stock;
    document.getElementById('descripcion').value = producto.descripcion || '';
    document.getElementById('imagen').value = producto.imagen || '';
    document.getElementById('disponible').checked = !!producto.disponible;
    limpiarErrores();
    mostrarModal();
}

async function guardarProducto(event) {
    event.preventDefault();
    if (!validarFormulario()) return;

    const productoId = document.getElementById('productoId').value;
    const productoData = obtenerDatosFormulario();

    try {
        if (productoId) {
            await actualizarProducto(productoId, productoData);
        } else {
            await crearProducto(productoData);
        }
        mostrarToast('Producto guardado exitosamente', 'success');
        cerrarModal();
        await cargarProductos();
    } catch (error) {
        console.error('Error al guardar producto:', error);
        mostrarToast('Error al guardar el producto', 'error');
    }
}

async function crearProducto(productoData) {
    // Simulación - reemplazar con fetch real
    // const response = await fetch(`${API_BASE_URL}/products`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(productoData)
    // });
    
    const nuevoId = Math.max(...productosData.map(p => p.id), 0) + 1;
    productosData.push({ ...productoData, id: nuevoId });
}

async function actualizarProducto(id, productoData) {
    // Simulación - reemplazar con fetch real
    // const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(productoData)
    // });
    
    const index = productosData.findIndex(p => p.id == id);
    if (index !== -1) {
        productosData[index] = { ...productoData, id: parseInt(id) };
    }
}

function obtenerDatosFormulario() {
    return {
        nombre: document.getElementById('nombre').value.trim(),
        categoria: document.getElementById('categoria').value,
        precio: parseFloat(document.getElementById('precio').value),
        stock: parseInt(document.getElementById('stock').value),
        descripcion: document.getElementById('descripcion').value.trim(),
        imagen: document.getElementById('imagen').value.trim(),
        disponible: document.getElementById('disponible').checked
    };
}

// ==========================================
// CRUD - DELETE
// ==========================================
function confirmarEliminarProducto(id) {
    const producto = productosData.find(p => p.id === id);
    if (!producto) return;
    
    productoIdEliminar = id;
    document.getElementById('deleteProductName').textContent = producto.nombre;
    mostrarModalDelete();
}

async function confirmarEliminar() {
    if (!productoIdEliminar) return;
    
    try {
        await eliminarProducto(productoIdEliminar);
        mostrarToast('Producto eliminado exitosamente', 'success');
        cerrarModalDelete();
        await cargarProductos();
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        mostrarToast('Error al eliminar el producto', 'error');
    }
}

async function eliminarProducto(id) {
    // Simulación - reemplazar con fetch real
    // const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    //     method: 'DELETE'
    // });
    
    const index = productosData.findIndex(p => p.id == id);
    if (index !== -1) {
        productosData.splice(index, 1);
    }
}

// ==========================================
// VALIDACIONES
// ==========================================
function validarFormulario() {
    limpiarErrores();
    let esValido = true;
    
    const nombre = document.getElementById('nombre').value.trim();
    const categoria = document.getElementById('categoria').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const stock = parseInt(document.getElementById('stock').value);
    
    // Validar nombre
    if (nombre.length < 3) {
        mostrarErrorCampo('errorNombre', 'El nombre debe tener al menos 3 caracteres');
        esValido = false;
    }
    
    // Validar categoría
    if (!categoria) {
        mostrarErrorCampo('errorCategoria', 'Debes seleccionar una categoría');
        esValido = false;
    }
    
    // Validar precio
    if (isNaN(precio) || precio <= 0) {
        mostrarErrorCampo('errorPrecio', 'El precio debe ser mayor a 0');
        esValido = false;
    }
    
    // Validar stock
    if (isNaN(stock) || stock < 0) {
        mostrarErrorCampo('errorStock', 'El stock no puede ser negativo');
        esValido = false;
    }
    
    return esValido;
}

function mostrarErrorCampo(elementId, mensaje) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = mensaje;
    }
}

function limpiarErrores() {
    const errores = document.querySelectorAll('.form-error');
    errores.forEach(error => error.textContent = '');
}

// ==========================================
// CONTROL DE MODALES
// ==========================================
function mostrarModal() {
    document.getElementById('productoModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function cerrarModal() {
    document.getElementById('productoModal').classList.remove('show');
    document.body.style.overflow = 'auto';
    document.getElementById('productoForm').reset();
    limpiarErrores();
}

function mostrarModalDelete() {
    document.getElementById('deleteModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function cerrarModalDelete() {
    document.getElementById('deleteModal').classList.remove('show');
    document.body.style.overflow = 'auto';
    productoIdEliminar = null;
}

// ==========================================
// NOTIFICACIONES (TOAST)
// ==========================================
function mostrarToast(mensaje, tipo = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = mensaje;
    
    // Cambiar color según el tipo
    if (tipo === 'error') {
        toast.style.background = 'linear-gradient(135deg, var(--danger-color) 0%, #c0392b 100%)';
    } else {
        toast.style.background = 'linear-gradient(135deg, var(--success-color) 0%, #229954 100%)';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==========================================
// UTILIDADES
// ==========================================
function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-EC', {
        style: 'currency',
        currency: 'USD'
    }).format(precio);
}

function formatearFecha(fecha) {
    return new Intl.DateTimeFormat('es-EC', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(fecha));
}
