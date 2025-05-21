// Chrome-Detektor und CSS-Loader - Verbesserte Version
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

  // Wenn Chrome erkannt wurde, lade die Chrome-spezifische CSS-Datei
  if (isChrome()) {
    console.log("Chrome Browser erkannt, lade spezifische Fixes...");
    
    // Erstelle ein Link-Element für die CSS-Datei
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = '/chrome-fix.css?v=' + new Date().getTime(); // Cache-Busting
    
    // Füge das Link-Element zum Head hinzu
    document.head.appendChild(link);
    
    // Füge eine Klasse zum HTML-Element hinzu, um Chrome-spezifische Styles zu ermöglichen
    document.documentElement.classList.add('is-chrome');
    
    // Füge ein Inline-Style für den Hintergrund hinzu
    const style = document.createElement('style');
    style.textContent = `
      html, body {
        background-color: #1A1820 !important;
        background-image: linear-gradient(to bottom right, #2A2832, #1A1820) !important;
      }
      
      #app-bg-gradient, 
      #app-bg-pattern, 
      #app-top-glow, 
      #app-corner-glow-1, 
      #app-corner-glow-2 {
        position: fixed !important;
        pointer-events: none !important;
      }
      
      /* Direkter Fix für den Hintergrund */
      .min-h-screen.relative {
        background: transparent !important;
      }
      
      /* Fallback-Hintergrund */
      body::before {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: linear-gradient(to bottom right, #2A2832, #1A1820);
        z-index: -999;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
    
    // Füge einen Event-Listener hinzu, der nach dem Laden der Seite ausgeführt wird
    window.addEventListener('load', function() {
      // Stelle sicher, dass der Hintergrund korrekt angezeigt wird
      document.documentElement.style.backgroundColor = '#1A1820';
      document.body.style.backgroundColor = '#1A1820';
      
      // Stelle sicher, dass das Scrollen funktioniert
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
      document.documentElement.style.height = 'auto';
      document.body.style.height = 'auto';
      document.documentElement.style.minHeight = '100%';
      document.body.style.minHeight = '100%';
      
      // Stelle sicher, dass der Container scrollbar ist
      const mainContainer = document.querySelector('main.container');
      if (mainContainer) {
        mainContainer.style.position = 'relative';
        mainContainer.style.zIndex = '5';
        mainContainer.style.overflowY = 'visible';
      }
      
      console.log("Chrome-spezifische Fixes wurden angewendet");
    });
  }
})(); 