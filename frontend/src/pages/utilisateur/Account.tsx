import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, Package, Heart, Settings, LogOut, 
  Edit, Eye, Loader2, MapPin, Phone, Mail, Lock, 
  ChevronDown, ShoppingBag, CheckCircle2 
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

  // Hooks RTK Query
  const { data: user, isLoading: userLoading, refetch } = useGetProfileQuery();
  const { data: orders, isLoading: ordersLoading } = useGetUserOrdersQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [logout] = useLogoutMutation();

  // État local pour le formulaire
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: { street: '', city: '', postalCode: '', country: 'Tunisie' }
  });

  // État local pour la wishlist (simulation de suppression)
  const [wishlist, setWishlist] = useState([
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
        [parent]: { ...prev[parent as keyof typeof prev] as any, [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData).unwrap();
      setIsEditing(false);
      setUpdateMessage({ type: 'success', text: 'Profil mis à jour avec élégance.' });
      refetch();
      setTimeout(() => setUpdateMessage(null), 3000);
    } catch (err) {
      setUpdateMessage({ type: 'error', text: 'Erreur lors de la mise à jour.' });
    }
  };

  const handleRemoveFavorite = (id: string) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
  };

  if (userLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#357A32] h-12 w-12 mb-4" />
      <p className="font-serif italic text-gray-400">Préparation de votre espace...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCFB] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-serif italic text-[#4B2E05]">Mon Compte</h1>
          <p className="text-gray-400 font-medium mt-3 uppercase tracking-[0.2em] text-[10px]">
            Bienvenue, {user?.firstName} • Membre Privilège Root
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* SIDEBAR NAVIGATION */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100 p-8 sticky top-24">
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-[#4B2E05]/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-50">
                  <UserIcon className="h-8 w-8 text-[#4B2E05]" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-serif italic text-[#4B2E05]">{user?.firstName} {user?.lastName}</h3>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'profile', label: 'Mon Profil', icon: UserIcon },
                  { id: 'orders', label: 'Commandes', icon: Package },
                  { id: 'wishlist', label: 'Mes Favoris', icon: Heart },
                  { id: 'settings', label: 'Sécurité', icon: Settings }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-5 py-4 text-[11px] font-bold uppercase tracking-widest rounded-2xl transition-all ${
                      activeTab === tab.id 
                        ? 'bg-[#4B2E05] text-white shadow-xl shadow-[#4B2E05]/20' 
                        : 'text-gray-400 hover:bg-gray-50 hover:text-[#4B2E05]'
                    }`}
                  >
                    <tab.icon className="h-4 w-4 mr-3" strokeWidth={2.5} /> {tab.label}
                  </button>
                ))}
                <div className="pt-4 mt-4 border-t border-gray-50">
                  <button onClick={async () => { await logout(); navigate('/login'); }} 
                    className="w-full flex items-center px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-50 rounded-2xl transition-colors">
                    <LogOut className="h-4 w-4 mr-3" strokeWidth={2.5} /> Déconnexion
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.04)] border border-gray-100 min-h-[600px] p-8 md:p-12">
              
              {/* STATUS MESSAGES */}
              {updateMessage && (
                <div className={`mb-8 p-4 rounded-xl text-sm font-bold border animate-in slide-in-from-top-2 ${
                  updateMessage.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
                }`}>
                  {updateMessage.text}
                </div>
              )}

              {/* SECTION: PROFILE */}
              {activeTab === 'profile' && (
                <div className="space-y-10 animate-in fade-in duration-500">
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-serif italic text-[#4B2E05]">Informations personnelles</h2>
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className="text-[#357A32] font-bold text-[10px] uppercase tracking-widest bg-[#357A32]/5 px-5 py-2.5 rounded-full hover:bg-[#357A32] hover:text-white transition-all"
                    >
                      {isEditing ? 'Annuler' : 'Modifier'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-300 ml-1">Prénom</label>
                      <input type="text" name="firstName" disabled={!isEditing} value={formData.firstName} onChange={handleInputChange}
                        className="w-full p-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#357A32]/20 outline-none transition-all font-serif italic text-[#4B2E05]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-300 ml-1">Nom</label>
                      <input type="text" name="lastName" disabled={!isEditing} value={formData.lastName} onChange={handleInputChange}
                        className="w-full p-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#357A32]/20 outline-none transition-all font-serif italic text-[#4B2E05]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-300 ml-1">Email</label>
                      <input type="email" disabled value={formData.email}
                        className="w-full p-4 bg-gray-100 border border-gray-100 rounded-2xl text-gray-400 font-serif italic" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-300 ml-1">Téléphone</label>
                      <input type="tel" name="phone" disabled={!isEditing} value={formData.phone} onChange={handleInputChange}
                        className="w-full p-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#357A32]/20 outline-none font-serif italic" />
                    </div>
                  </div>

                  <div className="pt-10 border-t border-gray-50">
                    <h3 className="font-serif italic text-xl text-[#4B2E05] mb-6 flex items-center gap-2">
                      <MapPin size={18} className="text-[#357A32]" /> Adresse de livraison
                    </h3>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-300 ml-1">Rue et Numéro</label>
                        <input type="text" name="address.street" disabled={!isEditing} value={formData.address.street} onChange={handleInputChange}
                          className="w-full p-4 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none font-serif italic text-[#4B2E05]" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <input type="text" placeholder="Ville" name="address.city" disabled={!isEditing} value={formData.address.city} onChange={handleInputChange}
                          className="w-full p-4 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none font-serif italic" />
                        <input type="text" placeholder="Code Postal" name="address.postalCode" disabled={!isEditing} value={formData.address.postalCode} onChange={handleInputChange}
                          className="w-full p-4 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none font-serif italic" />
                        <input type="text" disabled value={formData.address.country}
                          className="w-full p-4 bg-gray-100 border border-gray-100 rounded-2xl text-gray-400 font-serif italic" />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-10 flex justify-end">
                      <button onClick={handleSave} disabled={isUpdating}
                        className="bg-[#4B2E05] text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-[#357A32] transition-all flex items-center gap-3">
                        {isUpdating ? <Loader2 className="animate-spin h-4 w-4"/> : 'Confirmer les changements'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION: ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <h2 className="text-3xl font-serif italic text-[#4B2E05]">Historique des commandes</h2>
                  {ordersLoading ? (
                    <Loader2 className="animate-spin text-[#357A32] mx-auto h-8 w-8" />
                  ) : (
                    <div className="space-y-6">
                      {orders?.map((order: any) => (
                        <div key={order._id} className="border border-gray-50 rounded-[2rem] overflow-hidden transition-all hover:border-gray-100">
                          <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-5">
                              <div className="h-14 w-14 bg-[#357A32]/5 rounded-2xl flex items-center justify-center text-[#357A32]">
                                <Package size={22} />
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">#{order._id.slice(-8).toUpperCase()}</p>
                                <p className="font-serif italic text-[#4B2E05]">{new Date(order.createdAt).toLocaleDateString('fr-FR', { dateStyle: 'long' })}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-8">
                              <div className="text-right">
                                <p className="text-xl font-serif italic text-[#4B2E05]">{(order.totalPrice || order.total).toFixed(3)} DT</p>
                                <span className={`text-[9px] font-bold uppercase tracking-tighter ${order.status === 'delivered' ? 'text-[#357A32]' : 'text-orange-400'}`}>
                                  {order.status === 'delivered' ? '✓ Livré' : '• En préparation'}
                                </span>
                              </div>
                              <button 
                                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                className={`h-10 w-10 rounded-full border flex items-center justify-center transition-all ${expandedOrder === order._id ? 'bg-[#4B2E05] text-white border-[#4B2E05]' : 'text-gray-300 border-gray-100 hover:border-gray-300'}`}
                              >
                                <ChevronDown size={18} className={expandedOrder === order._id ? 'rotate-180 transition-transform' : 'transition-transform'} />
                              </button>
                            </div>
                          </div>

                          {expandedOrder === order._id && (
                            <div className="bg-gray-50/50 p-8 border-t border-gray-50 animate-in slide-in-from-top-2 duration-300">
                              <div className="space-y-4">
                                {order.orderItems?.map((item: any, idx: number) => (
                                  <div key={idx} className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100">
                                    <span className="font-serif italic text-[#4B2E05] text-sm">{item.name} <small className="font-sans font-bold text-gray-300 ml-2">x{item.qty}</small></span>
                                    <span className="text-sm font-bold text-[#357A32]">{(item.price * item.qty).toFixed(3)} DT</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      {(!orders || orders.length === 0) && (
                        <div className="text-center py-20 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
                          <ShoppingBag className="h-10 w-10 mx-auto mb-4 text-gray-200" />
                          <p className="font-serif italic text-gray-400">Aucune commande pour le moment.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* SECTION: WISHLIST */}
              {activeTab === 'wishlist' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <h2 className="text-3xl font-serif italic text-[#4B2E05]">Ma Sélection</h2>
                  {wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {wishlist.map((item) => (
                        <div key={item.id} className="bg-white border border-gray-50 rounded-[2.5rem] p-5 flex gap-5 hover:shadow-xl hover:shadow-gray-200/30 transition-all relative group">
                          <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-2xl shrink-0" />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="font-serif italic text-base text-[#4B2E05] leading-tight">{item.name}</h3>
                              <p className="text-[#357A32] font-bold text-xs mt-1">{item.price.toFixed(3)} DT</p>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <button disabled={!item.inStock} className="flex-1 text-[9px] font-bold uppercase tracking-widest bg-[#4B2E05] text-white py-2.5 rounded-lg hover:bg-[#357A32] transition-colors disabled:bg-gray-100 disabled:text-gray-400">
                                {item.inStock ? 'Ajouter' : 'Rupture'}
                              </button>
                              <button onClick={() => handleRemoveFavorite(item.id)} className="px-3 text-red-200 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                <Heart size={16} fill="currentColor" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
                      <Heart className="h-10 w-10 mx-auto mb-4 text-gray-200" />
                      <p className="font-serif italic text-gray-400">Vos favoris apparaîtront ici.</p>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION: SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-10 animate-in fade-in duration-500">
                  <h2 className="text-3xl font-serif italic text-[#4B2E05]">Sécurité & Préférences</h2>
                  <div className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-white rounded-2xl text-[#357A32] shadow-sm"><Lock size={24} /></div>
                      <div>
                        <h4 className="font-serif italic text-lg text-[#4B2E05]">Mot de passe</h4>
                        <p className="text-gray-400 text-xs mt-1">Protégez l'accès à votre compte</p>
                      </div>
                    </div>
                    <button className="bg-[#4B2E05] text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-[9px] hover:bg-black transition-all shadow-lg shadow-[#4B2E05]/10">
                      Réinitialiser
                    </button>
                  </div>

                  <div className="pt-6">
                    <h3 className="font-serif italic text-xl text-[#4B2E05] mb-6 flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-[#357A32]" /> Notifications
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['Newsletters hebdomadaires', 'Suivi de commande SMS', 'Offres exclusives'].map((notif, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-white border border-gray-50 rounded-2xl">
                          <input type="checkbox" defaultChecked className="accent-[#357A32] h-4 w-4" />
                          <span className="text-sm font-serif italic text-gray-500">{notif}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;