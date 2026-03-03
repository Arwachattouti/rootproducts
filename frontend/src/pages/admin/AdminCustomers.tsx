import React, { useState, useMemo } from 'react';
import {
  Search, Eye, Edit, UserPlus, Mail, MapPin, Download, Lock, Unlock,
  Loader2, AlertCircle, Trash2, ShieldCheck, X
} from 'lucide-react';
import { User } from '../../types';
import {
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation
} from '../../state/apiService';
import { toast } from 'react-hot-toast';

const AdminCustomers: React.FC = () => {
  const { data: customers = [], isLoading, error, refetch } = useGetAllUsersQuery();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  // --- FILTRAGE ---
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const searchStr = `${customer.firstName} ${customer.lastName} ${customer.email}`.toLowerCase();
      const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' ? customer.isActive : !customer.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  // --- ACTIONS ---
  const handleToggleStatus = async (user: User) => {
    try {
      const userId = user.id || user._id;
      if (!userId) {
        toast.error("Impossible de trouver l'identifiant unique");
        return;
      }
      await toast.promise(
        updateUser({ id: userId, isActive: !user.isActive }).unwrap(),
        {
          loading: 'Mise à jour...',
          success: user.isActive ? 'Utilisateur bloqué' : 'Utilisateur activé',
          error: 'Erreur lors de la mise à jour',
        }
      );
    } catch (err) {
      // géré par toast.promise
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      try {
        await deleteUser(id).unwrap();
        toast.success('Client supprimé avec succès');
      } catch (err) {
        toast.error('Impossible de supprimer ce client');
      }
    }
  };

  // --- EXPORT CSV ---
  const exportCustomers = () => {
    const headers = ['ID', 'Nom Complet', 'Email', 'Ville', 'Statut', 'Date Inscription'];
    const rows = filteredCustomers.map((c) => [
      c.id,
      `${c.firstName} ${c.lastName}`,
      c.email,
      c.address?.city || 'N/A',
      c.isActive ? 'Actif' : 'Inactif',
      new Date(c.createdAt).toLocaleDateString(),
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows].map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `export_clients_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // --- LOADING ---
  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <Loader2 className="animate-spin text-green-600 h-8 w-8 sm:h-10 sm:w-10" />
        <p className="text-gray-500 mt-3 text-sm font-medium">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10 sm:pb-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 lg:py-10">

        {/* ════════ Header ════════ */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6 sm:mb-8 lg:mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-[900] text-gray-900 tracking-tight mb-1">
              Annuaire Clients
            </h1>
            <p className="text-sm sm:text-base text-gray-500 font-medium">
              Gérez vos{' '}
              <span className="text-green-600 font-bold">{customers.length} utilisateurs</span>{' '}
              et leurs accès.
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3 self-start sm:self-auto">
            <button
              onClick={exportCustomers}
              className="flex items-center bg-white border border-gray-200 text-gray-700 px-3 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl shadow-sm hover:bg-gray-50 transition-all font-bold text-xs sm:text-sm"
            >
              <Download size={16} className="sm:mr-2" />
              <span className="hidden sm:inline">Exporter</span>
            </button>
          </div>
        </div>

        {/* ════════ Filters ════════ */}
        <div className="flex flex-col sm:grid sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="sm:col-span-3 relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white border-none rounded-xl sm:rounded-2xl shadow-sm focus:ring-2 focus:ring-green-500 transition-all outline-none text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="bg-white border-none rounded-xl sm:rounded-2xl shadow-sm px-4 sm:px-6 py-3 sm:py-4 outline-none focus:ring-2 focus:ring-green-500 text-sm font-bold text-gray-600 cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="active">🟢 Actifs</option>
            <option value="inactive">🔴 Inactifs</option>
          </select>
        </div>

        {/* ════════ Mobile: Cards ════════ */}
        <div className="block lg:hidden space-y-3">
          {filteredCustomers.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
              <AlertCircle className="h-8 w-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-medium">Aucun client trouvé</p>
            </div>
          ) : (
            filteredCustomers.map((customer) => {
              const userId = customer.id || customer._id;
              return (
                <div
                  key={userId}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all"
                >
                  {/* Top: avatar + name + status */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-white font-black text-sm shadow-md flex-shrink-0">
                        {customer.firstName?.[0]}
                        {customer.lastName?.[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-gray-900 truncate">
                          {customer.firstName} {customer.lastName}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight italic">
                          Client Premium
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider flex-shrink-0 ${
                        customer.isActive
                          ? 'bg-green-50 text-green-600'
                          : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          customer.isActive ? 'bg-green-500 animate-pulse' : 'bg-rose-500'
                        }`}
                      />
                      {customer.isActive ? 'Actif' : 'Bloqué'}
                    </span>
                  </div>

                  {/* Info rows */}
                  <div className="space-y-1.5 mb-3 pl-[52px]">
                    <span className="flex items-center text-xs text-gray-600">
                      <Mail size={12} className="mr-1.5 opacity-40 flex-shrink-0" />
                      <span className="truncate">{customer.email}</span>
                    </span>
                    <span className="flex items-center text-xs text-gray-400">
                      <MapPin size={12} className="mr-1.5 opacity-40 flex-shrink-0" />
                      {customer.address?.city || 'Non renseigné'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2 pt-2 border-t border-gray-50">
                    <button
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setShowModal(true);
                      }}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <Eye size={16} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(customer)}
                      className={`p-2 rounded-lg transition-all ${
                        customer.isActive
                          ? 'bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white'
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                      }`}
                    >
                      {customer.isActive ? (
                        <Lock size={16} strokeWidth={2.5} />
                      ) : (
                        <Unlock size={16} strokeWidth={2.5} />
                      )}
                    </button>
                    <button
                      onClick={() => userId && handleDelete(userId)}
                      className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all"
                    >
                      <Trash2 size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ════════ Desktop: Table ════════ */}
        <div className="hidden lg:block bg-white rounded-2xl xl:rounded-[2.5rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 xl:px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Profil Client
                  </th>
                  <th className="px-6 xl:px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Contact & Localisation
                  </th>
                  <th className="px-6 xl:px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    État du compte
                  </th>
                  <th className="px-6 xl:px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-16 text-center">
                      <AlertCircle className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 font-medium">Aucun client trouvé</p>
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => {
                    const userId = customer.id || customer._id;
                    return (
                      <tr key={userId} className="hover:bg-green-50/20 transition-all group">
                        <td className="px-6 xl:px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-11 w-11 xl:h-12 xl:w-12 rounded-xl xl:rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-white font-black shadow-lg text-sm flex-shrink-0">
                              {customer.firstName?.[0]}
                              {customer.lastName?.[0]}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-black text-gray-900 truncate max-w-[180px]">
                                {customer.firstName} {customer.lastName}
                              </p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter italic">
                                Client Premium
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 xl:px-8 py-5">
                          <div className="flex flex-col gap-1">
                            <span className="flex items-center text-sm font-medium text-gray-600">
                              <Mail size={14} className="mr-2 opacity-40 flex-shrink-0" />
                              <span className="truncate max-w-[200px]">{customer.email}</span>
                            </span>
                            <span className="flex items-center text-xs text-gray-400">
                              <MapPin size={14} className="mr-2 opacity-40 flex-shrink-0" />
                              {customer.address?.city || 'Non renseigné'}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 xl:px-8 py-5">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
                              customer.isActive
                                ? 'bg-green-50 text-green-600'
                                : 'bg-rose-50 text-rose-600'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full mr-2 ${
                                customer.isActive ? 'bg-green-500 animate-pulse' : 'bg-rose-500'
                              }`}
                            />
                            {customer.isActive ? 'Compte Actif' : 'Compte Bloqué'}
                          </span>
                        </td>

                        <td className="px-6 xl:px-8 py-5">
                          <div className="flex justify-end gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-all">
                            <button
                              onClick={() => {
                                setSelectedCustomer(customer);
                                setShowModal(true);
                              }}
                              className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                            >
                              <Eye size={18} strokeWidth={2.5} />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(customer)}
                              className={`p-2.5 rounded-xl transition-all shadow-sm ${
                                customer.isActive
                                  ? 'bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white'
                                  : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                              }`}
                            >
                              {customer.isActive ? (
                                <Lock size={18} strokeWidth={2.5} />
                              ) : (
                                <Unlock size={18} strokeWidth={2.5} />
                              )}
                            </button>
                            <button
                              onClick={() => userId && handleDelete(userId)}
                              className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                            >
                              <Trash2 size={18} strokeWidth={2.5} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compteur mobile */}
        <div className="block lg:hidden mt-4 text-center">
          <p className="text-xs text-gray-400 font-medium">
            {filteredCustomers.length} résultat{filteredCustomers.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* ════════ Modal Detail ════════ */}
      {showModal && selectedCustomer && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 backdrop-blur-md bg-black/20"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-[2rem] lg:rounded-[3rem] w-full sm:max-w-lg shadow-2xl relative overflow-hidden animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-all"
            >
              <X size={18} />
            </button>

            {/* Gradient header */}
            <div className="h-24 sm:h-32 bg-gradient-to-br from-green-600 to-emerald-900" />

            {/* Content */}
            <div className="px-5 sm:px-8 lg:px-10 pb-6 sm:pb-8 lg:pb-10">
              <div className="relative -top-12 sm:-top-16 flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="h-20 w-20 sm:h-28 sm:w-28 lg:h-32 lg:w-32 rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] bg-white p-2 sm:p-3 shadow-2xl mb-3 sm:mb-6">
                  <div className="w-full h-full rounded-xl sm:rounded-[1.5rem] lg:rounded-[2rem] bg-green-50 flex items-center justify-center text-2xl sm:text-3xl lg:text-4xl font-black text-green-600">
                    {selectedCustomer.firstName?.[0]}
                    {selectedCustomer.lastName?.[0]}
                  </div>
                </div>

                {/* Name */}
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-[900] text-gray-900 truncate max-w-full px-2">
                  {selectedCustomer.firstName} {selectedCustomer.lastName}
                </h2>
                <p className="flex items-center gap-1.5 text-green-600 font-black uppercase tracking-widest text-[10px] sm:text-[11px] mt-1 italic">
                  <ShieldCheck size={12} className="sm:w-[14px] sm:h-[14px]" /> Client Vérifié
                </p>
              </div>

              {/* Info cards */}
              <div className="grid gap-3 sm:gap-4 -mt-4 sm:-mt-6">
                <div className="flex flex-col sm:flex-row sm:justify-between p-4 sm:p-5 bg-gray-50 rounded-xl sm:rounded-[1.5rem] border border-gray-100/50 gap-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase">
                    Coordonnées
                  </span>
                  <span className="text-sm font-bold text-gray-700 truncate">
                    {selectedCustomer.email}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between p-4 sm:p-5 bg-gray-50 rounded-xl sm:rounded-[1.5rem] border border-gray-100/50 gap-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase">
                    Localisation
                  </span>
                  <span className="text-sm font-bold text-gray-700">
                    {selectedCustomer.address?.city || 'Tunis'}
                  </span>
                </div>
                <div className="p-4 sm:p-5 bg-green-50/30 rounded-xl sm:rounded-[1.5rem] border border-green-100">
                  <span className="text-[10px] font-black text-green-600 uppercase block mb-1">
                    Dernière activité
                  </span>
                  <span className="text-sm font-bold text-green-900 italic">
                    Inscrit le{' '}
                    {new Date(selectedCustomer.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* Close button mobile */}
              <button
                onClick={() => setShowModal(false)}
                className="w-full mt-5 sm:mt-6 py-3 bg-gray-900 text-white rounded-xl sm:rounded-2xl font-bold text-sm hover:bg-black transition-all sm:hidden"
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

export default AdminCustomers;