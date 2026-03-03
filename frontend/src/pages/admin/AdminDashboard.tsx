import React, { useState } from 'react';
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Loader2,
  AlertCircle,
  TrendingUp,
  Download,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetAdminStatsQuery } from '../../state/apiService';

const AdminDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const {
    data: stats,
    isLoading,
    isError,
    refetch,
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

  /* ───── Loading ───── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-green-600 animate-spin" />
        <p className="text-gray-600 font-medium mt-4 text-center text-sm sm:text-base">
          Calcul des indicateurs…
        </p>
      </div>
    );
  }

  /* ───── Error ───── */
  if (isError || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl shadow-xl text-center w-full max-w-md border border-red-100">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
            Données indisponibles
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            Nous n'avons pas pu charger les statistiques. Vérifiez votre
            connexion.
          </p>
          <button
            onClick={() => refetch()}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-95"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const sortedTopProducts = [...stats.topProducts].sort(
    (a, b) => b.sales - a.sales
  );
  const maxSales = sortedTopProducts[0]?.sales || 1;

  /* ───── Main ───── */
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10 sm:pb-12">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">

        {/* ════════ Header ════════ */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-green-600 font-bold text-xs sm:text-sm uppercase tracking-wider">
                Vue d'ensemble
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
                Dashboard
              </h1>
            </div>

            {/* Filtre + Export */}
            <div className="flex items-center gap-2 sm:gap-3 bg-white p-1 sm:p-1.5 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 self-start sm:self-auto">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-transparent pl-2 sm:pl-4 pr-6 sm:pr-10 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="7d">7 jours</option>
                <option value="30d">30 jours</option>
                <option value="90d">90 jours</option>
                <option value="1y">Cette année</option>
              </select>
              <button className="bg-green-600 hover:bg-green-700 text-white p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all shadow-md flex-shrink-0">
                <Download size={16} className="sm:hidden" />
                <Download size={18} className="hidden sm:block" />
              </button>
            </div>
          </div>
        </div>

        {/* ════════ Stat Cards ════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-10">
          <StatCard
            icon={<DollarSign />}
            label="Revenu Total"
            value={`${stats.totalRevenue.toLocaleString()} DT`}
            color="green"
            trend="+12.5%"
          />
          <StatCard
            icon={<ShoppingCart />}
            label="Commandes"
            value={stats.totalOrders}
            color="blue"
            trend="+5.4%"
          />
          <StatCard
            icon={<Users />}
            label="Clients"
            value={stats.totalCustomers}
            color="purple"
            trend="+18.2%"
          />
          <StatCard
            icon={<Package />}
            label="Produits"
            value={stats.totalProducts || 0}
            color="orange"
            trend="En stock"
          />
        </div>

        {/* ════════ Ventes + Top Produits ════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">

          {/* ── Ventes Récentes ── */}
          <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Titre */}
            <div className="p-4 sm:p-6 lg:p-7 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                  Ventes Récentes
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                  Suivi des dernières transactions
                </p>
              </div>
              <Link
                to="/admin/orders"
                className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all flex-shrink-0"
              >
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* ── Mobile : cartes empilées ── */}
            <div className="block md:hidden divide-y divide-gray-50">
              {stats.recentOrders.map((order: any) => (
                <div key={order.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                        {order.user?.name?.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-gray-700 truncate">
                        {order.user?.name}
                      </span>
                    </div>
                    <span
                      className={`ml-2 flex-shrink-0 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('fr-TN')}
                    </span>
                    <span className="font-black text-gray-900">
                      {order.total.toFixed(2)} DT
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Desktop : tableau ── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <th className="px-5 lg:px-7 py-3">Client</th>
                    <th className="px-5 lg:px-7 py-3">Date</th>
                    <th className="px-5 lg:px-7 py-3">Montant</th>
                    <th className="px-5 lg:px-7 py-3 text-center">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats.recentOrders.map((order: any) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="px-5 lg:px-7 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 flex-shrink-0">
                            {order.user?.name?.charAt(0)}
                          </div>
                          <span className="text-sm font-bold text-gray-700 truncate max-w-[160px]">
                            {order.user?.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 lg:px-7 py-4 text-sm text-gray-500 font-medium whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString('fr-TN')}
                      </td>
                      <td className="px-5 lg:px-7 py-4">
                        <span className="text-sm font-black text-gray-900 whitespace-nowrap">
                          {order.total.toFixed(2)} DT
                        </span>
                      </td>
                      <td className="px-5 lg:px-7 py-4 text-center">
                        <span
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase whitespace-nowrap ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Top Produits ── */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-7">
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1">
              Top Produits
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mb-5 sm:mb-6 lg:mb-8">
              Les articles les plus populaires
            </p>

            {sortedTopProducts.length > 0 ? (
              <div className="space-y-4 sm:space-y-5 lg:space-y-7">
                {sortedTopProducts.slice(0, 5).map((item: any, index: number) => {
                  const percentage =
                    maxSales > 0 ? (item.sales / maxSales) * 100 : 0;
                  return (
                    <div
                      key={item.product._id}
                      className="group hover:scale-[1.02] sm:hover:scale-105 transition-transform duration-300"
                    >
                      <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs sm:text-sm font-black text-gray-300 group-hover:text-green-500 transition-colors flex-shrink-0">
                            0{index + 1}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-gray-700 truncate group-hover:text-gray-900 transition-colors">
                            {item.product.name}
                          </span>
                        </div>
                        <span className="ml-2 flex-shrink-0 text-[10px] sm:text-xs font-black text-green-600 bg-green-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg group-hover:bg-green-100 transition-colors whitespace-nowrap">
                          {item.sales} ventes
                        </span>
                      </div>
                      <div className="w-full bg-gray-50 rounded-full h-1.5 sm:h-2 border border-gray-100 p-px">
                        <div
                          className="bg-green-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(34,197,94,0.4)] group-hover:shadow-[0_0_12px_rgba(34,197,94,0.6)]"
                          style={{ width: `${Math.max(percentage, 5)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center">
                Aucun produit populaire trouvé.
              </p>
            )}
          </div>
        </div>

        {/* ════════ Quick Actions ════════ */}
        <div className="mt-6 sm:mt-8 lg:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <QuickActionLink
            to="/admin/products"
            icon={<Package />}
            label="Gestion Stock"
            sub="Ajouter ou modifier"
            color="green"
          />
          <QuickActionLink
            to="/admin/orders"
            icon={<ShoppingCart />}
            label="Commandes"
            sub="Traiter les envois"
            color="blue"
          />
          <QuickActionLink
            to="/admin/customers"
            icon={<Users />}
            label="Clients"
            sub="Liste des membres"
            color="purple"
          />
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Reusable Components
   ═══════════════════════════════════════════ */

const StatCard = ({ icon, label, value, color, trend }: any) => {
  const colorSchemes: Record<string, string> = {
    green: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-violet-50 text-violet-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
      <div
        className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl ${colorSchemes[color]} flex items-center justify-center mb-2 sm:mb-3 lg:mb-4`}
      >
        {React.cloneElement(icon, {
          className: 'w-4 h-4 sm:w-5 sm:h-5',
          strokeWidth: 2.5,
        })}
      </div>
      <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1 truncate">
        {label}
      </p>
      <h3 className="text-base sm:text-xl lg:text-2xl font-black text-gray-900 tracking-tighter mb-0.5 sm:mb-1 lg:mb-2 truncate">
        {value}
      </h3>
      <div className="flex items-center gap-1">
        <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-600 flex-shrink-0" />
        <span className="text-[10px] sm:text-xs font-bold text-green-600 truncate">
          {trend}
        </span>
      </div>
    </div>
  );
};

const QuickActionLink = ({ to, icon, label, sub, color }: any) => {
  const colorMap: Record<string, string> = {
    green: 'group-hover:bg-green-500',
    blue: 'group-hover:bg-blue-500',
    purple: 'group-hover:bg-purple-500',
  };

  return (
    <Link
      to={to}
      className="flex items-center p-3.5 sm:p-4 lg:p-5 bg-white rounded-xl sm:rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-xl transition-all group"
    >
      <div
        className={`p-2.5 sm:p-3 lg:p-4 bg-gray-50 rounded-lg sm:rounded-xl mr-3 sm:mr-4 group-hover:text-white transition-colors flex-shrink-0 ${colorMap[color]}`}
      >
        {React.cloneElement(icon, {
          className: 'w-4 h-4 sm:w-5 sm:h-5',
        })}
      </div>
      <div className="min-w-0">
        <p className="font-black text-sm sm:text-base text-gray-900 uppercase tracking-tight truncate">
          {label}
        </p>
        <p className="text-xs sm:text-sm text-gray-400 font-medium truncate">
          {sub}
        </p>
      </div>
    </Link>
  );
};

export default AdminDashboard;