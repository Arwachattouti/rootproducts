// src/controllers/ProductController.ts

import { Request, Response } from 'express';
import ProductModel from '../models/ProductModel'; // Importer le Modèle de Produit

// @desc    Récupérer tous les produits
// @route   GET /api/products
// @access  Public (accessible par tous)
export const getProducts = async (req: Request, res: Response) => {
    try {
        // Appelle la méthode 'find' de Mongoose sur le Modèle.
        // Cela récupère tous les documents de la collection 'products'.
        const products = await ProductModel.find({});

        // Renvoie une réponse JSON avec le statut 200 (OK)
        res.status(200).json(products);

    } catch (error) {
        // En cas d'erreur de base de données ou autre
        console.error('Erreur lors de la récupération des produits:', error);
        res.status(500).json({ message: 'Erreur Serveur Interne' });
    }
};

// @desc    Récupérer un produit par ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response) => {
    // 1. Récupérer l'ID à partir des paramètres de l'URL
    const productId = req.params.id;

    // 2. Trouver le produit dans la base de données
    const product = await ProductModel.findById(productId);

    // 3. Vérifier le résultat
    if (product) {
        // Retourner le produit trouvé
        // Le produit contiendra tous les nouveaux champs (weight, origin, etc.)
        res.json(product); 
    } else {
        // Renvoyer une erreur 404 (Not Found)
        res.status(404);
        throw new Error('Produit non trouvé');
    }
};

// @desc    AJOUTER LES CHAMPS MANQUANTS ET REMPLIR LE STOCK (À utiliser une seule fois)
// @route   PUT /api/products/seed
// @access  Private (Admin)
export const updateExistingProducts =async (req: Request, res: Response) => {
    // Dans un vrai scénario, vous devriez créer des données spécifiques pour chaque produit.
    // Ici, nous allons appliquer des valeurs par défaut valides pour éviter les erreurs "required".
    
    // 1. Définir les valeurs par défaut pour les nouveaux champs requis
    const defaultUpdateFields = {
        // CORRECTION DU STOCK : Mettre à jour tous les produits sans stock à 10
        countInStock: 10, 
        // Ajout des autres champs requis par le modèle :
        rating: 4.5,
        reviewCount: 50,
        weight: '500g',
        origin: 'Tunisie',
        benefits: ['Riche en vitamines', '100% Naturel', 'Sans conservateurs'],
        ingredients: ['Ingrédients non spécifiés (À mettre à jour)'],
        // originalPrice est optionnel, on ne l'ajoute pas ici
    };

    // 2. Mettre à jour tous les documents qui n'ont pas encore ces champs (ou dont le stock est à 0)
    // Nous utilisons $set pour ajouter les nouveaux champs et $inc pour augmenter le countInStock
    const result = await ProductModel.updateMany(
        // Critère : Trouver tous les documents qui n'ont pas de 'rating' ou dont le 'countInStock' est 0
        { $or: [{ rating: { $exists: false } }, { countInStock: 0 }] },
        { 
            $set: { ...defaultUpdateFields } 
        },
        // S'assurer que les validations sont contournées pour cet ajout massif (optionnel mais conseillé)
        { runValidators: false } 
    );

    // Alternative plus simple pour juste augmenter le stock des produits à 0:
    /*
    const result = await ProductModel.updateMany(
        { countInStock: 0 },
        { $set: { countInStock: 10 } }
    );
    */

    if (result.modifiedCount > 0) {
        res.status(200).json({ 
            message: `${result.modifiedCount} produits mis à jour avec le stock et les champs manquants.`,
            details: result
        });
    } else {
        res.status(200).json({ message: "Aucun produit trouvé à mettre à jour (ou stock déjà > 0)." });
    }
};