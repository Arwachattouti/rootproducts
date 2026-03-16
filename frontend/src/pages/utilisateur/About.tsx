import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {  Award, Leaf, ArrowRight, HeartHandshake, Sprout, Sun } from 'lucide-react';

const About: React.FC = () => {
  const navigate = useNavigate();

  // Remonter en haut de la page au chargement
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      
     {/* ════════ HERO SECTION HARMONISÉE ════════ */}
<section className="py-8 sm:py-12 md:py-20 bg-gray-50 border-b border-gray-100">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
    {/* Badge style Blog */}
    <span className="inline-block px-2.5 sm:px-3 py-1 rounded bg-[#357A32]/10 text-[#357A32] text-[9px] sm:text-[10px] font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase">
      Notre essence
    </span>

    {/* Titre avec font-seasons et couleurs du terroir */}
    <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-seasons text-[#4B2E05] mt-3 sm:mt-4 md:mt-6 mb-3 sm:mb-4 md:mb-6 leading-tight">
      L'Âme du <br className="hidden sm:block" />
      <span className="text-[#357A32] font-seasons">Terroir Tunisien</span>
    </h1>

    {/* Description centrée et harmonisée */}
    <p className="max-w-2xl mx-auto font-seasons text-sm sm:text-base md:text-lg lg:text-xl px-2 text-gray-700">
      De la terre à votre table, nous cultivons l'authenticité et préservons 
      le <span className="text-[#357A32]">savoir-faire ancestral</span> pour vous offrir le meilleur de la nature.
    </p>
  </div>
</section>
      {/* ════════ STORY SECTION ════════ */}
      <section className="py-12 sm:py-16 md:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-10 sm:gap-12 lg:gap-20">
            
            {/* COLONNE IMAGE (Avec Badge Flottant) */}
            <div className="w-full lg:w-5/12 relative mt-8 lg:mt-0 order-2 lg:order-1">
              <div className="relative h-[350px] sm:h-[450px] md:h-[500px] lg:h-[650px] w-full rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-2xl shadow-[#4B2E05]/10 group">
                <img 
                  src="/images/arbre.jpeg" 
                  alt="Racines profondes d'un arbre centenaire" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>

              {/* Badge flottant "Depuis 1986" */}
              <div className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 lg:-bottom-10 lg:-right-10 bg-[#4B2E05] text-white p-4 sm:p-6 lg:p-8 rounded-full border-4 sm:border-8 border-white shadow-xl animate-in fade-in zoom-in duration-1000 delay-300">
                <div className="text-center">
                  <span className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#357A32] mb-1">Depuis</span>
                  <span className="block text-2xl sm:text-3xl lg:text-4xl font-serif italic leading-none">1986</span>
                </div>
              </div>
            </div>

            {/* COLONNE TEXTE */}
            <div className="w-full lg:w-7/12 order-1 lg:order-2">
              <div className="mb-6 sm:mb-8 lg:mb-10">
                <h2 className="text-[#4B2E05] font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6">
                  Nos Racines
                </h2>
                <div className="h-1 sm:h-1.5 w-16 sm:w-24 bg-[#357A32] rounded-full"></div>
              </div>

              <div className="space-y-5 sm:space-y-6 md:space-y-8 text-gray-700 leading-relaxed font-seasons">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl">
                  <strong className="text-[#4B2E05] font-bold">ROOT Products</strong> est bien plus qu'une marque. C'est un concept né d'une passion profonde pour la valorisation des produits de terroir tunisiens et la préservation de nos traditions locales.
                </p>

                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600">
                  Nous mettons en lumière le savoir-faire inestimable de nos producteurs artisans et de nos petits agriculteurs. En leur offrant visibilité et soutien technique, nous contribuons à développer une production d'une qualité exceptionnelle, dans le respect de la terre.
                </p>

                {/* Citation stylisée */}
                <div className="relative pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-gray-100">
                  <div className="absolute top-0 left-0 -mt-3 sm:-mt-4 text-4xl sm:text-5xl text-[#357A32]/20 font-serif">"</div>
                  <p className="text-[#4B2E05] text-lg sm:text-xl md:text-2xl lg:text-3xl leading-snug italic font-serif relative z-10 pl-4 sm:pl-6">
                    ROOT Products incarne la tradition, le terroir et l'engagement pour une alimentation saine et responsable.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════ IMPACT / CHIFFRES CLÉS (Section sombre) ════════ */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#4B2E05] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 text-center divide-x-0 md:divide-x divide-white/10">
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-serif italic text-[#357A32]">35+</div>
              <div className="text-[10px] sm:text-xs font-bold text-white/80 uppercase tracking-widest">Années d'expertise</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-serif italic text-[#357A32]">100%</div>
              <div className="text-[10px] sm:text-xs font-bold text-white/80 uppercase tracking-widest">Naturel & Pur</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-serif italic text-[#357A32]">50+</div>
              <div className="text-[10px] sm:text-xs font-bold text-white/80 uppercase tracking-widest">Artisans soutenus</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-serif italic text-[#357A32]">24h</div>
              <div className="text-[10px] sm:text-xs font-bold text-white/80 uppercase tracking-widest">Livraison rapide</div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ NOS VALEURS ════════ */}
      <section className="py-16 sm:py-24 md:py-32 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 md:mb-24">
            <span className="text-[#357A32] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-3 block">Notre boussole</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[#4B2E05] mb-4">
              Valeurs Fondamentales
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            {/* Qualité */}
            <div className="group bg-white p-8 sm:p-10 rounded-2xl sm:rounded-[2rem] border border-gray-100 hover:border-[#357A32]/30 shadow-sm hover:shadow-xl hover:shadow-[#357A32]/5 transition-all duration-500 hover:-translate-y-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-yellow-50 text-yellow-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Award className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl sm:text-2xl font-serif text-gray-900 mb-3 group-hover:text-[#357A32] transition-colors">
                Qualité absolue
              </h3>
              <p className="font-seasons text-sm sm:text-base text-gray-500 leading-relaxed">
                Une sélection rigoureuse pour vous offrir des produits sains, riches en goût et d'une qualité irréprochable.
              </p>
            </div>

            {/* Durabilité */}
            <div className="group bg-white p-8 sm:p-10 rounded-2xl sm:rounded-[2rem] border border-gray-100 hover:border-[#357A32]/30 shadow-sm hover:shadow-xl hover:shadow-[#357A32]/5 transition-all duration-500 hover:-translate-y-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-50 text-green-700 rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                <Leaf className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl sm:text-2xl font-serif text-gray-900 mb-3 group-hover:text-[#357A32] transition-colors">
                Éco-responsabilité
              </h3>
              <p className="font-seasons text-sm sm:text-base text-gray-500 leading-relaxed">
                Une agriculture respectueuse de l'environnement pour laisser un impact positif aux générations futures.
              </p>
            </div>

            {/* Solidarité */}
            <div className="group bg-white p-8 sm:p-10 rounded-2xl sm:rounded-[2rem] border border-gray-100 hover:border-[#357A32]/30 shadow-sm hover:shadow-xl hover:shadow-[#357A32]/5 transition-all duration-500 hover:-translate-y-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 text-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <HeartHandshake className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl sm:text-2xl font-serif text-gray-900 mb-3 group-hover:text-[#357A32] transition-colors">
                Solidarité
              </h3>
              <p className="font-seasons text-sm sm:text-base text-gray-500 leading-relaxed">
                Valoriser le travail local et contribuer au développement économique de nos artisans et régions.
              </p>
            </div>

            {/* Transparence */}
            <div className="group bg-white p-8 sm:p-10 rounded-2xl sm:rounded-[2rem] border border-gray-100 hover:border-[#357A32]/30 shadow-sm hover:shadow-xl hover:shadow-[#357A32]/5 transition-all duration-500 hover:-translate-y-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-50 text-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                <Sun className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl sm:text-2xl font-serif text-gray-900 mb-3 group-hover:text-[#357A32] transition-colors">
                Transparence
              </h3>
              <p className="font-seasons text-sm sm:text-base text-gray-500 leading-relaxed">
                Une traçabilité totale et un processus clair et honnête, de la terre de nos ancêtres jusqu'à votre table.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ════════ CALL TO ACTION ════════ */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#4B2E05] mb-4 sm:mb-6">
            Prêt à goûter l'authentique ?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 font-seasons mb-8 sm:mb-10 max-w-2xl mx-auto">
            Explorez notre collection de produits naturels, préparés avec soin selon des méthodes traditionnelles pour réveiller vos papilles.
          </p>
          <button 
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-3 bg-[#4B2E05] text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold uppercase text-xs sm:text-sm tracking-widest hover:bg-[#357A32] transition-colors shadow-lg hover:shadow-xl active:scale-95 group"
          >
            Découvrir la boutique
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

    </div>
  );
};

export default About;