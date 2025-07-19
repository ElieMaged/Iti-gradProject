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

createApp(App)
  .use(router)
  .mount('#app')
