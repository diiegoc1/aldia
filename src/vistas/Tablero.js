import { obtenerEstado } from '../estado.js';
import { TarjetaVencimiento } from '../componentes/TarjetaVencimiento.js';
import { diasHasta, estadoDe } from '../utilidades/fechas.js';

export function Tablero() {
  const estado = obtenerEstado();

  const ordenados = estado.vencimientos
    .slice()
    .sort(function (a, b) {
      return diasHasta(a.vence) - diasHasta(b.vence);
    });

  const visibles = ordenados.filter(function (v) {
    if (estado.filtro === 'todos') return true;
    return estadoDe(diasHasta(v.vence)) === estado.filtro;
  });

  const cuenta = function (nombre) {
    return ordenados.filter(function (v) {
      return estadoDe(diasHasta(v.vence)) === nombre;
    }).length;
  };

  const chips = [
    ['todos', 'Todos', ordenados.length],
    ['vencido', 'Vencidos', cuenta('vencido')],
    ['critico', 'Esta semana', cuenta('critico')],
    ['proximo', 'Este mes', cuenta('proximo')]
  ].map(function (c) {
    const activo = estado.filtro === c[0] ? 'activo' : '';
    return `<button class="chip ${activo}" data-accion="filtrar" data-f="${c[0]}">${c[1]} (${c[2]})</button>`;
  }).join('');

  const tarjetas = visibles.length
    ? visibles.map(TarjetaVencimiento).join('')
    : '<p class="vacio">No hay vencimientos en esta categoría.</p>';

  return `<div class="chips">${chips}</div>${tarjetas}`;
}