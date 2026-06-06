let carrito = [];

// agregar productos al carro
function agregarAlCarrito(nombre, precio) {
    //Busca si el producto ya esta en el carrito
    const productoExiste = carrito.find(item => item.nombre === nombre);

    if(productoExiste) {
        productoExiste.cantidad++;
    }else{
        carrito.push({
            nombre:nombre,
            precio:precio,
            cantidad: 1
        });
    }

    actualizarCarrito();
    mostrarToast(nombre);
}

// Actualizar visual del carrito

function actualizarCarrito(){
    const contenedor = document.getElementById('carrito-items');
    const contador = document.getElementById('contador-carrito');
    const totalEl = document.getElementById('total-precio');

    // Cuenta total de items
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    contador.textContent = totalItems;

    // Calcula total de precio
    const totalPrecio = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    totalEl.textContent = '$' + totalPrecio.toLocaleString('es-CO') + ' COP';

    // Si el carrito está vacío
    if (carrito.length === 0) {
        contenedor.innerHTML = `
        <div class="text-center text-muted py-5">
            <div style="font-size:3rem">🛒</div>
            <p class="mt-2">Tu carrito está vacío</p>
        </div>
        `;
    return;
  }

   // Dibuja cada item del carrito
  contenedor.innerHTML = carrito.map(item => `
    <div class="carrito-item">
      <div>
        <p class="mb-0 fw-bold">${item.nombre}</p>
        <small class="text-muted">
          $${item.precio.toLocaleString('es-CO')} x ${item.cantidad}
        </small>
      </div>
      <div class="d-flex align-items-center gap-2">
        <span class="fw-bold">
          $${(item.precio * item.cantidad).toLocaleString('es-CO')}
        </span>
        <button onclick="eliminarDelCarrito('${item.nombre}')" title="Eliminar">✕</button>
      </div>
    </div>
  `).join('');
}

//Eliminar del carrito

function eliminarDelCarrito(nombre) {
  carrito = carrito.filter(item => item.nombre !== nombre);
  actualizarCarrito();
}

//Abrir y cerrar carrito

function abrirCarrito() {
  document.getElementById('carrito-panel').classList.add('abierto');
  document.getElementById('overlay').classList.add('activo');
  actualizarCarrito();
}

function cerrarCarrito() {
  document.getElementById('carrito-panel').classList.remove('abierto');
  document.getElementById('overlay').classList.remove('activo');
}

// Notificación al agregar 
function mostrarToast(nombre) {
  // Si ya existe un toast lo elimina
  const toastViejo = document.getElementById('toast-carrito');
  if (toastViejo) toastViejo.remove();

  // Crea el toast
  const toast = document.createElement('div');
  toast.id = 'toast-carrito';
  toast.innerHTML = `✅ <strong>${nombre}</strong> agregado al carrito`;
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: #0a0a0a;
    color: #f5c518;
    padding: .75rem 1.5rem;
    border-radius: 50px;
    font-size: .9rem;
    z-index: 9999;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    animation: fadeInUp .3s ease;
  `;

  document.body.appendChild(toast);

  // Lo elimina después de 2.5 segundos
  setTimeout(() => toast.remove(), 2500);
}

// Animación del toast
const estiloToast = document.createElement('style');
estiloToast.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
`;
document.head.appendChild(estiloToast);

//Modal de pago

function irAPago() {
  if (carrito.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }

  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  document.getElementById('resumen-pago').textContent =
    `Total a pagar: $${total.toLocaleString('es-CO')} COP`;

  cerrarCarrito();
  document.getElementById('modal-pago').classList.add('activo');
}

function cerrarPago() {
  document.getElementById('modal-pago').classList.remove('activo');
}

// Procesar pago (simulando)

function procesarPago() {
  const nombre = document.getElementById('nombre-tarjeta').value;
  const numero = document.getElementById('numero-tarjeta').value;
  const expiracion = document.getElementById('expiracion').value;
  const cvv = document.getElementById('cvv').value;

  // Validación básica
  if (!nombre || !numero || !expiracion || !cvv) {
    alert('Por favor completa todos los campos');
    return;
  }

  if (numero.length < 16) {
    alert('El número de tarjeta debe tener 16 dígitos');
    return;
  }

  // Simulación de pago exitoso
  cerrarPago();

  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  // Limpia el carrito
  carrito = [];
  actualizarCarrito();

  // Muestra confirmación
  setTimeout(() => {
    alert(`🎉 ¡Pago exitoso!\n\nGracias ${nombre}.\nTu pedido por $${total.toLocaleString('es-CO')} COP ha sido procesado.\n\nRecibirás un correo de confirmación pronto.`);
  }, 300);
}

//Formulario de contacto

function enviarFormulario(event) {
  event.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const correo = document.getElementById('correo').value;

  alert(`✅ Mensaje recibido, ${nombre}.\n\nTe responderemos a ${correo} pronto.`);
  event.target.reset();
}

//Formateo automatico tarjeta

document.addEventListener('DOMContentLoaded', function() {

  // Formato número tarjeta: 1234 5678 9012 3456
  const inputNumero = document.getElementById('numero-tarjeta');
  if (inputNumero) {
    inputNumero.addEventListener('input', function() {
      let valor = this.value.replace(/\D/g, ''); // solo números
      valor = valor.match(/.{1,4}/g)?.join(' ') || valor;
      this.value = valor;
    });
  }

  // Formato vencimiento: MM/AA
  const inputExp = document.getElementById('expiracion');
  if (inputExp) {
    inputExp.addEventListener('input', function() {
      let valor = this.value.replace(/\D/g, '');
      if (valor.length >= 2) {
        valor = valor.slice(0,2) + '/' + valor.slice(2);
      }
      this.value = valor;
    });
  }

  // Solo números en CVV
  const inputCvv = document.getElementById('cvv');
  if (inputCvv) {
    inputCvv.addEventListener('input', function() {
      this.value = this.value.replace(/\D/g, '');
    });
  }

});
