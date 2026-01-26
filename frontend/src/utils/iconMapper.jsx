import {
  FaReact, FaNodeJs, FaPython, FaDocker, FaGitAlt, FaDatabase,
  FaHtml5, FaCss3Alt, FaJs, FaUser, FaBriefcase, FaGraduationCap,
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaTwitter,
  FaAws, FaVuejs, FaAngular, FaPhp, FaJava, FaSwift
} from 'react-icons/fa';
import {
  SiTypescript, SiMongodb, SiPostgresql, SiTailwindcss, SiNextdotjs,
  SiExpress, SiRedux, SiGraphql, SiFirebase, SiMysql, SiLaravel,
  SiDjango, SiFlutter, SiKotlin, SiRust, SiGo
} from 'react-icons/si';

const iconMap = {
  // Frontend
  FaReact,
  FaVuejs,
  FaAngular,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  SiTypescript,
  SiTailwindcss,
  SiNextdotjs,
  SiRedux,

  // Backend
  FaNodeJs,
  FaPython,
  FaPhp,
  FaJava,
  SiExpress,
  SiLaravel,
  SiDjango,
  SiGraphql,
  SiGo,
  SiRust,

  // Database & Tools
  FaDocker,
  FaGitAlt,
  FaDatabase,
  FaAws,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiFirebase,

  // Mobile
  SiFlutter,
  SiKotlin,
  FaSwift,

  // About highlights icons
  FaUser,
  FaBriefcase,
  FaGraduationCap,

  // Contact icons
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,

  // Social icons
  FaGithub,
  FaLinkedin,
  FaTwitter,
};

export const getIcon = (iconName) => {
  const Icon = iconMap[iconName];
  return Icon ? <Icon /> : null;
};

export const getIconComponent = (iconName) => {
  return iconMap[iconName] || null;
};

export const availableIcons = Object.keys(iconMap);

export const skillIcons = [
  // Frontend
  { name: 'FaReact', label: 'React' },
  { name: 'FaVuejs', label: 'Vue.js' },
  { name: 'FaAngular', label: 'Angular' },
  { name: 'FaHtml5', label: 'HTML5' },
  { name: 'FaCss3Alt', label: 'CSS3' },
  { name: 'FaJs', label: 'JavaScript' },
  { name: 'SiTypescript', label: 'TypeScript' },
  { name: 'SiTailwindcss', label: 'Tailwind CSS' },
  { name: 'SiNextdotjs', label: 'Next.js' },
  { name: 'SiRedux', label: 'Redux' },
  // Backend
  { name: 'FaNodeJs', label: 'Node.js' },
  { name: 'FaPython', label: 'Python' },
  { name: 'FaPhp', label: 'PHP' },
  { name: 'FaJava', label: 'Java' },
  { name: 'SiExpress', label: 'Express' },
  { name: 'SiLaravel', label: 'Laravel' },
  { name: 'SiDjango', label: 'Django' },
  { name: 'SiGraphql', label: 'GraphQL' },
  { name: 'SiGo', label: 'Go' },
  { name: 'SiRust', label: 'Rust' },
  // Database
  { name: 'FaDatabase', label: 'Database' },
  { name: 'SiMongodb', label: 'MongoDB' },
  { name: 'SiPostgresql', label: 'PostgreSQL' },
  { name: 'SiMysql', label: 'MySQL' },
  { name: 'SiFirebase', label: 'Firebase' },
  // Tools
  { name: 'FaDocker', label: 'Docker' },
  { name: 'FaGitAlt', label: 'Git' },
  { name: 'FaAws', label: 'AWS' },
];

export default iconMap;
