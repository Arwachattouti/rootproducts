import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetBlogDetailsQuery } from '../../state/apiService';
import { 
  Calendar, 
  User, 
  Loader2, 
  Clock, 
  ArrowLeft, 
  Tag, 
  Share2, 
  BookOpen, 
  MessageCircle, 
  ChevronLeft,
  X,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Check
} from 'lucide-react';

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: blog, isLoading, error } = useGetBlogDetailsQuery(id!);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(blog?.title || '');
    
    const shareUrls: { [key: string]: string } = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  // État de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-[#357A32] mb-4" />
        <p className="text-sm sm:text-base font-seasons uppercase tracking-widest text-[#4B2E05] text-center">
          Infusion de l'article...
        </p>
      </div>
    );
  }

  // État d'erreur
  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
        <div className="bg-[#FDFCF9] p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2rem] shadow-sm text-center w-full max-w-md border border-gray-100">
          <h2 className="text-2xl sm:text-3xl font-seasons text-[#4B2E05] mb-4 sm:mb-6">
            Article introuvable
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 font-seasons">
            Désolé, cet article n'existe pas ou a été supprimé.
          </p>
          <button
            onClick={() => navigate('/blog')}
            className="w-full sm:w-auto bg-[#357A32] text-white px-6 sm:px-8 py-3 rounded-full hover:bg-[#4B2E05] transition-all font-bold font-seasons text-xs sm:text-sm uppercase tracking-widest active:scale-95"
          >
            Retour au journal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-16 sm:pb-20 md:pb-24">
      
      {/* ==================== BARRE DE NAVIGATION ==================== */}
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 md:h-20 flex items-center justify-between">
          
          {/* Bouton Retour */}
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center text-[#4B2E05] font-seasons text-xs sm:text-sm uppercase tracking-wider hover:text-[#357A32] transition-colors"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-0.5 sm:mr-1 group-hover:-translate-x-1 transition-transform text-[#357A32]" />
            <span className="hidden xs:inline">Retour</span>
          </button>

          {/* Titre mobile (visible uniquement sur mobile) */}
          <div className="flex-1 mx-4 sm:hidden">
            <p className="text-xs font-seasons text-[#4B2E05] truncate text-center">
              {blog.title}
            </p>
          </div>

          {/* Bouton Partager */}
          <div className="relative">
            <button 
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#FDFCF9] rounded-full text-[#4B2E05] border border-gray-100 font-seasons text-[10px] sm:text-xs uppercase tracking-wider hover:border-[#357A32] transition-colors active:scale-95"
            >
              <Share2 size={14} className="text-[#357A32] sm:w-4 sm:h-4" /> 
              <span className="hidden sm:inline">Partager</span>
            </button>

            {/* Menu de partage */}
            {showShareMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowShareMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                  >
                    <Facebook size={18} className="text-blue-600" />
                    <span className="text-sm font-seasons">Facebook</span>
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                  >
                    <Twitter size={18} className="text-sky-500" />
                    <span className="text-sm font-seasons">Twitter</span>
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                  >
                    <Linkedin size={18} className="text-blue-700" />
                    <span className="text-sm font-seasons">LinkedIn</span>
                  </button>
                  <hr className="my-2 border-gray-100" />
                  <button
                    onClick={handleCopyLink}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check size={18} className="text-green-500" />
                        <span className="text-sm font-seasons text-green-600">Copié !</span>
                      </>
                    ) : (
                      <>
                        <Link2 size={18} className="text-gray-500" />
                        <span className="text-sm font-seasons">Copier le lien</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ==================== CONTENU PRINCIPAL ==================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 md:mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
          
          {/* ==================== ARTICLE ==================== */}
          <div className="lg:col-span-2">
            
            {/* Header de l'article */}
            <header className="mb-8 sm:mb-10 md:mb-14">
              {/* Catégorie */}
              <div className="inline-flex items-center px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#357A32]/10 text-[#357A32] text-[10px] sm:text-xs md:text-sm font-seasons uppercase tracking-widest mb-4 sm:mb-6">
                {blog.category}
              </div>

              {/* Titre */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-seasons text-[#4B2E05] leading-tight sm:leading-[1.15] mb-6 sm:mb-8">
                {blog.title}
              </h1>
              
              {/* Métadonnées */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm md:text-base">
                {/* Auteur */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#4B2E05] text-white flex items-center justify-center text-[10px] sm:text-xs font-bold">
                    {blog.author.charAt(0)}
                  </div>
                  <span className="font-seasons text-[#4B2E05]">{blog.author}</span>
                </div>

                {/* Séparateur mobile */}
                <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-300" />

                {/* Date */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Calendar size={14} className="text-[#357A32] sm:w-[18px] sm:h-[18px]"/> 
                  <span className="font-seasons text-gray-600">
                    {new Date(blog.date).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>

                {/* Séparateur mobile */}
                <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-300" />

                {/* Temps de lecture */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Clock size={14} className="text-[#357A32] sm:w-[18px] sm:h-[18px]"/> 
                  <span className="font-seasons text-gray-600">{blog.readTime} de lecture</span>
                </div>
              </div>
            </header>

            {/* ==================== IMAGE PRINCIPALE ==================== */}
            <div className="relative aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] lg:aspect-[21/9] rounded-xl sm:rounded-2xl md:rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-lg sm:shadow-xl md:shadow-2xl mb-8 sm:mb-10 md:mb-12 lg:mb-16 border-2 sm:border-4 border-white">
              <img 
                src={blog.image} 
                alt={blog.title} 
                className="w-full h-full object-cover"
                loading="eager"
              />
              {/* Overlay gradient pour mobile */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent sm:hidden" />
            </div>

            {/* ==================== CORPS DE L'ARTICLE ==================== */}
            <article className="max-w-none">
              
              {/* Citation / Extrait */}
              <div className="bg-[#FDFCF9] p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 rounded-xl sm:rounded-2xl md:rounded-[2rem] border-l-4 sm:border-l-[5px] md:border-l-[6px] border-[#357A32] mb-8 sm:mb-10 md:mb-12 shadow-sm">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#4B2E05] font-seasons leading-relaxed m-0 italic">
                  "{blog.excerpt}"
                </p>
              </div>

              {/* Contenu */}
              <div className="font-seasons leading-relaxed text-base sm:text-lg md:text-xl space-y-5 sm:space-y-6 md:space-y-8 whitespace-pre-line text-gray-800">
                {blog.content}
              </div>

              {/* ==================== SECTION TAGS ==================== */}
              <div className="mt-10 sm:mt-12 md:mt-16 pt-6 sm:pt-8 md:pt-10 border-t border-gray-100">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-wrap">
                  <Tag size={18} className="text-[#357A32] mt-1 sm:mt-0 sm:w-5 sm:h-5" />
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {blog.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="bg-white border border-gray-100 text-[#4B2E05] px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-seasons transition-all hover:bg-[#357A32] hover:text-white hover:border-[#357A32] cursor-pointer active:scale-95"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ==================== ACTIONS MOBILE ==================== */}
              <div className="mt-10 sm:mt-12 lg:hidden">
                <div className="bg-[#FDFCF9] rounded-2xl p-5 sm:p-6 border border-gray-100">
                  <h3 className="text-sm font-seasons uppercase tracking-widest mb-5 text-[#4B2E05]">
                    Partagez cet article
                  </h3>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleShare('facebook')}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors active:scale-95"
                    >
                      <Facebook size={18} />
                      <span className="text-xs font-seasons hidden xs:inline">Facebook</span>
                    </button>
                    <button 
                      onClick={() => handleShare('twitter')}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-colors active:scale-95"
                    >
                      <Twitter size={18} />
                      <span className="text-xs font-seasons hidden xs:inline">Twitter</span>
                    </button>
                    <button 
                      onClick={handleCopyLink}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors active:scale-95"
                    >
                      {copied ? <Check size={18} className="text-green-500" /> : <Link2 size={18} />}
                      <span className="text-xs font-seasons hidden xs:inline">
                        {copied ? 'Copié!' : 'Lien'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* ==================== SIDEBAR ==================== */}
          <aside className="space-y-6 sm:space-y-8 lg:sticky lg:top-24 lg:self-start">
            
            {/* Widget Auteur */}
            <div className="bg-[#FDFCF9] rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] p-5 sm:p-6 md:p-8 lg:p-10 border border-gray-50 shadow-sm">
              <h3 className="text-xs sm:text-sm font-seasons uppercase tracking-widest mb-5 sm:mb-6 md:mb-8 text-gray-500">
                L'auteur
              </h3>
              
              <div className="flex items-center gap-3 sm:gap-4 md:gap-5 mb-4 sm:mb-5 md:mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#4B2E05] rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-seasons text-xl sm:text-2xl md:text-3xl shadow-lg">
                  {blog.author.charAt(0)}
                </div>
                <div>
                  <p className="font-seasons text-[#4B2E05] text-base sm:text-lg md:text-xl">
                    {blog.author}
                  </p>
                  <p className="text-[10px] sm:text-xs text-[#357A32] uppercase font-seasons tracking-widest mt-0.5 sm:mt-1">
                    Expert Root
                  </p>
                </div>
              </div>
              
              <p className="text-sm sm:text-base font-seasons leading-relaxed text-gray-600">
                "Dédié à la préservation des méthodes ancestrales et au partage des bienfaits de notre terre."
              </p>
            </div>

            {/* Badges de confiance */}
            <div className="flex flex-col gap-3 sm:gap-4">
              
              {/* Badge Conseils */}
              <div className="flex items-center gap-3 sm:gap-4 md:gap-5 bg-white p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl md:rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex-shrink-0 flex items-center justify-center bg-[#357A32]/10 rounded-lg sm:rounded-xl">
                  <MessageCircle className="text-[#357A32] w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-xs sm:text-sm font-seasons uppercase tracking-wider text-[#4B2E05]">
                  Conseils personnalisés
                </span>
              </div>
              
              {/* Badge Culture Durable */}
              <div className="flex items-center gap-3 sm:gap-4 md:gap-5 bg-[#4B2E05] p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl md:rounded-[2rem] shadow-lg text-white hover:shadow-xl transition-shadow">
                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex-shrink-0 flex items-center justify-center bg-white/10 rounded-lg sm:rounded-xl">
                  <BookOpen className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] uppercase font-seasons tracking-wider opacity-70">
                    Notre engagement
                  </p>
                  <p className="text-xs sm:text-sm font-seasons uppercase tracking-widest">
                    Culture Durable
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Newsletter (visible sur desktop) */}
            <div className="hidden lg:block bg-gradient-to-br from-[#357A32] to-[#2a6128] rounded-[2rem] p-8 text-white shadow-xl">
              <h4 className="font-seasons text-xl mb-3">
                Restez informé
              </h4>
              <p className="text-sm opacity-90 mb-5 font-seasons leading-relaxed">
                Recevez nos derniers articles et conseils directement dans votre boîte mail.
              </p>
              <button className="w-full bg-white text-[#357A32] py-3 rounded-full font-seasons text-sm uppercase tracking-wider hover:bg-[#FDFCF9] transition-colors active:scale-95">
                S'abonner
              </button>
            </div>
          </aside>
        </div>

        {/* ==================== SECTION ARTICLES SIMILAIRES (Mobile) ==================== */}
        <div className="mt-12 sm:mt-16 lg:hidden">
          <h3 className="text-lg sm:text-xl font-seasons text-[#4B2E05] mb-6">
            Continuer la lecture
          </h3>
          <button
            onClick={() => navigate('/blog')}
            className="w-full bg-[#357A32] text-white py-4 rounded-2xl font-seasons uppercase tracking-wider text-sm hover:bg-[#4B2E05] transition-colors active:scale-[0.98]"
          >
            Découvrir plus d'articles
          </button>
        </div>
      </div>

      {/* ==================== BOUTON FLOTTANT (Mobile) ==================== */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent lg:hidden z-20">
        <button
          onClick={() => navigate('/blog')}
          className="w-full bg-[#4B2E05] text-white py-4 rounded-2xl font-seasons uppercase tracking-wider text-sm shadow-xl flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <ArrowLeft size={18} />
          Retour aux articles
        </button>
      </div>
    </div>
  );
};

export default BlogDetail;