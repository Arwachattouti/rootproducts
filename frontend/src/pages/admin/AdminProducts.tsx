import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Edit, Trash2, Save, X, Loader2,
  AlertCircle, CheckCircle2, Package, Layers, Database
} from 'lucide-react';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation
} from '../../state/apiService';

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
        name: '', description: '', price: 0, images: [''],
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

  if (isLoading) return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 text-green-600 animate-spin" />
      <p className="text-gray-600 font-bold mt-4 uppercase tracking-widest text-base">Chargement du catalogue...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Toast Messages */}
        {message && (
          <div className={`fixed top-10 right-10 z-[100] flex items-center p-4 rounded-2xl shadow-2xl animate-in slide-in-from-top duration-300 ${message.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}>
            {message.type === 'success' ? <CheckCircle2 className="mr-3" /> : <AlertCircle className="mr-3" />}
            <span className="font-bold text-base uppercase tracking-tight">{message.text}</span>
          </div>
        )}

        {/* Header Style Dashboard */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-green-600 font-bold text-base uppercase tracking-wider">Logistique</span>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">Nos Produits</h1>
            </div>

            <button
              onClick={() => openModal()}
              className="flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-2xl hover:bg-black transition-all font-black text-base tracking-widest shadow-lg active:scale-95"
            >
              <Plus className="mr-2" size={18} /> Ajouter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Card: Total Références */}
          <div className="group relative bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-20 h-20 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:rotate-6 transition-transform">
                <Package size={28} strokeWidth={2.5} />
              </div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total Références</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{products.length}</h3>
                <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">Products Actifs</span>
              </div>
            </div>
          </div>

          {/* Card: Catégories */}
          <div className="group relative bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-purple-50 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:rotate-6 transition-transform">
                <Layers size={28} strokeWidth={2.5} />
              </div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Segments</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{categories.length - 1}</h3>
                <span className="text-[10px] font-bold text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full">Catégories</span>
              </div>
            </div>
          </div>

          {/* Card: Valeur Stock */}
          <div className="group relative bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-emerald-50 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:rotate-6 transition-transform">
                <Database size={28} strokeWidth={2.5} />
              </div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Valeur Estimée</p>
              <div className="flex items-baseline gap-1">
                <h3 className="text-4xl font-black text-gray-900 tracking-tighter">
                  {products.reduce((acc, p) => acc + p.price * p.countInStock, 0).toLocaleString()}
                </h3>
                <span className="text-lg font-black text-emerald-600 ml-1">DT</span>
              </div>
            </div>
          </div>
        </div>


        {/* Filters Bar Style Dashboard */}
        <div className="bg-white p-2 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-2 mb-8">
          <div className="relative flex-1 group">
            <Search className="h-4 w-4 text-gray-300 absolute left-6 top-1/2 -translate-y-1/2 group-focus-within:text-black transition-colors" />
            <input
              type="text"
              placeholder="Rechercher une référence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border-none rounded-[1.5rem] focus:bg-white focus:ring-2 focus:ring-green-100 outline-none text-base font-bold transition-all"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-gray-50/50 border-none rounded-[1.5rem] px-8 py-4 text-base font-black uppercase tracking-widest outline-none cursor-pointer hover:bg-white transition-all appearance-none"
          >
            {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
          </select>
        </div>

        {/* Main Table (Style Dashboard) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  <th className="px-8 py-5">Produit</th>
                  <th className="px-8 py-5">Catégorie</th>
                  <th className="px-8 py-5 text-center">Stock</th>
                  <th className="px-8 py-5">Prix Unitaire</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50/80 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img src={product.images[0]} className="h-12 w-12 rounded-xl object-cover shadow-sm group-hover:scale-110 transition-transform" alt="" />
                        <div>
                          <p className="text-lg font-bold text-gray-700 truncate max-w-[300px]">{product.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">{product.weight}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-600 border border-gray-200">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-base font-black ${product.countInStock < 10 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {product.countInStock} PCS
                        </span>
                        <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${product.countInStock < 10 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(product.countInStock * 5, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-base font-black text-gray-900">{product.price.toFixed(2)} DT</span>
                    </td>
                    <td className="px-8 py-5 text-right">
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
          <div className="bg-white rounded-[3rem] max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in duration-300">
            <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter italic text-gray-900">
                  {editingProduct ? 'Modifier SKU' : 'Nouveau Produit'}
                </h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Configuration de l'inventaire</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 bg-white hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all shadow-sm">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom du produit</label>
                  <input
                    type="text" required value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-green-100 outline-none text-base font-bold transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Catégorie</label>
                  <select
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-green-100 outline-none text-base font-bold appearance-none cursor-pointer transition-all"
                  >
                    {categories.slice(1).map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2"> {/* Optionnel: occupe toute la largeur sur PC */}
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Description Catalogue
                </label>
                <textarea
                  rows={6} // Augmenté de 3 à 6 pour doubler la hauteur initiale
                  required 
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Décrivez les caractéristiques du produit, son goût, sa texture..."
                  className="w-full px-6 py-5 bg-gray-50 border-none rounded-[2rem] focus:bg-white focus:ring-2 focus:ring-green-100 outline-none text-sm font-medium transition-all duration-300 min-h-[150px] resize-y"
                />
                <p className="text-[9px] text-gray-300 font-bold uppercase tracking-tight ml-2">
                  Utilisez la poignée en bas à droite pour redimensionner si nécessaire
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Prix (DT)</label>
                  <input
                    type="number" step="0.01" required value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-base font-black"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Stock Initial</label>
                  <input
                    type="number" required value={formData.countInStock ?? ''}
                    onChange={(e) => setFormData({ ...formData, countInStock: parseInt(e.target.value) })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-base font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Poids</label>
                  <input
                    type="text" value={formData.weight || ''}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-base font-bold placeholder:text-gray-300"
                    placeholder="ex: 500g"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Lien Image URL</label>
                <input
                 type="text" required value={formData.images?.[0] || ''}
                  onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-base font-mono text-green-600"
                />
              </div>

              <div className="flex pt-6 space-x-4">
                <button
                  type="button" onClick={() => setShowModal(false)}
                  className="flex-1 px-8 py-5 border-2 border-gray-100 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95"
                >
                  Annuler
                </button>
                <button
                  type="submit" disabled={isCreating || isUpdating}
                  className="flex-2 px-12 py-5 bg-green-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-green-700 transition-all flex justify-center items-center shadow-xl shadow-green-100 active:scale-95 disabled:opacity-50"
                >
                  {(isCreating || isUpdating) ? <Loader2 className="animate-spin" size={18} /> : 'Enregistrer les modifications'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Composant Interne pour les Stats
const QuickStat = ({ icon, label, value, color }: any) => {
  const themes: any = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
  };
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
      <div className={`w-10 h-10 rounded-xl ${themes[color]} flex items-center justify-center mb-4`}>
        {React.cloneElement(icon, { size: 20, strokeWidth: 2.5 })}
      </div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-1">{label}</p>
      <p className="text-xl font-black text-gray-900 tracking-tight">{value}</p>
    </div>
  );
};

export default AdminProducts;