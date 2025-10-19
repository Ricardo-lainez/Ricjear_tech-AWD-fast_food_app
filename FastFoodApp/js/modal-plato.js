// ...existing code...
document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('modalPlato');
  const modalImg = document.getElementById('modal-img');
  const modalNombre = document.getElementById('modal-nombre');
  const modalDescripcion = document.getElementById('modal-descripcion');
  const modalPrecio = document.getElementById('modal-precio');
  const modalCantidad = document.getElementById('modal-cantidad');
  const modalComentarios = document.getElementById('modal-comentarios');
  const modalAgregar = document.getElementById('modal-agregar');
  const modalClose = document.getElementById('modal-close');

  // Abrir modal al hacer click en un .item
  document.querySelectorAll('.lista-platos .item').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', function (e) {
      // evitar que clicks en links dentro interfieran
      if (e.target.tagName.toLowerCase() === 'a') e.preventDefault();

      const imgEl = item.querySelector('img');
      const enlaces = item.querySelectorAll('a');
      const nombre = enlaces[0] ? enlaces[0].textContent.trim() : '';
      const precio = enlaces[1] ? enlaces[1].textContent.trim() : '';
      const descripcion = item.getAttribute('data-descripcion') || item.getAttribute('data-contenido') || imgEl.alt || '';

      modalImg.src = imgEl ? imgEl.src : '';
      modalImg.alt = nombre;
      modalNombre.textContent = nombre;
      modalPrecio.textContent = precio;
      modalDescripcion.textContent = descripcion;
      modalCantidad.value = 1;
      modalComentarios.value = '';

      modal.style.display = 'block';
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  // Cerrar modal
  function closeModal() {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }
  modalClose.addEventListener('click', closeModal);
  window.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  // Botón agregar (aquí puedes añadir al carrito, localStorage, petición fetch, etc.)
  modalAgregar.addEventListener('click', function () {
    const item = {
      nombre: modalNombre.textContent,
      precio: modalPrecio.textContent,
      cantidad: Number(modalCantidad.value) || 1,
      comentarios: modalComentarios.value || '',
      img: modalImg.src
    };
    // Ejemplo simple: guardar en localStorage "cart" (array)
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));

    // respuesta breve al usuario (puedes reemplazar por UI)
    alert('Agregado: ' + item.nombre + ' x' + item.cantidad);
    closeModal();
  });
});
// ...existing code...