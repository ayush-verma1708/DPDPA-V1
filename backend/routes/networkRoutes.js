import express from 'express';
import networkController from '../controllers/networkController.js';

const router = express.Router();

// Define the route to fetch the current IP address
router.get('/get-ip', networkController.getIp);

// Define the route to scan the network
router.get('/scan-network', networkController.scanNetwork);

export default router;

// // routes/networkRoutes.js
// import express from 'express';
// import networkController from '../controllers/networkController.js'; // Add '.js' extension

// const router = express.Router();

// // Define the route to fetch the current IP address
// router.get('/get-ip', networkController.getIp);

// export default router;
