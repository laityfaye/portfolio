import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaCreditCard, FaBriefcase, FaMoneyBillWave, FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import { adminDashboardApi, adminPaymentsApi } from '../../api/admin';
import { useTheme } from '../../context/ThemeContext';
import { getImageUrl } from '../../utils/imageUtils';
import toast from 'react-hot-toast';

const StatCard = ({ icon, title, value, subtitle, color }) => {
  const { theme, isDarkMode } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-effect-strong rounded-xl p-6 border ${
        isDarkMode ? 'border-gray-800' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
          <p className={`text-3xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{value}</p>
          {subtitle && <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br ${theme.gradient} shadow-lg shadow-red-500/30`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

const AdminDashboard = () => {
  const { theme, isDarkMode } = useTheme();
  const [stats, setStats] = useState(null);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, paymentsRes, usersRes] = await Promise.all([
        adminDashboardApi.getStats(),
        adminDashboardApi.getPendingPayments(),
        adminDashboardApi.getRecentUsers(),
      ]);
      setStats(statsRes.data);
      setPendingPayments(paymentsRes.data.payments || []);
      setRecentUsers(usersRes.data.users || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des donnees');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayment = async (paymentId) => {
    try {
      await adminPaymentsApi.approve(paymentId);
      toast.success('Paiement approuve');
      fetchData();
    } catch (error) {
      toast.error('Erreur lors de l\'approbation');
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${isDarkMode ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Dashboard</h1>
        <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Vue d'ensemble de la plateforme</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={<FaUsers className="text-xl text-white" />}
          title="Total Utilisateurs"
          value={stats?.users?.total || 0}
          subtitle={`${stats?.users?.active || 0} actifs`}
        />
        <StatCard
          icon={<FaClock className="text-xl text-white" />}
          title="Paiements en attente"
          value={stats?.payments?.pending || 0}
          subtitle="A verifier"
        />
        <StatCard
          icon={<FaBriefcase className="text-xl text-white" />}
          title="Portfolios Publies"
          value={stats?.portfolios?.published || 0}
          subtitle={`${stats?.portfolios?.total || 0} au total`}
        />
        <StatCard
          icon={<FaMoneyBillWave className="text-xl text-white" />}
          title="Revenus"
          value={`${(stats?.payments?.total_amount || 0).toLocaleString()} FCFA`}
          subtitle={`${stats?.payments?.approved || 0} paiements`}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Pending Payments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`glass-effect-strong rounded-xl border overflow-hidden ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}
        >
          <div className={`p-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Paiements en attente</h2>
          </div>
          <div className={`divide-y ${isDarkMode ? 'divide-gray-800' : 'divide-gray-100'}`}>
            {pendingPayments.length === 0 ? (
              <div className={`p-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <FaCheck className="text-4xl mx-auto mb-2 text-green-500" />
                <p>Aucun paiement en attente</p>
              </div>
            ) : (
              pendingPayments.slice(0, 5).map((payment) => (
                <div key={payment.id} className={`p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${isDarkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'} transition-colors`}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {payment.proof_image && (
                      <img
                        src={getImageUrl(payment.proof_image)}
                        alt="Preuve"
                        className="w-10 h-10 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className={`font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {payment.user?.first_name} {payment.user?.last_name}
                      </p>
                      <p className={`text-xs sm:text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{payment.user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`font-medium ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>
                      {payment.amount?.toLocaleString()} {payment.currency}
                    </span>
                    <button
                      onClick={() => handleApprovePayment(payment.id)}
                      className="p-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition-colors"
                    >
                      <FaCheck />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`glass-effect-strong rounded-xl border overflow-hidden ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}
        >
          <div className={`p-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Utilisateurs recents</h2>
          </div>
          <div className={`divide-y ${isDarkMode ? 'divide-gray-800' : 'divide-gray-100'}`}>
            {recentUsers.length === 0 ? (
              <div className={`p-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <FaUsers className="text-4xl mx-auto mb-2" />
                <p>Aucun utilisateur</p>
              </div>
            ) : (
              recentUsers.slice(0, 5).map((user) => (
                <div key={user.id} className={`p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${isDarkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'} transition-colors`}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold bg-gradient-to-br ${theme.gradient} text-white shadow-lg shadow-red-500/30`}>
                      {user.first_name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {user.first_name} {user.last_name}
                      </p>
                      <p className={`text-xs sm:text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                    user.status === 'active' ? 'bg-green-500/20 text-green-500' :
                    user.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-red-500/20 text-red-500'
                  }`}>
                    {user.status === 'active' ? 'Actif' :
                     user.status === 'pending' ? 'En attente' : 'Suspendu'}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
