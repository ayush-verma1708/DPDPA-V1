import { Router } from 'express';
import { createCoverage, deleteCoverage, getCoverages, updateCoverage } from '../controllers/coverage.controller.js';

const coverageRouter = Router()

coverageRouter.route('/').get(getCoverages);
coverageRouter.route('/add-coverage').post(createCoverage);
coverageRouter.route("/:id").put(updateCoverage);
coverageRouter.route("/:id").delete(deleteCoverage);

export default coverageRouter