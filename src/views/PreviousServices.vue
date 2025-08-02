<template>  
  <div class="flex min-h-screen">
    <userSidebar :activeTab="activeTab" />
    <div class="flex-1 p-8">
      <div class="max-w-6xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-text-main dark:text-white">{{ $t('previousServicesTitle') }}</h1>
          <p class="text-gray-600 dark:text-gray-300">{{ $t('previousServicesDescription') }}</p>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="loading-spinner"></div>
          <p class="ml-3 text-gray-600">{{ $t('loadingHistory') }}</p>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-500 mb-4">{{ error }}</p>
          <button @click="fetchUserBookings" class="bg-secondary text-white px-4 py-2 rounded-lg">
            {{ $t('retry') }}
          </button>
        </div>
        
        <!-- Empty State -->
        <div v-else-if="paginatedServices.length === 0" class="text-center py-12">
          <i class="fas fa-history text-4xl text-gray-400 mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-600 mb-2">{{ $t('noBookingHistory') }}</h3>
          <p class="text-gray-500">{{ $t('noBookingHistoryDescription') }}</p>
        </div>
        
        <!-- Service Cards -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div v-for="(booking, idx) in paginatedServices" :key="booking.id" class="service-card bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                  <i class="fas fa-user text-white text-sm"></i>
                </div>
                <div>
                  <h3 class="font-semibold text-text-main">{{ booking.technicianName || booking.technicianId }}</h3>
                  <p class="text-sm text-gray-600">{{ booking.technicianEmail || 'N/A' }}</p>
                  <h3 class="font-semibold text-text-main dark:text-white">{{ service.technician }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300">{{ service.phone }}</p>
                </div>
              </div>
              <span :class="getStatusBadgeClass(booking.status)" class="text-xs font-medium px-2.5 py-0.5 rounded">{{ getStatusTranslation(booking.status) }}</span>
              <span class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium px-2.5 py-0.5 rounded">{{ $t('completed') }}</span>
            </div>
            <div class="space-y-3 mb-4">
              <div class="flex items-center space-x-2">
                <i class="fas fa-wrench text-secondary text-sm"></i>
                <span class="text-sm text-text-main">{{ booking.specialization || 'N/A' }}</span>
                <span class="text-sm text-text-main dark:text-white">{{ service.type }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <i class="fas fa-calendar text-secondary text-sm"></i>
                <span class="text-sm text-text-main">{{ booking.date }} at {{ booking.time }}</span>
                <span class="text-sm text-text-main dark:text-white">{{ service.time }}</span>
              </div>
              <div class="flex items-start space-x-2">
                <i class="fas fa-map-marker-alt text-secondary text-sm mt-1"></i>
                <div>
                  <span class="text-sm font-medium text-text-main">{{ $t('address') }}:</span>
                  <p class="text-sm text-gray-600">{{ booking.address || 'Address not provided' }}</p>
                  <span class="text-sm font-medium text-text-main dark:text-white">{{ $t('review') }}:</span>
                  <p class="text-sm text-gray-600 dark:text-gray-300">{{ service.review }}</p>
                </div>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-lg font-bold text-secondary">{{ $t('price') }}: {{ booking.price || 'N/A' }} EGP</span>
              <button class="book-again-btn bg-secondary text-white px-4 py-2 rounded-lg text-sm font-medium" @click="bookAgain(booking)">
                {{ $t('bookAgain') }}
              </button>
            </div>
          </div>
        </div>
        <!-- Pagination Component -->
        <Pagination 
          :total-pages="totalPages" 
          :initial-page="currentPage"
          @page-changed="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import Pagination from '../components/pagination.vue';
import userSidebar from '../components/userSidebar.vue';

const router = useRouter();

const activeTab = ref('history');
const services = ref([]);
const loading = ref(true);
const error = ref(null);
const currentUser = ref(null);
const currentPage = ref(1);
const pageSize = 4;

const totalPages = computed(() => Math.ceil(services.value.length / pageSize));

const paginatedServices = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return services.value.slice(start, start + pageSize);
});

async function fetchUserBookings() {
  try {
    loading.value = true;
    error.value = null;
    
    if (!currentUser.value) {
      error.value = 'User not authenticated.';
      return;
    }
    
    console.log('Fetching expired bookings for user:', currentUser.value.uid);
    
    // Get current date and time
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format
    const currentTime = now.toTimeString().split(' ')[0]; // HH:MM:SS format
    
    // Query all bookings for the user
    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('userId', '==', currentUser.value.uid),
      orderBy('date', 'desc')
    );
    
    const snapshot = await getDocs(bookingsQuery);
    console.log('Found all bookings:', snapshot.docs.length);
    
    const userBookings = [];
    
    for (const doc of snapshot.docs) {
      const bookingData = { id: doc.id, ...doc.data() };
      
      // Check if booking is expired (date has passed or date is today but time has passed)
      const bookingDate = bookingData.date;
      const bookingTime = bookingData.time;
      
      if (bookingDate && bookingTime) {
        const isExpired = isBookingExpired(bookingDate, bookingTime, currentDate, currentTime);
        
        if (isExpired) {
          // Format the date for display
          const bookingDateTime = new Date(`${bookingDate}T${bookingTime}`);
          bookingData.formattedDate = bookingDateTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          
          userBookings.push(bookingData);
        }
      }
    }
    
    services.value = userBookings;
    console.log('User expired booking history loaded:', userBookings.length, 'bookings');
    
  } catch (err) {
    console.error('Error fetching user bookings:', err);
    error.value = 'Failed to load booking history: ' + err.message;
  } finally {
    loading.value = false;
  }
}

