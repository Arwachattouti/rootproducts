import React, { useState, useEffect } from "react";
import {
    XCircle,
    AlertTriangle,
    MessageCircle,
    RotateCw,
    Home,
    HelpCircle,
    CreditCard,
    DollarSign,
    Building,
    Lightbulb,
    Calendar,
    Mail,
    Phone,
    Loader
} from "lucide-react";
import { Button } from "../ui/Button";
import { useNavigate, useSearchParams } from "react-router-dom";

const ErrorPayment = ({ onRetry }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorDetails, setErrorDetails] = useState(null);

    useEffect(() => {
        const loadPaymentData = () => {
            try {
                // Récupérer les données sauvegardées avant la redirection Paymee
                const savedData = sessionStorage.getItem('paymentSessionData');
                const paymeeReturnData = localStorage.getItem('paymeeReturnData');

                // Récupérer les détails d'erreur depuis les paramètres URL
                const errorCode = searchParams.get('error_code');
                const errorMessage = searchParams.get('error_message');
                const transactionId = searchParams.get('transaction');

                if (savedData) {
                    const data = JSON.parse(savedData);
                    setPaymentData(data);
                    
                    // Nettoyer le stockage après utilisation
                    sessionStorage.removeItem('paymentSessionData');
                    if (paymeeReturnData) {
                        localStorage.removeItem('paymeeReturnData');
                    }
                }

                // Définir les détails d'erreur
                setErrorDetails({
                    code: errorCode || 'PAYMENT_DECLINED',
                    message: errorMessage || 'Votre paiement a été refusé par votre banque.',
                    transactionId: transactionId,
                    timestamp: new Date().toLocaleString('fr-FR')
                });

            } catch (error) {
                console.error('Erreur chargement données paiement:', error);
                setErrorDetails({
                    code: 'UNKNOWN_ERROR',
                    message: 'Une erreur inattendue s\'est produite lors du traitement de votre paiement.',
                    timestamp: new Date().toLocaleString('fr-FR')
                });
            } finally {
                setLoading(false);
            }
        };

        loadPaymentData();
    }, [searchParams]);

    const handleRetry = () => {
        if (onRetry) {
            onRetry();
        } else if (paymentData) {
            // Re-sauvegarder les données pour la nouvelle tentative
            sessionStorage.setItem('paymentSessionData', JSON.stringify(paymentData));
            navigate('/payment');
        } else {
            navigate('/pricing');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-gray-50 flex justify-center items-center py-12 px-4">
                <div className="text-center">
                    <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Chargement des détails de l'erreur...</p>
                </div>
            </div>
        );
    }

    const { subscription, promo, customer } = paymentData || {};

    return (
        <div className="min-h-screen w-full bg-gray-50 flex justify-center py-12 px-4">
            <div className="w-full max-w-4xl space-y-6">
                <div className="flex flex-col items-center justify-center">
                    <XCircle className="text-red-500 w-14 h-14 mb-3" />
                    <h1 className="text-2xl font-semibold text-red-600">
                        Échec du paiement
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Malheureusement, votre paiement n'a pas pu être traité.
                    </p>

                    {/* Détails de la commande échouée */}
                    {paymentData && (
                        <div className="bg-white rounded-xl border border-gray-200 p-4 mt-4 w-full max-w-2xl">
                            <h3 className="font-semibold text-gray-900 mb-2">Détails de la commande :</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="text-gray-600">Abonnement :</span>
                                    <span className="font-medium ml-2">{subscription.packName}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Montant :</span>
                                    <span className="font-medium ml-2">
                                        {promo ? promo.finalPrice.toFixed(2) : parseFloat(subscription.price).toFixed(2)} TND
                                    </span>
                                </div>
                                {promo && (
                                    <div className="sm:col-span-2">
                                        <span className="text-gray-600">Code promo :</span>
                                        <span className="font-medium text-green-600 ml-2">
                                            {promo.code} (-{promo.discount}%)
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Bloc d'avertissement */}
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mt-6 w-full max-w-2xl text-left mx-auto">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            <p className="font-semibold">Paiement refusé</p>
                        </div>
                        <p className="text-sm">
                            {errorDetails?.message}
                            <br />
                            <span className="font-semibold">Code d'erreur : {errorDetails?.code}</span>
                            {errorDetails?.transactionId && (
                                <>
                                    <br />
                                    <span className="font-semibold">Transaction ID : {errorDetails.transactionId}</span>
                                </>
                            )}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
                        <Button
                            onClick={handleRetry}
                            className="flex flex-col items-start justify-center bg-[#0a0a0f] text-white px-8 py-2 rounded-lg hover:bg-gray-900 transition-all w-full sm:w-[320px] h-[60px]"
                        >
                            <div className="flex items-center font-semibold text-[15px]">
                                <RotateCw className="w-4 h-4 mr-2" />
                                Réessayer le paiement
                            </div>
                            <p className="text-xs font-medium text-gray-400 mt-1">
                                Avec une autre carte ou méthode
                            </p>
                        </Button>

                        <Button
                            onClick={() => navigate("/")}
                            variant="outline"
                            className="flex flex-col items-start justify-center bg-white border border-gray-300 text-gray-900 px-8 py-2 rounded-lg hover:bg-gray-100 transition-all w-full sm:w-[320px] h-[60px]"
                        >
                            <div className="flex items-center font-semibold text-[15px]">
                                <Home className="w-4 h-4 mr-2" />
                                Retour à l'accueil
                            </div>
                            <p className="text-xs font-medium text-gray-500 mt-1">Revenir plus tard</p>
                        </Button>
                    </div>
                </div>

                {/* Question */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <HelpCircle className="text-gray-600 w-5 h-5" />
                        Que faire maintenant ?
                    </h2>
                    <p className="text-gray-600 mb-3">
                        Suggestions pour résoudre ce problème :
                    </p>

                    <div className="space-y-3 text-gray-700">
                        <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                                1
                            </div>
                            <p className="text-sm sm:text-base">
                                Contactez votre banque pour autoriser la transaction.
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                                2
                            </div>
                            <p className="text-sm sm:text-base">
                                Vérifiez que votre carte est activée pour les paiements en ligne.
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                                3
                            </div>
                            <p className="text-sm sm:text-base">
                                Essayez avec une autre méthode de paiement.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Problemes courants */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                        Problèmes courants
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Raisons fréquentes d'échec de paiement :
                    </p>
                    <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition">
                        <Lightbulb className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                        <div>
                            <p className="font-medium text-gray-900">Carte déclinée</p>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Votre banque a refusé la transaction.{" "}
                                <br />
                                <a
                                    href="#"
                                    className="text-blue-600 hover:underline font-medium"
                                >
                                    Contactez votre banque ou utilisez une autre carte.
                                </a>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition">
                        <Lightbulb className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                        <div>
                            <p className="font-medium text-gray-900">Limite de dépenses atteinte</p>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Vous avez atteint votre limite de dépenses quotidienne.{" "}
                                <br />
                                <a
                                    href="#"
                                    className="text-blue-600 hover:underline font-medium"
                                >
                                    Réessayez demain ou augmentez votre limite.
                                </a>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition">
                        <Lightbulb className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                        <div>
                            <p className="font-medium text-gray-900">Authentification requise</p>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                3D Secure ou autre vérification nécessaire.{" "}
                                <br />
                                <a
                                    href="#"
                                    className="text-blue-600 hover:underline font-medium"
                                >
                                    Vérifiez vos SMS ou emails de votre banque.
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Infos sur paiement */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Informations sur votre tentative de paiement
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-500">Date et heure</p>
                                <p className="font-medium">{errorDetails?.timestamp}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-500">Méthode de paiement</p>
                                <p className="font-medium">Paymee - Paiement en ligne</p>
                            </div>
                        </div>

                        {errorDetails?.transactionId && (
                            <div className="sm:col-span-2 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-500">ID de transaction</p>
                                    <p className="font-medium font-mono">{errorDetails.transactionId}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Aide */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <HelpCircle className="text-blue-600 w-5 h-5" />
                        <h2 className="text-lg font-semibold text-gray-900">Besoin d'aide ?</h2>
                    </div>

                    <p className="text-blue-700 font-medium mb-4">
                        Notre équipe de support est là pour vous aider
                    </p>

                    <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                        Si vous continuez à rencontrer des problèmes, n'hésitez pas à nous contacter.
                        <br />
                        Nous sommes disponibles 24/7 pour vous assister.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <Button onClick={() => navigate("/#contact")}
                            className="bg-blue-600 text-white hover:bg-blue-700 flex-1 flex items-center justify-center gap-2 h-[42px] text-sm font-medium">
                            <Mail className="w-4 h-4" />
                            Contacter le support
                        </Button>

                        <Button
                            variant="outline"
                            className="flex-1 flex items-center justify-center gap-2 border-blue-300 text-blue-600 hover:bg-blue-100 h-[42px] text-sm font-medium"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Chat en direct
                        </Button>
                    </div>

                    <hr className="border-t border-blue-100 mb-4" />

                    <div className="flex flex-col sm:flex-row justify-center gap-10 text-gray-700 text-sm mt-4">
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="font-semibold text-gray-800">Email</p>
                                <a
                                    href="mailto:support@techhub.com"
                                    className="text-blue-600 hover:underline"
                                >
                                    contact@techhub.com
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="font-semibold text-gray-800">Téléphone</p>
                                <a
                                    href="tel:+21674123456"
                                    className="text-blue-600 hover:underline"
                                >
                                    +216 93 358 026
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Autres moyens */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                        Autres moyens de paiement
                    </h2>
                    <p className="text-gray-600 text-sm mb-6">
                        Essayez une méthode de paiement alternative :
                    </p>

                    <div className="flex justify-center">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4 text-center">
                            <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-gray-300 transition-all w-44">
                                <CreditCard className="w-6 h-6 mx-auto text-gray-700 mb-2" />
                                <p className="text-sm font-medium text-gray-800">Carte bancaire</p>
                            </div>

                            <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-gray-300 transition-all w-44">
                                <DollarSign className="w-6 h-6 mx-auto text-gray-700 mb-2" />
                                <p className="text-sm font-medium text-gray-800">PayPal</p>
                            </div>

                            <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-gray-300 transition-all w-44">
                                <Building className="w-6 h-6 mx-auto text-gray-700 mb-2" />
                                <p className="text-sm font-medium text-gray-800">Virement bancaire</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorPayment;