import { createWebHistory, createRouter } from 'vue-router'
import { waitForAuth, isAdmin, isTechnician, isAuthenticated, getUserType } from '../utils/auth'

import HomePage from '../views/HomePage.vue'
import About from '../views/About.vue'
import Contact from '../views/Contact.vue'
import UserSignUp from '../views/UserSignUp.vue'
import UserLogin from '../views/UserLogin.vue'
import TechProfile from '../views/Profile.vue'
import Plumbing from '../views/Plumbing.vue'
import Electricity from '../views/Electricity.vue'
import TestPage from '../views/TestPage.vue'
import EmailTest from '../views/EmailTest.vue'
import SimpleEmailTest from '../views/SimpleEmailTest.vue'
import EmailDebugTest from '../views/EmailDebugTest.vue'
import AirCondition from '../views/AirCondition.vue'
import WallFinishing from '../views/WallFinishing.vue'
import Carpentry from '../views/Carpentry.vue'
import ElecTechnicians from '../views/ElecTechnicians.vue'
import TechRegister from '../views/TechRegister.vue'
import Services from '../views/allservices.vue'
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
import TechnicionProfile from '../views/Techncian dashboard/TechnicionProfile.vue'
import TechnicianEditProfile from '../views/Techncian dashboard/TechnichianEditProfile.vue'
  
import TechnicianAvailability from '../views/Techncian dashboard/TechnicianAvailbility.vue'
import TechPayment from '../views/Techncian dashboard/TechPayment.vue'
import Chatbot from '../components/chatbot.vue'
import TechnicianBookingPending from '../views/Techncian dashboard/TechnicianBookingPending.vue'
import TechnicianBookingUpcoming from '../views/Techncian dashboard/TechnicianBookingUpcoming.vue'
import TechnicianBookingCompleted from '../views/Techncian dashboard/TechnicianBookingCompleted.vue'
import TechnicianReviews from '../views/Techncian dashboard/TechnicianReviews.vue'

// User booking views
import UserBookingPending from '../views/UserBookingPending.vue'
import UserBookingUpcoming from '../views/UserBookingUpcoming.vue'
import UserBookingCompleted from '../views/UserBookingCompleted.vue'
import UserBookings from '../views/UserBookings.vue'

