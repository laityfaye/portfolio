import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { getPublicImageUrl } from '../utils/imageUtils';

const SECTION_IDS = ['home', 'about', 'skills', 'projects', 'contact'];
const navItems = SECTION_IDS.map((id) => ({
  name: id === 'home' ? 'Accueil' : id === 'about' ? 'À propos' : id === 'skills' ? 'Expertise' : id === 'projects' ? 'Réalisations' : 'Contact',
  href: `#${id}`,
  id,
}));

const Footer = ({ data = {} }) => {
  const { theme, isDarkMode } = useTheme();
  const display_name = data?.display_name ?? 'Votre Nom';

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

  return (
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
                    src={getPublicImageUrl('images/INNOSOFT CREATION.png')}
                    alt="Innosoft Portfolio"
                    decoding="async"
                    loading="lazy"
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
                {display_name}
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
  );
};

export default Footer;
