<template>
  <div class="reviews-section">
    <div class="reviews-header">
      <h2 class="reviews-title">{{ $t('reviews') }}</h2>
      <button 
        v-if="!showReviewForm && canReview" 
        @click="showReviewForm = true" 
        class="add-review-btn"
      >
        {{ $t('addReview') }}
      </button>
    </div>

    <!-- Review Submission Form -->
    <div v-if="showReviewForm" class="review-form">
      <h3>{{ $t('writeReview') }}</h3>
      <div class="star-rating-input">
        <label>{{ $t('rating') }}:</label>
        <div class="stars">
          <i 
            v-for="n in 5" 
            :key="n" 
            class="fa-solid fa-star star-input"
            :class="{ 'filled': n <= newReview.rating, 'empty': n > newReview.rating }"
            @click="newReview.rating = n"
            @mouseenter="hoverRating = n"
            @mouseleave="hoverRating = 0"
          ></i>
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
        <button @click="submitReview" :disabled="!isValidReview" class="submit-btn">
          {{ $t('submitReview') }}
        </button>
        <button @click="cancelReview" class="cancel-btn">
          {{ $t('cancel') }}
        </button>
      </div>
    </div>

    <!-- Booking Requirement Notice -->
    <div v-if="!auth.currentUser" class="booking-notice">
      <div class="notice-content">
        <i class="fa-solid fa-info-circle notice-icon"></i>
        <p>{{ $t('loginToReview') }}</p>
      </div>
    </div>

    <div v-else-if="!canReview && !bookingCheckLoading" class="booking-notice">
      <div class="notice-content">
        <i class="fa-solid fa-calendar-check notice-icon"></i>
        <p>{{ $t('bookingRequiredToReview') }}</p>
        <p class="notice-subtitle">{{ $t('bookTechnicianFirst') }}</p>
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
        <div v-for="review in reviews" :key="review.id" class="review-card">
          <div class="review-header">
            <div class="review-rating">
              <i 
                v-for="n in 5" 
                :key="n" 
                class="fa-solid fa-star"
                :class="{ 'filled': n <= review.rating, 'empty': n > review.rating }"
              ></i>
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
        <p>{{ $t('noReviewsYet') }}</p>
        <p v-if="canReview">{{ $t('beFirstToReview') }}</p>
        <p v-else>{{ $t('bookToLeaveFirstReview') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, query, where, addDoc, orderBy } from 'firebase/firestore'
import { db, auth } from '../firebase'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  technicianId: {
    type: String,
    required: true
  }
})

const reviews = ref([])
const reviewsLoading = ref(true)
const reviewsError = ref(null)
const showReviewForm = ref(false)
const hoverRating = ref(0)
const newReview = ref({
  rating: 0,
  text: ''
})

// Booking eligibility check
const canReview = ref(false)
const bookingCheckLoading = ref(true)

const isValidReview = computed(() => {
  return newReview.value.rating > 0 && newReview.value.text.trim().length >= 10;
})

onMounted(() => {
  fetchReviews()
  checkBookingEligibility()
})

async function checkBookingEligibility() {
  if (!auth.currentUser) {
    canReview.value = false
    bookingCheckLoading.value = false
    return
  }

  try {
    bookingCheckLoading.value = true
    
    // Check if user has completed bookings with this technician
    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('technicianId', '==', props.technicianId),
      where('userEmail', '==', auth.currentUser.email),
      where('status', '==', 'completed')
    )
    
    const bookingsSnapshot = await getDocs(bookingsQuery)
    
    // Check if user has already reviewed this technician
    const reviewsQuery = query(
      collection(db, 'reviews'),
      where('technicianId', '==', props.technicianId),
      where('userEmail', '==', auth.currentUser.email)
    )
    
    const reviewsSnapshot = await getDocs(reviewsQuery)
    
    // User can review if they have completed bookings but haven't reviewed yet
    canReview.value = !bookingsSnapshot.empty && reviewsSnapshot.empty
    
  } catch (error) {
    console.error('Error checking booking eligibility:', error)
    canReview.value = false
  } finally {
    bookingCheckLoading.value = false
  }
}

