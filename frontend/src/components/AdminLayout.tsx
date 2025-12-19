import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Home
} from 'lucide-react';

// Imports Redux/API pour correspondre à votre système
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
    { name: 'Tableau de bord', href: '/admin', icon: LayoutDashboard },
    { name: 'Produits', href: '/admin/products', icon: Package },
    { name: 'Commandes', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Clients', href: '/admin/customers', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Paramètres', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await triggerLogout().unwrap();
      navigate('/login');
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    }
  };

  const renderSidebar = () => (
    <div className="flex flex-col h-full border-r border-gray-200 bg-white w-64 shadow-lg">
      {/* Logo Section */}
      <div className="flex items-center justify-between px-6 py-8 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-black/20 shadow-lg">
            <span className="text-white font-black text-xl">M</span>
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-gray-900 tracking-tight uppercase">Mloukhia</h1>
            <p className="text-[10px] font-medium text-green-600 uppercase tracking-widest">Dashboard</p>
          </div>
        </div>
        <button className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(false)}>
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="mt-6 flex-1 px-4 space-y-1.5 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-black text-white shadow-xl shadow-gray-200 translate-x-1'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-black'
              }`}
            >
              <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-black'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile Section */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center p-2 mb-3 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-9 h-9 bg-gradient-to-tr from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mr-3 border border-white">
            <span className="text-gray-700 font-bold text-xs uppercase">
              {authState.user?.firstName?.charAt(0)}{authState.user?.lastName?.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate">
              {authState.user?.firstName} {authState.user?.lastName}
            </p>
            <p className="text-[10px] text-gray-400 truncate font-medium">{authState.user?.email}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Link to="/" className="flex items-center justify-center p-2 text-[10px] font-bold text-gray-500 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all">
            <Home className="h-3 w-3 mr-1.5" />
            SITE
          </Link>
          <button onClick={handleLogout} className="flex items-center justify-center p-2 text-[10px] font-bold text-red-500 hover:bg-red-50 rounded-lg transition-all">
            <LogOut className="h-3 w-3 mr-1.5" />
            SORTIR
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#FDFDFD]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-shrink-0 sticky top-0 h-screen">
        {renderSidebar()}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <div className={`fixed inset-0 z-50 flex lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className={`relative flex flex-col w-full max-w-xs bg-white transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {renderSidebar()}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 h-16 flex items-center px-4 lg:px-8">
          <div className="flex items-center justify-between w-full">
            <button className="lg:hidden p-2 text-gray-500" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>

            <div className="hidden md:flex flex-1 max-w-md ml-4">
              <div className="relative w-full group">
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-2.5 group-focus-within:text-black transition-colors" />
                <input
                  type="text"
                  placeholder="Recherche globale..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100/50 border-none rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-black/5 transition-all outline-none"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="relative p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-xl transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              <div className="h-6 w-[1px] bg-gray-100 mx-2" />
              
              <div className="relative group">
                <button className="flex items-center space-x-2 p-1.5 hover:bg-gray-100 rounded-xl transition-all">
                   <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center text-[10px] text-white font-bold">
                     AD
                   </div>
                   <ChevronDown className="h-4 w-4 text-gray-400 group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1">
                   <Link to="/admin/settings" className="block px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50">Profil Admin</Link>
                   <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50">Déconnexion</button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;