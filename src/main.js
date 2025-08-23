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
  // Wait for authentication to be initialized
  await initializeAuth();
  
  const app = createApp(App);
  
  app.use(router)
    .use(i18n)
    .mount('#app');
}

// Start the application
initializeApp().catch(console.error);
