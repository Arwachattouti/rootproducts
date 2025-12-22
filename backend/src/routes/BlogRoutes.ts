import express from 'express';
import { 
    getBlogs, 
    getBlogById, 
    createBlog, 
    updateBlog, 
    deleteBlog 
} from '../controllers/BlogController';
// import { protect, admin } from '../middleware/authMiddleware'; // À décommenter si vous avez l'authentification

const router = express.Router();

/**
 * @description Routes pour l'ensemble des articles
 * GET /api/blogs -> Récupérer tous les articles
 * POST /api/blogs -> Créer un nouvel article (Admin)
 */
router.route('/')
    .get(getBlogs)
    .post(createBlog); // Ajoutez protect, admin ici pour sécuriser la création

/**
 * @description Routes pour un article spécifique via son ID
 * GET /api/blogs/:id -> Récupérer les détails d'un article
 * PUT /api/blogs/:id -> Mettre à jour un article (Admin)
 * DELETE /api/blogs/:id -> Supprimer un article (Admin)
 */
router.route('/:id')
    .get(getBlogById)
    .put(updateBlog)
    .delete(deleteBlog); // Ajoutez protect, admin ici pour sécuriser la suppression

export default router;