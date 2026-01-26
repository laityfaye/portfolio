import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import ThemeApplier from '../components/ThemeApplier';

const NotFound = () => {
  const { theme, isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${isDarkMode ? 'bg-dark-900' : 'bg-slate-50'}`}>
      <ThemeApplier />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className={`text-9xl font-black bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
          404
        </h1>
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Page non trouvee
        </h2>
        <p className={`mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          La page que vous cherchez n'existe pas ou a ete deplacee.
        </p>
        <Link to="/" className="btn-primary">
          Retour a l'accueil
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
