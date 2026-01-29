// eslint-disable-next-line no-unused-vars -- motion utilisé dans le JSX (motion.div, etc.)
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import {
  FaUser, FaCode, FaGithub, FaLinkedin, FaTwitter, FaEnvelope,
  FaPhone, FaMapMarkerAlt, FaExternalLinkAlt, FaStar, FaDownload,
  FaBriefcase, FaGraduationCap, FaArrowDown, FaChevronRight, FaArrowUp, FaArrowRight
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { SiReact, SiTypescript, SiNodedotjs, SiMongodb, SiTailwindcss, SiNextdotjs } from 'react-icons/si';
import { useEffect, useState, useRef } from 'react';

/** Compteur animé : décompte 0 → value à l’affichage et au survol. */
const AnimatedCounter = ({ value, suffix = '', replayTrigger = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 50, damping: 25 });
  const display = useTransform(springValue, (v) => Math.round(v));

  useEffect(() => {
    if (isInView) motionValue.set(Number(value));
  }, [isInView, value, motionValue]);

  useEffect(() => {
    if (replayTrigger && replayTrigger > 0) {
      motionValue.set(0);
      const id = requestAnimationFrame(() => motionValue.set(Number(value)));
      return () => cancelAnimationFrame(id);
    }
  }, [replayTrigger, value, motionValue]);

  return (
    <span ref={ref}>
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
};

const SECTION_IDS = ['home', 'about', 'skills', 'projects', 'contact'];
const navItems = SECTION_IDS.map((id) => ({
  name: id === 'home' ? 'Accueil' : id === 'about' ? 'À propos' : id === 'skills' ? 'Expertise' : id === 'projects' ? 'Réalisations' : 'Contact',
  href: `#${id}`,
  id,
}));

const TemplatePreview = ({ theme, isDarkMode }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredStatIndex, setHoveredStatIndex] = useState(null);
  const [statReplayTrigger, setStatReplayTrigger] = useState(0);

  const primary = theme?.primary?.main ?? '#6366f1';
  const accent = theme?.accent?.main ?? primary;
  const darkTheme = {
    surface: '#0A0A0B',
    surfaceAlt: '#101012',
    surfaceElevated: '#141417',
    text: '#F5F5F7',
    textMuted: 'rgba(245,245,247,0.7)',
    border: 'rgba(255,255,255,0.08)',
  };
  const lightTheme = {
    surface: '#FFFFFF',
    surfaceAlt: '#F8F9FA',
    surfaceElevated: '#FFFFFF',
    text: '#0A0A0B',
    textMuted: 'rgba(10,10,11,0.7)',
    border: 'rgba(0,0,0,0.08)',
  };
  const tokens = isDarkMode ? darkTheme : lightTheme;

  const scrollTo = (e, href) => {
    e.preventDefault();
    const id = (href || '').replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (window.pageYOffset / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sampleData = {
    display_name: 'Laity FAYE',
    job_title: 'Développeur Full Stack',
    hero_description: 'Je crée des expériences web exceptionnelles avec des technologies modernes. Passionné par le code propre et l\'innovation.',
    hero_stats: [
      { value: 5, suffix: '+', label: "Années d'expérience" },
      { value: 50, suffix: '+', label: 'Projets réalisés' },
      { value: 100, suffix: '%', label: 'Satisfaction client' },
    ],
    about_paragraph: 'Passionné par le développement web et les nouvelles technologies, je transforme des idées créatives en solutions digitales performantes. Mon expertise s\'étend du frontend au backend avec une approche orientée qualité et performance.',
    about_highlights: [
      { icon: <FaUser />, title: 'Qui suis-je ?', desc: 'Développeur passionné avec expertise full-stack' },
      { icon: <FaBriefcase />, title: 'Expérience', desc: '5+ années en développement web moderne' },
      { icon: <FaGraduationCap />, title: 'Formation', desc: 'Diplômé en Ingénierie Informatique' },
    ],
    skills: [
      { 
        category: 'Frontend', 
        items: [
          { name: 'React', icon: <SiReact />, level: 95 },
          { name: 'TypeScript', icon: <SiTypescript />, level: 90 },
          { name: 'Next.js', icon: <SiNextdotjs />, level: 85 },
          { name: 'Tailwind', icon: <SiTailwindcss />, level: 92 },
        ]
      },
      { 
        category: 'Backend', 
        items: [
          { name: 'Node.js', icon: <SiNodedotjs />, level: 88 },
          { name: 'MongoDB', icon: <SiMongodb />, level: 85 },
        ]
      },
    ],
    projects: [
      { title: 'E-Commerce Platform', desc: 'Plateforme complète avec panier et paiement Stripe', tags: ['React', 'Node.js', 'Stripe'], featured: true },
      { title: 'Task Manager Pro', desc: 'Application collaborative de gestion de tâches', tags: ['React', 'Firebase', 'Tailwind'], featured: false },
      { title: 'Portfolio Designer', desc: 'Outil de création de portfolio en ligne', tags: ['Next.js', 'TypeScript', 'Prisma'], featured: true },
    ],
    contact: {
      email: 'mamadou.diallo@example.com',
      phone: '+221 77 123 45 67',
      location: 'Dakar, Sénégal',
    },
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
    },
  };

  // Variants d'animation Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Apparition au défilement — viewport et transition partagés pour un rendu fluide
  const scrollViewport = { once: true, amount: 0.12, margin: '0px 0px -60px 0px' };
  const scrollEase = [0.22, 1, 0.36, 1]; // ease-out quint
  const sectionReveal = {
    initial: { opacity: 0, y: 56 },
    whileInView: { opacity: 1, y: 0 },
    viewport: scrollViewport,
    transition: { duration: 0.85, ease: scrollEase },
  };
  const blockReveal = (delay = 0) => ({
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: scrollViewport,
    transition: { duration: 0.7, ease: scrollEase, delay },
  });
  const staggerContainerVariants = {
    initial: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
  };
  const staggerItemVariants = {
    initial: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: scrollEase } },
  };

  const floatVariants = {
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const shimmerEffect = {
    background: isDarkMode 
      ? `linear-gradient(90deg, ${theme.primary.main}20 0%, ${theme.primary.main}40 50%, ${theme.primary.main}20 100%)`
      : `linear-gradient(90deg, ${theme.primary.light}20 0%, ${theme.primary.light}40 50%, ${theme.primary.light}20 100%)`
  };

  return (
    <div className={`min-h-screen w-full ${isDarkMode ? 'bg-dark-900 text-gray-100' : 'bg-gradient-to-b from-gray-50 to-white text-gray-800'}`}>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-700/30">
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          style={{ width: `${scrollProgress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* HERO SECTION — apparition douce au chargement */}
      <motion.section
        id="home"
        className={`relative overflow-hidden py-20 px-6 ${isDarkMode ? 'bg-gradient-to-br from-dark-900 via-gray-900 to-dark-800' : 'bg-gradient-to-br from-white via-gray-50 to-blue-50/30'}`}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full filter blur-3xl opacity-20"
            style={{ backgroundColor: theme.primary.main }}
          />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full filter blur-3xl opacity-15"
            style={{ backgroundColor: theme.secondary?.main || theme.primary.dark }}
          />
          
          {/* Grid Pattern */}
          <div className={`absolute inset-0 opacity-[0.03] bg-[size:50px_50px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]`} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div 
            className="flex flex-col lg:flex-row items-center gap-12"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Photo avec effet premium */}
            <motion.div 
              className="relative order-2 lg:order-1"
              variants={itemVariants}
            >
              <div className={`relative w-48 h-48 lg:w-56 lg:h-56 rounded-full bg-gradient-to-r ${theme.gradient} p-[3px] shadow-2xl`}>
                <div className={`absolute inset-[2px] rounded-full ${isDarkMode ? 'bg-dark-900' : 'bg-white'} z-10`} />
                <div className={`relative w-full h-full rounded-full ${isDarkMode ? 'bg-dark-800' : 'bg-gray-100'} flex items-center justify-center overflow-hidden z-20`}>
                  <motion.div
                    variants={floatVariants}
                    animate="float"
                  >
                    <FaUser className={`text-6xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  </motion.div>
                </div>
                
                {/* Ring animé */}
                <motion.div 
                  className="absolute inset-0 rounded-full border-2"
                  style={{ borderColor: theme.primary.main }}
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
              </div>
              
              {/* Badge disponible avec animation pulse */}
              <motion.div 
                className="absolute -top-2 -right-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-semibold flex items-center gap-2 shadow-lg z-30"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                Disponible
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div 
              className="text-center lg:text-left flex-1 order-1 lg:order-2"
              variants={containerVariants}
            >
              <motion.span
                className={`inline-block px-5 py-2 rounded-full text-sm font-medium mb-4 backdrop-blur-sm ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`}
                style={{ color: theme.primary.main }}
                variants={itemVariants}
              >
                <span className="inline-block w-2 h-2 rounded-full bg-current mr-2 animate-pulse" />
                Bienvenue sur mon portfolio
              </motion.span>
              
              <motion.h1 
                className={`text-4xl lg:text-5xl xl:text-6xl font-black mb-4 leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                variants={itemVariants}
              >
                Salut, je suis{' '}
                <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                  {sampleData.display_name}
                </span>
              </motion.h1>
              
              <motion.p 
                className={`text-xl lg:text-2xl font-semibold mb-6 bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}
                variants={itemVariants}
              >
                {sampleData.job_title}
              </motion.p>
              
              <motion.p 
                className={`text-base lg:text-lg mb-8 max-w-2xl mx-auto lg:mx-0 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                variants={itemVariants}
              >
                {sampleData.hero_description}
              </motion.p>
              
              <motion.div 
                className="flex flex-nowrap gap-3 justify-center lg:justify-start overflow-x-auto pb-1"
                variants={itemVariants}
              >
                <motion.a 
                  href="#projects"
                  className={`group flex-shrink-0 px-4 py-2 rounded-lg bg-gradient-to-r ${theme.gradient} text-white text-xs font-semibold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] whitespace-nowrap`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Voir mes projets
                  <FaChevronRight className="group-hover:translate-x-1 transition-transform text-[10px]" />
                </motion.a>
                <motion.a 
                  href="#"
                  className="group flex-shrink-0 px-4 py-2 rounded-lg border-2 text-xs font-semibold flex items-center gap-1.5 transition-all duration-300 hover:scale-[1.02] whitespace-nowrap"
                  style={{ borderColor: theme.primary.main, color: theme.primary.main }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaDownload className="group-hover:animate-bounce text-[10px]" />
                  Télécharger mon CV
                </motion.a>
                <motion.a 
                  href="#contact"
                  className={`flex-shrink-0 px-4 py-2 rounded-lg border text-xs font-semibold whitespace-nowrap ${isDarkMode ? 'border-gray-700 text-gray-300 hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-100'} transition-all duration-300 flex items-center gap-1.5`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Me contacter
                </motion.a>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Stats avec effet de verre — décompte au chargement et au survol */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {sampleData.hero_stats.map((stat, i) => (
              <motion.div
                key={i}
                className={`p-6 rounded-2xl text-center backdrop-blur-lg border cursor-default ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-gray-200/60'} hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
                whileHover={{ scale: 1.02, y: -5 }}
                onMouseEnter={() => {
                  setHoveredStatIndex(i);
                  setStatReplayTrigger((c) => c + 1);
                }}
                onMouseLeave={() => setHoveredStatIndex(null)}
              >
                <div className={`text-3xl md:text-4xl font-black bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent mb-2`}>
                  {typeof stat.value === 'number' ? (
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix ?? ''}
                      replayTrigger={hoveredStatIndex === i ? statReplayTrigger : 0}
                    />
                  ) : (
                    String(stat.value ?? '')
                  )}
                </div>
                <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator animé */}
        <motion.div 
          className="flex justify-center mt-12"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <FaArrowDown className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </motion.div>
      </motion.section>

      {/* ABOUT SECTION */}
      <motion.section
        id="about"
        className={`py-20 px-6 ${isDarkMode ? 'bg-dark-800/30' : 'bg-white'}`}
        {...sectionReveal}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            {...blockReveal(0)}
          >
            <h2 className={`text-3xl lg:text-4xl font-bold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              À propos de{' '}
              <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>moi</span>
            </h2>
            <div className={`w-24 h-1 bg-gradient-to-r ${theme.gradient} mx-auto rounded-full mb-12`} />
          </motion.div>

          <motion.div
            className="grid lg:grid-cols-2 gap-12 items-center"
            variants={staggerContainerVariants}
            initial="initial"
            whileInView="visible"
            viewport={scrollViewport}
          >
            {/* Photo avec effet de profondeur */}
            <motion.div
              className={`aspect-square rounded-3xl overflow-hidden relative ${isDarkMode ? 'bg-gradient-to-br from-dark-700 to-dark-900' : 'bg-gradient-to-br from-gray-100 to-white'} shadow-2xl`}
              variants={staggerItemVariants}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <FaUser className={`text-7xl ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              </div>
            </motion.div>

            {/* Content */}
            <motion.div variants={staggerItemVariants}>
              <p className={`text-lg mb-8 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {sampleData.about_paragraph}
              </p>
              
              <div className="space-y-4 mb-8">
                {sampleData.about_highlights.map((item, i) => (
                  <motion.div
                    key={i}
                    className={`group flex gap-4 p-5 rounded-2xl ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'} hover:shadow-lg transition-all duration-300`}
                    whileHover={{ x: 5 }}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={scrollViewport}
                    transition={{ duration: 0.55, ease: scrollEase, delay: i * 0.08 }}
                  >
                    <div className={`text-2xl p-3 rounded-xl ${isDarkMode ? 'bg-white/10' : 'bg-white'} shadow-sm`}
                         style={{ color: theme.primary.main }}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.title}
                      </h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.button
                className={`group px-8 py-3.5 rounded-xl bg-gradient-to-r ${theme.gradient} text-white font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaDownload className="group-hover:animate-bounce" />
                Télécharger CV
                <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* SKILLS SECTION */}
      <motion.section
        id="skills"
        className={`py-20 px-6 ${isDarkMode ? 'bg-dark-900/50' : 'bg-gradient-to-b from-gray-50 to-white'}`}
        {...sectionReveal}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div {...blockReveal(0)}>
            <h2 className={`text-3xl lg:text-4xl font-bold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Mes{' '}
              <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>Compétences</span>
            </h2>
            <div className={`w-24 h-1 bg-gradient-to-r ${theme.gradient} mx-auto rounded-full mb-12`} />
          </motion.div>

          <motion.div
            className="space-y-12"
            variants={staggerContainerVariants}
            initial="initial"
            whileInView="visible"
            viewport={scrollViewport}
          >
            {sampleData.skills.map((category, i) => (
              <motion.div
                key={i}
                variants={staggerItemVariants}
              >
                <h3 className={`text-2xl font-bold mb-8 bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                  {category.category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.items.map((skill, j) => (
                    <motion.div
                      key={j}
                      className={`p-5 rounded-2xl ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200/60'} shadow-sm hover:shadow-lg transition-all duration-300 group`}
                      whileHover={{ y: -5 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={scrollViewport}
                      transition={{ duration: 0.55, ease: scrollEase, delay: j * 0.06 }}
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-2xl p-2 rounded-lg bg-gradient-to-br from-white/10 to-white/5"
                              style={{ color: theme.primary.main }}>
                          {skill.icon}
                        </span>
                        <span className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                          {skill.name}
                        </span>
                        <span className="ml-auto text-sm font-bold px-3 py-1 rounded-full bg-gradient-to-r from-transparent to-transparent group-hover:from-white/10"
                              style={{ color: theme.primary.main }}>
                          {skill.level}%
                        </span>
                      </div>
                      <div className={`h-2.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-dark-700' : 'bg-gray-200'}`}>
                        <motion.div
                          className={`h-full rounded-full bg-gradient-to-r ${theme.gradient} relative overflow-hidden`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: j * 0.1 }}
                          style={shimmerEffect}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* PROJECTS SECTION */}
      <motion.section
        id="projects"
        className={`py-20 px-6 ${isDarkMode ? 'bg-dark-800/30' : 'bg-white'}`}
        {...sectionReveal}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div {...blockReveal(0)}>
            <h2 className={`text-3xl lg:text-4xl font-bold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Mes{' '}
              <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>Projets</span>
            </h2>
            <div className={`w-24 h-1 bg-gradient-to-r ${theme.gradient} mx-auto rounded-full mb-8`} />
          </motion.div>

          {/* Filters */}
          <motion.div
            className="flex gap-3 justify-center mb-12 flex-wrap"
            {...blockReveal(0.08)}
          >
            {['Tous', 'Web', 'Mobile', 'Fullstack'].map((filter, i) => (
              <motion.button
                key={i}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  i === 0
                    ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg`
                    : isDarkMode 
                    ? 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filter}
              </motion.button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainerVariants}
            initial="initial"
            whileInView="visible"
            viewport={scrollViewport}
          >
            {sampleData.projects.map((project, i) => (
              <motion.div
                key={i}
                className={`group rounded-2xl overflow-hidden ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200/60'} hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]`}
                variants={staggerItemVariants}
                whileHover={{ y: -10 }}
              >
                {/* Project Image */}
                <div className={`aspect-video relative overflow-hidden ${isDarkMode ? 'bg-gradient-to-br from-dark-700 to-dark-900' : 'bg-gradient-to-br from-gray-100 to-gray-200'}`}>
                  {project.featured && (
                    <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/20 backdrop-blur-sm text-amber-500 text-xs font-semibold flex items-center gap-2 z-10">
                      <FaStar className="text-[10px]" /> Featured
                    </div>
                  )}
                  
                  {/* Project Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-16 h-16 rounded-2xl ${isDarkMode ? 'bg-white/10' : 'bg-white/80'} flex items-center justify-center shadow-lg`}>
                      <FaCode className={`text-2xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="flex gap-3">
                      <motion.button
                        className="p-3 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaGithub />
                      </motion.button>
                      <motion.button
                        className="p-3 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaExternalLinkAlt />
                      </motion.button>
                    </div>
                  </div>
                </div>
                
                {/* Project Details */}
                <div className="p-6">
                  <h3 className={`font-bold text-xl mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {project.title}
                  </h3>
                  <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {project.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, j) => (
                      <span
                        key={j}
                        className={`text-xs px-3 py-1.5 rounded-full ${isDarkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                        style={{ 
                          borderLeft: `3px solid ${theme.primary.main}`,
                          borderRight: `3px solid ${theme.primary.main}` 
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CONTACT SECTION */}
      <motion.section
        id="contact"
        className={`py-20 px-6 ${isDarkMode ? 'bg-gradient-to-b from-dark-900 to-black' : 'bg-gradient-to-b from-gray-50 to-white'}`}
        {...sectionReveal}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div {...blockReveal(0)}>
            <h2 className={`text-3xl lg:text-4xl font-bold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Contactez-
              <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>moi</span>
            </h2>
            <div className={`w-24 h-1 bg-gradient-to-r ${theme.gradient} mx-auto rounded-full mb-12`} />
          </motion.div>

          <motion.div
            className="grid lg:grid-cols-2 gap-12"
            variants={staggerContainerVariants}
            initial="initial"
            whileInView="visible"
            viewport={scrollViewport}
          >
            {/* Contact Info */}
            <motion.div
              className="space-y-6"
              variants={staggerItemVariants}
            >
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Je suis toujours ouvert aux nouvelles opportunités. N'hésitez pas à me contacter !
              </p>

              <div className="space-y-4">
                {[
                  { icon: <FaEnvelope />, label: 'Email', value: sampleData.contact.email },
                  { icon: <FaPhone />, label: 'Téléphone', value: sampleData.contact.phone },
                  { icon: <FaMapMarkerAlt />, label: 'Localisation', value: sampleData.contact.location },
                ].map((info, i) => (
                  <motion.div
                    key={i}
                    className={`group flex items-center gap-5 p-5 rounded-2xl ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200/60'} hover:shadow-lg transition-all duration-300`}
                    whileHover={{ x: 5 }}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={scrollViewport}
                    transition={{ duration: 0.55, ease: scrollEase, delay: i * 0.08 }}
                  >
                    <div className={`text-2xl p-3 rounded-xl ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'}`}
                         style={{ color: theme.primary.main }}>
                      {info.icon}
                    </div>
                    <div className="flex-1">
                      <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {info.label}
                      </p>
                      <p className={`font-medium text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {info.value}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <div className="pt-4">
                <p className={`text-sm font-medium mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Retrouvez-moi sur les réseaux
                </p>
                <div className="flex gap-3">
                  {[
                    { icon: <FaGithub />, label: 'GitHub', color: 'hover:bg-gray-800 hover:text-white' },
                    { icon: <FaLinkedin />, label: 'LinkedIn', color: 'hover:bg-blue-600 hover:text-white' },
                    { icon: <FaTwitter />, label: 'Twitter', color: 'hover:bg-sky-500 hover:text-white' },
                  ].map((social, i) => (
                    <motion.a
                      key={i}
                      href="#"
                      className={`p-4 rounded-xl text-xl ${isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-600'} ${social.color} transition-all duration-300 flex items-center gap-2 group`}
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {social.icon}
                      <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        {social.label}
                      </span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              className={`p-8 rounded-3xl ${isDarkMode ? 'bg-white/5 border border-white/10 backdrop-blur-sm' : 'bg-white border border-gray-200/60 shadow-xl'}`}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Nom complet
                    </label>
                    <input
                      type="text"
                      placeholder="Votre nom"
                      className={`w-full px-4 py-3.5 rounded-xl text-sm ${isDarkMode ? 'bg-white/10 text-white placeholder-gray-500 border-white/10' : 'bg-gray-50 text-gray-800 placeholder-gray-400 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all`}
                      style={{ 
                        '--tw-ring-color': theme.primary.main,
                        '--tw-ring-offset-color': isDarkMode ? '#1a1a1a' : '#ffffff'
                      }}
                      disabled
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="votre@email.com"
                      className={`w-full px-4 py-3.5 rounded-xl text-sm ${isDarkMode ? 'bg-white/10 text-white placeholder-gray-500 border-white/10' : 'bg-gray-50 text-gray-800 placeholder-gray-400 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all`}
                      disabled
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Message
                  </label>
                  <textarea
                    placeholder="Votre message..."
                    rows="4"
                    className={`w-full px-4 py-3.5 rounded-xl text-sm resize-none ${isDarkMode ? 'bg-white/10 text-white placeholder-gray-500 border-white/10' : 'bg-gray-50 text-gray-800 placeholder-gray-400 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all`}
                    disabled
                  />
                </div>
                
                <motion.button
                  className={`w-full px-6 py-4 rounded-xl bg-gradient-to-r ${theme.gradient} text-white font-semibold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 group`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaEnvelope className="group-hover:animate-pulse" />
                  Envoyer le message
                  <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer — même design que PortfolioMinimal (carte Innosoft + bas de pied) */}
      <footer
        className="border-t"
        style={{
          backgroundColor: tokens.surface,
          borderColor: tokens.border,
        }}
      >
        {/* Carte Innosoft Portfolio — design exceptionnel */}
        <div className="px-4 xs:px-6 sm:px-8 md:px-12 lg:px-20 py-8 sm:py-10">
          <div className="max-w-4xl mx-auto">
            <Link to="/" className="block no-underline">
              <motion.div
                className="group relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10 transition-all duration-500"
                style={{
                  background: isDarkMode
                    ? `linear-gradient(135deg, ${tokens.surfaceElevated} 0%, ${tokens.surfaceAlt} 100%)`
                    : `linear-gradient(135deg, #FFFFFF 0%, ${tokens.surfaceAlt} 100%)`,
                  border: `1px solid ${tokens.border}`,
                  boxShadow: isDarkMode
                    ? `0 24px 48px -12px rgba(0,0,0,0.4), 0 0 0 1px ${primary}15`
                    : `0 24px 48px -12px ${primary}18, 0 0 0 1px ${tokens.border}`,
                }}
                whileHover={{
                  boxShadow: isDarkMode
                    ? `0 32px 64px -16px rgba(0,0,0,0.5), 0 0 0 2px ${primary}30`
                    : `0 32px 64px -16px ${primary}25, 0 0 0 2px ${primary}30`,
                  y: -4,
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.995 }}
              >
                {/* Bandeau décoratif en dégradé */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                  style={{
                    background: `linear-gradient(90deg, ${primary}, ${accent || primary})`,
                    opacity: 0.9,
                  }}
                />
                {/* Motif subtil en fond */}
                <div
                  className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, ${primary} 1.5px, transparent 0)`,
                    backgroundSize: '24px 24px',
                  }}
                />
                <div className="relative flex flex-col sm:flex-row items-center gap-8 sm:gap-10">
                  {/* Logo dans un cadre */}
                  <div
                    className="shrink-0 flex items-center justify-center rounded-2xl p-5 sm:p-6 transition-all duration-300 group-hover:scale-[1.02]"
                    style={{
                      backgroundColor: `${primary}08`,
                      border: `1px solid ${primary}20`,
                      boxShadow: `inset 0 1px 0 ${primary}10`,
                    }}
                  >
                    <img
                      src="/images/INNOSOFT%20CREATION.png"
                      alt="Innosoft Portfolio"
                      className="h-14 sm:h-16 w-auto object-contain opacity-95 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  {/* Texte + CTA */}
                  <div className="flex-1 text-center sm:text-left min-w-0">
                    <p className="text-base sm:text-lg font-semibold mb-2" style={{ color: tokens.text }}>
                      Ce portfolio a été créé avec{' '}
                      <span
                        className="font-bold bg-clip-text"
                        style={{
                          color: primary,
                          textShadow: `0 0 40px ${primary}30`,
                        }}
                      >
                        Innosoft Portfolio
                      </span>
                    </p>
                    <p className="text-sm sm:text-base mb-6 max-w-xl" style={{ color: tokens.textMuted }}>
                      Créez le vôtre en quelques clics, personnalisez votre design et partagez votre parcours avec le monde.
                    </p>
                    <motion.span
                      className="inline-flex items-center gap-2 text-sm font-semibold rounded-xl px-6 py-3 transition-all duration-300"
                      style={{
                        color: '#FFFFFF',
                        background: `linear-gradient(135deg, ${primary}, ${accent || primary})`,
                        boxShadow: `0 8px 24px -8px ${primary}50`,
                      }}
                      whileHover={{
                        gap: 5,
                        boxShadow: `0 12px 32px -8px ${primary}60`,
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Créer mon portfolio
                      <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1" />
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>

        {/* Bas de pied de page */}
        <div className="py-8 px-4 xs:px-6 sm:px-8 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <div className="text-xl font-bold mb-1" style={{ color: tokens.text }}>
                  {sampleData.display_name}
                  <span style={{ color: primary }}>.</span>
                </div>
                <div className="text-sm" style={{ color: tokens.textMuted }}>
                  © {new Date().getFullYear()} Tous droits réservés
                </div>
              </div>

              <div className="flex items-center gap-6">
                {navItems.slice(1).map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => scrollTo(e, item.href)}
                    className="text-sm font-medium transition-all duration-300 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg px-2 py-1"
                    style={{ color: tokens.textMuted }}
                  >
                    {item.name}
                  </a>
                ))}
              </div>

              <motion.a
                href="#home"
                onClick={(e) => scrollTo(e, '#home')}
                className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-full px-5 py-2.5"
                style={{
                  color: tokens.text,
                  backgroundColor: `${primary}08`,
                }}
                whileHover={{ gap: 3 }}
              >
                Retour en haut
                <FaArrowUp className="text-xs" />
              </motion.a>
            </div>
          </div>
        </div>
      </footer>

      {/* Styles CSS pour l'animation shimmer */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default TemplatePreview;