import express from 'express';
import { getCart, updateCart, removeFromCart, clearCart } from '../controllers/CartController';
import { protect } from '../middleware/AuthMiddleware';

const router = express.Router();

router.route('/')
    .get(protect, getCart)
    .post(protect, updateCart)
    .delete(protect, clearCart);

router.route('/:productId')
    .delete(protect, removeFromCart);

export default router;