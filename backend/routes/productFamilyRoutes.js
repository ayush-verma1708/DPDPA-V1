// routes/productFamilyRoutes.js
import express from 'express';
import { getProductFamilies } from '../controllers/product_family_controller.js';

const router = express.Router();

// Route to get all product families
router.get('/product-families', getProductFamilies);

export default router;
