import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Loader2, Eye } from 'lucide-react';
import { Product } from '../types';
import { useUpdateCartMutation } from '../state/apiService';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const navigate = useNavigate();
    const isInStock = product.countInStock > 0;
    const [updateCart, { isLoading: isAdding, isSuccess }] = useUpdateCartMutation();

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isInStock) {
            try {
                await updateCart({ productId: product._id, quantity: 1 }).unwrap();
            } catch (err) {
                console.error("Erreur ajout panier:", err);
                if ((err as any).status === 401) {
                    navigate('/login');
                }
            }
        }
    };

    return (
        <Link to={`/product/${product._id}`} className="group block ">
            <div className="mt-1  flex flex-col  bg-white rounded-2xl overflow-hidden transition-all duration-500 border border-gray-100 hover:border-[#357A32]/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                {/* 1. Image & Badges */}
                <div className="relative h-64 overflow-hidden bg-gray-50">
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Badge Promo - Plus élégant */}
                    {product.originalPrice && product.originalPrice > product.price && (
                        <div className="absolute top-4 left-4 bg-[#4B2E05] text-white px-3 py-1 rounded-lg text-[10px] font-bold tracking-widest uppercase shadow-xl">
                            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </div>
                    )}

                    {/* Badge Rupture */}
                    {!isInStock && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center">
                            <span className="text-[#4B2E05] font-serif italic font-bold border-b-2 border-[#4B2E05]">
                                Épuisé
                            </span>
                        </div>
                    )}

                    {/* Quick View Icon */}
                    <div className="absolute top-4 right-4 opacity-0 translate-y-[-10px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                        <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg text-[#357A32]">
                            <Eye className="h-4 w-4" />
                        </div>
                    </div>
                </div>

                {/* 2. Contenu Texte */}
                <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mt-1">
                        <span className="text-[10px] font-bold text-[#357A32] uppercase tracking-[0.15em]">
                            {product.category || "Terroir"}
                        </span>
                        <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-base ml-1 ">
                                {product.rating}
                            </span>
                        </div>
                    </div>

                  <h3 className="font-seasons text-2xl text-[#4B2E05] mb-1 line-clamp-2  group-hover:text-[#357A32] transition-colors">
                        {product.name}
                    </h3>

                    <p className=" h-12 text-base  md:text-lg font-seasons line-clamp-2 mb-6 leading-relaxed">
                        {product.description}
                    </p>

                    {/* 3. Prix & Action */}
                    <div className="mt-1 flex items-center justify-between">
                        <div className="flex flex-col">
                            {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-lg ">
                                    {product.originalPrice.toFixed(3)} DT
                                </span>
                            )}
                            <span className="text-xl font-seasons text-[#4B2E05]">
                                {product.price.toFixed(3)} <span className="text-lg">DT</span>
                            </span>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={!isInStock || isAdding}
                            className={`relative flex items-center justify-center h-12 w-12 rounded-xl transition-all duration-300 ${isInStock
                                    ? 'bg-[#4B2E05] hover:bg-[#357A32] text-white shadow-md'
                                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                }`}
                        >
                            {isAdding ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <ShoppingCart className="h-5 w-5" />
                            )}

                            {/* Petit indicateur de succès */}
                            {isSuccess && (
                                <span className="absolute -top-1 -right-1 bg-[#357A32] text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white animate-ping">
                                </span>
                            )}
                        </button>
                    </div>

                    {/* 4. Détails Techniques (Plus discrets) */}
                    <div className="mt-2 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                        <div className=" tracking-tight">
                            <span className="text-base font-seasons">{product.weight}</span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="font-seasons">{product.origin}</span>
                        </div>

                        <div className="flex items-center gap-2 text-[#357A32] font-bold bg-green-50 px-2 py-0.5 rounded border border-green-100">
                            <div className="w-1.5 h-1.5 bg-[#357A32] rounded-full animate-pulse"></div>
                            <span className="text-[10px] uppercase"> Pur</span>
                        </div>
                    </div>

                </div>
            </div>
        </Link>
    );
};

export default ProductCard;