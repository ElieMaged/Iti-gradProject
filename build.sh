#!/bin/bash

# Production Build Script for Netlify

echo "🚀 Starting production build..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building for production..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build output: dist/"
else
    echo "❌ Build failed!"
    exit 1
fi 