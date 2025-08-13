<template>
  <div class="layout ">
          <div class="sidebar">
      <!-- Logo + Controls Section -->
      <div class="sidebar-header">
        <img src="/logo/ace04d3b268cf810c91d002fdf7454a6ef778f27.png" alt="Logo" class="sidebar-logo" />
      </div>

      <a href="/technicion-profile" 
         class="sidebar-item" 
         :class="{ active: activeMenu === 'technicianprofile' }"
         @click="handleNavigation">
        <i class="fa-regular fa-user"></i>
        <span>{{ $t('myProfile') }}</span>
      </a>

      <a href="/technician-edit-profile" 
         class="sidebar-item" 
         :class="{ active: activeMenu === 'technicianeditprofile' }"
         @click="handleNavigation">
        <i class="fa-solid fa-gear"></i>
        <span>{{ $t('settings') }}</span>
      </a>

      <a href="/technicianavailbility" 
         class="sidebar-item" 
         :class="{ active: activeMenu === 'technicianavailbility' }"
         @click="handleNavigation">
        <i class="fa-regular fa-clock"></i>
        <span>{{ $t('availability') }}</span>
      </a>

      <!-- Booking Dropdown -->
      <div class="dropdown-container">
        <div class="sidebar-item dropdown-btn" 
             :class="{ active: activeMenu === 'booking' }"
             @click="toggleBookingDropdown">
          <i class="fa-regular fa-calendar"></i>
          <span>{{ $t('myBookings') }}</span>
          <i class="fas fa-chevron-down chevron-icon" :class="{ rotated: isBookingDropdownOpen }"></i>
        </div>
        <div class="dropdown-menu" v-show="isBookingDropdownOpen">
          <a href="/technician-booking-pending" 
             @click="handleNavigation" 
             class="dropdown-status-link"
             :class="{ active: activeBookingStatus === 'pending' }">{{ $t('pending') }}</a>
          <a href="/technician-booking-upcoming" 
             @click="handleNavigation" 
             class="dropdown-status-link"
             :class="{ active: activeBookingStatus === 'upcoming' }">{{ $t('upcoming') }}</a>
          <a href="/technician-booking-completed" 
             @click="handleNavigation" 
             class="dropdown-status-link"
             :class="{ active: activeBookingStatus === 'completed' }">{{ $t('completed') }}</a>
        </div>
      </div>

      <a href="/techpayment" 
         class="sidebar-item" 
         :class="{ active: activeMenu === 'payment' }"
         @click="handleNavigation">
        <i class="fa-regular fa-credit-card"></i>
        <span>{{ $t('payment') }}</span>
      </a>

      <a href="/technician-reviews" 
         class="sidebar-item" 
         :class="{ active: activeMenu === 'reviews' }"
         @click="handleNavigation">
        <i class="fa-regular fa-star"></i>
        <span>{{ $t('myReviews') }}</span>
      </a>

      <!-- Logout Button -->
      <a href="#" 
         class="sidebar-item logout-btn" 
         @click="handleLogout">
        <i class="fas fa-sign-out-alt"></i>
        <span>{{ $t('logout') }}</span>
      </a>
     
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { clearAuthState } from '../utils/auth';

const props = defineProps({
  activeMenu: String,
  activeBookingStatus: String
});

const router = useRouter();
const { t } = useI18n();
const isBookingDropdownOpen = ref(props.activeMenu === 'booking');

function toggleBookingDropdown() {
  isBookingDropdownOpen.value = !isBookingDropdownOpen.value;
}

function handleNavigation(event) {
  // Prevent default behavior for href links
  event.preventDefault();
  const href = event.currentTarget.getAttribute('href');
  
  if (href) {
    router.push(href);
  }
}

async function handleLogout() {
  if (confirm(t('confirmLogout'))) {
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear authentication state using the new system
      clearAuthState();
      
      // Redirect to home page
      router.push('/');
      
      // Optional: Show success message
      alert(t('logoutSuccess'));
    } catch (error) {
      console.error('Logout error:', error);
      alert('Error during logout. Please try again.');
    }
  }
}

onMounted(() => {
  // Auto-expand dropdown if current page is in booking section
  if (props.activeMenu === 'booking') {
    isBookingDropdownOpen.value = true;
  }
  
  document.addEventListener('click', (e) => {
    const isClickInsideSidebar = e.target.closest('.sidebar-item') || e.target.closest('.dropdown-menu');
    if (!isClickInsideSidebar) {
      isBookingDropdownOpen.value = false;
    }
  });
});

// Keep dropdown open/closed if active menu changes externally
watch(() => props.activeMenu, (val) => {
  isBookingDropdownOpen.value = val === 'booking';
});
</script>

<style scoped>
:root {
  --primary: #ffd54f;
  --secondary: #7c6bb0;
  --sidebar: #ede7f6;
  --text-main: #333333;
  --text-muted: #aaaaaa;
}

body {
  margin: 0;
}

.layout {
  display: flex;
  min-height: auto;
}

.sidebar {
  width: 14rem;
  background-color: var(--sidebar);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;
  height: 100vh;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.06);
  overflow-y: auto;
  min-height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.dark .sidebar {
  background: var(--sidebar);
  color: var(--text-main);
}

.sidebar-item {
  width: 100%;
  padding: 1rem 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--secondary);
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
  cursor: pointer;
  border: none;
  background: none;
  font-family: inherit;
  position: relative;
}

