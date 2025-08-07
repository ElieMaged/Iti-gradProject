<template>
  <div class="welcome-page">
    <!-- Background Pattern -->
    <div class="background-pattern"></div>
    
    <div class="welcome-container">
      <!-- Header Section -->
      <div class="welcome-header">
        <div class="logo-container">
          <img src="/logo/ace04d3b268cf810c91d002fdf7454a6ef778f27.png" alt="BoltFix Logo" class="welcome-logo">
        </div>
        <h1 class="welcome-title">{{ $t('welcomeToBoltfix') }}</h1>
        <p class="welcome-subtitle">{{ $t('chooseYourRole') }}</p>
      </div>

      <!-- Cards Section -->
      <div class="cards-container">
        <!-- User Registration Card -->
        <div class="role-card user-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fa-solid fa-user"></i>
            </div>
            <div class="card-badge">{{ $t('popular') }}</div>
          </div>
          <h3 class="card-title">{{ $t('registerAsUser') }}</h3>
          <p class="card-description">
            {{ $t('userDescription') }}
          </p>
          <ul class="card-features">
            <li><i class="fa-solid fa-check"></i> {{ $t('browseSkilledTechnicians') }}</li>
            <li><i class="fa-solid fa-check"></i> {{ $t('bookAppointmentsEasily') }}</li>
            <li><i class="fa-solid fa-check"></i> {{ $t('trackYourBookings') }}</li>
            <li><i class="fa-solid fa-check"></i> {{ $t('leaveReviewsRatings') }}</li>
          </ul>
          <button class="get-started-btn primary-btn" @click="$router.push('/usersignup')">
            {{ $t('getStarted') }}
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <!-- Technician Registration Card -->
        <div class="role-card technician-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fa-solid fa-tools"></i>
            </div>
            <div class="card-badge">{{ $t('earnMoney') }}</div>
          </div>
          <h3 class="card-title">{{ $t('registerAsTechnician') }}</h3>
          <p class="card-description">
            {{ $t('technicianDescription') }}
          </p>
          <ul class="card-features">
            <li><i class="fa-solid fa-check"></i> {{ $t('setYourOwnRates') }}</li>
            <li><i class="fa-solid fa-check"></i> {{ $t('flexibleSchedule') }}</li>
            <li><i class="fa-solid fa-check"></i> {{ $t('buildYourReputation') }}</li>
            <li><i class="fa-solid fa-check"></i> {{ $t('securePayments') }}</li>
          </ul>
          <button class="get-started-btn secondary-btn" @click="$router.push('/techregister')">
            {{ $t('getStarted') }}
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <!-- Sign In Section -->
      <div class="signin-section">
        <div class="divider">
          <span class="divider-text">{{ $t('or') }}</span>
        </div>
        <div class="signin-container">
          <p class="signin-text">{{ $t('alreadyHaveAccount') }}</p>
          <button class="signin-btn" @click="$router.push('/userlogin')">
            {{ $t('signIn') }}
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
  background-color: #D3CFE2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.dark .welcome-page {
  background-color: var(--primary-bg);
}

.welcome-container {
  max-width: 900px;
  width: 100%;
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 48px 32px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
}

.dark .welcome-container {
  background: var(--secondary-bg);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-container {
  margin-bottom: 2rem;
}

.welcome-logo {
  width: 120px;
  height: auto;
  display: inline-block;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #6B4FA1;
  margin-bottom: 10px;
  font-family: Outfit, sans-serif;
}

.dark .welcome-title {
  background: var(--primary-color);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-subtitle {
  font-size: 1.25rem;
  color: #6b7280;
  margin: 0 0 3rem 0;
  font-family: Outfit, sans-serif;
}

.dark .welcome-subtitle {
  color: var(--primary-text);
}

.cards-container {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.role-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2rem;
  width: 380px;
  max-width: 100%;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.dark .role-card {
  background-color: var(--secondary-bg);
  color: var(--primary-text);
}

.role-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: var();
}

.dark .role-card:hover {
  border-color: rgba(102, 126, 234, 0.3);
}

.user-card {
  border-left: 4px solid var(--primary-color);
}

.technician-card {
  border-left: 4px solid #764ba2;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-icon {
  font-size: 2.5rem;
  color: var(--primary-color);
  background: var(--primary-color);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark .card-icon {
  color: var(--primary-color);
}

.card-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  font-family: 'Inter', sans-serif;
}

.dark .card-title {
  color: #f9fafb;
}

.card-description {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
}

.dark .card-description {
  color: #9ca3af;
}

.card-features {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
}

.card-features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  color: #6b7280;
  font-size: 0.9rem;
  font-family: 'Inter', sans-serif;
}

.dark .card-features li {
  color: #9ca3af;
}

.card-features i {
  color: #10b981;
  font-size: 0.875rem;
}

.get-started-btn {
  width: 100%;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow: hidden;
}

.primary-btn {
  background: var(--primary-color);
  color: white;
}

.secondary-btn {
  background: var(--primary-color);
  color: white;
}

.get-started-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.get-started-btn i {
  transition: transform 0.3s ease;
}

.get-started-btn:hover i {
  transform: translateX(4px);
}

/* Sign In Section Styles */
.signin-section {
  margin-top: 3rem;
  text-align: center;
}

.divider {
  position: relative;
  margin: 2rem 0;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}

.dark .divider::before,
.dark .divider::after {
  background: #4b5563;
}

.divider-text {
  background: transparent;
  padding: 0 1rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
}

.dark .divider-text {
  background: transparent;
  color: #9ca3af;
}

.signin-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.signin-text {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
  font-family: Outfit, sans-serif;
}

.dark .signin-text {
  color: #9ca3af;
}

.signin-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Inter', sans-serif;
}

.signin-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.signin-btn i {
  font-size: 0.875rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .welcome-page {
    padding: 20px;
  }
  
  .welcome-container {
    padding: 32px 24px;
  }

  .welcome-title {
    font-size: 2.5rem;
  }

  .welcome-subtitle {
    font-size: 1.1rem;
  }

  .cards-container {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .role-card {
    width: 100%;
    max-width: 400px;
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .welcome-page {
    padding: 16px;
  }
  
  .welcome-container {
    padding: 24px 16px;
  }

  .welcome-title {
    font-size: 2rem;
  }

  .role-card {
    padding: 1.25rem;
  }
  
  .card-features li {
    font-size: 0.85rem;
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