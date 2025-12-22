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
  // 💡 Hook RTK Query
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
      <section className="relative h-[600px] md:h-[700px] w-full overflow-hidden flex items-start justify-center text-center bg-white">
        <div 
          className="absolute inset-0 bg-cover bg-center no-repeat transition-transform duration-1000 scale-100"
          style={{ backgroundImage: "url(/images/home.jpg)" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-transparent"></div>

        <div className="relative z-10 max-w-4xl px-4 sm:px-6 lg:px-8 pt-20 md:pt-20 animate-in fade-in slide-in-from-top-10 duration-1000">
          <div className="flex justify-center mb-6">
            <span className="px-3 py-1 rounded bg-[#357A32]/80 backdrop-blur-sm text-[#F5F2EA] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
              Produit du Terroir Tunisien
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif text-white leading-[1.1] mb-6 drop-shadow-lg">
            L’excellence de la <br />
            <span className="text-[#F5F2EA] italic font-serif">tradition tunisienne</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/90 mb-10 leading-relaxed font-medium drop-shadow-md">
            ROOT Products valorise le terroir tunisien à travers une alimentation 
            <span className="font-bold text-white"> durable</span>, saine et responsable.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/products" className="w-full sm:w-auto bg-[#4B2E05] hover:bg-[#5E2F00] text-white px-10 py-4 rounded-xl font-bold text-lg shadow-2xl transition-all">
              Découvrir nos produits
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* 2. Avantages / Valeurs Section (Placé ici pour rassurer l'acheteur) */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif italic text-[#4B2E05] mb-4">Nos Valeurs</h2>
            <div className="h-px w-32 bg-[#357A32]/30 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Award className="h-10 w-10 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Qualité</h3>
              <p className="text-gray-600">Soutenir les petits agriculteurs pour offrir des produits sains et de haute qualité.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Leaf className="h-10 w-10 text-green-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Durabilité</h3>
              <p className="text-gray-600">Une agriculture respectueuse pour un impact positif sur les générations futures.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Users className="h-10 w-10 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Solidarité</h3>
              <p className="text-gray-600">Valoriser le travail local et contribuer au développement du terroir tunisien.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Eye className="h-10 w-10 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Transparence</h3>
              <p className="text-gray-600">Un processus clair et responsable de la terre jusqu'à votre table.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-serif italic text-[#4B2E05] mb-4">Nos produits phares</h2>
          <p className="text-xl text-gray-600 mb-12">Découvrez nos best-sellers, soigneusement sélectionnés pour vous.</p>
          
          {renderFeaturedProducts()}
          
          <div className="mt-12">
            <Link to="/products" className="inline-flex items-center text-lg font-medium text-black hover:text-green-800 transition-colors">
              Voir tous les produits <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Story Section */}
      <section className="py-24 bg-white border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/3">
              <h2 className="text-[#4B2E05] font-serif text-4xl md:text-5xl italic mb-6">Notre Histoire</h2>
              <div className="h-1 w-20 bg-[#357A32]"></div>
              <p className="mt-8 text-[#357A32] font-bold uppercase tracking-[0.2em] text-xs">Héritage Tunisien depuis 1986</p>
            </div>
            <div className="lg:w-2/3 space-y-8 text-gray-700 text-lg leading-relaxed font-light">
              <p>
                <span className="text-[#4B2E05] font-semibold">ROOT Products</span> est un concept lancé en <span className="text-[#357A32] font-semibold">1986</span>, visant à valoriser les produits de terroir tunisiens et à préserver les traditions locales. La marque met en lumière le savoir-faire des producteurs artisans et des petits agriculteurs, en leur offrant visibilité et soutien pour développer une production de qualité.
              </p>
              <p>
                ROOT Products s’engage à promouvoir une agriculture durable et responsable, tout en favorisant une alimentation saine et authentique. À travers ses initiatives, la marque contribue à la richesse gastronomique de la Tunisie et de la région méditerranéenne, en mettant en avant des produits naturels et respectueux de l’environnement.
              </p>
              <div className="pt-8 border-t border-gray-100">
                <p className="text-[#4B2E05] font-serif text-2xl italic leading-snug">
                  "ROOT Products incarne la tradition, le terroir et l’engagement pour une alimentation saine et responsable."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Témoignages Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       <center>  <h2 className="text-4xl md:text-5xl font-serif italic text-[#4B2E05] mb-4">Ce que disent nos clients</h2></center>
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
              <p className="text-gray-700 italic">"La meilleure mloukhia que j'ai goûtée depuis longtemps ! Le goût est authentique et la qualité irréprochable."</p>
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
              <p className="text-gray-700 italic">"Livraison rapide et emballage soigné. J'ai commandé le coffret découverte, excellent rapport qualité-prix."</p>
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
                <p className="text-sm text-gray-500 ml-3">Il y a 1 semaine</p>
              </div>
              <div className="font-semibold text-gray-900">Leila H.</div>
              <p className="text-gray-700 italic">"Mes enfants adorent ! Enfin une mloukhia de qualité premium accessible."</p>
            </div>
          </div>
        </div>
      </section>

    

    </div>
  );
};

export default Home;