import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Calendar, ArrowRight, Search, Clock, Mail, Loader2, AlertCircle } from 'lucide-react';
import { useGetBlogsQuery } from '../../state/apiService';
import { BlogPost } from '../../types';

const FeaturedPost: React.FC<{ post: BlogPost }> = ({ post }) => (
  <div className="group relative bg-white rounded-[2rem] border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.05)] mb-10 sm:mb-20">
    <div className="grid grid-cols-1 lg:grid-cols-2">

      {/* 1. Image : Hauteur réduite sur mobile (h-64) contre h-80 auparavant */}
      <div className="relative overflow-hidden font-seasons  h-64 sm:h-80 lg:h-[550px]">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
          <span className="bg-[#357A32] text-white px-3 py-1 rounded-full text-[9px] font-seasons  uppercase tracking-widest shadow-lg">
            À la une
          </span>
        </div>
      </div>

      {/* 2. Contenu : Padding ajusté (p-6 sur mobile) */}
      <div className="p-6 sm:p-8 lg:p-16 flex flex-col justify-center">

        {/* Métadonnées plus compactes */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6 text-[10px] sm:text-sm font-seasons uppercase tracking-widest">
          <span className="text-[#357A32]">{post.category}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {post.readTime}
          </span>
        </div>

        {/* Titre : Taille réduite sur mobile (text-2xl) pour éviter l'encombrement */}
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-seasons  text-[#4B2E05] mb-4 sm:mb-6 leading-tight group-hover:text-[#357A32] transition-colors">
          {post.title}
        </h2>

        {/* Excerpt : Taille de texte standard (text-base) sur mobile */}
        <p className="font-seasons  text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>

        {/* 3. Footer de carte : Séparateur et alignement */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-50 rounded-full flex items-center justify-center text-[#4B2E05] font-seasons  border border-gray-100 text-xs sm:text-sm">
              {post.author.charAt(0)}
            </div>
            <span className="text-xs sm:text-sm font-seasons  text-[#4B2E05]">{post.author}</span>
          </div>

          <Link
            to={`/blog/${post._id}`}
            className="text-[10px] sm:text-sm font-seasons text-[#357A32] uppercase tracking-widest flex items-center gap-2 transition-all underline underline-offset-4"
          >
            Lire <span className="hidden sm:inline font-seasons ">l'article</span> <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  </div>
);

const Blog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const selectedCategory = searchParams.get('category') || 'all';
  const { data: blogs = [], isLoading } = useGetBlogsQuery();

  const categories = [
    { value: 'all', label: 'Tous les articles' },
    { value: 'Nutrition', label: 'Nutrition' },
    { value: 'Culture', label: 'Culture' },
    { value: 'Jardinage', label: 'Jardinage' },
    { value: 'Cuisine', label: 'Cuisine' }
  ];

  useEffect(() => {
    let filtered = [...blogs];
    if (selectedCategory !== 'all') filtered = filtered.filter(p => p.category === selectedCategory);
    if (searchTerm) filtered = filtered.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredPosts(filtered);
  }, [blogs, selectedCategory, searchTerm]);

  if (isLoading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-[#357A32]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Header : Réduit de py-20 à py-12 sur mobile */}
      <section className="py-12 sm:py-20 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
         <span className="px-3 py-1 rounded bg-[#357A32]/10 text-[#357A32] text-[10px] font-bold tracking-[0.2em] uppercase">
            Journal & Conseils
          </span>
          {/* Taille de texte ajustée : text-3xl sur mobile */}
          <h1 className="text-3xl sm:text-6xl font-seasons text-[#4B2E05] mt-4 mb-4 sm:mt-6 sm:mb-6">
            NOS BLOG  
          </h1>
          <p className="max-w-2xl mx-auto font-seasons md:text-xl text-sm sm:text-base  px-2">
            Conseils, bienfaits de nos <span className="text-[#357A32] font-seasons">produits</span> et secrets de terroir.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8 sm:py-16">

        {/* 2. Recherche et Filtres : Espacement réduit sur mobile */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-center justify-between mb-8 sm:mb-16">

          {/* Barre de Recherche : pl-10 et py-3 pour gagner en finesse */}
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-700 group-focus-within:text-[#357A32] transition-colors" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#357A32]/5 focus:border-[#357A32] outline-none text-sm transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* 3. Filtres de Catégories : Optimisation du scroll horizontal */}
          <div className="w-full lg:w-auto">
            <div className="flex flex-row overflow-x-auto pb-4 sm:pb-0 scrollbar-hide gap-2 -mx-6 px-6 sm:mx-0 sm:px-0 sm:flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => cat.value === 'all' ? setSearchParams({}) : setSearchParams({ category: cat.value })}
                  className={`whitespace-nowrap px-5 py-2 rounded-full text-[10px] sm:text-xs font-seasons uppercase tracking-widest transition-all border ${selectedCategory === cat.value
                      ? "bg-[#4B2E05] border-[#4B2E05] text-white  font-seasons  shadow-md shadow-[#4B2E05]/20"
                      : "bg-white border-gray-100 font-seasons  active:bg-gray-50"
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Liste Articles */}
        {/* Liste Articles */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200 mx-4 sm:mx-0">
            <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-700 font-seasons ">Aucun article ne correspond à votre recherche.</p>
          </div>
        ) : (
          <>
            {/* Featured Post : Affiché uniquement si aucun filtre n'est actif */}
            {selectedCategory === 'all' && !searchTerm && (
              <FeaturedPost post={filteredPosts[0]} />
            )}

            {/* Grille d'articles : gap réduit sur mobile (gap-8) pour gagner de la place */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
              {(selectedCategory === 'all' && !searchTerm ? filteredPosts.slice(1) : filteredPosts).map((post) => (
                <article key={post._id} className="group flex flex-col bg-white">

                  {/* Image : Hauteur adaptée (h-56) sur mobile pour ne pas trop étirer la page */}
                  <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden font-seasons  mb-5 bg-gray-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Badge catégorie sur l'image */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded text-[9px] font-seasons  uppercase text-[#357A32] shadow-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Métadonnées (Date et Temps de lecture) */}
                  <div className="flex items-center gap-3 text-[9px] font-seasons  tracking-widest mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>

                  {/* Titre : text-lg sur mobile pour une lecture plus douce */}
                  <h3 className="text-lg sm:text-xl font-seasons  md:text-2xl  text-[#4B2E05] mb-3 group-hover:text-[#357A32] transition-colors leading-snug">
                    {post.title}
                  </h3>

                  {/* Extrait : text-sm sur mobile pour la légèreté */}
                  <p className="text-sm font-seasons  md:text-xl leading-relaxed mb-5 line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Lien "Lire l'article" avec micro-interaction */}
                  <Link
                    to={`/blog/${post._id}`}
                    className="mt-auto text-[10px] font-seasons   md:text-lg text-[#357A32] uppercase tracking-[0.2em] flex items-center gap-2 group-hover:gap-3 transition-all"
                  >
                    Lire l'article <ArrowRight className="w-3 h-3" />
                  </Link>
                </article>
              ))}
            </div>
          </>
        )}


      </div>
    </div>
  );
};

export default Blog;