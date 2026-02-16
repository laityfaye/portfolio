import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaGlobe, FaEyeSlash, FaTrash, FaExternalLinkAlt, FaFilter, FaSun, FaMoon, FaEdit, FaTag } from 'react-icons/fa';
import { adminPortfoliosApi } from '../../api/admin';
import { getProfileImageUrl, getPublicImageUrl } from '../../utils/imageUtils';
import toast from 'react-hot-toast';

const AdminPortfolios = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState(null);
  const [priceModal, setPriceModal] = useState(null);
  const [editAmount, setEditAmount] = useState('');
  const [editCurrency, setEditCurrency] = useState('FCFA');
  const [savingPrice, setSavingPrice] = useState(false);

  useEffect(() => {
    fetchPortfolios();
  }, [statusFilter]);

  const fetchPortfolios = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page };
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;

      const response = await adminPortfoliosApi.getAll(params);
      setPortfolios(response.data.data || []);
      setPagination(response.data.meta || null);
    } catch (error) {
      toast.error('Erreur lors du chargement des portfolios');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPortfolios();
  };

  const handlePublish = async (portfolioId) => {
    try {
      await adminPortfoliosApi.publish(portfolioId);
      toast.success('Portfolio publie');
      fetchPortfolios();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la publication');
    }
  };

  const handleUnpublish = async (portfolioId) => {
    if (!confirm('Voulez-vous vraiment depublier ce portfolio ?')) return;
    try {
      await adminPortfoliosApi.unpublish(portfolioId);
      toast.success('Portfolio depublie');
      fetchPortfolios();
    } catch (error) {
      toast.error('Erreur lors de la depublication');
    }
  };

  const handleDelete = async (portfolioId) => {
    if (!confirm('Voulez-vous vraiment supprimer ce portfolio ? Cette action est irreversible.')) return;
    try {
      await adminPortfoliosApi.delete(portfolioId);
      toast.success('Portfolio supprime');
      fetchPortfolios();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const openPriceModal = (portfolio) => {
    setPriceModal(portfolio);
    setEditAmount(portfolio.amount != null ? String(portfolio.amount) : '2500');
    setEditCurrency(portfolio.currency || 'FCFA');
  };

  const closePriceModal = () => {
    setPriceModal(null);
  };

  const handleSavePrice = async () => {
    if (!priceModal) return;
    const amount = parseFloat(editAmount);
    if (isNaN(amount) || amount < 0) {
      toast.error('Montant invalide');
      return;
    }
    setSavingPrice(true);
    try {
      await adminPortfoliosApi.update(priceModal.id, { amount, currency: editCurrency || 'FCFA' });
      toast.success('Prix mis a jour');
      closePriceModal();
      fetchPortfolios();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise a jour du prix');
    } finally {
      setSavingPrice(false);
    }
  };

  const formatPrice = (portfolio) => {
    const a = portfolio.amount != null ? Number(portfolio.amount) : 2500;
    const c = portfolio.currency || 'FCFA';
    return `${a.toLocaleString('fr-FR')} ${c}`;
  };

  const getStatusBadge = (status) => {
    const styles = {
      published: 'bg-green-500/20 text-green-500',
      draft: 'bg-slate-500/20 text-slate-400',
      pending: 'bg-yellow-500/20 text-yellow-500',
    };
    const labels = {
      published: 'Publie',
      draft: 'Brouillon',
      pending: 'En attente',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getThemeColor = (color) => {
    const colors = {
      cyan: 'bg-cyan-500',
      purple: 'bg-purple-500',
      green: 'bg-green-500',
      orange: 'bg-orange-500',
      pink: 'bg-pink-500',
      blue: 'bg-blue-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      indigo: 'bg-indigo-500',
      teal: 'bg-teal-500',
      amber: 'bg-amber-500',
      rose: 'bg-rose-500',
      emerald: 'bg-emerald-500',
    };
    return colors[color] || 'bg-slate-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Portfolios</h1>
          <p className="text-xs sm:text-sm text-slate-400">Gestion des portfolios utilisateurs</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom ou titre..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </form>
        <div className="flex items-center gap-2">
          <FaFilter className="text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Tous les statuts</option>
            <option value="published">Publies</option>
            <option value="draft">Brouillons</option>
            <option value="pending">En attente</option>
          </select>
        </div>
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
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-slate-400 font-medium text-xs sm:text-sm">Portfolio</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-slate-400 font-medium text-xs sm:text-sm hidden md:table-cell">Proprietaire</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-slate-400 font-medium text-xs sm:text-sm hidden lg:table-cell">Theme</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-slate-400 font-medium text-xs sm:text-sm">Prix</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-slate-400 font-medium text-xs sm:text-sm">Statut</th>
                  <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-slate-400 font-medium text-xs sm:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {portfolios.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400 text-sm">
                      Aucun portfolio trouve
                    </td>
                  </tr>
                ) : (
                  portfolios.map((portfolio) => (
                    <tr key={portfolio.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          {portfolio.profile_image ? (
                            <img
                              src={getProfileImageUrl(portfolio.profile_image)}
                              alt={portfolio.display_name}
                              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                              onError={(e) => {
                                e.target.src = getPublicImageUrl('images/profile.jpeg');
                              }}
                            />
                          ) : (
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-700 rounded-full flex items-center justify-center text-cyan-500 font-bold text-xs sm:text-sm flex-shrink-0">
                              {portfolio.display_name?.charAt(0)?.toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-white font-medium text-xs sm:text-sm truncate">{portfolio.display_name}</p>
                            <p className="text-slate-400 text-xs truncate">{portfolio.job_title}</p>
                            <p className="text-slate-300 text-xs md:hidden mt-1 truncate">{portfolio.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 hidden md:table-cell">
                        <div>
                          <p className="text-slate-300 text-xs sm:text-sm">{portfolio.user?.email}</p>
                          <code className="text-cyan-400 text-xs">/p/{portfolio.user?.slug}</code>
                        </div>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${getThemeColor(portfolio.theme_color)}`} />
                          <span className="text-slate-300 capitalize text-xs sm:text-sm">{portfolio.theme_color}</span>
                          {portfolio.theme_mode === 'dark' ? (
                            <FaMoon className="text-slate-400 text-xs sm:text-sm" />
                          ) : (
                            <FaSun className="text-yellow-400 text-xs sm:text-sm" />
                          )}
                        </div>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-green-400 font-semibold text-xs sm:text-sm">{formatPrice(portfolio)}</span>
                          <button
                            onClick={() => openPriceModal(portfolio)}
                            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                            title="Modifier le prix"
                          >
                            <FaEdit className="text-xs" />
                          </button>
                        </div>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">{getStatusBadge(portfolio.status)}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          {portfolio.status !== 'published' ? (
                            <button
                              onClick={() => handlePublish(portfolio.id)}
                              className="p-2 text-green-500 hover:bg-green-500/20 rounded-lg transition-colors"
                              title="Publier"
                            >
                              <FaGlobe />
                            </button>
                          ) : (
                            <>
                              <a
                                href={`/p/${portfolio.user?.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-cyan-500 hover:bg-cyan-500/20 rounded-lg transition-colors"
                                title="Voir le portfolio"
                              >
                                <FaExternalLinkAlt />
                              </a>
                              <button
                                onClick={() => handleUnpublish(portfolio.id)}
                                className="p-2 text-yellow-500 hover:bg-yellow-500/20 rounded-lg transition-colors"
                                title="Depublier"
                              >
                                <FaEyeSlash />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(portfolio.id)}
                            className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <FaTrash />
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
                onClick={() => fetchPortfolios(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className="px-3 py-1 bg-slate-700 text-white rounded disabled:opacity-50"
              >
                Precedent
              </button>
              <button
                onClick={() => fetchPortfolios(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
                className="px-3 py-1 bg-slate-700 text-white rounded disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* Modal Prix */}
        {priceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={closePriceModal}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 rounded-xl border border-slate-600 p-6 w-full max-w-sm shadow-xl"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FaTag className="text-cyan-400" />
                Prix du portfolio
              </h3>
              <p className="text-slate-400 text-sm mb-4">{priceModal.display_name}</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-slate-400 text-xs mb-1">Montant</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs mb-1">Devise</label>
                  <input
                    type="text"
                    value={editCurrency}
                    onChange={(e) => setEditCurrency(e.target.value)}
                    placeholder="FCFA"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={closePriceModal}
                  className="px-4 py-2 text-slate-400 hover:text-white rounded-lg"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSavePrice}
                  disabled={savingPrice}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium disabled:opacity-50"
                >
                  {savingPrice ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminPortfolios;
