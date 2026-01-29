import { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaBars, FaTimes } from 'react-icons/fa';
import ThemeSelector from './ThemeSelector';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ data = {}, hideThemeSelector = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, isDarkMode } = useTheme();
  const navRef = useRef(null);

  // Safe parsing for objects - handle JSON strings or null
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

  // Extraire les donnees du portfolio
  const {
    display_name,
    full_name,
    name,
    brand_name = '<Portfolio />',
    social_links: rawSocialLinks
  } = data;

  const getFirstName = (value) => {
    if (!value || typeof value !== 'string') return '';
    // collapse whitespace then take first token
    const cleaned = value.trim().replace(/\s+/g, ' ');
    return cleaned.split(' ')[0] || '';
  };

  // Nom du proprietaire a afficher dans le navbar (prenom uniquement)
  const ownerNameRaw = display_name || full_name || name || '';
  const ownerFirstName = getFirstName(ownerNameRaw);
  const ownerName = ownerFirstName || brand_name;

  const social_links = parseObjectIfNeeded(rawSocialLinks, { github: '', linkedin: '', twitter: '' });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Empêcher le scroll de la page quand le menu mobile est ouvert
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { name: 'Accueil', href: '#home' },
    { name: 'A propos', href: '#about' },
    { name: 'Competences', href: '#skills' },
    { name: 'Projets', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  // Construire les liens sociaux dynamiquement
  const socialLinksList = [
    social_links.github && { icon: <FaGithub />, href: social_links.github, label: 'GitHub' },
    social_links.linkedin && { icon: <FaLinkedin />, href: social_links.linkedin, label: 'LinkedIn' },
    social_links.twitter && { icon: <FaTwitter />, href: social_links.twitter, label: 'Twitter' },
  ].filter(Boolean);

  const getNavHeight = () => {
    // Hauteur réelle (peut varier selon breakpoint / contenu)
    const navEl = navRef.current;
    const height = navEl?.getBoundingClientRect?.().height;
    return typeof height === 'number' && height > 0 ? height : 80; // fallback
  };

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const navHeight = getNavHeight();
      const extraOffset = 8; // petit spacing pour respirer
      const targetTop = element.getBoundingClientRect().top + window.scrollY - navHeight - extraOffset;
      window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        ref={navRef}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? `glass-effect shadow-lg ${isDarkMode ? 'shadow-primary-500/10' : 'shadow-black/5'}`
            : 'bg-transparent'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between gap-2 h-16 sm:h-20">
            {/* Logo */}
            <motion.a
              href="#home"
              onClick={(e) => scrollToSection(e, '#home')}
              className={`flex-1 min-w-0 pr-1 text-xl sm:text-3xl font-bold cursor-pointer bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent truncate sm:flex-none sm:max-w-[60vw]`}
              style={{ textShadow: `0 0 20px ${theme.glow}` }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Aller à l'accueil"
            >
              {ownerName}
            </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className={`transition-colors duration-300 font-medium relative group ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                onMouseEnter={(e) => e.currentTarget.style.color = theme.primary.main}
                onMouseLeave={(e) => e.currentTarget.style.color = isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)'}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.name}
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r ${theme.gradient} group-hover:w-full transition-all duration-300`}
                ></span>
              </motion.a>
            ))}
          </div>

          {/* Social Links & Theme Selector - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {socialLinksList.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors duration-300 text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                onMouseEnter={(e) => e.currentTarget.style.color = theme.primary.main}
                onMouseLeave={(e) => e.currentTarget.style.color = isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)'}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                aria-label={social.label}
              >
                {social.icon}
              </motion.a>
            ))}
            {!hideThemeSelector && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <ThemeSelector />
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Button & Theme Selector */}
          <div className="md:hidden flex items-center space-x-2 flex-shrink-0">
            {!hideThemeSelector && <ThemeSelector />}
            <motion.button
              className={`text-2xl transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} p-2 rounded-lg`}
              style={{ '--hover-color': theme.primary.main }}
              onMouseEnter={(e) => e.currentTarget.style.color = theme.primary.main}
              onMouseLeave={(e) => e.currentTarget.style.color = isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)'}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </motion.button>
          </div>
        </div>
      </div>
      </motion.nav>

      {/* Backdrop mobile (ferme le menu au clic) */}
      {isMobileMenuOpen && (
        <button
          type="button"
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
          aria-label="Fermer le menu"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <motion.div
        id="mobile-menu"
        initial={false}
        animate={{
          height: isMobileMenuOpen ? 'auto' : 0,
          opacity: isMobileMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.25 }}
        className={`md:hidden fixed top-16 sm:top-20 left-0 right-0 z-50 overflow-hidden ${
          isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <div className="glass-effect border-t border-white/10">
          <div className="container-custom py-4 space-y-3 max-h-[70vh] overflow-auto">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className={`block transition-colors duration-300 font-medium py-3 text-lg rounded-lg ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}
                onMouseEnter={(e) => e.currentTarget.style.color = theme.primary.main}
                onMouseLeave={(e) => e.currentTarget.style.color = isDarkMode ? 'rgb(229, 231, 235)' : 'rgb(55, 65, 81)'}
              >
                {item.name}
              </a>
            ))}
            {socialLinksList.length > 0 && (
              <div className={`flex space-x-6 pt-4 border-t ${isDarkMode ? 'border-white/10' : 'border-black/10'}`}>
                {socialLinksList.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`transition-colors duration-300 text-2xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    onMouseEnter={(e) => e.currentTarget.style.color = theme.primary.main}
                    onMouseLeave={(e) => e.currentTarget.style.color = isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)'}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Navbar;
