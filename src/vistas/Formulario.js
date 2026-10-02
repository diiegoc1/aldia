import { TIPOS } from '../datos/tipos.js';

export function Formulario() {
  const opciones = Object.entries(TIPOS).map(function (par) {
    const clave = par[0];
    const tipo = par[1];
    return `<option value="${clave}">${tipo.emoji} ${tipo.nombre}</option>`;
  }).join('');

  return `
    <div class="tarjeta">
      <h2 style="font-size:1rem;margin-bottom:14px">Nuevo vencimiento</h2>
      <div class="campos">
        <label>Tipo<select id="f-tipo">${opciones}</select></label>
        <label>Detalle (opcional)<input type="text" id="f-detalle" maxlength="30" placeholder="Planta Santa Fe"></label>
        <label>Vence el<input type="date" id="f-vence"></label>
        <label>Costo<input type="number" id="f-costo" min="0" step="100" placeholder="0"></label>
      </div>
      <p class="vacio" id="f-error" style="color:var(--vencido);padding:0 0 10px"></p>
      <button class="btn" data-accion="crear">Agregar</button>
      <button class="btn fantasma" data-accion="ir" data-vista="tablero">Cancelar</button>
    </div>
  `;
}