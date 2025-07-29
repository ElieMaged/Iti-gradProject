# EmailJS Booking Notification Setup Guide

## Overview
This guide explains how to set up EmailJS templates for booking notifications in the BoltFix application.

## Existing Templates

### 1. Booking Request Template (template_68btlks)
Used when users make booking requests to technicians.

### 2. Booking Status Template (template_booking_status) - NEW
Used when technicians accept or reject booking requests.

## Booking Status Email Template Setup

### Template Variables
The booking status template uses the following variables:

- `to_email`: Customer's email address
- `to_name`: Customer's name
- `technician_name`: Technician's name
- `booking_date`: Date of the booking
- `booking_time`: Time of the booking
- `booking_status`: "ACCEPTED" or "REJECTED"
- `status_message`: Custom message based on status
- `customer_name`: Customer's name
- `customer_email`: Customer's email
- `customer_phone`: Customer's phone number
- `booking_address`: Booking address
- `payment_method`: Payment method used

### Sample EmailJS Template Content

```html
<!DOCTYPE html>
<html>
<head>
    <title>Booking Status Update</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <img src="[YOUR_LOGO_URL]" alt="BoltFix Logo" style="height: 60px;">
            <h1 style="color: #6B4FA1; margin-top: 20px;">Booking Status Update</h1>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: {{#if_eq booking_status 'ACCEPTED'}}#28a745{{else}}#dc3545{{/if_eq}}; margin-top: 0;">
                Booking {{booking_status}}
            </h2>
            <p style="font-size: 18px; margin-bottom: 20px;">{{status_message}}</p>
        </div>
        
        <div style="background-color: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #6B4FA1; margin-top: 0;">Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Technician:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{{technician_name}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Date:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{{booking_date}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Time:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{{booking_time}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Address:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{{booking_address}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Payment Method:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{{payment_method}}</td>
                </tr>
            </table>
        </div>
        
        <div style="background-color: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #6B4FA1; margin-top: 0;">Customer Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{{customer_name}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{{customer_email}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{{customer_phone}}</td>
                </tr>
            </table>
        </div>
        
        {{#if_eq booking_status 'ACCEPTED'}}
        <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #155724; margin-top: 0;">Next Steps</h3>
            <ul style="margin: 0; padding-left: 20px;">
                <li>Prepare for your appointment</li>
                <li>Ensure someone is available at the specified time</li>
                <li>Have payment ready if paying cash on visit</li>
                <li>Contact the technician if you need to reschedule</li>
            </ul>
        </div>
        {{else}}
        <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #721c24; margin-top: 0;">What's Next?</h3>
            <ul style="margin: 0; padding-left: 20px;">
                <li>You can try booking with another technician</li>
                <li>Contact support if you have questions</li>
                <li>Check other available technicians in your area</li>
            </ul>
        </div>
        {{/if_eq}}
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; margin-bottom: 10px;">Thank you for using BoltFix!</p>
            <p style="color: #666; margin-bottom: 10px;">If you have any questions, please contact support.</p>
            <p style="color: #666; font-size: 12px;">© 2024 BoltFix. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

### Environment Variables
Add these to your `.env.local` file:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_BOOKING_STATUS_TEMPLATE_ID=template_booking_status
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

## Troubleshooting

### Common Issues
1. **Template not found**: Ensure the template ID matches exactly
2. **Variables not showing**: Check that variable names match the template
3. **Email not sending**: Verify EmailJS service is active and credentials are correct

### Testing
Use the test button in the technician pending bookings page to verify email functionality.

## Support
For EmailJS issues, refer to the official EmailJS documentation and support.