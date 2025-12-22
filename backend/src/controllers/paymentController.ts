import { Response } from 'express';
import axios from 'axios';
import { AuthenticatedRequest } from '../middleware/AuthMiddleware';
import OrderModel from '../models/OrderModel';

const PAYMEE_API_V1 = 'https://sandbox.paymee.tn/api/v1/payments/create';
const PAYMEE_CHECK_V1 = 'https://sandbox.paymee.tn/api/v1/payments';
const PAYMEE_TOKEN = '46470262c1efba146dac8b55826f3255bb06d80b';
const VENDOR_ID = 4193;

/**
 * Créer un paiement Paymee (Step 1)
 */
export const createPaymeePayment = async (req: AuthenticatedRequest, res: Response) => {
    const { amount, first_name, last_name, email, phone, orderId } = req.body;

    try {
        const payload = {
            vendor: 4193, // Ton VENDOR_ID en nombre
            amount: Number(amount), // Doit être un nombre
            note: `Commande #${orderId}`,
            first_name: first_name || "Client",
            last_name: last_name || "Client",
            email: email || "test@paymee.tn",
            phone: phone || "22111333", // Doit avoir 8 chiffres
            return_url: `http://localhost:5173/order-success?orderId=${orderId}`,
            cancel_url: `http://localhost:5173/checkout`
        };

        const response = await axios.post('https://sandbox.paymee.tn/api/v1/payments/create', payload, {
            headers: {
                'Authorization': `Token 46470262c1efba146dac8b55826f3255bb06d80b`,
                'Content-Type': 'application/json'
            }
        });

        // TRÈS IMPORTANT : Vérifie la structure de réponse de Paymee
        if (response.data && response.data.status === true) {
            return res.status(200).json(response.data); // Renvoie tout l'objet {status, data: {token, payment_url}}
        } else {
            console.error("Paymee a dit non :", response.data);
            return res.status(400).json({ status: false, message: response.data.message });
        }
    } catch (error: any) {
        console.error("Erreur API Paymee détaillée :", error.response?.data || error.message);
        return res.status(500).json({ status: false, message: "Erreur technique" });
    }
};

/**
 * Vérifier le statut du paiement (Step 3)
 */
export const verifyPaymeePayment = async (req: AuthenticatedRequest, res: Response) => {
    const { token } = req.params; // Token reçu dans l'URL de retour
    const { orderId } = req.query; // ID de commande passé en query string

    try {
        // URL de vérification format : .../api/v1/payments/{TOKEN}/check
        const verifyUrl = `${PAYMEE_CHECK_V1}/${token}/check`;
        
        const response = await axios.get(verifyUrl, {
            headers: {
                'Authorization': `Token ${PAYMEE_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        const paymentData = response.data.data;

        // Vérification du flag payment_status (équivalent PHP : $query['data']['payment_status'])
        if (response.data.status === true && paymentData.payment_status === true) {
            
            // Mise à jour de la commande dans la base de données
            await OrderModel.findByIdAndUpdate(orderId, {
                isPaid: true,
                paidAt: new Date(),
                status: 'confirmed',
                paymentResult: {
                    id: paymentData.payment_id,
                    status: 'SUCCESS',
                    token: token
                }
            });

            return res.status(200).json({ 
                success: true, 
                message: "Paiement validé avec succès" 
            });
        } else {
            return res.status(400).json({ 
                success: false, 
                message: "Le paiement n'est pas encore validé ou a échoué" 
            });
        }

    } catch (error: any) {
        console.error('Erreur Vérification Paymee:', error.response?.data || error.message);
        return res.status(500).json({ 
            message: "Erreur technique lors de la vérification du paiement" 
        });
    }
};