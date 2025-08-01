<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="booking-main mr-20 p-4">
      <div class="booking-container">
        <div class="title-search-row">
          <h2 class="booking-title">{{ $t('canceledBookings') }}</h2>
          <div class="search-wrapper">
            <input v-model="searchQuery" class="search-input" type="text" :placeholder="$t('search')" />
            <span class="search-icon"><i class="fas fa-search"></i></span>
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
              </tr>
            </thead>
            <tbody>
              <tr v-for="(booking, index) in filteredBookings" :key="index" class="table-row">
                <td>{{ booking.userName }}</td>
                <td>{{ booking.technicianName }}</td>
                <td>{{ booking.specialization }}</td>
                <td>{{ booking.date }}</td>
                <td>{{ booking.time }}</td>
                <td>{{ booking.address }}</td>
                <td>{{ booking.price }}</td>
                <td class="status-canceled">{{ $t('canceled') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <pagination />
      </div>
    </div>
  </div>
</template>

<script>
import AdminSidebar from '../../components/admin-sidebar.vue';
import Pagination from '../../components/pagination.vue';

export default {
  name: 'CanceledBooking',
  components: {
    AdminSidebar,
    Pagination
  },
  data() {
    return {
      activeTab: 'canceled',
      searchQuery: '',
      bookings: [
        {
          userName: 'Mohamed Ahmed',
          technicianName: 'Samir Ahmed',
          specialization: 'Carpenter',
          date: '10 July 2025',
          time: '4 - 5 pm',
          address: '12 main street, Giza',
          price: '300',
          status: 'Canceled',
        },
        // You can add more booking entries here
      ],
    };
  },
  computed: {
    filteredBookings() {
      if (!this.searchQuery.trim()) return this.bookings;
      const query = this.searchQuery.toLowerCase();
      return this.bookings.filter(b =>
        Object.values(b).some(val =>
          String(val).toLowerCase().includes(query)
        )
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
  max-width: 80rem;
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
  text-align: left;
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
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  color: #333;
}

.status-canceled {
  color: #991b1b !important;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  border: 1px solid #991b1b;
  transition: all 0.2s ease;
  cursor: pointer;
}

.status-canceled:hover {
  background: var(--primary-color);
  color: white !important;
  border-color: var(--primary-color);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
