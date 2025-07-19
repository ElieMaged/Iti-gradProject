import { createWebHistory, createRouter } from 'vue-router'

import HomePage from '../views/HomePage.vue'
import About from '../views/About.vue'
import Contact from '../views/Contact.vue'
import UserSignUp from '../views/UserSignUp.vue'
import UserLogin from '../views/UserLogin.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/about', component: About },
  { path: '/contact', component: Contact },
  { path: '/usersignup', component: UserSignUp },
  { path: '/userlogin', component: UserLogin },
]

const router = createRouter({
  history: createWebHistory(), // ✅ use this for browser
  routes,
})

export default router
