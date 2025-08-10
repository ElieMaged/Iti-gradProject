<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="booking-main mx-12 p-4">
      <TopBar :title="$t('completedBookings')" />
      <div class="booking-container">
        <div class="title-search-row">
          <div class="search-wrapper">
            <input v-model="searchQuery" class="search-input" type="text" :placeholder="$t('search')" />
            <span class="search-icon"><i class="fas fa-search"></i></span>
          </div>
          <div class="pagination-info" v-if="filteredBookings.length > 0">
            <span class="info-text">
              Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredBookings.length) }} of {{ filteredBookings.length }} bookings
            </span>
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading completed bookings...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <p class="error-message">{{ error }}</p>
          <button @click="fetchBookings" class="retry-btn">Retry</button>
        </div>

        <!-- Bookings Table -->
        <div v-else-if="filteredBookings.length > 0" class="table-wrapper">
          <table class="booking-table">
            <thead>
              <tr class="table-header">
                <th>{{ $t('userName') }}</th>
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
              <tr v-for="(booking, index) in paginatedBookings" :key="booking.id" class="table-row">
                <td>{{ booking.userName }}</td>
                <td>{{ booking.technicianName }}</td>
                <td>{{ booking.specialization }}</td>
                <td>{{ booking.date }}</td>
                <td>{{ booking.time }}</td>
                <td>{{ booking.address }}</td>
                <td>{{ booking.price }}</td>
                <td>
                  <span class="status-completed">{{ $t('completed') }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <p>No completed bookings found.</p>
        </div>
        <pagination 
          v-if="totalPages > 1"
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-changed="goToPage"
          @prev-page="goToPage(currentPage - 1)"
          @next-page="goToPage(currentPage + 1)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import AdminSidebar from '../../components/admin-sidebar.vue';
import Pagination from '../../components/pagination.vue';
import TopBar from '../../components/TopBar.vue';

// Reactive data
const bookings = ref([]);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const loading = ref(true);
const error = ref(null);

// Fetch bookings on mount
onMounted(async () => {
  await fetchBookings();
});

// Fetch completed bookings from Firestore
async function fetchBookings() {
  try {
    loading.value = true;
    error.value = null;
    
    const q = query(collection(db, 'bookings'), where('status', '==', 'completed'));
    const querySnapshot = await getDocs(q);
    
    bookings.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
  } catch (error) {
    console.error('Error fetching completed bookings:', error);
    error.value = 'Failed to fetch completed bookings';
  } finally {
    loading.value = false;
  }
}

// Pagination logic
const filteredBookings = computed(() => {
  if (!searchQuery.value.trim()) return bookings.value;
  const q = searchQuery.value.toLowerCase();
  return bookings.value.filter(b =>
    Object.values(b).some(val => String(val).toLowerCase().includes(q))
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredBookings.value.length / itemsPerPage);
});

const paginatedBookings = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredBookings.value.slice(startIndex, endIndex);
});

// Navigation functions
function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

// Watch for search query changes to reset pagination
watch(searchQuery, () => {
  currentPage.value = 1;
});
</script>

<style scoped>
.admin-dashboard-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
  background: #faf8fd;
  margin-left: 14rem;
}
.dark .admin-dashboard-layout {
  background: var(--primary-bg);
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .layout{
    min-height: auto;
  }
  .admin-dashboard-layout {
    flex-direction: column;
    min-height: auto;
  }
  
  .booking-main {
    padding: 0.5rem;
    margin: 20px;
  }
}

@media (max-width: 480px) {
  .booking-main {
    margin-top: 70px;
    padding: 0.25rem;
  }
}

@media (max-width: 360px) {
  .booking-main {
    margin-top: 60px;
  }
}

.booking-main {
  flex: 1;
  padding: 2.5rem;
}
.dark .booking-main {
  background-color: var(--primary-bg);
}

.booking-container {
  margin: 0 auto;
}
.dark .booking-container {
  background-color: var(--primary-bg);
}

.title-search-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}
.dark .title-search-row {
  color: var(--primary-text);
}

.booking-title {
  font-size: 2rem;
  font-weight: bold;
  color: #7c6bb0;
  margin-bottom: 0;
}
.dark .booking-title {
  color: var(--primary-color);
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
.dark .search-wrapper {
  background-color: var(--primary-bg);
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
.dark .search-input {
  background-color: var(--input-bg);
  color: var(--text-muted);
}
.dark .search-input::placeholder {
  color: var(--text-muted);
}

.search-input:focus {
  border: 1.5px solid #6B5FA7;
}
.dark .search-input:focus {
  border: 1.5px solid var(--primary-text);
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #b6a7e6;
  font-size: 1.1rem;
}
.dark .search-icon {
  color: var(--icon-color);
}

.pagination-info {
  display: flex;
  align-items: center;
}

.info-text {
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 500;
}

.dark .info-text {
  color: var(--text-muted);
}

/* Loading State */
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

.dark .loading-state {
  background-color: var(--grey-bg);
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

.dark .loading-spinner {
  border: 4px solid var(--grey-bg);
  border-top: 4px solid var(--primary-text);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error State */
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

.dark .error-state {
  background-color: var(--grey-bg);
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

.dark .retry-btn {
  background-color: var(--primary-text);
  color: var(--primary-bg);
}

.retry-btn:hover {
  background: #6b5fa7;
}

.dark .retry-btn:hover {
  background-color: var(--primary-text);
  color: var(--primary-bg);
}

/* Empty State */
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

.dark .empty-state {
  background-color: var(--grey-bg);
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.dark .table-wrapper {
  background-color: var(--grey-bg);
}

.booking-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 0.75rem;
}
.dark .booking-table {
  background-color: var(--grey-bg);
  color: var(--primary-text);
}

.table-header {
  background: rgba(124, 107, 176, 0.2);
  color: #333;
}
.dark .table-header th {
  color: var(--primary-text);
}

.table-header th {
  padding: 0.75rem 1rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.table-row {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s;
}
.dark .table-row {
  background-color: var(--input-bg);
  color: var(--text-muted);
}

.table-row:hover {
  background: #ede7f6;
}
.dark .table-row:hover {
  background-color: var(--icon-color);
}

.table-row td {
  padding: 0.5rem 0.5rem;
  font-size: 0.9rem;
  color: #333;
  vertical-align: middle;
  text-align: center;
}

/* Vertical borders between columns */
.booking-table th,
.booking-table td {
  border-right: 1px solid #e5e7eb;
}
.booking-table th:last-child,
.booking-table td:last-child {
  border-right: none;
}
.dark .booking-table th,
.dark .booking-table td {
  border-right-color: rgba(255, 255, 255, 0.12);
}

/* Zebra striping for better scanability */
.table-row:nth-child(even) {
  background: #faf5ff; /* subtle lavender */
}
.dark .table-row:nth-child(even) {
  background: rgba(255,255,255,0.04);
}

.status-completed {
  color: #166534;
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
  