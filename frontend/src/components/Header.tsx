import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../components/logo.png";
import { Menu, X, ShoppingCart, User, ChevronDown, Search, Bell } from 'lucide-react'; // Ajout de Bell pour les notifications
import { useCart } from '../context/CartContext';
import { useGetProductsQuery } from '../state/apiService';
import { useGetCartQuery, useLogoutMutation } from '../state/apiService';
// --- IMPORTS REDUX/RTK QUERY ---
import { useSelector } from 'react-redux';
import { selectUser } from '../state/slices/userSlice'; // Assurez-vous que le chemin est correct

interface NavLink {
  name: string;
  path: string;
}
interface ProductLink {
  name: string;
  path: string;
}
const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState(window.appTranslate?.currentLanguage || 'fr');

  const navigate = useNavigate();
  const { data: cartData } = useGetCartQuery();
  const { data: products } = useGetProductsQuery(); // Récupère tous les produits
  const authState = useSelector(selectUser);
  const [triggerLogout] = useLogoutMutation();
  const totalItems = cartData?.items?.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0) || 0;
  const handleCartClick = () => {
    navigate('/panier');
  };
  const { state } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Synchronisation de la langue si changée par le HOC
  useEffect(() => {
    const checkLang = setInterval(() => {
      if (window.appTranslate?.currentLanguage && window.appTranslate.currentLanguage !== language) {
        setLanguage(window.appTranslate.currentLanguage);
      }
    }, 1000);
    return () => clearInterval(checkLang);
  }, [language]);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);

    // Utilisation du "Optional Chaining" (?.) pour sécuriser l'appel
    if (window.appTranslate && typeof window.appTranslate.changeLanguage === 'function') {
      window.appTranslate.changeLanguage(newLanguage);
    }
  };
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();

    if (query && products) {
      // On cherche un produit dont le nom contient le mot tapé
      const foundProduct = products.find(p =>
        p.name.toLowerCase().includes(query)
      );

      if (foundProduct) {
        // Redirection dynamique vers l'ID réel du produit trouvé
        navigate(`/product/${foundProduct._id}`);
      } else {
        // Si aucun produit exact n'est trouvé, on va à la page globale de résultats
        navigate(`/products?search=${encodeURIComponent(query)}`);
      }

      setSearchQuery("");
    }
  };


  // Fonction qui déclenche la déconnexion API (utilisée sur mobile et desktop)
  const handleLogout = async () => {
    try {
      // Appelle l'API POST /api/users/logout (qui supprime le cookie)
      await triggerLogout().unwrap();
      // Le userSlice gère la mise à jour de l'état Redux (isAuthenticated = false)
      navigate('/login'); // Redirige vers la page de connexion après succès
    } catch (error) {
      console.error("Échec de la déconnexion", error);
      // Gérer l'erreur si nécessaire
    }
  };
  const Logo = () => (
    <div className="flex items-center justify-start">
      <img
        src={logo}
        alt="ROOT Products Logo"
        className="h-20 sm:h-24 md:h-20  w-[250px]"
      />
    </div>
  );
  const navLinks: NavLink[] = [
    { name: 'Accueil', path: '/' },
   { name: 'À propos', path: '/about' }
  ];

  const productLinks: ProductLink[] = [
    { name: 'Mloukhia Premium', path: '/products?category=poudre' },
    { name: 'Mloukhia Bio', path: '/products?category=bio' },
    { name: 'Coffrets Spéciaux', path: '/products?category=coffret' }
  ];

  // Liens à afficher après le menu "Nos Produits"
  const extraLinks: NavLink[] = [
    { name: 'Blog/Conseils', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-lg h-24" : "bg-transparent h-24"
        }`}
    >
      <div className="max-w-full mx-auto  lg:px-8">
        <div className="flex justify-between items-center h-24">

          {/* ===== LOGO À GAUCHE ===== */}
          <Link to="/" className="flex-shrink-0 -ml-2 sm:-ml-4">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6 items-center">
            {/* 1. LIEN ACCUEIL */}
            <Link
              to="/"
              className="relative text-[#4B2E05] hover:text-[#357A32] px-2 py-2 text-lg font-medium transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#357A32] after:transition-all after:duration-300 hover:after:w-full"
            >
              Accueil
            </Link>
            <Link
              to="/about"
              className="relative text-[#4B2E05] hover:text-[#357A32] px-2 py-2 text-lg font-medium transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#357A32] after:transition-all after:duration-300 hover:after:w-full"
            >À propos
            </Link>

            {/* 2. MENU NOS PRODUITS (DROPDOWN) */}
            <div className="relative group">
              <Link
                to="/products"
                className="relative text-[#4B2E05] hover:text-[#357A32] px-2 py-2 text-lg font-medium flex items-center transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#357A32] after:transition-all after:duration-300 group-hover:after:w-full"
              >
                Nos produits
                <ChevronDown className="ml-1 h-4 w-4 transform group-hover:rotate-180 transition-transform duration-300" />
              </Link>

              {/* Contenu du Dropdown */}
              <div className="absolute left-0 mt-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 invisible group-hover:visible group-hover:mt-2 transition-all duration-300 z-50">
                <div className="py-1">
                  {productLinks.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#F5F2EA] transition-colors duration-300"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. LIENS BLOG ET CONTACT */}
            {extraLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="relative text-[#4B2E05] hover:text-[#357A32] px-2 py-2 text-lg font-medium transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#357A32] after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search + Language + Icons */}
          <div className="flex items-center space-x-4">
            {/* Barre de recherche */}
            <form onSubmit={handleSearchSubmit} className="relative hidden lg:flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                // Ajout de pr-8 (padding-right) pour laisser de la place à l'icône
                className="border border-[#357A32] rounded-full py-1.5 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#7B3F00] text-sm w-full transition-all"
              />
              <button
                type="submit"
                // Centrage vertical de l'icône
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7B3F00] hover:text-[#357A32] transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>

            <div className="flex items-center">
              <select
                id="lang"
                onChange={handleLanguageChange}
                /* bg-white: Fond blanc | text-[#4A2612]: Marron foncé | border-gray-300: Bordure légère */
                className="bg-white border  border-[#357A32] text-[#4A2612] p-1 rounded-md text-sm font-medium cursor-pointer hover:border-[#4A2612] transition-colors duration-200 outline-none"
              >
                <option value="fr" className="bg-white text-[#4A2612]">Français</option>
                <option value="en" className="bg-white text-[#4A2612]">English</option>
                <option value="es" className="bg-white text-[#4A2612]">Español</option>
                <option value="de" className="bg-white text-[#4A2612]">Deutsch</option>
                <option value="it" className="bg-white text-[#4A2612]">Italiano</option>
                <option value="pt" className="bg-white text-[#4A2612]">Português</option>
              </select>
            </div>

            {/* Notifications (pour les utilisateurs connectés) 
            {authState.isAuthenticated && (
              <div className="relative">
                <button className="text-[#7B3F00] hover:text-[#357A32] transition-colors duration-300 relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold shadow-lg">
                    3
                  </span>
                </button>
              </div>
            )}*/}

            {/* Panier */}

            <button
              onClick={handleCartClick}
              className="relative p-2 text-[#4B2E05] hover:text-[#357A32] transition-all duration-300 hover:scale-110"
            >
              <ShoppingCart className="h-6 w-6" />

              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg border-2 border-white animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Compte (Desktop Dropdown) */}
            <div className="relative group hidden sm:block">
              <button className="flex items-center text-[#4B2E05] hover:text-[#357A32] transition-colors duration-300">
                <User className="h-5 w-5 mr-1" />
                {authState.isAuthenticated && (
                  <span className="ml-1 text-lg">{authState.user?.firstName}</span>
                )}
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute right-0 mt-2 bg-white shadow-xl rounded-lg py-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-100 z-50">
                {authState.isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {authState.user?.firstName} {authState.user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{authState.user?.email}</p>
                    </div>
                    <Link
                      to="/account"
                      className="flex items-center px-4 py-2 text-sm text-[#4B2E05] hover:bg-[#F5F2EA] transition-colors duration-300"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Mon Compte
                    </Link>
                    {authState.user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-sm text-[#4B2E05] hover:bg-[#F5F2EA] transition-colors duration-300"
                      >
                        <div className="h-4 w-4 mr-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-sm"></div>
                        Administration
                      </Link>
                    )}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={() => handleLogout()} // Utilisation de la fonction centralisée
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-300"
                      >
                        <div className="h-4 w-4 mr-2">→</div>
                        Déconnexion
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center px-4 py-2 text-sm text-[#4B2E05] hover:bg-[#F5F2EA] transition-colors duration-300"
                    >
                      <div className="h-4 w-4 mr-2">→</div>
                      Connexion
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center px-4 py-2 text-sm text-[#4B2E05] hover:bg-[#F5F2EA] transition-colors duration-300"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Inscription
                    </Link>
                  </>
                )}
              </div>
            </div>



            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-[#4B2E05] hover:text-[#357A32] transition-colors duration-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 mt-2 mx-4 py-4 space-y-2 bg-white shadow-xl rounded-lg border border-[#357A32] z-50">
            {/* Search mobile */}
            <div className="px-4 pb-4 border-b border-gray-200">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full border border-[#357A32] rounded-lg py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#4B2E05]"
                />
                <button type="submit" className="absolute right-2 top-2 text-[#4B2E05]">
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="flex items-center text-[#4B2E05] hover:text-[#357A32] hover:bg-[#F5F2EA] px-4 py-3 text-base font-medium transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            <div className="px-4 py-2">
              <p className="text-sm font-medium text-gray-500 mb-2">Produits</p>
              {productLinks.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block text-[#4B2E05]  hover:text-[#357A32] hover:bg-[#F5F2EA] px-2 py-2 text-sm transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <Link
              to="/products"
              className="flex items-center text-[#4B2E05]  hover:text-[#357A32] hover:bg-[#F5F2EA] px-4 py-3 text-base font-medium transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Tous les Produits
            </Link>

            <div className="border-t border-gray-200 pt-4">
              <Link
                to={authState.isAuthenticated ? "/account" : "/login"}
                className="flex items-center text-[#4B2E05] hover:text-[#357A32] hover:bg-[#F5F2EA] px-4 py-3 text-base font-medium transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-5 w-5 mr-2" />
                {authState.isAuthenticated ? 'Mon Compte' : 'Connexion'}
              </Link>
              {authState.isAuthenticated && authState.user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center text-[#4B2E05] hover:text-[#357A32] hover:bg-[#F5F2EA] px-4 py-3 text-base font-medium transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="h-5 w-5 mr-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
                  Administration
                </Link>
              )}
              {authState.isAuthenticated && (
                <button
                  onClick={() => {
                    handleLogout(); // Utilisation de la fonction centralisée
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full text-left text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-3 text-base font-medium transition-colors duration-300"
                >
                  <div className="h-5 w-5 mr-2">→</div>
                  Déconnexion
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;