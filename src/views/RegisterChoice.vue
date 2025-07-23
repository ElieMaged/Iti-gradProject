<template>
  <div class="register-choice-bg">
    <div class="register-choice-card">
      <h1 class="register-title">Welcome to Boltfix</h1>
      <div class="register-subtitle">Choose your role and start your journey with us</div>
      <div class="register-options">
        <div class="register-option" @click="goToUserRegister">
          <div class="option-header">
            <i class="fa-regular fa-user"></i>
            <span class="option-title">Register as a user</span>
          </div>
          <div class="option-desc">
            Join us now to easily book trusted technicians near you. We'll connect you with professionals in just a few clicks.
          </div>
          <div class="option-link">Get Started <i class="fa-solid fa-arrow-right"></i></div>
        </div>
        <div class="register-option" @click="goToTechRegister">
          <div class="option-header">
            <i class="fa-regular fa-user"></i>
            <span class="option-title">Register as a Technicain</span>
          </div>
          <div class="option-desc">
            Register to offer your services and reach more customers in your area. Create your profile and start receiving bookings.
          </div>
          <div class="option-link">Get Started <i class="fa-solid fa-arrow-right"></i></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
function goToUserRegister() {
  router.push('/usersignup');
}
function goToTechRegister() {
  router.push('/techregister');
}
</script>

<style scoped>
.register-choice-bg {
  padding: 100px;
  min-height: 100vh;
  background: #d3cde6;
  display: flex;
  align-items: center;
  justify-content: center;
}
.register-choice-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
  padding: 48px 32px 40px 32px;
  max-width: 700px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.register-title {
  color: #625397;
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 8px;
  text-align: center;
}
.register-subtitle {
  color: #888;
  font-size: 1.1rem;
  margin-bottom: 32px;
  text-align: center;
}
.register-options {
  display: flex;
  gap: 32px;
  width: 100%;
  justify-content: center;
}
.register-option {
  border: 2px solid #ffd36a;
  border-radius: 12px;
  padding: 28px 24px 20px 24px;
  background: #fff;
  width: 270px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: box-shadow 0.2s, border 0.2s;
  cursor: pointer;
}
.register-option:hover {
  box-shadow: 0 4px 16px rgba(98,83,151,0.10);
  border-color: #625397;
}
.option-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.option-title {
  color: #625397;
  font-weight: 700;
  font-size: 1.1rem;
}
.option-desc {
  color: #444;
  font-size: 1rem;
  margin-bottom: 18px;
}
.option-link {
  color: #625397;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
}
@media (max-width: 700px) {
  .register-options {
    flex-direction: column;
    gap: 18px;
    align-items: center;
  }
  .register-option {
    width: 100%;
    max-width: 350px;
  }
}
</style> 