import { CompanyForm } from '../models/CompanyForm.js';

// Create a new company form entry
export const createCompanyForm = async (req, res) => {
  try {
    const { userId, phoneNumber, organizationName, industryType, customIndustryType, numberOfEmployees, otp } = req.body;

    const newCompanyForm = new CompanyForm({
      userId,
      phoneNumber,
      companyDetails: {
        organizationName,
        industryType,
        customIndustryType,
        numberOfEmployees
      },
      otp
    });

    const savedForm = await newCompanyForm.save();
    res.status(201).json(savedForm);
  } catch (error) {
    console.error('Error creating company form:', error);
    res.status(500).json({ message: 'Error creating company form', error });
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
    const { phoneNumber, organizationName, industryType, customIndustryType, numberOfEmployees } = req.body;

    const updatedForm = await CompanyForm.findByIdAndUpdate(
      id,
      {
        phoneNumber,
        companyDetails: {
          organizationName,
          industryType,
          customIndustryType,
          numberOfEmployees
        }
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
