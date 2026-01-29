import { useState, useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
// eslint-disable-next-line no-unused-vars -- motion est utilisé via motion.div, motion.nav, etc. dans le JSX
import { motion, useScroll, AnimatePresence, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import {
  FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaBars, FaTimes, FaArrowRight, FaExternalLinkAlt, FaArrowUp, FaDownload, FaPaperPlane,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { getProfileImageUrl, getImageUrl } from '../utils/imageUtils';
import { getIcon } from '../utils/iconMapper';
import ThemeApplier from '../components/ThemeApplier';
import { portfolioApi } from '../api/portfolio';

/* ——— Constants ——— */
const SECTION_IDS = ['home', 'about', 'skills', 'projects', 'contact'];
const navItems = SECTION_IDS.map((id) => ({
  name: id === 'home' ? 'Accueil' : id === 'about' ? 'À propos' : id === 'skills' ? 'Expertise' : id === 'projects' ? 'Réalisations' : 'Contact',
  href: `#${id}`,
  id,
}));

/* ——— Animation Presets ——— */
const EASE_OUT_QUINT = [0.22, 1, 0.36, 1];
const EASE_IN_OUT_CUBIC = [0.65, 0, 0.35, 1];
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.8, ease: EASE_OUT_QUINT },
};

const staggerChildren = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.1 },
};

const parseIfNeeded = (value, defaultValue) => {
  if (!value) return defaultValue;
  if (Array.isArray(value)) return value;
  if (typeof value === 'object' && !Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return parsed ?? defaultValue;
    } catch {
      return defaultValue;
    }
  }
  return defaultValue;
};

