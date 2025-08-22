<template>
    <div class="layout">
      <!-- Mobile menu button -->
      <button class="mobile-menu-btn" @click="toggleMobileSidebar" aria-label="Open sidebar">
        <i class="fas fa-bars"></i>
      </button>
      <!-- Backdrop -->
      <div v-if="isMobileSidebarOpen" class="backdrop" @click="toggleMobileSidebar"></div>

      <div class="sidebar" :class="{ open: isMobileSidebarOpen }">
        <!-- Logo Section -->
        <div class="sidebar-header">
          <img src="/logo/ace04d3b268cf810c91d002fdf7454a6ef778f27.png" alt="Logo" class="sidebar-logo" />
          <!-- Mobile close button -->
          <button class="close-sidebar-btn" @click="toggleMobileSidebar" aria-label="Close sidebar">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <a href="/admin-profile" 
           class="sidebar-item" 
           :class="{ active: isActive('/admin-profile') }"
           @click="handleNavigation">
          <i class="fas fa-user"></i>
          <span>{{ $t('myProfile') }}</span>
        </a>
        <a href="/admin-edit-profile" 
           class="sidebar-item" 
           :class="{ active: isActive('/admin-edit-profile') }"
           @click="handleNavigation">
           <i class="fa-solid fa-gears"></i>
          <span>{{ $t('settings') }}</span>
        </a>

        <a href="/admin-users" 
           class="sidebar-item" 
           :class="{ active: isActive('/admin-users') }"
           @click="handleNavigation">
          <i class="fas fa-users"></i>
          <span>{{ $t('users') }}</span>
        </a>
  
        <!-- Technicians Dropdown -->
        <div class="dropdown-container">
          <div class="sidebar-item dropdown-btn" 
               :class="{ active: isTechniciansActive }"
               @click="toggleDropdown('tech')">
            <i class="fas fa-user-cog"></i>
            <span>{{ $t('technicians') }}</span>
            <i class="fas fa-chevron-down chevron-icon"></i>
          </div>
          <div class="dropdown-menu" v-show="showTechnicians">
            <a href="/all-technician" 
               @click="handleNavigation" 
               class="dropdown-status-link"
               :class="{ active: isActive('/all-technician') }">{{ $t('allTechnicians') }}</a>
            <a href="/admin-pending-tech" 
               @click="handleNavigation" 
               class="dropdown-status-link"
               :class="{ active: isActive('/admin-pending-tech') }">{{ $t('pendingTechnicians') }}</a>
          </div>
        </div>
  
        <!-- Booking Dropdown (dynamic links) -->
        <div class="dropdown-container">
          <div class="sidebar-item dropdown-btn" 
               :class="{ active: isBookingActive }"
               @click="toggleDropdown('booking')">
            <i class="fas fa-calendar-alt"></i>
            <span>{{ $t('booking') }}</span>
            <i class="fas fa-chevron-down chevron-icon"></i>
          </div>
          <div class="dropdown-menu" v-show="showBooking">
            <router-link to="/booking-upcoming" 
                         class="dropdown-status-link" 
                         :class="{ active: isBookingStatusActive('upcoming') }">{{ $t('upcoming') }}</router-link>
            <router-link to="/booking-pending" 
                         class="dropdown-status-link" 
                         :class="{ active: isBookingStatusActive('pending') }">{{ $t('pending') }}</router-link>
            <router-link to="/booking-completed" 
                         class="dropdown-status-link" 
                         :class="{ active: isBookingStatusActive('completed') }">{{ $t('completed') }}</router-link>
            <router-link to="/booking-canceled" 
                         class="dropdown-status-link" 
                         :class="{ active: isBookingStatusActive('canceled') }">{{ $t('canceled') }}</router-link>
          </div>
        </div>
        
        <a href="/admin-payment" 
           class="sidebar-item" 
           :class="{ active: isActive('/admin-payment') }"
           @click="handleNavigation">
          <i class="fas fa-credit-card"></i>
          <span>{{ $t('payment') }}</span>
        </a>
  
        <a href="/admin-dashboard" 
           class="sidebar-item" 
           :class="{ active: isActive('/admin-dashboard') }"
           @click="handleNavigation">
          <i class="fas fa-chart-bar"></i>
          <span>{{ $t('overview') }}</span>
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
  import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { clearAuthState } from '../utils/auth';
  
  const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const showTechnicians = ref(false);
