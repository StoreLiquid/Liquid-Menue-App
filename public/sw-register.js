// Service Worker registrieren
if ('serviceWorker' in navigator) {
  // Warten bis die Seite komplett geladen ist
  window.addEventListener('load', async function() {
    try {
      // Zuerst alle existierenden Service Workers deregistrieren
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        await registration.unregister();
      }

      // Dann alle Caches löschen
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }

      // Jetzt den Service Worker neu registrieren
      const registration = await navigator.serviceWorker.register('/sw.js', { 
        scope: '/',
        updateViaCache: 'none' // Browser soll immer nach neuen Versionen suchen 
      });
      
      console.log('ServiceWorker erfolgreich registriert mit Scope:', registration.scope);
    } catch (error) {
      console.error('ServiceWorker Registrierung fehlgeschlagen:', error);
    }
  });

  // Neues Update verfügbar
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', function() {
    if (refreshing) return;
    refreshing = true;
    
    console.log('Neuer Service Worker ist aktiv - Seite wird neu geladen');
    window.location.reload();
  });
} 