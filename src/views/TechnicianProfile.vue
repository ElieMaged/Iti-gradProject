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
            <p class="error-message">{{ bookingsError }}</p>
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
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import { stockTechnicians } from '../assets/stockTechnicians'

const route = useRoute()
const technician = ref(null)
const loading = ref(true)
const error = ref('')

const searchQuery = ref('')
const bookings = ref([])
const bookingsLoading = ref(true)
const bookingsError = ref(null)

const filteredBookings = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return bookings.value.filter(b =>
    Object.values(b).some(val => String(val).toLowerCase().includes(q))
  );
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
  await fetchBookings()
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
</script>

<style scoped>
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

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #7c6bb0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.error-message {
  color: #ef4444;
  margin-bottom: 1rem;
  text-align: center;
}

.retry-btn {
  background: #7c6bb0;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-btn:hover {
  background: #6b5fa7;
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

@media (max-width: 768px) {
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
  .table-header th,
  .table-row td {
    padding: 0.5rem 0.5rem;
  }
}
</style> 