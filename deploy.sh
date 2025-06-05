#!/bin/bash

# Corrison Astro Auto-Deploy Script
# Usage: ./deploy.sh

set -e

echo "🚀 Starting Corrison Astro deployment..."

# Configuration
PROJECT_DIR="/home/corrisonapi/web/corrisonapi.com/astro"
PUBLIC_DIR="/home/corrisonapi/web/corrisonapi.com/public_html"
BACKUP_DIR="/home/corrisonapi/backups/astro"

# Create backup of current deployment
echo "📦 Creating backup..."
mkdir -p "$BACKUP_DIR"
if [ -d "$PUBLIC_DIR" ] && [ "$(ls -A $PUBLIC_DIR)" ]; then
    tar -czf "$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).tar.gz" -C "$PUBLIC_DIR" .
    # Keep only last 5 backups
    ls -t "$BACKUP_DIR"/*.tar.gz | tail -n +6 | xargs -r rm
fi

# Navigate to project directory
cd "$PROJECT_DIR"

# Pull latest changes
echo "⬇️ Pulling latest changes from GitHub..."
git fetch origin
git reset --hard origin/main

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the project
echo "🔨 Building Astro project..."
npm run build

# Deploy to public directory
echo "🚚 Deploying to public directory..."
rsync -av --delete dist/ "$PUBLIC_DIR/"

# Set proper permissions
echo "🔐 Setting permissions..."
find "$PUBLIC_DIR" -type f -exec chmod 644 {} \;
find "$PUBLIC_DIR" -type d -exec chmod 755 {} \;
chown -R corrisonapi:corrisonapi "$PUBLIC_DIR"

# Clear any caches if needed
echo "🧹 Clearing caches..."
# Add any cache clearing commands here if needed

echo "✅ Deployment completed successfully!"
echo "🌐 Site updated at: https://corrisonapi.com"
echo "📊 Deployment time: $(date)"

# Test deployment
echo "🧪 Running basic deployment test..."
if curl -s -o /dev/null -w "%{http_code}" https://corrisonapi.com | grep -q "200"; then
    echo "✅ Site is responding correctly"
else
    echo "⚠️ Warning: Site may not be responding correctly"
fi