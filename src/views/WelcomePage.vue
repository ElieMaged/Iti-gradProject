<template>
  <div class="welcome-page container">
    <div class="welcome-container">
      <!-- Header Section -->
      <div class="welcome-header">
        <h1 class="welcome-title pt-5">Welcome to Boltfix</h1>
        <p class="welcome-subtitle">Choose your role and start your journey with us</p>
      </div>

      <!-- Cards Section -->
      <div class="cards-container py-5">
        <!-- User Registration Card -->
        <div class="role-card">
          <div class="card-icon">
            <i class="fa-regular fa-user"></i>
          </div>
          <h3 class="card-title">Register as a user</h3>
          <p class="card-description">
            Join us now to easily book trusted technicians near you. we'll connect you with professionals in just a few
            clicks.
          </p>
          <button class="get-started-btn" @click="$router.push('/usersignup')">
            Get Started
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <!-- Technician Registration Card -->
        <div class="role-card">
          <div class="card-icon">
            <i class="fa-regular fa-user"></i>
          </div>
          <h3 class="card-title">Register as a Technicain</h3>
          <p class="card-description">
            Register to offer your services and reach more customers in your area. Create your profile and start
            receiving bookings.
          </p>
          <button class="get-started-btn" @click="$router.push('/techregister')">
            Get Started
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const fileInput = ref(null);
const previewUrl = ref(null);

function triggerFileInput() {
  fileInput.value && fileInput.value.click();
}

function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    previewUrl.value = URL.createObjectURL(file);
    // You can also store the file for upload later
    // e.g., formData.append('photo', file)
  }
}
</script>

<style scoped>
.welcome-page {
  min-height: 100vh;
  background-color: rgb(255, 255, 255);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.dark .welcome-page {
  background-color: var(--primary-bg);
}

.welcome-container {
  max-width: 1200px;
  width: 100%;
  text-align: center;
  background-color: #D3cfe2;
}

.dark .welcome-container {
  background-color: var(--primary-bg);
}

.welcome-header {
  margin-bottom: 4rem;
}

.welcome-title {
  font-size: 3rem;
  font-weight: bold;
  color: #6B4FA1;
  margin-bottom: 1rem;
}

.dark .welcome-title {
  color: var(--primary-text);
}

.welcome-subtitle {
  font-size: 1.25rem;
  color: #6b7280;
  margin: 0;
}

.dark .welcome-subtitle {
  color: var(--primary-text);
}

.cards-container {
  display: flex;
  gap: 3rem;
  justify-content: center;
  flex-wrap: wrap;
}

.role-card {
  background-color: white;
  border: 2px solid #fbbf24;
  border-radius: 1rem;
  padding: 2.5rem;
  width: 350px;
  max-width: 100%;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.dark .role-card {
  background-color: var(--secondary-bg);
  color: var(--primary-text);
}

.role-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.dark .role-card:hover {
  background-color: var(--secondary-bg);
  color: var(--primary-text);
}

.card-icon {
  font-size: 3rem;
  color: #6B4FA1;
  margin-bottom: 1.5rem;
}

.dark .card-icon {
  color: var(--primary-text);
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #6B4FA1;
  margin-bottom: 1rem;
}

.dark .card-title {
  color: var(--primary-text);
}

.card-description {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 2rem;
  font-size: 1rem;
}

.dark .card-description {
  color: var(--primary-text);
}

.get-started-btn {
  background: none;
  border: none;
  color: #6B4FA1;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
  transition: color 0.3s ease;
}

.dark .get-started-btn {
  color: var(--primary-text);
}

.get-started-btn:hover {
  color: #5a3e8b;
}

.dark .get-started-btn:hover {
  color: var(--primary-text);
}

.get-started-btn i {
  transition: transform 0.3s ease;
}

.dark .get-started-btn i {
  color: var(--primary-text);
}

.get-started-btn:hover i {
  transform: translateX(5px);
}

.dark .get-started-btn:hover i {
  color: var(--primary-text);
}

/* Responsive Design */
@media (max-width: 768px) {
  .welcome-title {
    font-size: 2.5rem;
  }

  .welcome-subtitle {
    font-size: 1.1rem;
  }

  .cards-container {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .role-card {
    width: 100%;
    max-width: 400px;
    padding: 2rem;
  }
}

@media (max-width: 480px) {
  .welcome-page {
    padding: 1rem;
  }

  .welcome-title {
    font-size: 2rem;
  }

  .role-card {
    padding: 1.5rem;
  }
}

.preview-img {
  max-width: 120px;
  max-height: 120px;
  border-radius: 0.75rem;
  margin: 0 auto;
  display: block;
  object-fit: cover;
  border: 2px solid #6B4FA1;
}
</style>