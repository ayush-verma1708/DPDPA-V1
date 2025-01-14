import express from 'express';
import { analyzePacketsController } from '../controllers/packetController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Packets
 *   description: Operations related to network packet analysis
 */

/**
 * @swagger
 * /api/analyze-packets:
 *   post:
 *     tags: [Packets]
 *     summary: Analyze network packets
 *     description: Analyze a collection of network packets for various properties.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               packets:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     sourceIp:
 *                       type: string
 *                       description: Source IP address of the packet
 *                     destinationIp:
 *                       type: string
 *                       description: Destination IP address of the packet
 *                     protocol:
 *                       type: string
 *                       description: Network protocol used in the packet
 *                     size:
 *                       type: integer
 *                       description: Size of the packet in bytes
 *     responses:
 *       200:
 *         description: Successfully analyzed packets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 analysisResults:
 *                   type: string
 *                   description: Results of the packet analysis
 *       400:
 *         description: Invalid packet data
 *       500:
 *         description: Internal server error
 */
router.post('/analyze-packets', analyzePacketsController);

export default router;

// import express from 'express';
// import { analyzePacketsController } from '../controllers/packetController.js';

// const router = express.Router();

// // Define POST route
// router.post('/analyze-packets', analyzePacketsController);

// export default router;
