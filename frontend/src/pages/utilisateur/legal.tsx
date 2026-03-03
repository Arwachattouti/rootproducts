import React, { useEffect, useState } from 'react';
import { 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Shield, 
  Scale, 
  User, 
  Server,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';

const Legal: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSection = (section: string) => {
    if (isMobile) {
      setOpenSection(openSection === section ? null : section);
    }
  };

  // Composant Section
  const Section = ({ 
    id, 
    icon, 
    title, 
    children 
  }: { 
    id: string;
    icon: React.ReactNode; 
    title: string; 
    children: React.ReactNode;
  }) => {
    const isOpen = !isMobile || openSection === id;

    return (
      <section className="border-b border-gray-100 last:border-b-0">
        <button
          onClick={() => toggleSection(id)}
          className={`w-full flex items-center justify-between py-4 sm:py-5 md:py-6 text-left md:cursor-default ${
            isMobile ? 'active:bg-gray-50' : ''
          }`}
        >
          <h2 className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl font-semibold text-gray-900">
            <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-[#357A32]/10 rounded-lg sm:rounded-xl flex items-center justify-center">
              {React.cloneElement(icon as React.ReactElement, {
                className: 'w-4 h-4 sm:w-5 sm:h-5 text-[#357A32]'
              })}
            </span>
            <span className="font-seasons">{title}</span>
          </h2>
          {isMobile && (
            <span className="text-gray-400 ml-2">
              {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </span>
          )}
        </button>
        
        <div className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[2000px] opacity-100 pb-6' : 'max-h-0 opacity-0'
        }`}>
          <div className="pl-10 sm:pl-[52px] text-sm sm:text-base text-gray-700 space-y-3 sm:space-y-4 font-seasons leading-relaxed">
            {children}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* ==================== HEADER ==================== */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#357A32]/10 rounded-xl sm:rounded-2xl flex items-center justify-center">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-[#357A32]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-seasons text-[#4B2E05]">
                Mentions Légales
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-seasons mt-0.5">
                Informations juridiques
              </p>
            </div>
          </div>
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-seasons">
            <a href="/" className="hover:text-[#357A32] transition-colors">Accueil</a>
            <span>/</span>
            <span className="text-gray-900">Mentions légales</span>
          </nav>
        </div>
      </div>

      {/* ==================== CONTENU ==================== */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 md:p-8 lg:p-10">
            
            {/* Indication mobile */}
            <p className="text-xs text-gray-400 font-seasons mb-4 md:hidden text-center">
              Appuyez sur une section pour l'ouvrir
            </p>

            {/* ===== Informations Entreprise ===== */}
            <Section id="company" icon={<Building />} title="Informations sur l'entreprise">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gray-50 p-3 sm:p-4 rounded-xl">
                  <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mb-1">Dénomination sociale</p>
                  <p className="font-semibold text-gray-900">ROOT Products SARL</p>
                </div>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-xl">
                  <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mb-1">Forme juridique</p>
                  <p className="font-semibold text-gray-900">SARL</p>
                </div>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-xl">
                  <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mb-1">Capital social</p>
                  <p className="font-semibold text-gray-900">50 000 TND</p>
                </div>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-xl">
                  <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mb-1">N° Immatriculation</p>
                  <p className="font-semibold text-gray-900">1234567890123</p>
                </div>
              </div>
              <div className="mt-4 bg-gray-50 p-3 sm:p-4 rounded-xl">
                <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mb-1">Registre du commerce</p>
                <p className="font-semibold text-gray-900">Tunis B 123456789</p>
              </div>
              <div className="mt-3 bg-gray-50 p-3 sm:p-4 rounded-xl">
                <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mb-1">Code APE</p>
                <p className="font-semibold text-gray-900">4729Z - Autres commerces de détail alimentaires</p>
              </div>
            </Section>

            {/* ===== Coordonnées ===== */}
            <Section id="contact" icon={<Mail />} title="Coordonnées">
              <div className="space-y-3 sm:space-y-4">
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <MapPin className="w-5 h-5 text-[#357A32] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-gray-900 group-hover:text-[#357A32] transition-colors">
                      Avenue Habib Bourguiba, 1000 Tunis, Tunisie
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#357A32]" />
                </a>
                
                <a 
                  href="tel:+21671000000"
                  className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <Phone className="w-5 h-5 text-[#357A32] flex-shrink-0" />
                  <span className="text-gray-900 group-hover:text-[#357A32] transition-colors">
                    +216 71 XXX XXX
                  </span>
                </a>
                
                <a 
                  href="mailto:contact@rootproducts.tn"
                  className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <Mail className="w-5 h-5 text-[#357A32] flex-shrink-0" />
                  <span className="text-gray-900 group-hover:text-[#357A32] transition-colors">
                    contact@rootproducts.tn
                  </span>
                </a>
              </div>
            </Section>

            {/* ===== Directeur ===== */}
            <Section id="director" icon={<User />} title="Directeur de la publication">
              <div className="bg-[#4B2E05] text-white p-4 sm:p-5 rounded-xl">
                <p className="text-base sm:text-lg font-semibold">Ahmed Benali</p>
                <p className="text-sm text-white/70 mt-1">Gérant de ROOT Products SARL</p>
              </div>
            </Section>

            {/* ===== Hébergement ===== */}
            <Section id="hosting" icon={<Server />} title="Hébergement">
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 sm:p-4 rounded-xl">
                  <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mb-1">Hébergeur</p>
                  <p className="font-semibold text-gray-900">Netlify, Inc.</p>
                </div>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-xl">
                  <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mb-1">Adresse</p>
                  <p className="text-gray-900">2325 3rd Street, Suite 296, San Francisco, CA 94107, USA</p>
                </div>
                <a 
                  href="https://www.netlify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#357A32] hover:underline"
                >
                  www.netlify.com
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </Section>

            {/* ===== Propriété intellectuelle ===== */}
            <Section id="ip" icon={<FileText />} title="Propriété intellectuelle">
              <div className="space-y-4">
                <p>
                  L'ensemble de ce site relève de la législation tunisienne et internationale sur le droit d'auteur
                  et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les
                  documents téléchargeables et les représentations iconographiques et photographiques.
                </p>
                <p>
                  La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est
                  formellement interdite sauf autorisation expresse du directeur de la publication.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                  <p className="text-yellow-800 text-sm">
                    <strong>Important :</strong> Les marques ROOT Products et tous les logos figurant sur le site sont des marques déposées.
                    Toute reproduction totale ou partielle de ces marques sans autorisation préalable et écrite est prohibée.
                  </p>
                </div>
              </div>
            </Section>

            {/* ===== Responsabilité ===== */}
            <Section id="liability" icon={<Shield />} title="Responsabilité">
              <div className="space-y-4">
                <p>
                  Les informations contenues sur ce site sont aussi précises que possible et le site remis à jour
                  à différentes périodes de l'année, mais peut toutefois contenir des inexactitudes ou des omissions.
                </p>
                <p>
                  Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, merci de bien
                  vouloir le signaler par email, à l'adresse{' '}
                  <a href="mailto:contact@rootproducts.tn" className="text-[#357A32] hover:underline">
                    contact@rootproducts.tn
                  </a>, en décrivant le problème de la manière la plus précise possible.
                </p>
                <p>
                  ROOT Products ne pourra être tenue responsable des dommages directs et indirects causés au
                  matériel de l'utilisateur, lors de l'accès au site rootproducts.tn.
                </p>
              </div>
            </Section>

            {/* ===== Données personnelles ===== */}
            <Section id="privacy" icon={<Shield />} title="Données personnelles">
              <div className="space-y-4">
                <p>
                  Conformément à la loi tunisienne sur la protection des données personnelles, vous disposez d'un
                  droit d'accès, de rectification et de suppression des données vous concernant.
                </p>
                <div className="bg-[#357A32]/10 p-4 rounded-xl border border-[#357A32]/20">
                  <p className="text-[#357A32] text-sm font-medium mb-2">Pour exercer ce droit :</p>
                  <p className="text-gray-700 text-sm">
                    ROOT Products SARL, Avenue Habib Bourguiba, 1000 Tunis, Tunisie<br />
                    Email: <a href="mailto:contact@rootproducts.tn" className="text-[#357A32] hover:underline">contact@rootproducts.tn</a>
                  </p>
                </div>
                <p>
                  Aucune information personnelle de l'utilisateur du site rootproducts.tn n'est publiée à
                  l'insu de l'utilisateur, échangée, transférée, cédée ou vendue sur un support quelconque à des tiers.
                </p>
              </div>
            </Section>

            {/* ===== Droit applicable ===== */}
            <Section id="law" icon={<Scale />} title="Droit applicable">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p>
                  Tout litige en relation avec l'utilisation du site rootproducts.tn est soumis au droit tunisien.
                  Il est fait attribution exclusive de juridiction aux tribunaux compétents de <strong>Tunis</strong>.
                </p>
              </div>
            </Section>

          </div>

          {/* Footer - Dernière mise à jour */}
          <div className="border-t border-gray-100 px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-xs sm:text-sm text-gray-500 font-seasons">
                Dernière mise à jour : <strong>15 janvier 2025</strong>
              </p>
              <a 
                href="/contact" 
                className="text-xs sm:text-sm text-[#357A32] hover:underline font-seasons"
              >
                Une question ? Contactez-nous
              </a>
            </div>
          </div>
        </div>

        {/* Navigation rapide mobile */}
        <div className="mt-6 sm:mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:hidden">
          <h3 className="text-sm font-seasons font-semibold text-gray-900 mb-4">
            Liens utiles
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <a 
              href="/politique-confidentialite" 
              className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl text-sm font-seasons text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Shield className="w-4 h-4 text-[#357A32]" />
              Confidentialité
            </a>
            <a 
              href="/cgv" 
              className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl text-sm font-seasons text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <FileText className="w-4 h-4 text-[#357A32]" />
              CGV
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legal;
