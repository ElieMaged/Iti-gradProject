// UpcomingBooking.vue
<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <main id="main-content">
      <div id="upcoming-booking-wrapper">
        <div id="upcoming-booking-container">
          <h2 id="upcoming-booking-title">Upcoming Booking</h2>
          <div id="booking-search-bar-wrapper">
            <div id="booking-search-input-wrapper">
              <input v-model="searchQuery" type="text" id="booking-search-input" placeholder="Search" />
              <span id="booking-search-icon"><i class="fas fa-search"></i></span>
            </div>
          </div>
          <div id="booking-table-wrapper">
            <table id="booking-table">
              <thead>
                <tr id="booking-table-header">
                  <th>User Name</th>
                  <th>Technician Name</th>
                  <th>Specialization</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Address</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="booking in filteredBookings" :key="booking.id" class="booking-row">
                  <td>{{ booking.userName }}</td>
                  <td>{{ booking.technicianName }}</td>
                  <td>{{ booking.specialization }}</td>
                  <td>{{ booking.date }}</td>
                  <td>{{ booking.time }}</td>
                  <td>{{ booking.address }}</td>
                  <td>{{ booking.price }}</td>
                  <td class="booking-status">{{ booking.status }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <pagination />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import AdminSidebar from '../../components/admin-sidebar.vue';
import Pagination from '../../components/pagination.vue';

const bookings = ref([]);
const searchQuery = ref('');

onMounted(async () => {
  const q = query(collection(db, 'bookings'), where('status', '==', 'upcoming'));
  const querySnapshot = await getDocs(q);
  bookings.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
});

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
#main-content {
  flex: 1;
  padding: 2rem;
}

#upcoming-booking-wrapper {
  display: flex;
  min-height: 100vh;
}

#upcoming-booking-container {
  flex: 1;
  padding: 2rem;
  max-width: 1120px;
  margin: 0 auto;
}

#upcoming-booking-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #7c6bb0;
  margin-bottom: 0.5rem;
}

#booking-search-bar-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

#booking-search-input-wrapper {
  position: relative;
  width: 100%;
  max-width: 20rem;
}

#booking-search-input {
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border-radius: 9999px;
  border: 1px solid #ccc;
  width: 100%;
}

#booking-search-icon {
  position: absolute;
  top: 0.625rem;
  left: 0.75rem;
  color: #ccc;
}

#booking-table-wrapper {
  overflow-x: auto;
  border-radius: 0.75rem;
}

#booking-table {
  width: 100%;
  background-color: white;
  border-radius: 0.75rem;
}

#booking-table-header {
  background-color: rgba(124, 107, 176, 0.2);
  color: #333;
  text-align: left;
}

#booking-table-header th {
  padding: 0.75rem 1rem;
}

.booking-row {
  border-bottom: 1px solid #ddd;
  transition: background-color 0.2s;
}

.booking-row:hover {
  background-color: #ede7f6;
}

.booking-row td {
  padding: 0.75rem 1rem;
}

.booking-status {
  color: #22c55e;
  font-weight: 600;
}
</style>
