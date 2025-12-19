// src/controllers/UserController.ts

import { Request, Response } from 'express';
import UserModel from '../models/UserModel'; 
import generateToken from '../utils/generateToken';
import { AuthenticatedRequest } from '../middleware/AuthMiddleware'; // Import de l'interface

/**
 * Utility pour masquer les données sensibles avant l'envoi
 * Note : .toObject() est nécessaire pour les documents Mongoose
 */
const sanitizeUser = (user: any) => {
    const userObj = user.toObject ? user.toObject() : user;
    const { password, ...safeUser } = userObj;
    return safeUser;
};

/**
 * @desc    Enregistrement d'un nouvel utilisateur
 * @route   POST /api/users/register
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, email, password } = req.body;

    const userExists = await UserModel.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà.' });
        return;
    }

    try {
        const user = await UserModel.create({
            firstName,
            lastName,
            email,
            password,
        });

        generateToken(res, user._id.toString());
        res.status(201).json(sanitizeUser(user));
    } catch (error) {
        console.error("Erreur d'inscription:", error);
        res.status(500).json({ message: 'Erreur serveur lors de l\'enregistrement.' });
    }
};

/**
 * @desc    Authentification de l'utilisateur
 * @route   POST /api/users/login
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id.toString());
        res.status(200).json(sanitizeUser(user));
    } else {
        res.status(401).json({ message: 'Email ou mot de passe invalide.' });
    }
};

/**
 * @desc    Déconnexion de l'utilisateur
 * @route   POST /api/users/logout
 */
export const logoutUser = (req: Request, res: Response) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Déconnecté avec succès.' });
};

/**
 * @desc    Obtenir le profil utilisateur
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
    // OPTIMISATION : req.user est déjà rempli par le middleware protect !
    // Pas besoin de refaire un UserModel.findById(req.user._id)
    if (req.user) {
        res.status(200).json(sanitizeUser(req.user));
    } else {
        res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
};

/**
 * @desc    Mettre à jour le profil
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = async (req: AuthenticatedRequest, res: Response) => {
    // req.user est une instance Mongoose grâce au middleware protect
    const user = req.user;

    if (user) {
        // Mise à jour des champs simples
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        
        // Si l'email change, il faudrait idéalement vérifier l'unicité
        user.email = req.body.email || user.email;
        
        if (req.body.phone !== undefined) {
            user.phone = req.body.phone;
        }

        // Mise à jour de l'objet adresse (fusionne avec l'existant)
        if (req.body.address) {
            user.address = {
                street: req.body.address.street || user.address?.street || '',
                city: req.body.address.city || user.address?.city || '',
                postalCode: req.body.address.postalCode || user.address?.postalCode || '',
                country: req.body.address.country || user.address?.country || 'Tunisie',
            };
        }

        // Mise à jour du mot de passe (le middleware pre-save du modèle gérera le hashage)
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        res.status(200).json(sanitizeUser(updatedUser));
    } else {
        res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
};