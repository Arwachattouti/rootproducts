// frontend/src/pages/Carte/components/ProductPopup.tsx
// en doit corroiger productstatus d'ou j'ai juste les champs suivantes countInStock , rating  et reviewCount 
/* et voici les categories que j'ai 

  const categories = [
    { id: 'all', value: '', label: 'Toute la collection' },
    {
      id: 'epices',
      value: ['condiments', 'sauce', 'poudre'],
      label: 'Épices & Condiments',
      description: 'Le cœur du goût tunisien',
    },
    {
      id: 'sucre',
      value: 'confiture',
      label: 'Douceurs & Confitures',
      description: 'Plaisirs sucrés naturels',
    },
    {
      id: 'essentiels',
      value: ['huile', 'miel'],
      label: 'Huiles & Miels',
      description: 'Or liquide et nectars du terroir',
    },
    {
      id: 'cereales',
      value: 'grains',
      label: 'Céréales',
      description: 'Semoules et farines artisanales',
    },
    {
      id: 'saison',
      value: 'saison',
      label: 'Produits de Saison',
      description: 'Récoltes fraîches du moment',
    },
    {
      id: 'divers',
      value: 'divers',
      label: 'Divers',
      description: 'Autres trésors à découvrir',
    },
  ]; */
import type { Product } from '../types/index.ts'; 
type ProductStatus = 'available' | 'out_of_stock' | 'popular';

interface ProductPopupProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

function getStatus(product: Product): ProductStatus {
  if (product.countInStock <= 0) return 'out_of_stock';
  if (product.rating >= 4.5 && product.reviewCount >= 10) return 'popular';
  return 'available';
}

const categoryLabels: Record<string, string> = {
  miel: 'Miel',
  huile: 'Huile',
};

export default function ProductPopup({ product, onViewDetails }: ProductPopupProps) {
  const status = getStatus(product);
  const rating = product.rating || 0;
  const numReviews = product.reviewCount || 0;

  const statusConfig: Record<
    ProductStatus,
    { label: string; bg: string; text: string; dot: string }
  > = {
    available: {
      label: 'Disponible',
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      dot: 'bg-emerald-500',
    },
    out_of_stock: {
      label: 'En rupture',
      bg: 'bg-orange-100',
      text: 'text-orange-700',
      dot: 'bg-orange-500',
    },
    popular: {
      label: 'Populaire',
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      dot: 'bg-blue-500',
    },
  };

  const statusDisplay = statusConfig[status];

  return (
    <div className="w-64">
      <div className="relative">
        <img
          src={product.images?.[0] || '/placeholder.png'}
          alt={product.name}
          className="w-full h-36 object-cover rounded-t-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://via.placeholder.com/400x300?text=Produit+Terroir';
          }}
        />
        <div
          className={`absolute top-2 right-2 ${statusDisplay.bg} ${statusDisplay.text} px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${statusDisplay.dot}`}
          ></span>
          {statusDisplay.label}
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-bold text-sm text-gray-800 mb-1 leading-tight">
          {product.name}
        </h3>

        <p className="text-xs text-gray-500 mb-1">
          {categoryLabels[product.category] || product.category}
        </p>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500">({numReviews})</span>
        </div>

        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
          {product.description || 'Produit du terroir tunisien'}
        </p>

        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-emerald-600">
            {product.price.toFixed(2)} DT
          </span>
          {product.weight && (
            <span className="text-xs text-gray-400">{product.weight}</span>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {product.origin || 'Tunisie'}
        </div>

        <button
          onClick={() => onViewDetails(product)}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          commander
        </button>
      </div>
    </div>
  );
}