import { getAllLiquids } from '../../services/googleService';

export default async function handler(req, res) {
  try {
    const liquids = await getAllLiquids();
    res.status(200).json(liquids);
  } catch (error) {
    console.error('Fehler beim Laden der Liquids:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Liquids' });
  }
} 