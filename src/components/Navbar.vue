<script>
import '../style.css'
import { ref, onMounted } from 'vue';
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
      // If the user's email ends with @gmail.com, always go to ProfileView
      if (currentUser && currentUser.email && currentUser.email.endsWith('@gmail.com')) {
        router.push(getRoute('profile-view'));
        return;
      }
      // If signed in with Google, always go to ProfileView
      if (currentUser && currentUser.providerData && currentUser.providerData.some(p => p.providerId === 'google.com')) {
        router.push(getRoute('profile-view'));
        return;
      }
      // Otherwise, check userType
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

    return {
      user,
      loading,
      logout,
      handleProfileClick,
      getRoute,
      signUpOptions,
      userButtonClass: " text-gray-600 p-2 rounded-full ",
      loginButtonClass: "",
      categories: [
        { name: 'Plumbing', route: '/plumbing' },
        { name: 'Electricity', route: '/electricity' },
        { name: 'Carpentry', route: '/carpentry' },
        { name: 'Air Condition', route: '/aircondition' },
        { name: 'Wall Finishing', route: '/wallfinishing' },
        {name: 'Electrical Technicians', route: '/elecTechnicians'}
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

      <!-- Nav Links -->
      <ul class="hidden md:flex gap-8  font-medium m-0">
        <li><a href="/" class="no-underline services-color">Home</a></li>
        <li><a href="/about" class="no-underline services-color">About us</a></li>
        <li><a href="/contact" class="no-underline services-color">Contact Us</a></li>
        <li class="relative group">
          <button class="no-underline services-color flex items-center focus:outline-none">
            Services
            <svg class="services-dropdown-arrow ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div class="services-dropdown">
            <a href="/services" class="block">All Services</a>
            <a v-for="category in categories" :key="category.name" :href="category.route" class="block">
              {{ category.name }}
            </a>
          </div>
        </li>
      </ul>

      <!-- Login/Register -->
      <div class="flex items-center gap-2">
        <template v-if="loading">
          <span class="text-gray-500">{{ $t('loading') }}</span>
        </template>
        <template v-else>
          <template v-if="user">
            <!-- Show user email or UID if logged in -->
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
            <!-- User Icon Button -->
            <button :class="userButtonClass" @click="signUpOption">
              <i class="fa-regular fa-user"></i>
            </button>
            <!-- Log in/Register Button -->
            <button :class="loginButtonClass" id="login-btn" @click="signUpOptions">
              {{ $t('loginRegister') }}
            </button>
          </template>
        </template>
        <!-- Language Toggle Button -->
        <LanguageToggle />
        
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
  transition: opacity 0.18s ease, transform 0.18s ease;
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
  transition: transform 0.18s;
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