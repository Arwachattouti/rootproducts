// src/routes/UserRoutes.ts

import express from 'express';
import { 
    registerUser, 
    loginUser, 
    logoutUser ,getUserProfile, updateUserProfile
} from '../controllers/UserController'; // Importation des fonctions du contrôleur
import { protect } from '../middleware/AuthMiddleware';
const router = express.Router();

// Route d'inscription
// POST /api/users/register
router.post('/register', registerUser);

// Route de connexion
// POST /api/users/login
router.post('/login', loginUser);

// Route de déconnexion
// POST /api/users/logout
router.post('/logout', logoutUser);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);


export default router;