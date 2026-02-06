import { useState, useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import { motion, useScroll, AnimatePresence, useInView } from 'framer-motion';
import {
  FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaBars, FaTimes, FaArrowRight, FaExternalLinkAlt, FaArrowUp, FaDownload, FaPaperPlane,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { getProfileImageUrl, getImageUrl, getPublicImageUrl } from '../utils/imageUtils';
import { getIcon } from '../utils/iconMapper';
import ThemeApplier from '../components/ThemeApplier';
import { portfolioApi } from '../api/portfolio';

const SECTION_IDS = ['home', 'about', 'skills', 'projects', 'contact'];
const navItems = SECTION_IDS.map((id) => ({
  name: id === 'home' ? 'Accueil' : id === 'about' ? 'À propos' : id === 'skills' ? 'Expertise' : id === 'projects' ? 'Réalisations' : 'Contact',
  href: `#${id}`,
  id,
}));

const EASE = [0.25, 0.46, 0.45, 0.94];

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

const AnimatedCounter = ({ value, suffix = '', replayTrigger = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = Number(value);
      const duration = 1500;
      const startTime = performance.now();
      const animate = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setDisplay(Math.round(progress * end));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, value]);

  useEffect(() => {
    if (replayTrigger > 0) {
      setDisplay(0);
      let start = 0;
      const end = Number(value);
      const duration = 1200;
      const startTime = performance.now();
      const animate = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setDisplay(Math.round(progress * end));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [replayTrigger, value]);

  return <span ref={ref}>{display}{suffix}</span>;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PortfolioElegant = ({ data, slug, isPreview = false }) => {
  const { theme, isDarkMode } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactErrors, setContactErrors] = useState({});
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(null);
  const [hoveredStatIndex, setHoveredStatIndex] = useState(null);
  const [statReplayTrigger, setStatReplayTrigger] = useState(0);
  const reducedMotion = useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false
  );

  const { scrollY } = useScroll();
  const [navScrolled, setNavScrolled] = useState(false);

  const primary = theme.primary.main;
  const accent = theme.accent?.main || primary;

  const darkTokens = {
    bg: '#0a0b0d',
    surface: 'rgba(18,20,24,0.95)',
    surfaceAlt: 'rgba(24,28,34,0.98)',
    surfaceElevated: 'rgba(32,36,44,0.98)',
    text: '#f8fafc',
    textMuted: 'rgba(248,250,252,0.72)',
    textSubtle: 'rgba(248,250,252,0.48)',
    border: 'rgba(255,255,255,0.08)',
    glass: 'rgba(18,20,24,0.9)',
    shadow: `0 24px 48px -12px rgba(0,0,0,0.5)`,
    shadowSm: `0 4px 12px -4px rgba(0,0,0,0.3)`,
  };

  const lightTokens = {
    bg: '#f8fafc',
    surface: 'rgba(255,255,255,0.98)',
    surfaceAlt: 'rgba(248,250,252,0.98)',
    surfaceElevated: 'rgba(255,255,255,1)',
    text: '#0f172a',
    textMuted: 'rgba(15,23,42,0.72)',
    textSubtle: 'rgba(15,23,42,0.48)',
    border: 'rgba(0,0,0,0.08)',
    glass: 'rgba(255,255,255,0.95)',
    shadow: `0 24px 48px -12px rgba(0,0,0,0.12)`,
    shadowSm: `0 4px 12px -4px rgba(0,0,0,0.08)`,
  };

  const tokens = isDarkMode ? darkTokens : lightTokens;
  const t = (d) => (reducedMotion ? 0 : d);

  useEffect(() => {
    const unsub = scrollY.on('change', (v) => setNavScrolled(v > 60));
    return () => unsub();
  }, [scrollY]);

  useEffect(() => {
    const unsub = scrollY.on('change', (v) => setShowBackToTop(v > 600));
    return () => unsub();
  }, [scrollY]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveSection(e.target.id);
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
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
    if (!email) err.email = "L'email est obligatoire.";
    else if (!emailRegex.test(email)) err.email = "L'email doit être valide.";
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
    if (isPreview) {
      setContactSuccess('Aperçu: le formulaire fonctionne correctement!');
      return;
    }
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
      const msg = err.response?.data?.message || "Impossible d'envoyer le message.";
      const raw = err.response?.data?.errors;
      const errors = raw
        ? Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]))
        : { message: msg };
      setContactErrors(errors);
      setContactSuccess(null);
    } finally {
      setContactSubmitting(false);
    }
  }, [slug, contactForm, isPreview]);

  const defaultHeroStats = [
    { value: 5, suffix: '+', label: "Années d'expérience" },
    { value: 50, suffix: '+', label: 'Projets réalisés' },
    { value: 100, suffix: '%', label: 'Satisfaction client' },
  ];

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
    hero_description = "Création d'expériences digitales exceptionnelles",
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

  return (
    <div
      className="min-h-screen antialiased overflow-x-hidden lg:flex"
      style={{
        backgroundColor: tokens.bg,
        fontFamily: "'DM Sans', 'Inter', -apple-system, sans-serif",
        '--primary': primary,
        '--accent': accent,
      }}
    >
      <ThemeApplier />

      {/* Sidebar fixe à gauche — style éditorial raffiné */}
      <aside
        className="hidden lg:flex fixed left-0 top-0 bottom-0 w-24 flex-col items-center py-10 z-50"
        style={{
          background: isDarkMode ? `linear-gradient(180deg, ${tokens.surface} 0%, ${tokens.surfaceAlt} 100%)` : tokens.surface,
          borderRight: `1px solid ${tokens.border}`,
          boxShadow: isDarkMode ? '4px 0 24px -8px rgba(0,0,0,0.3)' : '4px 0 24px -8px rgba(0,0,0,0.06)',
        }}
      >
        <a
          href="#home"
          onClick={(e) => scrollTo(e, '#home')}
          className="text-lg font-bold mb-12 transition-transform hover:scale-105"
          style={{ color: primary, fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {display_name.split(' ')[0].slice(0, 2)}
        </a>
        <div className="flex-1 flex flex-col gap-8">
          {navItems.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => scrollTo(e, item.href)}
              className="flex flex-col items-center gap-2 group"
              title={item.name}
            >
              <motion.span
                className="text-xs font-semibold w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300"
                style={{
                  color: activeSection === item.id ? '#fff' : tokens.textMuted,
                  backgroundColor: activeSection === item.id ? primary : 'transparent',
                  boxShadow: activeSection === item.id ? `0 4px 12px -4px ${primary}80` : 'none',
                }}
                whileHover={{ scale: 1.08, backgroundColor: activeSection === item.id ? primary : `${primary}15` }}
              >
                {i + 1}
              </motion.span>
              <span
                className="text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ color: tokens.text }}
              >
                {item.name}
              </span>
            </a>
          ))}
        </div>
        <div className="w-10 h-px my-6" style={{ backgroundColor: tokens.border }} />
        <div className="flex flex-col gap-4">
          {socialList.slice(0, 3).map((s, i) => (
            <motion.a key={i} href={s.href} target="_blank" rel="noopener noreferrer" style={{ color: tokens.textMuted }} className="hover:opacity-100 opacity-60 transition-opacity" whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
              {s.icon}
            </motion.a>
          ))}
        </div>
      </aside>

      {/* Barre colorée verticale — signature Elegant */}
      <div
        className="hidden lg:block fixed left-24 top-0 bottom-0 w-0.5 z-40"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${primary}40 20%, ${primary} 50%, ${accent} 80%, transparent 100%)`,
          opacity: 0.8,
        }}
      />

      {/* Mobile: nav en haut */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3" style={{ backgroundColor: tokens.glass, backdropFilter: 'blur(12px)', borderBottom: `1px solid ${tokens.border}` }}>
        <a href="#home" onClick={(e) => scrollTo(e, '#home')} className="font-bold" style={{ color: tokens.text, fontFamily: "'Playfair Display', Georgia, serif" }}>
          {display_name.split(' ')[0]}
        </a>
        <button type="button" onClick={() => setMobileNavOpen(!mobileNavOpen)} style={{ color: tokens.text }}>
          {mobileNavOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden pt-16 px-6 pb-8"
            style={{ backgroundColor: `${tokens.bg}EE`, backdropFilter: 'blur(8px)' }}
          >
            {navItems.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={(e) => scrollTo(e, item.href)}
                className="flex items-center gap-3 py-4 text-lg font-medium border-b"
                style={{ color: tokens.text, borderColor: tokens.border }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: `${primary}20`, color: primary }}>{i + 1}</span>
                {item.name}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenu principal — décalé à droite sur desktop */}
      <main className="flex-1 lg:ml-24 min-w-0">
      {/* Hero — style centré vertical, photo en cercle */}
      <section
        id="home"
        className="relative min-h-screen flex flex-col items-center justify-center px-6 sm:px-12 pt-24 pb-20 overflow-hidden"
      >
        {/* Image en arrière-plan */}
        <div className="absolute inset-0">
          <img
            src={getProfileImageUrl(profile_image)}
            alt=""
            className="w-full h-full object-cover scale-105"
            style={{ opacity: isDarkMode ? 0.35 : 0.25 }}
            onError={(e) => { e.target.src = getPublicImageUrl('images/profile.jpeg'); }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: isDarkMode
                ? `linear-gradient(180deg, ${tokens.bg} 0%, ${tokens.bg}99 25%, ${tokens.bg}80 50%, ${tokens.bg}99 75%, ${tokens.bg} 100%)`
                : `linear-gradient(180deg, ${tokens.bg} 0%, ${tokens.bg}99 30%, ${tokens.bg}80 55%, ${tokens.bg}99 80%, ${tokens.bg} 100%)`,
            }}
          />
        </div>

        {/* Fond — bande dégradée en haut */}
        <div
          className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none"
          style={{
            background: `linear-gradient(180deg, ${primary}08 0%, transparent 100%)`,
          }}
        />
        {/* Ligne horizontale décorative */}
        <div
          className="absolute top-1/3 left-0 right-0 h-px opacity-30"
          style={{ backgroundColor: primary }}
        />

        <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center text-center">
          {/* Photo en cercle */}
          <motion.div
            className="relative mb-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: t(0.8), ease: EASE }}
          >
            <div
              className="absolute -inset-2 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${primary}30, ${accent}20)`,
                filter: 'blur(20px)',
              }}
            />
            <motion.div
              className="relative w-40 h-40 sm:w-52 sm:h-52 rounded-full overflow-hidden"
              style={{
                boxShadow: `0 0 0 4px ${primary}30, 0 0 0 1px ${tokens.border}, 0 25px 50px -12px ${primary}30`,
              }}
              whileHover={{ scale: 1.03 }}
            >
              <img
                src={getProfileImageUrl(profile_image)}
                alt={display_name}
                className="w-full h-full object-cover"
                loading="eager"
                onError={(e) => { e.target.src = getPublicImageUrl('images/profile.jpeg'); }}
              />
            </motion.div>
          </motion.div>

          {/* Nom */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-4 tracking-tight"
            style={{
              color: tokens.text,
              fontFamily: "'Playfair Display', Georgia, serif",
            }}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: t(0.3), duration: t(0.7) }}
          >
            {display_name}
          </motion.h1>

          {/* Titre / Poste */}
          <motion.p
            className="text-lg sm:text-xl md:text-2xl font-medium mb-3"
            style={{
              color: primary,
              fontFamily: "'Playfair Display', Georgia, serif",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: t(0.45), duration: t(0.6) }}
          >
            {job_title}
          </motion.p>

          {/* Description */}
          <motion.p
            className="text-base sm:text-lg mb-10 max-w-lg mx-auto"
            style={{ color: tokens.textMuted }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: t(0.55), duration: t(0.6) }}
          >
            {hero_description}
          </motion.p>

          {/* Boutons */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: t(0.65), duration: t(0.6) }}
          >
            <motion.a
              href="#projects"
              onClick={(e) => scrollTo(e, '#projects')}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-full"
              style={{
                background: `linear-gradient(135deg, ${primary}, ${accent})`,
                boxShadow: `0 8px 24px -8px ${primary}60`,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Mes projets
              <FaArrowRight className="text-xs" />
            </motion.a>
            {cv_file && (
              <motion.a
                href={cv_file}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full border-2"
                style={{ color: primary, borderColor: primary }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaDownload className="text-xs" />
                CV
              </motion.a>
            )}
          </motion.div>

          {/* Stats — ligne horizontale */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 sm:gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: t(0.8), duration: t(0.6) }}
          >
            {hero_stats.slice(0, 3).map((stat, i) => (
              <div
                key={i}
                className="text-center cursor-default"
                onMouseEnter={() => { setHoveredStatIndex(i); setStatReplayTrigger((c) => c + 1); }}
                onMouseLeave={() => setHoveredStatIndex(null)}
              >
                <div className="text-2xl sm:text-3xl font-bold" style={{ color: primary, fontFamily: "'Playfair Display', Georgia, serif" }}>
                  {typeof stat.value === 'number' ? (
                    <AnimatedCounter value={stat.value} suffix={stat.suffix ?? ''} replayTrigger={hoveredStatIndex === i ? statReplayTrigger : 0} />
                  ) : (
                    String(stat.value ?? '')
                  )}
                </div>
                <div className="text-[10px] sm:text-xs mt-0.5 font-medium" style={{ color: tokens.textSubtle }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: t(1.1) }}
        >
          <span className="text-[10px] font-medium tracking-widest uppercase" style={{ color: tokens.textSubtle }}>
            Scroll
          </span>
          <motion.div
            className="w-px h-8"
            style={{ backgroundColor: tokens.border }}
            animate={{ height: [0, 16, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          />
        </motion.div>
      </section>

      {/* About — cartes raffinées avec bordure gauche */}
      <section
        id="about"
        className="py-16 sm:py-20 md:py-24 px-6 sm:px-12 lg:px-24"
        style={{ backgroundColor: tokens.surfaceAlt }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid lg:grid-cols-12 gap-8 lg:gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
          >
            <motion.div
              className="lg:col-span-4 lg:sticky lg:top-32"
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-px" style={{ backgroundColor: primary }} />
                <span className="text-xs font-semibold tracking-[0.3em] uppercase" style={{ color: primary }}>
                  À propos
                </span>
              </div>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight"
                style={{ color: tokens.text, fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Vision & Philosophie
              </h2>
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: tokens.textMuted }}>
                Une approche unique alliant expertise technique et sensibilité design.
              </p>
            </motion.div>
            <motion.div
              className="lg:col-span-8 space-y-6"
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
            >
              {(about_paragraph_1 || about_paragraph_2) && (
                <div className="space-y-5 text-base sm:text-lg leading-relaxed" style={{ color: tokens.textMuted }}>
                  {about_paragraph_1 && <p>{about_paragraph_1}</p>}
                  {about_paragraph_2 && <p>{about_paragraph_2}</p>}
                </div>
              )}
              {about_highlights?.length > 0 && (
                <div className="space-y-5">
                  {/* Qui suis-je ? et Expérience sur une seule ligne */}
                  {about_highlights.length >= 2 && (
                    <div className="grid sm:grid-cols-2 gap-5">
                      {about_highlights.slice(0, 2).map((h, i) => (
                        <motion.div
                          key={i}
                          className="p-6 rounded-2xl border-l-4 transition-all duration-300"
                          style={{
                            backgroundColor: tokens.surface,
                            borderLeftColor: primary,
                            borderColor: tokens.border,
                            boxShadow: tokens.shadowSm,
                          }}
                          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                          whileHover={{ x: 6, boxShadow: tokens.shadow }}
                        >
                          <div className="flex items-center gap-4 mb-3">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
                              style={{ backgroundColor: `${primary}15`, color: primary }}
                            >
                              {i + 1}
                            </div>
                            <h3 className="font-bold text-lg" style={{ color: tokens.text }}>
                              {h.title ?? h.description ?? ''}
                            </h3>
                          </div>
                          <p className="text-sm leading-relaxed" style={{ color: tokens.textMuted }}>{h.description ?? ''}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  {/* Formation et autres sur une seule colonne */}
                  {about_highlights.slice(2).length > 0 && (
                    <div className="flex flex-col gap-5">
                      {about_highlights.slice(2).map((h, i) => (
                        <motion.div
                          key={i + 2}
                          className="p-6 rounded-2xl border-l-4 transition-all duration-300"
                          style={{
                            backgroundColor: tokens.surface,
                            borderLeftColor: primary,
                            borderColor: tokens.border,
                            boxShadow: tokens.shadowSm,
                          }}
                          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                          whileHover={{ x: 6, boxShadow: tokens.shadow }}
                        >
                          <div className="flex items-center gap-4 mb-3">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
                              style={{ backgroundColor: `${primary}15`, color: primary }}
                            >
                              {i + 3}
                            </div>
                            <h3 className="font-bold text-lg" style={{ color: tokens.text }}>
                              {h.title ?? h.description ?? ''}
                            </h3>
                          </div>
                          <p className="text-sm leading-relaxed" style={{ color: tokens.textMuted }}>{h.description ?? ''}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  {/* Si seulement 1 ou 2 cartes au total */}
                  {about_highlights.length === 1 && (
                    <motion.div
                      className="p-6 rounded-2xl border-l-4 transition-all duration-300"
                      style={{
                        backgroundColor: tokens.surface,
                        borderLeftColor: primary,
                        borderColor: tokens.border,
                        boxShadow: tokens.shadowSm,
                      }}
                      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                      whileHover={{ x: 6, boxShadow: tokens.shadow }}
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
                          style={{ backgroundColor: `${primary}15`, color: primary }}
                        >
                          1
                        </div>
                        <h3 className="font-bold text-lg" style={{ color: tokens.text }}>
                          {about_highlights[0].title ?? about_highlights[0].description ?? ''}
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: tokens.textMuted }}>{about_highlights[0].description ?? ''}</p>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Skills — cartes avec ombres et hover */}
      <section
        id="skills"
        className="py-16 sm:py-20 md:py-24 px-6 sm:px-12 lg:px-24"
        style={{ backgroundColor: tokens.bg }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-px" style={{ backgroundColor: primary }} />
              <span className="text-xs font-semibold tracking-[0.3em] uppercase" style={{ color: primary }}>
                Expertise
              </span>
              <div className="w-12 h-px" style={{ backgroundColor: primary }} />
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5"
              style={{ color: tokens.text, fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Stack Technique
            </h2>
            <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: tokens.textMuted }}>
              Technologies modernes pour des solutions robustes et performantes.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => {
              const items = grouped[cat.key] || [];
              if (items.length === 0) return null;
              return (
                <motion.div
                  key={cat.key}
                  className="p-6 rounded-2xl border-l-4 transition-all duration-300"
                  style={{
                    backgroundColor: tokens.surface,
                    borderLeftColor: primary,
                    borderColor: tokens.border,
                    boxShadow: tokens.shadowSm,
                  }}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ y: -6, boxShadow: tokens.shadow }}
                >
                  <h3 className="font-bold text-lg mb-5 flex items-center gap-3" style={{ color: tokens.text }}>
                    {cat.title}
                    <span className="w-10 h-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: primary }} />
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((s, j) => (
                      <span
                        key={j}
                        className="px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                        style={{
                          backgroundColor: `${primary}0D`,
                          color: primary,
                          border: `1px solid ${primary}25`,
                        }}
                      >
                        {getIcon(s.icon) && <span className="mr-1.5 inline-block align-middle opacity-80">{getIcon(s.icon)}</span>}
                        {s.name}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects — cartes avec image et overlay */}
      <section
        id="projects"
        className="py-16 sm:py-20 md:py-24 px-6 sm:px-12 lg:px-24"
        style={{ backgroundColor: tokens.surfaceAlt }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-px" style={{ backgroundColor: primary }} />
                <span className="text-xs font-semibold tracking-[0.3em] uppercase" style={{ color: primary }}>
                  Réalisations
                </span>
              </div>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold"
                style={{ color: tokens.text, fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Projets Notables
              </h2>
            </div>
            <motion.a
              href="#contact"
              onClick={(e) => scrollTo(e, '#contact')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ color: primary, backgroundColor: `${primary}12`, border: `1px solid ${primary}30` }}
              whileHover={{ x: 4, backgroundColor: `${primary}18` }}
            >
              Projet collaboratif ?
              <FaArrowRight className="text-xs" />
            </motion.a>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.slice(0, 4).map((proj, i) => {
              const hasLink = !!(proj.demo_url?.trim?.() || proj.github_url?.trim?.());
              const Card = (
                <div
                  className="group relative overflow-hidden rounded-2xl border-l-4 h-full flex flex-col transition-all duration-300"
                  style={{
                    backgroundColor: tokens.surface,
                    borderLeftColor: primary,
                    borderColor: tokens.border,
                    boxShadow: tokens.shadowSm,
                  }}
                >
                  {(getImageUrl(proj.image) || proj.image) && (
                    <div className="relative w-full aspect-video overflow-hidden">
                      <img
                        src={getImageUrl(proj.image) || proj.image}
                        alt={proj.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <div
                        className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
                        style={{
                          background: `linear-gradient(to bottom, transparent 30%, ${tokens.surface} 85%)`,
                        }}
                      />
                      {hasLink && (
                        <div
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ backgroundColor: `${primary}20` }}
                        >
                          <span
                            className="p-4 rounded-2xl"
                            style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: primary }}
                          >
                            <FaExternalLinkAlt className="text-2xl" />
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="relative p-6 flex-1">
                    <h3 className="text-xl font-bold mb-3" style={{ color: tokens.text, fontFamily: "'Playfair Display', Georgia, serif" }}>
                      {proj.title}
                    </h3>
                    <p className="text-sm mb-5 leading-relaxed" style={{ color: tokens.textMuted }}>
                      {proj.description}
                    </p>
                    {proj.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {proj.tags.slice(0, 4).map((tag, k) => (
                          <span
                            key={k}
                            className="px-3 py-1.5 rounded-xl text-xs font-medium"
                            style={{
                              color: primary,
                              backgroundColor: `${primary}12`,
                              border: `1px solid ${primary}25`,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );

              return (
                <motion.div
                  key={proj.id ?? i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  {hasLink ? (
                    <a
                      href={proj.demo_url || proj.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full"
                    >
                      {Card}
                    </a>
                  ) : (
                    Card
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact — design raffiné */}
      <section
        id="contact"
        className="py-16 sm:py-20 md:py-24 px-6 sm:px-12 lg:px-24 relative overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${primary} 0%, ${accent} 45%, ${primary} 100%)`,
          color: '#fff',
        }}
      >
        {/* Motif décoratif */}
        <div className="absolute inset-0 opacity-[0.07]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)`,
              backgroundSize: '32px 32px',
            }}
          />
        </div>
        <div
          className="absolute top-0 left-0 w-full h-1/2 opacity-20"
          style={{
            background: `linear-gradient(180deg, white 0%, transparent 100%)`,
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-1/3 h-1/2 opacity-15"
          style={{
            background: `radial-gradient(ellipse at 100% 100%, white 0%, transparent 70%)`,
          }}
        />

        <div className="relative max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>
              <FaEnvelope className="text-sm opacity-90" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase">
                Contact
              </span>
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Discutons de votre projet
            </h2>
            <p className="text-base sm:text-lg opacity-95 max-w-lg mx-auto">
              Une idée, un projet ? Envoyez-moi un message, je vous répondrai rapidement.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {/* Formulaire — carte glass */}
            {slug && (
              <motion.form
                onSubmit={handleContactSubmit}
                className="p-6 sm:p-8 rounded-3xl space-y-5"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="w-8 h-1 rounded-full bg-white/60" />
                  Envoyer un message
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-semibold mb-1.5 opacity-95">
                      Nom <span className="text-red-300">*</span>
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      placeholder="Jean Dupont"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 transition-all"
                      disabled={contactSubmitting}
                    />
                    {contactErrors.name && <p className="mt-1 text-sm text-red-200">{contactErrors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-semibold mb-1.5 opacity-95">
                      Email <span className="text-red-300">*</span>
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      placeholder="jean@exemple.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 transition-all"
                      disabled={contactSubmitting}
                    />
                    {contactErrors.email && <p className="mt-1 text-sm text-red-200">{contactErrors.email}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-semibold mb-1.5 opacity-95">
                    Sujet
                  </label>
                  <input
                    type="text"
                    id="contact-subject"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleContactChange}
                    placeholder="Proposition de collaboration"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 transition-all"
                    disabled={contactSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-semibold mb-1.5 opacity-95">
                    Message <span className="text-red-300">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    placeholder="Décrivez votre projet ou posez votre question..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 resize-none transition-all"
                    disabled={contactSubmitting}
                  />
                  {contactErrors.message && <p className="mt-1 text-sm text-red-200">{contactErrors.message}</p>}
                </div>
                {contactSuccess && <p className="text-sm text-green-200 font-medium flex items-center gap-2">✓ {contactSuccess}</p>}
                <motion.button
                  type="submit"
                  disabled={contactSubmitting}
                  className="w-full px-6 py-4 rounded-xl font-semibold bg-white text-[var(--primary)] hover:bg-white/95 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-60 shadow-xl flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {contactSubmitting ? (
                    <span className="flex items-center gap-2">Envoi en cours...</span>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Envoyer le message
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}

            {/* Infos contact — carte */}
            <motion.div
              className="p-6 sm:p-8 rounded-3xl flex flex-col"
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-1 rounded-full bg-white/60" />
                Contact direct
              </h3>
              <div className="space-y-4 flex-1">
                {contact_info.email && (
                  <motion.a
                    href={`mailto:${contact_info.email}`}
                    className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group"
                    style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.15)', x: 4 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
                      <FaEnvelope className="text-lg" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-0.5">Email</div>
                      <div className="font-medium break-all">{contact_info.email}</div>
                    </div>
                  </motion.a>
                )}
                {contact_info.phone && (
                  <motion.a
                    href={`tel:${String(contact_info.phone).replace(/\s/g, '')}`}
                    className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group"
                    style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.15)', x: 4 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
                      <FaPhone className="text-lg" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-0.5">Téléphone</div>
                      <div className="font-medium">{contact_info.phone}</div>
                    </div>
                  </motion.a>
                )}
                {contact_info.location && (
                  <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                      <FaMapMarkerAlt className="text-lg" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-0.5">Localisation</div>
                      <div className="font-medium">{contact_info.location}</div>
                    </div>
                  </div>
                )}
                {!contact_info.email && !contact_info.phone && !contact_info.location && (
                  <p className="text-sm opacity-80 italic py-4">Aucune information de contact renseignée.</p>
                )}
              </div>
              {/* Réseaux sociaux */}
              {socialList.length > 0 && (
                <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                  <div className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-3">Réseaux</div>
                  <div className="flex gap-3">
                    {socialList.map((s, i) => (
                      <motion.a
                        key={i}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-xl flex items-center justify-center transition-all"
                        style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={s.label}
                      >
                        {s.icon}
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 sm:py-12 px-4 sm:px-6 md:px-12 lg:px-24 border-t overflow-x-hidden"
        style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}
      >
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="block mb-6 sm:mb-8">
            <motion.div
              className="p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-8"
              style={{
                backgroundColor: tokens.surfaceAlt,
                borderColor: tokens.border,
                boxShadow: tokens.shadowSm,
              }}
              whileHover={{ y: -4, boxShadow: tokens.shadow }}
            >
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl shrink-0" style={{ backgroundColor: `${primary}12` }}>
                <img
                  src={getPublicImageUrl('images/INNOSOFT CREATION.png')}
                  alt="Innosoft Portfolio"
                  className="h-10 sm:h-12 md:h-14 w-auto"
                />
              </div>
              <div className="text-center sm:text-left flex-1 min-w-0">
                <p className="font-bold text-base sm:text-lg" style={{ color: tokens.text }}>
                  Créé avec <span style={{ color: primary }}>Innosoft Portfolio</span>
                </p>
                <p className="text-xs sm:text-sm mt-1 sm:mt-2" style={{ color: tokens.textMuted }}>
                  Créez le vôtre en quelques clics. Personnalisez et partagez.
                </p>
              </div>
              <motion.span
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold text-white shrink-0"
                style={{ background: `linear-gradient(135deg, ${primary}, ${accent})`, boxShadow: `0 8px 24px -8px ${primary}60` }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Créer mon portfolio
                <FaArrowRight className="text-xs" />
              </motion.span>
            </motion.div>
          </Link>
          <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:justify-between md:items-center">
            <div className="text-center md:text-left">
              <p className="font-bold text-sm sm:text-base" style={{ color: tokens.text }}>
                {display_name}
                <span style={{ color: primary }}>.</span>
              </p>
              <p className="text-xs sm:text-sm" style={{ color: tokens.textMuted }}>
                © {new Date().getFullYear()} Tous droits réservés
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
              {navItems.slice(1).map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => scrollTo(e, item.href)}
                  className="text-xs sm:text-sm font-medium hover:opacity-70 py-1"
                  style={{ color: tokens.textMuted }}
                >
                  {item.name}
                </a>
              ))}
            </div>
            <motion.a
              href="#home"
              onClick={(e) => scrollTo(e, '#home')}
              className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold"
              style={{ color: primary }}
              whileHover={{ y: -2 }}
            >
              Retour en haut
              <FaArrowUp className="text-xs" />
            </motion.a>
          </div>
        </div>
      </footer>
      </main>

      <AnimatePresence>
        {showBackToTop && (
          <motion.a
            href="#home"
            onClick={(e) => scrollTo(e, '#home')}
            className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-2xl flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
            style={{
              background: `linear-gradient(135deg, ${primary}, ${accent})`,
              boxShadow: `0 12px 40px -12px ${primary}80`,
            }}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Retour en haut"
          >
            <FaArrowUp className="text-lg" />
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PortfolioElegant;
