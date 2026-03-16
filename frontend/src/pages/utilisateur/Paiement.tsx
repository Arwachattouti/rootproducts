import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck,
  MapPin,
  User,
  ArrowLeft,
  Loader2,
  ChevronRight,
  CheckCircle,
  PackageCheck,
} from 'lucide-react';

import {
  useGetCartQuery,
  useCreateOrderMutation,
  useClearCartMutation, // <-- Import unique et propre
} from '../../state/apiService';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { data: cart, isLoading: isCartLoading } = useGetCartQuery();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const items = useMemo(() => {
    return (cart?.items ?? []).filter((item: any) => item.product !== null);
  }, [cart]);

  const total = useMemo(() => {
    return items.reduce((acc: number, item: any) => {
      const price = item.product?.price ?? 0;
      return acc + price * item.quantity;
    }, 0);
  }, [items]);

  const [currentStep, setCurrentStep] = useState(1);
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  const [clearCart] = useClearCartMutation(); // <-- Initialisation de clearCart

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Tunisie',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const steps = [
    { id: 1, name: 'Identité', icon: User },
    { id: 2, name: 'Livraison', icon: Truck },
  ];

  const canGoNext = () => {
    if (currentStep === 1)
      return !!(
        formData.firstName &&
        formData.lastName &&
        formData.email &&
        formData.phone
      );
    return true;
  };

  // 🚨 FONCTION PRINCIPALE CORRIGÉE : Gère la commande ET le vidage du panier
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const orderPayload = {
        items: items.map((item: any) => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.images?.[0] || '',
        })),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        paymentMethod: 'COD',
        total: Number(total.toFixed(3)),
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
      };

      // 1. Création de la commande dans la base de données
      await createOrder(orderPayload).unwrap();

      // 2. Vidage du panier une fois la commande validée
      await clearCart().unwrap();

      // 3. Redirection vers la page de succès
      navigate('/order-success'); 
    } catch (error: any) {
      alert(
        error.data?.message ||
          'Une erreur est survenue lors de la validation.'
      );
    }
  };

  if (isCartLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFCF9] px-4">
        <Loader2
          className="animate-spin text-[#357A32] mb-4 h-8 w-8 sm:h-10 sm:w-10"
        />
        <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#357A32]/60 text-center">
          Préparation de votre commande...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* HEADER */}
      <section className="relative py-8 sm:py-12 md:py-20 bg-gray-50 border-b border-gray-100 mb-6 sm:mb-8 md:mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block px-3 py-1 rounded bg-[#357A32]/10 text-[#357A32] text-xs sm:text-sm md:text-base font-seasons tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-3 sm:mb-4">
            Finalisation
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-serif text-[#4B2E05] mt-1 sm:mt-2 mb-3 sm:mb-4">
            Validation de la commande
          </h1>
          <div className="flex justify-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-xs sm:text-sm md:text-base font-seasons uppercase tracking-[0.15em] sm:tracking-[0.2em] hover:text-[#357A32] transition-all group"
            >
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 group-hover:-translate-x-1 transition-transform" />
              Retour au panier
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 md:py-16">
        {/* STEPPER */}
        <div className="flex justify-between max-w-xs sm:max-w-sm md:max-w-xl mx-auto mb-8 sm:mb-12 md:mb-20 relative px-2 sm:px-4">
          <div className="absolute top-5 sm:top-6 md:top-7 left-0 w-full h-[1px] bg-gray-100 -z-10" />
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-xl md:rounded-2xl flex items-center justify-center border transition-all duration-500 ${
                  currentStep >= step.id
                    ? 'bg-[#357A32] border-[#357A32] text-white shadow-lg shadow-[#357A32]/20'
                    : 'bg-white border-gray-100 text-gray-200'
                }`}
              >
                <step.icon
                  className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5"
                  strokeWidth={1.5}
                />
              </div>
              <span
                className={`text-[10px] sm:text-xs md:text-sm lg:text-lg mt-1.5 sm:mt-2 md:mt-4 uppercase tracking-[0.05em] sm:tracking-[0.1em] font-serif text-center leading-tight ${
                  currentStep >= step.id
                    ? 'text-[#4B2E05] font-bold'
                    : 'text-gray-300'
                }`}
              >
                {step.name}
              </span>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12 lg:gap-16"
        >
          {/* FORMULAIRE */}
          <div className="lg:col-span-2 bg-white p-5 sm:p-8 md:p-10 lg:p-14 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3.5rem] shadow-sm border border-gray-50">
            {/* ETAPE 1 : IDENTITÉ */}
            {currentStep === 1 && (
              <div className="space-y-6 sm:space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-3 sm:gap-4">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-seasons text-[#4B2E05] whitespace-nowrap">
                    Vos informations
                  </h2>
                  <div className="h-[1px] flex-1 bg-gray-50" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                  <div className="space-y-2 sm:space-y-3">
                    <label className="font-seasons text-xs sm:text-sm uppercase tracking-widest ml-1">
                      Prénom
                    </label>
                    <input
                      name="firstName"
                      placeholder="Ahmed"
                      required
                      onChange={handleInputChange}
                      value={formData.firstName}
                      className="w-full px-4 sm:px-5 md:px-6 py-3.5 sm:py-4 md:py-5 bg-[#FDFCF9] rounded-xl sm:rounded-2xl border-none text-sm sm:text-base focus:ring-2 focus:ring-[#357A32]/10 transition-all"
                    />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <label className="font-seasons text-xs sm:text-sm uppercase tracking-widest ml-1">
                      Nom
                    </label>
                    <input
                      name="lastName"
                      placeholder="Ben Salem"
                      required
                      onChange={handleInputChange}
                      value={formData.lastName}
                      className="w-full px-4 sm:px-5 md:px-6 py-3.5 sm:py-4 md:py-5 bg-[#FDFCF9] rounded-xl sm:rounded-2xl border-none text-sm sm:text-base focus:ring-2 focus:ring-[#357A32]/10 transition-all"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2 sm:space-y-3">
                    <label className="font-seasons text-xs sm:text-sm uppercase tracking-widest ml-1">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      placeholder="ahmed@mail.tn"
                      required
                      onChange={handleInputChange}
                      value={formData.email}
                      className="w-full px-4 sm:px-5 md:px-6 py-3.5 sm:py-4 md:py-5 bg-[#FDFCF9] rounded-xl sm:rounded-2xl border-none text-sm sm:text-base focus:ring-2 focus:ring-[#357A32]/10 transition-all"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2 sm:space-y-3">
                    <label className="font-seasons text-xs sm:text-sm uppercase tracking-widest ml-1">
                      Téléphone
                    </label>
                    <input
                      name="phone"
                      placeholder="+216 -- --- ---"
                      required
                      onChange={handleInputChange}
                      value={formData.phone}
                      className="w-full px-4 sm:px-5 md:px-6 py-3.5 sm:py-4 md:py-5 bg-[#FDFCF9] rounded-xl sm:rounded-2xl border-none text-sm sm:text-base focus:ring-2 focus:ring-[#357A32]/10 transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ETAPE 2 : LIVRAISON */}
            {currentStep === 2 && (
              <div className="space-y-6 sm:space-y-8 md:space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
                <div className="flex items-center gap-3 sm:gap-4">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-seasons text-[#4B2E05] whitespace-nowrap">
                    Livraison
                  </h2>
                  <div className="h-[1px] flex-1 bg-gray-50" />
                </div>
                <div className="space-y-4 sm:space-y-6">
                  <div className="relative">
                    <MapPin className="absolute left-4 sm:left-5 md:left-6 top-1/2 -translate-y-1/2 text-[#357A32]/40 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      name="address"
                      placeholder="Adresse complète"
                      required
                      onChange={handleInputChange}
                      value={formData.address}
                      className="w-full pl-11 sm:pl-14 md:pl-16 pr-4 sm:pr-6 py-4 sm:py-5 md:py-6 bg-[#FDFCF9] rounded-xl sm:rounded-2xl font-seasons text-sm sm:text-base md:text-lg border-none focus:ring-2 focus:ring-[#357A32]/10"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                    <input
                      name="city"
                      placeholder="Ville / Gouvernorat"
                      required
                      onChange={handleInputChange}
                      value={formData.city}
                      className="w-full px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 bg-[#FDFCF9] rounded-xl sm:rounded-2xl border-none focus:ring-2 font-seasons text-sm sm:text-base md:text-lg"
                    />
                    <input
                      name="postalCode"
                      placeholder="Code postal"
                      required
                      onChange={handleInputChange}
                      value={formData.postalCode}
                      className="w-full px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 bg-[#FDFCF9] rounded-xl sm:rounded-2xl border-none focus:ring-2 font-seasons text-sm sm:text-base md:text-lg"
                    />
                  </div>
                </div>

                {/* Info paiement */}
                <div className="mt-4 sm:mt-6 md:mt-8 p-4 sm:p-5 md:p-6 bg-[#357A32]/5 rounded-2xl sm:rounded-3xl border border-[#357A32]/10 flex items-start gap-3 sm:gap-4">
                  <CheckCircle className="text-[#357A32] shrink-0 w-5 h-5 sm:w-6 sm:h-6 mt-0.5" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#4B2E05] mb-0.5 sm:mb-1 text-sm sm:text-base">
                      Paiement à la livraison
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      Le règlement se fera en espèces ou par chèque directement
                      auprès du livreur lors de la réception de votre colis.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* BOUTONS DE NAVIGATION */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mt-2 pt-6 sm:pt-8 md:pt-10 border-t border-gray-50 gap-3 sm:gap-4 md:gap-6">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="w-full sm:w-auto px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-xl sm:rounded-2xl uppercase font-seasons text-xs sm:text-sm tracking-wider sm:tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Modifier mes infos</span>
                  <span className="xs:hidden">Retour</span>
                </button>
              ) : (
                <div className="hidden sm:block" />
              )}

              {currentStep === 1 ? (
                <button
                  type="button"
                  disabled={!canGoNext()}
                  onClick={() => setCurrentStep(2)}
                  className="w-full sm:w-auto bg-[#4B2E05] text-white px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl font-black uppercase font-seasons text-sm sm:text-base md:text-lg tracking-wider sm:tracking-widest disabled:opacity-20 hover:bg-[#357A32] transition-all flex items-center justify-center gap-2 sm:gap-3"
                >
                  Suivant
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isCreatingOrder || !formData.address}
                  className="w-full sm:w-auto bg-[#357A32] text-white px-6 sm:px-10 md:px-14 py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl font-black uppercase text-xs sm:text-sm tracking-wider sm:tracking-widest hover:bg-[#4B2E05] shadow-2xl flex items-center justify-center gap-2 sm:gap-3 transition-all active:scale-95 disabled:opacity-40"
                >
                  {isCreatingOrder ? (
                    <Loader2 className="animate-spin w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                  ) : (
                    <PackageCheck className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                  )}
                  <span className="truncate">
                    Confirmer ({total.toFixed(3)} DT)
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* RÉSUMÉ À DROITE */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <div className="bg-white p-5 sm:p-7 md:p-10 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm lg:sticky lg:top-10">
              <h3 className="font-seasons text-base sm:text-lg md:text-xl uppercase tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] mb-6 sm:mb-8 md:mb-10 text-center">
                Votre panier
              </h3>

              <div className="space-y-4 sm:space-y-5 md:space-y-6 max-h-[250px] sm:max-h-[300px] md:max-h-[400px] overflow-y-auto pr-1 sm:pr-2 scrollbar-thin">
                {items.map((item: any) => {
                  const product = item.product;
                  if (!product) return null;

                  return (
                    <div
                      key={product._id}
                      className="flex gap-3 sm:gap-4 items-center"
                    >
                      <img
                        src={product.images?.[0] || '/placeholder.png'}
                        className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg sm:rounded-xl object-cover border border-gray-50 shrink-0"
                        alt={product.name}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-seasons text-sm sm:text-base md:text-lg text-[#4B2E05] truncate">
                          {product.name}
                        </p>
                        <p className="text-[10px] sm:text-xs text-[#357A32] font-bold">
                          {item.quantity} x{' '}
                          {(product.price ?? 0).toFixed(3)} DT
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 sm:mt-7 md:mt-8 pt-6 sm:pt-7 md:pt-8 border-t border-gray-100 space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="font-seasons">Livraison</span>
                  <span className="text-[#357A32] font-bold uppercase text-[9px] sm:text-[10px] tracking-wider bg-[#357A32]/5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                    Gratuite
                  </span>
                </div>
                <div className="flex justify-between items-end pt-1 sm:pt-2">
                  <span className="text-xs sm:text-sm md:text-base font-seasons uppercase tracking-wider sm:tracking-widest text-[#4B2E05]">
                    Total à payer
                  </span>
                  <span className="text-xl sm:text-2xl font-seasons text-[#4B2E05]">
                    {total.toFixed(3)} DT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;