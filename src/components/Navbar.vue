<script>
import '../style.css'
import { ref, onMounted, onBeforeUnmount, watch, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import LanguageToggle from './LanguageToggle.vue';
import NotificationBell from './NotificationBell.vue'
// Firebase-related imports removed

export default {
  components: { LanguageToggle, NotificationBell },
  setup() {
    const user = ref(null);
    const loading = ref(true);
    const router = useRouter();
    const { locale } = useI18n();
    const mobileMenuOpen = ref(false);
    const navAccordionOpen = ref(true);
    const servicesDropdownOpen = ref(false);
    let dropdownTimeout = null;

    // Add isMobile computed
    const isMobile = ref(window.innerWidth <= 768);
    function handleResize() {
      isMobile.value = window.innerWidth <= 768;
      if (!isMobile.value) servicesDropdownOpen.value = false;
    }
    onMounted(() => {
      window.addEventListener('resize', handleResize);
    });
    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize);
    });

    function getRoute(path) {
      // Always return the same route, no language prefix
      return path ? `/${path}` : '/';
    }

    onMounted(() => {
      onAuthStateChanged(auth, (firebaseUser) => {
        user.value = firebaseUser;
        loading.value = false;
      });
    });

    const logout = async () => {
      await signOut(auth);
      user.value = null;
      router.push('/');
    };

    function handleProfileClick() {
      const currentUser = auth.currentUser;
      const userType = localStorage.getItem('userType');
      
      console.log('Profile click - Current user:', currentUser);
      console.log('Profile click - User type:', userType);
      
      if (userType === 'admin') {
        console.log('Navigating to admin-dashboard');
        router.push({ path: '/admin-dashboard' });
      } else if (userType === 'technician') {
        console.log('Navigating to technician profile');
        router.push({ path: '/technicion-profile' });
      } else if (userType === 'pending') {
        console.log('Navigating to pending application');
        router.push({ path: '/pending-application' });
      } else {
        console.log('Navigating to profile view');
        router.push(getRoute(`profile-view/${user.value.uid}`));
      }
    }

    // Get user role for display
    function getUserRole() {
      return localStorage.getItem('userType') || 'user';
    }

    // Get role display text
    function getRoleDisplayText() {
      const role = getUserRole();
      switch (role) {
        case 'admin':
          return 'Admin';
        case 'technician':
          return 'Technician';
        case 'pending':
          return 'Pending';
        case 'user':
          return 'User';
        default:
          return 'User';
      }
    }

    function signUpOptions() {
      router.push(getRoute('welcomepage'));
    }

    function closeMobileMenu() {
      mobileMenuOpen.value = false;
      navAccordionOpen.value = true;
      servicesDropdownOpen.value = false;
    }

    function goToUserAccount() {
      router.push(getRoute('welcomepage'));
    }

    // Desktop hover dropdown logic
    function showDropdown() {
      if (isMobile.value) return;
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
        dropdownTimeout = null;
      }
      servicesDropdownOpen.value = true;
    }

    function hideDropdown() {
      if (isMobile.value) return;
      if (dropdownTimeout) clearTimeout(dropdownTimeout);
      servicesDropdownOpen.value = false;
    }

    function toggleDropdownMobile() {
      if (isMobile.value) {
        servicesDropdownOpen.value = !servicesDropdownOpen.value;
      }
    }

    function handleDocumentClick(e) {
      if (!isMobile.value) {
        const dropdown = document.querySelector('.services-dropdown');
        const trigger = document.querySelector('.services-color.cursor-pointer');
        if (
          dropdown &&
          !dropdown.contains(e.target) &&
          trigger &&
          !trigger.contains(e.target)
        ) {
          hideDropdown();
        }
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleDocumentClick);
    });
    onBeforeUnmount(() => {
      document.removeEventListener('click', handleDocumentClick);
    });

    const isDark = ref(false);
    const isScrolled = ref(false);

    // Handle scroll event to make navbar fixed
    function handleScroll() {
      const scrolled = window.scrollY > 50;
      isScrolled.value = scrolled;
      
      // Add/remove body class to prevent content jump
      if (scrolled) {
        document.body.classList.add('navbar-fixed');
      } else {
        document.body.classList.remove('navbar-fixed');
      }
    }

    function toggleDarkMode() {
      try {
        isDark.value = !isDark.value;
        nextTick(() => {
          // Ensure DOM is updated before any additional operations
        });
      } catch (error) {
        console.error('Error toggling dark mode:', error);
      }
    }
    
    watch(isDark, (val) => {
      try {
        if (document && document.documentElement) {
          document.documentElement.classList.toggle('dark', val);
          localStorage.setItem('theme', val ? 'dark' : 'light');
        }
      } catch (error) {
        console.error('Error updating dark mode:', error);
      }
    });
    
    onMounted(() => {
      try {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark);
      } catch (error) {
        console.error('Error initializing dark mode:', error);
        isDark.value = false;
      }
      
      // Add scroll event listener
      window.addEventListener('scroll', handleScroll);
    });

    onBeforeUnmount(() => {
      // Remove scroll event listener
      window.removeEventListener('scroll', handleScroll);
    });

    const iconClass = computed(() => isDark.value ? 'fas fa-moon' : 'fas fa-sun');

    return {
      user,
      loading,
      locale,
      isDark,
      isScrolled,
      logout,
      handleProfileClick,
      getRoute,
      signUpOptions,
      userButtonClass: " ",
      loginButtonClass: "",
      mobileMenuOpen,
      navAccordionOpen,
      closeMobileMenu,
      goToUserAccount,
      toggleDarkMode,
      iconClass,
      servicesDropdownOpen,
      showDropdown,
      hideDropdown,
      toggleDropdownMobile,
      isMobile,
      getUserRole,
      getRoleDisplayText,
      categories: [
        { name: 'Plumbing', route: '/plumbing' },
        { name: 'Electricity', route: '/electricity' },
        { name: 'Carpentry', route: '/carpentry' },
        { name: 'Air Condition', route: '/aircondition' },
        { name: 'Wall Finishing', route: '/wallfinishing' },
        { name: 'Electrical Technicians', route: '/elecTechnicians' }
        // Add more categories as needed
      ]
    };
  },
};
</script>

