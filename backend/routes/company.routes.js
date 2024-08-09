import { Router } from 'express';
import { addCompany, getCompanies } from "../controllers/company.controller.js";

const companyRouter = Router();

companyRouter.route('/').get(getCompanies);
companyRouter.route('/add-company').post(addCompany)

export default companyRouter;
