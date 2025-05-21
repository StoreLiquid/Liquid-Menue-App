# 📱 Web-App: Liquid-Menü für Kunden im Laden

## 🎯 Projektziel

Ziel ist eine moderne, stilvolle und Touch-optimierte Web-App, die Kunden im E-Zigarettenladen auf einem Tablet oder Smartphone nutzen können. Sie können damit eigenständig nach E-Liquids (Fertigliquids & Longfills) suchen, nach Tags filtern und Produkte anhand von Herstellern entdecken.

Die Inhalte werden zentral in Google Sheets gepflegt und automatisch in der App aktualisiert. Die App soll lokal gehostet sein (z. B. auf einem Raspberry Pi) und über einen QR-Code aufrufbar sein. Es ist kein Login für Kunden notwendig – nur für die spätere Admin-Pflege.

---

## 🧩 Funktionsübersicht

### 📌 Layout

- **Titelzeile oben**: „Liquid Menü“ (zentriert) + Logo (links oder rechts)
- **Globale Suchleiste** direkt unter dem Titel: durchsucht alle Liquids (alle Kategorien)
- **Kategorien-Buttons**:
  - Fertigliquid 10 ml
  - Longfill 60 ml
  - Longfill 120 ml
- **Hersteller-Karten**:
  - Nach Auswahl einer Kategorie erscheinen die passenden Hersteller aus der zugehörigen Liste.
  - Hersteller-Karten zeigen Logo (Bild) + Name.
  - Hover-/Touch-Effekt: Karten „springen“ leicht nach oben beim Antippen oder Überfahren.
- **Produktanzeige**:
  - Klick auf einen Hersteller zeigt alle passenden Einträge aus der globalen Liste.
- **Filterleiste für Tags**:
  - Beispiel-Tags: „Süß“, „Kalt“, „Fruchtig“
  - Tags erscheinen als Buttons oberhalb der Herstellerkarten.
  - Mehrfachauswahl möglich
  - Filterung wirkt auf die Produkte innerhalb der aktiven Kategorie.

---

## 🔧 Datenstruktur und Verwaltung

### 📋 s

#### Tabellenübersicht:

- **Globale Liste**: Alle Liquids mit folgenden Feldern:
  - Hersteller
  - Sorte
  - Nikotin (z. B. „Nikotinshot nötig“ oder „20 mg Nikotinsalz“)
  - Füllmenge
  - Preis
  - Tags (kommasepariert)
  - BildURL (Link zu Herstellerbild in Google Drive)

- **Herstellerlisten** (jeweils eigene Sheets):
  - Fertigliquid 10 ml: Nur Hersteller mit Produkten in dieser Kategorie
  - Longfill 60 ml: Nur passende Hersteller
  - Longfill 120 ml: Nur passende Hersteller

#### Änderungen:

- Änderungen in den Sheets wirken **automatisch** in der App durch Google Sheets API.
- Kein manuelles Aktualisieren nötig.
- Pflege erfolgt zentral durch Google Sheets.

---

## 🖼️ Bilder für Hersteller

### 📁 Bild-Hosting über Google Drive

- Alle Herstellerlogos liegen in einem öffentlichen Google Drive Ordner.
- Die Freigabe erfolgt über File-ID-Links.
- Beispiel:  
  `https://drive.google.com/uc?export=view&id=<FILE_ID>`

### 🗂️ In Google Sheets:

Spalte: `BildURL`

| Hersteller     | BildURL                                                   |
|----------------|------------------------------------------------------------|
| Dr. Frost      | https://drive.google.com/uc?export=view&id=123abcDEF456    |
| Dinner Lady    | https://drive.google.com/uc?export=view&id=987zyxWVU654    |

> Später kann über einen Admin-Login ein Bild für einen Hersteller ausgewählt oder aktualisiert werden.

---

## 🛠️ Technologien

- **Frontend-Framework**: React
- **Sprache**: TypeScript
- **Styling**: Tailwind CSS
- **API-Anbindung**:
  - s API für die Daten
  - Google Drive API für die Bilder
- **Hosting**:
  - Lokaler Webserver auf z. B. Raspberry Pi
  - Aufruf über lokale IP oder QR-Code im Laden

---

## 📱 Nutzerfreundlichkeit

- Optimiert für **Smartphones und Tablets**
- Touch- und Mausbedienung möglich
- Kein Login für Kunden
- Einfacher QR-Code-Scan oder Eingabe der IP-Adresse reicht
- Übersichtliche Benutzeroberfläche
- Schlank, performant, offline-fähig (mit lokalen Caches, optional)

---

## 🔐 Admin-Funktionen (optional & geplant)

- Einfacher **Login-Bereich für Admins**
- Herstellerbilder zuordnen oder ändern
- Vorschau von Produktlisten
- Tags zuweisen
- Keine Veränderung im Code nötig, alles läuft über UI & Sheets

---

## 🧠 Erweiterungsideen (bereits teilweise integriert)

- Herstellerbild-Upload per Admin
- Floating-Karten mit Hover-/Touch-Animation
- Intelligente Tag-Kombinationen (AND-Filter: „Süß“ + „Kalt“)
- QR-Code Generator (für schnellen Zugang durch Kunden)
- Anzeige beliebter Produkte
- Optionale Favoritenliste für Nutzer
- Filter deaktivierbar (z. B. keine Tags aktiv → alles sichtbar)

---

## 📌 Beispielhafte Struktur im Frontend

```tsx
// Suchleiste oben
<Searchbar />

// Kategorie-Auswahl
<CategoryButtons />

// Tags-Filter
<TagsFilter selectedTags={...} onChange={...} />

// Hersteller-Karten
<ManufacturerGrid category="10ml" />

// Produkte
<ProductList manufacturer="Dr. Frost" />
```
