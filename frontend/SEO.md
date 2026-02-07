# Configuration SEO – InnoSoft Portfolio

## Ce qui a été mis en place

### 1. Meta tags (index.html)
- **Title** : « InnoSoft Portfolio – Créer votre portfolio en ligne en quelques minutes » (ciblage : portfolio, créer un portfolio, portfolio en ligne)
- **Description** : Texte optimisé pour les moteurs de recherche
- **Keywords** : portfolio, créer un portfolio, portfolio en ligne, portfolio professionnel, etc.
- **Canonical** : https://innosft.com/p/
- **Open Graph** et **Twitter Cards** pour le partage sur les réseaux sociaux

### 2. Données structurées (JSON-LD)
- **WebApplication** : type de plateforme pour créer des portfolios
- **Organization** : InnoSoft Creation

### 3. Fichiers
- **robots.txt** : Indique aux crawlers les pages à indexer et la sitemap
- **sitemap.xml** : Pages principales (accueil, login, register, demo)

---

## Actions recommandées pour améliorer le référencement

### 1. Google Search Console
1. Aller sur [search.google.com/search-console](https://search.google.com/search-console)
2. Ajouter la propriété `https://innosft.com`
3. Placer le fichier de vérification ou la balise meta proposée
4. Soumettre le sitemap : `https://innosft.com/p/sitemap.xml`

### 2. robots.txt au niveau du domaine
Si le site principal est sur `innosft.com`, le `robots.txt` se trouve normalement à `https://innosft.com/robots.txt`.  
Assurez-vous que ce fichier existe et, si besoin, ajoutez les entrées pour la plateforme portfolio :

```
Sitemap: https://innosft.com/p/sitemap.xml
```

### 3. Contenu orienté SEO
- Mettre en avant des expressions comme « créer un portfolio », « portfolio en ligne », « portfolio gratuit » dans les textes (Home, sections, boutons)
- Ajouter une page « À propos » ou « Comment ça marche » pour enrichir le contenu

### 4. Sitemap dynamique ✓
Implémenté : le sitemap est généré dynamiquement à `https://apiportfolio.innosft.com/api/public/sitemap.xml` et inclut tous les portfolios publiés. À chaque publication, les moteurs de recherche sont notifiés (ping Google, Bing, IndexNow).

### 5. Performance
- Optimiser les images (compression, format WebP)
- Activer la mise en cache pour les assets statiques
- Vérifier les Core Web Vitals (LCP, FID, CLS)

### 6. Indexation automatique des portfolios ✓
- **Sitemap dynamique** : Tous les portfolios publiés sont ajoutés automatiquement au sitemap.
- **Ping à la publication** : À chaque publication (utilisateur ou admin), Google et Bing sont notifiés pour recrawler le sitemap.
- **IndexNow** (optionnel) : Pour une indexation quasi-instantanée sur Bing/Yandex, configurer `INDEXNOW_KEY` et `INDEXNOW_KEY_LOCATION` dans le `.env` du backend.
- **Meta tags dynamiques** : Chaque portfolio a son propre titre et description (nom du propriétaire), ce qui permet d'apparaître lors d'une recherche par nom.

---

## URLs indexées

| Page     | URL                        | Priorité |
|----------|----------------------------|----------|
| Accueil  | https://innosft.com/p/     | 1.0      |
| Inscription | https://innosft.com/p/register | 0.9 |
| Connexion   | https://innosft.com/p/login    | 0.8 |
| Démo        | https://innosft.com/p/demo     | 0.8 |
