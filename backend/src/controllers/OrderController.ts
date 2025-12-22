import { Response } from 'express';
import OrderModel from '../models/OrderModel';
import ProductModel from '../models/ProductModel';
import UserModel from '../models/UserModel';
import { AuthenticatedRequest } from '../middleware/AuthMiddleware'; // Pour accéder à req.user
import mongoose from 'mongoose';

export const getAllOrders = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const orders = await OrderModel.find({})
            .populate('user', 'id firstName lastName email')
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des commandes.' });
    }
};

export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
    // Vérification de l'existence de l'utilisateur
    if (!req.user) {
        res.status(401).json({ message: 'Non authentifié.' });
        return;
    }

    const userId = req.user._id;
    const { items, shippingAddress, total } = req.body;

    if (!items || items.length === 0) {
        res.status(400).json({ message: 'Aucun article dans la commande.' });
        return;
    }

    try {
        const order = new OrderModel({
            user: userId,
            items: items.map((item: any) => ({
                product: new mongoose.Types.ObjectId(item.product),
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                image: item.image,
            })),
            // CORRECTION ICI : On mappe "address" du front vers "street" du back
            shippingAddress: {
                street: shippingAddress.address, // mapping address -> street
                city: shippingAddress.city,
                postalCode: shippingAddress.postalCode,
                country: shippingAddress.country,
            },
            total: total,
            status: 'pending',
            // Note: Si votre schéma n'a pas isPaid, il sera ignoré ou causera une erreur.
            // Assurez-vous qu'il est bien dans OrderModel.ts si vous l'utilisez.
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);

    } catch (error: any) {
        console.error('Erreur lors de la création de la commande:', error);
        // On renvoie l'erreur précise pour vous aider à débugger dans la console network
        res.status(500).json({
            message: 'Échec de la création de la commande.',
            error: error.message
        });
    }
};

export const getUserOrders = async (req: AuthenticatedRequest, res: Response) => {
    try {
        // 💡 CORRECTION : Convertir req.user!._id en string via .toString()
        const userId = req.user!._id.toString();

        const orders = await OrderModel.find({ users: userId }) // Utilisation de l'ID converti
            .populate('items.product', 'name price image')
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error('Erreur lors de la récupération des commandes utilisateur:', error);
        res.status(500).json({ message: 'Échec de la récupération des commandes.' });
    }
};

export const getOrderById = async (req: AuthenticatedRequest, res: Response) => {
    const orderId = req.params.id;

    try {
        const order = await OrderModel.findById(orderId)
            .populate('user', 'firstName lastName email') // Récupère le nom/email du client
            .populate('items.product', 'name price image');

        if (!order) {
            res.status(404).json({ message: 'Commande non trouvée.' });
            return;
        }

        // Vérification de sécurité : S'assurer que l'utilisateur est bien le propriétaire de la commande (ou un admin)
        if (order.user.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
            res.status(403).json({ message: 'Non autorisé à accéder à cette commande.' });
            return;
        }

        res.status(200).json(order);

    } catch (error) {
        console.error('Erreur lors de la récupération de la commande:', error);
        res.status(500).json({ message: 'Échec de la récupération de la commande.' });
    }
};

export const getAdminStats = async (req: any, res: Response) => {
    try {
        const { range } = req.query;

        // 1. Définition de la période
        let startDate = new Date();
        if (range === '7d') startDate.setDate(startDate.getDate() - 7);
        else if (range === '90d') startDate.setDate(startDate.getDate() - 90);
        else if (range === '1y') startDate.setFullYear(startDate.getFullYear() - 1);
        else startDate.setDate(startDate.getDate() - 30); 

        const dateFilter = { createdAt: { $gte: startDate } };

        // 2. Exécution des requêtes en parallèle
        const [
            revenueStats,
            totalOrders,
            totalProducts,
            totalCustomers,
            newUsersCount,
            recentOrdersRaw, // Données brutes avec populate
            topProductsData
        ] = await Promise.all([
            // Chiffre d'affaires
            OrderModel.aggregate([
                { $match: { isPaid: true } },
                { $group: { _id: null, totalSales: { $sum: "$total" } } }
            ]),
            OrderModel.countDocuments(),
            ProductModel.countDocuments(),
            UserModel.countDocuments({ role: 'customer' }),
            // Nouveaux inscrits
            UserModel.countDocuments({
                role: 'customer',
                createdAt: { $gte: startDate }
            }),
            // 5 dernières commandes avec firstName et lastName
            OrderModel.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('user', 'firstName lastName'), 
            // Top Produits
            OrderModel.aggregate([
                { $match: dateFilter },
                { $unwind: "$items" },
                {
                    $group: {
                        _id: "$items.product",
                        name: { $first: "$items.name" },
                        sales: { $sum: "$items.quantity" }
                    }
                },
                { $sort: { sales: -1 } },
                { $limit: 3 }
            ])
        ]);

        // 3. Formatage des commandes (Fusion Prénom + Nom)
        const formattedRecentOrders = recentOrdersRaw.map(order => {
            const userData = order.user as any;
            const fullName = userData
                ? `${userData.firstName} ${userData.lastName}`.trim()
                : "Client Supprimé";

            return {
                id: order._id,
                user: {
                    name: fullName, 
                },
                createdAt: order.createdAt,
                total: order.total,
                status: order.status
            };
        });

        // 4. Formatage des produits
        const formattedTopProducts = topProductsData.map(p => ({
            product: {
                _id: p._id,
                name: p.name || "Produit inconnu"
            },
            sales: p.sales || 0
        }));

        // 5. Envoi de la réponse
        return res.status(200).json({
            totalRevenue: revenueStats[0]?.totalSales || 0,
            totalOrders,
            totalCustomers,
            totalProducts,
            newUsersCount,
            recentOrders: formattedRecentOrders,
            topProducts: formattedTopProducts
        });

    } catch (error: any) {
        console.error("Erreur Stats Admin:", error);
        return res.status(500).json({
            message: 'Erreur lors du calcul des statistiques.',
            error: error.message
        });
    }
};
export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { status } = req.body; // 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
        const order = await OrderModel.findById(req.params.id);

        if (order) {
            order.status = status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Commande non trouvée.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Échec de la mise à jour du statut.' });
    }
};
export const deleteOrder = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const order = await OrderModel.findById(req.params.id);

        if (order) {
            // Optionnel : Si la commande est supprimée alors qu'elle n'était pas livrée ou annulée,
            // vous pourriez vouloir recréditer le stock ici.

            await order.deleteOne();
            res.json({ message: 'Commande supprimée avec succès.' });
        } else {
            res.status(404).json({ message: 'Commande non trouvée.' });
        }
    } catch (error) {
        console.error('Erreur lors de la suppression de la commande:', error);
        res.status(500).json({ message: 'Échec de la suppression de la commande.' });
    }
};