<script>
import '../style.css'
import { ref, onMounted, onBeforeUnmount } from 'vue';
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

    function getRoute(path) {
      return locale.value === 'ar' ? `/ar/${path}` : `/${path}`;
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
      if (currentUser && currentUser.email && currentUser.email.endsWith('@gmail.com')) {
        router.push(getRoute('profile-view'));
        return;
      }
      if (currentUser && currentUser.providerData && currentUser.providerData.some(p => p.providerId === 'google.com')) {
        router.push(getRoute('profile-view'));
        return;
      }
      const userType = localStorage.getItem('userType');
      if (userType === 'technician') {
        router.push(getRoute('profile'));
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
    }

    function goToUserAccount() {
      router.push(getRoute('welcomepage'));
    }

    function showDropdown() {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
        dropdownTimeout = null;
      }
      servicesDropdownOpen.value = true;
    }

    function hideDropdown() {
      if (dropdownTimeout) clearTimeout(dropdownTimeout);
      servicesDropdownOpen.value = false;
    }

    function handleDocumentClick(e) {
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

    onMounted(() => {
      document.addEventListener('click', handleDocumentClick);
    });
    onBeforeUnmount(() => {
      document.removeEventListener('click', handleDocumentClick);
    });

    return {
      user,
      loading,
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
      servicesDropdownOpen,
      showDropdown,
      hideDropdown,
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
  <div class="text-white w-full" id="contact-Nav">
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
  <nav class="bg-white px-6 py-3 flex justify-between items-center container">
    <!-- Logo -->
    <div class="flex items-center gap-2 text-2xl font-bold">
      <img src="/logo/ace04d3b268cf810c91d002fdf7454a6ef778f27.png" alt="Logo" class="h-8" id="logo"/>
    </div>
    <!-- Hamburger for mobile -->
    <button class="md:hidden block text-2xl" @click="mobileMenuOpen = !mobileMenuOpen">
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
      <li class="relative group"
          @mouseenter="showDropdown">
        <span class="no-underline services-color cursor-pointer flex items-center">
          {{ $t('navServices') }}
          <i class="fa fa-chevron-down services-dropdown-arrow ml-1"></i>
        </span>
        <div
          class="services-dropdown absolute left-0 mt-2 shadow-lg bg-white rounded z-50"
          v-show="servicesDropdownOpen"
          @mouseenter="showDropdown"
        > <router-link to="/">All services</router-link>
        <router-link to="/plumbing">{{ $t('navPlumbing') }}</router-link>
         
          <router-link to="/aircondition">{{ $t('navAirConditioner') }}</router-link>
          <router-link to="/electricity">{{ $t('navElectricity') }}</router-link>
          <router-link to="/wallfinishing">{{ $t('navWallFinishing') }}</router-link>
          <router-link to="/carpentry">{{ $t('navCarpentry') }}</router-link>
          <router-link to="/elecTechnicians">{{ $t('navElectricityTechnicians') }}</router-link>
        </div>
      </li>
      <li>
        <router-link :to="locale === 'ar' ? getRoute('contact') : '/contact'" class="no-underline services-color">{{ $t('navContact') }}</router-link>
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
    </div>
    <!-- Mobile Menu -->
    <div v-if="mobileMenuOpen" class="md:hidden absolute top-20 left-0 w-full bg-white shadow-lg z-50 p-4">
      <div>
        <button class="w-full text-left font-bold py-2 flex items-center justify-between" @click="navAccordionOpen = !navAccordionOpen">
          <span>{{ $t('Menu') }}</span>
          <i :class="navAccordionOpen ? 'fa fa-chevron-up' : 'fa fa-chevron-down'"></i>
        </button>
        <div v-if="navAccordionOpen" class="pl-2 pb-2">
          <router-link :to="locale === 'ar' ? getRoute('') : '/'" class="block py-2" @click="closeMobileMenu">{{ $t('navHome') }}</router-link>
          <router-link :to="locale === 'ar' ? getRoute('about') : '/about'" class="block py-2" @click="closeMobileMenu">{{ $t('navAbout') }}</router-link>
          <router-link :to="locale === 'ar' ? getRoute('plumbing') : '/plumbing'" class="block py-2" @click="closeMobileMenu">{{ $t('navServices') }}</router-link>
          <router-link :to="locale === 'ar' ? getRoute('contact') : '/contact'" class="block py-2" @click="closeMobileMenu">{{ $t('navContact') }}</router-link>
        </div>
        <button class="w-full text-right text-gray-500 mt-2" @click="closeMobileMenu">
          <i class="fa fa-times"></i> {{ $t('close') }}
        </button>
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
      </div>
    </div>
  </nav>
</template>

<style scoped>
#contact-Nav {
  background-color: var(--secondary-color);
  width: 100%;
  padding: 0;
}
#logo {
  width: 153.308px;
  height: 52px;
}
#login-btn {
  border: 1px solid #6B4FA1;
  transition: background-color 0.3s ease;
  background-color: var(--primary-color);
  color: white;
  padding: 0.25rem 1rem;
  border-radius: 20px;
}
#login-btn:hover {
  background-color: white;
  color: #6B4FA1;
}
.services-color {
  color: #8C8E90;
  font-weight: 600;
  transition: color 0.3s ease;
  margin: 0;
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
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08), 0 1.5px 4px rgba(0,0,0,0.03);
  padding: 0.5rem 0;
  z-index: 50;
  opacity: 0;
  pointer-events: none;
  transform: translateY(10px);
  transition: opacity 1.5s ease, transform 1.5s ease;
  position: absolute;
  left: 0;
  top: 100%;
}
.group:hover .services-dropdown {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}
.services-dropdown a {
  display: block;
  padding: 0.5rem 1rem;
  color: #333;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
  border-radius: 0.25rem;
}
.services-dropdown a:hover {
  background: var(--primary-color);
  color: #fff;
}
.services-dropdown-arrow {
  margin-left: 0.25rem;
  transition: transform 0.36s;
}
.group:hover .services-dropdown-arrow {
  transform: rotate(180deg);
}
@media (max-width: 768px) {
  #contact-Nav {
    padding: 0.5rem 0.5rem;
  }
  
  #contact-Nav .max-w-7xl {
    flex-direction: column;
    gap: 8px;
  }
  
  #contact-Nav .flex.flex-col.sm\\:flex-row {
    flex-direction: column;
    gap: 4px;
  }
  
  #contact-Nav a {
    font-size: 0.75rem;
  }
  
  #logo {
    width: 110px;
    height: 38px;
  }
  
  nav {
    padding: 0.75rem 1rem;
  }
  
  .hidden.md\\:flex {
    display: none;
  }
  
  .hidden.md\\:flex.items-center.gap-2 {
    display: none;
  }
}

@media (max-width: 480px) {
  #contact-Nav {
    padding: 0.25rem 0.5rem;
  }
  
  #contact-Nav a {
    font-size: 0.7rem;
  }
  
  #logo {
    width: 90px;
    height: 30px;
  }
  
  nav {
    padding: 0.5rem 0.75rem;
  }
}
</style>