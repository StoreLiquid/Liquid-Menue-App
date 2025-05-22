@echo off
echo Git Auto-Commit und Push Tool
echo ===========================
echo.

echo WICHTIG: GitHub akzeptiert keine Passwörter mehr!
echo Du musst einen Personal Access Token verwenden.
echo Token erstellen: https://github.com/settings/tokens
echo.
echo Drücke eine beliebige Taste, um fortzufahren...
pause

echo Überprüfe auf Änderungen...
git status
echo.
echo Drücke eine beliebige Taste, um fortzufahren...
pause

echo.
echo Füge alle Änderungen hinzu...
git add -A
echo.
echo Drücke eine beliebige Taste, um fortzufahren...
pause

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
echo Drücke eine beliebige Taste, um fortzufahren...
pause

echo.
echo Pushe zu GitHub...
echo.
set /p username=GitHub Benutzername: 
set /p token=GitHub TOKEN (KEIN Passwort!): 

echo.
echo Führe Push mit den eingegebenen Anmeldedaten durch...
git -c credential.helper= -c user.name="%username%" -c user.password="%token%" push origin master

echo.
echo Fertig! Drücke eine beliebige Taste zum Beenden...
pause 