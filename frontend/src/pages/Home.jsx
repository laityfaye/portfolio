import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import {
  FaRocket, FaPalette, FaGlobe, FaTimes, FaEye, FaArrowRight,
  FaCheck, FaStar, FaUsers, FaCode, FaSun, FaMoon, FaSync, FaExternalLinkAlt, FaChevronDown, FaChevronUp,
  FaLayerGroup
} from 'react-icons/fa';
import { useTheme, themes } from '../context/ThemeContext';
import { getPublicImageUrl } from '../utils/imageUtils';
import { useAuth } from '../context/AuthContext';
const TEMPLATES = [
  { id: 'classic', name: 'Classic', accent: '#3b82f6' },
  { id: 'minimal', name: 'Minimal', accent: '#8b5cf6' },
  { id: 'elegant', name: 'Elegant', accent: '#d97706' },
  { id: 'luxe', name: 'Luxe', accent: '#ec4899' },
];

// Composant Counter animé - se décompte au chargement et au survol
const AnimatedCounter = ({ value, suffix = '', className, replayTrigger = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 80, damping: 12 });
  const display = useTransform(springValue, (val) => Math.round(val));

  // Animation au chargement (actualisation) et quand la section entre dans la vue
  // Délai pour synchroniser avec l'apparition de la section stats (delay: 0.4s)
  useEffect(() => {
    if (isInView) {
      motionValue.set(0);
      const timer = setTimeout(() => motionValue.set(value), 450);
      return () => clearTimeout(timer);
    }
  }, [isInView, value, motionValue]);

  // Rejouer l'animation au survol - délai pour que le spring voie 0 avant d'animer vers value
  useEffect(() => {
    if (replayTrigger > 0) {
      motionValue.set(0);
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => motionValue.set(value));
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [replayTrigger, value, motionValue]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{display}</motion.span>{suffix}
    </span>
  );
};

