
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import productRoutes from './routes/ProductRoutes'; 
import userRoutes from './routes/UserRoutes';
import orderRoutes from './routes/OrderRoutes';
import cartRoutes from './routes/CartRoutes';
import blogRoutes from './routes/BlogRoutes';
import paymentRoutes from './routes/paymentRoutes';
dotenv.config(); 

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
    // Si on est en production sur Vercel, on autorise l'origine du site
    // Sinon en local, on garde localhost
    origin: process.env.NODE_ENV === 'production' 
        ? "https://rootproductsvente.vercel.app" 
        : "http://localhost:5173",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json()); 

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

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/payments', paymentRoutes);
app.get('/', (req: Request, res: Response) => {
    res.send('API est en cours d\'exécution...');
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`🚀 Serveur local : http://localhost:${port}`);
    });
}

export default app;