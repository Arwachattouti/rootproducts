// src/utils/generateToken.ts

import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { IUser } from '../models/UserModel'; 

/**
 * Génère un JWT et le place dans un cookie HTTP-only.
 * @param res L'objet de réponse Express.
 * @param userId L'ID de l'utilisateur à encoder.
 */
const generateToken = (res: Response, userId: string) => {
    // 1. Création du Token
    const token = jwt.sign(
        { userId }, // Payload: l'ID utilisateur est suffisant pour l'identification
        process.env.JWT_SECRET as string, // La clé secrète du fichier .env
        { expiresIn: '30d' } // Le token expire après 30 jours
    );

    // 2. Configuration et envoi du Cookie sécurisé
    res.cookie('jwt', token, {
        httpOnly: true, // Le cookie n'est pas accessible par JavaScript côté client (Sécurité anti-XSS)
        secure: process.env.NODE_ENV !== 'development', // Utiliser HTTPS en production
        sameSite: 'strict', // Empêche l'attaque CSRF
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours en millisecondes
    });
};

export default generateToken;