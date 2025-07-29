<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <Sidebar 
      :activeMenu="'booking'" 
      :activeBookingStatus="'upcoming'"
      userType="user"
      @navigate="handleSidebarNavigate" 
    />
    
    <!-- Main Content -->
    <div class="flex-1 p-8">
      <div class="user-dashboard-layout">
        <div class="booking-main">
          <div class="booking-container">
            <div class="title-search-row">
              <h2 class="booking-title">Upcoming Bookings</h2>
              <div class="search-wrapper">
                <input v-model="searchQuery" class="search-input" type="text" placeholder="Search" />
                <span class="search-icon"><i class="fas fa-search"></i></span>
              </div>
            </div>
            
            <!-- Manual Check Button -->
            <div class="action-row">
              <button 
                @click="checkExpiredBookings" 
                :disabled="checkingExpired"
                class="check-expired-btn"
              >
                <i v-if="checkingExpired" class="fas fa-spinner fa-spin"></i>
                <i v-else class="fas fa-clock"></i>
                {{ checkingExpired ? 'Checking...' : 'Check for Expired Bookings' }}
              </button>
              <div v-if="lastCheckResult" class="check-result" :class="lastCheckResult.success ? 'success' : 'error'">
                {{ lastCheckResult.message }}
              </div>
            </div>

            <div v-if="loading" class="loading-state">
              <div class="loading-spinner"></div>
              <p>Loading bookings...</p>
            </div>
            <div v-else-if="error" class="error-state">
              <p class="error-message">{{ error }}</p>
              <button @click="fetchBookings" class="retry-btn">Retry</button>
            </div>
            <div v-else-if="filteredBookings.length > 0" class="table-wrapper">
              <table class="booking-table">
                <thead>
                  <tr class="table-header">
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
                    <td>{{ booking.technicianName }}</td>
                    <td>{{ booking.specialization }}</td>
                    <td>{{ booking.date }}</td>
                    <td>{{ booking.time }}</td>
                    <td>{{ booking.address }}</td>
                    <td>{{ booking.price }}</td>
                    <td class="booking-status">{{ booking.status }}</td>
                    <td>
                      <button @click="cancelBooking(booking.id)" class="cancel-btn">
                        Cancel
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="empty-state">
              <p>No upcoming bookings found.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { collection, getDocs, query, where, updateDoc, doc, writeBatch } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'vue-router';
import Sidebar from '../components/Sidebar.vue';

const router = useRouter();
const searchQuery = ref('');
const bookings = ref([]);
const loading = ref(true);
const error = ref(null);
const userUid = ref(null);
const checkingExpired = ref(false);
const lastCheckResult = ref(null);

const functions = getFunctions();
const moveExpiredBookings = httpsCallable(functions, 'moveExpiredBookings');

const filteredBookings = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return bookings.value.filter(b =>
    Object.values(b).some(val => String(val).toLowerCase().includes(q))
  );
});

// Client-side function to check and move expired bookings
async function checkExpiredBookingsClientSide() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for comparison

    const expiredBookings = [];
    
    // Check each booking for expiration
    bookings.value.forEach(booking => {
      if (booking.date) {
        let bookingDate;
        
        // Handle different date formats
        if (typeof booking.date === 'string') {
          bookingDate = new Date(booking.date);
        } else if (booking.date.toDate) {
          // Firestore timestamp
          bookingDate = booking.date.toDate();
        } else {
          bookingDate = new Date(booking.date);
        }
        
        // Set to start of day for comparison
        bookingDate.setHours(0, 0, 0, 0);
        
        // If booking date is before today, mark as expired
        if (bookingDate < today) {
          expiredBookings.push(booking);
        }
      }
    });

    if (expiredBookings.length > 0) {
      // Use batch write to update all expired bookings
      const batch = writeBatch(db);
      
      expiredBookings.forEach(booking => {
        const bookingRef = doc(db, 'bookings', booking.id);
        batch.update(bookingRef, { 
          status: 'completed',
          completedAt: new Date()
        });
      });
      
      await batch.commit();
      
      return {
        success: true,
        movedCount: expiredBookings.length,
        message: `Successfully moved ${expiredBookings.length} expired bookings to completed`
      };
    } else {
      return {
        success: true,
        movedCount: 0,
        message: 'No expired bookings found'
      };
    }
  } catch (error) {
    console.error('Error moving expired bookings:', error);
    throw error;
  }
}

async function checkExpiredBookings() {
  try {
    checkingExpired.value = true;
    lastCheckResult.value = null;
    
    let result;
    
    // Try Firebase Functions first, fallback to client-side
    try {
      result = await moveExpiredBookings();
      lastCheckResult.value = result.data;
    } catch (functionsError) {
      console.log('Firebase Functions not available, using client-side solution');
      result = await checkExpiredBookingsClientSide();
      lastCheckResult.value = result;
    }
    
    // Refresh the bookings list after moving expired ones
    if (result.success && result.movedCount > 0) {
      await fetchBookings();
    }
  } catch (err) {
    console.error('Error checking expired bookings:', err);
    lastCheckResult.value = {
      success: false,
      message: 'Failed to check for expired bookings. Please try again.'
    };
  } finally {
    checkingExpired.value = false;
  }
}

async function fetchBookings() {
  try {
    loading.value = true;
    error.value = null;
    if (!userUid.value) {
      error.value = 'User not authenticated.';
      return;
    }
    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', userUid.value),
      where('status', '==', 'upcoming')
    );
    const snapshot = await getDocs(q);
    bookings.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    error.value = 'Failed to fetch bookings';
  } finally {
    loading.value = false;
  }
}

async function cancelBooking(bookingId) {
  if (confirm('Are you sure you want to cancel this booking?')) {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status: 'cancelled',
        cancelledAt: new Date()
      });
      await fetchBookings(); // Refresh the list
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Failed to cancel booking. Please try again.');
    }
  }
}

function handleSidebarNavigate(route) {
  if (route === 'logout') {
    const auth = getAuth();
    auth.signOut();
    router.push('/');
    return;
  }
  
  if (route.startsWith('/')) {
    router.push(route);
  }
}

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userUid.value = user.uid;
      fetchBookings().then(() => {
        // Automatically check for expired bookings when component loads
        checkExpiredBookings();
      });
    } else {
      error.value = 'User not authenticated.';
      loading.value = false;
    }
  });
});
</script>

<style scoped>
.user-dashboard-layout {
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

.action-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.check-expired-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #7c6bb0;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 0.9rem;
  font-weight: 500;
}

.check-expired-btn:hover:not(:disabled) {
  background: #6b5fa7;
}

.check-expired-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.check-result {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.check-result.success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.check-result.error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
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

.booking-status {
  background: #dbeafe;
  color: #1e40af;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.cancel-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-btn:hover {
  background: #dc2626;
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
  .action-row {
    flex-direction: column;
    align-items: flex-start;
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