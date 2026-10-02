import { TIPOS } from '../datos/tipos.js'

import { diasHasta, estadoDe, textoDias, aFecha } from '../utilidades/fechas.js'

import { pesos } from '../utilidades/formato.js'

export function TarjetaVencimiento(v) {
  const tipo = TIPOS[v.tipo] || TIPOS.otro;
  const dias = diasHasta(v.vence);
  const estado = estadoDe(dias);

  const fechaLegible = aFecha(v.vence).toLocaleDateString('es-AR', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return `
    <article class="tarjeta venc ${estado}">
      <span class="emoji">${tipo.emoji}</span>
      <div class="info">
        <h3>${tipo.nombre}</h3>
        ${v.detalle ? `<p class="detalle">` + v.detalle + `</p>` : ''}
        <p class="cuando">${textoDias(dias)}</p>
        <p class="fecha">${fechaLegible} · ${pesos(v.costo)}</p>
      </div>
      <div class="acciones">
        <button class="btn chico" data-accion="pagar" data-id="${v.id}">Registrar pago</button>
        <button class="btn chico fantasma" data-accion="borrar" data-id="${v.id}">×</button>
      </div>
    </article>
  `;
}