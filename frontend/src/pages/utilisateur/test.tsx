import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, MapPin, Phone, Mail, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const Checkout: React.FC = () => {
  const { state, clearCart } = useCart();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Shipping Address
    address: '',
    city: '',
    postalCode: '',
    country: 'Tunisie',
    // Payment
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate order processing
    setTimeout(() => {
      clearCart();
    //  navigate('/order-confirmation');
    }, 2000);
  };

  const steps = [
    { id: 1, name: 'Informations', icon: User },
    { id: 2, name: 'Livraison', icon: Truck },
    { id: 3, name: 'Paiement', icon: CreditCard }
  ];

  if (state.items.length === 0) {
    setTimeout(() => navigate('/panier'), 100);
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Finaliser ma commande</h1>

        {/* Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className={`flex items-center ${currentStep >= step.id ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= step.id ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'
                }`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <span className="ml-2 font-medium">{step.name}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${currentStep > step.id ? 'bg-green-600' : 'bg-gray-300'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Vos informations personnelles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping Address */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Adresse de livraison</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse complète *
                      </label>
                      <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ville *
                        </label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Code postal *
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          required
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pays *
                      </label>
                      <select
                        name="country"
                        required
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="Tunisie">Tunisie</option>
                        <option value="France">France</option>
                        <option value="Algérie">Algérie</option>
                        <option value="Maroc">Maroc</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations de paiement</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom sur la carte *
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        required
                        value={formData.cardName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Numéro de carte *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        required
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date d'expiration *
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          required
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          required
                          placeholder="123"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Précédent
                  </button>
                )}
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className={`px-8 py-3 bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
                      currentStep === 1 ? 'ml-auto' : ''
                    }`}
                  >
                    Suivant
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ml-auto"
                  >
                    Finaliser la commande
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-xl p-6 sticky top-24 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h2>
              
              <div className="space-y-3 mb-6">
                {state.items.map((item) => (
                  <div key={item.product._id} className="flex justify-between">
                    <span className="text-gray-600">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span className="font-medium">
                      {(item.product.price * item.quantity).toFixed(2)}€
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">{state.total.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-medium text-green-600">Gratuite</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-green-700">
                      {state.total.toFixed(2)}€
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-inner">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Paiement sécurisé</h3>
                    <p className="text-sm text-green-700 mt-1">
                      Vos informations sont protégées par un cryptage SSL
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, Truck, MapPin, User, ArrowLeft, 
  Loader2, Lock, ShieldCheck, ChevronRight 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCreateOrderMutation, useCreatePaymeeTokenMutation } from '../../state/apiService';

const Checkout: React.FC = () => {
  const { state, clearCart } = useCart();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Hooks API
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  const [createPaymeeToken, { isLoading: isRedirecting }] = useCreatePaymeeTokenMutation();

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', postalCode: '', country: 'Tunisie'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const steps = [
    { id: 1, name: 'Identité', icon: User },
    { id: 2, name: 'Livraison', icon: Truck },
    { id: 3, name: 'Paiement', icon: CreditCard }
  ];

  const canGoNext = () => {
    if (currentStep === 1) return !!(formData.firstName && formData.lastName && formData.email && formData.phone);
    if (currentStep === 2) return !!(formData.address && formData.city && formData.postalCode);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 1. Création de la commande
      const orderPayload = {
        items: state.items.map(item => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.images[0]
        })),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        },
        total: state.total
      };

      const newOrder = await createOrder(orderPayload).unwrap();

      // 2. Préparation des données Paymee
      const paymentData = {
        amount: state.total,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        orderId: newOrder.id // Utilisation de _id (format MongoDB habituel)
      };

      // 3. Obtention du lien Paymee
      const response = await createPaymeeToken(paymentData).unwrap();

      if (response.status === true && response.data.payment_url) {
        // CORRECTION IMPORTANTE : Ne pas appeler clearCart() ici.
        // On le fera sur la page OrderSuccess.tsx pour éviter le flash "Panier vide"
        
        // 4. Redirection
        window.location.href = response.data.payment_url;
      } else {
        alert("Erreur Paymee: Impossible de générer le lien de paiement.");
      }
    } catch (err: any) {
      console.error("Erreur Checkout:", err);
      alert(err.data?.message || "Une erreur est survenue lors de la validation.");
    }
  };

  // CORRECTION DE LA CONDITION : On ajoute !isRedirecting pour ne pas afficher "Panier vide" pendant le départ vers Paymee
  if (state.items.length === 0 && !isCreatingOrder && !isRedirecting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="text-gray-400" size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Panier vide</h2>
          <p className="text-gray-500 mb-8">Vous ne pouvez pas commander sans produits.</p>
          <button onClick={() => navigate('/products')} className="w-full bg-black text-white py-4 rounded-2xl font-bold">
            Découvrir nos produits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-all">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 italic uppercase tracking-tighter">Validation de commande</h1>
        </div>

        <div className="max-w-3xl mx-auto mb-12 flex justify-between relative">
          <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-4 transition-all duration-500 ${
                currentStep >= step.id ? 'bg-green-600 border-white text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400'
              }`}>
                <step.icon size={20} />
              </div>
              <span className={`text-[10px] font-black mt-2 uppercase tracking-widest ${currentStep >= step.id ? 'text-green-700' : 'text-gray-400'}`}>
                {step.name}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-12">
              <form onSubmit={handleSubmit}>
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-black text-gray-900">Vos Coordonnées</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input type="text" name="firstName" placeholder="Prénom" required value={formData.firstName} onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500" />
                      <input type="text" name="lastName" placeholder="Nom" required value={formData.lastName} onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500" />
                      <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500 md:col-span-2" />
                      <input type="tel" name="phone" placeholder="Téléphone (ex: 216...)" required value={formData.phone} onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500 md:col-span-2" />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-black text-gray-900">Adresse de Livraison</h2>
                    <div className="space-y-4">
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" size={20} />
                        <input type="text" name="address" placeholder="Adresse complète" required value={formData.address} onChange={handleInputChange} className="w-full pl-12 pr-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" name="city" placeholder="Ville" required value={formData.city} onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500" />
                        <input type="text" name="postalCode" placeholder="Code Postal" required value={formData.postalCode} onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500" />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6 text-center py-10">
                    <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShieldCheck className="text-green-600" size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900">Paiement Sécurisé via Paymee</h2>
                    <p className="text-gray-500 max-w-sm mx-auto">
                      Vous allez être redirigé vers la plateforme sécurisée Paymee pour finaliser votre transaction par carte bancaire.
                    </p>
                  </div>
                )}

                <div className="mt-12 flex justify-between gap-4">
                  {currentStep > 1 && (
                    <button type="button" onClick={() => setCurrentStep(currentStep - 1)} className="px-8 py-4 font-black text-gray-400 uppercase text-xs tracking-widest">
                      Retour
                    </button>
                  )}
                  {currentStep < 3 ? (
                    <button type="button" onClick={() => setCurrentStep(currentStep + 1)} disabled={!canGoNext()} className="ml-auto flex items-center bg-black text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-800 disabled:opacity-20 transition-all">
                      Suivant <ChevronRight size={16} className="ml-2" />
                    </button>
                  ) : (
                    <button type="submit" disabled={isCreatingOrder || isRedirecting} className="ml-auto bg-green-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-green-700 shadow-lg flex items-center transition-all">
                      {(isCreatingOrder || isRedirecting) ? <Loader2 className="animate-spin mr-2" /> : <CreditCard className="mr-2" size={18} />}
                      Payer {state.total.toFixed(2)} DT
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100">
              <h3 className="text-xl font-black mb-6 italic">Votre Panier</h3>
              <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2">
                {state.items.map((item) => (
                  <div key={item.product._id} className="flex gap-4 items-center">
                    <img src={item.product.images[0]} className="w-16 h-16 rounded-xl object-cover bg-gray-50 border" alt="" />
                    <div className="flex-1">
                      <h4 className="text-xs font-black text-gray-900 uppercase line-clamp-1">{item.product.name}</h4>
                      <p className="text-xs text-gray-500 font-bold">Qté: {item.quantity}</p>
                      <p className="text-sm font-black text-green-700">{item.product.price.toFixed(2)} DT</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3 pt-6 border-t border-dashed border-gray-200">
                <div className="flex justify-between text-2xl font-black text-gray-900 pt-4">
                  <span>Total</span>
                  <span>{state.total.toFixed(2)} DT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
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
                onClick={() =>
                  navigate('/paiement', {
                    state: {
                      items: cart.items,
                      total: totalAmount
                    }
                  })
                }
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