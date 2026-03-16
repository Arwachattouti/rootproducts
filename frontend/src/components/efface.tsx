import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Loader2, Eye } from 'lucide-react';
import { useUpdateCartMutation } from '../state/apiService';

// Assurez-vous que originalPrice est bien dans votre interface Product (types.ts)
export interface Product {
    _id: string;
    name: string;
    price: number;
    originalPrice?: number; 
    images: string[];
    category: string;
    countInStock: number;
    rating: number;
    weight: string;
    origin: string;
}

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const navigate = useNavigate();
    const isInStock = product.countInStock > 0;
    const [updateCart, { isLoading: isAdding, isSuccess }] = useUpdateCartMutation();

    // Calcul du pourcentage de réduction
    const discountPercentage = product.originalPrice && product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isInStock) {
            try {
                await updateCart({ productId: product._id, quantity: 1 }).unwrap();
            } catch (err: any) {
                console.error("Erreur ajout panier:", err);
                if (err?.status === 401) {
                    navigate('/login');
                }
            }
        }
    };

    return (
        <Link to={`/product/${product._id}`} className="group block w-full">
            <div className="flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-500 border border-gray-100 hover:border-[#357A32]/20 hover:shadow-[0_15px_35px_rgba(0,0,0,0.05)] h-[300px] md:h-[500px]">
                
                {/* 1. Image & Badges */}
                <div className="relative h-48 md:h-64 overflow-hidden bg-gray-50 flex-shrink-0">
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Badge Promo Unique et stylé */}
                    {discountPercentage > 0 && (
                        <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-rose-600 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold tracking-wider shadow-lg z-10">
                            -{discountPercentage}%
                        </div>
                    )}

                    {/* Badge Rupture */}
                    {!isInStock && (
                        <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-[2px] flex items-center justify-center">
                            <span className="text-[#4B2E05] font-serif italic font-bold border-b-2 border-[#4B2E05] text-sm md:text-base">
                                Épuisé
                            </span>
                        </div>
                    )}

                    {/* Quick View (Desktop uniquement) */}
                    <div className="absolute top-3 right-3 opacity-0 translate-y-[-10px] md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-500 hidden md:block z-10">
                        <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg text-[#357A32]">
                            <Eye className="h-4 w-4" />
                        </div>
                    </div>
                </div>

                {/* 2. Contenu Texte */}
                <div className="p-3 md:p-6 flex flex-col flex-grow min-h-[180px]">
                    <div className="flex justify-between items-start">
                        <span className="text-[8px] md:text-[10px] font-bold text-[#357A32] uppercase tracking-[0.1em] md:tracking-[0.15em]">
                            {product.category || "Terroir"}
                        </span>
                        <div className="flex items-center">
                            <Star className="h-2.5 w-2.5 md:h-3 md:w-3 text-yellow-400 fill-current" />
                            <span className="text-[10px] md:text-sm ml-1 font-semibold">{product.rating}</span>
                        </div>
                    </div>

                    <h3 className="font-seasons text-sm md:text-2xl text-[#4B2E05] mt-1.5 md:mt-2 mb-1 md:mb-2 line-clamp-2 group-hover:text-[#357A32] transition-colors leading-tight min-h-[40px] md:min-h-[56px]">
                        {product.name}
                    </h3>

                    {/* 3. Prix & Action */}
                    <div className="mt-auto md:mt-4 flex items-center justify-between">
                        {/* Bloc d'affichage des prix */}
                        <div className="flex flex-col">
                            {/* Ancien Prix barré */}
                            {discountPercentage > 0 && product.originalPrice && (
                                <span className="text-[9px] md:text-[13px] line-through text-gray-400 font-medium">
                                    {product.originalPrice.toFixed(3)} DT
                                </span>
                            )}
                            
                            {/* Prix Actuel */}
                            <span className={`text-sm md:text-xl font-seasons font-bold ${discountPercentage > 0 ? 'text-rose-600' : 'text-[#4B2E05]'}`}>
                                {product.price.toFixed(3)} <span className="text-[10px] md:text-sm text-[#4B2E05]">DT</span>
                            </span>
                        </div>

                        {/* Bouton Ajouter */}
                        <button
                            onClick={handleAddToCart}
                            disabled={!isInStock || isAdding}
                            className={`relative flex items-center justify-center h-8 w-8 md:h-12 md:w-12 rounded-lg md:rounded-xl transition-all duration-300 ${
                                isInStock
                                    ? 'bg-[#4B2E05] hover:bg-[#357A32] text-white shadow-md active:scale-95'
                                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                            }`}
                        >
                            {isAdding ? (
                                <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                            ) : (
                                <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
                            )}

                            {isSuccess && (
                                <span className="absolute -top-1 -right-1 bg-[#357A32] text-white text-[8px] w-3 h-3 md:w-4 md:h-4 flex items-center justify-center rounded-full border border-white animate-ping"></span>
                            )}
                        </button>
                    </div>

                    {/* 4. Détails Techniques (Desktop) */}
                    <div className="mt-4 pt-4 border-t border-gray-100 hidden md:flex items-center justify-between text-sm">
                        <div className="tracking-tight text-gray-600">
                            <span className="font-seasons">{product.weight}</span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="font-seasons">{product.origin}</span>
                        </div>

                        <div className="flex items-center gap-2 text-[#357A32] font-bold bg-green-50 px-2 py-0.5 rounded border border-green-100">
                            <div className="w-1.5 h-1.5 bg-[#357A32] rounded-full animate-pulse"></div>
                            <span className="text-[9px] uppercase">Pur</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;