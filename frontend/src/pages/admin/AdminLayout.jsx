import { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaHome, FaUsers, FaCreditCard, FaBriefcase,
  FaSignOutAlt, FaBars, FaTimes, FaChartLine
} from 'react-icons/fa';
import { useAdmin } from '../../context/AdminContext';
import { useTheme } from '../../context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import ThemeSelector from '../../components/ThemeSelector';

// Admin pages
import AdminDashboard from './AdminDashboard';
import AdminUsers from './AdminUsers';
import AdminPayments from './AdminPayments';
import AdminPortfolios from './AdminPortfolios';

const AdminLayout = () => {
  const { admin, logout } = useAdmin();
  const { theme, isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin', icon: <FaHome />, label: 'Dashboard', end: true },
    { path: '/admin/users', icon: <FaUsers />, label: 'Utilisateurs' },
    { path: '/admin/payments', icon: <FaCreditCard />, label: 'Paiements' },
    { path: '/admin/portfolios', icon: <FaBriefcase />, label: 'Portfolios' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-950' : 'bg-white'}`}>
      <Toaster position="top-right" />

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`lg:hidden fixed top-4 left-4 z-50 p-3 rounded-lg transition-colors ${
          isDarkMode ? 'glass-effect text-white' : 'bg-white text-gray-600 shadow-lg'
        }`}
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 z-40 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 ${
        isDarkMode ? 'glass-effect border-r border-gray-800' : 'bg-white border-r border-gray-200 shadow-xl'
      }`}>
        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/30">
                <FaChartLine className="text-white" />
              </div>
              <div>
                <h1 className={`text-lg font-bold bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                  InnoSoft
                </h1>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Administration</p>
              </div>
            </div>
            <div className="hidden lg:flex">
              <ThemeSelector />
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg shadow-red-500/30`
                    : isDarkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className={`flex items-center gap-3 mb-4 px-4 p-3 rounded-xl glass-effect-strong ${isDarkMode ? '' : 'bg-gray-50'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-red-500/30">
              {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div>
              <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{admin?.name}</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{admin?.email}</p>
            </div>
          </div>
          <div className="px-4 mb-2 lg:hidden">
            <ThemeSelector />
          </div>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all w-full ${
              isDarkMode
                ? 'text-red-400 hover:bg-red-500/10'
                : 'text-red-500 hover:bg-red-50'
            }`}
          >
            <FaSignOutAlt />
            <span>Deconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="portfolios" element={<AdminPortfolios />} />
          </Routes>
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
