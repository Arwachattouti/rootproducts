import React, { useState, useEffect } from 'react';
import {
  User as UserIcon, Package, Heart, Settings, LogOut,
  MapPin, Lock, ChevronDown, CheckCircle2, Loader2, X, Eye, ShoppingCart, AlertTriangle
} from 'lucide-react';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetUserOrdersQuery,
  useLogoutMutation,
  useUpdateCartMutation
} from '../../state/apiService';
import { useNavigate } from 'react-router-dom';

// ════════ INTERFACES TYPESCRIPT (Synchronisées avec le Backend) ════════
interface OrderItem {
  product: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  _id: string;
  createdAt: string;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  shippingAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

const Account: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [showPwdForm, setShowPwdForm] = useState(false);
  const [pwdData, setPwdData] = useState({ current: '', new: '', confirm: '' });

  // Appels API
  const { data: user, isLoading: userLoading, refetch } = useGetProfileQuery();
  const { data: rawOrders, isLoading: ordersLoading } = useGetUserOrdersQuery();

  // Traitement sécurisé des commandes
  const ordersList: Order[] = Array.isArray(rawOrders) 
    ? rawOrders 
    : (rawOrders && typeof rawOrders === 'object' && 'orders' in rawOrders ? (rawOrders as any).orders : []);
  
