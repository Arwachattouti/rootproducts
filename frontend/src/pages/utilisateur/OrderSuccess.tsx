import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Truck,
  ArrowRight,
  ShoppingBag,
  Clock,
} from 'lucide-react';

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-2xl w-full">
        {/* Carte Principale */}
        <div className="bg-white rounded-2xl sm:rounded-[2.5rem] md:rounded-[3rem] shadow-xl shadow-[#4B2E05]/5 p-5 sm:p-8 md:p-12 lg:p-16 text-center border border-gray-100">
          {/* Icône de succès animée */}
          <div className="relative flex justify-center mb-6 sm:mb-8 md:mb-10">
            <div className="absolute inset-0 bg-[#357A32]/10 blur-3xl rounded-full scale-150" />
            <div className="relative bg-[#357A32] text-white p-4 sm:p-5 md:p-6 rounded-full shadow-2xl shadow-[#357A32]/30 animate-in zoom-in duration-500">
              <CheckCircle2
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                strokeWidth={1.5}
              />
            </div>
          </div>

          {/* Textes de confirmation */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-[#4B2E05] mb-3 sm:mb-4 md:mb-6">
            Commande confirmée !
          </h1>
          <p className="font-seasons text-sm sm:text-base md:text-lg mb-8 sm:mb-10 md:mb-12 leading-relaxed max-w-lg mx-auto">
            Merci pour votre confiance. Votre commande a été enregistrée avec
            succès et est en cours de préparation.
          </p>

          {/* Bloc d'information livraison/paiement */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12">
            <div className="bg-[#FDFCF9] p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl md:rounded-3xl border border-gray-50 flex flex-col items-center">
              <Clock className="text-[#357A32] mb-2 sm:mb-3 w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs sm:text-sm md:text-base uppercase tracking-wider sm:tracking-widest mb-0.5 sm:mb-1 font-seasons">
                Délai estimé
              </span>
              <span className="font-bold text-[#4B2E05] text-sm sm:text-base">
                24h à 48h
              </span>
            </div>
            <div className="bg-[#FDFCF9] p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl md:rounded-3xl border border-gray-100 flex flex-col items-center">
              <Truck className="text-[#357A32] mb-2 sm:mb-3 w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs sm:text-sm md:text-base uppercase tracking-wider sm:tracking-widest mb-0.5 sm:mb-1 font-seasons">
                Paiement
              </span>
              <span className="font-bold text-[#4B2E05] text-sm sm:text-base">
                À la livraison (Cash)
              </span>
            </div>
          </div>

          {/* Étapes suivantes */}
          <div className="text-left space-y-3 sm:space-y-4 mb-8 sm:mb-10 md:mb-12 bg-gray-50/50 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl">
            <h3 className="font-seasons text-xs sm:text-sm md:text-base uppercase tracking-wider sm:tracking-widest text-[#4B2E05] border-b border-gray-200 pb-2 mb-3 sm:mb-4">
              Prochaines étapes
            </h3>
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#357A32] text-white flex items-center justify-center text-[9px] sm:text-[10px] shrink-0 mt-0.5 sm:mt-0">
                1
              </div>
              <p className="font-seasons text-sm sm:text-base md:text-lg">
                Vous allez recevoir un SMS de confirmation.
              </p>
            </div>
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#357A32] text-white flex items-center justify-center text-[9px] sm:text-[10px] shrink-0 mt-0.5 sm:mt-0">
                2
              </div>
              <p className="font-seasons text-sm sm:text-base md:text-lg">
                Notre livreur vous contactera par téléphone avant son passage.
              </p>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => navigate('/products')}
              className="bg-[#4B2E05] text-white px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-seasons uppercase text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] hover:bg-[#357A32] transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Retour à la boutique
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-seasons uppercase text-sm sm:text-base md:text-lg tracking-[0.15em] sm:tracking-[0.2em] hover:text-[#4B2E05] hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              Accueil
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message de support */}
        <p className="text-center mt-6 sm:mt-8 text-xs sm:text-sm md:text-base font-seasons leading-relaxed px-2">
          Une question ? Contactez notre service client au{' '}
          <span className="text-[#357A32] font-bold whitespace-nowrap">
            +216 -- --- ---
          </span>
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;