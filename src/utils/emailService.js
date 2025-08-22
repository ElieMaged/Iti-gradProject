import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from './emailjsConfig';

/**
 * Test EmailJS connection and configuration
 */
export const testEmailJSConnection = async () => {
  try {
    console.log('=== EmailJS Connection Test ===');
    console.log('Config:', EMAILJS_CONFIG);
    
    // Test initialization
    emailjs.init(EMAILJS_CONFIG.publicKey);
    console.log('✅ EmailJS initialized successfully');
    
    // Test with minimal parameters
    const testParams = {
      to_email: 'test@example.com',
      to_name: 'Test User',
      user_name: 'Test',
      service_name: 'BoltFix'
    };
    
    console.log('Testing with parameters:', testParams);
    
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      testParams,
      EMAILJS_CONFIG.publicKey
    );
    
    console.log('✅ Test email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('❌ EmailJS test failed:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      status: error.status,
      text: error.text
    });
    return false;
  }
};

/**
 * Send welcome email to newly registered users
 * @param {string} userEmail - User's email address
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @returns {Promise} - EmailJS response
 */
export const sendWelcomeEmail = async (userEmail, firstName, lastName) => {
  try {
    // Validate inputs
    if (!userEmail || !firstName || !lastName) {
      throw new Error('Missing required parameters: userEmail, firstName, or lastName');
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      throw new Error('Invalid email format');
    }
    
    const templateParams = {
      to_email: userEmail,
      to_name: `${firstName} ${lastName}`,
      user_name: firstName,
      service_name: 'BoltFix'
    };

    // Check if public key is properly set
    if (!EMAILJS_CONFIG.publicKey || EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
      throw new Error('EmailJS public key is not configured. Please update src/utils/emailjsConfig.js');
    }

    // Initialize EmailJS before sending
    emailjs.init(EMAILJS_CONFIG.publicKey);
    
    // Add delay to ensure initialization is complete
    await new Promise(resolve => setTimeout(resolve, 100));

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams,
      EMAILJS_CONFIG.publicKey
    );

    return response;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
};

/**
 * Initialize EmailJS with public key
 */
export const initializeEmailJS = () => {
  try {
    if (!EMAILJS_CONFIG.publicKey || EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
      console.warn('EmailJS public key is not configured. Email functionality will not work.');
      return;
    }
    
    emailjs.init(EMAILJS_CONFIG.publicKey);
  } catch (error) {
    console.error('Failed to initialize EmailJS:', error);
  }
};

/**
 * Send booking confirmation email to customer
 * @param {Object} params - Confirmation details
 * @param {string} params.userEmail
 * @param {string} params.userName
 * @param {string} params.technicianName
 * @param {string} params.date
 * @param {string} params.time
 * @param {string} params.payment
 * @param {string} [params.bookingId]
 */
export const sendBookingConfirmationEmail = async (params) => {
  try {
    const { userEmail, userName, technicianName, date, time, payment, bookingId } = params || {};
    if (!userEmail || !userName || !technicianName || !date || !time || !payment) {
      throw new Error('Missing required parameters for booking confirmation email');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      throw new Error('Invalid user email format');
    }

    if (!EMAILJS_CONFIG.publicKey || EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
      throw new Error('EmailJS public key is not configured. Please update src/utils/emailjsConfig.js');
    }

    emailjs.init(EMAILJS_CONFIG.publicKey);
    await new Promise(resolve => setTimeout(resolve, 100));

    const detailedMessage = `\
Booking Confirmed - BoltFix\n\n\
Hello ${userName},\n\
Your booking has been confirmed. Here are your details:\n\
• Technician: ${technicianName}\n\
• Date: ${date}\n\
• Time: ${time}\n\
• Payment Method: ${payment}\n\
${bookingId ? `• Booking ID: ${bookingId}\n\n` : ''}\
Thank you for choosing BoltFix!`;

    const templateParams = {
      to_email: userEmail,
      to_name: userName,
      technician_name: technicianName,
      booking_date: date,
      booking_time: time,
      payment_method: payment,
      booking_id: bookingId || '',
      subject: 'Your Booking is Confirmed - BoltFix',
      message: detailedMessage
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams,
      EMAILJS_CONFIG.publicKey
    );
    return response;
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error);
    throw error;
  }
};

/**
 * Send booking request email to technician
 * @param {Object} bookingData - Booking information
 * @param {Object} technicianData - Technician information
 * @returns {Promise} - EmailJS response
 */
export const sendBookingRequestEmail = async (bookingData, technicianData) => {
  try {
    console.log('=== SENDING BOOKING REQUEST EMAIL ===');
    console.log('Booking data:', bookingData);
    console.log('Technician data:', technicianData);
    
    // Validate inputs
    if (!bookingData || !technicianData || !technicianData.email) {
      throw new Error('Missing required parameters: bookingData or technicianData.email');
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(technicianData.email)) {
      throw new Error('Invalid technician email format');
    }
    
    // Check if public key is properly set
    if (!EMAILJS_CONFIG.publicKey || EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
      throw new Error('EmailJS public key is not configured. Please update src/utils/emailjsConfig.js');
    }

    // Initialize EmailJS before sending
    emailjs.init(EMAILJS_CONFIG.publicKey);
    
    // Add delay to ensure initialization is complete
    await new Promise(resolve => setTimeout(resolve, 100));

    // Construct detailed address information
    const addressDetails = bookingData.address || 'Address not provided';
    const locationDetails = bookingData.locationDetails || {};
    
    // Create comprehensive message with all user and location details
    const detailedMessage = `
New Booking Request - BoltFix

Customer Information:
• Name: ${bookingData.userName}
• Email: ${bookingData.userEmail}
• Phone: ${bookingData.userPhone}

Booking Details:
• Date: ${bookingData.date}
• Time: ${bookingData.time}
• Payment Method: ${bookingData.payment}
• Total Amount: ${bookingData.price || 'N/A'}

Location Details:
• Full Address: ${addressDetails}
${locationDetails.street ? `• Street: ${locationDetails.street}` : ''}
${locationDetails.building ? `• Building: ${locationDetails.building}` : ''}
${locationDetails.area ? `• Area: ${locationDetails.area}` : ''}
${locationDetails.city ? `• City: ${locationDetails.city}` : ''}

Additional Notes:
${bookingData.note ? `• Customer Notes: ${bookingData.note}` : '• No additional notes provided'}

Please log in to your dashboard to accept or reject this booking request.

Best regards,
BoltFix Team
    `.trim();

    const templateParams = {
      to_email: technicianData.email,
      to_name: technicianData.fullName || technicianData.name || 'Technician',
      customer_name: bookingData.userName,
      customer_email: bookingData.userEmail,
      customer_phone: bookingData.userPhone,
      booking_date: bookingData.date,
      booking_time: bookingData.time,
      payment_method: bookingData.payment,
      technician_name: technicianData.fullName || technicianData.name,
      service_address: addressDetails,
      street_address: locationDetails.street || '',
      building_address: locationDetails.building || '',
      area_address: locationDetails.area || '',
      city_address: locationDetails.city || '',
      booking_amount: bookingData.price || 'N/A',
      customer_notes: bookingData.note || 'No additional notes provided',
      subject: 'New Booking Request - BoltFix',
      message: detailedMessage
    };

    console.log('Email template parameters:', templateParams);

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams,
      EMAILJS_CONFIG.publicKey
    );

    console.log('✅ Booking request email sent successfully:', response);
    return response;
    
  } catch (error) {
    console.error('❌ Failed to send booking request email:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      status: error.status,
      text: error.text
    });
    throw error;
  }
}; 