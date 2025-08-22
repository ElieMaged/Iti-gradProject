<template>
  <div v-if="loading" class="loading-container">
    <div class="loading-spinner"></div>
    <p>{{ $t('loading') }}</p>
  </div>
  <div v-else-if="error" class="error-container">
    <p class="error-message">{{ error }}</p>
  </div>
  <div v-else-if="technician" class="technician-profile-page">
    <!-- Main content area -->
    <div class="main-content">
      <!-- Page title -->
      <div class="page-title">
        <h1>{{ $t('bookNowWithBestTechnicians') }}</h1>
      </div>
      <!-- Main content grid -->
      <div class="content-grid">
        <!-- Left section - Technician Info Card -->
        <div class="technician-info-card">
          <div class="profile-section">
            <div class="profile-picture">
              <img :src="technician.profilePhotoUrl || '/images/Avatar.png'" :alt="technician.name" />
            </div>
            <div class="profile-details">
              <h2 class="technician-name">{{ technician.name || technician.fullName }}</h2>
              <p class="technician-specialization">{{ getSpecializationTranslation(technician.specialization) }}</p>
              <div class="technician-details">
                <div class="detail-item">
                  <span class="detail-label">{{ $t('location') }}:</span>
                  <span class="detail-value">{{ technician.government && technician.district ? `${technician.government}, ${technician.district}` : (technician.location || $t('defaultLocation')) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">{{ $t('gender') }}:</span>
                  <span class="detail-value">{{ technician.gender || $t('defaultGender') }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">{{ $t('nationality') }}:</span>
                  <span class="detail-value">{{ technician.nationality || $t('defaultNationality') }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">{{ $t('yearsOfExperience') }}:</span>
                  <span class="detail-value">{{ technician.experience || technician.yearsOfExperience || $t('defaultExperience') }} {{ $t('years') }}</span>
                </div>
              </div>
              <div class="rating-section">
                <div class="rating-stars">
                  <i 
                    v-for="n in 5" 
                    :key="n" 
                    class="fas fa-star"
                    :class="{ 'star-filled': n <= Math.round(averageRating), 'star-empty': n > Math.round(averageRating) }"
                  ></i>
                </div>
              </div>
            </div>
          </div>
          <!-- Bio Section -->
          <div class="bio-section" v-if="technician.bio">
            <h3 class="bio-title">{{ $t('aboutTechnician') }}</h3>
            <p class="bio-content">{{ technician.bio }}</p>
          </div>
        </div> <!-- close .technician-info-card -->
        <!-- Right section - Booking Information -->
        <div class="booking-info-card">
          <h3 class="booking-title">{{ $t('bookingInformation') }}</h3>
          <div class="appointment-section">
            <h4 class="section-subtitle">{{ $t('availableAppointment') }}</h4>
            <div class="date-selector">
              <button class="date-nav-btn" @click="previousDates">
                <i class="fas fa-chevron-left"></i>
              </button>
              <div class="date-options">
                <div v-if="visibleDates.length > 0" v-for="date in visibleDates" :key="date" class="date-option" :class="{ 'selected': selectedDate === date }" @click="selectDate(date)">
                  {{ date }}
                </div>
                <div v-else-if="!loading && availableDates.length === 0" class="date-option unavailable">
                  {{ $t('noAvailableDates') }}
                </div>
                <div v-else class="date-option loading">
                  {{ $t('loadingDates') }}
                </div>
              </div>
              <button class="date-nav-btn" @click="nextDates">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
            <div class="time-slots">
              <div v-if="loading || !technicianAvailability" class="time-slot loading">
                {{ $t('loadingAvailability') }}
              </div>
              <div v-else-if="selectedDate && availableTimeSlots.length > 0" v-for="timeSlot in availableTimeSlots" :key="timeSlot" class="time-slot">
                {{ timeSlot }}
              </div>
              <div v-else-if="selectedDate && availableTimeSlots.length === 0" class="time-slot unavailable">
                {{ $t('noAvailableTimeSlots') }}
              </div>
              <div v-else-if="availableDates.length === 0" class="time-slot unavailable">
                {{ $t('technicianNotSetAvailability') }}
              </div>
              <div v-else class="time-slot">
                {{ $t('selectDateToSeeSlots') }}
              </div>
            </div>
          </div>
          <div class="visit-price">
            <span class="price-label">{{ $t('visitPrice') }}:</span>
            <span class="price-value">{{ technician.basePrice || technician.visitPrice || '300' }} EGP</span>
          </div>
          <button 
            @click="bookNow" 
            class="book-now-btn"
            :class="{ 'disabled': !auth.currentUser }"
            :disabled="!auth.currentUser"
          >
            {{ auth.currentUser ? $t('bookNow') : $t('loginToBook') || 'Login to Book' }}
          </button>
        </div> <!-- close .booking-info-card -->
      </div> <!-- close .content-grid -->
      <!-- Reviews Section -->
      <hr class="reviews-divider" />
      <div class="reviews-section">
        <div class="reviews-header">
          <h2 class="reviews-title">{{ $t('reviews') }}</h2>
          <div v-if="!showReviewForm">
            <button 
              v-if="hasBookingWithTechnician && canReview" 
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
            <div v-else-if="hasBookingWithTechnician && !canReview" class="review-notice">
              {{ $t('bookingRequiredToReview') }}
            </div>
          </div>
        </div>
        <!-- Review Submission Form -->
        <div v-if="showReviewForm && hasBookingWithTechnician && canReview" class="review-form">
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
                 {{ $t('pleaseSelectRating') }}
              </div>
              <div v-else-if="newReview.text.trim().length < 10" class="validation-error">
                <i class="fa-solid fa-exclamation-circle"></i>
                 {{ $t('reviewMustBeAtLeast') }} {{ newReview.text.trim().length }}/{{ $t('reviewMustBeAtLeastCharacters') }}
              </div>
              <div v-else class="validation-success">
                <i class="fa-solid fa-check-circle"></i>
                 {{ $t('readyToSubmit') }}
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
            <p v-if="hasBookingWithTechnician && canReview">{{ $t('beFirstToReview') }}</p>
            <p v-else-if="!auth.currentUser">{{ $t('loginToLeaveReview') }}</p>
            <p v-else-if="!hasBookingWithTechnician">{{ $t('bookingRequiredToReview') }}</p>
          </div>
        </div>
      </div> <!-- close .reviews-section -->
    </div> <!-- close .main-content -->
  </div> <!-- close .technician-profile-page -->
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { doc, getDoc, collection, query, where, getDocs, orderBy, addDoc } from 'firebase/firestore'
import { db, auth } from '../firebase.js'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

// Reactive data
const technician = ref(null)
const loading = ref(true)
const error = ref(null)
const reviews = ref([])
const reviewsLoading = ref(false)
const reviewsError = ref(null)
const userBookings = ref([])
const userBookingsLoading = ref(false)
const selectedDate = ref('')
const technicianAvailability = ref(null)
const availableDates = ref([])
const visibleDates = ref([])
const dateAvailability = ref({})
const availableTimeSlots = ref([])

// Review form state
const showReviewForm = ref(false)
const hoverRating = ref(0)
const newReview = ref({
  rating: 0,
  text: ''
})
const submittingReview = ref(false)

// Fetch technician data
const fetchTechnician = async () => {
  try {
    loading.value = true
    const technicianId = route.params.id
    
    console.log('Fetching technician with ID:', technicianId)
    
    // Try to get technician from technicians collection
    const technicianDoc = await getDoc(doc(db, 'technicians', technicianId))
    
    if (technicianDoc.exists()) {
      console.log('Found technician in technicians collection:', technicianDoc.data())
      technician.value = {
        id: technicianDoc.id,
        ...technicianDoc.data()
      }
  } else {
      console.log('Technician not found in technicians collection, checking users collection...')
      // If not found in technicians, try users collection
      const userDoc = await getDoc(doc(db, 'users', technicianId))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        console.log('Found user in users collection:', userData)
        if (userData.role === 'technician') {
        technician.value = {
            id: userDoc.id,
            ...userData
        }
      } else {
          throw new Error('User is not a technician')
        }
      } else {
        console.log('Technician not found in either collection')
        throw new Error('Technician not found')
      }
    }
  } catch (err) {
    console.error('Error fetching technician:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Fetch reviews
const fetchReviews = async () => {
  try {
    reviewsLoading.value = true
    const technicianId = route.params.id
    
    const reviewsQuery = query(
        collection(db, 'reviews'), 
        where('technicianId', '==', technicianId),
        orderBy('createdAt', 'desc')
      )
    
    const reviewsSnapshot = await getDocs(reviewsQuery)
    reviews.value = reviewsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (err) {
    console.error('Error fetching reviews:', err)
    reviewsError.value = err.message
  } finally {
    reviewsLoading.value = false
  }
}

// Fetch user bookings for review eligibility
const fetchUserBookings = async () => {
  if (!auth.currentUser) return
  
  try {
    userBookingsLoading.value = true
    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('userId', '==', auth.currentUser.uid)
    )
    
    const bookingsSnapshot = await getDocs(bookingsQuery)
    userBookings.value = bookingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (err) {
    console.error('Error fetching user bookings:', err)
  } finally {
    userBookingsLoading.value = false
  }
}

// Fetch technician availability
const fetchTechnicianAvailability = async (technicianId) => {
  try {
    const availabilityRef = doc(db, 'technicianAvailability', technicianId)
    const availabilitySnap = await getDoc(availabilityRef)
    
    if (availabilitySnap.exists()) {
      const data = availabilitySnap.data()
      technicianAvailability.value = data
      return data
    }
    technicianAvailability.value = null
    return null
  } catch (error) {
    console.error('Error fetching technician availability:', error)
    technicianAvailability.value = null
    return null
  }
}

// Generate available dates for the next 30 days
const generateAvailableDates = () => {
  const dates = []
  const today = new Date()
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    
    // Check if technician is available on this day
    if (technicianAvailability.value && 
        technicianAvailability.value[dayName] && 
        technicianAvailability.value[dayName].available) {
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
      })
      dates.push(formattedDate)
    }
  }
  
  return dates
}

// Update visible dates (show first 3 available dates)
const updateVisibleDates = () => {
  availableDates.value = generateAvailableDates()
  visibleDates.value = availableDates.value.slice(0, 3)
  
  // Set first available date as selected if none selected
  if (visibleDates.value.length > 0 && !selectedDate.value) {
    selectedDate.value = visibleDates.value[0]
  }
}

// Get day name from date string
const getDayName = (dateString) => {
  const [month, day, year] = dateString.split('/')
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
}

// Generate time slots between start and end time
const generateTimeSlots = (startTime, endTime) => {
  const slots = []
  const start = new Date(`2000-01-01 ${startTime}`)
  const end = new Date(`2000-01-01 ${endTime}`)
  
  while (start < end) {
    slots.push(start.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }))
    start.setMinutes(start.getMinutes() + 60) // 1-hour slots
  }
  
  return slots
}

// Fetch existing bookings for a technician on a specific date
const fetchExistingBookings = async (technicianId, selectedDate) => {
  try {
    // Convert date format from MM/DD/YYYY to YYYY-MM-DD for Firestore query
    const [month, day, year] = selectedDate.split('/')
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    
    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('technicianId', '==', technicianId),
      where('date', '==', formattedDate),
      where('status', 'in', ['pending', 'upcoming', 'completed'])
    )
    
    const snapshot = await getDocs(bookingsQuery)
    const existingBookings = []
    
    snapshot.forEach(doc => {
      const booking = doc.data()
      existingBookings.push({
        id: doc.id,
        time: booking.time,
        status: booking.status
      })
    })
    
    return existingBookings
  } catch (error) {
    console.error('Error fetching existing bookings:', error)
    return []
  }
}

// Get available time slots for selected date
const getAvailableTimeSlots = async (date) => {
  if (!technicianAvailability.value || !date) return []
  
  const dayName = getDayName(date)
  const dayAvailability = technicianAvailability.value[dayName]
  
  if (dayAvailability && dayAvailability.available) {
    const allTimeSlots = generateTimeSlots(dayAvailability.startTime, dayAvailability.endTime)
    const existingBookings = await fetchExistingBookings(route.params.id, date)
    
    return allTimeSlots.filter(timeSlot => {
      return !existingBookings.some(booking => booking.time === timeSlot)
    })
  }
  
  return []
}

// Computed properties
const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0
  const totalRating = reviews.value.reduce((sum, review) => sum + review.rating, 0)
  return totalRating / reviews.value.length
})

