import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPalette, FaSun, FaMoon } from 'react-icons/fa';
import { useTheme, themes } from '../context/ThemeContext';

const ThemeSelector = () => {
  const { currentTheme, changeTheme, isDarkMode, toggleMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themeColors = {
    cyan: '#06b6d4',
    purple: '#a855f7',
    green: '#22c55e',
    orange: '#f97316',
    pink: '#ec4899',
    blue: '#3b82f6',
    red: '#ef4444',
    yellow: '#eab308',
    indigo: '#6366f1',
    teal: '#14b8a6',
    amber: '#f59e0b',
    rose: '#f43f5e',
    emerald: '#10b981',
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-effect p-3 rounded-full hover:scale-110 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Changer de thème"
      >
        <FaPalette className="text-xl" style={{ color: themeColors[currentTheme] }} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Theme Selector Dropdown */}
            <motion.div
              className="absolute right-0 mt-3 p-5 glass-effect-strong rounded-2xl z-50 shadow-2xl min-w-[200px] border border-white/10"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className={`text-sm font-semibold mb-4 text-center ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Choisir un thème</h3>

              {/* Light/Dark Mode Toggle */}
              <div className={`flex items-center justify-between p-3 rounded-xl mb-4 ${isDarkMode ? 'bg-dark-800/50' : 'bg-white border border-gray-200'}`}>
                <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {isDarkMode ? 'Mode sombre' : 'Mode clair'}
                </span>
                <motion.button
                  onClick={toggleMode}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                    isDarkMode ? 'bg-dark-700' : 'bg-gray-200'
                  }`}
                  style={{
                    boxShadow: `0 0 10px ${themeColors[currentTheme]}30`
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute top-1 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: themeColors[currentTheme],
                      boxShadow: `0 0 10px ${themeColors[currentTheme]}`
                    }}
                    animate={{
                      x: isDarkMode ? 30 : 4
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    {isDarkMode ? (
                      <FaMoon className="text-white text-xs" />
                    ) : (
                      <FaSun className="text-white text-xs" />
                    )}
                  </motion.div>
                </motion.button>
              </div>

              {/* Color Grid */}
              <div className="max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
                <div className="grid grid-cols-3 gap-4 p-2">
                  {Object.keys(themes).map((themeName) => (
                  <div key={themeName} className="flex flex-col items-center gap-1">
                    <motion.button
                      onClick={() => {
                        changeTheme(themeName);
                        setIsOpen(false);
                      }}
                      className={`relative w-10 h-10 rounded-xl transition-all duration-300 ${
                        currentTheme === themeName
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-dark-800'
                          : ''
                      }`}
                      style={{
                        backgroundColor: themeColors[themeName],
                        boxShadow: currentTheme === themeName
                          ? `0 0 20px ${themeColors[themeName]}60`
                          : `0 2px 8px ${themeColors[themeName]}30`,
                      }}
                      whileHover={{ scale: 1.1, boxShadow: `0 0 20px ${themeColors[themeName]}60` }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`Thème ${themes[themeName].name}`}
                    >
                      {currentTheme === themeName && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        >
                          <svg
                            className="w-5 h-5 text-white drop-shadow-lg"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>
                    <span className={`text-[10px] ${
                      currentTheme === themeName
                        ? (isDarkMode ? 'text-white' : 'text-gray-900') + ' font-medium'
                        : (isDarkMode ? 'text-gray-500' : 'text-gray-600')
                    }`}>
                      {themes[themeName].name}
                    </span>
                  </div>
                  ))}
                </div>
              </div>

              {/* Current Theme Indicator */}
              <div className={`mt-4 pt-3 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-200'} flex items-center justify-center gap-2`}>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: themeColors[currentTheme] }}
                />
                <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Thème actif : <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{themes[currentTheme].name}</span>
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSelector;
