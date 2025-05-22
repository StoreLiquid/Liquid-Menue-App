// Chrome-Hintergrund-Fix - Robuste Version
(function() {
  // Prüfe, ob der Browser Chrome ist
  function isChrome() {
    const isChromium = window.chrome;
    const winNav = window.navigator;
    const vendorName = winNav.userAgent;
    const isOpera = typeof window.opr !== "undefined";
    const isIEedge = winNav.userAgent.indexOf("Edg") > -1;
    const isIOSChrome = winNav.userAgent.match("CriOS");
    
    if (isIOSChrome) {
      return true;
    } else if (
      isChromium !== null &&
      typeof isChromium !== "undefined" &&
      vendorName.indexOf("Chrome") > -1 &&
      isOpera === false &&
      isIEedge === false
    ) {
      return true;
    } else {
      return false;
    }
  }

  // Wenn Chrome erkannt wurde, füge einen robusten Hintergrund hinzu
  if (isChrome()) {
    console.log("Chrome Browser erkannt, füge robusten Hintergrund hinzu...");
    
    // Hintergrund-Farben - an Edge angepasst
    const bgColor = '#1A1820';
    const bgGradient = 'linear-gradient(to bottom right, #2A2832, #1A1820)';
    
    // Funktion zum Setzen des Hintergrunds
    function setBackgrounds() {
      // Hintergrund für HTML und Body
      document.documentElement.style.backgroundColor = bgColor;
      document.documentElement.style.backgroundImage = bgGradient;
      document.body.style.backgroundColor = bgColor;
      document.body.style.backgroundImage = bgGradient;
      
      // Fester Hintergrund-Div
      if (!document.getElementById('chrome-bg-fix')) {
        const bgDiv = document.createElement('div');
        bgDiv.id = 'chrome-bg-fix';
        bgDiv.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100vh;
          background-color: ${bgColor};
          background-image: ${bgGradient};
          z-index: -9999;
          pointer-events: none;
          opacity: 0.8;
        `;
        document.body.insertBefore(bgDiv, document.body.firstChild);
      }
      
      // Hintergrund für den Hauptcontainer
      const mainContainer = document.querySelector('.min-h-screen.relative');
      if (mainContainer) {
        mainContainer.style.backgroundColor = 'transparent';
        mainContainer.style.backgroundImage = 'none';
      }
      
      // Stelle sicher, dass der Gradient-Hintergrund sichtbar ist
      const gradientBg = document.getElementById('app-bg-gradient');
      if (gradientBg) {
        gradientBg.style.backgroundImage = bgGradient;
        gradientBg.style.opacity = '1';
        gradientBg.style.display = 'block';
      }
    }
    
    // CSS-Regeln einfügen
    const style = document.createElement('style');
    style.textContent = `
      body, html {
        background-color: ${bgColor} !important;
        background-image: ${bgGradient} !important;
        color: white !important;
      }
      
      .min-h-screen.relative {
        background-color: transparent !important;
      }
      
      #app-bg-gradient {
        background-image: ${bgGradient} !important;
        opacity: 1 !important;
        display: block !important;
      }
      
      #chrome-bg-fix {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background-color: ${bgColor} !important;
        background-image: ${bgGradient} !important;
        z-index: -9999 !important;
        pointer-events: none !important;
        opacity: 0.8 !important;
      }
    `;
    document.head.appendChild(style);
    
    // Sofort ausführen
    setBackgrounds();
    
    // Nach DOM-Laden erneut ausführen
    document.addEventListener('DOMContentLoaded', setBackgrounds);
    
    // Nach vollständigem Laden erneut ausführen
    window.addEventListener('load', function() {
      setBackgrounds();
      
      // Mehrmals nach dem Laden erneut versuchen
      setTimeout(setBackgrounds, 100);
      setTimeout(setBackgrounds, 500);
      setTimeout(setBackgrounds, 1000);
      setTimeout(setBackgrounds, 2000);
    });
    
    // MutationObserver für DOM-Änderungen
    const observer = new MutationObserver(function(mutations) {
      setBackgrounds();
    });
    
    // Beobachte DOM-Änderungen
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
})(); 