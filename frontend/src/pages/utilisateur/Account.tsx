import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, Package, Heart, Settings, LogOut, 
  MapPin, Phone, Mail, Lock, 
  ChevronDown, ShoppingBag, CheckCircle2, Loader2, ChevronRight
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

  if (userLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#357A32] h-12 w-12 mb-4" />
      <p className="font-serif italic text-gray-500">Ouverture de votre coffre privé...</p>
    </div>
  );

  const tabs = [
    { id: 'profile', label: 'Profil', icon: UserIcon },
    { id: 'orders', label: 'Commandes', icon: Package },
    { id: 'wishlist', label: 'Favoris', icon: Heart },
    { id: 'settings', label: 'Sécurité', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-20">
      {/* HEADER - Mobile First */}
      <div className="bg-white border-b border-gray-100 pt-16 pb-8 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-serif italic text-[#000000]">Mon Espace</h1>
          <p className="text-[#357A32]  mt-3  tracking-[0.2em] text-lg sm:text-lg">
            Bienvenue, {user?.firstName} 
         
          </p>
        </div>
      </div>

      {/* NAVIGATION MOBILE (Horizontal Scroll) */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 lg:hidden">
        <div className="flex overflow-x-auto no-scrollbar px-4 py-4 gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                  ? 'bg-[#4B2E05] text-white shadow-lg' 
                  : 'bg-gray-50 text-gray-500 border border-gray-100'
              }`}
            >
              <tab.icon size={14} strokeWidth={2.5} />
              {tab.label}
            </button>
          ))}
          <button 
            onClick={async () => { await logout(); navigate('/login'); }}
            className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest bg-red-50 text-red-500 border border-red-100"
          >
            <LogOut size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-8 sm:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* SIDEBAR DESKTOP (Hidden on Mobile) */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 sticky top-32">
              <nav className="space-y-3">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-6 py-4 text-xs font-black uppercase tracking-[0.15em] rounded-2xl transition-all ${
                      activeTab === tab.id 
                        ? 'bg-[#4B2E05] text-white shadow-xl shadow-[#4B2E05]/10' 
                        : 'text-gray-800 hover:bg-gray-50 hover:text-[#000000]'
                    }`}
                  >
                    <tab.icon className="h-4 w-4 mr-4" strokeWidth={2.5} /> {tab.label}
                  </button>
                ))}
                <div className="pt-4 mt-4 border-t border-gray-50">
                  <button onClick={async () => { await logout(); navigate('/login'); }} 
                    className="w-full flex items-center px-6 py-4 text-xs font-black uppercase tracking-[0.15em] text-red-500 hover:bg-red-50 rounded-2xl transition-colors">
                    <LogOut className="h-4 w-4 mr-4" strokeWidth={2.5} /> Quitter
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-[2rem] sm:rounded-[3rem] shadow-sm border border-gray-100 p-6 sm:p-12 min-h-[500px]">
              
              {updateMessage && (
                <div className={`mb-8 p-5 rounded-2xl text-sm font-bold border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
                  updateMessage.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
                }`}>
                  <CheckCircle2 size={18} /> {updateMessage.text}
                </div>
              )}

              {/* SECTION: PROFILE */}
              {activeTab === 'profile' && (
                <div className="space-y-10 animate-in fade-in duration-500">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-2xl sm:text-3xl font-serif italic text-[#000000]">Mon Profil</h2>
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className={`w-full sm:w-auto font-black text-[10px] uppercase tracking-widest px-8 py-3 rounded-full transition-all border ${
                        isEditing ? 'border-red-200 text-red-500' : 'bg-[#357A32] text-white'
                      }`}
                    >
                      {isEditing ? 'Annuler l\'édition' : 'Modifier le profil'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    <ProfileInput label="Prénom" name="firstName" value={formData.firstName} disabled={!isEditing} onChange={handleInputChange} />
                    <ProfileInput label="Nom" name="lastName" value={formData.lastName} disabled={!isEditing} onChange={handleInputChange} />
                    <ProfileInput label="Email" name="email" value={formData.email} disabled={true} />
                    <ProfileInput label="Téléphone" name="phone" value={formData.phone} disabled={!isEditing} onChange={handleInputChange} />
                  </div>

                  <div className="pt-10 border-t border-gray-100">
                    <h3 className="font-serif italic text-xl text-[#000000] mb-8 flex items-center gap-3">
                      <MapPin size={20} className="text-[#357A32]" /> Adresse de livraison
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                      <ProfileInput label="Rue et Numéro" name="address.street" value={formData.address.street} disabled={!isEditing} onChange={handleInputChange} />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <ProfileInput label="Ville" name="address.city" value={formData.address.city} disabled={!isEditing} onChange={handleInputChange} />
                        <ProfileInput label="Code Postal" name="address.postalCode" value={formData.address.postalCode} disabled={!isEditing} onChange={handleInputChange} />
                        <ProfileInput label="Pays" name="address.country" value={formData.address.country} disabled={true} />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="pt-6">
                      <button onClick={handleSave} disabled={isUpdating}
                        className="w-full sm:w-auto bg-[#000000] text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-[#357A32] transition-all flex items-center justify-center gap-3 shadow-xl">
                        {isUpdating ? <Loader2 className="animate-spin h-5 w-5"/> : 'Sauvegarder les changements'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION: ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <h2 className="text-2xl sm:text-3xl font-serif italic text-[#000000]">Historique</h2>
                  {ordersLoading ? (
                    <Loader2 className="animate-spin text-[#357A32] mx-auto h-10 w-10" />
                  ) : (
                    <div className="space-y-4">
                      {orders?.map((order: any) => (
                        <div key={order._id} className="border border-gray-100 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden bg-gray-50/30">
                          <div className="p-5 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-[#4B2E05] shadow-sm border border-gray-100">
                                <Package size={20} />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CMD-{order._id.slice(-6).toUpperCase()}</p>
                                <p className="font-serif italic text-[#000000] text-lg">{new Date(order.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex w-full sm:w-auto justify-between sm:justify-end items-center gap-6">
                              <div className="text-left sm:text-right">
                                <p className="text-xl font-black text-[#000000]">{order.totalPrice.toFixed(3)} DT</p>
                                <span className="text-[10px] font-black uppercase text-[#357A32] tracking-tighter bg-green-50 px-2 py-0.5 rounded">
                                  {order.status === 'delivered' ? 'Livré' : 'En cours'}
                                </span>
                              </div>
                              <button 
                                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                className={`h-10 w-10 rounded-full border flex items-center justify-center transition-all ${expandedOrder === order._id ? 'bg-[#000000] text-white' : 'bg-white text-gray-400'}`}
                              >
                                <ChevronDown size={18} className={expandedOrder === order._id ? 'rotate-180' : ''} />
                              </button>
                            </div>
                          </div>
                          {expandedOrder === order._id && (
                            <div className="px-5 pb-5 sm:px-8 sm:pb-8 animate-in slide-in-from-top-2">
                              <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
                                {order.orderItems?.map((item: any, idx: number) => (
                                  <div key={idx} className="flex justify-between text-sm">
                                    <span className="text-gray-700 italic font-serif">{item.name} <b className="font-sans text-xs ml-2 text-[#357A32]">x{item.qty}</b></span>
                                    <span className="font-black">{(item.price * item.qty).toFixed(3)} DT</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SECTION: WISHLIST (Optimisée Mobile) */}
              {activeTab === 'wishlist' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <h2 className="text-2xl sm:text-3xl font-serif italic text-[#000000]">Ma Sélection</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {wishlist.map((item) => (
                      <div key={item.id} className="bg-white border border-gray-100 rounded-[2rem] p-4 flex items-center gap-4 sm:gap-6 shadow-sm">
                        <img src={item.image} alt={item.name} className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-2xl" />
                        <div className="flex-1">
                          <h3 className="font-serif italic text-lg text-[#000000] leading-tight">{item.name}</h3>
                          <p className="text-[#357A32] font-black text-sm mt-1">{item.price.toFixed(3)} DT</p>
                          <div className="flex gap-2 mt-3">
                            <button disabled={!item.inStock} className="flex-1 bg-[#000000] text-white text-[10px] font-black uppercase py-2.5 rounded-xl hover:bg-[#357A32] transition-colors disabled:bg-gray-100 disabled:text-gray-300">
                              {item.inStock ? 'Ajouter' : 'Rupture'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION: SECURITY */}
              {activeTab === 'settings' && (
                <div className="space-y-10 animate-in fade-in duration-500">
                  <h2 className="text-2xl sm:text-3xl font-serif italic text-[#000000]">Sécurité</h2>
                  <div className="p-6 sm:p-8 bg-[#FDFCF9] rounded-[2rem] border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-5 text-center sm:text-left">
                      <div className="p-4 bg-white rounded-2xl text-[#357A32] shadow-sm"><Lock size={24} /></div>
                      <div>
                        <h4 className="font-serif italic text-lg text-[#000000]">Mot de passe</h4>
                        <p className="text-gray-500 text-xs mt-1">Dernière modification il y a 3 mois</p>
                      </div>
                    </div>
                    <button className="w-full sm:w-auto bg-[#000000] text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg">
                      Réinitialiser
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

// COMPOSANT INPUT REUTILISABLE (Texte Base 16px pour Mobile)
const ProfileInput = ({ label, value, name, disabled, onChange }: any) => (
  <div className="space-y-2.5">
    <label className="text-base  ml-1">{label}</label>
    <input 
      type="text" 
      name={name}
      disabled={disabled} 
      value={value} 
      onChange={onChange}
      className={`w-full p-4 text-base sm:text-lg border transition-all rounded-2xl outline-none italic ${
        disabled 
          ? 'bg-gray-50 border-gray-50 text-gray-800 cursor-not-allowed' 
          : 'bg-white border-gray-800 text-[#000000] focus:border-[#357A32] focus:ring-4 focus:ring-[#357A32]/5 shadow-sm'
      }`} 
    />
  </div>
);

export default Account;