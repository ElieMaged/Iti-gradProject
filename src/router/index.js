import { createWebHistory, createRouter } from 'vue-router'

import HomePage from '../views/HomePage.vue'
import About from '../views/About.vue'
import Contact from '../views/Contact.vue'
import UserSignUp from '../views/UserSignUp.vue'
import UserLogin from '../views/UserLogin.vue'
import TechProfile from '../views/Profile.vue'
import Plumbing from '../views/Plumbing.vue'
import Electricity from '../views/Electricity.vue'
import TestPage from '../views/TestPage.vue'
import AirCondition from '../views/AirCondition.vue'
import WallFinishing from '../views/WallFinishing.vue'
import Carpentry from '../views/Carpentry.vue'
import ElecTechnicians from '../views/ElecTechnicians.vue'
import TechRegister from '../views/TechRegister.vue'
import WelcomePage from '../views/WelcomePage.vue'
import ProfileView from '../views/ProfileView.vue'
import PreviousServices from '../views/PreviousServices.vue'
import ProfileEdit from '../views/ProfileEdit.vue'
import Payment from '../views/Payment.vue'
import FAQ from '../components/FAQ.vue'
import Profile from '../views/Profile.vue'
import BookingPage from '../views/BookingPage.vue'
import BookingConfirmation from '../views/BookingConfirmation.vue'

import TechnicianDetails from '../views/TechnicianDetails.vue'
import TechnicionProfile from '../views/TechnicionProfile.vue'
import TechnicianEditProfile from '../views/TechnichianEditProfile.vue'
import PendingBookings from '../views/PendingBookings.vue'
import RegisterChoice from '../views/RegisterChoice.vue'
import TechnicianAvailability from '../views/TechnicianAvailbility.vue'
import TechPayment from '../views/TechPayment.vue'


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
  {path: '/RegisterChoice', component: RegisterChoice },
  { path: '/test', component: TestPage },
  { path: '/usersignup', component: UserSignUp },
  { path: '/userlogin', component: UserLogin },
  { path: '/techprofile', component: TechProfile },
  { path: '/profile-edit', component: ProfileEdit },
  { path: '/techregister', component: TechRegister },
  { path: '/welcomepage', component: WelcomePage },
  { path: '/profile-view', component: ProfileView },
  { path: '/previous-services', component: PreviousServices },
  { path: '/payment', component: Payment },
  { path: '/profile', component: Profile },
  {path: '/faq', component: FAQ },
  {path: '/technician-details', component: TechnicianDetails },
  {path: '/technicion-profile', component: TechnicionProfile },
  {path: '/technician-edit-profile', component: TechnicianEditProfile },
  {path: '/booking', component: PendingBookings },
  {path: '/technicianavailbility', component: TechnicianAvailability },
  { path: '/technician/:id', name: 'TechnicianProfile', component: () => import('../views/TechnicianProfile.vue') },
  { path: '/bookingpage', component: BookingPage },
  { path: '/bookingconfirmation', component: BookingConfirmation },
  { path: '/techpayment', component: TechPayment },
    
]

const router = createRouter({
  history: createWebHistory(), // ✅ use this for browser
  routes,
})

export default router
