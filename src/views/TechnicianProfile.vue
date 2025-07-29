<template>
  <div v-if="loading">
    <p>{{ $t('loading') }}</p>
  </div>
  <div v-else-if="error">
    <p class="text-red-500">{{ error }}</p>
  </div>
  <div v-else-if="technician">
    <div class="profile-hero">
      <h1 class="profile-title">{{ $t('technicianProfileTitle') }}</h1>
    </div>
    <div class="profile-main">
      <div class="profile-card">
        <img :src="technician.image" alt="Technician" class="profile-img" />
        <div class="profile-info">
          <h2 class="profile-name">{{ technician.name }}</h2>
          <div class="profile-role">{{ getSpecializationTranslation(technician.specialization) }}</div>
          <div class="profile-meta">
            <div><b>{{ $t('location') }}:</b> {{ technician.government && technician.district ? `${technician.government}, ${technician.district}` : (technician.location || $t('technicianNotAvailable')) }}</div>
            <div><b>{{ $t('yearsOfExperience') }}:</b> {{ technician.experience || technician.yearsOfExperience || $t('noExperienceInfo') }}</div>
            <div v-if="technician.basePrice"><b>{{ $t('baseVisitPrice') }}:</b> {{ technician.basePrice }} {{ $t('egp') }}</div>
            <div v-if="technician.willingToTravel"><b>{{ $t('willingToTravel') }}:</b> {{ technician.willingToTravel === 'yes' ? $t('yes') : $t('no') }}</div>
          </div>
          <div class="profile-rating">
            <div class="rating-stars">
              <i class="fa-solid fa-star" :style="{ color: 1 <= averageRating ? '#FFC230' : '#ddd', fontSize: '1.2rem' }"></i>
              <i class="fa-solid fa-star" :style="{ color: 2 <= averageRating ? '#FFC230' : '#ddd', fontSize: '1.2rem' }"></i>
              <i class="fa-solid fa-star" :style="{ color: 3 <= averageRating ? '#FFC230' : '#ddd', fontSize: '1.2rem' }"></i>
              <i class="fa-solid fa-star" :style="{ color: 4 <= averageRating ? '#FFC230' : '#ddd', fontSize: '1.2rem' }"></i>
              <i class="fa-solid fa-star" :style="{ color: 5 <= averageRating ? '#FFC230' : '#ddd', fontSize: '1.2rem' }"></i>
            </div>
            <div class="rating-text">
              {{ averageRating.toFixed(1) }} ({{ reviews.length }} {{ $t('reviews') }})
            </div>
            <div v-if="reviews.length === 0" class="no-rating">
              {{ $t('noReviewsYet') }}
            </div>
            <!-- Debug to see what's happening -->
            <div style="font-size: 0.8rem; color: #666; margin-top: 0.5rem;">
              Debug: Avg={{ averageRating }}, Reviews={{ reviews.length }}, Reviews: {{ reviews.map(r => r.rating).join(', ') }}
            </div>
          </div>
          <div class="profile-skills">
            <b>{{ $t('skills') }}</b>
            <ul v-if="technician.skills && technician.skills.length > 0">
              <li v-for="skill in technician.skills" :key="skill">{{ skill }}</li>
            </ul>
            <p v-else class="no-skills">{{ $t('noSkillsListed') }}</p>
          </div>
          <div v-if="technician.bio" class="profile-bio">
            <b>{{ $t('about') }}:</b>
            <p>{{ technician.bio }}</p>
          </div>
        </div>
      </div>
      
      <!-- About Technician Section -->
      <div class="about-section">
        <h3>{{ $t('aboutTechnician') }}</h3>
        <div class="about-content">
          <div class="about-item">
            <i class="fas fa-check-circle"></i>
            <span>{{ $t('verifiedTechnician') }}</span>
          </div>
          <div class="about-item">
            <div class="about-stars">
              <i 
                v-for="n in 5" 
                :key="n" 
                class="fa-solid fa-star"
                :class="{
                  'filled': n <= averageRating,
                  'empty': n > averageRating
                }"
              ></i>
            </div>
            <span>{{ $t('professionalService') }} ({{ averageRating.toFixed(1) }})</span>
          </div>
          <div class="about-item">
            <i class="fas fa-shield-alt"></i>
            <span>{{ $t('qualityGuarantee') }} ({{ positiveReviewPercentage }}% {{ $t('positive') }})</span>
          </div>
          <div class="about-item">
            <i class="fas fa-heart"></i>
            <span>{{ $t('customerSatisfaction') }} ({{ reviews.length }} {{ $t('reviews') }})</span>
          </div>
        </div>
        <div class="action-buttons">
          <button @click="bookNow" class="book-now-btn">{{ $t('bookNow') }}</button>
          <button @click="viewAllServices" class="view-services-btn">{{ $t('viewAllServices') }}</button>
        </div>
      </div>
      
      <!-- Reviews Section -->
      <div class="reviews-section">
        <div class="reviews-header">
          <h2 class="reviews-title">{{ $t('reviews') }}</h2>
          <div v-if="!showReviewForm" class="review-actions">
            <button 
              v-if="canReview" 
              @click="showReviewForm = true" 
              class="add-review-btn"
            >
              {{ $t('addReview') }}
            </button>
            <div v-else-if="!auth.currentUser" class="review-notice">
              {{ $t('loginToReview') }}
            </div>
            <div v-else-if="reviews.find(r => r.userEmail === auth.currentUser?.email)" class="review-notice">
              {{ $t('thankYouForReview') }}
            </div>
            <div v-else class="review-notice">
              {{ $t('bookingRequiredToReview') }}
            </div>
          </div>
        </div>

        <!-- Review Submission Form -->
        <div v-if="showReviewForm" class="review-form">
          <h3>{{ $t('writeReview') }}</h3>
          <div class="star-rating-input">
            <label>{{ $t('rating') }}:</label>
            <div class="stars">
              <button 
                v-for="n in 5" 
                :key="n" 
                class="star-button"
                :class="{ 
                  'filled': n <= (hoverRating || newReview.rating), 
                  'empty': n > (hoverRating || newReview.rating) 
                }"
                @click="setRating(n)"
                @mouseenter="hoverRating = n"
                @mouseleave="hoverRating = 0"
              >
                <i class="fa-solid fa-star"></i>
              </button>
            </div>
            <span class="rating-text">{{ newReview.rating }}/5</span>
            <button @click="testReactive" style="margin-left: 10px; padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 4px;">
              Test Reactive
            </button>
          </div>
          <div class="form-group">
            <label>{{ $t('review') }}:</label>
            <textarea 
              v-model="newReview.text" 
              :placeholder="$t('writeYourReview')"
              rows="4"
              maxlength="500"
            ></textarea>
            <div class="char-count">{{ newReview.text.length }}/500</div>
          </div>
          <div class="form-actions">
            <div class="validation-status">
              <div v-if="newReview.rating === 0" class="validation-error">
                <i class="fa-solid fa-exclamation-circle"></i>
                Please select a rating
              </div>
              <div v-else-if="newReview.text.trim().length < 10" class="validation-error">
                <i class="fa-solid fa-exclamation-circle"></i>
                Review must be at least 10 characters ({{ newReview.text.trim().length }}/10)
              </div>
              <div v-else class="validation-success">
                <i class="fa-solid fa-check-circle"></i>
                Ready to submit!
              </div>
            </div>
            <button @click="submitReview" :disabled="!isValidReview || submittingReview" class="submit-btn">
              {{ submittingReview ? $t('submitting') : $t('submitReview') }}
            </button>
            <button @click="cancelReview" class="cancel-btn">
              {{ $t('cancel') }}
            </button>
          </div>
        </div>

        <!-- Reviews List -->
        <div class="reviews-list">
          <div v-if="reviewsLoading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>{{ $t('loadingReviews') }}</p>
          </div>
          <div v-else-if="reviewsError" class="error-state">
            <p class="error-message">{{ reviewsError }}</p>
            <button @click="fetchReviews" class="retry-btn">{{ $t('retry') }}</button>
          </div>
          <div v-else-if="reviews.length > 0" class="reviews-container">
            <h3 class="reviews-subtitle">{{ reviews.length }} {{ reviews.length === 1 ? $t('review') : $t('reviews') }}</h3>
            <div v-for="review in reviews" :key="review.id" class="review-card">
              <div class="review-header">
                <div class="review-rating">
                  <i 
                    v-for="n in 5" 
                    :key="n" 
                    class="fa-solid fa-star"
                    :class="{ 'filled': n <= review.rating, 'empty': n > review.rating }"
                  ></i>
                  <span class="rating-text">{{ review.rating }} {{ review.rating === 1 ? $t('star') : $t('stars') }}</span>
                </div>
                <div class="review-meta">
                  <span class="review-author">{{ review.userName || review.userEmail }}</span>
                  <span class="review-date">{{ formatDate(review.createdAt) }}</span>
                </div>
              </div>
              <div class="review-text">{{ review.text }}</div>
            </div>
          </div>
          <div v-else class="empty-reviews">
            <div class="empty-icon">⭐</div>
            <p>{{ $t('noReviewsYet') }}</p>
            <p v-if="canReview">{{ $t('beFirstToReview') }}</p>
            <p v-else>{{ $t('loginToLeaveReview') }}</p>
          </div>
        </div>
      </div>

      <div class="profile-booking">
        <div class="booking-container">
          <div class="title-search-row">
            <h2 class="booking-title">{{ $t('pendingBookings') }}</h2>
            <div class="search-wrapper">
              <input v-model="searchQuery" class="search-input" type="text" :placeholder="$t('search')" />
              <span class="search-icon"><i class="fas fa-search"></i></span>
            </div>
          </div>
          <div v-if="bookingsLoading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>{{ $t('loadingBookings') }}</p>
          </div>
          <div v-else-if="bookingsError" class="error-state">
            <button @click="fetchBookings" class="retry-btn">{{ $t('retry') }}</button>
          </div>
          <div v-else-if="filteredBookings.length > 0" class="table-wrapper">
            <table class="booking-table">
              <thead>
                <tr class="table-header">
                  <th>{{ $t('userName') }}</th>
                  <th>{{ $t('userEmail') }}</th>
                  <th>{{ $t('technician') }}</th>
                  <th>{{ $t('specialization') }}</th>
                  <th>{{ $t('date') }}</th>
                  <th>{{ $t('time') }}</th>
                  <th>{{ $t('address') }}</th>
                  <th>{{ $t('price') }}</th>
                  <th>{{ $t('status') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(booking, index) in filteredBookings" :key="booking.id" class="table-row">
                  <td>{{ booking.userName }}</td>
                  <td>{{ booking.userEmail }}</td>
                  <td>{{ booking.technicianName || booking.technicianId }}</td>
                  <td>{{ booking.specialization }}</td>
                  <td>{{ booking.date }}</td>
                  <td>{{ booking.time }}</td>
                  <td>{{ booking.address }}</td>
                  <td>{{ booking.price }}</td>
                  <td><span class="status-pending">{{ booking.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="empty-state">
            <p>{{ $t('noPendingBookingsFound') }}</p>
          </div>
        </div>
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
import { useI18n } from 'vue-i18n'
import { doc, getDoc, collection, getDocs, query, where, addDoc, orderBy } from 'firebase/firestore'
import { db, auth } from '../firebase'
import { stockTechnicians } from '../assets/stockTechnicians'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const technician = ref(null)
const loading = ref(true)
const error = ref('')

const searchQuery = ref('')
const bookings = ref([])
const bookingsLoading = ref(true)
const bookingsError = ref(null)

// Reviews state
const reviews = ref([])
const reviewsLoading = ref(true)
const reviewsError = ref(null)
const showReviewForm = ref(false)
const hoverRating = ref(0)
const newReview = ref({
  rating: 0,
  text: ''
})

const submittingReview = ref(false)

const filteredBookings = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return bookings.value.filter(b =>
    Object.values(b).some(val => String(val).toLowerCase().includes(q))
  );
})

const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0;
  const total = reviews.value.reduce((sum, review) => sum + review.rating, 0);
  const average = total / reviews.value.length;
  console.log('Average rating calculation:', {
    totalReviews: reviews.value.length,
    totalRating: total,
    average: average,
    reviews: reviews.value.map(r => ({ rating: r.rating, user: r.userName }))
  });
  return average;
})

