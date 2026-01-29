import { useState, useEffect } from 'react';
import { getProfileImageUrl } from '../utils/imageUtils';
import { useParams } from 'react-router-dom';
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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await portfolioApi.getPublic(slug);
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Portfolio non trouve');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [slug]);

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
          <h1 className="text-4xl font-bold mb-4">Portfolio non trouve</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  // Use the portfolio's theme settings
  const initialTheme = data?.theme_color || 'cyan';
  const initialMode = data?.theme_mode === 'light' ? false : true; // Convert 'dark'/'light' to boolean

  return (
    <ThemeProvider 
      initialTheme={initialTheme} 
      initialMode={initialMode}
      disableLocalStorage={true}
    >
      <PortfolioContent data={data} slug={slug} />
    </ThemeProvider>
  );
};

export default Portfolio;
