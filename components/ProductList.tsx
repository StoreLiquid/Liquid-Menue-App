import React, { useEffect } from 'react';
import { Liquid } from '../types';

interface ProductListProps {
  liquids: Liquid[];
  manufacturerId: string | null;
  selectedCategory: string | null;
  selectedTags: string[];
}

const ProductList = ({ 
  liquids, 
  manufacturerId, 
  selectedCategory,
  selectedTags
}: ProductListProps) => {
  // Debug-Logging
  useEffect(() => {
    if (manufacturerId && liquids.length > 0) {
      console.log(`ProductList: ${liquids.length} Produkte für ID "${manufacturerId}", Kategorie=${selectedCategory}`);
      
      const filteredProducts = liquids.filter(liquid => 
        liquid.herstellerId === manufacturerId &&
        (!selectedCategory || liquid.kategorie === selectedCategory)
      );
      
      console.log(`Gefiltert: ${filteredProducts.length} Produkte`);
    }
  }, [manufacturerId, liquids, selectedCategory]);

  // Wenn kein Hersteller ausgewählt ist, zeige keine Produkte an
  if (!manufacturerId) {
    return null;
  }

  // Filtere Produkte nach Hersteller und Kategorie
  let filteredProducts = liquids.filter(liquid => {
    // 1. Herstellerfilter
    if (liquid.herstellerId !== manufacturerId) return false;
    
    // 2. Kategoriefilter
    if (selectedCategory && liquid.kategorie !== selectedCategory) {
      return false;
    }
    
    // 3. Tags-Filter
    if (selectedTags && selectedTags.length > 0) {
      return selectedTags.every(tag => 
        liquid.tags && liquid.tags.some(liquidTag => 
          liquidTag.toLowerCase().includes(tag.toLowerCase())
        )
      );
    }
    
    return true;
  });
  
  // Sortierung: Hersteller > Sorte
  filteredProducts.sort((a, b) => {
    if (a.hersteller !== b.hersteller) {
      return a.hersteller.localeCompare(b.hersteller);
    }
    return a.sorte.localeCompare(b.sorte);
  });

  // Hersteller-Name bestimmen, falls ein Hersteller ausgewählt ist
  const herstellerName = filteredProducts.length > 0 
    ? filteredProducts[0].hersteller 
    : '';

  // Titel für den Hersteller
  const getTitle = () => {
    let title = `${herstellerName} Produkte`;
    if (selectedCategory) {
      title += ` (${selectedCategory})`;
    }
    return title;
  };

  // Hilfsfunktion für Preisformatierung - entfernt € Symbol wenn vorhanden
  const formatPrice = (price: string | undefined): string => {
    if (!price) return '9,99€';
    
    // Entferne € Symbol wenn es bereits im Preis enthalten ist
    return price.includes('€') ? price : `${price}€`;
  };

  return (
    <div className="mt-4">
      {filteredProducts.length > 0 && (
        <h2 className="text-lg font-semibold mb-4 text-center text-white">
          {getTitle()}
        </h2>
      )}
      
      {filteredProducts.length === 0 ? (
        <div className="text-center text-gray-400 py-3">
          <p className="text-sm">Keine Produkte gefunden</p>
          <p className="text-xs">Andere Kategorie wählen</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredProducts.map((liquid, index) => (
            <div 
              key={liquid.id} 
              className="bg-black/15 backdrop-blur-sm rounded-lg shadow-md border border-white/10 hover:shadow-lg transition-all overflow-hidden relative flex flex-col"
            >
              {/* Header mit Sorte */}
              <div className="bg-black/20 px-4 py-3 border-b border-white/10 relative">
                <div className="text-white font-semibold text-center text-base">
                  {liquid.sorte}
                </div>
              </div>
              
              {/* Nikotinstärke als großer Fokuspunkt */}
              <div className="bg-gradient-to-b from-black/5 to-transparent py-4 text-center">
                <h3 className="text-2xl font-bold text-white">{liquid.nikotin || '10mg / 20mg Salz'}</h3>
              </div>
              
              {/* Produktdetails in einer Card */}
              <div className="px-4 py-3 flex-grow">
                <div className="bg-black/10 rounded-lg p-3 border border-white/10">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div>
                      <div className="text-gray-400 text-xs mb-1">Füllmenge</div>
                      <div className="text-white text-sm font-medium">{liquid.fuellmenge || '10ml'}</div>
                    </div>
                    
                    <div>
                      <div className="text-gray-400 text-xs mb-1">Preis</div>
                      <div className="text-white text-sm font-bold">{formatPrice(liquid.preis)}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tags unten als Badges */}
              <div className="bg-black/20 p-2.5 flex flex-wrap justify-center gap-1.5 border-t border-white/10">
                {/* Andere Tags */}
                {liquid.tags && liquid.tags.map((tag, index) => (
                  <div 
                    key={`${liquid.id}-${index}`}
                    className="rounded-full inline-flex items-center justify-center py-0.5 px-2 bg-black/15 border border-white/10 text-white"
                  >
                    <span className="text-xs text-center">{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList; 