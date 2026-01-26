import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaEdit, FaUpload, FaEye, FaCheck, FaTimes, FaGithub, FaExternalLinkAlt, FaImage, FaTag, FaCode, FaStar, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { projectsApi } from '../../api/projects';
import { getImageUrl } from '../../utils/imageUtils';
import toast from 'react-hot-toast';

const ProjectsEditor = ({ portfolio, onUpdate }) => {
  const { isDarkMode } = useTheme();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  
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
    title: '',
    description: '',
    category: 'web',
    tags: '',
    github_url: '',
    demo_url: '',
    featured: false,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectsApi.getAll();
      setProjects(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'web',
      tags: '',
      github_url: '',
      demo_url: '',
      featured: false,
    });
    setEditingProject(null);
    setImagePreview(null);
    setSelectedImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      ...formData,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    try {
      let projectId;

      if (editingProject) {
        await projectsApi.update(editingProject.id, data);
        projectId = editingProject.id;
        toast.success('Projet mis à jour avec succès!');
      } else {
        const response = await projectsApi.create(data);
        projectId = response.data.id;
        toast.success('Projet créé avec succès!');
      }

      // Upload de l'image si un fichier a été sélectionné
      if (selectedImageFile && projectId) {
        try {
          await projectsApi.uploadImage(projectId, selectedImageFile);
          toast.success('Image uploadée!');
        } catch (imageError) {
          toast.error('Erreur lors de l\'upload de l\'image');
        }
      }

      setShowForm(false);
      resetForm();
      fetchProjects();
      onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      tags: project.tags?.join(', ') || '',
      github_url: project.github_url || '',
      demo_url: project.demo_url || '',
      featured: project.featured,
    });
    setImagePreview(project.image ? getImageUrl(project.image) : null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce projet?')) return;

    try {
      await projectsApi.delete(id);
      toast.success('Projet supprimé!');
      fetchProjects();
      onUpdate();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleImageUpload = async (projectId, file) => {
    // Validation
    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image doit faire moins de 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    // Aperçu
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      await projectsApi.uploadImage(projectId, file);
      toast.success('Image mise à jour!');
      fetchProjects();
      onUpdate();
    } catch (error) {
      toast.error('Erreur lors de l\'upload');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image doit faire moins de 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    // Stocker le fichier pour l'upload après création
    setSelectedImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const moveProject = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === projects.length - 1) return;

    const newProjects = [...projects];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newProjects[index], newProjects[targetIndex]] = [newProjects[targetIndex], newProjects[index]];
    setProjects(newProjects);
  };

  const categories = [
    { value: 'web', label: 'Web' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'fullstack', label: 'Fullstack' },
    { value: 'other', label: 'Autre' },
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
            Projets
          </h1>
          <p className={`text-sm sm:text-base md:text-lg mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Gérez vos projets portfolio
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
            onClick={() => { resetForm(); setShowForm(true); }}
            className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r ${dashboardTheme.gradient} text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all flex items-center justify-center gap-2 text-sm sm:text-base`}
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
              {projects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className={`glass-effect rounded-xl overflow-hidden border transition-all hover:scale-105 ${
                        isDarkMode ? 'border-gray-800' : 'border-gray-200'
                      } ${project.featured ? (isDarkMode ? 'ring-2 ring-yellow-500/50' : 'ring-2 ring-yellow-400/50') : ''}`}
                    >
                      <div className="aspect-video relative overflow-hidden bg-gray-800">
                        {project.image ? (
                          <img src={getImageUrl(project.image)} alt={project.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${
                            isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                          }`}>
                            <FaImage className={`text-4xl ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                          </div>
                        )}
                        {project.featured && (
                          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                            <FaStar />
                            Featured
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                          {project.title}
                        </h3>
                        <p className={`text-sm mb-3 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.tags?.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className={`text-xs px-2 py-1 rounded-full ${
                                isDarkMode
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                  : 'bg-red-50 text-red-600 border border-red-200'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                          {project.tags?.length > 3 && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              isDarkMode ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              +{project.tags.length - 3}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`p-2 rounded-lg transition-colors ${
                                isDarkMode
                                  ? 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                                  : 'bg-gray-100 text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                              }`}
                            >
                              <FaGithub />
                            </a>
                          )}
                          {project.demo_url && (
                            <a
                              href={project.demo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`p-2 rounded-lg transition-colors ${
                                isDarkMode
                                  ? 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                                  : 'bg-gray-100 text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                              }`}
                            >
                              <FaExternalLinkAlt />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Aucun projet configuré
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => { setShowForm(false); resetForm(); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`glass-effect-strong rounded-xl p-6 border max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8 ${
                isDarkMode ? 'border-gray-800' : 'border-gray-200'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold bg-gradient-to-r ${dashboardTheme.gradient} bg-clip-text text-transparent`}>
                  {editingProject ? 'Modifier le projet' : 'Ajouter un projet'}
                </h2>
                <button
                  onClick={() => { setShowForm(false); resetForm(); }}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <FaTimes />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className={`flex items-center gap-2 text-sm font-semibold mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <FaImage className="text-red-500" />
                    Image du projet
                    {(imagePreview || editingProject?.image) && <FaCheck className="text-green-500 text-xs" />}
                  </label>
                  <div className="space-y-3">
                    {(imagePreview || editingProject?.image) && (
                      <div className="relative group">
                        <div className="aspect-video rounded-xl overflow-hidden border-2 border-red-500/30">
                          <img
                            src={imagePreview || getImageUrl(editingProject?.image)}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setSelectedImageFile(null);
                            if (editingProject) {
                              setEditingProject({ ...editingProject, image: null });
                            }
                          }}
                          className={`absolute top-2 right-2 p-2 rounded-lg transition-colors ${
                            isDarkMode
                              ? 'bg-red-500/90 text-white hover:bg-red-600'
                              : 'bg-red-500 text-white hover:bg-red-600'
                          }`}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    )}
                    <label className={`block w-full px-4 py-3 border-2 border-red-500 text-red-500 font-semibold rounded-xl hover:bg-red-500/10 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      isDarkMode ? 'border-red-500 text-red-400 hover:bg-red-500/20' : 'border-red-500 text-red-500 hover:bg-red-50'
                    }`}>
                      <FaUpload />
                      {imagePreview || editingProject?.image ? 'Changer l\'image' : 'Ajouter une image'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Format recommandé: 16:9, max 5MB
                    </p>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className={`flex items-center gap-2 text-sm font-semibold mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Titre
                    {formData.title && <FaCheck className="text-green-500 text-xs" />}
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className={`w-full px-4 py-3 glass-effect rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all ${
                      isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                    } ${formData.title ? (isDarkMode ? 'border border-green-500/30' : 'border border-green-300') : ''}`}
                    placeholder="Nom du projet"
                    maxLength="100"
                  />
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {formData.title.length}/100 caractères
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className={`flex items-center gap-2 text-sm font-semibold mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Description
                    {formData.description && <FaCheck className="text-green-500 text-xs" />}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                    className={`w-full px-4 py-3 glass-effect rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none transition-all ${
                      isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                    } ${formData.description ? (isDarkMode ? 'border border-green-500/30' : 'border border-green-300') : ''}`}
                    placeholder="Décrivez votre projet..."
                    maxLength="500"
                  />
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {formData.description.length}/500 caractères
                  </p>
                </div>

                {/* Category */}
                <div>
                  <label className={`flex items-center gap-2 text-sm font-semibold mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <FaCode className="text-red-500" />
                    Catégorie
                    {formData.category && <FaCheck className="text-green-500 text-xs" />}
                  </label>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value} className={isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className={`flex items-center gap-2 text-sm font-semibold mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <FaTag className="text-red-500" />
                    Tags (séparés par des virgules)
                    {formData.tags && <FaCheck className="text-green-500 text-xs" />}
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className={`w-full px-4 py-3 glass-effect rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all ${
                      isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                    } ${formData.tags ? (isDarkMode ? 'border border-green-500/30' : 'border border-green-300') : ''}`}
                    placeholder="React, Node.js, MongoDB"
                  />
                  {formData.tags && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.split(',').map((t) => t.trim()).filter(Boolean).map((tag, idx) => (
                        <span
                          key={idx}
                          className={`text-xs px-2 py-1 rounded-full ${
                            isDarkMode
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-red-50 text-red-600 border border-red-200'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* URLs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className={`flex items-center gap-2 text-sm font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <FaGithub className="text-red-500" />
                      URL GitHub
                      {formData.github_url && <FaCheck className="text-green-500 text-xs" />}
                    </label>
                    <input
                      type="url"
                      value={formData.github_url}
                      onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                      className={`w-full px-4 py-3 glass-effect rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all ${
                        isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                      } ${formData.github_url ? (isDarkMode ? 'border border-green-500/30' : 'border border-green-300') : ''}`}
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div>
                    <label className={`flex items-center gap-2 text-sm font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <FaExternalLinkAlt className="text-red-500" />
                      URL Demo
                      {formData.demo_url && <FaCheck className="text-green-500 text-xs" />}
                    </label>
                    <input
                      type="url"
                      value={formData.demo_url}
                      onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                      className={`w-full px-4 py-3 glass-effect rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all ${
                        isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                      } ${formData.demo_url ? (isDarkMode ? 'border border-green-500/30' : 'border border-green-300') : ''}`}
                      placeholder="https://demo.com/..."
                    />
                  </div>
                </div>

                {/* Featured */}
                <div className={`p-4 rounded-xl border ${
                  isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'
                }`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full transition-colors ${
                        formData.featured
                          ? `bg-gradient-to-r ${dashboardTheme.gradient}`
                          : isDarkMode
                            ? 'bg-gray-700'
                            : 'bg-gray-300'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                          formData.featured ? 'translate-x-6' : 'translate-x-0.5'
                        } mt-0.5`} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaStar className={`text-lg ${formData.featured ? 'text-yellow-500' : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}`} />
                      <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        Projet mis en avant
                      </span>
                    </div>
                  </label>
                  <p className={`text-xs mt-2 ml-15 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Les projets mis en avant apparaîtront en premier dans votre portfolio
                  </p>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                  <motion.button
                    type="button"
                    onClick={() => { setShowForm(false); resetForm(); }}
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
                    disabled={loading || !formData.title || !formData.description}
                    className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r ${dashboardTheme.gradient} text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base`}
                    whileHover={{ scale: loading || !formData.title || !formData.description ? 1 : 1.02 }}
                    whileTap={{ scale: loading || !formData.title || !formData.description ? 1 : 0.98 }}
                  >
                    {loading ? 'Enregistrement...' : editingProject ? 'Modifier' : 'Ajouter'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects List */}
      {projects.length > 0 ? (
        <div className="space-y-4">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`glass-effect-strong rounded-xl p-6 border transition-all hover:shadow-xl ${
                isDarkMode ? 'border-gray-800 hover:border-gray-700' : 'border-gray-200 hover:border-gray-300'
              } ${project.featured ? (isDarkMode ? 'ring-2 ring-yellow-500/30' : 'ring-2 ring-yellow-400/30') : ''}`}
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* Image */}
                <div className="flex-shrink-0 w-full sm:w-48 aspect-video rounded-xl overflow-hidden border-2 border-red-500/20">
                  {project.image ? (
                    <img src={getImageUrl(project.image)} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${
                      isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>
                      <FaImage className={`text-3xl ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    </div>
                  )}
                  {project.featured && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                      <FaStar />
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {project.title}
                      </h3>
                      <p className={`text-sm mb-3 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {project.description}
                      </p>
                    </div>
                    
                    {/* Reorder buttons */}
                    <div className="flex flex-col gap-1 ml-4">
                      <button
                        onClick={() => moveProject(index, 'up')}
                        disabled={index === 0}
                        className={`p-2 rounded-lg transition-colors ${
                          index === 0
                            ? 'opacity-30 cursor-not-allowed'
                            : isDarkMode
                              ? 'hover:bg-gray-800 text-gray-400'
                              : 'hover:bg-gray-100 text-gray-600'
                        }`}
                        title="Déplacer vers le haut"
                      >
                        <FaArrowUp />
                      </button>
                      <button
                        onClick={() => moveProject(index, 'down')}
                        disabled={index === projects.length - 1}
                        className={`p-2 rounded-lg transition-colors ${
                          index === projects.length - 1
                            ? 'opacity-30 cursor-not-allowed'
                            : isDarkMode
                              ? 'hover:bg-gray-800 text-gray-400'
                              : 'hover:bg-gray-100 text-gray-600'
                        }`}
                        title="Déplacer vers le bas"
                      >
                        <FaArrowDown />
                      </button>
                    </div>
                  </div>

                  {/* Category & Tags */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      isDarkMode
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-red-50 text-red-600 border border-red-200'
                    }`}>
                      {categories.find(c => c.value === project.category)?.label || project.category}
                    </span>
                    {project.tags?.slice(0, 5).map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs px-2 py-1 rounded-full ${
                          isDarkMode
                            ? 'bg-gray-800 text-gray-300 border border-gray-700'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags?.length > 5 && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        +{project.tags.length - 5}
                      </span>
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-3 mb-4">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                          isDarkMode
                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                        }`}
                      >
                        <FaGithub />
                        <span className="text-xs">GitHub</span>
                      </a>
                    )}
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                          isDarkMode
                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                        }`}
                      >
                        <FaExternalLinkAlt />
                        <span className="text-xs">Demo</span>
                      </a>
                    )}
                    {!project.github_url && !project.demo_url && (
                      <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Aucun lien configuré
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <label className={`w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      isDarkMode
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}>
                      <FaUpload />
                      Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files[0] && handleImageUpload(project.id, e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                    <motion.button
                      onClick={() => handleEdit(project)}
                      className={`w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                        isDarkMode
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaEdit />
                      Modifier
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(project.id)}
                      className={`w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                        isDarkMode
                          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                          : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaTrash />
                      Supprimer
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`glass-effect-strong rounded-xl p-12 text-center border ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}
        >
          <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <FaCode className={`text-4xl ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          </div>
          <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Aucun projet
          </h3>
          <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Commencez par ajouter votre premier projet pour enrichir votre portfolio
          </p>
          <motion.button
            onClick={() => { resetForm(); setShowForm(true); }}
            className={`px-6 py-3 bg-gradient-to-r ${dashboardTheme.gradient} text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus className="inline mr-2" />
            Ajouter un projet
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default ProjectsEditor;
