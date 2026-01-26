import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import {
  FaRocket, FaPalette, FaGlobe, FaTimes, FaEye, FaArrowRight,
  FaCheck, FaStar, FaUsers, FaCode, FaSun, FaMoon
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import TemplatePreview from '../components/TemplatePreview';

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

const Home = () => {
  const { theme, isDarkMode, toggleMode } = useTheme();
  const { isAuthenticated } = useAuth();
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
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
      icon: <FaPalette />,
      title: '13 Themes',
      description: 'Choisissez parmi 13 themes de couleur et modes clair/sombre',
    },
    {
      icon: <FaRocket />,
      title: 'Design Moderne',
      description: 'Animations fluides et design glassmorphism professionnel',
    },
    {
      icon: <FaGlobe />,
      title: 'URL Unique',
      description: 'Obtenez votre URL personnalisee innosoft.com/p/votre-nom',
    },
  ];

  const steps = [
    { step: 'Creez votre compte', desc: 'Inscription rapide en 2 minutes' },
    { step: 'Envoyez votre preuve de paiement', desc: 'Seulement 2500 FCFA' },
    { step: 'Personnalisez votre portfolio', desc: 'Modifiez chaque section a votre image' },
    { step: 'Publiez et partagez', desc: 'Votre URL unique est prete' },
  ];

  const stats = [
    { value: 500, suffix: '+', label: 'Portfolios crees', icon: <FaUsers /> },
    { value: 13, suffix: '', label: 'Themes disponibles', icon: <FaPalette /> },
    { value: 100, suffix: '%', label: 'Personnalisable', icon: <FaCode /> },
  ];

  const themeColors = [
    { name: 'Cyan', color: '#06b6d4' },
    { name: 'Blue', color: '#3b82f6' },
    { name: 'Purple', color: '#8b5cf6' },
    { name: 'Pink', color: '#ec4899' },
    { name: 'Rose', color: '#f43f5e' },
    { name: 'Orange', color: '#f97316' },
    { name: 'Amber', color: '#f59e0b' },
    { name: 'Yellow', color: '#eab308' },
    { name: 'Lime', color: '#84cc16' },
    { name: 'Green', color: '#22c55e' },
    { name: 'Emerald', color: '#10b981' },
    { name: 'Teal', color: '#14b8a6' },
    { name: 'Indigo', color: '#6366f1' },
  ];

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
            <span className="text-lg sm:text-xl">Créez un portfolio qui impressionne en moins de 5 minutes. Pas besoin de coder, juste votre créativité.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-16 px-4"
          >
            <button
              onClick={() => setShowTemplateModal(true)}
              className="group px-4 sm:px-8 py-2.5 sm:py-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm sm:text-lg font-semibold rounded-xl sm:rounded-2xl shadow-xl shadow-red-500/30 hover:shadow-2xl hover:shadow-red-500/40 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto"
            >
              <FaEye className="group-hover:scale-110 transition-transform text-sm sm:text-base" />
              Voir le template
            </button>
            <Link
              to="/register"
              className="px-4 sm:px-8 py-2.5 sm:py-4 text-sm sm:text-lg font-semibold rounded-xl sm:rounded-2xl border-2 transition-all flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto bg-gray-900 text-white border-gray-700 hover:border-red-500/50 hover:bg-gray-800"
            >
              Commencer gratuitement
              <FaArrowRight className="text-red-500 text-sm sm:text-base" />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto px-4"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl mb-2 sm:mb-3 text-red-500 bg-red-500/10">
                  <span className="text-sm sm:text-base">{stat.icon}</span>
                </div>
                <div className="text-xl sm:text-3xl font-black text-white">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-12 sm:py-20 px-4 sm:px-6 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'
      }`}>
        <div className="container mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <span className={`inline-block px-3 sm:px-4 py-1 sm:py-1.5 font-semibold text-xs sm:text-sm rounded-full mb-3 sm:mb-4 ${
              isDarkMode ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-600'
            }`}>
              Fonctionnalites
            </span>
            <h2 className={`text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4 px-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Pourquoi choisir{' '}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                InnoSoft
              </span> ?
            </h2>
            <p className={`text-sm sm:text-base max-w-xl mx-auto px-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Tout ce dont vous avez besoin pour creer un portfolio professionnel qui impressionne
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl border transition-all group ${
                  isDarkMode
                    ? 'bg-gray-900 border-gray-800 hover:border-red-500/30 shadow-lg shadow-black/20'
                    : 'bg-white shadow-lg shadow-gray-200/50 border-gray-100 hover:shadow-xl hover:shadow-red-100/50 hover:border-red-100'
                }`}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl mb-4 sm:mb-6 shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className={`text-lg sm:text-xl font-bold mb-2 sm:mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className={`py-12 sm:py-20 px-4 sm:px-6 transition-colors duration-300 ${isDarkMode ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="container mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <span className={`inline-block px-3 sm:px-4 py-1 sm:py-1.5 font-semibold text-xs sm:text-sm rounded-full mb-3 sm:mb-4 ${
              isDarkMode ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-600'
            }`}>
              Simple et rapide
            </span>
            <h2 className={`text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4 px-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Comment ca{' '}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                marche
              </span> ?
            </h2>
          </div>

          <div className="max-w-3xl mx-auto px-4">
            {steps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 sm:gap-6 mb-6 sm:mb-8 last:mb-0"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg shadow-red-500/30">
                    {index + 1}
                  </div>
                </div>
                <div className={`flex-1 rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${
                  isDarkMode
                    ? 'bg-gray-900 border-gray-800'
                    : 'bg-gray-50 border-gray-100'
                }`}>
                  <h3 className={`text-base sm:text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {item.step}
                  </h3>
                  <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
                </div>
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

            {/* Enhanced Price Card */}
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
                {/* Price Section */}
                <div className="mb-6">
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className={`text-5xl sm:text-6xl md:text-7xl font-black bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent ${
                      isDarkMode ? '' : ''
                    }`}>
                      2500
                    </span>
                    <span className={`text-xl sm:text-2xl font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      FCFA
                    </span>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                    isDarkMode 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-green-50 text-green-600 border border-green-200'
                  }`}>
                    <FaCheck className="text-green-500" />
                    <span>Paiement unique • Acces a vie</span>
                  </div>
                </div>

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
                        src="/images/INNOSOFT CREATION.png"
                        alt="InnoSoft Creation Logo"
                        className="w-32 h-32 sm:w-40 sm:h-40 object-contain filter drop-shadow-[0_0_20px_rgba(239,68,68,0.6)] group-hover:drop-shadow-[0_0_30px_rgba(239,68,68,0.9)] transition-all duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Text Section */}
                  <div className="flex-1 text-center sm:text-left">
                    <div className="mb-3">
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
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
      <footer className={`py-8 sm:py-12 px-4 sm:px-6 ${isDarkMode ? 'bg-black' : 'bg-gray-900'}`}>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-base sm:text-lg">IS</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-white">
                Inno<span className="text-red-500">Soft</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm sm:text-base text-center md:text-left">
              © 2025 InnoSoft Portfolio. Tous droits reserves.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center md:justify-end">
              <a href="#" className="text-gray-500 hover:text-red-500 transition-colors text-sm sm:text-base">Conditions</a>
              <a href="#" className="text-gray-500 hover:text-red-500 transition-colors text-sm sm:text-base">Confidentialite</a>
              <a href="#" className="text-gray-500 hover:text-red-500 transition-colors text-sm sm:text-base">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Template Preview Modal */}
      <AnimatePresence>
        {showTemplateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-900/95 backdrop-blur-md"
            onClick={() => setShowTemplateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`relative w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl ${
                isDarkMode ? 'bg-gray-900' : 'bg-white'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative overflow-hidden">
                {/* Red gradient accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-red-400 to-red-600" />

                <div className={`flex items-center justify-between p-4 sm:p-5 md:p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                  <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                    {/* Icon */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30 flex-shrink-0">
                      <FaEye className="text-white text-lg sm:text-xl" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className={`text-lg sm:text-xl md:text-2xl font-bold truncate ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        Apercu du{' '}
                        <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                          Template
                        </span>
                      </h2>
                      <p className={`text-xs sm:text-sm mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Defilez pour explorer toutes les sections
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTemplateModal(false)}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all flex items-center justify-center flex-shrink-0 ml-2 ${
                      isDarkMode
                        ? 'bg-gray-800 text-gray-400 hover:bg-red-500/20 hover:text-red-400'
                        : 'bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <FaTimes className="text-base sm:text-lg" />
                  </button>
                </div>
              </div>

              {/* Full Portfolio Preview - Scrollable */}
              <div className={`overflow-y-auto max-h-[calc(95vh-200px)] sm:max-h-[calc(90vh-220px)] scrollbar-thin ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                {/* Browser mockup frame */}
                <div className={`mx-2 sm:mx-4 my-2 sm:my-4 rounded-lg sm:rounded-xl overflow-hidden shadow-xl border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  {/* Browser bar */}
                  <div className="bg-gray-800 px-2 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3">
                    <div className="flex gap-1.5 sm:gap-2">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500" />
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500" />
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 bg-gray-700 rounded-lg px-2 sm:px-4 py-1 sm:py-1.5 text-gray-400 text-xs sm:text-sm flex items-center gap-1 sm:gap-2 min-w-0">
                      <FaGlobe className="text-xs flex-shrink-0" />
                      <span className="truncate">innosoft.com/p/votre-nom</span>
                    </div>
                  </div>
                  {/* Preview content */}
                  <TemplatePreview theme={theme} isDarkMode={isDarkMode} />
                </div>

                {/* Theme Colors */}
                <div className={`mx-2 sm:mx-4 mb-2 sm:mb-4 p-4 sm:p-5 rounded-lg sm:rounded-xl border shadow-sm ${
                  isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaPalette className="text-white text-xs sm:text-sm" />
                    </div>
                    <div className="min-w-0">
                      <h4 className={`text-xs sm:text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        Personnalisez votre style
                      </h4>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        13 themes + Mode clair/sombre
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {themeColors.map((c) => (
                      <div
                        key={c.name}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl cursor-pointer transition-all hover:scale-110 hover:-translate-y-1 border-2 border-white/20"
                        style={{ backgroundColor: c.color, boxShadow: `0 4px 12px ${c.color}50` }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 md:p-6 border-t ${
                isDarkMode
                  ? 'border-gray-800 bg-gradient-to-r from-gray-900 to-gray-900'
                  : 'border-gray-100 bg-gradient-to-r from-gray-50 to-white'
              }`}>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`rounded-xl sm:rounded-2xl p-2 sm:p-3 ${isDarkMode ? 'bg-red-500/10' : 'bg-red-50'}`}>
                    <p className="text-xl sm:text-2xl md:text-3xl font-black text-red-500">
                      2500
                    </p>
                    <p className="text-xs font-medium text-red-400 -mt-0.5 sm:-mt-1">FCFA</p>
                  </div>
                  <div>
                    <p className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      Paiement unique
                    </p>
                    <p className={`text-xs flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <FaCheck className="text-green-500 flex-shrink-0" /> Acces a vie inclus
                    </p>
                  </div>
                </div>
                <Link
                  to="/register"
                  className="group px-5 sm:px-6 py-2.5 sm:py-3.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm sm:text-base font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                  onClick={() => setShowTemplateModal(false)}
                >
                  <span className="hidden sm:inline">Creer mon portfolio</span>
                  <span className="sm:hidden">Creer</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
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
