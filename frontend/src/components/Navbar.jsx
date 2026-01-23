import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaBars, FaTimes } from 'react-icons/fa';
import ThemeSelector from './ThemeSelector';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, isDarkMode } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Accueil', href: '#home' },
    { name: 'À propos', href: '#about' },
    { name: 'Compétences', href: '#skills' },
    { name: 'Projets', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  const socialLinks = [
    { icon: <FaGithub />, href: 'https://github.com', label: 'GitHub' },
    { icon: <FaLinkedin />, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: <FaTwitter />, href: 'https://twitter.com', label: 'Twitter' },
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <motion.nav
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
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <motion.a
            href="#home"
            onClick={(e) => scrollToSection(e, '#home')}
            className={`text-2xl sm:text-3xl font-bold cursor-pointer bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}
            style={{ textShadow: `0 0 20px ${theme.glow}` }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {'<InnoSoft />'}
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
            {socialLinks.map((social, index) => (
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
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
            >
              <ThemeSelector />
            </motion.div>
          </div>

          {/* Mobile Menu Button & Theme Selector */}
          <div className="md:hidden flex items-center space-x-3">
            <ThemeSelector />
            <motion.button
              className={`text-2xl transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              style={{ '--hover-color': theme.primary.main }}
              onMouseEnter={(e) => e.currentTarget.style.color = theme.primary.main}
              onMouseLeave={(e) => e.currentTarget.style.color = isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)'}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          height: isMobileMenuOpen ? 'auto' : 0,
          opacity: isMobileMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden glass-effect"
      >
        <div className="container-custom py-4 space-y-4">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className={`block transition-colors duration-300 font-medium py-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              onMouseEnter={(e) => e.currentTarget.style.color = theme.primary.main}
              onMouseLeave={(e) => e.currentTarget.style.color = isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)'}
            >
              {item.name}
            </a>
          ))}
          <div className={`flex space-x-6 pt-4 border-t ${isDarkMode ? 'border-white/10' : 'border-black/10'}`}>
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors duration-300 text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                onMouseEnter={(e) => e.currentTarget.style.color = theme.primary.main}
                onMouseLeave={(e) => e.currentTarget.style.color = isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)'}
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
