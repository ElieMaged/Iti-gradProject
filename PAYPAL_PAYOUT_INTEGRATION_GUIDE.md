# PayPal Payout Integration Guide

## Current Implementation (Client-Side)

The payment splitting system is currently implemented client-side and stores split records in Firebase. This works without requiring Firebase Functions.

### How it works:
1. User makes PayPal payment
2. Payment is captured successfully
3. Split amounts are calculated (25% platform, 75% technician)
4. Split record is stored in `paymentSplits` collection
5. Admin can view and manage splits in dashboard

## Future Implementation (Server-Side with Firebase Functions)

When you upgrade to Firebase Blaze plan, you can implement real PayPal payouts:

### 1. Install PayPal SDK in Firebase Functions
```bash
cd functions
npm install @paypal/checkout-server-sdk
```

### 2. Set up PayPal Environment Variables
```bash
firebase functions:config:set paypal.client_id="YOUR_PAYPAL_CLIENT_ID"
firebase functions:config:set paypal.client_secret="YOUR_PAYPAL_CLIENT_SECRET"
firebase functions:config:set paypal.mode="sandbox" # or "live"
```

### 3. Update Firebase Function
```javascript
// functions/index.js
const paypal = require('@paypal/checkout-server-sdk');

// Configure PayPal environment
function environment() {
  const clientId = functions.config().paypal.client_id;
  const clientSecret = functions.config().paypal.client_secret;
  const mode = functions.config().paypal.mode;
  
  if (mode === 'live') {
    return new paypal.core.LiveEnvironment(clientId, clientSecret);
  } else {
    return new paypal.core.SandboxEnvironment(clientId, clientSecret);
  }
}

const client = new paypal.core.PayPalHttpClient(environment());

// Real PayPal payout function
exports.executePayPalPayout = functions.https.onCall(async (data, context) => {
  const { splitId } = data;
  
  try {
    // Get split data from Firebase
    const splitDoc = await admin.firestore().collection('paymentSplits').doc(splitId).get();
    const split = splitDoc.data();
    
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
            value: split.platformFeeUSD,
            currency: "USD"
          },
          receiver: split.platformAccount,
          note: "Platform fee from BoltFix booking",
          sender_item_id: `item_${Date.now()}_1`
        },
        {
          recipient_type: "EMAIL",
          amount: {
            value: split.technicianAmountUSD,
            currency: "USD"
          },
          receiver: split.technicianAccount,
          note: "Technician payment from BoltFix booking",
          sender_item_id: `item_${Date.now()}_2`
        }
      ]
    });
    
    // Execute payout
    const response = await client.execute(request);
    
    // Update split status
    await admin.firestore().collection('paymentSplits').doc(splitId).update({
      status: 'completed',
      paypalPayoutId: response.result.batch_header.payout_batch_id,
      completedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { success: true, payoutId: response.result.batch_header.payout_batch_id };
    
  } catch (error) {
    console.error('PayPal payout error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});
```

### 4. Deploy Functions
```bash
firebase deploy --only functions
```

## Current Testing

For now, you can test the system using:
1. **Execute** button - Creates transaction records in Firebase
2. **Simulate PayPal** button - Marks split as completed (simulation)

## PayPal Account Setup

1. **Platform Account**: `narutossj23@yahoo.com` (your account)
2. **Technician Accounts**: Each technician provides their PayPal email during registration

## Security Considerations

- PayPal API credentials should be stored in Firebase Functions config
- Never expose client secret in client-side code
- Use environment variables for different environments (sandbox/live)

## Testing Flow

1. Register a technician with their PayPal email
2. Make a booking with PayPal payment
3. Check admin dashboard for payment split
4. Use "Simulate PayPal" to test the flow
5. Verify split amounts (25% platform, 75% technician)

## Next Steps

1. Upgrade to Firebase Blaze plan
2. Set up PayPal developer account
3. Get PayPal API credentials
4. Implement real PayPal payouts
5. Test with sandbox environment
6. Deploy to production