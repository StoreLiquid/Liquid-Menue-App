# 📱 Liquid-Menü Web-App

Eine moderne, stilvolle und Touch-optimierte Web-App für E-Zigarettenläden, mit der Kunden eigenständig nach E-Liquids suchen können.

## 🔄 Aktualisiert am 21.05.2025
- Sync-Funktion verbessert
- Cache-Reset-Funktion optimiert

## 🔧 Installation

1. Clone das Repository

```bash
git clone https://github.com/StoreLiquid/Liquid-Menue-App.git
cd liquid-menu-app
```

2. Installiere die Abhängigkeiten

```bash
npm install
```

3. Kopiere `.env.example` zu `.env.local` und füge deine Google API-Schlüssel ein

```bash
cp .env.example .env.local
```

4. Bearbeite `.env.local` und füge deine Google Sheets API Daten ein:
   - `GOOGLE_API_KEY`: Dein Google API-Schlüssel
   - `GOOGLE_SPREADSHEET_ID`: Die ID deines Google Spreadsheets (aus der URL)

## 🚀 Entwicklung

Starte den Entwicklungsserver:

```bash
npm run dev
```

Öffne [http://localhost:3333](http://localhost:3333) in deinem Browser.

## 📋 Google Sheets Einrichtung

Die App verwendet zwei Tabellenblätter in Google Sheets:

### 1. Tabellenblatt "Hersteller"

Format (ab Zelle A2):

| ID | Name | Kategorien | BildURL |
|----|------|------------|---------|
| h1 | Kapka's | 10ml,120ml | https://example.com/kapkas.png |
| h2 | Dr. Kero | 120ml | https://example.com/drkero.png |
| h3 | Tom Klark | 10ml | https://example.com/tomklark.png |
| h4 | Dinner Lady | 60ml | https://example.com/dinnerlady.png |

**Hinweise:**
- Die ID muss eindeutig sein und sollte mit "h" beginnen (z.B. h1, h2, h3, ...)
- Kategorien können mehrere Werte enthalten, durch Kommas getrennt (10ml, 60ml, 120ml)
- BildURL ist optional

### 2. Tabellenblatt "Produkte"

Format (ab Zelle A2):

| ID | HerstellerID | Sorte | Nikotin | Füllmenge | Preis | Tags | Kategorie | BildURL |
|----|--------------|-------|---------|-----------|-------|------|-----------|---------|
| p1 | h1 | Erdbeer | 0mg | 10ml | 4,99 | fruchtig,erdbeer | 10ml | |
| p2 | h2 | Kiwi Limette | | 120ml | 24,99 | fruchtig,kiwi,limette | 120ml | |

**Hinweise:**
- Die ID muss eindeutig sein und sollte mit "p" beginnen (z.B. p1, p2, p3, ...)
- HerstellerID muss einer gültigen ID aus dem Hersteller-Tabellenblatt entsprechen
- Tags können mehrere Werte enthalten, durch Kommas getrennt
- Kategorie sollte einen der Werte haben: 10ml, 60ml, 120ml
- BildURL ist optional

## 🔒 Google API Zugriff einrichten

1. Gehe zur [Google Cloud Console](https://console.cloud.google.com/)
2. Erstelle ein neues Projekt
3. Aktiviere die Google Sheets API und Google Drive API
4. Erstelle einen API-Schlüssel unter "APIs & Dienste" > "Anmeldedaten"
5. Beschränke den API-Schlüssel auf die Sheets API und Drive API
6. Kopiere den Schlüssel in deine `.env.local` Datei

## 📷 Google Drive Bilder

1. Lade deine Herstellerbilder in einen Google Drive-Ordner hoch
2. Setze die Freigabe auf "Jeder mit dem Link kann ansehen"
3. Kopiere die Ordner-ID aus der URL und füge sie in die `.env.local` als `GOOGLE_DRIVE_FOLDER_ID` ein
4. Für jedes Bild, verwende die File-ID im Google Spreadsheet

## 📱 Funktionen

- Globale Suche nach Liquids
- Filtern nach Kategorien (10ml, 60ml, 120ml)
- Filtern nach Tags (z.B. "Süß", "Kalt", "Fruchtig")
- Produktanzeige nach Herstellern
- Responsive Design für Smartphones und Tablets 