import React, { useState } from 'react';
import { Calendar, User, ArrowRight, Search, Clock, Mail } from 'lucide-react';

// --- Interfaces ---
interface BlogPost {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  excerpt: string;
  tags: string[];
}

// --- Composant : Article Vedette (Design Premium) ---
const FeaturedPost: React.FC<{ post: BlogPost }> = ({ post }) => (
  <div className="group relative bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-2xl">
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div className="relative overflow-hidden h-80 lg:h-[500px]">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute top-6 left-6">
          <span className="bg-[#373E02] text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            À la une
          </span>
        </div>
      </div>
      <div className="p-8 lg:p-16 flex flex-col justify-center bg-white">
        <div className="flex items-center gap-4 mb-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <span className="text-[#373E02]">{post.category}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
        </div>
        <h2 className="text-3xl lg:text-5xl font-black text-[#373E02] mb-6 leading-[1.1] group-hover:text-black transition-colors">
          {post.title}
        </h2>
        <p className="text-gray-500 text-lg mb-8 leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between pt-8 border-t border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F8F6F1] rounded-full flex items-center justify-center text-[#373E02] font-bold border border-[#373E02]/10">
              {post.author.charAt(0)}
            </div>
            <span className="text-sm font-bold text-gray-900">{post.author}</span>
          </div>
          <button className="flex items-center gap-2 text-[#373E02] font-black text-xs uppercase tracking-tighter hover:gap-4 transition-all duration-300">
            Lire l'article <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

// --- Page Principale ---
const Blog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Les bienfaits nutritionnels de la mloukhia',
      category: 'Nutrition',
      author: 'Dr. Amina Trabelsi',
      date: '2025-01-15',
      readTime: '5 min',
      image: 'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      excerpt: 'Découvrez pourquoi la mloukhia est considérée comme un super-aliment riche en vitamines, minéraux et antioxydants essentiels à votre santé.',
      tags: ['Nutrition', 'Santé']
    },
    {
      id: '2',
      title: 'L\'histoire millénaire de la mloukhia en Tunisie',
      category: 'Culture',
      author: 'Ahmed Ben Salem',
      date: '2025-01-10',
      readTime: '8 min',
      image: 'https://images.pexels.com/photos/4503270/pexels-photo-4503270.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      excerpt: 'Plongez dans l\'histoire fascinante de cette plante emblématique qui traverse les siècles dans la cuisine tunisienne.',
      tags: ['Histoire', 'Tradition']
    },
    {
      id: '3',
      title: 'Comment cultiver la mloukhia dans son jardin',
      category: 'Jardinage',
      author: 'Fatma Chakroun',
      date: '2025-01-05',
      readTime: '6 min',
      image: 'https://images.pexels.com/photos/4503275/pexels-photo-4503275.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      excerpt: 'Guide pratique pour cultiver votre propre mloukhia à la maison, du semis à la récolte, même sur un balcon.',
      tags: ['Jardinage', 'DIY']
    },
    {
      id: '4',
      title: 'Les secrets du séchage traditionnel',
      category: 'Technique',
      author: 'Sami Trabelsi',
      date: '2024-12-28',
      readTime: '4 min',
      image: 'https://images.pexels.com/photos/8844352/pexels-photo-8844352.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      excerpt: 'Découvrez les techniques ancestrales de séchage naturel qui préservent toute la saveur et l\'arôme.',
      tags: ['Tradition', 'Qualité']
    }
  ];

  const categories = [
    { value: 'all', label: 'Tous' },
    { value: 'Nutrition', label: 'Nutrition' },
    { value: 'Culture', label: 'Culture' },
    { value: 'Jardinage', label: 'Jardinage' },
    { value: 'Cuisine', label: 'Cuisine' }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FDFCF9]">

      {/* 1. HERO SECTION (Identique à About pour la cohérence) */}

      <section className="relative pt-20 pb-12 overflow-hidden bg-[#FDFCF9] border-b border-gray-50">
        {/* Décoration d'arrière-plan plus discrète */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#373E02]/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge réduit */}
          <div className="inline-flex items-center justify-center space-x-3 mb-4">
            <span className="h-[1px] w-6 bg-[#373E02]/30"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#373E02]">
              Journal & Conseils
            </span>
            <span className="h-[1px] w-6 bg-[#373E02]/30"></span>
          </div>

          {/* Titre réduit (text-5xl au lieu de 7xl) */}
          <h1 className="text-4xl md:text-5xl font-black text-[#373E02] mb-4 tracking-tighter leading-tight">
            Le Blog <span className="font-serif italic font-light text-[#373E02]/80 text-5xl md:text-6xl">Root.</span>
          </h1>

          {/* Description compacte */}
          <div className="max-w-2xl mx-auto">
            <p className="text-base md:text-lg text-gray-500 leading-relaxed font-medium">
              Découvrez nos articles sur la <span className="text-[#373E02]">mloukhia</span>, ses bienfaits et nos conseils d'experts.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* 2. ARTICLE VEDETTE */}
        {!searchTerm && selectedCategory === 'all' && (
          <div className="mb-24">
            <FeaturedPost post={blogPosts[0]} />
          </div>
        )}

        {/* 3. FILTRES & RECHERCHE (Design "Floating") */}
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-between mb-16 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              className="w-full pl-12 pr-4 py-3 bg-[#FDFCF9] border-none rounded-2xl focus:ring-2 focus:ring-[#373E02]/20 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${selectedCategory === cat.value
                    ? "bg-[#373E02] text-white shadow-lg shadow-[#373E02]/20"
                    : "bg-white text-gray-400 hover:text-[#373E02] border border-gray-50"
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. GRILLE D'ARTICLES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {(searchTerm || selectedCategory !== 'all' ? filteredPosts : filteredPosts.slice(1)).map((post) => (
            <article key={post.id} className="group cursor-pointer">
              <div className="relative h-72 rounded-[2rem] overflow-hidden mb-6 shadow-sm">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase text-[#373E02] tracking-widest">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="px-2">
                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-[#373E02] transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                  <span className="text-[10px] font-black text-[#373E02] uppercase tracking-widest group-hover:gap-3 flex items-center gap-2 transition-all">
                    Lire l'article <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* 5. NEWSLETTER : Style Cadre Épuré (Pas de bloc vert massif) */}
        <section className="mt-32">
          <div className="bg-white border border-[#373E02]/10 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F8F6F1] rounded-full -mr-16 -mt-16 opacity-50" />

            <Mail className="w-12 h-12 text-[#373E02]/20 mx-auto mb-6" />
            <h2 className="text-3xl font-black text-[#373E02] mb-4">Restez dans la confidence</h2>
            <p className="text-gray-500 mb-10 max-w-lg mx-auto font-medium">
              Inscrivez-vous pour recevoir nos recettes exclusives et l'actualité de nos récoltes.
            </p>

            <div className="max-w-md mx-auto flex flex-col md:flex-row gap-4">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-6 py-4 rounded-2xl bg-[#FDFCF9] border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#373E02]/10 transition-all"
              />
              <button className="bg-[#373E02] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-colors shadow-lg shadow-[#373E02]/20">
                S'abonner
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Blog;