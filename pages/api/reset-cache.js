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

  // Debug-Ausgabe für Umgebungsvariablen
  console.log('Umgebungsvariablen:', {
    hasWebhookSecret: !!process.env.WEBHOOK_SECRET,
    webhookSecretLength: process.env.WEBHOOK_SECRET ? process.env.WEBHOOK_SECRET.length : 0
  });

  // Frontend-Anfragen immer akzeptieren (kein Secret erforderlich)
  // Für externe Anfragen (z.B. Google Apps Script) das Secret überprüfen
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