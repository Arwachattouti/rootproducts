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
    <div className="min-h-screen bg-[#FDFCF9] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center text-[#4B2E05] hover:text-[#357A32] mb-12 font-bold text-[10px] uppercase tracking-widest transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Section Images */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-gray-100 aspect-square">
              <img
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`rounded-2xl overflow-hidden aspect-square border-2 transition-all ${
                      selectedImageIndex === index ? 'border-[#357A32] shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
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
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#357A32]/10 text-[#357A32] rounded-full text-[9px] font-black uppercase tracking-widest w-fit mb-6">
              <div className={`w-1.5 h-1.5 rounded-full ${isInStock ? 'bg-[#357A32] animate-pulse' : 'bg-red-500'}`} />
              {isInStock ? 'En Stock' : 'Épuisé'}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif italic text-[#4B2E05] mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'} />
                ))}
              </div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                {product.rating} / 5 ({product.reviewCount} avis clients)
              </span>
            </div>

            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-4xl font-black text-[#4B2E05]">
                {product.price.toFixed(2)} DT
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-300 line-through font-light">
                  {product.originalPrice.toFixed(2)} DT
                </span>
              )}
            </div>

            <p className="text-gray-500 leading-relaxed mb-10 font-light text-lg">
              {product.description}
            </p>

            {/* Spécifications */}
            <div className="grid grid-cols-2 gap-6 p-6 bg-white rounded-3xl border border-gray-50 shadow-sm mb-10">
              <div>
                <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Poids net</span>
                <span className="text-[#4B2E05] font-bold">{product.weight}</span>
              </div>
              <div>
                <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Origine</span>
                <span className="text-[#4B2E05] font-bold">{product.origin}</span>
              </div>
              <div className="col-span-2">
                <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Bienfaits clés</span>
                <div className="flex flex-wrap gap-2">
                  {product.benefits.map((benefit, index) => (
                    <span key={index} className="text-[10px] font-bold text-[#357A32] bg-[#357A32]/5 px-3 py-1 rounded-lg">
                      • {benefit}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Section */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center bg-white border border-gray-100 rounded-2xl p-1 shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-[#4B2E05] hover:text-[#357A32] transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-black text-[#4B2E05]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}
                    className="p-3 text-[#4B2E05] hover:text-[#357A32] transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!isInStock || isAdding}
                  className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-[#4B2E05]/10 ${
                    isInStock
                      ? 'bg-[#4B2E05] text-white hover:bg-[#357A32] transform hover:-translate-y-1'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isAdding ? <Loader2 className="animate-spin h-4 w-4" /> : <ShoppingCart size={18} />}
                  {isInStock ? 'Ajouter au panier' : 'Rupture de stock'}
                </button>

                <button className="p-4 border border-gray-100 rounded-2xl text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-sm">
                  <Heart size={20} />
                </button>
              </div>
            </div>

            {/* Réassurance */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-gray-50 pt-10">
              <div className="flex flex-col items-center text-center group">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <Truck className="text-[#357A32]" size={20} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-[#4B2E05]">Livraison 24/48h</span>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <Shield className="text-[#357A32]" size={20} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-[#4B2E05]">Paiement Cash</span>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <Award className="text-[#357A32]" size={20} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-[#4B2E05]">Certifié Bio</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;