# Déploiement du backend sur Hostinger

Sous-domaine : **apiportfolio.innosft.com**

Ce guide couvre uniquement l’installation et le déploiement de ce projet Laravel sur Hostinger, sans modifier les autres projets déjà hébergés.

---

## Prérequis

- Accès Hostinger (hPanel + File Manager ou SSH)
- PHP 8.2+ avec l’extension **pdo_pgsql** (vérifier dans hPanel → Avancé → Version PHP / Extensions PHP)
- Composer 2 (disponible en SSH sur Hostinger)
- Base de données **PostgreSQL** créée pour ce projet
- Sous-domaine `apiportfolio.innosft.com` déjà créé et pointant vers le bon dossier

---

## 1. Créer la base de données PostgreSQL

1. Dans **hPanel** → **Bases de données** → **Bases de données PostgreSQL** (ou **Databases** → **PostgreSQL**).
2. Créer une base (ex. `u12345678_portfolio`).
3. Créer un utilisateur PostgreSQL et l’associer à cette base (tous privilèges).
4. Noter : **nom de la base**, **utilisateur**, **mot de passe**, **serveur** (souvent `localhost`) et **port** (souvent `5432`).

---

## 2. Préparer les fichiers en local

Sur votre machine, à la racine du projet backend :

```bash
cd backend

# Installer les dépendances (sans dev) pour la prod
composer install --no-dev --optimize-autoloader

# (Optionnel) Générer la clé APP_KEY pour la copier dans .env plus tard
php artisan key:generate --show
```

Ne pas commiter `.env` ni `vendor/`. Vous enverrez le code sans `vendor/` puis vous ferez `composer install` sur le serveur, ou vous uploadez tout **sauf** `.env` et vous créez `.env` à la main sur Hostinger.

---

## 3. Structure sur Hostinger (sous-domaine)

Pour le sous-domaine **apiportfolio.innosft.com**, le dossier peut être par exemple :

- `domains/innosft.com/public_html/apiportfolio/`  
  ou  
- Le répertoire « racine du sous-domaine » indiqué dans hPanel pour `apiportfolio.innosft.com`.

On appellera ce dossier **RACINE_SOUS_DOMAINE**.

Deux cas :

### Option A : La racine du sous-domaine = dossier du projet Laravel

Tout le projet Laravel (y compris le dossier `public`) est dans **RACINE_SOUS_DOMAINE**.

- **Si vous pouvez définir le « document root »** du sous-domaine sur `RACINE_SOUS_DOMAINE/public` : faites-le. Aucun .htaccess à la racine nécessaire.
- **Si le document root doit rester RACINE_SOUS_DOMAINE** : il faut que toutes les requêtes passent par `public/`. Pour cela, créez un fichier **.htaccess** à la racine du sous-domaine (à côté de `artisan`, `composer.json`, etc.) avec le contenu suivant :

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

### Option B : Vous uploadez uniquement le contenu de `public/`

Vous mettez le contenu de `public/` (index.php, .htaccess, etc.) dans la racine du sous-domaine, et le reste du projet Laravel (app, config, routes, etc.) **au-dessus** de cette racine.  
Dans ce cas, il faut adapter les chemins dans `index.php` (remplacer `__DIR__.'/..'` par le chemin vers la racine du projet). Cette option est plus délicate ; l’**Option A** est recommandée.

---

## 4. Envoyer les fichiers

- **FTP / File Manager** :  
  - Envoyer tout le contenu du dossier `backend` (y compris `app`, `config`, `public`, `routes`, `database`, `storage`, etc.) dans **RACINE_SOUS_DOMAINE**.  
  - Ne pas envoyer : `.env`, `.git`, `node_modules`, et éventuellement `vendor` si vous préférez faire `composer install` sur le serveur.

- **SSH + Git (si disponible)** :

```bash
cd /chemin/vers/RACINE_SOUS_DOMAINE
git clone <url-du-repo> .
git checkout main
composer install --no-dev --optimize-autoloader
```

Puis créer le `.env` sur le serveur (voir étape 5).

---

## 5. Fichier .env en production

Dans **RACINE_SOUS_DOMAINE**, créer ou modifier `.env` (ne jamais commiter ce fichier). Exemple pour **apiportfolio.innosft.com** :

