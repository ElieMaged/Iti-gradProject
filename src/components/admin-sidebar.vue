<template>
    <div class="layout">
      <div class="sidebar mx-20">
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
               class="dropdown-link"
               :class="{ active: isActive('/all-technician') }">{{ $t('allTechnicians') }}</a>
            <a href="/admin-pending-tech" 
               @click="handleNavigation" 
               class="dropdown-link"
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
                         :class="{ 'active-status-link': isBookingStatusActive('upcoming') }">{{ $t('upcoming') }}</router-link>
            <router-link to="/booking-pending" 
                         class="dropdown-status-link" 
                         :class="{ 'active-status-link': isBookingStatusActive('pending') }">{{ $t('pending') }}</router-link>
            <router-link to="/booking-completed" 
                         class="dropdown-status-link" 
                         :class="{ 'active-status-link': isBookingStatusActive('completed') }">{{ $t('completed') }}</router-link>
            <router-link to="/booking-canceled" 
                         class="dropdown-status-link" 
                         :class="{ 'active-status-link': isBookingStatusActive('canceled') }">{{ $t('canceled') }}</router-link>
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
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  
  const router = useRouter();
  const route = useRoute();
  const showTechnicians = ref(false);
  const showBooking = ref(false);
  
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
  }
  
  function handleLogout() {
    if (confirm($t('confirmLogout'))) {
      // Clear any stored authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.clear();
      
      // Redirect to login page
      router.push('/login');
      
      // Optional: Show success message
      alert($t('logoutSuccess'));
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
    min-height: 100vh;
  }
  
  .sidebar {
    width: 16rem;
    background-color: var(--sidebar);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 2.5rem;
  }
  .dark {
    background: var(--sidebar);
    color: var(--text-main);
  }
  
  .sidebar-item {
    width: 100%;
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.125rem;
    font-weight: 500;
    color: var(--secondary);
    text-decoration: none;
    transition: all 0.2s ease;
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
    border-radius: 12px;
  }
  .dark .sidebar-item {
    color: var(--text-main);
  }
  .sidebar-item:hover {
    background-color: var(--icon-color);
    color: white;
  }
  
  .sidebar-item.active {
    background-color: var(--icon-color);
    color: white;
  }
  .dark .sidebar-item.active {
    background-color: var(--icon-color);
    color: var(--primary-text-dark);
  }
  
  .dropdown-container {
    position: static;
    width: 100%;
  }
  
  .dropdown-menu {
    position: static;
    min-width: 0;
    width: 92%;
    border-radius: 12px;
    padding: 10px 0;
    margin: 6px auto 0 auto;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    background: var(--sidebar);
    border:none;
  }
  
  .dropdown-menu a,
  .dropdown-link {
    background: var(--sidebar);
    padding: 10px 24px;
    color: var(--text-main);
    font-weight: 500;
    font-size: 1rem;
    border-radius: 8px;
    text-decoration: none;
    margin: 0 4px;
    transition: background 0.16s, color 0.16s;
    display: block;
  }
  
  .dropdown-menu a:hover,
  .dropdown-link:hover {
    background: var(--icon-color);
    color: white;
  }
  
  .dropdown-link.active {
    background: var(--icon-color);
    color: white;
  }
  
  .logout-btn {
    margin-top: 0.5rem;
    color: #ef4444;
  }
  
  .logout-btn:hover {
    background-color: #ef4444;
    color: white;
  }
  
  .chevron-icon {
    margin-left: auto;
  }

  .dropdown-status-link {
    padding: 10px 24px;
    color: var(--text-main);
    font-weight: 500;
    font-size: 1rem;
    border-radius: 8px;
    text-decoration: none;
    margin: 0 4px;
    display: block;
    transition: all 0.2s ease;
    position: relative;
  }
  
  .active-status-link {
    background: var(--icon-color) !important;
    color: var(--primary-text-dark) !important;
    font-weight: 600;
    box-shadow: 0 2px 4px rgba(124, 107, 176, 0.3);
    position: relative;
  }
  
  .active-status-link::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 60%;
    background: #fff;
    border-radius: 0 2px 2px 0;
  }
  
  .dropdown-status-link:hover {
    background: var(--icon-color);
    color: white;
    transform: translateX(4px);
  }

  /* Mobile Responsive - Horizontal Layout */
  @media (max-width: 768px) {
    .layout {
      flex-direction: column;
    }
    
    .sidebar {
      width: 100vw;
      flex-direction: row;
      padding: 1rem;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin: 0;
      box-sizing: border-box;
    }
    
    .sidebar-item {
      width: auto;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      border-radius: 8px;
      min-width: fit-content;
      margin: 0 20px;
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
      width: 200px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      z-index: 1000;
    }
    
    .dropdown-menu a,
    .dropdown-link {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      white-space: nowrap;
    }
    
    .dropdown-status-link {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      white-space: nowrap;
    }
    
    .chevron-icon {
      display: none;
    }
    
    .logout-btn {
      margin-top: 0;
    }
  }


  @media (max-width: 480px) {
    .sidebar {
      padding: 0.75rem;
      gap: 0.25rem;
    }
    .layout {
      min-height: auto;
    }
    .sidebar-item {
      padding: 0.375rem 0.75rem;
      font-size: 0.75rem;
    }
    
    .sidebar-item i {
      font-size: 0.875rem;
    }
    
    .dropdown-menu {
      width: 180px;
    }
    
    .dropdown-menu a,
    .dropdown-link,
    .dropdown-status-link {
      padding: 0.375rem 0.75rem;
      font-size: 0.75rem;
    }
  }
  </style>
  