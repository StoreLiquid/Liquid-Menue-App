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

  try {
    // Cache zurücksetzen
    console.log('SYNC-CACHE: Cache wird zurückgesetzt...');
    const result = await resetCache();
    console.log('SYNC-CACHE: Cache wurde erfolgreich zurückgesetzt');
    res.status(200).json(result);
  } catch (error) {
    console.error('SYNC-CACHE: Fehler beim Zurücksetzen des Caches:', error);
    res.status(500).json({ 
      error: 'Fehler beim Zurücksetzen des Caches', 
      message: error.message 
    });
  }
} 