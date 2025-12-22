import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Home,
  ShieldCheck
} from 'lucide-react';

import { useSelector } from 'react-redux';
import { selectUser } from '../state/slices/userSlice';
import { useLogoutMutation } from '../state/apiService';

const AdminLayout: React.FC = () => {
  const authState = useSelector(selectUser);
  const [triggerLogout] = useLogoutMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Produits', href: '/admin/products', icon: Package },
    { name: 'Commandes', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Clients', href: '/admin/customers', icon: Users },
  ];

  const handleLogout = async () => {
    try {
      await triggerLogout().unwrap();
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const renderSidebar = () => (
    <div className="flex flex-col h-full bg-white w-72">
      <div className="flex flex-col items-start px-8 py-12">
        <div className="flex items-center space-x-5">
          <div className="relative">
            {/* Conteneur Logo Agrandi */}
            <div className="w-35 h-35 ">
              <img
                src="/images/logo.png"
                alt="RootProducts Logo"
                className="flex-shrink-0 -ml-2 sm:-ml-4"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<span class="text-black font-black text-5xl">R</span>';
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 space-y-2">
        <p className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Main Menu</p>
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`group flex items-center px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300 ${isActive
                ? 'bg-gray-900 text-white shadow-lg shadow-gray-200 translate-x-2'
                : 'text-gray-500 hover:bg-gray-50 hover:text-black hover:translate-x-1'
                }`}
            >
              <item.icon className={`mr-4 h-5 w-5 ${isActive ? 'text-green-400' : 'text-gray-400 group-hover:text-black'}`} />
              {item.name}
            </Link>
          );
        })}

        <div className="pt-8">
          <p className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">System</p>
          <Link
            to="/admin/settings"
            className={`group flex items-center px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300 ${location.pathname === '/admin/settings' ? 'bg-gray-900 text-white translate-x-2' : 'text-gray-500 hover:bg-gray-50 hover:text-black'
              }`}
          >
            <Settings className="mr-4 h-5 w-5" />
            Paramètres
          </Link>
        </div>
      </nav>

      {/* Footer Profile */}
      <div className="p-6">
        <div className="bg-gray-50 rounded-[2rem] p-4 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white font-bold border-2 border-white shadow-md">
              {authState.user?.firstName?.charAt(0)}{authState.user?.lastName?.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-black text-gray-900 truncate">
                {authState.user?.firstName} {authState.user?.lastName}
              </p>
              <p className="text-[10px] text-gray-400 font-bold truncate uppercase tracking-tighter">Administrateur</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link to="/" className="flex-1 flex items-center justify-center py-2.5 bg-white rounded-xl text-[10px] font-black text-gray-700 shadow-sm border border-gray-100 hover:bg-gray-900 hover:text-white transition-all">
              <Home className="w-3 h-3 mr-2" /> SITE
            </Link>
            <button onClick={handleLogout} className="w-12 flex items-center justify-center py-2.5 bg-red-50 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8F9FB]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-shrink-0 sticky top-0 h-screen overflow-hidden">
        {renderSidebar()}
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
      
        <main className="flex-1 p-4 lg:p-8 pt-2">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            {renderSidebar()}
            <button className="absolute top-10 -right-12 p-2 bg-white rounded-full" onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;