const positiveReviewPercentage = computed(() => {
  if (reviews.value.length === 0) return 100
  const positiveReviews = reviews.value.filter(review => review.rating >= 4).length
  return Math.round((positiveReviews / reviews.value.length) * 100)
})

const canReview = computed(() => {
  if (!auth.currentUser) return false
  
  // Check if user has already reviewed this technician
  const existingReview = reviews.value.find(review => 
    review.userEmail === auth.currentUser.email
  )
  
  // Check if user has a booking with this technician
  const hasBooking = userBookings.value.some(booking => {
    return booking.technicianId === route.params.id &&
      (booking.status === 'completed' || booking.status === 'complete')
  })
  
  // User can review if they haven't already reviewed AND they have a completed booking with this technician
  return !existingReview && hasBooking
})

const isValidReview = computed(() => {
  return newReview.value.rating > 0 && newReview.value.text.trim().length >= 10
})

const hasBookingWithTechnician = computed(() => {
  if (!auth.currentUser) return false
  
  // Check if user has any booking with this technician
  return userBookings.value.some(booking =>
    booking.technicianId === route.params.id &&
    (booking.status === 'completed' || booking.status === 'complete')
  )
})

// Methods
const getSpecializationTranslation = (specialization) => {
  const translations = {
    'plumbing': t('plumbing'),
    'electricity': t('electricity'),
    'airCondition': t('airCondition'),
    'carpentry': t('carpentry'),
    'wallFinishing': t('wallFinishing'),
    'acTechnician': t('acTechnician')
  }
  return translations[specialization] || specialization || 'Plumber'
}

