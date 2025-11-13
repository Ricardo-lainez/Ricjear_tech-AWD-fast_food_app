/**
 * ========================================
 * MODAL DE PRODUCTOS - BOCATTO VALLEY
 * ========================================
 * Modal dinámico para mostrar detalles de productos,
 * seleccionar extras, cantidad y agregar al carrito
 */

document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('modalPlato');
  const modalImg = document.getElementById('modal-img');
  const modalNombre = document.getElementById('modal-nombre');
  const modalNombreDetalle = document.getElementById('modal-nombre-detalle');
  const modalDescripcion = document.getElementById('modal-descripcion');
  const modalPrecio = document.getElementById('modal-precio');
  const modalCantidad = document.getElementById('modal-cantidad');
  const modalComentarios = document.getElementById('modal-comentarios');
  const modalAgregar = document.getElementById('modal-agregar');
  const modalClose = document.getElementById('modal-close');
  
  // Elementos para el cálculo de precios
  const precioBaseValor = document.getElementById('precio-base-valor');
  const precioExtrasValor = document.getElementById('precio-extras-valor');
  const precioTotalValor = document.getElementById('precio-total-valor');
  const checkboxExtras = document.querySelectorAll('.extra-item input[type="checkbox"]');
  const extrasSection = document.querySelector('.extras-section');
  
  let precioBase = 0;

  // Función para calcular precios
  function calcularPrecios() {
    let precioExtras = 0;
    
    checkboxExtras.forEach(checkbox => {
      if (checkbox.checked) {
        precioExtras += parseFloat(checkbox.dataset.precio) || 0;
      }
    });
    
    const cantidad = parseInt(modalCantidad.value) || 1;
    const subtotal = precioBase + precioExtras;
    const total = subtotal * cantidad;
    
    if (precioBaseValor) precioBaseValor.textContent = `$${precioBase.toFixed(2)}`;
    if (precioExtrasValor) precioExtrasValor.textContent = `$${precioExtras.toFixed(2)}`;
    if (precioTotalValor) precioTotalValor.textContent = `$${total.toFixed(2)}`;
  }

  // Función para limpiar extras seleccionados
  function limpiarExtras() {
    checkboxExtras.forEach(checkbox => {
      checkbox.checked = false;
    });
  }

  // Función para mostrar/ocultar extras según la categoría
  function manejarExtrasSegunCategoria(categoria) {
    // Categorías que NO deben mostrar extras
    const categoriasSinExtras = ['Postres', 'Bebidas', 'Cócteles'];
    
    if (extrasSection) {
      if (categoriasSinExtras.includes(categoria)) {
        extrasSection.style.display = 'none';
        console.log(`Ocultando extras para categoría: ${categoria}`);
      } else {
        extrasSection.style.display = 'block';
        console.log(`Mostrando extras para categoría: ${categoria}`);
      }
    }
  }

  // Event listeners para recalcular precios
  checkboxExtras.forEach(checkbox => {
    checkbox.addEventListener('change', calcularPrecios);
  });
  
  if (modalCantidad) {
    modalCantidad.addEventListener('input', calcularPrecios);
  }

  // Función para configurar el modal con datos del producto (llamada desde menu.js)
  window.configurarModalProducto = function(producto) {
    if (!producto || !modal) return;
    
    // Configurar datos básicos
    if (modalImg) {
      modalImg.src = producto.img || producto.image || '../images/placeholder-food.jpg';
      modalImg.alt = producto.name;
    }
    if (modalNombre) modalNombre.textContent = producto.name;
    if (modalNombreDetalle) modalNombreDetalle.textContent = producto.name;
    if (modalDescripcion) modalDescripcion.textContent = producto.description || 'Deliciosa opción de nuestro menú';
    if (modalPrecio) modalPrecio.textContent = `$${producto.price.toFixed(2)}`;
    if (modalCantidad) modalCantidad.value = 1;
    if (modalComentarios) modalComentarios.value = '';

    // Configurar precio base
    precioBase = parseFloat(producto.price) || 0;
    
    // Manejar extras según la categoría
    manejarExtrasSegunCategoria(producto.category);
    
    // Limpiar extras y recalcular
    limpiarExtras();
    calcularPrecios();
    
    // Bloquear scroll del body
    document.body.style.overflow = 'hidden';
    
    // Mostrar modal
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    
    // Guardar referencia del producto actual
    window.productoModalActual = producto;
  };

  // Exponer función de cálculo globalmente
  window.calcularPreciosModal = calcularPrecios;

  // Cerrar modal
  function closeModal() {
    if (modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      
      // Restaurar scroll del body
      document.body.style.overflow = 'auto';
    }
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  
  window.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });
  
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  // Botón agregar al carrito
  if (modalAgregar) {
    modalAgregar.addEventListener('click', function () {
      // Verificar si el usuario está autenticado
      const usuario = window.authService?.getCurrentUser();
      if (!usuario) {
        alert('Debes iniciar sesión para agregar productos al carrito');
        closeModal();
        const loginModal = document.getElementById('loginModal');
        if (loginModal) loginModal.style.display = 'flex';
        return;
      }

      // Verificar que tenemos el producto actual
      if (!window.productoModalActual) {
        console.error('No hay producto seleccionado');
        alert('Error: No se puede agregar el producto');
        return;
      }

      const producto = window.productoModalActual;
      
      // Obtener extras seleccionados
      const extrasSeleccionados = [];
      let precioExtras = 0;
      
      checkboxExtras.forEach(checkbox => {
        if (checkbox.checked) {
          const label = checkbox.nextElementSibling;
          const nombreExtra = label.textContent.split('+$')[0].trim();
          const precioExtra = parseFloat(checkbox.dataset.precio) || 0;
          
          extrasSeleccionados.push({
            nombre: nombreExtra,
            precio: precioExtra
          });
          precioExtras += precioExtra;
        }
      });
      
      const cantidad = Number(modalCantidad.value) || 1;
      const precioUnitario = precioBase + precioExtras;
      const precioTotal = precioUnitario * cantidad;
      
      const itemCarrito = {
        id: producto._id,
        nombre: producto.name,
        categoria: producto.category,
        descripcion: producto.description,
        imagen: producto.img || producto.image,
        precioBase: precioBase,
        extras: extrasSeleccionados,
        precioExtras: precioExtras,
        precioUnitario: precioUnitario,
        cantidad: cantidad,
        precioTotal: precioTotal,
        comentarios: modalComentarios ? modalComentarios.value || '' : '',
        fechaAgregado: new Date().toISOString()
      };
      
      // Guardar en localStorage
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push(itemCarrito);
        localStorage.setItem('cart', JSON.stringify(cart));

        // Mostrar confirmación
        let mensaje = `✅ Agregado: ${itemCarrito.nombre} x${itemCarrito.cantidad}`;
        if (extrasSeleccionados.length > 0) {
          mensaje += ` (con ${extrasSeleccionados.length} extra${extrasSeleccionados.length > 1 ? 's' : ''})`;
        }
        mensaje += `\n💰 Total: $${precioTotal.toFixed(2)}`;
        
        alert(mensaje);
        
        // Disparar evento personalizado para actualizar contador del carrito si existe
        window.dispatchEvent(new CustomEvent('carritoActualizado', { 
          detail: { itemsCount: cart.length, total: cart.reduce((sum, item) => sum + item.precioTotal, 0) }
        }));
        
        closeModal();
      } catch (error) {
        console.error('Error guardando en carrito:', error);
        alert('Error al agregar al carrito. Inténtalo de nuevo.');
      }
    });
  }
});