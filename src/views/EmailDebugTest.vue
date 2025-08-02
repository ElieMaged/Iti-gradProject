<template>
  <div class="email-debug-container">
    <h1>EmailJS Debug Test</h1>
    
    <div class="debug-section">
      <h2>Current Configuration</h2>
      <div class="config-display">
        <p><strong>Service ID:</strong> {{ config.serviceId }}</p>
        <p><strong>Template ID:</strong> {{ config.templateId }}</p>
        <p><strong>Public Key:</strong> {{ config.publicKey ? 'Set' : 'NOT SET' }}</p>
      </div>
    </div>

    <div class="debug-section">
      <h2>Test Email Sending</h2>
      <div class="form-group">
        <label>Test Email:</label>
        <input v-model="testEmail" type="email" placeholder="test@example.com" />
      </div>
      <div class="form-group">
        <label>Test Name:</label>
        <input v-model="testName" type="text" placeholder="Test User" />
      </div>
      <button @click="testBasicEmail" class="test-btn">Test Basic Email</button>
      <button @click="testWithRetry" class="test-btn">Test with Retry Logic</button>
      <button @click="testAlternativeVars" class="test-btn">Test Alternative Variables</button>
    </div>

    <div class="debug-section">
      <h2>Console Logs</h2>
      <div class="log-container">
        <div v-for="(log, index) in logs" :key="index" :class="['log-entry', log.type]">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
      <button @click="clearLogs" class="clear-btn">Clear Logs</button>
    </div>

    <div class="debug-section">
      <h2>Error Analysis</h2>
      <div v-if="lastError" class="error-analysis">
        <h3>Last Error Details:</h3>
        <pre>{{ JSON.stringify(lastError, null, 2) }}</pre>
      </div>
    </div>

    <div class="debug-section">
      <h2>Quick Tests</h2>
      <button @click="testEmailJSInit" class="test-btn">Test EmailJS Initialization</button>
      <button @click="testDirectSend" class="test-btn">Test Direct Send</button>
      <button @click="checkNetworkRequests" class="test-btn">Check Network Requests</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../utils/emailjsConfig';

const config = ref(EMAILJS_CONFIG);
const testEmail = ref('test@example.com');
const testName = ref('Test User');
const logs = ref([]);
const lastError = ref(null);

const addLog = (message, type = 'info') => {
  logs.value.push({
    time: new Date().toLocaleTimeString(),
    message,
    type
  });
};

const clearLogs = () => {
  logs.value = [];
  lastError.value = null;
};

const testEmailJSInit = async () => {
  try {
    addLog('Testing EmailJS initialization...', 'info');
    emailjs.init(config.value.publicKey);
    addLog('✅ EmailJS initialized successfully', 'success');
  } catch (error) {
    addLog(`❌ EmailJS initialization failed: ${error.message}`, 'error');
    lastError.value = error;
  }
};

const testBasicEmail = async () => {
  try {
    addLog('Testing basic email sending...', 'info');
    
    const templateParams = {
      to_email: testEmail.value,
      to_name: testName.value,
      user_name: testName.value.split(' ')[0],
      service_name: 'BoltFix'
    };
    
    addLog(`Sending with params: ${JSON.stringify(templateParams)}`, 'info');
    
    const response = await emailjs.send(
      config.value.serviceId,
      config.value.templateId,
      templateParams,
      config.value.publicKey
    );
    
    addLog('✅ Basic email sent successfully', 'success');
    addLog(`Response: ${JSON.stringify(response)}`, 'success');
  } catch (error) {
    addLog(`❌ Basic email failed: ${error.message}`, 'error');
    addLog(`Error status: ${error.status}`, 'error');
    addLog(`Error text: ${error.text}`, 'error');
    lastError.value = error;
  }
};

const testWithRetry = async () => {
  const maxRetries = 3;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      addLog(`Attempt ${attempt + 1} of ${maxRetries}...`, 'info');
      
      const templateParams = {
        to_email: testEmail.value,
        to_name: testName.value,
        user_name: testName.value.split(' ')[0],
        service_name: 'BoltFix'
      };
      
      const response = await emailjs.send(
        config.value.serviceId,
        config.value.templateId,
        templateParams,
        config.value.publicKey
      );
      
      addLog(`✅ Email sent successfully on attempt ${attempt + 1}`, 'success');
      return;
    } catch (error) {
      attempt++;
      addLog(`❌ Attempt ${attempt} failed: ${error.message}`, 'error');
      
      if (attempt === maxRetries) {
        addLog('❌ All retry attempts failed', 'error');
        lastError.value = error;
        return;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};

const testAlternativeVars = async () => {
  try {
    addLog('Testing with alternative variable names...', 'info');
    
    const templateParams = {
      to_email: testEmail.value,
      to_name: testName.value,
      user_name: testName.value.split(' ')[0],
      service_name: 'BoltFix',
      // Alternative variables
      email: testEmail.value,
      name: testName.value,
      first_name: testName.value.split(' ')[0],
      last_name: testName.value.split(' ')[1] || '',
      user_email: testEmail.value,
      recipient_email: testEmail.value
    };
    
    addLog(`Sending with alternative params: ${JSON.stringify(templateParams)}`, 'info');
    
    const response = await emailjs.send(
      config.value.serviceId,
      config.value.templateId,
      templateParams,
      config.value.publicKey
    );
    
    addLog('✅ Alternative variables email sent successfully', 'success');
  } catch (error) {
    addLog(`❌ Alternative variables email failed: ${error.message}`, 'error');
    lastError.value = error;
  }
};

const testDirectSend = async () => {
  try {
    addLog('Testing direct EmailJS send...', 'info');
    
    // Initialize first
    emailjs.init(config.value.publicKey);
    
    const response = await emailjs.send(
      '123321',
      'template_rn9r37x',
      {
        to_email: testEmail.value,
        to_name: testName.value,
        user_name: testName.value.split(' ')[0],
        service_name: 'BoltFix'
      },
      'kGW9e5lc8iBvIT3Qw'
    );
    
    addLog('✅ Direct send successful', 'success');
  } catch (error) {
    addLog(`❌ Direct send failed: ${error.message}`, 'error');
    lastError.value = error;
  }
};

const checkNetworkRequests = () => {
  addLog('📊 Check the Network tab in DevTools for EmailJS requests', 'info');
  addLog('Look for requests to api.emailjs.com', 'info');
  addLog('Check the response status and body for detailed error info', 'info');
};

onMounted(() => {
  addLog('EmailJS Debug Test Page Loaded', 'info');
  addLog(`Configuration loaded: ${JSON.stringify(config.value)}`, 'info');
});
</script>

<style scoped>
.email-debug-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.debug-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.debug-section h2 {
  margin-top: 0;
  color: #333;
}

.config-display {
  background-color: white;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #eee;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.test-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  margin: 5px;
  border-radius: 4px;
  cursor: pointer;
}

.test-btn:hover {
  background-color: #0056b3;
}

.clear-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.log-container {
  max-height: 300px;
  overflow-y: auto;
  background-color: #1e1e1e;
  color: #fff;
  padding: 10px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
}

.log-entry {
  margin-bottom: 5px;
  padding: 2px 0;
}

.log-time {
  color: #888;
  margin-right: 10px;
}

.log-entry.success {
  color: #28a745;
}

.log-entry.error {
  color: #dc3545;
}

.log-entry.info {
  color: #17a2b8;
}

.error-analysis {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 15px;
  margin-top: 10px;
}

.error-analysis pre {
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
}
</style> 