// ==========================================
// TIENDA 272 - LÓGICA Y TEMPORIZADOR
// ==========================================

const TIENDA_CONFIG = {
  telefonoWA: "522722796693"
};

// Cargar productos desde productos.json
async function obtenerProductos() {
  try {
    const respuesta = await fetch('productos.json');
    if (!respuesta.ok) throw new Error('Error al acceder a productos.json');
    return await respuesta.json();
  } catch (error) {
    console.error('Error cargando productos:', error);
    return [];
  }
}

// Enlace WhatsApp
function construirLinkWhatsApp(producto) {
  const mensaje = `Hola Tienda 272 🛒%0A` +
                  `Deseo realizar el pedido del producto:%0A` +
                  `📌 *${encodeURIComponent(producto.titulo)}*%0A` +
                  `💰 *Precio:* $${producto.precio_oferta} MXN%0A` +
                  `🏷️ *SKU:* ${producto.id}`;
  return `https://wa.me/${TIENDA_CONFIG.telefonoWA}?text=${mensaje}`;
}

// Renderizado del Catálogo
async function renderizarCatalogoIndex() {
  const contenedor = document.getElementById('catalog-container');
  if (!contenedor) return;

  const productos = await obtenerProductos();

  if (productos.length === 0) {
    contenedor.innerHTML = `<p style="text-align:center; grid-column: 1/-1; color: var(--gray-text);">No hay productos disponibles actualmente.</p>`;
    return;
  }

  contenedor.innerHTML = productos.map(prod => `
    <article class="feature-card" style="text-align: left; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="position: relative; margin-bottom: 15px;">
          <img src="${prod.imagen_principal}" alt="${prod.titulo}" style="width: 100%; border-radius: 8px; object-fit: cover; height: 200px;">
          ${prod.descuento_porcentaje ? `<span class="badge-discount" style="position: absolute; top: 10px; left: 10px;">${prod.descuento_porcentaje} OFF</span>` : ''}
        </div>
        <h3 style="font-size: 1.1rem; margin-bottom: 8px;">${prod.titulo}</h3>
        <p style="color: var(--gray-text); font-size: 0.85rem; margin-bottom: 15px;">${prod.descripcion_corta}</p>
      </div>
      <div>
        <div style="margin-bottom: 15px;">
          <span style="font-size: 1.4rem; font-weight: 700; color: var(--primary-orange);">$${prod.precio_oferta} MXN</span>
          ${prod.precio_regular ? `<span style="font-size: 0.9rem; color: var(--gray-text); text-decoration: line-through; margin-left: 8px;">$${prod.precio_regular}</span>` : ''}
        </div>
        <a href="${construirLinkWhatsApp(prod)}" target="_blank" class="btn btn-whatsapp btn-block btn-sm">
          💬 Pedir por WhatsApp
        </a>
      </div>
    </article>
  `).join('');
}

// Temporizador Regresivo de Oferta (15 Minutos)
function iniciarTimerOferta() {
  const displayTimer = document.getElementById('banner-timer');
  if (!displayTimer) return;

  let tiempoRestante = 900; 

  setInterval(() => {
    let minutos = Math.floor(tiempoRestante / 60);
    let segundos = tiempoRestante % 60;
    segundos = segundos < 10 ? '0' + segundos : segundos;
    displayTimer.textContent = `${minutos}m ${segundos}s`;

    if (--tiempoRestante < 0) {
      tiempoRestante = 900; // Reinicio dinámico para mantener urgencia
    }
  }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
  iniciarTimerOferta();
  renderizarCatalogoIndex();
});
