// src/seeder.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ProductModel from './models/ProductModel';
const sampleProducts = [
    {
        name: 'Mloukhia premium en poudre',
        description: 'Poudre fine 100% naturelle, séchée au soleil selon les méthodes traditionnelles tunisiennes.',
        price: 24.90,
        originalPrice: 29.90,
        images: [
            './mou5iya.jpg', 
            'https://readdy.ai/api/search-image?query=luxury%20gift%20set%20of%20premium%20green%20mloukhia%20corette%20powder%20in%20three%20elegant%20glass%20jars%20with%20golden%20lids%2C%20arranged%20with%20traditional%20wooden%20spoons%20on%20beige%20marble%2C%20professional%20product%20photography%20showing%20vibrant%20green%20powder%20texture%20and%20high%20end%20packaging&width=400&height=300&seq=product003v3&orientation=squarish',
            'https://readdy.ai/api/search-image?query=organic%20green%20mloukhia%20corette%20powder%20displayed%20in%20elegant%20clear%20glass%20container%20on%20luxurious%20beige%20surface%2C%20showing%20fine%20bright%20green%20powder%20texture%20%2C%20professional%20product%20photography%20with%20soft%20lighting%20and%20minimalist%20high%20end%20presentation&width=400&height=300&seq=product002v3&orientation=squarish',
        ],
        category: 'poudre',
        inStock: true,
        weight: '250g',
        ingredients: ['Mloukhia séchée 100% pure'],
        benefits: ['Riche en fer', 'Source de vitamines A et C', 'Antioxydants naturels'],
        origin: 'Mahdia, Tunisie',
        rating: 4.8,
        reviewCount: 127
    },
    {
        name: 'Huile d’olive premium',
        description: 'Huile d’olive vierge extra de première qualité, pressée à froid pour conserver tous les arômes et nutriments. Idéale pour la cuisine et les salades, présentée dans un élégant flacon.',
        price: 49.90,
        originalPrice: 59.90,
        images: ['./CTLHU1.jpg'],
        category: 'huile',
        inStock: true,
        weight: '600ml',
        ingredients: ['Huile d’olive vierge extra 100% naturelle'],
        benefits: ['Goût fruité et intense', 'Richesse en antioxydants', 'Pressée à froid'],
        origin: 'Diverses régions de Tunisie',
        rating: 4.7,
        reviewCount: 45
    },
    {
        name: 'Blé bio en grains',
        description: 'Blé biologique de qualité supérieure, récolté de manière traditionnelle et soigneusement trié pour conserver toutes ses propriétés nutritives.',
        price: 19.90,
        images: ['./LEBLES1.jpg'],
        category: 'bio',
        inStock: true,
        weight: '1kg',
        ingredients: ['Blé 100% biologique'],
        benefits: ['Agriculture biologique', 'Sans pesticides', 'Riche en fibres et nutriments'],
        origin: 'Monastir, Tunisie',
        rating: 4.9,
        reviewCount: 89
    },
    {
        name: 'Hrissa artisanale tunisienne',
        description: 'Pâte de piments rouges préparée selon la recette tunisienne traditionnelle, relevée et savoureuse.',
        price: 22.90,
        images: ['./hrissa2.png', './hrissa.jpg'],
        category: 'épices',
        inStock: true,
        weight: '220g',
        ingredients: ['Piments rouges', 'Ail', 'Sel', 'Coriandre', 'Carvi', 'Huile d’olive'],
        benefits: ['Goût authentique tunisien', 'Préparée à la main', 'Parfaite pour relever vos plats'],
        origin: 'Nabeul, Tunisie',
        rating: 4.8,
        reviewCount: 125
    },
    {
        name: 'Mloukhia fraîche congelée',
        description: 'Feuilles fraîches immédiatement congelées pour préserver tous les nutriments.',
        price: 12.90,
        images: [
            'https://images.pexels.com/photos/4198024/pexels-photo-4198024.jpeg?auto=compress&cs=tinysrgb&w=600'
        ],
        category: 'fraiche',
        inStock: true,
        weight: '500g',
        ingredients: ['Mloukhia fraîche congelée'],
        benefits: ['Fraîcheur préservée', 'Riche en vitamines', 'Prête à cuisiner'],
        origin: 'Bizerte, Tunisie',
        rating: 4.5,
        reviewCount: 91
    },
    {
        name: 'Kit cuisine mloukhia',
        description: 'Kit complet avec recettes et tous les ingrédients pour préparer un plat authentique.',
        price: 34.90,
        images: [
            'https://images.pexels.com/photos/7937447/pexels-photo-7937447.jpeg?auto=compress&cs=tinysrgb&w=600'
        ],
        category: 'kit',
        inStock: false, // Attention: Produit non en stock
        weight: '400g',
        ingredients: ['Mloukhia Premium', 'Épices', 'Huile d\'olive', 'Livret de recettes'],
        benefits: ['Kit complet', 'Recettes incluses', 'Parfait pour débuter'],
        origin: 'Sélection tunisienne',
        rating: 4.4,
        reviewCount: 38
    }
];

// --- LOGIQUE D'IMPORTATION ---
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('✅ MongoDB connecté pour le seeder.');
    } catch (error) {
        console.error('❌ Erreur de connexion DB:', error);
        process.exit(1);
    }
};

const importData = async () => {
    await connectDB();
    try {
        // Supprimer toutes les données existantes avant l'importation
        await ProductModel.deleteMany();
        
        // Insérer les nouvelles données
        await ProductModel.insertMany(sampleProducts);
        
        console.log('🎉 Données importées avec succès !');
        process.exit();
    } catch (error) {
        console.error('❌ Erreur lors de l\'importation des données:', error);
        process.exit(1);
    }
};

importData();