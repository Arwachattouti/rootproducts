import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
   <footer className="bg-[#373E02] text-white py-12">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-[#C8AD7F]">Contact</h3>
        <div className="space-y-3 text-sm">
          <p className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-[#C8AD7F]" />
            Tunis, Tunisie
          </p>
          <p className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-[#C8AD7F]" />
            +216 XX XXX XXX
          </p>
          <p className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-[#C8AD7F]" />
            contact@rootproducts.tn
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[#C8AD7F]">Navigation</h3>
        <ul className="space-y-2">
          <li><Link to="/" className="hover:text-[#7B3F00]">Accueil</Link></li>
          <li><Link to="/products" className="hover:text-[#7B3F00]">Nos Produits</Link></li>
          <li><Link to="/about" className="hover:text-[#7B3F00]">Notre Histoire</Link></li>
          <li><Link to="/blog" className="hover:text-[#7B3F00]">Blog</Link></li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[#C8AD7F]">Suivez-nous</h3>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-[#7B3F00]"><Facebook className="h-6 w-6" /></a>
          <a href="#" className="hover:text-[#7B3F00]"><Instagram className="h-6 w-6" /></a>
          <a href="#" className="hover:text-[#7B3F00]"><Youtube className="h-6 w-6" /></a>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-[#C8AD7F]">Informations</h3>
        <ul className="space-y-2">
          <li><Link to="/legal" className="hover:text-[#7B3F00]">Mentions légales</Link></li>
          <li><Link to="/privacy" className="hover:text-[#7B3F00]">Politique de confidentialité</Link></li>
          <li><Link to="/terms" className="hover:text-[#7B3F00]">CGV</Link></li>
        </ul>
      </div>
    </div>

    <div className="border-t border-[#7B3F00] mt-8 pt-8 text-center">
      <h2 className="text-2xl font-bold text-[#C8AD7F]">ROOT Products</h2>
      <p className="text-gray-300">© 2025 ROOT Products. Tous droits réservés.</p>
    </div>
  </div>
</footer>

  );
};

export default Footer;