# Guide de déploiement du frontend sur innosft.com

## Architecture

La plateforme portfolio est déployée sous le préfixe `/p/` pour la distinguer du site principal innosft.com :

- **Site principal** : https://innosft.com/ (plateforme mère InnoSoft)
- **Plateforme portfolio** : https://innosft.com/p/ (accueil, login, register, dashboards, portfolios)
- **Portfolios publics** : https://innosft.com/p/{slug} (ex. https://innosft.com/p/jean-dupont)
- **API** : https://apiportfolio.innosft.com/api → Backend Laravel

---

## URLs de la plateforme portfolio

| Page | URL |
|------|-----|
| Accueil | https://innosft.com/p/ |
| Connexion | https://innosft.com/p/login |
| Inscription | https://innosft.com/p/register |
| Dashboard | https://innosft.com/p/dashboard |
| Admin | https://innosft.com/p/admin/login |
| Portfolio (ex. jean-dupont) | https://innosft.com/p/jean-dupont |

---

## Étape 1 : Configurer l’URL de l’API

Avant le build, créez un fichier `.env.production` dans le dossier `frontend` :

```bash
cd ~/portfolio/frontend
nano .env.production
```

Contenu :

```
VITE_API_URL=https://apiportfolio.innosft.com/api
```

Enregistrez (Ctrl+O, Entrée) puis quittez (Ctrl+X).

---

## Étape 2 : Build de production

```bash
cd ~/portfolio/frontend
npm run build
```

Cela crée le dossier `dist/` avec les fichiers statiques (base `/p/` configurée dans Vite).

---

## Étape 3 : Déployer les fichiers sur innosft.com

**Important** : Le contenu de `dist/` doit être copié dans un sous-dossier **`p/`** du document root, car l'app est servie depuis `https://innosft.com/p/`.

### Option A : Hébergement mutualisé Hostinger

1. Déterminez le **document root** de innosft.com (ex. `public_html`).
2. Créez le dossier `p/` et copiez-y le contenu de `dist/` :

```bash
mkdir -p /chemin/vers/public_html/p
cp -r dist/* /chemin/vers/public_html/p/
```

### Option B : VPS avec Nginx (recommandé)

1. Copiez le contenu de `dist/` dans le sous-dossier `p/` du site :

```bash
mkdir -p /home/tfksservice/domains/innosft.com/public/p
cp -r dist/* /home/tfksservice/domains/innosft.com/public/p/
```

2. Ajoutez un bloc `location /p/` dans la configuration Nginx existante d'innosft.com pour le **routing côté client** (React Router) :

```nginx
# À ajouter dans le server block d'innosft.com
location /p/ {
    root /home/tfksservice/domains/innosft.com/public;
    try_files $uri $uri/ /p/index.html;
}
```

3. Testez puis rechargez Nginx :

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## Étape 4 : Activer HTTPS (Let’s Encrypt)

Sur VPS avec Certbot :

```bash
sudo certbot --nginx -d innosft.com -d www.innosft.com
```

Sur Hostinger mutualisé : activer SSL depuis le hPanel pour innosft.com.

---

## Étape 5 : Vérifications

1. Ouvrir https://innosft.com/ : la page d’accueil s’affiche.
2. Tester les routes (ex. `/login`, `/register`, un portfolio) : pas d’erreur 404.
3. Tester la connexion et l’appel à l’API : vérifier la console du navigateur (F12) et l’onglet Network pour les requêtes vers `apiportfolio.innosft.com`.

---

## Script de déploiement rapide

À exécuter sur le serveur après chaque mise à jour :

```bash
#!/bin/bash
cd ~/portfolio/frontend
npm run build
mkdir -p /home/tfksservice/domains/innosft.com/public/p
cp -r dist/* /home/tfksservice/domains/innosft.com/public/p/
echo "Déploiement terminé ! Plateforme disponible sur https://innosft.com/p/"
```

---

## Dépannage

| Problème | Solution |
|----------|----------|
| Erreur 404 sur /p/login, /p/dashboard, etc. | Vérifier `try_files` dans le bloc `location /p/` (fallback vers `/p/index.html`) |
| L’API ne répond pas (CORS) | Vérifier la config CORS dans Laravel (`config/cors.php`) et que `apiportfolio.innosft.com` est autorisé |
| Mauvaise URL d’API | Vérifier `.env.production` et que `VITE_API_URL` est bien `https://apiportfolio.innosft.com/api` |
| Assets (JS/CSS) non chargés | Vérifier que les fichiers sont bien dans `public/p/` et que le chemin est correct |
