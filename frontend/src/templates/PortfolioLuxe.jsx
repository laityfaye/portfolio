/**
 * Portfolio Luxe — Layout split-screen unique
 * Panneau gauche fixe (photo + identité) | Panneau droit scrollable (contenu)
 * Aucun autre template n'utilise cette structure.
 */
import { useState, useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import { motion, useScroll, AnimatePresence, useInView, useMotionValue, useTransform, useSpring } from 'framer-motion';
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

const SECTION_IDS = ['about', 'skills', 'projects', 'contact'];
const navItems = SECTION_IDS.map((id) => ({
  name: id === 'about' ? 'À propos' : id === 'skills' ? 'Expertise' : id === 'projects' ? 'Réalisations' : 'Contact',
  href: '#' + id,
  id,
}));

const EASE = [0.22, 1, 0.36, 1];
const SPRING_BOUNCY = { type: 'spring', stiffness: 400, damping: 25 };
const SPRING_SMOOTH = { type: 'spring', stiffness: 300, damping: 30 };
const SPRING_GENTLE = { type: 'spring', stiffness: 120, damping: 20 };

const sectionReveal = {
  hidden: { opacity: 0, y: 60, filter: 'blur(8px)' },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: i * 0.08,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, staggerDirection: 1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: SPRING_SMOOTH,
  },
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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PortfolioLuxe = ({ data, slug, isPreview = false }) => {
  const { theme, isDarkMode } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactErrors, setContactErrors] = useState({});
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(null);
  const [contactSubmitError, setContactSubmitError] = useState(null);
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
  const contentRef = useRef(null);
  const mainRef = useRef(null);

  // Parallax profile image (subtle scale based on scroll)
  const scrollYProgress = useTransform(scrollY, [0, 400], [0, 1]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const imageSpring = useSpring(imageScale, SPRING_GENTLE);
  const imageYSpring = useSpring(imageY, SPRING_GENTLE);

  const primary = theme.primary.main;
  const accent = theme.accent?.main || primary;

  const tokens = {
    leftBg: isDarkMode ? '#060608' : '#08080c',
    leftText: '#fafafa',
    leftMuted: 'rgba(250,250,250,0.55)',
    rightBg: isDarkMode ? '#0a0a0d' : '#f8f9fb',
    rightText: isDarkMode ? '#fafafa' : '#0d0d10',
    rightMuted: isDarkMode ? 'rgba(250,250,250,0.6)' : 'rgba(13,13,16,0.6)',
    border: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    accentGlow: primary + '15',
  };

  const t = (d) => (reducedMotion ? 0 : d);

  useEffect(() => {
    const unsub = scrollY.on('change', () => {
      if (!contentRef.current) return;
      const rect = contentRef.current.getBoundingClientRect();
      setShowBackToTop(rect.top < -400);
    });
    return () => unsub();
  }, [scrollY]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveSection(e.target.id);
        }
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
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
    setContactSubmitError(null);
  }, []);

  const handleContactSubmit = useCallback(async (e) => {
    e.preventDefault();
    setContactSuccess(null);
    setContactSubmitError(null);
    if (isPreview) {
      setContactSuccess('Aperçu: le formulaire fonctionne correctement!');
      return;
    }
    if (!slug) {
      setContactSubmitError("Impossible d'envoyer le message (slug manquant).");
      return;
    }
    if (!validateContactForm()) return;
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
      setContactSubmitError(msg);
      const raw = err.response?.data?.errors;
      const errors = raw
        ? Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]))
        : {};
      setContactErrors(errors);
      setContactSuccess(null);
    } finally {
      setContactSubmitting(false);
    }
  }, [slug, contactForm, isPreview]);

  const portfolioData = data || {};
  const skills = parseIfNeeded(data?.skills, []);
  const projects = parseIfNeeded(data?.projects, []);
  const contact_info = parseIfNeeded(portfolioData?.contact_info, { email: '', phone: '', location: '' });
  const social_links = parseIfNeeded(portfolioData?.social_links, { github: '', linkedin: '', twitter: '' });
  const about_highlights = parseIfNeeded(portfolioData?.about_highlights, []);

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

  const scrollProgress = useTransform(scrollY, [0, 800], [0, 1]);
  const progressSpring = useSpring(scrollProgress, SPRING_GENTLE);

  return (
    <div
      ref={mainRef}
      className="min-h-screen antialiased overflow-x-hidden flex flex-col lg:flex-row"
      style={{
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
        '--primary': primary,
        '--accent': accent,
      }}
    >
      <ThemeApplier />

      {/* Mobile: menu hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3.5" style={{ backgroundColor: tokens.leftBg + 'F5', backdropFilter: 'blur(12px)', borderBottom: '1px solid ' + tokens.border }}>
        <span className="font-bold text-lg tracking-tight" style={{ color: tokens.leftText }}>{display_name.split(' ')[0]}</span>
        <button type="button" onClick={() => setMobileNavOpen(!mobileNavOpen)} className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors" style={{ color: tokens.leftText, backgroundColor: 'rgba(255,255,255,0.06)' }}>
          {mobileNavOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 lg:hidden pt-14 px-6"
            style={{ backgroundColor: tokens.leftBg + 'F5', backdropFilter: 'blur(12px)' }}
          >
            {navItems.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={(e) => scrollTo(e, item.href)}
                className="flex items-center gap-3 py-4 text-lg font-medium border-b"
                style={{ color: tokens.leftText, borderColor: tokens.border }}
                initial={{ opacity: 0, x: -30, filter: 'blur(4px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 25 }}
              >
                <motion.span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: activeSection === item.id ? primary : 'transparent', border: '2px solid ' + primary }}
                  animate={{ scale: activeSection === item.id ? 1.2 : 1 }}
                  transition={SPRING_SMOOTH}
                />
                {item.name}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== PANNAU GAUCHE FIXE (desktop) ========== */}
      <aside
        className="hidden lg:flex lg:flex-col lg:fixed lg:top-0 lg:left-0 lg:bottom-0 lg:w-[42%] xl:w-[38%]"
        style={{
          backgroundColor: tokens.leftBg,
          borderRight: '1px solid ' + tokens.border,
          boxShadow: '4px 0 40px -10px rgba(0,0,0,0.2)',
        }}
      >
        {/* Ligne accent verticale */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 hidden xl:block" style={{ background: 'linear-gradient(180deg, transparent, ' + primary + '40, ' + primary + ', ' + primary + '40, transparent)' }} />

        {/* Photo pleine hauteur — parallax au scroll */}
        <div className="flex-1 min-h-0 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 w-full h-full"
            style={{ scale: reducedMotion ? 1 : imageSpring, y: reducedMotion ? 0 : imageYSpring }}
          >
            <img
              src={getProfileImageUrl(profile_image)}
              alt={display_name}
              className="absolute inset-0 w-full h-full object-cover object-top"
              loading="eager"
              onError={(e) => { e.target.src = getPublicImageUrl('images/profile.jpeg'); }}
            />
          </motion.div>
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, ' + tokens.leftBg + ' 0%, transparent 35%, transparent 65%, ' + tokens.leftBg + ' 100%)',
            }}
          />
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(6,6,8,0.35)' }} />
          {/* Reflet accent en bas */}
          <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(to top, ' + primary + '08, transparent)' }} />
        </div>

        {/* Infos identité en bas du panneau gauche */}
        <div className="flex-shrink-0 px-8 py-10 xl:px-10 xl:py-12 relative" style={{ backgroundColor: tokens.leftBg, borderTop: '1px solid ' + tokens.border }}>
          <motion.h1
            className="text-3xl xl:text-4xl font-bold tracking-tight mb-2 overflow-hidden"
            style={{ color: tokens.leftText, letterSpacing: '-0.02em' }}
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05, delayChildren: t(0.2) } },
              hidden: {},
            }}
          >
            {display_name.split(' ').map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-[0.25em]"
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { ...SPRING_BOUNCY, duration: reducedMotion ? 0 : undefined },
                  },
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            className="text-base xl:text-lg font-medium mb-4"
            style={{
              color: primary,
              background: 'linear-gradient(90deg, ' + primary + ', ' + accent + ')',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: t(0.4), duration: t(0.6) }}
          >
            {job_title}
          </motion.p>
          <motion.p
            className="text-sm mb-6 max-w-sm leading-relaxed"
            style={{ color: tokens.leftMuted }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: t(0.5), duration: t(0.6) }}
          >
            {hero_description}
          </motion.p>

          <div className="flex flex-wrap gap-3 mb-6">
            {cv_file && (
              <motion.a
                href={cv_file}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold border-2 rounded-lg transition-all"
                style={{ color: primary, borderColor: primary }}
                whileHover={{ backgroundColor: primary + '12', boxShadow: '0 4px 20px -4px ' + primary + '40' }}
                whileTap={{ scale: 0.98 }}
              >
                <FaDownload className="text-xs" />
                Télécharger CV
              </motion.a>
            )}
            <motion.a
              href="#projects"
              onClick={(e) => scrollTo(e, '#projects')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg text-white transition-all"
              style={{ background: 'linear-gradient(135deg, ' + primary + ', ' + accent + ')', boxShadow: '0 4px 20px -4px ' + primary + '50' }}
              whileHover={{ boxShadow: '0 8px 28px -6px ' + primary + '60', transform: 'translateY(-1px)' }}
              whileTap={{ scale: 0.98 }}
            >
              Voir les projets
              <FaArrowRight className="text-xs" />
            </motion.a>
          </div>

          {socialList.length > 0 && (
            <div className="flex gap-3">
              {socialList.map((s, i) => (
                <motion.a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all"
                  style={{ color: tokens.leftMuted, backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  whileHover={{ backgroundColor: primary + '20', color: primary, borderColor: primary + '40' }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={s.label}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          )}
        </div>

        {/* Nav verticale — points avec layoutId pour morphing fluide */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-5">
          {navItems.map((item) => (
            <motion.a
              key={item.href}
              href={item.href}
              onClick={(e) => scrollTo(e, item.href)}
              className="relative flex items-center gap-3 group"
              title={item.name}
              whileHover={{ x: 6 }}
              transition={SPRING_SMOOTH}
            >
              <span className="relative w-3 h-3 flex-shrink-0 flex items-center justify-center">
                {activeSection === item.id ? (
                  <motion.span
                    layoutId="luxe-nav-dot"
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: primary, boxShadow: '0 0 20px ' + primary + '80' }}
                    transition={SPRING_SMOOTH}
                  />
                ) : (
                  <motion.span
                    className="absolute w-2 h-2 rounded-full"
                    style={{ backgroundColor: tokens.leftMuted }}
                    whileHover={{ scale: 1.3, backgroundColor: primary + '60' }}
                    transition={SPRING_SMOOTH}
                  />
                )}
              </span>
              <motion.span
                className="text-xs font-medium whitespace-nowrap"
                style={{ color: tokens.leftText }}
                initial={false}
                animate={{ opacity: activeSection === item.id ? 1 : 0.5 }}
                transition={{ duration: 0.2 }}
              >
                {item.name}
              </motion.span>
            </motion.a>
          ))}
        </div>
      </aside>

      {/* Mobile: bloc photo + identité */}
      <motion.div
        className="lg:hidden pt-14"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative h-80 sm:h-[28rem] overflow-hidden">
          <motion.img
            src={getProfileImageUrl(profile_image)}
            alt={display_name}
            className="w-full h-full object-cover object-top"
            loading="eager"
            onError={(e) => { e.target.src = getPublicImageUrl('images/profile.jpeg'); }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: EASE }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #060608 0%, transparent 40%, transparent 70%, rgba(6,6,8,0.6) 100%)' }} />
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: tokens.leftText }}>{display_name}</h1>
            <p className="text-sm font-medium mt-1" style={{ color: primary }}>{job_title}</p>
            <div className="flex gap-3 mt-4">
              {cv_file && (
                <a href={cv_file} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg" style={{ color: primary, border: '2px solid ' + primary }}>
                  <FaDownload /> CV
                </a>
              )}
              <a href="#projects" onClick={(e) => scrollTo(e, '#projects')} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg text-white" style={{ backgroundColor: primary }}>
                Projets <FaArrowRight className="text-[10px]" />
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Barre de progression scroll (desktop) */}
      {!reducedMotion && (
        <div className="hidden lg:block fixed top-0 right-0 w-0.5 h-full z-40" style={{ backgroundColor: tokens.border + '40' }}>
          <motion.div
            className="w-full h-full rounded-full origin-top"
            style={{
              backgroundColor: primary,
              scaleY: progressSpring,
              boxShadow: '0 0 20px ' + primary + '50',
            }}
          />
        </div>
      )}

      {/* ========== PANNAU DROIT SCROLLABLE ========== */}
      <main
        ref={contentRef}
        className="flex-1 lg:ml-[42%] xl:ml-[38%] min-h-screen relative"
        style={{ backgroundColor: tokens.rightBg }}
      >
        {/* Motif subtil + orbe flottant animé (desktop) */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] hidden lg:block" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, ' + primary + ' 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        {!reducedMotion && (
          <motion.div
            className="absolute top-1/4 right-0 w-96 h-96 rounded-full pointer-events-none opacity-[0.04] hidden lg:block"
            style={{ background: 'radial-gradient(circle, ' + primary + ' 0%, transparent 70%)' }}
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 20, 0],
              y: [0, -10, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <div className="relative max-w-2xl mx-auto px-6 sm:px-10 py-16 sm:py-24 lg:py-20">
          {/* About */}
          <section id="about" className="mb-24 sm:mb-32">
            <motion.div
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, x: -30, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: primary }} />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: primary }}>À propos</span>
            </motion.div>
            <motion.div
              className="space-y-6 text-base sm:text-lg leading-relaxed"
              style={{ color: tokens.rightMuted }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-30px' }}
              variants={staggerContainer}
            >
              {about_paragraph_1 && <motion.p variants={staggerItem}>{about_paragraph_1}</motion.p>}
              {about_paragraph_2 && <motion.p variants={staggerItem}>{about_paragraph_2}</motion.p>}
            </motion.div>
            {about_highlights?.length > 0 && (
              <motion.div
                className="mt-12 space-y-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-30px' }}
                variants={staggerContainer}
              >
                {about_highlights.map((h, i) => (
                  <motion.div
                    key={i}
                    className="pl-6 py-4 rounded-xl border-l-2"
                    style={{ borderColor: primary, backgroundColor: tokens.accentGlow }}
                    variants={staggerItem}
                    whileHover={{ x: 8, backgroundColor: primary + '12', transition: SPRING_SMOOTH }}
                  >
                    <h3 className="font-bold text-sm uppercase tracking-wider mb-2" style={{ color: tokens.rightText }}>{h.title ?? h.description ?? ''}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: tokens.rightMuted }}>{h.description ?? ''}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </section>

          {/* Skills — Expertise redesignée */}
          <section id="skills" className="mb-24 sm:mb-32">
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, x: -30, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-0.5 rounded-full" style={{ backgroundColor: primary }} />
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: primary }}>Expertise</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: tokens.rightText }}>Stack technique</h2>
              <p className="text-sm mt-1" style={{ color: tokens.rightMuted }}>Technologies et outils maîtrisés</p>
            </motion.div>

            <div className="space-y-6">
              {categories.map((cat, idx) => {
                const items = grouped[cat.key] || [];
                if (items.length === 0) return null;
                return (
                  <motion.div
                    key={cat.key}
                    className="group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: idx * 0.06, ...SPRING_SMOOTH }}
                  >
                    <div
                      className="p-5 sm:p-6 rounded-2xl border transition-all duration-300"
                      style={{
                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.8)',
                        borderColor: tokens.border,
                      }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                          style={{ backgroundColor: primary + '18', color: primary }}
                        >
                          {String(idx + 1).padStart(2, '0')}
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: tokens.rightText }}>{cat.title}</h3>
                        <div className="flex-1 h-px" style={{ backgroundColor: primary + '30' }} />
                      </div>
                      <motion.div
                        className="flex flex-wrap gap-3"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                      >
                        {items.map((s, j) => (
                          <motion.div
                            key={j}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-default"
                            style={{
                              backgroundColor: primary + '0A',
                              border: '1px solid ' + primary + '18',
                            }}
                            variants={staggerItem}
                            whileHover={{
                              scale: 1.03,
                              y: -2,
                              backgroundColor: primary + '12',
                              borderColor: primary + '35',
                              boxShadow: '0 8px 24px -8px ' + primary + '35',
                            }}
                            transition={SPRING_SMOOTH}
                          >
                            {getIcon(s.icon) && (
                              <span className="text-lg shrink-0" style={{ color: primary }}>
                                {getIcon(s.icon)}
                              </span>
                            )}
                            <span className="text-sm font-semibold" style={{ color: tokens.rightText }}>{s.name}</span>
                            {s.level != null && (
                              <div className="ml-1 w-12 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: primary + '20' }}>
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: primary }}
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${s.level}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.8, delay: j * 0.05 }}
                                />
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Projects */}
          <section id="projects" className="mb-24 sm:mb-32">
            <motion.div
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, x: -30, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: primary }} />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: primary }}>Réalisations</span>
            </motion.div>
            <div className="space-y-0">
              {projects.slice(0, 6).map((proj, i) => {
                const hasLink = !!(proj.demo_url?.trim?.() || proj.github_url?.trim?.());
                const num = String(i + 1).padStart(2, '0');
                const imgUrl = getImageUrl(proj.image) || proj.image;
                return (
                  <motion.div
                    key={proj.id ?? i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, ...SPRING_SMOOTH }}
                  >
                    {hasLink ? (
                      <motion.a
                        href={proj.demo_url || proj.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-4 sm:gap-6 py-6 px-4 -mx-4 rounded-xl border-b"
                        style={{ borderColor: tokens.border }}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06, ...SPRING_SMOOTH }}
                        whileHover={{ backgroundColor: primary + '08', x: 8, transition: SPRING_SMOOTH }}
                      >
                        <motion.span className="text-3xl font-bold shrink-0 tabular-nums" style={{ color: primary, opacity: 0.8 }} whileHover={{ scale: 1.1, opacity: 1 }} transition={SPRING_SMOOTH}>{num}</motion.span>
                        {imgUrl && (
                          <motion.div className="hidden sm:block w-20 h-20 shrink-0 rounded-lg overflow-hidden" whileHover={{ scale: 1.05, rotate: 1 }} transition={SPRING_SMOOTH}>
                            <img src={imgUrl} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                          </motion.div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg group-hover:text-[var(--primary)] transition-colors duration-300" style={{ color: tokens.rightText }}>{proj.title}</h3>
                          <p className="text-sm mt-0.5 line-clamp-2" style={{ color: tokens.rightMuted }}>{proj.description}</p>
                          {proj.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {proj.tags.slice(0, 3).map((tag, k) => (
                                <motion.span key={k} className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: primary + '15', color: primary }} whileHover={{ scale: 1.05 }} transition={SPRING_SMOOTH}>{tag}</motion.span>
                              ))}
                            </div>
                          )}
                        </div>
                        <motion.span className="text-sm shrink-0 opacity-0 group-hover:opacity-100" style={{ color: primary }} whileHover={{ x: 4 }} transition={SPRING_SMOOTH}>
                          <FaExternalLinkAlt />
                        </motion.span>
                      </motion.a>
                    ) : (
                      <div className="flex items-start gap-4 sm:gap-6 py-6 px-4 -mx-4 rounded-xl border-b" style={{ borderColor: tokens.border }}>
                        <span className="text-3xl font-bold shrink-0 tabular-nums" style={{ color: primary, opacity: 0.8 }}>{num}</span>
                        {imgUrl && (
                          <div className="hidden sm:block w-20 h-20 shrink-0 rounded-lg overflow-hidden">
                            <img src={imgUrl} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-lg" style={{ color: tokens.rightText }}>{proj.title}</h3>
                          <p className="text-sm mt-0.5 line-clamp-2" style={{ color: tokens.rightMuted }}>{proj.description}</p>
                          {proj.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {proj.tags.slice(0, 3).map((tag, k) => (
                                <span key={k} className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: primary + '15', color: primary }}>{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="mb-20">
            <motion.div
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, x: -30, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: primary }} />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: primary }}>Contact</span>
            </motion.div>
            <div className="grid sm:grid-cols-2 gap-12">
              {slug && (
                <motion.form
                  onSubmit={handleContactSubmit}
                  className="space-y-5 p-6 rounded-2xl"
                  style={{ backgroundColor: tokens.accentGlow, border: '1px solid ' + primary + '20' }}
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.6, ...SPRING_SMOOTH }}
                >
                  <div>
                    <label htmlFor="luxe-name" className="block text-xs font-semibold mb-2" style={{ color: tokens.rightMuted }}>Nom *</label>
                    <input
                      type="text"
                      id="luxe-name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      className="w-full px-4 py-3 text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
                      style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.8)', borderColor: tokens.border, color: tokens.rightText }}
                      disabled={contactSubmitting}
                    />
                    {contactErrors.name && <p className="mt-1.5 text-xs" style={{ color: primary }}>{contactErrors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="luxe-email" className="block text-xs font-semibold mb-2" style={{ color: tokens.rightMuted }}>Email *</label>
                    <input
                      type="email"
                      id="luxe-email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      className="w-full px-4 py-3 text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
                      style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.8)', borderColor: tokens.border, color: tokens.rightText }}
                      disabled={contactSubmitting}
                    />
                    {contactErrors.email && <p className="mt-1.5 text-xs" style={{ color: primary }}>{contactErrors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="luxe-message" className="block text-xs font-semibold mb-2" style={{ color: tokens.rightMuted }}>Message *</label>
                    <textarea
                      id="luxe-message"
                      name="message"
                      value={contactForm.message}
                      onChange={handleContactChange}
                      rows={4}
                      className="w-full px-4 py-3 text-sm rounded-xl border resize-none transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
                      style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.8)', borderColor: tokens.border, color: tokens.rightText }}
                      disabled={contactSubmitting}
                    />
                    {contactErrors.message && <p className="mt-1.5 text-xs" style={{ color: primary }}>{contactErrors.message}</p>}
                  </div>
                  {contactSubmitError && <p className="text-sm font-medium py-2 px-3 rounded-lg" style={{ color: primary, backgroundColor: primary + '15', border: '1px solid ' + primary + '30' }}>{contactSubmitError}</p>}
                  {contactSuccess && <p className="text-sm font-medium" style={{ color: primary }}>✓ {contactSuccess}</p>}
                  <motion.button
                    type="submit"
                    disabled={contactSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl text-white transition-all disabled:opacity-70"
                    style={{ background: 'linear-gradient(135deg, ' + primary + ', ' + accent + ')', boxShadow: '0 4px 20px -4px ' + primary + '50' }}
                    whileHover={!contactSubmitting ? { boxShadow: '0 8px 28px -6px ' + primary + '60' } : {}}
                    whileTap={!contactSubmitting ? { scale: 0.98 } : {}}
                  >
                    <FaPaperPlane className="text-xs" />
                    {contactSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                  </motion.button>
                </motion.form>
              )}
              <motion.div
                className="space-y-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {contact_info.email && (
                  <motion.a
                    href={'mailto:' + contact_info.email}
                    className="flex items-center gap-4 p-4 rounded-xl"
                    style={{ backgroundColor: tokens.accentGlow, border: '1px solid ' + primary + '15' }}
                    whileHover={{ x: 8, backgroundColor: primary + '12', transition: SPRING_SMOOTH }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: primary + '20', color: primary }} whileHover={{ scale: 1.1, rotate: 5 }} transition={SPRING_SMOOTH}><FaEnvelope /></motion.div>
                    <span className="text-sm font-medium" style={{ color: tokens.rightText }}>{contact_info.email}</span>
                  </motion.a>
                )}
                {contact_info.phone && (
                  <motion.a
                    href={'tel:' + String(contact_info.phone).replace(/\s/g, '')}
                    className="flex items-center gap-4 p-4 rounded-xl"
                    style={{ backgroundColor: tokens.accentGlow, border: '1px solid ' + primary + '15' }}
                    whileHover={{ x: 8, backgroundColor: primary + '12', transition: SPRING_SMOOTH }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: primary + '20', color: primary }} whileHover={{ scale: 1.1, rotate: 5 }} transition={SPRING_SMOOTH}><FaPhone /></motion.div>
                    <span className="text-sm font-medium" style={{ color: tokens.rightText }}>{contact_info.phone}</span>
                  </motion.a>
                )}
                {contact_info.location && (
                  <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: tokens.accentGlow, border: '1px solid ' + primary + '15' }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: primary + '20', color: primary }}><FaMapMarkerAlt /></div>
                    <span className="text-sm font-medium" style={{ color: tokens.rightText }}>{contact_info.location}</span>
                  </div>
                )}
              </motion.div>
            </div>
          </section>

          {/* Footer */}
          <motion.footer
            className="pt-12 border-t"
            style={{ borderColor: tokens.border }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/" className="block">
              <motion.div
                className="inline-flex items-center gap-3 p-4 -mx-4 rounded-xl"
                style={{ color: tokens.rightMuted }}
                whileHover={{ backgroundColor: tokens.accentGlow, x: 4 }}
                transition={SPRING_SMOOTH}
              >
                <motion.img src={getPublicImageUrl('images/INNOSOFT CREATION.png')} alt="Innosoft" className="h-7 w-auto opacity-80" whileHover={{ scale: 1.05, opacity: 1 }} transition={SPRING_SMOOTH} />
                <span className="text-sm">Créé avec <span className="font-semibold" style={{ color: primary }}>Innosoft Portfolio</span></span>
              </motion.div>
            </Link>
            <p className="text-xs mt-4" style={{ color: tokens.rightMuted }}>© {new Date().getFullYear()} {display_name} — Tous droits réservés</p>
          </motion.footer>
        </div>
      </main>

      <AnimatePresence>
        {showBackToTop && (
          <motion.a
            href="#about"
            onClick={(e) => scrollTo(e, '#about')}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-xl"
            style={{ background: 'linear-gradient(135deg, ' + primary + ', ' + accent + ')', color: '#fff', boxShadow: '0 8px 24px -6px ' + primary + '60' }}
            initial={{ opacity: 0, y: 24, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.8 }}
            transition={SPRING_BOUNCY}
            whileHover={{
              scale: 1.1,
              boxShadow: '0 16px 40px -8px ' + primary + '80',
              y: -2,
              transition: SPRING_SMOOTH,
            }}
            whileTap={{ scale: 0.9 }}
            aria-label="Retour en haut"
          >
            <FaArrowUp className="text-sm" />
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PortfolioLuxe;
