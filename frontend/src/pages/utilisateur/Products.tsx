// frontend/src/pages/Products.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Grid, List, Loader2, AlertCircle,
  SlidersHorizontal, Check, X, Filter, Tag 
} from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import { useGetProductsQuery } from '../../state/apiService';

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || ''
  );
  const [sortBy, setSortBy] = useState<string>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyDiscounted, setOnlyDiscounted] = useState<boolean>(false); 
  const [priceRange, setPriceRange] = useState<number>(0);
  const [maxPriceLimit, setMaxPriceLimit] = useState<number>(100);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: products = [], isLoading, error } = useGetProductsQuery();

  // Bloquer le scroll du body quand le drawer est ouvert
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFilterOpen]);

  useEffect(() => {
    if (products.length > 0) {
      const max = Math.max(...products.map((p) => p.price));
      setMaxPriceLimit(max);
      if (priceRange === 0) setPriceRange(max);
    }
  }, [products]);

  const categories = [
    { id: 'all', value: '', label: 'Toute la collection' },
    {
      id: 'epices',
      value: ['condiments', 'sauce', 'poudre'],
      label: 'Épices & Condiments',
      description: 'Le cœur du goût tunisien',
    },
    {
      id: 'sucre',
      value: 'confiture',
      label: 'Douceurs & confitures',
      description: 'Plaisirs sucrés naturels',
    },
    {
      id: 'essentiels',
      value: ['huile', 'miel'],
      label: 'Huiles & miels',
      description: 'Or liquide et nectars du terroir',
    },
    {
      id: 'cereales',
      value: 'grains',
      label: 'Céréales',
      description: 'Semoules et farines artisanales',
    },
    {
      id: 'saison',
      value: 'saison',
      label: 'Produits de Saison',
      description: 'Récoltes fraîches du moment',
    },
    {
      id: 'divers',
      value: 'divers',
      label: 'Divers',
      description: 'Autres trésors à découvrir',
    },
  ];

  const sortOptions = [
    { value: 'default', label: 'Ordre traditionnel' },
    { value: 'name', label: 'Nom A-Z' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
  ];

  const processedProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory) {
      const categoryConfig = categories.find(
        (c) =>
          (Array.isArray(c.value) ? c.value.join(',') : c.value) ===
          selectedCategory
      );
      if (categoryConfig) {
        const val = categoryConfig.value;
        result = result.filter((p) =>
          Array.isArray(val) ? val.includes(p.category) : p.category === val
        );
      }
    }

    if (onlyInStock) result = result.filter((p) => p.countInStock > 0);
    result = result.filter((p) => p.price <= priceRange);

    if (onlyDiscounted) {
      result = result.filter((p) => p.originalPrice && p.originalPrice > p.price);
    }
     // Filtre Prix
    result = result.filter((p) => p.price <= priceRange);

    return result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [products, selectedCategory, sortBy, onlyInStock,  onlyDiscounted, priceRange]);

  const handleCategoryChange = (categoryValue: string | string[]) => {
    const valueToStore = Array.isArray(categoryValue)
      ? categoryValue.join(',')
      : categoryValue;
    setSelectedCategory(valueToStore);
    if (valueToStore) {
      setSearchParams({ category: valueToStore });
    } else {
      setSearchParams({});
    }
    // Fermer le drawer sur mobile après sélection
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    setSelectedCategory('');
    setOnlyInStock(false);
    setPriceRange(maxPriceLimit);
     setOnlyDiscounted(false);
    setSortBy('default');
    setSearchParams({});
  };

  // ── État de chargement ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-[#357A32]" />
        <p className="mt-4 font-seasons text-sm sm:text-base text-gray-600">
          Chargement du terroir...
        </p>
      </div>
    );
  }

  // ── État d'erreur ──
  if (error) {
    const errorMessage =
      (error as any)?.data?.message || 'Erreur lors du chargement.';
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <AlertCircle className="h-8 w-8 text-red-500 mb-3" />
        <p className="text-red-600 text-sm sm:text-base text-center">
          {errorMessage}
        </p>
      </div>
    );
  }

  // ── Composant Sidebar / Filtres (réutilisé desktop + drawer mobile) ──
  const FilterContent = () => (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      {/* Stock & Prix */}
      <div
        className="
          bg-white lg:bg-gray-50/50
          p-4 sm:p-5 lg:p-6
          rounded-xl lg:rounded-2xl
          border border-gray-100
          space-y-4 sm:space-y-6
        "
      >
        {/* Toggle En Stock */}
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-bold text-[#4B2E05]">
            EN STOCK
          </span>
          <button
            onClick={() => setOnlyInStock(!onlyInStock)}
            className={`
              relative inline-flex items-center rounded-full
              transition-colors
              h-5 w-10 sm:h-6 sm:w-11
              ${onlyInStock ? 'bg-[#357A32]' : 'bg-gray-200'}
            `}
          >
            <span
              className={`
                inline-block rounded-full bg-white transition-transform
                h-3 w-3 sm:h-4 sm:w-4
                ${onlyInStock
                  ? 'translate-x-5 sm:translate-x-6'
                  : 'translate-x-1'
                }
              `}
            />
          </button>
        </div>
  {/* NOUVEAU : Toggle En Promotion */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs sm:text-sm font-bold text-[#4B2E05] flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-rose-500" /> EN PROMOTION
          </span>
          <button onClick={() => setOnlyDiscounted(!onlyDiscounted)} className={`relative inline-flex items-center rounded-full transition-colors h-5 w-10 sm:h-6 sm:w-11 ${onlyDiscounted ? 'bg-rose-500' : 'bg-gray-200'}`}>
            <span className={`inline-block rounded-full bg-white transition-transform h-3 w-3 sm:h-4 sm:w-4 ${onlyDiscounted ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* Slider prix */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] sm:text-xs font-bold text-[#4B2E05] uppercase">
              Prix Max
            </h3>
            <span className="text-xs sm:text-sm text-[#357A32] font-bold">
              {priceRange.toFixed(0)} DT
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={maxPriceLimit}
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="
              w-full h-1 sm:h-1.5
              bg-gray-200 rounded-lg
              appearance-none cursor-pointer
              accent-[#357A32]
            "
          />
          <div className="flex justify-between text-[9px] sm:text-[10px] text-gray-400">
            <span>0 DT</span>
            <span>{maxPriceLimit.toFixed(0)} DT</span>
          </div>
        </div>
      </div>

      {/* Catégories */}
      <div className="space-y-3 sm:space-y-4">
        <h3
          className="
            text-[10px] sm:text-xs
            font-bold uppercase tracking-widest
            text-[#4B2E05]
            flex items-center gap-2
          "
        >
          <SlidersHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#357A32]" />
          Catégories
        </h3>
        <div className="flex flex-col gap-1">
          {categories.map((cat) => {
            const categoryStringValue = Array.isArray(cat.value)
              ? cat.value.join(',')
              : cat.value;
            const isSelected = selectedCategory === categoryStringValue;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.value)}
                className={`
                  flex items-center justify-between
                  px-3 py-2.5 sm:px-4 sm:py-3
                  rounded-lg sm:rounded-xl
                  transition-all
                  text-xs sm:text-sm
                  ${isSelected
                    ? 'bg-[#4B2E05] text-white shadow-md'
                    : 'bg-transparent hover:bg-gray-50 text-gray-700'
                  }
                `}
              >
                <div className="text-left">
                  <span className="block font-medium">{cat.label}</span>
                  {cat.description && (
                    <span
                      className={`
                        block text-[9px] sm:text-[10px] mt-0.5
                        ${isSelected ? 'text-white/70' : 'text-gray-400'}
                      `}
                    >
                      {cat.description}
                    </span>
                  )}
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bouton Réinitialiser */}
      <button
        onClick={handleResetFilters}
        className="
          w-full text-center
          text-[10px] sm:text-xs
          text-gray-400 hover:text-[#357A32]
          transition-colors underline underline-offset-2
        "
      >
        Réinitialiser tous les filtres
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-800">

      {/* ═══════════════════════════════════════
          1. HEADER
      ═══════════════════════════════════════ */}
      <section
        className="
          py-8 sm:py-12 md:py-16 lg:py-20
          bg-gray-50 border-b border-gray-100
        "
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span
            className="
              inline-block px-2.5 py-0.5 sm:px-3 sm:py-1
              rounded bg-[#357A32]/10 text-[#357A32]
              text-[8px] sm:text-[10px]
              font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase
            "
          >
            Catalogue Officiel
          </span>

          <h1
            className="
              font-seasons text-[#4B2E05]
              text-2xl sm:text-3xl md:text-5xl lg:text-6xl
              mt-2 sm:mt-3 mb-2 sm:mb-4
            "
          >
            Nos produits
          </h1>

          <p
            className="
              max-w-md sm:max-w-xl mx-auto
              text-xs sm:text-sm md:text-base lg:text-lg
              text-gray-600 px-2
            "
          >
            L'essence du{' '}
            <span className="text-[#357A32] font-semibold">
              terroir tunisien
            </span>
            .
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          2. CONTENU PRINCIPAL
      ═══════════════════════════════════════ */}
      <div
        className="
          max-w-7xl mx-auto
          px-3 sm:px-4 md:px-6
          py-4 sm:py-8 md:py-12 lg:py-16
        "
      >
        {/* ── Barre d'outils mobile ── */}
        <div
          className="
            flex lg:hidden items-center justify-between
            mb-4 sm:mb-6
            p-3 sm:p-4
            bg-gray-50 rounded-xl sm:rounded-2xl
            border border-gray-100
          "
        >
          <button
            onClick={() => setIsFilterOpen(true)}
            className="
              flex items-center gap-1.5 sm:gap-2
              font-bold text-xs sm:text-sm text-[#4B2E05]
            "
          >
            <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#357A32]" />
            Filtres
            {/* Badge compteur de filtres actifs */}
            {(selectedCategory || onlyInStock || priceRange < maxPriceLimit) && (
              <span
                className="
                  bg-[#357A32] text-white
                  text-[8px] sm:text-[9px]
                  h-4 w-4 sm:h-5 sm:w-5
                  flex items-center justify-center
                  rounded-full font-bold
                "
              >
                {[
                  selectedCategory ? 1 : 0,
                  onlyInStock ? 1 : 0,
                  priceRange < maxPriceLimit ? 1 : 0,
                ].reduce((a, b) => a + b, 0)}
              </span>
            )}
          </button>

          <div className="h-5 w-px bg-gray-200" />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="
              bg-transparent outline-none
              text-[10px] sm:text-sm
              font-bold text-[#4B2E05]
              max-w-[140px] sm:max-w-none
            "
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12">

          {/* ═══════════════════════════
              SIDEBAR — Drawer mobile / Sticky desktop
          ═══════════════════════════ */}

          {/* Overlay mobile */}
          {isFilterOpen && (
            <div
              className="
                fixed inset-0 z-[100] bg-black/50
                lg:hidden
                animate-in fade-in duration-200
              "
              onClick={() => setIsFilterOpen(false)}
            />
          )}

          {/* Drawer mobile + Sidebar desktop */}
          <aside
            className={`
              fixed top-0 left-0 bottom-0 z-[110]
              w-[85vw] max-w-[320px]
              bg-white
              transform transition-transform duration-300 ease-in-out
              overflow-y-auto
              lg:relative lg:top-auto lg:left-auto lg:bottom-auto
              lg:z-0 lg:w-64 xl:w-72
              lg:max-w-none lg:transform-none
              lg:bg-transparent lg:overflow-visible
              ${isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            {/* Header du drawer mobile */}
            <div
              className="
                flex lg:hidden items-center justify-between
                p-4 sm:p-6
                border-b border-gray-100
                sticky top-0 bg-white z-10
              "
            >
              <h2 className="text-base sm:text-lg font-seasons text-[#4B2E05]">
                Filtres
              </h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            {/* Contenu des filtres */}
            <div className="p-4 sm:p-6 lg:p-0">
              <div className="lg:sticky lg:top-24">
                <FilterContent />

                {/* Bouton "Voir les résultats" — mobile seulement */}
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="
                    w-full lg:hidden
                    bg-[#357A32] hover:bg-[#2d6a2a]
                    text-white
                    py-3 sm:py-4
                    rounded-xl
                    font-bold text-sm sm:text-base
                    mt-6 sm:mt-8
                    transition-colors
                    active:scale-[0.98]
                  "
                >
                  Voir {processedProducts.length} produit
                  {processedProducts.length > 1 ? 's' : ''}
                </button>
              </div>
            </div>
          </aside>

          {/* ═══════════════════════════
              GRILLE DE PRODUITS
          ═══════════════════════════ */}
          <main className="flex-1 min-w-0">

            {/* Barre d'infos + tri desktop + sélecteur de vue */}
            <div
              className="
                flex items-center justify-between
                mb-4 sm:mb-6 md:mb-8
                pb-3 sm:pb-4
                border-b border-gray-100
              "
            >
              {/* Compteur de produits */}
              <div className="text-xs sm:text-sm md:text-base">
                <span className="text-[#4B2E05] font-seasons font-bold">
                  {processedProducts.length}
                </span>{' '}
                <span className="text-gray-500">
                  produit{processedProducts.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                {/* Tri desktop */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="
                    hidden lg:block
                    bg-gray-50 border border-gray-200
                    rounded-lg px-3 py-2
                    text-xs sm:text-sm
                    text-[#4B2E05] font-medium
                    outline-none
                    focus:border-[#357A32] focus:ring-1 focus:ring-[#357A32]/20
                  "
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {/* Sélecteur de vue */}
                <div className="hidden sm:flex bg-gray-100 p-0.5 sm:p-1 rounded-lg sm:rounded-xl">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`
                      p-1.5 sm:p-2 rounded-md sm:rounded-lg transition-all
                      ${viewMode === 'grid'
                        ? 'bg-white shadow-sm text-[#357A32]'
                        : 'text-gray-400 hover:text-gray-600'
                      }
                    `}
                  >
                    <Grid className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`
                      p-1.5 sm:p-2 rounded-md sm:rounded-lg transition-all
                      ${viewMode === 'list'
                        ? 'bg-white shadow-sm text-[#357A32]'
                        : 'text-gray-400 hover:text-gray-600'
                      }
                    `}
                  >
                    <List className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Contenu : produits ou état vide */}
            {processedProducts.length === 0 ? (
              <div
                className="
                  text-center
                  py-12 sm:py-16 md:py-20
                  px-4 sm:px-6
                  bg-gray-50 rounded-2xl sm:rounded-3xl
                  border-2 border-dashed border-gray-200
                "
              >
                <AlertCircle
                  className="
                    h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12
                    mx-auto mb-3 sm:mb-4
                    text-gray-300
                  "
                />
                <h3
                  className="
                    font-seasons text-[#4B2E05]
                    text-sm sm:text-base md:text-lg
                    mb-1 sm:mb-2
                  "
                >
                  Aucun produit trouvé
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-400 mb-4">
                  Essayez de modifier vos critères de recherche
                </p>
                <button
                  onClick={handleResetFilters}
                  className="
                    text-[#357A32] font-bold
                    text-[10px] sm:text-xs
                    underline underline-offset-4
                    hover:text-[#2d6a2a] transition-colors
                  "
                >
                  RÉINITIALISER LES FILTRES
                </button>
              </div>
            ) : (
              <div
                className={`
                  grid
                  ${viewMode === 'grid'
                    ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6'
                    : 'grid-cols-1 gap-3 sm:gap-4 md:gap-6'
                  }
                `}
              >
                {processedProducts.map((product) => (
                  <div
                    key={product._id}
                    className="w-full"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;