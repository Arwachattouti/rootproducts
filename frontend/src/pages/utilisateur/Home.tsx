// frontend/src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Eye, Users, Award, Quote, Leaf, Heart,
  Scaling as Seedling, ArrowRight, Star, Loader2, AlertCircle
} from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import { useGetProductsQuery } from '../../state/apiService';

const Home: React.FC = () => {

  const {
    data: products = [],
    isLoading,
    error
  } = useGetProductsQuery();
  const featuredProducts = products.slice(0, 3);
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
      const errorMessage = (error as any)?.data?.message || 'Erreur lors du chargement des produits phares.';
      return (
        <div className="flex justify-center items-center py-10 text-red-600">
          <AlertCircle className="h-6 w-6 mr-2" />
          <p className="ml-2">{errorMessage}</p>
        </div>
      );
    }
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
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">

      {/* 1. Hero Section */}
      {/* La hauteur (h) est maintenant dynamique pour coller à l'image sans vide en bas */}
      <section className="relative w-full bg-[#f4f1ea]">
        {/* Conteneur principal qui respecte les proportions de l'image */}
        <div className="relative w-full h-auto aspect-[16/9] md:aspect-[21/9] lg:aspect-[2.5/1] overflow-hidden">

          {/* L'image : occupe tout l'espace sans être déformée */}
          <img
            src="/images/home.jpg"
            alt="Produits"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Overlay : dégradé subtil pour la lisibilité, sans masquer le bas de l'image */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* Contenu textuel centré verticalement sur l'image */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
            <div className="animate-in fade-in slide-in-from-top-6 duration-1000 max-w-sm sm:max-w-4xl">

              {/* Badge : plus petit sur mobile */}
              <div className="flex justify-center mb-2 md:mb-6">
                <span className="px-2 py-0.5 rounded bg-[#357A32]/90 text-[#F5F2EA] text-[8px] md:text-xs font-bold tracking-[0.15em] uppercase">
                  Produit du Terroir
                </span>
              </div>

              {/* Titre : réduction à text-xl sur mobile pour libérer l'espace visuel */}
              <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-seasons text-white leading-tight mb-2 md:mb-6 drop-shadow-lg">
                L’excellence de la <br />
                <span className="text-[#F5F2EA] font-seasons">tradition tunisienne</span>
              </h1>

              {/* Description : plus courte et texte plus fin sur mobile */}
              <p className="max-w-xs font-seasons sm:max-w-xl mx-auto text-sm sm:text-base md:text-lg text-white/90 mb-4 md:mb-8 leading-snug md:leading-relaxed font-medium drop-shadow-md">
                Une alimentation durable, saine et responsable.
              </p>

              {/* Bouton : plus compact (px-4 py-1.5) sur mobile */}
              <div className="flex justify-center">
                <Link
                  to="/products"
                  className="bg-[#4B2E05] font-seasons hover:bg-[#5E2F00] text-white px-5 py-2 md:px-10 md:py-3 rounded-lg md:rounded-xl font-bold text-[11px] md:text-lg shadow-xl transition-all active:scale-95"
                >
                  Découvrir nos produits
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* 3. Featured Products Section */}
      <section className="py-10 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Titre réduit sur mobile (text-2xl) */}
          <h2 className="text-3xl md:text-5xl font-seasons text-[#4B2E05] mb-2 md:mb-4">
            Nos produits phares
          </h2>

          {/* Paragraphe plus petit et marge réduite */}
          <p className="text-base font-seasons md:text-2xl mb-6 md:mb-12 text-gray-800">
            Découvrez nos best-sellers sélectionnés pour vous.
          </p>

          {/* Le rendu des produits (assure-toi que renderFeaturedProducts utilise une grille responsive) */}
          <div className="min-h-[200px]">
            {renderFeaturedProducts()}
          </div>

          {/* Lien de bas de section plus compact */}
          <div className="mt-8 md:mt-12">
            <Link
              to="/products"
              className="inline-flex font-seasons items-center text-sm md:text-2xl text-black hover:text-[#357A32] transition-colors"
            >
              Voir tous les produits <ArrowRight className="ml-1.5 h-4 w-4 md:h-5 md:w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Story Section */}
      <section className="py-12 sm:py-24 bg-white border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

            {/* Titre et Intro - Mieux centrés visuellement sur mobile */}
            <div className="lg:w-1/3">
              <h2 className="text-[#4B2E05] font-seasons  text-3xl md:text-5xl sm:text-4xl  mb-4 sm:mb-6">
                Notre histoire
              </h2>
              <div className="h-1 w-16 sm:w-20 bg-[#357A32]"></div>
              <p className="mt-6 sm:mt-8 text-[#357A32] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[10px] sm:text-xs">
                Héritage Tunisien depuis 1986
              </p>
            </div>

            {/* Texte principal - Taille de police ajustée pour le confort mobile */}
            <div className="lg:w-2/3 space-y-6 sm:space-y-8  text-base sm:text-lg leading-relaxed ">
              <p>
                <span className="text-[#4B2E05] md:text-2xl font-seasons">ROOT Products</span> 
                <span className=" font-seasons md:text-2xl"> est un concept lancé en </span>
                <span className="text-[#357A32] font-seasons md:text-2xl">1986</span>
                <span className=" font-seasons md:text-2xl"> , visant à valoriser les produits de terroir tunisiens et à préserver les traditions locales. La marque met en lumière le savoir-faire des producteurs artisans et des petits agriculteurs, en leur offrant visibilité et soutien pour développer une production de qualité.
                </span> </p>

              <p>
                <span className=" font-seasons md:text-2xl"> ROOT Products s’engage à promouvoir une agriculture durable et responsable, tout en favorisant une alimentation saine et authentique. À travers ses initiatives, la marque contribue à la richesse gastronomique de la Tunisie et de la région méditerranéenne, en mettant en avant des produits naturels et respectueux de l’environnement.
                </span>  </p>

              {/* Citation - Design plus impactant sur mobile */}
              <div className="pt-6 sm:pt-8 border-t border-gray-100">
                <div className="flex gap-4">
                  {/* Petit détail visuel : une barre verticale pour la citation */}
                  <div className="w-1 bg-gray-100 hidden sm:block"></div>
                  <p className="text-[#4B2E05] font-seasons text-base md:text-2xl sm:text-2xl leading-snug">
                    "ROOT Products incarne la tradition, le terroir et l’engagement pour une alimentation saine et responsable."
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* 2. Avantages / Valeurs Section (Placé ici pour rassurer l'acheteur) */}
      <section className="py-12 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-seasons text-[#4B2E05] mb-4">Nos valeurs</h2>
            <div className="h-px w-32 bg-[#357A32]/30 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Award className="h-10 w-10 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-seasons text-gray-900 md:text-3xl mb-2">Qualité</h3>
              <p className='font-seasons  md:text-xl'>Soutenir les petits agriculteurs pour offrir des produits sains et de haute qualité.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Leaf className="h-10 w-10 text-green-700 mx-auto mb-4" />
              <h3 className="text-xl font-seasons text-gray-900 md:text-3xl mb-2">Durabilité</h3>
              <p className='font-seasons  md:text-xl'>Une agriculture respectueuse pour un impact positif sur les générations futures.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Users className="h-10 w-10 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-seasons text-gray-900 mb-2 md:text-3xl">Solidarité</h3>
              <p className='font-seasons  md:text-xl'>Valoriser le travail local et contribuer au développement du terroir tunisien.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Eye className="h-10 w-10 text-purple-600 mx-auto mb-4  "/>
              <h3 className="text-xl font-seasons text-gray-900 mb-2 md:text-3xl">Transparence</h3>
              <p className='font-seasons md:text-xl'>Un processus clair et responsable de la terre jusqu'à votre table.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Témoignages Section */}
      <section className="py-6 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4  sm:px-6 lg:px-8">
          <center>  <h2 className="text-3xl md:text-5xl font-seasons text-[#4B2E05] py-6 mb-6">Ce que disent nos clients</h2></center>
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
                <p className="text-sm text-gray-500 ml-3 font-seasons ">Il y a 2 jours</p>
              </div>
              <div className="mb-4">
                <div className="font-seasons text-gray-900">Fatima Z.</div>
              </div>
              <p className='font-seasons  md:text-xl' >"La meilleure mloukhia que j'ai goûtée depuis longtemps ! Le goût est authentique et la qualité irréprochable."</p>
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
                <p className="text-sm font-seasons text-gray-500 ml-3">Il y a 5 jours</p>
              </div>
              <div className="mb-4">
                <div className="font-seasons text-gray-900">Youssef B.</div>
              </div>
              <p className='font-seasons  md:text-xl'>"Livraison rapide et emballage soigné. J'ai commandé le coffret découverte, excellent rapport qualité-prix."</p>
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
                <p className="text-sm font-seasons text-gray-500 ml-3">Il y a 1 semaine</p>
              </div>
                 <div className="mb-4">
              <div className="font-seasons text-gray-900">Leila H.</div></div>
              <p className='font-seasons  md:text-xl'>"Mes enfants adorent ! Enfin une mloukhia de qualité premium accessible."</p>
            </div>
          </div>
        </div>
      </section>



    </div>
  );
};

export default Home;
