import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Edit, Trash2, Save, X, Loader2,
  AlertCircle, CheckCircle2, Package, Layers, Database, Upload, Image as ImageIcon
} from 'lucide-react';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation
} from '../../state/apiService';

// Déclaration globale pour TypeScript (ajoutez ceci dans un fichier .d.ts séparé si nécessaire)
declare global {
  interface Window {
    cloudinary: any;
  }
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  countInStock: number;
  weight: string;
  ingredients: string[];
  benefits: string[];
  origin: string;
  rating: number;
  reviewCount: number;
}

const AdminProducts: React.FC = () => {
  const { data: products = [], isLoading, isError, refetch } = useGetProductsQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'poudre', label: 'Mloukhia en poudre' },
    { value: 'bio', label: 'Bio & Naturel' },
    { value: 'huile', label: 'Huiles' },
    { value: 'epice', label: 'Épicée' },
    { value: 'fraiche', label: 'Fraîche congelée' },
    { value: 'kit', label: 'Kits de cuisine' }
  ];

  // Charger dynamiquement le script Cloudinary si ce n'est pas déjà fait
  useEffect(() => {
    if (!window.cloudinary) {
      const script = document.createElement('script');
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
      script.async = true;
      script.onload = () => {
        console.log('Cloudinary script loaded successfully');
      };
      script.onerror = () => {
        console.error('Failed to load Cloudinary script');
      };
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    let filtered = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter]);

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({ ...product });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', description: '', price: 0, images: [],
        category: 'poudre', countInStock: 0, weight: '',
        origin: 'Tunisie'
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct({ id: editingProduct._id, ...formData }).unwrap();
        setMessage({ type: 'success', text: 'Produit mis à jour' });
      } else {
        await createProduct(formData).unwrap();
        setMessage({ type: 'success', text: 'Produit créé avec succès' });
      }
      setShowModal(false);
    } catch (err: any) {
      setMessage({ type: 'error', text: "Erreur de traitement" });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Supprimer ce produit définitivement ?')) {
      try {
        await deleteProduct(id).unwrap();
        setMessage({ type: 'success', text: 'Produit supprimé' });
      } catch (err) {
        setMessage({ type: 'error', text: "Erreur lors de la suppression" });
      }
    }
  };

 // Fonction pour ouvrir le widget Cloudinary et ajouter une image
