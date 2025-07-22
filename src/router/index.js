import { createWebHistory, createRouter } from 'vue-router'

import HomePage from '../views/HomePage.vue'
import About from '../views/About.vue'
import Contact from '../views/Contact.vue'
import UserSignUp from '../views/UserSignUp.vue'
import UserLogin from '../views/UserLogin.vue'
import Profile from '../views/Profile.vue'
import Plumbing from '../views/Plumbing.vue'
import Electricity from '../views/Electricity.vue'
import TestPage from '../views/TestPage.vue'
import AirCondition from '../views/AirCondition.vue'
import WallFinishing from '../views/WallFinishing.vue'
import Carpentry from '../views/Carpentry.vue'
import ElecTechnicians from '../views/ElecTechnicians.vue'
import FAQ from '../components/FAQ.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/about', component: About },
  { path: '/contact', component: Contact },
  { path: '/plumbing', component: Plumbing },
  { path: '/electricity', component: Electricity },
  { path: '/aircondition', component: AirCondition },
  { path: '/wallfinishing', component: WallFinishing },
  { path: '/carpentry', component: Carpentry },
  { path: '/elecTechnicians', component: ElecTechnicians },
  { path: '/test', component: TestPage },
  { path: '/usersignup', component: UserSignUp },
  { path: '/userlogin', component: UserLogin },
  { path: '/profile', component: Profile },
  {path: '/faq', component: FAQ },
]

const router = createRouter({
  history: createWebHistory(), // ✅ use this for browser
  routes,
})

export default router