const positiveReviewPercentage = computed(() => {
  if (reviews.value.length === 0) return 0;
  const positiveReviews = reviews.value.filter(review => review.rating >= 4);
  return (positiveReviews.length / reviews.value.length) * 100;
});

const isValidReview = computed(() => {
  return newReview.value.rating > 0 && newReview.value.text.trim().length >= 10;
})

const canReview = computed(() => {
  if (!auth.currentUser) return false;
  
  // Check if user has already reviewed this technician
  const existingReview = reviews.value.find(review => 
    review.userEmail === auth.currentUser.email
  );
  
  // User can review if they haven't already reviewed this technician (no booking requirement)
  return !existingReview;
})

onMounted(async () => {
  const id = route.params.id
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
          image: data.idPhotoUrl || 'https://randomuser.me/api/portraits/men/32.jpg'
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
  await Promise.all([fetchBookings(), fetchReviews()])
})

async function fetchBookings() {
  try {
    bookingsLoading.value = true
    bookingsError.value = null
    const id = route.params.id
    const q = query(collection(db, 'bookings'), where('technicianId', '==', id))
    const snapshot = await getDocs(q)
    bookings.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (e) {
    bookingsError.value = 'Failed to fetch bookings'
  } finally {
    bookingsLoading.value = false
  }
}

async function fetchReviews() {
  try {
    reviewsLoading.value = true
    reviewsError.value = null
    const technicianId = route.params.id
    console.log('Fetching reviews for technician:', technicianId);
    
    // Try the indexed query first
    try {
      const q = query(
        collection(db, 'reviews'), 
        where('technicianId', '==', technicianId),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      console.log('Reviews snapshot (indexed):', snapshot.docs.length, 'reviews found');
      reviews.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (indexError) {
      console.log('Index not ready, using fallback query:', indexError.message);
      
      // Fallback: Simple query without orderBy, sort in JavaScript
      const q = query(
        collection(db, 'reviews'), 
        where('technicianId', '==', technicianId)
      )
      const snapshot = await getDocs(q)
      console.log('Reviews snapshot (fallback):', snapshot.docs.length, 'reviews found');
      
      // Sort reviews in JavaScript
      reviews.value = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return dateB - dateA; // Sort by newest first
        });
    }
    
    console.log('Reviews loaded:', reviews.value);
  } catch (e) {
    console.error('Error fetching reviews:', e);
    reviewsError.value = t('retry')
  } finally {
    reviewsLoading.value = false
  }
}

async function submitReview() {
  if (!auth.currentUser) {
    alert(t('loginRequired'))
    return
  }

  if (!isValidReview.value) {
    if (newReview.value.rating === 0) {
      alert(t('pleaseSelectRating'))
    } else if (newReview.value.text.trim().length < 10) {
      alert(t('reviewTooShort'))
    }
    return
  }

  try {
    submittingReview.value = true
    
    const reviewData = {
      technicianId: route.params.id,
      userId: auth.currentUser.uid,
      userEmail: auth.currentUser.email,
      userName: auth.currentUser.displayName || auth.currentUser.email,
      rating: newReview.value.rating,
      text: newReview.value.text.trim(),
      createdAt: new Date(),
      technicianName: technician.value?.name || technician.value?.fullName || 'Unknown'
    }

    await addDoc(collection(db, 'reviews'), reviewData)
    
    // Reset form
    newReview.value = { rating: 0, text: '' }
    showReviewForm.value = false
    hoverRating.value = 0
    
    // Refresh reviews
    await fetchReviews()
    
    alert(t('reviewSubmitted'))
  } catch (error) {
    console.error('Error submitting review:', error)
    alert(t('reviewSubmissionFailed'))
  } finally {
    submittingReview.value = false
  }
}

function setRating(rating) {
  console.log('Setting rating to:', rating);
  newReview.value.rating = rating;
  hoverRating.value = 0; // Reset hover state
  console.log('New review state:', newReview.value);
  console.log('Is valid review:', isValidReview.value);
}

function testReactive() {
  console.log('Testing reactive system...');
  newReview.value.rating = Math.floor(Math.random() * 5) + 1;
  alert(`Rating set to: ${newReview.value.rating}`);
  console.log('New review state:', newReview.value);
}

function cancelReview() {
  newReview.value = { rating: 0, text: '' }
  showReviewForm.value = false
  hoverRating.value = 0
}

function formatDate(date) {
  if (!date) return ''
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString()
}

function bookNow() {
  const technicianId = route.params.id
  router.push({
    path: '/bookingpage',
    query: { techId: technicianId }
  })
}

function viewAllServices() {
  router.push('/allservices')
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
/* Profile Styles */
.profile-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
}

.profile-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
}

