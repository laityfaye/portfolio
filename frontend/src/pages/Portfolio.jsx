import { useState, useEffect, useMemo } from 'react';
import { getProfileImageUrl } from '../utils/imageUtils';
import { useParams, useSearchParams } from 'react-router-dom';
import { portfolioApi } from '../api/portfolio';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import ThemeApplier from '../components/ThemeApplier';

// Template Classic (layout actuel)
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import PortfolioMinimal from '../templates/PortfolioMinimal';
import PortfolioElegant from '../templates/PortfolioElegant';
import PortfolioLuxe from '../templates/PortfolioLuxe';
import PortfolioSEO from '../components/PortfolioSEO';

const PortfolioContent = ({ data, slug }) => {
  const { isDarkMode } = useTheme();
  const portfolioData = data || {};
  const skills = data?.skills || [];
  const projects = data?.projects || [];
  const template = data?.template || 'classic';

  // Preload critical images
  useEffect(() => {
    if (portfolioData?.profile_image) {
      const profileImageUrl = getProfileImageUrl(portfolioData.profile_image);
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = profileImageUrl;
      link.setAttribute('fetchpriority', 'high');
      document.head.appendChild(link);
      
      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [portfolioData?.profile_image]);

  if (template === 'minimal') {
    return <PortfolioMinimal data={data} slug={slug} />;
  }
  if (template === 'elegant') {
    return <PortfolioElegant data={data} slug={slug} />;
  }
  if (template === 'luxe') {
    return <PortfolioLuxe data={data} slug={slug} />;
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
        <Contact data={portfolioData} slug={slug} />
      </main>
      <Footer data={portfolioData} />
    </div>
  );
};

const Portfolio = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Preview mode params (from dashboard theme editor)
  const isPreview = searchParams.get('preview') === '1';
  const previewTemplate = searchParams.get('template');
  const previewColor = searchParams.get('color');
  const previewMode = searchParams.get('mode');

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await portfolioApi.getPublic(slug);
        setData(response.data);
      } catch (err) {
        const msg = err.response?.data?.message || 'Portfolio non trouve';
        const code = err.response?.data?.code;
        setError({ message: msg, code });
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [slug]);

  // Merge data with preview overrides
  const displayData = useMemo(() => {
    if (!data) return null;
    if (!isPreview) return data;

    return {
      ...data,
      template: previewTemplate || data.template,
      theme_color: previewColor || data.theme_color,
      theme_mode: previewMode || data.theme_mode,
    };
  }, [data, isPreview, previewTemplate, previewColor, previewMode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    const msg = typeof error === 'string' ? error : error?.message || 'Portfolio non trouvé';
    const isExpired = typeof error === 'object' && error?.code === 'PORTFOLIO_EXPIRED';
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900 text-white px-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold mb-4">
            {isExpired ? 'Portfolio hors ligne' : 'Portfolio non trouvé'}
          </h1>
          <p className="text-gray-400 mb-6">{msg}</p>
          {isExpired && (
            <p className="text-sm text-gray-500">
              Connectez-vous à votre espace client pour renouveler votre abonnement et remettre votre portfolio en ligne.
            </p>
          )}
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
      <PortfolioSEO data={displayData} slug={slug} />
      <PortfolioContent data={displayData} slug={slug} />
    </ThemeProvider>
  );
};

export default Portfolio;
