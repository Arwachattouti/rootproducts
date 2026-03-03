import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  Download,
  Filter,
} from 'lucide-react';

const AdminAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const metrics = {
    revenue: {
      current: 12450.8,
      previous: 10230.5,
      change: 21.7,
      label: "Chiffre d'affaires",
    },
    orders: {
      current: 156,
      previous: 134,
      change: 16.4,
      label: 'Commandes',
    },
    customers: {
      current: 89,
      previous: 76,
      change: 17.1,
      label: 'Nouveaux clients',
    },
    avgOrder: {
      current: 79.81,
      previous: 76.34,
      change: 4.5,
      label: 'Panier moyen',
    },
  };

  const salesData = [
    { month: 'Jan', sales: 8500, orders: 120 },
    { month: 'Fév', sales: 9200, orders: 135 },
    { month: 'Mar', sales: 10800, orders: 148 },
    { month: 'Avr', sales: 11200, orders: 156 },
    { month: 'Mai', sales: 12450, orders: 167 },
    { month: 'Juin', sales: 13100, orders: 178 },
  ];

  const topProducts = [
    { name: 'Mloukhia Premium en Poudre', sales: 45, revenue: 1120.5 },
    { name: 'Mloukhia Bio Séchée', sales: 32, revenue: 636.8 },
    { name: 'Coffret Découverte', sales: 28, revenue: 1397.2 },
    { name: 'Mloukhia Épicée Traditionnelle', sales: 22, revenue: 504.8 },
    { name: 'Mloukhia Fraîche Congelée', sales: 18, revenue: 232.2 },
  ];

  const customerSegments = [
    { segment: 'Nouveaux clients', count: 34, percentage: 38.2 },
    { segment: 'Clients fidèles', count: 28, percentage: 31.5 },
    { segment: 'Clients VIP', count: 15, percentage: 16.9 },
    { segment: 'Clients inactifs', count: 12, percentage: 13.5 },
  ];

  const segmentColors = [
    'bg-green-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-gray-400',
  ];

  const iconBgColors: Record<string, string> = {
    revenue: 'bg-green-100',
    orders: 'bg-blue-100',
    customers: 'bg-purple-100',
    avgOrder: 'bg-yellow-100',
  };

  const iconComponents: Record<string, React.ReactNode> = {
    revenue: <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />,
    orders: <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />,
    customers: <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />,
    avgOrder: <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />,
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10 sm:pb-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">

        {/* ════════ Header ════════ */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Analytics & Rapports
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-0.5">
                Analysez les performances de votre boutique
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 self-start sm:self-auto">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-2.5 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              >
                <option value="7d">7 jours</option>
                <option value="30d">30 jours</option>
                <option value="90d">90 jours</option>
                <option value="1y">1 an</option>
              </select>
              <button className="flex items-center bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-shrink-0">
                <Download className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Exporter</span>
              </button>
            </div>
          </div>
        </div>

        {/* ════════ Key Metrics ════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {Object.entries(metrics).map(([key, metric]) => (
            <div
              key={key}
              className="bg-white rounded-xl sm:rounded-lg shadow-md sm:shadow-lg p-3 sm:p-4 lg:p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs lg:text-sm font-medium text-gray-600 truncate">
                    {metric.label}
                  </p>
                  <p className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900 mt-0.5 truncate">
                    {key === 'revenue' || key === 'avgOrder'
                      ? `${metric.current.toFixed(2)}€`
                      : metric.current}
                  </p>
                </div>
                <div
                  className={`p-2 sm:p-3 rounded-full flex-shrink-0 ${iconBgColors[key]}`}
                >
                  {iconComponents[key]}
                </div>
              </div>
              <div className="mt-2 sm:mt-4 flex items-center flex-wrap gap-0.5">
                {metric.change > 0 ? (
                  <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 mr-0.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500 mr-0.5" />
                )}
                <span
                  className={`text-[10px] sm:text-xs lg:text-sm font-medium ${
                    metric.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {metric.change > 0 ? '+' : ''}
                  {metric.change}%
                </span>
                <span className="text-[10px] sm:text-xs lg:text-sm text-gray-500 ml-1 hidden sm:inline">
                  vs précédent
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ════════ Charts Row ════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">

          {/* ── Sales Chart ── */}
          <div className="bg-white rounded-xl sm:rounded-lg shadow-md sm:shadow-lg p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Évolution des Ventes
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedMetric('revenue')}
                  className={`px-2.5 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors ${
                    selectedMetric === 'revenue'
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Revenus
                </button>
                <button
                  onClick={() => setSelectedMetric('orders')}
                  className={`px-2.5 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors ${
                    selectedMetric === 'orders'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Commandes
                </button>
              </div>
            </div>
            <div className="h-48 sm:h-64 flex items-end gap-1 sm:gap-2">
              {salesData.map((data) => {
                const value =
                  selectedMetric === 'revenue' ? data.sales : data.orders;
                const maxValue = Math.max(
                  ...salesData.map((d) =>
                    selectedMetric === 'revenue' ? d.sales : d.orders
                  )
                );
                const barHeight = (value / maxValue) * 100;
                return (
                  <div
                    key={data.month}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div className="w-full flex items-end justify-center h-36 sm:h-52">
                      <div
                        className={`w-full max-w-[40px] sm:max-w-none rounded-t-sm sm:rounded-t transition-all duration-300 ${
                          selectedMetric === 'revenue'
                            ? 'bg-green-500'
                            : 'bg-blue-500'
                        }`}
                        style={{ height: `${barHeight}%` }}
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-600 mt-1.5 sm:mt-2">
                      {data.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Customer Segments ── */}
          <div className="bg-white rounded-xl sm:rounded-lg shadow-md sm:shadow-lg p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
              Segments Clients
            </h2>
            <div className="space-y-4 sm:space-y-5">
              {customerSegments.map((segment, index) => (
                <div key={segment.segment}>
                  {/* Mobile: stacked layout */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center min-w-0">
                      <div
                        className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2 sm:mr-3 flex-shrink-0 ${segmentColors[index]}`}
                      />
                      <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {segment.segment}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className="text-xs sm:text-sm text-gray-600">
                        {segment.count}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 w-10 sm:w-12 text-right">
                        {segment.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 ml-5 sm:ml-7">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${segmentColors[index]}`}
                      style={{ width: `${segment.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ════════ Top Products ════════ */}
        <div className="bg-white rounded-xl sm:rounded-lg shadow-md sm:shadow-lg p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
            Produits les Plus Performants
          </h2>

          {/* ── Mobile: cards ── */}
          <div className="block md:hidden space-y-3">
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                className="border border-gray-100 rounded-xl p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      background:
                        index === 0
                          ? '#FFD700'
                          : index === 1
                          ? '#C0C0C0'
                          : index === 2
                          ? '#CD7F32'
                          : '#E5E7EB',
                      color:
                        index <= 2 ? 'white' : '#4B5563',
                    }}
                  >
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                  <span>{product.sales} unités</span>
                  <span className="font-semibold text-gray-900">
                    {product.revenue.toFixed(2)}€
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-green-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(product.sales / topProducts[0].sales) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ── Desktop: table ── */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">
                    Produit
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">
                    Ventes
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">
                    Revenus
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr
                    key={product.name}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold flex-shrink-0"
                          style={{
                            background:
                              index === 0
                                ? '#FFD700'
                                : index === 1
                                ? '#C0C0C0'
                                : index === 2
                                ? '#CD7F32'
                                : '#E5E7EB',
                            color:
                              index <= 2 ? 'white' : '#4B5563',
                          }}
                        >
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-900 text-sm truncate max-w-[200px] lg:max-w-none">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                      {product.sales} unités
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {product.revenue.toFixed(2)}€
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-full min-w-[100px] bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              (product.sales / topProducts[0].sales) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;