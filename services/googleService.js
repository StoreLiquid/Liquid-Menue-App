import { google } from 'googleapis';
import { SHEETS_CONFIG, DRIVE_CONFIG } from '../config/google';

// Verwende den API-Schlüssel aus den Umgebungsvariablen
const API_KEY = process.env.GOOGLE_API_KEY || '';

// Liste für die tatsächlichen Tabellenblätter nach dem Abrufen
let actualSheets = null;

// Cache für Produkte um doppelte Anfragen zu vermeiden
let cachedLiquids = null;

// Cache für Hersteller
let manufacturersCache = null;

// Funktion zum Zurücksetzen des Caches, wichtig um neue Einträge zu erkennen
export function resetCache() {
  console.log("--- CACHE ZURÜCKSETZEN ---");
  actualSheets = null;
  cachedLiquids = null;
  manufacturersCache = null;
  console.log("Alle Caches wurden gelöscht: actualSheets, cachedLiquids und manufacturersCache");
  
  return { 
    success: true, 
    message: "Cache vollständig zurückgesetzt",
    timestamp: new Date().toISOString()
  };
}

/**
 * Ruft die Liste aller Tabellenblätter ab
 * @returns {Promise<Array<string>>} - Die Namen aller Tabellenblätter
 */
async function getSheetsList() {
  if (actualSheets) return actualSheets;
  
  try {
    if (!API_KEY) {
      console.error('Kein Google API-Schlüssel gefunden. Stelle sicher, dass GOOGLE_API_KEY in .env.local vorhanden ist.');
      return [];
    }

    const sheets = google.sheets({ version: 'v4', auth: API_KEY });
    const spreadsheetId = SHEETS_CONFIG.spreadsheetId;
    
    if (!spreadsheetId) {
      console.error('Keine Spreadsheet-ID gefunden. Stelle sicher, dass GOOGLE_SPREADSHEET_ID in .env.local vorhanden ist.');
      return [];
    }
    
    console.log(`Rufe Informationen über Spreadsheet ab: ${spreadsheetId}`);
    
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
      fields: 'sheets.properties'
    });
    
    actualSheets = response.data.sheets.map(sheet => sheet.properties.title);
    console.log('Gefundene Tabellenblätter:', actualSheets);
    
    return actualSheets;
  } catch (error) {
    console.error(`Fehler beim Abrufen der Tabellenblattliste: ${error.message}`);
    return [];
  }
}

/**
 * Findet ein Tabellenblatt anhand eines Suchmusters
 * @param {string} pattern - Das Suchmuster
 * @returns {Promise<string>} - Der tatsächliche Name des Tabellenblatts oder null
 */
async function findSheet(pattern) {
  const sheets = await getSheetsList();
  const patternLower = pattern.toLowerCase();
  
  console.log("Verfügbare Tabellenblätter:", sheets);
  
  // Exakte Übereinstimmung
  const exactMatch = sheets.find(sheet => sheet === pattern);
  if (exactMatch) {
    console.log(`Exakten Treffer gefunden: ${exactMatch}`);
    return exactMatch;
  }
  
  // Teilweise Übereinstimmung (ohne Berücksichtigung von Groß- und Kleinschreibung)
  const partialMatch = sheets.find(sheet => sheet.toLowerCase().includes(patternLower));
  if (partialMatch) {
    console.log(`Teilweisen Treffer gefunden: ${partialMatch} für Muster ${pattern}`);
    return partialMatch;
  }
  
  console.log(`Kein Tabellenblatt für Muster ${pattern} gefunden`);
  return null;
}

/**
 * Ruft Daten aus einem Google-Sheet ab
 * @param {string} sheetNamePattern - Das Muster für den Namen des Tabellenblatts
 * @param {string} range - Der Datenbereich (z.B. "A2:G100")
 * @returns {Promise<Array<Array<string>>>} - Die abgerufenen Daten als 2D-Array
 */
