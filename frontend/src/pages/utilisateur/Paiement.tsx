import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Truck,
  MapPin,
  User,
  ArrowLeft,
  Loader2,
  Lock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

import {
  useGetCartQuery,
  useCreateOrderMutation,
  useCreatePaymeeTokenMutation
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
      return acc + (price * item.quantity);
    }, 0);
  }, [items]);

  const [currentStep, setCurrentStep] = useState(1);
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  const [createPaymeeToken, { isLoading: isRedirecting }] = useCreatePaymeeTokenMutation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Tunisie'
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
    if (currentStep === 1)
      return !!(formData.firstName && formData.lastName && formData.email && formData.phone);
    if (currentStep === 2)
      return !!(formData.address && formData.city && formData.postalCode);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const orderPayload = {
        items: items.map((item: any) => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.images?.[0] || ""
        })),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        },
        total: Number(total.toFixed(3))
      };

      const order = await createOrder(orderPayload).unwrap();
      const paymentData = {
        amount: Number(total.toFixed(3)),
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        orderId: order.id
      };

      const response = await createPaymeeToken(paymentData).unwrap();
      if (response.status === true && response.data?.token) {
        window.location.href = response.data.payment_url || `https://sandbox.paymee.tn/gateway/${response.data.token}`;
      }
    } catch (error: any) {
      alert(error.data?.message || "Une erreur est survenue.");
    }
  };

  if (isCartLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFCF9]">
        <Loader2 className="animate-spin text-[#357A32] mb-4" size={40} />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#357A32]/60 text-center">
            Sécurisation de la commande...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF9] pb-24">
      <div className="max-w-7xl mx-auto px-4 pt-16">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 border-b border-gray-100 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-[1px] w-8 bg-[#357A32]"></span>
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#357A32]">Finalisation</span>
            </div>
            <h1 className="text-5xl font-black text-[#4B2E05] tracking-tighter">
              Validation <span className="font-serif italic font-light text-[#357A32]/70 lowercase">root.</span>
            </h1>
          </div>
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-[10px] font-black uppercase tracking-widest text-[#4B2E05] hover:text-[#357A32] transition-all group"
          >
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Retour au panier
          </button>
        </div>

        {/* STEPPER */}
        <div className="flex justify-between max-w-2xl mx-auto mb-20 relative px-4">
          <div className="absolute top-6 left-0 w-full h-[1px] bg-gray-100 -z-10"></div>
          {steps.map(step => (
            <div key={step.id} className="flex flex-col items-center bg-[#FDFCF9] px-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
                currentStep >= step.id 
                ? 'bg-[#357A32] border-[#357A32] text-white shadow-xl shadow-[#357A32]/20' 
                : 'bg-white border-gray-100 text-gray-200'
              }`}>
                <step.icon size={20} strokeWidth={1.5} />
              </div>
              <span className={`text-[9px] font-black mt-4 uppercase tracking-[0.2em] ${currentStep >= step.id ? 'text-[#4B2E05]' : 'text-gray-300'}`}>
                {step.name}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 bg-white p-8 md:p-14 rounded-[3.5rem] shadow-sm border border-gray-50">

            {currentStep === 1 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-4">
                   <h2 className="text-2xl font-serif italic text-[#4B2E05]">Vos Informations</h2>
                   <div className="h-[1px] flex-1 bg-gray-50"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Prénom</label>
                    <input name="firstName" placeholder="Ahmed" required onChange={handleInputChange} value={formData.firstName} className="w-full px-6 py-5 bg-[#FDFCF9] rounded-2xl border-none focus:ring-2 focus:ring-[#357A32]/10 transition-all placeholder:text-gray-200" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nom</label>
                    <input name="lastName" placeholder="Ben Salem" required onChange={handleInputChange} value={formData.lastName} className="w-full px-6 py-5 bg-[#FDFCF9] rounded-2xl border-none focus:ring-2 focus:ring-[#357A32]/10 transition-all placeholder:text-gray-200" />
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email de contact</label>
                    <input name="email" type="email" placeholder="ahmed@mail.tn" required onChange={handleInputChange} value={formData.email} className="w-full px-6 py-5 bg-[#FDFCF9] rounded-2xl border-none focus:ring-2 focus:ring-[#357A32]/10 transition-all placeholder:text-gray-200" />
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Numéro de Mobile</label>
                    <input name="phone" placeholder="+216 -- --- ---" required onChange={handleInputChange} value={formData.phone} className="w-full px-6 py-5 bg-[#FDFCF9] rounded-2xl border-none focus:ring-2 focus:ring-[#357A32]/10 transition-all placeholder:text-gray-200" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
                <div className="flex items-center gap-4">
                   <h2 className="text-2xl font-serif italic text-[#4B2E05]">Destination</h2>
                   <div className="h-[1px] flex-1 bg-gray-50"></div>
                </div>
                <div className="space-y-6">
                  <div className="relative">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-[#357A32]/40" size={20} />
                    <input name="address" placeholder="Adresse de livraison complète" required onChange={handleInputChange} value={formData.address} className="w-full pl-16 pr-6 py-6 bg-[#FDFCF9] rounded-2xl border-none focus:ring-2 focus:ring-[#357A32]/10 transition-all placeholder:text-gray-200" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <input name="city" placeholder="Ville / Gouvernorat" required onChange={handleInputChange} value={formData.city} className="w-full px-8 py-6 bg-[#FDFCF9] rounded-2xl border-none focus:ring-2 focus:ring-[#357A32]/10 transition-all placeholder:text-gray-200" />
                    <input name="postalCode" placeholder="Code postal" required onChange={handleInputChange} value={formData.postalCode} className="w-full px-8 py-6 bg-[#FDFCF9] rounded-2xl border-none focus:ring-2 focus:ring-[#357A32]/10 transition-all placeholder:text-gray-200" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="text-center py-12 animate-in zoom-in duration-700">
                <div className="w-24 h-24 bg-[#357A32]/5 rounded-full flex items-center justify-center mx-auto mb-10 border border-[#357A32]/10">
                  <ShieldCheck size={44} className="text-[#357A32]" />
                </div>
                <h2 className="text-3xl font-black text-[#4B2E05] tracking-tight mb-4">Paiement Sécurisé</h2>
                <p className="text-gray-400 font-serif italic max-w-sm mx-auto leading-relaxed text-lg">
                  Vous allez être redirigé vers <span className="text-[#4B2E05] font-bold not-italic">Paymee Tunisie</span> pour finaliser votre transaction en toute sécurité.
                </p>
              </div>
            )}

            {/* NAVIGATION BUTTONS */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-20 pt-10 border-t border-gray-50 gap-6">
              {currentStep > 1 ? (
                <button type="button" onClick={() => setCurrentStep(s => s - 1)} className="px-8 py-4 font-black uppercase text-[10px] tracking-widest text-gray-300 hover:text-[#4B2E05] transition-colors">
                  Étape précédente
                </button>
              ) : <div className="hidden sm:block"></div>}

              {currentStep < 3 ? (
                <button
                  type="button"
                  disabled={!canGoNext()}
                  onClick={() => setCurrentStep(s => s + 1)}
                  className="w-full sm:w-auto bg-[#4B2E05] text-white px-14 py-6 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] disabled:opacity-20 hover:bg-[#357A32] transition-all shadow-xl shadow-[#4B2E05]/10 flex items-center justify-center gap-3"
                >
                  Continuer vers l'envoi <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isCreatingOrder || isRedirecting}
                  className="w-full sm:w-auto bg-[#357A32] text-white px-14 py-6 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-[#4B2E05] shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[#357A32]/20"
                >
                  {(isCreatingOrder || isRedirecting) ? <Loader2 className="animate-spin" size={18} /> : <CreditCard size={18} />}
                  Procéder au paiement ({total.toFixed(3)} DT)
                </button>
              )}
            </div>
          </div>

          {/* RÉSUMÉ */}
        <div className="lg:col-span-1">
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-[0_30px_60px_rgba(0,0,0,0.05)] sticky top-10 overflow-hidden">
            {/* Accent de couleur discret */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#357A32]/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-10 text-center relative z-10">
              Votre Sélection
            </h3>
            
            {/* Liste des produits avec scrollbar élégante */}
            <div className="space-y-8 max-h-[350px] overflow-y-auto pr-4 border-b border-gray-50 pb-10 scrollbar-thin scrollbar-thumb-gray-100">
              {items.map((item: any) => (
                <div key={item.product?._id} className="flex gap-5 items-center group">
                  <div className="relative shrink-0">
                    <img
                      src={item.product?.images?.[0] || '/placeholder.png'}
                      className="w-16 h-16 rounded-2xl object-cover border border-gray-50 group-hover:scale-105 transition-transform duration-500"
                      alt={item.product?.name}
                    />
                    <span className="absolute -top-2 -right-2 bg-[#4B2E05] text-white text-[9px] w-6 h-6 rounded-lg flex items-center justify-center font-bold shadow-md">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif italic text-[#4B2E05] text-base leading-tight truncate">
                      {item.product?.name}
                    </p>
                    <p className="text-[10px] font-bold text-[#357A32] uppercase tracking-widest mt-1">
                      {(item.product?.price ?? 0).toFixed(3)} DT
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Récapitulatif financier */}
            <div className="mt-10 space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-serif italic text-sm">Expédition</span>
                <span className="text-[#357A32] font-bold uppercase tracking-widest text-[9px] bg-[#357A32]/5 px-3 py-1 rounded-full">
                  Gratuite
                </span>
              </div>
              
              <div className="flex justify-between items-end pt-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4B2E05]">Total TTC</span>
                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-4xl font-serif italic text-[#4B2E05] leading-none">
                      {total.toFixed(3)}
                    </span>
                    <span className="text-[10px] font-bold text-[#357A32] uppercase tracking-widest">DT</span>
                  </div>
                  <p className="text-[9px] font-medium text-gray-300 uppercase tracking-tighter mt-1">
                    Prêt pour expédition
                  </p>
                </div>
              </div>
            </div>
            
            {/* Badge de sécurité style discret */}
            <div className="mt-12 flex items-center justify-center gap-3 py-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="text-[#357A32]">
                <Lock size={14} strokeWidth={2.5} />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400">
                Transaction sécurisée SSL
              </span>
            </div>
          </div>
        </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;