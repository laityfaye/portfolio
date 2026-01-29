# Script pour configurer ngrok avec PayTech

Write-Host "=== Configuration ngrok pour PayTech ===" -ForegroundColor Cyan
Write-Host ""

# Vérifier si ngrok est installé
$ngrokInstalled = Get-Command ngrok -ErrorAction SilentlyContinue

if (-not $ngrokInstalled) {
    Write-Host "ngrok n'est pas installe." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Options d'installation :" -ForegroundColor Cyan
    Write-Host "1. Telecharger depuis https://ngrok.com/download" -ForegroundColor White
    Write-Host "2. Ou installer via Chocolatey: choco install ngrok" -ForegroundColor White
    Write-Host ""
    $install = Read-Host "Voulez-vous ouvrir la page de telechargement ngrok? (O/N)"
    if ($install -eq "O" -or $install -eq "o") {
        Start-Process "https://ngrok.com/download"
    }
    exit
}

Write-Host "ngrok est installe OK" -ForegroundColor Green
Write-Host ""

# Vérifier si ngrok est déjà en cours d'exécution
$ngrokProcess = Get-Process ngrok -ErrorAction SilentlyContinue

if ($ngrokProcess) {
    Write-Host "ngrok est deja en cours d'execution." -ForegroundColor Yellow
    Write-Host "Arretez-le d'abord (Ctrl+C dans le terminal ngrok) puis relancez ce script." -ForegroundColor Yellow
    exit
}

Write-Host "Demarrage de ngrok sur le port 8000..." -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANT:" -ForegroundColor Yellow
Write-Host "- Gardez cette fenetre ouverte" -ForegroundColor White
Write-Host "- Une fois ngrok demarre, copiez l'URL HTTPS (ex: https://xxxx.ngrok-free.app)" -ForegroundColor White
Write-Host "- Mettez a jour votre fichier .env avec cette URL" -ForegroundColor White
Write-Host ""

# Démarrer ngrok
Start-Process ngrok -ArgumentList "http 8000" -NoNewWindow

Write-Host "ngrok a ete demarre. Attendez quelques secondes puis :" -ForegroundColor Green
Write-Host "1. Ouvrez http://localhost:4040 dans votre navigateur pour voir l'URL ngrok" -ForegroundColor Cyan
Write-Host "2. Copiez l'URL HTTPS affichee (ex: https://xxxx.ngrok-free.app)" -ForegroundColor Cyan
Write-Host "3. Executez: .\update-env-with-ngrok.ps1 -NgrokUrl https://votre-url-ngrok" -ForegroundColor Cyan
Write-Host ""
