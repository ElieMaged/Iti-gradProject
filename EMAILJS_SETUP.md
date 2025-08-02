# EmailJS Setup Guide

## Overview
This project uses EmailJS to send welcome emails to users when they register. The email functionality is implemented in the UserSignUp component.

## Setup Instructions

### 1. Get Your EmailJS Public Key
1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Sign up or log in to your account
3. Navigate to "Account" → "API Keys"
4. Copy your Public Key

### 2. Update Configuration
1. Open `src/utils/emailjsConfig.js`
2. Replace `'YOUR_PUBLIC_KEY'` with your actual EmailJS public key:

```javascript
export const EMAILJS_CONFIG = {
  serviceId: '123321',
  templateId: 'template_rn9r37x',
  publicKey: 'your_actual_public_key_here' // Replace this
};
```

### 3. Email Template Variables
The email template (`template_rn9r37x`) should include these variables:
- `{{to_email}}` - User's email address
- `{{to_name}}` - User's full name
- `{{user_name}}` - User's first name
- `{{service_name}}` - Service name (BoltFix)

### 4. Service Configuration
- **Service ID**: `123321` (as provided)
- **Template ID**: `template_rn9r37x` (as provided)

## How It Works

1. When a user successfully registers, the `handleRegister` function is called
2. After creating the user account in Firebase, the system calls `sendWelcomeEmail()`
3. EmailJS sends a welcome email to the user's email address
4. If email sending fails, the registration still succeeds (email failure doesn't block registration)

## Files Modified

- `src/views/UserSignUp.vue` - Added email sending functionality
- `src/utils/emailjsConfig.js` - EmailJS configuration
- `src/utils/emailService.js` - Email service functions
- `src/main.js` - EmailJS initialization

## Testing

1. Update the public key in the configuration
2. Register a new user account
3. Check the browser console for email sending logs
4. Verify the email is received at the registered email address

## Error Handling

- Email sending failures are logged but don't prevent user registration
- All email-related errors are caught and logged to the console
- The registration process continues even if email sending fails 