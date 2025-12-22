import React, { useState } from 'react';
import { 
  BarChart3, Users, Package, ShoppingCart, 
  DollarSign, Eye, Loader2, AlertCircle,
  TrendingUp, Download, ArrowRight, UserPlus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetAdminStatsQuery } from '../../state/apiService';

const AdminDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');

  const { 
    data: stats, 
    isLoading, 
    isError, 
    refetch 
  } = useGetAdminStatsQuery(timeRange);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700 border border-amber-200',
      confirmed: 'bg-blue-100 text-blue-700 border border-blue-200',
      shipped: 'bg-purple-100 text-purple-700 border border-purple-200',
      delivered: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
      cancelled: 'bg-rose-100 text-rose-700 border border-rose-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="relative">
          <Loader2 className="h-12 w-12 text-green-600 animate-spin" />
          <div className="absolute inset-0 blur-xl bg-green-200 opacity-50 animate-pulse"></div>
        </div>
        <p className="text-gray-600 font-medium mt-4">Calcul des indicateurs...</p>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md border border-red-100">
          <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Données indisponibles</h2>
          <p className="text-gray-500 mb-6">Nous n'avons pas pu charger les statistiques. Vérifiez votre connexion.</p>
          <button onClick={() => refetch()} className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-95">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Dynamique */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-green-600 font-bold text-base uppercase tracking-wider">Vue d'ensemble</span>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-transparent pl-4 pr-10 py-2 text-base font-bold text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="7d">7 derniers jours</option>
                <option value="30d">30 derniers jours</option>
                <option value="90d">90 derniers jours</option>
                <option value="1y">Cette année</option>
              </select>
              <button className="bg-green-600 hover:bg-green-700 text-white p-2.5 rounded-xl transition-all shadow-md">
                <Download size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Grille de statistiques avec Ajout Utilisateur */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard icon={<DollarSign/>} label="Revenu Total" value={`${stats.totalRevenue.toLocaleString()} DT`} color="green" trend="+12.5%" />
          <StatCard icon={<ShoppingCart/>} label="Commandes" value={stats.totalOrders} color="blue" trend="+5.4%" />
          <StatCard icon={<Users/>} label="Total Clients" value={stats.totalCustomers} color="purple" trend="+18.2%" />
          <StatCard icon={<Package />} label="Total Produits" value={stats.totalProducts || 0} color="orange" rend="En stock" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Section Tableau des Ventes */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-7 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Ventes Récentes</h2>
                <p className="text-base text-gray-400">Suivi des dernières transactions</p>
              </div>
              <Link to="/admin/orders" className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all">
                <ArrowRight size={20} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 text-left text-sm font-bold text-gray-400 uppercase tracking-widest">
                    <th className="px-7 py-4">Client</th>
                    <th className="px-7 py-4">Date</th>
                    <th className="px-7 py-4">Montant</th>
                    <th className="px-7 py-4 text-center">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats.recentOrders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-7 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 border border-white shadow-sm">
                            {order.user?.name.charAt(0)}
                          </div>
                          <span className="text-base font-bold text-gray-700">{order.user?.name}</span>
                        </div>
                      </td>
                      <td className="px-7 py-5 text-base text-gray-500 font-medium">
                        {new Date(order.createdAt).toLocaleDateString('fr-TN')}
                      </td>
                      <td className="px-7 py-5">
                        <span className="text-base font-black text-gray-900">{order.total.toFixed(2)} DT</span>
                      </td>
                      <td className="px-7 py-5 text-center">
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Produits (Identique au style Analytics) */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Top Produits</h2>
            <p className="text-base text-gray-400 mb-8">Les articles les plus populaires</p>
            <div className="space-y-7">
              {stats.topProducts.map((item: any, index: number) => (
                <div key={item.product._id} className="relative">
                  <div className="flex justify-between items-center mb-2.5">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-gray-300">0{index + 1}</span>
                      <span className="text-base font-bold text-gray-700 truncate max-w-[140px]">{item.product.name}</span>
                    </div>
                    <span className="text-sm font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg">{item.sales} ventes</span>
                  </div>
                  <div className="w-full bg-gray-50 rounded-full h-2.5 border border-gray-100 p-0.5">
                    <div 
                      className="bg-green-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                      style={{ width: `${(item.sales / stats.topProducts[0].sales) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions (Actions Rapides) */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickActionLink to="/admin/products" icon={<Package/>} label="Gestion Stock" sub="Ajouter ou modifier" color="green" />
            <QuickActionLink to="/admin/orders" icon={<ShoppingCart/>} label="Commandes" sub="Traiter les envois" color="blue" />
            <QuickActionLink to="/admin/customers" icon={<Users/>} label="Clients" sub="Liste des membres" color="purple" />
        </div>
      </div>
    </div>
  );
};

// COMPOSANTS RÉUTILISABLES (Nettoyés)
const StatCard = ({ icon, label, value, color, trend }: any) => {
  const colorSchemes: any = {
    green: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-violet-50 text-violet-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-all">
      <div className={`w-12 h-12 rounded-2xl ${colorSchemes[color]} flex items-center justify-center mb-4`}>
        {React.cloneElement(icon, { size: 22, strokeWidth: 2.5 })}
      </div>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-2xl font-black text-gray-900 tracking-tighter mb-2">{value}</h3>
      <div className="flex items-center gap-1.5">
        <div className="bg-green-100 p-0.5 rounded-md">
          <TrendingUp size={12} className="text-green-600" />
        </div>
        <span className="text-sm font-bold text-green-600">{trend}</span>
      </div>
    </div>
  );
};

const QuickActionLink = ({ to, icon, label, sub, color }: any) => {
  const colorMap: any = {
    green: 'group-hover:bg-green-500',
    blue: 'group-hover:bg-blue-500',
    purple: 'group-hover:bg-purple-500'
  };

  return (
    <Link to={to} className="flex items-center p-5 bg-white rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-xl transition-all group">
      <div className={`p-4 bg-gray-50 rounded-xl mr-4 group-hover:text-white transition-colors ${colorMap[color]}`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <div>
        <p className="font-black text-base text-gray-900 uppercase tracking-tight">{label}</p>
        <p className="text-sm text-gray-400 font-medium">{sub}</p>
      </div>
    </Link>
  );
};

export default AdminDashboard;