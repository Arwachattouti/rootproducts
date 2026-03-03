import React, { useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingBag,
  Loader2,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import {
  useGetCartQuery,
  useUpdateCartMutation,
  useRemoveFromCartMutation,
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

  const handleQuantityChange = async (
    productId: string,
    currentQty: number,
    delta: number
  ) => {
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFCF9] px-4">
        <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 text-[#357A32] animate-spin mb-4" />
        <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-center">
          Récupération de votre sélection
        </span>
      </div>
    );
  }

  // 2. Panier Vide
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center w-full max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-[1.5rem] sm:rounded-[2rem] mb-6 sm:mb-8 shadow-sm border border-gray-50">
            <ShoppingBag className="h-8 w-8 sm:h-10 sm:w-10 text-gray-200" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-seasons text-[#4B2E05] mb-3 sm:mb-4">
            Panier vide.
          </h2>
          <p className="font-seasons mb-8 sm:mb-10 leading-relaxed text-base sm:text-lg md:text-xl">
            Il semble que vous n'ayez pas encore exploré nos récoltes
            authentiques.
          </p>
          <Link
            to="/products"
            className="inline-block bg-[#4B2E05] text-white px-6 sm:px-10 py-3.5 sm:py-5 rounded-xl sm:rounded-2xl font-seasons uppercase text-sm sm:text-base md:text-lg tracking-[0.15em] sm:tracking-[0.2em] hover:bg-[#357A32] transition-all shadow-xl shadow-[#4B2E05]/10"
          >
            Découvrir la collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* HEADER PANIER */}
      <section className="relative py-8 sm:py-12 md:py-20 bg-gray-50 border-b border-gray-100 mb-6 sm:mb-8 md:mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <span className="inline-block px-3 py-1 rounded bg-[#357A32]/10 text-[#357A32] text-[10px] font-bold tracking-[0.2em] uppercase mb-3 sm:mb-4">
            Votre panier
          </span>

          {/* Titre */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-serif text-[#4B2E05] mt-1 sm:mt-2 mb-3 sm:mb-4">
            Ma sélection
          </h1>

          {/* Bouton retour */}
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/products')}
              className="flex items-center text-xs sm:text-sm md:text-base font-serif uppercase tracking-[0.15em] sm:tracking-[0.2em] hover:text-[#357A32] transition-all group"
            >
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 group-hover:-translate-x-1 transition-transform" />
              Continuer mes achats
            </button>
          </div>
        </div>
      </section>

      {/* CONTENU PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 md:py-16 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-start">
       

       {/* LISTE PRODUITS */}
<div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
  {cart.items.map((item: any) => {
    if (!item.product) return null;

    const { _id, name, images, weight, price } = item.product;
    const imageUrl = images?.[0] || '/images/placeholder.png';
    const formattedPrice = (price ?? 0).toFixed(3);

    return (
      <div
        key={_id}
        className="group relative bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-gray-50 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-10 transition-all hover:shadow-2xl hover:shadow-gray-200/40"
      >
        {/* Image produit */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 shrink-0 overflow-hidden rounded-xl sm:rounded-2xl md:rounded-[2rem] bg-[#FDFCF9]">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Infos produit */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <h3 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-seasons text-[#4B2E05] mb-1 sm:mb-2 truncate">
            {name}
          </h3>
          <div className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-50 rounded-md sm:rounded-lg text-xs sm:text-sm md:text-base lg:text-lg font-seasons uppercase tracking-widest mb-2 sm:mb-3 md:mb-4">
            {weight || 'Format Standard'}
          </div>
          <p className="text-[#357A32] font-seasons text-lg sm:text-xl md:text-2xl">
            {formattedPrice}{' '}
            <span className="text-lg sm:text-xl md:text-2xl">DT</span>
          </p>
        </div>

        {/* Contrôles quantité + suppression */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
          <div className="flex items-center bg-[#FDFCF9] rounded-xl sm:rounded-2xl border border-gray-100 p-0.5 sm:p-1">
            <button
              disabled={isUpdating}
              onClick={() => handleQuantityChange(_id, item.quantity, -1)}
              className="p-2 sm:p-2.5 md:p-3 hover:text-[#357A32] text-gray-300 transition-colors disabled:opacity-20"
              aria-label="Diminuer la quantité"
            >
              <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
            </button>
            <span className="w-6 sm:w-7 md:w-8 text-center font-black text-sm sm:text-base text-[#4B2E05]">
              {item.quantity}
            </span>
            <button
              disabled={isUpdating}
              onClick={() => handleQuantityChange(_id, item.quantity, 1)}
              className="p-2 sm:p-2.5 md:p-3 hover:text-[#357A32] text-gray-300 transition-colors disabled:opacity-20"
              aria-label="Augmenter la quantité"
            >
              <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
            </button>
          </div>

          <button
            onClick={() => removeItem(_id)}
            className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 flex items-center justify-center bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl sm:rounded-2xl transition-all shadow-sm"
            title="Supprimer"
            aria-label={`Supprimer ${name}`}
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    );
  })}
</div>

        {/* RÉSUMÉ */}
        <div className="lg:col-span-1 w-full">
          <div className="relative bg-white p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-[0_15px_30px_rgba(0,0,0,0.03)] sm:shadow-[0_30px_60px_rgba(0,0,0,0.05)] lg:sticky lg:top-10 overflow-hidden">
            {/* Accent de couleur en haut */}
            <div className="absolute top-0 left-0 w-full h-1 sm:h-1.5 bg-[#4B2E05]"></div>

            <h2 className="text-xl sm:text-2xl font-seasons tracking-[0.2em] sm:tracking-[0.3em] mb-6 sm:mb-8 md:mb-10 text-center">
              Votre panier
            </h2>

            <div className="space-y-4 sm:space-y-5 md:space-y-6 mb-8 sm:mb-10 md:mb-12">
              <div className="flex justify-between items-end">
                <span className="font-seasons text-sm sm:text-base">
                  Sous-total
                </span>
                <span className="font-seasons text-base sm:text-lg md:text-xl text-[#4B2E05]">
                  {totalAmount.toFixed(3)} DT
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-seasons text-sm sm:text-base">
                  Frais de port
                </span>
                <span className="text-[#357A32] font-bold uppercase text-[8px] sm:text-[9px] tracking-[0.15em] sm:tracking-[0.2em] bg-[#357A32]/5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                  Offerts
                </span>
              </div>

              <div className="h-[1px] w-full bg-gray-50 my-1 sm:my-2" />

              <div className="flex justify-between items-center pt-2 sm:pt-4">
                <span className="font-seasons text-sm sm:text-base tracking-[0.15em] sm:tracking-[0.2em] text-[#4B2E05]">
                  Total TTC
                </span>
                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="font-seasons text-2xl sm:text-3xl text-[#4B2E05]">
                      {totalAmount.toFixed(3)}
                    </span>
                    <span className="font-seasons text-sm sm:text-base text-[#357A32] tracking-widest">
                      DT
                    </span>
                  </div>
                  <span className="block font-seasons text-xs sm:text-sm md:text-base tracking-tighter mt-0.5 sm:mt-1">
                    TVA incluse
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                navigate('/paiement', {
                  state: { items: cart.items, total: totalAmount },
                })
              }
              className="font-seasons text-sm sm:text-base md:text-lg lg:text-xl w-full bg-[#4B2E05] hover:bg-[#357A32] text-white py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] transition-all shadow-xl shadow-[#4B2E05]/10 active:scale-[0.98] group flex items-center justify-center gap-2 sm:gap-3"
            >
              Confirmer ma commande
            </button>

            {/* Section Réassurance */}
            <div className="mt-8 sm:mt-10 md:mt-12 space-y-3 sm:space-y-4 md:space-y-5 border-t border-gray-50 pt-6 sm:pt-8 md:pt-10">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 bg-gray-50 rounded-lg sm:rounded-xl flex items-center justify-center text-[#357A32] border border-gray-100 shrink-0">
                  <ShieldCheck
                    className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-seasons text-xs sm:text-sm md:text-base uppercase tracking-wider sm:tracking-widest text-[#4B2E05]">
                    Paiement sécurisé
                  </p>
                  <p className="font-seasons text-xs sm:text-sm md:text-base text-gray-500">
                    Certifié SSL 256-bit
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <div className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 bg-gray-50 rounded-lg sm:rounded-xl flex items-center justify-center text-[#357A32] border border-gray-100 shrink-0">
                  <Truck
                    className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-seasons text-xs sm:text-sm md:text-base tracking-wider sm:tracking-widest text-[#4B2E05]">
                    Livraison
                  </p>
                  <p className="font-seasons text-xs sm:text-sm md:text-base text-gray-500">
                    Chez vous sous 24/48h
                  </p>
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