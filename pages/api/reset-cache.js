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

  // Nur POST-Anfragen erlauben
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST-Anfragen erlaubt' });
  }

  // Webhook-Secret überprüfen
  const { secret } = req.body || {};
  const expectedSecret = "liquid-app-secret-2025"; // Muss mit dem Secret im Google Sheets-Skript übereinstimmen
  
  if (secret !== expectedSecret) {
    console.error('Ungültiger Webhook-Secret');
    return res.status(401).json({ error: 'Ungültiger Webhook-Secret' });
  }

  try {
    // Cache zurücksetzen
    const result = await resetCache();
    res.status(200).json(result);
  } catch (error) {
    console.error('Fehler beim Zurücksetzen des Caches:', error);
    res.status(500).json({ 
      error: 'Fehler beim Zurücksetzen des Caches', 
      message: error.message 
    });
  }
} 