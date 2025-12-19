// src/server.ts (Mise à jour)

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
// 💡 Importation de la nouvelle route
import productRoutes from './routes/ProductRoutes'; 
import userRoutes from './routes/UserRoutes';
import orderRoutes from './routes/OrderRoutes';
import cartRoutes from './routes/CartRoutes';
dotenv.config(); 

const app = express();
const port = process.env.PORT || 5000;

/*const corsOptions = {
    origin: 'http://localhost:5173', // <--- Origine du frontend
    credentials: true, 
};corsOptions*/

app.use(cors());
app.use(express.json()); 

// Connexion à la base de données MongoDB (le code reste le même)
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('✅ MongoDB connecté avec succès.');
    } catch (error) {
        console.error('❌ Erreur de connexion à MongoDB:', error);
        process.exit(1); 
    }
};

connectDB(); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// --- DÉFINITION DES ROUTES ---
// 💡 Lier le chemin '/api/products' au routeur de produits.
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
// Route de test simple (laisser en bas)
app.get('/', (req: Request, res: Response) => {
    res.send('API est en cours d\'exécution...');
});

// Lancement du serveur (le code reste le même)
app.listen(port, () => {
    console.log(`🚀 Le serveur est démarré sur http://localhost:${port}`);
});