const selectDate = async (date) => {
  selectedDate.value = date
  if (date) {
    availableTimeSlots.value = await getAvailableTimeSlots(date)
  } else {
    availableTimeSlots.value = []
  }
}

const previousDates = () => {
  const currentIndex = availableDates.value.indexOf(visibleDates.value[0])
  if (currentIndex > 0) {
    const startIndex = Math.max(0, currentIndex - 3)
    visibleDates.value = availableDates.value.slice(startIndex, startIndex + 3)
  }
}

const nextDates = () => {
  const currentIndex = availableDates.value.indexOf(visibleDates.value[0])
  if (currentIndex + 3 < availableDates.value.length) {
    const startIndex = currentIndex + 3
    visibleDates.value = availableDates.value.slice(startIndex, startIndex + 3)
  }
}

const bookNow = () => {
  // Check if user is logged in
  if (!auth.currentUser) {
    // Redirect to login page with return URL
    router.push({
      path: '/userlogin',
      query: { 
        returnUrl: route.fullPath,
        message: 'Please log in to book a technician'
      }
    })
    return
  }
  
  // User is logged in, proceed to booking page
  router.push({
    path: '/bookingpage',
    query: { 
      technicianId: route.params.id,
      technicianName: technician.value?.name || technician.value?.fullName
    }
  })
}

