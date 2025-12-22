import { Request, Response } from 'express';
import UserModel from '../models/UserModel'; 
import generateToken from '../utils/generateToken';
import { AuthenticatedRequest } from '../middleware/AuthMiddleware'; // Import de l'interface


const sanitizeUser = (user: any) => {
    const userObj = user.toObject ? user.toObject() : user;
    const { password, ...safeUser } = userObj;
    return safeUser;
};

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
export const logoutUser = (req: Request, res: Response) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Déconnecté avec succès.' });
};
export const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
    // OPTIMISATION : req.user est déjà rempli par le middleware protect !
    // Pas besoin de refaire un UserModel.findById(req.user._id)
    if (req.user) {
        res.status(200).json(sanitizeUser(req.user));
    } else {
        res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
};
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
export const getUsers = async (req: Request, res: Response) => {
    try {
        // 1. On cherche les utilisateurs avec le rôle 'customer'
        // 2. On retire le password ET la version (__v)
        // 3. On trie par date de création (descendant)
        const users = await UserModel.find({ role: 'customer' })
            .select('-password -__v') 
            .sort({ createdAt: -1 })
            .lean(); // .lean() améliore les performances en retournant du JSON pur (plus léger)

        // Si la liste est vide, on renvoie un tableau vide avec un code 200 (ce n'est pas une erreur)
        res.status(200).json(users || []);

    } catch (error: any) {
        // On log l'erreur précise côté serveur pour le débug
        console.error(`[getUsers Error]: ${error.message}`);
        
        res.status(500).json({ 
            message: 'Impossible de récupérer la liste des clients pour le moment.' 
        });
    }
};
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await UserModel.findById(req.params.id);

        if (user) {
            if (user.role === 'admin') {
                res.status(400).json({ message: 'Impossible de supprimer un compte administrateur.' });
                return;
            }
            await user.deleteOne();
            res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
        } else {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression.' });
    }
};
export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await UserModel.findById(req.params.id).select('-password');
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};
export const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await UserModel.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Mise à jour sélective
        // On utilise la destructuration pour plus de clarté
        const { firstName, lastName, email, role, isActive } = req.body;

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;
        if (role) user.role = role;
        
        // Pour les booléens, il faut toujours vérifier si la valeur est définie
        if (typeof isActive !== 'undefined') {
            user.isActive = isActive;
        }

        const updatedUser = await user.save();
        
        // Utilisation de 200 OK avec l'utilisateur nettoyé
        res.status(200).json(sanitizeUser(updatedUser));

    } catch (error) {
        console.error("Update Error:", error); // Log pour le debug serveur
        res.status(500).json({ message: 'Erreur lors de la mise à jour.' });
    }
};