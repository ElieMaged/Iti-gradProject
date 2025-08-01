// Test script to check environment variables
console.log('Testing environment variables...');

// Check if Vite environment variables are available
if (typeof import.meta !== 'undefined' && import.meta.env) {
  console.log('Vite environment detected');
  console.log('VITE_PAYPAL_CLIENT_ID:', import.meta.env.VITE_PAYPAL_CLIENT_ID);
  console.log('VITE_PAYPAL_CLIENT_ID length:', import.meta.env.VITE_PAYPAL_CLIENT_ID?.length);
  console.log('VITE_PAYPAL_CLIENT_ID is empty:', !import.meta.env.VITE_PAYPAL_CLIENT_ID);
} else {
  console.log('Vite environment not available');
}

// Check Node.js environment variables
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Direct PayPal Client ID:', process.env.VITE_PAYPAL_CLIENT_ID); 