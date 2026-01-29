import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useCallback } from 'react';
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaPaperPlane
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { portfolioApi } from '../api/portfolio';

const Contact = ({ data = {}, slug }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { theme, isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  // Safe parsing for objects - handle JSON strings or null
  const parseObjectIfNeeded = (value, defaultValue) => {
    if (!value) return defaultValue;
    if (typeof value === 'object' && !Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : defaultValue;
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  };

  // Extraire les donnees du portfolio
  const {
    contact_info: rawContactInfo,
    social_links: rawSocialLinks
  } = data;

  const contact_info = parseObjectIfNeeded(rawContactInfo, { email: 'votre.email@example.com', phone: '+33 6 12 34 56 78', location: 'Paris, France' });
  const social_links = parseObjectIfNeeded(rawSocialLinks, { github: '', linkedin: '', twitter: '' });

  // Construire les informations de contact
  const contactInfoList = [
    {
      icon: <FaEnvelope />,
      title: 'Email',
      value: contact_info.email || 'votre.email@example.com',
      link: contact_info.email ? `mailto:${contact_info.email}` : null
    },
    {
      icon: <FaPhone />,
      title: 'Telephone',
      value: contact_info.phone || '+33 6 12 34 56 78',
      link: contact_info.phone ? `tel:${contact_info.phone.replace(/\s/g, '')}` : null
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Localisation',
      value: contact_info.location || 'Paris, France',
      link: null
    }
  ].filter(info => info.value);

  // Construire les liens sociaux
  const socialLinksList = [
    social_links.github && { icon: <FaGithub />, href: social_links.github, label: 'GitHub', color: 'hover:text-gray-400' },
    social_links.linkedin && { icon: <FaLinkedin />, href: social_links.linkedin, label: 'LinkedIn', color: 'hover:text-blue-500' },
    social_links.twitter && { icon: <FaTwitter />, href: social_links.twitter, label: 'Twitter', color: 'hover:text-sky-500' },
  ].filter(Boolean);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!slug) {
      setSubmitError('Impossible d\'envoyer le message (slug manquant).');
      return;
    }

    setIsSubmitting(true);

    try {
      await portfolioApi.sendContact(slug, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || undefined,
        message: formData.message.trim(),
      });

      setSubmitSuccess('Votre message a bien été envoyé.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        'Impossible d\'envoyer le message. Veuillez réessayer.';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, [slug, formData]);

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
    <section id="contact" className="section-padding relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/2 w-96 h-96 rounded-full filter blur-3xl"
          style={{ backgroundColor: theme.primary.main + '1a' }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full filter blur-3xl"
          style={{ backgroundColor: theme.primary.dark + '15' }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 10,
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
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Contactez-<span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>moi</span>
          </h2>
          <div className={`w-20 h-1 bg-gradient-to-r ${theme.gradient} mx-auto rounded-full mb-4`} />
          <p className={`max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Une question, un projet ou simplement envie d'échanger ? N'hésitez pas à me contacter
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Side - Contact Info */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div>
              <h3 className={`text-2xl font-bold mb-6 bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                Restons en contact
              </h3>
              <p className={`leading-relaxed mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Je suis toujours ouvert aux nouvelles opportunités et collaborations.
                N'hésitez pas à me contacter par le biais de vos préférences.
              </p>
            </div>

            {/* Contact Information Cards */}
            <div className="space-y-4">
              {contactInfoList.map((info, index) => (
                <motion.div
                  key={index}
                  className="card flex items-center gap-4 group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="text-3xl group-hover:scale-110 transition-transform duration-300" style={{ color: theme.primary.main }}>
                    {info.icon}
                  </div>
                  <div>
                    <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{info.title}</div>
                    {info.link ? (
                      <a
                        href={info.link}
                        className={`transition-colors font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                        style={{ '--hover-color': theme.primary.main }}
                        onMouseEnter={(e) => e.currentTarget.style.color = theme.primary.main}
                        onMouseLeave={(e) => e.currentTarget.style.color = isDarkMode ? 'white' : '#1f2937'}
                      >
                        {info.value}
                      </a>
                    ) : (
                      <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{info.value}</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            {socialLinksList.length > 0 && (
              <div>
                <h4 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Suivez-moi
                </h4>
                <div className="flex gap-4">
                  {socialLinksList.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`glass-effect p-4 rounded-lg text-2xl transition-all duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} ${social.color}`}
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.label}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div variants={itemVariants}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitError && (
                <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-lg">
                  {submitError}
                </div>
              )}
              {submitSuccess && (
                <div className="text-sm text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-lg">
                  {submitSuccess}
                </div>
              )}
              {/* Name */}
              <div>
                <label htmlFor="name" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Nom complet
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 glass-effect rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'}`}
                  placeholder="Votre nom"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 glass-effect rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'}`}
                  placeholder="votre@email.com"
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Sujet
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 glass-effect rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'}`}
                  placeholder="Sujet de votre message"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className={`w-full px-4 py-3 glass-effect rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'}`}
                  placeholder="Votre message..."
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="btn-primary w-full flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Envoyer le message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;
