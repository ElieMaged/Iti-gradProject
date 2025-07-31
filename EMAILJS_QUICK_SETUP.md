# EmailJS Quick Setup Guide

## Current Status
✅ **Template ID:** `template_rn9r37x` (configured)
✅ **Public Key:** `kGW9e5lc8iBvIT3Qw` (configured)
⚠️ **Service ID:** Still needed

## Get Your Service ID

### Step 1: Go to EmailJS Dashboard
1. Visit [EmailJS.com](https://www.emailjs.com/)
2. Log in to your account

### Step 2: Find Your Service ID
1. Go to **"Email Services"** in the left sidebar
2. Look for your email service (Gmail, Outlook, etc.)
3. Copy the **Service ID** (looks like `service_xxxxxxx`)

### Step 3: Add Service ID to Environment
Create a `.env` file in your project root with:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id_here
```

### Step 4: Test the Email
1. Restart your development server
2. Register a new user
3. Check the user's email inbox

## Current Implementation
The email system is now configured with:
- **Template ID:** `template_rn9r37x`
- **Public Key:** `kGW9e5lc8iBvIT3Qw`
- **Service ID:** Needs to be added to `.env` file

## Testing
When you register a new user, you should see:
1. Console logs showing email sending attempt
2. Alert confirming email was sent
3. Welcome email in the user's inbox

## Troubleshooting
If emails aren't being sent:
1. Check browser console for error messages
2. Verify your EmailJS service is active
3. Check spam/junk folder
4. Ensure service ID is correct in `.env` file 