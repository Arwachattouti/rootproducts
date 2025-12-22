import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute'; // Vérifiez le chemin
import AdminLayout from '../components/AdminLayout'; // Vérifiez le chemin

// Components
import Header from '../components/Header';
import Footer from '../components/Footer';

// Pages
import Home from '../pages/utilisateur/Home';
import Products from '../pages/utilisateur/Products';
import ProductDetail from '../pages/utilisateur/ProductDetail';
import Panier from '../pages/utilisateur/Panier';
import Paiement from '../pages/utilisateur/Paiement';
import OrderSuccess from '../pages/utilisateur/OrderSuccess';
import About from '../pages/utilisateur/About';
import Contact from '../pages/utilisateur/Contact';
import Producers from '../pages/draft/Producers';
import Recipes from '../pages/draft/Recipes';
import Blog from '../pages/utilisateur/Blog';
import BlogDetail from '../pages/utilisateur/BlogDetail'; 
import Account from '../pages/utilisateur/Account';
import Legal from '../pages/draft/Legal';
import Privacy from '../pages/draft/Privacy';
import Terms from '../pages/draft/Terms';
import Login from '../pages/authentification/Login';
import Register from '../pages/authentification/Register';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminCustomers from '../pages/admin/AdminCustomers';
import AdminAnalytics from '../pages/admin/AdminAnalytics';
import AdminSettings from '../pages/admin/AdminSettings';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes hors layout principal */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        
        {/* Main site routes (Utilisateur) */}
        <Route path="/*" element={
          <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/panier" element={<Panier />} />
                <Route path="/paiement" element={
                  <ProtectedRoute>
                    <Paiement />
                  </ProtectedRoute>
                } />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/producers" element={<Producers />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                
                <Route path="/account" element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                } />
                <Route path="/legal" element={<Legal />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/order-confirmation" element={
                  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-3xl font-bold text-green-700 mb-4">Commande Confirmée !</h1>
                      <p className="text-lg text-gray-600">Merci pour votre commande.</p>
                    </div>
                  </div>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default AppRoutes;