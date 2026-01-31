import { motion } from 'framer-motion';
import { FaRocket, FaEye, FaEdit, FaClock, FaCheck, FaExclamationTriangle, FaLink, FaShareAlt, FaCreditCard } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { portfolioApi } from '../../api/portfolio';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const DashboardHome = ({ portfolio, user, onRefresh }) => {
  const { isDarkMode } = useTheme();
  const { isActive, isPending, hasPaid } = useAuth();
  const navigate = useNavigate();
  
  // Thème rouge fixe pour le dashboard
  const dashboardTheme = {
    gradient: 'from-red-500 to-red-600',
    primary: {
      main: '#ef4444',
      dark: '#dc2626',
      light: '#f87171'
    }
  };

  const handlePublish = async () => {
    if (!hasPaid) {
      toast.error('Vous devez effectuer un paiement pour publier votre portfolio');
      navigate('/dashboard/payment');
      return;
    }

    try {
      await portfolioApi.publish();
      toast.success('Portfolio publie avec succes!');
      onRefresh();
    } catch (error) {
      if (error.response?.data?.requires_payment) {
        toast.error('Vous devez effectuer un paiement pour publier votre portfolio');
        navigate('/dashboard/payment');
      } else {
        toast.error(error.response?.data?.message || 'Erreur lors de la publication');
      }
    }
  };

  const handleCopyUrl = () => {
    const url = `${window.location.origin}/p/${user?.slug}`;
    navigator.clipboard.writeText(url);
    toast.success('URL copiee dans le presse-papiers!');
  };

  const stats = [
    {
      label: 'Paiement',
      value: hasPaid ? 'Validé' : 'En attente',
      icon: hasPaid ? <FaCheck /> : <FaCreditCard />,
      color: hasPaid ? 'text-green-500' : 'text-yellow-500',
      bgColor: hasPaid ? 'bg-green-500/10 border-green-500/20' : 'bg-yellow-500/10 border-yellow-500/20',
    },
    {
      label: 'Statut portfolio',
      value: portfolio?.status === 'published' ? 'Publié' : 'Brouillon',
      icon: portfolio?.status === 'published' ? <FaEye /> : <FaEdit />,
      color: portfolio?.status === 'published' ? 'text-green-500' : 'text-blue-500',
      bgColor: portfolio?.status === 'published' ? 'bg-green-500/10 border-green-500/20' : 'bg-blue-500/10 border-blue-500/20',
    },
    {
      label: 'Projets',
      value: portfolio?.projects?.length || 0,
      icon: <FaRocket />,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10 border-red-500/20',
    },
    {
      label: 'Competences',
      value: portfolio?.skills?.length || 0,
      icon: <FaEdit />,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r ${dashboardTheme.gradient} bg-clip-text text-transparent`}>
          Bienvenue, {user?.first_name}! 👋
        </h1>
        <p className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Gérez votre portfolio depuis ce tableau de bord
        </p>
      </motion.div>

      {/* Warning if pending */}
      {isPending && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`glass-effect-strong p-4 sm:p-5 rounded-xl border ${
            isDarkMode ? 'border-yellow-500/20 bg-yellow-500/5' : 'border-yellow-200 bg-yellow-50'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
            <div className={`p-2.5 sm:p-3 rounded-lg w-fit ${isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'}`}>
              <FaExclamationTriangle className="text-yellow-500 text-lg sm:text-xl" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-base sm:text-lg mb-1 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-800'}`}>
                Compte en attente de validation
              </p>
              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-yellow-400/80' : 'text-yellow-700'}`}>
                Envoyez <strong>2 500 FCFA</strong> par <strong>Orange Money</strong> ou <strong>Wave</strong> au{' '}
                <a
                  href="tel:780186229"
                  className={`font-bold hover:underline ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}
                >
                  78 018 62 29
                </a>
                {' '}pour activer votre compte.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass-effect-strong rounded-xl p-6 border transition-all hover:scale-105 ${
              isDarkMode ? 'border-gray-800' : 'border-gray-200'
            } ${stat.bgColor}`}
          >
            <div className={`text-3xl mb-3 ${stat.color}`}>{stat.icon}</div>
            <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {stat.label}
            </p>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`glass-effect-strong rounded-xl p-6 border ${
          isDarkMode ? 'border-gray-800' : 'border-gray-200'
        }`}
      >
        <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Actions rapides
        </h2>
        <div className="flex flex-wrap gap-4">
          {portfolio?.status !== 'published' && hasPaid && (
            <motion.button
              onClick={handlePublish}
              className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r ${dashboardTheme.gradient} text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm sm:text-base`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaRocket />
              Publier mon portfolio
            </motion.button>
          )}
          {portfolio?.status !== 'published' && !hasPaid && (
            <Link
              to="/dashboard/payment"
              className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm sm:text-base`}
            >
              <FaCreditCard />
              Payer pour publier
            </Link>
          )}
          {portfolio?.status === 'published' && (
            <motion.a
              href={`/p/${user?.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-red-500 text-red-500 font-semibold rounded-xl hover:bg-red-500/10 transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
                isDarkMode ? 'border-red-500 text-red-400 hover:bg-red-500/20' : 'border-red-500 text-red-500 hover:bg-red-50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaEye />
              Voir mon portfolio
            </motion.a>
          )}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/dashboard/hero" 
              className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
                isDarkMode 
                  ? 'border-gray-700 text-gray-300 hover:bg-gray-800/50' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaEdit />
              Modifier le Hero
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Portfolio URL */}
      {portfolio?.status === 'published' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`glass-effect-strong rounded-xl p-6 border ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Votre URL publique
            </h2>
            <button
              onClick={handleCopyUrl}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
              }`}
              title="Copier l'URL"
            >
              <FaLink />
            </button>
          </div>
          <div className={`p-4 rounded-lg border ${
            isDarkMode 
              ? 'bg-gray-900/50 border-gray-800' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <code className={`text-sm sm:text-base md:text-lg font-mono break-all ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              {window.location.origin}/p/{user?.slug}
            </code>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <FaShareAlt className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Partagez ce lien pour montrer votre portfolio au monde!
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardHome;
