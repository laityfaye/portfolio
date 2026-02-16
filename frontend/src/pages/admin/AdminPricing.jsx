import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTag, FaEdit, FaSpinner, FaSave } from 'react-icons/fa';
import { adminPricingApi } from '../../api/admin';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

const AdminPricing = () => {
  const { isDarkMode } = useTheme();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ amount: '', currency: '', name: '', duration_days: '', is_active: true });

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const res = await adminPricingApi.getAll();
      setModels(res.data?.data ?? []);
    } catch {
      toast.error('Erreur lors du chargement des tarifs');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (model) => {
    setEditingId(model.id);
    setEditForm({
      amount: String(model.amount),
      currency: model.currency ?? 'FCFA',
      name: model.name ?? '',
      duration_days: String(model.duration_days ?? 365),
      is_active: model.is_active ?? true,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const payload = {
      amount: parseFloat(editForm.amount) || 0,
      currency: editForm.currency || 'FCFA',
      name: editForm.name || undefined,
      duration_days: parseInt(editForm.duration_days, 10) || 365,
      is_active: editForm.is_active,
    };
    try {
      await adminPricingApi.update(editingId, payload);
      toast.success('Tarif mis à jour');
      setEditingId(null);
      fetchModels();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FaSpinner className="animate-spin text-2xl text-red-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Tarification
          </h1>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Définir le prix pour chaque modèle (Classic, Minimal, Elegant, Luxe) et offres.
          </p>
        </div>
      </motion.div>

      {/* Cartes : Classic, Minimal, Elegant, Luxe */}
      {(() => {
        const templateOrder = ['classic', 'minimal', 'elegant', 'luxe'];
        const templateModels = templateOrder
          .map((t) => models.find((m) => m.template === t))
          .filter(Boolean);
        if (templateModels.length === 0) return null;
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {templateModels.map((model) => (
            <div
              key={model.id}
              className={`rounded-xl border p-4 ${
                isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200'
              } ${editingId === model.id ? 'ring-2 ring-green-500' : ''}`}
            >
              <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {model.name}
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                {Number(model.amount).toLocaleString('fr-FR')} {model.currency}
              </p>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {model.duration_days} jours
                {!model.is_active && ' • Inactif'}
              </p>
              <button
                type="button"
                onClick={() => editingId === model.id ? cancelEdit() : startEdit(model)}
                className={`mt-3 text-xs font-medium ${isDarkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'}`}
              >
                {editingId === model.id ? 'Annuler' : 'Modifier le prix'}
              </button>
            </div>
            ))}
          </motion.div>
        );
      })()}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-xl border overflow-hidden ${isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-white'}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={isDarkMode ? 'border-b border-gray-800' : 'border-b border-gray-200'}>
                <th className={`text-left py-3 px-4 text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Modèle</th>
                <th className={`text-left py-3 px-4 text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Template</th>
                <th className={`text-left py-3 px-4 text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Slug</th>
                <th className={`text-left py-3 px-4 text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Prix</th>
                <th className={`text-left py-3 px-4 text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Durée</th>
                <th className={`text-left py-3 px-4 text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Actif</th>
                <th className={`text-right py-3 px-4 text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {models.length === 0 ? (
                <tr>
                  <td colSpan={7} className={`py-8 text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Aucun modèle de tarification.
                  </td>
                </tr>
              ) : (
                models.map((model) => (
                  <tr
                    key={model.id}
                    className={`border-b last:border-b-0 ${isDarkMode ? 'border-gray-800 hover:bg-gray-800/30' : 'border-gray-100 hover:bg-gray-50'}`}
                  >
                    <td className="py-3 px-4">
                      {editingId === model.id ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                          className={`w-full max-w-[180px] px-2 py-1.5 rounded-lg border text-sm ${
                            isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'
                          }`}
                        />
                      ) : (
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{model.name}</span>
                      )}
                    </td>
                    <td className={`py-3 px-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {model.template ? (
                        <span className="capitalize font-medium">{model.template}</span>
                      ) : (
                        <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>—</span>
                      )}
                    </td>
                    <td className={`py-3 px-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <code className="text-xs">{model.slug}</code>
                    </td>
                    <td className="py-3 px-4">
                      {editingId === model.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={editForm.amount}
                            onChange={(e) => setEditForm((f) => ({ ...f, amount: e.target.value }))}
                            className={`w-24 px-2 py-1.5 rounded-lg border text-sm ${
                              isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'
                            }`}
                          />
                          <input
                            type="text"
                            value={editForm.currency}
                            onChange={(e) => setEditForm((f) => ({ ...f, currency: e.target.value }))}
                            className={`w-16 px-2 py-1.5 rounded-lg border text-sm ${
                              isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'
                            }`}
                          />
                        </div>
                      ) : (
                        <span className={`font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                          {Number(model.amount).toLocaleString('fr-FR')} {model.currency}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {editingId === model.id ? (
                        <input
                          type="number"
                          min="1"
                          value={editForm.duration_days}
                          onChange={(e) => setEditForm((f) => ({ ...f, duration_days: e.target.value }))}
                          className={`w-20 px-2 py-1.5 rounded-lg border text-sm ${
                            isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'
                          }`}
                        />
                      ) : (
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{model.duration_days} jours</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {editingId === model.id ? (
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editForm.is_active}
                            onChange={(e) => setEditForm((f) => ({ ...f, is_active: e.target.checked }))}
                            className="rounded border-gray-500 text-red-500 focus:ring-red-500"
                          />
                          <span className="text-sm">Actif</span>
                        </label>
                      ) : (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          model.is_active ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'
                        }`}>
                          {model.is_active ? 'Oui' : 'Non'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {editingId === model.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={saveEdit}
                            className="p-2 rounded-lg bg-green-500/20 text-green-500 hover:bg-green-500/30"
                            title="Enregistrer"
                          >
                            <FaSave />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className={`p-2 rounded-lg ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`}
                          >
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(model)}
                          className={`p-2 rounded-lg ${isDarkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'}`}
                          title="Modifier le tarif"
                        >
                          <FaEdit />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPricing;
