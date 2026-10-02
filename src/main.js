import './estilos.css'

import { obtenerEstado, suscribir, recuperar, irA, cambiarFiltro,
         crearVencimiento, borrarVencimiento, registrarPago } from './estado.js'

import { Tablero } from './vistas/Tablero.js'

import { Formulario } from './vistas/Formulario.js'

import { Costos } from './vistas/Costos.js'

import { diasHasta } from './utilidades/fechas.js'

const app = document.getElementById('app');

function render() {
  const estado = obtenerEstado();

  let contenido = Tablero();
  if (estado.vista === 'nuevo') contenido = Formulario();
  if (estado.vista === 'costos') contenido = Costos();

  app.innerHTML = `
    <div class="app">
      <header class="cabecera">
        <h1>AlDia</h1>
        <span class="patente">${estado.vehiculo.patente || 'SIN PATENTE'}</span>
      </header>
      ${contenido}
    </div>
    <nav class="barra-inferior">
      <button class="btn fantasma" data-accion="ir" data-vista="tablero">Vencimientos</button>
      <button class="btn fantasma" data-accion="ir" data-vista="costos">Costos</button>
      <button class="btn" data-accion="ir" data-vista="nuevo">+ Agregar</button>
    </nav>
  `;
}

document.addEventListener('click', function (evento) {
  const el = evento.target.closest('[data-accion]');

  if (!el) return;

  const accion = el.dataset.accion;

  if (accion === 'ir') irA(el.dataset.vista);
  if (accion === 'filtrar') cambiarFiltro(el.dataset.f);
  if (accion === 'borrar') {
    if (confirm('¿Borrar este vencimiento?')) borrarVencimiento(el.dataset.id);
  }

  if (accion === 'pagar') {
    const texto = prompt('¿Cuánto pagaste?');
    if (texto === null) return;
    const costo = parseFloat(texto);
    if (isNaN(costo) || costo < 0) {
      alert('Ingresá un número válido.');
      return;
    }
    registrarPago(el.dataset.id, costo);
  }

  if (accion === 'crear') {
    const datos = {
      tipo: document.getElementById('f-tipo').value,
      detalle: document.getElementById('f-detalle').value.trim(),
      vence: document.getElementById('f-vence').value,
      costo: parseFloat(document.getElementById('f-costo').value) || 0
    };
    if (!datos.vence) {
      document.getElementById('f-error').textContent = 'Elegí una fecha de vencimiento.';
      return;
    }
    crearVencimiento(datos);
  }
});

suscribir(render);
recuperar();
render();


// Registrar el service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js')
      .then(function () { console.log('Service worker registrado'); })
      .catch(function (error) { console.error('Falló el registro:', error); });
  });
}

// Avisar al abrir si hay algo urgente
function avisarUrgentes() {
  const estado = obtenerEstado();

  const urgentes = estado.vencimientos.filter(function (v) {
    return diasHasta(v.vence) <= 7;
  });

  if (urgentes.length === 0) return;

  const texto = urgentes.length === 1
    ? 'Tenés 1 vencimiento urgente.'
    : 'Tenés ' + urgentes.length + ' vencimientos urgentes.';

  if (Notification.permission === 'granted') {
    new Notification('AlDia', { body: texto, icon: './icono-192.png' });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission();
  }
}

avisarUrgentes();