import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings, 
  LogOut, Menu, X, Home, Bell, Search, User
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
    <div className="flex flex-col h-full bg-white w-72 border-r border-gray-100">
      {/* Logo Section */}
      <div className="px-8 py-10 flex items-center justify-between">
        <img
          src="/images/logo.png"
          alt="Logo"
          className="h-12 w-auto object-contain"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement!.innerHTML = '<span class="text-black font-black text-3xl italic">ROOT</span>';
          }}
        />
        {/* Bouton fermer visible uniquement sur mobile dans la sidebar */}
        <button className="lg:hidden p-2 text-gray-400" onClick={() => setSidebarOpen(false)}>
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-6 space-y-2 overflow-y-auto">
        <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Menu Principal</p>
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
          <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Système</p>
          <Link
            to="/admin/settings"
            onClick={() => setSidebarOpen(false)}
            className={`group flex items-center px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300 ${location.pathname === '/admin/settings' ? 'bg-gray-900 text-white translate-x-2' : 'text-gray-500 hover:bg-gray-50 hover:text-black'
              }`}
          >
            <Settings className="mr-4 h-5 w-5" />
            Paramètres
          </Link>
        </div>
      </nav>

      {/* User Profile Card */}
      <div className="p-6">
        <div className="bg-gray-50 rounded-[2rem] p-4 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {authState.user?.firstName?.charAt(0)}{authState.user?.lastName?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-gray-900 truncate">
                {authState.user?.firstName}
              </p>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Admin</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link to="/" className="flex-1 flex items-center justify-center py-2 bg-white rounded-lg text-[9px] font-black text-gray-700 shadow-sm border border-gray-100 hover:bg-gray-900 hover:text-white transition-all">
              <Home className="w-3 h-3 mr-1" /> SITE
            </Link>
            <button onClick={handleLogout} className="px-3 flex items-center justify-center py-2 bg-red-50 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8F9FB]">
      {/* 1. DESKTOP SIDEBAR (Cachée sur Mobile) */}
      <aside className="hidden lg:flex lg:flex-shrink-0 sticky top-0 h-screen overflow-hidden">
        {renderSidebar()}
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col min-w-0">
        
        {/* 3. MOBILE HEADER (Nouveau) */}
        <header className="lg:hidden flex items-center justify-between bg-white px-4 h-16 border-b border-gray-100 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl bg-gray-50 text-gray-600 active:scale-95 transition-transform"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-xl font-black text-gray-900 tracking-tight ">PANEL ADMIN</span>
          </div>
        </header>

        {/* 4. DYNAMIC CONTENT (Outlet) */}
        <main className="flex-1 p-4 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {/* Petit indicateur de chemin sur desktop */}
            <div className="hidden lg:flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
               Admin <span className="mx-2 text-gray-300">/</span> 
               <span className="text-gray-900">{location.pathname.split('/').pop() || 'Dashboard'}</span>
            </div>
            
            <Outlet />
          </div>
        </main>
      </div>

      {/* 5. MOBILE SIDEBAR OVERLAY & DRAWER */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Background sombre */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setSidebarOpen(false)} 
          />
          
          {/* Panneau Sidebar coulissant */}
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl animate-in slide-in-from-left duration-300 ease-out">
            {renderSidebar()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;