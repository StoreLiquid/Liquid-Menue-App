// Chrome-Hintergrund-Fix - Direkter Ansatz
document.addEventListener('DOMContentLoaded', function() {
  // Prüfe, ob wir in Chrome sind (nicht Edge)
  const isChrome = /Chrome/.test(navigator.userAgent) && !/Edge|Edg/.test(navigator.userAgent);
  
  if (!isChrome) return; // Nur für Chrome ausführen
  
  // Feste Hintergrundfarben - an Edge angepasst
  const bgColor = '#1A1820';
  const bgGradient = 'linear-gradient(to bottom right, #2A2832, #1A1820)';

  // Setze direkt Hintergrundfarben
  document.documentElement.style.backgroundColor = bgColor;
  document.documentElement.style.backgroundImage = bgGradient;
  document.body.style.backgroundColor = bgColor;
  document.body.style.backgroundImage = bgGradient;

  // Erstelle ein festes Hintergrund-Element
  if (!document.getElementById('chrome-fixed-bg')) {
    const fixedBg = document.createElement('div');
    fixedBg.id = 'chrome-fixed-bg';
    fixedBg.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100vw;
      height: 100vh;
      background-color: ${bgColor};
      background-image: ${bgGradient};
      z-index: -10000;
      pointer-events: none;
      opacity: 1;
    `;

    // Füge es als erstes Element im Body ein
    document.body.insertBefore(fixedBg, document.body.firstChild);
  }

  // Setze Hintergrundfarben für alle wichtigen Container
  const containers = [
    document.querySelector('.min-h-screen.relative'),
    document.getElementById('__next')
  ];

  containers.forEach(container => {
    if (container) {
      container.style.backgroundColor = 'transparent';
      container.style.backgroundImage = 'none';
    }
  });
  
  // Stelle sicher, dass der Gradient-Hintergrund sichtbar ist
  const gradientBg = document.getElementById('app-bg-gradient');
  if (gradientBg) {
    gradientBg.style.opacity = '1';
    gradientBg.style.display = 'block';
    gradientBg.style.zIndex = '-10';
    gradientBg.style.backgroundImage = bgGradient;
  }

  // Wiederhole dies nach vollständigem Laden
  window.addEventListener('load', function() {
    document.documentElement.style.backgroundColor = bgColor;
    document.documentElement.style.backgroundImage = bgGradient;
    document.body.style.backgroundColor = bgColor;
    document.body.style.backgroundImage = bgGradient;

    // Stelle sicher, dass der fixe Hintergrund noch da ist
    const fixedBg = document.getElementById('chrome-fixed-bg');
    if (!fixedBg) {
      const newFixedBg = document.createElement('div');
      newFixedBg.id = 'chrome-fixed-bg';
      newFixedBg.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        background-color: ${bgColor};
        background-image: ${bgGradient};
        z-index: -10000;
        pointer-events: none;
        opacity: 1;
      `;
      document.body.insertBefore(newFixedBg, document.body.firstChild);
    }

    // Stelle sicher, dass der Gradient sichtbar ist
    const gradientBg = document.getElementById('app-bg-gradient');
    if (gradientBg) {
      gradientBg.style.opacity = '1';
      gradientBg.style.display = 'block';
      gradientBg.style.zIndex = '-10';
      gradientBg.style.backgroundImage = bgGradient;
    }
    
    // CSS-Regeln einfügen
    if (!document.getElementById('chrome-fix-styles')) {
      const style = document.createElement('style');
      style.id = 'chrome-fix-styles';
      style.textContent = `
        body, html {
          background-color: ${bgColor} !important;
          background-image: ${bgGradient} !important;
        }
        
        #__next, .min-h-screen.relative {
          background-color: transparent !important;
          background-image: none !important;
        }
        
        #app-bg-gradient {
          opacity: 1 !important;
          display: block !important;
          z-index: -10 !important;
        }
      `;
      document.head.appendChild(style);
    }
  });
}); 