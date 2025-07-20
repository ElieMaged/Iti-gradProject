<script>
import '../style.css'
export default {
  data() {
    return {
      userButtonClass: " text-gray-600 p-2 rounded-full ",
      loginButtonClass: "",
      mobileMenuOpen: false,
    };
  },
  methods: {
    goToUserAccount() {
      this.$router.push("/profile");
    },
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },
  },
};
</script>

<template>
  <!-- Top Bar -->
  <div class="text-white w-full" id="contact-Nav">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center px-4 py-2 gap-2">
      <div class="flex flex-col sm:flex-row gap-2 items-center">
        <a href="tel:+12095551234" class="text-white no-underline mx-1 flex items-center text-sm"><i class="fa-solid fa-phone px-2"></i>+1 209-555-1234</a>
        <a href="mailto:Boltfix@gmail.com" class="text-white no-underline mx-1 flex items-center text-sm"><i class="fa-solid fa-envelope px-2"></i>Boltfix@gmail.com</a>
        <a href="https://www.google.com/maps/place/123+Main+St,+Anytown,+USA" class="text-white no-underline mx-1 flex items-center text-sm"><i class="fa-solid fa-map-marker-alt px-2"></i>123 Main St, Anytown, USA</a>
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
  <nav class="bg-white px-4 py-3 flex justify-between items-center max-w-7xl mx-auto relative">
    <!-- Logo -->
    <div class="flex items-center gap-2 text-2xl font-bold">
      <img src="/logo/ace04d3b268cf810c91d002fdf7454a6ef778f27.png" alt="Logo" class="h-8" id="logo" />
    </div>
    <!-- Hamburger (mobile) -->
    <button class="md:hidden flex items-center px-2 py-1 text-gray-700 focus:outline-none" @click="toggleMobileMenu">
      <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    </button>
    <!-- Nav Links (desktop) -->
    <ul class="hidden md:flex gap-8 font-medium m-0">
      <li><a href="#" class="no-underline services-color">Home</a></li>
      <li><a href="#" class="no-underline services-color">About us</a></li>
      <li><a href="#" class="no-underline services-color">Services</a></li>
      <li><a href="#" class="no-underline services-color">Contact Us</a></li>
    </ul>
    <!-- Login/Register (desktop) -->
    <div class="hidden md:flex items-center gap-2">
      <button :class="userButtonClass" @click="goToUserAccount">
        <i class="fa-regular fa-user"></i>
      </button>
      <button :class="loginButtonClass" id="login-btn" @click="goToUserAccount">
        Log in/Register
      </button>
    </div>
    <!-- Mobile Menu -->
    <transition name="fade">
      <div v-if="mobileMenuOpen" class="absolute top-full left-0 w-full bg-white shadow-lg z-50 md:hidden animate-fade-in">
        <ul class="flex flex-col gap-4 py-4 px-6 font-medium">
          <li><a href="#" class="no-underline services-color block">Home</a></li>
          <li><a href="#" class="no-underline services-color block">About us</a></li>
          <li><a href="#" class="no-underline services-color block">Services</a></li>
          <li><a href="#" class="no-underline services-color block">Contact Us</a></li>
        </ul>
        <div class="flex flex-col gap-2 px-6 pb-4">
          <button :class="userButtonClass + ' w-full flex justify-start'" @click="goToUserAccount">
            <i class="fa-regular fa-user mr-2"></i> My Account
          </button>
          <button :class="loginButtonClass + ' w-full flex justify-start'" id="login-btn" @click="goToUserAccount">
            Log in/Register
          </button>
        </div>
      </div>
    </transition>
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
  transition: background-color 0.3s ease;
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
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