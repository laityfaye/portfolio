# Configuration PayTech en Production

Ce guide décrit la configuration de PayTech pour la mise en production sur innosft.com.

---

## 1. URLs de production

Avec l'architecture actuelle :
- **Frontend** : https://innosft.com/p/ (base `/p/`)
- **API Backend** : https://apiportfolio.innosft.com/api

### URLs PayTech à configurer

| Variable | Valeur | Description |
|----------|--------|-------------|
| `PAYTECH_SUCCESS_URL` | `https://innosft.com/p/dashboard/payment/success` | Redirection après paiement réussi |
| `PAYTECH_CANCEL_URL` | `https://innosft.com/p/dashboard/payment/cancel` | Redirection après annulation |
| `PAYTECH_IPN_URL` | `https://apiportfolio.innosft.com/api/payments/paytech/ipn` | Notification PayTech (webhook) |
| `PAYTECH_REFUND_NOTIF_URL` | `https://apiportfolio.innosft.com/api/payments/paytech/refund-ipn` | Notification de remboursement |

**Important** : Le préfixe `/p/` est obligatoire car la plateforme portfolio est déployée sous ce chemin.

---

## 2. Configuration Backend (.env)

Sur le serveur backend (apiportfolio.innosft.com), ajoutez ou modifiez ces variables dans `.env` :

```env
# PayTech - Production
PAYTECH_API_KEY=votre_cle_api_paytech
PAYTECH_API_SECRET=votre_cle_secrete_paytech
PAYTECH_ENV=prod

# URLs - Adapter si vos domaines diffèrent
FRONTEND_URL=https://innosft.com/p
PAYTECH_SUCCESS_URL=https://innosft.com/p/dashboard/payment/success
PAYTECH_CANCEL_URL=https://innosft.com/p/dashboard/payment/cancel
PAYTECH_IPN_URL=https://apiportfolio.innosft.com/api/payments/paytech/ipn
PAYTECH_REFUND_NOTIF_URL=https://apiportfolio.innosft.com/api/payments/paytech/refund-ipn
```

### Obtenir les clés PayTech

1. Connectez-vous à [PayTech](https://paytech.sn/)
2. Allez dans **Paramètres** → **API**
3. Récupérez ou régénérez `API_KEY` et `API_SECRET`

### Activation du compte Production

En mode `PAYTECH_ENV=prod`, le montant exact (2 500 FCFA) est débité. Un compte PayTech **activé pour la production** est requis. Procédure :

1. Envoyer un email à **contact@paytech.sn** avec l'objet "**Activation Compte PayTech**"
2. Joindre : NINEA, pièce d'identité, registre de commerce, statut entreprise, justificatif de domicile, numéro de téléphone
3. Suivi : +221 77 125 57 99

---

## 3. Vérifications préalables

### Backend

- [ ] `APP_URL=https://apiportfolio.innosft.com` dans `.env`
- [ ] HTTPS activé sur apiportfolio.innosft.com
- [ ] CORS autorise les requêtes depuis `https://innosft.com`

### Frontend

- [ ] `.env.production` contient `VITE_API_URL=https://apiportfolio.innosft.com/api`
- [ ] Build avec `npm run build` avant déploiement

### PayTech

- [ ] L'URL IPN est accessible publiquement en HTTPS (pas de firewall bloquant)
- [ ] Les clés API sont correctes et le compte est activé en production

---

## 4. Test de l'intégration

1. **Test de paiement** : Créer un compte test, aller dans Paiement, cliquer « Payer avec Orange Money / Wave / Free Money »
2. **Redirection** : Vérifier que l'utilisateur est redirigé vers PayTech
3. **Success** : Après paiement, vérifier la redirection vers `/p/dashboard/payment/success`
4. **IPN** : Vérifier dans les logs Laravel (`storage/logs/laravel.log`) que l'IPN est reçu et traité

```bash
# Suivre les logs en temps réel
tail -f storage/logs/laravel.log
```

---

## 5. Dépannage

| Problème | Solution |
|----------|----------|
| Erreur "successRedirectUrl doit être un URL" | Vérifier que toutes les URLs sont en **HTTPS** et correctement formatées |
| Page blanche après paiement | Vérifier `PAYTECH_SUCCESS_URL` avec le préfixe `/p/` |
| Paiement non confirmé | L'IPN n'arrive pas : vérifier `PAYTECH_IPN_URL` accessible en HTTPS, pas bloqué par firewall |
| Erreur 403 sur IPN | Vérifier la vérification HMAC (clés API correctes) |
| Compte non activé | Contacter PayTech pour l'activation production |
