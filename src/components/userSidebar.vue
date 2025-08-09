<template>
  <div class="layout">
    <div class="sidebar" v-if="user">
      <a :href="`/profile-view/${user.uid}`" 
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const props = defineProps({
  activeTab: {
    type: String,
    default: 'profile'
  }
});

const router = useRouter();
const user = ref(null);

onMounted(() => {
  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser;
  });
});

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
  padding-left: 80px;
  padding-right: 50px;
}

.sidebar {
  width: 14rem;
  background-color: var(--sidebar);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2.5rem;
  border-radius: 16px;
  height: 40vh;
  margin-top: 2rem ;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
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
  background-color: var(--secondary);
  color: white;
}

.sidebar-item.active {
  background-color: var(--secondary);
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


.logout-btn {
  margin-top: 0.5rem;
  color: #ef4444;
}

.logout-btn:hover {
  background-color: #ef4444;
  color: white;
}

/* Mobile Responsive - Horizontal Layout */
@media (max-width: 768px) {
  .layout {
    flex-direction: column;
    max-height: 10vh;
    padding-left: 0;
    padding-right: 0;
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
}
</style>

