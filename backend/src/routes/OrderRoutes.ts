import express from 'express';
import { 
    createOrder, 
    getUserOrders, 
    getOrderById, 
    getAllOrders, 
    updateOrderStatus, 
    deleteOrder, 
    getAdminStats 
} from '../controllers/OrderController';
import { protect} from '../middleware/AuthMiddleware';

const router = express.Router();

// Routes Utilisateurs (Protégées)
router.route('/').post(protect, createOrder);
router.route('/myorders').get(protect, getUserOrders);

router.route('/stats').get(protect,  getAdminStats);
router.route('/:id').get(protect, getOrderById);

// Routes Admin
router.route('/').get(protect,  getAllOrders);
router.route('/:id/status').put(protect, updateOrderStatus);
router.route('/:id').delete(protect, deleteOrder); // Route de suppression

export default router;