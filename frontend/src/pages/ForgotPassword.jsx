import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { authApi } from '../api/auth';
import toast, { Toaster } from 'react-hot-toast';

const ForgotPassword = () => {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error('Veuillez entrer votre email');
      return;
    }
    setLoading(true);
    try {
      await authApi.forgotPassword(trimmed);
      setSent(true);
      toast.success('Si cet email existe, un lien vous a été envoyé.');
    } catch (error) {
      const msg = error.response?.data?.message;
      toast.error(msg || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <Toaster position="top-center" />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/login" className="inline-flex items-center gap-3">
            <div className="w-11 h-11 bg-red-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg font-bold">IS</span>
            </div>
            <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>InnoSoft</span>
          </Link>
        </div>
        <div className={`rounded-2xl p-8 ${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white shadow-sm border border-gray-100'}`}>
          <div className="text-center mb-6">
            <h1 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Mot de passe oublié</h1>
            <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>
          </div>
          {sent ? (
            <div className={`text-center py-4 rounded-xl ${isDarkMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                Vérifiez votre boîte mail (et les spams). Le lien est valide 1 heure.
              </p>
              <Link to="/login" className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-red-500 hover:text-red-600">
                <FaArrowLeft /> Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="forgot-email" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                  <div className="relative">
                    <FaEnvelope className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm ${isDarkMode ? 'bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-red-500' : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:bg-white'} outline-none`}
                      placeholder="Votre email"
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
                      Envoi en cours...
                    </span>
                  ) : (
                    'Envoyer le lien'
                  )}
                </button>
              </form>
              <p className={`text-center text-sm mt-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Link to="/login" className="inline-flex items-center gap-1 text-red-500 hover:text-red-600 font-medium">
                  <FaArrowLeft className="text-xs" /> Retour à la connexion
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
