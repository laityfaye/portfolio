import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTimesCircle, FaArrowLeft } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const PaymentCancel = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] px-4"
    >
      <div className={`max-w-md w-full p-8 rounded-2xl border-2 ${
        isDarkMode ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex flex-col items-center text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
            isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'
          }`}>
            <FaTimesCircle className="text-5xl text-yellow-500" />
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Paiement annulé
          </h1>
          <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Vous avez annulé le paiement. Aucun montant n'a été débité.
            Vous pouvez réessayer à tout moment.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link
              to="/dashboard/payment"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all"
            >
              <FaArrowLeft />
              <span>Réessayer le paiement</span>
            </Link>
            <button
              onClick={() => navigate('/dashboard')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                isDarkMode
                  ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Tableau de bord
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentCancel;
