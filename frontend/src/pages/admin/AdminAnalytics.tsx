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
  Filter
} from 'lucide-react';

const AdminAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const metrics = {
    revenue: {
      current: 12450.80,
      previous: 10230.50,
      change: 21.7,
      label: 'Chiffre d\'affaires'
    },
    orders: {
      current: 156,
      previous: 134,
      change: 16.4,
      label: 'Commandes'
    },
    customers: {
      current: 89,
      previous: 76,
      change: 17.1,
      label: 'Nouveaux clients'
    },
    avgOrder: {
      current: 79.81,
      previous: 76.34,
      change: 4.5,
      label: 'Panier moyen'
    }
  };

  const salesData = [
    { month: 'Jan', sales: 8500, orders: 120 },
    { month: 'Fév', sales: 9200, orders: 135 },
    { month: 'Mar', sales: 10800, orders: 148 },
    { month: 'Avr', sales: 11200, orders: 156 },
    { month: 'Mai', sales: 12450, orders: 167 },
    { month: 'Juin', sales: 13100, orders: 178 }
  ];

  const topProducts = [
    { name: 'Mloukhia Premium en Poudre', sales: 45, revenue: 1120.50 },
    { name: 'Mloukhia Bio Séchée', sales: 32, revenue: 636.80 },
    { name: 'Coffret Découverte', sales: 28, revenue: 1397.20 },
    { name: 'Mloukhia Épicée Traditionnelle', sales: 22, revenue: 504.80 },
    { name: 'Mloukhia Fraîche Congelée', sales: 18, revenue: 232.20 }
  ];

  const customerSegments = [
    { segment: 'Nouveaux clients', count: 34, percentage: 38.2 },
    { segment: 'Clients fidèles', count: 28, percentage: 31.5 },
    { segment: 'Clients VIP', count: 15, percentage: 16.9 },
    { segment: 'Clients inactifs', count: 12, percentage: 13.5 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics & Rapports</h1>
              <p className="text-gray-600">Analysez les performances de votre boutique</p>
            </div>
            <div className="flex space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="7d">7 derniers jours</option>
                <option value="30d">30 derniers jours</option>
                <option value="90d">90 derniers jours</option>
                <option value="1y">1 an</option>
              </select>
              <button className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Object.entries(metrics).map(([key, metric]) => (
            <div key={key} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {key === 'revenue' || key === 'avgOrder' 
                      ? `${metric.current.toFixed(2)}€` 
                      : metric.current
                    }
                  </p>
                </div>
                <div className={`p-3 rounded-full ${
                  key === 'revenue' ? 'bg-green-100' :
                  key === 'orders' ? 'bg-blue-100' :
                  key === 'customers' ? 'bg-purple-100' :
                  'bg-yellow-100'
                }`}>
                  {key === 'revenue' && <DollarSign className="h-6 w-6 text-green-600" />}
                  {key === 'orders' && <ShoppingCart className="h-6 w-6 text-blue-600" />}
                  {key === 'customers' && <Users className="h-6 w-6 text-purple-600" />}
                  {key === 'avgOrder' && <BarChart3 className="h-6 w-6 text-yellow-600" />}
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {metric.change > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  metric.change > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </span>
                <span className="text-sm text-gray-500 ml-2">vs période précédente</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Évolution des Ventes</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedMetric('revenue')}
                  className={`px-3 py-1 rounded text-sm ${
                    selectedMetric === 'revenue' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Revenus
                </button>
                <button
                  onClick={() => setSelectedMetric('orders')}
                  className={`px-3 py-1 rounded text-sm ${
                    selectedMetric === 'orders' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Commandes
                </button>
              </div>
            </div>
            <div className="h-64 flex items-end space-x-2">
              {salesData.map((data, index) => (
                <div key={data.month} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-full rounded-t ${
                      selectedMetric === 'revenue' ? 'bg-green-500' : 'bg-blue-500'
                    } transition-all duration-300`}
                    style={{
                      height: `${(selectedMetric === 'revenue' ? data.sales : data.orders) / 
                        Math.max(...salesData.map(d => selectedMetric === 'revenue' ? d.sales : d.orders)) * 200}px`
                    }}
                  />
                  <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Segments */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Segments Clients</h2>
            <div className="space-y-4">
              {customerSegments.map((segment, index) => (
                <div key={segment.segment} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-3 ${
                      index === 0 ? 'bg-green-500' :
                      index === 1 ? 'bg-blue-500' :
                      index === 2 ? 'bg-purple-500' :
                      'bg-gray-400'
                    }`} />
                    <span className="text-sm font-medium text-gray-900">{segment.segment}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{segment.count}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-green-500' :
                          index === 1 ? 'bg-blue-500' :
                          index === 2 ? 'bg-purple-500' :
                          'bg-gray-400'
                        }`}
                        style={{ width: `${segment.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{segment.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Produits les Plus Performants</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Produit</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Ventes</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Revenus</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Performance</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={product.name} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          index === 0 ? 'bg-gold text-white' :
                          index === 1 ? 'bg-silver text-white' :
                          index === 2 ? 'bg-bronze text-white' :
                          'bg-gray-200 text-gray-600'
                        }`} style={{
                          background: index === 0 ? '#FFD700' : 
                                     index === 1 ? '#C0C0C0' : 
                                     index === 2 ? '#CD7F32' : '#E5E7EB'
                        }}>
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{product.sales} unités</td>
                    <td className="py-3 px-4 font-medium text-gray-900">{product.revenue.toFixed(2)}€</td>
                    <td className="py-3 px-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(product.sales / topProducts[0].sales) * 100}%` }}
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