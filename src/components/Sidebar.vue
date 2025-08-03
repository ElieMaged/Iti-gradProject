<template>
  <div class="layout ">
          <div class="sidebar" style="margin-left: 80px; margin-right: 80px;">
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
     
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  activeMenu: String,
  activeBookingStatus: String
});

const router = useRouter();
const { t } = useI18n();
const isBookingDropdownOpen = ref(props.activeMenu === 'booking');

watch(() => props.activeMenu, (val) => {
  isBookingDropdownOpen.value = val === 'booking';
});

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

function handleLogout() {
  if (confirm(t('confirmLogout'))) {
    // Clear any stored authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    
    // Redirect to login page
    router.push('/login');
    
    // Optional: Show success message
    alert(t('logoutSuccess'));
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
  width: 16rem;
  background-color: var(--sidebar);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2.5rem;
}

.dark .sidebar {
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
  border: none;
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

.dark .dropdown-status-link {
  color: var(--primary-text);
}

.dropdown-status-link:hover {
  background: var(--secondary);
  color: white;
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
  margin-top: 0.5rem;
  color: #ef4444;
}

.logout-btn:hover {
  background-color: #ef4444;
  color: white;
}

.chevron-icon {
  margin-left: auto;
  transition: transform 0.3s ease;
}

.chevron-icon.rotated {
  transform: rotate(180deg);
}

.dark .chevron-icon {
  color: var(--primary-text);
}

/* Mobile Responsive - Horizontal Layout */
@media (max-width: 768px) {
  .layout {
    flex-direction: column;
    max-height: 10vh;
  }
  
  .sidebar {
    width: 100vw;
    flex-direction: row;
    padding: 1rem;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 0 !important;
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
    padding: 0.75rem;
    gap: 0.25rem;
  }
  
  .layout {
    margin-top: 30px;
    max-height: 10vh;
  }
  
  .sidebar-item {
    padding: 0.375rem 0.75rem;
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