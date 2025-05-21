// Chrome-Hintergrund-Fix - Vereinfacht
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

  // Wenn Chrome erkannt wurde, füge einen einfachen Hintergrund hinzu
  if (isChrome()) {
    console.log("Chrome Browser erkannt, füge einfachen Hintergrund hinzu...");
    
    // Füge ein Inline-Style für den Body hinzu
    const style = document.createElement('style');
    style.textContent = `
      body, html {
        background-color: #1A1820 !important;
      }
      
      .min-h-screen.relative {
        background-color: transparent !important;
      }
    `;
    document.head.appendChild(style);
  }
})(); 