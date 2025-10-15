@echo off
echo Setting up Git configuration...
echo.

REM Configure Git user (replace with your details)
git config --global user.name "tejbruhath"
git config --global user.email "tejbruhath001@gmail.com"

echo.
echo Git configured successfully!
echo.
echo Now committing and pushing...
echo.

REM Commit all changes
git add .
git commit -m "Initial commit: NextChat with voice calling"

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo Done!
pause
