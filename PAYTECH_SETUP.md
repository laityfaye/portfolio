# Configuration PayTech

> **Production** : Voir [PAYTECH_PRODUCTION.md](./PAYTECH_PRODUCTION.md) pour la configuration en production sur innosft.com.

Documentation basée exclusivement sur :
- [Documentation officielle PayTech](https://doc.intech.sn/doc_paytech.php)
- [Collection Postman PayTech](https://doc.intech.sn/PayTech%20x%20DOC.postman_collection.json)

## 1. Configuration Backend (.env)

Ajoutez ces variables à votre fichier `.env` :

```env
# PayTech - Clés fournies
PAYTECH_API_KEY=d0e56becb0c8d979db0518de4a40ca3ffc8dfd97319d460d1d21e14a10bcddd5
PAYTECH_API_SECRET=cd4faca8c8b6f2787eb73a6c840f83f087cc246141248552948bdd536cf0568e
PAYTECH_ENV=test

# URLs - En développement local
FRONTEND_URL=http://localhost:5173
PAYTECH_SUCCESS_URL=http://localhost:5173/dashboard/payment/success
PAYTECH_CANCEL_URL=http://localhost:5173/dashboard/payment/cancel
PAYTECH_IPN_URL=http://localhost:8000/api/payments/paytech/ipn
PAYTECH_REFUND_NOTIF_URL=http://localhost:8000/api/payments/paytech/refund-ipn
```

**Important** : L'URL IPN doit être accessible depuis Internet pour que PayTech puisse envoyer les notifications. En développement local, utilisez [ngrok](https://ngrok.com/) ou similaire :
```bash
ngrok http 8000
# Puis mettez à jour PAYTECH_IPN_URL avec l'URL ngrok
```

## 2. Environnements

- **test** : Sandbox - montant aléatoire 100-150 CFA débité (pour tests)
- **prod** : Production - montant exact (compte PayTech activé requis)

## 3. Flux de paiement

1. L'utilisateur clique "Payer avec Orange Money / Wave / Free Money"
2. Le frontend appelle `POST /api/payments/paytech/request`
3. Le backend crée un paiement en attente et appelle l'API PayTech
4. Le backend retourne `redirect_url` au frontend
5. Le frontend redirige vers PayTech
6. L'utilisateur paie sur PayTech
7. PayTech redirige vers `success_url` (frontend) et envoie IPN au backend
8. Le backend traite l'IPN, met à jour le paiement et active l'utilisateur

## 4. Sécurité IPN

Le backend vérifie l'authenticité des notifications via :
- **HMAC-SHA256** (recommandé) : `amount|ref_command|api_key`
- **SHA256** (alternative) : comparaison des hachages des clés API

## 5. CORS

**Important** : CORS n'est pas activé sur les serveurs PayTech. Les clés API ne doivent jamais être exposées côté client. Toutes les requêtes passent par le backend.
