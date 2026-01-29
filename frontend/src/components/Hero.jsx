// eslint-disable-next-line no-unused-vars
import { motion, useMotionValue, useTransform, useSpring, useInView } from 'framer-motion';
import { FaArrowDown, FaCode, FaLaptopCode, FaRocket } from 'react-icons/fa';
import { useEffect, useMemo, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getProfileImageUrl } from '../utils/imageUtils';

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

// Fonction helper pour générer les données de particules (en dehors du composant)
const generateParticleData = () => {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1000;
  const height = typeof window !== 'undefined' ? window.innerHeight : 800;
  return Array.from({ length: 15 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    duration: 3 + Math.random() * 4,
    delay: Math.random() * 2,
  }));
};

const Hero = ({ data = {} }) => {
  const { theme, isDarkMode } = useTheme();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

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
    profile_image = '/images/profile.jpeg',
    hero_stats: rawHeroStats
  } = data;

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

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Créer les transforms au niveau du composant, pas dans le callback
  const transformX1 = useTransform(x, (value) => value * 0.5);
  const transformY1 = useTransform(y, (value) => value * 0.5);
  const transformX2 = useTransform(x, (value) => value * 1);
  const transformY2 = useTransform(y, (value) => value * 1);
  const transformX3 = useTransform(x, (value) => value * 1.5);
  const transformY3 = useTransform(y, (value) => value * 1.5);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 2;
      const y = (clientY / innerHeight - 0.5) * 2;
      mouseX.set(x * 20);
      mouseY.set(y * 20);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

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

  const floatingIcons = [
    { icon: <FaCode />, x: -100, y: -80, delay: 0, duration: 6 },
    { icon: <FaLaptopCode />, x: 100, y: -60, delay: 0.3, duration: 7 },
    { icon: <FaRocket />, x: -80, y: 100, delay: 0.6, duration: 8 },
  ];

  // Générer les valeurs aléatoires pour les particules une seule fois
  const particleData = useMemo(() => generateParticleData(), []);

  return (
    <section id="home" className="min-h-screen flex items-start sm:items-center justify-center relative overflow-hidden pt-4 sm:pt-0">
      {/* Animated Mesh Gradient Background */}
      <div className={`absolute inset-0 mesh-gradient ${isDarkMode ? 'opacity-20' : 'opacity-5'}`} />
      <div className={`absolute inset-0 cyber-grid ${isDarkMode ? 'opacity-20' : 'opacity-5'}`} />

      {/* Floating Orbs with Enhanced Effects */}
      <motion.div
        className="floating-orb w-96 h-96 top-0 left-0"
        style={{ backgroundColor: theme.primary.main }}
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, -50, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="floating-orb w-[28rem] h-[28rem] top-1/4 right-0"
        style={{ backgroundColor: theme.primary.dark }}
        animate={{
          x: [0, -120, 80, 0],
          y: [0, 100, -80, 0],
          scale: [1, 0.8, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div
        className="floating-orb w-80 h-80 bottom-0 left-1/4"
        style={{ backgroundColor: theme.primary.light }}
        animate={{
          x: [0, 150, -100, 0],
          y: [0, -80, 50, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Floating Particles */}
      {particleData.map((particle, i) => (
        <motion.div
          key={i}
          className="particle absolute w-1 h-1 rounded-full"
          style={{ backgroundColor: theme.primary.main + '40' }}
          initial={{
            x: particle.x,
            y: particle.y,
            opacity: 0.05,
          }}
          animate={{
            y: [null, -100, null],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}

      {/* Floating Icons with 3D Effect */}
      {floatingIcons.map((item, index) => {
        // Utiliser les transforms créés au niveau du composant
        const transformX = index === 0 ? transformX1 : index === 1 ? transformX2 : transformX3;
        const transformY = index === 0 ? transformY1 : index === 1 ? transformY2 : transformY3;
        
        return (
          <motion.div
            key={index}
            className="absolute text-7xl sm:text-8xl"
            style={{
              left: '50%',
              top: '50%',
              x: transformX,
              y: transformY,
            }}
            animate={{
              x: item.x,
              y: item.y,
              rotateZ: [0, 360],
              rotateY: [0, 180, 360],
            }}
            transition={{
              rotateZ: {
                duration: item.duration,
                repeat: Infinity,
                ease: "linear"
              },
              rotateY: {
                duration: item.duration * 1.5,
                repeat: Infinity,
                ease: "linear"
              },
              delay: item.delay
            }}
          >
            <div className="text-cyan-400/5">
              {item.icon}
            </div>
          </motion.div>
        );
      })}

      {/* Content */}
      <motion.div
        className="container-custom section-padding relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 gap-4 sm:gap-8 lg:gap-12 items-center">
            {/* Left Side - Photo */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center lg:justify-end order-1"
            >
              <div className="relative group">
                {/* Photo Container with Advanced Design */}
                <div className="relative w-32 h-32 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-96 lg:h-96">
                  {/* Animated Rings */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2"
                    style={{ borderColor: theme.primary.main + '4d' }}
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: 360,
                    }}
                    transition={{
                      scale: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      },
                      rotate: {
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                      }
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
                      scale: {
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      },
                      rotate: {
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                      }
                    }}
                  />

                  {/* Main Photo Frame */}
                  <div
                    className="absolute inset-4 glass-effect-strong rounded-full overflow-hidden border-4"
                    style={{ borderColor: theme.primary.main + '33' }}
                  >
                    {/* Gradient Overlay on Hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
                      style={{ background: `linear-gradient(to bottom right, ${theme.primary.main}33, ${theme.primary.dark}33)` }}
                    />

                    {/* Photo de profil */}
                    <img
                      src={getProfileImageUrl(profile_image)}
                      alt={display_name}
                      className="w-full h-full object-cover"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      onError={(e) => {
                        e.target.src = '/images/profile.jpeg';
                      }}
                    />
                  </div>

                  {/* Floating Badges */}
                  <motion.div
                    className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 glass-effect-strong px-2 py-1 sm:px-4 sm:py-2 rounded-full border flex items-center gap-1 sm:gap-2"
                    style={{ borderColor: theme.primary.main + '4d' }}
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className={`text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Disponible</span>
                  </motion.div>

                  <motion.div
                    className="absolute -bottom-1 -left-1 sm:-bottom-4 sm:-left-4 glass-effect-strong px-1.5 py-1 sm:px-4 sm:py-2 rounded-full border flex items-center"
                    style={{ borderColor: theme.primary.dark + '4d' }}
                    animate={{
                      y: [0, 10, 0],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  >
                    <span className={`text-[8px] sm:text-xs font-semibold leading-none bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>Full Stack Dev</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Content */}
            <div className="text-left order-2">
              {/* Greeting Badge with Shine Effect */}
              <motion.div variants={itemVariants} className="mb-2 sm:mb-6">
                <span className={`inline-block px-3 py-1.5 sm:px-6 sm:py-3 glass-effect-strong rounded-full font-semibold text-[10px] sm:text-base border`} style={{ color: theme.primary.main, borderColor: `${theme.primary.main}33` }}>
                  Bienvenue sur mon portfolio
                </span>
              </motion.div>

              {/* Main Heading with Gradient Animation */}
              <motion.h1
                variants={itemVariants}
                className="text-xl sm:text-4xl md:text-5xl lg:text-7xl font-black mb-2 sm:mb-6"
              >
                <div className={`mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Salut, je suis</div>
                <motion.span
                  className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent inline-block`}
                  animate={{
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {display_name}
                </motion.span>
              </motion.h1>

              {/* Subtitle with Typing Effect */}
              <motion.h2
                variants={itemVariants}
                className={`text-sm sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
              >
                <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>{job_title}</span>
              </motion.h2>

            </div>
          </div>

          {/* Description et boutons - affiches en bas sur mobile */}
          <motion.div variants={itemVariants} className="mt-6 sm:mt-8 text-center">
            <motion.p
              className={`text-xs sm:text-base lg:text-xl mb-4 sm:mb-8 leading-relaxed max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              {hero_description}
            </motion.p>

            <div className="flex flex-row gap-2 sm:gap-4 justify-center items-center">
              <motion.a
                href="#projects"
                className="btn-primary text-xs sm:text-base px-3 py-2 sm:px-6 sm:py-3 shine group"
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Voir mes projets</span>
              </motion.a>
              <motion.a
                href="#contact"
                className="btn-secondary text-xs sm:text-base px-3 py-2 sm:px-6 sm:py-3 group"
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Me contacter</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Stats with Enhanced Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-2 sm:gap-8 max-w-5xl mx-auto perspective-1000 mt-8 sm:mt-16"
          >
            {hero_stats.map((stat, index) => (
              <motion.div
                key={index}
                className="glass-effect-strong rounded-xl sm:rounded-2xl p-2 sm:p-8 border relative overflow-hidden group transform-3d"
                style={{ borderColor: theme.primary.main + '1a' }}
                whileHover={{
                  scale: 1.05,
                  y: -5
                }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(to bottom right, ${theme.primary.main}1a, transparent)` }}
                />
                <div className="relative z-10">
                  <div
                    className={`text-xl sm:text-5xl font-black mb-1 sm:mb-2 bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}
                  >
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className={`text-[10px] sm:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {stat.label}
                  </div>
                </div>

              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator with Enhanced Animation */}
      <motion.div
        className="absolute bottom-4 sm:bottom-12 inset-x-0 flex justify-center"
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <a
          href="#about"
          className="flex flex-col items-center transition-colors group"
          style={{ color: theme.primary.main }}
        >
          <span className="text-sm mb-3 font-semibold tracking-wider">Découvrir</span>
          <motion.div
            className="w-8 h-12 border-2 rounded-full flex items-start justify-center p-2"
            style={{ borderColor: theme.primary.main }}
            whileHover={{ scale: 1.1 }}
          >
            <motion.div
              className="w-1.5 h-3 rounded-full"
              style={{ backgroundColor: theme.primary.main }}
              animate={{
                y: [0, 12, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </a>
      </motion.div>

      {/* Animated Corner Decorations */}
      <div
        className="absolute top-0 left-0 w-40 h-40 border-t-2 border-l-2 rounded-tl-3xl"
        style={{ borderColor: theme.primary.main + '33' }}
      />
      <div
        className="absolute bottom-0 right-0 w-40 h-40 border-b-2 border-r-2 rounded-br-3xl"
        style={{ borderColor: theme.primary.dark + '33' }}
      />
    </section>
  );
};

export default Hero;