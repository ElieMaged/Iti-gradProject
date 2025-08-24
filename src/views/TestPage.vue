<template>
  <div class="test-container">
    <h1>🚀 Deployment Test Page</h1>
    
    <div class="test-section">
      <h2>✅ Basic Rendering Test</h2>
      <p>If you can see this page, Vue.js is working correctly!</p>
    </div>

    <div class="test-section">
      <h2>🔧 Environment Variables</h2>
      <div class="env-info">
        <p><strong>NODE_ENV:</strong> {{ nodeEnv }}</p>
        <p><strong>MODE:</strong> {{ mode }}</p>
        <p><strong>BASE_URL:</strong> {{ baseUrl }}</p>
        <p><strong>Firebase API Key:</strong> {{ firebaseApiKey ? 'SET' : 'NOT SET' }}</p>
      </div>
    </div>

    <div class="test-section">
      <h2>🔐 Authentication State</h2>
      <div class="auth-info">
        <p><strong>Auth Loading:</strong> {{ authState.isLoading ? 'Loading...' : 'Ready' }}</p>
        <p><strong>Authenticated:</strong> {{ authState.isAuthenticated ? 'Yes' : 'No' }}</p>
        <p><strong>User Type:</strong> {{ authState.userType || 'None' }}</p>
        <p><strong>User Email:</strong> {{ authState.user?.email || 'None' }}</p>
      </div>
    </div>

    <div class="test-section">
      <h2>🌐 Navigation Test</h2>
      <div class="nav-buttons">
        <button @click="goToHome" class="test-btn">Go to Home</button>
        <button @click="goToUserSignUp" class="test-btn">Go to User SignUp</button>
        <button @click="goToTechRegister" class="test-btn">Go to Tech Register</button>
        <button @click="reloadPage" class="test-btn">Reload Page</button>
      </div>
    </div>

    <div class="test-section">
      <h2>📊 Console Logs</h2>
      <p>Check the browser console for detailed debugging information.</p>
      <button @click="logDebugInfo" class="test-btn">Log Debug Info</button>
    </div>

    <div class="test-section">
      <h2>🎨 Styling Test</h2>
      <div class="style-test">
        <div class="test-box primary">Primary Color</div>
        <div class="test-box secondary">Secondary Color</div>
        <div class="test-box accent">Accent Color</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authState } from '../utils/auth';

const router = useRouter();

// Environment variables
const nodeEnv = import.meta.env.NODE_ENV;
const mode = import.meta.env.MODE;
const baseUrl = import.meta.env.BASE_URL;
const firebaseApiKey = import.meta.env.VITE_FIREBASE_API_KEY;

onMounted(() => {
  console.log('=== TEST PAGE MOUNTED ===');
  console.log('Environment:', { nodeEnv, mode, baseUrl });
  console.log('Auth State:', authState);
  console.log('Router:', router);
  console.log('Current Route:', router.currentRoute.value);
});

const goToHome = () => {
  router.push('/');
};

const goToUserSignUp = () => {
  router.push('/usersignup');
};

const goToTechRegister = () => {
  router.push('/techregister');
};

const reloadPage = () => {
  window.location.reload();
};

const logDebugInfo = () => {
  console.log('=== DEBUG INFO ===');
  console.log('Window location:', window.location);
  console.log('User agent:', navigator.userAgent);
  console.log('Screen size:', { width: screen.width, height: screen.height });
  console.log('Viewport size:', { width: window.innerWidth, height: window.innerHeight });
  console.log('Local storage:', Object.keys(localStorage));
  console.log('Session storage:', Object.keys(sessionStorage));
  console.log('Cookies:', document.cookie);
};
</script>

<style scoped>
.test-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.test-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
}

.test-section h1 {
  color: #625397;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-align: center;
}

.test-section h2 {
  color: #374151;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #625397;
  padding-bottom: 0.5rem;
}

.env-info, .auth-info {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  font-family: monospace;
}

.env-info p, .auth-info p {
  margin: 0.5rem 0;
}

.nav-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.test-btn {
  background: #625397;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.test-btn:hover {
  background: #7c3aed;
  transform: translateY(-1px);
}

.style-test {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.test-box {
  padding: 1rem;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  min-width: 120px;
  text-align: center;
}

.test-box.primary {
  background: #625397;
}

.test-box.secondary {
  background: #6b7280;
}

.test-box.accent {
  background: #10b981;
}

@media (max-width: 768px) {
  .test-container {
    padding: 1rem;
  }
  
  .nav-buttons {
    flex-direction: column;
  }
  
  .style-test {
    flex-direction: column;
  }
}
</style> 