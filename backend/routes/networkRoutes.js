import express from 'express';
import networkController from '../controllers/networkController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Network
 *   description: Network management
 */

/**
 * @swagger
 * /api/get-ip:
 *   get:
 *     tags: [Network]
 *     summary: Get current IP address
 *     description: Fetches the current IP address of the server.
 *     responses:
 *       200:
 *         description: Current IP address retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ip:
 *                   type: string
 *                   description: The current IP address of the server
 *       500:
 *         description: Internal server error
 */
router.get('/get-ip', networkController.getIp);

/**
 * @swagger
 * /api/scan-network:
 *   get:
 *     tags: [Network]
 *     summary: Scan the network
 *     description: Scans the local network and retrieves available devices.
 *     responses:
 *       200:
 *         description: Network scan successful
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ip:
 *                     type: string
 *                     description: The IP address of a device on the network
 *                   hostname:
 *                     type: string
 *                     description: The hostname of the device
 *       500:
 *         description: Internal server error
 */
router.get('/scan-network', networkController.scanNetwork);

export default router;

// import express from 'express';
// import networkController from '../controllers/networkController.js';

// const router = express.Router();

// // Define the route to fetch the current IP address
// router.get('/get-ip', networkController.getIp);

// // Define the route to scan the network
// router.get('/scan-network', networkController.scanNetwork);

// export default router;