<template>
  <!-- Top Bar -->
  <div class=" w-full" id="contact-Nav">
    <div class="flex flex-col sm:flex-row justify-between items-center py-2 gap-2" style="margin-left: 80px; margin-right: 80px;">
      <div class="flex flex-col sm:flex-row gap-2 items-center">
        <a href="tel:+12095551234" class="contact-links no-underline mx-1 flex items-center text-sm"><i
            class="fa-solid fa-phone px-2"></i>{{ $t('contactPhone') }}</a>
        <a :href="`mailto:boltfix@gmail.com`" class="contact-links no-underline mx-1 flex items-center text-sm"><i
            class="fa-solid fa-envelope px-2"></i>boltfix@gmail.com</a>
        <a href="https://www.google.com/maps/place/123+Main+St,+Anytown,+USA"
          class="contact-links no-underline mx-1 flex items-center text-sm"><i
            class="fa-solid fa-map-marker-alt px-2"></i>{{ $t('contactAddress') }}</a>
      </div>
      <div class="flex gap-2">
        <a href="#" class="flex items-center justify-center rounded-full social-media-links w-7 h-7" :aria-label="$t('facebook')"><i
            class="fa-brands fa-facebook-f secondary-color"></i></a>
        <a href="#" class="flex items-center justify-center rounded-full social-media-links w-7 h-7"><i
            class="fa-brands fa-x-twitter secondary-color"></i></a>
        <a href="#" class="flex items-center justify-center rounded-full social-media-links w-7 h-7"><i
            class="fa-brands fa-linkedin-in secondary-color"></i></a>
        <a href="#" class="flex items-center justify-center rounded-full social-media-links w-7 h-7"><i
            class="fab fa-youtube secondary-color"></i></a>
      </div>
    </div>
  </div>
  <!-- Navbar -->
  <nav :class="['navbar py-3 flex justify-between items-center relative transition-all duration-300', isScrolled ? 'fixed-navbar' : '']" style="margin-left: 80px; margin-right: 80px;">
    <!-- Logo -->
    <div class="flex items-center gap-2 text-2xl font-bold">
      <img src="/logo/ace04d3b268cf810c91d002fdf7454a6ef778f27.png" alt="Logo" class="h-8" id="logo" />
    </div>
    <!-- Hamburger for mobile -->
    <button class="md:hidden block text-2xl z-50" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Open menu">
      <i class="fa fa-bars navbar-icon"></i>
    </button>
    <!-- Nav Links (Desktop) -->
    <ul class="hidden md:flex gap-8 font-medium m-0">
      <li>
        <router-link :to="locale === 'ar' ? getRoute('') : '/'" class="no-underline services-color">{{ $t('navHome')
          }}</router-link>
      </li>
      <li>
        <router-link :to="locale === 'ar' ? getRoute('about') : '/about'" class="no-underline services-color">{{
          $t('navAbout') }}</router-link>
      </li>
      <li>
        <router-link :to="locale === 'ar' ? getRoute('contact') : '/contact'" class="no-underline services-color">{{
          $t('navContact') }}</router-link>
      </li>
      <li class="relative group" @mouseenter="!isMobile && showDropdown" @mouseleave="!isMobile && hideDropdown">
        <span class="no-underline services-color cursor-pointer flex items-center" @click="toggleDropdownMobile">
          {{ $t('navServices') }}
          <i class="fa fa-chevron-down services-dropdown-arrow ml-1"></i>
        </span>
        <div
          :class="['services-dropdown', isMobile ? 'static mt-2 w-full' : 'absolute left-0 mt-2 shadow-lg rounded z-50']"
          v-show="true" @mouseenter="!isMobile && showDropdown"> <router-link to="/allservices">{{ $t('allServices') }}</router-link>
          <router-link to="/plumbing">{{ $t('navPlumbing') }}</router-link>

          <router-link to="/aircondition">{{ $t('navAirConditioner') }}</router-link>
          <router-link to="/electricity">{{ $t('navElectricity') }}</router-link>
          <router-link to="/wallfinishing">{{ $t('navWallFinishing') }}</router-link>
          <router-link to="/carpentry">{{ $t('navCarpentry') }}</router-link>
          <router-link to="/elecTechnicians">{{ $t('electricalApplianceTechnician') }}</router-link>
        </div>
      </li>
    </ul>
    <!-- Login/Register (Desktop) -->
    <div class="hidden md:flex items-center gap-2">
      <template v-if="loading">
        <span class="text-gray-500">{{ $t('loading') }}</span>
      </template>
      <template v-else>
      <LanguageToggle />
      <button 
        @click="toggleDarkMode" 
        class="ml-2 darkmode-btn"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        type="button">
        <i :class="iconClass + ' navbar-icon'"></i>
      </button>
      <NotificationBell v-if="user" />
        <template v-if="user">
          <span class="flex items-center gap-2 rounded bg-gray-100 cursor-pointer" @click="handleProfileClick">
              <span class="text-gray-700 font-semibold px-3 py-1">
              {{ user.email || user.uid }}
              <span class="text-xs text-gray-500 ml-2">({{ getRoleDisplayText() }})</span>
            </span>
            <i class="fas fa-user-circle  text-2xl px-3 navbar-icon"></i>
          </span>
          <button :class="loginButtonClass" id="login-btn" @click="logout">
            {{ $t('logout') }}
          </button>
        </template>
        <template v-else>
          <button :class="loginButtonClass" id="login-btn" @click="goToUserAccount">
            <span class="">{{ $t('loginRegister') }}</span>
          </button>
        </template>
      </template>
    </div>
    <!-- Mobile Menu & Overlay -->
    <transition name="slide">
      <div v-if="mobileMenuOpen" class="mobile-menu-overlay" @click="closeMobileMenu">
        <div class="mobile-menu-panel" @click.stop>
          <!-- Header with logo and close button -->
          <div class="mobile-menu-header">
            <img src="/logo/ace04d3b268cf810c91d002fdf7454a6ef778f27.png" alt="Logo" class="mobile-logo" />
            <button class="mobile-close-btn" @click="closeMobileMenu" aria-label="Close menu">
              <i class="fa fa-times"></i>
            </button>
          </div>
          
          <!-- Menu section -->
          <div class="mobile-menu-section">
            <button class="mobile-menu-toggle" @click="navAccordionOpen = !navAccordionOpen">
            <span>{{ $t('Menu') }}</span>
              <i :class="(navAccordionOpen ? 'fa fa-chevron-up' : 'fa fa-chevron-down') + ' toggle-icon'"></i>
          </button>
            
            <div v-if="navAccordionOpen" class="mobile-menu-links">
              <router-link :to="locale === 'ar' ? getRoute('') : '/'" class="mobile-menu-link"
                @click="closeMobileMenu">
                <i class="fa fa-home mobile-link-icon"></i>
                {{ $t('navHome') }}
              </router-link>
              <router-link :to="locale === 'ar' ? getRoute('about') : '/about'" class="mobile-menu-link"
                @click="closeMobileMenu">
                <i class="fa fa-info-circle mobile-link-icon"></i>
                {{ $t('navAbout') }}
              </router-link>
              <router-link :to="locale === 'ar' ? getRoute('contact') : '/contact'" class="mobile-menu-link"
                @click="closeMobileMenu">
                <i class="fa fa-envelope mobile-link-icon"></i>
                {{ $t('navContact') }}
              </router-link>
              
            <!-- Mobile Services Dropdown -->
              <div class="mobile-services-section">
                <button class="mobile-menu-link mobile-services-toggle" @click="toggleDropdownMobile">
                  <i class="fa fa-tools mobile-link-icon"></i>
                {{ $t('navServices') }}
                  <i :class="(servicesDropdownOpen ? 'fa fa-chevron-up' : 'fa fa-chevron-down') + ' toggle-icon'"></i>
                </button>
                <div v-show="servicesDropdownOpen" class="mobile-services-dropdown">
                  <router-link to="/allservices" class="mobile-submenu-link" @click="closeMobileMenu">
                    <i class="fa fa-list mobile-link-icon"></i>
                    {{ $t('allServices') }}
                  </router-link>
                  <router-link to="/plumbing" class="mobile-submenu-link" @click="closeMobileMenu">
                    <i class="fa fa-wrench mobile-link-icon"></i>
                    {{ $t('navPlumbing') }}
                  </router-link>
                  <router-link to="/aircondition" class="mobile-submenu-link" @click="closeMobileMenu">
                    <i class="fa fa-snowflake mobile-link-icon"></i>
                    {{ $t('navAirConditioner') }}
                  </router-link>
                  <router-link to="/electricity" class="mobile-submenu-link" @click="closeMobileMenu">
                    <i class="fa fa-bolt mobile-link-icon"></i>
                    {{ $t('navElectricity') }}
                  </router-link>
                  <router-link to="/wallfinishing" class="mobile-submenu-link" @click="closeMobileMenu">
                    <i class="fa fa-paint-brush mobile-link-icon"></i>
                    {{ $t('navWallFinishing') }}
                  </router-link>
                  <router-link to="/carpentry" class="mobile-submenu-link" @click="closeMobileMenu">
                    <i class="fa fa-hammer mobile-link-icon"></i>
                    {{ $t('navCarpentry') }}
                  </router-link>
                  <router-link to="/elecTechnicians" class="mobile-submenu-link" @click="closeMobileMenu">
                    <i class="fa fa-user-cog mobile-link-icon"></i>
                    {{ $t('navElectricityTechnicians') }}
                  </router-link>
              </div>
            </div>
          </div>
          </div>
          
          <!-- User section -->
          <div class="mobile-user-section">
            <template v-if="loading">
              <div class="mobile-loading">
                <i class="fa fa-spinner fa-spin"></i>
                <span>{{ $t('loading') }}</span>
              </div>
            </template>
            <template v-else>
              <div class="mobile-actions">
            <LanguageToggle />
            <button 
              @click="toggleDarkMode" 
                  class="mobile-action-btn"
              :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
              type="button">
                  <i :class="iconClass"></i>
            </button>
            <NotificationBell v-if="user" />
              </div>
              
            <template v-if="user">
                <div class="mobile-user-info" @click="handleProfileClick">
                  <i class="fas fa-user-circle mobile-user-avatar"></i>
                  <div class="mobile-user-details">
                    <span class="mobile-user-name">{{ user.email || user.uid }}</span>
                    <span class="mobile-user-role">({{ getRoleDisplayText() }})</span>
                  </div>
                </div>
                <button class="mobile-logout-btn" @click="logout">
                  <i class="fa fa-sign-out-alt"></i>
                {{ $t('logout') }}
              </button>
            </template>
            <template v-else>
                <button class="mobile-login-btn" @click="goToUserAccount">
                  <i class="fa fa-sign-in-alt"></i>
                {{ $t('loginRegister') }}
              </button>
              </template>
            </template>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<style lang="scss" scoped>
