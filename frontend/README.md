# Portfolio Ingénieur Logiciel

Un portfolio moderne et élégant créé avec React, Tailwind CSS et Framer Motion. Ce projet présente un design exceptionnel avec des animations fluides et des effets visuels immersifs.

## ✨ Caractéristiques

- **Design Moderne**: Interface utilisateur élégante avec effets de glassmorphisme
- **Animations Fluides**: Animations sophistiquées avec Framer Motion
- **Responsive Design**: Parfaitement adapté à tous les écrans (mobile, tablette, desktop)
- **Performance Optimisée**: Construit avec Vite pour des performances maximales
- **Navigation Intuitive**: Menu de navigation sticky avec défilement fluide
- **Sections Complètes**:
  - Hero avec animations de particules
  - À propos avec informations détaillées
  - Compétences avec barres de progression animées
  - Projets avec filtres et cartes interactives
  - Formulaire de contact fonctionnel
  - Footer avec liens sociaux

## 🛠️ Technologies Utilisées

- **React 19** - Bibliothèque JavaScript pour l'interface utilisateur
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Framework CSS utilitaire
- **Framer Motion** - Bibliothèque d'animations
- **React Icons** - Collection d'icônes populaires
- **Simple Icons** - Icônes de marques et technologies

## 📦 Installation

### Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn

### Étapes d'installation

1. Clonez le repository:
```bash
git clone <votre-repo-url>
cd pfl
```

2. Installez les dépendances:
```bash
npm install
```

3. Lancez le serveur de développement:
```bash
npm run dev
```

4. Ouvrez votre navigateur et accédez à `http://localhost:5173`

## 🚀 Scripts Disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Crée une version de production
- `npm run preview` - Prévisualise la version de production
- `npm run lint` - Vérifie le code avec ESLint

## 🎨 Personnalisation

### Modifier les informations personnelles

1. **Navbar** (`src/components/Navbar.jsx`):
   - Modifiez le logo
   - Changez les liens sociaux

2. **Hero** (`src/components/Hero.jsx`):
   - Changez le nom et le titre
   - Modifiez les statistiques

3. **About** (`src/components/About.jsx`):
   - Ajoutez votre bio
   - Mettez à jour vos points forts

4. **Skills** (`src/components/Skills.jsx`):
   - Ajoutez/supprimez des compétences
   - Modifiez les niveaux de compétence

5. **Projects** (`src/components/Projects.jsx`):
   - Ajoutez vos projets personnels
   - Changez les images et descriptions

6. **Contact** (`src/components/Contact.jsx`):
   - Mettez à jour vos informations de contact
   - Configurez le formulaire pour envoyer des emails

### Personnaliser les couleurs

Les couleurs sont configurées dans `tailwind.config.js`. Vous pouvez modifier:

- `primary`: Couleur principale du thème
- `dark`: Variations de couleurs sombres pour l'arrière-plan

## 📱 Responsive Design

Le portfolio est entièrement responsive avec des breakpoints optimisés:

- **Mobile**: < 640px
- **Tablette**: 640px - 1024px
- **Desktop**: > 1024px

## 🌟 Fonctionnalités Principales

### Animations

- Animations d'entrée au scroll
- Effets de hover interactifs
- Transitions fluides entre les sections
- Particules et effets de fond animés

### Navigation

- Menu sticky qui apparaît au scroll
- Navigation mobile avec menu hamburger
- Défilement fluide vers les sections
- Indicateur de section active

### Performances

- Optimisation des images
- Lazy loading des composants
- Code splitting automatique
- Build optimisé pour la production

## 📄 Structure du Projet

```
pfl/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Skills.jsx
│   │   ├── Projects.jsx
│   │   ├── Contact.jsx
│   │   └── Footer.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

## 🚢 Déploiement

### Vercel (Recommandé)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Puis déployez le dossier 'dist' sur Netlify
```

### GitHub Pages

1. Installez gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Ajoutez dans `package.json`:
```json
{
  "homepage": "https://votre-username.github.io/votre-repo",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Déployez:
```bash
npm run deploy
```

## 🤝 Contribution

Les contributions sont les bienvenues! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**Votre Nom**
- GitHub: [@votre-username](https://github.com/votre-username)
- LinkedIn: [Votre Profil](https://linkedin.com/in/votre-profil)
- Email: votre.email@example.com

## 🙏 Remerciements

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Unsplash](https://unsplash.com/) pour les images

---

Fait avec ❤️ et React
