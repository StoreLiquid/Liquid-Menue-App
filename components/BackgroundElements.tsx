import React from 'react';

interface BackgroundElementsProps {
  isPwa: boolean;
  isMobile: boolean;
  isIOS: boolean;
}

/**
 * Komponente für alle Hintergrund-Elemente der App
 * Enthält den Haupthintergrund, Muster-Overlay, Sterne, Glanzeffekte und Partikel
 */
const BackgroundElements: React.FC<BackgroundElementsProps> = ({ isPwa, isMobile, isIOS }) => {
  return (
    <>
      {/* Hintergrundverlauf mit Animation für die gesamte App */}
      <div 
        id="app-bg-gradient" 
        className="fixed inset-0 w-screen h-screen bg-gradient-radial animate-gradient-slow"
        style={{ 
          backgroundImage: `radial-gradient(circle at top right, ${isPwa ? 'var(--pwa-gradient-start)' : 'var(--gradient-start)'}, ${isPwa ? 'var(--pwa-gradient-middle)' : 'var(--gradient-middle)'}, ${isPwa ? 'var(--pwa-gradient-end)' : 'var(--gradient-end)'})`
        }}
      ></div>
      
      {/* Subtiles Muster-Overlay für mehr Tiefe */}
      <div id="app-bg-pattern" className="fixed inset-0 w-screen h-screen opacity-20 bg-[url('/noise-pattern.svg')] mix-blend-overlay"></div>
      
      {/* Animierte Sterne */}
      <div className="stars">
        {Array.from({ length: isPwa ? 30 : (isMobile ? 15 : 20) }).map((_, i) => {
          const size = Math.random() * 3 + (isMobile ? 1.5 : 1);
          const posX = Math.random() * 100;
          const posY = Math.random() * 100;
          const duration = Math.random() * 10 + 10;
          const delay = Math.random() * 10;
          
          return (
            <div 
              key={`star-${i}`}
              className="star"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${posX}%`,
                top: `${posY}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                '--duration': `${duration}s`,
                opacity: isPwa ? '0.8' : (isMobile ? '0.7' : undefined)
              } as React.CSSProperties}
            />
          );
        })}
      </div>
      
      {/* Glanzeffekt am oberen Rand */}
      <div 
        id="app-top-glow" 
        className="fixed top-0 left-0 right-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#8a2be2]/50 to-transparent animate-pulse-light"
        style={{ opacity: isPwa ? '0.7' : (isMobile ? '0.5' : '0.3') }}
      ></div>
      
      {/* Subtiler Glanzeffekt in der oberen rechten Ecke */}
      <div 
        id="app-corner-glow-1" 
        className="fixed top-0 right-0 w-60 h-60 bg-gradient-radial from-[#8a2be2]/20 to-transparent rounded-full -translate-x-1/4 -translate-y-1/2 animate-pulse-light"
        style={{ opacity: isPwa ? '0.7' : (isMobile ? '0.5' : '0.2') }}
      ></div>
      
      {/* Subtiler Glanzeffekt in der unteren linken Ecke */}
      <div 
        id="app-corner-glow-2" 
        className="fixed bottom-0 left-0 w-80 h-80 bg-gradient-radial from-[#8a2be2]/20 to-transparent rounded-full -translate-x-1/3 translate-y-1/3 animate-pulse-light"
        style={{ opacity: isPwa ? '0.7' : (isMobile ? '0.5' : '0.2') }}
      ></div>
      
      {/* Zusätzlicher Glanzeffekt in der Mitte */}
      <div 
        id="app-center-glow" 
        className="fixed top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-radial from-[#8a2be2]/10 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse-light"
        style={{ opacity: isPwa ? '0.7' : (isMobile ? '0.4' : '0.1') }}
      ></div>

      {/* Animierte Partikel */}
      <div className="fixed inset-0 z-[-9994] overflow-hidden">
        {Array.from({ length: isPwa ? 8 : (isMobile ? 4 : 5) }).map((_, i) => {
          const size = Math.random() * (isMobile ? 80 : 100) + (isMobile ? 30 : 50);
          const posX = Math.random() * 100;
          const posY = Math.random() * 100;
          const duration = Math.random() * 30 + 30;
          const delay = Math.random() * 10;
          
          return (
            <div 
              key={`particle-${i}`}
              className="absolute rounded-full bg-gradient-radial from-[#8a2be2]/5 to-transparent animate-pulse-light"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${posX}%`,
                top: `${posY}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                opacity: isPwa ? '0.7' : (isMobile ? '0.4' : '0.2')
              }}
            />
          );
        })}
      </div>
      
      {/* PWA-spezifischer zusätzlicher Hintergrund für iOS */}
      {isPwa && isIOS && (
        <div className="fixed inset-0 z-[-9995] bg-gradient-radial from-[#3a2a5a]/50 to-transparent"></div>
      )}
      
      {/* Zusätzlicher Hintergrund für mobile Geräte */}
      {isMobile && !isPwa && (
        <div className="fixed inset-0 z-[-9995] bg-gradient-radial from-[#2c1e4a]/30 to-transparent"></div>
      )}
    </>
  );
};

export default BackgroundElements; 