  // ════════ BLOC DE DEBUG ════════
  useEffect(() => {
    console.log("🚀 === DEBUG : MON ESPACE === 🚀");
    console.log("👤 Utilisateur connecté :", user);
    console.log("🔑 ID Utilisateur :", user?._id || user?.id);
    console.log("📦 Données brutes de l'API (rawOrders) :", rawOrders);
    console.log("✅ Liste des commandes traitée (ordersList) :", ordersList);
    console.log("----------------------------------");
  }, [user, rawOrders, ordersList]);
  // ════════════════════════════════

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [updateCart, { isLoading: isAddingToCart }] = useUpdateCartMutation();
  const [logout] = useLogoutMutation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: { street: '', city: '', postalCode: '', country: 'Tunisie' }
  });

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

  const showToast = (type: 'success' | 'error', text: string) => {
    setUpdateMessage({ type, text });
    setTimeout(() => setUpdateMessage(null), 4000);
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData).unwrap();
      setIsEditing(false);
      showToast('success', 'Profil mis à jour avec succès.');
      refetch();
    } catch (error: any) {
      showToast('error', error?.data?.message || 'Erreur lors de la mise à jour.');
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdData.new !== pwdData.confirm) {
      return showToast('error', 'Les nouveaux mots de passe ne correspondent pas.');
    }
    try {
      showToast('success', 'Mot de passe mis à jour !');
      setShowPwdForm(false);
      setPwdData({ current: '', new: '', confirm: '' });
    } catch (error: any) {
      showToast('error', error?.data?.message || 'Erreur lors du changement.');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.")) {
      handleLogout();
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // ── Helpers pour les statuts de commande ──
  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'En attente',
      confirmed: 'Confirmé',
      shipped: 'Expédié',
      delivered: 'Livré',
      cancelled: 'Annulé',
    };
    return labels[status] || status;
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
    { id: 'settings', label: 'Sécurité', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-16 sm:pb-20">

      {/* ════════ HEADER ════════ */}
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

      {/* ════════ NAV MOBILE ════════ */}
      <nav className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 lg:hidden">
        <div className="flex overflow-x-auto px-3 sm:px-4 py-3 sm:py-4 gap-2 sm:gap-3 no-scrollbar">
          <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest transition-all duration-200 ${activeTab === tab.id
                ? 'bg-[#4B2E05] text-white shadow-lg shadow-[#4B2E05]/20'
                : 'bg-gray-50 text-gray-600 border border-gray-200 active:bg-gray-100'
                }`}
            >
              <tab.icon size={14} strokeWidth={2.5} className="flex-shrink-0" />
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
          <button onClick={handleLogout} className="flex-shrink-0 flex items-center gap-1.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-red-50 text-red-500 border border-red-200 active:bg-red-100">
            <LogOut size={14} strokeWidth={2.5} />
            <span className="hidden xs:inline">Quitter</span>
          </button>
        </div>
      </nav>

      {/* ════════ MAIN CONTENT ════════ */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-6 sm:mt-8 lg:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-10 xl:gap-12">

          {/* ════════ SIDEBAR DESKTOP ════════ */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 xl:p-8 sticky top-8">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-5 py-3.5 text-[11px] font-black uppercase tracking-[0.12em] rounded-xl transition-all duration-200 ${activeTab === tab.id
                      ? 'bg-[#4B2E05] text-white shadow-lg shadow-[#4B2E05]/15'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-[#000000]'
                      }`}
                  >
                    <tab.icon className="h-4 w-4 mr-3 flex-shrink-0" strokeWidth={2.5} />
                    {tab.label}
                  </button>
                ))}
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <button onClick={handleLogout} className="w-full flex items-center px-5 py-3.5 text-[11px] font-black uppercase tracking-[0.12em] text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                    <LogOut className="h-4 w-4 mr-3 flex-shrink-0" strokeWidth={2.5} />
                    Quitter
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          <main className="lg:col-span-3">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 min-h-[400px] sm:min-h-[500px]">

              {/* Toast Notification */}
              {updateMessage && (
                <div className={`mb-6 sm:mb-8 p-4 sm:p-5 rounded-xl sm:rounded-2xl text-sm font-semibold border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${updateMessage.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                  {updateMessage.type === 'success' ? <CheckCircle2 size={18} className="flex-shrink-0" /> : <AlertTriangle size={18} className="flex-shrink-0" />}
                  <span className="flex-1">{updateMessage.text}</span>
                  <button onClick={() => setUpdateMessage(null)} className="p-1"><X size={16} /></button>
                </div>
              )}

              {/* ════════ TAB: PROFILE ════════ */}
              {activeTab === 'profile' && (
                <div className="space-y-8 sm:space-y-10 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif italic text-[#000000]">Mon Profil</h2>
                    <button onClick={() => setIsEditing(!isEditing)} className={`w-full sm:w-auto font-bold text-[11px] uppercase tracking-wider px-6 sm:px-8 py-3 rounded-full transition-all duration-200 border-2 ${isEditing ? 'border-red-300 text-red-500 bg-red-50 hover:bg-red-100' : 'bg-[#357A32] text-white border-[#357A32] hover:bg-[#2d6829]'}`}>
                      {isEditing ? 'Annuler' : 'Modifier'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <ProfileInput label="Prénom" name="firstName" value={formData.firstName} disabled={!isEditing} onChange={handleInputChange} />
                    <ProfileInput label="Nom" name="lastName" value={formData.lastName} disabled={!isEditing} onChange={handleInputChange} />
                    <ProfileInput label="Email" name="email" value={formData.email} disabled={true} type="email" />
                    <ProfileInput label="Téléphone" name="phone" value={formData.phone} disabled={!isEditing} onChange={handleInputChange} type="tel" />
                  </div>

                  <div className="pt-8 sm:pt-10 border-t border-gray-100">
                    <h3 className="font-serif italic text-lg sm:text-xl text-[#000000] mb-6 sm:mb-8 flex items-center gap-3">
                      <span className="p-2 bg-green-50 rounded-xl"><MapPin size={18} className="text-[#357A32]" /></span>
                      Adresse de livraison
                    </h3>
                    <div className="space-y-4 sm:space-y-6">
                      <ProfileInput label="Rue et Numéro" name="address.street" value={formData.address.street} disabled={!isEditing} onChange={handleInputChange} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <ProfileInput label="Ville" name="address.city" value={formData.address.city} disabled={!isEditing} onChange={handleInputChange} />
                        <ProfileInput label="Code Postal" name="address.postalCode" value={formData.address.postalCode} disabled={!isEditing} onChange={handleInputChange} />
                        <div className="sm:col-span-2 lg:col-span-1"><ProfileInput label="Pays" name="address.country" value={formData.address.country} disabled={true} /></div>
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="pt-4 sm:pt-6">
                      <button onClick={handleSave} disabled={isUpdating} className="w-full sm:w-auto bg-[#000000] text-white px-8 sm:px-12 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#357A32] transition-all duration-300 flex items-center justify-center gap-3 shadow-lg disabled:opacity-50">
                        {isUpdating ? <><Loader2 className="animate-spin h-5 w-5" /><span>Enregistrement...</span></> : 'Sauvegarder'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ════════ TAB: ORDERS ════════ */}
              {activeTab === 'orders' && (
                <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif italic text-[#000000]">
                    Historique des commandes
                  </h2>

                  {ordersLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="animate-spin text-[#357A32] h-8 w-8 sm:h-10 sm:w-10" />
                    </div>
                  ) : ordersList.length > 0 ? (
                    <div className="space-y-4">
                      {ordersList.map((order) => (
                        <div
                          key={order._id}
                          className={`border rounded-2xl overflow-hidden transition-all duration-300 ${expandedOrder === order._id
                              ? 'border-[#357A32] shadow-md bg-white'
                              : 'border-gray-100 bg-gray-50/50 hover:border-gray-300'
                            }`}
                        >
                          <div
                            className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer"
                            onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                          >
                            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                              <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${expandedOrder === order._id ? 'bg-[#357A32] text-white' : 'bg-white text-[#4B2E05] shadow-sm border border-gray-100'}`}>
                                <Package size={18} className="sm:w-5 sm:h-5" />
                              </div>
                              <div className="flex-1">
                                <p className="text-[10px] sm:text-[11px] font-black text-gray-500 uppercase tracking-widest">
                                  CMD-{String(order._id || '').slice(-6).toUpperCase()}
                                </p>
                                <p className="font-serif italic text-[#000000] text-sm sm:text-base font-bold">
                                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  }) : 'Date inconnue'}
                                </p>
                              </div>
                            </div>

                            <div className="flex w-full sm:w-auto justify-between sm:justify-end items-center gap-4 sm:gap-6 border-t sm:border-0 border-gray-100 pt-3 sm:pt-0 mt-2 sm:mt-0">
                              <div className="text-left sm:text-right flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1">
                                <p className="text-base sm:text-lg font-black text-[#000000]">
                                  {order.total?.toFixed(2)} DT
                                </p>
                                <span className={`px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider border whitespace-nowrap ${getStatusStyle(order.status)}`}>
                                  {getStatusLabel(order.status)}
                                </span>
                              </div>

                              <button
                                className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${expandedOrder === order._id
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-50'
                                  }`}
                                aria-label={expandedOrder === order._id ? 'Masquer détails' : 'Voir détails'}
                              >
                                <ChevronDown size={18} className={`transition-transform duration-300 ${expandedOrder === order._id ? 'rotate-180' : ''}`} />
                              </button>
                            </div>
                          </div>

                          <div
                            className={`grid transition-all duration-300 ease-in-out ${expandedOrder === order._id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                          >
                            <div className="overflow-hidden">
                              <div className="p-4 sm:p-6 bg-white border-t border-gray-100 flex flex-col lg:flex-row gap-6 lg:gap-10">

                                <div className="flex-1">
                                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">
                                    Articles commandés
                                  </p>
                                  <div className="space-y-3">
                                    {order.items?.map((item, idx) => (
                                      <div key={idx} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-100 gap-3">
                                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                          <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white rounded-lg flex items-center justify-center font-black text-[11px] sm:text-xs text-[#357A32] shadow-sm flex-shrink-0">
                                            x{item.quantity}
                                          </div>
                                          <div className="min-w-0">
                                            <p className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                                              {item.name}
                                            </p>
                                            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                                              {item.price?.toFixed(2)} DT / unité
                                            </p>
                                          </div>
                                        </div>
                                        <p className="font-black text-sm text-[#000000] whitespace-nowrap flex-shrink-0">
                                          {(item.price * item.quantity)?.toFixed(2)} DT
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="lg:w-72 xl:w-80 flex flex-col gap-5">
                                  {order.shippingAddress && (
                                    <div className="p-4 sm:p-5 bg-[#FDFCFB] rounded-xl border border-gray-100">
                                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">
                                        Adresse de livraison
                                      </p>
                                      <p className="font-bold text-sm text-gray-900 leading-snug">
                                        {order.shippingAddress.street}
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        {order.shippingAddress.postalCode} {order.shippingAddress.city}
                                      </p>
                                      <p className="text-[10px] font-bold text-[#357A32] uppercase mt-2">
                                        {order.shippingAddress.country}
                                      </p>
                                    </div>
                                  )}

                                  <div className="p-4 sm:p-5 bg-gray-900 rounded-xl flex justify-between items-center text-white">
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Total Net</span>
                                    <span className="text-lg sm:text-xl font-black">{order.total?.toFixed(2)} DT</span>
                                  </div>
                                </div>

                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 px-4 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                      <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-4">
                        <Package size={32} className="text-gray-300" />
                      </div>
                      <h3 className="text-lg font-serif italic text-gray-900 mb-2">Aucune commande</h3>
                      <p className="text-sm text-gray-500">Vous n'avez pas encore passé de commande sur notre boutique.</p>
                      <button onClick={() => navigate('/products')} className="mt-6 px-6 py-3 bg-[#357A32] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#2d6829] transition-colors">
                        Découvrir nos produits
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ════════ TAB: SECURITY ════════ */}
              {activeTab === 'settings' && (
                <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-300">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif italic text-[#000000]">Sécurité</h2>

                  <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl border border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
                      <div className="flex items-center gap-4 sm:gap-5">
                        <div className="p-3 bg-white rounded-xl text-[#357A32] shadow-sm border"><Lock size={20} /></div>
                        <div>
                          <h4 className="font-serif italic text-base sm:text-lg text-[#000000]">Mot de passe</h4>
                          <p className="text-gray-500 text-xs sm:text-sm">Protégez l'accès à votre compte</p>
                        </div>
                      </div>
                      <button onClick={() => setShowPwdForm(!showPwdForm)} className="w-full sm:w-auto bg-[#000000] text-white px-6 py-3 rounded-xl font-bold uppercase text-[10px] hover:bg-[#357A32] transition-colors">
                        {showPwdForm ? 'Annuler' : 'Modifier'}
                      </button>
                    </div>

                    {showPwdForm && (
                      <form onSubmit={handlePasswordUpdate} className="mt-6 pt-6 border-t border-gray-100 space-y-4 animate-in slide-in-from-top-2">
                        <ProfileInput label="Mot de passe actuel" type="password" value={pwdData.current} onChange={(e) => setPwdData({ ...pwdData, current: e.target.value })} />
                        <ProfileInput label="Nouveau mot de passe" type="password" value={pwdData.new} onChange={(e) => setPwdData({ ...pwdData, new: e.target.value })} />
                        <ProfileInput label="Confirmer le nouveau mot de passe" type="password" value={pwdData.confirm} onChange={(e) => setPwdData({ ...pwdData, confirm: e.target.value })} />
                        <button type="submit" disabled={!pwdData.current || !pwdData.new || !pwdData.confirm} className="w-full bg-[#357A32] text-white py-4 rounded-xl font-bold uppercase text-xs mt-4 disabled:opacity-50">
                          Mettre à jour le mot de passe
                        </button>
                      </form>
                    )}
                  </div>

                  <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-amber-50/50 to-white rounded-xl border border-amber-100/50">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-white rounded-xl text-amber-600 shadow-sm border"><Eye size={20} /></div>
                      <div>
                        <h4 className="font-serif italic text-base sm:text-lg">Sessions actives</h4>
                        <p className="text-gray-500 text-xs sm:text-sm">1 appareil connecté</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-3 border flex justify-between items-center">
                      <div className="flex items-center gap-3"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div><span className="text-sm text-gray-700">Cet appareil</span></div>
                      <span className="text-xs text-gray-400">Actif maintenant</span>
                    </div>
                  </div>

                  <div className="pt-6 sm:pt-8 border-t border-gray-100">
                    <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider mb-4">Zone de danger</h3>
                    <button onClick={handleDeleteAccount} className="w-full sm:w-auto border-2 border-red-200 text-red-500 px-6 py-3 rounded-xl font-bold uppercase text-[10px] hover:bg-red-50 transition-colors">
                      Supprimer mon compte définitivement
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

/* ════════ INPUT COMPONENT ════════ */
interface ProfileInputProps {
  label: string; value: string; name?: string; disabled?: boolean; type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const ProfileInput: React.FC<ProfileInputProps> = ({ label, value, name, disabled = false, onChange, type = 'text' }) => (
  <div className="space-y-1.5 sm:space-y-2">
    <label className="block text-sm sm:text-base font-medium text-gray-700 ml-1">{label}</label>
    <input type={type} name={name} disabled={disabled} value={value} onChange={onChange} style={{ fontSize: '16px' }}
      className={`w-full p-3 sm:p-4 border-2 transition-all duration-200 rounded-xl outline-none ${disabled ? 'bg-gray-50 border-gray-100 text-gray-600 cursor-not-allowed' : 'bg-white border-gray-200 text-[#000000] focus:border-[#357A32] focus:ring-4 focus:ring-[#357A32]/10 shadow-sm hover:border-gray-300'}`}
    />
  </div>
);

export default Account;