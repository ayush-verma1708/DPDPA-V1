import mongoose from 'mongoose';
import { UserResponse } from '../models/userResponse.js'; // Adjust the import path as necessary
import { ProductFamily } from '../models/productFamily.js'; // To fetch product families
import { CompanyForm } from '../models/CompanyForm.js'; // Assuming you have a company model

// Controller to add user responses for all product families
export const addUserResponses = async (req, res) => {
  const { companyId, responses } = req.body; // Expects companyId and an array of responses

  try {
    // Ensure the companyId exists
    const company = await CompanyForm.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Validate that responses array is provided and contains responses for each product family
    if (!Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({ message: 'Responses are required' });
    }

    const savedResponses = [];

    // Loop through each response and save it
    for (const response of responses) {
      const {
        productFamilyId,
        selectedSoftware,
        otherSoftware = '',
      } = response;

      // Ensure the productFamilyId exists
      const productFamily = await ProductFamily.findById(productFamilyId);
      if (!productFamily) {
        return res.status(404).json({
          message: `Product family with ID ${productFamilyId} not found`,
        });
      }

      // Create and save the user response
      const newUserResponse = new UserResponse({
        companyId,
        productFamily: productFamilyId,
        selectedSoftware,
        otherSoftware: selectedSoftware === 'Others' ? otherSoftware : '',
      });

      const savedResponse = await newUserResponse.save();
      savedResponses.push(savedResponse); // Add saved response to the list
    }

    // Return all saved responses
    return res.status(201).json({
      message: 'Responses added successfully',
      data: savedResponses,
    });
  } catch (error) {
    console.error('Error adding user responses:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Controller to get user responses based on companyId
export const getUserResponsesByCompanyId = async (req, res) => {
  const { companyId } = req.params; // Assuming companyId is passed as a URL parameter

  console.log(`Received companyId: ${companyId}`); // Log the incoming companyId

  try {
    // Ensure the companyId is valid
    if (!mongoose.isValidObjectId(companyId)) {
      return res.status(400).json({ message: 'Invalid company ID format' });
    }

    // Fetch user responses associated with the provided companyId
    const userResponses = await UserResponse.find({ companyId }).populate(
      'productFamily',
      'family_name category'
    );

    // Check if any responses were found
    if (userResponses.length === 0) {
      return res
        .status(404)
        .json({ message: 'No responses found for this company' });
    }

    // Return the found user responses
    return res.status(200).json({
      message: 'User responses retrieved successfully',
      data: userResponses,
    });
  } catch (error) {
    console.error('Error retrieving user responses:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
