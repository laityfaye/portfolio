import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaHome, FaUser, FaCode, FaProjectDiagram, FaEnvelope,
  FaPalette, FaCreditCard, FaSignOutAlt, FaGlobe, FaBars, FaTimes,
  FaSun, FaMoon
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { portfolioApi } from '../api/portfolio';
import toast, { Toaster } from 'react-hot-toast';

// Dashboard sections
import DashboardHome from '../components/dashboard/DashboardHome';
import HeroEditor from '../components/dashboard/HeroEditor';
import AboutEditor from '../components/dashboard/AboutEditor';
import SkillsEditor from '../components/dashboard/SkillsEditor';
import ProjectsEditor from '../components/dashboard/ProjectsEditor';
import ContactEditor from '../components/dashboard/ContactEditor';
import ThemeEditor from '../components/dashboard/ThemeEditor';
import PaymentStatus from '../components/dashboard/PaymentStatus';
import PaymentSuccess from '../components/dashboard/PaymentSuccess';
import PaymentCancel from '../components/dashboard/PaymentCancel';

const Dashboard = () => {
  const { isDarkMode, toggleMode } = useTheme();
  const { user, logout, isActive, isPending } = useAuth();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
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
    const fetchPortfolio = async () => {
      try {
        const response = await portfolioApi.get();
        setPortfolio(response.data);
      } catch (error) {
        toast.error('Erreur lors du chargement du portfolio');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const refreshPortfolio = async () => {
    try {
      const response = await portfolioApi.get();
      setPortfolio(response.data);
    } catch (error) {
      console.error('Error refreshing portfolio:', error);
    }
  };

  const navItems = [
    { path: '/dashboard', icon: <FaHome />, label: 'Accueil', end: true },
  ];

  const configSteps = [
    { path: '/dashboard/hero', icon: <FaUser />, label: 'Hero', step: 1 },
    { path: '/dashboard/about', icon: <FaUser />, label: 'À propos', step: 2 },
    { path: '/dashboard/skills', icon: <FaCode />, label: 'Compétences', step: 3 },
    { path: '/dashboard/projects', icon: <FaProjectDiagram />, label: 'Projets', step: 4 },
    { path: '/dashboard/contact', icon: <FaEnvelope />, label: 'Contact', step: 5 },
    { path: '/dashboard/theme', icon: <FaPalette />, label: 'Thème', step: 6 },
  ];

  const otherItems = [
    { path: '/dashboard/payment', icon: <FaCreditCard />, label: 'Paiement' },
  ];

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-950' : 'bg-white'}`}>
      <Toaster position="top-right" />

      {/* Mobile Header */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 z-50 px-3 py-2.5 flex items-center justify-between border-b transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-950/80 border-gray-800/50' : 'bg-white/80 border-gray-200'
      } backdrop-blur-xl`}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`p-2.5 rounded-xl transition-all duration-200 ${
            isDarkMode
              ? 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
          }`}
        >
          {sidebarOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
        </button>

        {/* User info mobile */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {user?.full_name}
            </p>
            <div className="flex items-center justify-end gap-2">
              <p className={`text-xs truncate max-w-[120px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {user?.email}
              </p>
              {isActive && (
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              )}
              {isPending && (
                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
              )}
            </div>
          </div>
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25 ring-2 ring-red-500/20">
              <span className="text-white font-bold text-sm">
                {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            {isActive && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-950"></span>
            )}
          </div>
        </div>

        <button
          onClick={toggleMode}
          className={`p-2.5 rounded-xl transition-all duration-200 ${
            isDarkMode
              ? 'bg-gray-800/80 text-yellow-400 hover:bg-gray-700 hover:text-yellow-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
          }`}
          title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
        >
          {isDarkMode ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-72 z-40 transform transition-all duration-300 flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 ${
        isDarkMode ? 'glass-effect border-r border-gray-800' : 'bg-white border-r border-gray-200 shadow-xl'
      }`}>
        {/* Sidebar Header */}
        <div className={`p-6 flex-shrink-0 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                <span className="text-white font-bold text-lg">IS</span>
              </div>
              <span className={`text-xl font-bold bg-gradient-to-r ${dashboardTheme.gradient} bg-clip-text text-transparent`}>
                Inno<span className="text-red-500">Soft</span>
              </span>
            </Link>
            {/* Desktop Dark/Light Toggle */}
            <button
              onClick={toggleMode}
              className={`hidden lg:flex w-10 h-10 rounded-xl items-center justify-center transition-all ${
                isDarkMode
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
            >
              {isDarkMode ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
            </button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="p-4 flex-1 overflow-y-auto scrollbar-thin">
          {/* Accueil */}
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all font-medium ${
                  isActive
                    ? `bg-gradient-to-r ${dashboardTheme.gradient} text-white shadow-lg shadow-red-500/30`
                    : isDarkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}

          {/* Configuration Steps */}
          <p className={`text-xs font-semibold uppercase tracking-wider mt-4 mb-3 px-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Configuration
          </p>
          {configSteps.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl mb-1 transition-all font-medium ${
                  isActive
                    ? `bg-gradient-to-r ${dashboardTheme.gradient} text-white shadow-lg shadow-red-500/30`
                    : isDarkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : isDarkMode
                        ? 'bg-gray-800 text-gray-400'
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {item.step}
                  </span>
                  <span className="text-sm">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}

          {/* Other */}
          <p className={`text-xs font-semibold uppercase tracking-wider mt-4 mb-3 px-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Autres
          </p>
          {otherItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all font-medium ${
                  isActive
                    ? `bg-gradient-to-r ${dashboardTheme.gradient} text-white shadow-lg shadow-red-500/30`
                    : isDarkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className={`p-4 flex-shrink-0 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
          {isActive && portfolio?.status === 'published' && (
            <a
              href={`/p/${user?.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all font-medium ${
                isDarkMode
                  ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20'
                  : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
              }`}
            >
              <FaGlobe />
              <span>Voir mon portfolio</span>
            </a>
          )}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all font-medium ${
              isDarkMode
                ? 'text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20'
                : 'text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200'
            }`}
          >
            <FaSignOutAlt />
            <span>Deconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-72 pt-16 lg:pt-0 min-h-screen">
        {/* Desktop Navbar */}
        <div className={`hidden lg:flex items-center justify-between px-6 xl:px-8 py-4 border-b ${
          isDarkMode ? 'border-gray-800/50 bg-gray-950/70' : 'border-gray-200/80 bg-white/70'
        } backdrop-blur-xl sticky top-0 z-10`}>
          {/* Left side - Title */}
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${
              isDarkMode ? 'bg-gradient-to-br from-red-500/20 to-red-600/10' : 'bg-gradient-to-br from-red-50 to-red-100'
            }`}>
              <FaHome className={`text-xl ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Tableau de bord
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Bienvenue, {user?.full_name?.split(' ')[0]} 👋
              </p>
            </div>
          </div>

          {/* Right side - User info */}
          <div className={`flex items-center gap-4 p-2 pl-4 rounded-2xl ${
            isDarkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-gray-50 border border-gray-200/80'
          }`}>
            {/* Status badge */}
            {isPending && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${
                isDarkMode ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-yellow-50 border border-yellow-200'
              }`}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                </span>
                <span className={`text-xs font-semibold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                  En attente
                </span>
              </div>
            )}
            {isActive && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${
                isDarkMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'
              }`}>
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className={`text-xs font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  Actif
                </span>
              </div>
            )}

            {/* Divider */}
            <div className={`w-px h-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>

            {/* User details */}
            <div className="text-right">
              <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {user?.full_name}
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {user?.email}
              </p>
            </div>

            {/* Avatar */}
            <div className="relative group cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25 ring-2 ring-red-500/20 transition-transform group-hover:scale-105">
                <span className="text-white font-bold text-lg">
                  {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              {isActive && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></span>
              )}
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <Routes>
              <Route index element={<DashboardHome portfolio={portfolio} user={user} onRefresh={refreshPortfolio} />} />
              <Route path="hero" element={<HeroEditor portfolio={portfolio} onUpdate={refreshPortfolio} />} />
              <Route path="about" element={<AboutEditor portfolio={portfolio} onUpdate={refreshPortfolio} />} />
              <Route path="skills" element={<SkillsEditor portfolio={portfolio} onUpdate={refreshPortfolio} />} />
              <Route path="projects" element={<ProjectsEditor portfolio={portfolio} onUpdate={refreshPortfolio} />} />
              <Route path="contact" element={<ContactEditor portfolio={portfolio} onUpdate={refreshPortfolio} />} />
              <Route path="theme" element={<ThemeEditor portfolio={portfolio} onUpdate={refreshPortfolio} />} />
              <Route path="payment/success" element={<PaymentSuccess />} />
              <Route path="payment/cancel" element={<PaymentCancel />} />
              <Route path="payment" element={<PaymentStatus user={user} />} />
            </Routes>
          </div>
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

export default Dashboard;
