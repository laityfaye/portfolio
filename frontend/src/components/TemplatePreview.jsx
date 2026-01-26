import { motion } from 'framer-motion';
import {
  FaUser, FaCode, FaGithub, FaLinkedin, FaTwitter, FaEnvelope,
  FaPhone, FaMapMarkerAlt, FaExternalLinkAlt, FaStar, FaDownload,
  FaBriefcase, FaGraduationCap, FaArrowDown
} from 'react-icons/fa';
import { SiReact, SiTypescript, SiNodedotjs, SiMongodb, SiTailwindcss, SiNextdotjs } from 'react-icons/si';

const TemplatePreview = ({ theme, isDarkMode }) => {
  // Sample data pour la prévisualisation
  const sampleData = {
    display_name: 'Laity FAYE',
    job_title: 'Developpeur Full Stack',
    hero_description: 'Je cree des experiences web exceptionnelles avec des technologies modernes. Passionne par le code propre et l\'innovation.',
    hero_stats: [
      { value: '5+', label: "Annees d'experience" },
      { value: '50+', label: 'Projets realises' },
      { value: '100%', label: 'Satisfaction client' },
    ],
    about_paragraph: 'Passionne par le developpement web et les nouvelles technologies, je transforme des idees creatives en solutions digitales performantes.',
    about_highlights: [
      { icon: <FaUser />, title: 'Qui suis-je ?', desc: 'Developpeur passionne avec expertise full-stack' },
      { icon: <FaBriefcase />, title: 'Experience', desc: '5+ annees en developpement web moderne' },
      { icon: <FaGraduationCap />, title: 'Formation', desc: 'Diplome en Ingenierie Informatique' },
    ],
    skills: [
      { category: 'Frontend', items: [
        { name: 'React', icon: <SiReact />, level: 95 },
        { name: 'TypeScript', icon: <SiTypescript />, level: 90 },
        { name: 'Next.js', icon: <SiNextdotjs />, level: 85 },
        { name: 'Tailwind', icon: <SiTailwindcss />, level: 92 },
      ]},
      { category: 'Backend', items: [
        { name: 'Node.js', icon: <SiNodedotjs />, level: 88 },
        { name: 'MongoDB', icon: <SiMongodb />, level: 85 },
      ]},
    ],
    projects: [
      { title: 'E-Commerce Platform', desc: 'Plateforme complete avec panier et paiement Stripe', tags: ['React', 'Node.js', 'Stripe'], featured: true },
      { title: 'Task Manager Pro', desc: 'Application collaborative de gestion de taches', tags: ['React', 'Firebase', 'Tailwind'], featured: false },
      { title: 'Portfolio Designer', desc: 'Outil de creation de portfolio en ligne', tags: ['Next.js', 'TypeScript', 'Prisma'], featured: true },
    ],
    contact: {
      email: 'mamadou.diallo@example.com',
      phone: '+221 77 123 45 67',
      location: 'Dakar, Senegal',
    },
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
    },
  };

  return (
    <div className={`w-full ${isDarkMode ? 'bg-dark-900' : 'bg-slate-50'}`}>
      {/* HERO SECTION */}
      <section className={`relative py-12 px-6 ${isDarkMode ? 'bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900' : 'bg-gradient-to-br from-white via-gray-50 to-white'}`}>
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-0 left-0 w-64 h-64 rounded-full filter blur-3xl opacity-20"
            style={{ backgroundColor: theme.primary.main }}
          />
          <div
            className="absolute bottom-0 right-0 w-80 h-80 rounded-full filter blur-3xl opacity-15"
            style={{ backgroundColor: theme.primary.dark }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Photo */}
            <div className="relative">
              <div className={`w-36 h-36 md:w-44 md:h-44 rounded-full bg-gradient-to-r ${theme.gradient} p-1 shadow-xl`}>
                <div className={`w-full h-full rounded-full ${isDarkMode ? 'bg-dark-800' : 'bg-gray-100'} flex items-center justify-center overflow-hidden`}>
                  <FaUser className={`text-5xl ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
              </div>
              {/* Badge disponible */}
              <div className="absolute -top-1 -right-1 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-semibold flex items-center gap-1 shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Disponible
              </div>
            </div>

            {/* Content */}
            <div className="text-center md:text-left flex-1">
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-3 ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'}`}
                style={{ color: theme.primary.main }}
              >
                Bienvenue sur mon portfolio
              </span>
              <h1 className={`text-3xl md:text-4xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Salut, je suis{' '}
                <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                  {sampleData.display_name}
                </span>
              </h1>
              <p className={`text-xl font-semibold mb-3 bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                {sampleData.job_title}
              </p>
              <p className={`text-sm mb-5 max-w-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {sampleData.hero_description}
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <button className={`px-5 py-2.5 rounded-xl bg-gradient-to-r ${theme.gradient} text-white text-sm font-semibold shadow-lg`}>
                  Voir mes projets
                </button>
                <button className={`px-5 py-2.5 rounded-xl border-2 text-sm font-semibold ${isDarkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-600'}`}>
                  Me contacter
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-10">
            {sampleData.hero_stats.map((stat, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl text-center backdrop-blur-sm ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200 shadow-sm'}`}
              >
                <div className={`text-2xl md:text-3xl font-black bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-8">
          <FaArrowDown className={`animate-bounce ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className={`py-12 px-6 ${isDarkMode ? 'bg-dark-800/50' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-2xl font-bold mb-6 text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            A propos de{' '}
            <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>moi</span>
          </h2>
          <div className={`w-16 h-1 bg-gradient-to-r ${theme.gradient} mx-auto rounded-full mb-8`} />

          <div className="grid md:grid-cols-2 gap-6">
            {/* Photo */}
            <div className={`aspect-square rounded-xl ${isDarkMode ? 'bg-dark-700' : 'bg-gray-100'} flex items-center justify-center overflow-hidden`}>
              <FaUser className={`text-6xl ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            </div>

            {/* Content */}
            <div>
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {sampleData.about_paragraph}
              </p>
              <div className="space-y-3">
                {sampleData.about_highlights.map((item, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 p-3 rounded-xl ${isDarkMode ? 'bg-dark-700/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}
                  >
                    <div className="text-lg" style={{ color: theme.primary.main }}>{item.icon}</div>
                    <div>
                      <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.title}</h4>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className={`mt-4 px-4 py-2 rounded-xl bg-gradient-to-r ${theme.gradient} text-white text-sm font-semibold flex items-center gap-2`}>
                <FaDownload /> Telecharger CV
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section className={`py-12 px-6 ${isDarkMode ? 'bg-dark-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-2xl font-bold mb-6 text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Mes{' '}
            <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>Competences</span>
          </h2>
          <div className={`w-16 h-1 bg-gradient-to-r ${theme.gradient} mx-auto rounded-full mb-8`} />

          <div className="space-y-8">
            {sampleData.skills.map((category, i) => (
              <div key={i}>
                <h3 className={`text-lg font-bold mb-4 bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                  {category.category}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {category.items.map((skill, j) => (
                    <div
                      key={j}
                      className={`p-4 rounded-xl ${isDarkMode ? 'bg-dark-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl" style={{ color: theme.primary.main }}>{skill.icon}</span>
                        <span className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{skill.name}</span>
                        <span className="ml-auto text-xs font-bold" style={{ color: theme.primary.main }}>{skill.level}%</span>
                      </div>
                      <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-dark-600' : 'bg-gray-200'}`}>
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${theme.gradient}`}
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section className={`py-12 px-6 ${isDarkMode ? 'bg-dark-800/50' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-2xl font-bold mb-6 text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Mes{' '}
            <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>Projets</span>
          </h2>
          <div className={`w-16 h-1 bg-gradient-to-r ${theme.gradient} mx-auto rounded-full mb-6`} />

          {/* Filters */}
          <div className="flex gap-2 justify-center mb-6 flex-wrap">
            {['Tous', 'Web', 'Mobile', 'Fullstack'].map((filter, i) => (
              <button
                key={i}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  i === 0
                    ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg`
                    : isDarkMode ? 'bg-dark-700 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleData.projects.map((project, i) => (
              <div
                key={i}
                className={`rounded-xl overflow-hidden ${isDarkMode ? 'bg-dark-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'} hover:shadow-xl transition-shadow`}
              >
                <div className={`aspect-video relative ${isDarkMode ? 'bg-dark-700' : 'bg-gray-200'}`}>
                  {project.featured && (
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-xs font-semibold flex items-center gap-1">
                      <FaStar className="text-[10px]" /> Featured
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-12 h-12 rounded-xl ${isDarkMode ? 'bg-dark-600' : 'bg-gray-300'} flex items-center justify-center`}>
                      <FaCode className={`text-xl ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <span className="p-2 rounded-full bg-white/20 text-white"><FaGithub /></span>
                    <span className="p-2 rounded-full bg-white/20 text-white"><FaExternalLinkAlt /></span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className={`font-bold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{project.title}</h3>
                  <p className={`text-xs mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{project.desc}</p>
                  <div className="flex flex-wrap gap-1">
                    {project.tags.map((tag, j) => (
                      <span
                        key={j}
                        className={`text-xs px-2 py-0.5 rounded-full border ${isDarkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-500'}`}
                        style={{ borderColor: isDarkMode ? theme.primary.main + '50' : theme.primary.main + '30' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className={`py-12 px-6 ${isDarkMode ? 'bg-dark-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-2xl font-bold mb-6 text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Contactez-
            <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>moi</span>
          </h2>
          <div className={`w-16 h-1 bg-gradient-to-r ${theme.gradient} mx-auto rounded-full mb-8`} />

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-4">
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Je suis toujours ouvert aux nouvelles opportunites. N'hesitez pas a me contacter !
              </p>

              {[
                { icon: <FaEnvelope />, label: 'Email', value: sampleData.contact.email },
                { icon: <FaPhone />, label: 'Telephone', value: sampleData.contact.phone },
                { icon: <FaMapMarkerAlt />, label: 'Localisation', value: sampleData.contact.location },
              ].map((info, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 p-4 rounded-xl ${isDarkMode ? 'bg-dark-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'}`}
                >
                  <div className="text-xl" style={{ color: theme.primary.main }}>{info.icon}</div>
                  <div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{info.label}</p>
                    <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{info.value}</p>
                  </div>
                </div>
              ))}

              {/* Social Links */}
              <div className="flex gap-3 pt-2">
                {[
                  { icon: <FaGithub />, color: 'hover:text-gray-400' },
                  { icon: <FaLinkedin />, color: 'hover:text-blue-500' },
                  { icon: <FaTwitter />, color: 'hover:text-sky-500' },
                ].map((social, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl text-xl cursor-pointer transition-colors ${isDarkMode ? 'bg-dark-800 text-gray-400' : 'bg-white text-gray-500 shadow-sm'} ${social.color}`}
                  >
                    {social.icon}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-dark-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'}`}>
              <div className="space-y-4">
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Nom complet</label>
                  <input
                    type="text"
                    placeholder="Votre nom"
                    className={`w-full px-4 py-2.5 rounded-lg text-sm ${isDarkMode ? 'bg-dark-700 text-white placeholder-gray-500 border-gray-600' : 'bg-gray-50 text-gray-800 placeholder-gray-400 border-gray-200'} border focus:outline-none focus:ring-2`}
                    style={{ '--tw-ring-color': theme.primary.main + '50' }}
                    disabled
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email</label>
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    className={`w-full px-4 py-2.5 rounded-lg text-sm ${isDarkMode ? 'bg-dark-700 text-white placeholder-gray-500 border-gray-600' : 'bg-gray-50 text-gray-800 placeholder-gray-400 border-gray-200'} border`}
                    disabled
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Message</label>
                  <textarea
                    placeholder="Votre message..."
                    rows="3"
                    className={`w-full px-4 py-2.5 rounded-lg text-sm resize-none ${isDarkMode ? 'bg-dark-700 text-white placeholder-gray-500 border-gray-600' : 'bg-gray-50 text-gray-800 placeholder-gray-400 border-gray-200'} border`}
                    disabled
                  />
                </div>
                <button className={`w-full px-4 py-3 rounded-xl bg-gradient-to-r ${theme.gradient} text-white font-semibold flex items-center justify-center gap-2 shadow-lg`}>
                  <FaEnvelope /> Envoyer le message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`py-6 px-6 border-t ${isDarkMode ? 'border-gray-800 bg-dark-900' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
            © 2025 Portfolio. Cree avec ❤️ par {sampleData.display_name}
          </p>
          <p className={`text-xs ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
            Propulse par InnoSoft Portfolio
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TemplatePreview;
