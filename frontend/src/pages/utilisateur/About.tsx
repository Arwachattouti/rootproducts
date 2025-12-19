import React from 'react';
import { Heart, Users, Award, Leaf, Quote, ArrowRight } from 'lucide-react';
import profil1 from "../../data/hiba.jpg";
import profil3 from "../../data/khawla.jpg";
import profil2 from "../../data/abdelkarim.jpg";
const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FDFCF9] font-sans text-gray-800">

      {/* --- 1. HERO SECTION : Épurée & Organique --- */}

      <section className="relative pt-20 pb-12 overflow-hidden bg-[#FDFCF9]">
        {/* Décoration d'arrière-plan simplifiée */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="5" cy="5" r="15" fill="#373E02" />
            <circle cx="95" cy="90" r="10" fill="#373E02" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          {/* Badge réduit */}
          <div className="inline-flex items-center justify-center space-x-3 mb-4 text-[#373E02]">
            <span className="h-[1px] w-6 bg-[#373E02]/30"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Notre Essence</span>
            <span className="h-[1px] w-6 bg-[#373E02]/30"></span>
          </div>

          {/* Titre resserré (text-5xl et text-6xl) */}
          <h1 className="text-4xl md:text-5xl font-black text-[#373E02] mb-6 leading-tight tracking-tighter">
            L'Héritage de la <br />
            <span className="font-serif italic font-light text-5xl md:text-6xl text-[#373E02]/80">Mloukhia Tunisienne</span>
          </h1>

          {/* Citation compacte */}
          <div className="max-w-2xl mx-auto relative group">
            {/* Guillemets stylisés mais plus petits */}
            <div className="absolute -left-2 -top-2 text-2xl text-[#373E02]/20 font-serif group-hover:scale-110 transition-transform">“</div>

            <p className="text-base md:text-lg text-gray-500 leading-relaxed italic px-8">
              ROOT Products est né de la passion pour préserver et partager l'authenticité
              de nos terres avec le monde entier.
            </p>
            <div className="absolute -right-2 -bottom-2 text-2xl text-[#373E02]/20 font-serif group-hover:scale-110 transition-transform">”</div>
          </div>
        </div>
      </section>

      {/* --- 2. STORY SECTION : Style Magazine --- */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

            <div className="lg:col-span-5 relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-700">
                <img
                  src="https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop"
                  alt="Tradition tunisienne"
                  className="w-full h-[600px] object-cover"
                />
              </div>
              <div className="absolute top-10 -right-8 bottom-10 -left-8 border-2 border-[#373E02]/10 rounded-2xl -z-0" />
            </div>

            <div className="lg:col-span-7 space-y-10 lg:pl-10">
              <div className="relative">
                <span className="text-9xl font-serif absolute -top-16 -left-10 opacity-[0.03] text-[#373E02] select-none">01</span>
                <h2 className="text-4xl font-black text-[#373E02] leading-tight relative z-10">
                  Une tradition qui <br /> traverse les âges
                </h2>
              </div>

              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  Depuis des générations, la mloukhia fait partie intégrante de la culture culinaire tunisienne.
                  Cette plante aux feuilles vertes délicates, connue scientifiquement sous le nom de
                  <span className="text-[#373E02] font-semibold italic"> Corchorus olitorius</span>,
                  pousse naturellement dans les terres fertiles de notre pays.
                </p>

                <div className="relative py-10 px-12 bg-[#FDFCF9] rounded-3xl border border-[#373E02]/5 shadow-sm overflow-hidden group">
                  <Quote className="absolute -top-2 -left-2 h-16 w-16 text-[#373E02]/5 -rotate-12 transition-transform group-hover:rotate-0 duration-500" />
                  <p className="relative z-10 text-[#373E02] font-serif text-2xl italic leading-snug">
                    "Nos grand-mères savaient déjà que la mloukhia était bien plus qu'un simple légume : c'est un super-aliment."
                  </p>
                </div>

                <p>
                  ROOT Products perpétue cette tradition en travaillant directement avec les agriculteurs locaux
                  pour vous offrir une mloukhia d'exception, transformée selon les méthodes ancestrales.
                </p>
              </div>

              <div className="flex items-center space-x-5 pt-6">
                <div className="w-14 h-14 rounded-full bg-[#373E02] flex items-center justify-center shadow-lg shadow-[#373E02]/20">
                  <span className="text-white font-black text-xl">R.</span>
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Authenticité Garantie</p>
                  <p className="text-xs text-gray-400 font-medium">Récolté & Transformé avec soin en Tunisie</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. VALUES SECTION : Cartes Flottantes --- */}
      <section className="py-24 bg-[#F8F6F1]/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-[#373E02] mb-6">Nos Valeurs Fondamentales</h2>
            <div className="h-1.5 w-24 bg-[#373E02] mx-auto rounded-full opacity-20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Heart, title: "Passion", desc: "Notre amour pour la tradition culinaire tunisienne guide chacune de nos actions." },
              { icon: Award, title: "Qualité", desc: "Nous sélectionnons rigoureusement nos matières premières et contrôlons chaque étape." },
              { icon: Users, title: "Communauté", desc: "Nous soutenons les agriculteurs locaux et créons des emplois dans nos régions." },
              { icon: Leaf, title: "Durabilité", desc: "Respect de l'environnement et agriculture durable sont au cœur de notre démarche." },
            ].map((item, idx) => (
              <div key={idx} className="group bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="w-20 h-20 bg-[#FDFCF9] rounded-3xl flex items-center justify-center mb-8 transform group-hover:rotate-6 transition-transform duration-500 border border-[#373E02]/5">
                  <item.icon className="h-10 w-10 text-[#373E02]" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. TEAM SECTION : Portraits Élégants --- */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black text-[#373E02] mb-4">L'esprit derrière ROOT</h2>
              <p className="text-lg text-gray-500 font-medium">Une équipe de passionnés dédiée à l'excellence et au respect des traditions.</p>
            </div>
            <button className="flex items-center gap-2 text-[#373E02] font-black uppercase tracking-widest text-xs border-b-2 border-[#373E02] pb-1 hover:opacity-70 transition-opacity">
              Rejoindre l'aventure <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                name: "Khawla Huiji",
                role: "Designer & Montage Vidéo",
                img:  profil3
              },
               {
                name: "Abdelkarim Houiji",
                role: "Vendeur & Responsable de l’Idée",
                img: profil2
              },
              {
                name: "Hiba Huiji",
                role: "Chef de Projet",
                img:  profil1
              }
            ].map((member, idx) => (
              <div key={idx} className="group text-center">
                <div className="relative mb-8 inline-block">
                  <div className="absolute inset-4 bg-[#373E02] rounded-[3rem] -z-10 group-hover:inset-0 transition-all duration-500 opacity-10" />
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-64 h-80 rounded-[3rem] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 shadow-xl"
                  />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-[#373E02] font-bold uppercase tracking-widest text-xs opacity-60">
                  {member.role}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* --- Mission Section : Style Cadre Signature --- */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto relative">
          {/* Cadre décoratif extérieur */}
          <div className="absolute -inset-4 border border-[#373E02]/10 rounded-[3rem] pointer-events-none" />

          <div className="bg-[#FDFCF9] border-2 border-[#373E02] rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden">
            {/* Icône discrète en haut */}
            <div className="flex justify-center mb-8">
              <div className="bg-white p-4 rounded-full shadow-sm border border-gray-100">
                <Leaf className="h-8 w-8 text-[#373E02]" />
              </div>
            </div>

            <h2 className="text-[#373E02] font-black uppercase tracking-[0.4em] text-xs mb-8">
              Notre Engagement Durable
            </h2>

            <p className="text-2xl md:text-4xl leading-relaxed font-serif italic text-[#373E02]/80 max-w-4xl mx-auto">
              "Faire découvrir au monde entier la richesse de la mloukhia tunisienne,
              en honorant nos racines et en soutenant nos terres."
            </p>

            {/* Signature visuelle en bas */}
            <div className="mt-10 flex items-center justify-center space-x-4">
              <div className="h-[1px] w-12 bg-[#373E02]/20"></div>
              <span className="text-[#373E02] font-bold text-sm tracking-widest">ROOT PRODUCTS</span>
              <div className="h-[1px] w-12 bg-[#373E02]/20"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;