import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Loader2 } from 'lucide-react';
// Assurez-vous que '../types' contient bien l'interface Product mise à jour
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useUpdateCartMutation } from '../state/apiService';
interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addItem } = useCart();
    const navigate = useNavigate();
    // Vérification de stock (plus simple)
    const isInStock = product.countInStock > 0;
    const [updateCart, { isLoading: isAdding, isSuccess }] = useUpdateCartMutation();

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isInStock) {
            try {
                // Envoi à la base de données via RTK Query
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

        <Link to={`/product/${product._id}`} className="group">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-100 hover:border-green-200">
                <div className="relative h-64 overflow-hidden">
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />

                    {/* Affichage de la promotion */}
                    {product.originalPrice && product.originalPrice > product.price && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </div>
                    )}

                    {/* Affichage Rupture de Stock */}
                    {!isInStock && (
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
                            <div className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold text-sm shadow-lg">
                                Rupture de Stock
                            </div>
                        </div>
                    )}

                    {/* Quick view button */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {/* Ajustement: Si le Quick View n'est pas implémenté, 
                vous pouvez en faire un bouton Heart/Wishlist ou le laisser pour plus tard.
            */}
                        <button
                            className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                            onClick={(e) => {
                                e.preventDefault();
                                // Logique Quick View ou Wishlist ici
                            }}
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-6 bg-gradient-to-b from-white to-gray-50">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                        {product.name}
                    </h3>

                    <p className="text-gray-600 mb-3 line-clamp-2 text-sm"> {/* Ajustement de la taille de police pour la description */}
                        {product.description}
                    </p>

                    <div className="flex items-center mb-3">
                        {/* ... Affichage des étoiles (Déjà correct) ... */}
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < Math.floor(product.rating)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-gray-500 ml-2">
                            ({product.reviewCount} avis)
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-black">
                                {product.price.toFixed(2)}€
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-lg text-gray-500 line-through">
                                    {product.originalPrice.toFixed(2)}€
                                </span>
                            )}
                        </div>

                        <button
                            onClick={handleAddToCart}
                            // CORRECTION 2: Utiliser la variable 'isInStock' ou 'product.countInStock > 0'
                            disabled={!isInStock || isAdding}
                            className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${isInStock
                                    ? 'bg-black hover:bg-gray-900 text-white'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none transform-none'
                                }`}>
                            <div className="relative mr-2">
                                {isAdding ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (

                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                )}

                                {/* LE DÉCLENCHEUR ROUGE (Badge) */}
                                {isSuccess && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                                        1
                                    </span>
                                )}
                            </div>
                            {/* Affichage du texte basé sur isInStock */}
                            <span>{isAdding ? '...' : isInStock ? 'Ajouter' : 'Indisponible'}</span>
                        </button>

                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 text-sm text-gray-500 flex justify-between">
                        <span>
                            Poids: {product.weight} • Origine: {product.origin}
                        </span>
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                            <span className="text-xs">Authentique</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;