.profile-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-card {
  display: flex;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
}

.profile-img {
  width: 200px;
  height: 200px;
  object-fit: cover;
}

.profile-info {
  padding: 2rem;
  flex: 1;
}

.profile-name {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.profile-role {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.profile-meta {
  margin-bottom: 1rem;
}

.profile-meta div {
  margin-bottom: 0.5rem;
}

.profile-rating {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.rating-stars {
  display: flex;
  gap: 0.2rem;
}

.rating-stars .fa-solid {
  font-size: 1.2rem;
}

.rating-stars .fa-star.filled {
  color: #FFC230 !important;
}

.rating-stars .fa-star.empty {
  color: #ddd !important;
}

.rating-text {
  color: #666;
  font-size: 0.9rem;
}

.no-rating {
  color: #999;
  font-size: 0.9rem;
  font-style: italic;
  margin-top: 0.5rem;
}

.profile-skills {
  margin-top: 1rem;
}

.profile-skills ul {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0 0;
}

.profile-skills li {
  background: #f0f0f0;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  display: inline-block;
  margin: 0.2rem;
  font-size: 0.9rem;
}

.no-skills {
  color: #6b7280;
  font-style: italic;
  margin: 0.5rem 0;
}

.profile-bio {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border-left: 4px solid #7c6bb0;
}

.profile-bio b {
  color: #7c6bb0;
  font-weight: 600;
  display: block;
  margin-bottom: 0.5rem;
}

.profile-bio p {
  color: #374151;
  line-height: 1.6;
  margin: 0;
}

/* About Section Styles */
.about-section {
  background: #fff;
  border-radius: 0.75rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.about-section h3 {
  color: #7c6bb0;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.about-content {
  display: flex;
  flex-wrap: nowrap;
  gap: 1rem;
  margin-bottom: 2rem;
  overflow-x: auto;
}

.about-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border-left: 4px solid #7c6bb0;
  min-width: 200px;
  flex-shrink: 0;
}

.about-item i {
  color: #7c6bb0;
  font-size: 1.2rem;
}

.about-item span {
  font-weight: 500;
  color: #374151;
}

.about-stars {
  display: flex;
  gap: 0.2rem;
}

.about-stars .fa-solid {
  font-size: 1.2rem;
}

.about-stars .fa-star.filled {
  color: #FFC230;
}

.about-stars .fa-star.empty {
  color: #ddd;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.book-now-btn {
  background: #7c6bb0;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.book-now-btn:hover {
  background: #6b5fa7;
}

.view-services-btn {
  background: transparent;
  color: #7c6bb0;
  border: 2px solid #7c6bb0;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.view-services-btn:hover {
  background: #7c6bb0;
  color: white;
}

/* Reviews Section */
.reviews-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.reviews-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.reviews-subtitle {
  font-size: 1.1rem;
  font-weight: 500;
  color: #6b7280;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.reviews-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-card {
  background: #f9fafb;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.2s ease;
}

.review-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.review-rating .fa-star {
  font-size: 0.875rem;
}

.review-rating .fa-star.filled {
  color: #fbbf24;
}

.review-rating .fa-star.empty {
  color: #d1d5db;
}

.rating-text {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  margin-left: 0.5rem;
}

.review-meta {
  text-align: right;
}

.review-author {
  display: block;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.review-date {
  display: block;
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.review-text {
  color: #374151;
  line-height: 1.6;
  font-size: 0.875rem;
}

.empty-reviews {
  text-align: center;
  padding: 3rem 2rem;
  color: #6b7280;
}

.empty-reviews p {
  margin: 0.5rem 0;
}

.empty-reviews p:first-of-type {
  font-weight: 500;
  font-size: 1rem;
  color: #374151;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

/* Loading and Error States */
.loading-state {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.loading-spinner {
  border: 2px solid #e5e7eb;
  border-top: 2px solid #7c6bb0;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  text-align: center;
  padding: 2rem;
}

.error-message {
  color: #dc2626;
  margin-bottom: 1rem;
}

.retry-btn {
  background: #7c6bb0;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-btn:hover {
  background: #6b5a9f;
}

/* --- Copied from admin-dashboard/Booking-pending.vue --- */
.admin-dashboard-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
  background: #faf8fd;
}

.booking-container {
  max-width: 80rem;
  margin: 0 auto;
}

.title-search-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.booking-title {
  font-size: 2rem;
  font-weight: bold;
  color: #7c6bb0;
  margin-bottom: 0;
}

.search-wrapper {
  display: flex;
  align-items: center;
  width: 411px;
  height: 50px;
  padding: 10px;
  gap: 8px;
  flex-shrink: 0;
  margin-bottom: 16px;
  position: relative;
}

.search-input {
  width: 100%;
  height: 100%;
  border-radius: 48px;
  border: 1px solid var(--border-border-primary, #C2C3C4);
  background: var(--grey-50, #EAEAEA);
  font-size: 1rem;
  color: #6B5FA7;
  outline: none;
  padding: 0 16px 0 40px;
  transition: border 0.2s;
}

.search-input:focus {
  border: 1.5px solid #6B5FA7;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #b6a7e6;
  font-size: 1.1rem;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  color: #666;
  font-size: 1.1rem;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.booking-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 0.75rem;
}

.table-header {
  background: rgba(124, 107, 176, 0.2);
  color: #333;
}

.table-header th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
}

.table-row {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s;
}

.table-row:hover {
  background: #ede7f6;
}

.table-row td {
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  color: #333;
}

.status-pending {
  background: #fef3c7;
  color: #92400e;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.add-review-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.add-review-btn:hover {
  background: #5a6fd8;
}

.review-actions {
  display: flex;
  align-items: center;
}

.review-notice {
  color: #666;
  font-size: 0.9rem;
  font-style: italic;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #667eea;
}

/* Review Form */
.review-form {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.review-form h3 {
  margin: 0 0 1rem 0;
  color: #333;
}

.star-rating-input {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.star-rating-input label {
  font-weight: 600;
  color: #333;
}

.stars {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}

.star-button {
  background: transparent;
  border: none;
  padding: 0.25rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.5rem;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  min-height: 2rem;
}

.star-button:hover {
  transform: scale(1.1);
  background-color: rgba(255, 194, 48, 0.1);
}

.star-button.filled {
  color: #FFC230;
}

.star-button.empty {
  color: #d1d5db;
}

.star-button.filled:hover {
  color: #FFB800;
}

.star-button.empty:hover {
  color: #FFC230;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
}

.char-count {
  text-align: right;
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
}

.validation-status {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.validation-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #dc3545;
  font-size: 0.85rem;
  font-weight: 500;
}

.validation-error i {
  font-size: 0.9rem;
}

.validation-success {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #28a745;
  font-size: 0.85rem;
  font-weight: 500;
}

.validation-success i {
  font-size: 0.9rem;
}

.submit-btn, .cancel-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.submit-btn {
  background: #28a745;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background: #218838;
}

.submit-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.cancel-btn {
  background: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background: #5a6268;
}

@media (max-width: 768px) {
  .profile-main {
    padding: 1rem;
  }
  
  .profile-card {
    flex-direction: column;
  }
  
  .profile-img {
    width: 100%;
    height: 200px;
  }
  
  .reviews-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .star-rating-input {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .review-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .booking-main {
    padding: 1rem;
  }
  
  .title-search-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .search-wrapper {
    width: 100%;
    max-width: none;
  }
  
  .table-wrapper {
    font-size: 0.8rem;
  }
  
  .about-content {
    gap: 0.5rem;
  }
  
  .about-item {
    min-width: 150px;
    padding: 0.75rem;
    font-size: 0.9rem;
  }
  
  .table-header th,
  .table-row td {
    padding: 0.5rem 0.5rem;
  }
}
</style> 