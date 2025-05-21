@echo off
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
git push origin master

echo.
echo Fertig!
pause 