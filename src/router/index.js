import { createWebHistory, createRouter } from 'vue-router'

import HomePage from '../views/HomePage.vue'
import About from '../views/About.vue'
import Contact from '../views/Contact.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/about', component: About },
  { path: '/contact', component: Contact },
]

const router = createRouter({
  history: createWebHistory(), // ✅ use this for browser
  routes,
})

export default router
