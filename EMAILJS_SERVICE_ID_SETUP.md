# EmailJS Service ID Setup Guide

## The Problem
The email isn't being sent because the **Service ID** is missing from your environment configuration.

## Quick Fix

### Step 1: Get Your Service ID
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Log in to your account
3. Click on **"Email Services"** in the left sidebar
4. Find your email service (Gmail, Outlook, etc.)
5. Copy the **Service ID** (looks like `service_xxxxxxx`)

### Step 2: Create .env File
Create a file named `.env` in your project root (same level as `package.json`) with this content:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id_here
```

Replace `your_service_id_here` with the actual Service ID you copied.

### Step 3: Restart Server
1. Stop your development server (Ctrl+C)
2. Start it again: `npm run dev`

### Step 4: Test
1. Register a new user
2. Check browser console for email logs
3. Check the user's email inbox

## Current Status
✅ **Template ID:** `template_rn9r37x` (working)
✅ **Public Key:** `kGW9e5lc8iBvIT3Qw` (working)
❌ **Service ID:** Missing (this is why emails aren't sent)

## What You Should See
After adding the Service ID:
- Console logs showing email sending
- Alert confirming email was sent
- Welcome email in the user's inbox

## Troubleshooting
If you still don't get emails:
1. Check browser console for error messages
2. Verify your EmailJS service is active
3. Check spam/junk folder
4. Make sure the Service ID is correct 