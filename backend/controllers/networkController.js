// networkController.js
import networkService from '../services/networkService.js';

const getIp = async (req, res) => {
  try {
    const ip = await networkService.getIpAddress();
    res.json({ ip }); // Send the IP address as a response
  } catch (error) {
    console.error('Error fetching IP:', error);
    res
      .status(500)
      .json({ message: 'Error fetching IP address', error: error.message });
  }
};

export default { getIp };
