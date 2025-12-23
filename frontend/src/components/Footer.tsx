import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#373E02] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Grille principale : 1 col sur mobile, 2 sur tablette, 4 sur desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">

          {/* Section Contact avec Icônes */}
          <div className="space-y-4">
            <h3 className="text-lg md:text-3xl font-seasons text-[#C8AD7F] uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-3 ">
              <li className="flex items-start group">
                <MapPin className="h-5 w-5 mr-3 text-[#C8AD7F] shrink-0 group-hover:scale-110 transition-transform" />
                <span className='font-seasons md:text-xl '>Tunis, Tunisie</span>
              </li>
              <li className="flex items-center group">
                <Phone className="h-5 w-5 mr-3 text-[#C8AD7F] shrink-0 group-hover:scale-110 transition-transform" />
                <a href="#" className="hover:text-white transition-colors md:text-xl font-seasons">+216 XX XXX XXX </a>
              </li>
              <li className="flex items-center group">
                <Mail className="h-5 w-5 mr-3 text-[#C8AD7F] shrink-0 group-hover:scale-110 transition-transform" />
                <a href="mailto:contact@rootproducts.tn" className="hover:text-white  text-[15px]  md:text-xl transition-colors break-all font-seasons">
                  contact@rootproducts.tn
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation avec effets de survol */}
          <div>
            <h3 className="text-lg font-seasons md:text-3xl text-[#C8AD7F] uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              {[
                { name: 'Accueil', path: '/' },
                { name: 'Nos Produits', path: '/products' },
                { name: 'Blog/Conseils', path: '/blog' },
                { name: 'Contact', path: '/contact' }
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className=" hover:text-white hover:translate-x-1 transition-all duration-200 flex md:text-xl font-seasons items-center"
                  >
                    <span className="mr-2 opacity-0 -ml-4 md:text-xl font-seasons group-hover:opacity-100 transition-all">›</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Réseaux Sociaux - Icônes stylisées */}
          <div>
            <h3 className="text-lg md:text-3xl font-seasons text-[#C8AD7F] uppercase tracking-wider mb-4">
              Suivez-nous
            </h3>
            <p className="text-sm mb-4 font-seasons md:text-xl">Rejoignez notre communauté engagée.</p>
            <div className="flex space-x-4">
              {[
                { icon: <Facebook />, url: '#', color: 'hover:bg-blue-600' },
                { icon: <Instagram />, url: '#', color: 'hover:bg-pink-600' },
                { icon: <Youtube />, url: '#', color: 'hover:bg-red-600' }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 bg-[#4a5303] rounded-lg transition-all duration-300 transform hover:-translate-y-1 ${social.color}`}
                >
                  {React.cloneElement(social.icon as React.ReactElement, { size: 20 })}
                </a>
              ))}
            </div>
          </div>

          {/* Informations Légales */}
          <div>
            <h3 className="text-lg  md:text-3xl font-seasons text-[#C8AD7F] uppercase tracking-wider mb-4">
              Informations
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/legal" className="hover:text-[#C8AD7F] md:text-xl transition-colors font-seasons underline-offset-4 hover:underline">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#C8AD7F] md:text-xl font-seasons  transition-colors underline-offset-4 hover:underline">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#C8AD7F] md:text-xl font-seasons transition-colors underline-offset-4 hover:underline">
                  CGV
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

   
      {/* Bas de footer avec effet de séparation propre */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-white/10"></div>
        </div>
      </div>

      <div className="py-8 px-4 text-center bg-[#2e3402]">
        <p className="text-xs sm:text-sm text-gray-400">
          © {currentYear} <span className="text-[#C8AD7F] md:text-xl font-semibold">ROOT Products</span>
          <br></br><span className='font-seasons md:text-xl text-sm'>
          Conçu avec passion pour la nature. Tous droits réservés.</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;