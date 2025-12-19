import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Loader2 } from 'lucide-react';
// On utilise les hooks de l'API plutôt que le context local pour la persistance
import { 
  useGetCartQuery, 
  useUpdateCartMutation, 
  useRemoveFromCartMutation 
} from '../../state/apiService';

const Cart: React.FC = () => {
  const navigate = useNavigate();

  // 1. Récupération des données depuis le Backend
  const { data: cart, isLoading, isError } = useGetCartQuery();
  
  // 2. Actions de modification
  const [updateCart, { isLoading: isUpdating }] = useUpdateCartMutation();
  const [removeItem] = useRemoveFromCartMutation();

  // 3. Calcul du total mémorisé (optimisation de performance)
  const totalAmount = useMemo(() => {
    return cart?.items.reduce((acc: number, item: any) => {
      return acc + (item.product.price * item.quantity);
    }, 0) || 0;
  }, [cart]);

  const handleQuantityChange = async (productId: string, currentQty: number, delta: number) => {
    const newQuantity = currentQty + delta;
    if (newQuantity <= 0) {
      await removeItem(productId);
    } else {
      // On envoie la modification au serveur
      await updateCart({ productId, quantity: newQuantity });
    }
  };

  // État de chargement initial
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 text-green-700 animate-spin" />
      </div>
    );
  }

  // Panier vide
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Votre panier est vide</h2>
          <p className="text-gray-600 mb-8">Il semble que vous n'ayez pas encore fait votre choix.</p>
          <Link to="/products" className="bg-green-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-800 transition-all shadow-lg">
            Découvrir nos produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Mon Panier</h1>
          <button onClick={() => navigate(-1)} className="flex items-center text-green-700 hover:text-green-800 font-semibold transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" /> Continuer mes achats
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des Produits */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item: any) => (
              <div key={item.product._id} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6 transition-hover hover:shadow-md">
                <img 
                  src={item.product.images[0]} 
                  alt={item.product.name} 
                  className="w-24 h-24 object-cover rounded-xl bg-gray-50" 
                />
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">{item.product.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">{item.product.weight}</p>
                  <p className="text-green-700 font-bold text-xl mt-2">{item.product.price.toFixed(2)}€</p>
                </div>

                <div className="flex items-center gap-6">
                  {/* Contrôleur de Quantité */}
                  <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                    <button 
                      disabled={isUpdating}
                      onClick={() => handleQuantityChange(item.product._id, item.quantity, -1)}
                      className="p-2 hover:bg-gray-100 text-gray-600 rounded-l-lg disabled:opacity-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-gray-800">{item.quantity}</span>
                    <button 
                      disabled={isUpdating}
                      onClick={() => handleQuantityChange(item.product._id, item.quantity, 1)}
                      className="p-2 hover:bg-gray-100 text-gray-600 rounded-r-lg disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeItem(item.product._id)}
                    className="text-red-400 hover:text-red-600 p-2 transition-colors"
                    title="Supprimer l'article"
                  >
                    <Trash2 className="h-6 w-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Résumé du Panier */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Résumé de la commande</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span className="font-semibold text-gray-900">{totalAmount.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span className="text-green-600 font-bold">Gratuite</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total TTC</span>
                  <span className="text-2xl font-black text-green-700">{totalAmount.toFixed(2)}€</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/paiement')}
                className="w-full bg-green-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition-all shadow-lg shadow-green-700/20 active:scale-[0.98]"
              >
                Procéder au paiement
              </button>

              <div className="mt-8 space-y-3">
                <div className="flex items-center text-xs text-gray-500 gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Paiement sécurisé crypté SSL</span>
                </div>
                <div className="flex items-center text-xs text-gray-500 gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Livraison rapide en 24/48h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;