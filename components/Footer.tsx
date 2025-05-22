import React from 'react';

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
  return (
    <footer 
      className="border-t border-white/10 mt-12 py-6 text-center text-gray-300 relative z-100 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
      style={{ 
        background: isPwa 
          ? `linear-gradient(to bottom, transparent, var(--pwa-gradient-end))` 
          : `linear-gradient(to bottom, transparent, var(--app-bg))`,
        paddingBottom: isIOS ? 'env(safe-area-inset-bottom, 20px)' : (isMobile ? '16px' : '20px')
      }}
    >
      <div className="container mx-auto px-4">
        <p>© 2025 Liquid Menü</p>
        <p className="text-xs mt-1 opacity-50">Created by A.G.</p>
      </div>
    </footer>
  );
};

export default Footer; 