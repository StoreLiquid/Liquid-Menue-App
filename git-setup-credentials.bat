@echo off
echo Einrichtung des Git Credential Helpers...
echo.
echo Dies wird Git so konfigurieren, dass deine Anmeldedaten gespeichert werden.
echo Du musst dein Passwort oder Token nur einmal eingeben.
echo.
echo WICHTIG: Für GitHub wird empfohlen, einen persönlichen Zugriffstoken zu verwenden!
echo Token erstellen: https://github.com/settings/tokens
echo.
echo Drücke eine beliebige Taste, um fortzufahren oder STRG+C zum Abbrechen...
pause > nul

echo.
echo Konfiguriere Git Credential Helper...
git config --global credential.helper store

echo.
echo Erfolgreich konfiguriert!
echo.
echo Als nächstes:
echo 1. Führe "git-auto.bat" aus
echo 2. Gib deinen GitHub-Benutzernamen und Passwort/Token ein, wenn du dazu aufgefordert wirst
echo 3. Bei zukünftigen Aufrufen werden keine Anmeldedaten mehr benötigt
echo.
echo Fertig!
pause 