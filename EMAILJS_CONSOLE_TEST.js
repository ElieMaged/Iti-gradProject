// EmailJS Console Test Commands
// Copy and paste these commands into your browser console to test EmailJS

// 1. Test EmailJS Initialization
console.log('=== Testing EmailJS Initialization ===');
emailjs.init('kGW9e5lc8iBvIT3Qw');
console.log('✅ EmailJS initialized');

// 2. Test Basic Email Send
console.log('=== Testing Basic Email Send ===');
emailjs.send('123321', 'template_rn9r37x', {
  to_email: 'test@example.com',
  to_name: 'Test User',
  user_name: 'Test',
  service_name: 'BoltFix'
}, 'kGW9e5lc8iBvIT3Qw')
.then(response => {
  console.log('✅ Email sent successfully:', response);
})
.catch(error => {
  console.error('❌ Email failed:', error);
  console.error('Error status:', error.status);
  console.error('Error text:', error.text);
});

// 3. Test with Different Variables
console.log('=== Testing with Alternative Variables ===');
emailjs.send('123321', 'template_rn9r37x', {
  to_email: 'test@example.com',
  to_name: 'Test User',
  user_name: 'Test',
  service_name: 'BoltFix',
  email: 'test@example.com',
  name: 'Test User',
  first_name: 'Test',
  last_name: 'User'
}, 'kGW9e5lc8iBvIT3Qw')
.then(response => {
  console.log('✅ Alternative variables email sent:', response);
})
.catch(error => {
  console.error('❌ Alternative variables email failed:', error);
});

// 4. Test Network Request
console.log('=== Check Network Tab ===');
console.log('1. Open DevTools (F12)');
console.log('2. Go to Network tab');
console.log('3. Run the email test above');
console.log('4. Look for requests to api.emailjs.com');
console.log('5. Check the response status and body');

// 5. Test with Retry Logic
console.log('=== Testing with Retry Logic ===');
async function testWithRetry() {
  const maxRetries = 3;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      console.log(`Attempt ${attempt + 1} of ${maxRetries}...`);
      
      const response = await emailjs.send('123321', 'template_rn9r37x', {
        to_email: 'test@example.com',
        to_name: 'Test User',
        user_name: 'Test',
        service_name: 'BoltFix'
      }, 'kGW9e5lc8iBvIT3Qw');
      
      console.log(`✅ Email sent successfully on attempt ${attempt + 1}:`, response);
      return;
    } catch (error) {
      attempt++;
      console.error(`❌ Attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        console.error('❌ All retry attempts failed');
        return;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}

// Run the retry test
testWithRetry();

// 6. Check EmailJS Configuration
console.log('=== EmailJS Configuration Check ===');
console.log('Service ID: 123321');
console.log('Template ID: template_rn9r37x');
console.log('Public Key: kGW9e5lc8iBvIT3Qw');

// 7. Test Template Variables
console.log('=== Template Variables Test ===');
const templateVars = {
  to_email: 'test@example.com',
  to_name: 'Test User',
  user_name: 'Test',
  service_name: 'BoltFix'
};
console.log('Template variables being sent:', templateVars);
console.log('Make sure these match exactly in your EmailJS template:');
console.log('- {{to_email}}');
console.log('- {{to_name}}');
console.log('- {{user_name}}');
console.log('- {{service_name}}');

// 8. Error Analysis Helper
function analyzeEmailJSError(error) {
  console.log('=== EmailJS Error Analysis ===');
  console.log('Error message:', error.message);
  console.log('Error status:', error.status);
  console.log('Error text:', error.text);
  console.log('Error name:', error.name);
  
  if (error.status === 412) {
    console.log('🔍 412 Error Analysis:');
    console.log('- Check EmailJS service configuration');
    console.log('- Verify template variables match exactly');
    console.log('- Check account credits and limits');
    console.log('- Ensure service ID and template ID are correct');
  }
}

// Usage: analyzeEmailJSError(errorObject); 