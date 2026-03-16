// frontend/src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye, Users, Award, Leaf,
  ArrowRight, Star, ChevronLeft, ChevronRight,
} from 'lucide-react';
import FeaturedProductsCarousel from '../../components/FeaturedProductsCarousel';
import { useGetProductsQuery } from '../../state/apiService';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const categories = [
  {
    id: 'sucre',
    value: ['confiture'],
    label: 'Douceurs & confiture',
    image: 'https://res.cloudinary.com/dxk2lvcjy/image/upload/v1773346371/1773322842509-019ce246-97b7-7756-b237-f69bce5891ca_wnofzl.png',
  },
  {
    id: 'essentiels',
    value: ['huile', 'miel'],
    label: 'Huiles & miels',
    image: 'https://res.cloudinary.com/dxk2lvcjy/image/upload/v1773346475/1773321214479-019ce22d-ad82-736d-b149-e7d059e8beb5_xck8mt.png',
  },
  {
    id: 'epices',
    value: ['condiments', 'sauce', 'poudre'],
    label: 'Épices & condiments',
    image: 'https://res.cloudinary.com/dxk2lvcjy/image/upload/v1773346464/1773321348111-019ce22f-ecd1-7213-afe7-dfb8db459960_t9hqds.png',
  },
];

const Home: React.FC = () => {
  const {
    data: products = [],
    isLoading,
    error,
  } = useGetProductsQuery();

  const featuredProducts = products.slice(0, 8);

  // ── Hero entrance state ──
  const [heroLoaded, setHeroLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  // ── Scroll reveal refs (un par section) ──
  const productsSection = useScrollReveal(0.1);
  const categoriesTitle = useScrollReveal(0.15);
  const categoriesGrid  = useScrollReveal(0.1);
  const storyLeft       = useScrollReveal(0.15);
  const storyRight      = useScrollReveal(0.1);
  const valuesTitle     = useScrollReveal(0.15);
  const valuesGrid      = useScrollReveal(0.08);
  const testimTitle     = useScrollReveal(0.15);
  const testimGrid      = useScrollReveal(0.08);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ═══════════════════════════════════════
          1. HERO SECTION
      ═══════════════════════════════════════ */}
      <section className="relative w-full bg-[#f4f1ea]">
        <div className="relative w-full h-auto aspect-[16/9] md:aspect-[21/9] lg:aspect-[2.5/1] overflow-hidden">

          {/* Image avec zoom lent */}
          <img
            src="/images/home.jpg"
            alt="Produits"
            className={`
              absolute inset-0 w-full h-full object-cover object-center
              transition-transform duration-[8000ms] ease-out
              ${heroLoaded ? 'scale-105' : 'scale-100'}
            `}
          />

          <div className="absolute inset-0 bg-black/30"></div>

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
            <div className="max-w-sm sm:max-w-4xl">

              {/* Badge — fade-in-down */}
              <div
                className={`
                  flex justify-center mb-2 md:mb-6
                  transition-all duration-700 ease-out
                  ${heroLoaded
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-6'}
                `}
                style={{ transitionDelay: '300ms' }}
              >
                <span className="px-2 py-0.5 rounded bg-[#357A32]/90 text-[#F5F2EA] text-[8px] md:text-xs font-bold tracking-[0.15em] uppercase">
                  Produit du Terroir
                </span>
              </div>

              {/* Titre — fade-in-up */}
              <h1
                className={`
                  text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-seasons
                  text-white leading-tight mb-2 md:mb-6 drop-shadow-lg
                  transition-all duration-1000 ease-out
                  ${heroLoaded
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'}
                `}
                style={{ transitionDelay: '500ms' }}
              >
                L'excellence de la <br />
                <span className="text-[#F5F2EA] font-seasons">tradition tunisienne</span>
              </h1>

              {/* Description — fade-in-up */}
              <p
                className={`
                  max-w-xs font-seasons sm:max-w-xl mx-auto text-sm sm:text-base
                  md:text-lg text-white/90 mb-4 md:mb-8 leading-snug
                  md:leading-relaxed font-medium drop-shadow-md
                  transition-all duration-1000 ease-out
                  ${heroLoaded
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'}
                `}
                style={{ transitionDelay: '700ms' }}
              >
                Une alimentation durable, saine et responsable.
              </p>

            {/* Boutons — fade-in-up + scale */}
{/* Boutons responsive */}
{/* Boutons — same line mobile */}
<div
  className={`
    flex flex-row items-center justify-center
    gap-2 sm:gap-4
    transition-all duration-1000 ease-out
    ${heroLoaded
      ? "opacity-100 translate-y-0 scale-100"
      : "opacity-0 translate-y-6 scale-95"}
  `}
  style={{ transitionDelay: "900ms" }}
>

  {/* Bouton produits */}
  <Link
    to="/products"
    className="
      bg-[#4B2E05] hover:bg-[#5E2F00]
      text-white font-seasons font-semibold
      px-3 py-1.5 sm:px-6 sm:py-2.5 md:px-10 md:py-3
      rounded-md sm:rounded-lg md:rounded-xl
      text-[10px] sm:text-sm md:text-lg
      shadow-md hover:shadow-lg
      transition-all duration-300
      active:scale-95
    "
  >
    Découvrir
  </Link>

  {/* Bouton histoire */}
  <Link
    to="/about"
    className="
      border border-[#4B2E05]
       text-white
      hover:bg-[#4B2E05] hover:text-white
      font-seasons font-semibold
      px-3 py-1.5 sm:px-6 sm:py-2.5 md:px-10 md:py-3
      rounded-md sm:rounded-lg md:rounded-xl
      text-[10px] sm:text-sm md:text-lg
      transition-all duration-300
      active:scale-95
    "
  >
    Notre histoire
  </Link>

</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          2. NOS PRODUITS (Saison)
      ═══════════════════════════════════════ */}
      <section className="py-8 sm:py-12 md:py-20 bg-white">
        <div
          ref={productsSection.ref}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >

          <h2
            className={`
              font-seasons text-[#4B2E05]
              text-2xl sm:text-3xl md:text-5xl
              mb-4 sm:mb-6
              transition-all duration-700 ease-out
              ${productsSection.isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'}
            `}
          >
            Nos produits
          </h2>

          <div
            className={`
              transition-all duration-800 ease-out
              ${productsSection.isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-12'}
            `}
            style={{ transitionDelay: '200ms' }}
          >
            <FeaturedProductsCarousel
              products={featuredProducts}
              isLoading={isLoading}
              error={error}
            />
          </div>

          <div
            className={`
              mt-6 sm:mt-8 md:mt-12
              transition-all duration-700 ease-out
              ${productsSection.isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6'}
            `}
            style={{ transitionDelay: '400ms' }}
          >
            <Link
              to="/products"
              className="
                inline-flex font-seasons items-center
                text-black hover:text-[#357A32] transition-colors
                text-sm sm:text-base md:text-2xl
              "
            >
              Voir tous les produits
              <ArrowRight className="ml-1.5 h-4 w-4 md:h-5 md:w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          3. CATÉGORIES
      ═══════════════════════════════════════ */}
      <section className="py-14 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Title */}
          <div
            ref={categoriesTitle.ref}
            className={`
              text-center mb-12 md:mb-16
              transition-all duration-700 ease-out
              ${categoriesTitle.isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'}
            `}
          >
            <h2 className="font-seasons text-3xl md:text-4xl lg:text-5xl text-[#4B2E05]">
              Nos Catégories
            </h2>
          </div>

          {/* Categories — staggered */}
          <div
            ref={categoriesGrid.ref}
            className="
              flex gap-5 overflow-x-auto scrollbar-transparent snap-x snap-mandatory pb-4
              md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:overflow-visible
            "
          >
            {categories.filter(c => c.id !== 'all').map((cat, index) => (
              <div
                key={cat.id}
                className={`
                  relative group
                  min-w-[260px] sm:min-w-[280px] md:min-w-0
                  h-[320px] md:h-[380px]
                  rounded-3xl overflow-hidden
                  shadow-sm hover:shadow-xl
                  transition-all duration-500
                  snap-center
                  ${categoriesGrid.isVisible
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-16 scale-95'}
                `}
                style={{
                  transitionDelay: categoriesGrid.isVisible
                    ? `${index * 150}ms`
                    : '0ms',
                  transitionDuration: '800ms',
                  transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="
                    absolute inset-0 w-full h-full object-cover
                    transition-transform duration-700
                    group-hover:scale-110
                  "
                />

                <div className="
                  absolute inset-0
                  bg-gradient-to-t from-black/70 via-black/30 to-transparent
                  transition-opacity duration-500
                " />

                <div className="absolute inset-0 flex items-end justify-center p-6 text-center">
                  <h3 className="text-white font-seasons text-xl md:text-2xl tracking-wide">
                    {cat.label}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div
            className={`
              mt-12 md:mt-16 text-center
              transition-all duration-700 ease-out
              ${categoriesGrid.isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6'}
            `}
            style={{ transitionDelay: '600ms' }}
          >
           
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          4. NOTRE HISTOIRE
      ═══════════════════════════════════════ */}
      <section className="py-10 sm:py-16 md:py-24 bg-white border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">

            {/* Colonne gauche — slide-in-left */}
            <div
              ref={storyLeft.ref}
              className={`
                lg:w-1/3
                transition-all duration-900 ease-out
                ${storyLeft.isVisible
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-12'}
              `}
              style={{
                transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <h2
                className="
                  text-[#4B2E05] font-seasons
                  text-2xl sm:text-3xl md:text-5xl
                  mb-3 sm:mb-6
                "
              >
                Notre histoire
              </h2>
              <div
                className={`
                  h-1 bg-[#357A32] rounded
                  transition-all duration-1000 ease-out
                  ${storyLeft.isVisible ? 'w-12 sm:w-16 md:w-20' : 'w-0'}
                `}
                style={{ transitionDelay: '400ms' }}
              />
              <p
                className={`
                  mt-4 sm:mt-6 md:mt-8
                  text-[#357A32] font-bold uppercase
                  tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.2em]
                  text-[9px] sm:text-[10px] md:text-xs
                  transition-all duration-700 ease-out
                  ${storyLeft.isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'}
                `}
                style={{ transitionDelay: '600ms' }}
              >
                Héritage Tunisien depuis 1986
              </p>
            </div>

            {/* Colonne droite — slide-in-right, staggered paragraphs */}
            <div
              ref={storyRight.ref}
              className="lg:w-2/3 space-y-4 sm:space-y-6 md:space-y-8"
            >
              <p
                className={`
                  font-seasons text-sm sm:text-base md:text-xl lg:text-2xl leading-relaxed
                  transition-all duration-800 ease-out
                  ${storyRight.isVisible
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-12'}
                `}
                style={{
                  transitionDelay: '200ms',
                  transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                <span className="text-[#4B2E05] font-semibold">
                  ROOT Products
                </span>{' '}
                est un concept lancé en{' '}
                <span className="text-[#357A32]">1986</span>, visant à
                valoriser les produits de terroir tunisiens et à
                préserver les traditions locales. La marque met en
                lumière le savoir-faire des producteurs artisans et des
                petits agriculteurs, en leur offrant visibilité et
                soutien pour développer une production de qualité.
              </p>

              <p
                className={`
                  font-seasons text-sm sm:text-base md:text-xl lg:text-2xl leading-relaxed
                  transition-all duration-800 ease-out
                  ${storyRight.isVisible
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-12'}
                `}
                style={{
                  transitionDelay: '400ms',
                  transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                ROOT Products s'engage à promouvoir une agriculture
                durable et responsable, tout en favorisant une
                alimentation saine et authentique. À travers ses
                initiatives, la marque contribue à la richesse
                gastronomique de la Tunisie et de la région
                méditerranéenne.
              </p>

              {/* Citation — fade-in-up */}
              <div
                className={`
                  pt-4 sm:pt-6 md:pt-8 border-t border-gray-100
                  transition-all duration-800 ease-out
                  ${storyRight.isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'}
                `}
                style={{
                  transitionDelay: '600ms',
                  transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-1 bg-[#357A32]/30 rounded hidden sm:block" />
                  <p
                    className="
                      text-[#4B2E05] font-seasons italic
                      text-sm sm:text-base md:text-xl lg:text-2xl
                      leading-snug sm:leading-relaxed
                    "
                  >
                    "ROOT Products incarne la tradition, le terroir et
                    l'engagement pour une alimentation saine et
                    responsable."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          5. NOS VALEURS
      ═══════════════════════════════════════ */}
      <section className="py-10 sm:py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div
            ref={valuesTitle.ref}
            className={`
              text-center mb-8 sm:mb-12 md:mb-20
              transition-all duration-700 ease-out
              ${valuesTitle.isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'}
            `}
          >
            <h2
              className="
                font-seasons text-[#4B2E05]
                text-2xl sm:text-3xl md:text-5xl
                mb-3 sm:mb-4
              "
            >
              Nos valeurs
            </h2>
            <div
              className={`
                h-px bg-[#357A32]/30 mx-auto
                transition-all duration-1000 ease-out
                ${valuesTitle.isVisible ? 'w-20 sm:w-32' : 'w-0'}
              `}
              style={{ transitionDelay: '400ms' }}
            />
          </div>

          <div
            ref={valuesGrid.ref}
            className="
              grid gap-4 sm:gap-6 md:gap-8
              grid-cols-2
              lg:grid-cols-4
            "
          >
            {[
              {
                Icon: Award,
                color: 'text-yellow-600',
                title: 'Qualité',
                desc: 'Soutenir les petits agriculteurs pour offrir des produits sains et de haute qualité.',
              },
              {
                Icon: Leaf,
                color: 'text-green-700',
                title: 'Durabilité',
                desc: 'Une agriculture respectueuse pour un impact positif sur les générations futures.',
              },
              {
                Icon: Users,
                color: 'text-blue-600',
                title: 'Solidarité',
                desc: 'Valoriser le travail local et contribuer au développement du terroir tunisien.',
              },
              {
                Icon: Eye,
                color: 'text-purple-600',
                title: 'Transparence',
                desc: "Un processus clair et responsable de la terre jusqu'à votre table.",
              },
            ].map((val, index) => (
              <div
                key={val.title}
                className={`
                  text-center p-4 sm:p-6
                  bg-white rounded-xl
                  shadow-md hover:shadow-xl
                  hover:-translate-y-2
                  transition-all duration-500
                  ${valuesGrid.isVisible
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-12 scale-95'}
                `}
                style={{
                  transitionDelay: valuesGrid.isVisible
                    ? `${index * 120}ms`
                    : '0ms',
                  transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                <val.Icon
                  className={`
                    h-8 w-8 sm:h-10 sm:w-10
                    ${val.color} mx-auto mb-3 sm:mb-4
                  `}
                />
                <h3
                  className="
                    font-seasons text-gray-900
                    text-base sm:text-xl md:text-2xl lg:text-3xl
                    mb-1 sm:mb-2
                  "
                >
                  {val.title}
                </h3>
                <p
                  className="
                    font-seasons
                    text-xs sm:text-sm md:text-base lg:text-xl
                    text-gray-600
                  "
                >
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          6. TÉMOIGNAGES
      ═══════════════════════════════════════ */}
      <section className="py-8 sm:py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <h2
            ref={testimTitle.ref}
            className={`
              text-center font-seasons text-[#4B2E05]
              text-2xl sm:text-3xl md:text-5xl
              mb-6 sm:mb-10 md:mb-14
              transition-all duration-700 ease-out
              ${testimTitle.isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'}
            `}
          >
            Ce que disent nos clients
          </h2>

          <div
            ref={testimGrid.ref}
            className="
              grid gap-4 sm:gap-6 md:gap-8
              grid-cols-1 md:grid-cols-3
            "
          >
            {[
              {
                name: 'Fatima Z.',
                stars: 5,
                date: 'Il y a 2 jours',
                text: "\"La meilleure mloukhia que j'ai goûtée depuis longtemps ! Le goût est authentique et la qualité irréprochable.\"",
              },
              {
                name: 'Youssef B.',
                stars: 4,
                date: 'Il y a 5 jours',
                text: "\"Livraison rapide et emballage soigné. J'ai commandé le coffret découverte, excellent rapport qualité-prix.\"",
              },
              {
                name: 'Leila H.',
                stars: 5,
                date: 'Il y a 1 semaine',
                text: '"Mes enfants adorent ! Enfin une mloukhia de qualité premium accessible."',
              },
            ].map((t, index) => (
              <div
                key={t.name}
                className={`
                  bg-white p-5 sm:p-6 md:p-8 rounded-xl shadow-lg
                  hover:-translate-y-2 hover:shadow-2xl
                  transition-all duration-500
                  ${testimGrid.isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-16'}
                `}
                style={{
                  transitionDelay: testimGrid.isVisible
                    ? `${index * 180}ms`
                    : '0ms',
                  transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${
                          i < t.stars ? 'fill-current' : ''
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] sm:text-sm text-gray-500 ml-2 sm:ml-3 font-seasons">
                    {t.date}
                  </p>
                </div>
                <div className="mb-2 sm:mb-4">
                  <div className="font-seasons text-gray-900 text-sm sm:text-base">
                    {t.name}
                  </div>
                </div>
                <p className="font-seasons text-xs sm:text-sm md:text-base lg:text-xl text-gray-700">
                  {t.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;