import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import router from './router'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import "../fontawesome-free-6.7.2-web/css/all.min.css"
import "../fontawesome-free-6.7.2-web/js/all.min.js"
import i18n from './i18n'
import { initializeEmailJS } from './utils/emailService'
import { initializeAuth } from './utils/auth'

// Initialize EmailJS
initializeEmailJS();

// Initialize authentication and create app
async function initializeApp() {
  console.log('=== MAIN.JS INITIALIZATION START ===');
  
  // Wait for authentication to be initialized
  console.log('Initializing authentication...');
  await initializeAuth();
  console.log('Authentication initialized');
  
  console.log('Creating Vue app...');
  const app = createApp(App);
  
  console.log('Setting up app plugins...');
  app.use(router)
    .use(i18n)
    .mount('#app');
    
  console.log('App mounted successfully');
  console.log('=== MAIN.JS INITIALIZATION END ===');
}

// Start the application
initializeApp().catch(console.error);
