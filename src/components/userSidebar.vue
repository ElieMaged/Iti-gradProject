<template>
  <div class="layout">
    <!-- Mobile Toggle Button -->
    <div class="mobile-toggle" @click="toggleSidebar">
      <i class="fas fa-bars"></i>
    </div>
    
    <!-- Mobile Overlay -->
    <div v-if="isSidebarOpen" class="mobile-overlay" @click="closeSidebar"></div>
    
    <!-- Sidebar -->
    <div class="sidebar mx-20" :class="{ 'sidebar-open': isSidebarOpen }">
      <div class="sidebar-header">
        <h3 class="sidebar-title">{{ $t('navigation') }}</h3>
        <button class="close-btn" @click="closeSidebar">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="sidebar-content">
        <a href="/profile-view"
           class="sidebar-item"
           :class="{ active: activeTab === 'profile' }"
           @click="handleNavigation">
          <i class="fas fa-user"></i>
          <span>{{ $t('myProfile') }}</span>
        </a>

        <a href="/profile-edit"
           class="sidebar-item"
           :class="{ active: activeTab === 'settings' }"
           @click="handleNavigation">
          <i class="fas fa-cog"></i>
          <span>{{ $t('settings') }}</span>
        </a>

        <a href="/previous-services"
           class="sidebar-item"
           :class="{ active: activeTab === 'history' }"
           @click="handleNavigation">
          <i class="fas fa-calendar-check"></i>
          <span>{{ $t('history') }}</span>
        </a>

        <a href="/user-bookings"
           class="sidebar-item"
           :class="{ active: activeTab === 'bookings' }"
           @click="handleNavigation">
          <i class="fas fa-calendar-alt"></i>
          <span>{{ $t('bookings') }}</span>
        </a>

        <button @click="handleLogout" class="sidebar-item logout-btn">
          <i class="fas fa-sign-out-alt"></i>
          <span>{{ $t('logout') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const props = defineProps({
  activeTab: {
    type: String,
    default: 'profile'
  }
});

const router = useRouter();
const isSidebarOpen = ref(false);

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}

function closeSidebar() {
  isSidebarOpen.value = false;
}

function handleNavigation(event) {
  // Prevent default behavior for href links
  event.preventDefault();
  const href = event.currentTarget.getAttribute('href');

  if (href) {
    router.push(href);
    // Close sidebar on mobile after navigation
    closeSidebar();
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

/* Mobile Toggle Button */
.mobile-toggle {
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
  background: var(--secondary);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.mobile-toggle:hover {
  background: #625397;
  transform: scale(1.05);
}

.mobile-toggle i {
  font-size: 1.25rem;
}

/* Mobile Overlay */
.mobile-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* Sidebar */
.sidebar {
  width: 16rem;
  background-color: var(--sidebar);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2.5rem;
  transition: transform 0.3s ease;
}

.dark .sidebar {
  background: var(--sidebar);
  color: var(--text-main);
}

.sidebar-header {
  display: none;
  width: 100%;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  align-items: center;
  justify-content: space-between;
}

.sidebar-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--secondary);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: var(--secondary);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(124, 107, 176, 0.1);
}

.sidebar-content {
  width: 100%;
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

.dark .sidebar-item {
  color: var(--text-main);
}

.sidebar-item:hover {
  background-color: #c5b7e6;
  color: white;
}

.sidebar-item.active {
  background-color: var(--secondary);
  color: white;
}

.dark .sidebar-item.active {
  background-color: var(--icon-color);
  color: var(--primary-text-dark);
}

.logout-btn {
  margin-top: 0.5rem;
  color: #ef4444;
}

.logout-btn:hover {
  background-color: #ef4444;
  color: white;
}

/* Mobile Responsive Design */
@media (max-width: 768px) {
  .mobile-toggle {
    display: block;
  }
  
  .mobile-overlay {
    display: block;
  }
  
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 280px;
    max-width: 85vw;
    z-index: 1001;
    transform: translateX(-100%);
    padding-top: 0;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .sidebar-open {
    transform: translateX(0);
  }
  
  .sidebar-header {
    display: flex;
  }
  
  .sidebar-content {
    padding-top: 1rem;
    flex: 1;
    overflow-y: auto;
  }
  
  .sidebar-item {
    padding: 1.25rem 2rem;
    font-size: 1rem;
    min-height: 44px; /* Touch target optimization */
  }
  
  .sidebar-item i {
    font-size: 1.1rem;
    min-width: 20px;
  }
}

@media (max-width: 480px) {
  .sidebar {
    width: 260px;
    max-width: 90vw;
  }
  
  .sidebar-item {
    padding: 1rem 1.5rem;
    font-size: 0.95rem;
  }
  
  .sidebar-item i {
    font-size: 1rem;
  }
  
  .sidebar-title {
    font-size: 1.1rem;
  }
}

@media (max-width: 360px) {
  .sidebar {
    width: 240px;
    max-width: 95vw;
  }
  
  .sidebar-item {
    padding: 0.875rem 1.25rem;
    font-size: 0.9rem;
  }
  
  .sidebar-item i {
    font-size: 0.95rem;
  }
  
  .mobile-toggle {
    top: 0.75rem;
    left: 0.75rem;
    padding: 0.625rem;
  }
  
  .mobile-toggle i {
    font-size: 1.1rem;
  }
}

/* Landscape orientation adjustments */
@media (max-width: 768px) and (orientation: landscape) {
  .sidebar {
    height: 100vh;
    overflow-y: auto;
  }
  
  .sidebar-content {
    padding-top: 0.5rem;
  }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .sidebar-item {
    min-height: 48px;
  }
  
  .mobile-toggle {
    min-height: 44px;
    min-width: 44px;
  }
  
  .close-btn {
    min-height: 44px;
    min-width: 44px;
  }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .sidebar {
    transition: none;
  }
  
  .mobile-toggle {
    transition: none;
  }
}
</style>

