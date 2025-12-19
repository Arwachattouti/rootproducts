// src/controllers/OrderController.ts

import { Response } from 'express';
import OrderModel from '../models/OrderModel';
import ProductModel from '../models/ProductModel';
import { AuthenticatedRequest } from '../middleware/AuthMiddleware'; // Pour accéder à req.user
import mongoose from 'mongoose';


/**
 * @desc    Créer une nouvelle commande
 * @route   POST /api/orders
 * @access  Private (Nécessite d'être connecté)
 */
export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
    // L'utilisateur est garanti d'être présent grâce au middleware 'protect'
    const userId = req.user!._id; 
    
    // Récupération des données du corps de la requête
    const { 
        orderItems, 
        shippingAddress, 
        total 
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
        res.status(400).json({ message: 'Aucun article dans la commande.' });
        return;
    }

    // --- LOGIQUE DE VALIDATION ET DE CRÉATION DE COMMANDE ---
    try {
        // 1. Vérification optionnelle (mais recommandée) : stock et prix
        // C'est ici qu'on ferait une boucle pour s'assurer que les prix et stocks sont corrects.
        // Pour simplifier, nous allons supposer que le front-end a envoyé les bonnes données
        // et nous allons juste créer la commande.

        // 2. Création de l'objet de commande
        const order = new OrderModel({
            user: userId,
            items: orderItems.map((item: any) => ({
                product: new mongoose.Types.ObjectId(item.product), // Convertir l'ID en ObjectId
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                image: item.image,
            })),
            shippingAddress: shippingAddress,
            total: total,
            // status: 'pending' par défaut dans le modèle
        });

        // 3. Sauvegarde de la commande dans la base de données
        const createdOrder = await order.save();

        // 4. Mettre à jour le stock (Logique à implémenter : décrémenter le stock des produits commandés)

        res.status(201).json(createdOrder);

    } catch (error) {
        console.error('Erreur lors de la création de la commande:', error);
        res.status(500).json({ message: 'Échec de la création de la commande.' });
    }
};

/**
 * @desc    Récupérer les commandes d'un utilisateur connecté
 * @route   GET /api/orders/myorders
 * @access  Private
 */
export const getUserOrders = async (req: AuthenticatedRequest, res: Response) => {
    try {
        // 💡 CORRECTION : Convertir req.user!._id en string via .toString()
        const userId = req.user!._id.toString(); 

        const orders = await OrderModel.find({ users: userId }) // Utilisation de l'ID converti
            .populate('items.product', 'name price image') 
            .sort({ createdAt: -1 }); 

        res.status(200).json(orders);
    } catch (error) {
        console.error('Erreur lors de la récupération des commandes utilisateur:', error);
        res.status(500).json({ message: 'Échec de la récupération des commandes.' });
    }
};

/**
 * @desc    Récupérer les détails d'une commande par ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderById = async (req: AuthenticatedRequest, res: Response) => {
    const orderId = req.params.id;

    try {
        const order = await OrderModel.findById(orderId)
            .populate('user', 'firstName lastName email') // Récupère le nom/email du client
            .populate('items.product', 'name price image');

        if (!order) {
            res.status(404).json({ message: 'Commande non trouvée.' });
            return;
        }

        // Vérification de sécurité : S'assurer que l'utilisateur est bien le propriétaire de la commande (ou un admin)
        if (order.user.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
             res.status(403).json({ message: 'Non autorisé à accéder à cette commande.' });
             return;
        }

        res.status(200).json(order);

    } catch (error) {
        console.error('Erreur lors de la récupération de la commande:', error);
        res.status(500).json({ message: 'Échec de la récupération de la commande.' });
    }
};
