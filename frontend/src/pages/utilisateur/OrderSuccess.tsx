import React, { useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, Package, ArrowRight, Home } from 'lucide-react';
import { useVerifyPaymeePaymentQuery } from '../../state/apiService';
import { useCart } from '../../context/CartContext'; // Import manquant ajouté

const OrderSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  // On récupère les paramètres de l'URL
  const token = searchParams.get('token');
  const orderId = searchParams.get('orderId');

  // 1. Appel à l'API (Toujours en haut du composant)
  const { data, isLoading, isError } = useVerifyPaymeePaymentQuery(
    { token: token || '', orderId: orderId || '' },
    { skip: !token || !orderId }
  );

  // 2. Nettoyage du panier une fois le paiement confirmé
  useEffect(() => {
    if (data?.success) {
      clearCart();
    }
  }, [data, clearCart]);

  // 3. Gestion de l'affichage : Chargement
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Vérification de votre paiement...</h2>
        <p className="text-gray-500">Veuillez patienter quelques instants.</p>
      </div>
    );
  }

  // 4. Gestion de l'affichage : Erreur ou échec Paymee
  if (isError || (data && !data.success)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-xl text-center">
          <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="text-red-500" size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Paiement Échoué</h2>
          <p className="text-gray-500 mb-8">
            Nous n'avons pas pu valider votre transaction. Si vous avez été débité, contactez notre support.
          </p>
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            Réessayer le paiement
          </button>
        </div>
      </div>
    );
  }

  // 5. Affichage final : Succès
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden">
        {/* Header succès */}
        <div className="bg-green-600 p-12 text-center text-white">
          <div className="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-black uppercase italic tracking-widest mb-2">Merci pour votre achat !</h1>
          <p className="opacity-80 font-medium">Votre commande #{orderId?.slice(-6)} est confirmée.</p>
        </div>

        <div className="p-12 text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <Link 
              to="/profile/orders" 
              className="flex items-center justify-center gap-3 p-6 bg-gray-50 rounded-3xl hover:bg-gray-100 transition-all group"
            >
              <Package className="text-green-600" />
              <div className="text-left">
                <p className="text-[10px] font-black uppercase text-gray-400">Suivre ma</p>
                <p className="font-bold text-gray-900">Commande</p>
              </div>
              <ArrowRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </Link>

            <Link 
              to="/" 
              className="flex items-center justify-center gap-3 p-6 bg-gray-50 rounded-3xl hover:bg-gray-100 transition-all group"
            >
              <Home className="text-blue-600" />
              <div className="text-left">
                <p className="text-[10px] font-black uppercase text-gray-400">Retour à la</p>
                <p className="font-bold text-gray-900">Boutique</p>
              </div>
              <ArrowRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </Link>
          </div>

          <div className="border-t border-gray-100 pt-8">
            <p className="text-sm text-gray-400 font-medium italic">
              Un email de confirmation a été envoyé avec votre facture.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;