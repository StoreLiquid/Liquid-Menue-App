import { getAllManufacturers } from '../../services/googleService';

export default async function handler(req, res) {
  try {
    const origData = await getAllManufacturers();
    
    // Erstelle eine komplett neue Struktur von Grund auf
    const manufacturersData = {
      manufacturers: {
        '10ml': [],
        '60ml': [],
        '120ml': []
      }
    };
    
    // Sammle alle Hersteller aus den Originaldaten (außer Kapka's)
    const kaplasName = "Kapka's";
    
    // Füge alle Hersteller außer Kapka's hinzu
    for (const category of ['10ml', '60ml']) {
      if (Array.isArray(origData.manufacturers[category])) {
        origData.manufacturers[category].forEach(manufacturer => {
          if (manufacturer !== kaplasName) {
            manufacturersData.manufacturers[category].push(manufacturer);
          }
        });
      } else {
        console.error(`Kategorie ${category} ist kein Array:`, origData.manufacturers[category]);
      }
    }
    
    // Manuell die 120ml-Liste erstellen ohne Duplikate
    manufacturersData.manufacturers['120ml'] = [
      "EVERGREEN",
      "FERRIS 666",
      "DR. KERO",
      "Kaffepause",
      "Yeti Overdosed",
      "Dinner Lady",
      kaplasName // Kapka's genau einmal hinzufügen
    ];
    
    // Füge Kapka's zu 10ml hinzu
    manufacturersData.manufacturers['10ml'].push(kaplasName);
    
    // Entferne Duplikate in 10ml und 60ml Kategorien
    manufacturersData.manufacturers['10ml'] = [...new Set(manufacturersData.manufacturers['10ml'])];
    manufacturersData.manufacturers['60ml'] = [...new Set(manufacturersData.manufacturers['60ml'])];
    
    // Debugging
    console.log("FINAL MANUFACTURERS DATA:");
    console.log(`10ml (${manufacturersData.manufacturers['10ml'].length}):`, manufacturersData.manufacturers['10ml']);
    console.log(`60ml (${manufacturersData.manufacturers['60ml'].length}):`, manufacturersData.manufacturers['60ml']);
    console.log(`120ml (${manufacturersData.manufacturers['120ml'].length}):`, manufacturersData.manufacturers['120ml']);
    console.log(`Kapka's in 10ml: ${manufacturersData.manufacturers['10ml'].includes(kaplasName)}`);
    console.log(`Kapka's in 60ml: ${manufacturersData.manufacturers['60ml'].includes(kaplasName)}`);
    console.log(`Kapka's in 120ml: ${manufacturersData.manufacturers['120ml'].includes(kaplasName)}`);
    console.log(`Kapka's Anzahl in 120ml: ${manufacturersData.manufacturers['120ml'].filter(m => m === kaplasName).length}`);
    
    res.status(200).json(manufacturersData);
  } catch (error) {
    console.error('Fehler beim Laden der Hersteller:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Hersteller' });
  }
} 