//admin
import AdminUsers from '../views/adminDashboard/admin-users.vue'
import AdminPayment from '../views/adminDashboard/admin-payment.vue'
import BookingCanceled from '../views/adminDashboard/Booking-canceled.vue'
import BookingCompleted from '../views/adminDashboard/Booking-completed.vue'
import BookingPending from '../views/adminDashboard/Booking-pending.vue'
import BookingUpcoming from '../views/adminDashboard/Booking-upComing.vue'
import AdminDashboard from '../views/adminDashboard/admin-dashboard.vue'
import AdminProfile from '../views/adminDashboard/admin-profile.vue'
import AdminEditProfile from '../views/adminDashboard/admin-edit-profile.vue'
import AdminSendMoney from '../views/adminDashboard/admin-sendMoney.vue'
import AdminWalletDetails from '../views/adminDashboard/admin-WalletDetails.vue'
import technicianProfile from '../views/adminDashboard/technician-profile.vue'
import AllTechnician from '../views/adminDashboard/All-Technician.vue'
import AdminUserProfile from '../views/adminDashboard/admin-userProfile.vue'
import AdminPendingTech from '../views/adminDashboard/admin-pending-tech.vue'
import AdminPendingTechProfile from '../views/adminDashboard/admin-pending-techProfile.vue'
import PendingApplication from '../views/PendingApplication.vue'
import AdminBookingDetails from '../views/adminDashboard/AdminBookingDetails.vue'
import AdminBookingEdit from '../views/adminDashboard/AdminBookingEdit.vue'
import AuthTest from '../views/AuthTest.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/test-route', component: () => import('../views/TestPage.vue') }, // Simple test route
  { path: '/simple-test', component: { template: '<div style="padding: 50px; background: yellow;">SIMPLE TEST COMPONENT WORKS!</div>' } }, // Very simple test
  { path: '/about', component: About },
  { path: '/contact', component: Contact },
  { path: '/plumbing', component: Plumbing },
  { path: '/electricity', component: Electricity },
  { path: '/aircondition', component: AirCondition },
  { path: '/wallfinishing', component: WallFinishing },
  { path: '/carpentry', component: Carpentry },
  { path: '/elecTechnicians', component: ElecTechnicians },

  { path: '/test', component: TestPage },
  { path: '/email-test', component: EmailTest },
  { path: '/simple-email-test', component: SimpleEmailTest },
  { path: '/email-debug-test', component: EmailDebugTest },
  { path: '/usersignup', component: UserSignUp },
  { path: '/userlogin', component: UserLogin },
  { path: '/techprofile', component: TechProfile },
  { path: '/profile-edit', component: ProfileEdit },
  { path: '/techregister', component: TechRegister },
  { path: '/welcomepage', component: WelcomePage },
  { path: '/profile-view/:id', component: ProfileView },
  { path: '/previous-services', component: PreviousServices },
  { path: '/payment', component: Payment },
  { path: '/profile', component: Profile },
  {path: '/faq', component: FAQ },
  {path: '/faqs', component: FAQ },
  {path: '/allservices', component: Services },
  {path: '/services', redirect: '/allservices' },
  {path: '/technician-details', component: TechnicianDetails },
  {path: '/technicion-profile', component: TechnicionProfile },
  {path: '/technician-edit-profile', component: TechnicianEditProfile },
  {path: '/technicianavailbility', component: TechnicianAvailability },
  { path: '/technician/:id', name: 'TechnicianProfile', component: () => import('../views/TechnicianProfile.vue') },
  { path: '/bookingpage', component: BookingPage },
  { path: '/bookingconfirmation', component: BookingConfirmation },
  { path: '/techpayment', component: TechPayment },
  { path: '/chatbot', component: Chatbot },
  { path: '/technician-booking-pending', component: TechnicianBookingPending },
  { path: '/technician-booking-upcoming', component: TechnicianBookingUpcoming },
  { path: '/technician-booking-completed', component: TechnicianBookingCompleted },

  // User booking routes
  { path: '/user-booking-pending', component: UserBookingPending },
  { path: '/user-booking-upcoming', component: UserBookingUpcoming },
  { path: '/user-booking-completed', component: UserBookingCompleted },
  { path: '/user-bookings', component: UserBookings },

  //admin
  { path: '/admin-users', component: AdminUsers },
  { path: '/booking-canceled', component: BookingCanceled },
  { path: '/booking-completed', component: BookingCompleted },
  { path: '/booking-pending', component: BookingPending },
  { path: '/booking-upcoming', component: BookingUpcoming },
  { path: '/admin-dashboard', component: AdminDashboard },
  { path: '/admin-profile', component: AdminProfile },
  { path: '/admin-edit-profile', component: AdminEditProfile },
  { path: '/admin-payment', component: AdminPayment },
  { path: '/admin-send-money', component: AdminSendMoney },
  { path: '/admin-wallet-details', component: AdminWalletDetails },
  {path: '/technician-profile/:id', component: technicianProfile},
  {path: '/all-technician', component: AllTechnician},
  {path: '/admin-user-profile/:id', component: AdminUserProfile},
  {path: '/admin-pending-tech', component: AdminPendingTech},
  {path: '/admin-pending-tech/pending-technician-profile/:id', component: AdminPendingTechProfile},
  {path: '/pending-application', component: PendingApplication},
  {path: '/admin-booking-details/:id', name: 'admin-booking-details', component: AdminBookingDetails},
  {path: '/admin-booking-edit/:id', name: 'admin-booking-edit', component: AdminBookingEdit},
  {path: '/technician-reviews', component: TechnicianReviews},
  {path: '/auth-test', component: AuthTest},
]

