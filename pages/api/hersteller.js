import { getAllManufacturers } from '../../services/googleService';

export default async function handler(req, res) {
  try {
    const { kategorie } = req.query;
    const data = await getAllManufacturers();
    
    if (kategorie && ['10ml', '60ml', '120ml'].includes(kategorie)) {
      // Gib nur die Hersteller der angeforderten Kategorie zurück
      return res.status(200).json(data.categorizedManufacturers[kategorie] || []);
    }
    
    // Wenn keine Kategorie angegeben wurde, gib alle Hersteller strukturiert zurück
    res.status(200).json({
      byId: data.manufacturers,
      byCategory: data.categorizedManufacturers
    });
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: 'Fehler beim Laden der Hersteller' });
  }
} 