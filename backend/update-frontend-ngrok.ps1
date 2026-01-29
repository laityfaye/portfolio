# Script pour mettre à jour les URLs frontend avec ngrok HTTPS

param(
    [Parameter(Mandatory=$true)]
    [string]$FrontendNgrokUrl
)

$envFile = ".env"

if (-not (Test-Path $envFile)) {
    Write-Host "Le fichier .env n'existe pas!" -ForegroundColor Red
    exit 1
}

# Nettoyer l'URL ngrok
$frontendUrl = $FrontendNgrokUrl.Trim()
if ($frontendUrl -match "https://([\w\-\.]+)") {
    $ngrokDomain = $matches[1]
    $frontendUrl = "https://$ngrokDomain"
} elseif (-not $frontendUrl.StartsWith("https://")) {
    $frontendUrl = "https://$frontendUrl"
}

Write-Host "Mise a jour du fichier .env avec l'URL ngrok frontend: $frontendUrl" -ForegroundColor Cyan

# Lire le contenu du fichier .env
$content = Get-Content $envFile -Raw

# Mettre à jour FRONTEND_URL
if ($content -match "FRONTEND_URL=(.+)") {
    $content = $content -replace "FRONTEND_URL=.+", "FRONTEND_URL=$frontendUrl"
    Write-Host "OK FRONTEND_URL mis a jour" -ForegroundColor Green
} else {
    $content += "`nFRONTEND_URL=$frontendUrl"
    Write-Host "OK FRONTEND_URL ajoute" -ForegroundColor Green
}

# Mettre à jour PAYTECH_SUCCESS_URL
$successUrl = "$frontendUrl/dashboard/payment/success"
if ($content -match "PAYTECH_SUCCESS_URL=(.+)") {
    $content = $content -replace "PAYTECH_SUCCESS_URL=.+", "PAYTECH_SUCCESS_URL=$successUrl"
    Write-Host "OK PAYTECH_SUCCESS_URL mis a jour" -ForegroundColor Green
} else {
    $content += "`nPAYTECH_SUCCESS_URL=$successUrl"
    Write-Host "OK PAYTECH_SUCCESS_URL ajoute" -ForegroundColor Green
}

# Mettre à jour PAYTECH_CANCEL_URL
$cancelUrl = "$frontendUrl/dashboard/payment/cancel"
if ($content -match "PAYTECH_CANCEL_URL=(.+)") {
    $content = $content -replace "PAYTECH_CANCEL_URL=.+", "PAYTECH_CANCEL_URL=$cancelUrl"
    Write-Host "OK PAYTECH_CANCEL_URL mis a jour" -ForegroundColor Green
} else {
    $content += "`nPAYTECH_CANCEL_URL=$cancelUrl"
    Write-Host "OK PAYTECH_CANCEL_URL ajoute" -ForegroundColor Green
}

# Écrire le contenu mis à jour
Set-Content -Path $envFile -Value $content -NoNewline

Write-Host ""
Write-Host "Configuration mise a jour avec succes!" -ForegroundColor Green
Write-Host ""
Write-Host "N'oubliez pas d'executer:" -ForegroundColor Yellow
Write-Host "  php artisan config:clear" -ForegroundColor Cyan
Write-Host ""
