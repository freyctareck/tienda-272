// ==========================================
// TIENDA 272 - LÓGICA DE TIENDA Y CHECKOUT
// ==========================================

// Configuración de la tienda
const TIENDA_CONFIG = {
  telefonoWA: "522722796693", // Teléfono oficial Tienda 272
  emailContacto: "tienda272@outlook.com"
};

// Cargar productos desde productos.json
async function obtenerProductos() {
  try {
    const respuesta = await fetch('productos.json');
    if (!respuesta.ok) throw new Error('No se pudo cargar el archivo productos.json');
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error('Error cargando el catálogo:', error);
    return [];
  }
}

// Generar enlace directo de compra por WhatsApp
function construirLinkWhatsApp(producto) {
  const mensaje = `Hola Tienda 272 🛒%0A` +
                  `Me interesa realizar un pedido del siguiente producto:%0A%0A` +
                  `📌 *Producto:* ${encodeURIComponent(producto.titulo)}%0A` +
                  `💰 *Precio de Oferta:* $${producto.precio_oferta} MXN%0A` +
                  `🏷️ *Código SKU:* ${producto.id}%0A%0A` +
                  `¿Me podrías indicar los pasos para confirmar el pago y la entrega?`;
  
  return `https://wa.me/${TIENDA_CONFIG.telefonoWA}?text=${mensaje}`;
}

// Renderizar catálogo en la página principal (index.html)
async function renderizarCatalogoIndex() {
  const contenedor = document.getElementById('catalog-container');
  if (!contenedor) return; // Si no estamos en index.html, omitir

  const productos = await obtenerProductos();

  if (productos.length === 0) {
    contenedor.innerHTML = `<p style="text-align:center; grid-column: 1/-1;">No hay productos disponibles por el momento.</p>`;
    return;
  }

  // Generar HTML dinámico por cada producto en productos.json
  contenedor.innerHTML = productos.map(prod => `
    <article class="product-item-card">
      <div class="product-badges" style="justify-content: center;">
        ${prod.descuento_porcentaje ? `<span class="badge">AHORRAS ${prod.descuento_porcentaje}</span>` : ''}
        ${prod.envio_gratis ? `<span class="badge badge-free-shipping">ENVÍO GRATIS</span>` : ''}
      </div>
      <img src="${prod.imagen_principal}" alt="${prod.titulo}">
      <h3>${prod.titulo}</h3>
      <p style="font-size: 1.25rem; font-weight: 800; color: var(--dark-bg); margin: 8px 0;">
        $${prod.precio_oferta} MXN
      </p>
      <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 12px;">
        <a href="producto.html?id=${prod.id}">
          <button class="btn-buy" style="padding: 10px; font-size: 0.95rem; background-color: var(--dark-bg);">
            🔍 VER DETALLES (MICROSITIO)
          </button>
        </a>
        <a href="${construirLinkWhatsApp(prod)}" target="_blank" style="text-decoration:none;">
          <button class="btn-buy" style="padding: 10px; font-size: 0.95rem; background-color: #25D366;">
            💬 COMPRAR DATO DIRECTO
          </button>
        </a>
      </div>
    </article>
  `).join('');
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  renderizarCatalogoIndex();
});

// ==========================================
// TEMPORIZADOR DINÁMICO DE OFERTA (BLEAME STYLE)
// ==========================================
function iniciarTimerOferta() {
  const displayTimer = document.getElementById('banner-timer');
  if (!displayTimer) return;

  // Tiempo inicial de 15 minutos (900 segundos)
  let tiempoRestante = 900; 

  const intervalo = setInterval(() => {
    let minutos = Math.floor(tiempoRestante / 60);
    let segundos = tiempoRestante % 60;

    segundos = segundos < 10 ? '0' + segundos : segundos;
    displayTimer.textContent = `${minutos}m ${segundos}s`;

    if (--tiempoRestante < 0) {
      tiempoRestante = 900; // Reinicia el ciclo para mantener la oferta activa
    }
  }, 1000);
}

// Asegurar que se ejecute la función al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
  iniciarTimerOferta();
  renderizarCatalogoIndex();
});
