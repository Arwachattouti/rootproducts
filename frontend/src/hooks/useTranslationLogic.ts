import { useState, useCallback } from 'react';

/**
 * Extension de l'interface Window pour reconnaître appTranslate
 */
declare global {
  interface Window {
    appTranslate?: {
      currentLanguage: string;
      changeLanguage?: (lang: string) => void;
      translateCurrentPage?: () => void;
    };
  }
}

/**
 * Interface pour le retour du hook
 */
interface TranslationLogic {
  language: string;
  changeLanguage: (newLanguage: string) => void;
  translatePage: () => void;
}

export const useTranslationLogic = (initialLanguage: string = 'fr'): TranslationLogic => {
  const [language, setLanguage] = useState<string>(initialLanguage);
  
  const changeLanguage = useCallback((newLanguage: string): void => {
    if (newLanguage === language) return;
    
    setLanguage(newLanguage);
    
    // Mettre à jour window.appTranslate si disponible
    if (window.appTranslate) {
      window.appTranslate.currentLanguage = newLanguage;
      
      // Utiliser changeLanguage du HOC si disponible
      if (window.appTranslate.changeLanguage) {
        window.appTranslate.changeLanguage(newLanguage);
      }
    }
  }, [language]);
  
  const translatePage = useCallback((): void => {
    if (window.appTranslate?.translateCurrentPage) {
      window.appTranslate.translateCurrentPage();
    }
  }, []);
  
  return {
    language,
    changeLanguage,
    translatePage
  };
};