import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { FaGithub, FaExternalLinkAlt, FaCode, FaStar } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { getImageUrl } from '../utils/imageUtils';

const Projects = ({ projects: rawProjects = [], socialLinks: rawSocialLinks = {} }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [filter, setFilter] = useState('all');
  const { theme, isDarkMode } = useTheme();

  // Safe parsing for arrays/objects - handle JSON strings or null
  const parseArrayIfNeeded = (value, defaultValue) => {
    if (!value) return defaultValue;
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : defaultValue;
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  };

  const parseObjectIfNeeded = (value, defaultValue) => {
    if (!value) return defaultValue;
    if (typeof value === 'object' && !Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : defaultValue;
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  };

  const propProjects = parseArrayIfNeeded(rawProjects, []);
  const socialLinks = parseObjectIfNeeded(rawSocialLinks, {});

  const categories = ['all', 'web', 'mobile', 'fullstack'];

  // Donnees par defaut si pas de projets
  const defaultProjects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'Plateforme de commerce electronique complete avec panier, paiement et gestion des commandes.',
      image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
      category: 'fullstack',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      github_url: 'https://github.com',
      demo_url: 'https://demo.com',
      featured: true
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Application de gestion de taches collaborative avec temps reel et notifications.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
      category: 'web',
      tags: ['React', 'Firebase', 'Tailwind'],
      github_url: 'https://github.com',
      demo_url: 'https://demo.com',
      featured: false
    },
    {
      id: 3,
      title: 'Portfolio Designer',
      description: 'Outil de creation de portfolio en ligne avec editeur drag-and-drop.',
      image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop',
      category: 'web',
      tags: ['Next.js', 'TypeScript', 'Prisma'],
      github_url: 'https://github.com',
      demo_url: 'https://demo.com',
      featured: true
    }
  ];

  // Utiliser les projets fournis ou les valeurs par defaut
  const projects = propProjects.length > 0 ? propProjects : defaultProjects;

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(project => project.category === filter);

  // GitHub link from social links
  const githubUrl = socialLinks?.github || 'https://github.com';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="projects" className={`section-padding relative overflow-hidden ${isDarkMode ? 'bg-dark-800/50' : 'bg-white'}`}>
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/2 right-0 w-96 h-96 rounded-full filter blur-3xl"
          style={{ backgroundColor: theme.primary.main + '1a' }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full filter blur-3xl"
          style={{ backgroundColor: theme.primary.light + '15' }}
          animate={{
            scale: [1.1, 0.9, 1.1],
            opacity: [0.1, 0.18, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <motion.div
        ref={ref}
        className="container-custom relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Mes <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>Projets</span>
          </h2>
          <div className={`w-20 h-1 bg-gradient-to-r ${theme.gradient} mx-auto rounded-full mb-4`} />
          <p className={`max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Découvrez une sélection de mes réalisations récentes
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                filter === category
                  ? `bg-gradient-to-r ${theme.gradientDark} text-white shadow-lg`
                  : `glass-effect ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`
              }`}
              style={filter === category ? { boxShadow: `0 0 20px ${theme.shadow}` } : {}}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          layout
        >
          {filteredProjects.map((project, index) => {
            const hasDemoUrl = project.demo_url && project.demo_url.trim() !== '';
            
            const handleCardClick = (e) => {
              // Ne pas rediriger si on clique sur un lien ou un bouton
              if (e.target.closest('a[href]') || e.target.closest('button')) {
                return;
              }
              // Rediriger vers la démo si elle existe
              if (hasDemoUrl) {
                window.open(project.demo_url, '_blank', 'noopener,noreferrer');
              }
            };

            return (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group relative"
              >
                <motion.div
                  className={`card h-full flex flex-col overflow-hidden ${hasDemoUrl ? 'cursor-pointer' : ''}`}
                  whileHover={hasDemoUrl ? { scale: 1.02, y: -5 } : {}}
                  whileTap={hasDemoUrl ? { scale: 0.98 } : {}}
                  onClick={handleCardClick}
                >
                {/* Featured Badge */}
                {project.featured && (
                  <div 
                    className="absolute top-4 right-4 z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <motion.div
                      className="glass-effect px-3 py-1 rounded-full flex items-center gap-1 text-yellow-400"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <FaStar className="text-sm" />
                      <span className="text-xs font-semibold">Featured</span>
                    </motion.div>
                  </div>
                )}

                {/* Project Image */}
                <div className="relative overflow-hidden rounded-lg mb-4 aspect-video bg-gray-200 dark:bg-gray-800">
                  <img
                    src={getImageUrl(project.image) || project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                    onLoad={(e) => {
                      e.target.style.opacity = '1';
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                    style={{ opacity: 0, transition: 'opacity 0.3s' }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${isDarkMode ? 'from-dark-900 via-dark-900/50' : 'from-gray-900/20 via-gray-900/10'} to-transparent ${isDarkMode ? 'opacity-60 group-hover:opacity-80' : 'opacity-30 group-hover:opacity-40'} transition-opacity duration-300`} />

                  {/* Overlay Links */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {project.github_url && (
                      <motion.a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-effect p-3 rounded-full text-white hover:bg-white/20 transition-colors z-20"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaGithub className="text-xl" />
                      </motion.a>
                    )}
                    {project.demo_url && (
                      <motion.a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-effect p-3 rounded-full text-white hover:bg-white/20 transition-colors z-20"
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaExternalLinkAlt className="text-xl" />
                      </motion.a>
                    )}
                  </div>
                </div>

                {/* Project Info */}
                <div className="flex-1 flex flex-col">
                  <h3
                    className={`text-xl font-bold mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                    onMouseEnter={(e) => e.currentTarget.style.color = theme.primary.main}
                    onMouseLeave={(e) => e.currentTarget.style.color = isDarkMode ? 'white' : '#1f2937'}
                  >
                    {project.title}
                  </h3>
                  <p className={`text-sm mb-4 flex-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {parseArrayIfNeeded(project.tags, []).map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs px-3 py-1 rounded-full border font-medium transition-all duration-300 ${
                          isDarkMode 
                            ? 'glass-effect-strong hover:scale-105' 
                            : 'glass-effect hover:scale-105'
                        }`}
                        style={{ 
                          color: isDarkMode ? theme.primary.light : theme.primary.main,
                          borderColor: isDarkMode ? `${theme.primary.main}70` : `${theme.primary.main}50`,
                          backgroundColor: isDarkMode ? `${theme.primary.main}20` : 'transparent',
                          boxShadow: isDarkMode ? `0 0 8px ${theme.glow.replace('0.4', '0.15')}` : 'none'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
            );
          })}
        </motion.div>

        {/* View More */}
        {githubUrl && (
          <motion.div
            variants={itemVariants}
            className="text-center mt-12"
          >
            <motion.a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaCode />
              Voir plus sur GitHub
            </motion.a>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default Projects;
