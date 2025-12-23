import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../components/logo.png";
import { Menu, X, ShoppingCart, User, ChevronDown, Search, Bell } from 'lucide-react'; 
import { useCart } from '../context/CartContext';
import { useGetProductsQuery } from '../state/apiService';
import { useGetCartQuery, useLogoutMutation } from '../state/apiService';
import { useSelector } from 'react-redux';
import { selectUser } from '../state/slices/userSlice'; 

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
    if (window.appTranslate && typeof window.appTranslate.changeLanguage === 'function') {
      window.appTranslate.changeLanguage(newLanguage);
    }
  };
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();

    if (query && products) {
      const foundProduct = products.find(p =>
        p.name.toLowerCase().includes(query)
      );
      if (foundProduct) {
        navigate(`/product/${foundProduct._id}`);
      } else {
        navigate(`/products?search=${encodeURIComponent(query)}`);
      }
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    try {
      await triggerLogout().unwrap();
      navigate('/login'); 
    } catch (error) {
      console.error("Échec de la déconnexion", error);
   
    }
  };

  const Logo = () => (
    <div className="flex items-center justify-start">
      <img
        src={logo}
        alt="ROOT Products Logo"
        className="h-12 sm:h-20 md:h-20 w-auto object-contain"
      />
    </div>
  );
  const navLinks: NavLink[] = [
    { name: 'Accueil', path: '/' },
    { name: 'Nos produits', path: '/products' },
    { name: 'Blog/Conseils', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-lg h-24" : "bg-transparent h-24"
        }`}
    >
      <div className="max-w-full mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-24">

          {/* ===== LOGO À GAUCHE (Desktop & Mobile) ===== */}
          <Link to="/" className="flex-shrink-0 -ml-2 sm:-ml-4">
            <Logo />
          </Link>

          {/* ===== NAVIGATION DESKTOP (Inchangée) ===== */}
          <nav className="hidden lg:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative text-[#4B2E05] hover:text-[#357A32] px-2 py-2 text-lg font-medium transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#357A32] after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* ===== ACTIONS DROITE (Search, Lang, Cart, User/Menu) ===== */}
          <div className="flex items-center space-x-2 md:space-x-4">

            {/* Recherche Desktop (Cachée sur Mobile) */}
            <form onSubmit={handleSearchSubmit} className="relative hidden lg:flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="border border-[#357A32] rounded-full py-1.5 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#7B3F00] text-sm w-full transition-all"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7B3F00] hover:text-[#357A32]">
                <Search className="h-5 w-5" />
              </button>
            </form>

            {/* Sélecteur de Langue */}
            <div className="hidden lg:flex items-center">
              <select
                id="lang"
                value={language}
                onChange={handleLanguageChange}
                className="bg-white border border-[#357A32] text-[#4A2612] p-1 rounded-md text-sm font-medium cursor-pointer outline-none"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
                <option value="it">Italiano</option>
                <option value="pt">Português</option>
              </select>
            </div>

            {/* Panier (Visible partout) */}
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

            {/* Compte Desktop (Caché sur Mobile) */}
            <div className="relative group hidden lg:block">
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
                      <p className="text-sm font-medium text-gray-900">{authState.user?.firstName} {authState.user?.lastName}</p>
                      <p className="text-xs text-gray-500">{authState.user?.email}</p>
                    </div>
                    <Link to="/account" className="flex items-center px-4 py-2 text-sm text-[#4B2E05] hover:bg-[#F5F2EA]"><User className="h-4 w-4 mr-2" /> Mon Compte</Link>
                    {authState.user?.role === 'admin' && (
                      <Link to="/admin" className="flex items-center px-4 py-2 text-sm text-[#4B2E05] hover:bg-[#F5F2EA]"><div className="h-4 w-4 mr-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-sm"></div> Administration</Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"><div className="h-4 w-4 mr-2">→</div> Déconnexion</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="flex items-center px-4 py-2 text-sm text-[#4B2E05] hover:bg-[#F5F2EA]"><div className="h-4 w-4 mr-2">→</div> Connexion</Link>
                    <Link to="/register" className="flex items-center px-4 py-2 text-sm text-[#4B2E05] hover:bg-[#F5F2EA]"><User className="h-4 w-4 mr-2" /> Inscription</Link>
                  </>
                )}
              </div>
            </div>

            {/* BOUTON MENU MOBILE (Burger) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-[#4B2E05] hover:text-[#357A32] transition-colors"
            >
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* ===== PARTIE MOBILE (OVERLAY + DRAWER) ===== */}

        {/* Fond sombre (Overlay) */}
        <div
          className={`fixed inset-0 bg-black/50 transition-opacity lg:hidden z-[55] ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Menu latéral (Drawer) */}
        <div className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden z-[60] flex flex-col ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>

          {/* Header du Menu */}
          <div className="flex justify-between items-center p-6 border-b border-gray-50">
            <span className="font-bold text-xl text-[#4B2E05]">Menu</span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <div className="flex flex-col flex-grow overflow-y-auto p-6">

            {/* Barre de Recherche */}
            <form onSubmit={handleSearchSubmit} className="relative mb-8">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit..."
                className="w-full border border-gray-200 rounded-xl py-3 px-4 pr-12 focus:border-[#357A32] focus:ring-2 focus:ring-[#357A32]/20 outline-none transition-all"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#357A32]">
                <Search className="h-5 w-5" />
              </button>
            </form>

            {/* Navigation Principale */}
            <nav className="space-y-1 mb-8">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} onClick={() => setIsMenuOpen(false)} className="block text-lg font-semibold text-[#4B2E05] hover:text-[#357A32] py-3 border-b border-gray-50">
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Sélecteur de Langue (Amélioré) */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <label htmlFor="lang-mobile" className="block text-xs font-semibold text-gray-400 uppercase mb-2 ml-1">
                Langue du site
              </label>
              <div className="relative">
                <select
                  id="lang-mobile"
                  value={language}
                  onChange={handleLanguageChange}
                  className="w-full bg-white border border-gray-200 text-[#4A2612] py-3 px-4 rounded-xl font-medium appearance-none outline-none focus:border-[#357A32]">
                  <option value="fr">🇫🇷 Français</option>
                  <option value="en">🇺🇸 English</option>
                  <option value="es">🇪🇸 Español</option>
                  <option value="de">🇩🇪 Deutsch</option>
                  <option value="it">🇮🇹 Italiano</option>
                  <option value="pt">🇵🇹 Português</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
            {/* Footer du Menu (Compte) */}
            <div className="mt-auto border-t border-gray-100 p-6 bg-gray-50/50">
              {authState.isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-4 mb-6 p-2">
                    <div className="relative">
                      <div className="bg-[#357A32] p-3 rounded-full text-white">
                        <User className="h-6 w-6" />
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-[#4B2E05] truncate">{authState.user?.firstName}</p>
                      <p className="text-xs text-gray-500 truncate">{authState.user?.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <Link
                      to="/account"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center text-gray-700 font-semibold p-3 hover:bg-white rounded-xl transition-colors" >
                      <User className="h-5 w-5 mr-3 text-gray-400" /> Mon profil
                    </Link>
                    {authState.user?.role === 'admin' && (
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center text-purple-600 font-medium py-2"><div className="h-5 w-5 mr-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-sm"></div> Administration</Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center text-red-600 font-semibold p-3 hover:bg-red-50 rounded-xl transition-colors w-full text-left" >
                      <Link
                        to="/logout"
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full bg-[#357A32] text-white text-center py-4 rounded-2xl font-bold shadow-lg shadow-[#357A32]/20 active:scale-95 transition-transform">
                        Déconnexion
                      </Link>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full bg-[#357A32] text-white text-center py-4 rounded-2xl font-bold shadow-lg shadow-[#357A32]/20 active:scale-95 transition-transform"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full bg-white border border-gray-200 text-[#4B2E05] text-center py-4 rounded-2xl font-bold active:scale-95 transition-transform"
                  >
                    Créer un compte
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );

};

export default Header;