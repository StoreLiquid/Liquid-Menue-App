import { getAllLiquids, getAllManufacturers } from '../../services/googleService';

export default async function handler(req, res) {
  try {
    // Lade alle Liquids und Hersteller parallel
    const [liquids, manufacturersData] = await Promise.all([
      getAllLiquids(),
      getAllManufacturers()
    ]);
    
    // Fülle die Herstellerinformationen für jedes Liquid auf
    // (in diesem Fall wird jetzt die Hersteller-Info direkt aus dem Sheet geladen
    // und wir brauchen die herstellerId nur für die Filterung)
    const enhancedLiquids = liquids;
    
    const { kategorie, herstellerId } = req.query;
    
    // Filtere Liquids basierend auf Query-Parametern
    let filteredLiquids = enhancedLiquids;
    
    if (kategorie && ['10ml', '60ml', '120ml'].includes(kategorie)) {
      filteredLiquids = filteredLiquids.filter(liquid => liquid.kategorie === kategorie);
    }
    
    if (herstellerId) {
      filteredLiquids = filteredLiquids.filter(liquid => liquid.herstellerId === herstellerId);
    }
    
    res.status(200).json(filteredLiquids);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Produkte' });
  }
}