const Home = () => {
  const { isDarkMode, toggleMode } = useTheme();
  const { isAuthenticated } = useAuth();
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [statHoverKeys, setStatHoverKeys] = useState([0, 0, 0]);
  const [previewTemplate, setPreviewTemplate] = useState('classic');
  const [previewColor, setPreviewColor] = useState('cyan');
  const [previewMode, setPreviewMode] = useState('dark');
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const heroImageUrl = 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80';

  // Précharger l'image
  useEffect(() => {
    const img = new Image();
    img.src = heroImageUrl;
    img.onload = () => {
      setImageLoaded(true);
    };
    img.onerror = () => {
      setImageLoaded(true); // Afficher quand même même en cas d'erreur
    };
  }, []);

  const features = [
    {
      icon: <FaLayerGroup />,
      title: 'Plus de 5 modèles',
      description: 'Classic, Minimal, Elegant, Luxe... Choisissez le design qui vous ressemble parmi nos modèles professionnels. Chaque template est entièrement personnalisable pour un portfolio unique qui vous démarque.',
    },
    {
      icon: <FaPalette />,
      title: '13 thèmes',
      description: 'Choisissez parmi 13 thèmes de couleur et modes clair/sombre pour adapter votre portfolio à votre image de marque.',
    },
    {
      icon: <FaRocket />,
      title: 'Design moderne',
      description: 'Animations fluides et design glassmorphism professionnel qui impressionnent les recruteurs et clients.',
    },
    {
      icon: <FaGlobe />,
      title: 'URL unique',
      description: 'Obtenez votre URL personnalisée innosoft.com/p/votre-nom pour partager facilement votre portfolio.',
    },
  ];

  const steps = [
    { step: 'Creez votre compte', desc: 'Inscription rapide en 2 minutes' },
    { step: 'Activez votre compte', desc: 'Suivez les instructions envoyées par email' },
    { step: 'Personnalisez votre portfolio', desc: 'Modifiez chaque section a votre image' },
    { step: 'Publiez et partagez', desc: 'Votre URL unique est prete' },
  ];

  const stats = [
    { value: 500, suffix: '+', label: 'Portfolios crees', labelShort: 'Portfolios', icon: <FaUsers /> },
    { value: 13, suffix: '', label: 'Themes disponibles', labelShort: 'Themes', icon: <FaPalette /> },
    { value: 100, suffix: '%', label: 'Personnalisable', labelShort: 'Perso', icon: <FaCode /> },
  ];

  const demoBaseUrl = typeof window !== 'undefined' ? `${window.location.origin}/p/demo` : '/p/demo';
  const previewUrl = `${demoBaseUrl}?preview=1&template=${previewTemplate}&color=${previewColor}&mode=${previewMode}&t=${iframeKey}`;

  const refreshPreview = () => setIframeKey((k) => k + 1);

  const handlePreviewTemplateChange = (tpl) => {
    setPreviewTemplate(tpl);
    refreshPreview();
  };
  const handlePreviewColorChange = (color) => {
    setPreviewColor(color);
    refreshPreview();
  };
  const handlePreviewModeChange = (mode) => {
    setPreviewMode(mode);
    refreshPreview();
  };

  // Escape pour fermer le modal
  useEffect(() => {
    if (!showTemplateModal) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') setShowTemplateModal(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showTemplateModal]);

  // Reset iframe loaded quand le modal s'ouvre ou l'URL change
  useEffect(() => {
    if (showTemplateModal) setIframeLoaded(false);
  }, [showTemplateModal, previewUrl]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-950' : 'bg-white'}`}>
      {/* Navbar */}
      <nav className={`fixed top-0 inset-x-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
        isDarkMode
          ? 'bg-gray-950/90 border-gray-800'
          : 'bg-white/90 border-gray-100 shadow-sm'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
              <span className="text-white font-bold text-base sm:text-lg">IS</span>
            </div>
            <span className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Inno<span className="text-red-500">Soft</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleMode}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all ${
                isDarkMode
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
            >
              {isDarkMode ? <FaSun className="text-base sm:text-lg" /> : <FaMoon className="text-base sm:text-lg" />}
            </button>

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm sm:text-base font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all hover:-translate-y-0.5"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-3 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-medium transition-colors ${
                    isDarkMode ? 'text-gray-300 hover:text-red-400' : 'text-gray-700 hover:text-red-500'
                  }`}
                >
                  <span className="hidden sm:inline">Connexion</span>
                  <span className="sm:hidden">Login</span>
                </Link>
                <Link
                  to="/register"
                  className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm sm:text-base font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all hover:-translate-y-0.5"
                >
                  <span className="hidden sm:inline">Commencer</span>
                  <span className="sm:hidden">Start</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Background de base avec gradient - toujours visible */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom right, #030712 0%, #1a1a2e 50%, #0f0f1e 100%)'
          }}
        />
        
        {/* Background decorations - toujours visibles */}
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2 bg-red-900/30" />
        <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-80 sm:h-80 rounded-full filter blur-3xl translate-y-1/2 -translate-x-1/2 bg-red-950/40" />
        
        {/* Background Image - Premier triangle (haut gauche vers bas droite) - FLOUE */}
        <div 
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ease-in-out ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: imageLoaded ? `url('${heroImageUrl}')` : 'none',
            clipPath: 'polygon(0 0, 100% 0, 0 100%)',
            filter: 'blur(3px)'
          }}
        />
        
        {/* Flou rouge sur le premier triangle */}
        <div 
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            clipPath: 'polygon(0 0, 100% 0, 0 100%)',
            background: 'rgba(239, 68, 68, 0.35)',
            filter: 'blur(60px)',
            mixBlendMode: 'multiply'
          }}
        />
        
        {/* Background Image - Deuxième triangle (haut droite vers bas gauche) - FLOUE */}
        <div 
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ease-in-out ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: imageLoaded ? `url('${heroImageUrl}')` : 'none',
            clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
            filter: 'blur(3px)'
          }}
        />
        
        {/* Overlay gradient pour transition douce - toujours visible */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom right, rgba(3, 7, 18, 0.5) 0%, rgba(3, 7, 18, 0.5) 50%, rgba(3, 7, 18, 0.75) 100%)'
          }}
        />

        <div className="container mx-auto text-center relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 bg-red-500/10 border border-red-500/20"
          >
            <FaStar className="text-red-500 text-xs sm:text-sm animate-pulse" />
            <span className="font-semibold text-xs sm:text-sm text-red-400">
              ⚡ Rapide • 🎨 13 thèmes • 🚀 Déployez instantanément
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-7xl font-black mb-4 sm:mb-6 px-2 text-white"
          >
            Transformez votre{' '}
            <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              Passion
            </span>
            <br />
            <span className="text-2xl sm:text-4xl md:text-5xl">en Portfolio{' '}
              <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">Exceptionnel</span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl md:text-2xl mb-6 sm:mb-10 max-w-2xl mx-auto px-4 font-medium text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          >
            <span className="text-red-400 font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">Design moderne • Animations fluides • 100% personnalisable</span>
            <br />
            <span className="text-lg sm:text-xl">Créez votre portfolio en ligne qui impressionne en moins de 5 minutes. Pas besoin de coder, juste votre créativité.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-16 px-4"
          >
            <motion.button
              onClick={() => setShowTemplateModal(true)}
              className="group px-5 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm sm:text-lg font-semibold rounded-xl sm:rounded-2xl shadow-xl shadow-red-500/30 hover:shadow-2xl hover:shadow-red-500/40 flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaEye className="group-hover:scale-110 transition-transform text-sm sm:text-base" />
              Voir le template
            </motion.button>
            <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/register"
                className="block px-5 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg font-semibold rounded-xl sm:rounded-2xl border-2 transition-all flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white border-white/20 hover:border-red-400/50 hover:bg-white/15"
              >
                Commencer gratuitement
                <FaArrowRight className="text-red-400 text-sm sm:text-base" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats - adapté mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-2 xs:gap-3 sm:gap-6 max-w-2xl mx-auto px-2 xs:px-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center cursor-default select-none p-2.5 xs:p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-red-500/20 transition-all duration-300 min-w-0"
                onMouseEnter={() => setStatHoverKeys(prev => {
                  const next = [...prev];
                  next[index]++;
                  return next;
                })}
                whileHover={{ scale: 1.03, y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <div className="inline-flex items-center justify-center w-7 h-7 xs:w-8 xs:h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl mb-1 xs:mb-2 sm:mb-3 text-red-400 bg-red-500/20 border border-red-500/20">
                  <span className="text-xs xs:text-sm sm:text-base">{stat.icon}</span>
                </div>
                <div className="text-base xs:text-lg sm:text-3xl font-black text-white leading-tight">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} replayTrigger={statHoverKeys[index]} />
                </div>
                <div className="text-[10px] xs:text-[11px] sm:text-sm font-semibold text-white/90 leading-tight break-words">
                  <span className="hidden xs:inline">{stat.label}</span>
                  <span className="xs:hidden">{stat.labelShort}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-12 sm:py-20 px-4 sm:px-6 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'
      }`}>
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className={`inline-block px-4 py-2 font-semibold text-xs sm:text-sm rounded-full mb-4 ${
              isDarkMode ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-red-50 text-red-600 border border-red-100'
            }`}>
              Fonctionnalités
            </span>
            <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 px-4 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Pourquoi choisir{' '}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                InnoSoft
              </span> ?
            </h2>
            <p className={`text-sm sm:text-base max-w-xl mx-auto px-4 leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Tout ce dont vous avez besoin pour créer un portfolio professionnel qui impressionne
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                whileHover={{ y: -4 }}
                className={`relative p-6 sm:p-7 rounded-2xl border transition-all duration-300 group overflow-hidden ${
                  isDarkMode
                    ? 'bg-gray-900/80 border-gray-800/80 hover:border-red-500/40 hover:shadow-xl hover:shadow-red-500/10'
                    : 'bg-white border-gray-200/80 hover:border-red-200 hover:shadow-xl hover:shadow-red-500/5'
                }`}
              >
                {/* Bande accent en haut */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white text-xl mb-4 shadow-lg shadow-red-500/25 group-hover:shadow-red-500/40 group-hover:scale-105 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className={`text-base sm:text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className={`py-12 sm:py-20 px-4 sm:px-6 transition-colors duration-300 ${isDarkMode ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className={`inline-block px-4 py-2 font-semibold text-xs sm:text-sm rounded-full mb-4 ${
              isDarkMode ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-red-50 text-red-600 border border-red-100'
            }`}>
              Simple et rapide
            </span>
            <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 px-4 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Comment ça{' '}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                marche
              </span> ?
            </h2>
          </div>

          <div className="max-w-3xl mx-auto px-4 relative">
            {/* Ligne de connexion verticale */}
            <div className={`absolute left-5 sm:left-6 top-6 bottom-6 w-0.5 hidden sm:block ${isDarkMode ? 'bg-gradient-to-b from-red-500/50 via-red-500/30 to-transparent' : 'bg-gradient-to-b from-red-400/40 via-red-400/20 to-transparent'}`} />
            {steps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
                className="relative flex items-start gap-4 sm:gap-6 mb-6 sm:mb-8 last:mb-0 group"
              >
                <div className="flex-shrink-0 relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg shadow-red-500/30 ring-4 ring-transparent group-hover:ring-red-500/20 transition-all"
                  >
                    {index + 1}
                  </motion.div>
                </div>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex-1 rounded-xl p-4 sm:p-5 border transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-gray-900/80 border-gray-800 hover:border-red-500/30'
                      : 'bg-gray-50/80 border-gray-200 hover:border-red-200'
                  }`}
                >
                  <h3 className={`text-base sm:text-lg font-bold mb-1.5 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {item.step}
                  </h3>
                  <p className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-br from-red-500 via-red-600 to-red-700 relative overflow-hidden">
        {/* Enhanced Decorations */}
        <div className="absolute top-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-white/10 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 sm:w-[500px] sm:h-[500px] bg-white/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 bg-white/5 rounded-full filter blur-3xl" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-white/20 backdrop-blur-sm border border-white/30"
            >
              <FaStar className="text-yellow-300 text-sm animate-pulse" />
              <span className="text-white font-semibold text-sm">Offre Speciale</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 sm:mb-6 text-white px-4 leading-tight"
            >
              Pret a{' '}
              <span className="bg-gradient-to-r from-yellow-200 via-white to-yellow-200 bg-clip-text text-transparent">
                commencer
              </span> ?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 text-white/95 px-4 font-medium"
            >
              Creez votre portfolio professionnel des maintenant
            </motion.p>

            {/* CTA Card */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
              className={`relative w-full max-w-lg mx-auto rounded-3xl sm:rounded-[2rem] p-8 sm:p-10 shadow-2xl mb-8 sm:mb-10 overflow-hidden ${
                isDarkMode 
                  ? 'bg-gray-900/95 backdrop-blur-xl border border-gray-800/50' 
                  : 'bg-white/95 backdrop-blur-xl border border-white/20'
              }`}
            >
              {/* Card gradient overlay */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-red-600/10 to-transparent rounded-full blur-3xl" />
              
              <div className="relative z-10">
                {/* Features List */}
                <div className="mb-8 space-y-3 sm:space-y-4">
                  {['Portfolio personnalisable', '13 themes de couleur', 'URL unique personnelle', 'Support technique'].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className={`flex items-center gap-3 text-left p-3 rounded-xl ${
                        isDarkMode 
                          ? 'bg-gray-800/50 border border-gray-700/50' 
                          : 'bg-gray-50 border border-gray-100'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                        isDarkMode ? 'bg-green-500/20' : 'bg-green-100'
                      }`}>
                        <FaCheck className="text-green-500 text-sm" />
                      </div>
                      <span className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        {item}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/register"
                    className="group block w-full px-8 py-4 bg-gradient-to-r from-red-500 via-red-600 to-red-500 text-white text-lg font-bold rounded-2xl shadow-2xl shadow-red-500/50 hover:shadow-red-500/70 transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Button shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Creer mon portfolio
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Preview Link */}
            <motion.button
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              onClick={() => setShowTemplateModal(true)}
              className="group text-white/90 hover:text-white font-semibold flex items-center gap-2 mx-auto transition-all text-sm sm:text-base hover:gap-3"
            >
              <FaEye className="group-hover:scale-110 transition-transform" />
              <span>Voir un apercu du template</span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* InnoSoft Creation Card */}
      <section className={`py-12 sm:py-20 px-4 sm:px-6 ${isDarkMode ? 'bg-gray-950' : 'bg-gray-900'}`}>
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <a
              href="https://innosft.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="relative bg-black rounded-3xl sm:rounded-[2rem] p-8 sm:p-12 overflow-hidden border-2 border-gray-800 hover:border-red-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20">
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Animated grid pattern */}
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300" style={{
                  backgroundImage: `linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)`,
                  backgroundSize: '30px 30px'
                }} />

                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                  {/* Logo Section */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <img
                        src={getPublicImageUrl('images/INNOSOFT CREATION.png')}
                        alt="InnoSoft Creation Logo"
                        decoding="async"
                        fetchPriority="high"
                        className="w-32 h-32 sm:w-40 sm:h-40 object-contain filter drop-shadow-[0_0_20px_rgba(239,68,68,0.6)] group-hover:drop-shadow-[0_0_30px_rgba(239,68,68,0.9)] transition-all duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Text Section */}
                  <div className="flex-1 text-center sm:text-left">
                    <div className="mb-3 flex items-center gap-2">
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white filter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                        INNOSOFT
                      </h3>
                      <h4 className="text-xl sm:text-2xl md:text-3xl font-black text-red-500 filter drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">
                        CREATION
                      </h4>
                    </div>
                    <p className="text-gray-400 text-sm sm:text-base mb-4">
                      Plateforme de creation digitale et developpement web
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-red-500">
                      <span className="text-sm sm:text-base font-semibold">Decouvrir la plateforme</span>
                      <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Hover effect border glow */}
                <div className="absolute inset-0 rounded-3xl sm:rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 rounded-3xl sm:rounded-[2rem] border-2 border-red-500/50 blur-sm" />
                </div>
              </div>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-6 sm:py-8 md:py-12 px-3 xs:px-4 sm:px-6 overflow-x-hidden ${isDarkMode ? 'bg-black' : 'bg-gray-900'}`}>
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm xs:text-base sm:text-lg">IS</span>
              </div>
              <span className="text-base xs:text-lg sm:text-xl font-bold text-white">
                Inno<span className="text-red-500">Soft</span>
              </span>
            </div>
            <p className="text-gray-500 text-xs xs:text-sm sm:text-base">
              © 2025 InnoSoft Portfolio. Tous droits reserves.
            </p>
            <div className="flex flex-wrap gap-2 xs:gap-3 sm:gap-4 justify-center">
              <a href="#" className="text-gray-500 hover:text-red-500 transition-colors text-xs xs:text-sm sm:text-base">Conditions</a>
              <a href="#" className="text-gray-500 hover:text-red-500 transition-colors text-xs xs:text-sm sm:text-base">Confidentialite</a>
              <a href="#" className="text-gray-500 hover:text-red-500 transition-colors text-xs xs:text-sm sm:text-base">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Template Preview Modal - Design amélioré */}
      <AnimatePresence>
        {showTemplateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowTemplateModal(false)}
            />

            {/* Modal - Plein écran mobile, centré desktop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className={`relative w-full h-full sm:h-[95vh] sm:max-h-[98vh] sm:max-w-6xl sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl ring-1 ${
                isDarkMode ? 'bg-gray-900 ring-gray-700/50' : 'bg-white ring-gray-200/50'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - adapté mobile */}
              <div className={`flex-shrink-0 flex items-center justify-between gap-2 px-3 py-2.5 sm:px-5 sm:py-3.5 border-b min-h-[52px] sm:min-h-0 ${
                isDarkMode ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-100'
              } backdrop-blur-sm`}>
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 overflow-hidden">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/25 flex-shrink-0">
                    <FaEye className="text-white text-sm sm:text-lg" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className={`text-sm sm:text-lg font-bold truncate ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      Aperçu
                    </h2>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap overflow-hidden">
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-medium truncate max-w-[60px] sm:max-w-none"
                        style={{ backgroundColor: TEMPLATES.find((t) => t.id === previewTemplate)?.accent + '25', color: TEMPLATES.find((t) => t.id === previewTemplate)?.accent }}
                      >
                        {TEMPLATES.find((t) => t.id === previewTemplate)?.name || 'Classic'}
                      </span>
                      <span className={`text-[10px] sm:text-xs hidden xs:inline ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
                      <span className={`text-[10px] sm:text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {themes[previewColor]?.name} • {previewMode === 'dark' ? 'Sombre' : 'Clair'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions - touch targets 44px min sur mobile */}
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <motion.button
                    type="button"
                    onClick={() => setShowControls((c) => !c)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-2.5 py-2 sm:px-3 sm:py-2 rounded-lg text-xs font-medium transition-all min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 justify-center ${
                      showControls
                        ? 'bg-red-500/20 text-red-500'
                        : isDarkMode
                          ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaPalette className="text-sm" />
                    {showControls ? <FaChevronUp className="text-xs hidden sm:inline" /> : <FaChevronDown className="text-xs hidden sm:inline" />}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={refreshPreview}
                    className={`p-2 sm:p-2.5 rounded-lg transition-all min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center ${
                      isDarkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    whileTap={{ scale: 0.95 }}
                    title="Rafraîchir"
                  >
                    <FaSync className="text-sm" />
                  </motion.button>
                  <motion.a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 sm:p-2.5 rounded-lg transition-all min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center ${
                      isDarkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    whileTap={{ scale: 0.95 }}
                    title="Ouvrir dans un nouvel onglet"
                  >
                    <FaExternalLinkAlt className="text-sm" />
                  </motion.a>
                  <motion.button
                    type="button"
                    onClick={() => setShowTemplateModal(false)}
                    className={`p-2 sm:p-2.5 rounded-lg transition-all min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center ${
                      isDarkMode ? 'bg-gray-800 text-gray-400 hover:bg-red-500/20 hover:text-red-400' : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                    }`}
                    whileTap={{ scale: 0.95 }}
                    title="Fermer (Échap)"
                  >
                    <FaTimes className="text-sm" />
                  </motion.button>
                </div>
              </div>

              {/* Panneau de personnalisation - collapsible */}
              <AnimatePresence>
                {showControls && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className={`px-3 py-3 sm:px-4 border-b ${
                      isDarkMode ? 'bg-gray-800/50 border-gray-800' : 'bg-gray-50 border-gray-100'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        {/* Modèle */}
                        <div className="flex-shrink-0">
                          <label className={`block text-[11px] font-semibold mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Modèle</label>
                          <div className="flex flex-wrap gap-1.5">
                            {TEMPLATES.map((tpl) => (
                              <motion.button
                                key={tpl.id}
                                type="button"
                                onClick={() => handlePreviewTemplateChange(tpl.id)}
                                className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                                  previewTemplate === tpl.id ? 'text-white shadow' : isDarkMode ? 'bg-gray-700/80 text-gray-400 hover:bg-gray-600' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                                style={previewTemplate === tpl.id ? { backgroundColor: tpl.accent } : undefined}
                                whileTap={{ scale: 0.97 }}
                              >
                                {tpl.name}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                        {/* Mode */}
                        <div className="flex-shrink-0">
                          <label className={`block text-[11px] font-semibold mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Mode</label>
                          <div className="flex gap-1.5">
                            <motion.button
                              type="button"
                              onClick={() => handlePreviewModeChange('light')}
                              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                                previewMode === 'light' ? 'bg-amber-500 text-white shadow' : isDarkMode ? 'bg-gray-700/80 text-gray-400 hover:bg-gray-600' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                              }`}
                              whileTap={{ scale: 0.97 }}
                            >
                              <FaSun className="text-[10px]" /> Clair
                            </motion.button>
                            <motion.button
                              type="button"
                              onClick={() => handlePreviewModeChange('dark')}
                              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                                previewMode === 'dark' ? 'bg-indigo-600 text-white shadow' : isDarkMode ? 'bg-gray-700/80 text-gray-400 hover:bg-gray-600' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                              }`}
                              whileTap={{ scale: 0.97 }}
                            >
                              <FaMoon className="text-[10px]" /> Sombre
                            </motion.button>
                          </div>
                        </div>
                        {/* Couleurs */}
                        <div className="flex-1 min-w-0">
                          <label className={`flex items-center gap-1.5 text-[11px] font-semibold mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <FaPalette className="text-red-500 opacity-80 text-[10px]" />
                            <span>{themes[previewColor]?.name || previewColor}</span>
                          </label>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(themes).map(([name, themeColors]) => {
                              const isSelected = previewColor === name;
                              return (
                                <motion.button
                                  key={name}
                                  type="button"
                                  onClick={() => handlePreviewColorChange(name)}
                                  className={`relative w-6 h-6 sm:w-7 sm:h-7 rounded-md transition-all flex-shrink-0 ${
                                    isSelected ? 'ring-2 ring-offset-0.5' : ''
                                  }`}
                                  style={{
                                    backgroundColor: themeColors.primary.main,
                                    boxShadow: isSelected ? `0 0 8px ${themeColors.primary.main}50` : undefined,
                                    ringColor: themeColors.primary.main,
                                    ringOffsetColor: isDarkMode ? '#1f2937' : '#f9fafb',
                                  }}
                                  whileTap={{ scale: 0.9 }}
                                  title={themeColors.name}
                                >
                                  {isSelected && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-md"
                                    >
                                      <FaCheck className="text-white text-[8px] sm:text-[9px] drop-shadow" />
                                    </motion.div>
                                  )}
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Zone iframe - adapté mobile */}
              <div className="relative flex-1 min-h-0 bg-gray-800/30 overflow-hidden">
                <div className="absolute inset-1 sm:inset-2 md:inset-4 rounded-lg sm:rounded-xl overflow-hidden shadow-inner border border-gray-700/50 bg-gray-900">
                  <iframe
                    key={iframeKey}
                    src={previewUrl}
                    title="Aperçu du portfolio"
                    className="w-full h-full min-h-[280px] sm:min-h-[400px] md:min-h-[550px] border-0"
                    onLoad={() => setIframeLoaded(true)}
                  />
                  <AnimatePresence>
                    {!iframeLoaded && (
                      <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-900/95"
                      >
                        <div className="w-12 h-12 rounded-full border-2 border-red-500/30 border-t-red-500 animate-spin" />
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          Chargement de l'aperçu...
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Footer CTA - adapté mobile */}
              <div className={`flex-shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3 border-t ${
                isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-100'
              } pb-safe`}>
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 overflow-hidden">
                  <div className="min-w-0">
                    <p className={`text-[11px] sm:text-xs font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      Portfolio personnalisable
                    </p>
                    <p className={`text-[10px] sm:text-[11px] flex items-center gap-1 mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <FaCheck className="text-green-500 text-[9px] flex-shrink-0" /> <span className="truncate">Créez en quelques minutes</span>
                    </p>
                  </div>
                </div>
                <Link
                  to="/register"
                  className="group flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-2.5 text-sm font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-lg shadow-red-500/30 min-h-[44px]"
                  onClick={() => setShowTemplateModal(false)}
                >
                  Créer mon portfolio
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform text-xs" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