#contact-Nav {
  background-color: var(--secondary-color);
  width: 100%;
  padding: 0;
}

/* Fixed navbar styles */
.fixed-navbar {
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background-color: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin: 0 !important;
  padding: 0.75rem 80px !important;
}

.dark .fixed-navbar {
  background-color: var(--primary-bg) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

/* Add padding to body when navbar is fixed to prevent content jump */
body {
  padding-top: 0;
  transition: padding-top 0.3s ease;
}

body.navbar-fixed {
  padding-top: 80px;
}
.contact-links {
  color: white;
}
.dark .contact-links {
  color: var(--primary-text-dark);
}
.social-media-links {
  background-color: white;
  color: var(white);
}
.dark #contact-Nav {
  background-color: var(--secondary) !important;
  color: var(--primary-text-dark) ;
}
.dark .social-media-links {
  background-color: var(--primary-text-dark) !important;
  color: var(--secondary) !important;
}

#logo {
  width: 153.308px;
  height: 52px;
  transition: width 0.2s, height 0.2s;
}
.navbar{
  justify-content: space-between;
  width: auto;
}

#login-btn {
  border: 1px solid #6B4FA1;
  transition: background-color 0.3s, color 0.3s;
  background-color: var(--primary-color);
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 1rem;
  min-width: 110px;
  min-height: 44px;
  box-shadow: 0 2px 8px rgba(98, 84, 152, 0.08);
  margin-left: 0.5rem;
}
#login-btn:hover {
  background-color: var(--gray-500);
  color: var(--primary-color);
}
.dark #login-btn {
  background-color: var(--primary-color);
  color: var(--primary-text);
}


