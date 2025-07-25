<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <main id="main-content">
      <div id="container">
        <h2 id="page-title">Pending Booking</h2>
        <div id="search-wrapper">
          <div id="search-input-wrapper">
            <input v-model="searchQuery" id="search-input" type="text" placeholder="Search" />
            <span id="search-icon"><i class="fas fa-search"></i></span>
          </div>
        </div>
        <div id="table-wrapper">
          <table>
            <thead>
              <tr>
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
              <tr v-for="(booking, index) in filteredBookings" :key="index">
                <td>{{ booking.userName }}</td>
                <td>{{ booking.technicianName }}</td>
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
        <pagination />
      </div>
    </main>
  </div>
</template>

<script>
import AdminSidebar from '../../components/admin-sidebar.vue';
import Pagination from '../../components/pagination.vue';

export default {
  name: 'PendingBooking',
  components: {
    AdminSidebar,
    Pagination
  },
  data() {
    return {
      searchQuery: '',
      bookings: Array(8).fill({
        userName: 'Mohamed Ahmed',
        technicianName: 'Samir Ahmed',
        specialization: 'Carpenter',
        date: '10 July 2025',
        time: '4 - 5 pm',
        address: '12 main street, Giza',
        price: '300',
        status: 'Pending',
      }),
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
};
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

#container {
  max-width: 1120px;
  margin: 0 auto;
}

#page-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #7c6bb0;
  margin-bottom: 0.5rem;
}

#search-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

#search-input-wrapper {
  position: relative;
  width: 100%;
  max-width: 256px;
}

#search-input {
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 9999px;
  width: 100%;
}

#search-icon {
  position: absolute;
  top: 0.625rem;
  left: 0.75rem;
  color: #9ca3af;
}

#table-wrapper {
  overflow-x: auto;
  border-radius: 0.75rem;
}

table {
  width: 100%;
  background-color: white;
  border-radius: 0.75rem;
  border-collapse: collapse;
}

thead tr {
  background-color: rgba(124, 107, 176, 0.2);
  color: #333333;
  text-align: left;
}

th,
td {
  padding: 0.75rem 1rem;
}

tbody tr {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s ease;
}

tbody tr:hover {
  background-color: #ede7f6;
}

.status-pending {
  color: #f59e42;
  font-weight: 600;
}
</style>
  