import { Router } from 'express';
import { getBusinessInAsset, addBusiness } from '../controllers/bussiness.controller.js';

const businessRouter = Router();

businessRouter.route("/add-business").post(addBusiness);
businessRouter.route("/").get(getBusinessInAsset);

export default businessRouter;
