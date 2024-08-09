import { Company } from "../models/company.model.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Add a company
const addCompany = AsyncHandler(async (req, res) => {
  const { name, email, address, industryType } = req.body;
  if([name, email, address, industryType].some((fields) => fields?.trim() === "")){
    throw new ApiError(400, "All fields are required.")
}
  const company = new Company({
    name,
    email,
    address,
    industryType
  });
  const createdCompany = await company.save();
  res.status(201).json(
    new ApiResponse(200, createdCompany, "Company created successfully.")
  );
});

// Get companies with pagination
const getCompanies =  AsyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 10;
  const page = Number(req.query.pageNumber) || 1;
  const sortField = req.query.sortField || 'createdAt';
  const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
  const count = await Company.countDocuments({});
  const companies = await Company.find({})
  .sort({ [sortField]: sortOrder })
    .limit(pageSize)  
    .skip(pageSize * (page - 1));
  
    res.json({ companies, page, pages: Math.ceil(count / pageSize), total: count });
});

export { addCompany, getCompanies };
