import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import CategoryButtons from '../components/CategoryButtons';
import ManufacturerGrid from '../components/ManufacturerGrid';
import Searchbar from '../components/Searchbar';
import ProductList from '../components/ProductList';
import { Manufacturer, Liquid, CategoryType } from '../types';

// Test-Änderung für Vercel Deployment vom master-Branch

export default function Home() {
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

  // Neue State-Variable für PWA-Modus
  const [isPwa, setIsPwa] = useState<boolean>(false);
  
  // PWA-Erkennung
  useEffect(() => {
    // Prüfen, ob die App im Standalone-Modus (PWA) läuft
    const isInStandaloneMode = () => 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone || 
      document.referrer.includes('android-app://');
      
    setIsPwa(isInStandaloneMode());
    
    // Event-Listener für Änderungen im Display-Modus
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e: MediaQueryListEvent) => setIsPwa(e.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

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
      alert('Daten erfolgreich aktualisiert!');
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
      
      // Globale Suche mit Fehlerprüfung für jedes Feld
      const foundProducts = liquids.filter(liquid => {
        // Prüfe, ob die Objekte die erwartete Struktur haben
        if (!liquid) return false;
        
        const sorteMatch = liquid.sorte && typeof liquid.sorte === 'string' ? 
          liquid.sorte.toLowerCase().includes(searchTerm.toLowerCase()) : false;
          
        const herstellerMatch = liquid.hersteller && typeof liquid.hersteller === 'string' ? 
          liquid.hersteller.toLowerCase().includes(searchTerm.toLowerCase()) : false;
          
        const tagMatch = liquid.tags && Array.isArray(liquid.tags) ? 
          liquid.tags.some(tag => tag && typeof tag === 'string' && 
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          ) : false;
          
        return sorteMatch || herstellerMatch || tagMatch;
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
        {Array.from({ length: isPwa ? 30 : 20 }).map((_, i) => {
          const size = Math.random() * 3 + 1;
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
                opacity: isPwa ? '0.8' : undefined
              } as React.CSSProperties}
            />
          );
        })}
      </div>
      
      {/* Glanzeffekt am oberen Rand */}
      <div 
        id="app-top-glow" 
        className="fixed top-0 left-0 right-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#8a2be2]/50 to-transparent animate-pulse-light"
        style={{ opacity: isPwa ? '0.7' : '0.3' }}
      ></div>
      
      {/* Subtiler Glanzeffekt in der oberen rechten Ecke */}
      <div 
        id="app-corner-glow-1" 
        className="fixed top-0 right-0 w-60 h-60 bg-gradient-radial from-[#8a2be2]/20 to-transparent rounded-full -translate-x-1/4 -translate-y-1/2 animate-pulse-light"
        style={{ opacity: isPwa ? '0.7' : '0.2' }}
      ></div>
      
      {/* Subtiler Glanzeffekt in der unteren linken Ecke */}
      <div 
        id="app-corner-glow-2" 
        className="fixed bottom-0 left-0 w-80 h-80 bg-gradient-radial from-[#8a2be2]/20 to-transparent rounded-full -translate-x-1/3 translate-y-1/3 animate-pulse-light"
        style={{ opacity: isPwa ? '0.7' : '0.2' }}
      ></div>
      
      {/* Zusätzlicher Glanzeffekt in der Mitte */}
      <div 
        id="app-center-glow" 
        className="fixed top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-radial from-[#8a2be2]/10 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse-light"
        style={{ opacity: isPwa ? '0.7' : '0.1' }}
      ></div>

      {/* Animierte Partikel */}
      <div className="fixed inset-0 z-[-9994] overflow-hidden">
        {Array.from({ length: isPwa ? 8 : 5 }).map((_, i) => {
          const size = Math.random() * 100 + 50;
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
                opacity: isPwa ? '0.7' : '0.2'
              }}
            />
          );
        })}
      </div>
      
      {/* PWA-spezifischer zusätzlicher Hintergrund für iOS */}
      {isPwa && (
        <div className="fixed inset-0 z-[-9995] bg-gradient-radial from-[#3a2a5a]/50 to-transparent"></div>
      )}
      
      <Head>
        <title>Liquid Menü</title>
        <meta name="description" content="E-Liquid Produktkatalog" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content={isPwa ? "#3a2a5a" : "#1A1820"} />
        <meta name="background-color" content={isPwa ? "#3a2a5a" : "#1A1820"} />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>

      <main className="container mx-auto px-4 py-8 relative z-10 overflow-visible">
        {/* Header ohne Kasten */}
        <div className="flex flex-col items-center justify-center mb-8">
          {/* Logo mit Cache-Busting-Parameter */}
          <img 
            src={`/Liquid-Menue.svg?v=${new Date().getTime()}`}
            alt="Liquid Menü Logo"
            className="w-64 h-40 mb-4 filter drop-shadow-xl"
          />
          <p className="text-gray-300 text-center mb-2">
            Dein E-Liquid Produktkatalog
          </p>
        </div>

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

      <footer 
        className="border-t border-white/10 mt-12 py-6 text-center text-gray-300 relative z-100 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
        style={{ 
          background: isPwa 
            ? `linear-gradient(to bottom, transparent, var(--pwa-gradient-end))` 
            : `linear-gradient(to bottom, transparent, var(--app-bg))`
        }}
      >
        <div className="container mx-auto px-4">
          <p>© 2025 Liquid Menü</p>
          <p className="text-xs mt-1 opacity-50">Created by A.G.</p>
        </div>
      </footer>
    </div>
  );
} 