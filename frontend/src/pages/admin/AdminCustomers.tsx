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
} from '../../state/apiService'; // Assurez-vous d'avoir ces mutations
import { toast } from 'react-hot-toast'; // Recommandé pour les notifications

const AdminCustomers: React.FC = () => {
  const { data: customers = [], isLoading, error, refetch } = useGetAllUsersQuery();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  // --- LOGIQUE DE FILTRAGE ---
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const searchStr = `${customer.firstName} ${customer.lastName} ${customer.email}`.toLowerCase();
      const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'active' ? customer.isActive : !customer.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  // --- ACTIONS MANQUANTES ---
  const handleToggleStatus = async (user: User) => {
    try {
      // On cherche l'ID dans les deux propriétés possibles
      const userId = user.id || user._id;

      if (!userId) {
        console.error("Objet utilisateur reçu :", user); // Pour debug en console
        toast.error("Impossible de trouver l'identifiant unique");
        return;
      }

      // On utilise toast.promise pour un feedback plus pro
      await toast.promise(
        updateUser({
          id: userId,
          isActive: !user.isActive
        }).unwrap(),
        {
          loading: 'Mise à jour...',
          success: user.isActive ? 'Utilisateur bloqué' : 'Utilisateur activé',
          error: 'Erreur lors de la mise à jour',
        }
      );

    } catch (err) {
      // L'erreur est déjà gérée par toast.promise
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      try {
        await deleteUser(id).unwrap();
        toast.success("Client supprimé avec succès");
      } catch (err) {
        toast.error("Impossible de supprimer ce client");
      }
    }
  };

  // --- EXPORT CSV AMÉLIORÉ ---
  const exportCustomers = () => {
    const headers = ['ID', 'Nom Complet', 'Email', 'Ville', 'Statut', 'Date Inscription'];
    const rows = filteredCustomers.map(c => [
      c.id,
      `${c.firstName} ${c.lastName}`,
      c.email,
      c.address?.city || 'N/A',
      c.isActive ? 'Actif' : 'Inactif',
      new Date(c.createdAt).toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `export_clients_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-green-600" size={40} /></div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-[900] text-gray-900 tracking-tight mb-2">Annuaire Clients</h1>
            <p className="text-gray-500 font-medium">Gérez vos <span className="text-green-600 font-bold">{customers.length} utilisateurs</span> et leurs accès.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={exportCustomers} className="flex items-center bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-2xl shadow-sm hover:bg-gray-50 transition-all font-bold text-sm">
              <Download size={18} className="mr-2" /> Exporter
            </button>
           {/* <button className="flex items-center bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-xl shadow-gray-200 hover:scale-[1.02] transition-all font-bold text-sm">
              <UserPlus size={18} className="mr-2" /> Ajouter un client
            </button> */}
          </div>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-3 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher par nom, prénom ou email..."
              className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-green-500 transition-all outline-none text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="bg-white border-none rounded-2xl shadow-sm px-6 py-4 outline-none focus:ring-2 focus:ring-green-500 text-sm font-bold text-gray-600 cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="active">🟢 Actifs uniquement</option>
            <option value="inactive">🔴 Inactifs uniquement</option>
          </select>
        </div>

        {/* Tableau Modernisé */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Profil Client</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Contact & Localisation</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">État du compte</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCustomers.map((customer) => {
                  // On définit l'ID une seule fois pour tout le bloc
                  const userId = customer.id || customer._id;

                  return (
                    <tr key={userId} className="hover:bg-green-50/20 transition-all group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-white font-black shadow-lg">
                            {customer.firstName?.[0]}{customer.lastName?.[0]}
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900">
                              {customer.firstName} {customer.lastName}
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter italic">
                              Client Premium
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center text-sm font-medium text-gray-600">
                            <Mail size={14} className="mr-2 opacity-40" />
                            {customer.email}
                          </span>
                          <span className="flex items-center text-xs text-gray-400">
                            <MapPin size={14} className="mr-2 opacity-40" />
                            {customer.address?.city || 'Non renseigné'}
                          </span>
                        </div>
                      </td>

                      <td className="px-8 py-5">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${customer.isActive ? 'bg-green-50 text-green-600' : 'bg-rose-50 text-rose-600'
                            }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full mr-2 ${customer.isActive ? 'bg-green-500 animate-pulse' : 'bg-rose-500'
                              }`}
                          />
                          {customer.isActive ? 'Compte Actif' : 'Compte Bloqué'}
                        </span>
                      </td>

                      <td className="px-8 py-5">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          {/* Bouton Voir */}
                          <button
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setShowModal(true);
                            }}
                            className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          >
                            <Eye size={18} strokeWidth={2.5} />
                          </button>

                          {/* Bouton Lock/Unlock */}
                          <button
                            onClick={() => handleToggleStatus(customer)}
                            className={`p-2.5 rounded-xl transition-all shadow-sm ${customer.isActive
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

                          {/* Bouton Supprimer */}
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
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Detail Amélioré */}
      {showModal && selectedCustomer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/20">
          <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 z-20 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-all">
              <X size={20} />
            </button>
            <div className="h-32 bg-gradient-to-br from-green-600 to-emerald-900" />
            <div className="px-10 pb-10">
              <div className="relative -top-16 flex flex-col items-center text-center">
                <div className="h-32 w-32 rounded-[2.5rem] bg-white p-3 shadow-2xl mb-6">
                  <div className="w-full h-full rounded-[2rem] bg-green-50 flex items-center justify-center text-4xl font-black text-green-600">
                    {selectedCustomer.firstName?.[0]}{selectedCustomer.lastName?.[0]}
                  </div>
                </div>
                <h2 className="text-3xl font-[900] text-gray-900">{selectedCustomer.firstName} {selectedCustomer.lastName}</h2>
                <p className="flex items-center gap-2 text-green-600 font-black uppercase tracking-widest text-[11px] mt-1 italic">
                  <ShieldCheck size={14} /> Client Vérifié
                </p>
              </div>

              <div className="grid gap-4 -mt-6">
                <div className="flex justify-between p-5 bg-gray-50 rounded-[1.5rem] border border-gray-100/50">
                  <span className="text-[10px] font-black text-gray-400 uppercase">Coordonnées</span>
                  <span className="text-sm font-bold text-gray-700">{selectedCustomer.email}</span>
                </div>
                <div className="flex justify-between p-5 bg-gray-50 rounded-[1.5rem] border border-gray-100/50">
                  <span className="text-[10px] font-black text-gray-400 uppercase">Localisation</span>
                  <span className="text-sm font-bold text-gray-700">{selectedCustomer.address?.city || 'Tunis'}</span>
                </div>
                <div className="p-5 bg-green-50/30 rounded-[1.5rem] border border-green-100">
                  <span className="text-[10px] font-black text-green-600 uppercase block mb-1">Dernière activité</span>
                  <span className="text-sm font-bold text-green-900 italic">Inscrit le {new Date(selectedCustomer.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;