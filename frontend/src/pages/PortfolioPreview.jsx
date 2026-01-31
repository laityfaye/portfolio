import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { portfolioApi } from '../api/portfolio';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import ThemeApplier from '../components/ThemeApplier';

// Template Classic
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import PortfolioMinimal from '../templates/PortfolioMinimal';

const PortfolioPreviewContent = ({ data }) => {
  const { isDarkMode } = useTheme();
  const portfolioData = data || {};
  const skills = data?.skills || [];
  const projects = data?.projects || [];
  const template = data?.template || 'classic';

  if (template === 'minimal') {
    return <PortfolioMinimal data={data} slug="preview" isPreview={true} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-dark-900' : 'bg-slate-50'}`}>
      <ThemeApplier />
      <Navbar data={portfolioData} hideThemeSelector={true} />
      <main>
        <Hero data={portfolioData} />
        <About data={portfolioData} />
        <Skills skills={skills} />
        <Projects projects={projects} socialLinks={portfolioData?.social_links} />
        <Contact data={portfolioData} slug="preview" isPreview={true} />
      </main>
      <Footer data={portfolioData} />
    </div>
  );
};

const PortfolioPreview = () => {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Preview params from ThemeEditor
  const previewTemplate = searchParams.get('template');
  const previewColor = searchParams.get('color');
  const previewMode = searchParams.get('mode');

  // Check if user is authenticated
  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    if (!token) {
      setError('Non authentifié');
      setLoading(false);
      return;
    }

    const fetchPortfolio = async () => {
      try {
        const response = await portfolioApi.getPreview();
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [token]);

  // Merge data with preview overrides
  const displayData = useMemo(() => {
    if (!data) return null;

    return {
      ...data,
      template: previewTemplate || data.template,
      theme_color: previewColor || data.theme_color,
      theme_mode: previewMode || data.theme_mode,
    };
  }, [data, previewTemplate, previewColor, previewMode]);

  if (!token) {
    return <Navigate to="/p/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Erreur</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  // Use preview settings or portfolio's theme settings
  const initialTheme = displayData?.theme_color || 'cyan';
  const initialMode = displayData?.theme_mode === 'light' ? false : true;

  return (
    <ThemeProvider
      initialTheme={initialTheme}
      initialMode={initialMode}
      disableLocalStorage={true}
    >
      <PortfolioPreviewContent data={displayData} />
    </ThemeProvider>
  );
};

export default PortfolioPreview;
