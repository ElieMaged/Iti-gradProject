# Vercel Deployment Steps for Your Project

## ✅ Current Status
- ✅ Local build works (`npm run build` successful)
- ✅ Local preview works (`npm run preview` running)
- ✅ Firebase configuration uses environment variables
- ✅ EmailJS configuration updated to use environment variables
- ✅ vercel.json is properly configured

## 🚀 Step-by-Step Deployment Guide

### Step 1: Prepare Environment Variables

You need to set these environment variables in your Vercel dashboard:

#### Firebase Environment Variables:
```
VITE_FIREBASE_API_KEY=AIzaSyCge8apwznA8qhYMAUSaUltkYMnmYbBKv4
VITE_FIREBASE_AUTH_DOMAIN=iti-grad-a4054.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=iti-grad-a4054
VITE_FIREBASE_STORAGE_BUCKET=iti-grad-a4054.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=486586289668
VITE_FIREBASE_APP_ID=1:486586289668:web:daae46733ed16d2fe5ef51
VITE_FIREBASE_MEASUREMENT_ID=G-K6004N4Y0B
```

#### EmailJS Environment Variables:
```
VITE_EMAILJS_PUBLIC_KEY=kGW9e5lc8iBvIT3Qw
VITE_EMAILJS_SERVICE_ID=123321
VITE_EMAILJS_TEMPLATE_ID=template_rn9r37x
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option B: Using GitHub Integration
1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically deploy on each push

#### Option C: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables
5. Deploy

### Step 3: Configure Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each environment variable from Step 1
4. Make sure to set them for **Production**, **Preview**, and **Development** environments

### Step 4: Verify Deployment

After deployment, check:

1. **Homepage loads correctly**
2. **Firebase authentication works**
3. **EmailJS sends emails**
4. **All routes work (try direct navigation)**
5. **Images and assets load properly**

### Step 5: Troubleshoot Common Issues

#### If Build Fails:
```bash
# Check build logs in Vercel dashboard
# Common issues:
# - Missing environment variables
# - Syntax errors in code
# - Missing dependencies
```

#### If Firebase Doesn't Work:
1. Check Firebase console → Authentication → Authorized domains
2. Add your Vercel domain to authorized domains
3. Verify environment variables are set correctly

#### If EmailJS Doesn't Work:
1. Check EmailJS dashboard for service status
2. Verify public key and service ID
3. Check browser console for errors

#### If Routes Return 404:
1. Verify `vercel.json` configuration
2. Check Vue Router mode (should be `createWebHistory`)
3. Ensure all routes are properly defined

### Step 6: Performance Optimization

Your build shows some large chunks. Consider:

1. **Code Splitting**: Use dynamic imports for large components
2. **Image Optimization**: Compress images further
3. **Bundle Analysis**: Run `npm run build:analyze` to identify large dependencies

### Step 7: Monitoring

After deployment:
1. Set up Vercel Analytics
2. Monitor error logs
3. Set up alerts for build failures
4. Test all major user flows

## 🔧 Alternative Deployment Options

If Vercel continues to have issues, you have these alternatives:

### Firebase Hosting (Already Configured)
```bash
npm run deploy:firebase
```

### Netlify (Already Configured)
```bash
npm run deploy:netlify
```

## 📋 Pre-Deployment Checklist

- [ ] All environment variables are ready
- [ ] Local build succeeds (`npm run build`)
- [ ] Local preview works (`npm run preview`)
- [ ] All Firebase rules are deployed
- [ ] No hardcoded API keys in code
- [ ] All asset paths are correct
- [ ] Router configuration is correct
- [ ] EmailJS configuration is correct

## 🚨 Emergency Rollback

If deployment causes issues:
1. Use Vercel's rollback feature in dashboard
2. Or redeploy previous working version
3. Check environment variables are correct
4. Verify Firebase and EmailJS configurations

## 📞 Support

If you encounter issues:
1. Check Vercel build logs
2. Review this troubleshooting guide
3. Check Vercel documentation
4. Contact Vercel support with specific error messages

## 🎯 Next Steps

1. **Deploy to Vercel** using the steps above
2. **Test all functionality** on the live site
3. **Monitor performance** and errors
4. **Optimize** based on real usage data 