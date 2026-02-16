import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { authApi } from '../api/auth';
import toast, { Toaster } from 'react-hot-toast';

const ResetPassword = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [formData, setFormData] = useState({
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      toast.error('Lien invalide. Demandez un nouveau lien.');
    }
  }, [token, email]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    if (formData.password.length < 8) {
      toast.error('Le mot de passe doit faire au moins 8 caractères');
      return;
    }
    if (!token || !email) {
      toast.error('Lien invalide');
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword({
        email,
        token,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });
      setSuccess(true);
      toast.success('Mot de passe mis à jour. Vous pouvez vous connecter.');
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (error) {
      const msg = error.response?.data?.message;
      toast.error(msg || 'Lien expiré ou invalide. Demandez un nouveau lien.');
    } finally {
      setLoading(false);
    }
  };

  const validLink = token && email;

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${
      isDarkMode ? 'bg-gray-950' : 'bg-gray-50'
    }`}>
      <Toaster position="top-center" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-11 h-11 bg-red-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg font-bold">IS</span>
            </div>
            <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              InnoSoft
            </span>
          </Link>
        </div>

        <div className={`rounded-2xl p-8 ${
          isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white shadow-sm border border-gray-100'
        }`}>
          <div className="text-center mb-6">
            <h1 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Nouveau mot de passe
            </h1>
            <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Choisissez un nouveau mot de passe (min. 8 caractères).
            </p>
          </div>

          {!validLink ? (
            <div className={`text-center py-4 rounded-xl ${isDarkMode ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                Lien invalide ou manquant. Utilisez le lien reçu par email ou demandez-en un nouveau.
              </p>
              <Link
                to="/forgot-password"
                className="inline-block mt-4 text-sm font-medium text-red-500 hover:text-red-600"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          ) : success ? (
            <div className={`text-center py-4 rounded-xl ${isDarkMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                Mot de passe mis à jour. Redirection vers la connexion...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="reset-password" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <FaLock className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    id="reset-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className={`w-full pl-11 pr-11 py-3 rounded-xl text-sm ${
                      isDarkMode
                        ? 'bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-red-500'
                        : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:bg-white'
                    } outline-none`}
                    placeholder="Min. 8 caractères"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="reset-password-confirm" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <FaLock className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    id="reset-password-confirm"
                    type={showPassword ? 'text' : 'password'}
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm ${
                      isDarkMode
                        ? 'bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-red-500'
                        : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:bg-white'
                    } outline-none`}
                    placeholder="Confirmer"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Mise à jour...
                  </span>
                ) : (
                  'Réinitialiser le mot de passe'
                )}
              </button>
            </form>
          )}

          {validLink && !success && (
            <p className={`text-center text-sm mt-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <Link to="/login" className="text-red-500 hover:text-red-600 font-medium">
                Retour à la connexion
              </Link>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
