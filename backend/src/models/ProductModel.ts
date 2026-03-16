import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  countInStock: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  weight: string;
  origin: string;
  location: {
    latitude: number;
    longitude: number;
  };
  benefits: string[];
  ingredients: string[];
  brand?: string;
  user: mongoose.Schema.Types.ObjectId;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Veuillez ajouter un nom de produit.'],
      trim: true,
      unique: true
    },
    description: {
      type: String,
      required: [true, 'Veuillez ajouter une description du produit.']
    },
    price: {
      type: Number,
      required: [true, 'Veuillez ajouter un prix.'],
      default: 0,
      min: 0
    },
    originalPrice: {
      type: Number,
      min: 0,
      default: undefined
    },
    category: {
      type: String,
      required: [true, 'Veuillez spécifier la catégorie du produit.']
    },
    images: {
      type: [String],
      required: [true, 'Veuillez fournir les URLs ou les chemins des images.']
    },
    countInStock: {
      type: Number,
      required: [true, 'Veuillez spécifier la quantité en stock.'],
      default: 0,
      min: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      required: true
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
      required: true
    },
    weight: {
      type: String,
      required: [true, 'Veuillez ajouter le poids du produit.']
    },
    origin: {
      type: String,
      required: [true, "Veuillez ajouter l'origine du produit."]
    },
    location: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    },
    benefits: {
      type: [String],
      required: [true, 'Veuillez lister les bienfaits du produit.']
    },
    ingredients: {
      type: [String],
      required: [true, 'Veuillez lister les ingrédients du produit.']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'User'
    },
    brand: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
);

const ProductModel = mongoose.model<IProduct>('Product', ProductSchema);

export default ProductModel;