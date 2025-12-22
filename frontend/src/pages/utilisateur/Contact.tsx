import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER - Style identique au Blog */}
      <section className="py-20 bg-gray-50 border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#357A32]/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#357A32]">Support & Dialogue</span>
          <h1 className="text-4xl md:text-6xl font-serif italic text-[#4B2E05] mt-6 mb-6">
            Contactez <span className="text-[#357A32]">root.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-500 font-light italic">
            Une question sur nos produits ou une commande ? <br />
            Notre équipe est là pour vous <span className="text-[#357A32] font-semibold not-italic">accompagner</span>.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* COLONNE INFOS */}
          <div className="space-y-12">
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-10">Coordonnées</h2>
              <div className="space-y-10">
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

            <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 group transition-all">
              <h3 className="text-[10px] font-bold text-[#4B2E05] uppercase tracking-widest mb-4">FAQ & Aide</h3>
              <ul className="space-y-4">
                {['Suivre mon colis', 'Devenir revendeur', 'Conservation'].map((item) => (
                  <li key={item}>
                    <a href="#" className="group flex items-center text-sm text-gray-500 hover:text-[#357A32] transition-colors font-light italic">
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-all text-[#357A32]" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* COLONNE FORMULAIRE - Style Carte Blog */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-16 relative overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.05)]">
              
              {submitted && (
                <div className="absolute inset-0 bg-white/98 z-20 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
                  <div className="bg-[#357A32]/10 p-5 rounded-full mb-6">
                    <CheckCircle2 className="h-12 w-12 text-[#357A32]" />
                  </div>
                  <h3 className="text-3xl font-serif italic text-[#4B2E05]">Message reçu !</h3>
                  <p className="text-gray-400 mt-2 font-light italic text-center px-10">
                    Nous reviendrons vers vous dans les plus brefs délais.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)} 
                    className="mt-8 text-[10px] font-bold text-[#357A32] uppercase tracking-widest border-b border-[#357A32] pb-1"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#4B2E05] ml-1">Nom Complet</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ahmed Ben Salem"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#357A32]/20 outline-none text-sm transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#4B2E05] ml-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="contact@exemple.tn"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#357A32]/20 outline-none text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#4B2E05] ml-1">Sujet</label>
                  <select
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#357A32]/20 outline-none text-sm appearance-none text-gray-500 transition-all"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="commande">Ma Commande</option>
                    <option value="produit">Nos Produits</option>
                    <option value="partenariat">Partenariats</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#4B2E05] ml-1">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Comment pouvons-nous vous aider ?"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#357A32]/20 outline-none text-sm transition-all resize-none"
                  ></textarea>
                </div>

                <div className="flex items-start gap-3 ml-1">
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    required
                    checked={formData.consent}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 text-[#357A32] border-gray-200 rounded focus:ring-[#357A32]/20 accent-[#357A32]"
                  />
                  <label htmlFor="consent" className="text-[11px] text-gray-400 font-serif italic leading-relaxed">
                    J'accepte que mes données soient traitées pour répondre à ma demande selon la politique de confidentialité.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#357A32] hover:bg-[#4B2E05] text-white py-5 rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#357A32]/10 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {isSubmitting ? 'Transmission...' : 'Envoyer le message'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* MAP SECTION - Style Rounded Blog */}
        <div className="mt-32">
          <div className="bg-gray-50 rounded-[3rem] p-4 border border-gray-100">
            <div className="h-[500px] w-full rounded-[2.5rem] overflow-hidden grayscale contrast-110 hover:grayscale-0 transition-all duration-1000 border border-gray-100">
              <iframe 
                title="Localisation Root"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102213.61828518931!2d10.107052576060598!3d36.81897003058925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd337f5e7ef543%3A0xd971e4d3a0113cf!2sTunis!5e0!3m2!1sfr!2stn!4v1700000000000!5m2!1sfr!2stn"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// COMPOSANT INFO INTERNE - Style Header de Carte Blog
const ContactInfoItem = ({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) => (
  <div className="flex items-start gap-6 group">
    <div className="h-14 w-14 bg-gray-50 text-[#4B2E05] rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-[#357A32] group-hover:text-white group-hover:border-[#357A32] transition-all duration-500">
      {React.cloneElement(icon as React.ReactElement, { size: 20, strokeWidth: 1.5 })}
    </div>
    <div className="pt-1">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">{title}</h3>
      <div className="text-[#4B2E05] font-serif italic text-base leading-snug group-hover:text-[#357A32] transition-colors">
        {content}
      </div>
    </div>
  </div>
);

export default Contact;