<template>
  <div class="pending-bookings-page">
    <!-- Main Content -->
    <div class="main-content">
      <!-- Sidebar -->
      <div class="sidebar">
        <div class="sidebar-menu">
          <div class="menu-item" @click="goToProfile">
            <i class="fa-regular fa-user"></i>
            <span>My Profile</span>
          </div>
          <div class="menu-item">
            <i class="fa-solid fa-gear"></i>
            <span>Settings</span>
          </div>
          <div class="menu-item">
            <i class="fa-regular fa-clock"></i>
            <span>Availability</span>
          </div>
          <div class="menu-item dropdown" @click="toggleBookingDropdown">
            <i class="fa-regular fa-calendar"></i>
            <span>My Booking</span>
            <i class="fa-solid fa-chevron-down dropdown-arrow" :class="{ 'rotated': isBookingDropdownOpen }"></i>
          </div>
          <div class="submenu" v-show="isBookingDropdownOpen">
            <div class="submenu-item" :class="{ 'active': currentStatus === 'pending' }" @click="setBookingStatus('pending')">
              <span>Pending</span>
            </div>
            <div class="submenu-item" :class="{ 'active': currentStatus === 'upcoming' }" @click="setBookingStatus('upcoming')">
              <span>Upcoming</span>
            </div>
            <div class="submenu-item" :class="{ 'active': currentStatus === 'completed' }" @click="setBookingStatus('completed')">
              <span>Completed</span>
            </div>
          </div>
          <div class="menu-item">
            <i class="fa-regular fa-credit-card"></i>
            <span>Payment</span>
          </div>
          <div class="menu-item">
            <i class="fa-regular fa-star"></i>
            <span>My Reviews</span>
          </div>
          <div class="menu-item">
            <i class="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div class="content-area">
        <h1 class="page-title">{{ getStatusTitle() }}</h1>
        
        <div class="bookings-container">
          <div v-for="booking in filteredBookings" :key="booking.id" class="booking-card">
            <div class="booking-header">
              <div class="customer-info">
                <div class="customer-name">
                  <i class="fa-regular fa-user"></i>
                  <span>{{ booking.customerName }}</span>
                </div>
                <div class="customer-phone">
                  <i class="fa-solid fa-phone"></i>
                  <span>{{ booking.phone }}</span>
                </div>
                <div class="booking-datetime">
                  <i class="fa-regular fa-calendar"></i>
                  <span>{{ booking.dateTime }}</span>
                </div>
                <div class="customer-address">
                  <i class="fa-solid fa-map-marker-alt"></i>
                  <span>{{ booking.address }}</span>
                </div>
              </div>
              <div class="booking-actions">
                <button v-if="currentStatus === 'pending'" class="btn-confirm">Confirm</button>
                <button v-if="currentStatus === 'pending'" class="btn-cancel">Cancel</button>
                <button v-if="currentStatus === 'upcoming'" class="btn-view">View Details</button>
                <button v-if="currentStatus === 'completed'" class="btn-review">Add Review</button>
              </div>
            </div>
            <div class="user-note">
              <strong>User Note:</strong> {{ booking.userNote }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PendingBookings',
  data() {
    return {
      isBookingDropdownOpen: false,
      currentStatus: 'pending',
      pendingBookings: [
        {
          id: 1,
          customerName: 'Sarah Mohamed',
          phone: '+20 111 555 2365',
          dateTime: '10:00AM , Friday , July 23',
          address: 'Cairo , Maadi , Street 256 ,Building 100',
          userNote: 'I have Problem With The Light Bulbs',
          status: 'pending'
        },
        {
          id: 2,
          customerName: 'Ahmed Salah',
          phone: '+20 111 555 2365',
          dateTime: '01:00PM , Friday , July 23',
          address: 'Cairo , Maadi , Street 256 ,Building 100',
          userNote: 'I have Problem With The Light Bulbs',
          status: 'pending'
        },
        {
          id: 3,
          customerName: 'Mostafa Ali',
          phone: '+20 111 555 2365',
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
          phone: '+20 111 555 2365',
          dateTime: '09:00AM , Monday , July 25',
          address: 'Cairo , Zamalek , Street 15 ,Building 25',
          userNote: 'Need electrical repair for kitchen appliances',
          status: 'upcoming'
        },
        {
          id: 5,
          customerName: 'Omar Khalil',
          phone: '+20 111 555 2365',
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
          phone: '+20 111 555 2365',
          dateTime: '11:00AM , Wednesday , July 20',
          address: 'Cairo , Nasr City , Street 45 ,Building 78',
          userNote: 'Fixed light installation',
          status: 'completed'
        },
        {
          id: 7,
          customerName: 'Karim Youssef',
          phone: '+20 111 555 2365',
          dateTime: '03:00PM , Thursday , July 21',
          address: 'Cairo , Dokki , Street 33 ,Building 55',
          userNote: 'Resolved electrical wiring issue',
          status: 'completed'
        }
      ]
    };
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

/* Sidebar */
.sidebar {
  width: 250px;
  background: #f8f5ff;
  padding: 2rem 0;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  cursor: pointer;
  transition: background 0.2s;
  color: #625397;
}

.menu-item:hover {
  background: #e8e0ff;
}

.menu-item.active {
  background: #625397;
  color: white;
}

.menu-item i {
  width: 20px;
  text-align: center;
}

.menu-item.dropdown {
  cursor: pointer;
}

.dropdown-arrow {
  transition: transform 0.3s ease;
  margin-left: auto;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

.submenu {
  margin-left: 48px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: all 0.3s ease;
}

.submenu-item {
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.2s;
  color: #625397;
  font-size: 0.9rem;
}

.submenu-item:hover {
  background: #e8e0ff;
}

.submenu-item.active {
  background: #625397;
  color: white;
  border-radius: 4px;
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

.bookings-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.booking-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.customer-name,
.customer-phone,
.booking-datetime,
.customer-address {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
}

.customer-name {
  font-weight: 600;
  font-size: 1.1rem;
}

.customer-name i,
.customer-phone i,
.booking-datetime i,
.customer-address i {
  color: #625397;
  width: 16px;
}

.booking-actions {
  display: flex;
  gap: 8px;
}

.btn-confirm,
.btn-cancel,
.btn-view,
.btn-review {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-confirm {
  background: #4CAF50;
  color: white;
}

.btn-confirm:hover {
  background: #45a049;
}

.btn-cancel {
  background: #f44336;
  color: white;
}

.btn-cancel:hover {
  background: #da190b;
}

.btn-view {
  background: #2196F3;
  color: white;
}

.btn-view:hover {
  background: #1976D2;
}

.btn-review {
  background: #FF9800;
  color: white;
}

.btn-review:hover {
  background: #F57C00;
}

.user-note {
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
  color: #666;
  line-height: 1.5;
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
</style> 