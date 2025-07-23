<template>
  <div class="pending-bookings-page">
    <!-- Main Content -->
    <div class="main-content">
      <Sidebar
        :activeMenu="'booking'"
        :activeBookingStatus="currentStatus"
        @set-booking-status="setBookingStatus"
        @navigate="handleSidebarNavigate"
      />
      <!-- Content Area -->
      <div class="content-area">
        <h1 class="page-title">
            <span v-if="currentStatus === 'pending'">Pending Bookings</span>
            <span v-else-if="currentStatus === 'upcoming'">Upcoming Bookings</span>
            <span v-else-if="currentStatus === 'completed'">Completed Bookings</span>
          </h1>
          <div class="bookings-grid">
            <div v-for="booking in filteredBookings" :key="booking.id" class="booking-card-standard">
              <div class="booking-card-header">
                <div class="booking-avatar">
                  <i class="fa-regular fa-user"></i>
                </div>
                <div class="booking-info">
                  <div class="booking-main-info">
                    <div class="booking-name">{{ booking.customerName }}</div>
                    <div class="booking-phone">{{ booking.phone }}</div>
                  </div>
                  <div class="booking-info booking-details-info">
                    <div class="booking-datetime"><i class="fa-regular fa-calendar"></i> {{ booking.dateTime }}</div>
                    <div class="booking-address"><i class="fa-solid fa-location-dot"></i> {{ booking.address }}</div>
                  </div>
                </div>
                <div v-if="currentStatus === 'pending'" class="booking-actions-standard">
                  <button class="btn-confirm" @click="handleConfirm(booking)">Confirm</button>
                  <button class="btn-cancel">Cancel</button>
                </div>
                <div v-else-if="currentStatus === 'upcoming'" class="booking-actions-standard">
                  <button class="btn-confirmed">Confirmed</button>
                  <button class="btn-cancel">Cancel</button>
                </div>
                <div v-else-if="currentStatus === 'completed'" class="booking-actions-standard">
                  <span class="booking-completed">Completed</span>
                </div>
              </div>
              <div class="booking-user-note-row">
                <div class="booking-user-note">
                  <strong>User Note:</strong> {{ booking.userNote }}
                </div>
                <div v-if="currentStatus === 'completed'" class="booking-price">Price:250 EGP</div>
                <div v-else class="booking-price" style="visibility: hidden;">Price:250 EGP</div>
              </div>
            </div>
          </div>
          <div class="pagination-row">
            <button class="pagination-btn" :disabled="currentPage === 1">«</button>
            <button class="pagination-btn" :class="{ active: currentPage === 1 }">1</button>
            <button class="pagination-btn">2</button>
            <button class="pagination-btn">3</button>
            <span class="pagination-ellipsis">...</span>
            <button class="pagination-btn">10</button>
            <button class="pagination-btn">»</button>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';

export default {
  name: 'PendingBookings',
  components: {
    Sidebar
  },
  data() {
    return {
      isBookingDropdownOpen: false,
      currentStatus: 'pending',
      pendingBookings: [
        {
          id: 1,
          customerName: 'Sarah Mohamed',
          phone: '0 111 555 2365',
          dateTime: '10:00AM , Friday , July 23',
          address: 'Cairo , Maadi , Street 256 ,Building 100',
          userNote: 'I have Problem With The Light Bulbs',
          status: 'pending'
        },
        {
          id: 2,
          customerName: 'Ahmed Salah',
          phone: '0 111 555 2365',
          dateTime: '01:00PM , Friday , July 23',
          address: 'Cairo , Maadi , Street 256 ,Building 100',
          userNote: 'I have Problem With The Light Bulbs',
          status: 'pending'
        },
        {
          id: 3,
          customerName: 'Mostafa Ali',
          phone: '0 111 555 2365',
          dateTime: '05:00PM , Saturday , July 23',
          address: 'Cairo , Maadi , Street 256 ,Building 100',
          userNote: 'I have Problem With The Light Bulbs',
          status: 'pending'
        }
      ],
      upcomingBookings: [
        {
          id: 4,
          customerName: 'Fatima Hassan',
          phone: '0 111 555 2365',
          dateTime: '09:00AM , Monday , July 25',
          address: 'Cairo , Zamalek , Street 15 ,Building 25',
          userNote: 'Need electrical repair for kitchen appliances',
          status: 'upcoming'
        },
        {
          id: 5,
          customerName: 'Omar Khalil',
          phone: '0 111 555 2365',
          dateTime: '02:00PM , Tuesday , July 26',
          address: 'Cairo , Heliopolis , Street 8 ,Building 12',
          userNote: 'Plumbing issue in bathroom',
          status: 'upcoming'
        }
      ],
      completedBookings: [
        {
          id: 6,
          customerName: 'Layla Ahmed',
          phone: '0 111 555 2365',
          dateTime: '11:00AM , Wednesday , July 20',
          address: 'Cairo , Nasr City , Street 45 ,Building 78',
          userNote: 'Fixed light installation',
          status: 'completed'
        },
        {
          id: 7,
          customerName: 'Karim Youssef',
          phone: '0 111 555 2365',
          dateTime: '03:00PM , Thursday , July 21',
          address: 'Cairo , Dokki , Street 33 ,Building 55',
          userNote: 'Resolved electrical wiring issue',
          status: 'completed'
        }
      ]
    };
  },
  watch: {
    '$route.query.status': {
      immediate: true,
      handler(newStatus) {
        if (["pending", "upcoming", "completed"].includes(newStatus)) {
          this.currentStatus = newStatus;
        } else {
          this.currentStatus = "pending";
        }
      }
    }
  },
  computed: {
    filteredBookings() {
      switch (this.currentStatus) {
        case 'pending':
          return this.pendingBookings;
        case 'upcoming':
          return this.upcomingBookings;
        case 'completed':
          return this.completedBookings;
        default:
          return this.pendingBookings;
      }
    }
  },
  methods: {
    toggleBookingDropdown() {
      this.isBookingDropdownOpen = !this.isBookingDropdownOpen;
    },
    setBookingStatus(status) {
      this.currentStatus = status;
      this.isBookingDropdownOpen = false;
    },
    handleConfirm(booking) {
      // Remove from pendingBookings
      this.pendingBookings = this.pendingBookings.filter(b => b.id !== booking.id);
      // Add to upcomingBookings
      this.upcomingBookings.push({ ...booking, status: 'upcoming' });
    },
    getStatusTitle() {
      switch (this.currentStatus) {
        case 'pending':
          return 'Pending Bookings';
        case 'upcoming':
          return 'Upcoming Bookings';
        case 'completed':
          return 'Completed Bookings';
        default:
          return 'Pending Bookings';
      }
    },
    goToProfile()
    {
      this.$router.push('/profile');
    },
    goToSettings()
    {
      this.$router.push('/settings');
    },
    goToPayment()
    {
      this.$router.push('/payment');
    },
    handleSidebarNavigate(path) {
      this.$router.push(path);
    }
  }
};
</script>

