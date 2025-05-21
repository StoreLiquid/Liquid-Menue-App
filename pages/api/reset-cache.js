import { resetCache } from '../../services/googleService';

export default async function handler(req, res) {
  // Nur POST-Anfragen erlauben
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST-Anfragen erlaubt' });
  }

  // Überprüfe den geheimen Schlüssel für den Webhook
  const webhookSecret = process.env.WEBHOOK_SECRET;
  const requestSecret = req.body?.secret;

  if (webhookSecret && requestSecret !== webhookSecret) {
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