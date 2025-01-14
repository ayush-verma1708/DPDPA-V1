import express from 'express';
import {
  getDataInventory,
  getAccessLogs,
  getDataGovernance,
  getAuditLogs,
} from '../controllers/AzureDataController.js';

const azureRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Azure Data
 *   description: Azure data management operations
 */

/**
 * @swagger
 * /api/data-inventory:
 *   get:
 *     tags: [Azure Data]
 *     summary: Retrieve data inventory
 *     description: Fetch the inventory of data from Azure.
 *     responses:
 *       200:
 *         description: Data inventory retrieved successfully
 *       500:
 *         description: Server error
 */
azureRoutes.get('/data-inventory', getDataInventory);

/**
 * @swagger
 * /api/access-logs:
 *   get:
 *     tags: [Azure Data]
 *     summary: Retrieve access logs
 *     description: Fetch access logs from Azure for monitoring and analysis.
 *     responses:
 *       200:
 *         description: Access logs retrieved successfully
 *       500:
 *         description: Server error
 */
azureRoutes.get('/access-logs', getAccessLogs);

/**
 * @swagger
 * /api/data-governance:
 *   get:
 *     tags: [Azure Data]
 *     summary: Retrieve data governance policies
 *     description: Fetch data governance policies from Azure.
 *     responses:
 *       200:
 *         description: Data governance policies retrieved successfully
 *       500:
 *         description: Server error
 */
azureRoutes.get('/data-governance', getDataGovernance);

/**
 * @swagger
 * /api/audit-logs:
 *   get:
 *     tags: [Azure Data]
 *     summary: Retrieve audit logs
 *     description: Fetch audit logs from Azure for compliance and security.
 *     responses:
 *       200:
 *         description: Audit logs retrieved successfully
 *       500:
 *         description: Server error
 */
azureRoutes.get('/audit-logs', getAuditLogs);

export default azureRoutes;

// import express from 'express';
// import {
//   getDataInventory,
//   getAccessLogs,
//   getDataGovernance,
//   getAuditLogs,
// } from '../controllers/AzureDataController.js';

// const azureRoutes = express.Router();

// // Data routes
// azureRoutes.get('/data-inventory', getDataInventory);
// azureRoutes.get('/access-logs', getAccessLogs);
// azureRoutes.get('/data-governance', getDataGovernance);
// azureRoutes.get('/audit-logs', getAuditLogs);

// export default azureRoutes;
