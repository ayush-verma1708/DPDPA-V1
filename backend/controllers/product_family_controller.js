// controllers/productFamilyController.js
import { ProductFamily } from '../models/productFamily.js';

// Controller to get all product families
export const getProductFamilies = async (req, res) => {
  try {
    const families = await ProductFamily.find(); // Fetch all product families
    res.status(200).json(families); // Send the families as a JSON response
  } catch (error) {
    console.error('Error fetching product families:', error);
    res
      .status(500)
      .json({ message: 'Server error while fetching product families.' });
  }
};
