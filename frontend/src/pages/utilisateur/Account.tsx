import React, { useState, useEffect } from 'react';
import { User as UserIcon, Package, Heart, Settings, LogOut, Edit, Eye, Loader2, MapPin, Phone, Mail } from 'lucide-react';
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
  const [updateMessage, setUpdateMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  // Hooks RTK Query
  const { data: user, isLoading: userLoading, refetch } = useGetProfileQuery();
  const { data: orders, isLoading: ordersLoading } = useGetUserOrdersQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [logout] = useLogoutMutation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: { street: '', city: '', postalCode: '', country: '' }
  });
 const wishlist = [
    {
      id: '1',
      name: 'Kit Cuisine Mloukhia',
      price: 34.90,
      image: 'https://images.pexels.com/photos/7937447/pexels-photo-7937447.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
      inStock: false
    },
    {
      id: '2',
      name: 'Mloukhia Fraîche Congelée',
      price: 12.90,
      image: 'https://images.pexels.com/photos/4198024/pexels-photo-4198024.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
      inStock: true
    }
  ];
  // Synchronisation des données
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

  // Gestion universelle des inputs (gère le niveau simple et l'objet address)
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
      setUpdateMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
      refetch(); // Actualise les données
      setTimeout(() => setUpdateMessage(null), 3000);
    } catch (err) {
      setUpdateMessage({ type: 'error', text: 'Erreur lors de la mise à jour.' });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (userLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#373E02] h-12 w-12" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {updateMessage && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-bold ${updateMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {updateMessage.text}
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-gray-900 italic">Mon Compte</h1>
            <p className="text-gray-500 mt-2">Bienvenue, {user?.firstName}. Gérez vos informations et vos commandes.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-[#373E02]/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#373E02]/10">
                  <UserIcon className="h-10 w-10 text-[#373E02]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{user?.firstName} {user?.lastName}</h3>
                <span className="text-xs font-bold text-[#373E02] bg-[#373E02]/10 px-3 py-1 rounded-full uppercase tracking-tighter">Membre Client</span>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'profile', label: 'Mon Profil', icon: UserIcon },
                  { id: 'orders', label: 'Commandes', icon: Package },
                  { id: 'wishlist', label: 'Favoris', icon: Heart },
                  { id: 'settings', label: 'Sécurité', icon: Settings }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-2xl transition-all ${
                      activeTab === tab.id ? 'bg-[#373E02] text-white shadow-lg' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="h-5 w-5 mr-3" /> {tab.label}
                  </button>
                ))}
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-colors">
                    <LogOut className="h-5 w-5 mr-3" /> Déconnexion
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden">
              
              {/* SECTION: PROFILE */}
              {activeTab === 'profile' && (
                <div className="p-8">
                  <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg"><UserIcon className="h-6 w-6 text-gray-600"/></div>
                      <h2 className="text-2xl font-serif font-bold text-gray-900">Informations Personnelles</h2>
                    </div>
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className="text-[#373E02] flex items-center gap-2 font-bold text-sm bg-[#373E02]/5 px-4 py-2 rounded-xl hover:bg-[#373E02]/10 transition-colors"
                    >
                      {isEditing ? 'Annuler' : <><Edit className="h-4 w-4"/> Modifier le profil</>}
                    </button>
                  </div>

                  <div className="space-y-8">
                    {/* Identité */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Prénom</label>
                        <input type="text" name="firstName" disabled={!isEditing} value={formData.firstName} onChange={handleInputChange}
                          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#373E02] focus:bg-white outline-none transition-all disabled:opacity-60 font-medium" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Nom</label>
                        <input type="text" name="lastName" disabled={!isEditing} value={formData.lastName} onChange={handleInputChange}
                          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#373E02] focus:bg-white outline-none transition-all disabled:opacity-60 font-medium" />
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email (Non modifiable)</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                          <input type="email" disabled value={formData.email}
                            className="w-full p-4 pl-12 bg-gray-100 border border-gray-200 rounded-2xl text-gray-500 font-medium" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Téléphone</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                          <input type="tel" name="phone" disabled={!isEditing} value={formData.phone} onChange={handleInputChange}
                            className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#373E02] focus:bg-white outline-none transition-all disabled:opacity-60 font-medium" />
                        </div>
                      </div>
                    </div>

                    {/* Adresse de livraison */}
                    <div className="pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-2 mb-6 text-gray-900">
                        <MapPin className="h-5 w-5 text-[#373E02]" />
                        <h3 className="font-bold text-lg">Adresse de livraison par défaut</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Rue et Numéro</label>
                          <input type="text" name="address.street" disabled={!isEditing} value={formData.address.street} onChange={handleInputChange}
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#373E02] focus:bg-white outline-none transition-all disabled:opacity-60 font-medium" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Ville</label>
                            <input type="text" name="address.city" disabled={!isEditing} value={formData.address.city} onChange={handleInputChange}
                              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#373E02] outline-none font-medium" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Code Postal</label>
                            <input type="text" name="address.postalCode" disabled={!isEditing} value={formData.address.postalCode} onChange={handleInputChange}
                              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#373E02] outline-none font-medium" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Pays</label>
                            <input type="text" name="address.country" disabled value={formData.address.country}
                              className="w-full p-4 bg-gray-100 border border-gray-200 rounded-2xl text-gray-500 font-medium" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-12 flex justify-end">
                      <button 
                        onClick={handleSave}
                        disabled={isUpdating}
                        className="bg-[#373E02] text-white px-10 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-[#373E02]/20 flex items-center gap-3 disabled:opacity-50"
                      >
                        {isUpdating ? <Loader2 className="animate-spin h-5 w-5"/> : 'Confirmer les modifications'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION: ORDERS */}
              {activeTab === 'orders' && (
                <div className="p-8">
                  <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8">Mes Commandes Récentes</h2>
                  {ordersLoading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#373E02] h-10 w-10"/></div>
                  ) : (
                    <div className="space-y-4">
                      {orders?.map((order: any) => (
                        <div key={order._id} className="group border border-gray-100 bg-gray-50/30 rounded-3xl p-6 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all">
                          <div className="flex flex-wrap justify-between items-start mb-6">
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Référence : {order._id.slice(-10)}</p>
                              <p className="text-sm font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString('fr-FR', { dateStyle: 'long' })}</p>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                            }`}>
                              {order.status || 'En attente'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="font-serif font-bold text-2xl text-[#373E02]">{order.totalPrice || order.total} <span className="text-sm font-sans">DT</span></p>
                            <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-[#373E02] transition-colors">
                              Détails de commande <Eye className="h-4 w-4"/>
                            </button>
                          </div>
                        </div>
                      ))}
                      {(!orders || orders.length === 0) && (
                        <div className="text-center py-20 text-gray-400">
                           <Package className="h-12 w-12 mx-auto mb-4 opacity-20"/>
                           <p className="font-medium">Vous n'avez pas encore passé de commande.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
               {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Ma Liste de Souhaits</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {wishlist.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex space-x-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                            <p className="text-lg font-bold text-green-700 mt-2">{item.price.toFixed(2)}€</p>
                            <div className="mt-3 flex space-x-2">
                              <button
                                disabled={!item.inStock}
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                  item.inStock
                                    ? 'bg-green-700 hover:bg-green-800 text-white'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                              >
                                {item.inStock ? 'Ajouter au panier' : 'Rupture de stock'}
                              </button>
                              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm">
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Paramètres du Compte</h2>
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
                      <div className="space-y-4">
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-3 text-green-600" />
                          <span>Recevoir les newsletters</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-3 text-green-600" />
                          <span>Notifications de commande</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-3 text-green-600" />
                          <span>Offres promotionnelles</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Sécurité</h3>
                      <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg">
                        Changer le mot de passe
                      </button>
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