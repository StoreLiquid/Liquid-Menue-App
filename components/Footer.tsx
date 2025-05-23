import React, { useState, useRef } from 'react';

interface FooterProps {
  isPwa: boolean;
  isMobile: boolean;
  isIOS: boolean;
}

/**
 * Footer-Komponente für die App
 * Enthält Copyright-Informationen und passt sich an verschiedene Gerätetypen an
 */
const Footer: React.FC<FooterProps> = ({ isPwa, isMobile, isIOS }) => {
  const [showQRCode, setShowQRCode] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  
  // Einfache Funktion zum Scrollen nach oben
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };
  
  const toggleQRCode = () => {
    // Speichere den aktuellen Zustand
    const wasShowing = showQRCode;
    
    // Aktualisiere den Zustand
    setShowQRCode(!showQRCode);
    
    // Wenn der QR-Code geschlossen wird, nach oben scrollen
    if (wasShowing) {
      // Verzögerung für iOS-Geräte
      setTimeout(() => {
        scrollToTop();
      }, 50);
    }
  };

  // Berechne zusätzlichen Abstand für mobile Geräte
  const extraPadding = isIOS ? 'env(safe-area-inset-bottom, 80px)' : (isMobile ? '70px' : '20px');

  return (
    <footer 
      className="border-t border-white/10 mt-12 py-6 text-center text-gray-300 relative z-100 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
      style={{ 
        background: isPwa 
          ? `linear-gradient(to bottom, transparent, var(--pwa-gradient-end))` 
          : `linear-gradient(to bottom, transparent, var(--app-bg))`,
        paddingBottom: extraPadding
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
          {/* Nach-oben-Scrollen-Button */}
          {!showQRCode && (
            <button 
              onClick={scrollToTop}
              className="mb-4 text-xs text-gray-400 hover:text-gray-300 transition-colors duration-300"
              aria-label="Nach oben scrollen"
            >
              Nach oben scrollen
            </button>
          )}
          
          {/* QR-Code-Button */}
          <div className="mb-8">
            <button 
              onClick={toggleQRCode}
              className="mb-2 text-sm bg-purple-900/50 hover:bg-purple-800/70 text-white py-2 px-4 rounded-lg transition-colors duration-300 flex items-center shadow-md"
              aria-label={showQRCode ? "QR-Code ausblenden" : "QR-Code anzeigen"}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && toggleQRCode()}
            >
              {showQRCode ? "QR-Code ausblenden" : "QR-Code anzeigen"}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`ml-1 w-4 h-4 transition-transform duration-300 ${showQRCode ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          {showQRCode && (
            <div 
              ref={qrCodeRef}
              className="mb-6 bg-black/40 backdrop-blur-sm border border-white/10 p-4 rounded-xl shadow-lg transition-all duration-300 ease-in-out"
              id="qr-code-container"
            >
              <p className="text-gray-300 text-xs mb-3 font-medium">Scanne diesen QR-Code, um die App zu öffnen</p>
              <div className="bg-white p-2 rounded-lg inline-block">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://liquid-menue-app.vercel.app/?fromQR=true`}
                  alt="QR-Code für https://liquid-menue-app.vercel.app/"
                  className="w-32 h-32"
                />
              </div>
            </div>
          )}
          
          <p>© 2025 Liquid Menü</p>
          <p className="text-xs mt-1 opacity-50">Created by A.G.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 