// Test script for Vercel deployment verification
console.log('=== Vercel Deployment Test ===\n');

// Test environment variables
console.log('Environment Variables Check:');
console.log('VITE_FIREBASE_API_KEY:', import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Not set');
console.log('VITE_FIREBASE_AUTH_DOMAIN:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Not set');
console.log('VITE_FIREBASE_PROJECT_ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Not set');
console.log('VITE_EMAILJS_PUBLIC_KEY:', import.meta.env.VITE_EMAILJS_PUBLIC_KEY ? '✅ Set' : '❌ Not set');
console.log('VITE_EMAILJS_SERVICE_ID:', import.meta.env.VITE_EMAILJS_SERVICE_ID ? '✅ Set' : '❌ Not set');

// Test Firebase config
console.log('\nFirebase Configuration:');
try {
  const { firebaseConfig } = await import('./src/firebase.js');
  console.log('✅ Firebase config loaded successfully');
} catch (error) {
  console.log('❌ Firebase config error:', error.message);
}

// Test EmailJS config
console.log('\nEmailJS Configuration:');
try {
  const { EMAILJS_CONFIG } = await import('./src/utils/emailjsConfig.js');
  console.log('✅ EmailJS config loaded successfully');
  console.log('Service ID:', EMAILJS_CONFIG.serviceId);
  console.log('Template ID:', EMAILJS_CONFIG.templateId);
  console.log('Public Key:', EMAILJS_CONFIG.publicKey ? '✅ Set' : '❌ Not set');
} catch (error) {
  console.log('❌ EmailJS config error:', error.message);
}

// Test build configuration
console.log('\nBuild Configuration:');
console.log('Node version:', process.version);
console.log('NPM version:', process.env.npm_config_user_agent);

console.log('\n=== Test Complete ===');
console.log('\nNext steps:');
console.log('1. Set environment variables in Vercel dashboard');
console.log('2. Run: npm run build');
console.log('3. Run: npm run preview');
console.log('4. Deploy to Vercel'); 