async function fetchSheetData(sheetNamePattern, range) {
  try {
    if (!API_KEY) {
      console.error('Kein Google API-Schlüssel gefunden. Stelle sicher, dass GOOGLE_API_KEY in .env.local vorhanden ist.');
      return [];
    }

    // Finde das tatsächliche Tabellenblatt
    const actualSheetName = await findSheet(sheetNamePattern);
    if (!actualSheetName) {
      console.error(`Kein Tabellenblatt "${sheetNamePattern}" in deinem Google Sheet gefunden.`);
      return [];
    }
    
    console.log(`Tabellenblatt gefunden: "${actualSheetName}" für Muster "${sheetNamePattern}"`);
    

    const sheets = google.sheets({ version: 'v4', auth: API_KEY });
    const spreadsheetId = SHEETS_CONFIG.spreadsheetId;
    
    // Für Tabellenblätter mit Leerzeichen müssen Anführungszeichen verwendet werden
    const formattedSheetName = actualSheetName.includes(' ') ? `'${actualSheetName}'` : actualSheetName;
    const fullRange = `${formattedSheetName}!${range}`;
    
    console.log(`Lade Daten aus Google Sheets: ${fullRange}`);
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: fullRange,
    });
    
    return response.data.values || [];
  } catch (error) {
    console.error(`Fehler beim Abrufen der Daten aus Google Sheets (${sheetNamePattern}): ${error.message}`);
    return [];
  }
}

/**
 * Ruft alle Hersteller ab, unter Verwendung der separaten Hersteller-Tabellenblätter
 * @returns {Promise<Object>} - Alle Hersteller mit IDs und Kategorien
 */
export async function getAllManufacturers() {
  try {
    // Versuche zuerst, die gecachten Hersteller zu verwenden
    if (manufacturersCache) {
      console.log("Verwende gecachte Hersteller-Daten");
      return manufacturersCache;
    }
    
    // Lade Hersteller aus den spezifischen Herstellertabellen
    console.log("Lade Herstellerdaten aus separaten Tabellenblättern...");
    
    // Lade Hersteller für jede Kategorie
    const [hersteller10ml, hersteller60ml, hersteller120ml, herstellerBase] = await Promise.all([
      fetchSheetData("Hersteller 10ml", 'A2:B100'),
      fetchSheetData("Hersteller 60ml", 'A2:B100'),
      fetchSheetData("Hersteller 120ml", 'A2:B100'),
      fetchSheetData("Hersteller Base", 'A2:B100')
    ]);
    
    // Überprüfe, ob Herstellerdaten gefunden wurden
    if ((!hersteller10ml || hersteller10ml.length === 0) && 
        (!hersteller60ml || hersteller60ml.length === 0) && 
        (!hersteller120ml || hersteller120ml.length === 0) &&
        (!herstellerBase || herstellerBase.length === 0)) {
      console.error("Keine Herstellerdaten gefunden.");
      return { 
        manufacturers: {}, 
        categorizedManufacturers: { '10ml': [], '60ml': [], '120ml': [], 'Base': [] }
      };
    }
    
    // Verarbeite die Daten
    console.log(`Verarbeite Herstellerdaten: 10ml (${hersteller10ml?.length || 0}), 60ml (${hersteller60ml?.length || 0}), 120ml (${hersteller120ml?.length || 0}), Base (${herstellerBase?.length || 0})`);
    
    // Erstelle eine Map für eindeutige Hersteller
    const uniqueManufacturers = {};
    
    // Kategorisierte Hersteller
    const categorizedManufacturers = {
      '10ml': [],
      '60ml': [],
      '120ml': [],
      'Base': []
    };
    
    // Hilfsfunktion zum Verarbeiten der Herstellerdaten
    const processManufacturers = (data, kategorie) => {
      if (!data || data.length === 0) return;
      
      data.forEach(row => {
        // Die Struktur laut Test ist: [0]: Hersteller ID, [1]: Herstellername
        if (!row[0] || !row[1]) return;
        
        const id = row[0];
        const name = row[1];
        
        // Neues Herstellerobjekt
        const manufacturer = {
          id,
          name,
          kategorien: [kategorie],
          bildUrl: null
        };
        
        // In Gesamtliste eintragen oder aktualisieren
        if (uniqueManufacturers[id]) {
          if (!uniqueManufacturers[id].kategorien.includes(kategorie)) {
            uniqueManufacturers[id].kategorien.push(kategorie);
          }
        } else {
          uniqueManufacturers[id] = manufacturer;
        }
        
        // In kategorisierte Liste eintragen
        categorizedManufacturers[kategorie].push(manufacturer);
      });
    };
    
    // Verarbeite Hersteller für jede Kategorie
    processManufacturers(hersteller10ml, '10ml');
    processManufacturers(hersteller60ml, '60ml');
    processManufacturers(hersteller120ml, '120ml');
    processManufacturers(herstellerBase, 'Base');
    
    // Zusammenfassung ausgeben
    Object.keys(categorizedManufacturers).forEach(category => {
      console.log(`${category}: ${categorizedManufacturers[category].length} Hersteller`);
    });
    
    const result = {
      manufacturers: uniqueManufacturers,
      categorizedManufacturers
    };
    
    // Im Cache speichern
    manufacturersCache = result;
    
    return result;
  } catch (error) {
    console.error("Fehler beim Abrufen der Hersteller:", error);
    return { 
      manufacturers: {}, 
      categorizedManufacturers: { '10ml': [], '60ml': [], '120ml': [], 'Base': [] }
    };
  }
}

