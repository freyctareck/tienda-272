// ==========================================
// TIENDA 272 - LÓGICA DE TIENDA Y CATÁLOGO
// ==========================================

// Configuración global de la tienda
const TIENDA_CONFIG = {
  telefonoWA: "522722796693", // Teléfono oficial Tienda 272
  emailContacto: "tienda272@outlook.com"
};

// Variable para almacenar en memoria los productos cargados
let productosCache = [];

// Cargar productos dinámicamente desde productos.json
async function obtenerProductos() {
  if (productosCache.length > 0) return productosCache;
  
  try {
    const respuesta = await fetch('productos.json');
    if (!respuesta.ok) throw new Error('No se pudo cargar el archivo productos.json');
    productosCache = await respuesta.json();
    return productosCache;
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

// Renderizar el catálogo con soporte para filtros
function renderizarTarjetas(productos) {
  const contenedor = document.getElementById('catalog-container');
  if (!contenedor) return;

  if (productos.length === 0) {
    contenedor.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--gray-text); padding: 40px 0;">No se encontraron productos coincidentes.</p>`;
    return;
  }

  // Genera la retícula limpia y profesional usando las variables de tu estilos CSS
  contenedor.innerHTML = productos.map(prod => `
    <article class="product-card-unit">
      <div class="product-thumb-container">
        <img src="${prod.imagen_principal || prod.imagen}" alt="${prod.titulo}">
        ${prod.etiqueta ? `<span class="badge-top-left">\${prod.etiqueta}</span>` : ''}
      </div>
      <div class="product-info-body">
        <div class="product-rating">★★★★★ (${prod.rating || '4.9'})</div>
        <h3 class="product-item-title">${prod.titulo}</h3>
        <div class="product-item-price">
          <span class="price-main">$${prod.precio_oferta} MXN</span>
          ${prod.precio_regular ? `<span class="price-strike">\$\${prod.precio_regular} MXN</span>` : ''}
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: auto;">
          <a href="producto.html?id=${prod.id}" class="btn btn-primary btn-block btn-sm">VER DETALLES</a>
          <a href="${construirLinkWhatsApp(prod)}" target="_blank" class="btn btn-whatsapp btn-block btn-sm">
            💬 PEDIR POR WHATSAPP
          </a>
        </div>
      </div>
    </article>
  `).join('');
}

// Inicializar la carga del catálogo
async function inicializarCatalogo() {
  const productos = await obtenerProductos();
  renderizarTarjetas(productos);
}

// ==========================================
// FILTROS Y BÚSQUEDA EN TIEMPO REAL
// ==========================================

function filtrarCategoria(cat, elemento) {
  // Cambiar la clase activa visual en los botones de filtro
  document.querySelectorAll('.pill-btn').forEach(btn => btn.classList.remove('active'));
  if (elemento) elemento.classList.add('active');

  if (cat === 'todos') {
    renderizarTarjetas(productosCache);
  } else {
    const filtrados = productosCache.filter(p => p.categoria === cat);
    renderizarTarjetas(filtrados);
  }
}

function filtrarCatalogo() {
  const input = document.getElementById('catalog-search');
  if (!input) return;
  
  const texto = input.value.toLowerCase();
  const filtrados = productosCache.filter(p => p.titulo.toLowerCase().includes(texto));
  renderizarTarjetas(filtrados);
}

// ==========================================
// TEMPORIZADOR DINÁMICO DE OFERTA
// ==========================================

function iniciarTimerOferta() {
  const displayTimer = document.getElementById('banner-timer');
  if (!displayTimer) return;

  let tiempoRestante = 900; // 15 minutos

  setInterval(() => {
    let minutos = Math.floor(tiempoRestante / 60);
    let segundos = tiempoRestante % 60;

    segundos = segundos < 10 ? '0' + segundos : segundos;
    displayTimer.textContent = `${minutos}m ${segundos}s`;

    if (--tiempoRestante < 0) {
      tiempoRestante = 900;
    }
  }, 1000);
}

// Inicialización general al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  iniciarTimerOferta();
  inicializarCatalogo();
});
