// Direkter Test für Google Sheets API
const { google } = require('googleapis');
require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.GOOGLE_API_KEY;
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

async function testGoogleSheets() {
  try {
    console.log('API Key:', API_KEY ? 'Vorhanden' : 'Fehlt');
    console.log('Spreadsheet ID:', SPREADSHEET_ID);
    
    if (!API_KEY) {
      throw new Error('Kein Google API-Schlüssel gefunden. Stelle sicher, dass GOOGLE_API_KEY in .env.local vorhanden ist.');
    }

    const sheets = google.sheets({ version: 'v4', auth: API_KEY });
    
    // 1. Listet alle verfügbaren Tabellenblätter
    console.log('Rufe Tabellenblätter ab...');
    const infoResponse = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
      fields: 'sheets.properties'
    });
    
    const availableSheets = infoResponse.data.sheets.map(sheet => sheet.properties.title);
    console.log('Verfügbare Tabellenblätter:', availableSheets);
    
    // 2. Versuche, Daten aus jedem Tabellenblatt zu lesen
    for (const sheetName of availableSheets) {
      try {
        console.log(`\nLese Daten aus Tabellenblatt "${sheetName}"...`);
        const formattedName = sheetName.includes(' ') ? `'${sheetName}'` : sheetName;
        
        const dataResponse = await sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: `${formattedName}!A1:H10` // Erste 10 Zeilen, Spalten A-H
        });
        
        const values = dataResponse.data.values || [];
        console.log(`Gefundene Zeilen: ${values.length}`);
        
        if (values.length > 0) {
          console.log('Header:', values[0]);
          if (values.length > 1) {
            console.log('Erste Datenzeile:', values[1]);
          }
        } else {
          console.log('Keine Daten gefunden.');
        }
      } catch (error) {
        console.error(`Fehler beim Lesen von "${sheetName}":`, error.message);
      }
    }
    
  } catch (error) {
    console.error('Fehler:', error.message);
  }
}

// Test ausführen
testGoogleSheets(); 