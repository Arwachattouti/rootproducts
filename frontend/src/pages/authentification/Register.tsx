import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useRegisterMutation } from '../../state/apiService';
import { useSelector } from 'react-redux';
import { selectUser } from '../../state/slices/userSlice';
import { RegisterData } from '../../types';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [register, { isLoading, error, isSuccess }] = useRegisterMutation(); 
  const { isAuthenticated } = useSelector(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => navigate('/', { replace: true }), 1500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Prénom requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Nom requis';
    if (!formData.email.trim()) {
      newErrors.email = "Email requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format invalide";
    }
    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Minimum 6 caractères';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe diffèrent';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await register(formData as RegisterData).unwrap();
    } catch (err: any) {
      console.error("Erreur d'inscription:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: 'bg-gray-200' };
    if (password.length < 6) return { strength: 1, label: 'Faible', color: 'bg-red-400' };
    if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)) return { strength: 3, label: 'Fort', color: 'bg-[#357A32]' };
    return { strength: 2, label: 'Moyen', color: 'bg-orange-400' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const getErrorMessage = (err: any): string => {
    if (err && 'data' in err) return (err.data as any)?.message || "Erreur serveur";
    return "Une erreur est survenue lors de l'inscription.";
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-4xl font-serif italic text-[#4B2E05]">ROOT Products</h2>
        {/* CHANGÉ : text-gray-500 -> text-zinc-500 pour plus de clarté */}
        <p className="mt-2 text-sm text-zinc-500 uppercase tracking-[0.2em]">Rejoignez notre communauté</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-xl border border-gray-100 rounded-[2.5rem] sm:px-10">
          
          {error && (
            <div className="p-4 mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl flex items-center animate-in fade-in zoom-in-95">
              <AlertCircle className="h-5 w-5 mr-3 shrink-0" />
              <span className="text-xs font-bold uppercase">{getErrorMessage(error)}</span>
            </div>
          )}

          {isSuccess && (
            <div className="p-4 mb-6 bg-green-50 border-l-4 border-[#357A32] text-[#357A32] rounded-r-xl flex items-center animate-bounce">
              <CheckCircle className="h-5 w-5 mr-3 shrink-0" />
              <span className="text-xs font-bold uppercase">Bienvenue ! Redirection...</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                {/* CHANGÉ : text-gray-400 -> text-slate-500 (Plus lisible sur blanc) */}
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Prénom</label>
                <div className="relative">
                  <input name="firstName" type="text" value={formData.firstName} onChange={handleChange}
                    className={`w-full px-4 py-3 pl-10 border rounded-xl outline-none transition-all ${errors.firstName ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-100 focus:border-[#357A32]'}`} 
                  />
                  <User className="h-4 w-4 text-gray-300 absolute left-3.5 top-3.5" />
                </div>
              </div>
              <div className="space-y-1">
                {/* CHANGÉ : text-gray-400 -> text-slate-500 */}
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nom</label>
                <div className="relative">
                  <input name="lastName" type="text" value={formData.lastName} onChange={handleChange}
                    className={`w-full px-4 py-3 pl-10 border rounded-xl outline-none transition-all ${errors.lastName ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-100 focus:border-[#357A32]'}`} 
                  />
                  <User className="h-4 w-4 text-gray-300 absolute left-3.5 top-3.5" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              {/* CHANGÉ : text-gray-400 -> text-slate-500 */}
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Adresse email</label>
              <div className="relative">
                <input name="email" type="email" value={formData.email} onChange={handleChange}
                  className={`w-full px-4 py-3 pl-10 border rounded-xl outline-none transition-all ${errors.email ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-100 focus:border-[#357A32]'}`} 
                />
                <Mail className="h-4 w-4 text-gray-300 absolute left-3.5 top-3.5" />
              </div>
              {errors.email && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              {/* CHANGÉ : text-gray-400 -> text-slate-500 */}
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Mot de passe</label>
              <div className="relative">
                <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange}
                  className={`w-full px-4 py-3 pl-10 pr-10 border rounded-xl outline-none transition-all ${errors.password ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-100 focus:border-[#357A32]'}`} 
                />
                <Lock className="h-4 w-4 text-gray-300 absolute left-3.5 top-3.5" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-300 hover:text-gray-500">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {formData.password && (
                <div className="mt-2 px-1">
                  <div className="flex justify-between items-center mb-1">
                    {/* CHANGÉ : text-gray-400 -> text-slate-400 (discret pour la barre) */}
                    <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-400">Sécurité: {passwordStrength.label}</span>
                  </div>
                  <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-500 ${passwordStrength.color}`} style={{ width: `${(passwordStrength.strength / 3) * 100}%` }} />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1">
              {/* CHANGÉ : text-gray-400 -> text-slate-500 */}
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Confirmation</label>
              <div className="relative">
                <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange}
                  className={`w-full px-4 py-3 pl-10 border rounded-xl outline-none transition-all ${errors.confirmPassword ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-100 focus:border-[#357A32]'}`} 
                />
                <Lock className="h-4 w-4 text-gray-300 absolute left-3.5 top-3.5" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3.5 text-gray-300 hover:text-gray-500">
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-start p-1">
              <input id="terms" type="checkbox" required className="mt-1 h-3.5 w-3.5 text-[#357A32] border-gray-300 rounded focus:ring-0 cursor-pointer" />
              {/* CHANGÉ : text-gray-500 -> text-zinc-600 (Plus pro pour du texte de lecture) */}
              <label htmlFor="terms" className="ml-2 text-[11px] text-zinc-600 leading-tight">
                J'accepte les <Link to="/terms" className="text-[#357A32] font-bold hover:underline">Conditions</Link> et la <Link to="/privacy" className="text-[#357A32] font-bold hover:underline">Politique de confidentialité</Link>.
              </label>
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full bg-[#4B2E05] hover:bg-[#357A32] text-white py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-black/10 transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Créer mon compte'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            {/* CHANGÉ : text-gray-400 -> text-slate-500 */}
            <p className="text-xs text-slate-500 font-medium">
              DÉJÀ PARMI NOUS ?{' '}
              <Link to="/login" className="text-[#357A32] font-bold hover:underline ml-1">
                SE CONNECTER
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;