// controllers/networkScanController.js
import { networkScan } from '../services/networkScanService.js';

// Controller function to handle network scan request
export const getNetworkScan = async (req, res) => {
  try {
    const devices = await networkScan();
    res.json(devices); // Return the devices scanned
  } catch (error) {
    console.error('Error in network scan controller:', error);
    res
      .status(500)
      .json({ message: 'Failed to scan network', error: error.message });
  }
};
