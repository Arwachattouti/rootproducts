import React, { useState, useMemo } from 'react';
import {
  Search, Eye, Download, Loader2, X
} from 'lucide-react';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../../state/apiService';

// On utilise une interface locale adaptée à ce que le backend renvoie exactement
interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  id?: string;
  createdAt: string;
  total: number;
  status: string;
  items: OrderItem[];
  user?: {
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  shippingAddress: {
    street: string; // <-- Modifié : street au lieu de address
    city: string;
    postalCode: string;
    country: string;
  };
}

const AdminOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { data: orders = [], isLoading } = useGetAllOrdersQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  // FILTRAGE
  const filteredOrders = useMemo(() => {
    return (orders as Order[] ).filter((order ) => {
      const search = searchTerm.toLowerCase().trim();
      const rawId = order._id || order.id || '';
      const orderId = String(rawId).toLowerCase();
      
      const userName = order.user?.name || order.user?.firstName || '';
      const userNameLower = String(userName).toLowerCase();
      
      const userEmail = order.user?.email ? String(order.user.email).toLowerCase() : '';
      
      const matchesSearch =
        orderId.includes(search) || userNameLower.includes(search) || userEmail.includes(search);
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

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateStatus({ id: orderId, status: newStatus }).unwrap();
      // On met aussi à jour l'ordre sélectionné dans le modal pour voir le changement en direct
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (err) {
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const exportOrders = () => {
    const csvContent = [
      ['ID', 'Client', 'Total', 'Statut', 'Date'].join(','),
      ...filteredOrders.map((o) => {
        const oId = o._id || o.id || '';
        const clientName = o.user?.name || o.user?.firstName || 'Client Inconnu';
        return [
          oId,
          clientName,
          o.total?.toFixed(2) || '0.00',
          o.status,
          new Date(o.createdAt).toLocaleDateString(),
        ].join(',');
      }),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export-commandes-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <Loader2 className="animate-spin text-green-600 h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12" />
        <p className="text-gray-500 mt-3 text-sm font-medium">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10 sm:pb-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8">

        {/* ════════ Header ════════ */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 uppercase italic tracking-tighter">
              Gestion Commandes
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
              Flux logistique en temps réel
            </p>
          </div>
          <button
            onClick={exportOrders}
            className="flex items-center self-start sm:self-auto bg-black text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm hover:bg-gray-800 transition-all shadow-lg active:scale-95"
          >
            <Download className="h-4 w-4 mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">EXPORTER CSV</span>
            <span className="sm:hidden">EXPORTER</span>
          </button>
        </div>

        {/* ════════ Filtres ════════ */}
        <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-[2rem] shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6 mb-5 sm:mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
              <input
                type="text"
                placeholder="Rechercher client ou ID..."
                className="w-full pl-9 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-gray-50 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-green-500 transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Status filter + count */}
            <div className="flex items-center gap-3">
              <select
                className="bg-gray-50 border-none py-2.5 sm:py-3 px-3 sm:px-6 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm focus:ring-2 focus:ring-green-500 cursor-pointer flex-1 sm:flex-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tous</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmé</option>
                <option value="shipped">Expédié</option>
                <option value="delivered">Livré</option>
                <option value="cancelled">Annulé</option>
              </select>
              <span className="text-[10px] font-black uppercase text-gray-400 whitespace-nowrap hidden sm:block">
                {filteredOrders.length} résultats
              </span>
            </div>
          </div>
        </div>

        {/* ════════ Mobile: Cards ════════ */}
        <div className="block lg:hidden space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">
                Aucune commande trouvée
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const orderUniqueId = order._id || order.id;
              return (
                <div
                  key={orderUniqueId}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all"
                >
                  {/* Top row: ID + Status */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-black text-sm text-gray-900">
                        #{String(orderUniqueId).slice(-6).toUpperCase()}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        {new Date(order.createdAt).toLocaleDateString('fr-TN')}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase border whitespace-nowrap ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>

                  {/* Client info */}
                  <div className="mb-3 pl-0.5">
                    <p className="font-bold text-sm text-gray-900 truncate">
                      {order.user?.name || order.user?.firstName || 'Client Invité'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {order.user?.email || "Pas d'email"}
                    </p>
                  </div>

                  {/* Bottom: Total + Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <p className="font-black text-base text-gray-900">
                      {order.total?.toFixed(2)} DT
                    </p>
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowModal(true);
                      }}
                      className="p-2.5 bg-gray-100 rounded-xl hover:bg-black hover:text-white transition-all"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
          {/* Mobile counter */}
          <p className="text-center text-[10px] font-bold text-gray-400 uppercase mt-4">
            {filteredOrders.length} commande{filteredOrders.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* ════════ Desktop: Table ════════ */}
        <div className="hidden lg:block bg-white rounded-2xl xl:rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 xl:px-8 py-4 lg:py-5 text-left text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    ID & Date
                  </th>
                  <th className="px-6 xl:px-8 py-4 lg:py-5 text-left text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Client
                  </th>
                  <th className="px-6 xl:px-8 py-4 lg:py-5 text-left text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Montant
                  </th>
                  <th className="px-6 xl:px-8 py-4 lg:py-5 text-left text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Statut
                  </th>
                  <th className="px-6 xl:px-8 py-4 lg:py-5 text-right text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Détails
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.map((order) => {
                  const orderUniqueId = order._id || order.id;
                  return (
                    <tr
                      key={orderUniqueId}
                      className="hover:bg-green-50/30 transition-colors group"
                    >
                      <td className="px-6 xl:px-8 py-5 lg:py-6">
                        <p className="font-black text-sm text-gray-900">
                          #{String(orderUniqueId).slice(-6).toUpperCase()}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {new Date(order.createdAt).toLocaleDateString('fr-TN')}
                        </p>
                      </td>
                      <td className="px-6 xl:px-8 py-5 lg:py-6">
                        <p className="font-bold text-sm text-gray-900 truncate max-w-[200px]">
                          {order.user?.name || order.user?.firstName || 'Client Invité'}
                        </p>
                        <p className="text-xs text-gray-400 truncate max-w-[200px]">
                          {order.user?.email || "Pas d'email"}
                        </p>
                      </td>
                      <td className="px-6 xl:px-8 py-5 lg:py-6 font-black text-gray-900 whitespace-nowrap">
                        {order.total?.toFixed(2)} DT
                      </td>
                      <td className="px-6 xl:px-8 py-5 lg:py-6">
                        <span
                          className={`px-3 lg:px-4 py-1 rounded-full text-[10px] font-black uppercase border whitespace-nowrap ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-6 xl:px-8 py-5 lg:py-6 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowModal(true);
                          }}
                          className="p-2.5 lg:p-3 bg-gray-100 rounded-xl hover:bg-black hover:text-white transition-all transform hover:scale-110"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredOrders.length === 0 && (
            <div className="p-12 lg:p-20 text-center text-gray-400 font-bold uppercase tracking-widest text-sm">
              Aucune commande ne correspond à votre recherche
            </div>
          )}
        </div>
      </div>

      {/* ════════ Modal Détails ════════ */}
      {showModal && selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl lg:rounded-[3rem] w-full sm:max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 max-h-[95vh] sm:max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 flex-shrink-0">
              <h2 className="text-base sm:text-lg lg:text-xl font-black uppercase italic tracking-tighter truncate pr-4">
                Commande #
                {String(selectedOrder._id || selectedOrder.id).slice(-6).toUpperCase()}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Modal Body - scrollable */}
            <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto flex-1">

              {/* Adresse de livraison */}
              <div className="mb-5 sm:mb-6 lg:mb-8">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 sm:mb-4">
                  Logistique de livraison
                </p>
                <div className="p-4 sm:p-5 lg:p-6 bg-gray-50 rounded-xl sm:rounded-2xl lg:rounded-[2rem] border border-gray-100">
                  <p className="font-bold text-sm text-gray-900">
                    {/* CORRECTION: street au lieu de address */}
                    {selectedOrder.shippingAddress?.street || 'Adresse non renseignée'}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    {selectedOrder.shippingAddress?.city},{' '}
                    {selectedOrder.shippingAddress?.postalCode}
                  </p>
                  <p className="text-xs sm:text-sm text-green-600 uppercase font-bold mt-1">
                    {selectedOrder.shippingAddress?.country}
                  </p>
                </div>
              </div>

              {/* Articles */}
              <div className="mb-5 sm:mb-6 lg:mb-8">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 sm:mb-4">
                  Articles commandés
                </p>
                <div className="space-y-2 sm:space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-3 sm:p-4 bg-white border border-gray-100 rounded-xl sm:rounded-2xl gap-3"
                    >
                      <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
                        <div className="w-9 h-9 sm:w-12 sm:h-12 bg-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center font-black text-[10px] sm:text-xs flex-shrink-0">
                          x{item.quantity}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-400 font-bold">
                            {item.price?.toFixed(2)} DT / unité
                          </p>
                        </div>
                      </div>
                      <p className="font-black text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
                        {(item.price * item.quantity)?.toFixed(2)} DT
                      </p>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mt-3 p-3 sm:p-4 bg-green-50 rounded-xl sm:rounded-2xl border border-green-100">
                  <span className="text-xs sm:text-sm font-black uppercase text-green-700">
                    Total
                  </span>
                  <span className="text-base sm:text-lg font-black text-green-700">
                    {selectedOrder.total?.toFixed(2)} DT
                  </span>
                </div>
              </div>

              {/* Mise à jour statut */}
              <div>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 sm:mb-4">
                  Mettre à jour le statut
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 sm:gap-2">
                  {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(
                    (status) => (
                      <button
                        key={status}
                        disabled={isUpdating}
                        onClick={() =>
                          handleStatusUpdate(selectedOrder._id || selectedOrder.id || '', status)
                        }
                        className={`py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-[8px] sm:text-[9px] font-black uppercase transition-all shadow-sm ${
                          selectedOrder.status === status
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        {isUpdating && selectedOrder.status === status
                          ? '...'
                          : getStatusLabel(status)}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Mobile close button */}
            <div className="p-4 border-t border-gray-100 sm:hidden flex-shrink-0">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;