.user-btn,
.darkmode-btn {
  min-width: 44px;
  min-height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--primary-color);
  transition: all 0.3s ease;
  padding: 8px;
}

.user-btn:hover,
.darkmode-btn:hover {
  color: var(--gray-500);
}
.navbar-icon {
  color: var(--primary-color) !important;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: none;
}

/* User button specific styling */
.user-btn {
  margin-right: 0.5rem;
  width: 44px;
  height: 44px; 
  color: var(--primary-color) !important;
}
.navbar-icon:hover {
  transform: scale(1.1);
  color: var(--gray-500) !important;
}


.dark .user-btn {
  color: var(--primary-color);
}



.services-color {
  color: #8C8E90;
  font-weight: 600;
  transition: color 0.3s;
  margin: 0;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  height: 48px;
}

.services-color:hover,
.services-color:focus {
  color: var(--primary-color);
  /* background: #f3f0fa; */
  background: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Dropdown Styles */
.services-dropdown {
  min-width: 180px;
  border-radius: 0.75rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.10), 0 1.5px 4px rgba(0, 0, 0, 0.05);
  padding: 0.5rem 0;
  z-index: 50;
  opacity: 0;
  pointer-events: none;
  transform: translateY(10px);
  transition: opacity 0.18s, transform 0.18s;
  position: absolute;
  left: 0;
  top: 100%;
  background: #fff;
}

