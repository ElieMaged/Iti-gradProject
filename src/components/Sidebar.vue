<template>
  <div class="sidebar">
    <div class="sidebar-menu">
      <div
        class="menu-item"
        :class="{ active: activeMenu === 'technicionprofile' }"
        @click="$emit('navigate', '/technicion-profile')"
        >
        <i class="fa-regular fa-user"></i>
        <span>My Profile</span>
      </div>
      <div
        class="menu-item"
        :class="{ active: activeMenu === 'technicianeditprofile' }"
        @click="$emit('navigate', '/technician-edit-profile')"
      >
        <i class="fa-solid fa-gear"></i>
        <span>Settings</span>
      </div>
      <div
        class="menu-item"
        :class="{ active: activeMenu === 'technicianavailbility' }"
        @click="$emit('navigate', '/technicianavailbility')"
      >
        <i class="fa-regular fa-clock"></i>
        <span>Availability</span>
      </div>
      <div
        class="menu-item dropdown"
        :class="{ active: activeMenu === 'booking' }"
        @click="toggleBookingDropdown" 

      >
        <i class="fa-regular fa-calendar"></i>
        <span>My Booking</span>
        <i class="fa-solid fa-chevron-down dropdown-arrow" :class="{ rotated: isBookingDropdownOpen }"></i>
      </div>
      <div class="submenu" v-show="isBookingDropdownOpen">
        <div class="submenu-item" :class="{ active: activeBookingStatus === 'pending' }" @click.stop="navigateBookingStatus('pending')">
          <span>Pending</span>
        </div>
        <div class="submenu-item" :class="{ active: activeBookingStatus === 'upcoming' }" @click.stop="navigateBookingStatus('upcoming')">
          <span>Upcoming</span>
        </div>
        <div class="submenu-item" :class="{ active: activeBookingStatus === 'completed' }" @click.stop="navigateBookingStatus('completed')">
          <span>Completed</span>
        </div>
      </div>
      <div
        class="menu-item"
        :class="{ active: activeMenu === 'payment' }"
        @click="$emit('navigate', 'payment')"
      >
        <i class="fa-regular fa-credit-card"></i>
        <span>Payment</span>
      </div>
      <div
        class="menu-item"
        :class="{ active: activeMenu === 'reviews' }"
        @click="$emit('navigate', 'reviews')"
      >
        <i class="fa-regular fa-star"></i>
        <span>My Reviews</span>
      </div>
      <div
        class="menu-item"
        :class="{ active: activeMenu === 'logout' }"
        @click="$emit('navigate', 'logout')"
      >
        <i class="fa-solid fa-right-from-bracket"></i>
        <span>Logout</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
const props = defineProps({
  activeMenu: String,
  activeBookingStatus: String
});
const router = useRouter();
const isBookingDropdownOpen = ref(props.activeMenu === 'booking');
watch(() => props.activeMenu, (val) => {
  isBookingDropdownOpen.value = val === 'booking';
});
function toggleBookingDropdown() {
  isBookingDropdownOpen.value = !isBookingDropdownOpen.value;
  if (!isBookingDropdownOpen.value) return;
}
function navigateBookingStatus(status) {
  router.push({ path: '/booking', query: { status } });
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  background: #D3CFE2;
  padding: 2rem 0;
  height: auto;
  overflow-y: auto;
  overflow-x: hidden;
}
.dark .sidebar {
  background: var(--secondary-bg);
  color: var(--primary-text);
}
.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  border-radius: 8px;
  font-weight: 500;
  color: #222;
  background: none;
}
.menu-item.active {
  background: #625397;
  color: #fff;
}
.dark .menu-item.active {
  background: var(--primary-color);
  color: var(--primary-text);
}
.menu-item.dropdown {
  cursor: pointer;
}
.dropdown-arrow {
  transition: transform 0.3s ease;
  margin-left: auto;
}
.dropdown-arrow.rotated {
  transform: rotate(180deg);
}
.dark .dropdown-arrow {
  color: var(--primary-text);
}
.submenu {
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: all 0.3s ease;
}
.dark .submenu {
  background: var(--secondary-bg);
  color: var(--primary-text);
}
.submenu-item {
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.2s;
  color: #fff;
  background: #948AB8;
  font-size: 0.9rem;
  border-radius: 8px;
}
.dark .submenu-item {
  background: var(--secondary-bg);
  color: var(--primary-text);
}
.submenu-item.active {
  background: #625397;
  color: #fff;
}

</style> 