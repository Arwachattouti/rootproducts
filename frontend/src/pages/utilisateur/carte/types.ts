// frontend/src/pages/Carte/types.ts

// Type Product adapté à la structure de votre BDD
export interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  countInStock: number;
  images: string[];
  description?: string;
  rating?: number;
  numReviews?: number;
  origin?: string;
  weight?: string;
  benefits?: string[];
  // Coordonnées pour la carte (si disponibles dans votre BDD)
  location?: {
    latitude: number;
    longitude: number;
  };
}

// Labels des catégories
export const categoryLabels: Record<string, string> = {
  condiments: 'Condiments',
  sauce: 'Sauces',
  poudre: 'Poudres',
  confiture: 'Confitures',
  huile: 'Huiles',
  miel: 'Miels',
  grains: 'Céréales',
  saison: 'Produits de Saison',
  divers: 'Divers',
};

// Fonction pour calculer le statut du produit
export type ProductStatus = 'available' | 'out_of_stock' | 'popular';

export const getProductStatus = (product: Product): ProductStatus => {
  if (product.countInStock === 0) return 'out_of_stock';
  if (product.rating && product.rating >= 4.5) return 'popular';
  return 'available';
};

// Coordonnées par défaut des régions tunisiennes (pour les produits sans coordonnées)
export const regionCoordinates: Record<string, { latitude: number; longitude: number }> = {
  'Tunis': { latitude: 36.8065, longitude: 10.1815 },
  'Sfax': { latitude: 34.7406, longitude: 10.7603 },
  'Sousse': { latitude: 35.8288, longitude: 10.6405 },
  'Kairouan': { latitude: 35.6781, longitude: 10.0963 },
  'Bizerte': { latitude: 37.2744, longitude: 9.8739 },
  'Gabès': { latitude: 33.8815, longitude: 10.0982 },
  'Ariana': { latitude: 36.8663, longitude: 10.1647 },
  'Gafsa': { latitude: 34.4311, longitude: 8.7757 },
  'Monastir': { latitude: 35.7643, longitude: 10.8113 },
  'Ben Arous': { latitude: 36.7533, longitude: 10.2282 },
  'Nabeul': { latitude: 36.4561, longitude: 10.7376 },
  'Tataouine': { latitude: 32.9297, longitude: 10.4518 },
  'Médenine': { latitude: 33.3549, longitude: 10.5055 },
  'Mahdia': { latitude: 35.5047, longitude: 11.0622 },
  'Kasserine': { latitude: 35.1676, longitude: 8.8365 },
  'Sidi Bouzid': { latitude: 35.0354, longitude: 9.4839 },
  'Le Kef': { latitude: 36.1826, longitude: 8.7148 },
  'Siliana': { latitude: 36.0849, longitude: 9.3708 },
  'Zaghouan': { latitude: 36.4029, longitude: 10.1429 },
  'Tozeur': { latitude: 33.9197, longitude: 8.1339 },
  'Kebili': { latitude: 33.7044, longitude: 8.9690 },
  'Jendouba': { latitude: 36.5011, longitude: 8.7802 },
  'Béja': { latitude: 36.7256, longitude: 9.1817 },
  'Manouba': { latitude: 36.8101, longitude: 10.0956 },
  // Valeur par défaut (centre de la Tunisie)
  'default': { latitude: 34.5, longitude: 9.5 },
};

// Fonction pour obtenir les coordonnées d'un produit
export const getProductCoordinates = (product: Product): { latitude: number; longitude: number } => {
  // Si le produit a des coordonnées définies
  if (product.location?.latitude && product.location?.longitude) {
    return product.location;
  }
  
  // Sinon, utiliser les coordonnées de la région d'origine
  if (product.origin) {
    const coords = regionCoordinates[product.origin];
    if (coords) {
      // Ajouter un petit décalage aléatoire pour éviter la superposition
      return {
        latitude: coords.latitude + (Math.random() - 0.5) * 0.1,
        longitude: coords.longitude + (Math.random() - 0.5) * 0.1,
      };
    }
  }
  
  // Valeur par défaut
  return regionCoordinates['default'];
};