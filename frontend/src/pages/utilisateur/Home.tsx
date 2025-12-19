// frontend/src/pages/Home.tsx

import React from 'react';
import { Link } from 'react-router-dom';
// Ajout de Loader2 et AlertCircle pour les états de chargement/erreur
import { Leaf, Heart, Scaling as Seedling, ArrowRight, Star, Loader2, AlertCircle } from 'lucide-react'; 
import ProductCard from '../../components/ProductCard';
import background from "../../data/best.jpg";
import { useGetProductsQuery } from '../../state/apiService'; 
// -----------------------------

const Home: React.FC = () => {
  // 💡 Utilisez le hook RTK Query pour charger les produits
  const { 
    data: products = [], // Renomme 'data' en 'products' et utilise [] par défaut
    isLoading, 
    error 
  } = useGetProductsQuery(); 

  // Filtrer les 3 premiers produits (sera vide si isLoading est true, ou si error)
  const featuredProducts = products.slice(0, 3);
  
  // Fonction pour gérer le rendu des produits phares (chargement/erreur/données)
  const renderFeaturedProducts = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <p className="ml-3 text-lg text-gray-600">Chargement des produits phares...</p>
        </div>
      );
    }

    if (error) {
       // Tente d'afficher un message d'erreur plus précis si disponible
       const errorMessage = (error as any)?.data?.message || 'Erreur lors du chargement des produits phares.';
       return (
        <div className="flex justify-center items-center py-10 text-red-600">
            <AlertCircle className="h-6 w-6 mr-2" />
            <p className="ml-2">{errorMessage}</p>
        </div>
      );
    }
    
    // Afficher les produits si tout va bien
    if (featuredProducts.length === 0) {
        return (
             <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Aucun produit phare disponible pour le moment.</p>
            </div>
        );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {featuredProducts.map((product) => (
          <ProductCard key={product._id || product._id} product={product} /> 
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
    {/* Hero Section */}
<section
  className="relative h-[600px] flex items-center bg-cover bg-center"
  style={{ backgroundImage: `url(${background})` }}
>
  {/* Overlay pour assombrir l'image et faire ressortir le texte blanc */}
  <div className="absolute inset-0 bg-black/40"></div>

  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
    <div className="max-w-2xl">
      <h1 className="text-5xl md:text-6xl font-bold text-white">
        L'excellence de la tradition tunisienne
      </h1>
      <p className="text-xl text-white/90 mb-8 leading-relaxed">
        Root Product est un concept qui assure une variété locale, une alimentation durable et une nutrition de qualité.
      </p>
      <Link
        to="/products"
        className="inline-flex items-center bg-[#7B3F00] hover:bg-[#5E2F00] text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
      >
        Découvrir nos produits
        <ArrowRight className="ml-2 h-5 w-5" />
      </Link>
    </div>
  </div>
</section>

      {/* Avantages Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Leaf className="h-10 w-10 text-green-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">100% Naturel</h3>
              <p className="text-gray-600">Des ingrédients purs, sans additifs ni conservateurs, pour une alimentation saine.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Heart className="h-10 w-10 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Qualité Premium</h3>
              <p className="text-gray-600">Sélection rigoureuse des meilleures mloukhia pour un goût authentique inégalé.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Seedling className="h-10 w-10 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Commerce Équitable</h3>
              <p className="text-gray-600">Soutien direct aux producteurs locaux pour un développement durable de la région.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Nos produits phares
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Découvrez nos best-sellers, soigneusement sélectionnés pour vous.
          </p>

          {/* 💡 Rendu des produits chargé via RTK Query */}
          {renderFeaturedProducts()}
          
          <div className="mt-12">
            <Link
              to="/products"
              className="inline-flex items-center text-lg font-medium text-back hover:text-green-800"
            >
              Voir tous les produits <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Témoignages Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-12">
            Ce que disent nos clients
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-500">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <p className="text-sm text-gray-500 ml-3">Il y a 2 jours</p>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-gray-900">Fatima Z.</div>
              </div>
              <p className="text-gray-700 italic">
                "La meilleure mloukhia que j'ai goûtée depuis longtemps ! Le goût est authentique et la qualité irréprochable."
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-500">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5" />
                </div>
                <p className="text-sm text-gray-500 ml-3">Il y a 5 jours</p>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-gray-900">Youssef B.</div>
              </div>
              <p className="text-gray-700 italic">
                "Livraison rapide et emballage soigné. J'ai commandé le coffret découverte, excellent rapport qualité-prix."
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-500">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <div className="mb-4">
                </div>
                <p className="text-sm text-gray-500 ml-3">Il y a 1 semaine</p>
              </div>
              <div className="font-semibold text-gray-900">Leila H.</div>
              <p className="text-gray-700 italic">
                "Mes enfants adorent ! Enfin une mloukhia de qualité premium accessible."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Restez informé de nos nouveautés et recettes
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Inscrivez-vous à notre newsletter pour découvrir nos dernières créations
            </p>
            <form className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm shadow-inner"
              />
              <button
                type="submit"
                className="bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-r-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;