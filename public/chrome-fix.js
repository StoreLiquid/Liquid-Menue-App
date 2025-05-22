// Einfacher, robuster Fix für Chrome und PWA
document.addEventListener('DOMContentLoaded', function() {
  console.log("Chrome-Fix wird geladen...");
  
  // Grundfarben
  const bgColor = '#1A1820';
  
  // Setze Hintergrundfarbe für alle Browser
  document.documentElement.style.backgroundColor = bgColor;
  document.body.style.backgroundColor = bgColor;
  
  // Erstelle einen festen Hintergrund für alle Browser
  const fixedBg = document.createElement('div');
  fixedBg.id = 'fixed-bg';
  fixedBg.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 150vh;
    background-color: ${bgColor};
    z-index: -9999;
    pointer-events: none;
  `;
  document.body.insertBefore(fixedBg, document.body.firstChild);
  
  // Fix für den grauen Balken unten in PWA
  const bottomFix = document.createElement('div');
  bottomFix.id = 'bottom-fix';
  bottomFix.style.cssText = `
    position: fixed;
    bottom: -50px;
    left: 0;
    right: 0;
    height: 200px;
    background-color: ${bgColor};
    z-index: -9990;
    pointer-events: none;
  `;
  document.body.appendChild(bottomFix);
  
  // Füge CSS für alle Browser hinzu
  const style = document.createElement('style');
  style.id = 'global-bg-fix';
  style.textContent = `
    html, body, #__next, .min-h-screen.relative {
      background-color: ${bgColor} !important;
    }
    
    footer {
      background-color: ${bgColor} !important;
      position: relative;
      z-index: 10;
    }
    
    #app-bg-gradient {
      height: 150vh !important;
      z-index: -9998 !important;
    }
    
    @media all and (display-mode: standalone) {
      body::after {
        content: "";
        position: fixed;
        bottom: -50px;
        left: 0;
        right: 0;
        height: 200px;
        background-color: ${bgColor};
        z-index: -9990;
      }
    }
  `;
  document.head.appendChild(style);
});

// Erneut ausführen, wenn die Seite vollständig geladen ist
window.addEventListener('load', function() {
  console.log("Seite vollständig geladen, wende Fixes erneut an");
  
  // Grundfarben
  const bgColor = '#1A1820';
  
  // Setze Hintergrundfarbe für alle Browser
  document.documentElement.style.backgroundColor = bgColor;
  document.body.style.backgroundColor = bgColor;
  
  // Stelle sicher, dass der feste Hintergrund existiert
  if (!document.getElementById('fixed-bg')) {
    const fixedBg = document.createElement('div');
    fixedBg.id = 'fixed-bg';
    fixedBg.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100vw;
      height: 150vh;
      background-color: ${bgColor};
      z-index: -9999;
      pointer-events: none;
    `;
    document.body.insertBefore(fixedBg, document.body.firstChild);
  }
  
  // Stelle sicher, dass der Fix für den grauen Balken existiert
  if (!document.getElementById('bottom-fix')) {
    const bottomFix = document.createElement('div');
    bottomFix.id = 'bottom-fix';
    bottomFix.style.cssText = `
      position: fixed;
      bottom: -50px;
      left: 0;
      right: 0;
      height: 200px;
      background-color: ${bgColor};
      z-index: -9990;
      pointer-events: none;
    `;
    document.body.appendChild(bottomFix);
  }
  
  // Überprüfe, ob der Footer sichtbar ist und korrigiere ihn bei Bedarf
  const footer = document.querySelector('footer');
  if (footer) {
    footer.style.backgroundColor = bgColor;
    footer.style.position = 'relative';
    footer.style.zIndex = '10';
  }
});
