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
  PackageCheck
} from 'lucide-react';

import {
  useGetCartQuery,
  useCreateOrderMutation
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
    { id: 2, name: 'Livraison & Validation', icon: Truck },
  ];

  const canGoNext = () => {
    if (currentStep === 1)
      return !!(formData.firstName && formData.lastName && formData.email && formData.phone);
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
        paymentMethod: "COD", // Cash On Delivery
        total: Number(total.toFixed(3)),
        customerInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone
        }
      };

      await createOrder(orderPayload).unwrap();
      // Redirection vers une page de succès après la création
      navigate('/order-success'); 
      
    } catch (error: any) {
      alert(error.data?.message || "Une erreur est survenue lors de la validation.");
    }
  };

  if (isCartLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFCF9]">
        <Loader2 className="animate-spin text-[#357A32] mb-4" size={40} />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#357A32]/60 text-center">
          Préparation de votre commande...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* HEADER */}
      <section className="relative py-12 md:py-20 bg-gray-50 border-b border-gray-100 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="inline-block px-3 py-1 rounded bg-[#357A32]/10 text-[#357A32] text-base font-seasons tracking-[0.2em] uppercase mb-4">
            Finalisation
          </span>
          <h1 className="text-3xl md:text-6xl font-serif text-[#4B2E05] mt-2 mb-4">
            Validation de la commande
          </h1>
          <div className="flex justify-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-base font-seasons uppercase tracking-[0.2em] hover:text-[#357A32] transition-all group"
            >
              <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Retour au panier
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
        {/* STEPPER */}
        <div className="flex justify-between max-w-xl mx-auto mb-12 md:mb-20 relative px-2 md:px-4">
          <div className="absolute top-5 md:top-7 left-0 w-full h-[1px] bg-gray-100 -z-10"></div>
          {steps.map(step => (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center border transition-all duration-500 ${currentStep >= step.id
                ? 'bg-[#357A32] border-[#357A32] text-white shadow-lg shadow-[#357A32]/20'
                : 'bg-white border-gray-100 text-gray-200'
                }`}>
                <step.icon size={16} className="md:w-5 md:h-5" strokeWidth={1.5} />
              </div>
              <span className={`text-sm md:text-lg mt-2 md:mt-4 uppercase tracking-[0.1em] font-serif text-center ${currentStep >= step.id ? 'text-[#4B2E05] font-bold' : 'text-gray-300'}`}>
                {step.name}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 bg-white p-8 md:p-14 rounded-[3.5rem] shadow-sm border border-gray-50">

            {/* ETAPE 1 : IDENTITÉ */}
            {currentStep === 1 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl md:text-3xl font-seasons text-[#4B2E05]">Vos informations</h2>
                  <div className="h-[1px] flex-1 bg-gray-50"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="font-seasons text-sm uppercase tracking-widest ml-1">Prénom</label>
                    <input name="firstName" placeholder="Ahmed" required onChange={handleInputChange} value={formData.firstName} className="w-full px-6 py-5 bg-[#FDFCF9] rounded-2xl border-none focus:ring-2 focus:ring-[#357A32]/10 transition-all" />
                  </div>
                  <div className="space-y-3">
                    <label className="font-seasons text-sm uppercase tracking-widest ml-1">Nom</label>
                    <input name="lastName" placeholder="Ben Salem" required onChange={handleInputChange} value={formData.lastName} className="w-full px-6 py-5 bg-[#FDFCF9] rounded-2xl border-none focus:ring-2 focus:ring-[#357A32]/10 transition-all" />
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <label className="font-seasons text-sm uppercase tracking-widest ml-1">Email</label>
                    <input name="email" type="email" placeholder="ahmed@mail.tn" required onChange={handleInputChange} value={formData.email} className="w-full px-6 py-5 bg-[#FDFCF9] rounded-2xl border-none focus:ring-2 focus:ring-[#357A32]/10 transition-all" />
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <label className="font-seasons text-sm uppercase tracking-widest ml-1">Téléphone</label>
                    <input name="phone" placeholder="+216 -- --- ---" required onChange={handleInputChange} value={formData.phone} className="w-full px-6 py-5 bg-[#FDFCF9] rounded-2xl border-none focus:ring-2 focus:ring-[#357A32]/10 transition-all" />
                  </div>
                </div>
              </div>
            )}

            {/* ETAPE 2 : LIVRAISON ET CONFIRMATION PAIEMENT SUR PLACE */}
            {currentStep === 2 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl md:text-3xl font-seasons text-[#4B2E05]">Livraison</h2>
                  <div className="h-[1px] flex-1 bg-gray-50"></div>
                </div>
                <div className="space-y-6">
                  <div className="relative">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-[#357A32]/40" size={20} />
                    <input name="address" placeholder="Adresse complète" required onChange={handleInputChange} value={formData.address} className="w-full pl-16 pr-6 py-6 bg-[#FDFCF9] rounded-2xl font-seasons text-lg border-none focus:ring-2 focus:ring-[#357A32]/10" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <input name="city" placeholder="Ville / Gouvernorat" required onChange={handleInputChange} value={formData.city} className="w-full px-8 py-6 bg-[#FDFCF9] rounded-2xl border-none focus:ring-2 font-seasons text-lg" />
                    <input name="postalCode" placeholder="Code postal" required onChange={handleInputChange} value={formData.postalCode} className="w-full px-8 py-6 bg-[#FDFCF9] rounded-2xl border-none focus:ring-2 font-seasons text-lg" />
                  </div>
                </div>

                {/* Information Paiement sur place */}
                <div className="mt-8 p-6 bg-[#357A32]/5 rounded-3xl border border-[#357A32]/10 flex items-start gap-4">
                    <CheckCircle className="text-[#357A32] shrink-0" size={24} />
                    <div>
                        <h4 className="font-bold text-[#4B2E05] mb-1">Paiement à la livraison</h4>
                        <p className="text-sm text-gray-600">Le règlement se fera en espèces ou par chèque directement auprès du livreur lors de la réception de votre colis.</p>
                    </div>
                </div>
              </div>
            )}

            {/* BOUTONS DE NAVIGATION */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-2 pt-10 border-t border-gray-50 gap-6">
              {currentStep > 1 ? (
                <button type="button" onClick={() => setCurrentStep(1)} className="w-full sm:w-auto px-8 py-4 rounded-2xl uppercase font-seasons text-sm tracking-widest flex items-center gap-2">
                  <ArrowLeft size={14} /> Modifier mes infos
                </button>
              ) : <div />}

              {currentStep === 1 ? (
                <button
                  type="button"
                  disabled={!canGoNext()}
                  onClick={() => setCurrentStep(2)}
                  className="w-full sm:w-auto bg-[#4B2E05] text-white px-12 py-6 rounded-2xl font-black uppercase font-seasons text-lg    md:text-xl tracking-widest disabled:opacity-20 hover:bg-[#357A32] transition-all flex items-center justify-center gap-3"
                >
                  Suivant <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isCreatingOrder || !formData.address}
                  className="w-full sm:w-auto bg-[#357A32] text-white px-14 py-6 rounded-2xl font-black uppercase text-xs   md:text-sm tracking-widest hover:bg-[#4B2E05] shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
                >
                  {isCreatingOrder ? <Loader2 className="animate-spin" size={18} /> : <PackageCheck size={18} />}
                  Confirmer la commande ({total.toFixed(3)} DT)
                </button>
              )}
            </div>
          </div>

          {/* RÉSUMÉ À DROITE */}
          <div className="lg:col-span-1">
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm sticky top-10">
              <h3 className="font-seasons text-lg md:text-xl uppercase tracking-[0.3em] mb-10 text-center">Votre panier</h3>
              
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                {items.map((item: any) => (
                  <div key={item.product?._id} className="flex gap-4 items-center">
                    <img src={item.product?.images?.[0] || '/placeholder.png'} className="w-12 h-12 rounded-xl object-cover border border-gray-50" alt="" />
                    <div className="flex-1 min-w-0">
                      <p className="font-seasons text-lg  md:text-xl text-[#4B2E05] truncate">{item.product?.name}</p>
                      <p className="text-xs text-[#357A32] font-bold">{item.quantity} x {(item.product?.price ?? 0).toFixed(3)} DT</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span>Livraison</span>
                  <span className="text-[#357A32] font-bold uppercase">Gratuite</span>
                </div>
                <div className="flex justify-between items-end pt-2">
                  <span className="text-base  md:text-lg font-seasons uppercase tracking-widest text-[#4B2E05]">Total à payer</span>
                  <div className="text-right">
                    <span className="text-2xl font-seasons text-[#4B2E05]">{total.toFixed(3)} DT</span>
                  </div>
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