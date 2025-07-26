<template>
    <div class="layout">
      <div class="sidebar">
        <a href="/admin-profile" class="sidebar-item">
          <i class="fas fa-user"></i>
          <span>My Profile</span>
        </a>
  
        <a href="admin-users" class="sidebar-item">
          <i class="fas fa-users"></i>
          <span>Users</span>
        </a>
  
        <!-- Technicians Dropdown -->
        <div class="dropdown-container">
          <div class="sidebar-item dropdown-btn" @click="toggleDropdown('tech')">
            <i class="fas fa-user-cog"></i>
            <span>Technicians</span>
            <i class="fas fa-chevron-down chevron-icon"></i>
          </div>
          <div class="dropdown-menu" v-show="showTechnicians">
            <a href="admin-technicians">All Technicians</a>
            <a href="admin-technicians-pending">Pending Technicians</a>
          </div>
        </div>
  
        <!-- Booking Dropdown (dynamic links) -->
        <div class="dropdown-container">
          <div class="sidebar-item dropdown-btn" @click="toggleDropdown('booking')">
            <i class="fas fa-calendar-alt"></i>
            <span>Booking</span>
            <i class="fas fa-chevron-down chevron-icon"></i>
          </div>
          <div class="dropdown-menu" v-show="showBooking">
            <router-link to="/booking-upcoming" class="dropdown-status-link" active-class="active-status-link">Upcoming</router-link>
            <router-link to="/booking-pending" class="dropdown-status-link" active-class="active-status-link">Pending</router-link>
            <router-link to="/booking-completed" class="dropdown-status-link" active-class="active-status-link">Completed</router-link>
            <router-link to="/booking-canceled" class="dropdown-status-link" active-class="active-status-link">Canceled</router-link>
          </div>
        </div>
        
        <a href="/admin-payment" class="sidebar-item">
          <i class="fas fa-credit-card"></i>
          <span>Payment</span>
        </a>
  
        <a href="/admin-dashboard" class="sidebar-item">
          <i class="fas fa-chart-bar"></i>
          <span>Overview</span>
        </a>
  
        <a href="/admin-edit-profile" class="sidebar-item">
          <i class="fas fa-cog"></i>
          <span>Settings</span>
        </a>
  
        <a href="#" class="sidebar-item logout-link">
          <i class="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </a>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const showTechnicians = ref(false);
  const showBooking = ref(false);
  
  function toggleDropdown(type) {
    if (type === 'tech') {
      showTechnicians.value = !showTechnicians.value;
      showBooking.value = false;
    } else if (type === 'booking') {
      showBooking.value = !showBooking.value;
      showTechnicians.value = false;
    }
  }
  
  onMounted(() => {
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
  }
  
  .dropdown-menu a {
    background: var(--sidebar);
    padding: 10px 24px;
    color: var(--text-main);
    font-weight: 500;
    font-size: 1rem;
    border-radius: 8px;
    text-decoration: none;
    margin: 0 4px;
    transition: background 0.16s, color 0.16s;
  }
  
  .dropdown-menu a:hover {
    background: #e6e0f3;
    color: var(--secondary);
  }
  
  .logout-link {
    margin-top: 0.5rem;
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
    background: #7c6bb0;
    color: #fff !important;
  }
  .dropdown-status-link:hover {
    background: #e6e0f3;
    color: var(--secondary);
  }
  </style>
  