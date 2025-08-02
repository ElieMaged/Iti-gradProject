<template>
  <div v-if="loading">
    <p>{{ $t('loading') }}</p>
  </div>
  <div v-else-if="error">
    <p class="text-red-500">{{ error }}</p>
  </div>
  <div v-else-if="technician">
    <!-- Main Heading -->
    <div class="main-heading m-20">
      <h1 class="heading-title">{{ $t('bookNowWithBestTechnicians') }}!</h1>
    </div>

    <div class="profile-layout m-20">
      <!-- Left Column - Technician Profile -->
      <div class="technician-profile-card">
        <div class="profile-header">
          <h2 class="technician-name">{{ technician.name }}</h2>
          <div class="technician-role">{{ getSpecializationTranslation(technician.specialization) }}</div>
        </div>
        
        <div class="profile-content">
          <div class="profile-image-section">
            <img :src="technician.image" alt="Technician" class="profile-image" />
            <div class="rating-section">
              <div class="stars">
                <i v-for="n in 5" :key="n" class="fa-solid fa-star"></i>
              </div>
            </div>
          </div>
          
          <div class="profile-details">
            <div class="technician-info">
              <div class="info-item">
                <span class="info-label">{{ $t('location') }}:</span>
                <span class="info-value">{{ technician.government && technician.district ? `${technician.government}, ${technician.district}` : (technician.location || $t('technicianNotAvailable')) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ $t('gender') }}:</span>
                <span class="info-value">{{ technician.gender || $t('male') }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ $t('nationality') }}:</span>
                <span class="info-value">{{ technician.nationality || $t('egyptian') }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ $t('yearsOfExperience') }}:</span>
                <span class="info-value">{{ technician.experience || technician.yearsOfExperience || $t('noExperienceInfo') }}</span>
              </div>
            </div>

            <div class="skills-section">
              <div class="skills-divider"></div>
              <h3 class="skills-title">{{ $t('skills') }}</h3>
              <ul class="skills-list" v-if="technician.skills && technician.skills.length > 0">
                <li v-for="skill in technician.skills" :key="skill" class="skill-item">{{ skill }}</li>
              </ul>
              <p v-else class="no-skills">{{ $t('noSkillsListed') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Booking Information -->
      <div class="booking-card">
        <h3 class="booking-title">{{ $t('bookingInformation') }}</h3>
        
        <div class="available-appointments">
          <h4 class="appointments-title">{{ $t('availableAppointment') }}</h4>
          <div class="date-slider">
            <button class="slider-arrow left-arrow">
              <i class="fas fa-chevron-left"></i>
            </button>
            <div class="date-slots">
              <div class="date-slot">
                <div class="date">1/8/2025</div>
                <div class="time-range">01:00 PM - 11:00 PM</div>
              </div>
              <div class="date-slot">
                <div class="date">2/8/2025</div>
                <div class="time-range">12:00 PM - 12:00 PM</div>
              </div>
              <div class="date-slot">
                <div class="date">3/8/2025</div>
                <div class="time-range">12:00 PM - 12:00 PM</div>
              </div>
            </div>
            <button class="slider-arrow right-arrow">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div class="visit-price">
          <span class="price-label">{{ $t('visitPrice') }}:</span>
          <span class="price-value">{{ technician.basePrice || '300' }} {{ $t('egp') }}</span>
        </div>

        <button class="book-now-button" @click="bookNow">
          {{ $t('bookNow') }}
        </button>
      </div>
    </div>

    <!-- Reviews Section -->
    <div class="reviews-section">
      <h2 class="reviews-title">{{ $t('reviews') }}</h2>
      
      <div class="reviews-list">
        <div v-for="(review, index) in reviews.slice(0, 3)" :key="review.id || index" class="review-card">
          <div class="review-rating">
            <i v-for="n in 5" :key="n" class="fa-solid fa-star"></i>
          </div>
          <div class="review-text">
            {{ $t('sampleReviewText') }}
          </div>
          <div class="review-author">{{ $t('sampleReviewAuthor') }}</div>
          <div class="review-date">{{ $t('sampleReviewDate') }}</div>
        </div>
      </div>

      <div class="show-more-container">
        <button class="show-more-button">{{ $t('showMore') }}</button>
      </div>
    </div>
  </div>
  <div v-else>
    <p>{{ $t('loading') }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { collection, query, where, getDocs, doc, getDoc, updateDoc, onSnapshot, orderBy, addDoc } from 'firebase/firestore'
import { db, auth } from '../firebase'
import { useI18n } from 'vue-i18n'
import { stockTechnicians } from '../assets/stockTechnicians'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const technician = ref(null)
const loading = ref(true)
const error = ref('')

// Reviews state
const reviews = ref([])

onMounted(async () => {
  const id = route.params.id
  
  // First check if technician data is passed via query parameters
  if (route.query.name) {
    // Use data from query parameters
    technician.value = {
      id: id,
      name: route.query.name,
      specialization: route.query.specialization,
      rating: parseFloat(route.query.rating) || 4.5,
      experience: route.query.experience,
      basePrice: route.query.basePrice,
      bio: route.query.bio,
      location: route.query.location,
      phone: route.query.phone,
      email: route.query.email,
      status: route.query.status,
      image: route.query.image || 'https://randomuser.me/api/portraits/men/32.jpg',
      government: route.query.location,
      district: route.query.location,
      fullName: route.query.name
    }
    loading.value = false
  } else {
    // Try to find in stockTechnicians first
    const stock = stockTechnicians.find(t => t.id === id)
    if (stock) {
      technician.value = stock
      loading.value = false
    } else {
      try {
        const docRef = doc(db, 'technicians', id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          technician.value = {
            ...data,
            name: data.fullName,
            location: data.government,
            price: data.basePrice,
            image: data.profilePhotoUrl || data.idPhotoUrl || 'https://randomuser.me/api/portraits/men/32.jpg'
          }
        } else {
          error.value = 'Technician profile not found.'
        }
      } catch (e) {
        error.value = 'Error loading profile.'
      } finally {
        loading.value = false
      }
    }
  }
  await fetchReviews()
})

async function fetchReviews() {
  try {
    const technicianId = route.params.id
    
    // Try the indexed query first
    try {
      const q = query(
        collection(db, 'reviews'), 
        where('technicianId', '==', technicianId),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      reviews.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (indexError) {
      // Fallback: Simple query without orderBy, sort in JavaScript
      const q = query(
        collection(db, 'reviews'), 
        where('technicianId', '==', technicianId)
      )
      const snapshot = await getDocs(q)
      
      // Sort reviews in JavaScript
      reviews.value = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return dateB - dateA; // Sort by newest first
        });
    }
  } catch (e) {
    console.error('Error fetching reviews:', e);
  }
}

function bookNow() {
  const technicianId = route.params.id
  router.push({
    path: '/bookingpage',
    query: { techId: technicianId }
  })
}

function getSpecializationTranslation(specialization) {
  if (!specialization) return t('plumber')
  
  const specializationMap = {
    'Plumbing': t('plumber'),
    'Electrical': t('electrician'),
    'Carpentry': t('carpenter'),
    'Air Conditioning': t('acTechnician'),
    'Wall Finishing': t('wallFinisher'),
    'plumber': t('plumber'),
    'electrician': t('electrician'),
    'carpenter': t('carpenter'),
    'acTechnician': t('acTechnician'),
    'wallFinisher': t('wallFinisher')
  }
  
  return specializationMap[specialization] || specialization
}
</script>

<style scoped>
/* Main Layout */
.main-heading {
  text-align: left;
  margin-bottom: 40px;
  width: 50%;
}

.heading-title {
  font-family: Outfit, sans-serif;
  font-size: 44px;
  font-style: normal;
  font-weight: 700;
  line-height: 56px;
  color: var(--surface-color-surface-secondary, #8C8E90);
  margin: 0;
}

.dark .heading-title {
  color: var(--primary-text);
}

/* Profile Layout */
.profile-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 60px;
}

/* Technician Profile Card */
.technician-profile-card {
  border-radius: 20px;
  border: 1px solid var(--border-border-primary, #C2C3C4);
  display: flex;
  width: 700px;
  padding: 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.dark .technician-profile-card {
  background: var(--grey-bg);
}

.profile-header {
  text-align: center;
  margin-bottom: 20px;
  width: 100%;
}

.technician-name {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  font-family: 'Outfit', sans-serif;
}

.dark .technician-name {
  color: var(--primary-text);
}

.technician-role {
  font-size: 1.2rem;
  color: #625397;
  font-weight: 600;
  font-family: 'Outfit', sans-serif;
}

.profile-content {
  display: flex;
  gap: 25px;
  align-items: flex-start;
  width: 100%;
}

.profile-image-section {
  position: relative;
  text-align: center;
  flex-shrink: 0;
  width: 150px;
}

.profile-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f0f0f0;
  margin-bottom: 15px;
}

.rating-section {
  text-align: center;
  margin-bottom: 15px;
}

.stars {
  display: flex;
  justify-content: center;
  gap: 2px;
  color: var(--secondary-color);
}

.stars i {
  color: var(--secondary-color);
  font-size: 1.2rem;
}

.profile-details {
  flex: 1;
  width: 100%;
}

.technician-info {
  margin-bottom: 25px;
  width: 100%;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-label {
  font-weight: 600;
  color: #666;
  font-family: 'Outfit', sans-serif;
}

.dark .info-label {
  color: var(--text-muted);
}

.info-value {
  color: #333;
  font-family: 'Outfit', sans-serif;
}

.dark .info-value {
  color: var(--primary-text);
}

.skills-section {
  margin-top: 20px;
  width: 100%;
}

.skills-divider {
  height: 2px;
  background: #f0f0f0;
  margin-bottom: 15px;
}

.skills-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  font-family: 'Outfit', sans-serif;
}

.dark .skills-title {
  color: var(--primary-text);
}

.skills-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.skill-item {
  padding: 8px 0;
  color: #666;
  border-bottom: 1px solid #f0f0f0;
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem;
  line-height: 1.4;
  width: 100%;
}

.dark .skill-item {
  color: var(--text-muted);
}

.no-skills {
  color: #999;
  font-style: italic;
  font-family: 'Outfit', sans-serif;
}

/* Booking Card */
.booking-card {
  border-radius: 20px;
  border: 1px solid var(--border-border-primary, #C2C3C4);
  display: flex;
  width: 500px;
  height: 505px;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  background: #ffffff;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(98, 83, 151, 0.1);
}

.dark .booking-card {
  background: var(--secondary-bg);
  border-color: var(--primary-color);
}

.booking-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 25px;
  text-align: center;
}

.dark .booking-title {
  color: var(--primary-text);
}

.available-appointments {
  margin-bottom: 25px;
}

.appointments-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.dark .appointments-title {
  color: var(--primary-text);
}

.date-slider {
  display: flex;
  align-items: center;
  gap: 15px;
}

.slider-arrow {
  background: #625397;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.slider-arrow:hover {
  background: #4e3b7a;
}

.date-slots {
  display: flex;
  gap: 15px;
  flex: 1;
  justify-content: center;
}

.date-slot {
  background: white;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 100px;
}

.dark .date-slot {
  background: var(--grey-bg);
}

.date {
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.dark .date {
  color: var(--primary-text);
}

.time-range {
  font-size: 0.9rem;
  color: #666;
}

.dark .time-range {
  color: var(--text-muted);
}

.visit-price {
  text-align: center;
  margin-bottom: 25px;
  padding: 15px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dark .visit-price {
  background: var(--grey-bg);
}

.price-label {
  font-weight: 600;
  color: #333;
  margin-right: 10px;
}

.dark .price-label {
  color: var(--primary-text);
}

.price-value {
  font-weight: bold;
  color: #625397;
  font-size: 1.1rem;
}

.book-now-button {
  width: 100%;
  background: #625397;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 15px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.book-now-button:hover {
  background: #4e3b7a;
}

/* Reviews Section */
.reviews-section {
  margin: 80px;
}

.reviews-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  text-align: left;
  margin-bottom: 40px;
}

.dark .reviews-title {
  color: var(--primary-text);
}

.reviews-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.review-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.dark .review-card {
  background: var(--grey-bg);
}

.review-rating {
  margin-bottom: 15px;
}

.review-rating i {
  color: #FFC230;
  font-size: 1.1rem;
  margin-right: 2px;
}

.review-text {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
  font-size: 0.95rem;
}

.dark .review-text {
  color: var(--text-muted);
}

.review-author {
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.dark .review-author {
  color: var(--primary-text);
}

.review-date {
  color: #999;
  font-size: 0.9rem;
}

.show-more-container {
  text-align: center;
}

.show-more-button {
  background: transparent;
  color: #625397;
  border: 2px solid #625397;
  border-radius: 25px;
  padding: 12px 30px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.show-more-button:hover {
  background: #625397;
  color: white;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .profile-layout {
    grid-template-columns: 1fr;
    gap: 30px;
    align-items: center;
  }
  
  .technician-profile-card {
    width: 100%;
    max-width: 700px;
  }
  
  .booking-card {
    width: 100%;
    max-width: 500px;
  }
}

@media (max-width: 768px) {
  .main-heading {
    width: 100%;
    margin: 20px;
  }
  
  .heading-title {
    font-size: 2rem;
    line-height: 2.5rem;
  }
  
  .profile-layout {
    margin: 20px;
  }
  
  .technician-profile-card {
    padding: 20px;
  }
  
  .profile-content {
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }
  
  .profile-image-section {
    width: 120px;
  }
  
  .profile-image {
    width: 120px;
    height: 120px;
  }
  
  .booking-card {
    padding: 20px;
    height: auto;
  }
  
  .date-slots {
    flex-direction: column;
    gap: 10px;
  }
  
  .date-slot {
    min-width: auto;
  }
  
  .slider-arrow {
    width: 35px;
    height: 35px;
  }
  
  .reviews-section {
    margin: 40px 20px;
  }
  
  .reviews-title {
    font-size: 1.5rem;
  }
  
  .reviews-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .heading-title {
    font-size: 1.5rem;
    line-height: 2rem;
  }
  
  .technician-name {
    font-size: 1.5rem;
  }
  
  .booking-title {
    font-size: 1.3rem;
  }
  
  .profile-image {
    width: 100px;
    height: 100px;
  }
  
  .profile-image-section {
    width: 100px;
  }
  
  .info-item {
    flex-direction: column;
    gap: 5px;
  }
  
  .review-card {
    padding: 20px;
  }
}

/* RTL Support for Arabic */
[dir="rtl"] .profile-content {
  flex-direction: row-reverse;
}

[dir="rtl"] .info-item {
  flex-direction: row-reverse;
}

[dir="rtl"] .date-slots {
  flex-direction: row-reverse;
}

[dir="rtl"] .slider-arrow.left-arrow {
  transform: rotate(180deg);
}

[dir="rtl"] .slider-arrow.right-arrow {
  transform: rotate(180deg);
}

[dir="rtl"] .visit-price {
  direction: rtl;
}

[dir="rtl"] .price-label {
  margin-right: 0;
  margin-left: 10px;
}
</style>
