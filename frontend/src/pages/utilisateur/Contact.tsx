import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  ChevronRight,
  ChevronDown,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    consent: false
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '', consent: false });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      alert("Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Composant Info Contact
  const ContactInfoItem = ({ 
    icon, 
    title, 
    content, 
    href 
  }: { 
    icon: React.ReactNode, 
    title: string, 
    content: string,
    href?: string 
  }) => {
    const Wrapper = href ? 'a' : 'div';
    const wrapperProps = href ? { href, className: "block" } : {};

    return (
      <Wrapper {...wrapperProps}>
        <div className="flex items-start gap-3 sm:gap-4 md:gap-5 group cursor-pointer">
          <div className="h-11 w-11 sm:h-12 sm:w-12 md:h-14 md:w-14 bg-[#FDFCF9] text-[#4B2E05] rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-[#357A32] group-hover:text-white group-hover:border-[#357A32] transition-all duration-300 shadow-sm group-active:scale-95">
            {React.cloneElement(icon as React.ReactElement, { 
              size: 18, 
              strokeWidth: 1.5,
              className: "sm:w-5 sm:h-5 md:w-[22px] md:h-[22px]" 
            })}
          </div>
          <div className="pt-0.5 sm:pt-1 flex-1 min-w-0">
            <h3 className="text-[10px] sm:text-xs md:text-sm font-seasons uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gray-500 mb-1 sm:mb-2">
              {title}
            </h3>
            <div className="text-sm sm:text-base md:text-lg lg:text-xl font-seasons text-[#4B2E05] leading-snug group-hover:text-[#357A32] transition-colors break-words">
              {content}
            </div>
          </div>
          {href && (
            <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-[#357A32] transition-colors mt-1 hidden sm:block" />
          )}
        </div>
      </Wrapper>
    );
  };

  // Liste des sujets FAQ
  const faqItems = [
    { label: 'Suivre mon colis', href: '#tracking' },
    { label: 'Devenir revendeur', href: '#partnership' },
    { label: 'Conservation des produits', href: '#conservation' },
    { label: 'Retours & Remboursements', href: '#returns' }
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* ==================== HEADER ==================== */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Badge */}
          <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#357A32]/10 text-[#357A32] text-[9px] sm:text-[10px] md:text-xs font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-4 sm:mb-6">
            Support & Dialogue
          </span>
          
          {/* Titre */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-seasons text-[#4B2E05] mb-4 sm:mb-6">
            Contactez-nous
          </h1>
          
          {/* Sous-titre */}
          <p className="max-w-xl sm:max-w-2xl mx-auto text-sm sm:text-base md:text-lg font-seasons leading-relaxed text-gray-600 px-4">
            Une question sur nos produits ou une commande ?{' '}
            <br className="hidden sm:block" />
            <span className="font-seasons">Notre équipe est là pour vous </span>
            <span className="text-[#357A32] font-seasons">accompagner</span>.
          </p>
        </div>
      </section>

      {/* ==================== CONTENU PRINCIPAL ==================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 lg:gap-16">
          
          {/* ==================== COLONNE INFOS ==================== */}
          <div className="space-y-8 sm:space-y-10 md:space-y-12 order-2 lg:order-1">
            
            {/* Section Coordonnées */}
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-seasons tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.2em] text-[#4B2E05] mb-6 sm:mb-8 md:mb-10">
                Coordonnées
              </h2>
              
              <div className="space-y-5 sm:space-y-6 md:space-y-8 lg:space-y-10">
                <ContactInfoItem 
                  icon={<MapPin />} 
                  title="Siège Social" 
                  content="Avenue Habib Bourguiba, 1000 Tunis"
                  href="https://maps.google.com"
                />
                <ContactInfoItem 
                  icon={<Phone />} 
                  title="Ligne Directe" 
                  content="+216 71 000 000"
                  href="tel:+21671000000"
                />
                <ContactInfoItem 
                  icon={<Mail />} 
                  title="Email" 
                  content="contact@rootproducts.tn"
                  href="mailto:contact@rootproducts.tn"
                />
                <ContactInfoItem 
                  icon={<Clock />} 
                  title="Ouverture" 
                  content="Lun - Ven: 08:00 — 17:00" 
                />
              </div>
            </div>

            {/* Section FAQ */}
            <div className="p-5 sm:p-6 md:p-8 bg-[#FDFCF9] rounded-2xl sm:rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4 sm:mb-5 md:mb-6">
                <MessageSquare className="w-5 h-5 text-[#357A32]" />
                <h3 className="text-sm sm:text-base md:text-lg font-seasons text-[#4B2E05] uppercase tracking-widest">
                  FAQ & Aide
                </h3>
              </div>
              
              <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                {faqItems.map((item) => (
                  <li key={item.label}>
                    <a 
                      href={item.href} 
                      className="group flex items-center justify-between py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 -mx-3 sm:-mx-4 rounded-xl hover:bg-white transition-colors"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-[#357A32] group-hover:translate-x-1 transition-transform" />
                        <span className="text-sm sm:text-base md:text-lg font-seasons text-gray-700 group-hover:text-[#357A32] transition-colors">
                          {item.label}
                        </span>
                      </div>
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-300 group-hover:text-[#357A32] opacity-0 group-hover:opacity-100 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Carte rapide mobile */}
            <div className="lg:hidden">
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full bg-gradient-to-br from-[#4B2E05] to-[#3a2404] rounded-2xl p-5 sm:p-6 text-white shadow-lg active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5" />
                    <span className="font-seasons text-sm sm:text-base">Voir sur la carte</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </a>
            </div>
          </div>

          {/* ==================== COLONNE FORMULAIRE ==================== */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] border border-gray-100 p-5 sm:p-6 md:p-8 lg:p-12 xl:p-16 relative shadow-sm hover:shadow-lg lg:hover:shadow-xl transition-shadow duration-500">
              
              {/* Message de succès */}
              {submitted && (
                <div className="absolute inset-0 bg-white/98 z-20 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] p-6">
                  <div className="bg-[#357A32]/10 p-4 sm:p-5 rounded-full mb-4 sm:mb-6">
                    <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12 text-[#357A32]" />
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-seasons text-[#4B2E05] text-center">
                    Message reçu !
                  </h3>
                  <p className="mt-2 sm:mt-3 text-center px-4 sm:px-10 text-sm sm:text-base md:text-lg text-gray-600 font-seasons">
                    Nous reviendrons vers vous dans les plus brefs délais.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)} 
                    className="mt-6 sm:mt-8 text-xs font-bold text-[#357A32] uppercase tracking-widest border-b-2 border-[#357A32] pb-1 hover:text-[#4B2E05] hover:border-[#4B2E05] transition-colors active:scale-95"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              )}

              {/* Titre du formulaire (mobile) */}
              <div className="mb-6 sm:mb-8 lg:hidden">
                <h2 className="text-lg sm:text-xl font-seasons text-[#4B2E05] tracking-wider">
                  Envoyez-nous un message
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 font-seasons">
                  Remplissez le formulaire ci-dessous
                </p>
              </div>

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 md:space-y-8 lg:space-y-10">
                
                {/* Nom & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 md:gap-8 lg:gap-10">
                  
                  {/* Champ Nom */}
                  <div className="space-y-2 sm:space-y-3">
                    <label 
                      htmlFor="name"
                      className={`block text-xs sm:text-sm md:text-base lg:text-lg font-seasons uppercase tracking-wider sm:tracking-widest ml-1 transition-colors ${
                        focusedField === 'name' ? 'text-[#357A32]' : 'text-[#4B2E05]'
                      }`}
                    >
                      Nom Complet
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Ahmed Ben Salem"
                      className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 bg-gray-50 border border-gray-100 rounded-xl sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-[#357A32]/10 focus:border-[#357A32] focus:bg-white outline-none text-sm sm:text-base text-gray-700 transition-all placeholder:text-gray-300 font-seasons"
                    />
                  </div>
                  
                  {/* Champ Email */}
                  <div className="space-y-2 sm:space-y-3">
                    <label 
                      htmlFor="email"
                      className={`block text-xs sm:text-sm md:text-base lg:text-lg font-seasons uppercase tracking-wider sm:tracking-widest ml-1 transition-colors ${
                        focusedField === 'email' ? 'text-[#357A32]' : 'text-[#4B2E05]'
                      }`}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="contact@exemple.tn"
                      className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 bg-gray-50 border border-gray-100 rounded-xl sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-[#357A32]/10 focus:border-[#357A32] focus:bg-white outline-none text-sm sm:text-base text-gray-700 transition-all placeholder:text-gray-300 font-seasons"
                    />
                  </div>
                </div>

                {/* Champ Sujet */}
                <div className="space-y-2 sm:space-y-3">
                  <label 
                    htmlFor="subject"
                    className={`block text-xs sm:text-sm md:text-base lg:text-lg font-seasons uppercase tracking-wider sm:tracking-widest ml-1 transition-colors ${
                      focusedField === 'subject' ? 'text-[#357A32]' : 'text-[#4B2E05]'
                    }`}
                  >
                    Sujet
                  </label>
                  <div className="relative">
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('subject')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 bg-gray-50 border border-gray-100 rounded-xl sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-[#357A32]/10 focus:border-[#357A32] focus:bg-white outline-none text-sm sm:text-base text-gray-700 appearance-none transition-all font-seasons pr-12"
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="commande">Ma Commande</option>
                      <option value="produit">Nos Produits</option>
                      <option value="partenariat">Partenariats</option>
                      <option value="autre">Autre demande</option>
                    </select>
                    <div className="absolute right-4 sm:right-5 md:right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                  </div>
                </div>

                {/* Champ Message */}
                <div className="space-y-2 sm:space-y-3">
                  <label 
                    htmlFor="message"
                    className={`block text-xs sm:text-sm md:text-base lg:text-lg font-seasons uppercase tracking-wider sm:tracking-widest ml-1 transition-colors ${
                      focusedField === 'message' ? 'text-[#357A32]' : 'text-[#4B2E05]'
                    }`}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Comment pouvons-nous vous aider ?"
                    className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 bg-gray-50 border border-gray-100 rounded-xl sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-[#357A32]/10 focus:border-[#357A32] focus:bg-white outline-none text-sm sm:text-base text-gray-700 transition-all resize-none placeholder:text-gray-300 font-seasons min-h-[120px] sm:min-h-[140px] md:min-h-[160px]"
                  />
                </div>

                {/* Checkbox Consentement */}
                <div className="flex items-start gap-3 sm:gap-4 ml-1">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      id="consent"
                      name="consent"
                      required
                      checked={formData.consent}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <div 
                      onClick={() => setFormData(prev => ({ ...prev, consent: !prev.consent }))}
                      className={`w-5 h-5 sm:w-6 sm:h-6 border-2 rounded-md cursor-pointer transition-all flex items-center justify-center ${
                        formData.consent 
                          ? 'bg-[#357A32] border-[#357A32]' 
                          : 'bg-white border-gray-300 hover:border-[#357A32]'
                      }`}
                    >
                      {formData.consent && (
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <label 
                    htmlFor="consent" 
                    className="text-xs sm:text-sm md:text-base font-seasons leading-relaxed text-gray-600 cursor-pointer"
                    onClick={() => setFormData(prev => ({ ...prev, consent: !prev.consent }))}
                  >
                    J'accepte que mes données soient traitées pour répondre à ma demande selon la{' '}
                    <a href="/privacy" className="text-[#357A32] hover:underline">
                      politique de confidentialité
                    </a>.
                  </label>
                </div>

                {/* Bouton Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.consent}
                  className="w-full bg-[#357A32] hover:bg-[#4B2E05] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3.5 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg font-seasons tracking-wider sm:tracking-[0.15em] md:tracking-[0.2em] transition-all flex items-center justify-center gap-2 sm:gap-3 shadow-lg shadow-[#357A32]/20 hover:shadow-xl hover:shadow-[#4B2E05]/20 active:scale-[0.98] disabled:shadow-none uppercase"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      <span>Transmission...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>Envoyer le message</span>
                    </>
                  )}
                </button>

                {/* Texte de réassurance */}
                <p className="text-center text-[10px] sm:text-xs text-gray-400 font-seasons">
                  Nous répondons généralement sous 24-48h ouvrées
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* ==================== SECTION CARTE (Desktop) ==================== */}
        <div className="hidden lg:block mt-16 xl:mt-20">
          <div className="bg-[#FDFCF9] rounded-[2rem] p-8 xl:p-10 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl xl:text-2xl font-seasons text-[#4B2E05] mb-2">
                  Rendez-nous visite
                </h3>
                <p className="text-sm xl:text-base text-gray-600 font-seasons">
                  Avenue Habib Bourguiba, 1000 Tunis, Tunisie
                </p>
              </div>
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-[#4B2E05] text-white rounded-full font-seasons text-sm uppercase tracking-wider hover:bg-[#357A32] transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Voir sur Google Maps
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== BANDEAU RÉASSURANCE ==================== */}
      <section className="bg-[#4B2E05] py-6 sm:py-8 md:py-10 mt-8 sm:mt-12 md:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              { icon: <Clock />, label: 'Réponse rapide', sublabel: '24-48h' },
              { icon: <CheckCircle2 />, label: 'Support dédié', sublabel: 'Personnel' },
              { icon: <Mail />, label: 'Multi-canal', sublabel: 'Email & Tél' },
              { icon: <MapPin />, label: '100% Tunisien', sublabel: 'Local' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/10 rounded-lg sm:rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  {React.cloneElement(item.icon as React.ReactElement, { 
                    size: 16,
                    className: "sm:w-5 sm:h-5 md:w-6 md:h-6"
                  })}
                </div>
                <div>
                  <p className="text-white font-seasons text-xs sm:text-sm md:text-base">
                    {item.label}
                  </p>
                  <p className="text-white/60 text-[10px] sm:text-xs font-seasons">
                    {item.sublabel}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;