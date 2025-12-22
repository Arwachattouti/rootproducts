import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useLoginMutation } from '../../state/apiService';
import { useSelector } from 'react-redux';
import { selectUser } from '../../state/slices/userSlice';
import { LoginCredentials } from '../../types';

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading, error }] = useLoginMutation();
  const { isAuthenticated } = useSelector(selectUser);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData).unwrap();
    } catch (err) {
      console.error('Échec de la connexion:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getErrorMessage = (err: any): string => {
    if (err && 'data' in err) {
      return (err.data as any)?.message || 'Une erreur est survenue côté serveur.';
    }
    return 'Email ou mot de passe incorrect.';
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-4xl font-serif italic text-[#4B2E05]">ROOT Products</h2>
        {/* CHANGÉ : text-gray-500 -> text-zinc-500 */}
        <p className="mt-2 text-sm text-zinc-500 uppercase tracking-widest">Connectez-vous à votre espace</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-xl border border-gray-100 rounded-[2.5rem] sm:px-10">
          
          {error && (
            <div className="p-4 mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl flex items-center animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="h-5 w-5 mr-3 shrink-0" />
              <p className="text-xs font-bold uppercase">{getErrorMessage(error)}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1">
              {/* CHANGÉ : text-gray-400 -> text-slate-500 (plus lisible) */}
              <label htmlFor="email" className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                Adresse email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 pl-11 border border-gray-100 rounded-xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#357A32]/10 focus:border-[#357A32] transition-all"
                  placeholder="votre@email.com"
                />
                <Mail className="h-5 w-5 text-gray-300 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              {/* CHANGÉ : text-gray-400 -> text-slate-500 */}
              <label htmlFor="password" className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 pl-11 pr-11 border border-gray-100 rounded-xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#357A32]/10 focus:border-[#357A32] transition-all"
                  placeholder="••••••••"
                />
                <Lock className="h-5 w-5 text-gray-300 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-300 hover:text-gray-500 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#357A32] focus:ring-0 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs font-medium text-zinc-600 cursor-pointer">
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-xs uppercase tracking-tighter font-bold">
                <Link to="/forgot-password" title="Fonction bientôt disponible" className="text-[#357A32] hover:underline underline-offset-4 transition-colors">
                  Oublié ?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#4B2E05] hover:bg-[#357A32] text-white py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-black/10 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-50" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                {/* CHANGÉ : text-gray-400 -> text-slate-500 */}
                <span className="px-4 bg-white text-slate-500">Nouveau chez ROOT ?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/register"
                className="text-xs font-bold text-[#357A32] hover:underline underline-offset-8 decoration-2 uppercase tracking-widest"
              >
                Créer un compte maintenant
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;