/** Compteur animé : décompte 0 → value à l’affichage et au survol (replay quand replayTrigger change). */
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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PortfolioPremium = ({ data, slug }) => {
  const { theme, isDarkMode } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactErrors, setContactErrors] = useState({});
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(null);
  const reducedMotion = useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false
  );
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [hoveredStatIndex, setHoveredStatIndex] = useState(null);
  const [statReplayTrigger, setStatReplayTrigger] = useState(0);
  const mainRef = useRef(null);

  const { scrollY } = useScroll();
  const [navScrolled, setNavScrolled] = useState(false);

  // Design System Premium
  const primary = theme.primary.main;
  const primaryLight = theme.primary.light || `${primary}CC`;
  const accent = theme.accent?.main || primary;

  const darkTheme = {
    bg: '#050505',
    surface: '#0A0A0B',
    surfaceAlt: '#101012',
    surfaceElevated: '#141417',
    text: '#F5F5F7',
    textMuted: 'rgba(245,245,247,0.7)',
    textSubtle: 'rgba(245,245,247,0.5)',
    border: 'rgba(255,255,255,0.08)',
    borderLight: 'rgba(255,255,255,0.04)',
    glass: 'rgba(15,15,17,0.72)',
    shadow: '0 24px 48px -12px rgba(0,0,0,0.5)',
    shadowHover: '0 32px 64px -16px rgba(0,0,0,0.6)',
    glow: `0 0 80px ${primary}15`,
  };

  const lightTheme = {
    bg: '#FAFBFC',
    surface: '#FFFFFF',
    surfaceAlt: '#F8F9FA',
    surfaceElevated: '#FFFFFF',
    text: '#0A0A0B',
    textMuted: 'rgba(10,10,11,0.7)',
    textSubtle: 'rgba(10,10,11,0.5)',
    border: 'rgba(0,0,0,0.08)',
    borderLight: 'rgba(0,0,0,0.04)',
    glass: 'rgba(255,255,255,0.88)',
    shadow: '0 16px 32px -8px rgba(0,0,0,0.08)',
    shadowHover: '0 24px 48px -12px rgba(0,0,0,0.12)',
    glow: `0 0 60px ${primary}10`,
  };

  const tokens = isDarkMode ? darkTheme : lightTheme;

  // Custom cursor effect for premium feel
  useEffect(() => {
    if (window.matchMedia('(pointer: fine)').matches) {
      const handleMouseMove = (e) => {
        setCursorPosition({ x: e.clientX, y: e.clientY });
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  useEffect(() => {
    const unsub = scrollY.on('change', (v) => setNavScrolled(v > 40));
    return () => unsub();
  }, [scrollY]);

  useEffect(() => {
    const unsub = scrollY.on('change', (v) => setShowBackToTop(v > 800));
    return () => unsub();
  }, [scrollY]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveSection(e.target.id);
        }
      },
      { rootMargin: '-25% 0px -65% 0px', threshold: 0 }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((e, href) => {
    e.preventDefault();
    setMobileNavOpen(false);
    const id = (href || '').replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const validateContactForm = () => {
    const err = {};
    const name = (contactForm.name || '').trim();
    const email = (contactForm.email || '').trim();
    const message = (contactForm.message || '').trim();
    if (!name) err.name = 'Le nom est obligatoire.';
    if (!email) err.email = 'L\'email est obligatoire.';
    else if (!emailRegex.test(email)) err.email = 'L\'email doit être valide.';
    if (!message) err.message = 'Le message est obligatoire.';
    setContactErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleContactChange = useCallback((e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
    setContactErrors((prev) => (prev[name] ? { ...prev, [name]: '' } : prev));
  }, []);

  const handleContactSubmit = useCallback(async (e) => {
    e.preventDefault();
    setContactSuccess(null);
    if (!validateContactForm() || !slug) return;
    setContactSubmitting(true);
    try {
      await portfolioApi.sendContact(slug, {
        name: contactForm.name.trim(),
        email: contactForm.email.trim(),
        subject: contactForm.subject.trim() || undefined,
        message: contactForm.message.trim(),
      });
      setContactSuccess('Votre message a bien été envoyé.');
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setContactErrors({});
    } catch (err) {
      const msg = err.response?.data?.message || 'Impossible d\'envoyer le message. Réessayez.';
      const raw = err.response?.data?.errors;
      const errors = raw
        ? Object.fromEntries(
            Object.entries(raw).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
          )
        : { message: msg };
      setContactErrors(errors);
      setContactSuccess(null);
    } finally {
      setContactSubmitting(false);
    }
  }, [slug, contactForm]);

  const defaultHeroStats = [
    { value: 5, suffix: '+', label: "Années d'expérience" },
    { value: 50, suffix: '+', label: 'Projets réalisés' },
    { value: 100, suffix: '%', label: 'Satisfaction client' },
  ];

  /** Libellés courts pour afficher les stats sur une ligne */
  const shortStatLabel = (label) => {
    const short = {
      "années d'expérience": 'Exp.',
      'projets réalisés': 'Projets',
      'satisfaction client': 'Satisfaction',
      'années': 'Exp.',
      'projets': 'Projets',
      'satisfaction': 'Satisfaction',
    };
    const key = (label || '').toLowerCase().trim();
    return short[key] || (label && label.length > 10 ? label.slice(0, 10) + '.' : label) || '';
  };

  const portfolioData = data || {};
  const skills = parseIfNeeded(data?.skills, []);
  const projects = parseIfNeeded(data?.projects, []);
  const contact_info = parseIfNeeded(portfolioData?.contact_info, { email: '', phone: '', location: '' });
  const social_links = parseIfNeeded(portfolioData?.social_links, { github: '', linkedin: '', twitter: '' });
  const about_highlights = parseIfNeeded(portfolioData?.about_highlights, []);
  const hero_stats = parseIfNeeded(portfolioData?.hero_stats, defaultHeroStats);

  const {
    display_name = 'Votre Nom',
    job_title = 'Designer & Développeur',
    hero_description = 'Création d\'expériences digitales exceptionnelles',
    profile_image,
    about_paragraph_1 = '',
    about_paragraph_2 = '',
    cv_file,
  } = portfolioData;

  const socialList = [
    social_links.github && { icon: <FaGithub />, href: social_links.github, label: 'GitHub' },
    social_links.linkedin && { icon: <FaLinkedin />, href: social_links.linkedin, label: 'LinkedIn' },
    social_links.twitter && { icon: <FaTwitter />, href: social_links.twitter, label: 'Twitter' },
  ].filter(Boolean);

  const CATEGORY_LABELS = {
    frontend: 'Interface & UX',
    backend: 'Backend & Architecture',
    database_tools: 'Data & DevOps',
    reseau: 'Réseaux',
    geomatique: 'Géomatique',
    genie_civil: 'Génie Civil',
    mobile: 'Mobile',
    devops: 'DevOps',
    autre: 'Autre',
  };
  const CATEGORY_ORDER = ['frontend', 'backend', 'database_tools', 'reseau', 'geomatique', 'genie_civil', 'mobile', 'devops', 'autre'];

  const grouped = skills.reduce((acc, s) => {
    const c = (s.category || 'frontend').toLowerCase().trim();
    if (!acc[c]) acc[c] = [];
    acc[c].push(s);
    return acc;
  }, {});

  const categories = [
    ...CATEGORY_ORDER.filter((k) => (grouped[k]?.length ?? 0) > 0).map((key) => ({
      key,
      title: CATEGORY_LABELS[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    })),
    ...Object.keys(grouped)
      .filter((k) => !CATEGORY_ORDER.includes(k))
      .map((key) => ({
        key,
        title: CATEGORY_LABELS[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      })),
  ];

  const t = (duration) => (reducedMotion ? 0 : duration);

  return (
    <div
      ref={mainRef}
      className="min-h-screen antialiased overflow-x-hidden selection:bg-opacity-20 selection:bg-[var(--primary)]"
      style={{
        backgroundColor: tokens.bg,
        fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
        '--primary': primary,
        '--primary-light': primaryLight,
        '--accent': accent,
      }}
    >
      <ThemeApplier />

      {/* Custom cursor effect */}
      <div className="fixed inset-0 pointer-events-none z-[9999] hidden lg:block">
        <motion.div
          className="absolute w-8 h-8 rounded-full border-2 border-[var(--primary)] opacity-0"
          animate={{
            x: cursorPosition.x - 16,
            y: cursorPosition.y - 16,
            opacity: isHoveringInteractive ? 0.4 : 0,
            scale: isHoveringInteractive ? 1.2 : 1,
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 200, mass: 0.5 }}
        />
      </div>

      {/* Navigation Premium */}
      <motion.nav
        className="fixed z-50 left-0 right-0 mx-auto w-[calc(100%-1.5rem)] xs:w-[calc(100%-2rem)] sm:w-[92%] max-w-4xl top-[max(0.75rem,env(safe-area-inset-top))] sm:top-4 md:top-6 px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-4 rounded-xl sm:rounded-2xl transition-all duration-500"
        style={{
          backgroundColor: navScrolled || mobileNavOpen ? tokens.glass : 'transparent',
          backdropFilter: navScrolled || mobileNavOpen ? 'blur(20px) saturate(180%)' : 'none',
          WebkitBackdropFilter: navScrolled || mobileNavOpen ? 'blur(20px) saturate(180%)' : 'none',
          border: navScrolled || mobileNavOpen ? `1px solid ${tokens.border}` : 'none',
          boxShadow: navScrolled ? tokens.shadow : 'none',
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6, ease: EASE_OUT_QUINT }}
      >
        <div className="flex items-center justify-between gap-2 min-w-0">
          <a
            href="#home"
            onClick={(e) => scrollTo(e, '#home')}
            className="min-w-0 flex items-baseline gap-0 text-base sm:text-lg font-bold tracking-tight transition-all duration-300 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded-lg p-1.5 sm:p-2 max-w-[calc(100vw-5rem)] xs:max-w-[200px] sm:max-w-none overflow-hidden"
            style={{ color: tokens.text }}
            onMouseEnter={() => setIsHoveringInteractive(true)}
            onMouseLeave={() => setIsHoveringInteractive(false)}
          >
            <span className="truncate">{display_name.split(' ')[0]}</span>
            <span className="text-[var(--primary)] flex-shrink-0">.</span>
          </a>

          <div className="hidden md:flex items-center gap-1 flex-shrink-0">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => scrollTo(e, item.href)}
                  className="group relative px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
                  style={{
                    color: isActive ? tokens.text : tokens.textMuted,
                  }}
                  onMouseEnter={() => setIsHoveringInteractive(true)}
                  onMouseLeave={() => setIsHoveringInteractive(false)}
                >
                  <span className="relative z-10">{item.name}</span>
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      style={{ backgroundColor: `${primary}15` }}
                      layoutId="nav-active"
                      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    />
                  )}
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: `${primary}08` }}
                  />
                </a>
              );
            })}
          </div>

          <button
            type="button"
            className="md:hidden flex-shrink-0 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 hover:bg-opacity-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 touch-manipulation"
            style={{ color: tokens.text, backgroundColor: `${primary}08` }}
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label={mobileNavOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileNavOpen}
          >
            {mobileNavOpen ? <FaTimes className="text-lg sm:text-xl" /> : <FaBars className="text-lg sm:text-xl" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: t(0.3), ease: EASE_OUT_QUINT }}
            className="fixed inset-0 z-40 md:hidden flex flex-col backdrop-blur-xl overflow-y-auto overscroll-contain"
            style={{
              backgroundColor: `${tokens.bg}EE`,
              paddingTop: 'max(5.5rem, calc(env(safe-area-inset-top) + 4rem))',
              paddingLeft: 'max(1.25rem, env(safe-area-inset-left))',
              paddingRight: 'max(1.25rem, env(safe-area-inset-right))',
              paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
            }}
          >
            {navItems.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={(e) => scrollTo(e, item.href)}
                className="flex items-center gap-3 sm:gap-4 py-4 sm:py-6 text-xl sm:text-2xl font-medium border-b outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-inset rounded-lg transition-colors duration-300"
                style={{ color: tokens.text, borderColor: tokens.border }}
                initial={reducedMotion ? false : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: t(0.4), ease: EASE_OUT_QUINT }}
              >
                <motion.span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{
                    backgroundColor: activeSection === item.id ? primary : 'transparent',
                    border: `2px solid ${activeSection === item.id ? primary : tokens.border}`,
                  }}
                  animate={{ scale: activeSection === item.id ? 1.2 : 1 }}
                />
                {item.name}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section - Premium */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center px-4 xs:px-6 sm:px-8 md:px-12 lg:px-20 pt-5 sm:pt-8 md:pt-12 lg:pt-20 overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: isDarkMode
                ? `radial-gradient(ellipse at 80% 20%, ${primary}15 0%, transparent 70%)`
                : `radial-gradient(ellipse at 80% 20%, ${primary}08 0%, transparent 70%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: isDarkMode
                ? `linear-gradient(90deg, transparent 47%, ${primary}10 50%, transparent 53%)`
                : `linear-gradient(90deg, transparent 47%, ${primary}05 50%, transparent 53%)`,
              backgroundSize: '100px 100%',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          {/* Mobile: colonne verticale centrée (Bienvenue → Nom → Image → Titre → Description → Boutons → Stats). Desktop: grille 2 colonnes. */}
          <div className="flex flex-col items-center text-center gap-4 sm:gap-5 lg:grid lg:grid-cols-2 lg:gap-x-10 lg:gap-y-6 xl:gap-x-20 lg:items-center lg:text-left w-full">
            {/* 1. Bienvenue */}
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: t(0.2), duration: t(0.6) }}
              className="order-1 lg:col-start-1 lg:row-start-1 w-full lg:w-auto text-[10px] xs:text-xs sm:text-sm font-semibold tracking-widest uppercase"
              style={{ color: primary, letterSpacing: '0.3em' }}
            >
              Bienvenue
            </motion.p>

            {/* 2. Prénom et nom */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: t(0.3), duration: t(0.8) }}
              className="order-2 lg:col-start-1 lg:row-start-2 w-full lg:w-auto text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold leading-[0.92] tracking-tight sm:whitespace-nowrap"
              style={{ color: tokens.text }}
            >
              {display_name.split(' ').map((word, i) => (
                <motion.span
                  key={i}
                  className="inline"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: t(0.3 + i * 0.1), duration: t(0.6) }}
                >
                  {i > 0 && <span className="inline">&nbsp;</span>}
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            {/* 3. Image — mobile: après le nom ; desktop: colonne droite */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: t(0.4), duration: t(0.8), ease: EASE_OUT_QUINT }}
              className="order-3 lg:col-start-2 lg:row-start-1 lg:row-span-5 lg:justify-self-end lg:self-center w-full flex flex-col items-center max-w-[140px] xs:max-w-[160px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-sm mx-auto lg:mx-0"
            >
              <div className="relative">
                {/* Decorative elements */}
                <motion.div
                  className="absolute -inset-4 sm:-inset-6 md:-inset-8 rounded-[2rem] sm:rounded-[2.5rem]"
                  style={{ backgroundColor: `${primary}10` }}
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
                
                <motion.div
                  className="relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden"
                  style={{
                    boxShadow: isDarkMode
                      ? `0 40px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px ${tokens.border}, ${tokens.glow}`
                      : `0 40px 80px -20px ${primary}30, 0 0 0 1px ${tokens.border}, ${tokens.glow}`,
                  }}
                  whileHover={reducedMotion ? {} : { y: -10, transition: { duration: 0.3 } }}
                >
                  <img
                    src={getProfileImageUrl(profile_image)}
                    alt={display_name}
                    className="w-full h-auto aspect-square object-cover"
                    loading="eager"
                    fetchPriority="high"
                    onError={(e) => { e.target.src = '/images/profile.jpeg'; }}
                  />
                </motion.div>
              </div>

              {/* Badge centré comme l'image (même flux flex) */}
              <motion.div
                className="-mt-2 sm:-mt-3 md:-mt-4 flex items-center justify-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2 rounded-full shadow-lg backdrop-blur-md w-fit"
                style={{
                  backgroundColor: isDarkMode ? `${tokens.surface}E6` : `${tokens.surface}F2`,
                  border: `1px solid ${primary}25`,
                  boxShadow: `0 4px 20px -4px rgba(0,0,0,0.15), 0 0 0 1px ${tokens.border}`,
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: t(1), duration: t(0.6) }}
                whileHover={reducedMotion ? {} : { scale: 1.02, transition: { duration: 0.2 } }}
              >
                <span
                  className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: primary, boxShadow: `0 0 8px ${primary}80` }}
                >
                  {!reducedMotion && (
                    <motion.span
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: primary }}
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    />
                  )}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold tracking-tight whitespace-nowrap" style={{ color: tokens.text }}>
                  Disponible pour des missions
                </span>
              </motion.div>
            </motion.div>

            {/* 4. Titre / Poste + Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: t(0.5), duration: t(0.7) }}
              className="order-4 lg:col-start-1 lg:row-start-3 w-full lg:w-auto space-y-2 sm:space-y-4"
            >
              <h2
                className="text-sm xs:text-base sm:text-xl md:text-2xl lg:text-3xl font-semibold bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${primary}, ${accent})`,
                }}
              >
                {job_title}
              </h2>
              <p
                className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0"
                style={{ color: tokens.textMuted }}
              >
                {hero_description}
              </p>
            </motion.div>

            {/* 5. Boutons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: t(0.6), duration: t(0.7) }}
              className="order-5 lg:col-start-1 lg:row-start-4 flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3 pt-1 pb-1 min-w-0"
            >
              <motion.a
                href="#projects"
                onClick={(e) => scrollTo(e, '#projects')}
                className="group relative flex-shrink-0 inline-flex items-center justify-center gap-0.5 sm:gap-1 px-1.5 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-full text-[9px] sm:text-xs font-semibold text-white overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 transition-all duration-300 whitespace-nowrap"
                style={{
                  background: `linear-gradient(135deg, ${primary}, ${accent})`,
                  boxShadow: `0 8px 24px -8px ${primary}50`,
                }}
                whileHover={reducedMotion ? {} : { scale: 1.05, boxShadow: `0 12px 32px -10px ${primary}60` }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => setIsHoveringInteractive(true)}
                onMouseLeave={() => setIsHoveringInteractive(false)}
              >
                <span className="relative z-10 flex items-center gap-0.5 sm:gap-1.5">
                  <FaArrowRight className="shrink-0 text-[7px] sm:text-[10px] transition-transform duration-300 group-hover:translate-x-1" />
                  <span className="md:hidden">Projets</span>
                  <span className="hidden md:inline">Découvrir mes projets</span>
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '200%' }}
                  transition={{ duration: 0.8 }}
                />
              </motion.a>
              {cv_file && (
                <motion.a
                  href={cv_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex-shrink-0 inline-flex items-center justify-center gap-0.5 sm:gap-1 px-1.5 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-full text-[9px] sm:text-xs font-semibold border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 transition-all duration-300 whitespace-nowrap"
                  style={{
                    color: primary,
                    borderColor: primary,
                    backgroundColor: 'transparent',
                  }}
                  whileHover={reducedMotion ? {} : { scale: 1.05, boxShadow: `0 6px 20px -6px ${primary}40` }}
                  whileTap={{ scale: 0.98 }}
                  onMouseEnter={() => setIsHoveringInteractive(true)}
                  onMouseLeave={() => setIsHoveringInteractive(false)}
                >
                  <FaDownload className="shrink-0 text-[7px] sm:text-[10px] transition-transform duration-300 group-hover:-translate-y-0.5" />
                  <span className="md:hidden">CV</span>
                  <span className="hidden md:inline">Télécharger mon CV</span>
                </motion.a>
              )}
              <motion.a
                href="#contact"
                onClick={(e) => scrollTo(e, '#contact')}
                className="group flex-shrink-0 inline-flex items-center justify-center gap-0.5 sm:gap-1 px-1.5 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-full text-[9px] sm:text-xs font-semibold border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 transition-all duration-300 whitespace-nowrap"
                style={{
                  color: tokens.text,
                  borderColor: tokens.border,
                  backgroundColor: tokens.surface,
                }}
                whileHover={reducedMotion ? {} : { scale: 1.05, borderColor: primary }}
                whileTap={{ scale: 0.98 }}
              >
                <FaEnvelope className="shrink-0 text-[7px] sm:text-[10px] md:hidden" />
                <span className="md:hidden">Contact</span>
                <span className="hidden md:inline">Contactez-moi</span>
                <motion.span
                  className="hidden md:inline-block text-sm"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 1 }}
                >
                  👋
                </motion.span>
              </motion.a>
            </motion.div>

            {/* 6. Statistiques — en dernier sur mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: t(0.7), duration: t(0.6) }}
              className="order-6 lg:col-start-1 lg:row-start-5 w-full grid grid-cols-3 gap-1 sm:gap-4 pt-4 sm:pt-6 md:pt-8 border-t min-w-0"
              style={{ borderColor: tokens.border }}
            >
              {hero_stats.slice(0, 3).map((stat, i) => (
                <motion.div
                  key={i}
                  className="text-center cursor-default min-w-0"
                  title={stat.label}
                  whileHover={reducedMotion ? {} : { y: -4 }}
                  transition={{ duration: 0.2 }}
                  onMouseEnter={() => {
                    setHoveredStatIndex(i);
                    setStatReplayTrigger((c) => c + 1);
                  }}
                  onMouseLeave={() => setHoveredStatIndex(null)}
                >
                  <div
                    className="text-sm xs:text-lg sm:text-2xl md:text-3xl font-bold tracking-tight"
                    style={{ color: primary }}
                  >
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
                  <div
                    className="text-[8px] xs:text-[9px] sm:text-xs md:text-sm font-medium mt-0.5 sm:mt-1 leading-tight whitespace-nowrap truncate px-0.5"
                    style={{ color: tokens.textMuted }}
                  >
                    {shortStatLabel(stat.label)}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 sm:bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 hidden xs:flex flex-col items-center gap-2 sm:gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: t(1.5), duration: t(0.8) }}
        >
          <span className="text-[10px] sm:text-xs font-medium tracking-widest uppercase" style={{ color: tokens.textSubtle }}>
            Explorer
          </span>
          <motion.div
            className="w-px h-10 sm:h-14 md:h-16"
            style={{ backgroundColor: tokens.border }}
            animate={{ height: [0, 16, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: EASE_IN_OUT_CUBIC }}
          />
        </motion.div>
      </section>

      {/* About Section - Premium */}
      <section
        id="about"
        className="py-16 sm:py-24 md:py-32 lg:py-48 px-4 xs:px-6 sm:px-8 md:px-12 lg:px-20 relative"
        style={{ backgroundColor: tokens.surface }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 items-start"
            variants={staggerChildren}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {/* Left column - Title */}
            <motion.div
              variants={fadeInUp}
              className="lg:sticky lg:top-32"
            >
              <div className="inline-flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-8 sm:w-12 h-px rounded-full" style={{ backgroundColor: primary }} />
                <span
                  className="text-xs font-semibold tracking-widest uppercase"
                  style={{ color: primary, letterSpacing: '0.3em' }}
                >
                  À propos
                </span>
              </div>
              <h2 className="text-xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 whitespace-nowrap sm:whitespace-normal" style={{ color: tokens.text }}>
                Vision &<span className="hidden sm:inline"><br /></span><span className="sm:hidden"> </span>Philosophie
              </h2>
              <p className="text-base sm:text-lg" style={{ color: tokens.textMuted }}>
                Une approche unique combinant expertise technique et sensibilité design.
              </p>
            </motion.div>

            {/* Right column - Content */}
            <motion.div
              variants={fadeInUp}
              className="lg:col-span-2 space-y-6 sm:space-y-10"
            >
              <div className="space-y-4 sm:space-y-6 text-base sm:text-lg leading-relaxed" style={{ color: tokens.textMuted }}>
                {about_paragraph_1 && <p>{about_paragraph_1}</p>}
                {about_paragraph_2 && <p>{about_paragraph_2}</p>}
              </div>

              {/* Highlights grid */}
              {about_highlights?.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {about_highlights.map((h, i) => (
                    <motion.div
                      key={i}
                      className="p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border transition-all duration-500 group cursor-pointer"
                      style={{
                        backgroundColor: tokens.surfaceElevated,
                        borderColor: tokens.borderLight,
                      }}
                      whileHover={reducedMotion ? {} : { y: -8, borderColor: primary, boxShadow: tokens.shadowHover }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-base sm:text-lg shrink-0"
                          style={{ backgroundColor: `${primary}15`, color: primary }}
                        >
                          {i + 1}
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold" style={{ color: tokens.text }}>
                          {h.title ?? h.description ?? ''}
                        </h3>
                      </div>
                      <p className="text-sm sm:text-base leading-relaxed" style={{ color: tokens.textMuted }}>
                        {h.description ?? ''}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* CV Download */}
              {cv_file && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="flex justify-center"
                >
                  <motion.a
                    href={cv_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border-2 transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{
                      borderColor: tokens.border,
                      color: tokens.text,
                      backgroundColor: tokens.surface,
                    }}
                    whileHover={reducedMotion ? {} : { gap: 2, borderColor: primary }}
                  >
                    <span className="text-xs sm:text-sm font-semibold">Télécharger mon CV</span>
                    <FaExternalLinkAlt className="text-xs sm:text-sm transition-transform duration-300 group-hover:translate-x-1" />
                  </motion.a>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section - Premium */}
      <section
        id="skills"
        className="py-16 sm:py-24 md:py-32 lg:py-48 px-4 xs:px-6 sm:px-8 md:px-12 lg:px-20 relative overflow-hidden"
        style={{ backgroundColor: tokens.surfaceAlt }}
      >
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${primary} 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-10 sm:mb-16 md:mb-20"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 mb-4 sm:mb-6">
              <span
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ color: primary, letterSpacing: '0.3em' }}
              >
                Expertise
              </span>
              <div className="w-8 sm:w-12 h-px rounded-full" style={{ backgroundColor: primary }} />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6" style={{ color: tokens.text }}>
              Stack Technique
            </h2>
            <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-2" style={{ color: tokens.textMuted }}>
              Maîtrises des technologies modernes pour des solutions robustes et performantes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {categories.map((cat, idx) => {
              const items = grouped[cat.key] || [];
              if (items.length === 0) return null;

              return (
                <motion.div
                  key={cat.key}
                  className="relative"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, duration: t(0.7) }}
                >
                  {/* Category card */}
                  <div
                    className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border backdrop-blur-sm transition-all duration-500 group h-full"
                    style={{
                      backgroundColor: tokens.glass,
                      borderColor: tokens.border,
                      boxShadow: tokens.shadow,
                    }}
                  >
                    <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 md:mb-8" style={{ color: tokens.text }}>
                      {cat.title}
                      <div className="w-6 sm:w-8 h-1 rounded-full mt-2" style={{ backgroundColor: primary }} />
                    </h3>

                    {/* Skills grid */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                      {items.map((s, j) => (
                        <motion.div
                          key={j}
                          className="p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border transition-all duration-300 group-hover:border-opacity-50"
                          style={{
                            backgroundColor: tokens.surface,
                            borderColor: tokens.borderLight,
                          }}
                          whileHover={reducedMotion ? {} : { scale: 1.05, borderColor: primary }}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: j * 0.05 }}
                        >
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="text-lg sm:text-xl shrink-0" style={{ color: primary }}>
                              {getIcon(s.icon)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-xs sm:text-sm truncate" style={{ color: tokens.text }}>
                                {s.name}
                              </div>
                              {s.level != null && (
                                <div className="mt-1.5 sm:mt-2">
                                  <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: tokens.border }}>
                                    <motion.div
                                      className="h-full rounded-full"
                                      style={{ backgroundColor: primary }}
                                      initial={{ width: 0 }}
                                      whileInView={{ width: `${s.level}%` }}
                                      viewport={{ once: true }}
                                      transition={{ delay: 0.2, duration: 1, ease: EASE_OUT_EXPO }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Section - Premium */}
      <section
        id="projects"
        className="py-16 sm:py-24 md:py-32 lg:py-48 px-4 xs:px-6 sm:px-8 md:px-12 lg:px-20"
        style={{ backgroundColor: tokens.surface }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 sm:gap-8 mb-10 sm:mb-16 md:mb-20"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <div>
              <div className="inline-flex items-center gap-3 mb-4 sm:mb-6">
                <span
                  className="text-xs font-semibold tracking-widest uppercase"
                  style={{ color: primary, letterSpacing: '0.3em' }}
                >
                  Réalisations
                </span>
                <div className="w-8 sm:w-12 h-px rounded-full" style={{ backgroundColor: primary }} />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4" style={{ color: tokens.text }}>
                Projets Notables
              </h2>
              <p className="text-base sm:text-lg md:text-xl max-w-2xl" style={{ color: tokens.textMuted }}>
                Des solutions innovantes qui transforment les idées en expériences digitales exceptionnelles.
              </p>
            </div>
            <motion.a
              href="#contact"
              onClick={(e) => scrollTo(e, '#contact')}
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold border transition-all duration-300"
              style={{
                color: primary,
                borderColor: `${primary}30`,
                backgroundColor: `${primary}08`,
              }}
              whileHover={reducedMotion ? {} : { gap: 3, backgroundColor: `${primary}15` }}
            >
              <span>Projet collaboratif ?</span>
              <FaArrowRight className="text-xs" />
            </motion.a>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {projects.slice(0, 4).map((proj, i) => {
              const hasLink = !!(proj.demo_url?.trim?.() || proj.github_url?.trim?.());
              const cardContent = (
                <div
                  className="relative overflow-hidden rounded-2xl sm:rounded-3xl border transition-all duration-500 h-full flex flex-col"
                  style={{
                    backgroundColor: tokens.surfaceElevated,
                    borderColor: tokens.border,
                    boxShadow: tokens.shadow,
                  }}
                >
                  {/* Image du projet (si présente) */}
                  {(getImageUrl(proj.image) || proj.image) && (
                    <div className="relative w-full aspect-video overflow-hidden shrink-0">
                      <img
                        src={getImageUrl(proj.image) || proj.image}
                        alt={proj.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `linear-gradient(to bottom, transparent 40%, ${tokens.surfaceElevated} 90%)`,
                        }}
                      />
                    </div>
                  )}

                  {/* Project number */}
                  <div
                    className="absolute top-4 left-4 sm:top-8 sm:left-8 text-5xl sm:text-6xl md:text-8xl font-black opacity-5 z-0"
                    style={{ color: primary }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-4 sm:p-6 md:p-8 flex-1">
                    <div className="flex justify-between items-start mb-4 sm:mb-6 gap-3">
                      <h3
                        className={`text-lg sm:text-xl md:text-2xl font-bold transition-all duration-300 ${hasLink ? 'group-hover:underline underline-offset-4' : ''}`}
                        style={{ color: tokens.text }}
                      >
                        {proj.title}
                      </h3>
                      {hasLink && (
                        <motion.div
                          className="p-2 sm:p-3 rounded-full shrink-0"
                          style={{ backgroundColor: `${primary}15`, color: primary }}
                          whileHover={{ rotate: 45 }}
                          transition={{ duration: 0.3 }}
                        >
                          <FaExternalLinkAlt className="text-xs sm:text-sm" />
                        </motion.div>
                      )}
                    </div>

                    <p className="mb-4 sm:mb-6 md:mb-8 leading-relaxed text-sm sm:text-base" style={{ color: tokens.textMuted }}>
                      {proj.description}
                    </p>

                    {/* Tags */}
                    {proj.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6 md:mb-8">
                        {proj.tags.slice(0, 4).map((tag, k) => (
                          <span
                            key={k}
                            className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium"
                            style={{
                              color: primary,
                              backgroundColor: `${primary}10`,
                              border: `1px solid ${primary}20`,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Stats or additional info */}
                    <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-4 sm:gap-6 pt-4 sm:pt-6 border-t" style={{ borderColor: tokens.border }}>
                      {proj.technologies && (
                        <span className="text-xs sm:text-sm" style={{ color: tokens.textSubtle }}>
                          {proj.technologies.split(',').slice(0, 2).join(' · ')}
                        </span>
                      )}
                      <span
                        className={`text-xs sm:text-sm font-semibold xs:ml-auto ${hasLink ? '' : 'opacity-70'}`}
                        style={{ color: primary }}
                      >
                        {hasLink ? 'Voir le projet →' : 'Projet en cours'}
                      </span>
                    </div>
                  </div>

                  {/* Hover overlay (seulement si lien) */}
                  {hasLink && (
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(135deg, ${primary}08, transparent 60%)`,
                      }}
                    />
                  )}
                </div>
              );

              return (
                <motion.div
                  key={proj.id ?? i}
                  className={`group relative ${hasLink ? 'cursor-pointer' : 'cursor-default'}`}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: t(0.8), ease: EASE_OUT_QUINT }}
                >
                  {hasLink ? (
                    <a
                      href={proj.demo_url || proj.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full"
                      onMouseEnter={() => setIsHoveringInteractive(true)}
                      onMouseLeave={() => setIsHoveringInteractive(false)}
                    >
                      {cardContent}
                    </a>
                  ) : (
                    <div
                      className="block h-full"
                      onMouseEnter={() => setIsHoveringInteractive(true)}
                      onMouseLeave={() => setIsHoveringInteractive(false)}
                    >
                      {cardContent}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section - Premium */}
      <section
        id="contact"
        className="py-16 sm:py-24 md:py-32 lg:py-48 px-4 xs:px-6 sm:px-8 md:px-12 lg:px-20 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${primary}, ${accent})`,
          color: '#FFFFFF',
        }}
      >
        {/* Background elements */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 30% 30%, white 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <motion.div
            className="mb-8 sm:mb-12 md:mb-16 text-center"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 sm:w-12 h-px rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.5)' }} />
              <span className="text-xs font-semibold tracking-widest uppercase opacity-90" style={{ letterSpacing: '0.3em' }}>
                Contact
              </span>
              <div className="w-8 sm:w-12 h-px rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.5)' }} />
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Discutons de votre projet
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 max-w-2xl mx-auto px-2">
              Transformons vos idées en réalité digitale. Prenons un café virtuel.
            </p>
          </motion.div>

          {/* Formulaire à gauche + Infos contact à droite (formulaire en premier sur mobile) */}
          <motion.div
            className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-16 items-start mb-8 sm:mb-12 md:mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {/* Colonne gauche : formulaire */}
            {slug ? (
              <motion.form
                onSubmit={handleContactSubmit}
                className="w-full"
                variants={fadeInUp}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 opacity-90">
                      Nom complet <span className="text-red-300">*</span>
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      placeholder="Votre nom"
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/40 transition-all disabled:opacity-60 text-sm sm:text-base"
                      disabled={contactSubmitting}
                    />
                    {contactErrors.name && (
                      <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-red-200">{contactErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 opacity-90">
                      Email <span className="text-red-300">*</span>
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      placeholder="votre@email.com"
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/40 transition-all disabled:opacity-60 text-sm sm:text-base"
                      disabled={contactSubmitting}
                    />
                    {contactErrors.email && (
                      <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-red-200">{contactErrors.email}</p>
                    )}
                  </div>
                </div>
                <div className="mb-3 sm:mb-4">
                  <label htmlFor="contact-subject" className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 opacity-90">
                    Sujet
                  </label>
                  <input
                    type="text"
                    id="contact-subject"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleContactChange}
                    placeholder="Sujet de votre message"
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/40 transition-all disabled:opacity-60 text-sm sm:text-base"
                    disabled={contactSubmitting}
                  />
                </div>
                <div className="mb-3 sm:mb-4">
                  <label htmlFor="contact-message" className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 opacity-90">
                    Message <span className="text-red-300">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    placeholder="Décrivez votre projet ou posez votre question..."
                    rows={5}
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/40 transition-all resize-none disabled:opacity-60 text-sm sm:text-base"
                    disabled={contactSubmitting}
                  />
                  {contactErrors.message && (
                    <p className="mt-1.5 text-xs sm:text-sm text-red-200">{contactErrors.message}</p>
                  )}
                </div>
                {contactSuccess && (
                  <p className="mb-4 text-sm font-medium text-green-200">{contactSuccess}</p>
                )}
                <motion.button
                  type="submit"
                  disabled={contactSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold bg-white text-[var(--primary)] hover:bg-white/95 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  whileHover={contactSubmitting ? {} : { scale: 1.02 }}
                  whileTap={contactSubmitting ? {} : { scale: 0.98 }}
                >
                  {contactSubmitting ? (
                    <>Envoi en cours...</>
                  ) : (
                    <>
                      <FaPaperPlane className="text-xs sm:text-sm" />
                      Envoyer le message
                    </>
                  )}
                </motion.button>
              </motion.form>
            ) : (
              <div />
            )}

            {/* Colonne droite : infos contact (mail, téléphone, adresse) */}
            <motion.div
              className="space-y-4 sm:space-y-6 lg:pt-0"
              variants={fadeInUp}
            >
              <h3 className="text-base sm:text-lg font-semibold opacity-90 mb-4 sm:mb-6">
                Informations de contact
              </h3>
              {contact_info.email && (
                <motion.a
                  href={`mailto:${contact_info.email}`}
                  className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl backdrop-blur-sm transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.15)' }}
                >
                  <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/10 shrink-0">
                    <FaEnvelope className="text-lg sm:text-xl opacity-90" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-semibold tracking-widest uppercase mb-1 opacity-80" style={{ letterSpacing: '0.1em' }}>
                      Email
                    </div>
                    <div className="font-medium break-all text-sm sm:text-base text-white/95 group-hover:text-white transition-colors">
                      {contact_info.email}
                    </div>
                    <div className="text-xs sm:text-sm opacity-0 group-hover:opacity-70 mt-1 transition-opacity">
                      Cliquer pour envoyer un email
                    </div>
                  </div>
                </motion.a>
              )}
              {contact_info.phone && (
                <motion.a
                  href={`tel:${String(contact_info.phone).replace(/\s/g, '')}`}
                  className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl backdrop-blur-sm transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.15)' }}
                >
                  <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/10 shrink-0">
                    <FaPhone className="text-lg sm:text-xl opacity-90" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-semibold tracking-widest uppercase mb-1 opacity-80" style={{ letterSpacing: '0.1em' }}>
                      Téléphone
                    </div>
                    <div className="font-medium text-sm sm:text-base text-white/95 group-hover:text-white transition-colors">
                      {contact_info.phone}
                    </div>
                    <div className="text-xs sm:text-sm opacity-0 group-hover:opacity-70 mt-1 transition-opacity">
                      Cliquer pour appeler
                    </div>
                  </div>
                </motion.a>
              )}
              {contact_info.location && (
                <motion.div
                  className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl backdrop-blur-sm"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  variants={fadeInUp}
                >
                  <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/10 shrink-0">
                    <FaMapMarkerAlt className="text-lg sm:text-xl opacity-90" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-semibold tracking-widest uppercase mb-1 opacity-80" style={{ letterSpacing: '0.1em' }}>
                      Adresse
                    </div>
                    <div className="font-medium text-sm sm:text-base text-white/95">
                      {contact_info.location}
                    </div>
                  </div>
                </motion.div>
              )}
              {!contact_info.email && !contact_info.phone && !contact_info.location && (
                <p className="text-sm opacity-70 italic">
                  Aucune information de contact renseignée.
                </p>
              )}
            </motion.div>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {socialList.map((s, i) => (
              <motion.a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl backdrop-blur-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileHover={{ scale: 1.1, rotate: 5, backgroundColor: 'rgba(255,255,255,0.2)' }}
                whileTap={{ scale: 0.95 }}
                aria-label={s.label}
              >
                {s.icon}
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer - Premium */}
      <footer
        className="border-t"
        style={{
          backgroundColor: tokens.surface,
          borderColor: tokens.border,
        }}
      >
        {/* Carte Innosoft Portfolio — design exceptionnel */}
        <div className="px-4 xs:px-6 sm:px-8 md:px-12 lg:px-20 py-6 sm:py-8 md:py-10">
          <div className="max-w-4xl mx-auto">
            <Link to="/" className="block no-underline">
              <motion.div
                className="group relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 transition-all duration-500"
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
                <div className="relative flex flex-col sm:flex-row items-center gap-5 sm:gap-8 md:gap-10">
                  {/* Logo dans un cadre */}
                  <div
                    className="shrink-0 flex items-center justify-center rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 transition-all duration-300 group-hover:scale-[1.02]"
                    style={{
                      backgroundColor: `${primary}08`,
                      border: `1px solid ${primary}20`,
                      boxShadow: `inset 0 1px 0 ${primary}10`,
                    }}
                  >
                    <img
                      src="/images/INNOSOFT%20CREATION.png"
                      alt="Innosoft Portfolio"
                      className="h-12 sm:h-14 md:h-16 w-auto object-contain opacity-95 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  {/* Texte + CTA */}
                  <div className="flex-1 text-center sm:text-left min-w-0">
                    <p className="text-sm sm:text-base md:text-lg font-semibold mb-2" style={{ color: tokens.text }}>
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
                    <p className="text-xs sm:text-sm md:text-base mb-4 sm:mb-6 max-w-xl" style={{ color: tokens.textMuted }}>
                      Créez le vôtre en quelques clics, personnalisez votre design et partagez votre parcours avec le monde.
                    </p>
                    <motion.span
                      className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl px-4 py-2 sm:px-6 sm:py-3 transition-all duration-300"
                      style={{
                        color: '#FFFFFF',
                        background: `linear-gradient(135deg, ${primary}, ${accent || primary})`,
                        boxShadow: `0 8px 24px -8px ${primary}50`,
                      }}
                      whileHover={{
                        gap: 3,
                        boxShadow: `0 12px 32px -8px ${primary}60`,
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Créer mon portfolio
                      <FaArrowRight className="text-[10px] sm:text-xs transition-transform duration-200 group-hover:translate-x-1" />
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>

        {/* Bas de pied de page */}
        <div className="py-6 sm:py-8 px-4 xs:px-6 sm:px-8 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
              <div className="text-center md:text-left">
                <div className="text-lg sm:text-xl font-bold mb-1" style={{ color: tokens.text }}>
                  {display_name}
                  <span className="text-[var(--primary)]">.</span>
                </div>
                <div className="text-xs sm:text-sm" style={{ color: tokens.textMuted }}>
                  © {new Date().getFullYear()} Tous droits réservés
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6">
                {navItems.slice(1).map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => scrollTo(e, item.href)}
                    className="text-xs sm:text-sm font-medium transition-all duration-300 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded-lg px-2 py-1"
                    style={{ color: tokens.textMuted }}
                  >
                    {item.name}
                  </a>
                ))}
              </div>

              <motion.a
                href="#home"
                onClick={(e) => scrollTo(e, '#home')}
                className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded-full px-4 py-2 sm:px-5 sm:py-2.5"
                style={{
                  color: tokens.text,
                  backgroundColor: `${primary}08`,
                }}
                whileHover={{ gap: 2.5 }}
              >
                Retour en haut
                <FaArrowUp className="text-[10px] sm:text-xs" />
              </motion.a>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.a
            key="back-to-top"
            href="#home"
            onClick={(e) => scrollTo(e, '#home')}
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              backgroundColor: primary,
              color: '#FFFFFF',
              boxShadow: `0 12px 40px -12px ${primary}70`,
            }}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: EASE_OUT_QUINT }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Retour en haut de page"
          >
            <FaArrowUp className="text-base sm:text-lg" />
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PortfolioPremium;