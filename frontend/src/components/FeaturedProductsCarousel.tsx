// components/FeaturedProductsCarousel.tsx
import React, { useRef, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import ProductCard from './ProductCard';
import { Product } from '../types';  // ← Importer le VRAI type

interface FeaturedProductsCarouselProps {
  products: Product[];          // ← Utiliser le vrai type ici
  isLoading: boolean;
  error: any;
  autoScrollInterval?: number;
}

const FeaturedProductsCarousel: React.FC<FeaturedProductsCarouselProps> = ({
  products,
  isLoading,
  error,
  autoScrollInterval = 3000,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || products.length === 0) return;

    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;

    let scrollAmount = 0;
    const gap = 12;
    const firstCard = container.firstChild as HTMLElement;
    if (!firstCard) return;
    const cardWidth = firstCard.offsetWidth + gap;

    const interval = setInterval(() => {
      if (scrollAmount + container.offsetWidth >= container.scrollWidth) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
        scrollAmount = 0;
      } else {
        scrollAmount += cardWidth;
        container.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [products, autoScrollInterval]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-green-600" />
        <p className="ml-3 text-sm sm:text-lg text-gray-600">
          Chargement des produits phares...
        </p>
      </div>
    );
  }

  if (error) {
    const errorMessage =
      (error as any)?.data?.message ||
      'Erreur lors du chargement des produits phares.';
    return (
      <div className="flex justify-center items-center py-10 text-red-600">
        <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
        <p className="text-sm sm:text-base">{errorMessage}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <p className="text-gray-500 text-sm sm:text-lg">
          Aucun produit phare disponible pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div
        ref={scrollRef}
        className="
          flex flex-nowrap overflow-x-auto
          gap-3 pb-4 sm:pb-8
          scrollbar-hide snap-x snap-mandatory
          px-2 sm:px-4 scroll-smooth
          md:grid md:grid-cols-2
          lg:grid-cols-3 xl:grid-cols-4
          md:gap-4 lg:gap-6
          md:overflow-x-visible md:px-0
        "
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="
              snap-start flex-shrink-0
              w-[75vw] sm:w-[60vw] md:w-full
              h-full
            "
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProductsCarousel;