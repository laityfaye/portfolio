# Configuration PayTech - Instructions

## Problème détecté
Les clés PayTech ne sont pas configurées dans votre fichier `.env`.

## Solution

Ajoutez ces lignes à votre fichier `backend/.env` :

```env
# PayTech Payment Gateway
PAYTECH_API_KEY=d0e56becb0c8d979db0518de4a40ca3ffc8dfd97319d460d1d21e14a10bcddd5
PAYTECH_API_SECRET=cd4faca8c8b6f2787eb73a6c840f83f087cc246141248552948bdd536cf0568e
PAYTECH_ENV=test

# URLs frontend (redirection après paiement)
FRONTEND_URL=http://localhost:5173
PAYTECH_SUCCESS_URL=http://localhost:5173/dashboard/payment/success
PAYTECH_CANCEL_URL=http://localhost:5173/dashboard/payment/cancel

# URLs backend (webhooks IPN) - doivent être accessibles depuis Internet
PAYTECH_IPN_URL=http://localhost:8000/api/payments/paytech/ipn
PAYTECH_REFUND_NOTIF_URL=http://localhost:8000/api/payments/paytech/refund-ipn
```

## Après avoir ajouté les variables

1. Videz le cache de configuration :
```bash
cd backend
php artisan config:clear
```

2. Redémarrez votre serveur Laravel si nécessaire.

3. Testez à nouveau le paiement PayTech.

## Note importante pour les webhooks IPN

En développement local, l'URL IPN (`PAYTECH_IPN_URL`) doit être accessible depuis Internet. Utilisez [ngrok](https://ngrok.com/) :

```bash
ngrok http 8000
```

Puis mettez à jour `PAYTECH_IPN_URL` avec l'URL ngrok fournie (ex: `https://xxxx.ngrok.io/api/payments/paytech/ipn`).
