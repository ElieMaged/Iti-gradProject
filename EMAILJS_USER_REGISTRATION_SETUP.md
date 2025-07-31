# EmailJS User Registration Setup Guide

## Overview
This guide explains how to set up EmailJS for sending welcome/confirmation emails to users when they register on the BoltFix platform.

## Current Implementation
The user registration email confirmation is already implemented in `src/views/UserSignUp.vue`. When a user successfully registers:

1. User account is created in Firebase Auth
2. User document is created in Firestore
3. Welcome email is sent to the user's email address
4. User is redirected to the home page

## EmailJS Configuration Required

### Environment Variables
You need to set up the following environment variables in your `.env` file:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### EmailJS Service Setup

1. **Create EmailJS Account**
   - Go to [EmailJS.com](https://www.emailjs.com/)
   - Sign up for a free account
   - Verify your email address

2. **Add Email Service**
   - Go to Email Services in your EmailJS dashboard
   - Click "Add New Service"
   - Choose your email provider (Gmail, Outlook, etc.)
   - Follow the setup instructions
   - Copy the Service ID

3. **Create Email Template**
   - Go to Email Templates in your EmailJS dashboard
   - Click "Create New Template"
   - Use the template content below
   - Copy the Template ID

4. **Get Public Key**
   - Go to Account > API Keys in your EmailJS dashboard
   - Copy your Public Key

## Email Template Content

### Template Variables
The welcome email template uses these variables:
- `to_email`: User's email address
- `to_name`: User's full name
- `subject`: Email subject line
- `message`: Email content

### Template HTML
```html
<!DOCTYPE html>
<html>
<head>
    <title>Welcome to BoltFix</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #6B4FA1 0%, #8B6BCF 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Welcome to BoltFix!</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Your account is ready to go</p>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #6B4FA1; margin-top: 0; font-size: 24px;">Hello {{to_name}},</h2>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
                Welcome to BoltFix! Your account has been successfully created and you're now ready to connect with skilled technicians for all your home service needs.
            </p>
            
            <div style="background-color: #f8f9fa; border-left: 4px solid #6B4FA1; padding: 20px; margin: 25px 0;">
                <h3 style="color: #6B4FA1; margin-top: 0;">Your Account Details</h3>
                <p style="margin: 5px 0;"><strong>Email:</strong> {{to_email}}</p>
                <p style="margin: 5px 0;"><strong>Account Status:</strong> Active</p>
            </div>
            
            <h3 style="color: #6B4FA1; margin-top: 30px;">What You Can Do Now</h3>
            <ul style="font-size: 16px; line-height: 1.8;">
                <li>✅ Browse available technicians in your area</li>
                <li>✅ Book appointments for home services</li>
                <li>✅ Track your booking status in real-time</li>
                <li>✅ Leave reviews for technicians</li>
                <li>✅ Manage your profile and settings</li>
            </ul>
            
            <h3 style="color: #6B4FA1; margin-top: 30px;">Getting Started</h3>
            <ol style="font-size: 16px; line-height: 1.8;">
                <li>Browse our services (Plumbing, Electricity, Carpentry, etc.)</li>
                <li>Find a technician that matches your needs</li>
                <li>Book an appointment with your preferred date and time</li>
                <li>Track your booking status in real-time</li>
            </ol>
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="[YOUR_WEBSITE_URL]" style="background-color: #6B4FA1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Start Browsing Services</a>
            </div>
            
            <div style="background-color: #e8f4fd; border: 1px solid #bee5eb; border-radius: 5px; padding: 20px; margin: 25px 0;">
                <h4 style="color: #0c5460; margin-top: 0;">Need Help?</h4>
                <p style="margin: 5px 0; color: #0c5460;">
                    Contact our support team or check our FAQ section for assistance.
                </p>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #dee2e6;">
            <p style="margin: 0; color: #6c757d; font-size: 14px;">
                Thank you for choosing BoltFix!
            </p>
            <p style="margin: 10px 0 0 0; color: #6c757d; font-size: 12px;">
                Best regards,<br>The BoltFix Team
            </p>
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 20px 0;">
            <p style="margin: 0; color: #6c757d; font-size: 11px;">
                This is an automated email. Please do not reply to this message.
            </p>
        </div>
    </div>
</body>
</html>
```

## Testing the Email Setup

### 1. Check Environment Variables
Make sure your `.env` file has the correct EmailJS configuration:

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxxxxxxx
```

### 2. Test Registration
1. Start your development server
2. Go to the registration page
3. Fill out the registration form
4. Submit the form
5. Check the browser console for email sending logs
6. Check the user's email inbox for the welcome email

### 3. Debug Email Issues
If emails are not being sent, check:

1. **Browser Console**: Look for error messages in the console
2. **EmailJS Dashboard**: Check if emails are being sent from your EmailJS dashboard
3. **Environment Variables**: Verify all environment variables are set correctly
4. **Email Service**: Make sure your email service is properly configured

## Common Issues and Solutions

### Issue: "EmailJS environment variables are not configured"
**Solution**: Add the required environment variables to your `.env` file

### Issue: "Email service not found"
**Solution**: Check your EmailJS service configuration and make sure the service ID is correct

### Issue: "Template not found"
**Solution**: Verify the template ID and make sure the template exists in your EmailJS account

### Issue: Emails not being received
**Solution**: 
1. Check spam/junk folder
2. Verify email service configuration
3. Check EmailJS dashboard for delivery status

## Email Content Customization

The email content can be customized by modifying the `templateParams` object in the `sendWelcomeEmail` function in `src/views/UserSignUp.vue`.

Current email includes:
- Welcome message
- Account details
- Available features
- Getting started guide
- Support information

## Security Notes

1. **Environment Variables**: Never commit your EmailJS keys to version control
2. **Rate Limiting**: EmailJS has rate limits on free accounts
3. **Email Validation**: The system validates email format before sending
4. **Error Handling**: Email sending failures don't prevent user registration

## Next Steps

1. Set up your EmailJS account
2. Create the email template
3. Configure environment variables
4. Test the registration process
5. Monitor email delivery in EmailJS dashboard 