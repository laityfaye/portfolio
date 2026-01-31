import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUpload, FaCheck, FaClock, FaTimes, FaInfoCircle, FaCreditCard, FaImage, FaEye, FaSpinner, FaExclamationTriangle, FaMobileAlt } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { paymentsApi } from '../../api/payments';
import { getImageUrl, getPublicImageUrl } from '../../utils/imageUtils';
import toast from 'react-hot-toast';

const PaymentStatus = ({ user }) => {
  const { isDarkMode } = useTheme();
  const { isActive, isPending } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [payTechLoading, setPayTechLoading] = useState(false);
  
  // Thème rouge fixe pour le dashboard
  const dashboardTheme = {
    gradient: 'from-red-500 to-red-600',
    primary: {
      main: '#ef4444',
      dark: '#dc2626',
      light: '#f87171'
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await paymentsApi.getAll();
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation
    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image doit faire moins de 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    // Aperçu
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image doit faire moins de 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePayTech = async () => {
    setPayTechLoading(true);
    try {
      const response = await paymentsApi.requestPayTech();
      if (response?.redirect_url) {
        // Stocker ref_command pour le polling sur la page success
        if (response.ref_command) {
          sessionStorage.setItem('paytech_ref_command', response.ref_command);
        }
        window.location.href = response.redirect_url;
      } else {
        toast.error(response?.message || 'Erreur lors de la création du paiement');
      }
    } catch (error) {
      const data = error.response?.data;
      const msg = data?.message
        || (typeof data?.errors === 'object' ? Object.values(data.errors).flat().join(' ') : null)
        || 'Erreur lors de l\'initialisation du paiement. Vérifiez la configuration ou réessayez.';
      toast.error(msg);
    } finally {
      setPayTechLoading(false);
    }
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    try {
      await paymentsApi.uploadProof(selectedFile);
      toast.success('Preuve de paiement envoyée avec succès!');
      setImagePreview(null);
      setSelectedFile(null);
      fetchPayments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi');
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-2 ${
            isDarkMode
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-green-50 text-green-600 border border-green-200'
          }`}>
            <FaCheck className="text-xs sm:text-sm" />
            <span>Approuvé</span>
          </span>
        );
      case 'pending':
        return (
          <span className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-2 ${
            isDarkMode
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              : 'bg-yellow-50 text-yellow-600 border border-yellow-200'
          }`}>
            <FaClock className="text-xs sm:text-sm" />
            <span>En attente</span>
          </span>
        );
      case 'rejected':
        return (
          <span className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-2 ${
            isDarkMode
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            <FaTimes className="text-xs sm:text-sm" />
            <span>Rejeté</span>
          </span>
        );
      default:
        return null;
    }
  };

  const hasPendingOrApproved = payments.some((p) => p.status === 'pending' || p.status === 'approved');

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex-1 min-w-0">
          <h1 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r ${dashboardTheme.gradient} bg-clip-text text-transparent`}>
            Paiement
          </h1>
          <p className={`text-xs sm:text-sm md:text-base lg:text-lg mt-1 sm:mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Gérez votre paiement et statut de compte
          </p>
        </div>
      </motion.div>

      {/* Account Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass-effect-strong rounded-xl p-4 sm:p-5 md:p-6 border ${
          isDarkMode ? 'border-gray-800' : 'border-gray-200'
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${dashboardTheme.gradient} flex-shrink-0`}>
            <FaCreditCard className="text-white text-lg sm:text-xl" />
          </div>
          <h2 className={`text-lg sm:text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Statut du compte
          </h2>
        </div>
        
        <div className={`p-4 sm:p-5 md:p-6 rounded-xl border-2 ${
          isActive
            ? isDarkMode
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-green-50 border-green-200'
            : isDarkMode
              ? 'bg-yellow-500/10 border-yellow-500/30'
              : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
              isActive
                ? isDarkMode ? 'bg-green-500/20' : 'bg-green-100'
                : isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'
            }`}>
              {isActive ? (
                <FaCheck className={`text-xl sm:text-2xl ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
              ) : (
                <FaClock className={`text-xl sm:text-2xl ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-base sm:text-lg md:text-xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {isActive ? 'Compte Actif' : 'Compte en attente de validation'}
              </p>
              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {isActive
                  ? 'Votre compte est actif. Vous pouvez publier votre portfolio.'
                  : 'Envoyez votre preuve de paiement pour activer votre compte et publier votre portfolio.'}
              </p>
            </div>
            {isActive && (
              <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm flex-shrink-0 ${
                isDarkMode
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-green-100 text-green-700 border border-green-200'
              }`}>
                Actif
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Payment Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-4 sm:p-5 md:p-6 rounded-xl border-2 flex flex-col sm:flex-row items-start gap-3 sm:gap-4 ${
          isDarkMode
            ? 'bg-blue-500/10 border-blue-500/30'
            : 'bg-blue-50 border-blue-200'
        }`}
      >
        <div className={`p-2 sm:p-3 rounded-xl flex-shrink-0 ${
          isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'
        }`}>
          <FaInfoCircle className={`text-lg sm:text-xl ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-base sm:text-lg font-bold mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-800'}`}>
            Montant à payer: <span className="text-xl sm:text-2xl">2 500 FCFA</span>
          </p>
          <p className={`text-xs sm:text-sm mb-3 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            Payez en ligne via Orange Money, Wave ou Free Money (PayTech) - recommandé. Ou envoyez une capture d'écran comme preuve de paiement manuel.
          </p>
          <div className={`p-2 sm:p-3 rounded-lg mt-3 ${
            isDarkMode ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-100 border border-blue-200'
          }`}>
            <p className={`text-[10px] sm:text-xs ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
              <FaExclamationTriangle className="inline mr-1" />
              Pour le paiement manuel: assurez-vous que la capture d'écran montre clairement le montant, la date et le numéro de transaction.
            </p>
          </div>
        </div>
      </motion.div>

      {/* PayTech Button - Primary payment method */}
      {!hasPendingOrApproved && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`glass-effect-strong rounded-xl p-4 sm:p-5 md:p-6 border ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-4">
            <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${dashboardTheme.gradient} flex-shrink-0`}>
              <FaMobileAlt className="text-white text-lg sm:text-xl" />
            </div>
            <h2 className={`text-lg sm:text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Paiement en ligne (PayTech)
            </h2>
          </div>
          <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Paiement sécurisé via Orange Money, Wave ou Free Money. Vous serez redirigé vers la plateforme PayTech.
          </p>
          <motion.button
            onClick={handlePayTech}
            disabled={payTechLoading}
            className={`w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r ${dashboardTheme.gradient} text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base`}
            whileHover={{ scale: payTechLoading ? 1 : 1.02 }}
            whileTap={{ scale: payTechLoading ? 1 : 0.98 }}
          >
            {payTechLoading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Redirection vers PayTech...</span>
              </>
            ) : (
              <>
                <FaMobileAlt />
                <span>Payer avec Orange Money / Wave / Free Money</span>
              </>
            )}
          </motion.button>
        </motion.div>
      )}

      {/* Upload Section */}
      {!hasPendingOrApproved && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`glass-effect-strong rounded-xl p-4 sm:p-5 md:p-6 border ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${dashboardTheme.gradient} flex-shrink-0`}>
              <FaUpload className="text-white text-lg sm:text-xl" />
            </div>
            <h2 className={`text-lg sm:text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Envoyer la preuve de paiement
            </h2>
          </div>

          {imagePreview ? (
            <div className="space-y-3 sm:space-y-4">
              <div className="relative group">
                <div className="rounded-xl overflow-hidden border-2 border-red-500/30">
                  <img
                    src={imagePreview}
                    alt="Aperçu"
                    className="w-full h-full object-cover max-h-64 sm:max-h-96"
                  />
                </div>
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setSelectedFile(null);
                  }}
                  className={`absolute top-2 right-2 p-1.5 sm:p-2 rounded-lg transition-colors ${
                    isDarkMode
                      ? 'bg-red-500/90 text-white hover:bg-red-600'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  <FaTimes className="text-sm sm:text-base" />
                </button>
              </div>
              <motion.button
                onClick={handleConfirmUpload}
                disabled={uploading}
                className={`w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r ${dashboardTheme.gradient} text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base`}
                whileHover={{ scale: uploading ? 1 : 1.02 }}
                whileTap={{ scale: uploading ? 1 : 0.98 }}
              >
                {uploading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <FaUpload />
                    <span>Confirmer l'envoi</span>
                  </>
                )}
              </motion.button>
            </div>
          ) : (
            <label className={`flex flex-col items-center justify-center p-8 sm:p-10 md:p-12 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
              isDarkMode
                ? 'border-gray-700 hover:border-red-500/50 bg-gray-800/50'
                : 'border-gray-300 hover:border-red-500/50 bg-gray-50'
            } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <div className={`p-3 sm:p-4 rounded-xl mb-3 sm:mb-4 bg-gradient-to-r ${dashboardTheme.gradient}`}>
                <FaUpload className="text-white text-2xl sm:text-3xl" />
              </div>
              <p className={`text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-center px-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {uploading ? 'Envoi en cours...' : 'Cliquez pour sélectionner une image'}
              </p>
              <p className={`text-xs sm:text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                PNG, JPG jusqu'à 5MB
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploading}
                className="hidden"
              />
            </label>
          )}
        </motion.div>
      )}

      {/* Payment History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`glass-effect-strong rounded-xl p-4 sm:p-5 md:p-6 border ${
          isDarkMode ? 'border-gray-800' : 'border-gray-200'
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${dashboardTheme.gradient} flex-shrink-0`}>
            <FaCreditCard className="text-white text-lg sm:text-xl" />
          </div>
          <h2 className={`text-lg sm:text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Historique des paiements
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <FaSpinner className="animate-spin text-2xl sm:text-3xl text-red-500" />
          </div>
        ) : payments.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {payments.map((payment) => {
              const proofImageUrl = getImageUrl(payment.proof_image);
              
              return (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 sm:p-5 md:p-6 rounded-xl border transition-all hover:shadow-lg ${
                    isDarkMode
                      ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 md:gap-6">
                    {/* Image */}
                    <div
                      className="relative w-full sm:w-20 md:w-24 h-40 sm:h-20 md:h-24 rounded-xl overflow-hidden border-2 border-red-500/20 cursor-pointer flex-shrink-0 self-center sm:self-start"
                      onClick={() => setSelectedPayment(payment)}
                    >
                      {proofImageUrl ? (
                        <img
                          src={proofImageUrl}
                          alt="Preuve de paiement"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getPublicImageUrl('images/profile.jpeg');
                          }}
                        />
                      ) : payment.type === 'paytech' ? (
                        <div className={`w-full h-full flex flex-col items-center justify-center gap-1 ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          <FaMobileAlt className={`text-xl sm:text-2xl ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
                          <span className={`text-[10px] font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>PayTech</span>
                        </div>
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          <FaImage className={`text-xl sm:text-2xl ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                        <FaEye className="text-white opacity-0 hover:opacity-100 transition-opacity text-sm sm:text-base" />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <p className={`text-lg sm:text-xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            {payment.amount?.toLocaleString()} {payment.currency || 'FCFA'}
                          </p>
                          <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {new Date(payment.created_at).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          {getStatusBadge(payment.status)}
                        </div>
                      </div>

                      {payment.admin_notes && (
                        <div className={`p-2 sm:p-3 rounded-lg mt-3 ${
                          payment.status === 'rejected'
                            ? isDarkMode
                              ? 'bg-red-500/10 border border-red-500/30'
                              : 'bg-red-50 border border-red-200'
                            : isDarkMode
                              ? 'bg-gray-700/50 border border-gray-600'
                              : 'bg-gray-50 border border-gray-200'
                        }`}>
                          <p className={`text-xs sm:text-sm font-semibold mb-1 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Note de l'administrateur:
                          </p>
                          <p className={`text-xs sm:text-sm ${
                            payment.status === 'rejected'
                              ? isDarkMode ? 'text-red-400' : 'text-red-600'
                              : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {payment.admin_notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className={`p-8 sm:p-10 md:p-12 text-center rounded-xl border ${
            isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <FaCreditCard className={`text-3xl sm:text-4xl mx-auto mb-3 sm:mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-base sm:text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Aucun paiement enregistré
            </p>
            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Vos paiements apparaîtront ici une fois envoyés
            </p>
          </div>
        )}
      </motion.div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
            onClick={() => setSelectedPayment(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`glass-effect-strong rounded-xl p-4 sm:p-5 md:p-6 border max-w-4xl w-full max-h-[90vh] overflow-y-auto ${
                isDarkMode ? 'border-gray-800' : 'border-gray-200'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {selectedPayment.type === 'paytech' ? 'Détails du paiement PayTech' : 'Preuve de paiement'}
                </h3>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className={`p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0 ${
                    isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <FaTimes className="text-base sm:text-lg" />
                </button>
              </div>
              {selectedPayment.type === 'paytech' ? (
                <div className={`space-y-3 p-4 rounded-xl border ${
                  isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className="font-semibold">Référence :</span> {selectedPayment.ref_command || '-'}
                  </p>
                  {selectedPayment.payment_method && (
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className="font-semibold">Méthode :</span> {selectedPayment.payment_method}
                    </p>
                  )}
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className="font-semibold">Montant :</span> {selectedPayment.amount?.toLocaleString()} {selectedPayment.currency || 'FCFA'}
                  </p>
                </div>
              ) : selectedPayment.proof_image && (() => {
                const modalImageUrl = getImageUrl(selectedPayment.proof_image);
                return modalImageUrl ? (
                  <div className="rounded-xl overflow-hidden border-2 border-red-500/30">
                    <img
                      src={modalImageUrl}
                      alt="Preuve de paiement"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getPublicImageUrl('images/profile.jpeg');
                      }}
                    />
                  </div>
                ) : null;
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentStatus;
