// src/routes/ProductRoutes.ts

import express from 'express';
import { getProducts, getProductById , updateExistingProducts} from '../controllers/ProductController';

const router = express.Router();

router.route('/').get(getProducts);
router.route('/seed') .put(updateExistingProducts);
router.route('/:id').get(getProductById);

export default router;