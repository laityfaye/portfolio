import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSave, FaEye, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaTwitter, FaCheck } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { portfolioApi } from '../../api/portfolio';
import toast from 'react-hot-toast';

const ContactEditor = ({ portfolio, onUpdate }) => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Thème rouge fixe pour le dashboard
  const dashboardTheme = {
    gradient: 'from-red-500 to-red-600',
    primary: {
      main: '#ef4444',
      dark: '#dc2626',
      light: '#f87171'
    }
  };

  const [formData, setFormData] = useState({
    contact_info: portfolio?.contact_info || { email: '', phone: '', location: '' },
    social_links: portfolio?.social_links || {
      github: '',
      linkedin: '',
      twitter: ''
    },
  });

  useEffect(() => {
    if (portfolio) {
      setFormData({
        contact_info: portfolio.contact_info || { email: '', phone: '', location: '' },
        social_links: {
          github: '',
          linkedin: '',
          twitter: '',
          ...portfolio.social_links
        },
      });
    }
  }, [portfolio]);

  const handleContactChange = (field, value) => {
    setFormData({
      ...formData,
      contact_info: { ...formData.contact_info, [field]: value },
    });
  };

  const handleSocialChange = (field, value) => {
    setFormData({
      ...formData,
      social_links: { ...formData.social_links, [field]: value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await portfolioApi.update(formData);
      toast.success('Informations de contact mises à jour avec succès!');
      onUpdate();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  // Validation des URLs
  const isValidUrl = (url) => {
    if (!url) return true; // Vide est valide (optionnel)
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Validation de l'email
  const isValidEmail = (email) => {
    if (!email) return true; // Vide est valide (optionnel)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validation du téléphone
  const isValidPhone = (phone) => {
    if (!phone) return true; // Vide est valide (optionnel)
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const socialLinksConfig = [
    { key: 'github', label: 'GitHub', icon: FaGithub, placeholder: 'https://github.com/votre-username' },
    { key: 'linkedin', label: 'LinkedIn', icon: FaLinkedin, placeholder: 'https://linkedin.com/in/votre-profil' },
    { key: 'twitter', label: 'Twitter', icon: FaTwitter, placeholder: 'https://twitter.com/votre-handle' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex-1 min-w-0">
          <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r ${dashboardTheme.gradient} bg-clip-text text-transparent`}>
            Contact
          </h1>
          <p className={`text-sm sm:text-base md:text-lg mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Gérez vos informations de contact et réseaux sociaux
          </p>
        </div>
        <motion.button
          onClick={() => setShowPreview(!showPreview)}
          className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-xl font-semibold transition-all flex items-center gap-2 text-xs sm:text-sm md:text-base whitespace-nowrap ${
            showPreview
              ? `bg-gradient-to-r ${dashboardTheme.gradient} text-white shadow-lg shadow-red-500/30`
              : isDarkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaEye />
          {showPreview ? 'Masquer l\'aperçu' : 'Aperçu'}
        </motion.button>
      </motion.div>

      {/* Preview Section */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`glass-effect-strong rounded-xl p-6 border overflow-hidden ${
              isDarkMode ? 'border-gray-800' : 'border-gray-200'
            }`}
          >
            <div className={`p-8 rounded-lg ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
              {/* Contact Info Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {formData.contact_info.email && (
                  <div className={`p-4 rounded-xl border ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${dashboardTheme.gradient}`}>
                        <FaEnvelope className="text-white" />
                      </div>
                      <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email
                      </span>
                    </div>
                    <a
                      href={`mailto:${formData.contact_info.email}`}
                      className={`text-sm ${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}
                    >
                      {formData.contact_info.email}
                    </a>
                  </div>
                )}
                {formData.contact_info.phone && (
                  <div className={`p-4 rounded-xl border ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${dashboardTheme.gradient}`}>
                        <FaPhone className="text-white" />
                      </div>
                      <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Téléphone
                      </span>
                    </div>
                    <a
                      href={`tel:${formData.contact_info.phone.replace(/\s/g, '')}`}
                      className={`text-sm ${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}
                    >
                      {formData.contact_info.phone}
                    </a>
                  </div>
                )}
                {formData.contact_info.location && (
                  <div className={`p-4 rounded-xl border ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${dashboardTheme.gradient}`}>
                        <FaMapMarkerAlt className="text-white" />
                      </div>
                      <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Localisation
                      </span>
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formData.contact_info.location}
                    </p>
                  </div>
                )}
              </div>

              {/* Social Links Preview */}
              <div>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Réseaux sociaux
                </h3>
                <div className="flex flex-wrap gap-3">
                  {socialLinksConfig.map(({ key, label, icon: Icon }) => {
                    const url = formData.social_links[key];
                    if (!url) return null;
                    
                    return (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                          isDarkMode
                            ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon />
                        <span className="text-sm font-medium">{label}</span>
                      </a>
                    );
                  })}
                </div>
                {socialLinksConfig.every(({ key }) => !formData.social_links[key]) && (
                  <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Aucun réseau social configuré
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`glass-effect-strong rounded-xl p-6 border space-y-6 ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${dashboardTheme.gradient}`}>
              <FaEnvelope className="text-white text-xl" />
            </div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Informations de contact
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Email */}
            <div>
              <label className={`flex items-center gap-2 text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <FaEnvelope className="text-red-500" />
                Email
                {formData.contact_info.email && isValidEmail(formData.contact_info.email) && (
                  <FaCheck className="text-green-500 text-xs" />
                )}
              </label>
              <input
                type="email"
                value={formData.contact_info.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
                className={`w-full px-4 py-3 glass-effect rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all ${
                  isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                } ${
                  formData.contact_info.email
                    ? isValidEmail(formData.contact_info.email)
                      ? (isDarkMode ? 'border border-green-500/30' : 'border border-green-300')
                      : (isDarkMode ? 'border border-red-500/50' : 'border border-red-300')
                    : ''
                }`}
                placeholder="votre@email.com"
              />
              {formData.contact_info.email && !isValidEmail(formData.contact_info.email) && (
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                  Format d'email invalide
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className={`flex items-center gap-2 text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <FaPhone className="text-red-500" />
                Téléphone
                {formData.contact_info.phone && isValidPhone(formData.contact_info.phone) && (
                  <FaCheck className="text-green-500 text-xs" />
                )}
              </label>
              <input
                type="tel"
                value={formData.contact_info.phone}
                onChange={(e) => handleContactChange('phone', e.target.value)}
                className={`w-full px-4 py-3 glass-effect rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all ${
                  isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                } ${
                  formData.contact_info.phone
                    ? isValidPhone(formData.contact_info.phone)
                      ? (isDarkMode ? 'border border-green-500/30' : 'border border-green-300')
                      : (isDarkMode ? 'border border-red-500/50' : 'border border-red-300')
                    : ''
                }`}
                placeholder="+221 77 123 45 67"
              />
              {formData.contact_info.phone && !isValidPhone(formData.contact_info.phone) && (
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                  Format de téléphone invalide
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className={`flex items-center gap-2 text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <FaMapMarkerAlt className="text-red-500" />
                Localisation
                {formData.contact_info.location && <FaCheck className="text-green-500 text-xs" />}
              </label>
              <input
                type="text"
                value={formData.contact_info.location}
                onChange={(e) => handleContactChange('location', e.target.value)}
                className={`w-full px-4 py-3 glass-effect rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all ${
                  isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                } ${
                  formData.contact_info.location
                    ? (isDarkMode ? 'border border-green-500/30' : 'border border-green-300')
                    : ''
                }`}
                placeholder="Dakar, Sénégal"
                maxLength="100"
              />
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`glass-effect-strong rounded-xl p-6 border space-y-6 ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${dashboardTheme.gradient}`}>
              <FaGithub className="text-white text-xl" />
            </div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Réseaux sociaux
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {socialLinksConfig.map(({ key, label, icon: Icon, placeholder }) => {
              const value = formData.social_links[key] || '';
              const isValid = isValidUrl(value);
              
              return (
                <div key={key}>
                  <label className={`flex items-center gap-2 text-sm font-semibold mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <Icon className="text-red-500" />
                    {label}
                    {value && isValid && <FaCheck className="text-green-500 text-xs" />}
                  </label>
                  <input
                    type="url"
                    value={value}
                    onChange={(e) => handleSocialChange(key, e.target.value)}
                    className={`w-full px-4 py-3 glass-effect rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all ${
                      isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                    } ${
                      value
                        ? isValid
                          ? (isDarkMode ? 'border border-green-500/30' : 'border border-green-300')
                          : (isDarkMode ? 'border border-red-500/50' : 'border border-red-300')
                        : ''
                    }`}
                    placeholder={placeholder}
                  />
                  {value && !isValid && (
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                      Format d'URL invalide
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-end"
        >
          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r ${dashboardTheme.gradient} text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm sm:text-base`}
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
          >
            <FaSave />
            {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </motion.button>
        </motion.div>
      </form>
    </div>
  );
};

export default ContactEditor;
