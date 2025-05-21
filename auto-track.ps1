# Auto-Track PowerShell Script für die Liquid-Menü-App
# Dieses Skript fügt automatisch alle Änderungen zu Git hinzu

# Funktion zum Hinzufügen und Committen von Änderungen
function Track-Changes {
    Write-Host "Überprüfe auf Änderungen..." -ForegroundColor Cyan
    
    # Status abrufen
    $status = git status --porcelain
    
    if ($status) {
        Write-Host "Änderungen gefunden!" -ForegroundColor Yellow
        
        # Alle Änderungen hinzufügen
        git add -A
        
        Write-Host "Alle Änderungen wurden zu Git hinzugefügt." -ForegroundColor Green
        Write-Host "Du kannst jetzt 'git commit -m \"Deine Commit-Nachricht\"' ausführen, um die Änderungen zu committen." -ForegroundColor Green
        Write-Host "Danach 'git push origin master', um die Änderungen zu GitHub zu pushen." -ForegroundColor Green
    } else {
        Write-Host "Keine Änderungen gefunden." -ForegroundColor Green
    }
}

# Führe die Funktion aus
Track-Changes 