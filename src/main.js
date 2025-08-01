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
import emailjs from '@emailjs/browser';

emailjs.init({
  publicKey: 'kGW9e5lc8iBvIT3Qw',
});

createApp(App)
  .use(router)
  .use(i18n)
  .mount('#app')
