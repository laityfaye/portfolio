import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import ThemeApplier from '../components/ThemeApplier';

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
import { getPublicImageUrl } from '../utils/imageUtils';

/** Données de démo pour l'aperçu sur la page d'accueil - identique au ThemeEditor */
const DEMO_DATA = {
  display_name: 'Laity FAYE',
  job_title: 'Développeur Full Stack',
  hero_description: "Je crée des expériences web exceptionnelles avec des technologies modernes. Passionné par le code propre et l'innovation.",
  profile_image: getPublicImageUrl('images/profile.jpeg'),
  hero_stats: [
    { value: 5, suffix: '+', label: "Années d'expérience" },
    { value: 50, suffix: '+', label: 'Projets réalisés' },
    { value: 100, suffix: '%', label: 'Satisfaction client' },
  ],
  about_paragraph_1: "Passionné par le développement web et les nouvelles technologies, je transforme des idées créatives en solutions digitales performantes. Mon expertise s'étend du frontend au backend avec une approche orientée qualité et performance.",
  about_paragraph_2: '',
  about_highlights: [
    { icon: 'FaUser', title: 'Qui suis-je ?', description: 'Développeur passionné avec expertise full-stack' },
    { icon: 'FaBriefcase', title: 'Expérience', description: '5+ années en développement web moderne' },
    { icon: 'FaGraduationCap', title: 'Formation', description: 'Diplômé en Ingénierie Informatique' },
  ],
  about_stats: null,
  contact_info: { email: 'contact@example.com', phone: '+221 77 123 45 67', location: 'Dakar, Sénégal' },
  social_links: { github: 'https://github.com', linkedin: 'https://linkedin.com', twitter: 'https://twitter.com' },
  brand_name: 'InnoSoft',
  theme_color: 'cyan',
  theme_mode: 'dark',
  template: 'classic',
  skills: [
    { id: 1, name: 'React', icon: 'FaReact', level: 95, category: 'frontend', sort_order: 0 },
    { id: 2, name: 'TypeScript', icon: 'SiTypescript', level: 90, category: 'frontend', sort_order: 1 },
    { id: 3, name: 'Node.js', icon: 'FaNodeJs', level: 88, category: 'backend', sort_order: 2 },
    { id: 4, name: 'Tailwind', icon: 'SiTailwindcss', level: 92, category: 'frontend', sort_order: 3 },
  ],
  projects: [
    { id: 1, title: 'E-Commerce Platform', description: 'Plateforme complète avec panier et paiement', category: 'Web', tags: ['React', 'Node.js'], featured: true, sort_order: 0 },
    { id: 2, title: 'Task Manager Pro', description: 'Application collaborative de gestion de tâches', category: 'Web', tags: ['React', 'Firebase'], featured: false, sort_order: 1 },
    { id: 3, title: 'Portfolio Designer', description: 'Outil de création de portfolio en ligne', category: 'Web', tags: ['Next.js', 'TypeScript'], featured: true, sort_order: 2 },
  ],
};

const PortfolioDemoContent = ({ data }) => {
  const { isDarkMode } = useTheme();
  const portfolioData = data || {};
  const skills = data?.skills || [];
  const projects = data?.projects || [];
  const template = data?.template || 'classic';

  if (template === 'minimal') {
    return <PortfolioMinimal data={data} slug="demo" isPreview={true} />;
  }
  if (template === 'elegant') {
    return <PortfolioElegant data={data} slug="demo" isPreview={true} />;
  }
  if (template === 'luxe') {
    return <PortfolioLuxe data={data} slug="demo" isPreview={true} />;
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
        <Contact data={portfolioData} slug="demo" isPreview={true} />
      </main>
      <Footer data={portfolioData} />
    </div>
  );
};

const PortfolioDemo = () => {
  const [searchParams] = useSearchParams();

  const previewTemplate = searchParams.get('template') || 'classic';
  const previewColor = searchParams.get('color') || 'cyan';
  const previewMode = searchParams.get('mode') || 'dark';

  const displayData = useMemo(() => ({
    ...DEMO_DATA,
    template: previewTemplate,
    theme_color: previewColor,
    theme_mode: previewMode,
  }), [previewTemplate, previewColor, previewMode]);

  const initialTheme = previewColor;
  const initialMode = previewMode === 'light' ? false : true;

  return (
    <ThemeProvider
      initialTheme={initialTheme}
      initialMode={initialMode}
      disableLocalStorage={true}
    >
      <PortfolioDemoContent data={displayData} />
    </ThemeProvider>
  );
};

export default PortfolioDemo;
