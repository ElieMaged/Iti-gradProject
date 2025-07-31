#!/bin/bash

# Comprehensive Deployment Script
# Supports multiple deployment platforms

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18 or higher."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js version: $(node -v)"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed."
        exit 1
    fi
    
    print_success "npm version: $(npm -v)"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm ci --production=false
    print_success "Dependencies installed successfully"
}

# Build the project
build_project() {
    print_status "Building project for production..."
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "Build completed successfully!"
        
        # Check if dist directory exists and has content
        if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
            print_success "Build output verified in dist/"
        else
            print_error "Build output not found or empty!"
            exit 1
        fi
    else
        print_error "Build failed!"
        exit 1
    fi
}

# Deploy to Firebase
deploy_firebase() {
    if command -v firebase &> /dev/null; then
        print_status "Deploying to Firebase..."
        firebase deploy --only hosting
        print_success "Firebase deployment completed!"
    else
        print_warning "Firebase CLI not found. Install with: npm install -g firebase-tools"
    fi
}

# Deploy to Netlify
deploy_netlify() {
    if command -v netlify &> /dev/null; then
        print_status "Deploying to Netlify..."
        netlify deploy --prod --dir=dist
        print_success "Netlify deployment completed!"
    else
        print_warning "Netlify CLI not found. Install with: npm install -g netlify-cli"
    fi
}

# Deploy to Vercel
deploy_vercel() {
    if command -v vercel &> /dev/null; then
        print_status "Deploying to Vercel..."
        vercel --prod
        print_success "Vercel deployment completed!"
    else
        print_warning "Vercel CLI not found. Install with: npm install -g vercel"
    fi
}

# Main deployment function
main() {
    print_status "🚀 Starting deployment process..."
    
    # Check prerequisites
    check_node
    check_npm
    
    # Install dependencies
    install_dependencies
    
    # Build project
    build_project
    
    # Ask user which platform to deploy to
    echo ""
    print_status "Choose deployment platform:"
    echo "1) Firebase"
    echo "2) Netlify"
    echo "3) Vercel"
    echo "4) All platforms"
    echo "5) Build only (no deployment)"
    echo ""
    read -p "Enter your choice (1-5): " choice
    
    case $choice in
        1)
            deploy_firebase
            ;;
        2)
            deploy_netlify
            ;;
        3)
            deploy_vercel
            ;;
        4)
            deploy_firebase
            deploy_netlify
            deploy_vercel
            ;;
        5)
            print_success "Build completed. Manual deployment required."
            ;;
        *)
            print_error "Invalid choice. Exiting."
            exit 1
            ;;
    esac
    
    print_success "🎉 Deployment process completed!"
}

# Run main function
main "$@" 