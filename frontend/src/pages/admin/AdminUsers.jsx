import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaCheck, FaBan, FaTrash, FaEye, FaFilter } from 'react-icons/fa';
import { adminUsersApi } from '../../api/admin';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page };
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;

      const response = await adminUsersApi.getAll(params);
      setUsers(response.data.data || []);
      setPagination(response.data.meta || null);
    } catch (error) {
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleActivate = async (userId) => {
    try {
      await adminUsersApi.activate(userId);
      toast.success('Utilisateur active');
      fetchUsers();
    } catch (error) {
      toast.error('Erreur lors de l\'activation');
    }
  };

  const handleSuspend = async (userId) => {
    if (!confirm('Voulez-vous vraiment suspendre cet utilisateur ?')) return;
    try {
      await adminUsersApi.suspend(userId);
      toast.success('Utilisateur suspendu');
      fetchUsers();
    } catch (error) {
      toast.error('Erreur lors de la suspension');
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Voulez-vous vraiment supprimer cet utilisateur ? Cette action est irreversible.')) return;
    try {
      await adminUsersApi.delete(userId);
      toast.success('Utilisateur supprime');
      fetchUsers();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-500/20 text-green-500',
      pending: 'bg-yellow-500/20 text-yellow-500',
      suspended: 'bg-red-500/20 text-red-500',
    };
    const labels = {
      active: 'Actif',
      pending: 'En attente',
      suspended: 'Suspendu',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Utilisateurs</h1>
          <p className="text-xs sm:text-sm text-slate-400">Gestion des comptes utilisateurs</p>
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
              placeholder="Rechercher par nom ou email..."
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
            <option value="active">Actifs</option>
            <option value="pending">En attente</option>
            <option value="suspended">Suspendus</option>
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
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-slate-400 font-medium text-xs sm:text-sm">Utilisateur</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-slate-400 font-medium text-xs sm:text-sm hidden md:table-cell">Email</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-slate-400 font-medium text-xs sm:text-sm hidden lg:table-cell">Telephone</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-slate-400 font-medium text-xs sm:text-sm">Statut</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-slate-400 font-medium text-xs sm:text-sm hidden lg:table-cell">URL</th>
                  <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-slate-400 font-medium text-xs sm:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400 text-sm">
                      Aucun utilisateur trouve
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-700 rounded-full flex items-center justify-center text-cyan-500 font-bold text-xs sm:text-sm flex-shrink-0">
                            {user.first_name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <span className="text-white font-medium text-xs sm:text-sm block truncate">
                              {user.first_name} {user.last_name}
                            </span>
                            <span className="text-slate-400 text-xs md:hidden block truncate">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-slate-300 text-xs sm:text-sm hidden md:table-cell">{user.email}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-slate-300 text-xs sm:text-sm hidden lg:table-cell">{user.phone || '-'}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">{getStatusBadge(user.status)}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 hidden lg:table-cell">
                        <code className="text-cyan-400 text-xs sm:text-sm">/p/{user.slug}</code>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          {user.status !== 'active' && (
                            <button
                              onClick={() => handleActivate(user.id)}
                              className="p-2 text-green-500 hover:bg-green-500/20 rounded-lg transition-colors"
                              title="Activer"
                            >
                              <FaCheck />
                            </button>
                          )}
                          {user.status === 'active' && (
                            <button
                              onClick={() => handleSuspend(user.id)}
                              className="p-2 text-yellow-500 hover:bg-yellow-500/20 rounded-lg transition-colors"
                              title="Suspendre"
                            >
                              <FaBan />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(user.id)}
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
                onClick={() => fetchUsers(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className="px-3 py-1 bg-slate-700 text-white rounded disabled:opacity-50"
              >
                Precedent
              </button>
              <button
                onClick={() => fetchUsers(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
                className="px-3 py-1 bg-slate-700 text-white rounded disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminUsers;
