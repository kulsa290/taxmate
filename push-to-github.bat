@echo off
REM Git Push Script for Windows
REM This script commits and pushes all DevOps changes to GitHub

setlocal enabledelayedexpansion

echo.
echo ===================================
echo TaxMate Backend - Pushing to GitHub
echo ===================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo Error: Git is not installed
    echo Please install Git from: https://git-scm.com/download/win
    exit /b 1
)

REM Check if we're in a git repository
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo Error: Not in a git repository
    echo Run this from the root of taxmate-backend
    exit /b 1
)

REM Show current status
echo [1/5] Current Git Status:
git status
echo.

REM Stage all changes
echo [2/5] Staging all files...
git add .
echo All files staged.
echo.

REM Show what will be committed
echo [3/5] Files to be committed:
git diff --cached --name-only
echo.

REM Commit
echo [4/5] Creating commit...
git commit -m "feat: add comprehensive DevOps infrastructure (Phase 3E)

- Enhanced CI/CD pipeline with automated testing and coverage
- Performance testing (load, stress, Lighthouse CI)
- Automated database backups to S3 with restore verification
- Multi-environment deployment (dev/staging/prod)
- Security scanning (SAST, DAST, dependencies, containers)
- Database backup and disaster recovery procedures
- Complete DevOps documentation and guides

Phase 3E deliverables:
✓ 5 GitHub Workflows configured
✓ 2 Shell/PowerShell scripts for backup/restore
✓ 3 Environment-specific configurations
✓ 800+ lines of documentation
✓ Production-ready infrastructure"

if errorlevel 1 (
    echo Error: Git commit failed
    exit /b 1
)

echo Commit created successfully.
echo.

REM Push to GitHub
echo [5/5] Pushing to GitHub...
git push origin main
if errorlevel 1 (
    echo Error: Git push failed
    echo Please check your GitHub credentials and internet connection
    exit /b 1
)

echo.
echo ===================================
echo SUCCESS! Code pushed to GitHub
echo ===================================
echo.
echo Next steps:
echo 1. Go to: https://github.com/yourusername/taxmate-backend/actions
echo 2. Watch the workflows run
echo 3. Verify all checks pass
echo 4. Monitor deployments in the Actions tab
echo.
echo To setup GitHub Secrets, run:
echo   .\scripts\setup-github-secrets.ps1 -Mode Interactive
echo.
echo Documentation:
echo   - GOING_LIVE_QUICK_START.md
echo   - GOING_LIVE_CHECKLIST.md
echo   - DEVOPS_GUIDE.md
echo.
pause
