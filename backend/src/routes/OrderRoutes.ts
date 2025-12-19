// src/routes/OrderRoutes.ts

import express from 'express';
import { protect } from '../middleware/AuthMiddleware'; // Le middleware de protection
import { 
    createOrder, 
    getUserOrders, 
    getOrderById 
} from '../controllers/OrderController'; // Les fonctions du contrôleur

const router = express.Router();

// Toutes les routes de commande nécessitent que l'utilisateur soit connecté (middleware 'protect')
// router.use(protect); // Vous pouvez appliquer 'protect' à toutes les routes d'un coup

// --- Routes pour les utilisateurs connectés ---

// POST /api/orders
// Créer une nouvelle commande.
router.route('/').post(protect, createOrder);

// GET /api/orders/myorders
// Récupérer l'historique de commandes de l'utilisateur connecté.
router.route('/myorders').get(protect, getUserOrders); 

// GET /api/orders/:id
// Récupérer les détails d'une commande spécifique.
// Note: Le 'protect' est déjà appliqué ici. La vérification de propriété est dans le contrôleur.
router.route('/:id').get(protect, getOrderById);

// --- Routes d'administration (Ajout futur) ---
// Par exemple : router.route('/').get(protect, admin, getOrders); // Pour récupérer TOUTES les commandes

export default router;