.dark .services-dropdown {
  background: var(--text-color-text-primary, #7c7e7e);
}

.group:hover .services-dropdown {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.services-dropdown a {
  display: block;
  padding: 0.75rem 1.25rem;
  color: #333;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
  border-radius: 0.35rem;
  font-size: 1rem;
}

.dark .services-dropdown a {
  background: var(--text-color-text-primary, #7c7e7e);
  color: var(--primary-text);
}

.services-dropdown a:hover,
.services-dropdown a:focus {
  background: var(--primary-color);
  color: #fff;
}

.services-dropdown-arrow {
  margin-left: 0.25rem;
  transition: transform 0.18s;
}

.group:hover .services-dropdown-arrow {
  transform: rotate(180deg);
}

.darkmode-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--primary-color);
  transition: all 0.3s ease;
}

.darkmode-btn:hover {
  color: var(--gray-500) !important;
}

/* Responsive Styles */

@media (max-width: 1024px) {
  /* Hide desktop nav and login/register on iPad and below */
  ul.md\:flex,
  .md\:flex.items-center.gap-2,
  .hidden.md\:flex,
  .hidden.md\:flex.items-center.gap-2 {
    display: none !important;
  }
  /* Show hamburger menu on iPad and below */
  .md\:hidden,
  button.md\:hidden {
    display: block !important;
  }
  .container {
    max-width: 100vw;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}

@media (max-width: 768px) {
  #contact-Nav {
    padding: 0.5rem 0.5rem;
  }

  #contact-Nav div[style*="margin-left: 80px"] {
    margin-left: 1rem !important;
    margin-right: 1rem !important;
  }

  #contact-Nav .max-w-7xl {
    flex-direction: column;
    gap: 8px;
  }

  #contact-Nav .flex.flex-col.sm\:flex-row {
    flex-direction: column;
    gap: 4px;
  }

  #contact-Nav a {
    font-size: 0.85rem;
    padding: 0.25rem 0.5rem;
  }

  #logo {
    width: 110px;
    height: 38px;
  }

  nav {
    padding: 0.75rem 1rem;
  }



  .fixed-navbar {
    padding: 0.5rem 1rem !important;
  }

  .hidden.md\:flex {
    display: none !important;
  }

  .hidden.md\:flex.items-center.gap-2 {
    display: none !important;
  }

  .md\:hidden {
    display: block !important;
  }

  .services-color {
    font-size: 1rem;
    padding: 0.5rem 0.5rem;
  }

  .services-dropdown {
    min-width: 150px;
    font-size: 0.98rem;
  }
}

