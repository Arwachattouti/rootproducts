import React, { useState, useMemo } from 'react';
import { 
  Search, Eye, Download, Loader2, X 
} from 'lucide-react';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../../state/apiService';
import { Order } from '../../types';

const AdminOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  // RÉCUPÉRATION DES DONNÉES
  const { data: orders = [], isLoading } = useGetAllOrdersQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  // FILTRAGE DYNAMIQUE SÉCURISÉ
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const search = searchTerm.toLowerCase().trim();
      
      // Sécurité : MongoDB utilise souvent _id, mais l'interface peut dire id
      const rawId = (order as any)._id || (order as any).id || "";
      const orderId = String(rawId).toLowerCase();
      
      // Sécurité : Utilisateur peut être null
      const userName = order.user?.name ? String(order.user.name).toLowerCase() : '';
      const userEmail = order.user?.email ? String(order.user.email).toLowerCase() : '';

      const matchesSearch = 
        orderId.includes(search) || 
        userName.includes(search) || 
        userEmail.includes(search);

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateStatus({ id: orderId, status: newStatus }).unwrap();
      setShowModal(false);
    } catch (err) {
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  const exportOrders = () => {
    const csvContent = [
      ['ID', 'Client', 'Total', 'Statut', 'Date'].join(','),
      ...filteredOrders.map(o => {
        const oId = (o as any)._id || (o as any).id || "";
        return [
          oId, 
          o.user?.name || 'Inconnu', 
          o.total.toFixed(2), 
          o.status, 
          new Date(o.createdAt).toLocaleDateString()
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export-commandes-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-green-600 h-12 w-12" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">Gestion Commandes</h1>
            <p className="text-gray-500 font-medium">Flux logistique en temps réel</p>
          </div>
          <button 
            onClick={exportOrders} 
            className="flex items-center bg-black text-white px-6 py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95"
          >
            <Download className="h-4 w-4 mr-2" /> EXPORTER CSV
          </button>
        </div>

        {/* Filtres & Recherche */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 mb-8 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Rechercher un client ou un ID..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="bg-gray-50 border-none py-3 px-6 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-green-500 cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmé</option>
            <option value="shipped">En cours d'envoi</option>
            <option value="delivered">Livré</option>
            <option value="cancelled">Annulé</option>
          </select>
          <div className="text-[10px] font-black uppercase text-gray-400 ml-auto">
            {filteredOrders.length} Commandes trouvées
          </div>
        </div>

        {/* Tableau des commandes */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-black uppercase text-gray-400 tracking-widest">ID & Date</th>
                <th className="px-8 py-5 text-left text-xs font-black uppercase text-gray-400 tracking-widest">Client</th>
                <th className="px-8 py-5 text-left text-xs font-black uppercase text-gray-400 tracking-widest">Montant</th>
                <th className="px-8 py-5 text-left text-xs font-black uppercase text-gray-400 tracking-widest">Statut</th>
                <th className="px-8 py-5 text-right text-xs font-black uppercase text-gray-400 tracking-widest">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map((order) => {
                const orderUniqueId = (order as any)._id || (order as any).id;
                return (
                  <tr key={orderUniqueId} className="hover:bg-green-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="font-black text-sm text-gray-900">#{String(orderUniqueId).slice(-6).toUpperCase()}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {new Date(order.createdAt).toLocaleDateString('fr-TN')}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-sm text-gray-900">{order.user?.name || "Client Invité"}</p>
                      <p className="text-xs text-gray-400">{order.user?.email || "Pas d'email"}</p>
                    </td>
                    <td className="px-8 py-6 font-black text-gray-900">{order.total.toFixed(2)} DT</td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                        className="p-3 bg-gray-100 rounded-xl hover:bg-black hover:text-white transition-all transform hover:scale-110"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest">
              Aucune commande ne correspond à votre recherche
            </div>
          )}
        </div>
      </div>

      {/* Modal de Détails */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-black uppercase italic tracking-tighter">
                Commande #{( (selectedOrder as any)._id || (selectedOrder as any).id ).slice(-6).toUpperCase()}
              </h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={24}/>
              </button>
            </div>
            
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              {/* Infos Client / Adresse */}
              <div className="mb-8">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Logistique de livraison</p>
                <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                  <p className="font-bold text-gray-900">{selectedOrder.shippingAddress.address}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                  <p className="text-sm text-gray-500 uppercase font-bold mt-1 text-green-600">{selectedOrder.shippingAddress.country}</p>
                </div>
              </div>

              {/* Liste des articles */}
              <div className="mb-8">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Articles commandés</p>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center font-black text-xs">
                          x{item.quantity}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-900">{item.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold">{item.price.toFixed(2)} DT / unité</p>
                        </div>
                      </div>
                      <p className="font-black text-sm">{(item.price * item.quantity).toFixed(2)} DT</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mise à jour du statut */}
              <div>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Mettre à jour le statut</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      disabled={isUpdating}
                      onClick={() => handleStatusUpdate((selectedOrder as any)._id || (selectedOrder as any).id, status)}
                      className={`py-3 rounded-xl text-[9px] font-black uppercase transition-all shadow-sm ${
                        selectedOrder.status === status 
                          ? 'bg-black text-white' 
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      {isUpdating && selectedOrder.status === status ? '...' : status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;