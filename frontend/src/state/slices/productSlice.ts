// frontend/src/state/slices/productSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types'; // Assurez-vous d'importer votre type Product

// Définition du type pour l'état du Product Slice
interface ProductState {
    // Les produits réels seront gérés par RTK Query, mais
    // on garde un champ pour le cas où l'on veut stocker des produits filtrés ou des produits locaux.
    localProducts: Product[]; 
    
    // Si vous aviez des états de filtres complexes ou de pagination non gérés par l'URL
    currentFilters: {
        category: string;
        priceRange: [number, number];
        // ...
    };
    // Vous pouvez ajouter d'autres états (ex: est-ce que le tiroir de filtre est ouvert, etc.)
}

const initialState: ProductState = {
    localProducts: [],
    currentFilters: {
        category: '',
        priceRange: [0, 10000], // Exemple
    },
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        // Reducer pour initialiser les produits si besoin (bien que RTK Query le fasse mieux)
        setLocalProducts: (state, action: PayloadAction<Product[]>) => {
            state.localProducts = action.payload;
        },
        // Reducer pour mettre à jour un filtre
        setFilterCategory: (state, action: PayloadAction<string>) => {
            state.currentFilters.category = action.payload;
        },
        // Reducer pour réinitialiser les filtres
        resetFilters: (state) => {
            state.currentFilters = initialState.currentFilters;
        }
        
        // Note: Vous n'avez PAS besoin d'extraReducers ici pour la récupération
        // de produits, car RTK Query gère le chargement et le cache lui-même.
    },
    // Pas d'extraReducers nécessaires pour l'instant
});

export const { setLocalProducts, setFilterCategory, resetFilters } = productSlice.actions;

// Sélecteur pour récupérer l'état des produits
export const selectProductsState = (state: any) => state.products;

export default productSlice.reducer;