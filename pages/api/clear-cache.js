import { resetCache } from '../../services/googleService';

export default async function handler(req, res) {
  // CORS-Header hinzufügen
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS-Anfragen für CORS-Preflight beantworten
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Alle Anfragen erlauben (GET und POST)
  try {
    // Cache zurücksetzen
    console.log('NEUER ENDPUNKT: Cache wird zurückgesetzt...');
    const result = await resetCache();
    console.log('NEUER ENDPUNKT: Cache wurde erfolgreich zurückgesetzt');
    res.status(200).json({
      success: true,
      message: "Cache erfolgreich zurückgesetzt",
      ...result
    });
  } catch (error) {
    console.error('NEUER ENDPUNKT: Fehler beim Zurücksetzen des Caches:', error);
    res.status(500).json({ 
      success: false,
      error: 'Fehler beim Zurücksetzen des Caches', 
      message: error.message 
    });
  }
} 