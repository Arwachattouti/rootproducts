import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List, Loader2, AlertCircle, ChevronRight, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import { Product } from '../../types';
import { useGetProductsQuery } from '../../state/apiService';

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState<string>('name');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: products = [], isLoading, error } = useGetProductsQuery();

  const categories = [
    { value: '', label: 'Toute la collection' },
    { value: 'bio', label: 'Bio & Naturel' },
    { value: 'epice', label: 'Épices Fines' },
    { value: 'coffret', label: 'Nos Couffins' },
    { value: 'huile', label: 'Huiles & Miels' },
    { value: 'confiture', label: 'Confitures' },
    { value: 'legumineuse', label: 'Légumineuses' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Nom A-Z' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'rating', label: 'Mieux notés' }
  ];

  useEffect(() => {
    let filtered = [...products];
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    switch (sortBy) {
      case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
      default: filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    setFilteredProducts(filtered);
  }, [products, selectedCategory, sortBy]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    category ? setSearchParams({ category }) : setSearchParams({});
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFCF9] flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#373E02] mb-4" />
        <p className="text-sm font-bold uppercase tracking-widest text-[#373E02] opacity-60">Préparation de la sélection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl text-center max-w-md border border-red-50">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-800 font-bold mb-2">Une erreur est survenue</p>
          <p className="text-gray-500 text-sm">{(error as any)?.data?.message || 'Impossible de charger les produits.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF9]">
      {/* --- 1. HEADER : Version Compacte & Élégante --- */}
      <section className="relative pt-20 pb-12 overflow-hidden bg-[#FDFCF9] border-b border-gray-50">
        {/* Pattern de fond */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none">
          <svg width="100%" height="100%" fill="none">
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#373E02" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* Badge réduit */}
            <div className="inline-flex items-center justify-center space-x-3 mb-4">
              <span className="h-[1px] w-6 bg-[#373E02]/30"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#373E02]">
                L'Épicerie Fine
              </span>
              <span className="h-[1px] w-6 bg-[#373E02]/30"></span>
            </div>

            {/* Titre avec tailles réduites (5xl au lieu de 7xl) */}
            <h1 className="text-4xl md:text-5xl font-black text-[#373E02] mb-4 tracking-tighter leading-tight">
              Nos Produits <span className="font-serif italic font-light text-[#373E02]/80 text-5xl md:text-6xl">Authentiques</span>
            </h1>

            {/* Description plus courte et sans la barre de séparation pour gagner de la place */}
            <div className="max-w-2xl mx-auto">
              <p className="text-base md:text-lg text-gray-500 leading-relaxed">
                Le meilleur du terroir tunisien, sélectionné avec rigueur et passion.
                Une gamme <span className="text-[#373E02] font-semibold">100% naturelle</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-16">

          {/* --- 2. SIDEBAR FILTERS (Sticky & Clean) --- */}
          <div className="lg:w-72">
            <div className="bg-white rounded-[2.5rem] p-8 sticky top-32 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#373E02]">Filtres</h3>
                <SlidersHorizontal className="h-4 w-4 text-[#373E02]/40" />
              </div>

              <div className="space-y-10">
                {/* Catégories */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-5">Catégories</h4>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <button
                        key={category.value}
                        onClick={() => handleCategoryChange(category.value)}
                        className={`flex items-center group w-full text-left transition-all ${selectedCategory === category.value ? 'text-[#373E02]' : 'text-gray-400 hover:text-gray-600'
                          }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full mr-3 transition-all ${selectedCategory === category.value ? 'bg-[#373E02] scale-150' : 'bg-transparent border border-gray-200'
                          }`} />
                        <span className={`text-sm font-bold tracking-tight ${selectedCategory === category.value ? 'translate-x-1' : ''} transition-transform`}>
                          {category.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tri */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-5">Trier par</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-[#FDFCF9] border-none rounded-xl py-3 px-4 text-sm font-medium text-gray-600 focus:ring-2 focus:ring-[#373E02]/10 outline-none appearance-none"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* --- 3. PRODUCT GRID --- */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span className="text-[#373E02]">{filteredProducts.length}</span> Trésors trouvés
              </p>

              <div className="flex items-center bg-white rounded-xl p-1 shadow-sm border border-gray-50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#F8F6F1] text-[#373E02]' : 'text-gray-300 hover:text-gray-500'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#F8F6F1] text-[#373E02]' : 'text-gray-300 hover:text-gray-500'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
                <p className="text-gray-400 font-serif italic text-xl">Aucun produit ne correspond à votre recherche.</p>
                <button
                  onClick={() => handleCategoryChange('')}
                  className="mt-4 text-[#373E02] font-black text-[10px] uppercase tracking-widest border-b border-[#373E02]"
                >
                  Voir toute la collection
                </button>
              </div>
            ) : (
              <div className={`grid gap-10 ${viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                : 'grid-cols-1'
                }`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;