<script>
import '../style.css'
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import LanguageToggle from './LanguageToggle.vue';
// Firebase-related imports removed

export default {
  components: { LanguageToggle },
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
      if (userType === 'technician') {
        router.push({ path: '/technicion-profile' });
      } else if (userType === 'user') {
        router.push({ path: '/profile-view' });
      } else {
        router.push(getRoute('profile-view'));
      }
    }

    function signUpOptions() {
      router.push(getRoute('RegisterChoice'));
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

    function toggleDarkMode() {
      isDark.value = !isDark.value;
    }
    watch(isDark, (val) => {
      document.documentElement.classList.toggle('dark', val);
      localStorage.setItem('theme', val ? 'dark' : 'light');
    });
    onMounted(() => {
      isDark.value = localStorage.getItem('theme') === 'dark' ||
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    const iconClass = computed(() => isDark.value ? 'fa fa-moon' : 'fa fa-sun');

    return {
      user,
      loading,
      locale, 
      isDark,
      logout,
      handleProfileClick,
      getRoute,
      signUpOptions,
      userButtonClass: " text-gray-600 p-2 rounded-full ",
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
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center px-4 py-2 gap-2">
      <div class="flex flex-col sm:flex-row gap-2 items-center">
        <a href="tel:+12095551234" class="text-white no-underline mx-1 flex items-center text-sm"><i class="fa-solid fa-phone px-2"></i>{{ $t('contactPhone') }}</a>
        <a href="mailto:Boltfix@gmail.com" class="text-white no-underline mx-1 flex items-center text-sm"><i class="fa-solid fa-envelope px-2"></i>{{ $t('contactEmail') }}</a>
        <a href="https://www.google.com/maps/place/123+Main+St,+Anytown,+USA" class="text-white no-underline mx-1 flex items-center text-sm"><i class="fa-solid fa-map-marker-alt px-2"></i>{{ $t('contactAddress') }}</a>
      </div>
      <div class="flex gap-2">
        <a href="#" class="flex items-center justify-center rounded-full bg-white text-white w-7 h-7"><i class="fa-brands fa-facebook-f secondary-color"></i></a>
        <a href="#" class="flex items-center justify-center rounded-full bg-white text-white w-7 h-7"><i class="fa-brands fa-x-twitter secondary-color"></i></a>
        <a href="#" class="flex items-center justify-center rounded-full bg-white text-white w-7 h-7"><i class="fa-brands fa-linkedin-in secondary-color"></i></a>
        <a href="#" class="flex items-center justify-center rounded-full bg-white text-white w-7 h-7"><i class="fab fa-youtube secondary-color"></i></a>
      </div>
    </div>
  </div>
  <!-- Navbar -->
  <nav class="navbar  py-3 flex justify-between items-center container relative">
    <!-- Logo -->
    <div class="flex items-center gap-2 text-2xl font-bold">
      <img src="/logo/ace04d3b268cf810c91d002fdf7454a6ef778f27.png" alt="Logo" class="h-8" id="logo"/>
    </div>
    <!-- Hamburger for mobile -->
    <button class="md:hidden block text-2xl z-50" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Open menu">
      <i class="fa fa-bars"></i>
    </button>
    <!-- Nav Links (Desktop) -->
    <ul class="hidden md:flex gap-8 font-medium m-0">
      <li>
        <router-link :to="locale === 'ar' ? getRoute('') : '/'" class="no-underline services-color">{{ $t('navHome') }}</router-link>
      </li>
      <li>
        <router-link :to="locale === 'ar' ? getRoute('about') : '/about'" class="no-underline services-color">{{ $t('navAbout') }}</router-link>
      </li>
      <li>
        <router-link :to="locale === 'ar' ? getRoute('contact') : '/contact'" class="no-underline services-color">{{ $t('navContact') }}</router-link>
      </li>
      <li class="relative group"
          @mouseenter="!isMobile && showDropdown" @mouseleave="!isMobile && hideDropdown">
        <span class="no-underline services-color cursor-pointer flex items-center" @click="toggleDropdownMobile">
          {{ $t('navServices') }}
          <i class="fa fa-chevron-down services-dropdown-arrow ml-1"></i>
        </span>
        <div
          :class="['services-dropdown', isMobile ? 'static mt-2 relative w-full' : 'absolute left-0 mt-2 shadow-lg rounded z-50']"
          v-show="true"
          @mouseenter="!isMobile && showDropdown"
        > <router-link to="/">All services</router-link>
        <router-link to="/plumbing">{{ $t('navPlumbing') }}</router-link>
         
          <router-link to="/aircondition">{{ $t('navAirConditioner') }}</router-link>
          <router-link to="/electricity">{{ $t('navElectricity') }}</router-link>
          <router-link to="/wallfinishing">{{ $t('navWallFinishing') }}</router-link>
          <router-link to="/carpentry">{{ $t('navCarpentry') }}</router-link>
          <router-link to="/elecTechnicians">{{ $t('navElectricityTechnicians') }}</router-link>
        </div>
      </li>
    </ul>
    <!-- Login/Register (Desktop) -->
    <div class="hidden md:flex items-center gap-2">
      <template v-if="loading">
        <span class="text-gray-500">{{ $t('loading') }}</span>
      </template>
      <template v-else>
        <template v-if="user">
          <span class="flex items-center gap-2">
            <span class="text-gray-700 font-semibold px-3 py-1 rounded bg-gray-100 cursor-pointer" @click="handleProfileClick">
              {{ user.email || user.uid }}
            </span>
            <i class="fas fa-user-circle text-2xl text-secondary cursor-pointer" @click="handleProfileClick"></i>
          </span>
          <button :class="loginButtonClass" id="login-btn" @click="logout">
            {{ $t('logout') }}
          </button>
        </template>
        <template v-else>
          <button :class="userButtonClass" @click="goToUserAccount">
            <i class="fa-regular fa-user"></i>
          </button>
          <button :class="loginButtonClass" id="login-btn" @click="goToUserAccount">
            {{ $t('loginRegister') }}
          </button>
        </template>
      </template>
      <LanguageToggle />
      <button @click="toggleDarkMode()" class="ml-2 darkmode-btn" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
        <i :key="isDark" :class="iconClass"></i>
      </button>
    </div>
    <!-- Mobile Menu & Overlay -->
    <transition name="fade">
      <div v-if="mobileMenuOpen" class="fixed inset-0 z-40" @mouseenter="!isMobile && showDropdown" @mouseleave="!isMobile && hideDropdown">
        <div class="absolute inset-0  bg-opacity-40" @click="closeMobileMenu"></div>
        <div class="fixed top-0 left-0 w-4/5 max-w-xs h-full  shadow-lg z-50 p-4 overflow-y-auto flex flex-col">
          <div class="flex justify-between items-center mb-4">
            <img src="/logo/ace04d3b268cf810c91d002fdf7454a6ef778f27.png" alt="Logo" class="h-8"/>
            <button class="text-2xl" @click="closeMobileMenu" aria-label="Close menu">
              <i class="fa fa-times"></i>
            </button>
          </div>
          <button class="w-full text-left font-bold py-2 flex items-center justify-between" @click="navAccordionOpen = !navAccordionOpen">
            <span>{{ $t('Menu') }}</span>
            <i :class="navAccordionOpen ? 'fa fa-chevron-up' : 'fa fa-chevron-down'"></i>
          </button>
          <div v-if="navAccordionOpen" class="pl-2 pb-2">
            <router-link :to="locale === 'ar' ? getRoute('') : '/'" class="block py-2 no-underline" @click="closeMobileMenu">{{ $t('navHome') }}</router-link>
            <router-link :to="locale === 'ar' ? getRoute('about') : '/about'" class="block py-2 no-underline" @click="closeMobileMenu">{{ $t('navAbout') }}</router-link>
            <router-link :to="locale === 'ar' ? getRoute('contact') : '/contact'" class="block py-2 no-underline" @click="closeMobileMenu">{{ $t('navContact') }}</router-link>
            <!-- Mobile Services Dropdown --> 
            <div class="relative group"
          @mouseenter="!isMobile && showDropdown" @mouseleave="!isMobile && hideDropdown">
        <span class="no-underline services-color cursor-pointer flex items-center" @click="toggleDropdownMobile">
          {{ $t('navServices') }}
          <i class="fa fa-chevron-down services-dropdown-arrow ml-1"></i>
        </span>
        <div
          :class="['services-dropdown', isMobile ? 'static mt-2 relative w-full' : 'absolute left-0 mt-2 shadow-lg rounded z-50']"
          v-show="servicesDropdownOpen"
          @mouseenter="!isMobile && showDropdown"
        > <router-link to="/">All services</router-link>
        <router-link to="/plumbing">{{ $t('navPlumbing') }}</router-link>
          <router-link to="/aircondition">{{ $t('navAirConditioner') }}</router-link>
          <router-link to="/electricity">{{ $t('navElectricity') }}</router-link>
          <router-link to="/wallfinishing">{{ $t('navWallFinishing') }}</router-link>
          <router-link to="/carpentry">{{ $t('navCarpentry') }}</router-link>
          <router-link to="/elecTechnicians">{{ $t('navElectricityTechnicians') }}</router-link>
        </div>
      </div>
          </div>
          <div class="mt-4 flex flex-col gap-2">
            <template v-if="loading">
              <span class="text-gray-500">{{ $t('loading') }}</span>
            </template>
            <template v-else>
              <template v-if="user">
                <span class="flex items-center gap-2">
                  <span class="text-gray-700 font-semibold px-3 py-1 rounded bg-gray-100 cursor-pointer" @click="handleProfileClick">
                    {{ user.email || user.uid }}
                  </span>
                  <i class="fas fa-user-circle text-2xl text-secondary cursor-pointer" @click="handleProfileClick"></i>
                </span>
                <button :class="loginButtonClass" id="login-btn" @click="logout">
                  {{ $t('logout') }}
                </button>
              </template>
              <template v-else>
                <button :class="userButtonClass" @click="goToUserAccount">
                  <i class="fa-regular fa-user"></i>
                </button>
                <button :class="loginButtonClass" id="login-btn" @click="goToUserAccount">
                  {{ $t('loginRegister') }}
                </button>
              </template>
            </template>
            <LanguageToggle />
            <button @click="toggleDarkMode" class="ml-2 darkmode-btn" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
              <i :class="isDark ? 'fa fa-sun' : 'fa fa-moon'"></i>
            </button>
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
#logo {
  width: 153.308px;
  height: 52px;
  transition: width 0.2s, height 0.2s;
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
  box-shadow: 0 2px 8px rgba(98,84,152,0.08);
  margin-left: 0.5rem;
}
.dark #login-btn {
  background-color: var(--primary-color);
  color: var(--primary-text);
}
.dark #login-btn:hover {
  background-color: white;
  color: #6B4FA1;
}
#login-btn:hover {
  background-color: white;
  color: #6B4FA1;
}
.user-btn, .darkmode-btn {
  min-width: 44px;
  min-height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: none;
  border: none;
  color: #6B4FA1;
  transition: color 0.3s, background 0.3s;
}
.user-btn:hover, .darkmode-btn:hover {
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
.services-color:hover, .services-color:focus {
  color: var(--primary-color);
  /* background: #f3f0fa; */
  background: none;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
/* Dropdown Styles */
.services-dropdown {
  min-width: 180px;
  border-radius: 0.75rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.10), 0 1.5px 4px rgba(0,0,0,0.05);
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
.dark .services-dropdown a{
  background: var(--text-color-text-primary, #7c7e7e);
  color: var(--primary-text);
}
.services-dropdown a:hover, .services-dropdown a:focus {
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
  font-size: 1.7rem;
  color: #6B4FA1;
  transition: color 0.3s;
}

.darkmode-btn:hover {
  color: var(--text-muted);
}

/* Responsive Styles */
@media (max-width: 1024px) {
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
  .services-color {
    font-size: 0.9rem;
    padding: 0.3rem 0.2rem;
  }
}

// Mobile menu overlay and panel
.fixed.inset-0 {
  z-index: 40;
}
.dark .fixed.inset-0 {
  background: var(--secondary-bg);
  color: var(--primary-text);
}
.fixed.top-0.left-0 {
  z-index: 50;
  border-top-right-radius: 1.25rem;
  border-bottom-right-radius: 1.25rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  background: #fff;
  padding-top: 1.5rem;
}
.dark .fixed.top-0.left-0 {
  background: var(--secondary-bg);
  color: var(--primary-text);

}
.dark .fixed.top-0.left-0 .fa-times {
  background: var(--secondary-bg);
  color: var(--primary-text);
}
.fixed.top-0.left-0 .fa-times {
  font-size: 2.2rem;
  color: #6B4FA1;
  padding: 0.5rem;
  border-radius: 50%;
  background: #f3f0fa;
  transition: background 0.2s, color 0.2s;
}
.fixed.top-0.left-0 .fa-times:hover {
  color: #4b357a;
}
.fixed.top-0.left-0 .flex.flex-col.gap-2 > * {
  margin-bottom: 0.5rem;
}
.fixed.top-0.left-0 .block.py-2, .fixed.top-0.left-0 .services-dropdown a {
  border-radius: 0.5rem;
  margin-bottom: 0.2rem;
  font-size: 1.05rem;
  padding: 0.7rem 1rem;
}
.fixed.top-0.left-0 .block.py-2:active, .fixed.top-0.left-0 .services-dropdown a:active {
  background: var(--primary-color);
  color: #fff;
}
</style>