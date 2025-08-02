<template>
  <div class="simple-test-container">
    <h1>🧪 Simple EmailJS Test</h1>
    
    <div class="test-form">
      <div class="form-group">
        <label>Email to send to:</label>
        <input v-model="testEmail" type="email" placeholder="your-email@example.com" />
      </div>
      
      <div class="form-group">
        <label>First Name:</label>
        <input v-model="firstName" type="text" placeholder="Test" />
      </div>
      
      <div class="form-group">
        <label>Last Name:</label>
        <input v-model="lastName" type="text" placeholder="User" />
      </div>
      
      <button @click="sendTestEmail" :disabled="isLoading" class="send-btn">
        {{ isLoading ? 'Sending...' : 'Send Test Email' }}
      </button>
    </div>
    
    <div class="status" v-if="status">
      <div :class="['status-message', status.type]">
        {{ status.message }}
      </div>
    </div>
    
    <div class="instructions">
      <h3>Instructions:</h3>
      <ol>
        <li>Enter your email address</li>
        <li>Click "Send Test Email"</li>
        <li>Check browser console (F12) for logs</li>
        <li>Check your email inbox (and spam folder)</li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import emailjs from '@emailjs/browser';

const testEmail = ref('');
const firstName = ref('Test');
const lastName = ref('User');
const isLoading = ref(false);
const status = ref(null);

const sendTestEmail = async () => {
  if (!testEmail.value) {
    status.value = {
      type: 'error',
      message: 'Please enter an email address'
    };
    return;
  }

  isLoading.value = true;
  status.value = null;

  try {
    console.log('=== Starting Simple EmailJS Test ===');
    
    // Initialize EmailJS
    emailjs.init('kGW9e5lc8iBvIT3Qw');
    console.log('✅ EmailJS initialized');
    
    const templateParams = {
      to_email: testEmail.value,
      to_name: `${firstName.value} ${lastName.value}`,
      user_name: firstName.value,
      service_name: 'BoltFix'
    };
    
    console.log('📧 Sending email with params:', templateParams);
    
    const response = await emailjs.send(
      '123321',
      'template_rn9r37x',
      templateParams,
      'kGW9e5lc8iBvIT3Qw'
    );
    
    console.log('✅ Email sent successfully:', response);
    status.value = {
      type: 'success',
      message: 'Email sent successfully! Check your inbox (and spam folder).'
    };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    status.value = {
      type: 'error',
      message: `Failed to send email: ${error.message}`
    };
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.simple-test-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

.dark .simple-test-container {
  background: #1f2937;
  color: #f9fafb;
}

h1 {
  text-align: center;
  color: #374151;
  margin-bottom: 2rem;
}

.dark h1 {
  color: #f9fafb;
}

.test-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
}

.dark .form-group label {
  color: #d1d5db;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  color: #1f2937;
}

.dark .form-group input {
  background: #374151;
  border-color: #4b5563;
  color: #f9fafb;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.send-btn {
  width: 100%;
  padding: 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.send-btn:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.send-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.status {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 8px;
}

.status-message {
  font-weight: 600;
}

.status-message.success {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #10b981;
}

.status-message.error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #ef4444;
}

.instructions {
  margin-top: 2rem;
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 8px;
}

.dark .instructions {
  background: #374151;
}

.instructions h3 {
  margin-top: 0;
  color: #374151;
}

.dark .instructions h3 {
  color: #f9fafb;
}

.instructions ol {
  margin: 0;
  padding-left: 1.5rem;
}

.instructions li {
  margin-bottom: 0.5rem;
  color: #4b5563;
}

.dark .instructions li {
  color: #d1d5db;
}
</style> 