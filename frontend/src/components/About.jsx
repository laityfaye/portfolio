import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaDownload, FaUser, FaBriefcase, FaGraduationCap } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { getProfileImageUrl, getPublicImageUrl } from '../utils/imageUtils';

const About = ({ data = {} }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { theme, isDarkMode } = useTheme();

  // Valeurs par defaut
  const defaultHighlights = [
    { icon: 'FaUser', title: 'Qui suis-je ?', description: 'Developpeur passionne avec une expertise en developpement web full-stack et une soif constante d\'apprentissage.' },
    { icon: 'FaBriefcase', title: 'Experience', description: '5+ annees d\'experience dans la creation d\'applications web modernes et performantes pour divers clients.' },
    { icon: 'FaGraduationCap', title: 'Formation', description: 'Diplome en Ingenierie Informatique avec une specialisation en developpement logiciel et architecture systeme.' }
  ];

  const defaultStats = [
    { value: '150+', label: 'Commits GitHub' },
    { value: '25+', label: 'Technologies' }
  ];

  const {
    profile_image = getPublicImageUrl('images/profile.jpeg'),
    about_paragraph_1 = 'Passionne par le developpement web et les nouvelles technologies, je transforme des idees creatives en solutions digitales performantes et elegantes.',
    about_paragraph_2 = 'Mon parcours m\'a permis de maitriser l\'ensemble du cycle de developpement, de la conception a la mise en production. Je privilegie toujours l\'ecriture de code propre, maintenable et performant, tout en restant a l\'ecoute des besoins utilisateurs.',
    about_highlights: rawHighlights,
    about_stats: rawStats,
    skills: rawSkills = [],
    cv_file = null
  } = data;

  // Ensure arrays - parse JSON strings if needed
  const parseIfNeeded = (value, defaultValue) => {
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

  const about_highlights = parseIfNeeded(rawHighlights, defaultHighlights);

  // Construire about_stats avec les vraies valeurs : about_stats (commits, technologies) + skills.length pour Technologies
  const buildAboutStats = () => {
    const skills = parseIfNeeded(rawSkills, []);
    const technologiesCount = skills.length;

    // about_stats peut être un objet { commits, technologies } (format dashboard) ou un tableau legacy
    if (rawStats && typeof rawStats === 'object' && !Array.isArray(rawStats) && ('commits' in rawStats || 'technologies' in rawStats)) {
      const commits = Number(rawStats.commits) || 0;
      const technologies = technologiesCount > 0 ? technologiesCount : (Number(rawStats.technologies) || 0);
      return [
        { value: `${commits}+`, label: 'Commits GitHub' },
        { value: `${technologies}+`, label: 'Technologies' }
      ];
    }
    // Format tableau legacy
    if (Array.isArray(rawStats) && rawStats.length >= 2) {
      const technologies = technologiesCount > 0 ? technologiesCount : (parseInt(rawStats[1]?.value, 10) || 25);
      return [
        rawStats[0] || { value: '150+', label: 'Commits GitHub' },
        { value: `${technologies}+`, label: 'Technologies' }
      ];
    }
    // Valeurs par défaut avec technologies réelles si dispo
    if (technologiesCount > 0) {
      return [
        { value: '150+', label: 'Commits GitHub' },
        { value: `${technologiesCount}+`, label: 'Technologies' }
      ];
    }
    return defaultStats;
  };
  const about_stats = buildAboutStats();

  // Map des icones
  const iconMap = {
    FaUser: <FaUser />,
    FaBriefcase: <FaBriefcase />,
    FaGraduationCap: <FaGraduationCap />
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
    <section id="about" className={`section-padding relative overflow-hidden ${isDarkMode ? 'bg-dark-800/50' : 'bg-white'}`}>
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 rounded-full filter blur-3xl"
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
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full filter blur-3xl"
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
        <motion.div variants={itemVariants} className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-5xl font-bold mb-2 sm:mb-4">
            À propos de <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>moi</span>
          </h2>
          <div className={`w-16 sm:w-20 h-1 bg-gradient-to-r ${theme.gradient} mx-auto rounded-full`} />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-12 items-center">
          {/* Left Side - Image & Info */}
          <motion.div variants={itemVariants} className="space-y-4 sm:space-y-6">
            {/* Profile Image */}
            <div className="relative group">
              <motion.div
                className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-8 aspect-square flex items-center justify-center overflow-hidden relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Gradient Background */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br opacity-20" 
                  style={{ 
                    background: `linear-gradient(to bottom right, ${theme.primary.main}20, ${theme.primary.light}20)` 
                  }}
                />

                {/* Profile Image */}
                <img
                  src={getProfileImageUrl(profile_image)}
                  alt="Profile"
                  className="relative z-10 w-full h-full object-cover rounded-lg"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.target.src = getPublicImageUrl('images/profile.jpeg');
                  }}
                />

                {/* Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ 
                    background: `linear-gradient(to top, ${theme.primary.main}66, transparent)` 
                  }}
                />
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-12 h-12 sm:w-24 sm:h-24 border-2 sm:border-4 rounded-full"
                style={{ borderColor: theme.primary.main }}
                animate={{
                  rotate: 360
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <motion.div
                className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-16 h-16 sm:w-32 sm:h-32 border-2 sm:border-4 rounded-full"
                style={{ borderColor: theme.primary.light }}
                animate={{
                  rotate: -360
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>

            {/* Quick Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-2 sm:gap-4"
            >
              {about_stats.map((stat, index) => (
                <div key={index} className="glass-effect rounded-lg p-2 sm:p-4 text-center">
                  <div className="text-xl sm:text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                  <div className={`text-[10px] sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div variants={itemVariants} className="space-y-4 sm:space-y-6">
            <div className={`prose max-w-none ${isDarkMode ? 'prose-invert' : ''}`}>
              <p className={`text-sm sm:text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {about_paragraph_1}
              </p>
              <p className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {about_paragraph_2}
              </p>
            </div>

            {/* Highlights */}
            <div className="space-y-3 sm:space-y-4">
              {about_highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  className="card flex items-start gap-3 sm:gap-4 group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div className="text-xl sm:text-3xl mt-1 group-hover:scale-110 transition-transform duration-300" style={{ color: theme.primary.main }}>
                    {iconMap[highlight.icon] || <FaUser />}
                  </div>
                  <div>
                    <h3 className={`text-base sm:text-xl font-semibold mb-1 sm:mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      {highlight.title}
                    </h3>
                    <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {highlight.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Download CV Button */}
            {cv_file && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 1 }}
              >
                <motion.a
                  href={cv_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaDownload />
                  Telecharger mon CV
                </motion.a>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
