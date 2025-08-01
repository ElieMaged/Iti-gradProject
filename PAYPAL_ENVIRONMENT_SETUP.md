# PayPal Environment Setup Guide

## Current Issue
You're getting the error "Payment system not configured. Please contact support." because the `VITE_PAYPAL_CLIENT_ID` environment variable is not set in your project.

## Solution: Create .env File

### Step 1: Create .env file in your project root
Create a new file called `.env` in your project root directory (same level as `package.json`) with the following content:

```env
# PayPal Configuration
# Replace YOUR_PAYPAL_CLIENT_ID with your actual PayPal Client ID
VITE_PAYPAL_CLIENT_ID=YOUR_PAYPAL_CLIENT_ID

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=123321
VITE_EMAILJS_PUBLIC_KEY=kGW9e5lc8iBvIT3Qw
VITE_EMAILJS_TEMPLATE_ID=template_rn9r37x
```

### Step 2: Get Your PayPal Client ID

#### For Development/Testing (Sandbox):
1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Log in with your PayPal account
3. Go to "My Apps & Credentials"
4. Create a new app or use an existing one
5. Copy the **Client ID** (not the Secret)
6. Replace `YOUR_PAYPAL_CLIENT_ID` in your `.env` file

#### For Production (Live):
1. In the PayPal Developer Dashboard, switch to "Live" mode
2. Create a new app for live transactions
3. Copy the **Live Client ID**
4. Replace `YOUR_PAYPAL_CLIENT_ID` in your `.env` file

### Step 3: Restart Your Development Server
After creating the `.env` file:
```bash
npm run dev
```

## Testing the Setup

### Option 1: Use PayPal Sandbox (Recommended for Development)
1. Use your Sandbox Client ID in the `.env` file
2. Test with PayPal Sandbox accounts (create test accounts in PayPal Developer Dashboard)
3. No real money will be charged

### Option 2: Use PayPal Live (Production)
1. Use your Live Client ID in the `.env` file
2. Real transactions will occur
3. Only use this when ready for production

## Verification Steps

1. **Check Environment Variable Loading:**
   - Open browser console
   - Go to your booking page
   - Look for console logs starting with "🔧 PayPal Client ID found"
   - If you see "❌ PayPal Client ID not configured", the variable isn't set correctly

2. **Test PayPal Button:**
   - The PayPal button should load within 10 seconds
   - You should see "Loading payment system..." briefly
   - Then the PayPal button should appear

## Common Issues and Solutions

### Issue: "Payment system not configured"
**Solution:** Make sure your `.env` file:
- Is in the project root directory
- Has no spaces around the `=` sign
- Has the correct variable name `VITE_PAYPAL_CLIENT_ID`
- Contains a valid PayPal Client ID

### Issue: "Failed to load resource: 400"
**Solution:** This happens when:
- The Client ID is invalid
- You're using a Sandbox ID in production or vice versa
- The PayPal account is not properly configured

### Issue: PayPal button loads forever
**Solution:** 
- Check your internet connection
- Verify the Client ID is correct
- Try refreshing the page
- Check browser console for specific errors

## Development vs Production

### Development Environment:
```env
VITE_PAYPAL_CLIENT_ID=YOUR_SANDBOX_CLIENT_ID
```

### Production Environment:
```env
VITE_PAYPAL_CLIENT_ID=YOUR_LIVE_CLIENT_ID
```

## Security Notes

1. **Never commit your `.env` file to version control**
2. **The `.env` file should already be in your `.gitignore`**
3. **Client IDs are safe to expose in frontend code** (they're designed for this)
4. **Never expose PayPal Secrets** (those are for backend only)

## Next Steps

1. Create the `.env` file with your PayPal Client ID
2. Restart your development server
3. Test the booking page
4. If you need help getting a PayPal Client ID, let me know!

## Quick Test

After setting up your `.env` file, you can test if it's working by:

1. Opening your browser's developer tools (F12)
2. Going to the Console tab
3. Navigating to your booking page
4. Looking for these messages:
   - ✅ "🔧 PayPal Client ID found, loading script..."
   - ✅ "📦 PayPal script loaded successfully"
   - ✅ "✅ PayPal object available"

If you see "❌ PayPal Client ID not configured", double-check your `.env` file setup. 