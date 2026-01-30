import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSave, FaSun, FaMoon, FaPalette, FaCheck, FaTimes, FaLayerGroup, FaAlignLeft, FaCog, FaExpand, FaCompress } from 'react-icons/fa';
import { useTheme, themes, ThemeProvider } from '../../context/ThemeContext';
import { portfolioApi } from '../../api/portfolio';
import toast from 'react-hot-toast';

// Import portfolio components for preview
import ThemeApplier from '../ThemeApplier';
import Navbar from '../Navbar';
import Hero from '../Hero';
import About from '../About';
import Skills from '../Skills';
import Projects from '../Projects';
import Contact from '../Contact';
import Footer from '../Footer';
import PortfolioMinimal from '../../templates/PortfolioMinimal';

const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Design dynamique avec hero immersif, orbes animés et sections colorées. Idéal pour mettre en valeur votre personnalité.',
    icon: FaLayerGroup,
    preview: '/images/template-classic.png',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Layout professionnel avec sidebar fixe, typographie épurée et mise en page sobre. Parfait pour un rendu corporate.',
    icon: FaAlignLeft,
    preview: '/images/template-minimal.png',
  },
];

// Portfolio Preview Component
const PortfolioPreview = ({ portfolio, template, themeColor, themeMode }) => {
  const data = {
    ...portfolio,
    template,
    theme_color: themeColor,
    theme_mode: themeMode,
  };
  const skills = portfolio?.skills || [];
  const projects = portfolio?.projects || [];

  if (template === 'minimal') {
    return <PortfolioMinimal data={data} slug="preview" isPreview={true} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${themeMode === 'dark' ? 'bg-dark-900' : 'bg-slate-50'}`}>
      <ThemeApplier />
      <Navbar data={data} hideThemeSelector={true} />
      <main>
        <Hero data={data} />
        <About data={data} />
        <Skills skills={skills} />
        <Projects projects={projects} socialLinks={data?.social_links} />
        <Contact data={data} slug="preview" isPreview={true} />
      </main>
      <Footer data={data} />
    </div>
  );
};

// Customization Panel Component
const CustomizationPanel = ({
  isOpen,
  onClose,
  selectedColor,
  setSelectedColor,
  selectedMode,
  setSelectedMode,
  onSave,
  loading
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
          className={`fixed top-0 right-0 h-full w-80 z-[60] shadow-2xl overflow-y-auto ${
            isDarkMode ? 'bg-gray-900 border-l border-gray-800' : 'bg-white border-l border-gray-200'
          }`}
        >
          {/* Panel Header */}
          <div className={`sticky top-0 p-4 border-b ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Personnalisation
              </h3>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {/* Mode Toggle */}
            <div>
              <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Mode d'affichage
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedMode('light')}
                  className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                    selectedMode === 'light'
                      ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/30'
                      : isDarkMode
                        ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FaSun />
                  <span className="text-sm font-medium">Clair</span>
                </button>
                <button
                  onClick={() => setSelectedMode('dark')}
                  className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                    selectedMode === 'dark'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                      : isDarkMode
                        ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FaMoon />
                  <span className="text-sm font-medium">Sombre</span>
                </button>
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Couleur principale
              </label>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(themes).map(([name, themeColors]) => {
                  const isSelected = selectedColor === name;
                  return (
                    <motion.button
                      key={name}
                      onClick={() => setSelectedColor(name)}
                      className={`relative w-full aspect-square rounded-xl transition-all ${
                        isSelected ? 'ring-2 ring-offset-2' : ''
                      }`}
                      style={{
                        backgroundColor: themeColors.primary.main,
                        boxShadow: isSelected ? `0 0 20px ${themeColors.primary.main}50` : 'none',
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
                          className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl"
                        >
                          <FaCheck className="text-white text-sm drop-shadow-lg" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <p className={`mt-2 text-xs text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {themes[selectedColor]?.name || selectedColor}
              </p>
            </div>

            {/* Save Button */}
            <motion.button
              onClick={onSave}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              <FaSave />
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </motion.button>
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
  portfolio,
  selectedTemplate,
  selectedColor,
  setSelectedColor,
  selectedMode,
  setSelectedMode,
  onSave,
  loading
}) => {
  const [showCustomization, setShowCustomization] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { isDarkMode } = useTheme();

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
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => !showCustomization && onClose()}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative ${isFullscreen ? 'w-full h-full' : 'w-[95vw] h-[90vh] rounded-2xl'} overflow-hidden ${
              isDarkMode ? 'bg-gray-900' : 'bg-white'
            }`}
          >
            {/* Modal Header */}
            <div className={`absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 ${
              isDarkMode ? 'bg-gray-900/90' : 'bg-white/90'
            } backdrop-blur-sm border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Aperçu - {TEMPLATES.find(t => t.id === selectedTemplate)?.name}
                </h2>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                }`}>
                  {themes[selectedColor]?.name} • {selectedMode === 'dark' ? 'Sombre' : 'Clair'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Customize Button */}
                <motion.button
                  onClick={() => setShowCustomization(!showCustomization)}
                  className={`p-2.5 rounded-xl transition-all flex items-center gap-2 ${
                    showCustomization
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30'
                      : isDarkMode
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Personnaliser"
                >
                  <FaPalette />
                  <span className="text-sm font-medium hidden sm:inline">Personnaliser</span>
                </motion.button>

                {/* Fullscreen Toggle */}
                <motion.button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className={`p-2.5 rounded-xl transition-all ${
                    isDarkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={isFullscreen ? 'Réduire' : 'Plein écran'}
                >
                  {isFullscreen ? <FaCompress /> : <FaExpand />}
                </motion.button>

                {/* Close Button */}
                <motion.button
                  onClick={onClose}
                  className={`p-2.5 rounded-xl transition-all ${
                    isDarkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-red-500/20 hover:text-red-400'
                      : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-500'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Fermer"
                >
                  <FaTimes />
                </motion.button>
              </div>
            </div>

            {/* Portfolio Preview */}
            <div className="w-full h-full pt-16 overflow-auto">
              <ThemeProvider
                initialTheme={selectedColor}
                initialMode={selectedMode === 'dark'}
                disableLocalStorage={true}
              >
                <PortfolioPreview
                  portfolio={portfolio}
                  template={selectedTemplate}
                  themeColor={selectedColor}
                  themeMode={selectedMode}
                />
              </ThemeProvider>
            </div>

            {/* Customization Panel */}
            <CustomizationPanel
              isOpen={showCustomization}
              onClose={() => setShowCustomization(false)}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedMode={selectedMode}
              setSelectedMode={setSelectedMode}
              onSave={onSave}
              loading={loading}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ThemeEditor = ({ portfolio, onUpdate }) => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState(portfolio?.theme_color || 'cyan');
  const [selectedMode, setSelectedMode] = useState(portfolio?.theme_mode || 'dark');
  const [selectedTemplate, setSelectedTemplate] = useState(portfolio?.template || 'classic');

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
              Cliquez sur un modèle pour le prévisualiser et le personnaliser
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TEMPLATES.map((tpl) => {
            const Icon = tpl.icon;
            const isSelected = selectedTemplate === tpl.id;
            const isCurrent = portfolio?.template === tpl.id;
            return (
              <motion.button
                key={tpl.id}
                type="button"
                onClick={() => handleTemplateSelect(tpl.id)}
                className={`relative text-left p-5 sm:p-6 rounded-xl border-2 transition-all overflow-hidden group ${
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
                  <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-red-500 text-white text-xs font-medium">
                    Actuel
                  </div>
                )}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                    isCurrent
                      ? 'bg-red-500/20 text-red-500'
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-400 group-hover:bg-red-500/10 group-hover:text-red-400'
                        : 'bg-gray-100 text-gray-600 group-hover:bg-red-100 group-hover:text-red-500'
                  }`}
                >
                  <Icon className="text-xl" />
                </div>
                <h3 className={`font-bold text-lg mb-2 transition-colors ${
                  isCurrent
                    ? 'text-red-500'
                    : isDarkMode
                      ? 'text-white group-hover:text-red-400'
                      : 'text-gray-800 group-hover:text-red-600'
                }`}>
                  {tpl.name}
                </h3>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {tpl.description}
                </p>
                <div className={`mt-4 flex items-center gap-2 text-sm font-medium transition-colors ${
                  isDarkMode
                    ? 'text-gray-500 group-hover:text-red-400'
                    : 'text-gray-400 group-hover:text-red-500'
                }`}>
                  <FaPalette className="text-xs" />
                  Cliquez pour prévisualiser
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        portfolio={portfolio}
        selectedTemplate={selectedTemplate}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        selectedMode={selectedMode}
        setSelectedMode={setSelectedMode}
        onSave={handleSave}
        loading={loading}
      />
    </div>
  );
};

export default ThemeEditor;
