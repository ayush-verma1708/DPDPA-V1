import mongoose from 'mongoose';
import { UserResponse } from '../models/UserResponse.js'; // Adjust the import path as necessary
import { ProductFamily } from '../models/productFamily.js'; // To fetch product families
import { CompanyForm } from '../models/CompanyForm.js'; // Assuming you have a company model
import createCompletionData from '../scripts/Node/createCompletionData.js';
import { generateGroupedNotificationsForAssets } from '../scripts/Node/notificationCreate.js';
import { default_TaskCreator } from '../constants.js';

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
        selectedSoftware = null,
        otherSoftware = '',
      } = response;

      // Ensure the productFamilyId exists
      const productFamily = await ProductFamily.findById(productFamilyId);
      if (!productFamily) {
        return res.status(404).json({
          message: `Product family with ID ${productFamilyId} not found`,
        });
      }

      // Check if selectedSoftware is "Others" and ensure otherSoftware is provided
      if (selectedSoftware === 'Others' && !otherSoftware.trim()) {
        return res.status(400).json({
          message:
            'Please provide the name of the other software if selectedSoftware is set to "Others".',
        });
      }

      let softwareToSave = null;
      if (selectedSoftware === 'Others') {
        softwareToSave = null; // "Others" should not map to an ObjectId
      } else if (selectedSoftware === 'None') {
        softwareToSave = null; // No software selected
      } else {
        // Validate ObjectId for valid software references
        if (mongoose.isValidObjectId(selectedSoftware)) {
          softwareToSave = selectedSoftware; // Valid ObjectId
        } else {
          return res.status(400).json({
            message: `"${selectedSoftware}" is not a valid software ID. Provide a valid ObjectId or choose "Others".`,
          });
        }
      }
      // Determine isValid based on selectedSoftware
      const isValid = !!softwareToSave; // true if softwareToSave is not null

      // Create and save the user response
      // const newUserResponse = new UserResponse({
      //   companyId,
      //   productFamily: productFamilyId,
      //   selectedSoftware: softwareToSave, // This can be null, other software name, or an ObjectId
      //   otherSoftware:
      //     selectedSoftware === 'Others' ? otherSoftware.trim() : '', // Store manual entry
      //   isValid: selectedSoftware !== 'None' || !!otherSoftware.trim(), // Valid if software is provided
      // });
      const newUserResponse = new UserResponse({
        companyId,
        productFamily: productFamilyId,
        selectedSoftware: softwareToSave, // Will be null for "Others"
        otherSoftware:
          selectedSoftware === 'Others' ? otherSoftware.trim() : '', // Save custom name
        isValid: softwareToSave !== null || !!otherSoftware.trim(), // Valid if any software is provided
      });

      // Save the response
      const savedResponse = await newUserResponse.save();
      savedResponses.push(savedResponse); // Add saved response to the list
    }

    // Once all responses are saved, trigger the task
    try {
      // Trigger the task to create completion data (replace with correct ID if needed)
      await createCompletionData(default_TaskCreator);
      console.log('Completion data created successfully!');
    } catch (taskError) {
      console.error(
        'Error running tasks after response submission:',
        taskError
      );
    }
    // Once all responses are saved, trigger the task
    try {
      // Trigger the task to create completion data (replace with correct ID if needed)
      await generateGroupedNotificationsForAssets();
      console.log('Completion data created successfully!');
    } catch (taskError) {
      console.error(
        'Error running tasks after response submission:',
        taskError
      );
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

export const getUserResponsesByCompanyId = async (req, res) => {
  const { companyId } = req.params; // Assuming companyId is passed as a URL parameter

  try {
    // Ensure the companyId is valid
    if (!mongoose.isValidObjectId(companyId)) {
      return res.status(400).json({ message: 'Invalid company ID format' });
    }

    // Fetch user responses associated with the provided companyId
    const userResponses = await UserResponse.find({ companyId })
      .populate('productFamily', 'family_name category')
      .populate('selectedSoftware', 'software_name') // Populate software names
      .lean(); // Use lean for better performance if you don't need Mongoose documents

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
