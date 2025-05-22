// Chrome-spezifischer Fix für Hintergrund und PWA
document.addEventListener('DOMContentLoaded', function() {
  // Prüfe, ob wir in Chrome sind (nicht Edge)
  const isChrome = /Chrome/.test(navigator.userAgent) && !/Edge|Edg/.test(navigator.userAgent);
  const isPWA = window.matchMedia('(display-mode: standalone)').matches;
  const isDesktop = window.innerWidth > 1024;
  
  console.log("Chrome-Fix wird geladen...");
  console.log("Chrome erkannt:", isChrome);
  console.log("PWA erkannt:", isPWA);
  console.log("Desktop erkannt:", isDesktop);
  
  // Hintergrundfarbe
  const bgColor = '#1A1820';
  
  // Setze Hintergrundfarben direkt für alle Browser
  document.documentElement.style.backgroundColor = bgColor;
  document.body.style.backgroundColor = bgColor;
  
  // Stelle sicher, dass der Gradient sichtbar ist
  const gradientBg = document.getElementById('app-bg-gradient');
  if (gradientBg) {
    gradientBg.style.opacity = '1';
    gradientBg.style.display = 'block';
    gradientBg.style.zIndex = '-10';
  }
  
  // Erstelle ein festes Hintergrund-Element für Chrome Desktop
  if (isChrome && isDesktop) {
    console.log("Füge speziellen Chrome Desktop Fix hinzu");
    
    // Entferne vorhandene Elemente
    const existingBg = document.getElementById('chrome-desktop-bg');
    if (existingBg) {
      existingBg.remove();
    }
    
    // Erstelle neues Hintergrund-Element
    const fixedBg = document.createElement('div');
    fixedBg.id = 'chrome-desktop-bg';
    fixedBg.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100vw;
      height: 100vh;
      background-color: ${bgColor};
      background-image: linear-gradient(to bottom right, #2A2832, #1A1820);
      z-index: -9999;
      pointer-events: none;
    `;
    
    // Füge es als erstes Element im Body ein
    document.body.insertBefore(fixedBg, document.body.firstChild);
    
    // Spezielles CSS für Chrome Desktop
    const desktopStyle = document.createElement('style');
    desktopStyle.id = 'chrome-desktop-styles';
    desktopStyle.textContent = `
      html, body, #__next, .min-h-screen.relative {
        background-color: transparent !important;
      }
      
      #app-bg-gradient {
        opacity: 1 !important;
        display: block !important;
        z-index: -10 !important;
      }
      
      .fixed {
        position: fixed !important;
        z-index: -1 !important;
      }
    `;
    document.head.appendChild(desktopStyle);
  }
  
  // Fix für den grauen Balken in PWA
  if (isPWA) {
    console.log("Füge PWA Fix für grauen Balken hinzu");
    
    // Entferne vorhandene Styles
    const existingPwaStyle = document.getElementById('pwa-bottom-fix');
    if (existingPwaStyle) {
      existingPwaStyle.remove();
    }
    
    // Erstelle neues Style-Element
    const pwaStyle = document.createElement('style');
    pwaStyle.id = 'pwa-bottom-fix';
    pwaStyle.textContent = `
      body::after {
        content: "";
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 150px;
        background-color: ${bgColor};
        z-index: -5;
      }
      
      footer {
        position: relative;
        z-index: 10;
        background-color: ${bgColor} !important;
      }
    `;
    document.head.appendChild(pwaStyle);
  }
});

// Erneut ausführen, wenn die Seite vollständig geladen ist
window.addEventListener('load', function() {
  // Prüfe, ob wir in Chrome sind (nicht Edge)
  const isChrome = /Chrome/.test(navigator.userAgent) && !/Edge|Edg/.test(navigator.userAgent);
  const isPWA = window.matchMedia('(display-mode: standalone)').matches;
  const isDesktop = window.innerWidth > 1024;
  
  console.log("Seite vollständig geladen");
  
  // Hintergrundfarbe
  const bgColor = '#1A1820';
  
  // Für Chrome Desktop: Stelle sicher, dass der Hintergrund sichtbar ist
  if (isChrome && isDesktop) {
    console.log("Chrome Desktop: Stelle sicher, dass der Hintergrund sichtbar ist");
    
    // Setze Hintergrundfarben direkt
    document.documentElement.style.backgroundColor = bgColor;
    document.body.style.backgroundColor = bgColor;
    
    // Stelle sicher, dass der Gradient sichtbar ist
    const gradientBg = document.getElementById('app-bg-gradient');
    if (gradientBg) {
      gradientBg.style.opacity = '1';
      gradientBg.style.display = 'block';
      gradientBg.style.zIndex = '-10';
    }
    
    // Stelle sicher, dass der fixe Hintergrund noch da ist
    if (!document.getElementById('chrome-desktop-bg')) {
      // Erstelle neues Hintergrund-Element
      const fixedBg = document.createElement('div');
      fixedBg.id = 'chrome-desktop-bg';
      fixedBg.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        background-color: ${bgColor};
        background-image: linear-gradient(to bottom right, #2A2832, #1A1820);
        z-index: -9999;
        pointer-events: none;
      `;
      
      // Füge es als erstes Element im Body ein
      document.body.insertBefore(fixedBg, document.body.firstChild);
    }
  }
  
  // Für PWA: Stelle sicher, dass der graue Balken verschwunden ist
  if (isPWA) {
    console.log("PWA: Stelle sicher, dass der graue Balken verschwunden ist");
    
    if (!document.getElementById('pwa-bottom-fix')) {
      const pwaStyle = document.createElement('style');
      pwaStyle.id = 'pwa-bottom-fix';
      pwaStyle.textContent = `
        body::after {
          content: "";
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 150px;
          background-color: ${bgColor};
          z-index: -5;
        }
        
        footer {
          position: relative;
          z-index: 10;
          background-color: ${bgColor} !important;
        }
      `;
      document.head.appendChild(pwaStyle);
    }
  }
});
