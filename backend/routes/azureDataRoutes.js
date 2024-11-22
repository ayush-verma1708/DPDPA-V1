import express from 'express';
import {
  getDataInventory,
  getAccessLogs,
  getDataGovernance,
  getAuditLogs,
} from '../controllers/AzureDataController.js';

const azureRoutes = express.Router();

// Data routes
azureRoutes.get('/data-inventory', getDataInventory);
azureRoutes.get('/access-logs', getAccessLogs);
azureRoutes.get('/data-governance', getDataGovernance);
azureRoutes.get('/audit-logs', getAuditLogs);

export default azureRoutes;
