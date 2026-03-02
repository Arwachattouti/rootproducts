import React from 'react';
import { Eye, Users, Award, Leaf } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      
      {/* 4. Story Section */}
     <section className="py-12 sm:py-24 bg-white border-t border-gray-50 overflow-hidden">
  <div className="max-w-7xl mx-auto px-6">
    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-20">
       {/* COLONNE DROITE : TOUT LE TEXTE */}
      <div className="w-full lg:w-7/12 ">
        {/* En-tête de l'histoire */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-[#4B2E05] font-seasons text-3xl md:text-5xl sm:text-4xl mb-4">
            Notre histoire
          </h2>
          <div className="h-1.5 w-20 bg-[#357A32] rounded-full"></div>
          <p className="mt-6 text-[#357A32] font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs">
            Héritage Tunisien depuis 1986
          </p>
        </div>

        {/* Corps du texte */}
        <div className="space-y-6 sm:space-y-8 text-gray-800 leading-relaxed font-seasons">
          <p className="text-lg md:text-2xl">
            <span className="text-[#4B2E05] font-bold">ROOT Products</span>
            <span> est un concept lancé en </span>
            <span className="text-[#357A32] font-bold">1986</span>
            <span>, visant à valoriser les produits de terroir tunisiens et à préserver les traditions locales. La marque met en lumière le savoir-faire des producteurs artisans et des petits agriculteurs, en leur offrant visibilité et soutien pour développer une production de qualité.</span>
          </p>

          <p className="text-lg md:text-2xl">
            ROOT Products s’engage à promouvoir une agriculture durable et responsable, tout en favorisant une alimentation saine et authentique. À travers ses initiatives, la marque contribue à la richesse gastronomique de la Tunisie et de la région méditerranéenne, en mettant en avant des produits naturels et respectueux de l’environnement.
          </p>

          {/* Citation stylisée en bas du texte */}
          <div className="pt-8 mt-8 border-t border-gray-100">
            <div className="flex gap-6">
              <div className="w-1.5 bg-[#357A32] shrink-0"></div>
              <p className="text-[#4B2E05] text-xl md:text-2xl leading-snug italic opacity-90">
                "ROOT Products incarne la tradition, le terroir et l’engagement pour une alimentation saine et responsable."
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* COLONNE GAUCHE : L'IMAGE */}
      <div className="w-full lg:w-5/12">
        <div className="relative h-[400px] md:h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl">
          <img 
            src="/images/arbre.jpeg" 
            alt="Racines profondes d'un arbre centenaire" 
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
          />
          {/* Overlay subtil pour le style */}
          <div className="absolute inset-0 bg-[#4B2E05]/5 pointer-events-none"></div>
        </div>
      </div>

     

    </div>
  </div>
</section>

      {/* Section Valeurs */}
      <section className="py-12 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-seasons text-[#4B2E05] mb-4">Nos valeurs</h2>
            <div className="h-px w-32 bg-[#357A32]/30 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Qualité */}
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Award className="h-10 w-10 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-seasons text-gray-900 md:text-3xl mb-2">Qualité</h3>
              <p className="font-seasons md:text-xl text-gray-600">Soutenir les petits agriculteurs pour offrir des produits sains et de haute qualité.</p>
            </div>

            {/* Durabilité */}
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Leaf className="h-10 w-10 text-green-700 mx-auto mb-4" />
              <h3 className="text-xl font-seasons text-gray-900 md:text-3xl mb-2">Durabilité</h3>
              <p className="font-seasons md:text-xl text-gray-600">Une agriculture respectueuse pour un impact positif sur les générations futures.</p>
            </div>

            {/* Solidarité */}
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Users className="h-10 w-10 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-seasons text-gray-900 mb-2 md:text-3xl">Solidarité</h3>
              <p className="font-seasons md:text-xl text-gray-600">Valoriser le travail local et contribuer au développement du terroir tunisien.</p>
            </div>

            {/* Transparence */}
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Eye className="h-10 w-10 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-seasons text-gray-900 mb-2 md:text-3xl">Transparence</h3>
              <p className="font-seasons md:text-xl text-gray-600">Un processus clair et responsable de la terre jusqu'à votre table.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;