<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="booking-main">
      <div class="booking-container">
        <div class="title-search-row">
          <h2 class="booking-title">Pending Booking</h2>
          <div class="search-wrapper">
            <input v-model="searchQuery" class="search-input" type="text" placeholder="Search" />
            <span class="search-icon"><i class="fas fa-search"></i></span>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading bookings...</p>
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
                <th>User Name</th>
                <th>User Email</th>
                <th>Technician</th>
                <th>Specialization</th>
                <th>Date</th>
                <th>Time</th>
                <th>Address</th>
                <th>Price</th>
                <th>Status</th>
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

        <!-- Empty State -->
        <div v-else class="empty-state">
          <p>No pending bookings found.</p>
        </div>
        <pagination />
      </div>
    </div>
  </div>
</template>

<script>
import AdminSidebar from '../../components/admin-sidebar.vue';
import Pagination from '../../components/pagination.vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

export default {
  name: 'PendingBooking',
  components: {
    AdminSidebar,
    Pagination
  },
  data() {
    return {
      searchQuery: '',
      bookings: [],
      loading: true,
      error: null
    };
  },
  computed: {
    filteredBookings() {
      const q = this.searchQuery.toLowerCase();
      return this.bookings.filter(b =>
        Object.values(b).some(val => String(val).toLowerCase().includes(q))
      );
    },
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
        this.bookings = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(booking => booking.status && booking.status.toLowerCase() === 'pending');
      } catch (e) {
        this.error = 'Failed to fetch bookings';
      } finally {
        this.loading = false;
      }
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

.booking-main {
  flex: 1;
  padding: 2.5rem;
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
  