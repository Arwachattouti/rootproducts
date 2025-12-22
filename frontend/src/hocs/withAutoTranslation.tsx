import React, { useEffect, useCallback, useRef, ComponentType } from 'react';

// --- TYPES & INTERFACES ---

interface AppTranslateGlobal {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  translateCurrentPage: () => void;
}

//declare global {
  //interface Window {
    //appTranslate?: AppTranslateGlobal;}}
declare global {
  interface Window {
    appTranslate?: {
      currentLanguage: string;
      changeLanguage?: (lang: string) => void;
      translateCurrentPage?: () => void;
    };
  }
}
// Cache global pour toutes les traductions
const globalTranslationCache = new Map<string, string>();
let currentGlobalLanguage: string = 'fr';

// --- HOC ---

const withAutoTranslation = <P extends object>(WrappedComponent: ComponentType<P>) => {
  return function AutoTranslatedComponent(props: P) {
    const lastPathname = useRef<string>('');
    const isTranslating = useRef<boolean>(false);

    // Vérifie si un texte mérite d'être traduit
    const shouldTranslate = (text: string | null): text is string => {
      if (!text || text.trim().length < 2) return false;

      const excluded = [
        'TechHub', '4,9/5', 'FaFacebookF', 'FaInstagram',
        'FaTwitter', 'FaLinkedinIn', 'FaYoutube'
      ];

      const cleanText = text.trim();
      if (excluded.includes(cleanText)) return false;
      if (/^\d+$/.test(cleanText)) return false;
      if (cleanText.includes('@')) return false;
      if (cleanText.startsWith('http')) return false;

      return /[a-zA-ZÀ-ÿ]/.test(cleanText);
    };

    // Récupère les nœuds de texte éligibles dans le DOM
    const getTextNodes = useCallback((): Text[] => {
      try {
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: (node) => {
              const text = node.textContent;
              if (!shouldTranslate(text)) return NodeFilter.FILTER_REJECT;

              const parent = node.parentElement;
              if (!parent) return NodeFilter.FILTER_REJECT;

              const tagName = parent.tagName;
              const className = parent.className || '';

              if (
                tagName === 'SCRIPT' ||
                tagName === 'STYLE' ||
                tagName === 'CODE' ||
                (typeof className === 'string' && className.includes('no-translate'))
              ) {
                return NodeFilter.FILTER_REJECT;
              }

              return NodeFilter.FILTER_ACCEPT;
            }
          }
        );

        const nodes: Text[] = [];
        let node: Node | null;
        while ((node = walker.nextNode())) {
          nodes.push(node as Text);
        }
        return nodes;
      } catch (error) {
        console.error('Error getting text nodes:', error);
        return [];
      }
    }, []);

    // Fonction de traduction
    const translatePageInternal = async (language: string = currentGlobalLanguage) => {
      if (isTranslating.current) return;
      isTranslating.current = true;

      try {
        const textNodes = getTextNodes();
        if (textNodes.length === 0) return;

        if (language === 'fr') {
          // Restauration du français via le cache inverse
          textNodes.forEach(node => {
            const currentText = node.textContent?.trim();
            if (!currentText) return;

            for (const [cacheKey, translatedText] of globalTranslationCache.entries()) {
              if (currentText === translatedText) {
                const originalText = cacheKey.substring(cacheKey.indexOf('-') + 1);
                node.textContent = originalText;
                break;
              }
            }
          });
          return;
        }

        // Regrouper par texte unique pour limiter les appels API
        const uniqueTexts = new Map<string, Text[]>();
        textNodes.forEach(node => {
          const originalText = node.textContent?.trim();
          if (originalText && shouldTranslate(originalText)) {
            if (!uniqueTexts.has(originalText)) {
              uniqueTexts.set(originalText, []);
            }
            uniqueTexts.get(originalText)?.push(node);
          }
        });

        for (const [originalText, nodes] of uniqueTexts) {
          const cacheKey = `${language}-${originalText}`;

          if (globalTranslationCache.has(cacheKey)) {
            const translated = globalTranslationCache.get(cacheKey);
            nodes.forEach(node => { node.textContent = translated!; });
            continue;
          }

          try {
            const response = await fetch(
              `https://api.mymemory.translated.net/get?q=${encodeURIComponent(originalText)}&langpair=fr|${language}`
            );

            if (response.ok) {
              const data = await response.json();
              const translatedText = data.responseData?.translatedText || originalText;

              if (translatedText && translatedText !== originalText) {
                globalTranslationCache.set(cacheKey, translatedText);
                nodes.forEach(node => { node.textContent = translatedText; });
              }
            }
            // Anti-spam pour l'API gratuite
            await new Promise(r => setTimeout(r, 150));
          } catch (error) {
            console.warn('Translation failed for:', originalText.substring(0, 30));
          }
        }
      } catch (error) {
        console.error('Translation system error:', error);
      } finally {
        isTranslating.current = false;
      }
    };

    // Gestionnaire de route et mutations DOM
    const setupRouteListener = () => {
      const checkRouteChange = () => {
        const currentPath = window.location.pathname + window.location.search;
        if (currentPath !== lastPathname.current) {
          lastPathname.current = currentPath;
          setTimeout(() => {
            if (currentGlobalLanguage !== 'fr') translatePageInternal();
          }, 400);
        }
      };

      const observer = new MutationObserver(() => checkRouteChange());
      observer.observe(document.body, { childList: true, subtree: true });

      const handlePopState = () => setTimeout(checkRouteChange, 100);
      window.addEventListener('popstate', handlePopState);

      return () => {
        observer.disconnect();
        window.removeEventListener('popstate', handlePopState);
      };
    };

    useEffect(() => {
      // Initialisation de l'objet global
      if (!window.appTranslate) {
        window.appTranslate = {
          currentLanguage: currentGlobalLanguage,
          translateCurrentPage: () => translatePageInternal(),
          changeLanguage: (newLang: string) => {
            currentGlobalLanguage = newLang;
            if (window.appTranslate) window.appTranslate.currentLanguage = newLang;
            setTimeout(() => translatePageInternal(newLang), 100);
          }
        };
      }

      // Traduction initiale
      if (currentGlobalLanguage !== 'fr') {
        setTimeout(() => translatePageInternal(), 1000);
      }

      const cleanup = setupRouteListener();
      return () => cleanup();
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAutoTranslation;