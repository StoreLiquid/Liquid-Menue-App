import React, { useState, useRef, useEffect } from 'react';

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
  
  // Funktion zum Scrollen nach ganz oben
  const scrollToTop = () => {
    // Direktes Scrollen ohne Animation für zuverlässigeres Verhalten in PWAs
    window.scrollTo(0, 0);
    
    // Zusätzliche Methoden für verschiedene Browser/Umgebungen
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    // Fallback mit setTimeout für einige PWA-Umgebungen
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 50);
  };
  
  const toggleQRCode = () => {
    const wasShowing = showQRCode;
    setShowQRCode(!showQRCode);
    
    // Wenn der QR-Code geschlossen wird, nach oben scrollen
    if (wasShowing) {
      scrollToTop();
    }
  };
  
  // Effekt zum Scrollen zum QR-Code, wenn er angezeigt wird
  useEffect(() => {
    if (showQRCode && qrCodeRef.current) {
      setTimeout(() => {
        try {
          // Berechne die Position des QR-Codes
          const rect = qrCodeRef.current.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const targetY = scrollTop + rect.top - 100; // 100px Abstand von oben
          
          // Scrolle direkt zur berechneten Position
          window.scrollTo(0, targetY);
        } catch (error) {
          console.log('QR-Code-Scroll-Fehler abgefangen:', error);
          // Fallback
          qrCodeRef.current?.scrollIntoView({ block: 'center' });
        }
      }, 100);
    }
  }, [showQRCode]);

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
          {/* QR-Code-Button nach oben verschieben, damit er besser erreichbar ist */}
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