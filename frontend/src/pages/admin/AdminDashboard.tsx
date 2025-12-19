import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign,
  Calendar,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminStats, Order } from '../../types';


const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    // Mock data - in real app, this would come from API
    const mockStats: AdminStats = {
      totalOrders: 156,
      totalRevenue: 12450.80,
      totalCustomers: 89,
      totalProducts: 6,
      recentOrders: [
        {
          id: 'CMD-2025-001',
          customer: {
            id: '1',
            name: 'Ahmed Benali',
            email: 'ahmed@example.com',
            phone: '+216 20 123 456',
            address: {
              street: '15 Avenue Habib Bourguiba',
              city: 'Tunis',
              postalCode: '1000',
              country: 'Tunisie'
            }
          },
          items: [],
          total: 74.70,
          status: 'pending',
          createdAt: new Date('2025-01-15'),
          updatedAt: new Date('2025-01-15')
        },
        {
          id: 'CMD-2025-002',
          customer: {
            id: '2',
            name: 'Fatma Chakroun',
            email: 'fatma@example.com',
            phone: '+216 21 456 789',
            address: {
              street: '25 Rue de la République',
              city: 'Sfax',
              postalCode: '3000',
              country: 'Tunisie'
            }
          },
          items: [],
          total: 49.90,
          status: 'confirmed',
          createdAt: new Date('2025-01-14'),
          updatedAt: new Date('2025-01-14')
        }
      ],
      topProducts: [
        { product: { id: '1', name: 'Mloukhia Premium en Poudre' } as any, sales: 45 },
        { product: { id: '2', name: 'Mloukhia Bio Séchée' } as any, sales: 32 },
        { product: { id: '3', name: 'Coffret Découverte' } as any, sales: 28 }
      ]
    };
    
    setStats(mockStats);
  }, [timeRange]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      default: return status;
    }
  };

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600">Vue d'ensemble de votre activité</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {[
              { value: '7d', label: '7 jours' },
              { value: '30d', label: '30 jours' },
              { value: '90d', label: '90 jours' },
              { value: '1y', label: '1 an' }
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  timeRange === range.value
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-600">Chiffre d'affaires</p>
                <p className="text-2xl font-bold text-green-800">
                  {stats.totalRevenue.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </p>
                <p className="text-xs text-green-500 mt-1">+12% ce mois</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600">Commandes</p>
                <p className="text-2xl font-bold text-blue-800">{stats.totalOrders}</p>
                <p className="text-xs text-blue-500 mt-1">+8% ce mois</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-600">Clients</p>
                <p className="text-2xl font-bold text-purple-800">{stats.totalCustomers}</p>
                <p className="text-xs text-purple-500 mt-1">+15% ce mois</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-orange-50 rounded-xl shadow-lg p-6 border border-orange-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-orange-600">Produits</p>
                <p className="text-2xl font-bold text-orange-800">{stats.totalProducts}</p>
                <p className="text-xs text-orange-500 mt-1">Catalogue actif</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Commandes Récentes</h2>
                <Link to="/admin/orders" className="text-sm text-green-600 hover:text-green-700 font-medium">
                  Voir tout →
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    <div>
                      <p className="font-semibold text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customer.name}</p>
                      <p className="text-sm text-gray-500">
                        {order.createdAt.toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-700">
                        {order.total.toFixed(2)}€
                      </p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Produits les Plus Vendus</h2>
                <Link to="/admin/products" className="text-sm text-green-600 hover:text-green-700 font-medium">
                  Gérer →
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.topProducts.map((item, index) => (
                  <div key={item.product.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                        index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                        'bg-gradient-to-r from-orange-400 to-orange-500'
                      }`}>
                        <span className="text-sm font-bold text-white">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{item.product.name}</p>
                        <p className="text-sm text-gray-600">{item.sales} ventes ce mois</p>
                      </div>
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(item.sales / stats.topProducts[0].sales) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/admin/products" className="flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 border border-green-200 hover:shadow-lg">
              <Package className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <span className="font-semibold text-green-700">Ajouter un produit</span>
                <p className="text-xs text-green-600">Gérer le catalogue</p>
              </div>
            </Link>
            <Link to="/admin/orders" className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 border border-blue-200 hover:shadow-lg">
              <Eye className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <span className="font-semibold text-blue-700">Voir les commandes</span>
                <p className="text-xs text-blue-600">Gérer les ventes</p>
              </div>
            </Link>
            <button className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 border border-purple-200 hover:shadow-lg">
              <BarChart3 className="h-6 w-6 text-purple-600 mr-3" />
              <div>
                <span className="font-semibold text-purple-700">Rapports détaillés</span>
                <p className="text-xs text-purple-600">Analytics avancées</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;