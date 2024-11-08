import mongoose from 'mongoose';
import { UserResponse } from '../models/UserResponse.js'; // Adjust the import path as necessary
import { ProductFamily } from '../models/productFamily.js'; // To fetch product families
import { CompanyForm } from '../models/CompanyForm.js'; // Assuming you have a company model
import createCompletionData from '../scripts/createCompletionData.js';
import { generateGroupedNotificationsForAssets } from '../scripts/notificationCreate.js';

import { default_TaskCreator } from '../constants.js';

// export const addUserResponses = async (req, res) => {
//   const { companyId, responses } = req.body; // Expects companyId and an array of responses

//   try {
//     // Ensure the companyId exists
//     const company = await CompanyForm.findById(companyId);
//     if (!company) {
//       return res.status(404).json({ message: 'Company not found' });
//     }

//     // Validate that responses array is provided and contains responses for each product family
//     if (!Array.isArray(responses) || responses.length === 0) {
//       return res.status(400).json({ message: 'Responses are required' });
//     }

//     const savedResponses = [];

//     // Loop through each response and save it
//     for (const response of responses) {
//       const {
//         productFamilyId,
//         selectedSoftware = null,
//         otherSoftware = '',
//       } = response;

//       // Ensure the productFamilyId exists
//       const productFamily = await ProductFamily.findById(productFamilyId);
//       if (!productFamily) {
//         return res.status(404).json({
//           message: `Product family with ID ${productFamilyId} not found`,
//         });
//       }

//       // Check if selectedSoftware is "Others" and ensure otherSoftware is provided
//       if (selectedSoftware === 'Others' && !otherSoftware.trim()) {
//         return res.status(400).json({
//           message:
//             'Please provide the name of the other software if selectedSoftware is set to "Others".',
//         });
//       }

//       // Set softwareToSave based on user selection
//       let softwareToSave = null;
//       if (selectedSoftware === 'Others') {
//         softwareToSave = otherSoftware.trim(); // Save the other software name if specified
//       } else if (selectedSoftware === 'None') {
//         softwareToSave = null; // Set to null if "None" is selected
//       } else if (selectedSoftware) {
//         softwareToSave = selectedSoftware; // This is a valid ObjectId
//       }

//       // Determine isValid based on selectedSoftware
//       const isValid = !!softwareToSave; // true if softwareToSave is not null

//       // Create and save the user response
//       const newUserResponse = new UserResponse({
//         companyId,
//         productFamily: productFamilyId,
//         selectedSoftware: softwareToSave, // This can be null, other software name, or an ObjectId
//         isValid, // Set isValid based on whether there is selectedSoftware
//       });

//       // After all responses are saved, trigger the tasks

//       const savedResponse = await newUserResponse.save();
//       savedResponses.push(savedResponse); // Add saved response to the list
//     }