```env
APP_NAME="Portfolio API"
APP_ENV=production
APP_KEY=base64:VOTRE_CLE_GENEREE
APP_DEBUG=false
APP_URL=https://apiportfolio.innosft.com

APP_LOCALE=fr
APP_FALLBACK_LOCALE=fr
APP_FAKER_LOCALE=fr_FR

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=nom_base_postgresql
DB_USERNAME=utilisateur_postgresql
DB_PASSWORD=mot_de_passe_postgresql

SESSION_DRIVER=database
SESSION_LIFETIME=120
CACHE_STORE=database
QUEUE_CONNECTION=database

# Frontend (domaine du site principal)
FRONTEND_URL=https://innosft.com
PAYTECH_SUCCESS_URL=https://innosft.com/dashboard/payment/success
PAYTECH_CANCEL_URL=https://innosft.com/dashboard/payment/cancel
PAYTECH_IPN_URL=https://apiportfolio.innosft.com/api/payments/paytech/ipn
PAYTECH_REFUND_NOTIF_URL=https://apiportfolio.innosft.com/api/payments/paytech/refund-ipn
PAYTECH_API_KEY=votre_cle_paytech
PAYTECH_API_SECRET=votre_secret_paytech
PAYTECH_ENV=prod
```

- Remplacer `VOTRE_CLE_GENEREE` par la sortie de `php artisan key:generate --show` (ou générer sur le serveur avec `php artisan key:generate`).
- Adapter `FRONTEND_URL`, `PAYTECH_SUCCESS_URL`, `PAYTECH_CANCEL_URL` si le frontend est sur un autre domaine/sous-domaine.
- Adapter les identifiants **PostgreSQL** (`DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`) et PayTech.

---

## 6. Commandes sur le serveur (SSH)

Se placer dans **RACINE_SOUS_DOMAINE** :

```bash
cd /chemin/vers/RACINE_SOUS_DOMAINE

composer install --no-dev --optimize-autoloader
php artisan key:generate
php artisan migrate --force
php artisan config:cache
php artisan route:cache
```

Si `php artisan storage:link` échoue (symlinks désactivés sur certains hébergements), créer le lien à la main :

```bash
ln -s ../storage/app/public public/storage
```

(Adapter les chemins si votre `storage` n’est pas à côté de `public`.)

---

## 7. Permissions

Sur Hostinger, les dossiers `storage` et `bootstrap/cache` doivent être en écriture par le serveur web :

```bash
chmod -R 775 storage bootstrap/cache
```

---

## 8. Vérifications

- **API** : ouvrir `https://apiportfolio.innosft.com/api/` (ou une route publique, ex. santé si vous en avez une). Vous devez avoir une réponse JSON ou une page Laravel, pas une erreur 500.
- **PayTech** : vérifier que les URLs PayTech dans `.env` pointent bien vers `https://apiportfolio.innosft.com` pour l’IPN et vers le frontend pour success/cancel.
- **CORS** : si le frontend est sur un autre domaine (ex. innosft.com), vérifier `config/cors.php` pour autoriser ce domaine.

---

## 9. Résumé des URLs production

| Rôle            | URL |
|-----------------|-----|
| API (backend)   | https://apiportfolio.innosft.com |
| Frontend        | À définir (ex. https://innosft.com) |
| PayTech IPN     | https://apiportfolio.innosft.com/api/payments/paytech/ipn |
| Success / Cancel| URLs du frontend (ex. https://innosft.com/dashboard/payment/success) |

---

## Dépannage

- **500 Internal Server Error** : vérifier les logs dans `storage/logs/laravel.log`, les permissions `storage` et `bootstrap/cache`, et que `.env` et `APP_KEY` sont corrects.
- **Page blanche** : activer temporairement `APP_DEBUG=true` pour afficher l’erreur, puis remettre `false` après correction.
- **Base de données** : vérifier `DB_*` dans `.env`, que la base et l’utilisateur PostgreSQL existent dans hPanel, et que l’extension `pdo_pgsql` est activée pour PHP.

Une fois ces étapes suivies, le backend est déployé sur **apiportfolio.innosft.com** sans toucher aux autres projets sur le même compte Hostinger.
