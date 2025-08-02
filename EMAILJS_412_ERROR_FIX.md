# EmailJS 412 Error - Complete Troubleshooting Guide

## What is a 412 Error?
A `412 Precondition Failed` error in EmailJS typically indicates that the request was rejected due to a precondition that wasn't met. This is often related to configuration issues or service limitations.

## Common Causes and Solutions

### 1. **Service Configuration Issues**
**Problem**: Your EmailJS service might not be properly configured.

**Solutions**:
- Log into your EmailJS dashboard at https://dashboard.emailjs.com/
- Go to "Email Services" and verify your service ID `123321` exists and is active
- Check if the service is properly connected to your email provider
- Ensure the service is not paused or disabled

### 2. **Template Variable Mismatch**
**Problem**: Template variables in your EmailJS template don't match what you're sending.

**Solutions**:
- In your EmailJS dashboard, go to "Email Templates"
- Open template `template_rn9r37x`
- Verify these variables exist exactly as written:
  - `{{to_email}}`
  - `{{to_name}}`
  - `{{user_name}}`
  - `{{service_name}}`
- Make sure there are no extra spaces or typos in variable names

### 3. **Account Credits/Limits**
**Problem**: Your EmailJS account might have reached its sending limits.

**Solutions**:
- Check your EmailJS dashboard for remaining credits
- Verify your account plan and sending limits
- Consider upgrading if you've reached your limit

### 4. **Public Key Issues**
**Problem**: The public key might be incorrect or expired.

**Solutions**:
- Go to EmailJS dashboard → "Account" → "API Keys"
- Verify your public key `kGW9e5lc8iBvIT3Qw` is correct
- Generate a new public key if needed
- Update the key in `src/utils/emailjsConfig.js`

### 5. **Template ID Issues**
**Problem**: The template ID might be incorrect or the template might be inactive.

**Solutions**:
- Verify template ID `template_rn9r37x` exists in your dashboard
- Check if the template is published and active
- Ensure the template is associated with the correct service

## Immediate Debugging Steps

### Step 1: Test Your EmailJS Configuration
Visit: `http://localhost:5173/simple-email-test` (or your dev server URL)

### Step 2: Check Console Logs
Look for these specific error messages in your browser console:
- `Error text:` - This will show the exact error message from EmailJS
- `412 Error Analysis:` - This will show our custom analysis

### Step 3: Manual EmailJS Dashboard Test
1. Go to https://dashboard.emailjs.com/
2. Navigate to "Email Templates"
3. Find template `template_rn9r37x`
4. Click "Test" button
5. Fill in the test parameters and send a test email

### Step 4: Verify Service Connection
1. In EmailJS dashboard, go to "Email Services"
2. Click on service ID `123321`
3. Check if the service shows as "Connected" or "Active"
4. If not, reconnect the service to your email provider

## Code Fixes to Try

### Fix 1: Add Error Retry Logic
```javascript
// In src/utils/emailService.js, modify sendWelcomeEmail function
export const sendWelcomeEmail = async (userEmail, firstName, lastName) => {
  const maxRetries = 3;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      // ... existing code ...
      return response;
    } catch (error) {
      attempt++;
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};
```

### Fix 2: Alternative Template Variables
Try these alternative variable names in your template:
```javascript
const templateParams = {
  to_email: userEmail,
  to_name: `${firstName} ${lastName}`,
  user_name: firstName,
  service_name: 'BoltFix',
  // Alternative variables
  email: userEmail,
  name: `${firstName} ${lastName}`,
  first_name: firstName,
  last_name: lastName
};
```

### Fix 3: Check Network Tab
1. Open browser DevTools
2. Go to Network tab
3. Try sending an email
4. Look for the EmailJS request
5. Check the response for detailed error information

## EmailJS Dashboard Checklist

- [ ] Service ID `123321` exists and is active
- [ ] Template ID `template_rn9r37x` exists and is published
- [ ] Template variables match exactly: `{{to_email}}`, `{{to_name}}`, `{{user_name}}`, `{{service_name}}`
- [ ] Public key `kGW9e5lc8iBvIT3Qw` is correct and active
- [ ] Account has sufficient credits
- [ ] Email service (Gmail, Outlook, etc.) is properly connected
- [ ] No IP restrictions or firewall blocking requests

## Alternative Solutions

### Option 1: Use Different Email Service
If EmailJS continues to fail, consider:
- SendGrid
- Mailgun
- AWS SES
- Firebase Functions with Nodemailer

### Option 2: Server-Side Email
Move email sending to your Firebase Functions:
```javascript
// In functions/index.js
const nodemailer = require('nodemailer');

exports.sendWelcomeEmail = functions.https.onCall(async (data, context) => {
  // Email sending logic here
});
```

## Contact EmailJS Support
If none of the above solutions work:
1. Go to https://www.emailjs.com/support
2. Include your error details and configuration
3. Provide the exact error message from console logs

## Quick Test Commands

Run these in your browser console to test:
```javascript
// Test EmailJS initialization
emailjs.init('kGW9e5lc8iBvIT3Qw');

// Test direct send
emailjs.send('123321', 'template_rn9r37x', {
  to_email: 'test@example.com',
  to_name: 'Test User',
  user_name: 'Test',
  service_name: 'BoltFix'
}, 'kGW9e5lc8iBvIT3Qw')
.then(response => console.log('Success:', response))
.catch(error => console.error('Error:', error));
```

## Next Steps
1. Try the debugging steps above
2. Check your EmailJS dashboard
3. Test with the simple email test page
4. If still failing, consider switching to a different email service
5. Update this guide with any new findings 