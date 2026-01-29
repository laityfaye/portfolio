import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSave, FaSun, FaMoon, FaPalette, FaCheck, FaEye, FaLayerGroup, FaAlignLeft } from 'react-icons/fa';
import { useTheme, themes } from '../../context/ThemeContext';
import { portfolioApi } from '../../api/portfolio';
import toast from 'react-hot-toast';

const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Design dynamique avec hero immersif, orbes animés et sections colorées. Idéal pour mettre en valeur votre personnalité.',
    icon: FaLayerGroup,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Layout professionnel avec sidebar fixe, typographie épurée et mise en page sobre. Parfait pour un rendu corporate.',
    icon: FaAlignLeft,
  },
];

const ThemeEditor = ({ portfolio, onUpdate }) => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
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
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleColorSelect = (colorName) => {
    setSelectedColor(colorName);
    // Ne pas changer le thème du dashboard, seulement celui du portfolio template
  };

  const handleModeToggle = () => {
    const newMode = selectedMode === 'dark' ? 'light' : 'dark';
    setSelectedMode(newMode);
    // Ne pas changer le mode du dashboard, seulement celui du portfolio template
  };

  // Obtenir le thème sélectionné pour l'aperçu
  const selectedTheme = themes[selectedColor] || themes.cyan;

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
            Personnalisez l'apparence de votre portfolio
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

      {/* Template Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass-effect-strong rounded-xl p-4 sm:p-6 border ${
          isDarkMode ? 'border-gray-800' : 'border-gray-200'
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${dashboardTheme.gradient} flex-shrink-0`}>
            <FaLayerGroup className="text-white text-base sm:text-lg md:text-xl" />
          </div>
          <h2 className={`text-base sm:text-lg md:text-xl lg:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Modèle de portfolio
          </h2>
        </div>
        <p className={`text-xs sm:text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Choisissez la mise en page qui correspond le mieux à votre image professionnelle.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TEMPLATES.map((tpl) => {
            const Icon = tpl.icon;
            const isSelected = selectedTemplate === tpl.id;
            return (
              <motion.button
                key={tpl.id}
                type="button"
                onClick={() => setSelectedTemplate(tpl.id)}
                className={`relative text-left p-5 sm:p-6 rounded-xl border-2 transition-all overflow-hidden ${
                  isSelected
                    ? isDarkMode
                      ? 'border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20'
                      : 'border-red-500 bg-red-50 shadow-lg shadow-red-500/10'
                    : isDarkMode
                      ? 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                    <FaCheck className="text-white text-sm" />
                  </div>
                )}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    isSelected ? 'bg-red-500/20' : isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                  style={isSelected ? { color: dashboardTheme.primary.main } : {}}
                >
                  <Icon className="text-xl" />
                </div>
                <h3 className={`font-bold text-lg mb-2 ${isSelected ? 'text-red-500' : isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {tpl.name}
                </h3>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {tpl.description}
                </p>
              </motion.button>
            );
          })}
        </div>
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
            <div className={`p-8 rounded-lg ${selectedMode === 'dark' ? 'bg-gray-900' : 'bg-white'} border-2 ${
              selectedMode === 'dark' ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <div className={`text-3xl font-bold bg-gradient-to-r ${selectedTheme.gradientDark || selectedTheme.gradient} bg-clip-text text-transparent mb-3`}>
                {portfolio?.display_name || 'Votre Nom'}
              </div>
              <p className="text-lg mb-4" style={{ color: selectedTheme.primary.main }}>
                {portfolio?.job_title || 'Votre Titre Professionnel'}
              </p>
              <div className="flex gap-3 mt-6">
                <motion.button
                  className={`px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all`}
                  style={{
                    background: `linear-gradient(to right, ${selectedTheme.primary.main}, ${selectedTheme.primary.dark})`,
                    boxShadow: `0 4px 15px ${selectedTheme.primary.main}40`
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Bouton Principal
                </motion.button>
                <motion.button
                  className={`px-6 py-3 rounded-xl font-semibold border-2 transition-all ${
                    selectedMode === 'dark'
                      ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Bouton Secondaire
                </motion.button>
              </div>
              <div className="mt-6 p-4 rounded-lg" style={{
                backgroundColor: `${selectedTheme.primary.main}15`,
                border: `1px solid ${selectedTheme.primary.main}30`
              }}>
                <p className={`text-sm ${selectedMode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Aperçu avec le thème <span className="font-semibold capitalize" style={{ color: selectedTheme.primary.main }}>{selectedColor}</span>, mode <span className="font-semibold">{selectedMode === 'dark' ? 'sombre' : 'clair'}</span> et modèle <span className="font-semibold">{selectedTemplate === 'minimal' ? 'Minimal' : 'Classic'}</span>.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mode Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass-effect-strong rounded-xl p-4 sm:p-6 border ${
          isDarkMode ? 'border-gray-800' : 'border-gray-200'
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${dashboardTheme.gradient} flex-shrink-0`}>
            {selectedMode === 'dark' ? <FaMoon className="text-white text-lg sm:text-xl" /> : <FaSun className="text-white text-lg sm:text-xl" />}
          </div>
          <h2 className={`text-lg sm:text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Mode d'affichage du portfolio
          </h2>
        </div>
        
        <motion.button
          onClick={handleModeToggle}
          className={`relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 p-4 sm:p-6 rounded-xl w-full transition-all overflow-hidden ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100 border border-gray-200'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <div className={`text-2xl sm:text-3xl transition-transform flex-shrink-0 ${selectedMode === 'dark' ? 'text-yellow-400' : 'text-yellow-500'}`}>
              {selectedMode === 'dark' ? <FaMoon /> : <FaSun />}
            </div>
            <div className="text-left min-w-0 flex-1">
              <p className={`font-bold text-base sm:text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Mode {selectedMode === 'dark' ? 'Sombre' : 'Clair'}
              </p>
              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {selectedMode === 'dark' ? 'Interface sombre pour un confort visuel optimal' : 'Interface claire et lumineuse'}
              </p>
            </div>
          </div>
          <div className={`relative w-full sm:w-16 h-8 rounded-full transition-colors flex-shrink-0 ${
            selectedMode === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
          }`}>
            <motion.div
              className={`absolute top-1 w-6 h-6 rounded-full flex items-center justify-center ${
                selectedMode === 'dark' ? 'right-1' : 'left-1'
              }`}
              style={{
                backgroundColor: selectedMode === 'dark' ? '#fbbf24' : '#f59e0b',
                boxShadow: `0 0 10px ${selectedMode === 'dark' ? '#fbbf24' : '#f59e0b'}50`
              }}
              animate={{
                x: 0
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              {selectedMode === 'dark' ? (
                <FaMoon className="text-white text-xs" />
              ) : (
                <FaSun className="text-white text-xs" />
              )}
            </motion.div>
          </div>
        </motion.button>
      </motion.div>

      {/* Color Selection */}
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
            <FaPalette className="text-white text-base sm:text-lg md:text-xl" />
          </div>
          <h2 className={`text-base sm:text-lg md:text-xl lg:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Couleur principale du portfolio
          </h2>
        </div>
        
        <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4">
          {Object.entries(themes).map(([name, themeColors]) => {
            const isSelected = selectedColor === name;
            return (
              <motion.div
                key={name}
                className="flex flex-col items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.button
                  onClick={() => handleColorSelect(name)}
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl transition-all duration-300 overflow-hidden ${
                    isSelected ? 'ring-2 sm:ring-4 ring-offset-1 sm:ring-offset-2' : ''
                  }`}
                  style={{
                    backgroundColor: themeColors.primary.main,
                    boxShadow: isSelected
                      ? `0 0 25px ${themeColors.primary.main}60, 0 0 50px ${themeColors.primary.main}30`
                      : `0 4px 15px ${themeColors.primary.main}30`,
                    ringColor: themeColors.primary.main,
                    ringOffsetColor: isDarkMode ? '#111827' : '#ffffff'
                  }}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/20"
                    >
                      <FaCheck className="text-white text-xl drop-shadow-lg" />
                    </motion.div>
                  )}
                  <div
                    className="absolute inset-0 opacity-50"
                    style={{
                      background: `linear-gradient(135deg, ${themeColors.primary.light}, ${themeColors.primary.dark})`
                    }}
                  />
                </motion.button>
                <span className={`text-[10px] sm:text-xs font-medium text-center ${
                  isSelected
                    ? (isDarkMode ? 'text-white' : 'text-gray-900') + ' font-bold'
                    : (isDarkMode ? 'text-gray-500' : 'text-gray-600')
                }`}>
                  {themeColors.name}
                </span>
              </motion.div>
            );
          })}
        </div>
        
        <div className={`mt-6 p-4 rounded-xl border ${
          isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Thème sélectionné
              </p>
              <p className={`text-lg font-bold capitalize ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {themes[selectedColor]?.name || selectedColor}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg"
                style={{
                  backgroundColor: selectedTheme.primary.main,
                  boxShadow: `0 0 15px ${selectedTheme.primary.main}50`
                }}
              />
              <div
                className="w-8 h-8 rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${selectedTheme.primary.light}, ${selectedTheme.primary.dark})`
                }}
              />
            </div>
          </div>
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
          onClick={handleSave}
          disabled={loading}
          className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r ${dashboardTheme.gradient} text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm sm:text-base`}
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
        >
          <FaSave />
          {loading ? 'Enregistrement...' : 'Enregistrer le thème'}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ThemeEditor;
