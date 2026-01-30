import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPhone, FaCheck } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

const Register = () => {
  const { isDarkMode } = useTheme();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    const payload = {
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email.trim(),
      phone: formData.phone?.trim() || '',
      password: formData.password,
      password_confirmation: formData.password_confirmation,
    };

    try {
      await register(payload);
      toast.success('Compte créé avec succès !');
      navigate('/dashboard');
    } catch (error) {
      const errors = error.response?.data?.errors;
      if (errors && typeof errors === 'object') {
        const messages = Object.values(errors).flat();
        messages.slice(0, 3).forEach((msg) => toast.error(msg));
      } else {
        toast.error(error.response?.data?.message || "Erreur lors de l'inscription");
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = formData.password_confirmation && formData.password === formData.password_confirmation;

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
        {/* Logo */}
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

        {/* Card */}
        <div className={`rounded-2xl p-8 ${
          isDarkMode
            ? 'bg-gray-900 border border-gray-800'
            : 'bg-white shadow-sm border border-gray-100'
        }`}>
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Créer un compte
            </h1>
            <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Lancez votre portfolio professionnel
            </p>
          </div>

          {/* Price badge */}
          <div className={`mb-6 p-3 rounded-xl text-center ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
          }`}>
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Prix unique :
            </span>
            <span className="text-red-500 font-semibold ml-1">2 500 FCFA</span>
            <span className={`text-xs ml-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              (Accès à vie)
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
            {/* Name fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="register-first_name" className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Prénom
                </label>
                <div className="relative">
                  <FaUser className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <input
                    id="register-first_name"
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    autoComplete="given-name"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-sm transition-colors ${
                      isDarkMode
                        ? 'bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-red-500'
                        : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:bg-white'
                    } outline-none`}
                    placeholder="Prénom"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="register-last_name" className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Nom
                </label>
                <input
                  id="register-last_name"
                  type="text"
                  name="last_name"
value={formData.last_name}
                    onChange={handleChange}
                    required
                    autoComplete="family-name"
                    className={`w-full px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      isDarkMode
                        ? 'bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-red-500'
                        : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:bg-white'
                    } outline-none`}
                    placeholder="Nom"
                  />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="register-email" className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email
              </label>
              <div className="relative">
                <FaEnvelope className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <input
                  id="register-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-sm transition-colors ${
                    isDarkMode
                      ? 'bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-red-500'
                      : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:bg-white'
                  } outline-none`}
                  placeholder="Votre email"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="register-phone" className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Téléphone <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>(optionnel)</span>
              </label>
              <div className="relative">
                <FaPhone className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <input
                  id="register-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-sm transition-colors ${
                    isDarkMode
                      ? 'bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-red-500'
                      : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:bg-white'
                  } outline-none`}
                  placeholder="Votre téléphone"
                />
              </div>
            </div>

            {/* Password fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Mot de passe
                </label>
                <div className="relative">
                  <FaLock className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className={`w-full pl-9 pr-9 py-2.5 rounded-xl text-sm transition-colors ${
                      isDarkMode
                        ? 'bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-red-500'
                        : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:bg-white'
                    } outline-none`}
                    placeholder="Mot de passe (min. 8 caractères)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                      isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {showPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                  </button>
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Confirmer
                </label>
                <div className="relative">
                  <FaLock className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className={`w-full pl-9 pr-9 py-2.5 rounded-xl text-sm transition-colors ${
                      isDarkMode
                        ? 'bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-red-500'
                        : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:bg-white'
                    } ${passwordsMatch ? 'border-green-500' : ''} outline-none`}
                    placeholder="Confirmer le mot de passe"
                  />
                  {passwordsMatch && (
                    <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-xs" />
                  )}
                </div>
              </div>
            </div>

            {/* Info */}
            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Après inscription, téléchargez votre preuve de paiement pour activer votre compte.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Création...
                </span>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </form>

          {/* Login link */}
          <p className={`text-center text-sm mt-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Déjà un compte ?{' '}
            <Link to="/login" className="text-red-500 hover:text-red-600 font-medium">
              Se connecter
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className={`text-center text-xs mt-6 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
          © 2024 InnoSoft. Tous droits réservés.
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
