// PWA-Hintergrund-Fix für Mobilgeräte
(function() {
  // Prüfen, ob wir im PWA-Modus sind
  const isPwa = window.matchMedia('(display-mode: standalone)').matches || 
                window.navigator.standalone || 
                document.referrer.includes('android-app://');
                
  // Gerätetyp-Erkennung
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isMobile = window.innerWidth <= 767;
  const isTablet = window.innerWidth > 767 && window.innerWidth <= 1024;
  
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
          
          // Höhe des Hintergrunds je nach Gerätetyp anpassen
          if (isIOS) {
            el.style.height = isMobile ? '500vh' : '400vh';
          } else if (isAndroid) {
            el.style.height = isMobile ? '400vh' : '300vh';
          } else {
            el.style.height = '300vh';
          }
          
          el.style.opacity = '1';
          
          // Hardware-Beschleunigung für bessere Performance
          el.style.transform = 'translateZ(0)';
          el.style.webkitTransform = 'translateZ(0)';
          el.style.willChange = 'transform';
          el.style.backfaceVisibility = 'hidden';
        }
      }
    });
    
    // Footer-Anpassungen
    const footer = document.querySelector('footer');
    if (footer instanceof HTMLElement) {
      footer.style.backgroundImage = `linear-gradient(to bottom, transparent, ${pwaGradientEnd})`;
      
      // Safe Area für Geräte mit Notch
      if (isIOS) {
        footer.style.paddingBottom = 'env(safe-area-inset-bottom, 20px)';
      }
    }
    
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
    
    // Für Android-Geräte spezifische Fixes
    if (isAndroid) {
      // Verbessere die Hintergrunddarstellung auf Android
      document.body.style.overscrollBehavior = 'none';
      
      // Erstelle einen zusätzlichen Hintergrund für Android
      const androidBgFix = document.createElement('div');
      androidBgFix.className = 'android-pwa-bg';
      androidBgFix.style.position = 'fixed';
      androidBgFix.style.top = '0';
      androidBgFix.style.left = '0';
      androidBgFix.style.right = '0';
      androidBgFix.style.bottom = '0';
      androidBgFix.style.background = `radial-gradient(circle at top right, ${pwaGradientStart}, ${pwaGradientMiddle}, ${pwaGradientEnd})`;
      androidBgFix.style.zIndex = '-9997';
      androidBgFix.style.opacity = '0.7';
      
      // Füge den Hintergrund zum Body hinzu
      document.body.appendChild(androidBgFix);
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
  
  // Wende die Fixes nach einer kurzen Verzögerung erneut an
  setTimeout(applyPwaFixes, 1000);
  
  // Wende die Fixes nach Größenänderungen erneut an
  window.addEventListener('resize', applyPwaFixes);
})(); 