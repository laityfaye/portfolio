import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeApplier = () => {
  const { theme, isDarkMode } = useTheme();

  useEffect(() => {
    // Update CSS variables for dynamic theming
    const root = document.documentElement;

    // Set theme colors as CSS variables
    root.style.setProperty('--theme-primary-light', theme.primary.light);
    root.style.setProperty('--theme-primary-main', theme.primary.main);
    root.style.setProperty('--theme-primary-dark', theme.primary.dark);
    root.style.setProperty('--theme-glow', theme.glow);
    root.style.setProperty('--theme-shadow', theme.shadow);

    // Light/Dark mode specific colors - Design très propre pour le mode sombre
    const bgPrimary = isDarkMode ? 'rgba(1, 3, 15, 1)' : '#ffffff';
    const bgSecondary = isDarkMode ? 'rgba(2, 5, 20, 0.98)' : '#ffffff';
    const textPrimary = isDarkMode ? '#f8fafc' : '#111827';
    const textSecondary = isDarkMode ? '#cbd5e1' : '#6b7280';
    const textMuted = isDarkMode ? '#94a3b8' : '#9ca3af';
    const glassEffect = isDarkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.95)';
    const glassBorder = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)';
    const cardBg = isDarkMode ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 1)';

    // Update dynamic styles including backgrounds
    const style = document.getElementById('dynamic-theme-styles') || document.createElement('style');
    style.id = 'dynamic-theme-styles';
    style.innerHTML = `
      /* Background gradients with theme colors - Fond très propre en mode clair */
      body {
        background: ${isDarkMode 
          ? `linear-gradient(to bottom right,
              ${bgPrimary} 0%,
              ${bgSecondary} 50%,
              ${theme.glow.replace('0.4', '0.02')} 100%
            )`
          : '#ffffff'
        } !important;
        background-attachment: fixed !important;
      }

      /* Light/Dark mode text colors */
      .text-gray-100, .text-gray-200 {
        color: ${isDarkMode ? '' : textPrimary} !important;
      }

      .text-gray-300 {
        color: ${textPrimary} !important;
      }

      .text-gray-400, .text-gray-500 {
        color: ${textSecondary} !important;
      }

      /* Glass effects for light/dark mode - Effets très propres en mode clair */
      .glass-effect {
        background: ${glassEffect} !important;
        border-color: ${glassBorder} !important;
        ${!isDarkMode ? `
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05),
                      0 4px 12px rgba(0, 0, 0, 0.04),
                      inset 0 1px 0 rgba(255, 255, 255, 1) !important;
        ` : ''}
      }

      .glass-effect-strong {
        background: ${isDarkMode ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 1)'} !important;
        border-color: ${isDarkMode ? theme.primary.main + '25' : 'rgba(0, 0, 0, 0.08)'} !important;
        backdrop-filter: blur(24px) saturate(180%) !important;
        ${isDarkMode ? `
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4),
                      0 2px 8px rgba(0, 0, 0, 0.2),
                      inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
        ` : `
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04),
                      0 8px 24px rgba(0, 0, 0, 0.06),
                      inset 0 1px 0 rgba(255, 255, 255, 1) !important;
        `}
      }

      /* Card backgrounds - Cartes très propres en mode clair */
      .bg-dark-800, .bg-dark-900 {
        background-color: ${isDarkMode ? '' : 'rgba(255, 255, 255, 1)'} !important;
      }

      /* Floating orbs with theme colors - Orbes très propres en mode sombre */
      .floating-orb {
        filter: blur(100px);
        opacity: ${isDarkMode ? '0.12' : '0.04'};
      }

      /* Mesh gradient backgrounds - Gradients très propres en mode sombre */
      .mesh-gradient {
        background: ${isDarkMode 
          ? `radial-gradient(at 0% 0%, ${theme.glow.replace('0.4', '0.08')} 0px, transparent 50%),
             radial-gradient(at 100% 0%, ${theme.primary.dark}20 0px, transparent 50%),
             radial-gradient(at 100% 100%, ${theme.glow.replace('0.4', '0.08')} 0px, transparent 50%),
             radial-gradient(at 0% 100%, ${theme.primary.light}20 0px, transparent 50%)`
          : `radial-gradient(at 0% 0%, ${theme.glow.replace('0.4', '0.02')} 0px, transparent 50%),
             radial-gradient(at 100% 0%, ${theme.primary.dark}08 0px, transparent 50%),
             radial-gradient(at 100% 100%, ${theme.glow.replace('0.4', '0.02')} 0px, transparent 50%),
             radial-gradient(at 0% 100%, ${theme.primary.light}08 0px, transparent 50%)`
        };
      }

      /* Cyber grid with theme color - Grille très propre en mode sombre */
      .cyber-grid {
        background-image:
          linear-gradient(${theme.glow.replace('0.4', isDarkMode ? '0.025' : '0.01')} 1px, transparent 1px),
          linear-gradient(90deg, ${theme.glow.replace('0.4', isDarkMode ? '0.025' : '0.01')} 1px, transparent 1px);
      }

      /* Scrollbar colors - Scrollbar très propre en mode sombre */
      ::-webkit-scrollbar-track {
        background: ${isDarkMode ? 'rgba(1, 3, 15, 0.9)' : 'rgba(241, 245, 249, 0.8)'};
        border-radius: 10px;
      }

      ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, ${theme.primary.main}, ${theme.primary.dark});
        box-shadow: ${isDarkMode ? `0 0 12px ${theme.glow}` : `0 0 8px ${theme.glow.replace('0.4', '0.2')}`};
        border-radius: 10px;
        border: ${isDarkMode ? '2px solid rgba(1, 3, 15, 0.9)' : '2px solid rgba(241, 245, 249, 1)'};
      }

      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, ${theme.primary.light}, ${theme.primary.main});
        box-shadow: ${isDarkMode ? `0 0 20px ${theme.glow}` : `0 0 12px ${theme.glow.replace('0.4', '0.3')}`};
      }

      /* Selection */
      ::selection {
        background: ${theme.glow};
        color: ${isDarkMode ? '#fff' : '#000'};
        text-shadow: 0 0 10px ${theme.glow};
      }

      /* Button styles - Boutons très propres en mode sombre */
      .btn-primary {
        background: linear-gradient(135deg, ${theme.primary.main}, ${theme.primary.dark}) !important;
        box-shadow: ${isDarkMode 
          ? `0 8px 32px ${theme.shadow},
             0 4px 16px ${theme.shadow},
             0 0 20px ${theme.glow.replace('0.4', '0.2')},
             inset 0 1px 0 rgba(255, 255, 255, 0.2)`
          : `0 2px 8px ${theme.shadow.replace('0.2', '0.15')},
             0 4px 12px ${theme.shadow.replace('0.2', '0.1')},
             inset 0 1px 0 rgba(255, 255, 255, 0.2)`
        };
      }

      .btn-primary:hover {
        background: linear-gradient(135deg, ${theme.primary.light}, ${theme.primary.main}) !important;
        ${isDarkMode ? `
          box-shadow: 0 12px 40px ${theme.shadow},
                      0 6px 20px ${theme.shadow},
                      0 0 30px ${theme.glow.replace('0.4', '0.3')},
                      inset 0 1px 0 rgba(255, 255, 255, 0.25) !important;
        ` : `
          box-shadow: 0 4px 12px ${theme.shadow.replace('0.2', '0.2')},
                      0 8px 20px ${theme.shadow.replace('0.2', '0.15')},
                      inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
        `}
      }

      .btn-secondary {
        border-color: ${theme.primary.main}${isDarkMode ? '90' : '60'} !important;
        box-shadow: ${isDarkMode 
          ? `0 0 20px ${theme.shadow},
             0 0 10px ${theme.glow.replace('0.4', '0.15')},
             inset 0 0 20px ${theme.shadow}`
          : `0 1px 3px rgba(0, 0, 0, 0.05),
             0 2px 8px rgba(0, 0, 0, 0.03)`
        };
      }

      .btn-secondary:hover {
        background: ${theme.primary.main}${isDarkMode ? '20' : '08'} !important;
        border-color: ${theme.primary.main} !important;
        ${isDarkMode ? `
          box-shadow: 0 0 30px ${theme.shadow},
                      0 0 15px ${theme.glow.replace('0.4', '0.25')},
                      inset 0 0 25px ${theme.shadow} !important;
        ` : `
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06),
                      0 4px 12px rgba(0, 0, 0, 0.04) !important;
        `}
      }

      /* Skill badge hover - Effets très propres en mode sombre */
      .skill-badge:hover {
        background: ${isDarkMode ? theme.glow.replace('0.4', '0.15') : theme.primary.main + '08'};
        border-color: ${theme.primary.main}${isDarkMode ? '60' : '40'};
        box-shadow: ${isDarkMode 
          ? `0 0 25px ${theme.shadow},
             0 0 15px ${theme.glow.replace('0.4', '0.2')},
             0 4px 12px rgba(0, 0, 0, 0.3)`
          : `0 2px 4px rgba(0, 0, 0, 0.06),
             0 4px 12px rgba(0, 0, 0, 0.04)`
        };
      }

      /* Glow effects - Effets de lueur très propres en mode sombre */
      .glow-effect {
        box-shadow: ${isDarkMode 
          ? `0 0 25px ${theme.shadow},
             0 0 50px ${theme.shadow.replace('0.2', '0.1')},
             0 0 75px ${theme.shadow.replace('0.2', '0.05')},
             0 4px 20px rgba(0, 0, 0, 0.4)`
          : `0 2px 8px ${theme.shadow.replace('0.2', '0.08')},
             0 4px 16px ${theme.shadow.replace('0.2', '0.05')}`
        };
      }

      /* Neon border */
      .neon-border {
        background: linear-gradient(to right, rgba(255,255,255,0.03), rgba(255,255,255,0.03)) padding-box,
                    linear-gradient(90deg, ${theme.glow}, ${theme.primary.main}80, ${theme.primary.dark}80, ${theme.glow}) border-box;
      }

      /* Card hover effect - Effet de survol très propre en mode sombre */
      .card::before {
        background: linear-gradient(45deg, ${theme.primary.main}, ${theme.primary.light}, ${theme.primary.dark}, ${theme.primary.main});
        opacity: ${isDarkMode ? '0.4' : '0.05'} !important;
      }

      /* Input focus styles - Focus très propre en mode clair */
      input:focus, textarea:focus {
        border-color: ${theme.primary.main}${isDarkMode ? '80' : '60'} !important;
        box-shadow: ${isDarkMode 
          ? `0 0 0 2px ${theme.shadow}`
          : `0 0 0 3px ${theme.primary.main}15,
             0 1px 2px rgba(0, 0, 0, 0.05)`
        } !important;
      }

      /* Glass effect with theme tint - Bordure très propre en mode sombre */
      .glass-effect-strong {
        border-color: ${isDarkMode ? theme.primary.main + '30' : 'rgba(0, 0, 0, 0.08)'} !important;
      }

      /* Particles color - Particules très propres en mode sombre */
      .particle {
        background-color: ${theme.primary.main}${isDarkMode ? '50' : '20'} !important;
      }

      /* Section backgrounds for light mode - Sections très propres */
      section {
        ${!isDarkMode ? `
          --section-bg: rgba(255, 255, 255, 1);
        ` : ''}
      }

      /* Border colors - Bordures très subtiles en mode clair */
      .border-white\\/10, .border-white\\/5 {
        border-color: ${isDarkMode ? '' : 'rgba(0, 0, 0, 0.06)'} !important;
      }

      /* Shadow adjustments for light mode - Ombres très douces et propres */
      ${!isDarkMode ? `
        .shadow-lg {
          --tw-shadow: 0 4px 12px rgba(0, 0, 0, 0.04) !important;
        }
        .shadow-xl {
          --tw-shadow: 0 8px 24px rgba(0, 0, 0, 0.06) !important;
        }
        .shadow-2xl {
          --tw-shadow: 0 12px 32px rgba(0, 0, 0, 0.08) !important;
        }
      ` : ''}

      /* Headings in light mode - Titres très propres */
      h1, h2, h3, h4, h5, h6 {
        color: ${isDarkMode ? '' : '#111827'};
      }

      /* Text shadow adjustments - Ombres de texte très propres en mode sombre */
      .text-shadow {
        text-shadow: ${isDarkMode ? '0 2px 8px rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.3)' : 'none'};
      }
    `;

    if (!document.head.contains(style)) {
      document.head.appendChild(style);
    }
  }, [theme, isDarkMode]);

  return null; // This component doesn't render anything
};

export default ThemeApplier;
