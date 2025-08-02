<template>
  <div class="admin-dashboard-layout">
    <userSidebar :activeTab="'bookings'" />
    
    <div class="user-bookings-main mr-20 p-4">
      <div class="page-header">
        <h1 class="page-title">{{ $t('myBookings') }}</h1>
        <p class="page-description">{{ $t('myBookingsDescription') }}</p>
      </div>

      <div class="bookings-container">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>{{ $t('loadingBookings') }}</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <p class="error-message">{{ error }}</p>
          <button @click="fetchBookings" class="retry-btn">{{ $t('retry') }}</button>
        </div>

        <!-- Bookings List -->
        <div v-else-if="bookings.length > 0" class="table-wrapper">
          <div class="bookings-header">
            <h2>{{ $t('currentBookings') }} ({{ bookings.length }})</h2>
            <div class="filter-controls">
              <select v-model="statusFilter" class="filter-select">
                <option value="all">{{ $t('allBookings') }}</option>
                <option value="pending">{{ $t('pending') }}</option>
                <option value="upcoming">{{ $t('upcoming') }}</option>
                <option value="completed">{{ $t('completed') }}</option>
                <option value="cancelled">{{ $t('cancelled') }}</option>
              </select>
            </div>
          </div>
          <table class="booking-table">
            <thead>
              <tr class="table-header">
                <th>{{ $t('technician') }}</th>
                <th>{{ $t('specialization') }}</th>
                <th>{{ $t('date') }}</th>
                <th>{{ $t('time') }}</th>
                <th>{{ $t('address') }}</th>
                <th>{{ $t('price') }}</th>
                <th>{{ $t('status') }}</th>
                <th>{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="booking in filteredBookings" :key="booking.id" class="table-row">
                <td data-label="Technician">{{ booking.technicianName }}</td>
                <td data-label="Specialization">{{ getSpecializationTranslation(booking.specialization) }}</td>
                <td data-label="Date">{{ booking.date }}</td>
                <td data-label="Time">{{ booking.time }}</td>
                <td data-label="Address">{{ booking.address }}</td>
                <td data-label="Price">{{ booking.price }} {{ $t('egp') }}</td>
                <td data-label="Status">
                  <span :class="getStatusClass(booking.status)">
                    {{ getStatusTranslation(booking.status) }}
                  </span>
                </td>
                <td data-label="Actions">
                  <button v-if="booking.status === 'pending'" @click="cancelBooking(booking.id)" :disabled="cancellingBooking === booking.id" class="cancel-btn">
                    {{ cancellingBooking === booking.id ? $t('cancelling') : $t('cancelBooking') }}
                  </button>
                  <button v-if="booking.status === 'completed'" @click="bookAgain(booking)" class="book-again-btn">
                    {{ $t('bookAgain') }}
                  </button>
                  <button v-if="booking.status === 'upcoming'" @click="viewTechnicianProfile(booking.technicianId)" class="view-profile-btn">
                    {{ $t('viewProfile') }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-calendar-times"></i>
          </div>
          <h3>{{ $t('noBookingsFound') }}</h3>
          <p>{{ $t('noBookingsDescription') }}</p>
          <button @click="goToServices" class="browse-services-btn">
            {{ $t('browseServices') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db, auth } from '../firebase'
import { useI18n } from 'vue-i18n'
import userSidebar from '../components/userSidebar.vue'

const router = useRouter()
const { t } = useI18n()

// State
const bookings = ref([])
const loading = ref(true)
const error = ref('')
const statusFilter = ref('all')
const cancellingBooking = ref(null)

// Computed
const filteredBookings = computed(() => {
  if (statusFilter.value === 'all') {
    return bookings.value
  }
  return bookings.value.filter(booking => booking.status === statusFilter.value)
})

// Methods
async function fetchBookings() {
  try {
    loading.value = true
    error.value = ''
    
    const userId = auth.currentUser?.uid
    if (!userId) {
      error.value = t('loginRequired')
      return
    }

    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', userId)
    )
    
    const snapshot = await getDocs(q)
    bookings.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (e) {
    console.error('Error fetching bookings:', e)
    error.value = t('errorLoadingBookings')
  } finally {
    loading.value = false
  }
}

async function cancelBooking(bookingId) {
  if (!confirm(t('confirmCancelBooking'))) return
  
  try {
    cancellingBooking.value = bookingId
    
    const bookingRef = doc(db, 'bookings', bookingId)
    await updateDoc(bookingRef, {
      status: 'cancelled',
      cancelledAt: new Date()
    })
    
    // Refresh bookings
    await fetchBookings()
  } catch (e) {
    console.error('Error cancelling booking:', e)
    alert(t('errorCancellingBooking'))
  } finally {
    cancellingBooking.value = null
  }
}

function bookAgain(booking) {
  router.push({
    path: '/bookingpage',
    query: { 
      techId: booking.technicianId,
      specialization: booking.specialization
    }
  })
}

function viewTechnicianProfile(technicianId) {
  router.push(`/technician/${technicianId}`)
}

function goToServices() {
  router.push('/allservices')
}

function formatDate(date) {
  if (!date) return ''
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString()
}

function getStatusClass(status) {
  const statusClasses = {
    'pending': 'status-pending',
    'upcoming': 'status-upcoming',
    'completed': 'status-completed',
    'cancelled': 'status-cancelled'
  }
  return statusClasses[status] || 'status-pending'
}

function getStatusTranslation(status) {
  const statusTranslations = {
    'pending': t('pending'),
    'upcoming': t('upcoming'),
    'completed': t('completed'),
    'cancelled': t('cancelled')
  }
  return statusTranslations[status] || status
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

onMounted(() => {
  fetchBookings()
})
</script>

<style scoped>
.user-bookings-page {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.sidebar-container {
  flex-shrink: 0;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
  text-align: center;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 2rem;
  text-align: left;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
}

.dark .page-title {
  color: var(--primary-color);
}

.page-description {
  color: var(--primary-color);
  font-size: 1.1rem;
  text-align: left;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
}

.dark .page-description {
  color: var(--primary-color);
}

.bookings-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}
.dark .bookings-container {
  background: var(--primary-bg);
}

.bookings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}


.bookings-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}
.dark .bookings-header {
 color: var(--primary-color);
}

.filter-controls {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 0.9rem;
}

.table-wrapper {
  overflow-x: auto;
}

.booking-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-header {
  background-color: #f8f9fa;
  color: #333;
  font-weight: 600;
  text-align: left;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}
.dark .table-header {
  background: var(--secondary-bg);
}

.table-header th {
  padding: 0.75rem 1.5rem;
}

.table-row {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s ease;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background-color: #f1f3f5;
}
.dark .table-row {
  background: var(--gray-200);
}


.table-cell {
  padding: 0.75rem 1.5rem;
  color: #333;
  font-size: 0.9rem;
}

.table-cell.status-pending {
  color: #92400e;
}

.table-cell.status-upcoming {
  color: #1e40af;
}

.table-cell.status-completed {
  color: #065f46;
}

.table-cell.status-cancelled {
  color: #991b1b;
  opacity: 0.7;
}

.booking-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.cancel-btn, .book-again-btn, .view-profile-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: #ef4444;
  color: white;
}

.cancel-btn:hover:not(:disabled) {
  background: #dc2626;
}

.cancel-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.book-again-btn {
  background: #10b981;
  color: white;
}

.book-again-btn:hover {
  background: #059669;
}

.view-profile-btn {
  background: #3b82f6;
  color: white;
}

.view-profile-btn:hover {
  background: #2563eb;
}

/* Loading and Error States */
.loading-state, .error-state {
  text-align: center;
  padding: 3rem;
}

.loading-spinner {
  border: 3px solid #e5e7eb;
  border-top: 3px solid #7c6bb0;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}


@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #dc2626;
  margin-bottom: 1rem;
}

.retry-btn {
  background: #7c6bb0;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}
.dark .retry-btn {
  background: var(--primary-color);
}
.retry-btn:hover {
  background: #6b5fa7;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem;
}

.empty-icon {
  font-size: 4rem;
  color: #9ca3af;
  margin-bottom: 1rem;
}
.dark .empty-icon {
  color: var(--icon-color);
}
.empty-state h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}
.dark .empty-state h3 {
  color: var(--muted-text);
}
.empty-state p {
  color: #666;
  margin-bottom: 2rem;
}
.dark .empty-state p {
  color: var(--muted-text);
}
.browse-services-btn {
  background: #7c6bb0;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}
.dark .browse-services-btn {
  background: var(--primary-color);
}
.browse-services-btn:hover {
  background: #6b5fa7;
}

/* Responsive Layout Styles */
.admin-dashboard-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
  background: #faf8fd;
}

.dark .admin-dashboard-layout {
  background-color: var(--primary-bg);
}

.user-bookings-main {
  background-color: #f9fafb;
  min-height: 100vh;
  font-family: sans-serif;
  flex: 1;
}

.dark .user-bookings-main {
  background-color: var(--primary-bg);
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .layout {
    flex-direction: column;
    min-height: auto;
  }
  .admin-dashboard-layout {
    flex-direction: column;
  }
  
  .user-bookings-main {
    margin-top: 80px;
    padding: 1rem;
    margin-right: 0;
  }
  
  .page-header {
    margin-bottom: 1.5rem;
    text-align: left;
  }
  
  .page-title {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    text-align: center;
  }
  
  .page-description {
    color: var(--primary-color);
    font-size: 1rem;
    text-align: left;
  }
  
  .bookings-container {
    padding: 1.5rem;
    border-radius: 0.75rem;
  }
  
  .bookings-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .bookings-header h2 {
    font-size: 1.25rem;
  }
  
  .filter-controls {
    width: 100%;
  }
  
  .filter-select {
    width: 100%;
    padding: 0.75rem;
  }
  
  .table-wrapper {
    overflow-x: auto;
  }

  .booking-table {
    display: block;
    width: 100%;
  }

  .table-header {
    display: none;
  }

  .table-row {
    display: block;
    margin-bottom: 1rem;
    padding: 1rem;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .table-row td {
    display: block;
    text-align: left;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e5e7eb;
    position: relative;
  }

  .table-row td:before {
    content: attr(data-label);
    font-weight: 600;
    color: #666;
    margin-right: 0.5rem;
  }

  .table-row td:last-child {
    border-bottom: none;
  }

  .booking-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .cancel-btn, .book-again-btn, .view-profile-btn {
    width: 100%;
    padding: 0.75rem;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .user-bookings-main {
    margin-top: 60px;
    padding: 0.75rem;
  }
  
  .bookings-container {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.25rem;
    text-align: center;
  }
  
  .page-description {
    color: var(--primary-color);
    font-size: 0.875rem;
    text-align: left;
  }
  
  .bookings-header h2 {
    font-size: 1.125rem;
  }
  
  .table-row {
    padding: 0.75rem;
  }
  
  .table-row td {
    font-size: 0.875rem;
  }
  
  .cancel-btn, .book-again-btn, .view-profile-btn {
    font-size: 0.875rem;
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 0.75rem;
  }
  
  .page-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .filter-controls {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .filter-select {
    width: 100%;
    padding: 0.6rem;
    font-size: 0.9rem;
  }
  
  .table-cell {
    padding-left: 45%;
    font-size: 0.85rem;
  }
  
  .table-cell:before {
    width: 45%;
    font-size: 0.8rem;
  }
  
  .booking-actions {
    gap: 0.5rem;
  }
  
  .action-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }
  
  .empty-state {
    padding: 2rem 1rem;
  }
  
  .empty-icon {
    font-size: 3rem;
  }
  
  .empty-state h3 {
    font-size: 1.25rem;
  }
  
  .empty-state p {
    font-size: 0.9rem;
  }
  
  .browse-services-btn {
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }
  
  .loading-spinner {
    width: 35px;
    height: 35px;
  }
  
  .error-message {
    padding: 0.75rem;
    font-size: 0.85rem;
  }
  
  .retry-btn {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 360px) {
  .main-content {
    padding: 0.5rem;
  }
  
  .page-title {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
  }
  
  .filter-controls {
    gap: 0.5rem;
  }
  
  .filter-select {
    padding: 0.5rem;
    font-size: 0.85rem;
  }
  
  .table-cell {
    padding-left: 40%;
    font-size: 0.8rem;
  }
  
  .table-cell:before {
    width: 40%;
    font-size: 0.75rem;
  }
  
  .action-btn {
    padding: 0.4rem 0.6rem;
    font-size: 0.75rem;
  }
  
  .empty-state {
    padding: 1.5rem 0.75rem;
  }
  
  .empty-icon {
    font-size: 2.5rem;
  }
  
  .empty-state h3 {
    font-size: 1.1rem;
  }
  
  .empty-state p {
    font-size: 0.85rem;
  }
  
  .browse-services-btn {
    padding: 0.5rem 1.25rem;
    font-size: 0.85rem;
  }
  
  .loading-spinner {
    width: 30px;
    height: 30px;
  }
  
  .error-message {
    padding: 0.6rem;
    font-size: 0.8rem;
  }
  
  .retry-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}

/* Landscape orientation adjustments */
@media (max-width: 768px) and (orientation: landscape) {
  .main-content {
    padding: 0.75rem;
  }
  
  .filter-controls {
    flex-direction: row;
    gap: 1rem;
  }
  
  .filter-select {
    width: auto;
    flex: 1;
  }
  
  .booking-actions {
    flex-direction: row;
  }
  
  .action-btn {
    flex: 1;
  }
}

/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .table-cell {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .action-btn,
  .browse-services-btn,
  .retry-btn {
    transition: none;
  }
  
  .loading-spinner {
    animation: none;
  }
}

/* Additional mobile optimizations */
@media (max-width: 320px) {
  .main-content {
    padding: 0.5rem;
  }
  
  .page-title {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }
  
  .page-description {
    color: var(--primary-color);
    font-size: 0.85rem;
  }
  
  .bookings-container {
    padding: 0.75rem;
  }
  
  .bookings-header {
    gap: 0.5rem;
  }
  
  .bookings-header h2 {
    font-size: 1rem;
  }
  
  .filter-controls {
    gap: 0.4rem;
  }
  
  .filter-select {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
  
  .table-row {
    padding: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  .table-cell {
    padding: 0.3rem 0;
    padding-left: 30%;
    font-size: 0.8rem;
  }
  
  .table-cell:before {
    width: 25%;
    font-size: 0.7rem;
  }
  
  .booking-actions {
    gap: 0.3rem;
    margin-top: 0.5rem;
  }
  
  .action-btn {
    padding: 0.4rem 0.6rem;
    font-size: 0.75rem;
  }
  
  .empty-state {
    padding: 1rem 0.5rem;
  }
  
  .empty-icon {
    font-size: 2.5rem;
  }
  
  .empty-state h3 {
    font-size: 1rem;
  }
  
  .empty-state p {
    font-size: 0.8rem;
  }
  
  .browse-services-btn {
    padding: 0.5rem 1.25rem;
    font-size: 0.8rem;
  }
  
  .loading-spinner {
    width: 30px;
    height: 30px;
  }
  
  .error-message {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
  
  .retry-btn {
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
  }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .action-btn,
  .browse-services-btn,
  .retry-btn {
    min-height: 44px;
  }
  
  .filter-select {
    min-height: 44px;
  }
}
</style> 