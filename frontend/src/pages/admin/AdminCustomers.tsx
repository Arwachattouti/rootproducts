import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Eye, Edit, UserPlus, Mail, MapPin, Calendar, ShoppingBag, Download, Lock, Unlock 
} from 'lucide-react';
import { User } from '../../types';
// Importez vos hooks depuis l'apiService
import { useGetProfileQuery, useUpdateProfileMutation } from '../../state/apiService'; 

const AdminCustomers: React.FC = () => {
  // NOTE: Idéalement, créez une route "getUsers" pour l'admin dans votre apiService
  // Pour cet exemple, on simule l'usage d'une requête API (remplacez par useGetUsersQuery si dispo)
  const { data: customersData, isLoading, error } = useGetProfileQuery(); // Exemple
  
  const [customers, setCustomers] = useState<User[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Synchronisation avec les données de l'API
  useEffect(() => {
    if (customersData) {
      // Si l'API renvoie un seul utilisateur ou un tableau, adaptez ici
      const dataArray = Array.isArray(customersData) ? customersData : [customersData];
      setCustomers(dataArray);
    }
  }, [customersData]);

  // Filtrage
  useEffect(() => {
    let filtered = customers;

    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(customer => 
        statusFilter === 'active' ? customer.isActive : !customer.isActive
      );
    }

    setFilteredCustomers(filtered);
  }, [customers, searchTerm, statusFilter]);

  // Fonction pour formater les dates en toute sécurité
  const formatDate = (dateInput: any) => {
    if (!dateInput) return 'Jamais';
    const date = new Date(dateInput);
    return isNaN(date.getTime()) ? 'Date invalide' : date.toLocaleDateString('fr-FR');
  };

  const exportCustomers = () => {
    const csvContent = [
      ['ID', 'Prénom', 'Nom', 'Email', 'Statut'].join(','),
      ...filteredCustomers.map(c => [
        c.id, c.firstName, c.lastName, c.email, c.isActive ? 'Actif' : 'Inactif'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'clients.csv');
    link.click();
  };

  if (isLoading) return <div className="p-8 text-center">Chargement des clients...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Clients</h1>
            <p className="text-gray-600">Total : {customers.length} clients enregistrés</p>
          </div>
          <div className="flex space-x-4">
            <button onClick={exportCustomers} className="flex items-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition">
              <Download className="h-4 w-4 mr-2" /> Exporter CSV
            </button>
            <button className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">
              <UserPlus className="h-4 w-4 mr-2" /> Nouveau client
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Rechercher un nom, email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Client</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Inscription</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                        {customer.firstName[0]}{customer.lastName[0]}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{customer.firstName} {customer.lastName}</div>
                        <div className="text-xs text-gray-500">ID: {customer.id?.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center"><Mail className="h-3 w-3 mr-2" /> {customer.email}</div>
                    {customer.address && <div className="flex items-center mt-1 text-xs"><MapPin className="h-3 w-3 mr-2" /> {customer.address.city}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${customer.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {customer.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(customer.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => { setSelectedCustomer(customer); setShowModal(true); }} className="text-gray-400 hover:text-blue-600"><Eye className="h-5 w-5" /></button>
                    <button className="text-gray-400 hover:text-green-600"><Edit className="h-5 w-5" /></button>
                    <button className="text-gray-400 hover:text-orange-600">
                      {customer.isActive ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Simplifiée pour la clarté */}
      {showModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Profil Client</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div className="p-6">
              <div className="flex flex-col items-center mb-6">
                 <div className="h-20 w-20 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-2xl font-bold mb-2">
                   {selectedCustomer.firstName[0]}{selectedCustomer.lastName[0]}
                 </div>
                 <h3 className="text-lg font-bold">{selectedCustomer.firstName} {selectedCustomer.lastName}</h3>
                 <span className="text-gray-500 text-sm">{selectedCustomer.role}</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2 text-sm">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium">{selectedCustomer.email}</span>
                </div>
                <div className="flex justify-between border-b pb-2 text-sm">
                  <span className="text-gray-500">Membre depuis</span>
                  <span className="font-medium">{formatDate(selectedCustomer.createdAt)}</span>
                </div>
                {selectedCustomer.address && (
                  <div className="pt-2">
                    <span className="text-gray-500 text-sm block mb-1">Adresse de livraison</span>
                    <p className="text-sm bg-gray-50 p-3 rounded-lg">
                      {selectedCustomer.address.street}, {selectedCustomer.address.postalCode} {selectedCustomer.address.city}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;