import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  ArrowRight, 
  ShoppingBag,
  Clock
} from 'lucide-react';

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-whit flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Carte Principale */}
        <div className="bg-white rounded-[3rem] shadow-xl shadow-[#4B2E05]/5 p-8 md:p-16 text-center border border-gray-100">
          
          {/* Icône de succès animée */}
          <div className="relative flex justify-center mb-10">
            <div className="absolute inset-0 bg-[#357A32]/10 blur-3xl rounded-full scale-150"></div>
            <div className="relative bg-[#357A32] text-white p-6 rounded-full shadow-2xl shadow-[#357A32]/30 animate-in zoom-in duration-500">
              <CheckCircle2 size={48} strokeWidth={1.5} />
            </div>
          </div>

          {/* Textes de confirmation */}
          <h1 className="text-3xl md:text-5xl font-serif text-[#4B2E05] mb-6">
            Commande confirmée !
          </h1>
          <p className="font-seasons text-sm md:text-lg  mb-12 leading-relaxed">
            Merci pour votre confiance. Votre commande a été enregistrée avec succès et est en cours de préparation.
          </p>

          {/* Bloc d'information sur la livraison/paiement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <div className="bg-[#FDFCF9] p-6 rounded-3xl border border-gray-50 flex flex-col items-center">
              <Clock className="text-[#357A32] mb-3" size={24} />
              <span className="text-base md:text-lg uppercase tracking-widest  mb-1">Délai estimé</span>
              <span className="font-bold text-[#4B2E05]">24h à 48h</span>
            </div>
            <div className="bg-[#FDFCF9] p-6 rounded-3xl border border-gray-100 flex flex-col items-center">
              <Truck className="text-[#357A32] mb-3" size={24} />
              <span className="text-base md:text-lg uppercase tracking-widest  mb-1">Paiement</span>
              <span className="font-bold text-[#4B2E05]">À la livraison (Cash)</span>
            </div>
          </div>

          {/* Étapes suivantes */}
          <div className="text-left space-y-4 mb-12 bg-gray-50/50 p-6 rounded-2xl">
            <h3 className="font-seasons text-base md:text-lg  uppercase tracking-widest text-[#4B2E05] border-b border-gray-200 pb-2 mb-4">
              Prochaines étapes
            </h3>
            <div className="flex items-center gap-4 text-base md:text-lg font-seasons">
              <div className="w-6 h-6 rounded-full bg-[#357A32] text-white flex items-center justify-center text-[10px]">1</div>
              <p >Vous allez recevoir un SMS de confirmation.</p>
            </div>
            <div className="flex items-center gap-4 text-base md:text-lg font-seasons">
              <div className="w-6 h-6 rounded-full bg-[#357A32] text-white flex items-center justify-center text-[10px]">2</div>
              <p>Notre livreur vous contactera par téléphone avant son passage.</p>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/products')}
              className="bg-[#4B2E05] text-white px-10 py-5 rounded-2xl font-seasons uppercase text-xs tracking-[0.2em] hover:bg-[#357A32] transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} /> Retour à la boutique
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-10 py-5 rounded-2xl font-seasons uppercase text-base md:text-lg tracking-[0.2em] hover:text-[#4B2E05] transition-all flex items-center justify-center gap-2"
            >
              Accueil <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Message de support */}
        <p className="text-center mt-8  text-base md:text-lg font-seasons">
          Une question ? Contactez notre service client au 
          <span className="text-[#357A32] font-bold">+216 -- --- ---</span>
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;