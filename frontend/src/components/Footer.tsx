import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#373E02] text-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

    {/* Grille mobile personnalisée */}
    <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 text-sm">

      {/* Contact */}
      <div>
        <h3 className="text-base font-semibold mb-4 text-[#C8AD7F]">
          Contact
        </h3>
        <div className="space-y-2 text-gray-200">
          <p>Tunis, Tunisie</p>
          <p>+216 XX XXX XXX</p>
          <p>contact@rootproducts.tn</p>
        </div>
      </div>

      {/* Navigation */}
      <div>
        <h3 className="text-base font-semibold mb-4 text-[#C8AD7F]">
          Navigation
        </h3>
        <ul className="space-y-2">
          <li><Link to="/">Accueil</Link></li>
          <li><Link to="/products">Nos Produits</Link></li>
          <li><Link to="/about">Notre Histoire</Link></li>
          <li><Link to="/blog">Blog</Link></li>
        </ul>
      </div>

      {/* Suivez-nous */}
      <div>
        <h3 className="text-base font-semibold mb-4 text-[#C8AD7F]">
          Suivez-nous
        </h3>
        <div className="flex space-x-4">
          <Facebook className="h-5 w-5" />
          <Instagram className="h-5 w-5" />
          <Youtube className="h-5 w-5" />
        </div>
      </div>

      {/* Informations */}
      <div>
        <h3 className="text-base font-semibold mb-4 text-[#C8AD7F]">
          Informations
        </h3>
        <ul className="space-y-2">
          <li><Link to="/legal">Mentions légales</Link></li>
          <li><Link to="/privacy">Politique de confidentialité</Link></li>
          <li><Link to="/terms">CGV</Link></li>
        </ul>
      </div>

    </div>
  </div>

  {/* Bas de footer */}
  <div className="border-t border-[#7B3F00]/40 py-6 text-center">
    <p className="text-sm text-gray-300">
      © 2025 ROOT Products. Tous droits réservés.
    </p>
  </div>
</footer>

  );
};

export default Footer;
