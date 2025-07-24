<template>
  <div v-if="technician">
    <div class="profile-hero">
      <h1 class="profile-title">{{ $t('technicianProfileTitle') }}</h1>
    </div>
    <div class="profile-main">
      <div class="profile-card">
        <img :src="technician.image" alt="Technician" class="profile-img" />
        <div class="profile-info">
          <h2 class="profile-name">{{ technician.name }}</h2>
          <div class="profile-role">{{ $t('plumber') }}</div>
          <div class="profile-meta">
            <div><b>{{ $t('location') }}:</b> {{ technician.location || '-' }}</div>
            <div><b>{{ $t('gender') }}:</b> {{ technician.gender || '-' }}</div>
            <div><b>{{ $t('nationality') }}:</b> {{ technician.nationality || '-' }}</div>
            <div><b>{{ $t('yearsOfExperience') }}</b> {{ technician.yearsOfExperience || '-' }}</div>
          </div>
          <div class="profile-rating">
            <i class="fa-solid fa-star" v-for="n in technician.rating || 5" :key="n"></i>
          </div>
          <div class="profile-skills">
            <b>{{ $t('skills') }}</b>
            <ul>
              <li v-for="skill in technician.skills || []" :key="skill">{{ skill }}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="profile-booking">
        <div class="booking-card">
          <div class="booking-title">{{ $t('bookingInformation') }}</div>
          <div class="booking-section">
            <div class="booking-label">{{ $t('availableAppointment') }}</div>
            <div class="booking-appointments">
              <div class="booking-date">
                <div>1/8/2025</div>
                <div>01:00 PM - 11:00 PM</div>
              </div>
              <div class="booking-date">
                <div>2/8/2025</div>
                <div>12:00 PM - 12:00 PM</div>
              </div>
              <div class="booking-date">
                <div>3/8/2025</div>
                <div>12:00 PM - 12:00 PM</div>
              </div>
            </div>
            <div class="booking-price">{{ $t('visitPrice') }} : <span>{{ technician.price || '-' }} EGP</span></div>
            <button class="booking-btn" @click="goToBooking">{{ $t('bookNow') }}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="profile-reviews">
      <h2>{{ $t('reviews') }}</h2>
      <div v-for="review in technician.reviews || []" :key="review.text" class="review-card">
        <div class="review-rating">
          <i class="fa-solid fa-star" v-for="n in review.rating" :key="n"></i>
        </div>
        <div class="review-text">{{ review.text }}</div>
        <div class="review-meta">
          <span>{{ review.author }}</span>
          <span>{{ review.date }}</span>
        </div>
      </div>
      <button class="show-more">{{ $t('showMore') }}</button>
    </div>
  </div>
  <div v-else>
    <p>{{ $t('loading') }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { stockTechnicians } from '../assets/stockTechnicians'

const route = useRoute()
const router = useRouter()
const technician = ref(null)

onMounted(async () => {
  const id = route.params.id
  // Try to find in stockTechnicians first
  const stock = stockTechnicians.find(t => t.id === id)
  if (stock) {
    technician.value = stock
    return
  }
  // Otherwise, fetch from Firestore
  const docRef = doc(db, 'technicians', id)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    technician.value = docSnap.data()
  }
})

function goToBooking() {
  router.push({ path: '/bookingpage', query: { techId: technician.value.id } })
}
</script>

<style scoped>
.profile-hero {
  margin: 2rem 0 1rem 0;
  text-align: left;
}
.dark-mode .profile-title {
  color: var(--primary-text);
  background-color: var(--primary-bg);
}
.dark-mode .profile-card {
  background-color: var(--primary-bg);
  color: var(--primary-text);
}
.dark-mode .profile-main {
  background-color: var(--primary-bg);
  color: var(--primary-text);
}
.dark-mode .profile-booking {
  background-color: var(--primary-bg);
  color: var(--primary-text);
}   
.dark-mode .profile-reviews {
  background-color: var(--primary-bg);
  color: var(--primary-text);
}
.dark-mode .review-card {
  background-color: var(--primary-bg);
  color: var(--primary-text);
}
.dark-mode .profile-title {
  font-size: 2.2rem;
  font-weight: bold;
  color: #625397;
}
.dark-mode .profile-name {
  color: var(--primary-text);
}
.dark-mode .profile-role {
  color: var(--primary-text);
}
.dark-mode .profile-meta {
  color: var(--primary-text);
}
.dark-mode .profile-rating {
  color: var(--primary-text);
}
.dark-mode .profile-skills {
  color: var(--primary-text);
}
.dark-mode .profile-skills ul {
  color: var(--primary-text);
}

.profile-main {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}
.profile-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  padding: 2rem;
  display: flex;
  gap: 2rem;
  flex: 2;
  align-items: flex-start;
}
.profile-img {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #eee;
}
.profile-info {
  flex: 1;
}
.profile-name {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.2rem;
}
.profile-role {
  font-size: 1.1rem;
  color: #625397;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.profile-meta {
  font-size: 1rem;
  color: #444;
  margin-bottom: 0.5rem;
}
.profile-rating {
  color: #FFC230;
  margin-bottom: 0.5rem;
}
.profile-skills {
  font-size: 1rem;
  color: #333;
  margin-top: 1rem;
}
.profile-skills ul {
  margin: 0.5rem 0 0 0;
  padding-left: 1.2rem;
}
.profile-booking {
  flex: 1;
  display: flex;
  align-items: flex-start;
}
.booking-card {
  background: #f8f9fa;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  padding: 2rem 1.5rem;
  width: 100%;
}
.booking-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #625397;
  margin-bottom: 1rem;
}
.booking-section {
  font-size: 1rem;
}
.booking-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.booking-appointments {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.booking-date {
  background: #fff;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  text-align: center;
}
.booking-price {
  margin: 1rem 0;
  font-weight: 600;
  color: #625397;
}
.booking-btn {
  background: var(--primary-color);
  color: #fff;
  border: none;
  padding: 0.7rem 2rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.booking-btn:hover {
  background: #4a3f7a;
}
.profile-reviews {
  margin: 2rem 0;
}
.review-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 1.2rem 1.5rem;
  margin-bottom: 1.2rem;
}
.review-rating {
  color: #FFC230;
  margin-bottom: 0.5rem;
}
.review-text {
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.5rem;
}
.review-meta {
  font-size: 0.95rem;
  color: #888;
  display: flex;
  gap: 1.5rem;
}
.show-more {
  background: none;
  border: 1px solid #625397;
  color: #625397;
  border-radius: 20px;
  padding: 0.5rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
}
.show-more:hover {
  background: #f3f0fa;
}
</style> 