//     // Return all saved responses
//     return res.status(201).json({
//       message: 'Responses added successfully',
//       data: savedResponses,
//     });
//     try {
//       // Trigger the task to create completion data (replace with correct ID if needed)
//       await createCompletionData(default_TaskCreator);
//       console.log('Completion data created successfully!');
//     } catch (taskError) {
//       console.error(
//         'Error running tasks after response submission:',
//         taskError
//       );
//     }
//   } catch (error) {
//     console.error('Error adding user responses:', error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// };
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

      // Set softwareToSave based on user selection
      let softwareToSave = null;
      if (selectedSoftware === 'Others') {
        softwareToSave = otherSoftware.trim(); // Save the other software name if specified
      } else if (selectedSoftware === 'None') {
        softwareToSave = null; // Set to null if "None" is selected
      } else if (selectedSoftware) {
        softwareToSave = selectedSoftware; // This is a valid ObjectId
      }

      // Determine isValid based on selectedSoftware
      const isValid = !!softwareToSave; // true if softwareToSave is not null

      // Create and save the user response
      const newUserResponse = new UserResponse({
        companyId,
        productFamily: productFamilyId,
        selectedSoftware: softwareToSave, // This can be null, other software name, or an ObjectId
        isValid, // Set isValid based on whether there is selectedSoftware
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

  console.log(`Received companyId: ${companyId}`); // Log the incoming companyId

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

// import mongoose from 'mongoose';
// import { UserResponse } from '../models/UserResponse.js'; // Adjust the import path as necessary
// import { ProductFamily } from '../models/productFamily.js'; // To fetch product families
// import { CompanyForm } from '../models/CompanyForm.js'; // Assuming you have a company model

// // Controller to add user responses for all product families
// export const addUserResponses = async (req, res) => {
//   const { companyId, responses } = req.body; // Expects companyId and an array of responses

//   try {
//     // Ensure the companyId exists
//     const company = await CompanyForm.findById(companyId);
//     if (!company) {
//       return res.status(404).json({ message: 'Company not found' });
//     }

//     // Validate that responses array is provided and contains responses for each product family
//     if (!Array.isArray(responses) || responses.length === 0) {
//       return res.status(400).json({ message: 'Responses are required' });
//     }

//     const savedResponses = [];

//     // Loop through each response and save it
//     for (const response of responses) {
//       const {
//         productFamilyId,
//         selectedSoftware,
//         otherSoftware = '',
//       } = response;

//       // Ensure the productFamilyId exists
//       const productFamily = await ProductFamily.findById(productFamilyId);
//       if (!productFamily) {
//         return res.status(404).json({
//           message: `Product family with ID ${productFamilyId} not found`,
//         });
//       }

//       // Create and save the user response
//       const newUserResponse = new UserResponse({
//         companyId,
//         productFamily: productFamilyId,
//         selectedSoftware,
//         otherSoftware: selectedSoftware === 'Others' ? otherSoftware : '',
//       });

//       const savedResponse = await newUserResponse.save();
//       savedResponses.push(savedResponse); // Add saved response to the list
//     }

//     // Return all saved responses
//     return res.status(201).json({
//       message: 'Responses added successfully',
//       data: savedResponses,
//     });
//   } catch (error) {
//     console.error('Error adding user responses:', error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// // Controller to get user responses based on companyId
// export const getUserResponsesByCompanyId = async (req, res) => {
//   const { companyId } = req.params; // Assuming companyId is passed as a URL parameter

//   console.log(`Received companyId: ${companyId}`); // Log the incoming companyId

//   try {
//     // Ensure the companyId is valid
//     if (!mongoose.isValidObjectId(companyId)) {
//       return res.status(400).json({ message: 'Invalid company ID format' });
//     }

//     // Fetch user responses associated with the provided companyId
//     const userResponses = await UserResponse.find({ companyId }).populate(
//       'productFamily',
//       'family_name category'
//     );

//     // Check if any responses were found
//     if (userResponses.length === 0) {
//       return res
//         .status(404)
//         .json({ message: 'No responses found for this company' });
//     }

//     // Return the found user responses
//     return res.status(200).json({
//       message: 'User responses retrieved successfully',
//       data: userResponses,
//     });
//   } catch (error) {
//     console.error('Error retrieving user responses:', error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// };
// import { createCompletionData } from '../scripts/createCompletionData.js'; // Import task

// export const addUserResponses = async (req, res) => {
//   const { companyId, responses } = req.body; // Expects companyId and an array of responses

//   try {
//     // Ensure the companyId exists
//     const company = await CompanyForm.findById(companyId);
//     if (!company) {
//       return res.status(404).json({ message: 'Company not found' });
//     }

//     // Validate that responses array is provided and contains responses for each product family
//     if (!Array.isArray(responses) || responses.length === 0) {
//       return res.status(400).json({ message: 'Responses are required' });
//     }

//     const savedResponses = [];

//     // Loop through each response and save it
//     for (const response of responses) {
//       const {
//         productFamilyId,
//         selectedSoftware = null,
//         otherSoftware = '',
//       } = response;

//       // Ensure the productFamilyId exists
//       const productFamily = await ProductFamily.findById(productFamilyId);
//       if (!productFamily) {
//         return res.status(404).json({
//           message: `Product family with ID ${productFamilyId} not found`,
//         });
//       }

//       // Check if selectedSoftware is "Others" and ensure otherSoftware is provided
//       if (selectedSoftware === 'Others' && !otherSoftware.trim()) {
//         return res.status(400).json({
//           message:
//             'Please provide the name of the other software if selectedSoftware is set to "Others".',
//         });
//       }

//       // Set softwareToSave based on user selection
//       let softwareToSave = null;
//       if (selectedSoftware === 'Others') {
//         softwareToSave = otherSoftware.trim(); // Save the other software name if specified
//       } else if (selectedSoftware === 'None') {
//         softwareToSave = null; // Set to null if "None" is selected
//       } else if (selectedSoftware) {
//         softwareToSave = selectedSoftware; // This is a valid ObjectId
//       }

//       // Create and save the user response
//       const newUserResponse = new UserResponse({
//         companyId,
//         productFamily: productFamilyId,
//         selectedSoftware: softwareToSave, // This can be null, other software name, or an ObjectId
//       });

//       const savedResponse = await newUserResponse.save();
//       savedResponses.push(savedResponse); // Add saved response to the list
//     }

//     // Return all saved responses
//     return res.status(201).json({
//       message: 'Responses added successfully',
//       data: savedResponses,
//     });
//   } catch (error) {
//     console.error('Error adding user responses:', error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// export const getUserResponsesByCompanyId = async (req, res) => {
//   const { companyId } = req.params; // Assuming companyId is passed as a URL parameter

//   console.log(`Received companyId: ${companyId}`); // Log the incoming companyId

//   try {
//     // Ensure the companyId is valid
//     if (!mongoose.isValidObjectId(companyId)) {
//       return res.status(400).json({ message: 'Invalid company ID format' });
//     }

//     // Fetch user responses associated with the provided companyId
//     const userResponses = await UserResponse.find({ companyId })
//       .populate('productFamily', 'family_name category')
//       .lean(); // Use lean for better performance if you don't need Mongoose documents

//     // Check if any responses were found
//     if (userResponses.length === 0) {
//       return res
//         .status(404)
//         .json({ message: 'No responses found for this company' });
//     }

//     // Return the found user responses
//     return res.status(200).json({
//       message: 'User responses retrieved successfully',
//       data: userResponses,
//     });
//   } catch (error) {
//     console.error('Error retrieving user responses:', error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// };
