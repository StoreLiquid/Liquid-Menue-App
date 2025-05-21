// Eigener Service Worker ohne Workbox
const CACHE_NAME = 'liquid-menu-cache-v1';

// Zu cachende Ressourcen
const STATIC_RESOURCES = [
  '/',
  '/offline.html',
  '/icons/app-icon.svg',
  '/icons/app-icon-192.png',
  '/icons/app-icon-512.png',
  '/icons/logo-rund.svg',
  '/manifest.json'
];

// Installation - Cache statische Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Statische Assets werden gecached');
        return cache.addAll(STATIC_RESOURCES);
      })
      .then(() => {
        // Aktiviere den neuen Service Worker sofort
        return self.skipWaiting();
      })
  );
});

// Aktivierung - Alte Caches entfernen
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              console.log('[Service Worker] Alter Cache wird entfernt:', name);
              return caches.delete(name);
            }
          })
        );
      })
      .then(() => {
        // Übernehme die Kontrolle sofort
        return self.clients.claim();
      })
  );
});

// Fetch - Netzwerk First mit Cache Fallback für bestimmte Assets
self.addEventListener('fetch', (event) => {
  // Nur gleiche Herkunft behandeln
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Erfolgreich vom Netzwerk, Cache aktualisieren
          if (response && response.status === 200) {
            // Für Bilder und andere statische Assets den Cache aktualisieren
            const requestURL = new URL(event.request.url);
            if (
              requestURL.pathname.endsWith('.svg') ||
              requestURL.pathname.endsWith('.png') ||
              requestURL.pathname.endsWith('.jpg') ||
              requestURL.pathname.endsWith('.jpeg') ||
              requestURL.pathname.endsWith('.ico')
            ) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseClone);
                });
            }
          }
          return response;
        })
        .catch(() => {
          // Netzwerk fehlgeschlagen, versuche aus Cache
          return caches.match(event.request)
            .then((cachedResponse) => {
              // Falls vorhanden, gib aus Cache zurück
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // Wenn es sich um eine Navigationanfrage handelt, zeige offline.html
              if (event.request.mode === 'navigate') {
                return caches.match('/offline.html');
              }
              
              // Fallback für Bilder
              if (event.request.destination === 'image') {
                return caches.match('/icons/app-icon-192.png');
              }
              
              // Fallback für andere Assets
              return new Response('Inhalt nicht verfügbar', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({
                  'Content-Type': 'text/plain'
                })
              });
            });
        })
    );
  }
}); 