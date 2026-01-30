import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSave, FaUpload, FaEye, FaPlus, FaTrash, FaFilePdf, FaUser, FaBriefcase, FaGraduationCap, FaCode, FaRocket, FaHeart, FaAward, FaArrowUp, FaArrowDown, FaGripVertical, FaCheck, FaEdit, FaDownload } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { portfolioApi } from '../../api/portfolio';
import { getImageUrl } from '../../utils/imageUtils';
import toast from 'react-hot-toast';

const AboutEditor = ({ portfolio, onUpdate }) => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  
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
    about_paragraph_1: portfolio?.about_paragraph_1 || '',
    about_paragraph_2: portfolio?.about_paragraph_2 || '',
    about_highlights: portfolio?.about_highlights || [
      { icon: 'FaUser', description: '' },
      { icon: 'FaBriefcase', description: '' },
      { icon: 'FaGraduationCap', description: '' },
    ],
    about_stats: portfolio?.about_stats || { commits: 50, technologies: 10 },
  });

  useEffect(() => {
    if (portfolio) {
      setFormData({
        about_paragraph_1: portfolio?.about_paragraph_1 || '',
        about_paragraph_2: portfolio?.about_paragraph_2 || '',
        about_highlights: portfolio?.about_highlights || [
          { icon: 'FaUser', description: '' },
          { icon: 'FaBriefcase', description: '' },
          { icon: 'FaGraduationCap', description: '' },
        ],
        about_stats: portfolio?.about_stats || { commits: 50, technologies: 10 },
      });
    }
  }, [portfolio]);

  // Map des icônes
  const iconMap = {
    FaUser: <FaUser />,
    FaBriefcase: <FaBriefcase />,
    FaGraduationCap: <FaGraduationCap />,
    FaCode: <FaCode />,
    FaRocket: <FaRocket />,
    FaHeart: <FaHeart />,
    FaAward: <FaAward />,
  };

  const iconOptions = [
    { value: 'FaUser', label: 'Utilisateur', icon: <FaUser /> },
    { value: 'FaBriefcase', label: 'Travail', icon: <FaBriefcase /> },
    { value: 'FaGraduationCap', label: 'Éducation', icon: <FaGraduationCap /> },
    { value: 'FaCode', label: 'Code', icon: <FaCode /> },
    { value: 'FaRocket', label: 'Projets', icon: <FaRocket /> },
    { value: 'FaHeart', label: 'Passion', icon: <FaHeart /> },
    { value: 'FaAward', label: 'Récompenses', icon: <FaAward /> },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleHighlightChange = (index, field, value) => {
    const newHighlights = [...formData.about_highlights];
    newHighlights[index] = { ...newHighlights[index], [field]: value };
    setFormData({ ...formData, about_highlights: newHighlights });
  };

  const addHighlight = () => {
    setFormData({
      ...formData,
      about_highlights: [...formData.about_highlights, { icon: 'FaUser', description: '' }]
    });
  };

  const removeHighlight = (index) => {
    if (formData.about_highlights.length > 1) {
      const newHighlights = formData.about_highlights.filter((_, i) => i !== index);
      setFormData({ ...formData, about_highlights: newHighlights });
      toast.success('Point clé supprimé');
    } else {
      toast.error('Vous devez avoir au moins un point clé');
    }
  };

  const moveHighlight = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === formData.about_highlights.length - 1) return;

    const newHighlights = [...formData.about_highlights];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newHighlights[index], newHighlights[targetIndex]] = [newHighlights[targetIndex], newHighlights[index]];
    setFormData({ ...formData, about_highlights: newHighlights });
  };

  const handleStatsChange = (field, value) => {
    setFormData({
      ...formData,
      about_stats: { ...formData.about_stats, [field]: parseInt(value) || 0 },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await portfolioApi.update(formData);
      toast.success('Section À propos mise à jour avec succès!');
      onUpdate();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleCvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Le fichier doit faire moins de 10MB');
      return;
    }

    if (file.type !== 'application/pdf') {
      toast.error('Veuillez sélectionner un fichier PDF');
      return;
    }

    try {
      await portfolioApi.uploadCv(file);
      toast.success('CV mis à jour !');
      onUpdate();
    } catch (error) {
      toast.error('Erreur lors de l\'upload');
    }
  };

  const handleViewCv = () => {
    if (!portfolio?.cv_file) return;
    const cvUrl = getImageUrl(portfolio.cv_file);
    if (cvUrl) {
      window.open(cvUrl, '_blank', 'noopener,noreferrer');
    } else {
      toast.error('URL du CV non disponible');
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
            Section À propos
          </h1>
          <p className={`text-sm sm:text-base md:text-lg mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Présentez-vous à vos visiteurs
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
          {showPreview ? 'Masquer l\'aperçu' : 'Aperçu en temps réel'}
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
              {/* Paragraphs Preview */}
              <div className="space-y-4 mb-8">
                {formData.about_paragraph_1 && (
                  <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {formData.about_paragraph_1}
                  </p>
                )}
                {formData.about_paragraph_2 && (
                  <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {formData.about_paragraph_2}
                  </p>
                )}
                {!formData.about_paragraph_1 && !formData.about_paragraph_2 && (
                  <p className={`text-sm italic ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Vos paragraphes apparaîtront ici...
                  </p>
                )}
              </div>

              {/* Highlights Preview */}
              {formData.about_highlights.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  {formData.about_highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className={`glass-effect rounded-xl p-4 border text-center ${
                        isDarkMode ? 'border-gray-800' : 'border-gray-200'
                      }`}
                    >
                      <div className={`text-3xl mb-3 flex justify-center ${
                        isDarkMode ? 'text-red-400' : 'text-red-500'
                      }`}>
                        {iconMap[highlight.icon] || <FaUser />}
                      </div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {highlight.description || 'Description...'}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Stats Preview */}
              <div className="flex gap-4 justify-center">
                <div className={`glass-effect rounded-xl p-4 border text-center ${
                  isDarkMode ? 'border-gray-800' : 'border-gray-200'
                }`}>
                  <div className={`text-2xl font-bold mb-1 bg-gradient-to-r ${dashboardTheme.gradient} bg-clip-text text-transparent`}>
                    {formData.about_stats.commits || 0}+
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Commits GitHub
                  </div>
                </div>
                <div className={`glass-effect rounded-xl p-4 border text-center ${
                  isDarkMode ? 'border-gray-800' : 'border-gray-200'
                }`}>
                  <div className={`text-2xl font-bold mb-1 bg-gradient-to-r ${dashboardTheme.gradient} bg-clip-text text-transparent`}>
                    {formData.about_stats.technologies || 0}+
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Technologies
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* CV Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`glass-effect-strong rounded-xl p-6 border ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-lg bg-gradient-to-r ${dashboardTheme.gradient} text-white`}>
              <FaFilePdf className="text-xl" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                CV (PDF)
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Taille maximale: 10MB
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            {portfolio?.cv_file && (
              <button
                type="button"
                onClick={handleViewCv}
                className={`px-6 py-3 border-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  isDarkMode
                    ? 'border-green-500 text-green-400 hover:bg-green-500/10'
                    : 'border-green-500 text-green-600 hover:bg-green-50'
                }`}
              >
                <FaDownload />
                Voir le CV actuel
              </button>
            )}
            <label className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-red-500 text-red-500 font-semibold rounded-xl hover:bg-red-500/10 transition-all cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base ${
              isDarkMode ? 'border-red-500 text-red-400 hover:bg-red-500/20' : 'border-red-500 text-red-500 hover:bg-red-50'
            }`}>
              <FaUpload />
              {portfolio?.cv_file ? 'Changer le CV' : 'Ajouter un CV'}
              <input type="file" accept=".pdf" onChange={handleCvUpload} className="hidden" />
            </label>
          </div>
        </motion.div>

        {/* Paragraphs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`glass-effect-strong rounded-xl p-6 border space-y-6 ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-lg bg-gradient-to-r ${dashboardTheme.gradient} text-white`}>
              <FaEdit className="text-xl" />
            </div>
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Description
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className={`flex items-center gap-2 text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Premier paragraphe
                {formData.about_paragraph_1 && <FaCheck className="text-green-500 text-xs" />}
              </label>
              <textarea
                name="about_paragraph_1"
                value={formData.about_paragraph_1}
                onChange={handleChange}
                rows={5}
                className={`w-full px-4 py-3 glass-effect rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none transition-all ${
                  isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                } ${formData.about_paragraph_1 ? (isDarkMode ? 'border border-green-500/30' : 'border border-green-300') : ''}`}
                placeholder="Parlez de vous, de votre parcours, de vos passions..."
              />
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {formData.about_paragraph_1.length}/500 caractères
              </p>
            </div>

            <div>
              <label className={`flex items-center gap-2 text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Deuxième paragraphe
                {formData.about_paragraph_2 && <FaCheck className="text-green-500 text-xs" />}
              </label>
              <textarea
                name="about_paragraph_2"
                value={formData.about_paragraph_2}
                onChange={handleChange}
                rows={5}
                className={`w-full px-4 py-3 glass-effect rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none transition-all ${
                  isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                } ${formData.about_paragraph_2 ? (isDarkMode ? 'border border-green-500/30' : 'border border-green-300') : ''}`}
                placeholder="Continuez votre présentation, parlez de vos compétences, de votre vision..."
              />
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {formData.about_paragraph_2.length}/500 caractères
              </p>
            </div>
          </div>
        </motion.div>

        {/* Highlights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`glass-effect-strong rounded-xl p-6 border space-y-6 ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${dashboardTheme.gradient} text-white`}>
                <FaRocket className="text-xl" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Points clés
                </h2>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formData.about_highlights.length} point{formData.about_highlights.length > 1 ? 's' : ''} clé{formData.about_highlights.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <motion.button
              type="button"
              onClick={addHighlight}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
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

          <div className="space-y-4">
            {formData.about_highlights.map((highlight, index) => {
              const isComplete = highlight.description.trim();
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  draggable
                  onDragStart={() => setDraggedIndex(index)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (draggedIndex === null || draggedIndex === index) return;
                    const newHighlights = [...formData.about_highlights];
                    const draggedItem = newHighlights[draggedIndex];
                    newHighlights.splice(draggedIndex, 1);
                    newHighlights.splice(index, 0, draggedItem);
                    setFormData({ ...formData, about_highlights: newHighlights });
                    setDraggedIndex(index);
                  }}
                  onDragEnd={() => setDraggedIndex(null)}
                  className={`glass-effect rounded-xl p-5 border transition-all cursor-move ${
                    isDarkMode ? 'border-gray-800 hover:border-red-500/50' : 'border-gray-200 hover:border-red-300'
                  } ${draggedIndex === index ? 'opacity-50 scale-95' : ''} ${
                    isComplete ? (isDarkMode ? 'bg-green-500/5 border-green-500/20' : 'bg-green-50 border-green-200') : ''
                  }`}
                  whileHover={{ scale: 1.01 }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                      }`}>
                        <FaGripVertical className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {index === 0 ? 'Qui suis-je ?' : index === 1 ? 'Expérience' : index === 2 ? 'Formation' : `Point clé #${index + 1}`}
                        </span>
                        {isComplete && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <FaCheck className="text-green-500 text-xs" />
                            <span className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                              Complète
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => moveHighlight(index, 'up')}
                          disabled={index === 0}
                          className={`p-1.5 rounded transition-all ${
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
                          onClick={() => moveHighlight(index, 'down')}
                          disabled={index === formData.about_highlights.length - 1}
                          className={`p-1.5 rounded transition-all ${
                            index === formData.about_highlights.length - 1
                              ? 'opacity-30 cursor-not-allowed'
                              : isDarkMode
                                ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <FaArrowDown className="text-xs" />
                        </button>
                      </div>
                      {formData.about_highlights.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHighlight(index)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkMode
                              ? 'text-red-400 hover:bg-red-500/10'
                              : 'text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Icon Selection */}
                  <div className="mb-4">
                    <label className={`flex items-center gap-2 text-xs font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Icône
                      {highlight.icon && <FaCheck className="text-green-500 text-xs" />}
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                      {iconOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleHighlightChange(index, 'icon', option.value)}
                          className={`p-3 rounded-lg transition-all border ${
                            highlight.icon === option.value
                              ? `bg-gradient-to-r ${dashboardTheme.gradient} text-white border-red-500 shadow-lg shadow-red-500/30`
                              : isDarkMode
                                ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 border-gray-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200'
                          }`}
                        >
                          <div className="text-xl flex justify-center">
                            {option.icon}
                          </div>
                          <div className="text-[10px] mt-1">{option.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-3 sm:mb-4">
                    <label className={`flex items-center gap-2 text-xs font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Description
                      {highlight.description.trim() && <FaCheck className="text-green-500 text-xs" />}
                    </label>
                    <textarea
                      value={highlight.description}
                      onChange={(e) => handleHighlightChange(index, 'description', e.target.value)}
                      rows={3}
                      className={`w-full px-4 py-2.5 glass-effect rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none transition-all ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      } ${highlight.description.trim() ? (isDarkMode ? 'border border-green-500/30' : 'border border-green-300') : ''}`}
                      placeholder="Décrivez ce point clé..."
                      maxLength="200"
                    />
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {highlight.description.length}/200 caractères
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`glass-effect-strong rounded-xl p-6 border ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-lg bg-gradient-to-r ${dashboardTheme.gradient} text-white`}>
              <FaCode className="text-xl" />
            </div>
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Statistiques
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className={`flex items-center gap-2 text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Commits GitHub
                {formData.about_stats.commits > 0 && <FaCheck className="text-green-500 text-xs" />}
              </label>
              <input
                type="number"
                value={formData.about_stats.commits}
                onChange={(e) => handleStatsChange('commits', e.target.value)}
                className={`w-full px-4 py-3 glass-effect rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                } ${formData.about_stats.commits > 0 ? (isDarkMode ? 'border border-green-500/30' : 'border border-green-300') : ''}`}
                min="0"
                placeholder="0"
              />
            </div>
            <div>
              <label className={`flex items-center gap-2 text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Technologies
                {formData.about_stats.technologies > 0 && <FaCheck className="text-green-500 text-xs" />}
              </label>
              <input
                type="number"
                value={formData.about_stats.technologies}
                onChange={(e) => handleStatsChange('technologies', e.target.value)}
                className={`w-full px-4 py-3 glass-effect rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                } ${formData.about_stats.technologies > 0 ? (isDarkMode ? 'border border-green-500/30' : 'border border-green-300') : ''}`}
                min="0"
                placeholder="0"
              />
            </div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-end"
        >
          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r ${dashboardTheme.gradient} text-white font-bold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base`}
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

export default AboutEditor;
