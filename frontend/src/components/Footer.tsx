// components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Phone, Mail,
  Facebook, Instagram, Youtube,
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#373E02] text-white">
      <div
        className="
          max-w-7xl mx-auto
          px-4 sm:px-6 lg:px-8
          py-8 sm:py-12 md:py-16
        "
      >
        {/* Grille principale */}
        <div
          className="
            grid gap-x-6 gap-y-8
            sm:gap-x-8 sm:gap-y-10
            md:gap-y-12
            grid-cols-2
            lg:grid-cols-4
          "
        >

          {/* ── Contact ── */}
          <div>
            <h3
              className="
                font-seasons text-[#C8AD7F] uppercase
                tracking-wider
                text-sm sm:text-lg md:text-xl lg:text-3xl
                mb-3 sm:mb-4
              "
            >
              Contact
            </h3>
          
            <ul className="space-y-1.5 sm:space-y-2">
              <li className="flex items-start group">
                <MapPin
                  className="
                    h-4 w-4 sm:h-5 sm:w-5
                    mr-2 sm:mr-3
                    text-[#C8AD7F] shrink-0
                    group-hover:scale-110 transition-transform
                  "
                />
                <span
                  className="
                    font-seasons
                    text-xs sm:text-sm md:text-base lg:text-xl
                  "
                >
                  Tunis, Tunisie
                </span>
              </li>
              <li className="flex items-center group">
                <Phone
                  className="
                    h-4 w-4 sm:h-5 sm:w-5
                    mr-2 sm:mr-3
                    text-[#C8AD7F] shrink-0
                    group-hover:scale-110 transition-transform
                  "
                />
                <a
                  href="#"
                  className="
                    font-seasons hover:text-white transition-colors
                    text-xs sm:text-sm md:text-base lg:text-xl
                  "
                >
                  +216 XX XXX XXX
                </a>
              </li>
              <li className="flex items-center group">
                <Mail
                  className="
                    h-4 w-4 sm:h-5 sm:w-5
                    mr-2 sm:mr-3
                    text-[#C8AD7F] shrink-0
                    group-hover:scale-110 transition-transform
                  "
                />
                <a
                  href="mailto:contact@rootproducts.tn"
                  className="
                    font-seasons hover:text-white transition-colors
                    break-all
                    text-[10px] sm:text-sm md:text-base lg:text-xl
                  "
                >
                  contact@rootproducts.tn
                </a>
              </li>
            </ul>
          </div>

          {/* ── Navigation ── */}
          <div>
            <h3
              className="
                font-seasons text-[#C8AD7F] uppercase
                tracking-wider
                text-sm sm:text-lg md:text-xl lg:text-3xl
                mb-3 sm:mb-4
              "
            >
              Navigation
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {[
                { name: 'Accueil', path: '/' },
                { name: 'Nos produits', path: '/products' },
                { name: 'Blog/Conseils', path: '/blog' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="
                      font-seasons
                      hover:text-white hover:translate-x-1
                      transition-all duration-200
                      flex items-center
                      text-xs sm:text-sm md:text-base lg:text-xl
                    "
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Réseaux Sociaux ── */}
          <div>
            <h3
              className="
                font-seasons text-[#C8AD7F] uppercase
                tracking-wider
                text-sm sm:text-lg md:text-xl lg:text-3xl
                mb-3 sm:mb-4
              "
            >
              Suivez-nous
            </h3>
            <p
              className="
                font-seasons mb-3 sm:mb-4
                text-[10px] sm:text-sm md:text-base lg:text-xl
              "
            >
              Rejoignez notre communauté engagée.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              {[
                { icon: <Facebook />, url: '#', color: 'hover:bg-blue-600' },
                { icon: <Instagram />, url: '#', color: 'hover:bg-pink-600' },
                { icon: <Youtube />, url: '#', color: 'hover:bg-red-600' },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    p-1.5 sm:p-2
                    bg-[#4a5303] rounded-lg
                    transition-all duration-300
                    transform hover:-translate-y-1
                    ${social.color}
                  `}
                >
                  {React.cloneElement(
                    social.icon as React.ReactElement,
                    {
                      className: 'h-4 w-4 sm:h-5 sm:w-5',
                    }
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* ── Informations Légales ── */}
          <div>
            <h3
              className="
               font-seasons text-[#C8AD7F] uppercase
                tracking-wider
                text-sm sm:text-lg md:text-xl lg:text-3xl
                mb-3 sm:mb-4
              "
            >
              Informations
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {[
                { name: 'Notre histoire', path: '/about' },
                { name: 'Mentions légales', path: '/legal' },
                { name: 'Politique de confidentialité', path: '/privacy' },
                { name: 'CGV', path: '/terms' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="
                      font-seasons
                      hover:text-[#C8AD7F] transition-colors
                      underline-offset-4 hover:underline
                      text-xs sm:text-sm md:text-base lg:text-xl
                    "
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ── Séparateur ── */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-white/10" />
        </div>
      </div>

      {/* ── Bas de footer ── */}
      <div
        className="
          py-4 sm:py-6 md:py-8
          px-4
          text-center bg-[#2e3402]
        "
      >
        <p
          className="
            text-[10px] sm:text-xs md:text-sm
            text-gray-400
          "
        >
          © {currentYear}{' '}
          <span
            className="
              text-[#C8AD7F] font-semibold
              text-xs sm:text-sm md:text-base lg:text-xl
            "
          >
            ROOT Products
          </span>
        </p>
        <p
          className="
            font-seasons text-gray-400
            mt-1
            text-[10px] sm:text-xs md:text-sm lg:text-xl
          "
        >
          Conçu avec passion pour la nature. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;