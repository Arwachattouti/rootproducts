import { Response } from 'express';
import CartModel from '../models/CartModel';
import { AuthenticatedRequest } from '../middleware/AuthMiddleware';
import mongoose from 'mongoose';
import ProductModel from '../models/ProductModel';

export const getCart = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Non autorisé' });
        const userId = req.user._id;

        let cart = await CartModel.findOne({ user: userId }).populate('items.product', 'name price images weight');

        if (!cart) {
            cart = await CartModel.create({ user: userId, items: [] });
        } else {
            // ✅ CORRECTION : Filtrer les produits qui n'existent plus (null après populate)
            const originalLength = cart.items.length;
            cart.items = cart.items.filter(item => item.product !== null);

            // Si on a supprimé des produits fantômes, on sauvegarde le panier propre
            if (cart.items.length !== originalLength) {
                await cart.save();
            }
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du panier.' });
    }
};

export const updateCart = async (req: AuthenticatedRequest, res: Response) => {
    // 1. Vérification de l'authentification
    if (!req.user) return res.status(401).json({ message: 'Non autorisé' });

    const userId = req.user._id;
    const { productId, quantity } = req.body;

    // 2. Validation des entrées
    if (!productId || quantity === undefined) {
        return res.status(400).json({ message: 'Produit et quantité requis.' });
    }

    try {
        // 3. Récupérer le panier et le produit (pour le stock)
        let cart = await CartModel.findOne({ user: userId });
        const product = await ProductModel.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé.' });
        }

        if (!cart) {
            cart = new CartModel({ user: userId, items: [] });
        }

        // 4. Chercher si le produit est déjà dans le panier
        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId.toString()
        );

        if (itemIndex > -1) {
            // ... dans le if (itemIndex > -1)
            if (quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            } else {
                // CORRECTION : On remplace la quantité, on ne l'ajoute pas
                // Car le front-end calcule déjà le nouveau total
                cart.items[itemIndex].quantity = quantity;

                if (quantity > product.countInStock) {
                    return res.status(400).json({
                        message: `Stock insuffisant. Max: ${product.countInStock}`
                    });
                }
            }
        } else if (quantity > 0) {
            // SCÉNARIO B : Nouveau produit à ajouter
            if (quantity > product.countInStock) {
                return res.status(400).json({ message: 'Stock insuffisant.' });
            }

            cart.items.push({
                product: new mongoose.Types.ObjectId(productId),
                quantity: quantity
            });
        }

        // 5. Sauvegarde et retour des données peuplées
        await cart.save();

        // Optimisation : On peuple directement l'objet 'cart' sauvegardé
        await cart.populate('items.product', 'name price images weight countInStock');

        res.status(200).json(cart);

    } catch (error) {
        console.error('Erreur mise à jour panier:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du panier.' });
    }
};

export const removeFromCart = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Non autorisé' });

    const userId = req.user._id;
    const { productId } = req.params;

    try {
        const cart = await CartModel.findOne({ user: userId });

        if (cart) {
            cart.items = cart.items.filter(
                (item) => item.product.toString() !== productId.toString()
            );
            await cart.save();
            const updatedCart = await cart.populate('items.product', 'name price images weight');
            res.status(200).json(updatedCart);
        } else {
            res.status(404).json({ message: 'Panier non trouvé.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression.' });
    }
};

export const clearCart = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Non autorisé' });

    try {
        const cart = await CartModel.findOne({ user: req.user._id });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        res.status(200).json({ message: 'Panier vidé.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors du nettoyage du panier.' });
    }
};