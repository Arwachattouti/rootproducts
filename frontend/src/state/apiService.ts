// frontend/src/state/apiService.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Product, User, LoginCredentials, RegisterData, Order, BlogPost, AdminStats } from '../types';

export const apiService = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api/',
        credentials: 'include', // Important pour les cookies JWT
    }),

    tagTypes: ['Product', 'User', 'Order', 'Cart', 'Blog'],

    endpoints: (builder) => ({
        // --- AUTHENTIFICATION & PROFILS ---
        login: builder.mutation<User, LoginCredentials>({
            query: (credentials) => ({
                url: 'users/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['User', 'Cart'],
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
            invalidatesTags: ['User', 'Cart', 'Order'],
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

        getAllUsers: builder.query<User[], void>({
            query: () => 'users',
            providesTags: ['User'],
        }),
        updateUser: builder.mutation<User, Partial<User> & { id: string }>({
            query: ({ id, ...patch }) => ({
                url: `users/${id}`,
                method: 'PUT',
                body: patch,
            }),
            invalidatesTags: ['User'], 
        }),

        deleteUser: builder.mutation<{ success: boolean; id: string }, string>({
            query: (id) => ({
                url: `users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),

        // --- PRODUITS (CRUD) ---
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

        createProduct: builder.mutation<Product, Partial<Product>>({
            query: (newProduct) => ({
                url: 'products',
                method: 'POST',
                body: newProduct,
            }),
            invalidatesTags: ['Product'],
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

        // --- BLOG (CRUD) ---
        getBlogs: builder.query<BlogPost[], void>({
            query: () => 'blogs',
            providesTags: (result) =>
                result
                    ? [...result.map(({ _id }) => ({ type: 'Blog' as const, id: _id })), 'Blog']
                    : ['Blog'],
        }),

        getBlogDetails: builder.query<BlogPost, string>({
            query: (id) => `blogs/${id}`,
            providesTags: (result, error, id) => [{ type: 'Blog', id }],
        }),

        createBlog: builder.mutation<BlogPost, Partial<BlogPost>>({
            query: (newBlog) => ({
                url: 'blogs',
                method: 'POST',
                body: newBlog,
            }),
            invalidatesTags: ['Blog'],
        }),

        updateBlog: builder.mutation<BlogPost, Partial<BlogPost> & { id: string }>({
            query: ({ id, ...patch }) => ({
                url: `blogs/${id}`,
                method: 'PUT',
                body: patch,
            }),
            invalidatesTags: (result, error, { id }) => ['Blog', { type: 'Blog', id }],
        }),

        deleteBlog: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `blogs/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Blog'],
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

        // --- COMMANDES (ORDERS) ---
        createOrder: builder.mutation<Order, any>({
            query: (orderData) => ({
                url: 'orders',
                method: 'POST',
                body: orderData,
            }),
            invalidatesTags: ['Order', 'Cart'],
        }),
        createPaymeeToken: builder.mutation<any, {
            amount: number;
            first_name: string;
            last_name: string;
            email: string;
            phone: string;
            orderId: string
        }>({
            query: (paymentData) => ({
                url: 'payments/paymee',
                method: 'POST',
                body: paymentData,
            }),
        }),
        getUserOrders: builder.query<Order[], void>({
            query: () => 'orders/myorders',
            providesTags: ['Order'],
        }),

        getAllOrders: builder.query<Order[], void>({
            query: () => 'orders',
            providesTags: ['Order'],
        }),

        updateOrderStatus: builder.mutation<Order, { id: string; status: string }>({
            query: ({ id, status }) => ({
                url: `orders/${id}/status`,
                method: 'PUT',
                body: { status },
            }),
            invalidatesTags: (result, error, { id }) => ['Order', { type: 'Order', id }],
        }),

        // Dans votre apiService.ts existant
        getAdminStats: builder.query<AdminStats, string>({
            // On passe le paramètre 'range' (7d, 30d, etc.) à l'URL si votre backend le supporte
            query: (range) => `orders/stats?range=${range}`,
            providesTags: ['Order', 'Product', 'User'],
        }),

        verifyPaymeePayment: builder.query<{ success: boolean; message: string }, { token: string; orderId: string }>({
            query: ({ token, orderId }) => `payments/verify/${token}?orderId=${orderId}`,
            providesTags: ['Order'],
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useGetAllUsersQuery,
    useUpdateUserMutation,
  useDeleteUserMutation,
    useGetProductsQuery,
    useGetProductDetailsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetBlogsQuery,
    useGetBlogDetailsQuery,
    useCreateBlogMutation,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
    useGetCartQuery,
    useUpdateCartMutation,
    useRemoveFromCartMutation,
    useClearCartMutation,
    useCreateOrderMutation,
    useGetUserOrdersQuery,
    useGetAllOrdersQuery,
    useUpdateOrderStatusMutation,
    useGetAdminStatsQuery,
    useCreatePaymeeTokenMutation,
    useVerifyPaymeePaymentQuery
} = apiService;