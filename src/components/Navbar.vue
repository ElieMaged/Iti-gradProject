<script>
import '../style.css'
export default {
  data() {
    return {
      userButtonClass: " text-gray-600 p-2 rounded-full ",

    };
  },
  methods: {
    goToUserAccount() {
      this.$router.push("/profile");
    },
  },
};
</script>




<template>
  <!-- Top Bar -->
    <div class=" text-white " id="contact-Nav">
      <div class="container d-flex justify-content-between align-items-center">
        <div>
          <a href="tel:+12095551234" class="text-white no-underline mx-1"><i class="fa-solid fa-phone px-2"></i> +1 209-555-1234</a>
          <a href="mailto:Boltfix@gmail.com" class="text-white  no-underline mx-1"><i class="fa-solid fa-envelope px-2"></i>Boltfix@gmail.com</a>
          <a href="https://www.google.com/maps/place/123+Main+St,+Anytown,+USA" class="text-white no-underline mx-1"><i class="fa-solid fa-map-marker-alt px-2"></i>123 Main St, Anytown, USA</a>
        </div>
        <div>
          <a href="#" class="d-inline-flex align-items-center justify-content-center rounded-circle bg-white text-white me-2 no-underline w-7 h-7 "><i class="fa-brands fa-facebook-f secondary-color"></i></a>
          <a href="#" class="d-inline-flex align-items-center justify-content-center rounded-circle bg-white text-white me-2 no-underline w-7 h-7"><i class="fa-brands fa-x-twitter secondary-color"></i></a>
          <a href="#" class="d-inline-flex align-items-center justify-content-center rounded-circle bg-white text-white me-2 no-underline w-7 h-7"><i class="fa-brands fa-linkedin-in secondary-color"></i></a>
          <a href="#" class="d-inline-flex align-items-center justify-content-center rounded-circle bg-white text-white me-2 no-underline w-7 h-7">
            <i class="fab fa-youtube secondary-color"></i>
          </a>
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
        <li><a href="#" class="no-underline services-color">Home</a></li>
        <li><a href="#" class="no-underline services-color">About us</a></li>
        <li><a href="#" class="no-underline services-color">Services</a></li>
        <li><a href="#" class="no-underline services-color">Contact Us</a></li>
      </ul>

      <!-- Login/Register -->
      <div class="flex items-center gap-2">
        <!-- User Icon Button -->
        <button :class="userButtonClass" @click="goToUserAccount">
          <i class="fa-regular fa-user"></i>
        </button>

        <!-- Log in/Register Button -->
        <button :class="loginButtonClass" id="login-btn" @click="goToUserAccount">
          Log in/Register
        </button>
      </div>
    </nav>
</template>


<style scoped>
#contact-Nav {
  background-color: var(--secondary-color);
  width: 100%;
  padding: 11px 80px;
}

#logo{
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

.services-color{
  color: #8C8E90;
  font-weight: 600;
  transition: color 0.3s ease;
  margin: 0;
}
</style>