// Chrome-Hintergrund-Fix - Direkter Ansatz
document.addEventListener('DOMContentLoaded', function() {
  // Feste Hintergrundfarben
  const bgColor = '#1A1820';
  const bgGradient = 'linear-gradient(to bottom right, #2A2832, #1A1820)';
  
  // Setze direkt Hintergrundfarben
  document.documentElement.style.backgroundColor = bgColor;
  document.body.style.backgroundColor = bgColor;
  
  // Erstelle ein festes Hintergrund-Element
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
  `;
  
  // Füge es als erstes Element im Body ein
  document.body.insertBefore(fixedBg, document.body.firstChild);
  
  // Setze Hintergrundfarben für alle wichtigen Container
  const containers = [
    document.querySelector('.min-h-screen.relative'),
    document.getElementById('app-bg-gradient'),
    document.getElementById('__next')
  ];
  
  containers.forEach(container => {
    if (container) {
      container.style.backgroundColor = 'transparent';
    }
  });
  
  // Wiederhole dies nach vollständigem Laden
  window.addEventListener('load', function() {
    document.documentElement.style.backgroundColor = bgColor;
    document.body.style.backgroundColor = bgColor;
    
    // Stelle sicher, dass der fixe Hintergrund noch da ist
    if (!document.getElementById('chrome-fixed-bg')) {
      document.body.insertBefore(fixedBg.cloneNode(true), document.body.firstChild);
    }
  });
}); 