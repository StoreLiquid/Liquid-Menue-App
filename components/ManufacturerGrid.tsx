import React, { useEffect, useRef } from 'react';
import { Manufacturer, CategoryType, Liquid } from '../types';

interface ManufacturerGridProps {
  hersteller: Manufacturer[];
  selectedCategory?: CategoryType | string | null;
  onManufacturerClick: (manufacturerId: string) => void;
  selectedManufacturer?: string | null;
  liquids?: Liquid[]; // Liste der Liquids hinzugefügt, um Sorten anzuzeigen
  isSearchMode?: boolean; // Flag für den Suchmodus
}

const ManufacturerGrid = ({ 
  hersteller, 
  selectedCategory, 
  onManufacturerClick,
  selectedManufacturer,
  liquids = [], // Default leeres Array
  isSearchMode = false // Default: Nicht im Suchmodus
}: ManufacturerGridProps) => {
  // Filtere Hersteller nach Kategorie, wenn eine Kategorie ausgewählt ist
  const filteredHersteller = selectedCategory 
    ? hersteller.filter(h => h.kategorien.includes(selectedCategory))
    : hersteller;

  // Handler für den Hersteller-Klick mit Debugging
  const handleManufacturerClick = (id: string) => {
    console.log("Hersteller angeklickt:", id);
    onManufacturerClick(id);
  };

  // Helfer-Funktion um zu prüfen ob ein Hersteller Produkte in einer bestimmten Kategorie hat
  const hasProductsInCategory = (herstellerId: string, category: string): boolean => {
    if (!liquids || liquids.length === 0) return false;
    
    return liquids.some(liquid => 
      liquid.herstellerId === herstellerId && 
      liquid.kategorie === category
    );
  };

  // Funktion um die häufigste Füllmenge für einen Hersteller bei der Suche zu bestimmen
  // Immer die Füllmenge zurückgeben, auch wenn es nur ein Produkt gibt
  const getCommonFillVolume = (herstellerId: string): string | null => {
    if (!liquids || liquids.length === 0) return null;
    
    // Nur Produkte dieses Herstellers filtern
    const herstellerLiquids = liquids.filter(liquid => liquid.herstellerId === herstellerId);
    
    if (herstellerLiquids.length === 0) return null;
    
    // Zählen aller Füllmengen
    const fillVolumeCounts: Record<string, number> = {};
    
    herstellerLiquids.forEach(liquid => {
      if (liquid.fuellmenge) {
        fillVolumeCounts[liquid.fuellmenge] = (fillVolumeCounts[liquid.fuellmenge] || 0) + 1;
      }
    });
    
    // Wenn keine Füllmengen gefunden wurden
    if (Object.keys(fillVolumeCounts).length === 0) return null;
    
    // Häufigste Füllmenge finden
    const topFillVolume = Object.keys(fillVolumeCounts).reduce((a, b) => 
      fillVolumeCounts[a] > fillVolumeCounts[b] ? a : b
    );
    
    return topFillVolume;
  };

  // CSS für die Float-Animation (außerhalb des JSX für bessere Organisation)
  // Wir fügen es dynamisch hinzu, um es nicht für andere Komponenten zu beeinflussen
  useEffect(() => {
    // Füge die Keyframe-Animation zum <head>-Element hinzu
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      @keyframes float {
        0% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-10px);
        }
        100% {
          transform: translateY(0px);
        }
      }
      
      @keyframes pulse {
        0% {
          opacity: 0.2;
        }
        50% {
          opacity: 0.4;
        }
        100% {
          opacity: 0.2;
        }
      }
      
      .manufacturer-logo {
        animation: float 3s ease-in-out infinite;
      }
      
      .logo-glow {
        animation: pulse 4s ease-in-out infinite;
      }
    `;
    document.head.appendChild(styleTag);

    // Cleanup-Funktion
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  // Kompakte Darstellung wenn bereits ein Hersteller ausgewählt ist
  if (selectedManufacturer) {
    return (
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2 text-center text-gray-100">
          {selectedCategory ? 'Hersteller' : ''}
        </h2>
        
        {filteredHersteller.length === 0 ? (
          <p className="text-center text-gray-400">Keine Hersteller für diese Kategorie gefunden</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            {filteredHersteller.map((manufacturer) => {
              // Bei der Suche die häufigste Füllmenge anzeigen
              const fillVolume = isSearchMode ? getCommonFillVolume(manufacturer.id) : null;
              
              return (
                <div 
                  key={manufacturer.id}
                  onClick={() => handleManufacturerClick(manufacturer.id)}
                  className={`rounded-xl py-1 px-3 shadow-sm cursor-pointer transition-all flex items-center justify-center min-w-[48px] border ${
                    manufacturer.id === selectedManufacturer
                      ? 'bg-black/15 border-white/30 text-white'
                      : 'bg-black/10 border-white/10 text-gray-300 hover:bg-black/15'
                  }`}
                  tabIndex={0}
                  role="button"
                  aria-label={`Hersteller ${manufacturer.name} auswählen`}
                  aria-pressed={manufacturer.id === selectedManufacturer}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleManufacturerClick(manufacturer.id);
                    }
                  }}
                >
                  <span className="text-sm font-semibold text-center w-full">
                    {manufacturer.name}
                    {/* Füllmenge direkt beim Herstellernamen anzeigen statt als separates Badge */}
                    {isSearchMode && fillVolume && (
                      <span className="ml-1 opacity-80">{fillVolume}</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Normale Darstellung wenn kein Hersteller ausgewählt ist
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4 text-center text-gray-100">
        {selectedCategory ? 'Hersteller' : ''}
      </h2>
      
      {filteredHersteller.length === 0 ? (
        <p className="text-center text-gray-400">Keine Hersteller für diese Kategorie gefunden</p>
      ) : (
        // Zeige den Grid nur an, wenn eine Kategorie ausgewählt ist
        (selectedCategory || true) ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredHersteller.map((manufacturer, index) => {
              // Prüfe ob der Hersteller Produkte in der ausgewählten Kategorie hat
              const hasProductsInSelectedCategory = selectedCategory ? 
                hasProductsInCategory(manufacturer.id, selectedCategory) : true;
              
              // Bei der Suche die häufigste Füllmenge anzeigen
              const fillVolume = isSearchMode ? getCommonFillVolume(manufacturer.id) : null;
              
              return (
                <div 
                  key={manufacturer.id}
                  onClick={() => handleManufacturerClick(manufacturer.id)}
                  style={{ animationDelay: `${index * 0.2}s` }} // Verzögerung basierend auf dem Index
                  className="bg-black/10 backdrop-blur-sm p-4 rounded-lg shadow-md border border-white/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                  tabIndex={0}
                  role="button"
                  aria-label={`Hersteller ${manufacturer.name} auswählen`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                        handleManufacturerClick(manufacturer.id);
                    }
                  }}
                >
                  <div className="flex flex-col items-center">
                      <div 
                        className="w-28 h-28 mb-4 flex items-center justify-center relative group"
                        style={{ animationDelay: `${index * 0.2}s` }} // Individuelle Verzögerung
                      >
                        {/* Animation-Effekt */}
                        <div className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
                        
                        {/* Bewegungseffekt */}
                        <div className="relative w-full h-full overflow-hidden manufacturer-logo">
                        <img 
                          src="/Bilder/Logo Rund.svg" 
                          alt={`Logo von ${manufacturer.name}`}
                          className="w-full h-full object-contain z-10 relative transition-transform duration-500 hover:scale-110"
                        />
                        </div>
                    </div>
                    
                    <h3 className="font-medium text-center text-gray-100 text-lg">
                      {manufacturer.name}
                      {/* Füllmenge im Suchmodus direkt beim Namen anzeigen */}
                      {isSearchMode && fillVolume && (
                        <span className="ml-1 opacity-80 text-xs">{fillVolume}</span>
                      )}
                    </h3>
                      
                      {/* Kategorie-Tags hinzufügen - nur anzeigen wenn passend */}
                      <div className="flex flex-wrap justify-center gap-1 mt-2">
                        {manufacturer.kategorien
                          .filter(kategorie => !selectedCategory || kategorie === selectedCategory)
                          .map((kategorie, idx) => (
                            <span 
                              key={`${manufacturer.id}-${kategorie}-${idx}`}
                              className="px-2 py-0.5 bg-black/10 text-gray-300 text-xs rounded-full border border-white/10"
                            >
                              {kategorie}
                            </span>
                          ))}
                          
                        {/* Füllmenge-Badge als separates Badge entfernen */}
                      </div>
                  </div>
                </div>
              );
            })}
        </div>
        ) : null
      )}
    </div>
  );
};

export default ManufacturerGrid; 