<template>
  <div class="auth-test">
    <h1>Authentication Test Page</h1>
    
    <div class="auth-status">
      <h2>Current Authentication Status</h2>
      <div class="status-item">
        <strong>Is Authenticated:</strong> {{ authState.isAuthenticated ? 'Yes' : 'No' }}
      </div>
      <div class="status-item">
        <strong>User Type:</strong> {{ authState.userType || 'None' }}
      </div>
      <div class="status-item">
        <strong>User Email:</strong> {{ authState.user?.email || 'None' }}
      </div>
      <div class="status-item">
        <strong>Loading:</strong> {{ authState.isLoading ? 'Yes' : 'No' }}
      </div>
    </div>

    <div class="auth-actions">
      <h2>Authentication Actions</h2>
      <button @click="testAdmin" :disabled="!authState.isAuthenticated">
        Test Admin Access
      </button>
      <button @click="testTechnician" :disabled="!authState.isAuthenticated">
        Test Technician Access
      </button>
      <button @click="testUser" :disabled="!authState.isAuthenticated">
        Test User Access
      </button>
      <button @click="goToLogin">
        Go to Login
      </button>
    </div>

    <div class="test-results">
      <h2>Test Results</h2>
      <div v-for="result in testResults" :key="result.id" class="test-result">
        <span :class="result.success ? 'success' : 'error'">
          {{ result.message }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authState, isAdmin, isTechnician, isUser, waitForAuth } from '../utils/auth';

const router = useRouter();
const testResults = ref([]);

onMounted(async () => {
  await waitForAuth();
  console.log('Auth test page mounted');
});

function addTestResult(message, success = true) {
  testResults.value.push({
    id: Date.now(),
    message,
    success
  });
}

function testAdmin() {
  const result = isAdmin();
  addTestResult(`Admin check: ${result ? 'PASS' : 'FAIL'}`, result);
}

function testTechnician() {
  const result = isTechnician();
  addTestResult(`Technician check: ${result ? 'PASS' : 'FAIL'}`, result);
}

function testUser() {
  const result = isUser();
  addTestResult(`User check: ${result ? 'PASS' : 'FAIL'}`, result);
}

function goToLogin() {
  router.push('/userlogin');
}
</script>

<style scoped>
.auth-test {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.auth-status, .auth-actions, .test-results {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.status-item {
  margin-bottom: 0.5rem;
}

button {
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.test-result {
  margin-bottom: 0.5rem;
}

.success {
  color: #28a745;
}

.error {
  color: #dc3545;
}
</style>
