import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetBlogDetailsQuery } from '../../state/apiService';
import { Calendar, User, Loader2, Clock, ArrowLeft, Tag, Share2, BookOpen, MessageCircle, ChevronLeft } from 'lucide-react';

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: blog, isLoading, error } = useGetBlogDetailsQuery(id!);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#357A32] mb-4" />
        <p className="text-base font-bold uppercase tracking-widest text-[#4B2E05]">Infusion de l'article...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="bg-[#FDFCF9] p-10 rounded-[2rem] shadow-sm text-center max-w-md border border-gray-100">
          <h2 className="text-3xl font-serif italic text-[#4B2E05] mb-6">Article introuvable</h2>
          <button
            onClick={() => navigate('/blog')}
            className="bg-[#357A32] text-white px-8 py-3 rounded-full hover:bg-[#4B2E05] transition-all font-bold text-sm uppercase tracking-widest"
          >
            Retour au journal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-12 sm:pb-24">
      {/* Barre de navigation simplifiée */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-50 mb-6 sm:mb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center text-[#4B2E05] font-bold text-sm uppercase tracking-widest"
          >
            <ChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform text-[#357A32]" />
            Retour
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#FDFCF9] rounded-full text-[#4B2E05] border border-gray-100 font-bold text-xs uppercase tracking-tighter">
            <Share2 size={16} className="text-[#357A32]" /> Partager
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          
          {/* CONTENU PRINCIPAL */}
          <div className="lg:col-span-2">
            
            {/* Header de l'article */}
            <header className="mb-10 sm:mb-14">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#357A32]/10 text-[#357A32] text-xs sm:text-sm font-bold uppercase tracking-widest mb-6">
                {blog.category}
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif italic text-[#4B2E05] leading-[1.15] mb-8">
                {blog.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm sm:text-base text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#4B2E05] text-white flex items-center justify-center text-xs font-bold">
                    {blog.author.charAt(0)}
                  </div>
                  <span className="font-semibold text-[#4B2E05]">{blog.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-[#357A32]"/> 
                  <span>{new Date(blog.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-[#357A32]"/> 
                  <span>{blog.readTime} de lecture</span>
                </div>
              </div>
            </header>

            {/* Image Principale */}
            <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl mb-12 sm:mb-16 border-4 border-white">
              <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
            </div>

            {/* Corps du texte */}
            <article className="max-w-none">
              <div className="bg-[#FDFCF9] p-8 sm:p-12 rounded-[2rem] border-l-[6px] border-[#357A32] mb-12 shadow-sm">
                <p className="text-xl sm:text-2xl text-[#4B2E05] font-serif italic leading-relaxed m-0">
                  "{blog.excerpt}"
                </p>
              </div>

              <div className="text-[#4B2E05]/80 leading-relaxed text-lg sm:text-xl space-y-8 whitespace-pre-line font-normal">
                {blog.content}
              </div>

              {/* Tags Section */}
              <div className="mt-16 pt-10 border-t border-gray-100">
                <div className="flex items-center gap-4 flex-wrap">
                  <Tag size={20} className="text-[#357A32]" />
                  {blog.tags.map(tag => (
                    <span key={tag} className="bg-white border border-gray-100 text-[#4B2E05] px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all hover:bg-[#357A32] hover:text-white hover:border-[#357A32] cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-8">
            {/* Widget Auteur Premium */}
            <div className="bg-[#FDFCF9] rounded-[2.5rem] p-8 sm:p-10 border border-gray-50 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-8">L'auteur</h3>
              <div className="flex items-center gap-5 mb-6">
                <div className="w-16 h-16 bg-[#4B2E05] rounded-2xl flex items-center justify-center text-white font-serif text-3xl shadow-xl">
                  {blog.author.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-[#4B2E05] text-xl">{blog.author}</p>
                  <p className="text-xs text-[#357A32] uppercase font-black tracking-widest mt-1">Expert Root</p>
                </div>
              </div>
              <p className="text-base text-gray-600 leading-relaxed italic">
                "Dédié à la préservation des méthodes ancestrales et au partage des bienfaits de notre terre."
              </p>
            </div>

            {/* Badges Confiance - Plus visibles */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-5 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                <div className="w-12 h-12 flex items-center justify-center bg-[#357A32]/10 rounded-xl">
                  <MessageCircle className="text-[#357A32]" size={24}/>
                </div>
                <span className="text-sm font-bold uppercase tracking-widest text-[#4B2E05]">Conseils personnalisés</span>
              </div>
              
              <div className="flex items-center gap-5 bg-[#4B2E05] p-6 rounded-[2rem] shadow-xl text-white">
                <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-xl">
                  <BookOpen className="text-white" size={24}/>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-tighter opacity-70">Notre engagement</p>
                  <p className="text-sm font-bold uppercase tracking-widest">Culture Durable</p>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default BlogDetail;