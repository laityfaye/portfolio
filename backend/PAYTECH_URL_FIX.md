# Correction de l'erreur "successRedirectUrl doit être un URL"

## Problème
PayTech retourne l'erreur : "successRedirectUrl doit être un URL"

## Solution

PayTech semble exiger que **toutes les URLs soient en HTTPS**, y compris `success_url` et `cancel_url`.

### Option 1 : Utiliser ngrok pour le frontend aussi (Recommandé pour le développement)

1. Dans ngrok, exposez également votre frontend React (port 5173) :
   ```bash
   # Terminal 1 - Backend
   ngrok http 8000
   
   # Terminal 2 - Frontend (si vous avez plusieurs tunnels ngrok)
   ngrok http 5173
   ```

2. Mettez à jour votre `.env` avec l'URL ngrok du frontend :
   ```env
   FRONTEND_URL=https://votre-frontend-ngrok.ngrok-free.app
   PAYTECH_SUCCESS_URL=https://votre-frontend-ngrok.ngrok-free.app/dashboard/payment/success
   PAYTECH_CANCEL_URL=https://votre-frontend-ngrok.ngrok-free.app/dashboard/payment/cancel
   ```

3. Videz le cache :
   ```bash
   php artisan config:clear
   ```

### Option 2 : Utiliser le même tunnel ngrok pour frontend et backend

1. Configurez ngrok pour exposer le port 8000
2. Utilisez l'URL ngrok pour le frontend aussi (si votre frontend est servi par le backend)
3. Ou configurez un reverse proxy

### Option 3 : En production

En production, utilisez votre domaine avec HTTPS configuré pour toutes les URLs.

## Test

Après avoir mis à jour les URLs, testez à nouveau le paiement PayTech.
