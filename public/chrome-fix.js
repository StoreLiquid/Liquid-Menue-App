// Einfacher Fix für Chrome und PWA
document.addEventListener('DOMContentLoaded', function() {
  console.log("Chrome-Fix wird geladen...");
  
  // Grundfarben
  const bgColor = '#1A1820';
  
  // Prüfe, ob die Fixes bereits existieren
  const existingBottomBarFix = document.getElementById('bottom-bar-fix');
  const existingBottomFixJs = document.getElementById('bottom-fix-js');
  
  // Entferne doppelte Elemente, falls vorhanden
  if (existingBottomBarFix) {
    existingBottomBarFix.parentNode.removeChild(existingBottomBarFix);
  }
  if (existingBottomFixJs) {
    existingBottomFixJs.parentNode.removeChild(existingBottomFixJs);
  }
  
  // Setze Hintergrundfarbe für HTML und Body
  document.documentElement.style.backgroundColor = bgColor;
  document.body.style.backgroundColor = bgColor;
  
  // Stelle sicher, dass der Gradient sichtbar ist
  const gradientBg = document.getElementById('app-bg-gradient');
  if (gradientBg) {
    gradientBg.style.opacity = '1';
    gradientBg.style.display = 'block';
    gradientBg.style.zIndex = '-10';
    gradientBg.style.height = '200vh';
    gradientBg.style.backgroundImage = 'linear-gradient(to bottom right, #2A2832, #1A1820)';
    gradientBg.style.animation = 'gradient 15s ease infinite';
    gradientBg.style.backgroundSize = '200% 200%';
  }
  
  // Fix für den Footer
  const footer = document.querySelector('footer');
  if (footer) {
    footer.style.backgroundColor = bgColor;
    footer.style.position = 'relative';
    footer.style.zIndex = '100';
  }
  
  // Prüfe, ob wir im PWA-Modus sind
  const isPWA = window.matchMedia('(display-mode: standalone)').matches;
  if (isPWA) {
    console.log("PWA-Modus erkannt, füge Footer-Fix hinzu");
    
    // Füge CSS für den Footer im PWA-Modus hinzu
    const style = document.createElement('style');
    style.id = 'pwa-footer-fix';
    style.textContent = `
      footer {
        background-color: ${bgColor} !important;
        position: relative !important;
        z-index: 100 !important;
        padding-bottom: env(safe-area-inset-bottom, 20px) !important;
      }
      
      .min-h-screen.relative {
        background-color: ${bgColor} !important;
        min-height: 100vh !important;
      }
      
      #app-bg-gradient {
        opacity: 1 !important;
        display: block !important;
        height: 200vh !important;
        background-image: linear-gradient(to bottom right, #2A2832, #1A1820) !important;
        animation: gradient 15s ease infinite !important;
        background-size: 200% 200% !important;
      }
    `;
    document.head.appendChild(style);
  }
});

// Erneut ausführen, wenn die Seite vollständig geladen ist
window.addEventListener('load', function() {
  console.log("Seite vollständig geladen, wende Fixes an");
  
  // Grundfarben
  const bgColor = '#1A1820';
  
  // Stelle sicher, dass der Footer korrekt angezeigt wird
  const footer = document.querySelector('footer');
  if (footer) {
    footer.style.backgroundColor = bgColor;
    footer.style.position = 'relative';
    footer.style.zIndex = '100';
  }
  
  // Stelle sicher, dass der Gradient sichtbar ist und animiert
  const gradientBg = document.getElementById('app-bg-gradient');
  if (gradientBg) {
    gradientBg.style.opacity = '1';
    gradientBg.style.display = 'block';
    gradientBg.style.zIndex = '-10';
    gradientBg.style.height = '200vh';
    gradientBg.style.backgroundImage = 'linear-gradient(to bottom right, #2A2832, #1A1820)';
    gradientBg.style.animation = 'gradient 15s ease infinite';
    gradientBg.style.backgroundSize = '200% 200%';
  }
});

// Chrome-spezifische Fixes
(function() {
  // Prüfen, ob wir in Chrome sind
  const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  if (!isChrome) return;
  
  // Prüfen, ob wir im PWA-Modus sind
  const isPwa = window.matchMedia('(display-mode: standalone)').matches || 
                window.navigator.standalone || 
                document.referrer.includes('android-app://');
  
  // Farben für den Hintergrund
  const bgColor = isPwa ? '#3a2a5a' : '#1A1820';
  const gradientStart = isPwa ? '#3a2a5a' : '#2c1e4a';
  const gradientMiddle = isPwa ? '#251e30' : '#1f1c28';
  const gradientEnd = isPwa ? '#14101e' : '#0f0c18';
  
  // Funktion zum Anwenden der Chrome-Fixes
  function applyChromeFixesOnLoad() {
    // Stelle sicher, dass der Hintergrund korrekt angezeigt wird
    document.documentElement.style.backgroundColor = bgColor;
    document.body.style.backgroundColor = bgColor;
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
    document.documentElement.style.height = 'auto';
    document.body.style.height = 'auto';
    document.documentElement.style.minHeight = '100%';
    document.body.style.minHeight = '100%';
    document.body.style.position = 'relative';
    
    // Stelle sicher, dass fixed-positionierte Elemente korrekt angezeigt werden
    const fixedElements = document.querySelectorAll('.fixed, [id^="app-"]');
    fixedElements.forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.position = 'fixed';
        el.style.pointerEvents = 'none';
        
        // Setze den Hintergrund für das Haupt-Gradient-Element
        if (el.id === 'app-bg-gradient') {
          el.style.backgroundImage = `radial-gradient(circle at top right, ${gradientStart}, ${gradientMiddle}, ${gradientEnd})`;
          el.style.height = isPwa ? '300vh' : '200vh';
          el.style.opacity = '1';
          el.style.transform = 'translateZ(0)';
          el.style.webkitTransform = 'translateZ(0)';
          el.style.willChange = 'transform';
          el.style.backfaceVisibility = 'hidden';
        }
        
        // Erhöhe die Opazität im PWA-Modus
        if (isPwa && el.id && el.id.startsWith('app-') && el.style.opacity) {
          el.style.opacity = Math.min(1, parseFloat(el.style.opacity) * 1.5).toString();
        }
      }
    });
    
    // Stelle sicher, dass der Next.js-Container korrekt dargestellt wird
    const nextContainer = document.getElementById('__next');
    if (nextContainer) {
      nextContainer.style.backgroundColor = 'transparent';
      nextContainer.style.minHeight = '100vh';
      nextContainer.style.overflowY = 'visible';
      nextContainer.style.position = 'relative';
    }
  }
  
  // Wende die Fixes an, sobald das DOM geladen ist
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyChromeFixesOnLoad);
  } else {
    applyChromeFixesOnLoad();
  }
  
  // Wende die Fixes auch nach dem vollständigen Laden an
  window.addEventListener('load', applyChromeFixesOnLoad);
  
  // Wende die Fixes nach einer kurzen Verzögerung erneut an
  setTimeout(applyChromeFixesOnLoad, 500);
})();
