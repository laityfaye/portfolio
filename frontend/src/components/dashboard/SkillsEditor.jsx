import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaSave, FaEye, FaEdit, FaCheck, FaTimes, FaCode, FaGripVertical, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { skillsApi } from '../../api/skills';
import { skillIcons, getIcon } from '../../utils/iconMapper';
import toast from 'react-hot-toast';

const SkillsEditor = ({ portfolio, onUpdate }) => {
  const { isDarkMode } = useTheme();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [showAllIcons, setShowAllIcons] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);
  
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
    name: '',
    icon: 'FaReact',
    level: 50,
    category: 'frontend',
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await skillsApi.getAll();
      setSkills(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await skillsApi.update(editingId, formData);
        toast.success('Compétence mise à jour!');
      } else {
        await skillsApi.create(formData);
        toast.success('Compétence ajoutée!');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', icon: 'FaReact', level: 50, category: 'frontend' });
      fetchSkills();
      onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (skill) => {
    setFormData({
      name: skill.name,
      icon: skill.icon,
      level: skill.level,
      category: skill.category,
    });
    setEditingId(skill.id);
    
    // Vérifier si c'est une catégorie personnalisée
    const isCustomCategory = !categories.some(cat => cat.value === skill.category);
    if (isCustomCategory) {
      setShowCustomCategoryInput(true);
      setCustomCategory(skill.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
    } else {
      setShowCustomCategoryInput(false);
      setCustomCategory('');
    }
    
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette compétence?')) return;

    try {
      await skillsApi.delete(id);
      toast.success('Compétence supprimée!');
      fetchSkills();
      onUpdate();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setShowAllIcons(false);
    setShowCustomCategoryInput(false);
    setCustomCategory('');
    setFormData({ name: '', icon: 'FaReact', level: 50, category: 'frontend' });
  };

  const categories = [
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'database_tools', label: 'Database & Tools' },
    { value: 'reseau', label: 'Réseaux' },
    { value: 'geomatique', label: 'Géomatique' },
    { value: 'genie_civil', label: 'Génie Civil' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'devops', label: 'DevOps' },
    { value: 'autre', label: 'Autre (personnalisée)' },
  ];

  // Fonction pour suggérer automatiquement l'icône basée sur le nom
  const suggestIcon = (skillName) => {
    if (!skillName) return 'FaReact';
    
    const name = skillName.toLowerCase().trim();
    
    // Mapping intelligent des noms vers les icônes
    const iconMapping = {
      // Frontend
      'react': 'FaReact',
      'vue': 'FaVuejs',
      'vue.js': 'FaVuejs',
      'vuejs': 'FaVuejs',
      'angular': 'FaAngular',
      'html': 'FaHtml5',
      'html5': 'FaHtml5',
      'css': 'FaCss3Alt',
      'css3': 'FaCss3Alt',
      'javascript': 'FaJs',
      'js': 'FaJs',
      'typescript': 'SiTypescript',
      'ts': 'SiTypescript',
      'tailwind': 'SiTailwindcss',
      'tailwindcss': 'SiTailwindcss',
      'next': 'SiNextdotjs',
      'next.js': 'SiNextdotjs',
      'nextjs': 'SiNextdotjs',
      'redux': 'SiRedux',
      
      // Backend
      'node': 'FaNodeJs',
      'node.js': 'FaNodeJs',
      'nodejs': 'FaNodeJs',
      'python': 'FaPython',
      'php': 'FaPhp',
      'java': 'FaJava',
      'express': 'SiExpress',
      'laravel': 'SiLaravel',
      'django': 'SiDjango',
      'graphql': 'SiGraphql',
      'go': 'SiGo',
      'golang': 'SiGo',
      'rust': 'SiRust',
      
      // Database
      'mongodb': 'SiMongodb',
      'mongo': 'SiMongodb',
      'postgresql': 'SiPostgresql',
      'postgres': 'SiPostgresql',
      'mysql': 'SiMysql',
      'firebase': 'SiFirebase',
      'database': 'FaDatabase',
      'db': 'FaDatabase',
      
      // Tools
      'docker': 'FaDocker',
      'git': 'FaGitAlt',
      'aws': 'FaAws',
      'amazon': 'FaAws',
    };

    // Recherche exacte
    if (iconMapping[name]) {
      return iconMapping[name];
    }

    // Recherche partielle (contient)
    for (const [key, icon] of Object.entries(iconMapping)) {
      if (name.includes(key) || key.includes(name)) {
        return icon;
      }
    }

    // Par défaut selon la catégorie
    return formData.category === 'frontend' ? 'FaReact' : 
           formData.category === 'backend' ? 'FaNodeJs' : 
           'FaDatabase';
  };

  // Fonction pour obtenir les icônes pertinentes selon la catégorie
  const getRelevantIcons = () => {
    const categoryIcons = {
      frontend: ['FaReact', 'FaVuejs', 'FaAngular', 'FaHtml5', 'FaCss3Alt', 'FaJs', 'SiTypescript', 'SiTailwindcss', 'SiNextdotjs', 'SiRedux'],
      backend: ['FaNodeJs', 'FaPython', 'FaPhp', 'FaJava', 'SiExpress', 'SiLaravel', 'SiDjango', 'SiGraphql', 'SiGo', 'SiRust'],
      database_tools: ['FaDocker', 'FaGitAlt', 'FaAws', 'SiMongodb', 'SiPostgresql', 'SiMysql', 'SiFirebase', 'FaDatabase'],
    };

    const suggestedIcon = formData.name ? suggestIcon(formData.name) : null;
    const categoryIconList = categoryIcons[formData.category] || [];
    
    // Si une icône est suggérée et n'est pas dans la liste de la catégorie, l'ajouter en premier
    const relevantIcons = suggestedIcon && !categoryIconList.includes(suggestedIcon)
      ? [suggestedIcon, ...categoryIconList]
      : categoryIconList;

    // Filtrer les icônes disponibles pour ne garder que celles pertinentes
    return skillIcons.filter(icon => relevantIcons.includes(icon.name));
  };

  // Mettre à jour l'icône automatiquement quand le nom change
  useEffect(() => {
    if (formData.name && showForm) {
      const suggestedIcon = suggestIcon(formData.name);
      if (suggestedIcon !== formData.icon) {
        setFormData(prev => ({ ...prev, icon: suggestedIcon }));
      }
    }
  }, [formData.name, formData.category, showForm]);

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

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
            Compétences
          </h1>
          <p className={`text-sm sm:text-base md:text-lg mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Gérez vos compétences techniques
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <motion.button
            onClick={() => setShowPreview(!showPreview)}
            className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
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
          <motion.button
            onClick={() => {
              setEditingId(null);
              setFormData({ name: '', icon: 'FaReact', level: 50, category: 'frontend' });
              setShowForm(true);
            }}
            className={`px-6 py-3 bg-gradient-to-r ${dashboardTheme.gradient} text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all flex items-center gap-2`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus />
            Ajouter
          </motion.button>
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
            <div className={`p-8 rounded-lg ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
              {categories
                // Trier les catégories par nombre de compétences décroissant
                .sort((a, b) => {
                  const countA = (groupedSkills[a.value] || []).length;
                  const countB = (groupedSkills[b.value] || []).length;
                  return countB - countA; // Décroissant
                })
                .map((cat) => {
                const categorySkills = groupedSkills[cat.value] || [];
                if (categorySkills.length === 0) return null;
                
                return (
                  <div key={cat.value} className="mb-8 last:mb-0">
                    <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      {cat.label}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      {categorySkills.map((skill) => (
                        <div
                          key={skill.id}
                          className={`glass-effect rounded-xl p-4 border text-center ${
                            isDarkMode ? 'border-gray-800' : 'border-gray-200'
                          }`}
                        >
                          <div className={`text-3xl mb-2 flex justify-center ${
                            isDarkMode ? 'text-red-400' : 'text-red-500'
                          }`}>
                            {getIcon(skill.icon)}
                          </div>
                          <p className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            {skill.name}
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full bg-gradient-to-r ${dashboardTheme.gradient}`}
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {skill.level}%
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {skills.length === 0 && (
                <p className={`text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Aucune compétence configurée
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleCancel}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`glass-effect-strong rounded-xl p-6 border max-w-md w-full max-h-[90vh] overflow-y-auto ${
                isDarkMode ? 'border-gray-800' : 'border-gray-200'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold bg-gradient-to-r ${dashboardTheme.gradient} bg-clip-text text-transparent`}>
                  {editingId ? 'Modifier la compétence' : 'Ajouter une compétence'}
                </h2>
                <button
                  onClick={handleCancel}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <FaTimes />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className={`flex items-center gap-2 text-sm font-semibold mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Nom
                    {formData.name && <FaCheck className="text-green-500 text-xs" />}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setFormData({ ...formData, name: newName });
                    }}
                    required
                    className={`w-full px-4 py-3 glass-effect rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all ${
                      isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                    } ${formData.name ? (isDarkMode ? 'border border-green-500/30' : 'border border-green-300') : ''}`}
                    placeholder="React, Node.js, Python..."
                  />
                  {formData.name && (
                    <p className={`text-xs mt-1 flex items-center gap-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <span className="text-green-500">✓</span>
                      Icône suggérée automatiquement
                    </p>
                  )}
                </div>

                <div>
                  <label className={`flex items-center gap-2 text-sm font-semibold mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Icône
                    {formData.icon && <FaCheck className="text-green-500 text-xs" />}
                    {formData.name && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
                      }`}>
                        Auto-suggérée
                      </span>
                    )}
                  </label>
                  <div className={`p-4 rounded-xl border mb-3 ${
                    isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="text-center">
                      <div className={`text-5xl mb-2 flex justify-center ${
                        isDarkMode ? 'text-red-400' : 'text-red-500'
                      }`}>
                        {getIcon(formData.icon)}
                      </div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Aperçu
                      </p>
                      {formData.name && (
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                          ✓ Icône suggérée pour "{formData.name}"
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Bouton de fermeture en haut quand toutes les icônes sont ouvertes */}
                  {showAllIcons && (
                    <div className="flex justify-end mb-2">
                      <button
                        type="button"
                        onClick={() => setShowAllIcons(false)}
                        className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-2 text-sm ${
                          isDarkMode
                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                        }`}
                      >
                        <FaTimes className="text-xs" />
                        Fermer
                      </button>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto scrollbar-thin">
                    {(showAllIcons ? skillIcons : getRelevantIcons().slice(0, 4)).map((icon) => {
                      const isSuggested = formData.name && suggestIcon(formData.name) === icon.name;
                      const isRelevant = getRelevantIcons().some(relIcon => relIcon.name === icon.name);
                      return (
                        <button
                          key={icon.name}
                          type="button"
                          onClick={() => setFormData({ ...formData, icon: icon.name })}
                          className={`p-3 rounded-lg transition-all border relative ${
                            formData.icon === icon.name
                              ? `bg-gradient-to-r ${dashboardTheme.gradient} text-white border-red-500 shadow-lg shadow-red-500/30`
                              : isSuggested
                                ? isDarkMode
                                  ? 'bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30'
                                  : 'bg-green-100 text-green-600 border-green-300 hover:bg-green-200'
                                : !isRelevant && showAllIcons
                                  ? isDarkMode
                                    ? 'bg-gray-900/50 text-gray-500 border-gray-800 opacity-60'
                                    : 'bg-gray-50 text-gray-400 border-gray-200 opacity-60'
                                  : isDarkMode
                                    ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 border-gray-700'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200'
                          }`}
                        >
                          {isSuggested && formData.icon !== icon.name && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                          <div className="text-xl flex justify-center mb-1">
                            {getIcon(icon.name)}
                          </div>
                          <div className="text-[10px] truncate">{icon.label}</div>
                        </button>
                      );
                    })}
                  </div>
                  {getRelevantIcons().length > 4 && (
                    <button
                      type="button"
                      onClick={() => setShowAllIcons(!showAllIcons)}
                      className={`w-full mt-3 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                        isDarkMode
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                      }`}
                    >
                      {showAllIcons ? (
                        <>
                          <FaTimes className="text-xs" />
                          Voir moins (afficher seulement les icônes pertinentes)
                        </>
                      ) : (
                        <>
                          <FaPlus className="text-xs" />
                          Voir toutes les icônes ({skillIcons.length - getRelevantIcons().length} autres disponibles)
                        </>
                      )}
                    </button>
                  )}
                  {getRelevantIcons().length <= 4 && skillIcons.length > 4 && (
                    <button
                      type="button"
                      onClick={() => setShowAllIcons(!showAllIcons)}
                      className={`w-full mt-3 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                        isDarkMode
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                      }`}
                    >
                      {showAllIcons ? (
                        <>
                          <FaTimes className="text-xs" />
                          Voir moins (afficher seulement les icônes pertinentes)
                        </>
                      ) : (
                        <>
                          <FaPlus className="text-xs" />
                          Voir toutes les icônes ({skillIcons.length} disponibles)
                        </>
                      )}
                    </button>
                  )}
                  {getRelevantIcons().length === 0 && (
                    <p className={`text-center text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Aucune icône disponible pour cette catégorie
                    </p>
                  )}
                </div>

                <div>
                  <label className={`flex items-center gap-2 text-sm font-semibold mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Niveau: {formData.level}%
                    {formData.level > 0 && <FaCheck className="text-green-500 text-xs" />}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                    <div className={`w-full bg-gray-200 rounded-full h-2 mt-2 ${
                      isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                    }`}>
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${dashboardTheme.gradient} transition-all`}
                        style={{ width: `${formData.level}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={`flex items-center gap-2 text-sm font-semibold mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Catégorie
                    {formData.category && <FaCheck className="text-green-500 text-xs" />}
                  </label>
                  
                  <div className="space-y-2">
                    <div className="relative">
                      <select
                        value={showCustomCategoryInput ? 'autre' : formData.category}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === 'autre') {
                            setShowCustomCategoryInput(true);
                            setFormData({ ...formData, category: 'autre' });
                          } else {
                            setShowCustomCategoryInput(false);
                            setCustomCategory('');
                            setFormData({ ...formData, category: value });
                          }
                        }}
                        className={`w-full px-4 py-3 glass-effect rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all appearance-none cursor-pointer ${
                          isDarkMode ? 'text-white bg-gray-900/50' : 'text-gray-800 bg-white'
                        } ${formData.category ? (isDarkMode ? 'border border-green-500/30' : 'border border-green-300') : ''}`}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='${isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)'}' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 1rem center',
                          paddingRight: '2.5rem'
                        }}
                      >
                        {categories.filter(cat => cat.value !== 'autre').map((cat) => (
                          <option 
                            key={cat.value} 
                            value={cat.value}
                            className={isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}
                          >
                            {cat.label}
                          </option>
                        ))}
                        <option value="autre" className={isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}>
                          Autre (catégorie personnalisée)
                        </option>
                      </select>
                      <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Champ de saisie pour catégorie personnalisée */}
                    {showCustomCategoryInput && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        <div className={`p-3 rounded-xl border ${
                          isDarkMode 
                            ? 'bg-green-500/10 border-green-500/30' 
                            : 'bg-green-50 border-green-200'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <FaPlus className={`text-sm ${
                              isDarkMode ? 'text-green-400' : 'text-green-600'
                            }`} />
                            <span className={`text-sm font-semibold ${
                              isDarkMode ? 'text-green-400' : 'text-green-700'
                            }`}>
                              Créer une catégorie personnalisée
                            </span>
                          </div>
                          <input
                            type="text"
                            value={customCategory}
                            onChange={(e) => {
                              const value = e.target.value;
                              setCustomCategory(value);
                              if (value.trim()) {
                                setFormData({ ...formData, category: value.trim().toLowerCase().replace(/\s+/g, '_') });
                              }
                            }}
                            placeholder="Ex: Ingénierie Réseaux, Géomatique, Génie Civil..."
                            className={`w-full px-4 py-2.5 glass-effect rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all ${
                              isDarkMode ? 'text-white placeholder-gray-500 bg-gray-900/50' : 'text-gray-800 placeholder-gray-400 bg-white'
                            } ${customCategory ? (isDarkMode ? 'border border-green-500/50' : 'border border-green-400') : ''}`}
                            maxLength="50"
                            autoFocus
                          />
                          {customCategory && (
                            <p className={`text-xs flex items-center gap-1 mt-2 ${
                              isDarkMode ? 'text-green-400' : 'text-green-600'
                            }`}>
                              <FaCheck className="text-xs" />
                              Catégorie: <span className="font-semibold">"{customCategory}"</span>
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <motion.button
                    type="button"
                    onClick={handleCancel}
                    className={`flex-1 px-6 py-3 border-2 rounded-xl font-semibold transition-all ${
                      isDarkMode
                        ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={loading || !formData.name}
                    className={`flex-1 px-6 py-3 bg-gradient-to-r ${dashboardTheme.gradient} text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                    whileHover={{ scale: loading || !formData.name ? 1 : 1.02 }}
                    whileTap={{ scale: loading || !formData.name ? 1 : 0.98 }}
                  >
                    {loading ? 'Enregistrement...' : editingId ? 'Modifier' : 'Ajouter'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skills List by Category */}
      {categories.filter(cat => cat.value !== 'autre').concat(
        // Ajouter les catégories personnalisées trouvées dans les compétences
        ...Object.keys(groupedSkills)
          .filter(cat => !categories.some(c => c.value === cat))
          .map(cat => ({
            value: cat,
            label: cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
          }))
      )
      // Trier les catégories par nombre de compétences décroissant
      .sort((a, b) => {
        const countA = (groupedSkills[a.value] || []).length;
        const countB = (groupedSkills[b.value] || []).length;
        return countB - countA; // Décroissant
      })
      .map((cat) => {
        const categorySkills = groupedSkills[cat.value] || [];
        return (
          <motion.div
            key={cat.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-effect-strong rounded-xl p-6 border ${
              isDarkMode ? 'border-gray-800' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${dashboardTheme.gradient} text-white`}>
                  <FaCode className="text-xl" />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {cat.label}
                  </h2>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {categorySkills.length} compétence{categorySkills.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
            
            {categorySkills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {categorySkills.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`glass-effect rounded-xl p-4 border transition-all hover:scale-105 ${
                      isDarkMode ? 'border-gray-800 hover:border-red-500/50' : 'border-gray-200 hover:border-red-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`text-3xl ${
                          isDarkMode ? 'text-red-400' : 'text-red-500'
                        }`}>
                          {getIcon(skill.icon)}
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            {skill.name}
                          </p>
                          <div className="space-y-1">
                            <div className={`w-full rounded-full h-2 ${
                              isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                            }`}>
                              <div
                                className={`h-2 rounded-full bg-gradient-to-r ${dashboardTheme.gradient} transition-all`}
                                style={{ width: `${skill.level}%` }}
                              />
                            </div>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {skill.level}%
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(skill)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkMode
                              ? 'text-blue-400 hover:bg-blue-500/10'
                              : 'text-blue-500 hover:bg-blue-50'
                          }`}
                          title="Modifier"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkMode
                              ? 'text-red-400 hover:bg-red-500/10'
                              : 'text-red-500 hover:bg-red-50'
                          }`}
                          title="Supprimer"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className={`text-center p-8 rounded-lg border ${
                isDarkMode ? 'border-gray-800 bg-gray-900/30' : 'border-gray-200 bg-gray-50'
              }`}>
                <FaCode className={`text-4xl mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>
                  Aucune compétence dans cette catégorie
                </p>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default SkillsEditor;
