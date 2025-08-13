#!/bin/bash

# Deployment Information for web-devtools
# ========================================
# This project now uses GitHub Actions for automatic deployment!
# You no longer need to build locally before pushing.

echo "📦 Web DevTools - Deployment Information"
echo "========================================"
echo ""
echo "🚀 Deployment is now AUTOMATIC via GitHub Actions!"
echo ""
echo "How it works:"
echo "1. Make your changes to source files (src/, package.json, etc.)"
echo "2. Commit and push to main branch"
echo "3. GitHub Actions automatically:"
echo "   - Builds the React app"
echo "   - Creates a single index.html file"
echo "   - Deploys to GitHub Pages"
echo ""
echo "Your workflow:"
echo "  npm run dev          # Test locally"
echo "  git add -A           # Stage changes"
echo "  git commit -m '...'  # Commit"
echo "  git push            # Push - GitHub handles the rest!"
echo ""
echo "📍 Site URL: https://pauldprice.github.io/web-devtools/"
echo "📊 Build Status: https://github.com/pauldprice/web-devtools/actions"
echo ""
echo "No manual build needed! Just push your code 🎉"