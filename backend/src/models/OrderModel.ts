// src/models/OrderModel.ts

import mongoose, { Document, Schema } from 'mongoose';

// --- 1. Sous-Schéma : Article de Commande (CartItem) ---

// Ce sous-schéma définit la structure d'un article dans la commande.
// Il ne nécessite pas d'être un modèle séparé car il est toujours imbriqué dans l'Order.
const OrderItemSchema: Schema = new Schema({
    // Référence au produit lui-même
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product', // Fait référence au modèle Product
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    // On peut inclure l'image si on veut l'afficher dans l'historique de commande sans chercher le produit
    image: { type: String, required: true }, 
}, { _id: false }); // Pas besoin d'ID séparé pour chaque article

// --- 2. Schéma Principal : Commande (Order) ---

export interface IOrder extends Document {
    // Liaison à l'utilisateur qui a passé la commande
    user: mongoose.Schema.Types.ObjectId;
    
    // Articles de la commande (basé sur CartItem/OrderItemSchema)
    items: {
        product: mongoose.Schema.Types.ObjectId;
        name: string;
        quantity: number;
        price: number;
        image: string;
    }[];

    // Informations de livraison
    shippingAddress: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
    };

    total: number;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    isPaid: boolean; // Ajouté pour être cohérent avec le schéma
    paidAt?: Date;
    trackingNumber?: string;
    notes?: string;
    createdAt: Date; // <--- TRÈS IMPORTANT
    updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Fait référence au modèle User
    },
    items: [OrderItemSchema], // Tableau des articles de commande
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    total: {
        type: Number,
        required: true,
        default: 0.0,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    trackingNumber: { type: String },
    notes: { type: String },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    paymentResult: {
        id: String,
        status: String,
        token: String
    },
}, {
    timestamps: true
});


// --- 3. Création et Exportation du Modèle ---

const OrderModel = mongoose.model<IOrder>('Order', OrderSchema);

export default OrderModel;