const openCloudinaryWidget = () => {
  if (window.cloudinary) {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dxk2lvcjy', // Remplacez par votre cloudName
        uploadPreset: 'Root_products', // Remplacez par votre uploadPreset
        sources: ['local', 'url', 'camera'],
        multiple: false,
        cropping: false, // Désactive le recadrage pour éviter le rectangle
        folder: 'images', // Optionnel
        // Désactiver Rollbar pour éviter les logs inutiles
        showPoweredBy: false,
        // Gestion d'erreurs personnalisée
        onFailure: (error: any) => {
          console.error('Upload failed:', error);
          alert('Erreur lors de l\'upload : ' + error.message);
        },
      },
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          const newImageUrl = result.info.secure_url;
          setFormData((prev) => ({
            ...prev,
            images: [...(prev.images || []), newImageUrl]
          }));
        }
      }
    );
    widget.open();
  } else {
    alert('Cloudinary widget non chargé. Vérifiez votre connexion ou la configuration.');
  }
};
  // Fonction pour supprimer une image de la liste
  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4">
      <Loader2 className="h-12 w-12 text-green-600 animate-spin" />
      <p className="text-gray-600 font-bold mt-4 uppercase tracking-widest text-sm">Chargement du catalogue...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Toast Messages */}
        {message && (
          <div className={`fixed top-4 right-4 sm:top-10 sm:right-10 z-[100] flex items-center p-3 sm:p-4 rounded-2xl shadow-2xl animate-in slide-in-from-top duration-300 ${message.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}>
            {message.type === 'success' ? <CheckCircle2 className="mr-2 sm:mr-3" size={16} /> : <AlertCircle className="mr-2 sm:mr-3" size={16} />}
            <span className="font-bold text-sm sm:text-base uppercase tracking-tight">{message.text}</span>
          </div>
        )}

        {/* Header Style Dashboard */}
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
            <div>
              <span className="text-green-600 font-bold text-sm sm:text-base uppercase tracking-wider">Logistique</span>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight italic">Nos Produits</h1>
            </div>

            <button
              onClick={() => openModal()}
              className="flex items-center justify-center bg-gray-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl hover:bg-black transition-all font-black text-sm sm:text-base tracking-widest shadow-lg active:scale-95"
            >
              <Plus className="mr-2" size={16} /> Ajouter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 mb-8 sm:mb-12">
          {/* Card: Total Références */}
          <div className="group relative bg-white p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 -mr-2 sm:-mr-4 -mt-2 sm:-mt-4 w-12 sm:w-20 h-12 sm:h-20 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
            <div className="relative z-10">
              <div className="w-10 sm:w-14 h-10 sm:h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-3 sm:mb-6 shadow-inner group-hover:rotate-6 transition-transform">
                <Package size={20} strokeWidth={2.5} />
              </div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total Références</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tighter">{products.length}</h3>
                <span className="text-[8px] sm:text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">Products Actifs</span>
              </div>
            </div>
          </div>

          {/* Card: Catégories */}
          <div className="group relative bg-white p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 -mr-2 sm:-mr-4 -mt-2 sm:-mt-4 w-16 sm:w-24 h-16 sm:h-24 bg-purple-50 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
            <div className="relative z-10">
              <div className="w-10 sm:w-14 h-10 sm:h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-3 sm:mb-6 shadow-inner group-hover:rotate-6 transition-transform">
                <Layers size={20} strokeWidth={2.5} />
              </div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Segments</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tighter">{categories.length - 1}</h3>
                <span className="text-[8px] sm:text-[10px] font-bold text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full">Catégories</span>
              </div>
            </div>
          </div>

          {/* Card: Valeur Stock */}
          <div className="group relative bg-white p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 -mr-2 sm:-mr-4 -mt-2 sm:-mt-4 w-16 sm:w-24 h-16 sm:h-24 bg-emerald-50 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
            <div className="relative z-10">
              <div className="w-10 sm:w-14 h-10 sm:h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-3 sm:mb-6 shadow-inner group-hover:rotate-6 transition-transform">
                <Database size={20} strokeWidth={2.5} />
              </div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Valeur Estimée</p>
              <div className="flex items-baseline gap-1">
                <h3 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tighter">
                  {products.reduce((acc, p) => acc + p.price * p.countInStock, 0).toLocaleString()}
                </h3>
                <span className="text-lg font-black text-emerald-600 ml-1">DT</span>
              </div>
            </div>
          </div>
        </div>


        {/* Filters Bar Style Dashboard */}
        <div className="bg-white p-2 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-2 mb-6 sm:mb-8">
          <div className="relative flex-1 group">
            <Search className="h-4 w-4 text-gray-300 absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 group-focus-within:text-black transition-colors" />
            <input
              type="text"
              placeholder="Rechercher une référence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 bg-gray-50/50 border-none rounded-[1.5rem] focus:bg-white focus:ring-2 focus:ring-green-100 outline-none text-sm sm:text-base font-bold transition-all"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-gray-50/50 border-none rounded-[1.5rem] px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-black uppercase tracking-widest outline-none cursor-pointer hover:bg-white transition-all appearance-none"
          >
            {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
          </select>
        </div>

        {/* Main Table (Style Dashboard) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Mobile: Cards View */}
          <div className="block sm:hidden">
            {filteredProducts.map((product) => (
              <div key={product._id} className="p-4 border-b border-gray-50 last:border-b-0">
                <div className="flex items-start gap-3 mb-3">
                  <img src={product.images[0]} className="h-12 w-12 rounded-xl object-cover shadow-sm flex-shrink-0" alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-gray-700 truncate">{product.name}</p>
                    <p className="text-xs text-gray-400 font-bold uppercase">{product.weight}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => openModal(product)} className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="px-2 py-1 rounded-lg text-xs font-bold uppercase bg-gray-100 text-gray-600">
                    {product.category}
                  </span>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${product.countInStock < 10 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {product.countInStock} PCS
                    </span>
                    <p className="text-sm font-black text-gray-900">{product.price.toFixed(2)} DT</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop: Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  <th className="px-6 sm:px-8 py-4">Produit</th>
                  <th className="px-6 sm:px-8 py-4">Catégorie</th>
                  <th className="px-6 sm:px-8 py-4 text-center">Stock</th>
                  <th className="px-6 sm:px-8 py-4">Prix Unitaire</th>
                  <th className="px-6 sm:px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50/80 transition-all group">

                    <td className="px-6 sm:px-8 py-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <img src={product.images[0]} className="h-10 sm:h-12 w-10 sm:w-12 rounded-xl object-cover shadow-sm group-hover:scale-110 transition-transform" alt="" />
                        <div>
                          <p className="text-sm sm:text-lg font-bold text-gray-700 truncate max-w-[250px] sm:max-w-[300px]">{product.name}</p>
                          <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold tracking-widest uppercase">{product.weight}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 sm:px-8 py-4">
                      <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-600 border border-gray-200">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 sm:px-8 py-4">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-sm sm:text-base font-black ${product.countInStock < 10 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {product.countInStock} PCS
                        </span>
                        <div className="w-12 sm:w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${product.countInStock < 10 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(product.countInStock * 5, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 sm:px-8 py-4">
                      <span className="text-sm sm:text-base font-black text-gray-900">{product.price.toFixed(2)} DT</span>
                    </td>
                    <td className="px-6 sm:px-8 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openModal(product)} className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(product._id)} className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Style Dashboard (scale-in, backdrop blur) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-[2rem] sm:rounded-[3rem] max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in duration-300">
            <div className="px-6 sm:px-10 py-6 sm:py-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter italic text-gray-900">
                  {editingProduct ? 'Modifier SKU' : 'Nouveau Produit'}
                </h2>
                <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Configuration de l'inventaire</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 sm:p-3 bg-white hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all shadow-sm">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6 sm:space-y-8 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom du produit</label>
                  <input
                    type="text" required value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-green-100 outline-none text-sm sm:text-base font-bold transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Catégorie</label>
                  <select
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-green-100 outline-none text-sm sm:text-base font-bold appearance-none cursor-pointer transition-all"
                  >
                    {categories.slice(1).map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Description Catalogue
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Décrivez les caractéristiques du produit, son goût, sa texture..."
                  className="w-full px-4 sm:px-6 py-3 sm:py-5 bg-gray-50 border-none rounded-[1.5rem] sm:rounded-[2rem] focus:bg-white focus:ring-2 focus:ring-green-100 outline-none text-sm font-medium transition-all duration-300 min-h-[100px] sm:min-h-[150px] resize-y"
                />
                <p className="text-[8px] sm:text-[9px] text-gray-300 font-bold uppercase tracking-tight ml-2">
                  Utilisez la poignée en bas à droite pour redimensionner si nécessaire
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Prix (DT)</label>
                  <input
                    type="number" step="0.01" required value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-none rounded-2xl text-sm sm:text-base font-black focus:bg-white focus:ring-2 focus:ring-green-100 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Stock Initial</label>
                  <input
                    type="number" required value={formData.countInStock ?? ''}
                    onChange={(e) => setFormData({ ...formData, countInStock: parseInt(e.target.value) })}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-none rounded-2xl text-sm sm:text-base font-bold focus:bg-white focus:ring-2 focus:ring-green-100 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Poids</label>
                  <input
                    type="text" value={formData.weight || ''}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-none rounded-2xl text-sm sm:text-base font-bold placeholder:text-gray-300 focus:bg-white focus:ring-2 focus:ring-green-100 outline-none transition-all"
                    placeholder="ex: 500g"
                  />
                </div>
              </div>

              {/* Section Images */}
              <div className="space-y-4">
                <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Images du Produit</label>
                <div className="flex flex-wrap gap-4">
                  {(formData.images || []).map((image, index) => (
                    <div key={index} className="relative group">
                      <img src={image} alt={`Image ${index + 1}`} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shadow-sm" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={openCloudinaryWidget}
                    className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-green-500 transition-colors"
                  >
                    <Upload size={24} className="text-gray-400" />
                  </button>
                </div>
                <p className="text-[8px] sm:text-[9px] text-gray-300 font-bold uppercase tracking-tight ml-2">
                  Cliquez sur le bouton + pour ajouter une image via Cloudinary
                </p>
              </div>

              <div className="flex flex-col sm:flex-row pt-4 sm:pt-6 space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  type="button" onClick={() => setShowModal(false)}
                  className="flex-1 px-6 sm:px-8 py-3 sm:py-5 border-2 border-gray-100 rounded-[1rem] sm:rounded-[1.5rem] text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95"
                >
                  Annuler
                </button>
                <button
                  type="submit" disabled={isCreating || isUpdating}
                  className="flex-1 sm:flex-2 px-8 sm:px-12 py-3 sm:py-5 bg-green-600 text-white rounded-[1rem] sm:rounded-[1.5rem] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] hover:bg-green-700 transition-all flex justify-center items-center shadow-xl shadow-green-100 active:scale-95 disabled:opacity-50"
                >
                  {(isCreating || isUpdating) ? <Loader2 className="animate-spin" size={16} /> : 'Enregistrer les modifications'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Composant Interne pour les Stats (non utilisé, mais gardé pour cohérence)
const QuickStat = ({ icon, label, value, color }: any) => {
  const themes: any = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
  };
  return (
    <div className="bg-white p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-gray-100 shadow-sm">
      <div className={`w-8 sm:w-10 h-8 sm:h-10 rounded-xl ${themes[color]} flex items-center justify-center mb-3 sm:mb-4`}>
        {React.cloneElement(icon, { size: 18, strokeWidth: 2.5 })}
      </div>
      <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-1">{label}</p>
      <p className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">{value}</p>
    </div>
  );
};

export default AdminProducts;