import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List, Loader2, AlertCircle, SlidersHorizontal, Check, X, Filter } from 'lucide-react';
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

  // État pour le menu de filtres mobile
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: products = [], isLoading, error } = useGetProductsQuery();

  useEffect(() => {
    if (products.length > 0) {
      const max = Math.max(...products.map(p => p.price));
      setMaxPriceLimit(max);
      if (priceRange === 0) setPriceRange(max);
    }
  }, [products]);

 const categories = [
  { id: 'all', value: '', label: 'Toute la collection', icon: 'AllIcon' },
    { id: 'saison', value: 'saison', label: 'Produits de Saison',description: 'Récoltes fraîches du moment'},
  { id: 'epices', value: ['condiments', 'sauce', 'poudre'], label: 'Épices & Condiments',description: 'Le cœur du goût tunisien'},
  { id: 'sucre', value: 'confiture', label: 'Douceurs & Confitures',description: 'Plaisirs sucrés naturels'},
  { id: 'essentiels', value: ['huile', 'miel'], label: 'Huiles & Miels',description: 'Or liquide et nectars du terroir'},
   { id: 'cereales', value: 'grains', label: 'Céréales',description: 'Semoules et farines artisanales'},
  { id: 'divers', value: 'divers', label: 'Divers',description: 'Autres trésors à découvrir'}
];

  const sortOptions = [
    { value: 'default', label: 'Ordre traditionnel' },
    { value: 'name', label: 'Nom A-Z' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' }
  ];

  const processedProducts = useMemo(() => {
    let result = [...products];
    if (selectedCategory) {
      // On cherche l'objet de catégorie correspondant pour voir si c'est un tableau ou une string
      const categoryConfig = categories.find(c =>
        (Array.isArray(c.value) ? c.value.join(',') : c.value) === selectedCategory
      );

      if (categoryConfig) {
        const val = categoryConfig.value;
        result = result.filter(p =>
          Array.isArray(val) ? val.includes(p.category) : p.category === val
        );
      }
    }

    if (onlyInStock) result = result.filter(p => p.countInStock > 0);
    result = result.filter(p => p.price <= priceRange);
    result = result.filter(p => p.price <= priceRange);

    return result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });
  }, [products, selectedCategory, sortBy, onlyInStock, priceRange]);

  const handleCategoryChange = (categoryValue: string | string[]) => {
    // Convertit le tableau en string pour l'état et l'URL (ex: "huile,miel")
    const valueToStore = Array.isArray(categoryValue) ? categoryValue.join(',') : categoryValue;

    setSelectedCategory(valueToStore);

    if (valueToStore) {
      setSearchParams({ category: valueToStore });
    } else {
      setSearchParams({});
    }
    setIsFilterOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#357A32]" />
        <p className="mt-4 font-serif ">Chargement du terroir...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">

      {/* 1. Header Section - Ajusté pour Mobile */}
      <section className="py-12 sm:py-20 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="px-3 py-1 rounded bg-[#357A32]/10 text-[#357A32] text-[10px] font-bold tracking-[0.2em] uppercase">
            Catalogue Officiel
          </span>
          <h1 className="text-3xl md:text-6xl font-seasons text-[#4B2E05] mt-2 mb-4">
            Nos produits
          </h1>
          <p className="max-w-xl mx-auto text-base md:text-lg   px-2">
            L'essence du <span className="text-[#357A32] font-semibold">terroir tunisien</span>.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">

        {/* Barre d'outils mobile (Filtres & Tri rapide) */}
        <div className="flex lg:hidden items-center justify-between mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 font-bold text-sm text-[#4B2E05]"
          >
            <Filter className="h-4 w-4 text-[#357A32]" /> Filtres
          </button>
          <div className="h-6 w-px bg-gray-200"></div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-sm font-bold text-[#4B2E05] outline-none"
          >
            {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* 2. Sidebar (Desktop) / Drawer (Mobile) */}
          <aside className={`
            fixed inset-0 z-[110] lg:relative lg:inset-auto lg:z-0 lg:w-72 
            transition-transform duration-300 ease-in-out
            ${isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            {/* Overlay mobile */}
            <div
              className={`fixed inset-0 bg-black/50 lg:hidden transition-opacity ${isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              onClick={() => setIsFilterOpen(false)}
            />

            <div className="relative h-full lg:h-auto w-80 lg:w-full bg-white lg:bg-transparent p-8 lg:p-0 overflow-y-auto">
              <div className="flex lg:hidden items-center justify-between mb-8">
                <h2 className="text-xl font-serif  text-[#4B2E05]">Filtres</h2>
                <button onClick={() => setIsFilterOpen(false)}><X className="h-6 w-6" /></button>
              </div>

              <div className="sticky top-24 space-y-10">
                {/* Stock & Prix */}
                <div className="bg-white lg:bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
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
                      <h3 className="text-xs font-bold text-[#4B2E05] uppercase">Prix Max</h3>
                      <span className="text-[#357A32] font-bold">{priceRange} DT</span>
                    </div>
                    <input
                      type="range" min="0" max={maxPriceLimit} value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#357A32]"
                    />
                  </div>
                </div>

                {/* Menu Catégories */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#4B2E05] flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-[#357A32]" /> Catégories
                  </h3>
                  <div className="flex flex-col gap-1">
                    {categories.map((cat) => {
                      // On crée une version string de la valeur pour la comparaison (ex: "huile,miel")
                      const categoryStringValue = Array.isArray(cat.value) ? cat.value.join(',') : cat.value;
                      const isSelected = selectedCategory === categoryStringValue;

                      return (
                        <button
                          key={categoryStringValue} // Utilise la string comme clé unique
                          onClick={() => handleCategoryChange(cat.value)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all text-sm ${isSelected
                              ? 'bg-[#4B2E05] text-white shadow-md'
                              : 'bg-transparent hover:bg-gray-50 text-gray-700'
                            }`}
                        >
                          <span>{cat.label}</span>
                          {isSelected && <Check className="h-4 w-4" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full lg:hidden bg-[#357A32] text-white py-4 rounded-xl font-bold mt-8"
                >
                  Voir les {processedProducts.length} produits
                </button>
              </div>
            </div>
          </aside>

          {/* 3. Grille de Produits */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
              <div className=" text-lg">
                <span className="text-[#4B2E05] font-seasons ">{processedProducts.length}</span> produits
              </div>

              {/* Sélecteur de vue (Caché sur petit mobile pour simplifier) */}
              <div className="hidden sm:flex bg-gray-100 p-1 rounded-xl">
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
              <div className="text-center py-20 px-4 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-serif text-[#4B2E05] mb-2">Aucun produit trouvé</h3>
                <button
                  onClick={() => { setSelectedCategory(''); setOnlyInStock(false); setPriceRange(maxPriceLimit); }}
                  className="text-[#357A32] font-bold text-xs underline mt-4"
                >
                  RÉINITIALISER LES FILTRES
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 md:gap-8 ${viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
                }`}>
                {processedProducts.map((product) => (
                  <div key={product._id} className="w-full max-w-[400px] mx-auto sm:max-w-none">
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