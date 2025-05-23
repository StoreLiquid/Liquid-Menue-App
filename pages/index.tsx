import { useEffect, useState, useRef } from 'react';
import CategoryButtons from '../components/CategoryButtons';
import ManufacturerGrid from '../components/ManufacturerGrid';
import Searchbar from '../components/Searchbar';
import ProductList from '../components/ProductList';
import BackgroundElements from '../components/BackgroundElements';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AutoRefresh from '../components/AutoRefresh';
import useDeviceDetection from '../hooks/useDeviceDetection';
import { Manufacturer, Liquid, CategoryType } from '../types';

// Test-Änderung für Vercel Deployment vom master-Branch

export default function Home() {
  // Zustandsvariablen für Daten
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [liquids, setLiquids] = useState<Liquid[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | string | null>("10ml");
  const [selectedManufacturerId, setSelectedManufacturerId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [searchResults, setSearchResults] = useState<Liquid[]>([]);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  
  // Referenz für den ProductList-Bereich
  const productListRef = useRef<HTMLDivElement>(null);

  // Geräte-Erkennung mit unserem neuen Hook
  const { isPwa, isMobile, isTablet, isIOS } = useDeviceDetection();

  // Laden der Hersteller und Liquids
  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Lade Hersteller- und Produktdaten...");
      
      // Lade sowohl Hersteller als auch Liquids
      const manufacturersResponse = await fetch('/api/hersteller');
      const liquidsResponse = await fetch('/api/sheets');
      
      if (!manufacturersResponse.ok) {
        console.error(`Hersteller konnten nicht geladen werden: ${manufacturersResponse.status}`);
        throw new Error('Fehler beim Laden der Herstellerdaten');
      }
      
      if (!liquidsResponse.ok) {
        console.error(`Produkte konnten nicht geladen werden: ${liquidsResponse.status}`);
        throw new Error('Fehler beim Laden der Produktdaten');
      }
      
      const manufacturersData = await manufacturersResponse.json();
      const liquidsData = await liquidsResponse.json();
      
      console.log("Daten geladen:");
      console.log(`- Hersteller: `, manufacturersData);
      console.log(`- Produkte: ${liquidsData.length}`);
      
      // Speichere die Hersteller gruppiert nach Kategorie
      const categoryManufacturers = manufacturersData.byCategory || { 
        '10ml': [],
        '60ml': [],
        '120ml': []
      };
      
      // Speichere alle Hersteller als flaches Array für die Anzeige
      let allManufacturers: Manufacturer[] = [];
      
      // Wenn wir Kategorien haben, erstelle eine flache Liste
      if (categoryManufacturers && Object.keys(categoryManufacturers).length > 0) {
        // Erstelle ein Set von IDs um Duplikate zu vermeiden
        const seenIds = new Set<string>();
        
        // Sammle Hersteller aus allen Kategorien
        Object.entries(categoryManufacturers).forEach(([category, mfrs]) => {
          if (Array.isArray(mfrs)) {
            mfrs.forEach((mfr: Manufacturer) => {
              if (!seenIds.has(mfr.id)) {
                allManufacturers.push(mfr);
                seenIds.add(mfr.id);
              }
            });
          }
        });
      }
      
      setManufacturers(allManufacturers);
      setLiquids(liquidsData);
    } catch (error: any) {
      console.error('Fehler beim Laden der Daten:', error);
      alert(`Fehler beim Laden der Daten: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  // Handler für Cache-Reset und Daten neu laden
  const handleSyncData = async () => {
    setIsSyncing(true);
    try {
      console.log("Cache zurücksetzen...");
      // Verwende den neuen API-Endpunkt
      const response = await fetch('/api/sync-cache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          timestamp: Date.now()
        })
      });
      
      if (!response.ok) {
        throw new Error('Cache-Reset fehlgeschlagen');
      }
      
      console.log("Cache zurückgesetzt, warte kurz...");
      // Warte einen Moment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Timestamp für Cache-Busting
      const timestamp = Date.now();
      console.log("Lade Daten neu...");
      
      // Lade Daten neu
      await fetchData();
      
      console.log("Aktualisierung abgeschlossen!");
      // Keine Erfolgsmeldung mehr anzeigen
    } catch (error: any) {
      console.error('Fehler beim Synchronisieren:', error);
      alert(`Fehler bei der Synchronisation: ${error.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Globale Produktsuche 
  useEffect(() => {
    if (searchTerm && searchTerm.length >= 3 && liquids && liquids.length > 0) {
      // Logging für Debug-Zwecke
      console.log(`Suche nach "${searchTerm}" in ${liquids.length} Produkten`);
      
      // Suchbegriffe in einzelne Wörter aufteilen
      const searchTerms = searchTerm.toLowerCase().split(/\s+/).filter(term => term.length >= 2);
      console.log("Suchbegriffe:", searchTerms);
      
      // Globale Suche mit Fehlerprüfung für jedes Feld
      const foundProducts = liquids.filter(liquid => {
        // Prüfe, ob die Objekte die erwartete Struktur haben
        if (!liquid) return false;
        
        // Für jeden Suchbegriff prüfen
        return searchTerms.every(term => {
          const sorteMatch = liquid.sorte && typeof liquid.sorte === 'string' ? 
            liquid.sorte.toLowerCase().includes(term) : false;
            
          const herstellerMatch = liquid.hersteller && typeof liquid.hersteller === 'string' ? 
            liquid.hersteller.toLowerCase().includes(term) : false;
            
          const tagMatch = liquid.tags && Array.isArray(liquid.tags) ? 
            liquid.tags.some(tag => tag && typeof tag === 'string' && 
              tag.toLowerCase().includes(term)
            ) : false;
            
          return sorteMatch || herstellerMatch || tagMatch;
        });
      });
      
      console.log(`Gefunden: ${foundProducts.length} Produkte`);
      setSearchResults(foundProducts);
      setIsSearchActive(true);
      
      // Wenn Produkte gefunden wurden, einen passenden Hersteller auswählen
      if (foundProducts.length > 0) {
        // Zähle Vorkommen jeder Hersteller-ID
        const herstellerCounts: Record<string, number> = {};
        
        foundProducts.forEach(product => {
          if (product.herstellerId) {
            herstellerCounts[product.herstellerId] = (herstellerCounts[product.herstellerId] || 0) + 1;
          }
        });
        
        // Nur wenn wir Hersteller haben, nehme den häufigsten
        if (Object.keys(herstellerCounts).length > 0) {
          const topHerstellerId = Object.keys(herstellerCounts).reduce((a, b) => 
            herstellerCounts[a] > herstellerCounts[b] ? a : b
          );
          
          setSelectedManufacturerId(topHerstellerId);
        }
      } else {
        setSelectedManufacturerId(null);
      }
    } else {
      setIsSearchActive(false);
      setSearchResults([]);
    }
  }, [searchTerm, liquids]);

  // Such-Handler
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Wenn weniger als 3 Zeichen eingegeben werden, normale Ansicht wiederherstellen
    if (term.length < 3) {
      setIsSearchActive(false);
    }
  };

  // Kategorie-Handler
  const handleCategoryChange = (category: CategoryType | string | null) => {
    setSelectedCategory(category);
    // Bei Kategorie-Wechsel den ausgewählten Hersteller und Suchterm zurücksetzen
    setSelectedManufacturerId(null);
    setSearchTerm('');
    setIsSearchActive(false);
  };

  // Hersteller-Handler
  const handleManufacturerClick = (manufacturerId: string) => {
    // Wenn der gleiche Hersteller erneut angeklickt wird, deselektieren
    if (selectedManufacturerId === manufacturerId) {
      setSelectedManufacturerId(null);
      return;
    }
    
    setSelectedManufacturerId(manufacturerId);
    
    // Scroll zum Produktbereich
    setTimeout(() => {
      if (productListRef.current) {
        productListRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  // Filter Hersteller nach Kategorie
  const filteredManufacturers = manufacturers.filter(manufacturer => {
    // Stellen wir sicher, dass der Hersteller eine gültige Struktur hat
    if (!manufacturer || !manufacturer.name || !Array.isArray(manufacturer.kategorien)) {
      return false;
    }

    // Bei Suche nach Herstellername filtern (ignoriere die Kategorie komplett)
    if (searchTerm && searchTerm.length >= 3) {
      // Bei globaler Suche alle Hersteller anzeigen, die in den Suchergebnissen vorkommen
      return searchResults.some(product => 
        product.herstellerId === manufacturer.id
      );
    }
    
    // Wenn keine Suche aktiv ist, zeige nur Hersteller der ausgewählten Kategorie
    if (selectedCategory) {
      return manufacturer.kategorien.includes(selectedCategory);
    }
    
    return true; // Fallback: Zeige alle, wenn keine Filterkriterien
  });

  // Füge Zurück-Button ein, wenn ein Hersteller ausgewählt ist
  const renderBackButton = () => {
    if (!selectedManufacturerId) return null;
    
    return (
      <button
        onClick={() => setSelectedManufacturerId(null)}
        className="bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/40 hover:border-white/20 text-white py-2 px-4 rounded-xl flex items-center justify-center mb-4 transition-all shadow-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Zurück
      </button>
    );
  };

  return (
    <div className="min-h-screen relative overflow-y-auto overflow-x-hidden text-white">
      {/* Hintergrund-Elemente */}
      <BackgroundElements isPwa={isPwa} isMobile={isMobile} isIOS={isIOS} />
      
      {/* Header mit Meta-Tags */}
      <Header isPwa={isPwa} />

      <main className="container mx-auto px-4 py-8 relative z-10 overflow-visible">
        {/* Hauptinhalt */}
        <div className="mb-8">
          <CategoryButtons 
            selectedCategory={isSearchActive ? null : selectedCategory} 
            onCategoryChange={handleCategoryChange} 
          />
        </div>

        <div className="mb-8 flex items-center justify-between">
          <div className="flex-grow mr-2">
            <Searchbar onSearch={handleSearch} initialValue={searchTerm} />
          </div>
          
          {/* Sync Button nur als Icon */}
          <button
            onClick={handleSyncData}
            disabled={isSyncing || loading}
            className="bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/40 hover:border-white/20 text-white p-2 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
            title="Daten neu laden"
          >
            {isSyncing ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
          </button>
        </div>

        {/* Zurück-Button wenn ein Hersteller ausgewählt ist */}
        {renderBackButton()}

        {/* Hersteller-Grid */}
        {loading ? (
          <div className="text-center py-12 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 shadow-md">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            <p className="mt-4">Lade Daten...</p>
          </div>
        ) : (
          <>
            {isSearchActive && searchResults.length > 0 && (
              <div className="mb-4 text-center">
                <p className="text-gray-300">{searchResults.length} Produkte gefunden für "{searchTerm}"</p>
              </div>
            )}
            
            <ManufacturerGrid 
              hersteller={filteredManufacturers} 
              selectedCategory={isSearchActive ? null : selectedCategory} 
              onManufacturerClick={handleManufacturerClick}
              selectedManufacturer={selectedManufacturerId}
              liquids={isSearchActive ? searchResults : liquids}
              isSearchMode={isSearchActive}
            />
            
            {/* Produktliste mit Ref für Scrolling */}
            <div ref={productListRef} className="overflow-visible">
              <ProductList 
                liquids={isSearchActive ? searchResults : liquids}
                manufacturerId={selectedManufacturerId}
                selectedCategory={isSearchActive ? null : selectedCategory}
                selectedTags={[]}
              />
            </div>
          </>
        )}
      </main>

      {/* Footer mit QR-Code */}
      <Footer isPwa={isPwa} isMobile={isMobile} isIOS={isIOS} />

      {/* Auto Refresh Component */}
      <AutoRefresh />
    </div>
  );
} 