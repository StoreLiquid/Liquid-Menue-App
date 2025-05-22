/**
 * AutomatischeTabellenerstellung.gs
 * 
 * Dieses Skript überwacht die Erstellung neuer Tabellenblätter in Google Sheets
 * und füllt diese automatisch mit vordefinierten Einträgen basierend auf dem Namen des Tabellenblatts.
 */

// Konfiguration für verschiedene Tabellentypen
const TABELLEN_VORLAGEN = {
  // Vorlage für Produkte/Liquids
  'produkt': {
    headers: ['ID', 'HerstellerID', 'Herstellername', 'Nikotin', 'Füllmenge', 'Preis', 'Sorte', 'Tags'],
    beispielDaten: [
      ['P001', 'H001', 'Beispiel Hersteller', '3mg', '10ml', '4,99€', 'Erdbeere', 'Frucht,Süß'],
      ['P002', 'H002', 'Anderer Hersteller', '6mg', '60ml', '19,99€', 'Menthol', 'Frisch,Kühl']
    ]
  },
  // Vorlage für Hersteller
  'hersteller': {
    headers: ['ID', 'Name', 'Kategorie'],
    beispielDaten: [
      ['H001', 'Beispiel Hersteller', '10ml'],
      ['H002', 'Anderer Hersteller', '60ml']
    ]
  },
  // Vorlage für Bestellungen
  'bestellung': {
    headers: ['BestellID', 'Datum', 'KundenID', 'ProduktID', 'Menge', 'Gesamtpreis', 'Status'],
    beispielDaten: [
      ['B001', '01.01.2023', 'K001', 'P001', '2', '9,98€', 'Versandt'],
      ['B002', '02.01.2023', 'K002', 'P002', '1', '19,99€', 'In Bearbeitung']
    ]
  }
};

/**
 * Wird ausgeführt, wenn ein neues Tabellenblatt erstellt wird
 * 
 * @param {Object} e - Das Event-Objekt
 */
function onSheetCreated(e) {
  const sheet = e.source.getActiveSheet();
  const sheetName = sheet.getName().toLowerCase();
  
  // Protokollierung für Debugging
  Logger.log('Neues Tabellenblatt erstellt: ' + sheetName);
  
  // Prüfe, ob der Name einem bekannten Muster entspricht
  let vorlage = null;
  
  if (sheetName.includes('produkt') || sheetName.includes('liquid') || sheetName.includes('suche')) {
    vorlage = TABELLEN_VORLAGEN.produkt;
  } else if (sheetName.includes('hersteller')) {
    vorlage = TABELLEN_VORLAGEN.hersteller;
  } else if (sheetName.includes('bestellung') || sheetName.includes('order')) {
    vorlage = TABELLEN_VORLAGEN.bestellung;
  }
  
  // Wenn eine passende Vorlage gefunden wurde, fülle die Tabelle aus
  if (vorlage) {
    // Überschriften einfügen
    sheet.getRange(1, 1, 1, vorlage.headers.length).setValues([vorlage.headers]);
    
    // Formatierung der Überschriften
    sheet.getRange(1, 1, 1, vorlage.headers.length).setFontWeight('bold');
    sheet.getRange(1, 1, 1, vorlage.headers.length).setBackground('#E0E0E0');
    
    // Beispieldaten einfügen
    if (vorlage.beispielDaten && vorlage.beispielDaten.length > 0) {
      sheet.getRange(2, 1, vorlage.beispielDaten.length, vorlage.beispielDaten[0].length)
        .setValues(vorlage.beispielDaten);
    }
    
    // Automatische Größenanpassung für alle Spalten
    for (let i = 1; i <= vorlage.headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
    
    // Benachrichtigung anzeigen
    SpreadsheetApp.getActiveSpreadsheet().toast(
      'Tabellenblatt wurde automatisch mit Daten gefüllt.',
      'Automatische Einrichtung abgeschlossen',
      5
    );
  }
}

/**
 * Installiert den Trigger für die Überwachung neuer Tabellenblätter
 */
function installTrigger() {
  // Lösche zuerst alle vorhandenen Trigger, um Duplikate zu vermeiden
  const allTriggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < allTriggers.length; i++) {
    if (allTriggers[i].getHandlerFunction() === 'onSheetCreated') {
      ScriptApp.deleteTrigger(allTriggers[i]);
    }
  }
  
  // Erstelle einen neuen Trigger
  ScriptApp.newTrigger('onSheetCreated')
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onOpen()
    .create();
  
  // Zusätzlicher Trigger für die Erstellung neuer Tabellenblätter
  ScriptApp.newTrigger('onSheetCreated')
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onChange()
    .create();
  
  SpreadsheetApp.getActiveSpreadsheet().toast(
    'Trigger für automatische Tabellenerstellung installiert.',
    'Installation abgeschlossen',
    5
  );
}

