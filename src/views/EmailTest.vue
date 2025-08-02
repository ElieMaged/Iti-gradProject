<template>
  <div class="email-test-container">
    <h1>EmailJS Test Page</h1>
    
    <div class="test-section">
      <h2>Configuration</h2>
      <div class="config-info">
        <p><strong>Service ID:</strong> {{ config.serviceId }}</p>
        <p><strong>Template ID:</strong> {{ config.templateId }}</p>
        <p><strong>Public Key:</strong> {{ config.publicKey ? 'Set' : 'NOT SET' }}</p>
      </div>
    </div>

    <div class="test-section">
      <h2>Test Email Sending</h2>
      <div class="form-group">
        <label>Test Email:</label>
        <input v-model="testEmail" type="email" placeholder="test@example.com" />
      </div>
      <div class="form-group">
        <label>First Name:</label>
        <input v-model="testFirstName" type="text" placeholder="Test" />
      </div>
      <div class="form-group">
        <label>Last Name:</label>
        <input v-model="testLastName" type="text" placeholder="User" />
      </div>
      <button @click="testEmailSending" :disabled="isLoading" class="test-btn">
        {{ isLoading ? 'Sending...' : 'Send Test Email' }}
      </button>
    </div>

    <div class="test-section">
      <h2>Console Logs</h2>
      <div class="log-container">
        <div v-for="(log, index) in logs" :key="index" :class="['log-entry', log.type]">
          {{ log.message }}
        </div>
      </div>
      <button @click="clearLogs" class="clear-btn">Clear Logs</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { EMAILJS_CONFIG } from '../utils/emailjsConfig';
import { testEmailJSConnection, sendWelcomeEmail } from '../utils/emailService';

const config = EMAILJS_CONFIG;
const testEmail = ref('test@example.com');
const testFirstName = ref('Test');
const testLastName = ref('User');
const isLoading = ref(false);
const logs = ref([]);

const addLog = (message, type = 'info') => {
  logs.value.push({
    message: `[${new Date().toLocaleTimeString()}] ${message}`,
    type
  });
};

const clearLogs = () => {
  logs.value = [];
};

const testEmailSending = async () => {
  isLoading.value = true;
  addLog('Starting email test...', 'info');
  
  try {
    // Test the connection first
    addLog('Testing EmailJS connection...', 'info');
    const connectionTest = await testEmailJSConnection();
    
    if (connectionTest) {
      addLog('✅ Connection test successful', 'success');
      
      // Test actual email sending
      addLog('Testing welcome email sending...', 'info');
      await sendWelcomeEmail(testEmail.value, testFirstName.value, testLastName.value);
      addLog('✅ Welcome email test successful', 'success');
    } else {
      addLog('❌ Connection test failed', 'error');
    }
  } catch (error) {
    addLog(`❌ Error: ${error.message}`, 'error');
    console.error('Test error:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  addLog('EmailJS Test Page loaded', 'info');
  addLog(`Service ID: ${config.serviceId}`, 'info');
  addLog(`Template ID: ${config.templateId}`, 'info');
  addLog(`Public Key: ${config.publicKey ? 'Set' : 'NOT SET'}`, config.publicKey ? 'success' : 'error');
});
</script>

<style scoped>
.email-test-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
}

.test-section {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.config-info p {
  margin: 0.5rem 0;
  font-family: monospace;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.test-btn, .clear-btn {
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
}

.test-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.clear-btn {
  background: #6c757d;
}

.log-container {
  max-height: 300px;
  overflow-y: auto;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  font-family: monospace;
  font-size: 0.875rem;
}

.log-entry {
  margin-bottom: 0.25rem;
  padding: 0.25rem;
  border-radius: 2px;
}

.log-entry.info {
  color: #0066cc;
}

.log-entry.success {
  color: #28a745;
  background: #d4edda;
}

.log-entry.error {
  color: #dc3545;
  background: #f8d7da;
}
</style> 