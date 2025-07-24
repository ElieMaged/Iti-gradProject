<template>
  <div class="booking-wrapper">
    <h1 class="booking-title">{{ $t('completeYourBooking') }}</h1>
    <div class="booking-card">
      <div class="booking-steps">
        <div class="step active">1 <span>{{ $t('detailsAndPayment') }}</span></div>
        <div class="step">2 <span>{{ $t('confirmation') }}</span></div>
      </div>
      <div class="booking-main">
        <div class="booking-profile">
          <img :src="technician.image" alt="Technician" class="profile-img" />
          <div class="profile-info">
            <div class="profile-name">{{ technician.name }}</div>
            <div class="profile-role">Plumber</div>
          </div>
        </div>
        <form class="booking-form" @submit.prevent="confirmBooking">
          <div class="form-section">
            <label>{{ $t('date') }}</label>
            <select v-model="form.date">
              <option v-for="date in availableDates" :key="date" :value="date">{{ date }}</option>
            </select>
            <label>{{ $t('time') }}</label>
            <select v-model="form.time">
              <option v-for="time in availableTimes" :key="time" :value="time">{{ time }}</option>
            </select>
          </div>
          <div class="form-section">
            <label>{{ $t('fullName') }}</label>
            <input v-model="form.fullName" :placeholder="$t('enterFullName')" required />
            <label>{{ $t('phoneNumber') }}</label>
            <input v-model="form.phone" :placeholder="$t('enterPhoneNumber')" required />
          </div>
          <div class="form-section">
            <label>{{ $t('note') }}</label>
            <input v-model="form.note" :placeholder="$t('enterNote')" />
          </div>
          <div class="form-section">
            <label>{{ $t('city') }}</label>
            <select v-model="form.city">
              <option value="Cairo">{{ $t('cairo') }}</option>
              <option value="Giza">{{ $t('giza') }}</option>
            </select>
            <label>{{ $t('area') }}</label>
            <select v-model="form.area">
              <option value="Giza">{{ $t('giza') }}</option>
              <option value="Maadi">{{ $t('maadi') }}</option>
            </select>
            <label>{{ $t('street') }}</label>
            <input v-model="form.street" :placeholder="$t('elSodanStreet')" />
            <label>{{ $t('detailedBuildingAddress') }}</label>
            <input v-model="form.building" :placeholder="$t('building5')" />
          </div>
          <div class="form-section">
            <label>{{ $t('choosePaymentMethod') }}</label>
            <div class="payment-methods">
              <label><input type="radio" value="Paypal" v-model="form.payment" /> {{ $t('paypal') }} <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" class="paypal-logo" /></label>
              <label><input type="radio" value="Cash" v-model="form.payment" /> {{ $t('cashOnVisit') }}</label>
            </div>
          </div>
          <button class="confirm-btn" type="submit">{{ $t('confirmBooking') }}</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { stockTechnicians } from '../assets/stockTechnicians'

const route = useRoute()
const router = useRouter()
const technician = ref({})

const availableDates = [
  '7/5/2025 Friday',
  '7/6/2025 Saturday',
  '7/7/2025 Sunday'
]
const availableTimes = [
  '01:00 PM - 11:00 PM',
  '12:00 PM - 12:00 PM',
  '03:00 PM - 05:00 PM'
]

const form = ref({
  date: availableDates[0],
  time: availableTimes[0],
  fullName: '',
  phone: '',
  note: '',
  city: 'Cairo',
  area: 'Giza',
  street: '',
  building: '',
  payment: 'Paypal'
})

onMounted(() => {
  const id = route.query.techId
  const stock = stockTechnicians.find(t => t.id === id)
  if (stock) {
    technician.value = stock
  }
  // You can add Firestore fetch here for dynamic technicians
})

function confirmBooking() {
  const bookingData = {
    technicianName: technician.value.name,
    technicianRole: 'Plumber',
    date: form.value.date,
    time: form.value.time,
    technicianPhone: technician.value.phone || '+20 111 252 6565',
    payment: form.value.payment
  };
  localStorage.setItem('bookingData', JSON.stringify(bookingData));
  router.push('/bookingconfirmation');
}
</script>

<style scoped>
.booking-wrapper {
  background: #f7f7fa;
  min-height: 100vh;
  padding: 2rem 0 4rem 0;
}
.dark .booking-wrapper {
  background: var(--primary-bg) !important;
}
.booking-title {
  text-align: center;
  color: #7c6bb1;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
}
.dark .booking-title {
  color: var(--primary-text) !important;
}

.booking-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  max-width: 800px;
  margin: 0 auto;
  padding: 2.5rem 2rem;
}
.dark .booking-card {
  background: var(--secondary-bg) !important;
  color: var(--primary-text) !important;
}
.booking-steps {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  color: #a49ad6;
  font-weight: 600;
}
.dark .booking-steps {
  color: var(--primary-text) !important;
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
.dark .step.active {
  color: var(--primary-text) !important;
}
.booking-main {
  display: flex;
  gap: 2rem;
}
.booking-profile {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
}
.dark .booking-profile {
  background: var(--secondary-bg) !important;
}
.profile-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #eee;
}
.profile-info {
  text-align: center;
}
.profile-name {
  font-size: 1.1rem;
  font-weight: bold;
}
.profile-role {
  font-size: 1rem;
  color: #625397;
  font-weight: 600;
}
.dark .profile-role {
  color: var(--primary-text) !important;
}
.booking-form {
  flex: 3;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: flex-start;
}
.dark .booking-form {
  background: var(--secondary-bg) !important;
  color: var(--primary-text) !important;
}
.form-section {
  flex: 1 1 220px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
input, select {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}
.dark input, select {
  border: 1px solid var(--primary-bg) !important;
  color: var(--primary-text) !important;
}
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.paypal-logo {
  height: 22px;
  margin-left: 0.5rem;
  vertical-align: middle;
}
.confirm-btn {
  background: #7c6bb1;
  color: #fff;
  border: none;
  padding: 0.9rem 2.5rem;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1.5rem;
  align-self: flex-end;
  transition: background 0.2s;
}
.dark .confirm-btn {
  background: var(--primary-color) !important;
  color: var(--primary-text) !important;
}
.confirm-btn:hover {
  background: #4a3f7a;
}
.dark .confirm-btn:hover {
  background: var(--primary-color) !important;
}
</style> 