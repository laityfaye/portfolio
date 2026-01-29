# Script pour mettre à jour le .env avec l'URL ngrok

param(
    [Parameter(Mandatory=$true)]
    [string]$NgrokUrl
)

$envFile = ".env"

if (-not (Test-Path $envFile)) {
    Write-Host "Le fichier .env n'existe pas!" -ForegroundColor Red
    exit 1
}

# Nettoyer l'URL ngrok (enlever le http://localhost:8000 si présent)
$ngrokUrl = $NgrokUrl.Trim()
if ($ngrokUrl -match "https://([\w\-\.]+)") {
    $ngrokDomain = $matches[1]
    $ngrokUrl = "https://$ngrokDomain"
} elseif (-not $ngrokUrl.StartsWith("https://")) {
    $ngrokUrl = "https://$ngrokUrl"
}

Write-Host "Mise à jour du fichier .env avec l'URL ngrok: $ngrokUrl" -ForegroundColor Cyan

# Lire le contenu du fichier .env
$content = Get-Content $envFile -Raw

# Mettre à jour PAYTECH_IPN_URL
if ($content -match "PAYTECH_IPN_URL=(.+)") {
    $content = $content -replace "PAYTECH_IPN_URL=.+", "PAYTECH_IPN_URL=$ngrokUrl/api/payments/paytech/ipn"
    Write-Host "✓ PAYTECH_IPN_URL mis à jour" -ForegroundColor Green
} else {
    $content += "`nPAYTECH_IPN_URL=$ngrokUrl/api/payments/paytech/ipn"
    Write-Host "✓ PAYTECH_IPN_URL ajouté" -ForegroundColor Green
}

# Mettre à jour PAYTECH_REFUND_NOTIF_URL
if ($content -match "PAYTECH_REFUND_NOTIF_URL=(.+)") {
    $content = $content -replace "PAYTECH_REFUND_NOTIF_URL=.+", "PAYTECH_REFUND_NOTIF_URL=$ngrokUrl/api/payments/paytech/refund-ipn"
    Write-Host "✓ PAYTECH_REFUND_NOTIF_URL mis à jour" -ForegroundColor Green
} else {
    $content += "`nPAYTECH_REFUND_NOTIF_URL=$ngrokUrl/api/payments/paytech/refund-ipn"
    Write-Host "✓ PAYTECH_REFUND_NOTIF_URL ajouté" -ForegroundColor Green
}

# Écrire le contenu mis à jour
Set-Content -Path $envFile -Value $content -NoNewline

Write-Host ""
Write-Host "Configuration mise à jour avec succès!" -ForegroundColor Green
Write-Host ""
Write-Host "N'oubliez pas d'exécuter:" -ForegroundColor Yellow
Write-Host "  php artisan config:clear" -ForegroundColor Cyan
Write-Host ""