<style scoped>
.pending-bookings-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* Main Content */
.main-content {
  display: flex;
  min-height: calc(100vh - 120px);
}


/* Content Area */
.content-area {
  flex: 1;
  background: white;
  padding: 10px 60px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #625397;
  margin-bottom: 2rem;
  font-family: Outfit, sans-serif;
}

.bookings-container, .bookings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.booking-card, .booking-card-standard {
  position: relative;
  border-radius: 16px;
  border: 1.5px solid #fff;
  color: #444;
  padding: 1rem 0.75rem;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.10);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  box-sizing: border-box;
}

.booking-header, .booking-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.booking-avatar {
  width: 36px;
  height: 36px;
  background: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #888;
}

.booking-main-info {
  display: flex;
  flex-direction: column;
  margin-left: 12px;
}

.booking-name {
  font-weight: 700;
  font-size: 1.1rem;
  color: #444;
}


.booking-actions, .booking-actions-standard {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
}

.btn-confirm, .btn-confirmed {
  display: flex;
  height: 36px;
  padding: 12px 20px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 58px;
  border: 1px solid var(--success-500, #00C814);
  background: var(--success-500, #00C814);
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-confirmed{
  color: #00C814;
  background-color: white;
  border: none;
}

.btn-cancel {
  display: flex;
  height: 36px;
  padding: 12px 20px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 58px;
  border: 1px solid #E10000;
  background: #E10000;
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.booking-datetime, .booking-address {
  align-items: center;
  gap: 8px;
  font-size: 1rem;
}

.booking-datetime i, .booking-address i {
  color: #888;
  font-size: 1.1rem;
}

.booking-user-note-row {
  margin-top: 0.2rem;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 2rem;
}

.booking-user-note {
  color: #444;
  font-size: 1rem;
}

.booking-price {
  color: #625397;
  font-weight: 700;
  font-size: 1.1rem;
}

.pagination-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.pagination-btn {
  background: #fff;
  border: 1.5px solid #C2C3C4;
  border-radius: 24px;
  padding: 6px 18px;
  font-size: 1rem;
  color: #625397;
  cursor: pointer;
  margin: 0 2px;
  transition: background 0.2s, color 0.2s, border 0.2s;
}

.pagination-btn.active,
.pagination-btn:hover {
  background: #625397;
  color: #fff;
  border: 1.5px solid #625397;
}

.pagination-btn:disabled {
  background: #e0e0e0;
  color: #aaa;
  cursor: not-allowed;
}

.pagination-ellipsis {
  color: #aaa;
  font-size: 1.1rem;
  margin: 0 4px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .contact-header {
    flex-direction: column;
    gap: 8px;
    padding: 12px 1rem;
  }
  
  .contact-info {
    flex-direction: column;
    gap: 4px;
  }
  
  .nav-container {
    flex-direction: column;
    gap: 12px;
  }
  
  .nav-center {
    gap: 1rem;
  }
  
  .main-content {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    padding: 1rem 0;
  }
  
  .sidebar-menu {
    flex-direction: row;
    overflow-x: auto;
    padding: 0 1rem;
  }
  
  .menu-item {
    white-space: nowrap;
    padding: 8px 16px;
  }
  
  .submenu {
    display: none;
  }
  
  .content-area {
    padding: 1rem;
  }
  
  .booking-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .booking-actions {
    align-self: flex-end;
  }
}

@media (max-width: 900px) {
  .bookings-container, .bookings-grid {
    grid-template-columns: 1fr;
  }
}
</style>