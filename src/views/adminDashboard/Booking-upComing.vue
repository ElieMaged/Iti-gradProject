// UpcomingBooking.vue
<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="booking-main">
      <div class="booking-container">
        <div class="title-search-row">
          <h2 class="booking-title">Upcoming Booking</h2>
          <div class="search-wrapper">
            <input v-model="searchQuery" type="text" class="search-input" placeholder="Search" />
            <span class="search-icon"><i class="fas fa-search"></i></span>
          </div>
        </div>
        <div class="table-wrapper">
          <table class="booking-table">
            <thead>
              <tr class="table-header">
                <th>User Name</th>
                <th>Technician Name</th>
                <th>Specialization</th>
                <th>Date</th>
                <th>Time</th>
                <th>Address</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="booking in filteredBookings" :key="booking.id" class="table-row">
                <td>{{ booking.userName }}</td>
                <td>{{ booking.technicianName }}</td>
                <td>{{ booking.specialization }}</td>
                <td>{{ booking.date }}</td>
                <td>{{ booking.time }}</td>
                <td>{{ booking.address }}</td>
                <td>{{ booking.price }}</td>
                                 <td class="booking-status">{{ booking.status }}</td>
                                   <td>
                    <div class="action-buttons">
                      <button 
                        class="edit-btn" 
                        @click="editBooking(booking)"
                        title="Edit Booking"
                      >
                        <i class="fas fa-pen"></i>
                      </button>
                      <button 
                        class="delete-btn" 
                        @click="cancelBooking(booking.id)" 
                        :disabled="actionLoading === booking.id"
                        title="Delete Booking"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
              </tr>
            </tbody>
          </table>
        </div>
        <pagination />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useRouter } from 'vue-router';
import AdminSidebar from '../../components/admin-sidebar.vue';
import Pagination from '../../components/pagination.vue';

const bookings = ref([]);
const searchQuery = ref('');
const actionLoading = ref(null);
const router = useRouter();

onMounted(async () => {
  await fetchBookings();
});

async function fetchBookings() {
  const q = query(collection(db, 'bookings'), where('status', '==', 'upcoming'));
  const querySnapshot = await getDocs(q);
  bookings.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

function editBooking(booking) {
  router.push({
    name: 'admin-booking-details',
    params: { id: booking.id },
    query: { edit: 'true' },
    state: { booking }
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

const filteredBookings = computed(() => {
  if (!searchQuery.value.trim()) return bookings.value;
  const q = searchQuery.value.toLowerCase();
  return bookings.value.filter(b =>
    Object.values(b).some(val => String(val).toLowerCase().includes(q))
  );
});
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

.booking-status {
  background: none;
  color: #6b7280;
  padding: 0.2rem 0.6rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.edit-btn {
  background: none;
  color: #f59e0b;
  border: none;
  padding: 0.3rem 0.8rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.edit-btn:hover {
  color: #d97706;
}

.delete-btn {
  background: none;
  color: #ef4444;
  border: none;
  padding: 0.3rem 0.8rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.delete-btn:hover {
  color: #dc2626;
}

.delete-btn:disabled {
  background: #fecaca;
  cursor: not-allowed;
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