@media (max-width: 600px) {
  #logo {
    width: 90px;
    height: 30px;
  }

  #contact-Nav a {
    font-size: 0.75rem;
    padding: 0.15rem 0.3rem;
  }

  #contact-Nav div[style*="margin-left: 80px"] {
    margin-left: 0.5rem !important;
    margin-right: 0.5rem !important;
  }



  .fixed-navbar {
    padding: 0.4rem 0.8rem !important;
  }

  .services-color {
    font-size: 0.95rem;
    padding: 0.4rem 0.3rem;
  }

  .services-dropdown a {
    font-size: 0.95rem;
    padding: 0.6rem 0.8rem;
  }
}

@media (max-width: 480px) {
  #contact-Nav {
    padding: 0.25rem 0.5rem;
  }

  #contact-Nav div[style*="margin-left: 80px"] {
    margin-left: 0.25rem !important;
    margin-right: 0.25rem !important;
  }

  #contact-Nav a {
    font-size: 0.7rem;
    padding: 0.1rem 0.2rem;
  }

  #logo {
    width: 70px;
    height: 24px;
  }

  nav {
    padding: 0.5rem 0.5rem;
  }


  .fixed-navbar {
    padding: 0.3rem 0.5rem !important;
  }

  .services-color {
    font-size: 0.9rem;
    padding: 0.3rem 0.2rem;
  }
}

