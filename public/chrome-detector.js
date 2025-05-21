// Chrome-Detektor und CSS-Loader
(function() {
  // Prüfe, ob der Browser Chrome ist
  function isChrome() {
    const isChromium = window.chrome;
    const winNav = window.navigator;
    const vendorName = winNav.vendor;
    const isOpera = typeof window.opr !== "undefined";
    const isIEedge = winNav.userAgent.indexOf("Edg") > -1;
    const isIOSChrome = winNav.userAgent.match("CriOS");
    
    if (isIOSChrome) {
      return true;
    } else if (
      isChromium !== null &&
      typeof isChromium !== "undefined" &&
      vendorName === "Google Inc." &&
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
    link.href = '/chrome-fix.css';
    
    // Füge das Link-Element zum Head hinzu
    document.head.appendChild(link);
    
    // Füge eine Klasse zum HTML-Element hinzu, um Chrome-spezifische Styles zu ermöglichen
    document.documentElement.classList.add('is-chrome');
    
    // Füge ein Inline-Style für den Hintergrund hinzu
    const style = document.createElement('style');
    style.textContent = `
      body {
        background-color: #1A1820 !important;
      }
      
      #app-bg-gradient, 
      #app-bg-pattern, 
      #app-top-glow, 
      #app-corner-glow-1, 
      #app-corner-glow-2 {
        position: fixed !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);
  }
})(); 