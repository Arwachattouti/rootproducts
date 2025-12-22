import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetBlogDetailsQuery } from '../../state/apiService';
import { Calendar, User, Loader2, Clock, ArrowLeft, Tag, Share2, BookOpen, MessageCircle } from 'lucide-react';

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: blog, isLoading, error } = useGetBlogDetailsQuery(id!);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFCF9] flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#357A32] mb-4" />
        <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Infusion de l'article...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md border border-gray-100">
          <h2 className="text-2xl font-serif italic text-[#4B2E05] mb-4">Article introuvable</h2>
          <button
            onClick={() => navigate('/blog')}
            className="bg-[#4B2E05] text-white px-6 py-2 rounded-xl hover:bg-[#357A32] transition-all font-bold text-xs uppercase tracking-widest"
          >
            Retour au journal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF9] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation */}
        <div className="flex justify-between items-center mb-12">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center text-[#4B2E05] hover:text-[#357A32] font-bold text-xs uppercase tracking-widest transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour aux articles
          </button>
          <button className="p-3 bg-white rounded-full shadow-sm hover:shadow-md text-[#4B2E05] transition-all border border-gray-100">
            <Share2 size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* COLONNE GAUCHE : Contenu Principal */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Image d'en-tête */}
            <div className="relative h-[300px] md:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white">
              <img 
                src={blog.image} 
                alt={blog.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-8 left-8">
                <span className="bg-[#357A32] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                  {blog.category}
                </span>
              </div>
            </div>

            {/* Article Card */}
            <div className=" w-[1200px] bg-white rounded-[2.5rem] shadow-sm p-8 md:p-16 border border-gray-100">
              <header className="mb-12 border-b border-gray-50 pb-10">
                <h1 className="text-4xl md:text-6xl font-serif italic text-[#4B2E05] leading-[1.1] mb-8">
                  {blog.title}
                </h1>
                
                <div className="flex flex-wrap items-center text-[11px] font-bold uppercase tracking-widest text-gray-400 gap-8">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
                    <User size={14} className="text-[#357A32]"/> 
                    <span className="text-[#4B2E05]">{blog.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-[#357A32]"/> 
                    {new Date(blog.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-[#357A32]"/> {blog.readTime}
                  </div>
                </div>
              </header>

              {/* Corps de l'article */}
              <div className="prose prose-lg max-w-none">
                <div className="bg-[#FDFCF9] p-8 rounded-3xl border-l-4 border-[#357A32] mb-12 shadow-sm">
                  <p className="text-xl text-[#4B2E05] font-serif italic leading-relaxed m-0">
                    "{blog.excerpt}"
                  </p>
                </div>

                <div className="text-gray-600 leading-relaxed font-light whitespace-pre-line text-lg space-y-6">
                  {blog.content}
                </div>
              </div>

              {/* Tags */}
              <div className="mt-16 pt-10 border-t border-gray-50">
                <div className="flex items-center gap-3 flex-wrap">
                  <Tag size={18} className="text-[#357A32] mr-2" />
                  {blog.tags.map(tag => (
                    <span key={tag} className="bg-gray-50 text-gray-500 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-tight hover:bg-[#357A32] hover:text-white transition-all cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* COLONNE DROITE : Sidebar */}
          <div className="space-y-6">
            {/* Widget Auteur */}
            <div className="bg-white rounded-[2rem] shadow-sm p-8 border border-gray-100">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-8 flex items-center">
                <BookOpen className="mr-3 text-[#357A32]" size={16}/> L'auteur
              </h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-[#4B2E05] rounded-2xl flex items-center justify-center text-white font-serif text-2xl shadow-lg shadow-[#4B2E05]/20">
                  {blog.author.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-[#4B2E05] text-lg">{blog.author}</p>
                  <p className="text-[10px] text-[#357A32] uppercase font-black tracking-widest">Expert Root</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed font-light italic">
                "Passionné par les trésors du terroir tunisien et leur impact sur notre bien-être quotidien."
              </p>
            </div>

            {/* Indicateurs de confiance */}
            <div className="space-y-3">
              <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 group hover:border-[#357A32]/30 transition-colors">
                <div className="p-3 bg-[#FDFCF9] rounded-xl group-hover:bg-[#357A32]/10 transition-colors">
                  <MessageCircle className="text-[#357A32]" size={20}/>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#4B2E05]">Conseils d'experts</span>
              </div>
              
              <div className="flex items-center gap-4 bg-[#4B2E05] p-5 rounded-2xl shadow-xl">
                <div className="p-3 bg-white/10 rounded-xl">
                  <BookOpen className="text-white" size={20}/>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Savoir-faire</span>
                  <span className="text-xs font-bold text-white">100% Traditionnel</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BlogDetail;