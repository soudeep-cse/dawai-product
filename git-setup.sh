#!/bin/bash

# Git setup script for Dawai website
# This script initializes git and pushes to GitHub

echo "🚀 Initializing Git repository..."
git init

echo "📝 Adding all files..."
git add .

echo "💾 Creating initial commit..."
git commit -m "Initial commit: Dawai medicine delivery website

Features:
- Bilingual support (Bangla/English)
- Homepage with hero and categories
- Category browsing with filters
- Medicine detail pages
- Prescription upload flow
- AI result page with duration calculator
- Checkout with delivery zones and payment methods
- Order tracking page
- Fully responsive design
- 22 mock medicines across 6 categories"

echo "🔗 Adding GitHub remote..."
git remote add origin https://github.com/soudeep-cse/dawai-product.git

echo "📤 Creating main branch and pushing..."
git branch -M main
git push -u origin main

echo "✅ Done! Your code is now on GitHub."
echo "Visit: https://github.com/soudeep-cse/dawai-product"
