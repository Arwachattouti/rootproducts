import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, ShoppingCart, Heart, Truck, 
  Shield, Award, Loader2, Minus, Plus, AlertCircle 
} from 'lucide-react';
import { useGetProductDetailsQuery, useUpdateCartMutation } from '../../state/apiService';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const [updateCart, { isLoading: isAdding }] = useUpdateCartMutation();
  const { data: product, isLoading, isError } = useGetProductDetailsQuery(id || '', {
    skip: !id,
  });

  // Scroll en haut au chargement
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const isInStock = product ? product.countInStock > 0 : false;

  const handleAddToCart = async () => {
    if (product) {
      try {
        await updateCart({
          productId: product._id,
          quantity: quantity
        }).unwrap();
        navigate('/panier');
      } catch (err) {
        console.error("Erreur:", err);
        alert("Veuillez vous connecter pour gérer votre panier.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFCF9] flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#357A32] mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Préparation de la fiche...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center px-4">
        <div className="bg-white p-10 rounded-[2rem] shadow-sm text-center max-w-md border border-gray-100">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-serif italic text-[#4B2E05] mb-4">Produit introuvable</h2>
          <button
            onClick={() => navigate('/products')}
            className="bg-[#4B2E05] text-white px-8 py-3 rounded-xl hover:bg-[#357A32] transition-all font-bold text-[10px] uppercase tracking-widest"
          >
            Retour à la boutique
          </button>
        </div>
      </div>
    );
  }

  return (
   <div className="min-h-screen bg-[#FDFCF9] pb-12 sm:pb-20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
    
    {/* Navigation - Plus compacte sur mobile */}
    <button
      onClick={() => navigate(-1)}
      className="group flex items-center text-[#4B2E05] hover:text-[#357A32] mb-6 sm:mb-12 font-bold text-sm uppercase tracking-widest transition-colors"
    >
      <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
      Retour
    </button>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
      
      {/* Section Images - Coins légèrement moins arrondis sur mobile pour maximiser l'image */}
      <div className="space-y-4">
        <div className="bg-white rounded-3xl sm:rounded-[2.5rem] shadow-sm overflow-hidden border border-gray-100 aspect-square relative">
          <img
            src={product.images[selectedImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 sm:hover:scale-105"
          />
          {/* Badge Promo flottant sur l'image en mobile */}
          {product.originalPrice && product.originalPrice > product.price && (
             <div className="absolute top-4 left-4 bg-[#4B2E05] text-white px-3 py-1 rounded-lg text-[10px] font-bold">
               PROMO
             </div>
          )}
        </div>
        
        {product.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide sm:grid sm:grid-cols-4 sm:gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`flex-shrink-0 w-20 h-20 sm:w-auto sm:h-auto rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                  selectedImageIndex === index ? 'border-[#357A32] shadow-md' : 'border-transparent opacity-60'
                }`}
              >
                <img src={image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Section Infos */}
      <div className="flex flex-col">
        {/* Badge Stock - Plus discret */}
        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#357A32]/10 text-[#357A32] rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest w-fit mb-4">
          <div className={`w-1.5 h-1.5 rounded-full ${isInStock ? 'bg-[#357A32] animate-pulse' : 'bg-red-500'}`} />
          {isInStock ? 'En Stock' : 'Épuisé'}
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif italic text-[#4B2E05] mb-3">{product.name}</h1>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className={i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'} />
            ))}
          </div>
          <span className="text-[10px] sm:text-sm tracking-widest text-gray-500">
            {product.rating} ({product.reviewCount} avis)
          </span>
        </div>

        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-3xl sm:text-4xl font-black text-[#4B2E05]">
            {product.price.toFixed(3)} <span className="text-lg">DT</span>
          </span>
          {product.originalPrice && (
            <span className="text-lg text-gray-300 line-through font-light">
              {product.originalPrice.toFixed(3)}
            </span>
          )}
        </div>

        <p className="leading-relaxed mb-8 text-gray-600 text-base sm:text-lg">
          {product.description}
        </p>

        {/* Spécifications - Format Badge sur Mobile */}
        <div className="grid grid-cols-2 gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm mb-8">
          <div>
            <span className="block text-sm text-gray-400 uppercase tracking-widest mb-1">Poids net</span>
            <span className="text-[#4B2E05] font-bold text-sm sm:text-base">{product.weight}</span>
          </div>
          <div>
            <span className="block text-sm text-gray-400 uppercase tracking-widest mb-1">Origine</span>
            <span className="text-[#4B2E05] font-bold text-sm sm:text-base">{product.origin}</span>
          </div>
          <div className="col-span-2 pt-3 border-t border-gray-50">
            <span className="block text-sm text-gray-400 uppercase tracking-widest mb-2">Bienfaits</span>
            <div className="flex flex-wrap gap-1.5">
              {product.benefits.map((benefit, index) => (
                <span key={index} className="text-sm font-bold text-[#357A32] bg-[#357A32]/5 px-2 py-1 rounded-md">
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Section - Sticky-ready pour mobile */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {/* Sélecteur de quantité plus compact */}
            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 text-[#4B2E05]"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center font-bold text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}
                className="p-2 text-[#4B2E05]"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Bouton Ajouter - Prend le reste de la place */}
            <button
              onClick={handleAddToCart}
              disabled={!isInStock || isAdding}
              className={`flex-1 flex items-center justify-center gap-2 h-[52px] rounded-xl font-bold text-sm  tracking-widest transition-all shadow-lg ${
                isInStock
                  ? 'bg-[#4B2E05] text-white active:scale-95'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isAdding ? <Loader2 className="animate-spin h-4 w-4" /> : <ShoppingCart size={16} />}
              {isInStock ? 'Ajouter au panier' : 'Épuisé'}
            </button>

            <button className="h-[52px] px-4 border border-gray-200 rounded-xl text-gray-400 active:bg-gray-50 transition-all">
              <Heart size={18} />
            </button>
          </div>
        </div>

        {/* Réassurance - Horizontale et scrollable sur mobile */}
        <div className="mt-10 flex justify-between sm:grid sm:grid-cols-3 gap-2 border-t border-gray-100 pt-8">
          {[
            { icon: <Truck size={18}/>, text: "Livraison 48h" },
            { icon: <Shield size={18}/>, text: "Paiement Cash" },
            { icon: <Award size={18}/>, text: "Produit Pur" }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center flex-1">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mb-2 border border-gray-50">
                <span className="text-[#357A32] ">{item.icon}</span>
              </div>
              <span className="text-base  test-serif tracking-tighter text-[#4B2E05] text-center">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default ProductDetail;