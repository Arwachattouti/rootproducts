// src/models/CartModel.ts
import mongoose, { Document, Schema } from 'mongoose';

// Interface pour un article du panier (plus facile à manipuler)
interface ICartItem {
    product: mongoose.Types.ObjectId | any; // 'any' permet de supporter le produit après .populate()
    quantity: number;
}

export interface ICart extends Document {
    user: mongoose.Types.ObjectId;
    items: ICartItem[];
}

const CartSchema: Schema = new Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        unique: true 
    },
    items: [
        {
            product: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Product', 
                required: true 
            },
            quantity: { 
                type: Number, 
                required: true, 
                min: 1, 
                default: 1 
            }
        }
    ]
}, { timestamps: true });

export default mongoose.model<ICart>('Cart', CartSchema);