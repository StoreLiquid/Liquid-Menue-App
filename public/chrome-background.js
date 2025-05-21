// Chrome-Hintergrund-Fix
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

  // Wenn Chrome erkannt wurde, füge einen festen Hintergrund hinzu
  if (isChrome()) {
    console.log("Chrome Browser erkannt, füge festen Hintergrund hinzu...");
    
    // Erstelle ein Div-Element für den Hintergrund
    const backgroundDiv = document.createElement('div');
    backgroundDiv.id = 'chrome-background-fix';
    backgroundDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100vw;
      height: 100vh;
      background-image: linear-gradient(to bottom right, #2A2832, #1A1820);
      z-index: -9999;
      pointer-events: none;
    `;
    
    // Füge das Div-Element zum Body hinzu
    document.body.insertBefore(backgroundDiv, document.body.firstChild);
    
    // Füge ein Inline-Style für den Body hinzu
    const style = document.createElement('style');
    style.textContent = `
      body, html {
        background-color: #1A1820 !important;
        background-image: linear-gradient(to bottom right, #2A2832, #1A1820) !important;
      }
    `;
    document.head.appendChild(style);
  }
})(); 