import { motion, useMotionValue, useTransform, useSpring, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getProfileImageUrl, getPublicImageUrl } from '../utils/imageUtils';

// Composant Counter animé
const AnimatedCounter = ({ value, suffix = '', className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2000, bounce: 0 });
  const display = useTransform(springValue, (val) => Math.round(val));

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{display}</motion.span>{suffix}
    </span>
  );
};

const Hero = ({ data = {} }) => {
  const { theme, isDarkMode } = useTheme();

  // Valeurs par defaut si data non fourni
  const defaultHeroStats = [
    { value: 5, suffix: '+', label: "Annees d'experience" },
    { value: 50, suffix: '+', label: 'Projets realises' },
    { value: 100, suffix: '%', label: 'Satisfaction client' },
  ];

  const {
    display_name = 'Votre Nom',
    job_title = 'Ingenieur Logiciel',
    hero_description = 'Je cree des experiences web exceptionnelles avec des technologies modernes. Passionne par le code propre, l\'innovation et la resolution de problemes complexes.',
    profile_image: rawProfileImage,
    hero_stats: rawHeroStats
  } = data;
  const profile_image = rawProfileImage || getPublicImageUrl('images/profile.jpeg');

  // Safe parsing for hero_stats - handle JSON strings or null
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

  const hero_stats = parseIfNeeded(rawHeroStats, defaultHeroStats);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-start sm:items-center justify-center relative overflow-hidden pt-4 sm:pt-0">
      {/* Fond subtil */}
      <div className={`absolute inset-0 mesh-gradient ${isDarkMode ? 'opacity-15' : 'opacity-[0.03]'}`} />
      <div className={`absolute inset-0 cyber-grid ${isDarkMode ? 'opacity-10' : 'opacity-[0.02]'}`} />

      {/* Orbe décoratif unique - discret */}
      <motion.div
        className="floating-orb w-80 h-80 top-1/4 -left-20"
        style={{ backgroundColor: theme.primary.main }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.12, 0.18, 0.12],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="floating-orb w-64 h-64 bottom-1/4 -right-16"
        style={{ backgroundColor: theme.primary.dark }}
        animate={{
          scale: [1.05, 1, 1.05],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Content */}
      <motion.div
        className="container-custom section-padding relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Photo de profil */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center lg:justify-end order-1"
            >
              <div className="relative">
                <div className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64">
                  {/* Anneaux animés */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2"
                    style={{ borderColor: theme.primary.main + '4d' }}
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: 360,
                    }}
                    transition={{
                      scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" }
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2"
                    style={{ borderColor: theme.primary.dark + '33' }}
                    animate={{
                      scale: [1.1, 1, 1.1],
                      rotate: -360,
                    }}
                    transition={{
                      scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                      rotate: { duration: 25, repeat: Infinity, ease: "linear" }
                    }}
                  />
                  {/* Cadre photo */}
                  <div
                    className="absolute inset-2 sm:inset-3 rounded-full overflow-hidden border-2"
                    style={{ borderColor: theme.primary.main + '40' }}
                  >
                    <img
                      src={getProfileImageUrl(profile_image)}
                      alt={display_name}
                      className="w-full h-full object-cover"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      onError={(e) => {
                        e.target.src = getPublicImageUrl('images/profile.jpeg');
                      }}
                    />
                  </div>
                  {/* Badge statut */}
                  <div
                    className="absolute -bottom-1 -right-1 glass-effect px-2 py-1 rounded-full flex items-center gap-1.5 border"
                    style={{ borderColor: theme.primary.main + '30' }}
                  >
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className={`text-[10px] sm:text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Disponible</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contenu texte */}
            <div className="text-center lg:text-left order-2">
              <motion.div variants={itemVariants} className="mb-4">
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-medium border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}
                  style={{ color: theme.primary.main }}
                >
                  Bienvenue sur mon portfolio
                </span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}
              >
                <span className={`block text-base sm:text-lg font-normal mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Salut, je suis</span>
                <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                  {display_name}
                </span>
              </motion.h1>

              <motion.h2
                variants={itemVariants}
                className={`text-lg sm:text-xl md:text-2xl font-semibold mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>{job_title}</span>
              </motion.h2>
            </div>
          </div>

          {/* Description et boutons */}
          <motion.div variants={itemVariants} className="mt-8 text-center">
            <p
              className={`text-sm sm:text-base lg:text-lg mb-6 leading-relaxed max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              {hero_description}
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <motion.a
                href="#projects"
                className="btn-primary text-sm px-5 py-2.5 rounded-xl"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Voir mes projets
              </motion.a>
              <motion.a
                href="#contact"
                className="btn-secondary text-sm px-5 py-2.5 rounded-xl"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Me contacter
              </motion.a>
            </div>
          </motion.div>

          {/* Statistiques */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto mt-12 sm:mt-16"
          >
            {hero_stats.map((stat, index) => (
              <motion.div
                key={index}
                className={`rounded-xl p-4 sm:p-6 text-center border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className={`text-2xl sm:text-4xl font-bold mb-1 bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Indicateur de scroll */}
      <motion.a
        href="#about"
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity"
        style={{ color: theme.primary.main }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-xs font-medium tracking-widest uppercase">Découvrir</span>
        <div className="w-6 h-10 rounded-full border-2 flex justify-center pt-2" style={{ borderColor: 'currentColor' }}>
          <motion.div
            className="w-1 h-2 rounded-full"
            style={{ backgroundColor: theme.primary.main }}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.a>
    </section>
  );
};

export default Hero;