import React from 'react';
import { Heart, Eye, Users, Award, Leaf, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import profil1 from "../../data/hiba.jpg";
import profil3 from "../../data/khawla.jpg";
import profil2 from "../../data/abdelkarim.jpg";

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      
      {/* 1. Hero Section (Inspirée du style Home) */}
      <section className="relative h-[500px] md:h-[600px] w-full overflow-hidden flex items-center justify-center text-center bg-white">
        <div 
          className="absolute inset-0 bg-cover bg-center no-repeat"
          style={{ backgroundImage: "url(/images/chajra.jpeg)" }}
        ></div>
        {/* Overlay pour la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-white"></div>

        <div className="relative z-10 max-w-4xl px-4 animate-in fade-in slide-in-from-top-10 duration-1000">
          <div className="flex justify-center mb-6">
            <span className="px-3 py-1 rounded bg-[#357A32]/80 backdrop-blur-sm text-[#F5F2EA] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
              Depuis 1986
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif text-white leading-[1.1] mb-6 drop-shadow-lg">
            La nature au <br />
            <span className="text-[#F5F2EA] italic font-serif">service du goût</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/90 mb-10 leading-relaxed font-medium drop-shadow-md">
            ROOT Products est né de la passion pour <span className="font-bold text-white">préserver et partager</span> l'authenticité de nos terres tunisiennes avec le monde entier.
          </p>
        </div>
      </section>

      {/* 2. Story Section (Identique à la Home pour la cohérence) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/3">
              <h2 className="text-[#4B2E05] font-serif text-4xl md:text-5xl italic mb-6">Notre Histoire</h2>
              <div className="h-1 w-20 bg-[#357A32]"></div>
              <p className="mt-8 text-[#357A32] font-bold uppercase tracking-[0.2em] text-xs">Héritage Tunisien depuis 1986</p>
            </div>
            <div className="lg:w-2/3 space-y-8 text-gray-700 text-lg leading-relaxed font-light">
              <p>
                <span className="text-[#4B2E05] font-semibold">ROOT Products</span> est un concept lancé en <span className="text-[#357A32] font-semibold">1986</span>, visant à valoriser les produits de terroir tunisiens et à préserver les traditions locales. La marque met en lumière le savoir-faire des producteurs artisans et des petits agriculteurs.
              </p>
              <p>
                Nous nous engageons à promouvoir une agriculture durable et responsable, tout en favorisant une alimentation saine et authentique. Chaque produit raconte une histoire de terre, de soleil et de passion.
              </p>
              <div className="pt-8 border-t border-gray-100">
                <p className="text-[#4B2E05] font-serif text-2xl italic leading-snug">
                  "ROOT Products incarne la tradition, le terroir et l’engagement pour une alimentation saine."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Values Section (Style cartes de la Home) */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif italic text-[#4B2E05] mb-4">Nos Valeurs</h2>
            <div className="h-px w-32 bg-[#357A32]/30 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Award, title: "Qualité", color: "text-yellow-600", desc: "Soutenir les petits agriculteurs pour offrir des produits sains et de haute qualité." },
              { icon: Leaf, title: "Durabilité", color: "text-green-700", desc: "Une agriculture respectueuse pour un impact positif sur les générations futures." },
              { icon: Users, title: "Solidarité", color: "text-blue-600", desc: "Valoriser le travail local et contribuer au développement du terroir tunisien." },
              { icon: Eye, title: "Transparence", color: "text-purple-600", desc: "Un processus clair et responsable de la terre jusqu'à votre table." },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <item.icon className={`h-10 w-10 ${item.color} mx-auto mb-4`} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Team Section (Style Épuré & Professionnel) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif italic text-[#4B2E05] mb-4">L'esprit derrière ROOT</h2>
              <p className="text-xl text-gray-600">Des passionnés dédiés au respect des traditions.</p>
            </div>
            <Link to="/products" className="group inline-flex items-center gap-2 text-[#4B2E05] font-bold uppercase tracking-widest text-xs border-b-2 border-[#357A32] pb-1">
              Découvrir notre travail <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { name: "Khawla Huiji", role: "Designer & Montage Vidéo", img: profil3 },
              { name: "Abdelkarim Houiji", role: "Vendeur & Fondateur", img: profil2 },
              { name: "Hiba Huiji", role: "Chef de Projet", img: profil1 }
            ].map((member, idx) => (
              <div key={idx} className="group text-center">
                <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-2xl shadow-md">
                  <img 
                    src={member.img} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-[#4B2E05]/10 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>
                <h3 className="text-2xl font-serif italic text-[#4B2E05] mb-1">{member.name}</h3>
                <p className="text-[#357A32] font-bold uppercase tracking-widest text-[10px]">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Call to Action Final */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center px-4">
          <Heart className="h-12 w-12 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-serif italic text-[#4B2E05] mb-8">Rejoignez notre mission pour une alimentation plus saine.</h2>
          <Link to="/contact" className="inline-block bg-[#4B2E05] hover:bg-[#5E2F00] text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg">
            Contactez-nous
          </Link>
        </div>
      </section>

    </div>
  );
};

export default About;