// Review functions
const setRating = (rating) => {
  newReview.value.rating = rating
}

const submitReview = () => {
  if (!isValidReview.value || submittingReview.value) return
  
  submittingReview.value = true
  
  const reviewData = {
    technicianId: route.params.id,
    rating: newReview.value.rating,
    text: newReview.value.text.trim(),
    userName: auth.currentUser?.displayName || auth.currentUser?.email,
    userEmail: auth.currentUser?.email,
    createdAt: new Date()
  }
  
  addDoc(collection(db, 'reviews'), reviewData)
    .then(() => {
      // Reset form
      newReview.value = { rating: 0, text: '' }
      showReviewForm.value = false
      submittingReview.value = false
      
      // Refresh reviews and user bookings
      Promise.all([fetchReviews(), fetchUserBookings()])
    })
    .catch(error => {
      console.error('Error submitting review:', error)
      submittingReview.value = false
    })
}

const cancelReview = () => {
  newReview.value = { rating: 0, text: '' }
  showReviewForm.value = false
}

const formatDate = (date) => {
  if (!date) return ''
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString()
}

// Lifecycle
onMounted(async () => {
  await fetchTechnician()
  await fetchReviews()
  await fetchUserBookings()
  await fetchTechnicianAvailability(route.params.id)
  updateVisibleDates()
  
  // Set initial selected date and fetch time slots
  if (visibleDates.value.length > 0) {
    await selectDate(visibleDates.value[0])
  }
})
</script>

<style scoped>
/* Loading and Error States */
.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #ef4444;
  font-size: 1.1rem;
}

