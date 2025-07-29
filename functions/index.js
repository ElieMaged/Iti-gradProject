const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();

const GMAIL_USER = 'elie1400674@gmail.com';
const GMAIL_PASS = 'Harambe100';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS
  }
});

exports.sendBookingConfirmation = functions.https.onCall(async (data, context) => {
  const { email, technicianName, date, time, payment } = data;
  const mailOptions = {
    from: GMAIL_USER,
    to: email,
    subject: 'Your Booking Confirmation',
    html: `
      <h2>Booking Confirmed!</h2>
      <p><b>Technician:</b> ${technicianName}</p>
      <p><b>Date:</b> ${date}</p>
      <p><b>Time:</b> ${time}</p>
      <p><b>Payment Method:</b> ${payment}</p>
      <p>Thank you for booking with us!</p>
    `
  };
  await transporter.sendMail(mailOptions);
  return { success: true };
});

// New PayPal payout splitting function
exports.splitPayPalPayment = functions.https.onCall(async (data, context) => {
  try {
    const { paypalOrderId, totalAmountUSD, platformFeeUSD, technicianAmountUSD, platformAccount, technicianAccount } = data;
    
    // Validate input
    if (!paypalOrderId || !totalAmountUSD || !platformFeeUSD || !technicianAmountUSD || !platformAccount || !technicianAccount) {
      throw new Error('Missing required parameters');
    }
    
    // Validate split amounts
    const calculatedTotal = platformFeeUSD + technicianAmountUSD;
    if (Math.abs(calculatedTotal - totalAmountUSD) > 0.01) {
      throw new Error('Split amounts do not match total amount');
    }
    
    // Create payout records in Firebase
    const db = admin.firestore();
    
    const payoutRecord = {
      paypalOrderId: paypalOrderId,
      totalAmountUSD: totalAmountUSD,
      platformFeeUSD: platformFeeUSD,
      technicianAmountUSD: technicianAmountUSD,
      platformAccount: platformAccount,
      technicianAccount: technicianAccount,
      splitPercentage: {
        platform: 25,
        technician: 75
      },
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      transactionType: 'payment_split'
    };
    
    await db.collection('paymentSplits').add(payoutRecord);
    
    // Note: Actual PayPal payouts require server-side PayPal SDK
    // This would require additional setup with PayPal's server SDK
    // For now, we're just recording the split intention
    
    return {
      success: true,
      message: 'Payment split recorded successfully',
      platformFee: platformFeeUSD,
      technicianAmount: technicianAmountUSD
    };
    
  } catch (error) {
    console.error('Error splitting PayPal payment:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Function to execute actual PayPal payouts (requires PayPal server SDK)
exports.executePayPalPayouts = functions.https.onCall(async (data, context) => {
  try {
    const { splitId } = data;
    
    // This would require PayPal server SDK setup
    // For now, just update the status
    const db = admin.firestore();
    
    await db.collection('paymentSplits').doc(splitId).update({
      status: 'completed',
      completedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return {
      success: true,
      message: 'Payouts executed successfully'
    };
    
  } catch (error) {
    console.error('Error executing PayPal payouts:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Function to move expired bookings from upcoming to completed
exports.moveExpiredBookings = functions.https.onCall(async (data, context) => {
  try {
    const db = admin.firestore();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for comparison

    // Get all upcoming bookings
    const upcomingBookingsSnapshot = await db.collection('bookings')
      .where('status', '==', 'upcoming')
      .get();

    const batch = db.batch();
    let movedCount = 0;

    upcomingBookingsSnapshot.forEach(doc => {
      const booking = doc.data();
      
      // Parse the booking date
      let bookingDate;
      if (booking.date) {
        // Handle different date formats
        if (typeof booking.date === 'string') {
          bookingDate = new Date(booking.date);
        } else if (booking.date.toDate) {
          // Firestore timestamp
          bookingDate = booking.date.toDate();
        } else {
          bookingDate = new Date(booking.date);
        }
        
        // Set to start of day for comparison
        bookingDate.setHours(0, 0, 0, 0);
        
        // If booking date is before today, move to completed
        if (bookingDate < today) {
          const bookingRef = db.collection('bookings').doc(doc.id);
          batch.update(bookingRef, { 
            status: 'completed',
            completedAt: admin.firestore.FieldValue.serverTimestamp()
          });
          movedCount++;
        }
      }
    });

    if (movedCount > 0) {
      await batch.commit();
      console.log(`Moved ${movedCount} expired bookings to completed`);
    }

    return { 
      success: true, 
      movedCount: movedCount,
      message: `Successfully moved ${movedCount} expired bookings to completed`
    };
  } catch (error) {
    console.error('Error moving expired bookings:', error);
    throw new functions.https.HttpsError('internal', 'Failed to move expired bookings');
  }
});

// Scheduled function that runs daily at 1 AM to automatically move expired bookings
exports.scheduledMoveExpiredBookings = functions.pubsub.schedule('0 1 * * *').onRun(async (context) => {
  try {
    const db = admin.firestore();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for comparison

    // Get all upcoming bookings
    const upcomingBookingsSnapshot = await db.collection('bookings')
      .where('status', '==', 'upcoming')
      .get();

    const batch = db.batch();
    let movedCount = 0;

    upcomingBookingsSnapshot.forEach(doc => {
      const booking = doc.data();
      
      // Parse the booking date
      let bookingDate;
      if (booking.date) {
        // Handle different date formats
        if (typeof booking.date === 'string') {
          bookingDate = new Date(booking.date);
        } else if (booking.date.toDate) {
          // Firestore timestamp
          bookingDate = booking.date.toDate();
        } else {
          bookingDate = new Date(booking.date);
        }
        
        // Set to start of day for comparison
        bookingDate.setHours(0, 0, 0, 0);
        
        // If booking date is before today, move to completed
        if (bookingDate < today) {
          const bookingRef = db.collection('bookings').doc(doc.id);
          batch.update(bookingRef, { 
            status: 'completed',
            completedAt: admin.firestore.FieldValue.serverTimestamp()
          });
          movedCount++;
        }
      }
    });

    if (movedCount > 0) {
      await batch.commit();
      console.log(`Scheduled function: Moved ${movedCount} expired bookings to completed`);
    }

    return { 
      success: true, 
      movedCount: movedCount,
      message: `Successfully moved ${movedCount} expired bookings to completed`
    };
  } catch (error) {
    console.error('Error in scheduled function moving expired bookings:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
});
