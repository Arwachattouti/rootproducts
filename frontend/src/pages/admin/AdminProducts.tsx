import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit, Trash2, Package, Save, X, Loader2 
} from 'lucide-react';
import { 
  useGetProductsQuery, 
  useCreateProductMutation, 
  useUpdateProductMutation, 
  useDeleteProductMutation 
} from '../../state/apiService'; // Ajustez le chemin selon votre structure

// Interface alignée avec MongoDB
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
  // 1. API Hooks
  const { data: products = [], isLoading } = useGetProductsQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  // 2. States locaux
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'poudre', label: 'Mloukhia en poudre' },
    { value: 'bio', label: 'Bio & Naturel' },
    { value: 'huile', label: 'Huiles' },
    { value: 'epice', label: 'Épicée' },
    { value: 'fraiche', label: 'Fraîche congelée' },
    { value: 'kit', label: 'Kits de cuisine' }
  ];

  // 3. Filtrage dynamique
  useEffect(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter]);

  // 4. Handlers
  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', description: '', price: 0, images: [''],
        category: 'poudre', countInStock: 10, weight: '',
        ingredients: [], benefits: [], origin: 'Tunisie'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct({ id: editingProduct._id, ...formData }).unwrap();
      } else {
        await createProduct(formData).unwrap();
      }
      closeModal();
    } catch (err) {
      alert("Erreur lors de l'enregistrement du produit");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Supprimer définitivement ce produit ?')) {
      try {
        await deleteProduct(id).unwrap();
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="animate-spin h-8 w-8 text-green-600" />
    </div>
  );

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">CATALOGUE PRODUITS</h1>
          <p className="text-sm text-gray-500 font-medium">Gestion du stock et des tarifs</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center justify-center bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all font-bold text-sm shadow-lg shadow-gray-200"
        >
          <Plus className="h-4 w-4 mr-2" /> AJOUTER UN PRODUIT
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-gray-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Rechercher un nom ou une description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 outline-none text-sm"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-black/5 outline-none"
        >
          {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
        </select>
      </div>

      {/* Products Table (Plus adapté pour l'admin qu'une grid) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Produit</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Catégorie</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Prix</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img src={product.images[0]} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                      <div className="max-w-[200px]">
                        <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{product.weight}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-sm">{product.price.toFixed(2)}€</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className={`h-1.5 w-1.5 rounded-full ${product.countInStock > 5 ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-sm font-medium text-gray-600">{product.countInStock} unités</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-1">
                      <button onClick={() => openModal(product)} className="p-2 text-gray-400 hover:text-black hover:bg-white rounded-lg transition-all shadow-sm">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(product._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white px-8 py-6 border-b border-gray-100 flex justify-between items-center z-10">
              <h2 className="text-xl font-black uppercase tracking-tight">
                {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Nom complet</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 outline-none text-sm font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Catégorie</label>
                  <select
                    value={formData.category || ''}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 outline-none text-sm font-bold"
                  >
                    {categories.slice(1).map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Prix (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price || ''}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Poids</label>
                  <input
                    type="text"
                    placeholder="Ex: 500g"
                    value={formData.weight || ''}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Stock Initial</label>
                  <input
                    type="number"
                    value={formData.countInStock || ''}
                    onChange={(e) => setFormData({...formData, countInStock: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.images?.[0] || ''}
                  onChange={(e) => setFormData({...formData, images: [e.target.value]})}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-xs text-blue-500"
                />
              </div>

              <div className="flex pt-4 space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-4 border border-gray-100 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex-1 px-6 py-4 bg-black text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex justify-center items-center shadow-xl shadow-gray-200"
                >
                  {(isCreating || isUpdating) ? <Loader2 className="animate-spin h-4 w-4" /> : <><Save className="h-4 w-4 mr-2" /> ENREGISTRER</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;