console.log('=== ROUTES DEFINED ===');
console.log('UserSignUp component:', UserSignUp);
console.log('TechRegister component:', TechRegister);
console.log('Total routes:', routes.length);
console.log('Routes with usersignup:', routes.find(r => r.path === '/usersignup'));
console.log('Routes with techregister:', routes.find(r => r.path === '/techregister'));


const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top
    return { top: 0 };
  }
});

// Add global navigation guard with authentication checks
router.beforeEach(async (to, from, next) => {
  console.log('=== ROUTER NAVIGATION START ===');
  console.log('Navigation:', { from: from.path, to: to.path, params: to.params });
  
  // Simple test route bypass
  if (to.path === '/test-route' || to.path === '/simple-test') {
    console.log('✅ Allowing access to test route:', to.path);
    next();
    return;
  }
  
  // Wait for authentication to be ready
  console.log('Waiting for auth to be ready...');
  await waitForAuth();
  console.log('Auth is ready');
  console.log('Current auth state after waiting:', {
    isAuthenticated: isAuthenticated(),
    userType: getUserType()
  });

  // If user is already authenticated and navigating to a public landing/login route,
  // redirect to the appropriate dashboard based on role.
  const isPublicLanding = (
    to.path === '/' ||
    to.path === '/userlogin' ||
    to.path === '/login' ||
    to.path === '/welcome'
  );
  
  // Don't redirect if user is trying to access signup/registration pages
  const isPublicAuthRoute = (
    to.path === '/usersignup' ||
    to.path === '/techregister' ||
    to.path === '/pending-application'
  );
  
  console.log('Route analysis:', {
    isPublicLanding,
    isPublicAuthRoute,
    toPath: to.path,
    isAuthenticated: isAuthenticated()
  });
  
  // Always allow access to public auth routes (signup, registration, etc.)
  if (isPublicAuthRoute) {
    console.log('✅ Allowing access to public auth route:', to.path);
    console.log('Calling next() for public auth route');
    next();
    return;
  }
  
  console.log('Not a public auth route, checking authentication...');
  
  if (isAuthenticated() && isPublicLanding) {
    console.log('User is authenticated and trying to access public landing, redirecting...');
    if (isAdmin()) {
      console.log('Redirecting admin to dashboard');
      next('/admin-dashboard');
      return;
    }
    if (isTechnician()) {
      // Use existing technician dashboard route (note the spelling in routes)
      console.log('Redirecting technician to profile');
      next('/technicion-profile');
      return;
    }
  }
  
  // Check if trying to access admin routes
  if (to.path.startsWith('/admin-')) {
    console.log('Attempting to access admin route:', to.path);
    
    if (!isAdmin()) {
      console.log('User is not admin, redirecting to home');
      next('/');
      return;
    }
  }
  
  // Check if trying to access admin technician profile route
  if (to.path.startsWith('/technician-profile/')) {
    console.log('Attempting to access admin technician profile route:', to.path);
    
    if (!isAdmin()) {
      console.log('User is not admin, redirecting to home');
      next('/');
      return;
    }
  }
  
  // Check if trying to access technician routes (but exclude admin technician profile route)
  if ((to.path.startsWith('/technician-') && !to.path.startsWith('/technician-profile/')) || 
      to.path.startsWith('/techprofile') ||
      to.path.startsWith('/techpayment') ||
      to.path.startsWith('/technicianavailbility')) {
    console.log('Attempting to access technician route:', to.path);
    
    if (!isTechnician()) {
      console.log('User is not technician, redirecting to home');
      next('/');
      return;
    }
  }
  
  // Check if trying to access user-specific routes
  if (to.path.startsWith('/user-') || 
      to.path === '/profile' ||
      to.path === '/payment') {
    console.log('Attempting to access user route:', to.path);
    
    if (!isAuthenticated()) {
      console.log('User is not authenticated, redirecting to login');
      next('/userlogin');
      return;
    }
  }
  
  console.log('✅ Allowing navigation to:', to.path);
  console.log('Calling next() for general route');
  console.log('=== ROUTER NAVIGATION END ===');
  next();
});

export default router
