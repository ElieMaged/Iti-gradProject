# EmailJS Troubleshooting Guide

## Issue: Emails Not Being Sent

If you're not receiving emails after user registration, follow these steps:

### 1. Check Public Key Configuration

**Most Common Issue**: The public key is not configured.

1. Open `src/utils/emailjsConfig.js`
2. Replace `'YOUR_PUBLIC_KEY'` with your actual EmailJS public key:

```javascript
export const EMAILJS_CONFIG = {
  serviceId: '123321',
  templateId: 'template_rn9r37x',
  publicKey: 'your_actual_public_key_here' // ← Replace this
};
```

### 2. Get Your EmailJS Public Key

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Sign up or log in to your account
3. Navigate to "Account" → "API Keys"
4. Copy your Public Key (it looks like: `user_xxxxxxxxxxxxxxxxxxxx`)

### 3. Check Browser Console

After updating the public key:

1. Open browser developer tools (F12)
2. Go to Console tab
3. Register a new user
4. Look for these log messages:
   - "Starting email send process..."
   - "EmailJS Config: { serviceId: '123321', templateId: 'template_rn9r37x', publicKey: 'Set' }"
   - "Template parameters: { to_email: '...', to_name: '...', user_name: '...', service_name: 'BoltFix' }"
   - "Welcome email sent successfully: ..."

### 4. Common Error Messages

#### "EmailJS public key is not configured"
- **Solution**: Update the public key in `src/utils/emailjsConfig.js`

#### "Service not found" or "Template not found"
- **Solution**: Verify your Service ID and Template ID are correct
- Check your EmailJS dashboard for the correct IDs

#### "Invalid API key"
- **Solution**: Make sure you're using the Public Key, not the Private Key
- Public keys start with `user_`
- Private keys start with `service_`

### 5. Verify EmailJS Template Setup

Make sure your EmailJS template (`template_rn9r37x`) includes these variables:
- `{{to_email}}` - Target email address
- `{{to_name}}` - User's full name
- `{{user_name}}` - User's first name
- `{{service_name}}` - Service name (BoltFix)

### 6. Test EmailJS Service

1. Go to your EmailJS dashboard
2. Navigate to "Email Services"
3. Check if your service (ID: 123321) is active
4. Test the service manually from the dashboard

### 7. Check Email Provider Settings

- Check your spam/junk folder
- Verify the "from" email address in your EmailJS service
- Make sure your email provider allows emails from EmailJS

### 8. Debug Steps

1. **Update the public key** (most common fix)
2. **Register a new user** and check browser console
3. **Look for error messages** in the console
4. **Check EmailJS dashboard** for service status
5. **Test manually** from EmailJS dashboard

### 9. Alternative Testing

If you want to test without registering a new user, you can temporarily add this to your browser console:

```javascript
// Test email sending (replace with your actual public key)
import { sendWelcomeEmail } from './src/utils/emailService.js';
sendWelcomeEmail('test@example.com', 'Test', 'User');
```

### 10. Still Not Working?

1. Check if EmailJS service is properly configured
2. Verify template variables match exactly
3. Try a different email address
4. Check EmailJS account limits/quotas
5. Contact EmailJS support if needed

## Quick Fix Checklist

- [ ] Updated public key in `src/utils/emailjsConfig.js`
- [ ] Verified Service ID: `123321`
- [ ] Verified Template ID: `template_rn9r37x`
- [ ] Checked browser console for errors
- [ ] Verified EmailJS service is active
- [ ] Checked spam folder
- [ ] Tested with different email address 