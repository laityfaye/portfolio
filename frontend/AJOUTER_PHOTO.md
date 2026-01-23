# Comment Ajouter Votre Photo de Profil

## 📸 Étapes pour Ajouter Votre Photo

### 1. Préparer Votre Photo

**Recommandations:**
- Format: JPG, PNG ou WebP
- Dimensions: Au moins 500x500 pixels (carré de préférence)
- Taille: Moins de 500 KB pour des performances optimales
- Qualité: Photo professionnelle avec bon éclairage
- Fond: Neutre ou flou (pour meilleur rendu avec les effets)

### 2. Placer la Photo dans le Projet

**Option A: Dossier public (Recommandé)**
```
1. Créez le dossier: public/images/
2. Placez votre photo: public/images/profile.jpg
3. La photo sera accessible à: /images/profile.jpg
```

**Option B: Dossier src/assets**
```
1. Créez le dossier: src/assets/images/
2. Placez votre photo: src/assets/images/profile.jpg
3. Nécessite un import dans le composant
```

### 3. Modifier le Composant Hero

Ouvrez le fichier: `src/components/Hero.jsx`

Cherchez cette section (autour de la ligne 240):

```jsx
{/* Photo Placeholder - Remplacer par votre vraie photo */}
<div className="w-full h-full bg-gradient-to-br from-cyan-500/10 to-purple-500/10 flex items-center justify-center">
  <div className="text-8xl text-cyan-400/30">
    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  </div>
  <div className="absolute inset-0 flex items-center justify-center">
    <p className="text-gray-400 text-sm">Votre Photo</p>
  </div>
</div>

{/* Uncomment and use this when you have a real photo */}
{/* <img
  src="/path/to/your/photo.jpg"
  alt="Ingénieur Logiciel"
  className="w-full h-full object-cover"
/> */}
```

### 4. Remplacer par Votre Photo

**Supprimez** le placeholder et **décommentez** la balise img:

```jsx
{/* Photo - AVEC VOTRE IMAGE */}
<img
  src="/images/profile.jpg"
  alt="Ingénieur Logiciel - Votre Nom"
  className="w-full h-full object-cover"
/>
```

**OU si vous utilisez src/assets:**

```jsx
import profilePhoto from '../assets/images/profile.jpg';

// ... puis dans le JSX:
<img
  src={profilePhoto}
  alt="Ingénieur Logiciel - Votre Nom"
  className="w-full h-full object-cover"
/>
```

### 5. Code Final Complet

Voici à quoi devrait ressembler la section complète:

```jsx
{/* Main Photo Frame */}
<div className="absolute inset-4 glass-effect-strong rounded-full overflow-hidden border-4 border-cyan-500/20 shadow-2xl">
  {/* Gradient Overlay on Hover */}
  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

  {/* VOTRE PHOTO ICI */}
  <img
    src="/images/profile.jpg"
    alt="Ingénieur Logiciel - Votre Nom"
    className="w-full h-full object-cover"
  />
</div>
```

## 🎨 Design de la Photo

La photo est affichée avec:

### Effets Visuels
- **Cadre circulaire** avec glassmorphisme
- **Bordure animée** cyan/violet qui tourne
- **Overlay gradient** au hover (survol)
- **Shadow effects** pour la profondeur
- **Badges flottants** "Disponible" et "Full Stack Dev"

### Animations
- **2 anneaux rotatifs** autour de la photo
- **Badges animés** qui flottent
- **Effet hover** avec overlay coloré
- **Scale smooth** sur toute la section

## 🔧 Personnalisations Avancées

### Changer la Taille de la Photo

Dans Hero.jsx, ligne ~189:
```jsx
{/* Modifier les classes w-* et h-* */}
<div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
```

Tailles disponibles:
- Petit: `w-64 h-64`
- Moyen: `w-80 h-80` (défaut mobile)
- Grand: `w-96 h-96` (défaut desktop)
- Très grand: `w-[28rem] h-[28rem]`

### Modifier les Couleurs des Anneaux

```jsx
{/* Premier anneau */}
<motion.div
  className="absolute inset-0 rounded-full border-2 border-cyan-500/30"
  {/* Changez cyan-500 par la couleur souhaitée */}
/>

{/* Second anneau */}
<motion.div
  className="absolute inset-0 rounded-full border-2 border-purple-500/20"
  {/* Changez purple-500 par la couleur souhaitée */}
/>
```

### Changer le Badge de Statut

```jsx
<motion.div className="absolute -top-4 -right-4 glass-effect-strong px-4 py-2 rounded-full border border-cyan-500/30 flex items-center gap-2">
  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
  <span className="text-xs font-semibold text-gray-300">Disponible</span>
  {/* Changez "Disponible" par votre statut */}
</motion.div>
```

Statuts suggérés:
- "Disponible"
- "En mission"
- "Open to work"
- "Freelance"
- "Entrepreneur"

### Personnaliser le Badge du Bas

```jsx
<motion.div className="absolute -bottom-4 -left-4 glass-effect-strong px-4 py-2 rounded-full border border-purple-500/30">
  <span className="text-xs font-semibold gradient-text">Full Stack Dev</span>
  {/* Changez "Full Stack Dev" par votre titre */}
</motion.div>
```

Titres suggérés:
- "Full Stack Dev"
- "Frontend Expert"
- "Backend Engineer"
- "DevOps Specialist"
- "Mobile Developer"

## 🖼️ Optimisation de l'Image

### Compresser Votre Photo

**Outils en ligne gratuits:**
1. **TinyPNG** - https://tinypng.com
2. **Squoosh** - https://squoosh.app
3. **Compressor.io** - https://compressor.io

**Objectif:** Réduire à 200-300 KB sans perte de qualité visible

### Convertir en WebP (Optionnel)

Format WebP = meilleure compression

```jsx
<img
  src="/images/profile.webp"
  alt="Ingénieur Logiciel - Votre Nom"
  className="w-full h-full object-cover"
/>
```

## ✅ Checklist Finale

- [ ] Photo professionnelle préparée (500x500px min)
- [ ] Photo compressée (< 500 KB)
- [ ] Photo placée dans `public/images/`
- [ ] Code mis à jour dans `Hero.jsx`
- [ ] Nom et alt text personnalisés
- [ ] Badges de statut personnalisés
- [ ] Page testée dans le navigateur
- [ ] Photo bien centrée et nette

## 🎯 Résultat

Votre photo apparaîtra:
- ✨ Dans un cadre circulaire élégant
- 🌈 Avec des anneaux animés cyan/violet
- 💎 Effet glassmorphisme premium
- 🏷️ Badges de statut flottants
- 🎭 Overlay au hover
- 📱 Responsive sur tous les écrans

---

**Besoin d'aide?** Consultez la documentation React sur les images: https://react.dev/learn/adding-images
