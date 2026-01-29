# Script pour ajouter la configuration PayTech au fichier .env

$envFile = ".env"
$frontendUrl = "http://localhost:5173"
$backendUrl = "http://localhost:8000"

# Clés PayTech fournies
$paytechConfig = @"
# PayTech Payment Gateway (https://doc.intech.sn/doc_paytech.php)
PAYTECH_API_KEY=d0e56becb0c8d979db0518de4a40ca3ffc8dfd97319d460d1d21e14a10bcddd5
PAYTECH_API_SECRET=cd4faca8c8b6f2787eb73a6c840f83f087cc246141248552948bdd536cf0568e
PAYTECH_ENV=test
# URLs frontend (redirection après paiement) - ex: http://localhost:5173 en dev
FRONTEND_URL=$frontendUrl
PAYTECH_SUCCESS_URL=$frontendUrl/dashboard/payment/success
PAYTECH_CANCEL_URL=$frontendUrl/dashboard/payment/cancel
# URLs backend (webhooks IPN) - doivent être accessibles depuis Internet
PAYTECH_IPN_URL=$backendUrl/api/payments/paytech/ipn
PAYTECH_REFUND_NOTIF_URL=$backendUrl/api/payments/paytech/refund-ipn
"@

if (Test-Path $envFile) {
    $content = Get-Content $envFile -Raw
    
    # Vérifier si PAYTECH_API_KEY existe déjà
    if ($content -match "PAYTECH_API_KEY") {
        Write-Host "Les variables PayTech existent déjà dans le fichier .env" -ForegroundColor Yellow
        Write-Host "Vérifiez qu'elles sont correctement configurées." -ForegroundColor Yellow
    } else {
        # Ajouter la configuration à la fin du fichier
        Add-Content -Path $envFile -Value "`n$paytechConfig"
        Write-Host "Configuration PayTech ajoutée avec succès au fichier .env" -ForegroundColor Green
        Write-Host "N'oubliez pas d'exécuter: php artisan config:clear" -ForegroundColor Cyan
    }
} else {
    Write-Host "Le fichier .env n'existe pas. Créez-le d'abord en copiant .env.example" -ForegroundColor Red
}