async function fetchReviews() {
  try {
    reviewsLoading.value = true
    reviewsError.value = null
    const q = query(
      collection(db, 'reviews'), 
      where('technicianId', '==', props.technicianId),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    reviews.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (e) {
    reviewsError.value = t('failedToFetchReviews')
  } finally {
    reviewsLoading.value = false
  }
}

async function submitReview() {
  if (!auth.currentUser) {
    alert(t('loginRequired'))
    return
  }

  if (!canReview.value) {
    alert(t('bookingRequiredToReview'))
    return
  }

  if (!isValidReview.value) {
    alert(t('pleaseSelectRating') + ' ' + t('reviewTooShort'))
    return
  }

  try {
    const reviewData = {
      technicianId: props.technicianId,
      userId: auth.currentUser.uid,
      userEmail: auth.currentUser.email,
      userName: auth.currentUser.displayName || auth.currentUser.email,
      rating: newReview.value.rating,
      text: newReview.value.text.trim(),
      createdAt: new Date()
    }

    await addDoc(collection(db, 'reviews'), reviewData)
    
    // Reset form
    newReview.value = { rating: 0, text: '' }
    showReviewForm.value = false
    
    // Refresh reviews and eligibility
    await fetchReviews()
    await checkBookingEligibility()
    
    alert(t('reviewSubmitted'))
  } catch (error) {
    console.error('Error submitting review:', error)
    alert(t('reviewSubmissionFailed'))
  }
}

function cancelReview() {
  newReview.value = { rating: 0, text: '' }
  showReviewForm.value = false
}

function formatDate(date) {
  if (!date) return ''
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString()
}
</script>

<style scoped>
/* Reviews Section */
.reviews-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

.dark .reviews-section {
  background: var(--secondary-bg);
  color: var(--primary-text);
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

.dark .reviews-title {
  color: var(--primary-text);
}

.add-review-btn {
  background: #7c6bb0;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.dark .add-review-btn {
  background: var(--primary-color);
}

.add-review-btn:hover {
  background: #6b5a9f;
}

.dark .add-review-btn:hover {
  background: #5a4b8a;
}

/* Booking Notice */
.booking-notice {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.dark .booking-notice {
  background: #374151;
  border-color: #4b5563;
}

.notice-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.notice-icon {
  color: #6b7280;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.dark .notice-icon {
  color: #9ca3af;
}

.notice-content p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.dark .notice-content p {
  color: #9ca3af;
}

.notice-subtitle {
  font-size: 0.75rem !important;
  margin-top: 0.25rem !important;
  opacity: 0.8;
}

/* Review Form */
.review-form {
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.dark .review-form {
  background: #1f2937;
}

.review-form h3 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
}

.dark .review-form h3 {
  color: var(--primary-text);
}

.star-rating-input {
  margin-bottom: 1rem;
}

.star-rating-input label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.dark .star-rating-input label {
  color: var(--primary-text);
}

.stars {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.star-input {
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s;
}

.star-input.filled {
  color: #fbbf24;
}

.star-input.empty {
  color: #d1d5db;
}

.rating-text {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.dark .rating-text {
  color: #9ca3af;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.dark .form-group label {
  color: var(--primary-text);
}

.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  resize: vertical;
  background: white;
  color: #111827;
}

.dark .form-group textarea {
  background: var(--primary-bg);
  border-color: #4b5563;
  color: var(--primary-text);
}

.form-group textarea:focus {
  outline: none;
  border-color: #7c6bb0;
  box-shadow: 0 0 0 3px rgba(124, 107, 176, 0.1);
}

.dark .form-group textarea:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(124, 107, 176, 0.1);
}

.char-count {
  text-align: right;
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.dark .char-count {
  color: #9ca3af;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.submit-btn {
  background: #7c6bb0;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.dark .submit-btn {
  background: var(--primary-color);
}

.submit-btn:hover:not(:disabled) {
  background: #6b5a9f;
}

.dark .submit-btn:hover:not(:disabled) {
  background: #5a4b8a;
}

.submit-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.dark .submit-btn:disabled {
  background: #6b7280;
}

.cancel-btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.dark .cancel-btn {
  background: #374151;
  color: var(--primary-text);
  border-color: #4b5563;
}

.cancel-btn:hover {
  background: #e5e7eb;
  border-color: #9ca3af;
}

.dark .cancel-btn:hover {
  background: #4b5563;
  border-color: #6b7280;
}

/* Reviews List */
.reviews-list {
  margin-top: 2rem;
}

.loading-state {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.dark .loading-state {
  color: #9ca3af;
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

.dark .error-message {
  color: #fca5a5;
}

.retry-btn {
  background: #7c6bb0;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.dark .retry-btn {
  background: var(--primary-color);
}

.reviews-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-card {
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
}

.dark .review-card {
  background: #1f2937;
  border-color: #4b5563;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.review-rating {
  display: flex;
  gap: 0.125rem;
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

.review-meta {
  text-align: right;
}

.review-author {
  display: block;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.dark .review-author {
  color: var(--primary-text);
}

.review-date {
  display: block;
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.dark .review-date {
  color: #9ca3af;
}

.review-text {
  color: #374151;
  line-height: 1.5;
  font-size: 0.875rem;
}

.dark .review-text {
  color: var(--primary-text);
}

.empty-reviews {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.dark .empty-reviews {
  color: #9ca3af;
}

.empty-reviews p {
  margin: 0.5rem 0;
}

.empty-reviews p:first-child {
  font-weight: 500;
  font-size: 1rem;
}
</style> 