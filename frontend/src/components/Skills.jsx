import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getIcon } from '../utils/iconMapper';

const Skills = ({ skills: rawSkills = [] }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { theme, isDarkMode } = useTheme();

  // Safe parsing for skills - handle JSON strings or null
  const parseIfNeeded = (value, defaultValue) => {
    if (!value) return defaultValue;
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : defaultValue;
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  };

  const skills = parseIfNeeded(rawSkills, []);

  // Grouper les skills par categorie
  const categories = [
    { key: 'frontend', title: 'Frontend' },
    { key: 'backend', title: 'Backend' },
    { key: 'database_tools', title: 'Database & Tools' }
  ];

  // Grouper les skills
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'frontend';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  // Donnees par defaut si pas de skills
  const defaultSkills = {
    frontend: [
      { name: 'React', icon: 'FaReact', level: 95 },
      { name: 'TypeScript', icon: 'SiTypescript', level: 90 },
      { name: 'Next.js', icon: 'SiNextdotjs', level: 85 },
      { name: 'Tailwind CSS', icon: 'SiTailwindcss', level: 92 },
    ],
    backend: [
      { name: 'Node.js', icon: 'FaNodeJs', level: 90 },
      { name: 'Express', icon: 'SiExpress', level: 88 },
      { name: 'Python', icon: 'FaPython', level: 85 },
    ],
    database_tools: [
      { name: 'MongoDB', icon: 'SiMongodb', level: 87 },
      { name: 'PostgreSQL', icon: 'SiPostgresql', level: 85 },
      { name: 'Docker', icon: 'FaDocker', level: 80 },
      { name: 'Git', icon: 'FaGitAlt', level: 93 },
    ]
  };

  // Utiliser les skills fournis ou les valeurs par defaut
  const displaySkills = skills.length > 0 ? groupedSkills : defaultSkills;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  return (
    <section id="skills" className="section-padding relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full filter blur-3xl"
          style={{ backgroundColor: theme.primary.main + '1a' }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/4 right-0 w-80 h-80 rounded-full filter blur-3xl"
          style={{ backgroundColor: theme.primary.dark + '15' }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
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
            Mes <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>Compétences</span>
          </h2>
          <div className={`w-16 sm:w-20 h-1 bg-gradient-to-r ${theme.gradient} mx-auto rounded-full mb-2 sm:mb-4`} />
          <p className={`text-sm sm:text-base max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Technologies et outils que je maîtrise pour créer des solutions modernes et performantes
          </p>
        </motion.div>

        {/* Skills Categories */}
        <div className="space-y-6 sm:space-y-12">
          {categories.map((category, categoryIndex) => {
            const categorySkills = displaySkills[category.key] || [];
            if (categorySkills.length === 0) return null;

            return (
              <motion.div
                key={category.key}
                variants={itemVariants}
                className="space-y-3 sm:space-y-6"
              >
                {/* Category Title */}
                <h3 className="text-lg sm:text-3xl font-bold text-center sm:text-left">
                  <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                    {category.title}
                  </span>
                </h3>

                {/* Skills Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                  {categorySkills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      className="card group relative overflow-hidden"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ delay: categoryIndex * 0.2 + skillIndex * 0.05 }}
                      whileHover={{ y: -5 }}
                    >
                      {/* Skill Icon & Name */}
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                        <div className="text-2xl sm:text-4xl" style={{ color: theme.primary.main }}>
                          {getIcon(skill.icon)}
                        </div>
                        <div>
                          <h4 className={`text-xs sm:text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            {skill.name}
                          </h4>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1 sm:space-y-2">
                        <div className="flex justify-between text-[10px] sm:text-sm">
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Niveau</span>
                          <span className="font-semibold" style={{ color: theme.primary.main }}>{skill.level}%</span>
                        </div>
                        <div className={`h-1.5 sm:h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-dark-700' : 'bg-gray-200'}`}>
                          <motion.div
                            className={`h-full bg-gradient-to-r ${theme.gradient} rounded-full`}
                            initial={{ width: 0 }}
                            animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                            transition={{
                              duration: 1,
                              delay: categoryIndex * 0.2 + skillIndex * 0.05 + 0.3,
                              ease: "easeOut"
                            }}
                          />
                        </div>
                      </div>

                      {/* Hover Effect Overlay */}
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none rounded-xl"
                        style={{ background: `linear-gradient(to bottom right, ${theme.primary.main}, ${theme.primary.dark})` }}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Info */}
        <motion.div
          variants={itemVariants}
          className="mt-16 text-center"
        >
          <div className="glass-effect rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
              Toujours en apprentissage
            </h3>
            <p className={`leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              La technologie évolue constamment, et moi aussi. Je suis toujours à l'affût des
              dernières tendances et technologies pour offrir les meilleures solutions possibles.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {['Cloud Computing', 'Machine Learning', 'Web3', 'Mobile Development'].map((topic) => (
                <span key={topic} className="skill-badge">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Skills;
