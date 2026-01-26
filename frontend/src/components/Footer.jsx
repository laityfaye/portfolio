// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FaHeart, FaGithub, FaLinkedin, FaTwitter, FaArrowUp } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const Footer = ({ data = {} }) => {
  const { theme } = useTheme();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

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
    brand_name = '<InnoSoft Creation />',
    display_name = 'Votre Nom',
    job_title = 'Ingenieur logiciel passionne par la creation d\'experiences web exceptionnelles.',
    contact_info: rawContactInfo,
    social_links: rawSocialLinks
  } = data;

  const contact_info = parseObjectIfNeeded(rawContactInfo, { email: 'votre.email@example.com', phone: '+33 6 12 34 56 78', location: 'Paris, France' });
  const social_links = parseObjectIfNeeded(rawSocialLinks, { github: '', linkedin: '', twitter: '' });

  const quickLinks = [
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

  return (
    <footer className="bg-dark-900 border-t border-white/10 relative">
      <div className="container-custom py-8 sm:py-12 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Column 1 - Brand */}
          <div className="text-center md:text-left">
            <motion.h3
              className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}
              whileHover={{ scale: 1.05 }}
            >
              {brand_name}
            </motion.h3>
            <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
              {job_title}
            </p>
            {socialLinksList.length > 0 && (
              <div className="flex gap-4 justify-center md:justify-start">
                {socialLinksList.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 transition-colors text-lg sm:text-xl"
                    style={{ '--hover-color': theme.primary.main }}
                    onMouseEnter={(e) => e.currentTarget.style.color = theme.primary.main}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}
                    whileHover={{ scale: 1.2, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            )}
          </div>

          {/* Column 2 - Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Liens rapides</h4>
            <ul className="space-y-1 sm:space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 transition-colors inline-block hover:translate-x-1 duration-300 text-sm sm:text-base"
                    onMouseEnter={(e) => e.currentTarget.style.color = theme.primary.main}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Contact */}
          <div className="text-center md:text-left">
            <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Contact</h4>
            <ul className="space-y-1 sm:space-y-2 text-gray-400 text-sm sm:text-base">
              {contact_info.email && (
                <li>
                  <a
                    href={`mailto:${contact_info.email}`}
                    className="transition-colors"
                    onMouseEnter={(e) => e.currentTarget.style.color = theme.primary.main}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}
                  >
                    {contact_info.email}
                  </a>
                </li>
              )}
              {contact_info.phone && (
                <li>
                  <a
                    href={`tel:${contact_info.phone.replace(/\s/g, '')}`}
                    className="transition-colors"
                    onMouseEnter={(e) => e.currentTarget.style.color = theme.primary.main}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}
                  >
                    {contact_info.phone}
                  </a>
                </li>
              )}
              {contact_info.location && (
                <li className="text-gray-500">{contact_info.location}</li>
              )}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4 sm:mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
          <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
            © {currentYear} Portfolio. Cree avec{' '}
            <span className="inline-flex items-baseline">
              <FaHeart className="text-red-500 mx-1 inline animate-pulse" />
            </span>
            par {display_name}
          </p>
          <p className="text-gray-500 text-xs sm:text-sm">
            Propulse par React & Tailwind CSS
          </p>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 glass-effect p-3 sm:p-4 rounded-full transition-all duration-300 shadow-lg z-40"
        style={{
          color: theme.primary.main,
          boxShadow: `0 0 20px ${theme.shadow}`
        }}
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        aria-label="Retour en haut"
      >
        <FaArrowUp className="text-lg sm:text-xl" />
      </motion.button>
    </footer>
  );
};

export default Footer;
