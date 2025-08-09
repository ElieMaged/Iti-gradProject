<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="booking-main mx-12 p-4">
      <TopBar :title="$t('pendingBookings')" />
      <div class="booking-container">
        <div class="title-search-row">
          <div class="search-wrapper">
            <input v-model="searchQuery" class="search-input" type="text" :placeholder="$t('search')" />
            <span class="search-icon"><i class="fas fa-search"></i></span>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>{{ $t('loadingBookings') }}</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <p class="error-message">{{ $t('failedToFetchBookings') }}</p>
          <button @click="fetchBookings" class="retry-btn">{{ $t('retry') }}</button>
        </div>

        <!-- Bookings Table -->
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
              <tr v-for="(booking, index) in paginatedBookings" :key="booking.id" class="table-row">
                <td>{{ booking.userName || 'N/A' }}</td>
                <td>{{ booking.userEmail || 'N/A' }}</td>
                <td>{{ booking.technicianName || 'N/A' }}</td>
                <td>{{ booking.specialization || 'N/A' }}</td>
                <td>{{ booking.date || 'N/A' }}</td>
                <td>{{ booking.time || 'N/A' }}</td>
                <td>{{ booking.address || 'N/A' }}</td>
                <td>{{ booking.price || 'N/A' }}</td>
                <td><span class="status-pending">{{ $t('pending') }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <pagination
          v-if="totalPages > 1"
          :total-pages="totalPages"
          :initial-page="currentPage"
          @page-changed="handlePageChange"
        />

        <!-- Empty State -->
        <div v-else class="empty-state">
          <p>{{ $t('noPendingBookingsFound') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminSidebar from '../../components/admin-sidebar.vue';
import Pagination from '../../components/pagination.vue';
import TopBar from '../../components/TopBar.vue';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default {
  name: 'PendingBooking',
  components: {
    AdminSidebar,
    Pagination,
    TopBar
  },
  data() {
    return {
      activeTab: 'pending',
      searchQuery: '',
      bookings: [],
      loading: true,
      error: null,
      currentPage: 1,
      bookingsPerPage: 15
    };
  },
  computed: {
    filteredBookings() {
      const q = this.searchQuery.toLowerCase();
      return this.bookings.filter(b =>
        Object.values(b).some(val => String(val).toLowerCase().includes(q))
      );
    },
    
    paginatedBookings() {
      const startIndex = (this.currentPage - 1) * this.bookingsPerPage;
      const endIndex = startIndex + this.bookingsPerPage;
      return this.filteredBookings.slice(startIndex, endIndex);
    },
    
    totalPages() {
      return Math.ceil(this.filteredBookings.length / this.bookingsPerPage);
    }
  },
  async mounted() {
    await this.fetchBookings();
  },
  methods: {
    async fetchBookings() {
      try {
        this.loading = true;
        this.error = null;
        const snapshot = await getDocs(collection(db, 'bookings'));
        const now = new Date();
        const pending = [];
        
        for (const docSnap of snapshot.docs) {
          const booking = { id: docSnap.id, ...docSnap.data() };
          if (booking.status && booking.status.toLowerCase() === 'pending') {
            // Parse booking date and time
            let bookingDate = new Date(booking.date);
            // If time is present, try to parse it for more accuracy
            if (booking.time) {
              // Example: '4 - 5 pm' or '16:00'
              const timeMatch = booking.time.match(/(\d{1,2})(?::(\d{2}))?\s*-\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
              if (timeMatch) {
                let hour = parseInt(timeMatch[1]);
                let minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
                const ampm = timeMatch[5];
                if (ampm && ampm.toLowerCase() === 'pm' && hour < 12) hour += 12;
                bookingDate.setHours(hour, minute, 0, 0);
              }
            }
            if (bookingDate < now) {
              // Move to completed
              await updateDoc(doc(db, 'bookings', booking.id), { status: 'completed' });
            } else {
              // Fetch technician information to get specialization
              if (booking.technicianId) {
                try {
                  const technicianDoc = await getDocs(collection(db, 'technicians'));
                  const technician = technicianDoc.docs.find(doc => doc.id === booking.technicianId);
                  if (technician) {
                    booking.specialization = technician.data().specialization || 'N/A';
                    booking.technicianName = technician.data().name || booking.technicianId;
                  } else {
                    booking.specialization = 'N/A';
                  }
                } catch (error) {
                  console.error('Error fetching technician data:', error);
                  booking.specialization = 'N/A';
                }
              } else {
                booking.specialization = 'N/A';
              }
              pending.push(booking);
            }
          }
        }
        this.bookings = pending;
      } catch (e) {
        this.error = 'Failed to fetch bookings';
        console.error('Error fetching bookings:', e);
      } finally {
        this.loading = false;
      }
    },
    
    handlePageChange(page) {
      this.currentPage = page;
      // Scroll to top of table when changing pages
      this.$nextTick(() => {
        const tableWrapper = this.$el.querySelector('.table-wrapper');
        if (tableWrapper) {
          tableWrapper.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }
};
</script>

<style scoped>
.admin-dashboard-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
  background: #faf8fd;
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
.dark .booking-table {
  background-color: var(--grey-bg);
  color: var(--primary-text);
}
.dark .table-header th {
  color: var(--primary-text);
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
  max-width: 200px;
  word-wrap: break-word;
  overflow-wrap: break-word;
}
.dark .table-row {
  background-color: var(--input-bg);
  color: var(--text-muted);
}
.dark .table-row:hover {
  background-color: var(--icon-color);
}
.status-pending {
  color: #92400e !important;
  font-size: 0.75rem;
  font-weight: 600;
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

/* Pagination styles */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}
</style>
  