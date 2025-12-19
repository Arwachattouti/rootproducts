// src/models/UserModel.ts

import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface Mongoose mise à jour
export interface IUser extends Document {
    email: string;
    password: string; 
    firstName: string;
    lastName: string;
    phone?: string; 
    role: 'admin' | 'customer';
    isActive: boolean;
    lastLogin?: Date;
    address?: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
    };
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const AddressSchema: Schema = new Schema({
    street: { type: String },
    city: { type: String },
    postalCode: { type: String },
    country: { type: String }
}, { _id: false });

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, trim: true }, // 👈 AJOUTÉ ICI dans le Schéma
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    address: AddressSchema 
}, {
    timestamps: true 
});

// Pré-sauvegarde : Hacher le mot de passe
UserSchema.pre<IUser>('save', async function () {
    if (!this.isModified('password')) {
        return; 
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Méthode de comparaison pour la connexion
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;