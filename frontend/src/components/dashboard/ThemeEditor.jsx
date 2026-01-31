import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSave, FaSun, FaMoon, FaPalette, FaCheck, FaTimes, FaLayerGroup, FaAlignLeft, FaCog, FaExternalLinkAlt, FaSync, FaCreditCard, FaGlobe, FaSpinner } from 'react-icons/fa';
import { useTheme, themes } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { portfolioApi } from '../../api/portfolio';
import { paymentsApi } from '../../api/payments';
import toast from 'react-hot-toast';

const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Design dynamique avec hero immersif, orbes animés et sections colorées.',
    icon: FaLayerGroup,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Layout professionnel avec sidebar fixe et mise en page sobre.',
    icon: FaAlignLeft,
  },
];

// Customization Panel Component
const CustomizationPanel = ({
  isOpen,
  onClose,
  selectedColor,
  setSelectedColor,
  selectedMode,
  setSelectedMode,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`absolute top-0 right-0 h-full w-full max-w-[100vw] sm:w-72 z-[60] shadow-2xl overflow-y-auto ${
            isDarkMode ? 'bg-gray-900 border-l border-gray-800' : 'bg-white border-l border-gray-200'
          }`}
        >
          {/* Panel Header */}
          <div className={`sticky top-0 p-3 border-b ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Personnalisation
              </h3>
              <button
                onClick={onClose}
                className={`p-1.5 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
          </div>

          <div className="p-3 space-y-4">
            {/* Mode Toggle */}
            <div>
              <label className={`block text-xs font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Mode d'affichage
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedMode('light')}
                  className={`flex-1 p-2.5 rounded-lg flex items-center justify-center gap-2 transition-all text-sm ${
                    selectedMode === 'light'
                      ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/30'
                      : isDarkMode
                        ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FaSun className="text-xs" />
                  Clair
                </button>
                <button
                  onClick={() => setSelectedMode('dark')}
                  className={`flex-1 p-2.5 rounded-lg flex items-center justify-center gap-2 transition-all text-sm ${
                    selectedMode === 'dark'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                      : isDarkMode
                        ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FaMoon className="text-xs" />
                  Sombre
                </button>
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className={`block text-xs font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Couleur principale
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {Object.entries(themes).map(([name, themeColors]) => {
                  const isSelected = selectedColor === name;
                  return (
                    <motion.button
                      key={name}
                      onClick={() => setSelectedColor(name)}
                      className={`relative w-full aspect-square rounded-lg transition-all ${
                        isSelected ? 'ring-2 ring-offset-1' : ''
                      }`}
                      style={{
                        backgroundColor: themeColors.primary.main,
                        boxShadow: isSelected ? `0 0 15px ${themeColors.primary.main}50` : 'none',
                        ringColor: themeColors.primary.main,
                        ringOffsetColor: isDarkMode ? '#111827' : '#ffffff'
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      title={themeColors.name}
                    >
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg"
                        >
                          <FaCheck className="text-white text-xs drop-shadow-lg" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <p className={`mt-1.5 text-xs text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {themes[selectedColor]?.name || selectedColor}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Preview Modal Component
const PreviewModal = ({
  isOpen,
  onClose,
  portfolioUrl,
  selectedTemplate,
  selectedColor,
  setSelectedColor,
  selectedMode,
  setSelectedMode,
  onSave,
  loading,
  isActive,
  isPublished,
  onPayToPublish,
  payPublishLoading,
}) => {
  const [showCustomization, setShowCustomization] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const { isDarkMode } = useTheme();
  const iframeRef = useRef(null);

  // Build preview URL with query params
  const previewUrl = `${portfolioUrl}?preview=1&template=${selectedTemplate}&color=${selectedColor}&mode=${selectedMode}&t=${iframeKey}`;

  // Refresh iframe when settings change
  const refreshPreview = () => {
    setIframeLoaded(false);
    setIframeKey(prev => prev + 1);
  };

  // Reset iframe loaded when modal opens or url changes
  useEffect(() => {
    if (isOpen) {
      setIframeLoaded(false);
    }
  }, [isOpen, previewUrl]);

  // Close customization panel when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowCustomization(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (showCustomization) {
          setShowCustomization(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showCustomization, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4"
        >
          {/* Backdrop (apparition rapide) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !showCustomization && onClose()}
          />

          {/* Modal Content - Plein écran mobile, centré desktop */}
          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`relative w-full h-full sm:h-[75vh] sm:max-h-[85vh] sm:max-w-5xl sm:rounded-xl overflow-hidden shadow-2xl flex flex-col ${
              isDarkMode ? 'bg-gray-900' : 'bg-white'
            }`}
          >
            {/* Modal Header - empilé sur mobile, une ligne sur desktop */}
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-3 py-2 sm:px-4 sm:py-2.5 flex-shrink-0 ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
            } border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center gap-2 min-w-0">
                <h2 className={`text-sm font-bold truncate ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {TEMPLATES.find(t => t.id === selectedTemplate)?.name}
                </h2>
                <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs whitespace-nowrap ${
                  isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                }`}>
                  {themes[selectedColor]?.name} • {selectedMode === 'dark' ? 'Sombre' : 'Clair'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap justify-end">
                {/* Enregistrer */}
                <motion.button
                  onClick={onSave}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/30 hover:shadow-red-500/40"
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                  title="Enregistrer le thème"
                >
                  {loading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <>
                      <FaSave className="text-xs" />
                      <span className="hidden sm:inline">Enregistrer</span>
                    </>
                  )}
                </motion.button>

                {/* Badge Portfolio publié ou Bouton Payer pour publier / Publier */}
                {isPublished ? (
                  <span className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold text-xs bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30`}>
                    <FaGlobe className="text-xs" />
                    <span>Portfolio publié</span>
                  </span>
                ) : (
                  <motion.button
                    onClick={onPayToPublish}
                    disabled={payPublishLoading}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      isActive
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/30 hover:shadow-green-500/40'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/30 hover:shadow-amber-500/40'
                    }`}
                    whileHover={{ scale: payPublishLoading ? 1 : 1.05 }}
                    whileTap={{ scale: payPublishLoading ? 1 : 0.95 }}
                    title={isActive ? 'Publier le portfolio' : 'Payer pour publier'}
                  >
                    {payPublishLoading ? (
                      <FaSpinner className="animate-spin" />
                    ) : isActive ? (
                      <>
                        <FaGlobe className="text-xs" />
                        <span className="hidden sm:inline">Publier</span>
                      </>
                    ) : (
                      <>
                        <FaCreditCard className="text-xs" />
                        <span className="hidden sm:inline">Payer pour publier</span>
                      </>
                    )}
                  </motion.button>
                )}

                {/* Refresh Button */}
                <motion.button
                  onClick={refreshPreview}
                  className={`p-2 rounded-lg transition-all ${
                    isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Rafraîchir"
                >
                  <FaSync className="text-xs" />
                </motion.button>

                {/* Customize Button */}
                <motion.button
                  onClick={() => setShowCustomization(!showCustomization)}
                  className={`p-2 rounded-lg transition-all flex items-center gap-1.5 ${
                    showCustomization
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Personnaliser"
                >
                  <FaPalette className="text-xs" />
                </motion.button>

                {/* Open in new tab */}
                <motion.button
                  onClick={() => window.open(portfolioUrl, '_blank')}
                  className={`p-2 rounded-lg transition-all ${
                    isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Ouvrir dans un nouvel onglet"
                >
                  <FaExternalLinkAlt className="text-xs" />
                </motion.button>

                {/* Close Button */}
                <motion.button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-all ${
                    isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-red-500/20 hover:text-red-400'
                      : 'bg-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-500'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Fermer"
                >
                  <FaTimes className="text-xs" />
                </motion.button>
              </div>
            </div>

            {/* Portfolio iframe + loader - flex-1 pour occuper l'espace sur mobile */}
            <div className="relative w-full flex-1 min-h-0 bg-gray-800/50">
              <iframe
                ref={iframeRef}
                key={iframeKey}
                src={previewUrl}
                className="w-full h-full border-0"
                title="Aperçu du portfolio"
                onLoad={() => setIframeLoaded(true)}
              />
              {/* Overlay de chargement jusqu'à ce que l'iframe soit prête */}
              <AnimatePresence>
                {!iframeLoaded && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-900/95"
                  >
                    <FaSpinner className="text-3xl text-red-500 animate-spin" />
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Chargement de l'aperçu...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Customization Panel */}
              <CustomizationPanel
                isOpen={showCustomization}
                onClose={() => setShowCustomization(false)}
                selectedColor={selectedColor}
                setSelectedColor={(color) => {
                  setSelectedColor(color);
                  refreshPreview();
                }}
                selectedMode={selectedMode}
                setSelectedMode={(mode) => {
                  setSelectedMode(mode);
                  refreshPreview();
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ThemeEditor = ({ portfolio, onUpdate }) => {
  const { isDarkMode } = useTheme();
  const { isActive, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [payPublishLoading, setPayPublishLoading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [preloadTemplateId, setPreloadTemplateId] = useState(null);
  const [selectedColor, setSelectedColor] = useState(portfolio?.theme_color || 'cyan');
  const [selectedMode, setSelectedMode] = useState(portfolio?.theme_mode || 'dark');
  const [selectedTemplate, setSelectedTemplate] = useState(portfolio?.template || 'classic');

  // Build preview URL (uses authenticated preview route)
  const portfolioUrl = `${window.location.origin}/p/preview`;
  const preloadUrl = preloadTemplateId
    ? `${portfolioUrl}?preview=1&template=${preloadTemplateId}&color=${portfolio?.theme_color || 'cyan'}&mode=${portfolio?.theme_mode || 'dark'}&t=preload`
    : null;

  // Thème rouge fixe pour le dashboard
  const dashboardTheme = {
    gradient: 'from-red-500 to-red-600',
    primary: {
      main: '#ef4444',
      dark: '#dc2626',
      light: '#f87171'
    }
  };

  useEffect(() => {
    if (portfolio) {
      setSelectedColor(portfolio.theme_color || 'cyan');
      setSelectedMode(portfolio.theme_mode || 'dark');
      setSelectedTemplate(portfolio.template || 'classic');
    }
  }, [portfolio]);

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    setShowPreviewModal(true);
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      await portfolioApi.updateTheme({
        theme_color: selectedColor,
        theme_mode: selectedMode,
        template: selectedTemplate,
      });
      toast.success('Thème mis à jour avec succès!');
      onUpdate();
      setShowPreviewModal(false);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handlePayToPublish = async () => {
    setPayPublishLoading(true);
    try {
      if (isActive) {
        await portfolioApi.publish();
        toast.success('Portfolio publié avec succès !');
        onUpdate();
        setShowPreviewModal(false);
      } else {
        const response = await paymentsApi.requestPayTech();
        if (response?.redirect_url) {
          if (response.ref_command) {
            sessionStorage.setItem('paytech_ref_command', response.ref_command);
          }
          window.location.href = response.redirect_url;
        } else {
          toast.error(response?.message || 'Erreur lors de la création du paiement');
        }
      }
    } catch (error) {
      const data = error.response?.data;
      const msg = data?.message
        || (typeof data?.errors === 'object' ? Object.values(data.errors).flat().join(' ') : null)
        || (isActive ? 'Erreur lors de la publication' : 'Erreur lors de l\'initialisation du paiement. Vérifiez votre connexion ou réessayez.');
      toast.error(msg);
      // 409 = déjà payé / paiement en attente : rafraîchir user et portfolio
      if (error.response?.status === 409) {
        refreshUser?.();
        onUpdate();
      }
    } finally {
      setPayPublishLoading(false);
    }
  };

  return (
    <div className="relative space-y-6">
      {/* Préchargement au survol pour ouvrir le template plus vite au clic */}
      {preloadUrl && (
        <iframe
          src={preloadUrl}
          title="Préchargement"
          className="absolute w-0 h-0 opacity-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        />
      )}

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex-1 min-w-0">
          <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r ${dashboardTheme.gradient} bg-clip-text text-transparent`}>
            Thème
          </h1>
          <p className={`text-sm sm:text-base md:text-lg mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Choisissez le modèle de votre portfolio
          </p>
        </div>
      </motion.div>

      {/* Current Theme Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass-effect-strong rounded-xl p-4 border ${
          isDarkMode ? 'border-gray-800' : 'border-gray-200'
        }`}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl shadow-lg"
              style={{
                backgroundColor: themes[portfolio?.theme_color]?.primary.main || themes.cyan.primary.main,
                boxShadow: `0 4px 15px ${themes[portfolio?.theme_color]?.primary.main || themes.cyan.primary.main}40`
              }}
            />
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Configuration actuelle
              </p>
              <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {TEMPLATES.find(t => t.id === portfolio?.template)?.name || 'Classic'} • {themes[portfolio?.theme_color]?.name || 'Cyan'} • {portfolio?.theme_mode === 'dark' ? 'Sombre' : 'Clair'}
              </p>
            </div>
          </div>
          <motion.button
            onClick={() => setShowPreviewModal(true)}
            className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
              isDarkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaCog />
            Modifier
          </motion.button>
        </div>
      </motion.div>

      {/* Template Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`glass-effect-strong rounded-xl p-4 sm:p-6 border ${
          isDarkMode ? 'border-gray-800' : 'border-gray-200'
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${dashboardTheme.gradient} flex-shrink-0`}>
            <FaLayerGroup className="text-white text-base sm:text-lg md:text-xl" />
          </div>
          <div>
            <h2 className={`text-base sm:text-lg md:text-xl lg:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Modèle de portfolio
            </h2>
            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Cliquez sur un modèle pour le prévisualiser
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TEMPLATES.map((tpl) => {
            const Icon = tpl.icon;
            const isCurrent = portfolio?.template === tpl.id;
            return (
              <motion.button
                key={tpl.id}
                type="button"
                onClick={() => handleTemplateSelect(tpl.id)}
                onMouseEnter={() => setPreloadTemplateId(tpl.id)}
                onMouseLeave={() => setPreloadTemplateId(null)}
                className={`relative text-left p-5 rounded-xl border-2 transition-all overflow-hidden group ${
                  isCurrent
                    ? isDarkMode
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-red-500 bg-red-50'
                    : isDarkMode
                      ? 'border-gray-700 bg-gray-800/50 hover:border-red-500/50 hover:bg-red-500/5'
                      : 'border-gray-200 bg-white hover:border-red-300 hover:bg-red-50/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isCurrent && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-medium">
                    Actuel
                  </div>
                )}
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                    isCurrent
                      ? 'bg-red-500/20 text-red-500'
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-400 group-hover:bg-red-500/10 group-hover:text-red-400'
                        : 'bg-gray-100 text-gray-600 group-hover:bg-red-100 group-hover:text-red-500'
                  }`}
                >
                  <Icon className="text-lg" />
                </div>
                <h3 className={`font-bold text-base mb-1 transition-colors ${
                  isCurrent
                    ? 'text-red-500'
                    : isDarkMode
                      ? 'text-white group-hover:text-red-400'
                      : 'text-gray-800 group-hover:text-red-600'
                }`}>
                  {tpl.name}
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {tpl.description}
                </p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        portfolioUrl={portfolioUrl}
        selectedTemplate={selectedTemplate}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        selectedMode={selectedMode}
        setSelectedMode={setSelectedMode}
        onSave={handleSave}
        loading={loading}
        isActive={isActive}
        isPublished={portfolio?.status === 'published'}
        onPayToPublish={handlePayToPublish}
        payPublishLoading={payPublishLoading}
      />
    </div>
  );
};

export default ThemeEditor;
