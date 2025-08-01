# PayPal Production Setup Guide

## Overview
This guide will help you configure PayPal for real payments instead of sandbox mode.

## Step 1: Get Your PayPal Production Client ID

1. **Go to PayPal Developer Dashboard**
   - Visit: https://developer.paypal.com/dashboard/
   - Sign in with your PayPal account

2. **Create a PayPal App (if you haven't already)**
   - Click "My Apps & Credentials"
   - Click "Create App"
   - Give your app a name (e.g., "BoltFix Payments")
   - Select "Business" account type
   - Click "Create App"

3. **Get Your Production Client ID**
   - In your app details, you'll see two environments:
     - **Sandbox** (for testing)
     - **Live** (for production)
   - Copy the **Live** Client ID (starts with "AQ...")

## Step 2: Configure Environment Variables

### For Local Development:
Create or update your `.env` file:
```env

VITE_PAYPAL_CLIENT_ID=YOUR_LIVE_PAYPAL_CLIENT_ID_HERE
```

### For Production Deployment:

#### Netlify:
1. Go to your Netlify dashboard
2. Navigate to Site settings > Environment variables
3. Add:
   - Key: `VITE_PAYPAL_CLIENT_ID`
   - Value: Your live PayPal Client ID

#### Vercel:
1. Go to your Vercel dashboard
2. Navigate to Project settings > Environment Variables
3. Add:
   - Name: `VITE_PAYPAL_CLIENT_ID`
   - Value: Your live PayPal Client ID
   - Environment: Production (and Preview if needed)

#### Firebase Hosting:
1. Go to Firebase Console
2. Navigate to Hosting > Settings
3. Add environment variable in your build configuration

## Step 3: Configure Firebase Functions for Production

### Update Firebase Functions Environment:

1. **Set Firebase Functions Environment Variables:**
```bash
firebase functions:config:set paypal.mode="live"
firebase functions:config:set paypal.client_id="YOUR_LIVE_PAYPAL_CLIENT_ID"
firebase functions:config:set paypal.client_secret="YOUR_LIVE_PAYPAL_CLIENT_SECRET"
```

2. **Get PayPal Client Secret:**
   - In your PayPal Developer Dashboard
   - Go to your app details
   - Copy the **Live** Client Secret

### Install PayPal Server SDK in Functions:

```bash
cd functions
npm install @paypal/checkout-server-sdk
```

### Update Firebase Functions Code:

The current functions are set up to record payment splits. For full production, you'll need to:

1. **Add PayPal Server SDK to functions/index.js:**
```javascript
const paypal = require('@paypal/checkout-server-sdk');

// Configure PayPal environment
function environment() {
  const clientId = functions.config().paypal.client_id;
  const clientSecret = functions.config().paypal.client_secret;
  
  if (functions.config().paypal.mode === 'live') {
    return new paypal.core.LiveEnvironment(clientId, clientSecret);
  } else {
    return new paypal.core.SandboxEnvironment(clientId, clientSecret);
  }
}

const client = new paypal.core.PayPalHttpClient(environment());
```

2. **Implement actual PayPal payouts:**
```javascript
exports.executePayPalPayouts = functions.https.onCall(async (data, context) => {
  try {
    const { splitId } = data;
    const db = admin.firestore();
    
    // Get the payment split record
    const splitDoc = await db.collection('paymentSplits').doc(splitId).get();
    const splitData = splitDoc.data();
    
    // Create PayPal payout request
    const request = new paypal.payouts.PayoutsPostRequest();
    request.requestBody({
      sender_batch_header: {
        sender_batch_id: `batch_${Date.now()}`,
        email_subject: "You have a payment from BoltFix"
      },
      items: [
        {
          recipient_type: "EMAIL",
          amount: {
            value: splitData.technicianAmountUSD,
            currency: "USD"
          },
          receiver: splitData.technicianAccount,
          note: "Payment for your service on BoltFix"
        }
      ]
    });
    
    const response = await client.execute(request);
    
    // Update the split record
    await db.collection('paymentSplits').doc(splitId).update({
      status: 'completed',
      paypalPayoutId: response.result.batch_header.payout_batch_id,
      success: true,
      message: 'Payouts executed successfully'
    });
    
    return { success: true, payoutId: response.result.batch_header.payout_batch_id };
    
  } catch (error) {
    console.error('Error executing PayPal payouts:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});
```

## Step 4: Update PayPal Configuration

The code has been updated to:
- Use production PayPal Client ID
- Show error if Client ID is not configured
- Remove sandbox fallback

## Step 5: Test Your Configuration

1. **Test with Small Amounts First**
   - Use a small test amount (e.g., $1.00)
   - Verify payment goes through
   - Check that technician receives their share

2. **Verify Payment Flow**
   - User selects PayPal payment
   - PayPal button appears
   - Payment is processed
   - Booking is created in Firebase
   - Payment details are recorded

## Step 6: Deploy to Production

### Deploy Firebase Functions:
```bash
firebase deploy --only functions
```

### Deploy Frontend:
```bash
npm run build
# Then deploy to your hosting platform
```

## Step 7: Monitor Payments

### PayPal Dashboard:
- Monitor payments in your PayPal Business account
- Check for any failed transactions
- Verify payouts to technicians

### Firebase:
- Check the `bookings` collection for payment details
- Monitor `failedPayPalTransactions` collection for errors
- Check `paymentSplits` collection for payout records

## Important Security Notes:

1. **Never commit your PayPal credentials to version control**
   - Keep them in environment variables only
   - Use `.env.example` for documentation

2. **Use HTTPS in Production**
   - PayPal requires HTTPS for live payments
   - Most hosting platforms provide this automatically

3. **Monitor for Fraud**
   - Set up PayPal notifications
   - Monitor unusual payment patterns
   - Consider implementing additional fraud detection

4. **Secure Firebase Functions**
   - Use Firebase Authentication to secure function calls
   - Validate all input data
   - Implement rate limiting

## Troubleshooting:

### Common Issues:

1. **"PayPal Client ID not configured"**
   - Check your environment variables
   - Ensure the variable name is exactly `VITE_PAYPAL_CLIENT_ID`
   - Redeploy after adding the variable

2. **PayPal button not appearing**
   - Check browser console for errors
   - Verify Client ID is correct
   - Ensure HTTPS is enabled

3. **Payment fails**
   - Check PayPal account status
   - Verify account is verified
   - Check for any PayPal account restrictions

4. **Firebase Functions deployment fails**
   - Check Firebase Functions logs
   - Verify PayPal credentials are set correctly
   - Ensure all dependencies are installed

### Testing Checklist:
- [ ] PayPal button appears when payment method is selected
- [ ] Payment processes successfully
- [ ] Booking is created in Firebase
- [ ] Payment details are recorded
- [ ] Technician receives notification
- [ ] User receives confirmation email
- [ ] Payment split is recorded in Firebase
- [ ] PayPal payout is executed (if implemented)

## Support:
- PayPal Developer Documentation: https://developer.paypal.com/docs/
- PayPal Business Support: https://www.paypal.com/business/contact-us
- Firebase Support: https://firebase.google.com/support

## Next Steps:
1. Set up PayPal webhooks for real-time notifications
2. Implement automated payouts to technicians
3. Add payment dispute handling
4. Set up detailed payment analytics
5. Implement refund functionality
6. Add payment reporting and analytics 