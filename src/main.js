import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import router from './router'
import "../fontawesome-free-6.7.2-web/css/all.min.css"
import "../fontawesome-free-6.7.2-web/js/all.min.js"
import i18n from './i18n'
import { initializeEmailJS } from './utils/emailService'
import { initializeAuth } from './utils/auth'

// Initialize EmailJS
initializeEmailJS();

// Initialize authentication and create app
async function initializeApp() {
  try {
    // Wait for authentication to be initialized
    await initializeAuth();
    
    const app = createApp(App);
    
    app.use(router)
      .use(i18n);
    
    // Mount the app after ensuring the DOM is ready
    if (document.getElementById('app')) {
      app.mount('#app');
    } else {
      // Fallback in case the element doesn't exist yet
      document.addEventListener('DOMContentLoaded', () => {
        app.mount('#app');
      });
    }
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
}

// Start the application
initializeApp().catch(error => {
  console.error('Application initialization failed:', error);
});
