// src/middleware/AuthMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel, { IUser } from '../models/UserModel';

// Étend l'interface Request d'Express pour y ajouter l'utilisateur
interface AuthenticatedRequest extends Request {
    user?: IUser; // Ajout du champ user pour transporter l'utilisateur
}

/**
 * @desc    Middleware pour protéger les routes contre les accès non-authentifiés
 */
const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token;

    // 1. Lire le JWT depuis le cookie
    token = req.cookies.jwt; 

    if (token) {
        try {
            // 2. Vérifier le Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

            // 3. Trouver l'utilisateur (exclure le mot de passe)
            const user = await UserModel.findById(decoded.userId).select('-password');

            if (user) {
                // 4. Attacher l'utilisateur à la requête pour un usage ultérieur (dans les contrôleurs)
                req.user = user;
                next(); // Passer au contrôleur suivant
            } else {
                res.status(401).json({ message: 'Utilisateur non trouvé.' });
            }

        } catch (error) {
            // Token invalide ou expiré
            console.error(error);
            res.status(401).json({ message: 'Non autorisé, token invalide.' });
        }
    } else {
        // Pas de token trouvé dans les cookies
        res.status(401).json({ message: 'Non autorisé, pas de token.' });
    }
};

export { protect, AuthenticatedRequest };