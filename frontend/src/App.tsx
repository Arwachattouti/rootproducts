import React from 'react';
import { Provider } from 'react-redux';
import { store } from './state/store';
import { CartProvider } from './context/CartContext';
import { TranslationProvider } from './context/translationContext';
import { Toaster } from 'react-hot-toast';
import withAutoTranslation from './hocs/withAutoTranslation';
import AppRoutes from './routes/AppRouter';

// On applique le HOC de traduction au composant de routage
const TranslatedAppRoutes = withAutoTranslation(AppRoutes);

function App() {
  return (
    <Provider store={store}>
      <TranslationProvider>
        <CartProvider>
          {/* Le Toaster peut être placé n'importe où dans l'arborescence */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '1.5rem', // Légèrement plus arrondi pour coller à votre design premium
                background: '#1a1a1a',  // Un noir plus profond
                color: '#fff',
                padding: '16px 24px',
                fontSize: '14px',
                fontWeight: '600',
              },
              success: {
                iconTheme: {
                  primary: '#10b981', // Vert émeraude pour les succès
                  secondary: '#fff',
                },
              },
            }}
          />
          
          <TranslatedAppRoutes />
          
        </CartProvider>
      </TranslationProvider>
    </Provider>
  );
}

export default App;