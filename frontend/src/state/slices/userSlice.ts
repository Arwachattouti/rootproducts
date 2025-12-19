// frontend/src/state/slices/userSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '../../types'; 
// Importez l'apiService pour les extraReducers
import { apiService } from '../apiService'; 

// Tenter de charger l'utilisateur depuis le localStorage au démarrage
const userInfoFromStorage: User | null = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo')!)
    : null;

const initialState: AuthState = {
    user: userInfoFromStorage,
    isAuthenticated: !!userInfoFromStorage,
    isLoading: false
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Reducer utilitaire pour gérer la déconnexion côté client
        clientLogout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            localStorage.removeItem('userInfo');
        },
    },
    // --- EXTRA REDUCERS pour gérer les mutations RTK Query ---
    extraReducers: (builder) => {
        
        // 1. Logique pour LOGIN et REGISTER (regroupées car elles font la même chose)
        [apiService.endpoints.login, apiService.endpoints.register].forEach(endpoint => {
            builder
                // État en attente (Pending)
                .addMatcher(endpoint.matchPending, (state) => {
                    state.isLoading = true;
                })
                // État réalisé (Fulfilled - Succès)
                .addMatcher(endpoint.matchFulfilled, (state, action: PayloadAction<User>) => {
                    state.isLoading = false;
                    state.user = action.payload;
                    state.isAuthenticated = true;
                 
                    // Sauvegarder l'utilisateur réel (et non seulement les credentials)
                    localStorage.setItem('userInfo', JSON.stringify(action.payload));
                })
                // État rejeté (Rejected - Échec)
                .addMatcher(endpoint.matchRejected, (state, action) => {
                    state.isLoading = false;
                    // Tente d'extraire le message d'erreur du backend
                    // Si le payload est une erreur sérialisée par RTK, elle est sous 'data.message'
                    // Si l'authentification échoue, nous nous assurons que l'utilisateur est déconnecté
                    state.user = null;
                    state.isAuthenticated = false;
                    localStorage.removeItem('userInfo');
                });
        });
            
        // 2. Logique pour LOGOUT (La déconnexion réussie)
        builder
            .addMatcher(apiService.endpoints.logout.matchFulfilled, (state) => {
                // Utilise le reducer utilitaire défini ci-dessus pour réinitialiser l'état
                userSlice.caseReducers.clientLogout(state);
            });
    },
});

export const { clientLogout } = userSlice.actions;

// Exportez le sélecteur pour un accès facile
export const selectUser = (state: any) => state.user; 

export default userSlice.reducer;