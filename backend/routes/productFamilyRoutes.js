import express from 'express';
import { getProductFamilies } from '../controllers/product_family_controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ProductFamilies
 *   description: Operations related to product families
 */

/**
 * @swagger
 * /api/product-families:
 *   get:
 *     tags: [ProductFamilies]
 *     summary: Retrieve all product families
 *     description: Fetch a list of all product families.
 *     responses:
 *       200:
 *         description: A list of product families
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the product family
 *                   name:
 *                     type: string
 *                     description: The name of the product family
 *                   description:
 *                     type: string
 *                     description: A brief description of the product family
 *       500:
 *         description: Internal server error
 */
router.get('/product-families', getProductFamilies);

export default router;

// // routes/productFamilyRoutes.js
// import express from 'express';
// import { getProductFamilies } from '../controllers/product_family_controller.js';

// const router = express.Router();

// // Route to get all product families
// router.get('/product-families', getProductFamilies);

// export default router;