/* Slide transition for mobile menu */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}

/* Dropdown entrance animation */
.mobile-services-dropdown {
  animation: dropdownSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes dropdownSlideIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Mobile menu overlay and panel */
.mobile-menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.mobile-menu-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 85%;
  max-width: 320px;
  height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  z-index: 1001;
}

.dark .mobile-menu-panel {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.4);
}

/* Mobile menu header */
.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.25rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, var(--primary-color) 0%, #8b5cf6 100%);
}

.dark .mobile-menu-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
}

.mobile-logo {
  height: 40px;
  width: auto;
  filter: brightness(0) invert(1);
}

.mobile-close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* Mobile menu sections */
.mobile-menu-section {
  flex: 1;
  padding: 1rem 0;
}

.mobile-menu-toggle {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: none;
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary-color);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dark .mobile-menu-toggle {
  color: var(--primary-text);
}

.mobile-menu-toggle:hover {
  background: rgba(107, 79, 161, 0.1);
}

.toggle-icon {
  transition: transform 0.3s ease;
}

/* Mobile menu links */
.mobile-menu-links {
  padding: 0.5rem 0;
}

.mobile-menu-link {
  display: flex;
  align-items: center;
  padding: 0.875rem 1.25rem;
  color: #374151;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border-radius: 0;
  border-left: 3px solid transparent;
}

.dark .mobile-menu-link {
  color: var(--primary-text);
}

.mobile-menu-link:hover,
.mobile-menu-link.router-link-active {
  background: linear-gradient(90deg, rgba(107, 79, 161, 0.1) 0%, transparent 100%);
  border-left-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateX(8px);
}

.mobile-link-icon {
  width: 20px;
  margin-right: 12px;
  font-size: 1.1rem;
  opacity: 0.8;
}

/* Mobile services section */
.mobile-services-section {
  margin-top: 0.5rem;
  position: relative;
}

.mobile-services-toggle {
  width: 100%;
  position: relative;
  overflow: hidden;
}

.mobile-services-toggle::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(107, 79, 161, 0.2) 50%, transparent 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.mobile-services-toggle:hover::after {
  transform: scaleX(1);
}

