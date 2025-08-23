<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { useI18n } from 'vue-i18n';
import { watch, computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authState, waitForAuth } from './utils/auth';

const { locale } = useI18n();
const route = useRoute();
const router = useRouter();

// Check if current route is an admin or technician route
const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin-') || 
         route.path.startsWith('/technician-') ||
         route.path.startsWith('/technicion-') ||
         route.path.startsWith('/technicianavailbility') ||
         route.path.startsWith('/techprofile') ||
         route.path.startsWith('/techpayment') ||
         route.path.startsWith('/techdashboard') ||
         route.path.startsWith('/techbookings') ||
         route.path.startsWith('/techsettings') ||
         route.path.startsWith('/techprofile') ||
         route.path.startsWith('/booking-') ||
         route.path.startsWith('/admin-payment') ||
         route.path.startsWith('/all-technician');
});

// Check if current route is a public auth route (signup, login, etc.)
const isPublicAuthRoute = computed(() => {
  return route.path === '/usersignup' || 
         route.path === '/userlogin' || 
         route.path === '/techregister' ||
         route.path === '/welcomepage' ||
         route.path === '/pending-application';
});

// Add a local loading state for the App component
const appAuthReady = ref(false);

// Debug authentication state
onMounted(async () => {
  console.log('=== APP COMPONENT MOUNTED ===');
  await waitForAuth();
  appAuthReady.value = true;
  console.log('App mounted - Auth state:', {
    isAuthenticated: authState.isAuthenticated,
    userType: authState.userType,
    user: authState.user ? authState.user.email : null,
    currentRoute: route.path,
    isAdminRoute: isAdminRoute.value,
    isPublicAuthRoute: isPublicAuthRoute.value
  });

  // Redirect admins/technicians to their dashboards if they land on a public route
  // But don't redirect if they're on public auth routes (signup, login, etc.)
  if (authState.isAuthenticated && !isAdminRoute.value && !isPublicAuthRoute.value) {
    console.log('Redirecting user to dashboard...');
    if (authState.userType === 'admin') {
      router.push('/admin-dashboard');
    } else if (authState.userType === 'technician') {
      router.push('/technicion-profile');
    }
  } else {
    console.log('No redirect needed - user can stay on current route');
  }
  console.log('=== APP COMPONENT MOUNTED END ===');
});

// Add a computed property to handle the display of user type
const displayUserType = computed(() => {
  if (!appAuthReady.value) return 'Initializing...';
  if (authState.isLoading) return 'Loading...';
  if (!authState.isAuthenticated) return 'Not Authenticated';
  if (authState.userType === null || authState.userType === undefined) return 'No Type';
  return authState.userType;
});

watch(locale, (newLocale) => {
  document.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
}, { immediate: true });

// Also react to auth changes at runtime (e.g., after login without full reload)
watch(() => authState.isAuthenticated, (isAuth) => {
  console.log('Auth state changed:', {
    isAuth,
    currentRoute: route.path,
    isAdminRoute: isAdminRoute.value,
    isPublicAuthRoute: isPublicAuthRoute.value,
    userType: authState.userType
  });
  
  if (isAuth && !isAdminRoute.value && !isPublicAuthRoute.value) {
    console.log('Redirecting due to auth change...');
    if (authState.userType === 'admin') {
      router.push('/admin-dashboard');
    } else if (authState.userType === 'technician') {
      router.push('/techdashboard');
    }
  }
});

// Add a watcher for userType changes to debug
watch(() => authState.userType, (newUserType, oldUserType) => {
  console.log('User type changed:', { oldUserType, newUserType });
});

// Add a watcher for isLoading changes to debug
watch(() => authState.isLoading, (newLoading, oldLoading) => {
  console.log('Loading state changed:', { oldLoading, newLoading });
});
</script>

<template>
  <!-- Debug: App component template rendering -->
  <div v-if="appAuthReady" style="position: fixed; top: 0; left: 50%; transform: translateX(-50%); background: green; color: white; z-index: 9999; padding: 10px;">
    App Component Loaded - Route: {{ $route.path }} | Auth: {{ authState.isAuthenticated }} | Type: {{ displayUserType }}
  </div>
  <div v-else style="position: fixed; top: 0; left: 50%; transform: translateX(-50%); background: orange; color: white; z-index: 9999; padding: 10px;">
    Loading Auth State...
  </div>
  <Navbar v-if="!isAdminRoute && !isPublicAuthRoute" />
  <div id="app">
    <router-view />
  </div>
  <Footer v-if="!isAdminRoute && !isPublicAuthRoute" />
</template>

<style>
/* Global admin titles styling */
.admin-title,
.booking-title,
.wallet-title,
.user-title,
.profile-title,
.send-money-title,
.transfer-title,
.dashboard-title,
.stat-title,
.chart-title,
.photo-title {
  color: var(--primary-color);
  font-weight: 700;
  line-height: 1.2;
}

/* Optional: unify spacing */
.admin-title,
.booking-title,
.wallet-title,
.user-title,
.profile-title,
.send-money-title {
  margin: 0 0 0.75rem 0;
}
</style>