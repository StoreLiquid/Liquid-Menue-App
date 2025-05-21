import { resetCache } from '../../services/googleService';

export default async function handler(req, res) {
  // Nur POST-Anfragen erlauben
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST-Anfragen erlaubt' });
  }

  // Webhook-Secret-Überprüfung entfernt, um die Funktion ohne Authentifizierung aufrufen zu können

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