import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Heart, Truck, Shield, Award ,Loader2} from 'lucide-react';
import { useGetProductDetailsQuery } from '../../state/apiService';
// Assurez-vous que le type 'Product' ici est identique à l'interface 'IProduct' de Mongoose (sans les propriétés Mongoose comme .save())
import { Product } from '../../types';
import { useUpdateCartMutation } from '../../state/apiService';
import { useCart } from '../../context/CartContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [updateCart, { isLoading: isAdding }] = useUpdateCartMutation();
  const {
    data: product,
    isLoading,
    isError
  } = useGetProductDetailsQuery(id || '', {
    skip: !id, // N'appelle pas l'API si l'ID est manquant
  });
  const isInStock = product ? product.countInStock > 0 : false;

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h2>
          <button
            onClick={() => navigate('/products')}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Retour aux produits
          </button>
        </div>
      </div>
    );
  }

 const handleAddToCart = async () => {
    if (product) {
      try {
        // 3. Appelez le serveur au lieu du context local
        await updateCart({ 
          productId: product._id, 
          quantity: quantity 
        }).unwrap();
        
        // Optionnel : Rediriger vers le panier pour voir le résultat
        navigate('/panier');
      } catch (err) {
        console.error("Erreur lors de l'ajout au panier:", err);
        alert("Veuillez vous connecter pour ajouter des produits.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-black hover:text-green-700 mb-8 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
              <img
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`rounded-lg overflow-hidden border-2 ${selectedImageIndex === index ? 'border-green-500' : 'border-gray-200'
                      }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                      }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600">
                {product.rating} ({product.reviewCount} avis)
              </span>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-black">
                {product.price.toFixed(2)}€
              </span>
              {product.originalPrice && (
                <span className="text-xl text-black line-through">
                  {product.originalPrice.toFixed(2)}€
                </span>
              )}
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

            {/* Product Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center">
                <span className="font-medium text-gray-900 w-24">Poids:</span>
                <span className="text-gray-700">{product.weight}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-900 w-24">Origine:</span>
                <span className="text-gray-700">{product.origin}</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium text-gray-900 w-24">Bienfaits:</span>
                <div className="flex-1">
                  {product.benefits.map((benefit, index) => (
                    <span key={index} className="inline-block bg-green-100 text-green-800 text-sm px-2 py-1 rounded-md mr-2 mb-2">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-medium text-gray-900">Quantité:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  // Utilisation de la nouvelle variable 'isInStock'
                 disabled={!isInStock || isAdding}
                  className={`flex-1 flex items-center justify-center px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-md ${
                    // Utilisation de la nouvelle variable 'isInStock'
                    isInStock
                      ? 'bg-black hover:bg-green-800 text-white transform hover:scale-[1.01]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  {/* Affichage basé sur isInStock */}
                  {isAdding ? <Loader2 className="animate-spin h-5 w-5" /> : <ShoppingCart className="h-5 w-5 mr-3" />}
                  {isInStock ? 'Ajouter au panier' : 'Rupture de stock'}
                </button>
                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center">
                  <Truck className="h-8 w-8 text-green-600 mb-2" />
                  <span className="text-sm text-gray-600">Livraison gratuite</span>
                </div>
                <div className="flex flex-col items-center">
                  <Shield className="h-8 w-8 text-green-600 mb-2" />
                  <span className="text-sm text-gray-600">Paiement sécurisé</span>
                </div>
                <div className="flex flex-col items-center">
                  <Award className="h-8 w-8 text-green-600 mb-2" />
                  <span className="text-sm text-gray-600">Qualité garantie</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients Section */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ingrédients & Composition</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingrédients</h3>
              <ul className="space-y-2">
                {product.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Conseils d'utilisation</h3>
              <p className="text-gray-700 leading-relaxed">
                Pour préparer une délicieuse mloukhia, dissolvez 2 cuillères à soupe du produit dans
                500ml de bouillon chaud. Laissez mijoter 15 minutes en remuant régulièrement.
                Servez avec du riz blanc et de la viande de votre choix.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;