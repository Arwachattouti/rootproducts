import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Calendar,
  ArrowRight,
  Search,
  Clock,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useGetBlogsQuery } from '../../state/apiService';
import { BlogPost } from '../../types';

const FeaturedPost: React.FC<{ post: BlogPost }> = ({ post }) => (
  <div className="group relative bg-white rounded-2xl sm:rounded-[2rem] border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.05)] mb-8 sm:mb-12 md:mb-20">
    <div className="grid grid-cols-1 lg:grid-cols-2">
      {/* Image */}
      <div className="relative overflow-hidden h-52 sm:h-64 md:h-80 lg:h-[550px]">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 md:top-6 md:left-6">
          <span className="bg-[#357A32] text-white px-2.5 sm:px-3 py-1 rounded-full text-[8px] sm:text-[9px] font-seasons uppercase tracking-widest shadow-lg">
            À la une
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-5 sm:p-6 md:p-8 lg:p-12 xl:p-16 flex flex-col justify-center">
        {/* Métadonnées */}
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6 text-[9px] sm:text-[10px] md:text-xs font-seasons uppercase tracking-widest">
          <span className="text-[#357A32]">{post.category}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {post.readTime}
          </span>
        </div>

        {/* Titre */}
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-seasons text-[#4B2E05] mb-3 sm:mb-4 md:mb-6 leading-tight group-hover:text-[#357A32] transition-colors">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="font-seasons text-sm sm:text-base md:text-lg mb-4 sm:mb-6 md:mb-8 leading-relaxed line-clamp-2 sm:line-clamp-3">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 sm:pt-5 md:pt-6 border-t border-gray-50">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gray-50 rounded-full flex items-center justify-center text-[#4B2E05] font-seasons border border-gray-100 text-[10px] sm:text-xs md:text-sm">
              {post.author.charAt(0)}
            </div>
            <span className="text-[10px] sm:text-xs md:text-sm font-seasons text-[#4B2E05]">
              {post.author}
            </span>
          </div>

          <Link
            to={`/blog/${post._id}`}
            className="text-[9px] sm:text-[10px] md:text-sm font-seasons text-[#357A32] uppercase tracking-wider sm:tracking-widest flex items-center gap-1.5 sm:gap-2 transition-all underline underline-offset-4"
          >
            Lire{' '}
            <span className="hidden sm:inline font-seasons">l'article</span>
            <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
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
    { value: 'all', label: 'Tous' },
    { value: 'Nutrition', label: 'Nutrition' },
    { value: 'Culture', label: 'Culture' },
    { value: 'Jardinage', label: 'Jardinage' },
    { value: 'Cuisine', label: 'Cuisine' },
  ];

  useEffect(() => {
    let filtered = [...blogs];
    if (selectedCategory !== 'all')
      filtered = filtered.filter((p) => p.category === selectedCategory);
    if (searchTerm)
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setFilteredPosts(filtered);
  }, [blogs, selectedCategory, searchTerm]);

  if (isLoading)
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-[#357A32]" />
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-8 sm:py-12 md:py-20 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block px-2.5 sm:px-3 py-1 rounded bg-[#357A32]/10 text-[#357A32] text-[9px] sm:text-[10px] font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase">
            Journal & Conseils
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-seasons text-[#4B2E05] mt-3 sm:mt-4 md:mt-6 mb-3 sm:mb-4 md:mb-6">
            Notre Blog
          </h1>
          <p className="max-w-2xl mx-auto font-seasons text-sm sm:text-base md:text-lg lg:text-xl px-2">
            Conseils, bienfaits de nos{' '}
            <span className="text-[#357A32] font-seasons">produits</span> et
            secrets de terroir.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-16">
        {/* Recherche et Filtres */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 md:gap-6 items-stretch lg:items-center justify-between mb-6 sm:mb-10 md:mb-16">
          {/* Barre de Recherche */}
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#357A32] transition-colors" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-[#357A32]/5 focus:border-[#357A32] outline-none text-xs sm:text-sm transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtres Catégories */}
          <div className="w-full lg:w-auto">
            <div className="flex flex-row overflow-x-auto pb-2 sm:pb-0 scrollbar-hide gap-1.5 sm:gap-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() =>
                    cat.value === 'all'
                      ? setSearchParams({})
                      : setSearchParams({ category: cat.value })
                  }
                  className={`whitespace-nowrap px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full text-[9px] sm:text-[10px] md:text-xs font-seasons uppercase tracking-wider sm:tracking-widest transition-all border shrink-0 ${
                    selectedCategory === cat.value
                      ? 'bg-[#4B2E05] border-[#4B2E05] text-white font-seasons shadow-md shadow-[#4B2E05]/20'
                      : 'bg-white border-gray-100 font-seasons active:bg-gray-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Liste Articles */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 sm:py-16 md:py-20 bg-gray-50 rounded-xl sm:rounded-2xl md:rounded-[2rem] border border-dashed border-gray-200">
            <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <p className="text-gray-700 font-seasons text-sm sm:text-base px-4">
              Aucun article ne correspond à votre recherche.
            </p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {selectedCategory === 'all' && !searchTerm && filteredPosts[0] && (
              <FeaturedPost post={filteredPosts[0]} />
            )}

            {/* Grille d'articles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
              {(selectedCategory === 'all' && !searchTerm
                ? filteredPosts.slice(1)
                : filteredPosts
              ).map((post) => (
                <article
                  key={post._id}
                  className="group flex flex-col bg-white"
                >
                  {/* Image */}
                  <div className="relative h-44 sm:h-52 md:h-56 lg:h-64 rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-4 md:mb-5 bg-gray-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3">
                      <span className="bg-white/95 backdrop-blur-sm px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[8px] sm:text-[9px] font-seasons uppercase text-[#357A32] shadow-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Métadonnées */}
                  <div className="flex items-center gap-2 sm:gap-3 text-[8px] sm:text-[9px] font-seasons tracking-wider sm:tracking-widest mb-2 sm:mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      {new Date(post.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      {post.readTime}
                    </div>
                  </div>

                  {/* Titre */}
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-seasons text-[#4B2E05] mb-2 sm:mb-3 group-hover:text-[#357A32] transition-colors leading-snug">
                    {post.title}
                  </h3>

                  {/* Extrait */}
                  <p className="text-xs sm:text-sm md:text-base font-seasons leading-relaxed mb-4 sm:mb-5 line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Lien */}
                  <Link
                    to={`/blog/${post._id}`}
                    className="mt-auto text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-seasons text-[#357A32] uppercase tracking-[0.15em] sm:tracking-[0.2em] flex items-center gap-1.5 sm:gap-2 group-hover:gap-2.5 sm:group-hover:gap-3 transition-all"
                  >
                    Lire l'article
                    <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
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