/**
 * Ruft alle Liquid-Daten aus Google Sheets ab und ordnet sie den richtigen Herstellern zu
 * @returns {Promise<Array>} - Alle Liquid-Einträge
 */
export async function getAllLiquids() {
  try {
    // Versuche zuerst die gecachten Daten zu verwenden
    if (cachedLiquids) {
      console.log("Verwende gecachte Liquid-Daten");
      return cachedLiquids;
    }
    
    // Hole zuerst alle Hersteller (inkl. Kategorien)
    const { manufacturers } = await getAllManufacturers();
    
    console.log("Lade Produktdaten aus Google Sheets...");
    // Richtiger Tabellenname laut Testergebnis
    const data = await fetchSheetData("Globale Suche ", 'A2:H500');
    
    if (!data || !data.length) {
      console.error("Keine Produkte in deinem Google Sheet gefunden.");
      return [];
    }
    
    console.log(`${data.length} Produkte aus Google Sheets geladen`);
    
    // Verarbeite die Daten aus dem Google Sheet
    // Struktur basierend auf dem Test:
    // A(0): ID, B(1): HerstellerID, C(2): Herstellername, D(3): Nikotin, 
    // E(4): Füllmenge, F(5): Preis, G(6): Sorte, H(7): Tags
    
    const liquids = data
      .filter(row => row.length >= 7) // Mindestens ID bis Sorte
      .map(row => {
        const produktId = row[0] || '';
        const herstellerId = row[1] || '';
        const herstellerName = row[2] || '';
        const nikotin = row[3] || '';
        const fuellmenge = row[4] || '';
        const preis = row[5] || '';
        const sorte = row[6] || '';
        const tags = row[7] ? row[7].split(',').map(tag => tag.trim()) : [];
        
        // Bestimme die Kategorie basierend auf der Füllmenge und dem Hersteller
        let kategorie = fuellmenge.includes('10ml') ? '10ml' : 
                       fuellmenge.includes('60ml') ? '60ml' : 
                       fuellmenge.includes('120ml') ? '120ml' : 
                       fuellmenge.toLowerCase().includes('base') ? 'Base' : '10ml';
        
        // Wenn der Hersteller bekannt ist, verwende seine Kategorie(n)
        if (manufacturers[herstellerId]) {
          // Wenn der Hersteller mehrere Kategorien hat, wähle die passende basierend auf der Füllmenge
          // Ansonsten nimm die erste verfügbare Kategorie
          if (manufacturers[herstellerId].kategorien.includes(kategorie)) {
            // Kategorie bleibt gleich, wenn sie mit Hersteller-Kategorie übereinstimmt
          } else if (manufacturers[herstellerId].kategorien.length > 0) {
            kategorie = manufacturers[herstellerId].kategorien[0];
          }
        }
        
        return {
          id: produktId,
          herstellerId,
          sorte,
          nikotin,
          fuellmenge,
          preis,
          tags,
          kategorie,
          hersteller: herstellerName,
          bildUrl: null
        };
      });
    
    // Im Cache speichern
    cachedLiquids = liquids;
    
    console.log(`${liquids.length} Produkte erfolgreich verarbeitet`);
    
    return liquids;
  } catch (error) {
    console.error("Fehler beim Abrufen der Liquids:", error);
    return [];
  }
} 