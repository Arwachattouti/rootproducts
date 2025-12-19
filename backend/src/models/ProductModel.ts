import mongoose, { Document, Schema } from 'mongoose';

// --- 1. Définition de l'Interface TypeScript pour Mongoose ---

/**
 * Interface IProduct : Représente la structure d'un produit dans la base de données.
 * Elle inclut les champs nécessaires au composant ProductDetail.
 */
export interface IProduct extends Document {
    // Champs essentiels
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[]; 
    countInStock: number; // Utilisé pour déterminer si le produit est 'inStock'

    // Champs pour le marketing et le détail produit (ajoutés pour la dynamique front-end)
    originalPrice?: number; // Prix barré, si le produit est en promotion
    rating: number; // Note moyenne du produit (0 à 5)
    reviewCount: number; // Nombre d'avis (pour 'reviewCount' dans le front)
    
    // Champs spécifiques au produit (Mloukhia, etc.)
    weight: string; // Exemple: "500g"
    origin: string; // Exemple: "Tunisie"
    benefits: string[]; // Exemple: ["Riche en fer", "Énergie"]
    ingredients: string[]; // Exemple: ["Feuilles de Corète moulues"]
    
    // Champs optionnels de gestion
    brand?: string;
    user: mongoose.Schema.Types.ObjectId; // Référence à l'utilisateur/administrateur créateur
}

// --- 2. Définition du Schéma Mongoose ---

const ProductSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'Veuillez ajouter un nom de produit.'],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Veuillez ajouter une description du produit.'],
    },
    price: {
        type: Number,
        required: [true, 'Veuillez ajouter un prix.'],
        default: 0,
        min: 0
    },
    // NOUVEAU: Prix initial (pour l'affichage d'une promotion)
    originalPrice: {
        type: Number,
        min: 0,
        default: undefined // Sera stocké uniquement si défini
    },
    category: {
        type: String,
        required: [true, 'Veuillez spécifier la catégorie du produit.'],
    },
    images: {
        type: [String],
        required: [true, 'Veuillez fournir les URLs ou les chemins des images.'],
    },
    countInStock: {
        type: Number,
        required: [true, 'Veuillez spécifier la quantité en stock.'],
        default: 0,
        min: 0
    },
    
    // NOUVEAU: Données spécifiques au produit (Rating & Avis)
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
        required: true,
    },
    reviewCount: { // Correspond au 'reviewCount' du front-end
        type: Number,
        default: 0,
        min: 0,
        required: true,
    },
    
    // NOUVEAU: Détails pour la fiche produit
    weight: {
        type: String,
        required: [true, 'Veuillez ajouter le poids du produit.'],
    },
    origin: {
        type: String,
        required: [true, 'Veuillez ajouter l\'origine du produit.'],
    },
    benefits: {
        type: [String],
        required: [true, 'Veuillez lister les bienfaits du produit.'],
    },
    ingredients: {
        type: [String],
        required: [true, 'Veuillez lister les ingrédients du produit.'],
    },

    // Référence utilisateur
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: false, // Changer à 'true' si l'authentification admin est obligatoire
        ref: 'User'
    },
    // Champ de marque (conservé)
    brand: {
        type: String,
        required: false,
    }
}, {
    // Options de schéma
    timestamps: true // Ajoute createdAt et updatedAt
});


// --- 3. Création et Exportation du Modèle ---

/**
 * Modèle ProductModel
 */
const ProductModel = mongoose.model<IProduct>('Product', ProductSchema);

export default ProductModel;