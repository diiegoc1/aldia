const estado = {
  vehiculo: { alias: 'Mi vehículo', tipo: 'auto', patente: '' },
  vencimientos: [],
  filtro: 'todos',
  vista: 'tablero'
};

const suscriptores = [];

export function suscribir(fn) {
  suscriptores.push(fn);
}

function notificar() {
  guardar();
  suscriptores.forEach(function (fn) { fn(estado); });
}

export function obtenerEstado() {
  return estado;
}

export function irA(vista) {
  estado.vista = vista;
  notificar();
}

export function cambiarFiltro(filtro) {
  estado.filtro = filtro;
  notificar();
}

export function guardarVehiculo(datos) {
  estado.vehiculo = datos;
  notificar();
}

const CLAVE = 'aldia-datos';

const VERSION = 1;

function guardar() {
  try {
    localStorage.setItem(CLAVE, JSON.stringify({
      version: VERSION,
      vehiculo: estado.vehiculo,
      vencimientos: estado.vencimientos
    }));
  } catch (error) {
    console.error('No se pudo guardar:', error);
  }
}

export function recuperar() {
  try {
    const crudo = localStorage.getItem(CLAVE);
    if (!crudo) return;

    const datos = JSON.parse(crudo);

    if (datos.version !== VERSION) {
      console.warn('Formato de datos distinto, se ignoran los datos guardados.');
      return;
    }

    if (datos.vehiculo) estado.vehiculo = datos.vehiculo;
    if (Array.isArray(datos.vencimientos)) estado.vencimientos = datos.vencimientos;
  } catch (error) {
    console.error('Datos corruptos:', error);
  }
}


import { TIPOS } from './datos/tipos.js'

import { sumarMeses, aTexto, hoy } from './utilidades/fechas.js'

export function crearVencimiento(datos) {
  estado.vencimientos.push({
    id: Date.now(),
    tipo: datos.tipo,
    detalle: datos.detalle,
    vence: datos.vence,
    costo: datos.costo,
    historial: []
  });
  estado.vista = 'tablero'

  notificar();
}

export function borrarVencimiento(id) {
  estado.vencimientos = estado.vencimientos.filter(function (v) {
    return v.id !== Number(id);
  });
  notificar();
}

export function registrarPago(id, costoNuevo) {
  const v = estado.vencimientos.find(function (x) {
    return x.id === Number(id);
  });
  if (!v) return;

  // 1. Queda registrado en el historial
  v.historial.push({ fecha: aTexto(hoy()), costo: costoNuevo });

  // 2. La fecha salta a la próxima renovación
  const meses = (TIPOS[v.tipo] || TIPOS.otro).meses;
  v.vence = sumarMeses(v.vence, meses);

  // 3. El costo de referencia se actualiza
  v.costo = costoNuevo;

  notificar();
}