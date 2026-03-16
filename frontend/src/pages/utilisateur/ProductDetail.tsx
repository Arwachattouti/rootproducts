// frontend/src/pages/ProductDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Star, ShoppingCart, Heart, Truck,
  Shield, Award, Loader2, Minus, Plus, AlertCircle,
} from 'lucide-react';
import {
  useGetProductDetailsQuery,
  useUpdateCartMutation,
} from '../../state/apiService';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [updateCart, { isLoading: isAdding }] = useUpdateCartMutation();
  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductDetailsQuery(id || '', { skip: !id });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const isInStock = product ? product.countInStock > 0 : false;

  const handleAddToCart = async () => {
    if (product) {
      try {
        await updateCart({
          productId: product._id,
          quantity,
        }).unwrap();
        navigate('/panier');
      } catch (err) {
        console.error('Erreur:', err);
        alert('Veuillez vous connecter pour gérer votre panier.');
      }
    }
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFCF9] flex flex-col items-center justify-center px-4">
        <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-[#357A32] mb-3 sm:mb-4" />
        <p
          className="
            text-[9px] sm:text-xs
            font-seasons uppercase tracking-widest text-gray-400
          "
        >
          Préparation de la fiche...
        </p>
      </div>
    );
  }

  // ── Error ──
  if (isError || !product) {
    return (
      <div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center px-4">
        <div
          className="
            bg-white p-6 sm:p-8 md:p-10
            rounded-2xl sm:rounded-[2rem]
            shadow-sm text-center
            max-w-sm sm:max-w-md
            border border-gray-100
          "
        >
          <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-red-400 mx-auto mb-3 sm:mb-4" />
          <h2
            className="
              font-seasons text-[#4B2E05]
              text-lg sm:text-xl md:text-2xl
              mb-3 sm:mb-4
            "
          >
            Produit introuvable
          </h2>
          <button
            onClick={() => navigate('/products')}
            className="
              bg-[#4B2E05] text-white
              px-6 py-2.5 sm:px-8 sm:py-3
              rounded-lg sm:rounded-xl
              hover:bg-[#357A32] transition-all
              font-seasons
              text-[9px] sm:text-[10px]
              uppercase tracking-widest
            "
          >
            Retour à la boutique
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF9] pb-24 sm:pb-12 md:pb-20">
      <div
        className="
          max-w-7xl mx-auto
          px-3 sm:px-4 md:px-6 lg:px-8
          py-3 sm:py-6 md:py-8
        "
      >
        {/* ── Bouton Retour ── */}
        <button
          onClick={() => navigate(-1)}
          className="
            group flex items-center
            text-[#4B2E05] hover:text-[#357A32]
            mb-4 sm:mb-8 md:mb-12
            font-seasons
            text-[10px] sm:text-xs md:text-sm
            uppercase tracking-widest
            transition-colors
          "
        >
          <ArrowLeft
            className="
              h-3.5 w-3.5 sm:h-4 sm:w-4
              mr-1.5 sm:mr-2
              group-hover:-translate-x-1 transition-transform
            "
          />
          Retour
        </button>

        {/* ── Layout principal ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-start">

          {/* ═══════════════════
              SECTION IMAGES
          ═══════════════════ */}
          <div className="space-y-3 sm:space-y-4">
            {/* Image principale */}
            <div
              className="
                bg-white overflow-hidden border border-gray-100
                rounded-2xl sm:rounded-3xl md:rounded-[2.5rem]
                shadow-sm
                aspect-square relative
              "
            >
              <img
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="
                  w-full h-full object-cover
                  transition-transform duration-700
                  sm:hover:scale-105
                "
              />

              {/* Badge Promo */}
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <div
                    className="
                      absolute top-3 left-3 sm:top-4 sm:left-4
                      bg-[#4B2E05] text-white
                      px-2 py-0.5 sm:px-3 sm:py-1
                      rounded-md sm:rounded-lg
                      text-[8px] sm:text-[10px]
                      font-seasons font-bold
                    "
                  >
                    -{Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )}
                    %
                  </div>
                )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div
                className="
                  flex gap-2 sm:gap-3
                  overflow-x-auto pb-2
                  scrollbar-hide snap-x snap-mandatory
                  sm:grid sm:grid-cols-4 sm:gap-3 md:gap-4
                  sm:overflow-visible sm:pb-0
                "
              >
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`
                      flex-shrink-0 snap-start
                      w-16 h-16 sm:w-auto sm:h-auto
                      rounded-lg sm:rounded-xl
                      overflow-hidden aspect-square
                      border-2 transition-all
                      ${selectedImageIndex === index
                        ? 'border-[#357A32] shadow-md scale-105'
                        : 'border-transparent opacity-50 hover:opacity-80'
                      }
                    `}
                  >
                    <img
                      src={image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ═══════════════════
              SECTION INFOS
          ═══════════════════ */}
          <div className="flex flex-col">

            {/* Badge stock */}
            <div
              className="
                inline-flex items-center gap-1.5 sm:gap-2
                px-2 py-0.5 sm:px-2.5 sm:py-1
                bg-[#357A32]/10 text-[#357A32]
                rounded-full
                text-[7px] sm:text-[8px] md:text-[9px]
                font-black uppercase tracking-widest
                w-fit mb-3 sm:mb-4
              "
            >
              <div
                className={`
                  w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full
                  ${isInStock ? 'bg-[#357A32] animate-pulse' : 'bg-red-500'}
                `}
              />
              {isInStock ? 'En Stock' : 'Épuisé'}
            </div>

            {/* Nom du produit */}
            <h1
              className="
                font-seasons text-[#4B2E05]
                text-xl sm:text-3xl md:text-4xl lg:text-5xl
                mb-2 sm:mb-3
                leading-tight
              "
            >
              {product.name}
            </h1>

            {/* Notes + Avis */}
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`
                      h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4
                      ${i < Math.floor(product.rating)
                        ? 'fill-current'
                        : 'text-gray-200'
                      }
                    `}
                  />
                ))}
              </div>
              <span
                className="
                  font-seasons text-gray-500
                  text-[9px] sm:text-[10px] md:text-xs
                  tracking-wider
                "
              >
                {product.rating} ({product.reviewCount} avis)
              </span>
            </div>

            {/* Prix */}
            <div className="flex items-baseline gap-2 sm:gap-3 mb-4 sm:mb-6">
              <span
                className="
                  font-seasons text-[#4B2E05]
                  text-2xl sm:text-3xl md:text-4xl
                  font-bold
                "
              >
                {product.price.toFixed(3)}
                <span className="text-base sm:text-lg md:text-xl ml-1">
                  DT
                </span>
              </span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <span
                    className="
                      font-seasons text-gray-300 line-through
                      text-sm sm:text-base md:text-lg
                    "
                  >
                    {product.originalPrice.toFixed(3)}
                  </span>
                )}
            </div>

            {/* Description */}
            <p
              className="
                font-seasons leading-relaxed
                text-sm sm:text-base md:text-lg
                text-gray-600
                mb-6 sm:mb-8
              "
            >
              {product.description}
            </p>

            {/* ── Spécifications ── */}
            <div
              className="
                grid grid-cols-2 gap-3 sm:gap-4
                p-4 sm:p-5
                bg-white rounded-xl sm:rounded-2xl
                border border-gray-100 shadow-sm
                mb-6 sm:mb-8
              "
            >
              <div>
                <span
                  className="
                    block font-seasons uppercase tracking-widest
                    text-gray-400
                    text-[9px] sm:text-[10px] md:text-xs
                    mb-0.5 sm:mb-1
                  "
                >
                  Poids net
                </span>
                <span
                  className="
                    text-[#4B2E05] font-seasons font-medium
                    text-xs sm:text-sm md:text-base
                  "
                >
                  {product.weight}
                </span>
              </div>
              <div>
                <span
                  className="
                    block font-seasons uppercase tracking-widest
                    text-gray-400
                    text-[9px] sm:text-[10px] md:text-xs
                    mb-0.5 sm:mb-1
                  "
                >
                  Origine
                </span>
                <span
                  className="
                    text-[#4B2E05] font-seasons font-medium
                    text-xs sm:text-sm md:text-base
                  "
                >
                  {product.origin}
                </span>
              </div>

              {/* Bienfaits */}
              <div className="col-span-2 pt-3 border-t border-gray-50">
                <span
                  className="
                    block font-seasons uppercase tracking-widest
                    text-gray-400
                    text-[9px] sm:text-[10px] md:text-xs
                    mb-1.5 sm:mb-2
                  "
                >
                  Bienfaits
                </span>
                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                  {product.benefits.map((benefit, index) => (
                    <span
                      key={index}
                      className="
                        font-seasons
                        text-[#357A32] bg-[#357A32]/5
                        px-1.5 py-0.5 sm:px-2 sm:py-1
                        rounded sm:rounded-md
                        text-[10px] sm:text-xs md:text-sm
                      "
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Actions (Desktop) ── */}
            <div className="hidden sm:block space-y-4">
              <div className="flex items-center gap-3">
                {/* Quantité */}
                <div
                  className="
                    flex items-center
                    bg-white border border-gray-200
                    rounded-lg sm:rounded-xl
                    p-0.5 sm:p-1
                    shadow-sm
                  "
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="
                      p-1.5 sm:p-2
                      text-[#4B2E05]
                      hover:bg-gray-50 rounded-md
                      transition-colors
                    "
                  >
                    <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                  <span
                    className="
                      w-8 sm:w-10
                      text-center font-bold
                      text-sm sm:text-base
                    "
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(
                        Math.min(product.countInStock, quantity + 1)
                      )
                    }
                    className="
                      p-1.5 sm:p-2
                      text-[#4B2E05]
                      hover:bg-gray-50 rounded-md
                      transition-colors
                    "
                  >
                    <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                </div>

                {/* Ajouter au panier */}
                <button
                  onClick={handleAddToCart}
                  disabled={!isInStock || isAdding}
                  className={`
                    flex-1 flex items-center justify-center gap-2
                    h-11 sm:h-[52px]
                    rounded-lg sm:rounded-xl
                    font-seasons font-bold
                    text-xs sm:text-sm md:text-base
                    tracking-wider
                    transition-all shadow-lg
                    ${isInStock
                      ? 'bg-[#4B2E05] text-white hover:bg-[#357A32] active:scale-[0.98]'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {isAdding ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    <ShoppingCart className="h-4 w-4" />
                  )}
                  {isInStock ? 'Ajouter au panier' : 'Épuisé'}
                </button>

                {/* Favori 
                <button
                  className="
                    h-11 sm:h-[52px] px-3 sm:px-4
                    border border-gray-200
                    rounded-lg sm:rounded-xl
                    text-gray-400
                    hover:text-red-400 hover:border-red-200
                    active:bg-gray-50
                    transition-all
                  "
                >
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>*/}
              </div>
            </div>

            {/* ── Réassurance ── */}
            <div
              className="
                mt-6 sm:mt-8 md:mt-10
                grid grid-cols-3 gap-2 sm:gap-3
                border-t border-gray-100
                pt-6 sm:pt-8
              "
            >
              {[
                { icon: <Truck />, text: 'Livraison 48h' },
                { icon: <Shield />, text: 'Paiement Cash' },
                { icon: <Award />, text: 'Produit Pur' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className="
                      w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10
                      bg-white rounded-lg sm:rounded-xl
                      flex items-center justify-center
                      shadow-sm border border-gray-50
                      mb-1.5 sm:mb-2
                    "
                  >
                    <span className="text-[#357A32]">
                      {React.cloneElement(
                        item.icon as React.ReactElement,
                        {
                          className:
                            'h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-[18px] md:w-[18px]',
                        }
                      )}
                    </span>
                  </div>
                  <span
                    className="
                      font-seasons text-[#4B2E05]
                      text-[9px] sm:text-xs md:text-sm
                      leading-tight
                    "
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          BARRE D'ACTION STICKY — MOBILE UNIQUEMENT
      ═══════════════════════════════════════ */}
      <div
        className="
          fixed bottom-0 left-0 right-0 z-50
          sm:hidden
          bg-white/95 backdrop-blur-md
          border-t border-gray-200
          px-3 py-3
          safe-area-bottom
        "
      >
        <div className="flex items-center gap-2">
          {/* Quantité compacte */}
          <div
            className="
              flex items-center
              bg-gray-50 border border-gray-200
              rounded-lg
              h-10
            "
          >
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-2 h-full text-[#4B2E05]"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-6 text-center font-bold text-xs">
              {quantity}
            </span>
            <button
              onClick={() =>
                setQuantity(
                  Math.min(product.countInStock, quantity + 1)
                )
              }
              className="px-2 h-full text-[#4B2E05]"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Bouton principal */}
          <button
            onClick={handleAddToCart}
            disabled={!isInStock || isAdding}
            className={`
              flex-1 flex items-center justify-center gap-1.5
              h-10 rounded-lg
              font-seasons font-bold
              text-[11px] tracking-wider
              transition-all
              ${isInStock
                ? 'bg-[#4B2E05] text-white active:scale-[0.97]'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isAdding ? (
              <Loader2 className="animate-spin h-3.5 w-3.5" />
            ) : (
              <ShoppingCart className="h-3.5 w-3.5" />
            )}
            {isInStock
              ? `Ajouter · ${(product.price * quantity).toFixed(3)} DT`
              : 'Épuisé'}
          </button>

          {/* Favori 
          <button
            className="
              h-10 w-10
              flex items-center justify-center
              border border-gray-200
              rounded-lg
              text-gray-400
              active:text-red-400
            "
          >
            <Heart className="h-4 w-4" />
          </button>*/}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;