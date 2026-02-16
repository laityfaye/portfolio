import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaRocket, FaEye, FaEdit, FaClock, FaCheck, FaLink, FaShareAlt, FaCreditCard, FaCalendarAlt } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { portfolioApi } from '../../api/portfolio';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const formatExpiresAt = (expiresAt) => {
  if (!expiresAt) return null;
  const d = new Date(expiresAt);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const isExpiringSoon = (expiresAt, days = 30) => {
  if (!expiresAt) return false;
  const d = new Date(expiresAt);
  const now = new Date();
  const diff = (d - now) / (1000 * 60 * 60 * 24);
  return diff > 0 && diff <= days;
};

const DashboardHome = ({ portfolio, user, onRefresh }) => {
  const { isDarkMode } = useTheme();
  const { isActive, isPending, hasPaid } = useAuth();
  const navigate = useNavigate();
  const isOnline = portfolio?.is_online;
  const expiresAt = portfolio?.expires_at;
  const expired = portfolio?.status === 'published' && !isOnline && expiresAt;
  const expiringSoon = isOnline && isExpiringSoon(expiresAt);
  
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
      label: 'Portfolio',
      value: isOnline ? 'En ligne' : portfolio?.status === 'published' ? 'Expiré' : 'Brouillon',
      subtitle: isOnline && expiresAt ? `Jusqu'au ${formatExpiresAt(expiresAt)}` : null,
      icon: isOnline ? <FaEye /> : portfolio?.status === 'published' ? <FaCalendarAlt /> : <FaEdit />,
      color: isOnline ? 'text-green-500' : portfolio?.status === 'published' ? 'text-orange-500' : 'text-blue-500',
      bgColor: isOnline ? 'bg-green-500/10 border-green-500/20' : portfolio?.status === 'published' ? 'bg-orange-500/10 border-orange-500/20' : 'bg-blue-500/10 border-blue-500/20',
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

      {/* Alerte portfolio expiré */}
      {expired && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`glass-effect-strong p-4 sm:p-5 rounded-xl border ${
            isDarkMode ? 'border-orange-500/30 bg-orange-500/10' : 'border-orange-200 bg-orange-50'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
            <div className={`p-2.5 sm:p-3 rounded-lg w-fit ${isDarkMode ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
              <FaCalendarAlt className="text-orange-500 text-lg sm:text-xl" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-base sm:text-lg mb-1 ${isDarkMode ? 'text-orange-400' : 'text-orange-800'}`}>
                Votre portfolio n'est plus en ligne
              </p>
              <p className={`text-xs sm:text-sm mb-3 ${isDarkMode ? 'text-orange-400/80' : 'text-orange-700'}`}>
                Votre abonnement d'un an est terminé. Renouvelez votre paiement pour remettre votre portfolio en ligne.
              </p>
              <Link
                to="/dashboard/payment"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm ${
                  isDarkMode ? 'bg-orange-500/20 text-orange-300 hover:bg-orange-500/30' : 'bg-orange-200 text-orange-800 hover:bg-orange-300'
                }`}
              >
                <FaCreditCard />
                Renouveler l'abonnement
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Alerte expiration proche */}
      {expiringSoon && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`glass-effect-strong p-4 sm:p-5 rounded-xl border ${
            isDarkMode ? 'border-yellow-500/20 bg-yellow-500/5' : 'border-yellow-200 bg-yellow-50'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
            <div className={`p-2.5 sm:p-3 rounded-lg w-fit ${isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'}`}>
              <FaClock className="text-yellow-500 text-lg sm:text-xl" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-base sm:text-lg mb-1 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-800'}`}>
                Abonnement bientôt expiré
              </p>
              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-yellow-400/80' : 'text-yellow-700'}`}>
                Votre portfolio restera en ligne jusqu'au <strong>{formatExpiresAt(expiresAt)}</strong>. Pensez à renouveler pour éviter une interruption.
              </p>
              <Link
                to="/dashboard/payment"
                className={`inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg font-semibold text-sm ${
                  isDarkMode ? 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30' : 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300'
                }`}
              >
                <FaCreditCard />
                Renouveler
              </Link>
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
            {stat.subtitle && (
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {stat.subtitle}
              </p>
            )}
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
        <h2 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Actions rapides
        </h2>
        <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Configurez votre portfolio en plusieurs étapes : Hero (présentation), À propos, Compétences, Projets, Contact et Thème. Chaque section se personnalise depuis le menu latéral.
        </p>
        <div className="flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4">
          {portfolio?.status !== 'published' && hasPaid && (
            <motion.button
              onClick={handlePublish}
              className={`w-full xs:flex-1 sm:flex-initial min-h-[44px] px-4 sm:px-6 py-3 sm:py-2.5 bg-gradient-to-r ${dashboardTheme.gradient} text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 text-xs xs:text-sm sm:text-base`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaRocket className="flex-shrink-0" />
              <span className="truncate">Publier mon portfolio</span>
            </motion.button>
          )}
          {isOnline && (
            <motion.a
              href={`/p/${user?.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full xs:flex-1 sm:flex-initial min-h-[44px] px-4 sm:px-6 py-3 sm:py-2.5 border-2 border-red-500 text-red-500 font-semibold rounded-xl hover:bg-red-500/10 transition-all flex items-center justify-center gap-2 text-xs xs:text-sm sm:text-base ${
                isDarkMode ? 'border-red-500 text-red-400 hover:bg-red-500/20' : 'border-red-500 text-red-500 hover:bg-red-50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaEye className="flex-shrink-0" />
              <span className="truncate">Voir mon portfolio</span>
            </motion.a>
          )}
          <motion.div
            className="w-full xs:flex-1 sm:flex-initial min-w-0"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link 
              to="/dashboard/hero" 
              className={`w-full min-h-[44px] px-4 sm:px-6 py-3 sm:py-2.5 border-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-xs xs:text-sm sm:text-base text-center ${
                isDarkMode 
                  ? 'border-gray-700 text-gray-300 hover:bg-gray-800/50' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaEdit className="flex-shrink-0" />
              <span className="min-w-0 break-words">Commencer à personnaliser</span>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Portfolio URL */}
      {isOnline && (
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
