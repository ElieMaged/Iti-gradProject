# Vercel Deployment Troubleshooting Guide

## Common Vercel Deployment Issues and Solutions

### 1. Build Failures

#### Issue: Build Command Fails
**Symptoms:**
- Build fails during `npm run build`
- Error messages in Vercel build logs

**Solutions:**
1. **Check Node.js Version:**
   ```bash
   # Ensure you're using Node.js 18+ (as specified in package.json)
   node --version
   ```

2. **Clear Cache and Reinstall:**
   ```bash
   # Locally test the build
   npm run clean
   npm install
   npm run build
   ```

3. **Check for Missing Dependencies:**
   - Ensure all dependencies are in `package.json`
   - Move any runtime dependencies from `devDependencies` to `dependencies`

#### Issue: Environment Variables Missing
**Symptoms:**
- Firebase configuration errors
- EmailJS configuration errors

**Solutions:**
1. **Add Environment Variables in Vercel:**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add all required environment variables:
     ```
     VITE_FIREBASE_API_KEY=your_firebase_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
     VITE_EMAILJS_SERVICE_ID=your_service_id
     ```

2. **Check Environment Variable Usage:**
   - Ensure all environment variables are prefixed with `VITE_` for Vite
   - Use `import.meta.env.VITE_VARIABLE_NAME` in your code

### 2. Routing Issues

#### Issue: 404 Errors on Direct Navigation
**Symptoms:**
- Direct URL access returns 404
- Page refreshes fail

**Solutions:**
1. **Verify vercel.json Configuration:**
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

2. **Check Vue Router Mode:**
   - Ensure you're using `createWebHistory()` in your router
   - Verify base path configuration

### 3. Asset Loading Issues

#### Issue: Static Assets Not Loading
**Symptoms:**
- Images, CSS, JS files return 404
- Broken links to assets

**Solutions:**
1. **Check Asset Paths:**
   - Ensure all asset paths are relative or use `@/` alias
   - Verify `public` directory structure

2. **Update vite.config.js:**
   ```javascript
   export default defineConfig({
     base: '/',
     build: {
       outDir: 'dist',
       assetsDir: 'assets'
     }
   })
   ```

### 4. Firebase Configuration Issues

#### Issue: Firebase Not Working in Production
**Symptoms:**
- Firebase authentication fails
- Firestore operations fail
- Storage uploads fail

**Solutions:**
1. **Check Firebase Project Settings:**
   - Ensure your domain is added to authorized domains
   - Verify Firebase project is in the correct region

2. **Update Firebase Security Rules:**
   - Deploy updated Firestore rules
   - Check Storage rules

3. **Verify Firebase Config:**
   ```javascript
   // Ensure config is loaded from environment variables
   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
     appId: import.meta.env.VITE_FIREBASE_APP_ID
   };
   ```

### 5. EmailJS Issues in Production

#### Issue: EmailJS Not Working
**Symptoms:**
- Emails not sent from production
- EmailJS errors in console

**Solutions:**
1. **Check EmailJS Configuration:**
   - Verify public key is correct
   - Ensure service ID and template IDs are valid

2. **Update EmailJS Config:**
   ```javascript
   // src/utils/emailjsConfig.js
   export const EMAILJS_CONFIG = {
     serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '123321',
     templateId: 'template_rn9r37x', // for user signup
     publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'kGW9e5lc8iBvIT3Qw'
   };
   ```

### 6. Performance Issues

#### Issue: Slow Loading Times
**Symptoms:**
- Large bundle sizes
- Slow initial page load

**Solutions:**
1. **Optimize Bundle Size:**
   - Check current bundle size: `npm run build:analyze`
   - Implement code splitting
   - Lazy load components

2. **Optimize Images:**
   - Compress images
   - Use WebP format
   - Implement lazy loading

### 7. Specific Troubleshooting Steps

#### Step 1: Local Build Test
```bash
# Test build locally first
npm run clean
npm install
npm run build
npm run preview
```

#### Step 2: Check Vercel Build Logs
1. Go to your Vercel dashboard
2. Click on the latest deployment
3. Check the build logs for specific errors

#### Step 3: Verify Environment Variables
```bash
# Create a test script to verify environment variables
echo "VITE_FIREBASE_API_KEY: ${VITE_FIREBASE_API_KEY}"
echo "VITE_EMAILJS_PUBLIC_KEY: ${VITE_EMAILJS_PUBLIC_KEY}"
```

#### Step 4: Check Dependencies
```bash
# Ensure all dependencies are properly listed
npm ls --depth=0
```

### 8. Common Error Messages and Solutions

#### "Module not found"
- Check import paths
- Verify file extensions
- Ensure all dependencies are installed

#### "Cannot read property of undefined"
- Check environment variables
- Verify Firebase initialization
- Check component props

#### "Build failed with exit code 1"
- Check for syntax errors
- Verify all imports are correct
- Check for missing dependencies

### 9. Deployment Checklist

Before deploying to Vercel:

- [ ] All environment variables are set in Vercel dashboard
- [ ] Local build succeeds (`npm run build`)
- [ ] Local preview works (`npm run preview`)
- [ ] All Firebase rules are deployed
- [ ] All dependencies are in `package.json`
- [ ] No hardcoded API keys in code
- [ ] All asset paths are correct
- [ ] Router configuration is correct
- [ ] EmailJS configuration is correct

### 10. Quick Fixes

#### If Build Fails:
```bash
# Clear everything and rebuild
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

#### If Assets Don't Load:
```bash
# Check if assets are in the right place
ls -la dist/assets/
```

#### If Environment Variables Don't Work:
```bash
# Test environment variables locally
npm run build
# Check the built files for environment variable usage
```

### 11. Contact Support

If issues persist:
1. Check Vercel documentation
2. Review Vercel community forums
3. Contact Vercel support with specific error messages
4. Share build logs and environment configuration

### 12. Alternative Deployment Options

If Vercel continues to have issues:
- **Netlify**: Already configured in your project
- **Firebase Hosting**: Already configured in your project
- **GitHub Pages**: Can be configured for static hosting

Remember to update environment variables and configuration for each platform. 