# 🚀 Deployment Guide

This guide covers how to deploy your Vue.js application to various platforms.

## 📋 Prerequisites

- Node.js 18+ 
- npm 8+
- Git

## 🛠️ Build Commands

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🌐 Deployment Options

### 1. Firebase Hosting

**Prerequisites:**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

**Deploy:**
```bash
npm run deploy:firebase
# or
firebase deploy --only hosting
```

### 2. Netlify

**Prerequisites:**
```bash
npm install -g netlify-cli
netlify login
```

**Deploy:**
```bash
npm run deploy:netlify
# or
netlify deploy --prod --dir=dist
```

### 3. Vercel

**Prerequisites:**
```bash
npm install -g vercel
vercel login
```

**Deploy:**
```bash
npm run deploy:vercel
# or
vercel --prod
```

### 4. Automated Deployment

Use the comprehensive deployment script:
```bash
npm run deploy
# or
bash deploy.sh
```

## 🔧 Configuration Files

### Firebase Configuration
- `firebase.json` - Firebase project configuration
- `firestore.rules` - Firestore security rules
- `firestore.indexes.json` - Firestore indexes
- `storage.rules` - Firebase Storage rules

### Netlify Configuration
- `netlify.toml` - Netlify build settings and redirects

### Vercel Configuration
- `vercel.json` - Vercel deployment settings

## 📦 Build Optimization

The project includes several optimizations:

1. **Code Splitting**: Vendor, Firebase, and UI libraries are split into separate chunks
2. **Minification**: Terser is used for JavaScript minification
3. **Asset Optimization**: Images and assets are optimized during build
4. **Console Removal**: Console logs are removed in production builds

## 🔍 Performance Monitoring

### Bundle Analysis
```bash
npm run build:analyze
```

### Test Production Build
```bash
npm run test:build
```

## 🧹 Maintenance

### Clean Install
```bash
npm run clean
```

### Update Dependencies
```bash
npm update
```

## 🚨 Troubleshooting

### Build Issues
1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Check Node.js version:
   ```bash
   node --version
   ```

### Deployment Issues
1. Verify Firebase project configuration
2. Check environment variables
3. Ensure all dependencies are installed

### Performance Issues
1. Run bundle analysis to identify large dependencies
2. Check for unused imports
3. Optimize images and assets

## 📊 Environment Variables

Create `.env.production` for production-specific settings:

```env
NODE_ENV=production
VITE_APP_ENV=production
VITE_APP_DEBUG=false
```

## 🔒 Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **Firebase Rules**: Review and test security rules
3. **CORS**: Configure CORS settings for your domain
4. **HTTPS**: Ensure all deployments use HTTPS

## 📈 Monitoring

### Firebase Analytics
- Enable Firebase Analytics in your project
- Track user interactions and performance

### Error Tracking
- Consider implementing error tracking (Sentry, etc.)
- Monitor console errors in production

## 🎯 Best Practices

1. **Test Before Deploy**: Always test locally with `npm run preview`
2. **Incremental Deployments**: Deploy to staging first
3. **Rollback Plan**: Keep previous versions for quick rollback
4. **Monitoring**: Set up alerts for downtime or errors
5. **Backup**: Regularly backup your Firebase data

## 📞 Support

For deployment issues:
1. Check the platform-specific documentation
2. Review build logs for errors
3. Verify configuration files
4. Test with a minimal build first

---

**Happy Deploying! 🚀** 