const showBooking = ref(false);
const isMobileSidebarOpen = ref(false);

  // Computed properties for active states
  const isTechniciansActive = computed(() => {
    return route.path.includes('/all-technician') || 
           route.path.includes('/admin-pending-tech') ||
           route.path.includes('/technician-profile') ||
           route.path.includes('/pending-technician-profile');
  });
  
  const isBookingActive = computed(() => {
    return route.path.includes('/booking-');
  });
  
  function isActive(path) {
    return route.path === path || route.path.startsWith(path + '/');
  }
  
  function isBookingStatusActive(status) {
    const currentPath = route.path;
    const statusPath = `/booking-${status}`;
    return currentPath === statusPath || currentPath.startsWith(statusPath + '/');
  }
  
  function toggleDropdown(type) {
    if (type === 'tech') {
      showTechnicians.value = !showTechnicians.value;
      showBooking.value = false;
    } else if (type === 'booking') {
      showBooking.value = !showBooking.value;
      showTechnicians.value = false;
    }
  }

  function toggleMobileSidebar() {
    isMobileSidebarOpen.value = !isMobileSidebarOpen.value;
  }
  
  function handleNavigation(event) {
    // Prevent default behavior for href links
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    console.log('Admin sidebar navigation - href:', href);
    console.log('Admin sidebar navigation - current route:', route.path);
    
    if (href) {
      console.log('Navigating to:', href);
      router.push(href);
    }
    // Close sidebar on mobile after navigation
    if (window.matchMedia('(max-width: 768px)').matches) {
      isMobileSidebarOpen.value = false;
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
    // Auto-expand dropdowns if current page is in that section
    if (isTechniciansActive.value) {
      showTechnicians.value = true;
    }
    if (isBookingActive.value) {
      showBooking.value = true;
    }
    
    // Auto-expand booking dropdown if on any booking status page
    if (route.path.includes('/booking-')) {
      showBooking.value = true;
    }
    
    document.addEventListener('click', (e) => {
      const isClickInsideSidebar = e.target.closest('.sidebar-item') || e.target.closest('.dropdown-menu');
      if (!isClickInsideSidebar) {
        showTechnicians.value = false;
        showBooking.value = false;
      }
    });
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
    background: var(--secondary);
    color: white;
  }
  
  .dropdown-status-link.active {
    background: var(--secondary);
    color: white;
  }
  
  .dark .dropdown-status-link.active {
    background: var(--secondary);
    color: white;
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
      overflow: visible; /* allow dropdown to overflow sidebar on mobile */
    }
    .sidebar-header {
      padding: 0;
      position: relative; /* for close button positioning on mobile */
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
      z-index: 2000; /* ensure it appears above surrounding content */
      margin-top: 10px;
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
      padding-top: 30px;
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

/* Off-canvas mobile sidebar overrides */
.mobile-menu-btn {
  display: none;
}

.close-sidebar-btn {
  display: none;
  border: none;
  background: transparent;
  color: var(--secondary);
  width: 36px;
  height: 36px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 12px;
    right: 12px;
    left: auto;
    z-index: 1100; /* lower than sidebar (1250) */
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: var(--primary-color);
    color: #fff;
    border: none;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    z-index: 1200;
  }

  /* Force sidebar to be off-canvas drawer on mobile */
  .sidebar {
    width: 12rem !important;
    height: 100vh !important;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    padding: 1rem 0.75rem !important;
    flex-direction: column !important;
    justify-content: flex-start !important;
    align-items: stretch !important;
    overflow-y: auto !important;
    z-index: 1250 !important;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  /* Show item labels inside drawer */
  .sidebar-item span {
    display: inline !important;
  }

  /* Show and position close button on mobile */
  .close-sidebar-btn {
    display: inline-flex;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1260; /* above sidebar content */
    color: var(--secondary);
    backdrop-filter: blur(2px);
  }
  .dark .close-sidebar-btn {
    background: rgba(0,0,0,0.35);
    color: var(--primary-text);
  }

  .sidebar-item {
    padding: 0.75rem 0.75rem !important;
    margin: 0 0.25rem !important;
  }

  .dropdown-container {
    width: 100% !important;
  }

  .dropdown-menu {
    position: static !important;
    margin-top: 6px !important;
    width: 100% !important;
  }
}
  </style>