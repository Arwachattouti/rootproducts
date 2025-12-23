import React, { useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Loader2, ShieldCheck, Truck } from 'lucide-react';
import {
  useGetCartQuery,
  useUpdateCartMutation,
  useRemoveFromCartMutation
} from '../../state/apiService';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { data: cart, isLoading } = useGetCartQuery();
  const [updateCart, { isLoading: isUpdating }] = useUpdateCartMutation();
  const [removeItem] = useRemoveFromCartMutation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const totalAmount = useMemo(() => {
    return (
      cart?.items.reduce((acc: number, item: any) => {
        if (!item.product || !item.product.price) return acc;
        return acc + item.product.price * item.quantity;
      }, 0) || 0
    );
  }, [cart]);

  const handleQuantityChange = async (productId: string, currentQty: number, delta: number) => {
    if (isUpdating) return;
    const newQuantity = currentQty + delta;
    if (newQuantity <= 0) {
      await removeItem(productId);
    } else {
      await updateCart({ productId, quantity: newQuantity });
    }
  };

  // 1. Chargement
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFCF9]">
        <Loader2 className="h-10 w-10 text-[#357A32] animate-spin mb-4" />
        <span className="text-[10px] font-black uppercase tracking-widest ">Récupération de votre sélection</span>
      </div>
    );
  }

  // 2. Panier Vide
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-4 max-w-md">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-[2rem] mb-8 shadow-sm border border-gray-50">
            <ShoppingBag className="h-10 w-10 text-gray-200" />
          </div>
          <h2 className="text-4xl font-seasons text-[#4B2E05] mb-4">Panier vide.</h2>
          <p className=" font-seasons mb-10 leading-relaxed text-xl ">
            Il semble que vous n'ayez pas encore exploré nos récoltes authentiques.
          </p>
          <Link
            to="/products"
            className="inline-block bg-[#4B2E05] text-white px-10 py-5 rounded-2xl font-seasons uppercase text-lg tracking-[0.2em] hover:bg-[#357A32] transition-all shadow-xl shadow-[#4B2E05]/10"
          >
            Découvrir la collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">

      {/* HEADER */}
      {/* HEADER PANIER */}
      <section className="relative py-12 md:py-20 bg-gray-50 border-b border-gray-100 mb-12">
        <div className="max-w-7xl mx-auto px-2 text-center">
          {/* Badge style Catalogue */}
          <span className="inline-block px-3 py-1 rounded bg-[#357A32]/10 text-[#357A32] text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
            Votre panier
          </span>

          {/* Titre avec la police "Seasons" (ou serif) */}
          <h1 className="text-3xl md:text-6xl font-serif text-[#4B2E05] mt-2 mb-4">
            Ma sélection
          </h1>

          {/* Bouton retour retravaillé pour s'intégrer au design */}
          <div className="flex justify-center ">
            <button
              onClick={() => navigate("/products")}
              className="flex items-center text-sm md:text-base font-serif uppercase tracking-[0.2em] hover:text-[#357A32] transition-all group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Continuer mes achats
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">


        {/* LISTE PRODUITS */}
        <div className="lg:col-span-2 space-y-8">
          {cart.items.map((item: any) => {
            if (!item.product) return null;

            return (
              <div
                key={item.product._id}
                className="group relative bg-white p-8 rounded-[2.5rem] border border-gray-50 flex flex-col sm:flex-row items-center gap-10 transition-all hover:shadow-2xl hover:shadow-gray-200/40"
              >
                <div className="relative w-36 h-36 shrink-0 overflow-hidden rounded-[2rem] bg-[#FDFCF9]">
                  <img
                    src={item.product.images?.[0] || '/images/placeholder.png'}
                    alt={item.product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl md:text-3xl font-seasons text-[#4B2E05] mb-2">
                    {item.product.name}
                  </h3>
                  <div className="inline-block px-3 py-1 bg-gray-50 rounded-lg text-base md:text-lg font-seasons uppercase tracking-widest mb-4">
                    {item.product.weight || 'Format Standard'}
                  </div>
                  <p className="text-[#357A32] font-seasons text-2xl md:text:xl">
                    {item.product.price ? item.product.price.toFixed(3) : '0.000'} <span className="text-2xl md:text:xl">DT</span>
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center bg-[#FDFCF9] rounded-2xl border border-gray-100 p-1">
                    <button
                      disabled={isUpdating}
                      onClick={() => handleQuantityChange(item.product._id, item.quantity, -1)}
                      className="p-3 hover:text-[#357A32] text-gray-300 transition-colors disabled:opacity-20"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-black text-[#4B2E05]">{item.quantity}</span>
                    <button
                      disabled={isUpdating}
                      onClick={() => handleQuantityChange(item.product._id, item.quantity, 1)}
                      className="p-3 hover:text-[#357A32] text-gray-300 transition-colors disabled:opacity-20"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="h-14 w-14 flex items-center justify-center bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm"
                    title="Supprimer"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* RÉSUMÉ */}
        <div className="lg:col-span-1">
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-[0_30px_60px_rgba(0,0,0,0.05)] sticky top-10 overflow-hidden">
            {/* Petit accent de couleur en haut */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#4B2E05]"></div>

            <h2 className="text-2xl  font-seasons tracking-[0.3em] mb-10 text-center">
              Votre panier
            </h2>

            <div className="space-y-6 mb-12">
              <div className="flex justify-between items-end">
                <span className="font-seasons text-base">Sous-total</span>
                <span className="font-seasons text-xl text-[#4B2E05]">{totalAmount.toFixed(3)} DT</span>
              </div>

              <div className="flex justify-between items-end">
                <span className="font-seasons  text-base">Frais de port</span>
                <span className="text-[#357A32] font-bold uppercase text-[9px] tracking-[0.2em] bg-[#357A32]/5 px-3 py-1 rounded-full">
                  Offerts
                </span>
              </div>

              <div className="h-[1px] w-full bg-gray-50 my-2" />

              <div className="flex justify-between items-center pt-4">
                <span className="font-seasons text-base tracking-[0.2em] text-[#4B2E05]">Total TTC</span>
                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className=" font-seasons text-3xl text-[#4B2E05]">
                      {totalAmount.toFixed(3)}
                    </span>
                    <span className="font-seasons text-base text-[#357A32] tracking-widest">DT</span>
                  </div>
                  <span className="block font-seasons text-base tracking-tighter mt-1">
                    TVA incluse
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/paiement', { state: { items: cart.items, total: totalAmount } })}
              className=" font-seasons text-xl w-full bg-[#4B2E05] hover:bg-[#357A32] text-white py-6 rounded-2xl tracking-[0.3em] transition-all shadow-xl shadow-[#4B2E05]/10 active:scale-[0.98] group flex items-center justify-center gap-3"
            >
              Confirmer ma commande
            </button>

            {/* Section Réassurance style Blog Footer */}
            <div className="mt-12 space-y-5 border-t border-gray-50 pt-10">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-[#357A32] border border-gray-100">
                  <ShieldCheck size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-seasons text-base uppercase tracking-widest text-[#4B2E05]">Paiement sécurisé</p>
                  <p className="font-seasons text-base">Certifié SSL 256-bit</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-[#357A32] border border-gray-100">
                  <Truck size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-seasons text-base tracking-widest text-[#4B2E05]">Livraison </p>
                  <p className="font-seasons text-base">Chez vous sous 24/48h</p>
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