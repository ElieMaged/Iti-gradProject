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