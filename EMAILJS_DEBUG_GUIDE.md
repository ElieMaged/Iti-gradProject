# EmailJS Debugging Guide

## 🚨 **Issue: Still No Emails Being Sent**

Let's systematically debug this step by step.

## **Step 1: Test EmailJS Connection**

1. **Open your browser** and go to: `http://localhost:5173/email-test`
2. **Check the configuration** - it should show:
   - Service ID: `123321`
   - Template ID: `template_rn9r37x`
   - Public Key: `Set`
3. **Click "Send Test Email"** and watch the logs
4. **Check browser console** (F12) for detailed error messages

## **Step 2: Common Issues & Solutions**

### **Issue 1: "Service not found" or "Template not found"**
- **Cause**: Wrong Service ID or Template ID
- **Solution**: 
  1. Go to your EmailJS dashboard
  2. Check the exact Service ID and Template ID
  3. Update `src/utils/emailjsConfig.js` with correct IDs

### **Issue 2: "Invalid API key"**
- **Cause**: Wrong public key format
- **Solution**: 
  1. Make sure you're using the **Public Key** (starts with `user_`)
  2. Not the Private Key (starts with `service_`)

### **Issue 3: "Network error" or "CORS error"**
- **Cause**: EmailJS service not properly configured
- **Solution**:
  1. Check your EmailJS service is active
  2. Verify the "from" email address is correct
  3. Test the service manually from EmailJS dashboard

### **Issue 4: "Template variables not found"**
- **Cause**: Template variables don't match
- **Solution**:
  1. Check your EmailJS template uses exactly: `{{to_email}}`, `{{to_name}}`, `{{user_name}}`, `{{service_name}}`
  2. Make sure there are no extra spaces or typos

## **Step 3: Manual Testing**

### **Test 1: EmailJS Dashboard Test**
1. Go to your EmailJS dashboard
2. Navigate to "Email Services"
3. Find service ID `123321`
4. Click "Test" button
5. Send a test email manually

### **Test 2: Browser Console Test**
Open browser console (F12) and run:
```javascript
// Test EmailJS directly
import { testEmailJSConnection } from './src/utils/emailService.js';
testEmailJSConnection();
```

### **Test 3: Registration Test**
1. Register a new user
2. Check browser console for these messages:
   - ✅ "=== Starting email send process ==="
   - ✅ "EmailJS Config: { publicKey: 'Set' }"
   - ✅ "Template parameters: { to_email: '...', ... }"
   - ✅ "Welcome email sent successfully: ..."

## **Step 4: Check EmailJS Account**

### **Verify Your EmailJS Setup:**
1. **Service Configuration**:
   - Service ID: `123321`
   - Service Type: Email
   - From Email: (your configured email)
   - Status: Active

2. **Template Configuration**:
   - Template ID: `template_rn9r37x`
   - Variables: `{{to_email}}`, `{{to_name}}`, `{{user_name}}`, `{{service_name}}`
   - Status: Active

3. **Account Status**:
   - Check if you have remaining email quota
   - Verify account is not suspended

## **Step 5: Alternative Solutions**

### **Option 1: Use Different Email Service**
If EmailJS continues to fail, consider:
- SendGrid
- Mailgun
- AWS SES

### **Option 2: Firebase Functions**
Use Firebase Functions to send emails server-side:
```javascript
// In Firebase Functions
const nodemailer = require('nodemailer');
// Configure email sending
```

### **Option 3: Simple Email Test**
Create a simple test to verify the issue:
```javascript
// Add this to UserSignUp.vue temporarily
const testSimpleEmail = async () => {
  try {
    const response = await emailjs.send(
      '123321',
      'template_rn9r37x',
      {
        to_email: 'your-email@example.com',
        to_name: 'Test User',
        user_name: 'Test',
        service_name: 'BoltFix'
      },
      'kGW9e5lc8iBvIT3Qw'
    );
    console.log('Simple test successful:', response);
  } catch (error) {
    console.error('Simple test failed:', error);
  }
};
```

## **Step 6: Debugging Checklist**

- [ ] ✅ Public key updated: `kGW9e5lc8iBvIT3Qw`
- [ ] ✅ Service ID verified: `123321`
- [ ] ✅ Template ID verified: `template_rn9r37x`
- [ ] ✅ EmailJS dashboard test passed
- [ ] ✅ Browser console shows no errors
- [ ] ✅ Template variables match exactly
- [ ] ✅ EmailJS service is active
- [ ] ✅ Account has remaining quota
- [ ] ✅ Checked spam folder
- [ ] ✅ Tested with different email address

## **Step 7: Get Help**

If still not working:
1. **Check EmailJS logs** in dashboard
2. **Contact EmailJS support** with error details
3. **Share browser console logs** for debugging
4. **Try a different email service** as backup

## **Quick Test Commands**

```bash
# Start development server
npm run dev

# Open email test page
# Go to: http://localhost:5173/email-test

# Check console logs
# Press F12 in browser
```

**Next Steps**: 
1. Go to `/email-test` page
2. Run the test
3. Share the console output with me
4. Check your EmailJS dashboard for any errors 