
import mongoose, { Document, Schema } from 'mongoose';
const OrderItemSchema: Schema = new Schema({

    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }, 
}, { _id: false }); 

export interface IOrder extends Document {
    user: mongoose.Schema.Types.ObjectId;
    
    items: {
        product: mongoose.Schema.Types.ObjectId;
        name: string;
        quantity: number;
        price: number;
        image: string;
    }[];

    shippingAddress: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
    };

    total: number;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    isPaid: boolean;
    paidAt?: Date;
    trackingNumber?: string;
    notes?: string;
    createdAt: Date; 
    updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', 
    },
    items: [OrderItemSchema],
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


const OrderModel = mongoose.model<IOrder>('Order', OrderSchema);

export default OrderModel;