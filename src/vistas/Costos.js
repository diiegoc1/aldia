import { obtenerEstado } from '../estado.js'

import { TIPOS } from '../datos/tipos.js'

import { pesos } from '../utilidades/formato.js'

export function Costos() {
  const estado = obtenerEstado();
  const anio = String(new Date().getFullYear());

  const pagos = estado.vencimientos.flatMap(function (v) {
    return v.historial.map(function (h) {
      return { tipo: v.tipo, fecha: h.fecha, costo: h.costo };
    });
  }).filter(function (p) {
    return p.fecha.startsWith(anio);
  });

  if (pagos.length === 0) {
    return `
      <div class="tarjeta">
        <p class="vacio">Todavía no registraste ningún pago este año.<br>
        Cuando registres uno, acá vas a ver cuánto llevás gastado.</p>
      </div>
    `;
  }

  const total = pagos.reduce(function (s, p) { return s + p.costo; }, 0);

  const porTipo = pagos.reduce(function (acum, p) {
    acum[p.tipo] = (acum[p.tipo] || 0) + p.costo;
    return acum;
  }, {});

  const lineas = Object.keys(porTipo).sort(function (a, b) {
    return porTipo[b] - porTipo[a];
  }).map(function (clave) {
    const tipo = TIPOS[clave] || TIPOS.otro;
    const porcentaje = ((porTipo[clave] / total) * 100).toFixed(0);
    return `
      <div class="venc tarjeta aldia">
        <span class="emoji">${tipo.emoji}</span>
        <div class="info">
          <h3>${tipo.nombre}</h3>
          <p class="detalle">${porcentaje}% del total del año</p>
        </div>
        <strong>${pesos(porTipo[clave])}</strong>
      </div>
    `;
  }).join('');

  return `
    <div class="tarjeta">
      <p class="detalle" style="color:var(--apagado);font-size:.8rem">Gastado en ${anio}</p>
      <strong style="font-size:1.9rem">${pesos(total)}</strong>
    </div>
    ${lineas}
  `;
}