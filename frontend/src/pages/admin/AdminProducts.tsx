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
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const categories = [
    { value: 'all', label: 'Toutes' },
    { value: 'poudre', label: 'Poudre' },
    { value: 'bio', label: 'Bio' },
    { value: 'huile', label: 'Huiles' },
    { value: 'epice', label: 'Épicée' },
    { value: 'fraiche', label: 'Congelée' },
    { value: 'kit', label: 'Kits' },
  ];

  useEffect(() => {
    if (!window.cloudinary) {
      const script = document.createElement('script');
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
      script.async = true;
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
    const filtered = products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter]);

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);

      // VÉRIFICATION : S'assurer que la catégorie du produit existe dans vos options
      const allowedCategories = categories.map(c => c.value);
      const safeCategory = allowedCategories.includes(product.category)
        ? product.category
        : 'poudre'; // Valeur par défaut si l'ancienne catégorie est invalide

      setFormData({
        ...product,
        category: safeCategory
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        images: [],
        category: 'poudre',
        countInStock: 0,
        weight: '',
        origin: 'Tunisie',
      });
    }
    setShowModal(true);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. On retire les champs générés par MongoDB pour ne pas polluer le PUT
      const { _id, __v, createdAt, updatedAt, ...cleanData } = formData as any;

      if (editingProduct) {
        await updateProduct({ id: editingProduct._id, ...cleanData }).unwrap();
        setMessage({ type: 'success', text: 'Produit mis à jour' });
      } else {
        await createProduct(cleanData).unwrap();
        setMessage({ type: 'success', text: 'Produit créé avec succès' });
      }
      setShowModal(false);
    } catch (err: any) {
      console.error("Erreur détaillée :", err);
      // Afficher le message d'erreur réel du backend s'il existe
      const errorMsg = err?.data?.message || 'Erreur de traitement';
      setMessage({ type: 'error', text: errorMsg });
    }
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('Supprimer ce produit définitivement ?')) {
      try {
        await deleteProduct(id).unwrap();
        setMessage({ type: 'success', text: 'Produit supprimé' });
      } catch (err) {
        setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
      }
    }
  };

  const openCloudinaryWidget = () => {
    if (window.cloudinary) {
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: 'dxk2lvcjy',
          uploadPreset: 'Root_products',
          sources: ['local', 'url', 'camera'],
          multiple: false,
          cropping: false,
          folder: 'images',
          showPoweredBy: false,
        },
        (error: any, result: any) => {
          if (!error && result && result.event === 'success') {
            const newImageUrl = result.info.secure_url;
            setFormData((prev) => ({
              ...prev,
              images: [...(prev.images || []), newImageUrl],
            }));
          }
        }
      );
      widget.open();
    } else {
      alert('Cloudinary widget non chargé.');
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4">
        <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-green-600 animate-spin" />
        <p className="text-gray-600 font-bold mt-4 uppercase tracking-widest text-xs sm:text-sm">
          Chargement du catalogue...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10 sm:pb-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">

        {/* ════════ Toast ════════ */}
        {message && (
          <div
            className={`fixed top-3 left-3 right-3 sm:top-6 sm:right-6 sm:left-auto z-[100] flex items-center p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl animate-in slide-in-from-top duration-300 ${message.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
              }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="mr-2 flex-shrink-0" size={16} />
            ) : (
              <AlertCircle className="mr-2 flex-shrink-0" size={16} />
            )}
            <span className="font-bold text-xs sm:text-sm uppercase tracking-tight">
              {message.text}
            </span>
          </div>
        )}

        {/* ════════ Header ════════ */}
        <div className="mb-5 sm:mb-8 lg:mb-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div>
              <span className="text-green-600 font-bold text-xs sm:text-sm uppercase tracking-wider">
                Logistique
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight italic">
                Nos Produits
              </h1>
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center justify-center self-start sm:self-auto bg-gray-900 text-white px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-xl sm:rounded-2xl hover:bg-black transition-all font-black text-xs sm:text-sm tracking-widest shadow-lg active:scale-95"
            >
              <Plus className="mr-1.5 sm:mr-2" size={16} />
              Ajouter
            </button>
          </div>
        </div>

        {/* ════════ Stat Cards ════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-8 mb-5 sm:mb-8 lg:mb-12">
          {/* Total Références */}
          <div className="group relative bg-white p-3 sm:p-5 lg:p-8 rounded-xl sm:rounded-2xl lg:rounded-[2.5rem] shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 -mr-2 -mt-2 w-10 sm:w-16 lg:w-20 h-10 sm:h-16 lg:h-20 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
            <div className="relative z-10">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 bg-blue-100 text-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-4 lg:mb-6 shadow-inner group-hover:rotate-6 transition-transform">
                <Package className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              </div>
              <p className="text-[9px] sm:text-[10px] lg:text-xs font-black text-gray-400 uppercase tracking-wider sm:tracking-[0.2em] mb-0.5 sm:mb-1">
                Références
              </p>
              <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
                <h3 className="text-xl sm:text-2xl lg:text-4xl font-black text-gray-900 tracking-tighter">
                  {products.length}
                </h3>
                <span className="text-[7px] sm:text-[8px] lg:text-[10px] font-bold text-blue-500 bg-blue-50 px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">
                  Actifs
                </span>
              </div>
            </div>
          </div>

          {/* Catégories */}
          <div className="group relative bg-white p-3 sm:p-5 lg:p-8 rounded-xl sm:rounded-2xl lg:rounded-[2.5rem] shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 -mr-2 -mt-2 w-12 sm:w-18 lg:w-24 h-12 sm:h-18 lg:h-24 bg-purple-50 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
            <div className="relative z-10">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 bg-purple-100 text-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-4 lg:mb-6 shadow-inner group-hover:rotate-6 transition-transform">
                <Layers className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              </div>
              <p className="text-[9px] sm:text-[10px] lg:text-xs font-black text-gray-400 uppercase tracking-wider sm:tracking-[0.2em] mb-0.5 sm:mb-1">
                Segments
              </p>
              <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
                <h3 className="text-xl sm:text-2xl lg:text-4xl font-black text-gray-900 tracking-tighter">
                  {categories.length - 1}
                </h3>
                <span className="text-[7px] sm:text-[8px] lg:text-[10px] font-bold text-purple-500 bg-purple-50 px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">
                  Catégories
                </span>
              </div>
            </div>
          </div>

          {/* Valeur Stock */}
          <div className="group relative bg-white p-3 sm:p-5 lg:p-8 rounded-xl sm:rounded-2xl lg:rounded-[2.5rem] shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden col-span-2 lg:col-span-1">
            <div className="absolute top-0 right-0 -mr-2 -mt-2 w-12 sm:w-18 lg:w-24 h-12 sm:h-18 lg:h-24 bg-emerald-50 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
            <div className="relative z-10">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 bg-emerald-100 text-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-4 lg:mb-6 shadow-inner group-hover:rotate-6 transition-transform">
                <Database className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              </div>
              <p className="text-[9px] sm:text-[10px] lg:text-xs font-black text-gray-400 uppercase tracking-wider sm:tracking-[0.2em] mb-0.5 sm:mb-1">
                Valeur Estimée
              </p>
              <div className="flex items-baseline gap-1 flex-wrap">
                <h3 className="text-xl sm:text-2xl lg:text-4xl font-black text-gray-900 tracking-tighter">
                  {products
                    .reduce((acc, p) => acc + p.price * p.countInStock, 0)
                    .toLocaleString()}
                </h3>
                <span className="text-sm sm:text-base lg:text-lg font-black text-emerald-600">
                  DT
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ════════ Filters ════════ */}
        <div className="bg-white p-1.5 sm:p-2 rounded-xl sm:rounded-2xl lg:rounded-[2rem] shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-1.5 sm:gap-2 mb-4 sm:mb-6 lg:mb-8">
          <div className="relative flex-1 group">
            <Search className="h-4 w-4 text-gray-300 absolute left-3 sm:left-5 lg:left-6 top-1/2 -translate-y-1/2 group-focus-within:text-black transition-colors" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-12 lg:pl-14 pr-3 sm:pr-6 py-2.5 sm:py-3 lg:py-4 bg-gray-50/50 border-none rounded-lg sm:rounded-xl lg:rounded-[1.5rem] focus:bg-white focus:ring-2 focus:ring-green-100 outline-none text-xs sm:text-sm lg:text-base font-bold transition-all"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-gray-50/50 border-none rounded-lg sm:rounded-xl lg:rounded-[1.5rem] px-3 sm:px-5 lg:px-8 py-2.5 sm:py-3 lg:py-4 text-xs sm:text-sm lg:text-base font-black uppercase tracking-wider sm:tracking-widest outline-none cursor-pointer hover:bg-white transition-all appearance-none"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* ════════ Mobile: Cards ════════ */}
        <div className="block md:hidden space-y-2.5">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
              <Package className="h-8 w-8 text-gray-300 mx-auto mb-3" />
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                Aucun produit trouvé
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 hover:shadow-md transition-all"
              >
                {/* Top: Image + Info + Actions */}
                <div className="flex items-start gap-2.5 sm:gap-3 mb-2.5">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      className="h-12 w-12 rounded-lg sm:rounded-xl object-cover shadow-sm flex-shrink-0"
                      alt={product.name}
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-lg sm:rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <ImageIcon size={16} className="text-gray-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {product.name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">
                      {product.weight}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => openModal(product)}
                      className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Bottom: Category + Stock + Price */}
                <div className="flex items-center justify-between pt-2.5 border-t border-gray-50">
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-gray-100 text-gray-500 truncate max-w-[80px]">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-black ${product.countInStock < 10 ? 'text-rose-600' : 'text-emerald-600'
                        }`}
                    >
                      {product.countInStock} PCS
                    </span>
                    <span className="text-sm font-black text-gray-900">
                      {product.price.toFixed(2)} DT
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
          {/* Counter */}
          <p className="text-center text-[10px] font-bold text-gray-400 uppercase mt-3">
            {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* ════════ Desktop: Table ════════ */}
        <div className="hidden md:block bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
                  <th className="px-4 lg:px-8 py-4">Produit</th>
                  <th className="px-4 lg:px-8 py-4">Catégorie</th>
                  <th className="px-4 lg:px-8 py-4 text-center">Stock</th>
                  <th className="px-4 lg:px-8 py-4">Prix Actuel </th>
                  <th className="px-4 lg:px-8 py-4">Ancien Prix </th>
                  <th className="px-4 lg:px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-16 text-center">
                      <Package className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-400 font-bold uppercase">
                        Aucun produit trouvé
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50/80 transition-all group"
                    >
                      <td className="px-4 lg:px-8 py-4">
                        <div className="flex items-center gap-3 lg:gap-4">
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              className="h-10 w-10 lg:h-12 lg:w-12 rounded-lg lg:rounded-xl object-cover shadow-sm group-hover:scale-110 transition-transform flex-shrink-0"
                              alt={product.name}
                            />
                          ) : (
                            <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-lg lg:rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <ImageIcon size={16} className="text-gray-300" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm lg:text-base font-bold text-gray-700 truncate max-w-[150px] lg:max-w-[300px]">
                              {product.name}
                            </p>
                            <p className="text-[9px] lg:text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                              {product.weight}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-8 py-4">
                        <span className="px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg lg:rounded-xl text-[9px] lg:text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-600 border border-gray-200 whitespace-nowrap">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 lg:px-8 py-4">
                        <div className="flex flex-col items-center gap-1">
                          <span
                            className={`text-sm lg:text-base font-black ${product.countInStock < 10
                                ? 'text-rose-600'
                                : 'text-emerald-600'
                              }`}
                          >
                            {product.countInStock} PCS
                          </span>
                          <div className="w-12 lg:w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${product.countInStock < 10
                                  ? 'bg-rose-500'
                                  : 'bg-emerald-500'
                                }`}
                              style={{
                                width: `${Math.min(product.countInStock * 5, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-8 py-4">
                        <span className="text-sm lg:text-base font-black text-gray-900 whitespace-nowrap">
                          {product.price.toFixed(2)} DT
                        </span>
                      </td>
                      <td className="px-4 lg:px-8 py-4 text-right">
                        <div className="flex justify-end gap-1.5 lg:gap-2">
                          <button
                            onClick={() => openModal(product)}
                            className="p-2 lg:p-2.5 bg-gray-50 rounded-lg lg:rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                          >
                            <Edit size={16} className="lg:w-[18px] lg:h-[18px]" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2 lg:p-2.5 bg-gray-50 rounded-lg lg:rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                          >
                            <Trash2 size={16} className="lg:w-[18px] lg:h-[18px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ════════ Modal ════════ */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[110] p-0 sm:p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl lg:rounded-[3rem] w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-5 lg:py-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30 flex-shrink-0">
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg lg:text-2xl font-black uppercase tracking-tighter italic text-gray-900 truncate">
                  {editingProduct ? 'Modifier SKU' : 'Nouveau Produit'}
                </h2>
                <p className="text-[8px] sm:text-[9px] lg:text-[10px] text-gray-400 font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                  Configuration de l'inventaire
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 sm:p-3 bg-white hover:bg-rose-50 hover:text-rose-500 rounded-xl sm:rounded-2xl transition-all shadow-sm flex-shrink-0 ml-3"
              >
                <X size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={handleSubmit}
              className="p-4 sm:p-6 lg:p-10 space-y-4 sm:space-y-5 lg:space-y-8 overflow-y-auto flex-1"
            >
              {/* Nom + Catégorie */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[8px] sm:text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Nom du produit
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 bg-gray-50 border-none rounded-xl sm:rounded-2xl focus:bg-white focus:ring-2 focus:ring-green-100 outline-none text-sm font-bold transition-all"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[8px] sm:text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Catégorie
                  </label>
                  <select
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 bg-gray-50 border-none rounded-xl sm:rounded-2xl focus:bg-white focus:ring-2 focus:ring-green-100 outline-none text-sm font-bold appearance-none cursor-pointer transition-all"
                  >
                    {categories.slice(1).map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[8px] sm:text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Décrivez le produit..."
                  className="w-full px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-5 bg-gray-50 border-none rounded-xl sm:rounded-2xl lg:rounded-[2rem] focus:bg-white focus:ring-2 focus:ring-green-100 outline-none text-sm font-medium transition-all min-h-[80px] sm:min-h-[100px] lg:min-h-[150px] resize-y"
                />
              </div>

              {/* Prix / Stock / Poids */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-6">
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[8px] sm:text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-wider sm:tracking-widest ml-1">
                    Prix Actuel de vente (DT)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-2.5 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 bg-gray-50 border-none rounded-xl sm:rounded-2xl text-sm font-black focus:bg-white focus:ring-2 focus:ring-green-100 outline-none transition-all"
                  />
                </div>

                {/* NOUVEAU CHAMP : PRIX BARRÉ */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[8px] sm:text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-wider sm:tracking-widest ml-1">
                    Ancien Prix barré (Optionnel)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice || ''}
                    onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || undefined })}
                    className="w-full px-2.5 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 bg-rose-50 border-none rounded-xl sm:rounded-2xl text-sm font-black focus:bg-white focus:ring-2 focus:ring-rose-200 outline-none transition-all placeholder-rose-300"
                    placeholder="Ex: 5.50"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[8px] sm:text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-wider sm:tracking-widest ml-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.countInStock ?? ''}
                    onChange={(e) =>
                      setFormData({ ...formData, countInStock: parseInt(e.target.value) })
                    }
                    className="w-full px-2.5 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 bg-gray-50 border-none rounded-xl sm:rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-green-100 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[8px] sm:text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-wider sm:tracking-widest ml-1">
                    Poids
                  </label>
                  <input
                    type="text"
                    value={formData.weight || ''}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-2.5 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 bg-gray-50 border-none rounded-xl sm:rounded-2xl text-sm font-bold placeholder:text-gray-300 focus:bg-white focus:ring-2 focus:ring-green-100 outline-none transition-all"
                    placeholder="500g"
                  />
                </div>
              </div>

              {/* Images */}
              <div className="space-y-2 sm:space-y-3">
                <label className="text-[8px] sm:text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Images du Produit
                </label>
                <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4">
                  {(formData.images || []).map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Image ${index + 1}`}
                        className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-lg sm:rounded-xl object-cover shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full p-0.5 sm:p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} className="sm:w-3 sm:h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={openCloudinaryWidget}
                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl flex items-center justify-center hover:border-green-500 transition-colors flex-shrink-0"
                  >
                    <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                  </button>
                </div>
                <p className="text-[7px] sm:text-[8px] lg:text-[9px] text-gray-300 font-bold uppercase tracking-tight ml-1 sm:ml-2">
                  Cliquez sur + pour ajouter via Cloudinary
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row pt-3 sm:pt-4 lg:pt-6 gap-2 sm:gap-3 lg:gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="sm:flex-1 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 border-2 border-gray-100 rounded-xl sm:rounded-2xl lg:rounded-[1.5rem] text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95 order-2 sm:order-1"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="sm:flex-[2] px-4 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-5 bg-green-600 text-white rounded-xl sm:rounded-2xl lg:rounded-[1.5rem] text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-[0.2em] hover:bg-green-700 transition-all flex justify-center items-center shadow-xl shadow-green-100 active:scale-95 disabled:opacity-50 order-1 sm:order-2"
                >
                  {isCreating || isUpdating ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <span className="truncate">
                      <span className="hidden sm:inline">Enregistrer les modifications</span>
                      <span className="sm:hidden">Enregistrer</span>
                    </span>
                  )}
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