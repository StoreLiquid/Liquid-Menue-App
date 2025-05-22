@echo off
echo Git Auto-Commit und Push Tool
echo ===========================
echo.

echo Überprüfe auf Änderungen...
git status

echo.
echo Füge alle Änderungen hinzu...
git add -A

echo.
set /p commit_msg=Gib eine Commit-Nachricht ein (oder drücke Enter für eine automatische Nachricht): 

if "%commit_msg%"=="" (
    for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (
        set datum=%%c-%%a-%%b
    )
    for /f "tokens=1-2 delims=: " %%a in ('time /t') do (
        set zeit=%%a-%%b
    )
    set commit_msg=Automatisches Update vom %datum% %zeit%
)

echo.
echo Committe Änderungen mit Nachricht: %commit_msg%
git commit -m "%commit_msg%"

echo.
echo Pushe zu GitHub...

:: Frage nach Anmeldedaten, wenn sie benötigt werden
set /p username=GitHub Benutzername (oder drücke Enter, wenn bereits gespeichert): 

if not "%username%"=="" (
    set /p password=GitHub Passwort oder Token: 
    :: Verwende die eingegebenen Anmeldedaten für den Push
    git -c credential.helper= -c user.name="%username%" -c user.password="%password%" push origin master
) else (
    :: Versuche zu pushen mit gespeicherten Anmeldedaten
    git push origin master
)

echo.
echo Fertig!
pause 