/* Header Contact Bar */
.header-contact-bar {
  background: linear-gradient(135deg, #f59e0b, #f97316);
  color: white;
  padding: 0.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.contact-info {
  display: flex;
  gap: 2rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.social-media {
  display: flex;
  gap: 1rem;
}

.social-icon {
  color: white;
  font-size: 1.1rem;
  transition: opacity 0.2s;
}

.social-icon:hover {
  opacity: 0.8;
}

/* Main Navigation */
.main-nav {
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem 2rem;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #625397;
}

.nav-actions {
  display: flex;
  gap: 1rem;
}

.nav-icon {
  color: #6b7280;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.2s;
}

.nav-icon:hover {
  color: #625397;
}

/* Main Content */
.main-content {
  max-width: auto;

  padding: 0rem;
}



.page-title {
  text-align: left;
  margin-bottom: 3rem;
}

.page-title h1 {
  font-size: 2.2rem;
  font-weight: bold;
  color: #625397;
  margin: 0;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 2.5fr 2fr;
  gap: 3.5rem;
  margin-bottom: 3rem;
}

/* Technician Info Card */
.technician-info-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  padding: 2rem;
}

.profile-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.profile-picture {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.profile-picture img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-details {
  flex: 1;
}

.technician-name {
  font-size: 1.8rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.technician-specialization {
  font-size: 1.1rem;
  color: #6b7280;
  margin: 0;
}

.technician-details {
  margin: 1.5rem 0;
}

.detail-item {
  display: flex;
  justify-content: flex-start;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #374151;
}

.detail-value {
  color: #6b7280;
}

.rating-section {
  margin-top: 1rem;
}

.rating-stars {
  display: flex;
  gap: 0.25rem;
}

.star-filled {
  color: #fbbf24;
  font-size: 1.2rem;
}

.star-empty {
  color: #d1d5db;
  font-size: 1.2rem;
}

/* Ensure rating stars respect filled/empty, overriding any global star color */
.rating-stars .fa-star.star-empty { color: #d1d5db !important; }
.rating-stars .fa-star.star-filled { color: #fbbf24 !important; }

.bio-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
  margin-top: 1rem;
}

.bio-title {
  font-size: 1rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 1rem 0;
}

.bio-content {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

/* Booking Info Card */
.booking-info-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  padding: 2rem;
  height: fit-content;
}

.booking-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #1f2937;
  text-align: center;
  margin: 0 0 2rem 0;
}

.section-subtitle {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
  text-align: center;
}

.date-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.date-nav-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.date-nav-btn:hover {
  background-color: #f3f4f6;
}

.date-options {
  display: flex;
  gap: 0.5rem;
  flex: 1;
}

.date-option {
  flex: 1;
  padding: 0.75rem;
  background: #f3f4f6;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
  color: #374151;
}

.date-option:hover {
  background: #e5e7eb;
}

.date-option.selected {
  background: #625397;
  color: white;
}

.date-option.unavailable {
  background: #fef3f2;
  color: #ef4444;
  border: 1px solid #f56565;
  cursor: not-allowed;
}

.date-option.loading {
  background: #f9fafb;
  color: #6b7280;
  border: 1px solid #d1d5db;
  font-style: italic;
  cursor: not-allowed;
}

.time-slots {
  margin-bottom: 2rem;
}

.time-slot {
  padding: 0.75rem;
  background: #f3f4f6;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  text-align: center;
  color: #374151;
  font-size: 0.9rem;
}

.time-slot.unavailable {
  color: #ef4444;
  background-color: #fef3f2;
  border: 1px solid #f56565;
}

.time-slot.loading {
  color: #6b7280;
  background-color: #f9fafb;
  border: 1px solid #d1d5db;
  font-style: italic;
}

.visit-price {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.price-label {
  font-weight: 600;
  color: #374151;
}

.price-value {
  font-weight: bold;
  align-items: center;
  color: #625397;
  font-size: 1.1rem;
}

.book-now-btn {
  width: 100%;
  padding: 1rem;
  background: #625397;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.book-now-btn:hover {
  background: #52467f;
}

.book-now-btn:disabled,
.book-now-btn.disabled {
  background: #9ca3af;
  color: #6b7280;
  cursor: not-allowed;
  opacity: 0.7;
}

.book-now-btn:disabled:hover,
.book-now-btn.disabled:hover {
  background: #9ca3af;
}

/* Reviews Section */
.reviews-section {
  
  margin-top:1rem;
}

.reviews-title {
  font-size: 2rem;
  font-weight: bold;
  color: #625397;
  text-align: center;
  margin: 0 0 0 0;
}

.reviews-container {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.review-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1.5rem;
}

.review-rating {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.review-text {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.review-author {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
}

.review-date {
  font-size: 0.875rem;
  color: #9ca3af;
}

.show-more-container {
  text-align: center;
}

.show-more-btn {
  background: none;
  border: none;
  color: #625397;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

 .show-more-btn:hover {
   color: #52467f;
 }

/* Reviews Header */
.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.review-actions {
  display: flex;
  gap: 1rem;
}

.add-review-btn {
  background: #625397;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.add-review-btn:hover {
  background: #52467f;
}

.review-notice {
  color: #6b7280;
  font-size: 0.9rem;
  font-style: italic;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #625397;
  
}
.fa-star {
  color: #fbbf24 !important;
}

/* Review Form */
.review-form {
  background: #ffffff;
  padding: 1.5rem;
  margin-bottom: 2rem;
  /* border: 1px solid #d1d5db; */
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  
}

.review-form h3 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.star-rating-input {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.star-rating-input label {
  font-weight: 600;
  color: #374151;
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
  background-color: rgba(251, 191, 36, 0.1);
}

.star-button.filled {
  color: #fbbf24;
}

.star-button.empty {
  color: #d1d5db;
}

.star-button.filled:hover {
  color: #f59e0b;
}

.star-button.empty:hover {
  color: #fbbf24;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
}

.char-count {
  text-align: right;
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.validation-status {
  display: flex;
  gap: 0.5rem;
}

.validation-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #dc2626;
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
  color: #059669;
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
  background: #625397;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background: #52467f;
}

.submit-btn:disabled {
  background: #6b7280;
  cursor: not-allowed;
}

.cancel-btn {
  background: #625397;
  color: white;
}

.cancel-btn:hover {
  background: #52467f;
}

/* Reviews List */
.reviews-list {
  margin-top: 2rem;
}

.loading-state, .error-state {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.retry-btn {
  background: #625397;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

.retry-btn:hover {
  background: #52467f;
}

.reviews-subtitle {
  font-size: 1.1rem;
  font-weight: 500;
  color: #6b7280;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.review-meta {
  text-align: right;
}

.review-author {
  display: block;
  font-weight: 600;
  color: #6b7280;
  font-size: 0.875rem;
}

.review-date {
  display: block;
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
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
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}



/* Responsive Design */
@media (max-width: 1200px) {
  .main-content {
    max-width: 95%;
    padding: 1.5rem;
  }
  
  .content-grid {
    grid-template-columns: 1.5fr 1fr;
    gap: 1.5rem;
  }
  
  .page-title h1 {
    font-size: 2rem;
  }
}

@media (max-width: 1024px) {
  .main-content {
    padding: 1rem;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .technician-info-card {
    padding: 1.5rem;
    width: 100%;
  }
  
  .booking-info-card {
    padding: 1.5rem;
    width: 100%;
  }
  
  .profile-section {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    width: 100%;
  }
  
  .profile-picture {
    width: 150px;
    height: 150px;
  }
  
  .technician-name {
    font-size: 1.5rem;
  }
  
  .technician-specialization {
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 0.75rem;
    width: 100%;
  }
  
  .page-title {
    margin-bottom: 2rem;
    width: 100%;
  }
  
  .page-title h1 {
    font-size: 1.75rem;
  }
  
  .technician-info-card {
    padding: 1rem;
    border-radius: 8px;
    width: 100%;
  }
  
  .booking-info-card {
    padding: 1rem;
    border-radius: 8px;
    width: 100%;
  }
  
  .profile-section {
    width: 100%;
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .profile-picture {
    width: 120px;
    height: 120px;
  }
  
  .profile-details {
    width: 100%;
  }
  
  .technician-name {
    font-size: 1.25rem;
  }
  
  .technician-specialization {
    font-size: 0.9rem;
  }
  
  .date-selector {
    gap: 0.5rem;
    justify-content: center;
  }
  .date-options {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.5rem;
  }
}

@media (min-width:600px) {
  .main-content {
    margin-left: 80px;
    margin-right: 80px;
  }
}

@media (max-width: 600px) {
  .main-content {
    padding: 0.5rem;
    margin-left: 0.75rem; /* add left margin on mobile */
  }
  .content-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .technician-info-card,
  .booking-info-card {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    margin: 0 0 1rem 0;
  }
  
  .profile-section {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  
  .profile-picture {
    width: 60px;
    height: 60px;
    margin-bottom: 0.5rem;
  }
  
  .profile-details {
    width: 100%;
    font-size: 1rem;
  }
  
  .technician-name {
    font-size: 1.1rem;
  }
  
  .technician-specialization {
    font-size: 0.95rem;
  }
  
  .detail-item {
    font-size: 0.95rem;
  }
  
  .bio-title {
    font-size: 1rem;
  }
  
  .bio-content {
    font-size: 0.95rem;
  }
  
  .booking-title {
    font-size: 1.1rem;
  }
  
  .section-subtitle {
    font-size: 1rem;
  }
  
  .date-option,
  .time-slot {
    font-size: 0.95rem;
    padding: 0.4rem;
  }
  
  .visit-price {
    font-size: 1rem;
  }
  
  .price-label,
  .price-value {
    font-size: 0.95rem;
  }
  
  .book-now-btn {
    font-size: 1rem;
    padding: 0.6rem;
  }
  
  .date-nav-btn {
    font-size: 1rem;
    padding: 0.4rem;
  }
  
  .date-selector {
    gap: 0.5rem;
  }
  .date-options {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
  }
  .date-option {
    min-width: 96px;
    scroll-snap-align: start;
  }
  
  .reviews-section {
    padding: 0.5rem 0;
  }
  
  .reviews-title {
    font-size: 1.2rem;
  }
  
  .review-form,
  .review-card {
    font-size: 1rem;
  }
  .star-button {
    font-size: 1.2rem;
  }
  .char-count {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 0.25rem;
    width: 100%;
    margin-left: 0.75rem; /* keep slight left margin */
  }
  
  .page-title {
    margin-bottom: 1.5rem;
    width: 100%;
  }
  
  .page-title h1 {
    font-size: 1.25rem;
  }
  
  .technician-info-card {
    padding: 0.5rem;
    width: 100%;
  }
  
  .booking-info-card {
    padding: 0.5rem;
    width: 100%;
  }
  
  .profile-section {
    width: 100%;
  }
  
  .profile-picture {
    width: 80px;
    height: 80px;
  }
  
  .profile-details {
    width: 100%;
  }
  
  .technician-name {
    font-size: 1rem;
  }
  
  .technician-specialization {
    font-size: 0.75rem;
  }
  
  .detail-item {
    padding: 0.125rem 0;
    font-size: 0.75rem;
    width: 100%;
  }
  
  .skills-title {
    font-size: 0.9rem;
  }
  
  .skill-item {
    padding: 0.25rem;
    font-size: 0.7rem;
    width: 100%;
  }
  
  .booking-title {
    font-size: 1rem;
  }
  
  .section-subtitle {
    font-size: 0.8rem;
  }
  
  .date-options {
    gap: 0.125rem;
    width: 100%;
  }
  
  .date-option {
    padding: 0.25rem;
    font-size: 0.65rem;
  }
  
  .time-slot {
    padding: 0.25rem;
    font-size: 0.65rem;
  }
  
  .visit-price {
    padding: 0.375rem;
    width: 100%;
  }
  
  .price-label {
    font-size: 0.75rem;
  }
  
  .price-value {
    font-size: 0.8rem;
  }
  
  .book-now-btn {
    padding: 0.375rem;
    font-size: 0.8rem;
    width: 100%;
  }
  
  .date-nav-btn {
    padding: 0.25rem;
    font-size: 0.6rem;
  }
}

@media (max-width: 360px) {
  .main-content {
    padding: 0.125rem;
    width: 100%;
    margin-left: 0.5rem; /* smaller devices */
  }
  
  .page-title h1 {
    font-size: 1.1rem;
  }
  
  .technician-info-card {
    padding: 0.375rem;
    width: 100%;
  }
  
  .booking-info-card {
    padding: 0.375rem;
    width: 100%;
  }
  
  .profile-section {
    width: 100%;
  }
  
  .profile-picture {
    width: 70px;
    height: 70px;
  }
  
  .profile-details {
    width: 100%;
  }
  
  .technician-name {
    font-size: 0.9rem;
  }
  
  .technician-specialization {
    font-size: 0.7rem;
  }
  
  .detail-item {
    padding: 0.1rem 0;
    font-size: 0.7rem;
    width: 100%;
  }
  
  .skills-title {
    font-size: 0.8rem;
  }
  
  .skill-item {
    padding: 0.2rem;
    font-size: 0.65rem;
    width: 100%;
  }
  
  .booking-title {
    font-size: 0.9rem;
  }
  
  .section-subtitle {
    font-size: 0.75rem;
  }
  
  .date-option {
    padding: 0.2rem;
    font-size: 0.65rem;
  }
  
  .time-slot {
    padding: 0.2rem;
    font-size: 0.65rem;
  }
  
  .visit-price {
    padding: 0.25rem;
    width: 100%;
  }
  
  .price-label {
    font-size: 0.7rem;
  }
  
  .price-value {
    font-size: 0.75rem;
  }
  
  .book-now-btn {
    padding: 0.25rem;
    font-size: 0.75rem;
    width: 100%;
  }
  
  .date-nav-btn {
    padding: 0.2rem;
    font-size: 0.55rem;
  }
}

/* Dark Mode Styles */

.dark .technician-profile-page {
  background-color: var(--primary-bg);
  color: var(--primary-text);
}

.dark .loading-container,
.dark .error-container {
  background-color: #2D2E30;
  color: var(--primary-text);
}

.dark .loading-spinner {
  border-color: var(--border-color);
  border-top-color: var(--primary);
}

.dark .error-message {
  color: #f87171;
}

.dark .header-contact-bar {
  background: linear-gradient(135deg, #f59e0b, #f97316);
}
.dark .review-form {
  background-color: var(--secondary-bg);
  color: white;
}
.dark .review-card{
  background: var(--input-bg);
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
  color: white;
}
.dark .main-nav {
  background: var(--secondary-bg);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.dark .logo-text {
  color: var(--primary-text);
}

.dark h3 {
  color: white;
}

.dark label {
  color: white;
}

.dark .nav-link {
  color: var(--text-muted);
}

.dark .nav-link:hover {
  color: var(--primary);
}

.dark .nav-icon {
  color: var(--text-muted);
}

.dark .nav-icon:hover {
  color: var(--primary);
}


.dark .page-title h1 {
  color: var(--primary-color);
}

.dark .technician-info-card {
  background: var(--secondary-bg);
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
}

.dark .technician-name {
  color: var(--primary-text);
}

.dark .technician-specialization {
  color: var(--text-muted);
}

.dark .detail-item {
  border-bottom-color: var(--border-color);
}

.dark .detail-label {
  color: var(--text-muted);
}

.dark .detail-value {
  color: var(--primary-text);
}

.dark .bio-title {
  color: var(--primary-text);
}

.dark .bio-content {
  color: var(--primary-text);
}

.dark .booking-info-card {
  background: var(--secondary-bg);
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
}

.dark .booking-title {
  color: var(--primary-text);
}

.dark .section-subtitle {
  color: var(--primary-text);
}

.dark .date-option {
  background: var(--input-bg);
  color: var(--primary-text-dark);
}

.dark .date-option:hover {
  background: var(--border-color);
}

.dark .date-option.selected {
  background: var(--primary);
  color: var(--primary-text);
}

.dark .date-option.unavailable {
  background: #7f1d1d;
  color: #fecaca;
  border-color: #ef4444;
}

.dark .date-option.loading {
  background: var(--input-bg);
  color: var(--text-muted);
  border-color: var(--border-color);
}

.dark .time-slot {
  background: var(--input-bg);
  color: var(--text-muted);
}

.dark .time-slot.unavailable {
  background-color: #7f1d1d;
  color: #fecaca;
  border-color: #ef4444;
}

.dark .time-slot.loading {
  background-color: var(--input-bg);
  color: var(--text-muted);
  border-color: var(--border-color);
}
.dark .review-actions{
  background: var(--icon-color);
  color: var(--primary-text-dark);
}
.dark .visit-price {
  background: var(--input-bg);
  color: var(--text-muted);
}

.dark .price-label {
  color: var(--primary-text-dark);
}

.dark .price-value {
  color: var(--primary);
}

.dark .book-now-btn {
  background: var(--primary);
  color: var(--primary-text);
}

.dark .book-now-btn:hover {
  background: var(--secondary);
}

.dark .book-now-btn:disabled,
.dark .book-now-btn.disabled {
  background: var(--text-muted);
  color: var(--border-color);
  cursor: not-allowed;
  opacity: 0.7;
}

.dark .book-now-btn:disabled:hover,
.dark .book-now-btn.disabled:hover {
  background: var(--text-muted);
}

.dark .date-nav-btn {
  background: var(--input-bg);
  color: var(--primary-text-dark);
  border-color: var(--border-color);
}

.dark .date-nav-btn:hover {
  background: var(--icon-color);
}

.dark .reviews-section {
  
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
}
.dark .review-card {
  background: var(--secondary-bg);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);}


.dark .reviews-title {
  color: var(--primary-text);
}

.dark .review-item {
  background: var(--secondary-bg);
  border-color: var(--border-color);
  color: var(--primary-text-dark);
}

.dark .review-header {
  border-bottom-color: var(--border-color);
  color: var(--text-muted);
}

.dark .reviewer-name {
color: #ddd7d7 ;
}

.dark .review-date {
  color: var(--text-muted);
}

.dark .review-text {
  color:  var(--primary-text);
}

.dark .review-author {
   color: var(--text-muted);
}

.dark .fa-star {
  color: #fbbf24 !important;
}

.dark .star-empty {
  color:  var(--primary-text);
}
/* Divider before reviews section */
.reviews-divider {
  border: none;
  border-top: 3px solid #e5e7eb;
  margin: 2rem 0 2rem 0;
  width: 100%;
}
</style>