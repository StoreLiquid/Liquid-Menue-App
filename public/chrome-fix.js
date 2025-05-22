// Chrome-spezifischer Fix für Hintergrund und PWA
document.addEventListener('DOMContentLoaded', function() {
  // Prüfe, ob wir in Chrome sind (nicht Edge)
  const isChrome = /Chrome/.test(navigator.userAgent) && !/Edge|Edg/.test(navigator.userAgent);
  
  if (!isChrome) return; // Nur für Chrome ausführen
  
  // Hintergrundfarbe
  const bgColor = '#1A1820';
  
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
  
  // Füge CSS für Chrome hinzu
  const style = document.createElement('style');
  style.textContent = `
    @media screen and (-webkit-min-device-pixel-ratio:0) {
      html, body {
        background-color: ${bgColor} !important;
      }
      
      .fixed {
        position: fixed !important;
        z-index: -1 !important;
      }
      
      #app-bg-gradient {
        opacity: 1 !important;
        display: block !important;
        z-index: -10 !important;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Fix für den grauen Balken in PWA
  if (window.matchMedia('(display-mode: standalone)').matches) {
    const pwaStyle = document.createElement('style');
    pwaStyle.textContent = `
      body::after {
        content: "";
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100px;
        background-color: ${bgColor};
        z-index: -1;
      }
    `;
    document.head.appendChild(pwaStyle);
  }
});
