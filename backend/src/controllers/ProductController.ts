import { Request, Response } from 'express';
import ProductModel from '../models/ProductModel';
export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await ProductModel.find({});
        res.status(200).json(products);

    } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        res.status(500).json({ message: 'Erreur Serveur Interne' });
    }
};
export const getProductById = async (req: Request, res: Response) => {
   
    const productId = req.params.id;
    const product = await ProductModel.findById(productId);
    if (product) {
        res.json(product); 
    } else {
        res.status(404);
        throw new Error('Produit non trouvé');
    }
};
export const updateExistingProducts =async (req: Request, res: Response) => {
    const defaultUpdateFields = {
        countInStock: 10, 
        rating: 4.5,
        reviewCount: 50,
        weight: '500g',
        origin: 'Tunisie',
        benefits: ['Riche en vitamines', '100% Naturel', 'Sans conservateurs'],
        ingredients: ['Ingrédients non spécifiés (À mettre à jour)'],
    };
    const result = await ProductModel.updateMany(
        { $or: [{ rating: { $exists: false } }, { countInStock: 0 }] },
        { 
            $set: { ...defaultUpdateFields } 
        },
        { runValidators: false } 
    );

    if (result.modifiedCount > 0) {
        res.status(200).json({ 
            message: `${result.modifiedCount} produits mis à jour avec le stock et les champs manquants.`,
            details: result
        });
    } else {
        res.status(200).json({ message: "Aucun produit trouvé à mettre à jour (ou stock déjà > 0)." });
    }
};
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { 
            name, price, description, images, category, 
            countInStock, weight, ingredients, benefits, origin ,location
        } = req.body;

        const product = new ProductModel({
            name,
            price,
            description,
            images,
            category,
            countInStock: countInStock || 0,
            weight: weight || 'N/A',
            ingredients: ingredients || [],
            benefits: benefits || [],
            origin: origin || 'Tunisie',
            location: location || { latitude: 34.5, longitude: 9.5 },
            rating: 0,
            reviewCount: 0
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: 'Données de produit invalides' });
    }
};
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (product) {
      product.name = req.body.name || product.name;
      product.price = req.body.price || product.price;
      product.originalPrice = req.body.originalPrice !== undefined ? req.body.originalPrice : product.originalPrice;
      product.description = req.body.description || product.description;
      product.images = req.body.images || product.images;
      product.category = req.body.category || product.category;
      product.countInStock = req.body.countInStock ?? product.countInStock;
      product.weight = req.body.weight || product.weight;
      product.ingredients = req.body.ingredients || product.ingredients;
      product.benefits = req.body.benefits || product.benefits;
      product.origin = req.body.origin || product.origin;

      // 🛑 NOUVEAU BLOC DE CORRECTION POUR LA LOCATION 🛑
      // On récupère la valeur depuis la requête, SINON depuis le produit existant, SINON on met la valeur par défaut.
      const lat = req.body?.location?.latitude ?? product.location?.latitude ?? 34.5;
      const lng = req.body?.location?.longitude ?? product.location?.longitude ?? 9.5;

      // On écrase l'objet location pour être sûr qu'il est 100% valide pour Mongoose
      product.location = {
        latitude: lat,
        longitude: lng
      };
      // --------------------------------------------------

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Produit non trouvé' });
    }
  } catch (error) {
  console.error('Erreur maj produit:', error);

  res.status(400).json({ 
    message: error instanceof Error 
      ? error.message 
      : 'Erreur lors de la mise à jour',
    details: error
  });
}
};
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = await ProductModel.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Produit supprimé avec succès' });
        } else {
            res.status(404).json({ message: 'Produit non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
};