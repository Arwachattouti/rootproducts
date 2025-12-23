import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Loader2, ArrowRight, ChevronRight } from 'lucide-react';

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
// COMPOSANT INFO INTERNE - Texte augmenté et Couleurs Noir/Gris-700
const ContactInfoItem = ({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) => (
  <div className="flex items-start gap-5 sm:gap-6 group">
    <div className="h-14 w-14 bg-[#FDFCF9] text-[#000000] rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-[#357A32] group-hover:text-white group-hover:border-[#357A32] transition-all duration-500 shadow-sm">
      {React.cloneElement(icon as React.ReactElement, { size: 22, strokeWidth: 1.5 })}
    </div>
    <div className="pt-1">
      <h3 className="text-sm md:text-base font-seasons uppercase tracking-[0.2em]  mb-2">{title}</h3>
      <div className="text-[#000000] font-seasons md:text-lg text-base sm:text-xl leading-snug group-hover:text-[#357A32] transition-colors">
        {content}
      </div>
    </div>
  </div>
);
  return (
    <div className="min-h-screen bg-white">
      {/* HEADER - Optimisé Mobile */}
     <section className="py-12 sm:py-20 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
      <span className="px-3 py-1 rounded bg-[#357A32]/10 text-[#357A32] text-[10px] font-bold tracking-[0.2em] uppercase">
         Support & Dialogue</span>
          <h1 className="text-3xl sm:text-6xl  font-seasons text-[#4B2E05] mt-2 mb-6">
            Contactez nous 
          </h1>
          <p className="max-w-2xl mx-auto  text-sm md:text-lg sm:text-lg  font-seasons leading-relaxed">
            Une question sur nos produits ou une commande ? <br className="hidden sm:block" />
           <span className=' font-seasons'> Notre équipe est là pour vous </span><span className="text-[#357A32]  font-seasons">accompagner</span>.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 sm:gap-16">
          
          {/* COLONNE INFOS */}
          <div className="space-y-10 sm:space-y-12">
            <div>
              <h2 className="text-xl font-seasons tracking-[0.2em] md:text-2xl mb-8 sm:mb-10">Coordonnées</h2>
              <div className="space-y-8 sm:space-y-10  ">
                <ContactInfoItem 
                  icon={<MapPin />} 
                  title="Siège Social" 
                  content="Avenue Habib Bourguiba, 1000 Tunis" 
                />
                <ContactInfoItem 
                  icon={<Phone />} 
                  title="Ligne Directe" 
                  content="+216 71 000 000" 
                />
                <ContactInfoItem 
                  icon={<Mail />} 
                  title="Email" 
                  content="contact@rootproducts.tn" 
                />
                <ContactInfoItem 
                  icon={<Clock />} 
                  title="Ouverture" 
                  content="Lun - Ven: 08:00 — 17:00" 
                />
              </div>
            </div>

            {/* FAQ Box - Améliorée */}
            <div className="p-8 bg-[#FDFCF9] rounded-[2rem] border border-gray-100 shadow-sm">
              <h3 className="text-base md:text-lg font-seasons text-[#000000] uppercase tracking-widest mb-6">FAQ & Aide</h3>
              <ul className="space-y-4">
                {['Suivre mon colis', 'Devenir revendeur', 'Conservation'].map((item) => (
                  <li key={item}>
                    <a href="#" className="group flex items-center text-lg md:text-xl font-seasons hover:text-[#357A32] transition-colors">
                      <ChevronRight className="h-4 w-4 mr-2 text-[#357A32]" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* COLONNE FORMULAIRE */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2rem] sm:rounded-[3rem] border border-gray-100 p-6 sm:p-12 md:p-16 relative shadow-sm hover:shadow-xl transition-shadow duration-500">
              
              {submitted && (
                <div className="absolute inset-0 bg-white/98 z-20 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 rounded-[2rem] sm:rounded-[3rem]">
                  <div className="bg-[#357A32]/10 p-5 rounded-full mb-6">
                    <CheckCircle2 className="h-12 w-12 text-[#357A32]" />
                  </div>
                  <h3 className="text-3xl font-seasons  text-[#000000]">Message reçu !</h3>
                  <p className="mt-2  text-center px-10 text-lg">
                    Nous reviendrons vers vous dans les plus brefs délais.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)} 
                    className="mt-8 text-xs font-bold text-[#357A32] uppercase tracking-widest border-b-2 border-[#357A32] pb-1"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
                  <div className="space-y-3">
                    <label className="text-lg md:text-xl font-seasons uppercase tracking-widest text-[#000000] ml-1">Nom Complet</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ahmed Ben Salem"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-[#357A32]/5 focus:border-[#357A32] outline-none text-base text-gray-700 transition-all placeholder:text-gray-300"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-lg md:text-xl font-seasons  uppercase tracking-widest text-[#000000] ml-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="contact@exemple.tn"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-[#357A32]/5 focus:border-[#357A32] outline-none text-base text-gray-700 transition-all placeholder:text-gray-300"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-lg md:text-xl font-seasons  uppercase tracking-widest text-[#000000] ml-1">Sujet</label>
                  <div className="relative">
                    <select
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-gray-50 text-lg md:text-xl font-seasons  border border-gray-100 rounded-xl focus:ring-4 focus:ring-[#357A32]/5 focus:border-[#357A32] outline-none text-base text-gray-700 appearance-none transition-all"
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="commande">Ma Commande</option>
                      <option value="produit">Nos Produits</option>
                      <option value="partenariat">Partenariats</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <ArrowRight className="h-4 w-4 rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-lg md:text-xl font-seasons  uppercase tracking-widest text-[#000000] ml-1">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Comment pouvons-nous vous aider ?"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-[#357A32]/5 focus:border-[#357A32] outline-none text-base text-gray-700 transition-all resize-none placeholder:text-gray-300"
                  ></textarea>
                </div>

                <div className="flex items-start gap-4 ml-1">
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    required
                    checked={formData.consent}
                    onChange={handleChange}
                    className="mt-1.5 h-5 w-5 text-[#357A32] border-gray-300 rounded focus:ring-[#357A32] accent-[#357A32]"
                  />
                  <label htmlFor="consent" className="text-sm text-lg md:text-xl font-seasons leading-relaxed">
                    J'accepte que mes données soient traitées pour répondre à ma demande selon la politique de confidentialité.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#357A32] hover:bg-[#000000] text-white py-5 rounded-2xl text-xl md:text-xl font-seasons  tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#357A32]/20 disabled:opacity-50 active:scale-[0.98]"
                >
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  {isSubmitting ? 'Transmission...' : 'Envoyer le message'}
                </button>
              </form>
            </div>
          </div>
        </div>

     
      </div>
    </div>
  );
};



export default Contact;