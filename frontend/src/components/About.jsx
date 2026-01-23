import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaDownload, FaUser, FaBriefcase, FaGraduationCap } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { theme, isDarkMode } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const highlights = [
    {
      icon: <FaUser />,
      title: 'Qui suis-je ?',
      description: 'Développeur passionné avec une expertise en développement web full-stack et une soif constante d\'apprentissage.'
    },
    {
      icon: <FaBriefcase />,
      title: 'Expérience',
      description: '5+ années d\'expérience dans la création d\'applications web modernes et performantes pour divers clients.'
    },
    {
      icon: <FaGraduationCap />,
      title: 'Formation',
      description: 'Diplômé en Ingénierie Informatique avec une spécialisation en développement logiciel et architecture système.'
    }
  ];

  return (
    <section id="about" className={`section-padding relative overflow-hidden ${isDarkMode ? 'bg-dark-800/50' : 'bg-white'}`}>
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 rounded-full filter blur-3xl"
          style={{ backgroundColor: theme.primary.main + '1a' }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full filter blur-3xl"
          style={{ backgroundColor: theme.primary.light + '15' }}
          animate={{
            scale: [1.1, 0.9, 1.1],
            opacity: [0.1, 0.18, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <motion.div
        ref={ref}
        className="container-custom relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-5xl font-bold mb-2 sm:mb-4">
            À propos de <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>moi</span>
          </h2>
          <div className={`w-16 sm:w-20 h-1 bg-gradient-to-r ${theme.gradient} mx-auto rounded-full`} />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-12 items-center">
          {/* Left Side - Image & Info */}
          <motion.div variants={itemVariants} className="space-y-4 sm:space-y-6">
            {/* Profile Image */}
            <div className="relative group">
              <motion.div
                className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-8 aspect-square flex items-center justify-center overflow-hidden relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-purple-500/20" />

                {/* Profile Image */}
                <img
                  src="/images/profile.jpeg"
                  alt="Profile"
                  className="relative z-10 w-full h-full object-cover rounded-lg"
                />

                {/* Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-primary-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-12 h-12 sm:w-24 sm:h-24 border-2 sm:border-4 border-primary-500 rounded-full"
                animate={{
                  rotate: 360
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <motion.div
                className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-16 h-16 sm:w-32 sm:h-32 border-2 sm:border-4 border-purple-500 rounded-full"
                animate={{
                  rotate: -360
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>

            {/* Quick Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-2 sm:gap-4"
            >
              <div className="glass-effect rounded-lg p-2 sm:p-4 text-center">
                <div className="text-xl sm:text-3xl font-bold gradient-text mb-1">150+</div>
                <div className={`text-[10px] sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Commits GitHub</div>
              </div>
              <div className="glass-effect rounded-lg p-2 sm:p-4 text-center">
                <div className="text-xl sm:text-3xl font-bold gradient-text mb-1">25+</div>
                <div className={`text-[10px] sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Technologies</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div variants={itemVariants} className="space-y-4 sm:space-y-6">
            <div className={`prose max-w-none ${isDarkMode ? 'prose-invert' : ''}`}>
              <p className={`text-sm sm:text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Passionné par le développement web et les nouvelles technologies, je transforme
                des idées créatives en solutions digitales performantes et élégantes.
              </p>
              <p className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Mon parcours m'a permis de maîtriser l'ensemble du cycle de développement,
                de la conception à la mise en production. Je privilégie toujours l'écriture
                de code propre, maintenable et performant, tout en restant à l'écoute des
                besoins utilisateurs.
              </p>
            </div>

            {/* Highlights */}
            <div className="space-y-3 sm:space-y-4">
              {highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  className="card flex items-start gap-3 sm:gap-4 group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div className="text-xl sm:text-3xl mt-1 group-hover:scale-110 transition-transform duration-300" style={{ color: theme.primary.main }}>
                    {highlight.icon}
                  </div>
                  <div>
                    <h3 className={`text-base sm:text-xl font-semibold mb-1 sm:mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      {highlight.title}
                    </h3>
                    <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {highlight.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Download CV Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 1 }}
            >
              <motion.a
                href="#"
                className="btn-primary inline-flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaDownload />
                Télécharger mon CV
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
