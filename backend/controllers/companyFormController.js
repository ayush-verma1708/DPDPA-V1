import { CompanyForm } from '../models/CompanyForm.js';
import User from '../models/User.js';

// Create a new company form entry
// export const createCompanyForm = async (req, res) => {
//   try {
//     const {
//       userId,
//       phoneNumber,
//       organizationName,
//       industryType,
//       customIndustryType,
//       numberOfEmployees,
//       otp,
//     } = req.body;

//     const newCompanyForm = new CompanyForm({
//       userId,
//       phoneNumber,
//       companyDetails: {
//         organizationName,
//         industryType,
//         customIndustryType,
//         numberOfEmployees,
//       },
//       otp,
//     });

//     const companyWithUserExists = await CompanyForm.find({
//       userId,
//     });

//     if (companyWithUserExists.length > 0) {
//       return res.status(500).json({
//         error: 'One user can be associated with only one company.',
//         code: '1U1O',
//       });
//     }

//     res.status(201).json(savedForm);
//   } catch (error) {
//     console.error('Error creating company form:', error);
//     res.status(500).json({ message: 'Error creating company form', error });
//   }
// };
export const createCompanyForm = async (req, res) => {
  try {
    // Destructure data from the request body
    const { userId, phoneNumber, companyDetails } = req.body;

    // Log the data (after destructuring)
    console.log(userId, phoneNumber, companyDetails);

    // Validate required fields
    if (!userId || !phoneNumber || !companyDetails) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if the user has already submitted a form
    const existingForm = await CompanyForm.findOne({ userId });
    if (existingForm) {
      return res
        .status(400)
        .json({ message: 'Company form already exists for this user' });
    }

    // Create a new form
    const newForm = new CompanyForm({
      userId,
      phoneNumber,
      companyDetails,
    });

    // Save to the database
    const savedForm = await newForm.save();

    // Find the user and update with the company details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user model with the company form and set form completion status
    user.company = savedForm._id; // Add the company form reference
    // user.hasCompletedCompanyForm = true; // Mark as completed
    await user.save(); // Save the updated user model

    // Send the response back with saved form details
    return res
      .status(201)
      .json({ message: 'Company form created successfully', data: savedForm });
  } catch (error) {
    console.error('Error creating company form:', error);
    return res
      .status(500)
      .json({ message: 'Internal server error', error: error.message });
  }
};

// Fetch a company form entry by ID
export const getCompanyFormById = async (req, res) => {
  try {
    const { id } = req.params;
    const companyForm = await CompanyForm.findById(id).populate('userId');

    if (!companyForm) {
      return res.status(404).json({ message: 'Company form not found' });
    }

    res.status(200).json(companyForm);
  } catch (error) {
    console.error('Error fetching company form:', error);
    res.status(500).json({ message: 'Error fetching company form', error });
  }
};

// Update a company form entry by ID
export const updateCompanyForm = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      phoneNumber,
      organizationName,
      industryType,
      customIndustryType,
      numberOfEmployees,
    } = req.body;

    const updatedForm = await CompanyForm.findByIdAndUpdate(
      id,
      {
        phoneNumber,
        companyDetails: {
          organizationName,
          industryType,
          customIndustryType,
          numberOfEmployees,
        },
      },
      { new: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ message: 'Company form not found' });
    }

    res.status(200).json(updatedForm);
  } catch (error) {
    console.error('Error updating company form:', error);
    res.status(500).json({ message: 'Error updating company form', error });
  }
};

// Delete a company form entry by ID
export const deleteCompanyForm = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedForm = await CompanyForm.findByIdAndDelete(id);

    if (!deletedForm) {
      return res.status(404).json({ message: 'Company form not found' });
    }

    res.status(200).json({ message: 'Company form deleted successfully' });
  } catch (error) {
    console.error('Error deleting company form:', error);
    res.status(500).json({ message: 'Error deleting company form', error });
  }
};

// List all company form entries (with optional pagination and filters)
export const listCompanyForms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const companyForms = await CompanyForm.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('userId');

    res.status(200).json(companyForms);
  } catch (error) {
    console.error('Error listing company forms:', error);
    res.status(500).json({ message: 'Error listing company forms', error });
  }
};

// Validate the form data (example: simple phone number validation)
export const validateFormData = (req, res, next) => {
  const phoneNumber = req.body.phoneNumber;

  if (!/^\d{10}$/.test(phoneNumber)) {
    return res.status(400).json({ message: 'Invalid phone number format' });
  }

  next();
};
