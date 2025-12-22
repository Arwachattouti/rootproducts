// src/routes/UserRoutes.ts

import express from 'express';
import { 
    registerUser, deleteUser,
    loginUser, getUsers, getUserById, updateUser,
    logoutUser ,getUserProfile, updateUserProfile
} from '../controllers/UserController'; // Importation des fonctions du contrôleur
import { protect } from '../middleware/AuthMiddleware';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.route('/')
    .get(protect, getUsers);

router.route('/:id')
    .get(protect, getUserById)
    .put(protect,  updateUser)
    .delete(protect, deleteUser);
export default router;