import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ThemeApplier from './components/ThemeApplier';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const AppContent = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-dark-900' : 'bg-slate-50'}`}>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ThemeApplier />
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
