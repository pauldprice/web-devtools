#!/bin/bash

# Build and Deploy Script for web-devtools
# This script builds the React app into a single HTML file and deploys it

echo "🔨 Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "📦 Copying build to root..."
cp dist/index.html ./index.html

echo "📝 Checking git status..."
git status --short

echo "🚀 Ready to deploy!"
echo "Run the following commands to deploy:"
echo "  git add index.html"
echo "  git commit -m 'Build and deploy latest version'"
echo "  git push origin main"
echo ""
echo "Or run: npm run deploy"