/**
 * Fügt ein Menü zur Tabelle hinzu
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Automatisierung')
    .addItem('Trigger installieren', 'installTrigger')
    .addItem('Aktuelle Tabelle formatieren', 'formatCurrentSheet')
    .addToUi();
}

/**
 * Formatiert das aktuell ausgewählte Tabellenblatt
 */
function formatCurrentSheet() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const sheetName = sheet.getName().toLowerCase();
  
  // Gleiche Logik wie in onSheetCreated
  let vorlage = null;
  
  if (sheetName.includes('produkt') || sheetName.includes('liquid') || sheetName.includes('suche')) {
    vorlage = TABELLEN_VORLAGEN.produkt;
  } else if (sheetName.includes('hersteller')) {
    vorlage = TABELLEN_VORLAGEN.hersteller;
  } else if (sheetName.includes('bestellung') || sheetName.includes('order')) {
    vorlage = TABELLEN_VORLAGEN.bestellung;
  } else {
    // Wenn kein passendes Muster gefunden wurde, frage den Benutzer
    const ui = SpreadsheetApp.getUi();
    const response = ui.prompt(
      'Tabellentyp auswählen',
      'Welcher Typ ist diese Tabelle? (produkt, hersteller oder bestellung)',
      ui.ButtonSet.OK_CANCEL
    );
    
    if (response.getSelectedButton() === ui.Button.OK) {
      const userInput = response.getResponseText().toLowerCase();
      if (userInput === 'produkt' || userInput === 'liquid') {
        vorlage = TABELLEN_VORLAGEN.produkt;
      } else if (userInput === 'hersteller') {
        vorlage = TABELLEN_VORLAGEN.hersteller;
      } else if (userInput === 'bestellung' || userInput === 'order') {
        vorlage = TABELLEN_VORLAGEN.bestellung;
      }
    }
  }
  
  // Wenn eine passende Vorlage gefunden wurde, fülle die Tabelle aus
  if (vorlage) {
    // Prüfe, ob die Tabelle bereits Daten enthält
    const existingData = sheet.getDataRange().getValues();
    
    if (existingData.length <= 1 || existingData[0].length < vorlage.headers.length) {
      // Überschriften einfügen
      sheet.getRange(1, 1, 1, vorlage.headers.length).setValues([vorlage.headers]);
      
      // Beispieldaten einfügen, wenn die Tabelle leer ist
      if (existingData.length <= 1) {
        sheet.getRange(2, 1, vorlage.beispielDaten.length, vorlage.beispielDaten[0].length)
          .setValues(vorlage.beispielDaten);
      }
    }
    
    // Formatierung der Überschriften
    sheet.getRange(1, 1, 1, vorlage.headers.length).setFontWeight('bold');
    sheet.getRange(1, 1, 1, vorlage.headers.length).setBackground('#E0E0E0');
    
    // Automatische Größenanpassung für alle Spalten
    for (let i = 1; i <= vorlage.headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
    
    // Benachrichtigung anzeigen
    SpreadsheetApp.getActiveSpreadsheet().toast(
      'Tabellenblatt wurde formatiert.',
      'Formatierung abgeschlossen',
      5
    );
  } else {
    SpreadsheetApp.getActiveSpreadsheet().toast(
      'Kein passender Tabellentyp gefunden.',
      'Formatierung abgebrochen',
      5
    );
  }
} 