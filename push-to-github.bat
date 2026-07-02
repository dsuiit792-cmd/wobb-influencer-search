@echo off
echo.
echo ========================================
echo   Wobb Assignment - GitHub Push Script
echo ========================================
echo.

set /p GH_USER="Your GitHub username     : "
set /p GH_NAME="Your full name           : "
set /p GH_EMAIL="Your GitHub email        : "
set /p GH_TOKEN="GitHub Token (classic)   : "
set /p REPO_NAME="Repo name (e.g. wobb-influencer-search): "

echo.
echo Creating GitHub repository...

curl -s -o nul -w "HTTP: %%{http_code}" ^
  -X POST ^
  -H "Authorization: token %GH_TOKEN%" ^
  -H "Accept: application/vnd.github.v3+json" ^
  https://api.github.com/user/repos ^
  -d "{\"name\":\"%REPO_NAME%\",\"private\":false,\"description\":\"Wobb Vibe Coder Intern Assignment\"}"

echo.
git config user.name "%GH_NAME%"
git config user.email "%GH_EMAIL%"
git remote remove origin 2>nul
git remote add origin "https://%GH_TOKEN%@github.com/%GH_USER%/%REPO_NAME%.git"
git push -u origin master --force

echo.
echo ========================================
echo  Done! Repo: https://github.com/%GH_USER%/%REPO_NAME%
echo  Now email that URL to Lohit!
echo ========================================
pause
