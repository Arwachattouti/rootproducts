import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { useTranslationLogic } from '../hooks/useTranslationLogic';

// --- TYPES & INTERFACES ---

interface TranslationContextType {
  language: string;
  changeLanguage: (newLanguage: string) => void;
  translatePage: () => void;
}

interface TranslationProviderProps {
  children: ReactNode;
  defaultLanguage?: string;
}

// Définition de l'objet global pour éviter les erreurs TS
declare global {
  interface Window {
    appTranslate?: {
      currentLanguage: string;
      changeLanguage?: (lang: string) => void;
      translateCurrentPage?: () => void;
    };
  }
}

// Création du contexte avec une valeur par défaut undefined
const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// --- HOOK DE CONSOMMATION ---

export const useTranslationContext = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslationContext must be used within a TranslationProvider');
  }
  return context;
};

// --- PROVIDER ---

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ 
  children, 
  defaultLanguage = 'fr' 
}) => {
  const translation = useTranslationLogic(defaultLanguage);
  const isMounted = useRef<boolean>(false);
  
  // Synchronisation de la langue avec l'objet global
  useEffect(() => {
    if (window.appTranslate) {
      // Met à jour la propriété de l'objet global utilisé par le HOC
      window.appTranslate.currentLanguage = translation.language;
    }
    
    isMounted.current = true;
  }, [translation.language]);
  
  return (
    <TranslationContext.Provider value={translation}>
      {children}
    </TranslationContext.Provider>
  );
};

export default TranslationContext;