<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { useI18n } from 'vue-i18n';
import { watch, computed, onMounted } from 'vue';
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

// Debug authentication state
onMounted(async () => {
  await waitForAuth();
  console.log('App mounted - Auth state:', {
    isAuthenticated: authState.isAuthenticated,
    userType: authState.userType,
    user: authState.user ? authState.user.email : null
  });

  // Redirect admins/technicians to their dashboards if they land on a public route
  if (authState.isAuthenticated && !isAdminRoute.value) {
    if (authState.userType === 'admin') {
      router.push('/admin-dashboard');
    } else if (authState.userType === 'technician') {
      router.push('/techdashboard');
    }
  }
});

watch(locale, (newLocale) => {
  document.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
}, { immediate: true });

// Also react to auth changes at runtime (e.g., after login without full reload)
watch(() => authState.isAuthenticated, (isAuth) => {
  if (isAuth && !isAdminRoute.value) {
    if (authState.userType === 'admin') {
      router.push('/admin-dashboard');
    } else if (authState.userType === 'technician') {
      router.push('/techdashboard');
    }
  }
});
</script>

<template>
  <AuthStatus />
  <Navbar v-if="!isAdminRoute" />
  <div id="app">
    <router-view />
  </div>
  <Footer v-if="!isAdminRoute" />
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