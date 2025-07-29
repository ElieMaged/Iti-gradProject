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
