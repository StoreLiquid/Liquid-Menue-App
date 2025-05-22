// Einfacher Fix für Chrome und PWA
document.addEventListener('DOMContentLoaded', function() {
  console.log("Chrome-Fix wird geladen...");
  
  // Grundfarben
  const bgColor = '#1A1820';
  
  // Setze Hintergrundfarbe für HTML und Body
  document.documentElement.style.backgroundColor = 'transparent';
  document.body.style.backgroundColor = 'transparent';
  
  // Stelle sicher, dass der Gradient sichtbar ist
  const gradientBg = document.getElementById('app-bg-gradient');
  if (gradientBg) {
    gradientBg.style.opacity = '1';
    gradientBg.style.display = 'block';
    gradientBg.style.zIndex = '-10';
  }
  
  // Fix für den Footer
  const footer = document.querySelector('footer');
  if (footer) {
    footer.style.backgroundColor = bgColor;
    footer.style.position = 'relative';
    footer.style.zIndex = '100';
    
    // Füge zusätzlichen Bottom-Fix hinzu
    const bottomFix = document.createElement('div');
    bottomFix.style.cssText = `
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 100px;
      background-color: ${bgColor};
      transform: translateY(100%);
      z-index: -1;
    `;
    footer.appendChild(bottomFix);
  }
  
  // Fix für den grauen Balken am unteren Rand
  const bottomBarFix = document.createElement('div');
  bottomBarFix.id = 'bottom-bar-fix';
  bottomBarFix.style.cssText = `
    position: fixed;
    bottom: -10px;
    left: 0;
    right: 0;
    height: 100px;
    background-color: ${bgColor};
    z-index: 90;
    pointer-events: none;
  `;
  document.body.appendChild(bottomBarFix);
  
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
        background-color: transparent !important;
      }
      
      #app-bg-gradient {
        opacity: 1 !important;
        display: block !important;
      }
      
      /* Fix für den grauen Balken im PWA-Modus */
      body::after {
        content: "";
        position: fixed;
        bottom: -50px;
        left: 0;
        right: 0;
        height: 200px;
        background-color: ${bgColor};
        z-index: 90;
      }
    `;
    document.head.appendChild(style);
  }
});

// Erneut ausführen, wenn die Seite vollständig geladen ist
window.addEventListener('load', function() {
  console.log("Seite vollständig geladen, wende Footer-Fix an");
  
  // Grundfarben
  const bgColor = '#1A1820';
  
  // Stelle sicher, dass der Footer korrekt angezeigt wird
  const footer = document.querySelector('footer');
  if (footer) {
    footer.style.backgroundColor = bgColor;
    footer.style.position = 'relative';
    footer.style.zIndex = '100';
  }
  
  // Stelle sicher, dass der Gradient sichtbar ist
  const gradientBg = document.getElementById('app-bg-gradient');
  if (gradientBg) {
    gradientBg.style.opacity = '1';
    gradientBg.style.display = 'block';
    gradientBg.style.zIndex = '-10';
  }
  
  // Überprüfe, ob der Bottom-Fix existiert, sonst erstelle ihn
  if (!document.getElementById('bottom-bar-fix')) {
    const bottomBarFix = document.createElement('div');
    bottomBarFix.id = 'bottom-bar-fix';
    bottomBarFix.style.cssText = `
      position: fixed;
      bottom: -10px;
      left: 0;
      right: 0;
      height: 100px;
      background-color: ${bgColor};
      z-index: 90;
      pointer-events: none;
    `;
    document.body.appendChild(bottomBarFix);
  }
});
