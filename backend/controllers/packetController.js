import { analyzePackets } from '../services/packetService.js';

export const analyzePacketsController = async (req, res) => {
  const { devices } = req.body;

  if (!Array.isArray(devices) || devices.length === 0) {
    return res.status(400).json({ error: 'Invalid devices list' });
  }

  try {
    const results = await analyzePackets(devices);
    res.status(200).json({ results });
  } catch (error) {
    console.error('Error analyzing packets:', error);
    res.status(500).json({ error: error.message });
  }
};
