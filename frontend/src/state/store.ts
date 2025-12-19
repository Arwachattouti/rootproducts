// frontend/src/state/store.ts (Mise à jour)

import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import userReducer from './slices/userSlice';
import { apiService } from './apiService'; // 💡 Importation du service API

export const store = configureStore({
    reducer: {
        products: productReducer,
        user: userReducer,
        // 💡 Ajouter le reducer généré par RTK Query
        [apiService.reducerPath]: apiService.reducer, 
    },
    // 💡 Ajouter le middleware RTK Query
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiService.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;