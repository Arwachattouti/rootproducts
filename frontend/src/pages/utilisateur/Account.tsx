import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, Package, Heart, Settings, LogOut, 
  MapPin, Lock, ChevronDown, CheckCircle2, Loader2, X, Eye, EyeOff
} from 'lucide-react';
import { 
  useGetProfileQuery, 
  useUpdateProfileMutation, 
  useGetUserOrdersQuery, 
  useLogoutMutation 
} from '../../state/apiService';
import { useNavigate } from 'react-router-dom';

const Account: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updateMessage, setUpdateMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const { data: user, isLoading: userLoading, refetch } = useGetProfileQuery();
  const { data: orders, isLoading: ordersLoading } = useGetUserOrdersQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [logout] = useLogoutMutation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: { street: '', city: '', postalCode: '', country: 'Tunisie' }
  });

  const [wishlist] = useState([
    {
      id: '1',
      name: 'Kit Cuisine Mloukhia',
      price: 34.900,
      image: 'https://images.pexels.com/photos/7937447/pexels-photo-7937447.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      inStock: false
    },
    {
      id: '2',
      name: 'Mloukhia Fraîche Congelée',
      price: 12.900,
      image: 'https://images.pexels.com/photos/4198024/pexels-photo-4198024.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      inStock: true
    }
  ]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          postalCode: user.address?.postalCode || '',
          country: user.address?.country || 'Tunisie'
        }
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...(prev[parent as keyof typeof prev] as object), [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData).unwrap();
      setIsEditing(false);
      setUpdateMessage({ type: 'success', text: 'Profil mis à jour avec succès.' });
      refetch();
      setTimeout(() => setUpdateMessage(null), 3000);
    } catch {
      setUpdateMessage({ type: 'error', text: 'Erreur lors de la mise à jour.' });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (userLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <Loader2 className="animate-spin text-[#357A32] h-10 w-10 sm:h-12 sm:w-12 mb-4" />
      <p className="font-serif italic text-gray-500 text-sm sm:text-base text-center">
        Ouverture de votre espace...
      </p>
    </div>
  );

  const tabs = [
    { id: 'profile', label: 'Profil', icon: UserIcon },
    { id: 'orders', label: 'Commandes', icon: Package },
    { id: 'wishlist', label: 'Favoris', icon: Heart },
    { id: 'settings', label: 'Sécurité', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-16 sm:pb-20">
      
      {/* ═══════════════════════════════════════════════════════════
          HEADER
      ═══════════════════════════════════════════════════════════ */}
      <header className="bg-white border-b border-gray-100 pt-12 sm:pt-16 pb-6 sm:pb-8 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif italic text-[#000000]">
            Mon Espace
          </h1>
          <p className="text-[#357A32] mt-2 sm:mt-3 tracking-[0.15em] sm:tracking-[0.2em] text-sm sm:text-base lg:text-lg">
            Bienvenue, {user?.firstName || 'Client'}
          </p>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════
          NAVIGATION MOBILE (Horizontal Scroll)
      ═══════════════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 lg:hidden">
        <div 
          className="flex overflow-x-auto px-3 sm:px-4 py-3 sm:py-4 gap-2 sm:gap-3"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
          
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-[#4B2E05] text-white shadow-lg shadow-[#4B2E05]/20' 
                  : 'bg-gray-50 text-gray-600 border border-gray-200 active:bg-gray-100'
              }`}
            >
              <tab.icon size={14} strokeWidth={2.5} className="flex-shrink-0" />
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
          
          {/* Logout Button Mobile */}
          <button 
            onClick={handleLogout}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-red-50 text-red-500 border border-red-200 active:bg-red-100"
          >
            <LogOut size={14} strokeWidth={2.5} />
            <span className="hidden xs:inline">Quitter</span>
          </button>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════
          MAIN CONTAINER
      ═══════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-6 sm:mt-8 lg:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-10 xl:gap-12">
          
          {/* ═══════════════════════════════════════════════════════
              SIDEBAR DESKTOP
          ═══════════════════════════════════════════════════════ */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 xl:p-8 sticky top-8">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-5 py-3.5 text-[11px] font-black uppercase tracking-[0.12em] rounded-xl transition-all duration-200 ${
                      activeTab === tab.id 
                        ? 'bg-[#4B2E05] text-white shadow-lg shadow-[#4B2E05]/15' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-[#000000]'
                    }`}
                  >
                    <tab.icon className="h-4 w-4 mr-3 flex-shrink-0" strokeWidth={2.5} /> 
                    {tab.label}
                  </button>
                ))}
                
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <button 
                    onClick={handleLogout} 
                    className="w-full flex items-center px-5 py-3.5 text-[11px] font-black uppercase tracking-[0.12em] text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3 flex-shrink-0" strokeWidth={2.5} /> 
                    Quitter
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* ═══════════════════════════════════════════════════════
              MAIN CONTENT
          ═══════════════════════════════════════════════════════ */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 min-h-[400px] sm:min-h-[500px]">
              
              {/* Message de mise à jour */}
              {updateMessage && (
                <div className={`mb-6 sm:mb-8 p-4 sm:p-5 rounded-xl sm:rounded-2xl text-sm font-semibold border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                  updateMessage.type === 'success' 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  <CheckCircle2 size={18} className="flex-shrink-0" />
                  <span className="flex-1">{updateMessage.text}</span>
                  <button onClick={() => setUpdateMessage(null)} className="p-1">
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════
                  SECTION: PROFILE
              ═══════════════════════════════════════════════════ */}
              {activeTab === 'profile' && (
                <div className="space-y-8 sm:space-y-10 animate-in fade-in duration-300">
                  
                  {/* Header du profil */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif italic text-[#000000]">
                      Mon Profil
                    </h2>
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className={`w-full sm:w-auto font-bold text-[11px] uppercase tracking-wider px-6 sm:px-8 py-3 rounded-full transition-all duration-200 border-2 ${
                        isEditing 
                          ? 'border-red-300 text-red-500 bg-red-50 hover:bg-red-100' 
                          : 'bg-[#357A32] text-white border-[#357A32] hover:bg-[#2d6829]'
                      }`}
                    >
                      {isEditing ? 'Annuler' : 'Modifier'}
                    </button>
                  </div>

                  {/* Formulaire Informations personnelles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <ProfileInput 
                      label="Prénom" 
                      name="firstName" 
                      value={formData.firstName} 
                      disabled={!isEditing} 
                      onChange={handleInputChange} 
                    />
                    <ProfileInput 
                      label="Nom" 
                      name="lastName" 
                      value={formData.lastName} 
                      disabled={!isEditing} 
                      onChange={handleInputChange} 
                    />
                    <ProfileInput 
                      label="Email" 
                      name="email" 
                      value={formData.email} 
                      disabled={true}
                      type="email"
                    />
                    <ProfileInput 
                      label="Téléphone" 
                      name="phone" 
                      value={formData.phone} 
                      disabled={!isEditing} 
                      onChange={handleInputChange}
                      type="tel"
                    />
                  </div>

                  {/* Section Adresse */}
                  <div className="pt-8 sm:pt-10 border-t border-gray-100">
                    <h3 className="font-serif italic text-lg sm:text-xl text-[#000000] mb-6 sm:mb-8 flex items-center gap-3">
                      <span className="p-2 bg-green-50 rounded-xl">
                        <MapPin size={18} className="text-[#357A32]" />
                      </span>
                      Adresse de livraison
                    </h3>
                    
                    <div className="space-y-4 sm:space-y-6">
                      <ProfileInput 
                        label="Rue et Numéro" 
                        name="address.street" 
                        value={formData.address.street} 
                        disabled={!isEditing} 
                        onChange={handleInputChange} 
                      />
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <ProfileInput 
                          label="Ville" 
                          name="address.city" 
                          value={formData.address.city} 
                          disabled={!isEditing} 
                          onChange={handleInputChange} 
                        />
                        <ProfileInput 
                          label="Code Postal" 
                          name="address.postalCode" 
                          value={formData.address.postalCode} 
                          disabled={!isEditing} 
                          onChange={handleInputChange} 
                        />
                        <div className="sm:col-span-2 lg:col-span-1">
                          <ProfileInput 
                            label="Pays" 
                            name="address.country" 
                            value={formData.address.country} 
                            disabled={true} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bouton Sauvegarder */}
                  {isEditing && (
                    <div className="pt-4 sm:pt-6">
                      <button 
                        onClick={handleSave} 
                        disabled={isUpdating}
                        className="w-full sm:w-auto bg-[#000000] text-white px-8 sm:px-12 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#357A32] transition-all duration-300 flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="animate-spin h-5 w-5"/>
                            <span>Enregistrement...</span>
                          </>
                        ) : (
                          'Sauvegarder'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ═══════════════════════════════════════════════════
                  SECTION: ORDERS
              ═══════════════════════════════════════════════════ */}
              {activeTab === 'orders' && (
                <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif italic text-[#000000]">
                    Historique des commandes
                  </h2>
                  
                  {ordersLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="animate-spin text-[#357A32] h-8 w-8 sm:h-10 sm:w-10" />
                    </div>
                  ) : orders && orders.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {orders.map((order: any) => (
                        <div 
                          key={order._id} 
                          className="border border-gray-100 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50/50 hover:shadow-sm transition-shadow"
                        >
                          {/* Order Header */}
                          <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center text-[#4B2E05] shadow-sm border border-gray-100 flex-shrink-0">
                                <Package size={18} className="sm:w-5 sm:h-5" />
                              </div>
                              <div>
                                <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                  CMD-{order._id.slice(-6).toUpperCase()}
                                </p>
                                <p className="font-serif italic text-[#000000] text-base sm:text-lg">
                                  {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex w-full sm:w-auto justify-between sm:justify-end items-center gap-4 sm:gap-6">
                              <div className="text-left sm:text-right">
                                <p className="text-lg sm:text-xl font-black text-[#000000]">
                                  {order.totalPrice.toFixed(3)} DT
                                </p>
                                <span className={`inline-block text-[9px] sm:text-[10px] font-black uppercase tracking-tight px-2 py-0.5 rounded ${
                                  order.status === 'delivered' 
                                    ? 'bg-green-100 text-green-700' 
                                    : order.status === 'cancelled'
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {order.status === 'delivered' ? 'Livré' : 
                                   order.status === 'cancelled' ? 'Annulé' : 'En cours'}
                                </span>
                              </div>
                              
                              <button 
                                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                className={`h-9 w-9 sm:h-10 sm:w-10 rounded-full border flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                                  expandedOrder === order._id 
                                    ? 'bg-[#000000] text-white border-[#000000]' 
                                    : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                                }`}
                                aria-label={expandedOrder === order._id ? 'Masquer détails' : 'Voir détails'}
                              >
                                <ChevronDown 
                                  size={16} 
                                  className={`transition-transform duration-200 ${
                                    expandedOrder === order._id ? 'rotate-180' : ''
                                  }`} 
                                />
                              </button>
                            </div>
                          </div>
                          
                          {/* Order Details (Expanded) */}
                          {expandedOrder === order._id && (
                            <div className="px-4 pb-4 sm:px-6 sm:pb-6 animate-in slide-in-from-top-2 duration-200">
                              <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-100 space-y-2 sm:space-y-3">
                                {order.orderItems?.map((item: any, idx: number) => (
                                  <div key={idx} className="flex justify-between items-center text-sm py-1">
                                    <span className="text-gray-700 font-serif italic flex-1 pr-2">
                                      {item.name}
                                      <span className="ml-2 text-[#357A32] font-sans text-xs font-bold">
                                        ×{item.qty}
                                      </span>
                                    </span>
                                    <span className="font-black whitespace-nowrap">
                                      {(item.price * item.qty).toFixed(3)} DT
                                    </span>
                                  </div>
                                ))}
                                
                                <div className="pt-2 mt-2 border-t border-gray-100 flex justify-between items-center">
                                  <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Total</span>
                                  <span className="font-black text-[#357A32]">{order.totalPrice.toFixed(3)} DT</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 sm:py-16">
                      <Package size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 font-serif italic">Aucune commande pour le moment</p>
                    </div>
                  )}
                </div>
              )}

              {/* ═══════════════════════════════════════════════════
                  SECTION: WISHLIST
              ═══════════════════════════════════════════════════ */}
              {activeTab === 'wishlist' && (
                <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif italic text-[#000000]">
                    Ma Sélection
                  </h2>
                  
                  {wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {wishlist.map((item) => (
                        <div 
                          key={item.id} 
                          className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl flex-shrink-0" 
                          />
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-serif italic text-sm sm:text-base text-[#000000] leading-tight line-clamp-2">
                              {item.name}
                            </h3>
                            <p className="text-[#357A32] font-black text-sm mt-1">
                              {item.price.toFixed(3)} DT
                            </p>
                            
                            <div className="flex gap-2 mt-2 sm:mt-3">
                              <button 
                                disabled={!item.inStock} 
                                className={`flex-1 text-[10px] sm:text-xs font-bold uppercase py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-colors ${
                                  item.inStock 
                                    ? 'bg-[#000000] text-white hover:bg-[#357A32] active:bg-[#2d6829]' 
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                {item.inStock ? 'Ajouter' : 'Rupture'}
                              </button>
                              
                              <button 
                                className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                                aria-label="Retirer des favoris"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 sm:py-16">
                      <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 font-serif italic">Votre liste de favoris est vide</p>
                    </div>
                  )}
                </div>
              )}

              {/* ═══════════════════════════════════════════════════
                  SECTION: SECURITY
              ═══════════════════════════════════════════════════ */}
              {activeTab === 'settings' && (
                <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-300">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif italic text-[#000000]">
                    Sécurité
                  </h2>
                  
                  {/* Carte Mot de passe */}
                  <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-4 sm:gap-5">
                      <div className="p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl text-[#357A32] shadow-sm border border-gray-100 flex-shrink-0">
                        <Lock size={20} className="sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <h4 className="font-serif italic text-base sm:text-lg text-[#000000]">
                          Mot de passe
                        </h4>
                        <p className="text-gray-500 text-xs sm:text-sm mt-0.5 sm:mt-1">
                          Dernière modification il y a 3 mois
                        </p>
                      </div>
                    </div>
                    
                    <button className="w-full sm:w-auto bg-[#000000] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold uppercase tracking-wider text-[10px] sm:text-[11px] shadow-lg hover:bg-[#357A32] transition-colors">
                      Réinitialiser
                    </button>
                  </div>
                  
                  {/* Carte Sessions */}
                  <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-amber-50/50 to-white rounded-xl sm:rounded-2xl border border-amber-100/50">
                    <div className="flex items-center gap-4 sm:gap-5 mb-4">
                      <div className="p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl text-amber-600 shadow-sm border border-amber-100 flex-shrink-0">
                        <Eye size={20} className="sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <h4 className="font-serif italic text-base sm:text-lg text-[#000000]">
                          Sessions actives
                        </h4>
                        <p className="text-gray-500 text-xs sm:text-sm mt-0.5 sm:mt-1">
                          1 appareil connecté
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-700">Cet appareil</span>
                      </div>
                      <span className="text-xs text-gray-400">Actif maintenant</span>
                    </div>
                  </div>
                  
                  {/* Bouton Danger Zone */}
                  <div className="pt-6 sm:pt-8 border-t border-gray-100">
                    <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider mb-4">
                      Zone de danger
                    </h3>
                    <button className="w-full sm:w-auto border-2 border-red-200 text-red-500 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold uppercase tracking-wider text-[10px] sm:text-[11px] hover:bg-red-50 transition-colors">
                      Supprimer mon compte
                    </button>
                  </div>
                </div>
              )}

            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   COMPOSANT INPUT RÉUTILISABLE
═══════════════════════════════════════════════════════════════════ */
interface ProfileInputProps {
  label: string;
  value: string;
  name?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const ProfileInput: React.FC<ProfileInputProps> = ({ 
  label, 
  value, 
  name, 
  disabled = false, 
  onChange,
  type = 'text'
}) => (
  <div className="space-y-1.5 sm:space-y-2">
    <label className="block text-sm sm:text-base font-medium text-gray-700 ml-1">
      {label}
    </label>
    <input 
      type={type} 
      name={name}
      disabled={disabled} 
      value={value} 
      onChange={onChange}
      className={`w-full p-3 sm:p-4 text-base border-2 transition-all duration-200 rounded-xl sm:rounded-2xl outline-none ${
        disabled 
          ? 'bg-gray-50 border-gray-100 text-gray-600 cursor-not-allowed' 
          : 'bg-white border-gray-200 text-[#000000] focus:border-[#357A32] focus:ring-4 focus:ring-[#357A32]/10 shadow-sm hover:border-gray-300'
      }`}
      style={{ fontSize: '16px' }} // Empêche le zoom sur iOS
    />
  </div>
);

export default Account;