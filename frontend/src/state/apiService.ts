// frontend/src/state/apiService.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Product, User, LoginCredentials, RegisterData, Order } from '../types';

export const apiService = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api/',
        credentials: 'include', // Important pour les cookies JWT
    }),

    tagTypes: ['Product', 'User', 'Order', 'Cart'],

    endpoints: (builder) => ({

        // --- AUTHENTIFICATION ---

        login: builder.mutation<User, LoginCredentials>({
            query: (credentials) => ({
                url: 'users/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['User', 'Cart'], // On invalide le panier à la connexion
        }),

        register: builder.mutation<User, RegisterData>({
            query: (data) => ({
                url: 'users/register',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),

        logout: builder.mutation<void, void>({
            query: () => ({
                url: 'users/logout',
                method: 'POST',
            }),
            invalidatesTags: ['User', 'Cart', 'Order'], // On vide tout au logout
        }),

        getProfile: builder.query<User, void>({
            query: () => 'users/profile',
            providesTags: ['User'],
        }),

        updateProfile: builder.mutation<User, Partial<User>>({
            query: (data) => ({
                url: 'users/profile',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),

        // --- PRODUITS (AVEC CRUD ADMIN) ---

        getProducts: builder.query<Product[], void>({
            query: () => 'products',
            providesTags: (result) =>
                result
                    ? [...result.map(({ _id }) => ({ type: 'Product' as const, id: _id })), 'Product']
                    : ['Product'],
        }),

        getProductDetails: builder.query<Product, string>({
            query: (id) => `products/${id}`,
            providesTags: (result, error, id) => [{ type: 'Product', id }],
        }),

        // --- FONCTIONS ADMIN MANQUANTES ---
        
        createProduct: builder.mutation<Product, Partial<Product>>({
            query: (newProduct) => ({
                url: 'products',
                method: 'POST',
                body: newProduct,
            }),
            invalidatesTags: ['Product'], // Rafraîchit la liste automatiquement
        }),

        updateProduct: builder.mutation<Product, Partial<Product> & { id: string }>({
            query: ({ id, ...patch }) => ({
                url: `products/${id}`,
                method: 'PUT',
                body: patch,
            }),
            invalidatesTags: (result, error, { id }) => ['Product', { type: 'Product', id }],
        }),

        deleteProduct: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Product'],
        }),

        // --- PANIER (CART) ---

        getCart: builder.query<any, void>({
            query: () => 'cart',
            providesTags: ['Cart'],
        }),

        updateCart: builder.mutation<any, { productId: string; quantity: number }>({
            query: (cartItem) => ({
                url: 'cart',
                method: 'POST',
                body: cartItem,
            }),
            invalidatesTags: ['Cart'],
        }),

        removeFromCart: builder.mutation<any, string>({
            query: (productId) => ({
                url: `cart/${productId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Cart'],
        }),

        clearCart: builder.mutation<void, void>({
            query: () => ({
                url: 'cart',
                method: 'DELETE',
            }),
            invalidatesTags: ['Cart'],
        }),

        // --- COMMANDES ---

        createOrder: builder.mutation<Order, any>({
            query: (orderData) => ({
                url: 'orders',
                method: 'POST',
                body: orderData,
            }),
            invalidatesTags: ['Order', 'Cart'], // Invalide le panier après commande
        }),

        getUserOrders: builder.query<Order[], void>({
            query: () => 'orders/myorders',
            providesTags: ['Order'],
        }),

        // Optionnel : Pour l'admin
        getAllOrders: builder.query<Order[], void>({
            query: () => 'orders',
            providesTags: ['Order'],
        }),

        getAllUsers: builder.query<User[], void>({
    query: () => 'users', // Assurez-vous que cette route existe sur votre backend
    providesTags: ['User'],
}),
    }),
});

// Hooks exportés mis à jour
export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useGetProductsQuery,
    useGetProductDetailsQuery,
    useCreateProductMutation,   // AJOUTÉ
    useUpdateProductMutation,   // AJOUTÉ
    useDeleteProductMutation,   // AJOUTÉ
    useGetCartQuery,
    useUpdateCartMutation,
    useRemoveFromCartMutation,
    useClearCartMutation,
    useCreateOrderMutation,
    useGetUserOrdersQuery,
    useGetAllOrdersQuery        // AJOUTÉ
} = apiService;