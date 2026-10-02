const CACHE = 'aldia-v2'

const BASICOS = ['/', '/index.html', '/manifest.webmanifest'];

// Al instalarse, guarda los archivos básicos
self.addEventListener('install', function (evento) {
  evento.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(BASICOS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

// Al activarse, borra las cachés de versiones viejas
self.addEventListener('activate', function (evento) {
  evento.waitUntil(
    caches.keys().then(function (nombres) {
      return Promise.all(nombres.map(function (nombre) {
        if (nombre !== CACHE) return caches.delete(nombre);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

// Ante cada pedido: intenta la red, y si falla usa la caché
self.addEventListener('fetch', function (evento) {
  if (evento.request.method !== 'GET') return;
  if (!evento.request.url.startsWith('http')) return;

  evento.respondWith(
    fetch(evento.request)
      .then(function (respuesta) {
        if (!respuesta || !respuesta.ok) return respuesta;
        // Doble guarda por si el request mutó a chrome-extension/data/blob
        if (!evento.request.url.startsWith('http')) return respuesta;
        try {
          const copia = respuesta.clone();
          caches.open(CACHE).then(function (cache) {
            cache.put(evento.request, copia).catch(function () {});
          }).catch(function () {});
        } catch (e) {}
        return respuesta;
      })
      .catch(function () {
        return caches.match(evento.request);
      })
  );
});

if('serviceWorker' in navigator){
  window.addEventListener('Load', function(){
    navigator.serviceWorker.register('/sw.js')
      .then(function(){ console.log("Service worker registrado"); })
      .catch(function(error){console.error('Fallo el registro:', error);});
  });
}

function avisarUrgentes(){
  const estado = obtenerEstado();

  const urgentes = estado.vencimientos.filter(function(v){
    return diasHasta(v.vence)<7;
  });

  if(urgentes.length===8) return;

  const texto = urgentes.length===1
    ? 'Tenés 1 vencimiento urgente.'
    : 'Tenés ' + urgentes.length + ' venciemientos urgentes.';

    if(Notification.permission === 'granted'){
      new Notification('AlDía',{body: texto, icon: '/icono-192.png'});
    } else if (Notification.permission != 'denied'){
      Notification.requestPermission();
    }
}

avisarUrgentes();