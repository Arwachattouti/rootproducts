import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Calendar, ArrowRight, Search, Clock, Mail, Loader2, AlertCircle } from 'lucide-react';
import { useGetBlogsQuery } from '../../state/apiService';
import { BlogPost } from '../../types';

const FeaturedPost: React.FC<{ post: BlogPost }> = ({ post }) => (
  <div className="group relative bg-white rounded-[2rem] border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.05)] mb-20">
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div className="relative overflow-hidden h-80 lg:h-[550px]">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
        <div className="absolute top-6 left-6">
          <span className="bg-[#357A32] text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
            À la une
          </span>
        </div>
      </div>
      <div className="p-8 lg:p-16 flex flex-col justify-center">
        <div className="flex items-center gap-4 mb-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <span className="text-[#357A32]">{post.category}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
        </div>
        <h2 className="text-3xl lg:text-5xl font-serif italic text-[#4B2E05] mb-6 leading-tight group-hover:text-[#357A32] transition-colors">
          {post.title}
        </h2>
        <p className="text-gray-500 text-lg mb-8 leading-relaxed font-light line-clamp-3">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between pt-8 border-t border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-[#4B2E05] font-bold border border-gray-100 text-sm">
              {post.author.charAt(0)}
            </div>
            <span className="text-sm font-medium text-[#4B2E05]">{post.author}</span>
          </div>
          <Link to={`/blog/${post._id}`} className="text-[10px] font-bold text-[#357A32] uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all underline underline-offset-4">
            Lire l'article <ArrowRight className="w-3 h-3" />
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
  const { data: blogs = [], isLoading, error } = useGetBlogsQuery();

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
      {/* Header */}
      <section className="py-20 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#357A32]">Journal & Conseils</span>
          <h1 className="text-4xl md:text-6xl font-serif italic text-[#4B2E05] mt-6 mb-6">Le Blog Root.</h1>
          <p className="max-w-2xl mx-auto text-gray-500 font-light italic">
            Conseils d'experts, bienfaits de la <span className="text-[#357A32] font-semibold">Mloukhia</span> et secrets de terroir.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Recherche et Filtres */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-16">
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#357A32] transition-colors" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#357A32]/20 outline-none text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => cat.value === 'all' ? setSearchParams({}) : setSearchParams({ category: cat.value })}
                className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                  selectedCategory === cat.value ? "bg-[#4B2E05] text-white shadow-md" : "bg-transparent text-gray-400 hover:text-[#357A32]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Liste Articles */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-serif italic">Aucun article trouvé.</p>
          </div>
        ) : (
          <>
            {selectedCategory === 'all' && !searchTerm && <FeaturedPost post={filteredPosts[0]} />}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {(selectedCategory === 'all' && !searchTerm ? filteredPosts.slice(1) : filteredPosts).map((post) => (
                <article key={post._id} className="group flex flex-col">
                  <div className="relative h-64 rounded-2xl overflow-hidden mb-6 bg-gray-100">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-[9px] font-bold uppercase text-[#357A32]">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                    <Calendar className="w-3 h-3" /> {new Date(post.date).toLocaleDateString('fr-FR')}
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-serif italic text-[#4B2E05] mb-4 group-hover:text-[#357A32] transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2 font-light">
                    {post.excerpt}
                  </p>
                  <Link to={`/blog/${post._id}`} className="mt-auto text-[10px] font-bold text-[#357A32] uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                    Lire l'article <ArrowRight className="w-3 h-3" />
                  </Link>
                </article>
              ))}
            </div>
          </>
        )}

        {/* Newsletter */}
        <section className="mt-32 bg-[#4B2E05] rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
             <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          </div>
          <Mail className="w-12 h-12 text-white/20 mx-auto mb-6" />
          <h2 className="text-3xl font-serif italic text-white mb-4">Restez dans la confidence</h2>
          <p className="text-white/60 mb-10 max-w-lg mx-auto font-light">Inscrivez-vous pour recevoir nos recettes exclusives et l'actualité de nos récoltes.</p>
          <form className="max-w-md mx-auto flex flex-col md:flex-row gap-4">
            <input type="email" placeholder="Votre email..." className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#357A32]/50 text-sm" />
            <button className="bg-[#357A32] text-white px-8 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-white hover:text-[#4B2E05] transition-all">S'abonner</button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Blog;