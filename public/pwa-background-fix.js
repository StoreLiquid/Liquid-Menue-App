// PWA-Hintergrund-Fix für Mobilgeräte
(function() {
  // Prüfen, ob wir im PWA-Modus sind
  const isPwa = window.matchMedia('(display-mode: standalone)').matches || 
                window.navigator.standalone || 
                document.referrer.includes('android-app://');
                
  // Prüfen, ob wir auf iOS sind
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  // Nur fortfahren, wenn wir im PWA-Modus sind
  if (!isPwa) return;
  
  // Farben für PWA-Modus
  const pwaGradientStart = '#3a2a5a';
  const pwaGradientMiddle = '#251e30';
  const pwaGradientEnd = '#14101e';
  
  // Funktion zum Anwenden der Fixes
  function applyPwaFixes() {
    // Setze die Hintergrundfarben
    document.documentElement.style.backgroundColor = pwaGradientStart;
    document.body.style.backgroundColor = pwaGradientStart;
    
    // Finde alle Hintergrund-Elemente
    const bgElements = document.querySelectorAll('#app-bg-gradient, [id^="app-"]');
    bgElements.forEach(el => {
      if (el instanceof HTMLElement) {
        // Verstärke die Opazität
        if (el.style.opacity) {
          el.style.opacity = Math.min(1, parseFloat(el.style.opacity) * 1.5).toString();
        }
        
        // Setze den Hintergrund für das Haupt-Gradient-Element
        if (el.id === 'app-bg-gradient') {
          el.style.backgroundImage = `radial-gradient(circle at top right, ${pwaGradientStart}, ${pwaGradientMiddle}, ${pwaGradientEnd})`;
          el.style.height = '300vh';
          el.style.opacity = '1';
        }
      }
    });
    
    // Für iOS-Geräte zusätzliche Fixes anwenden
    if (isIOS) {
      // Erstelle einen zusätzlichen Hintergrund
      const iosBgFix = document.createElement('div');
      iosBgFix.className = 'ios-pwa-bg';
      iosBgFix.style.position = 'fixed';
      iosBgFix.style.top = '0';
      iosBgFix.style.left = '0';
      iosBgFix.style.right = '0';
      iosBgFix.style.bottom = '0';
      iosBgFix.style.background = `radial-gradient(circle at top right, ${pwaGradientStart}, ${pwaGradientMiddle}, ${pwaGradientEnd})`;
      iosBgFix.style.zIndex = '-9997';
      iosBgFix.style.opacity = '0.8';
      
      // Füge den Hintergrund zum Body hinzu
      document.body.appendChild(iosBgFix);
    }
  }
  
  // Wende die Fixes an, sobald das DOM geladen ist
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyPwaFixes);
  } else {
    applyPwaFixes();
  }
  
  // Wende die Fixes auch nach dem vollständigen Laden an
  window.addEventListener('load', applyPwaFixes);
  
  // Wende die Fixes nach einer kurzen Verzögerung erneut an (für iOS)
  setTimeout(applyPwaFixes, 1000);
})(); 