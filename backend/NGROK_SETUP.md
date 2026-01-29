# Configuration ngrok pour PayTech IPN

## Problème
PayTech exige que les URLs IPN soient en **HTTPS**. En développement local avec HTTP, vous devez utiliser ngrok pour créer une URL HTTPS.

## Solution : Utiliser ngrok

### 1. Installer ngrok

Téléchargez ngrok depuis : https://ngrok.com/download

Ou via Chocolatey (Windows) :
```powershell
choco install ngrok
```

### 2. Démarrer ngrok

Dans un terminal séparé, démarrez ngrok pour exposer votre serveur Laravel :

```bash
ngrok http 8000
```

Vous obtiendrez une URL HTTPS comme : `https://xxxx-xx-xx-xx-xx.ngrok-free.app`

### 3. Mettre à jour votre fichier .env

Remplacez les URLs IPN dans `backend/.env` :

```env
# Utilisez l'URL ngrok HTTPS au lieu de localhost
PAYTECH_IPN_URL=https://xxxx-xx-xx-xx-xx.ngrok-free.app/api/payments/paytech/ipn
PAYTECH_REFUND_NOTIF_URL=https://xxxx-xx-xx-xx-xx.ngrok-free.app/api/payments/paytech/refund-ipn
```

**Important** : Remplacez `xxxx-xx-xx-xx-xx.ngrok-free.app` par votre URL ngrok réelle.

### 4. Vider le cache Laravel

```bash
cd backend
php artisan config:clear
```

### 5. Redémarrer votre serveur Laravel

### 6. Tester

Essayez à nouveau le paiement PayTech. Les webhooks IPN devraient maintenant fonctionner.

## Note

- L'URL ngrok change à chaque redémarrage (plan gratuit)
- Pour une URL fixe, utilisez le plan payant de ngrok
- En production, utilisez votre domaine avec HTTPS configuré

## Alternative : Mode test sans IPN

Si vous voulez tester sans ngrok, vous pouvez temporairement commenter l'IPN dans le code, mais vous ne recevrez pas les notifications de paiement automatiques.
