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
  
  // Ein einziger Fix für den unteren Bereich
  const bottomFix = document.createElement('div');
  bottomFix.id = 'bottom-fix-js';
  bottomFix.style.cssText = `
    position: fixed;
    bottom: -100px;
    left: 0;
    right: 0;
    height: 300px;
    background-color: ${bgColor};
    z-index: 90;
    pointer-events: none;
  `;
  document.body.appendChild(bottomFix);
  
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
