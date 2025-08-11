// UpcomingBooking.vue
<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="booking-main mx-12 p-4">
      <TopBar :title="$t('upcomingBookings')" />
      <div class="booking-container">
        <div class="title-search-row">
          <div class="search-wrapper">
            <input v-model="searchQuery" type="text" class="search-input" :placeholder="$t('search')" />
            <span class="search-icon"><i class="fas fa-search"></i></span>
          </div>
          <div class="pagination-info" v-if="filteredBookings.length > 0">
            <span class="info-text">
              Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredBookings.length) }} of {{ filteredBookings.length }} bookings
            </span>
          </div>
        </div>
        <div class="table-wrapper">
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
                <th>{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="booking in paginatedBookings" :key="booking.id" class="table-row">
                <td>{{ booking.userName }}</td>
                <td>{{ booking.technicianName }}</td>
                <td>{{ booking.specialization || 'N/A' }}</td>
                <td>{{ booking.date }}</td>
                <td>{{ booking.time }}</td>
                <td>{{ booking.address }}</td>
                <td>{{ booking.price }}</td>
                <td class="booking-status">{{ $t('upcoming') }}</td>
                <td>
                    <div class="action-buttons">
                      <button 
                        class="delete-btn" 
                        @click="cancelBooking(booking.id)" 
                        :disabled="actionLoading === booking.id"
                        :title="$t('deleteBooking')"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
              </tr>
            </tbody>
          </table>
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
import { collection, getDocs, query, where, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useRouter } from 'vue-router';
import AdminSidebar from '../../components/admin-sidebar.vue';
import Pagination from '../../components/pagination.vue';
import TopBar from '../../components/TopBar.vue';

// Reactive data
const bookings = ref([]);
const searchQuery = ref('');
const actionLoading = ref(null);
const currentPage = ref(1);
const itemsPerPage = 10;
const router = useRouter();

// Fetch bookings on mount
onMounted(async () => {
  await fetchBookings();
});

// Fetch bookings from Firestore and enrich with technician specialization
async function fetchBookings() {
  try {
    const q = query(collection(db, 'bookings'), where('status', '==', 'upcoming'));
    const querySnapshot = await getDocs(q);

    const enriched = await Promise.all(
      querySnapshot.docs.map(async (snapshot) => {
        const bookingData = { id: snapshot.id, ...snapshot.data() };

        // If specialization missing on booking, try to fetch from technician profile
        if (!bookingData.specialization && bookingData.technicianId) {
          try {
            const techRef = doc(db, 'technicians', bookingData.technicianId);
            const techSnap = await getDoc(techRef);
            if (techSnap.exists()) {
              const tech = techSnap.data();
              const specialization = tech.specialization ||
                                    tech.service ||
                                    tech.services ||
                                    tech.category ||
                                    tech.type ||
                                    tech.jobType ||
                                    tech.workType ||
                                    tech.profession ||
                                    tech.trade ||
                                    tech.skill ||
                                    tech.skills ||
                                    'N/A';
              bookingData.specialization = specialization;

              // Backfill technician name if missing
              if (!bookingData.technicianName) {
                bookingData.technicianName = tech.name || tech.fullName || tech.displayName || bookingData.technicianName || 'N/A';
              }
            } else {
              bookingData.specialization = bookingData.specialization || 'N/A';
            }
          } catch (err) {
            console.error('Error fetching technician for booking', bookingData.id, err);
            bookingData.specialization = bookingData.specialization || 'N/A';
          }
        } else if (!bookingData.specialization) {
          // No technicianId to look up
          bookingData.specialization = 'N/A';
        }

        return bookingData;
      })
    );

    bookings.value = enriched;
  } catch (error) {
    console.error('Error fetching bookings:', error);
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

// Booking actions
function editBooking(booking) {
  router.push({
    name: 'admin-booking-details',
    params: { id: booking.id },
    query: { edit: 'true' },
    state: { booking },
  });
}

async function cancelBooking(bookingId) {
  if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
    return;
  }
  
  actionLoading.value = bookingId;
  try {
    await deleteDoc(doc(db, 'bookings', bookingId));
    // Remove the booking from the local array
    bookings.value = bookings.value.filter(booking => booking.id !== bookingId);
    alert('Booking cancelled successfully!');
  } catch (error) {
    console.error('Error cancelling booking:', error);
    alert('Failed to cancel booking. Please try again.');
  } finally {
    actionLoading.value = null;
  }
}
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

.booking-status {
  background: transparent;
  color: #779ce6 !important;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
  padding: 0; /* remove badge padding */
  border-radius: 0;
  border: none; /* remove badge border */
  transition: color 0.2s ease;
  cursor: default;
}

.booking-status:hover {
  background: transparent; /* keep no background on hover */
  color: #6b7280 !important;
  border-color: transparent;
  transform: none;
  box-shadow: none;
}


.edit-btn {
  background: none;
  color: #f59e0b !important;
  border: none;
  padding: 0.3rem 0.8rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.edit-btn:hover {
  color: #d97706 !important;
}

.delete-btn {
  color: #ef4444 !important;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.delete-btn:hover {
  color: #dc2626 !important;
}

.delete-btn:disabled {
  background: #fecaca;
  cursor: not-allowed;
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
</style>
