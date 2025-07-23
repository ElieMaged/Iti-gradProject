<script>
import '../style.css'

export default {
  data() {
    return {
      userButtonClass: " text-gray-600 p-2 rounded-full ",
      loginButtonClass: "",
      categories: [
        { name: 'Plumbing', route: '/plumbing' },
        { name: 'Electricity', route: '/electricity' },
        { name: 'Carpentry', route: '/carpentry' },
        { name: 'Air Condition', route: '/air-condition' },
        { name: 'Wall Finishing', route: '/wallfinishing' },
        {name: 'Electrical Technicians', route: '/elecTechnicians'}
        // Add more categories as needed
      ]
    };
  },
  methods: {
    goToUserAccount() {
      this.$router.push("/usersignup");
    },
    goToRegisterChoice() {
      this.$router.push("/registerchoice");
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
        <!-- User Icon Button -->
        <button :class="userButtonClass" @click="goToUserAccount">
          <i class="fa-regular fa-user"></i>
        </button>

        <!-- Log in/Register Button -->
        <button :class="loginButtonClass" id="login-btn" @click="goToRegisterChoice">
          Log in/Register
        </button>
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