// Helper function to check if a booking is expired
function isBookingExpired(bookingDate, bookingTime, currentDate, currentTime) {
  // If booking date is before current date, it's expired
  if (bookingDate < currentDate) {
    return true;
  }
  
  // If booking date is today, check if time has passed
  if (bookingDate === currentDate) {
    return bookingTime <= currentTime;
  }
  
  // If booking date is in the future, it's not expired
  return false;
}

// Helper function to get status translation
function getStatusTranslation(status) {
  const statusMap = {
    'pending': 'Pending',
    'upcoming': 'Upcoming',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
    'expired': 'Expired'
  };
  return statusMap[status] || status;
}

// Helper function to get status badge class
function getStatusBadgeClass(status) {
  const classMap = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'upcoming': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
    'expired': 'bg-gray-100 text-gray-800'
  };
  return classMap[status] || 'bg-gray-100 text-gray-800';
}

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page;
}
function handlePageChange(page) {
  currentPage.value = page;
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function bookAgain(booking) {
  // Navigate to the appropriate service page based on specialization
  const specialization = booking.specialization?.toLowerCase();
  let serviceRoute = '/allservices'; // Default route
  
  if (specialization) {
    if (specialization.includes('electricity') || specialization.includes('electrical')) {
      serviceRoute = '/electricity';
    } else if (specialization.includes('plumbing')) {
      serviceRoute = '/plumbing';
    } else if (specialization.includes('carpentry')) {
      serviceRoute = '/carpentry';
    } else if (specialization.includes('air') || specialization.includes('ac')) {
      serviceRoute = '/aircondition';
    } else if (specialization.includes('wall') || specialization.includes('finishing')) {
      serviceRoute = '/wallfinishing';
    }
  }
  
  router.push(serviceRoute);
}

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser.value = user;
      console.log('User authenticated:', user.uid);
      fetchUserBookings();
    } else {
      error.value = 'User not authenticated.';
      loading.value = false;
    }
  });
});


</script>

<style scoped>
.sidebar-item {
  transition: all 0.2s ease;
}
.sidebar-item:hover {
  background-color: #c5b7e6;
  color: white;
}
.sidebar-item.active {
  background-color: #7c6bb0;
  color: white;
}
.service-card {
  transition: all 0.2s ease;
}
.service-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.book-again-btn {
  transition: all 0.2s ease;
  border-radius: 25px;
}
.book-again-btn:hover {
  background-color: #5e4b8b;
  transform: scale(1.05);
}
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #7c6bb0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.bg-primary {
  background-color: #ffd54f;
}
.bg-secondary {
  background-color: #7c6bb0;
}
.bg-sidebar {
  background-color: #ede7f6;
}
.text-primary {
  color: #ffd54f;
}
.text-secondary {
  color: #7c6bb0;
}
.text-text-main {
  color: #333333;
}
.text-muted {
  color: #aaaaaa;
}

/* Dark mode styling similar to Payment.vue */
.dark .bg-primary {
  background-color: var(--primary-color) !important;
}
.dark .bg-secondary {
  background-color: var(--sidebar) !important;
}
.dark .bg-sidebar {
  background-color: var(--sidebar) !important;
}
.dark .text-primary {
  color: var(--primary-color) !important;
}
.dark .text-secondary {
  color: var(--sidebar) !important;
}
.dark .text-text-main {
  color: var(--primary-text) !important;
}
.dark .text-muted {
  color: var(--primary-text) !important;
}
.dark .service-card {
  background-color: var(--secondary-bg) !important;
}
.dark .sidebar-item {
  background-color: var(--sidebar) !important;
}
.dark .sidebar-item:hover {
  background-color: var(--primary-color) !important;
}
.dark .sidebar-item.active {
  background-color: var(--primary-color) !important;
}

/* Dark mode transitions */
* {
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

/* Dark mode specific styling */
.dark .service-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dark .book-again-btn:hover {
  background-color: var(--primary-color) !important;
}

/* Dark mode background support */
.dark {
  background-color: var(--primary-bg);
  color: var(--primary-text);
}


.dark .text-gray-600 {
  color: var(--text-muted);
}

.dark .text-gray-500 {
  color: var(--text-muted);
}

.dark .border-gray-300 {
  border-color: var(--border-color);
}

.dark .hover\:bg-gray-50:hover {
  background-color: var(--hover-bg);
}
</style> 