.mobile-services-dropdown {
  background: linear-gradient(135deg, rgba(107, 79, 161, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%);
  margin: 0.5rem 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(107, 79, 161, 0.1);
  box-shadow: 0 2px 8px rgba(107, 79, 161, 0.1);
  transform: translateY(-2px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.mobile-services-dropdown::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(107, 79, 161, 0.2) 50%, transparent 100%);
}

.dark .mobile-services-dropdown {
  background: linear-gradient(135deg, rgba(107, 79, 161, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%);
  border: 1px solid rgba(107, 79, 161, 0.2);
  box-shadow: 0 2px 8px rgba(107, 79, 161, 0.2);
}

.mobile-submenu-link {
  padding: 0.875rem 1.25rem 0.875rem 3.5rem;
  font-size: 0.95rem;
  color: #6b7280;
  border-left: 3px solid transparent;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 0.25rem 0.75rem;
  border-radius: 8px;
  font-weight: 500;
  display: block;
  width: calc(100% - 1.5rem);
  border-bottom: 1px solid rgba(107, 79, 161, 0.1);
}

.mobile-submenu-link:first-child {
  margin-top: 0.75rem;
}

.mobile-submenu-link:last-child {
  margin-bottom: 0.75rem;
  border-bottom: none;
}

.mobile-submenu-link:not(:last-child) {
  margin-bottom: 0.125rem;
}

.dark .mobile-submenu-link {
  color: #d1d5db;
  border-bottom-color: rgba(107, 79, 161, 0.2);
}

.mobile-submenu-link:hover {
  background: linear-gradient(135deg, rgba(107, 79, 161, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%);
  border-left-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(107, 79, 161, 0.15);
  border-bottom-color: rgba(107, 79, 161, 0.2);
}

.mobile-submenu-link.router-link-active {
  background: linear-gradient(135deg, rgba(107, 79, 161, 0.2) 0%, rgba(139, 92, 246, 0.15) 100%);
  border-left-color: var(--primary-color);
  color: var(--primary-color);
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(107, 79, 161, 0.2);
  border-bottom-color: var(--primary-color);
}

.mobile-submenu-link .mobile-link-icon {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.mobile-submenu-link:hover .mobile-link-icon,
.mobile-submenu-link.router-link-active .mobile-link-icon {
  opacity: 1;
  transform: translateY(-50%) scale(1.1);
  color: var(--primary-color);
}

/* Mobile user section */
.mobile-user-section {
  padding: 1rem 1.25rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(249, 250, 251, 0.5);
}

.dark .mobile-user-section {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(31, 41, 55, 0.5);
}

.mobile-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.9rem;
}

.mobile-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.mobile-action-btn {
  background: rgba(107, 79, 161, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-action-btn:hover {
  background: rgba(107, 79, 161, 0.2);
  transform: scale(1.1);
}

/* Mobile user info */
.mobile-user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(107, 79, 161, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.mobile-user-info:hover {
  background: rgba(107, 79, 161, 0.15);
  transform: translateY(-2px);
}

.mobile-user-avatar {
  font-size: 2.5rem;
  color: var(--primary-color);
}

.mobile-user-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.mobile-user-name {
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.dark .mobile-user-name {
  color: var(--primary-text);
}

.mobile-user-role {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
}

/* Mobile buttons */
.mobile-login-btn,
.mobile-logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-login-btn {
  background: linear-gradient(135deg, var(--primary-color) 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(107, 79, 161, 0.3);
}

.mobile-login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(107, 79, 161, 0.4);
}

.mobile-logout-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.mobile-logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
}

/* Responsive adjustments for mobile menu */
@media (max-width: 480px) {
  .mobile-menu-panel {
    width: 90%;
    max-width: 280px;
  }
  
  .mobile-menu-header {
    padding: 1.25rem 1rem 0.75rem;
  }
  
  .mobile-logo {
    height: 32px;
  }
  
  .mobile-close-btn {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
  
  .mobile-menu-toggle {
    padding: 0.875rem 1rem;
    font-size: 1rem;
  }
  
  .mobile-menu-link {
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
  }
  
  .mobile-submenu-link {
    padding: 0.625rem 1rem 0.625rem 2.5rem;
    font-size: 0.9rem;
  }
  
  .mobile-user-section {
    padding: 0.875rem 1rem;
  }
  
  .mobile-user-info {
    padding: 0.625rem;
  }
  
  .mobile-user-avatar {
    font-size: 2rem;
  }
  
  .mobile-user-name {
    font-size: 0.9rem;
  }
  
  .mobile-user-role {
    font-size: 0.75rem;
  }
}
</style>