import { createWebHistory, createRouter } from 'vue-router'

import HomePage from '../views/HomePage.vue'
import About from '../views/About.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/about', component: About },
]

const router = createRouter({
  history: createWebHistory(), // ✅ use this for browser
  routes,
})

export default router
