import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaTimes, FaEye, FaFilter, FaImage } from 'react-icons/fa';
import { adminPaymentsApi } from '../../api/admin';
import { getImageUrl } from '../../utils/imageUtils';
import toast from 'react-hot-toast';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [paymentToReject, setPaymentToReject] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  const fetchPayments = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page };
      if (statusFilter) params.status = statusFilter;

      const response = await adminPaymentsApi.getAll(params);
      setPayments(response.data.data || []);
      setPagination(response.data.meta || null);
    } catch (error) {
      toast.error('Erreur lors du chargement des paiements');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (paymentId) => {
    if (!confirm('Voulez-vous approuver ce paiement ? Le compte utilisateur sera active.')) return;
    try {
      await adminPaymentsApi.approve(paymentId);
      toast.success('Paiement approuve - Compte utilisateur active');
      fetchPayments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'approbation');
    }
  };

  const openRejectModal = (payment) => {
    setPaymentToReject(payment);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Veuillez indiquer la raison du rejet');
      return;
    }
    try {
      await adminPaymentsApi.reject(paymentToReject.id, { admin_notes: rejectReason });
      toast.success('Paiement rejete');
      setShowRejectModal(false);
      setPaymentToReject(null);
      fetchPayments();
    } catch (error) {
      toast.error('Erreur lors du rejet');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: 'bg-green-500/20 text-green-500',
      pending: 'bg-yellow-500/20 text-yellow-500',
      rejected: 'bg-red-500/20 text-red-500',
    };
    const labels = {
      approved: 'Approuve',
      pending: 'En attente',
      rejected: 'Rejete',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Paiements</h1>
          <p className="text-xs sm:text-sm text-slate-400">Validation des preuves de paiement</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <FaFilter className="text-slate-400" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="approved">Approuves</option>
          <option value="rejected">Rejetes</option>
        </select>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[640px]">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-slate-400 font-medium text-xs sm:text-sm">Utilisateur</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-slate-400 font-medium text-xs sm:text-sm">Preuve</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-slate-400 font-medium text-xs sm:text-sm">Montant</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-slate-400 font-medium text-xs sm:text-sm hidden md:table-cell">Statut</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-slate-400 font-medium text-xs sm:text-sm hidden lg:table-cell">Date</th>
                  <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-slate-400 font-medium text-xs sm:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400 text-sm">
                      Aucun paiement trouve
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <div>
                          <p className="text-white font-medium text-xs sm:text-sm">
                            {payment.user?.first_name} {payment.user?.last_name}
                          </p>
                          <p className="text-slate-400 text-xs">{payment.user?.email}</p>
                        </div>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        {payment.proof_image ? (
                          <button
                            onClick={() => setSelectedPayment(payment)}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden hover:ring-2 hover:ring-cyan-500 transition-all"
                          >
                            <img
                              src={getImageUrl(payment.proof_image)}
                              alt="Preuve"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </button>
                        ) : (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                            <FaImage className="text-slate-500 text-xs sm:text-sm" />
                          </div>
                        )}
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <span className="text-cyan-400 font-medium text-xs sm:text-sm">
                          {payment.amount?.toLocaleString()} {payment.currency}
                        </span>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 hidden md:table-cell">{getStatusBadge(payment.status)}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-slate-300 text-xs sm:text-sm hidden lg:table-cell">
                        {formatDate(payment.created_at)}
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          {payment.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(payment.id)}
                                className="p-2 text-green-500 hover:bg-green-500/20 rounded-lg transition-colors"
                                title="Approuver"
                              >
                                <FaCheck />
                              </button>
                              <button
                                onClick={() => openRejectModal(payment)}
                                className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                                title="Rejeter"
                              >
                                <FaTimes />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setSelectedPayment(payment)}
                            className="p-2 text-cyan-500 hover:bg-cyan-500/20 rounded-lg transition-colors"
                            title="Voir details"
                          >
                            <FaEye />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-700">
            <p className="text-slate-400 text-sm">
              Page {pagination.current_page} sur {pagination.last_page}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => fetchPayments(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className="px-3 py-1 bg-slate-700 text-white rounded disabled:opacity-50"
              >
                Precedent
              </button>
              <button
                onClick={() => fetchPayments(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
                className="px-3 py-1 bg-slate-700 text-white rounded disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
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
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPayment(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-slate-800 rounded-xl max-w-2xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Details du paiement</h3>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="p-4 space-y-4">
                {selectedPayment.proof_image && (
                  <img
                    src={getImageUrl(selectedPayment.proof_image)}
                    alt="Preuve de paiement"
                    className="w-full rounded-lg"
                    onError={(e) => {
                      console.error('Erreur de chargement de l\'image:', e.target.src);
                    }}
                  />
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm">Utilisateur</p>
                    <p className="text-white">{selectedPayment.user?.first_name} {selectedPayment.user?.last_name}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Montant</p>
                    <p className="text-cyan-400 font-medium">{selectedPayment.amount?.toLocaleString()} {selectedPayment.currency}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Statut</p>
                    <p>{getStatusBadge(selectedPayment.status)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Date</p>
                    <p className="text-white">{formatDate(selectedPayment.created_at)}</p>
                  </div>
                </div>
                {selectedPayment.admin_notes && (
                  <div>
                    <p className="text-slate-400 text-sm">Notes admin</p>
                    <p className="text-white bg-slate-700 p-3 rounded-lg mt-1">{selectedPayment.admin_notes}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowRejectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-slate-800 rounded-xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-white">Rejeter le paiement</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Raison du rejet</label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows="4"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Expliquez pourquoi ce paiement est rejete..."
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleReject}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Rejeter
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPayments;