.dark .sidebar-item {
  color: var(--text-main);
}

.sidebar-item:hover {
  background-color: var(--primary-color);
  color: white;
}

.sidebar-item.active {
  background-color: var(--primary-color);
  color: white;
}

.dark .sidebar-item.active {
  background-color: #c5b7e6;
  color: var(--primary-text-dark);
}

.dark .sidebar-item:hover {
  background-color: #c5b7e6;
  color: var(--primary-text-dark);
}

/* Left accent indicator on hover/active */
.sidebar-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10%;
  bottom: 10%;
  width: 3px;
  border-radius: 3px;
  background: currentColor;
  opacity: 0;
  transform: scaleY(0.5);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.sidebar-item:hover::before,
.sidebar-item.active::before {
  opacity: 1;
  transform: scaleY(1);
}

/* Keyboard accessibility */
.sidebar-item:focus-visible {
  outline: 2px solid rgba(0,0,0,0.15);
  outline-offset: 2px;
}

.dropdown-container {
  position: static;
  width: 100%;
}

.dropdown-menu {
  position: static;
  min-width: 0;
  margin: 6px auto 0 auto;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: var(--sidebar);
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 4px 14px rgba(0,0,0,0.06);
}

.dropdown-status-link {
  padding: 10px 1.25rem;
  color: var(--text-main);
  font-weight: 500;
  font-size: 0.95rem;
  text-decoration: none;
  margin: 0 0.5rem;
  display: block;
  transition: background 0.16s, color 0.16s, transform 0.16s;
}

.dark .dropdown-status-link {
  color: var(--primary-text);
}

.dropdown-status-link:hover {
  background: var(--secondary);
  color: white;
  transform: translateX(2px);
}

.dark .dropdown-status-link:hover {
  background: #c5b7e6;
  color: #333333;
}

.dropdown-status-link.active {
  background: #c5b7e6;
  color: #333333;
}

.logout-btn {
  color: #ef4444;
}

.logout-btn:hover {
  background-color: #ef4444;
  color: white;
}

.dark .chevron-icon {
  color: var(--primary-text);
}

/* Sidebar Header and Controls */
.sidebar-header {
  display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    gap: 0.5rem;
    padding: 0 6rem 0 0;
    margin-bottom: 0.5rem;
}

.sidebar-logo {
  height: 26px;
  width: auto;
  object-fit: contain;
  transition: transform 0.2s ease, filter 0.2s ease;
}

.sidebar-header:hover .sidebar-logo {
  transform: scale(1.04);
}

.sidebar-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  margin: auto 0 0.5rem;
  padding: 0;
  border: none;
  border-radius: 0;
  box-shadow: none;
}

.darkmode-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  border-radius: 50%;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.darkmode-btn:hover {
  color: var(--gray-500);
  transform: scale(1.1);
}

.darkmode-btn .navbar-icon {
  font-size: 1.2rem;
  transition: all 0.3s ease;
  width: 20px;
  height: 20px;
  color: inherit;
}

/* Custom scrollbar for sidebar */
.sidebar::-webkit-scrollbar {
  width: 10px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.12);
  border-radius: 8px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

.sidebar:hover::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.2);
}

  /* Mobile Responsive - Horizontal Layout */
  @media (max-width: 768px) {
    .layout {
      flex-direction: column;
      max-height: none;
      height: auto;
    }
    
    .sidebar {
      width: 100%;
      flex-direction: row;
      padding: 0.5rem;
      align-items: center;
      justify-content: start;
      flex-wrap: wrap;
      margin: 0 !important;
      justify-content: center;
      box-sizing: border-box;
      min-height: auto;
      height: auto;
    }
    .sidebar-header {
      padding: 0;
      
    }
    .sidebar-item {
      width: auto;
      padding: 0;
      font-size: 0.875rem;
      border-radius: 8px;
      min-width: fit-content;
      margin: 0 10px;
    }
    
    .sidebar-item span {
      display: none;
    }
    
    .sidebar-item i {
      font-size: 1rem;
    }
    
    .dropdown-container {
      position: relative;
      width: auto;
    }
    
    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      min-width: 200px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 10;
      margin: 0;
      width: auto;
    }
    
    .dark .dropdown-menu {
      background: var(--secondary-bg);
      border: 1px solid var(--border-color);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }
    
    .dropdown-status-link {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      margin: 0;
      border-radius: 0;
    }
    
    .dropdown-status-link:first-child {
      border-radius: 8px 8px 0 0;
    }
    
    .dropdown-status-link:last-child {
      border-radius: 0 0 8px 8px;
    }
    
    .logout-btn {
      margin-top: 0;
    }
  }
  
  @media (max-width: 480px) {
    .sidebar {
      padding: 0.5rem;
      gap: 0.25rem;
      min-height: auto;
      height: auto;
    }
    
    .layout {
      margin-top: 30px;
      max-height: none;
      height: auto;
    }
    
    .sidebar-item {
      padding: 0.5rem;
      font-size: 0.75rem;
    }
    
    .sidebar-item i {
      font-size: 0.875rem;
    }
    
    .dropdown-menu {
      min-width: 150px;
    }
    
    .dropdown-status-link {
      padding: 0.375rem 0.75rem;
      font-size: 0.75rem;
    }
  }
</style> 