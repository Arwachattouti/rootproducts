import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Loader2,
  AlertCircle,
  MapPin,
  Package,
  X,
  Map,
  List,
  ChevronRight,
} from 'lucide-react';
import { Product } from '../../types';
import MapView from '../../components/MapView';
import { useGetProductsQuery } from '../../state/apiService';

// Descriptions statiques pour les régions
const regionDescriptions: Record<string, string> = {
  'Béja': 'Célèbre pour ses fromages artisanaux et ses terres fertiles du Nord-Ouest.',
  'Soliman': 'Située dans le Cap Bon, reconnue pour ses agrumes et ses cultures maraîchères.',
  'Nabeul': 'Capitale de la poterie et de la fleur d’oranger au cœur du Cap Bon.',
  'Tunis': 'La capitale, carrefour historique mêlant tradition et modernité.',
  'Sfax': 'Pôle économique majeur, réputé pour son huile d’olive et ses amandes.',
  'Kairouan': 'Ville historique célèbre pour ses tapisseries et ses pâtisseries traditionnelles.',
  'Bizerte': 'Port stratégique du Nord, connu pour ses produits de la mer et son relief unique.',
};

const Carte: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map');
  
  const { data: products = [], isLoading } = useGetProductsQuery();

  // 1. Logique de regroupement par Localisation
  const locationStats = useMemo(() => {
    const stats: Record<string, { count: number; products: Product[] }> = {};
    
    products.forEach((product) => {
      const origin = product.origin || 'Tunisie';
      if (!stats[origin]) {
        stats[origin] = { count: 0, products: [] };
      }
      stats[origin].count += 1;
      stats[origin].products.push(product);
    });

    // Conversion en tableau et filtrage par recherche
    return Object.entries(stats)
      .map(([name, data]) => ({
        name,
        count: data.count,
        description: regionDescriptions[name] || "Région riche en savoir-faire ancestral et produits du terroir.",
      }))
      .filter(loc => 
        loc.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.count - a.count);
  }, [products, searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#357A32]" />
        <p className="mt-4 font-seasons text-gray-600">Chargement de la carte...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <section className="py-10 sm:py-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="inline-block px-3 py-1 rounded bg-[#357A32]/10 text-[#357A32] text-[10px] font-bold tracking-widest uppercase mb-4">
            🇹🇳 Explorateur de Régions
          </span>
          <h1 className="text-3xl md:text-5xl font-seasons text-[#4B2E05] mb-4">
            Nos Origines
          </h1>
          <p className="max-w-2xl mx-auto font-seasons text-sm md:text-base text-gray-600">
            Parcourez la Tunisie à travers ses spécialités locales et l'origine de nos produits.
          </p>
        </div>
      </section>

      {/* FILTRES & RECHERCHE */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-md group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#357A32]" />
              <input
                type="text"
                placeholder="Rechercher une ville ou région..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#357A32]/10 focus:border-[#357A32] outline-none text-sm font-seasons transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* TOGGLE VUE (Visible sur tous les écrans pour la flexibilité) */}
            <div className="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
              <button
                onClick={() => setMobileView('map')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-md text-xs font-seasons transition-all ${
                  mobileView === 'map' ? 'bg-white text-[#357A32] shadow-sm' : 'text-gray-500'
                }`}
              >
                <Map className="w-3.5 h-3.5" /> Carte
              </button>
              <button
                onClick={() => setMobileView('list')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-md text-xs font-seasons transition-all ${
                  mobileView === 'list' ? 'bg-white text-[#357A32] shadow-sm' : 'text-gray-500'
                }`}
              >
                <List className="w-3.5 h-3.5" /> Régions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR (Desktop) / LISTE (Mobile) */}
          <aside className={`
            ${mobileView === 'list' ? 'block' : 'hidden lg:block'} 
            w-full lg:w-96 flex-shrink-0
          `}>
            <div className="space-y-4 overflow-y-auto max-h-[80vh] pr-2 scrollbar-hide">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#357A32]" /> {locationStats.length} Localisations trouvées
              </h3>
              
              {locationStats.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-sm text-gray-400 font-seasons">Aucune région trouvée</p>
                </div>
              ) : (
                locationStats.map((loc) => (
                  <div 
                    key={loc.name}
                    className="group bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-[#357A32]/30 transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-seasons text-[#4B2E05] group-hover:text-[#357A32] transition-colors">
                        {loc.name}
                      </h4>
                      <span className="bg-[#357A32]/10 text-[#357A32] text-[10px] px-2 py-1 rounded-full font-bold">
                        {loc.count} produits
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-seasons leading-relaxed mb-3">
                      {loc.description}
                    </p>
                    <div className="flex items-center text-[10px] text-[#357A32] font-bold uppercase tracking-wider">
                      Explorer la région <ChevronRight className="w-3 h-3 ml-1" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>

          {/* CARTE */}
          <main className={`
            ${mobileView === 'map' ? 'block' : 'hidden lg:block'} 
            flex-1
          `}>
            <div className="relative h-[500px] lg:h-[650px] bg-gradient-to-b from-amber-50 to-emerald-50 rounded-3xl overflow-hidden p-2 shadow-inner border border-gray-100">
              <MapView products={products} onProductClick={() => {}} />
              
              {/* Overlay d'aide sur la carte */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-lg lg:max-w-xs">
                <p className="text-[11px] font-seasons text-gray-600 flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#357A32]" />
                  Cliquez sur un marqueur pour voir les produits de la zone.
                </p>
              </div>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default Carte;