// Google Sheets Konfiguration
export const SHEETS_CONFIG = {
  // Verwende die Spreadsheet ID aus der Umgebungsvariable oder den Standardwert
  spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID || '1GRNI0183grvtjtu7uDKkTVOCw-LnTtSNvbwVtn36D0c',
  
  // Spalten-Mapping
  columns: {
    hersteller: 'A',
    sorte: 'B',
    nikotin: 'C',
    fuellmenge: 'D',
    preis: 'E',
    tags: 'F', // kommaseparierte Liste von Tags
    bildUrl: 'G',
  }
};

// Google Drive Konfiguration für Bilder
export const DRIVE_CONFIG = {
  // Ordner-ID, in dem die Herstellerbilder gespeichert sind
  folderImageId: process.env.GOOGLE_DRIVE_FOLDER_ID || '',
  
  // Basis-URL für Bilder aus Google Drive
  imageBaseUrl: 'https://drive.google.com/uc?export=view&id='
}; 