import express from 'express';
import { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    updateExistingProducts 
} from '../controllers/ProductController';
import { protect} from '../middleware/AuthMiddleware';

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(protect, createProduct);

router.route('/seed')
    .put(protect,  updateExistingProducts);

router.route('/:id')
    .get(getProductById)
    .put(protect, updateProduct)
    .delete(protect, deleteProduct);

export default router;