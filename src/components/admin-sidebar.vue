<template>
    <div class="layout">
      <div class="sidebar">
        <a href="/admin-profile" 
           class="sidebar-item" 
           :class="{ active: isActive('/admin-profile') }"
           @click="handleNavigation">
          <i class="fas fa-user"></i>
          <span>My Profile</span>
        </a>
  
        <a href="/admin-users" 
           class="sidebar-item" 
           :class="{ active: isActive('/admin-users') }"
           @click="handleNavigation">
          <i class="fas fa-users"></i>
          <span>Users</span>
        </a>
  
        <!-- Technicians Dropdown -->
        <div class="dropdown-container">
          <div class="sidebar-item dropdown-btn" 
               :class="{ active: isTechniciansActive }"
               @click="toggleDropdown('tech')">
            <i class="fas fa-user-cog"></i>
            <span>Technicians</span>
            <i class="fas fa-chevron-down chevron-icon"></i>
          </div>
          <div class="dropdown-menu" v-show="showTechnicians">
            <a href="/all-technician" 
               @click="handleNavigation" 
               class="dropdown-link"
               :class="{ active: isActive('/all-technician') }">All Technicians</a>
            <a href="/admin-pending-tech" 
               @click="handleNavigation" 
               class="dropdown-link"
               :class="{ active: isActive('/admin-pending-tech') }">Pending Technicians</a>
          </div>
        </div>
  
        <!-- Booking Dropdown (dynamic links) -->
        <div class="dropdown-container">
          <div class="sidebar-item dropdown-btn" 
               :class="{ active: isBookingActive }"
               @click="toggleDropdown('booking')">
            <i class="fas fa-calendar-alt"></i>
            <span>Booking</span>
            <i class="fas fa-chevron-down chevron-icon"></i>
          </div>
          <div class="dropdown-menu" v-show="showBooking">
            <router-link to="/booking-upcoming" 
                         class="dropdown-status-link" 
                         active-class="active-status-link">Upcoming</router-link>
            <router-link to="/booking-pending" 
                         class="dropdown-status-link" 
                         active-class="active-status-link">Pending</router-link>
            <router-link to="/booking-completed" 
                         class="dropdown-status-link" 
                         active-class="active-status-link">Completed</router-link>
            <router-link to="/booking-canceled" 
                         class="dropdown-status-link" 
                         active-class="active-status-link">Canceled</router-link>
          </div>
        </div>
        
        <a href="/admin-payment" 
           class="sidebar-item" 
           :class="{ active: isActive('/admin-payment') }"
           @click="handleNavigation">
          <i class="fas fa-credit-card"></i>
          <span>Payment</span>
        </a>
  
        <a href="/admin-dashboard" 
           class="sidebar-item" 
           :class="{ active: isActive('/admin-dashboard') }"
           @click="handleNavigation">
          <i class="fas fa-chart-bar"></i>
          <span>Overview</span>
        </a>
  
        <a href="/admin-edit-profile" 
           class="sidebar-item" 
           :class="{ active: isActive('/admin-edit-profile') }"
           @click="handleNavigation">
          <i class="fas fa-cog"></i>
          <span>Settings</span>
        </a>
  
        <button @click="handleLogout" class="sidebar-item logout-btn">
          <i class="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
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
    if (href) {
      router.push(href);
    }
  }
  
  function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
      // Clear any stored authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.clear();
      
      // Redirect to login page
      router.push('/login');
      
      // Optional: Show success message
      alert('You have been logged out successfully!');
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
  
  .sidebar-item:hover {
    background-color: #c5b7e6;
    color: white;
  }
  
  .sidebar-item.active {
    background-color: var(--secondary);
    color: white;
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
    background: #c5b7e6;
    color: white;
  }
  
  .dropdown-link.active {
    background: var(--secondary);
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
    transition: background 0.16s, color 0.16s;
  }
  
  .active-status-link {
    background: var(--primary-color) !important;
    color: #fff !important;
  }
  
  .dropdown-status-link:hover {
    background: #c5b7e6;
    color: white;
  }
  </style>
  