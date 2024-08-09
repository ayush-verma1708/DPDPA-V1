import { Router } from 'express';
import { addIt, getItInAsset } from '../controllers/it.controller.js';

const itRouter = Router();

itRouter.route("/add-it").post(addIt);
itRouter.route("/").get(getItInAsset);

export default itRouter;
