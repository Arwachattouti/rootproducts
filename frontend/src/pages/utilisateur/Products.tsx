import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List, Loader2, AlertCircle, SlidersHorizontal, ChevronRight, Check } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import { useGetProductsQuery } from '../../state/apiService';

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState<string>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<number>(0);
  const [maxPriceLimit, setMaxPriceLimit] = useState<number>(100);

  const { data: products = [], isLoading, error } = useGetProductsQuery();

  useEffect(() => {
    if (products.length > 0) {
      const max = Math.max(...products.map(p => p.price));
      setMaxPriceLimit(max);
      setPriceRange(max);
    }
  }, [products]);

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
    { value: 'default', label: 'Ordre traditionnel' },
    { value: 'name', label: 'Nom A-Z' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'rating', label: 'Mieux notés' }
  ];

  const processedProducts = useMemo(() => {
    let result = [...products];
    if (selectedCategory) result = result.filter(p => p.category === selectedCategory);
    if (onlyInStock) result = result.filter(p => p.countInStock > 0);
    result = result.filter(p => p.price <= priceRange);

    return result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'rating': return (b.rating || 0) - (a.rating || 0);
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });
  }, [products, selectedCategory, sortBy, onlyInStock, priceRange]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    category ? setSearchParams({ category }) : setSearchParams({});
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#357A32]" />
        <p className="mt-4 text-gray-600 font-serif italic">Chargement du terroir...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      
      {/* 1. Header Section (Style About/Home) */}
      <section className="relative py-20 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="px-3 py-1 rounded bg-[#357A32]/10 text-[#357A32] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
            Catalogue Officiel
          </span>
          <h1 className="text-4xl md:text-6xl font-serif italic text-[#4B2E05] mt-6 mb-4">
            Nos Produits
          </h1>
          <div className="h-1 w-20 bg-[#357A32] mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 font-light italic">
            L'essence du <span className="text-[#357A32] font-semibold">terroir tunisien</span>, capturée dans une sélection de crus d'exception.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-16">

          {/* 2. Sidebar de filtrage */}
          <aside className="lg:w-72 shrink-0">
            <div className="sticky top-24 space-y-10">
              
              {/* Filtres de disponibilité */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#4B2E05]">EN STOCK</span>
                  <button 
                    onClick={() => setOnlyInStock(!onlyInStock)}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${onlyInStock ? 'bg-[#357A32]' : 'bg-gray-200'}`}
                  >
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${onlyInStock ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-[#4B2E05] uppercase tracking-wider">Prix Max</h3>
                    <span className="text-[#357A32] font-serif font-bold">{priceRange} DT</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={maxPriceLimit}
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#357A32]"
                  />
                </div>
              </div>

              {/* Menu Catégories */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#4B2E05] flex items-center gap-2 mb-4">
                  <SlidersHorizontal className="h-4 w-4 text-[#357A32]" /> Catégories
                </h3>
                <div className="flex flex-col gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => handleCategoryChange(cat.value)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left ${
                        selectedCategory === cat.value
                        ? 'bg-[#4B2E05] text-white shadow-md translate-x-1'
                        : 'bg-transparent hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      <span className="text-sm font-medium">{cat.label}</span>
                      {selectedCategory === cat.value && <Check className="h-4 w-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tri */}
              <div className="pt-6 border-t border-gray-100">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-3">Trier par</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-[#357A32]/20"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          {/* 3. Grille de Produits */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100">
              <div className="text-gray-500 text-sm italic">
                <span className="text-[#4B2E05] font-bold not-italic">{processedProducts.length}</span> produits trouvés
              </div>

              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#357A32]' : 'text-gray-400'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[#357A32]' : 'text-gray-400'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {processedProducts.length === 0 ? (
              <div className="text-center py-32 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <AlertCircle className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-serif text-[#4B2E05] mb-2">Aucun résultat</h3>
                <p className="text-gray-500 mb-6">Essayez d'ajuster vos filtres.</p>
                <button
                  onClick={() => { setSelectedCategory(''); setOnlyInStock(false); setPriceRange(maxPriceLimit); }}
                  className="text-[#357A32] font-bold uppercase text-xs tracking-widest underline"
                >
                  Réinitialiser tout
                </button>
              </div>
            ) : (
              <div className={`grid gap-10 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {processedProducts.map((product) => (
                  <div key={product._id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
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