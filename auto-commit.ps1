# Auto-Commit PowerShell Script für die Liquid-Menü-App
# Dieses Skript fügt automatisch alle Änderungen zu Git hinzu, committet sie und pusht sie zu GitHub

# Funktion zum Hinzufügen, Committen und Pushen von Änderungen
function Auto-Commit {
    param (
        [Parameter(Mandatory=$true)]
        [string]$CommitMessage
    )
    
    Write-Host "Überprüfe auf Änderungen..." -ForegroundColor Cyan
    
    # Status abrufen
    $status = git status --porcelain
    
    if ($status) {
        Write-Host "Änderungen gefunden!" -ForegroundColor Yellow
        
        # Alle Änderungen hinzufügen
        git add -A
        Write-Host "Alle Änderungen wurden zu Git hinzugefügt." -ForegroundColor Green
        
        # Änderungen committen
        git commit -m "$CommitMessage"
        Write-Host "Änderungen wurden committet mit der Nachricht: $CommitMessage" -ForegroundColor Green
        
        # Zu GitHub pushen
        git push origin master
        Write-Host "Änderungen wurden zu GitHub gepusht." -ForegroundColor Green
    } else {
        Write-Host "Keine Änderungen gefunden." -ForegroundColor Green
    }
}

# Frage nach der Commit-Nachricht
$message = Read-Host "Gib eine Commit-Nachricht ein (oder drücke Enter für eine automatische Nachricht)"

# Wenn keine Nachricht eingegeben wurde, verwende eine Standard-Nachricht
if ([string]::IsNullOrWhiteSpace($message)) {
    $date = Get-Date -Format "dd.MM.yyyy HH:mm"
    $message = "Automatisches Update vom $date"
}

# Führe die Funktion aus
Auto-Commit -CommitMessage $message 