import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSave, FaUpload, FaEye, FaEdit, FaPlus, FaTrash, FaImage, FaUser, FaBriefcase, FaChartLine, FaMagic, FaGripVertical, FaArrowUp, FaArrowDown, FaLightbulb, FaCheck } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { portfolioApi } from '../../api/portfolio';
import { getImageUrl } from '../../utils/imageUtils';
import toast from 'react-hot-toast';

const HeroEditor = ({ portfolio, onUpdate }) => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showStatSuggestions, setShowStatSuggestions] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [formData, setFormData] = useState({
    display_name: portfolio?.display_name || '',
    job_title: portfolio?.job_title || '',
    hero_description: portfolio?.hero_description || '',
    hero_stats: portfolio?.hero_stats || [
      { value: 1, suffix: '+', label: "Annees d'experience" },
      { value: 10, suffix: '+', label: 'Projets realises' },
      { value: 100, suffix: '%', label: 'Satisfaction client' },
    ],
  });

  // Templates de statistiques suggérées
  const statTemplates = [
    { value: 5, suffix: '+', label: "Années d'expérience" },
    { value: 50, suffix: '+', label: 'Projets réalisés' },
    { value: 100, suffix: '%', label: 'Satisfaction client' },
    { value: 200, suffix: '+', label: 'Clients satisfaits' },
    { value: 10, suffix: '+', label: 'Technologies maîtrisées' },
    { value: 24, suffix: '/7', label: 'Support disponible' },
    { value: 99, suffix: '%', label: 'Taux de réussite' },
    { value: 1000, suffix: '+', label: 'Lignes de code' },
  ];

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
      setFormData({
        display_name: portfolio?.display_name || '',
        job_title: portfolio?.job_title || '',
        hero_description: portfolio?.hero_description || '',
        hero_stats: portfolio?.hero_stats || [
          { value: 1, suffix: '+', label: "Annees d'experience" },
          { value: 10, suffix: '+', label: 'Projets realises' },
          { value: 100, suffix: '%', label: 'Satisfaction client' },
        ],
      });
    }
  }, [portfolio]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatChange = (index, field, value) => {
    const newStats = [...formData.hero_stats];
    newStats[index] = { ...newStats[index], [field]: field === 'value' ? parseInt(value) || 0 : value };
    setFormData({ ...formData, hero_stats: newStats });
  };

  const addStat = () => {
    setFormData({
      ...formData,
      hero_stats: [...formData.hero_stats, { value: 0, suffix: '+', label: 'Nouvelle statistique' }]
    });
  };

  const addStatFromTemplate = (template) => {
    setFormData({
      ...formData,
      hero_stats: [...formData.hero_stats, { ...template }]
    });
    setShowStatSuggestions(false);
    toast.success('Statistique ajoutée!');
  };

  const removeStat = (index) => {
    if (formData.hero_stats.length > 1) {
      const newStats = formData.hero_stats.filter((_, i) => i !== index);
      setFormData({ ...formData, hero_stats: newStats });
      toast.success('Statistique supprimée');
    } else {
      toast.error('Vous devez avoir au moins une statistique');
    }
  };

  const moveStat = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === formData.hero_stats.length - 1) return;

    const newStats = [...formData.hero_stats];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newStats[index], newStats[targetIndex]] = [newStats[targetIndex], newStats[index]];
    setFormData({ ...formData, hero_stats: newStats });
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newStats = [...formData.hero_stats];
    const draggedItem = newStats[draggedIndex];
    newStats.splice(draggedIndex, 1);
    newStats.splice(index, 0, draggedItem);
    setFormData({ ...formData, hero_stats: newStats });
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await portfolioApi.update(formData);
      toast.success('Hero mis à jour avec succès!');
      onUpdate();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation de la taille
    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image doit faire moins de 5MB');
      return;
    }

    // Validation du type
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    // Aperçu de l'image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      await portfolioApi.uploadProfileImage(file);
      toast.success('Photo de profil mise à jour!');
      onUpdate();
    } catch (error) {
      toast.error('Erreur lors de l\'upload');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex-1 min-w-0">
          <h1 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r ${dashboardTheme.gradient} bg-clip-text text-transparent`}>
            Section Hero
          </h1>
          <p className={`text-xs sm:text-sm md:text-base lg:text-lg mt-1 sm:mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Personnalisez l'en-tête de votre portfolio
          </p>
        </div>
        <motion.button
          onClick={() => setShowPreview(!showPreview)}
          className={`w-full sm:w-auto px-4 sm:px-4 md:px-6 py-2.5 sm:py-2.5 md:py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base ${
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
          <span className="hidden sm:inline">{showPreview ? 'Masquer l\'aperçu' : 'Aperçu en temps réel'}</span>
          <span className="sm:hidden">{showPreview ? 'Masquer' : 'Aperçu'}</span>
        </motion.button>
      </motion.div>

      {/* Preview Section */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`glass-effect-strong rounded-xl p-3 sm:p-4 md:p-6 border overflow-hidden ${
              isDarkMode ? 'border-gray-800' : 'border-gray-200'
            }`}
          >
            <div className={`p-4 sm:p-6 md:p-8 rounded-lg ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
              <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8">
                {/* Profile Image Preview */}
                <div className="relative group">
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-red-500/30 shadow-lg shadow-red-500/20">
                    {(imagePreview || portfolio?.profile_image) ? (
                      <img
                        src={imagePreview || getImageUrl(portfolio?.profile_image)}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Erreur de chargement de l\'image:', e.target.src);
                          e.target.style.display = 'none';
                          const fallback = e.target.nextElementSibling;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    {!imagePreview && !portfolio?.profile_image && (
                      <div className={`w-full h-full flex items-center justify-center ${
                        isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                      }`}>
                        <FaUser className={`text-4xl ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                      </div>
                    )}
                    {imagePreview || portfolio?.profile_image ? (
                      <div className={`w-full h-full hidden items-center justify-center ${
                        isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                      }`}>
                        <FaUser className={`text-4xl ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Content Preview */}
                <div className="flex-1 text-center md:text-left w-full">
                  <h2 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 ${
                    formData.display_name 
                      ? (isDarkMode ? 'text-white' : 'text-gray-800')
                      : (isDarkMode ? 'text-gray-600' : 'text-gray-400')
                  }`}>
                    {formData.display_name || 'Votre Nom'}
                  </h2>
                  <p className={`text-base sm:text-lg md:text-xl lg:text-2xl mb-3 sm:mb-4 bg-gradient-to-r ${dashboardTheme.gradient} bg-clip-text text-transparent font-semibold`}>
                    {formData.job_title || 'Votre Titre'}
                  </p>
                  <p className={`text-sm sm:text-base md:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {formData.hero_description || 'Votre description apparaîtra ici...'}
                  </p>
                </div>
              </div>

              {/* Stats Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6 md:mt-8">
                {formData.hero_stats.map((stat, index) => (
                  <div
                    key={index}
                    className={`glass-effect rounded-xl p-3 sm:p-4 text-center border ${
                      isDarkMode ? 'border-gray-800' : 'border-gray-200'
                    }`}
                  >
                    <div className={`text-xl sm:text-2xl font-bold mb-1 bg-gradient-to-r ${dashboardTheme.gradient} bg-clip-text text-transparent`}>
                      {stat.value}{stat.suffix}
                    </div>
                    <div className={`text-[10px] sm:text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`glass-effect-strong rounded-xl p-4 sm:p-5 md:p-6 border ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-r ${dashboardTheme.gradient} text-white flex-shrink-0`}>
              <FaImage className="text-lg sm:text-xl" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Photo de profil
              </h2>
              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Format recommandé: carré, min. 400x400px
              </p>
            </div>
          </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6">
            <div className="relative group flex-shrink-0">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-red-500/30 shadow-lg shadow-red-500/20 ring-4 ring-red-500/10">
                {(imagePreview || portfolio?.profile_image) ? (
                  <>
                    <img
                      src={imagePreview || getImageUrl(portfolio?.profile_image)}
                      alt="Profile"
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className={`w-full h-full hidden items-center justify-center ${
                      isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                    }`}>
                      <FaUser className={`text-4xl ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    </div>
                  </>
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${
                    isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                  }`}>
                    <FaUser className={`text-4xl ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  </div>
                )}
                <div className={`absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center ${!imagePreview && !portfolio?.profile_image ? 'hidden' : ''}`}>
                  <FaEdit className="text-white text-xl" />
                </div>
              </div>
            </div>
            <label className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-red-500 text-red-500 font-semibold rounded-xl hover:bg-red-500/10 transition-all cursor-pointer flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base ${
              isDarkMode ? 'border-red-500 text-red-400 hover:bg-red-500/20' : 'border-red-500 text-red-500 hover:bg-red-50'
            }`}>
              <FaUpload />
              <span className="whitespace-nowrap">Changer la photo</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </motion.div>

        {/* Basic Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`glass-effect-strong rounded-xl p-4 sm:p-5 md:p-6 border space-y-4 sm:space-y-6 ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-r ${dashboardTheme.gradient} text-white flex-shrink-0`}>
              <FaUser className="text-lg sm:text-xl" />
            </div>
            <h2 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Informations principales
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className={`flex items-center gap-2 text-xs sm:text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <FaUser className="text-red-500 text-sm sm:text-base" />
                Nom affiché
              </label>
              <input
                type="text"
                name="display_name"
                value={formData.display_name}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 glass-effect rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all text-sm sm:text-base ${
                  isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                }`}
                placeholder="Votre Nom"
              />
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {formData.display_name.length}/50 caractères
              </p>
            </div>

            <div>
              <label className={`flex items-center gap-2 text-xs sm:text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <FaBriefcase className="text-red-500 text-sm sm:text-base" />
                Titre / Poste
              </label>
              <input
                type="text"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 glass-effect rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all text-sm sm:text-base ${
                  isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                }`}
                placeholder="Ingénieur Logiciel"
              />
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {formData.job_title.length}/100 caractères
              </p>
            </div>

            <div>
              <label className={`flex items-center gap-2 text-xs sm:text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <FaMagic className="text-red-500 text-sm sm:text-base" />
                Description
              </label>
              <textarea
                name="hero_description"
                value={formData.hero_description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 glass-effect rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none transition-all text-sm sm:text-base ${
                  isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                }`}
                placeholder="Une brève description de vous et de vos compétences..."
              />
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {formData.hero_description.length}/300 caractères
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`glass-effect-strong rounded-xl p-6 border space-y-6 ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-r ${dashboardTheme.gradient} text-white flex-shrink-0`}>
                <FaChartLine className="text-lg sm:text-xl" />
              </div>
              <div className="min-w-0">
                <h2 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Statistiques
                </h2>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formData.hero_stats.length} statistique{formData.hero_stats.length > 1 ? 's' : ''} configurée{formData.hero_stats.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <motion.button
                type="button"
                onClick={() => setShowStatSuggestions(!showStatSuggestions)}
                className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 text-xs sm:text-sm ${
                  isDarkMode
                    ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 border border-yellow-500/30'
                    : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border border-yellow-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaLightbulb />
                <span className="hidden sm:inline">Suggestions</span>
                <span className="sm:hidden">Tips</span>
              </motion.button>
              <motion.button
                type="button"
                onClick={addStat}
                className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 text-xs sm:text-sm ${
                  isDarkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlus />
                Ajouter
              </motion.button>
            </div>
          </div>

          {/* Suggestions de statistiques */}
          <AnimatePresence>
            {showStatSuggestions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`glass-effect rounded-xl p-4 border ${
                  isDarkMode ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-yellow-200 bg-yellow-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <FaLightbulb className={`text-yellow-500 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  <h3 className={`font-semibold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-800'}`}>
                    Templates suggérés
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  {statTemplates.map((template, idx) => (
                    <motion.button
                      key={idx}
                      type="button"
                      onClick={() => addStatFromTemplate(template)}
                      className={`p-2 sm:p-3 rounded-lg text-left transition-all border ${
                        isDarkMode
                          ? 'bg-gray-800/50 border-gray-700 hover:border-yellow-500/50 hover:bg-gray-800'
                          : 'bg-white border-gray-200 hover:border-yellow-300 hover:bg-yellow-50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`text-base sm:text-lg font-bold mb-1 bg-gradient-to-r ${dashboardTheme.gradient} bg-clip-text text-transparent`}>
                        {template.value}{template.suffix}
                      </div>
                      <div className={`text-[10px] sm:text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {template.label}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {formData.hero_stats.map((stat, index) => {
              const isComplete = stat.value > 0 && stat.label.trim() !== '';
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`glass-effect rounded-xl p-3 sm:p-4 md:p-5 border transition-all cursor-move group ${
                    isDarkMode ? 'border-gray-800 hover:border-red-500/50' : 'border-gray-200 hover:border-red-300'
                  } ${draggedIndex === index ? 'opacity-50 scale-95' : ''} ${
                    isComplete ? (isDarkMode ? 'bg-green-500/5 border-green-500/20' : 'bg-green-50 border-green-200') : ''
                  }`}
                  whileHover={{ scale: 1.01 }}
                >
                  {/* Header avec contrôles */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
                        isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                      }`}>
                        <FaGripVertical className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      </div>
                      <div className="min-w-0">
                        <span className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Statistique #{index + 1}
                        </span>
                        {isComplete && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <FaCheck className="text-green-500 text-[10px] sm:text-xs" />
                            <span className={`text-[10px] sm:text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                              Complète
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {/* Boutons de réorganisation */}
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => moveStat(index, 'up')}
                          disabled={index === 0}
                          className={`p-1 sm:p-1.5 rounded transition-all ${
                            index === 0
                              ? 'opacity-30 cursor-not-allowed'
                              : isDarkMode
                                ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <FaArrowUp className="text-xs" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveStat(index, 'down')}
                          disabled={index === formData.hero_stats.length - 1}
                          className={`p-1 sm:p-1.5 rounded transition-all ${
                            index === formData.hero_stats.length - 1
                              ? 'opacity-30 cursor-not-allowed'
                              : isDarkMode
                                ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <FaArrowDown className="text-xs" />
                        </button>
                      </div>
                      {formData.hero_stats.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStat(index)}
                          className={`p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0 ${
                            isDarkMode
                              ? 'text-red-400 hover:bg-red-500/10'
                              : 'text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <FaTrash className="text-sm sm:text-base" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Aperçu de la statistique */}
                  <div className={`mb-4 p-3 sm:p-4 rounded-lg border ${
                    isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="text-center">
                      <div className={`text-2xl sm:text-3xl font-bold mb-1 bg-gradient-to-r ${dashboardTheme.gradient} bg-clip-text text-transparent`}>
                        {stat.value || 0}{stat.suffix || '+'}
                      </div>
                      <div className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {stat.label || 'Label de la statistique'}
                      </div>
                    </div>
                  </div>

                  {/* Champs de saisie */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <label className={`flex items-center gap-2 text-xs font-semibold ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Valeur
                        {stat.value > 0 && <FaCheck className="text-green-500 text-xs" />}
                      </label>
                      <input
                        type="number"
                        value={stat.value}
                        onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                        className={`w-full px-4 py-2.5 glass-effect rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all ${
                          isDarkMode ? 'text-white' : 'text-gray-800'
                        } ${stat.value > 0 ? (isDarkMode ? 'border border-green-500/30' : 'border border-green-300') : ''}`}
                        min="0"
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={`flex items-center gap-2 text-xs font-semibold ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Suffixe
                        {stat.suffix && <FaCheck className="text-green-500 text-xs" />}
                      </label>
                      <input
                        type="text"
                        value={stat.suffix}
                        onChange={(e) => handleStatChange(index, 'suffix', e.target.value)}
                        className={`w-full px-4 py-2.5 glass-effect rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all ${
                          isDarkMode ? 'text-white' : 'text-gray-800'
                        } ${stat.suffix ? (isDarkMode ? 'border border-green-500/30' : 'border border-green-300') : ''}`}
                        placeholder="+"
                        maxLength="5"
                      />
                      <div className="flex gap-1.5 flex-wrap">
                        {['+', '%', 'K', 'M'].map((suffix) => (
                          <button
                            key={suffix}
                            type="button"
                            onClick={() => handleStatChange(index, 'suffix', suffix)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              stat.suffix === suffix
                                ? `bg-gradient-to-r ${dashboardTheme.gradient} text-white shadow-md shadow-red-500/20`
                                : isDarkMode
                                  ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                            }`}
                          >
                            {suffix}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className={`flex items-center gap-2 text-xs font-semibold ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Label
                        {stat.label.trim() && <FaCheck className="text-green-500 text-xs" />}
                      </label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                        className={`w-full px-4 py-2.5 glass-effect rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all ${
                          isDarkMode ? 'text-white' : 'text-gray-800'
                        } ${stat.label.trim() ? (isDarkMode ? 'border border-green-500/30' : 'border border-green-300') : ''}`}
                        placeholder="Années d'expérience"
                        maxLength="50"
                      />
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {stat.label.length}/50 caractères
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Message d'aide */}
          {formData.hero_stats.length === 0 && (
            <div className={`text-center p-8 rounded-lg border ${
              isDarkMode ? 'border-gray-800 bg-gray-900/30' : 'border-gray-200 bg-gray-50'
            }`}>
              <FaChartLine className={`text-4xl mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Aucune statistique configurée. Ajoutez-en une pour commencer!
              </p>
            </div>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end"
        >
          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r ${dashboardTheme.gradient} text-white font-bold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base`}
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
          >
            <FaSave />
            <span className="hidden sm:inline">{loading ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
            <span className="sm:hidden">{loading ? 'Enregistrement...' : 'Enregistrer'}</span>
          </motion.button>
        </motion.div>
      </form>
    </div>
  );
};

export default HeroEditor;
