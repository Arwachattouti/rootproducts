import express from 'express';
import { createPaymeePayment, verifyPaymeePayment } from '../controllers/paymentController';
import { protect } from '../middleware/AuthMiddleware';

const router = express.Router();

router.post('/paymee', protect, createPaymeePayment);
router.get('/verify/:token', protect, verifyPaymeePayment);

export default router;