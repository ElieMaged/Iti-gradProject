<template>
  <div class="confirmation-wrapper">
    <h1 class="confirmation-title">{{ $t('completeYourBooking') }}</h1>
    <div class="confirmation-card">
      <div class="confirmation-steps">
        <div class="step active">1 <span>{{ $t('detailsAndPayment') }}</span></div>
        <div class="step active">2 <span>{{ $t('confirmation') }}</span></div>
      </div>
      <div class="confirmation-main">
        <div class="confirmation-check">
          <svg width="90" height="90" viewBox="0 0 90 90"><circle cx="45" cy="45" r="42" fill="none" stroke="#4CAF50" stroke-width="6"/><polyline points="28,48 41,62 64,36" fill="none" stroke="#4CAF50" stroke-width="6"/></svg>
        </div>
        <div class="confirmation-message">
          <div class="confirmation-success">{{ $t('requestSubmitted') }}</div>
          <div class="confirmation-desc">{{ $t('reviewBookingNotify') }}</div>
          <div class="confirmation-next">{{ $t('whatHappensNext') }}</div>
          <div class="confirmation-desc">{{ $t('confirmationEmailInstructions') }}</div>
        </div>
        <div class="confirmation-summary">
          <div class="summary-title">{{ $t('bookingSummary') }}</div>
          <div><b>{{ $t('technician') }}:</b> {{ booking.technicianName }} ({{ booking.technicianRole }})</div>
          <div><b>{{ $t('dateAndTime') }}:</b> {{ booking.date }} – {{ booking.time }}</div>
          <div><b>{{ $t('technicianPhoneNumber') }}:</b> {{ booking.technicianPhone }}</div>
          <div><b>{{ $t('paymentMethod') }}:</b> {{ booking.payment }}</div>
        </div>
        <button class="back-btn" @click="goHome">{{ $t('backToHome') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const booking = ref({
  technicianName: '',
  technicianRole: '',
  date: '',
  time: '',
  technicianPhone: '',
  payment: ''
});

onMounted(() => {
  const stored = localStorage.getItem('bookingData');
  if (stored) {
    Object.assign(booking.value, JSON.parse(stored));
  }
});

function goHome() {
  router.push('/');
}
</script>

<style scoped>
.confirmation-wrapper {
  background: #f7f7fa;
  min-height: 100vh;
  padding: 2rem 0 4rem 0;
}
.confirmation-title {
  text-align: center;
  color: #7c6bb1;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
}
.confirmation-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  max-width: 800px;
  margin: 0 auto;
  padding: 2.5rem 2rem;
}
.confirmation-steps {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  color: #a49ad6;
  font-weight: 600;
}
.step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.step.active {
  color: #7c6bb1;
  font-weight: bold;
}
.confirmation-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}
.confirmation-check {
  margin-bottom: 1rem;
}
.confirmation-success {
  color: #7c6bb1;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.confirmation-desc {
  color: #444;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  text-align: center;
}
.confirmation-next {
  color: #7c6bb1;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0.5rem 0 0.2rem 0;
}
.confirmation-summary {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.2rem 1.5rem;
  margin: 1.2rem 0;
  width: 100%;
  max-width: 400px;
  text-align: left;
  color: #222;
  font-size: 1rem;
}
.summary-title {
  color: #7c6bb1;
  font-weight: bold;
  margin-bottom: 0.7rem;
}
.back-btn {
  background: #7c6bb1;
  color: #fff;
  border: none;
  padding: 0.9rem 2.5rem;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1.5rem;
  align-self: center;
  transition: background 0.2s;
}
.back-btn:hover {
  background: #4a3f7a;
}
</style> 