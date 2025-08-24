<template>
  <div class="flex min-h-screen layout-container">
    <!-- Sidebar -->
    <Sidebar :activeMenu="'booking'" :activeBookingStatus="'upcoming'" @navigate="handleSidebarNavigate" />
    <!-- Main Content -->
    <div class="flex-1 main-layout">
      <!-- Notification Toast -->
      <div v-if="showNotification" class="notification-toast" :class="notificationType">
        <div class="notification-content">
          <i :class="getNotificationIcon()"></i>
          <span>{{ notificationMessage }}</span>
        </div>
        <button @click="showNotification = false" class="notification-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="technician-dashboard-layout p-4 mx-12">
        <div class="booking-main">
          <div class="booking-container">
            <div class="title-search-row">
              <TopBar :title="$t('upcomingBookings')" />
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
              <div class="auto-check-status">
                <i class="fas fa-sync-alt"></i>
                <span>Auto-checking every 5 minutes</span>
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
                    <th>User Name</th>
                    <th>User Email</th>
                    <th>Technician Name</th>
                    <th>Technician Email</th>
                    <th>Specialization</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Address</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="booking in filteredBookings" :key="booking.id" class="table-row">
                    <td>{{ booking.userName }}</td>
                    <td>{{ booking.userEmail || 'N/A' }}</td>
                    <td>{{ booking.technicianName }}</td>
                    <td>{{ booking.technicianEmail || 'N/A' }}</td>
                    <td>{{ booking.specialization || 'N/A' }}</td>
                    <td>{{ booking.date }}</td>
                    <td>{{ booking.time }}</td>
                    <td>{{ booking.address && booking.address.trim() ? booking.address : 'Address not provided' }}</td>
                    <td>{{ booking.price || 'N/A' }}</td>
                    <td class="booking-status">{{ booking.status }}</td>
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
import { ref, computed, onMounted, onUnmounted, onActivated } from 'vue';
import { collection, getDocs, query, where, updateDoc, doc, writeBatch, getDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db } from '../../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter, useRoute } from 'vue-router';
import Sidebar from '../../components/Sidebar.vue';
import TopBar from '../../components/TopBar.vue';

const router = useRouter();
const searchQuery = ref('');
const bookings = ref([]);
const loading = ref(true);
const error = ref(null);
const technicianUid = ref(null);
const checkingExpired = ref(false);
const lastCheckResult = ref(null);
const showNotification = ref(false);
const notificationMessage = ref('');
const notificationType = ref('info');

const functions = getFunctions();
const moveExpiredBookings = httpsCallable(functions, 'moveExpiredBookings');

const filteredBookings = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return bookings.value.filter(b =>
    Object.values(b).some(val => String(val).toLowerCase().includes(q))
  );
});

function handleSidebarNavigate(path) {
  router.push(path);
}

function showToast(message, type = 'info') {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    showNotification.value = false;
  }, 5000);
}

function getNotificationIcon() {
  switch (notificationType.value) {
    case 'success':
      return 'fas fa-check-circle';
    case 'error':
      return 'fas fa-exclamation-circle';
    case 'warning':
      return 'fas fa-exclamation-triangle';
    default:
      return 'fas fa-info-circle';
  }
}

// Function to check and update expired bookings
async function checkAndUpdateExpiredBookings() {
  try {
    console.log('=== CHECKING FOR EXPIRED BOOKINGS ===');
    
    // Get all upcoming bookings for this technician
    const upcomingQuery = query(
      collection(db, 'bookings'),
      where('technicianId', '==', technicianUid.value),
      where('status', '==', 'upcoming')
    );
    const upcomingSnapshot = await getDocs(upcomingQuery);
    
    console.log('Found upcoming bookings:', upcomingSnapshot.docs.length);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for comparison
    
    const expiredBookings = [];
    
    upcomingSnapshot.docs.forEach(doc => {
      const booking = doc.data();
      const bookingDate = new Date(booking.date);
      bookingDate.setHours(0, 0, 0, 0);
      
      console.log('Checking booking date:', booking.date, 'vs today:', today.toDateString());
      console.log('Booking date object:', bookingDate.toDateString());
      
      // Check if booking date is in the past OR if it's today but the time has passed
      let isExpired = false;
      
      if (bookingDate < today) {
        // Booking date is in the past
        isExpired = true;
        console.log('✅ Found expired booking (past date):', booking.date, 'for booking ID:', doc.id);
      } else if (bookingDate.getTime() === today.getTime()) {
        // Booking is today, check if time has passed
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes
        
        // Parse booking time (assuming format like "2:00 PM" or "14:00")
        let bookingTimeMinutes = 0;
        if (booking.time) {
          try {
            // Handle 12-hour format (e.g., "2:00 PM")
            if (booking.time.includes('PM') || booking.time.includes('AM')) {
              const timeMatch = booking.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
              if (timeMatch) {
                let hours = parseInt(timeMatch[1]);
                const minutes = parseInt(timeMatch[2]);
                const period = timeMatch[3].toUpperCase();
                
                if (period === 'PM' && hours !== 12) {
                  hours += 12;
                } else if (period === 'AM' && hours === 12) {
                  hours = 0;
                }
                
                bookingTimeMinutes = hours * 60 + minutes;
              }
            } else {
              // Handle 24-hour format (e.g., "14:00")
              const timeMatch = booking.time.match(/(\d+):(\d+)/);
              if (timeMatch) {
                const hours = parseInt(timeMatch[1]);
                const minutes = parseInt(timeMatch[2]);
                bookingTimeMinutes = hours * 60 + minutes;
              }
            }
          } catch (timeError) {
            console.warn('Could not parse booking time:', booking.time, timeError);
          }
        }
        
        // Add buffer time (30 minutes) to allow for travel and preparation
        const bufferMinutes = 30;
        const adjustedCurrentTime = currentTime + bufferMinutes;
        
        if (bookingTimeMinutes > 0 && adjustedCurrentTime > bookingTimeMinutes) {
          isExpired = true;
          console.log('✅ Found expired booking (time passed):', booking.date, booking.time, 'for booking ID:', doc.id);
          console.log('Current time (with buffer):', adjustedCurrentTime, 'minutes, Booking time:', bookingTimeMinutes, 'minutes');
        }
      }
      
      if (isExpired) {
        expiredBookings.push({
          id: doc.id,
          ...booking
        });
      }
    });
    
    console.log('Total expired bookings found:', expiredBookings.length);
    
            // Update expired bookings to completed status
        for (const booking of expiredBookings) {
          try {
            console.log('🔄 Updating expired booking to completed:', booking.id);
            console.log('📅 Booking details:', {
              date: booking.date,
              time: booking.time,
              user: booking.userName,
              address: booking.address
            });
            
            await updateDoc(doc(db, 'bookings', booking.id), { 
              status: 'complete',
              completedAt: new Date(),
              movedFromUpcoming: true,
              movedAt: new Date()
            });
            
            console.log('✅ Successfully moved booking to completed:', booking.id);
            console.log('📊 Status updated to: complete');
          } catch (updateError) {
            console.error('❌ Error updating expired booking:', booking.id, updateError);
          }
        }
    
    console.log('=== EXPIRED BOOKINGS CHECK COMPLETE ===');
    return expiredBookings.length;
    
  } catch (error) {
    console.error('❌ Error checking expired bookings:', error);
    return 0;
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
      result = await checkAndUpdateExpiredBookings(); // Changed to call the new function
      lastCheckResult.value = {
        success: true,
        movedCount: result,
        message: `Successfully moved ${result} expired bookings to completed`
      };
    }
    
    // Refresh the bookings list after moving expired ones
    if (result > 0) { // Changed to check result directly
      showToast(`🔄 Successfully moved ${result} expired booking${result > 1 ? 's' : ''} to completed`, 'success');
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
    if (!technicianUid.value) {
      error.value = 'Technician not authenticated.';
      return;
    }
    
    console.log('Fetching bookings for technician UID:', technicianUid.value);
    
    // First, check and update any expired bookings
    const expiredCount = await checkAndUpdateExpiredBookings();
    if (expiredCount > 0) {
      console.log(`Updated ${expiredCount} expired bookings to completed status`);
    }
    
    const q = query(
      collection(db, 'bookings'),
      where('technicianId', '==', technicianUid.value),
      where('status', '==', 'upcoming')
    );
    const snapshot = await getDocs(q);
    
         // Map booking data with proper field mapping
     const bookingsWithTechDetails = snapshot.docs.map(doc => {
       const bookingData = { id: doc.id, ...doc.data() };
       
       console.log('=== BOOKING DATA DEBUG ===');
       console.log('Raw booking data:', bookingData);
       console.log('All booking fields:', Object.keys(bookingData));
       
       // Map technician email from various possible fields in the booking
       bookingData.technicianEmail = bookingData.technicianEmail || 
                                    bookingData.technician_email || 
                                    bookingData.techEmail || 
                                    bookingData.tech_email || 
                                    'N/A';
       
       // Map specialization from various possible fields in the booking
       bookingData.specialization = bookingData.specialization || 
                                   bookingData.service || 
                                   bookingData.services || 
                                   bookingData.category || 
                                   bookingData.type || 
                                   bookingData.jobType || 
                                   bookingData.workType || 
                                   bookingData.profession || 
                                   bookingData.trade || 
                                   bookingData.skill || 
                                   bookingData.skills || 
                                   'N/A';
       
       // Map price from various possible fields in the booking
       bookingData.price = bookingData.price || 
                          bookingData.cost || 
                          bookingData.costPerVisit || 
                          bookingData.costpervisit || 
                          bookingData.basePrice || 
                          bookingData.base_price || 
                          bookingData.visitPrice || 
                          bookingData.visit_price || 
                          'N/A';
       
       console.log('Mapped booking data:', {
         technicianEmail: bookingData.technicianEmail,
         specialization: bookingData.specialization,
         price: bookingData.price
       });
       
       return bookingData;
     });
    
    bookings.value = bookingsWithTechDetails;
  } catch (e) {
    error.value = 'Failed to fetch bookings';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      technicianUid.value = user.uid;
      fetchBookings().then(() => {
        // Automatically check for expired bookings when component loads
        checkExpiredBookings();
        
        // Set up automatic checking for expired bookings every 5 minutes
        const autoCheckInterval = setInterval(async () => {
          if (technicianUid.value) {
            console.log('🕐 Auto-checking for expired bookings...');
            const expiredCount = await checkAndUpdateExpiredBookings();
            if (expiredCount > 0) {
              console.log(`🔄 Auto-moved ${expiredCount} expired bookings to completed`);
              showToast(`🔄 Automatically moved ${expiredCount} expired booking${expiredCount > 1 ? 's' : ''} to completed`, 'success');
              // Refresh the bookings list
              await fetchBookings();
            }
          }
        }, 5 * 60 * 1000); // Check every 5 minutes
        
        // Clean up interval when component unmounts
        onUnmounted(() => {
          clearInterval(autoCheckInterval);
        });
        
        // Also check when page becomes visible (user returns to tab)
        const handleVisibilityChange = () => {
          if (!document.hidden && technicianUid.value) {
            console.log('🔄 Page became visible, checking for expired bookings...');
            checkAndUpdateExpiredBookings().then(expiredCount => {
              if (expiredCount > 0) {
                console.log(`🔄 Found ${expiredCount} expired bookings, refreshing list...`);
                showToast(`🔄 Found ${expiredCount} expired booking${expiredCount > 1 ? 's' : ''} when returning to page`, 'info');
                fetchBookings();
              }
            });
          }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Clean up event listener
        onUnmounted(() => {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        });
      });
    } else {
      error.value = 'Technician not authenticated.';
      loading.value = false;
    }
  });
});

// Check for expired bookings when component is activated (user navigates to this page)
onActivated(async () => {
  if (technicianUid.value) {
    console.log('🔄 Component activated, checking for expired bookings...');
    const expiredCount = await checkAndUpdateExpiredBookings();
    if (expiredCount > 0) {
      console.log(`🔄 Found ${expiredCount} expired bookings, refreshing list...`);
      showToast(`🔄 Found ${expiredCount} expired booking${expiredCount > 1 ? 's' : ''} when navigating to page`, 'info');
      await fetchBookings();
    }
  }
});
</script>

<style scoped>
.main-layout {
  margin-left: 14rem;
  background-color: #faf8fd;
}
.dark .main-layout {
  background-color: var(--primary-bg);
}
.layout-container{
  background-color: #faf8fd;
}
.dark .layout-container{
  background-color: var(--primary-bg);
}
.admin-dashboard-layout {
  min-height: 100vh;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
}

.dark .admin-dashboard-layout {
  background: var(--primary-bg);
}

.booking-main {
  flex: 1;
}

.booking-container {
  margin: 0 auto;
}

.title-search-row {
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

.dark .check-expired-btn {
  background: var(--primary);
  color: var(--primary-text);
}

.check-expired-btn:hover:not(:disabled) {
  background: #6b5fa7;
}

.dark .check-expired-btn:hover:not(:disabled) {
  background: var(--primary);
}

.check-expired-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.auto-check-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-style: italic;
}

.auto-check-status i {
  color: #10b981;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.dark .auto-check-status {
  color: var(--text-muted);
}

/* Notification Toast */
.notification-toast {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  max-width: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-left: 4px solid;
  animation: slideIn 0.3s ease-out;
}

.notification-toast.success {
  border-left-color: #10b981;
}

.notification-toast.error {
  border-left-color: #ef4444;
}

.notification-toast.warning {
  border-left-color: #f59e0b;
}

.notification-toast.info {
  border-left-color: #3b82f6;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
}

.notification-content i {
  font-size: 1.25rem;
}

.notification-toast.success .notification-content i {
  color: #10b981;
}

.notification-toast.error .notification-content i {
  color: #ef4444;
}

.notification-toast.warning .notification-content i {
  color: #f59e0b;
}

.notification-toast.info .notification-content i {
  color: #3b82f6;
}

.notification-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.notification-close:hover {
  background-color: #f3f4f6;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.dark .notification-toast {
  background: var(--secondary-bg);
  color: var(--primary-text);
}

.dark .notification-close {
  color: var(--text-muted);
}

.dark .notification-close:hover {
  background-color: var(--input-bg);
}

.dark .check-expired-btn:disabled {
  background: var(--text-muted);
  color: var(--text-muted);
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

.dark .check-result.success {
  background: #166534;
  color: #dcfce7;
  border-color: #22c55e;
}

.check-result.error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.dark .check-result.error {
  background: #7f1d1d;
  color: #fecaca;
  border-color: #ef4444;
}

.page-title {
  color: var(--primary-color);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  font-family: Outfit, sans-serif;
}

.dark .page-title {
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
  background: var(--input-bg);
  color: var(--text-muted);
  border-color: var(--border-color);
}

.search-input:focus {
  border: 1.5px solid #6B5FA7;
}

.dark .search-input:focus {
  border-color: var(--secondary);
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
  color: var(--text-muted);
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

.dark .loading-state {
  background: var(--grey-bg);
  color: var(--white);
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
  border-color: var(--input-bg);
  border-top-color: var(--secondary);
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

.dark .error-state {
  background: var(--grey-bg);
}

.error-message {
  color: #ef4444;
  margin-bottom: 1rem;
  text-align: center;
}

.dark .error-message {
  color: #f87171;
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

.dark .retry-btn {
  background: var(--primary);
  color: var(--primary-text);
}

.retry-btn:hover {
  background: #6b5fa7;
}

.dark .retry-btn:hover {
  background: var(--primary);
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

.dark .empty-state {
  background: var(--grey-bg);
  color: var(--text-muted);
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dark .table-wrapper {
  background: var(--grey-bg);
}

.booking-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 0.75rem;
}

.dark .booking-table {
  background: var(--grey-bg);
}

.table-header {
  background: rgba(124, 107, 176, 0.2);
  color: #333;
}

.dark .table-header {
  background: rgba(124, 107, 176, 0.1);
  color: var(--white);
}

.table-header th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
}

.dark .table-header th {
  color: var(--white);
}

.table-row {
  border-bottom: 1px solid #e5e7eb;
}

.dark .table-row {
  border-bottom-color: var(--border-color);
  background: var(--input-bg);
}

.table-row td {
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  color: #333;
}

.dark .table-row td {
  color: var(--primary-text-dark);
}

.booking-status {
  color: #16a34a;
  font-size: 0.9rem;
  font-weight: 600;
}

.dark .booking-status {
  color: #22c55e;
}

@media (max-width: 768px) {
  .main-layout{
    margin-left: 0 !important;
  }
  .booking-main {
    padding: 1rem;
  }
  .title-search-row {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    margin-top: 10px;
    flex-wrap: nowrap;
  }
  .action-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .search-wrapper {
    flex: 1 1 auto;
    width: auto;
    max-width: none;
    min-width: 0;
  }
  .table-wrapper {
    font-size: 0.8rem;
  }
  .table-header th,
  .table-row td {
    padding: 0.5rem 0.5rem;
  }
  .filter-search-bar{
    padding: 0;
  }
}

/* Enhanced Responsive Design */
@media (max-width: 1200px) {
  .booking-container {
    max-width: 95%;
  }
  
  .booking-title {
    font-size: 1.75rem;
  }
  
  .search-wrapper {
    width: 350px;
  }
}

@media (max-width: 1024px) {
  .booking-main {
    padding: 1.5rem;
  }
  
  .booking-title {
    font-size: 1.5rem;
  }
  
  .search-wrapper {
    width: 300px;
    height: 45px;
  }
  
  .table-header th,
  .table-row td {
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 900px) {
  .flex {
    flex-direction: column;
  }
  
  .flex-1.p-8 {
    padding: 1rem;
  }
  
  .technician-dashboard-layout {
    padding: 0.75rem;
  }
  
  .booking-main {
    padding: 1rem;
  }
  
  .booking-container {
    max-width: 100%;
  }
  
  .title-search-row {
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
    margin-top: 1rem;
  }
  
  .search-wrapper {
    flex: 1 1 auto;
    width: auto;
    min-width: 0;
  }
  
  .booking-title {
    margin: 1rem 0;
    text-align: left;
    width: 100%;
  }
  
  .action-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}

@media (max-width: 768px) {
  .flex-1.p-8 {
    padding: 0.75rem;
  }
  
  .technician-dashboard-layout {
    padding: 0.5rem;
  }
  
  .booking-main {
    padding: 0.75rem;
  }
  
  .booking-title {
    font-size: 1.25rem;
    text-align: left;
  }
  
  .search-wrapper {
    flex: 1 1 auto;
    width: auto;
    min-width: 0;
    height: 50px;
  }
  
  .search-input {
    font-size: 0.875rem;
    padding: 0 12px 0 45px;
  }
  
  .table-wrapper {
    border-radius: 0.5rem;
    overflow-x: auto;
  }
  
  .booking-table {
    min-width: 800px;
    font-size: 0.75rem;
  }
  
  .table-header th,
  .table-row td {
    padding: 0.5rem 0.5rem;
    font-size: 0.75rem;
  }
  
  .booking-status {
    padding: 0.125rem 0.5rem;
    font-size: 0.6875rem;
  }
  
  .check-expired-btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
  .filter-search-bar{
    padding:0;
  }
}

@media (max-width: 600px) {
  .flex-1.p-8 {
    padding: 0.5rem;
  }
  
  .technician-dashboard-layout {
    padding: 0.375rem;
  }
  
  .booking-main {
    padding: 0.5rem;
  }
  
  .booking-title {
    font-size: 1.125rem;
    margin-bottom: 0.75rem;
    text-align: left;
  }
  
  .title-search-row {
    gap: 0.75rem;
  }
  
  .search-wrapper {
    flex: 1 1 auto;
    width: auto;
    min-width: 0;
    height: 50px;
  }
  
  .search-input {
    font-size: 0.8125rem;
    padding: 0 10px 0 40px;
  }
  
  
  .booking-table {
    min-width: 700px;
    font-size: 0.6875rem;
  }
  
  .table-header th,
  .table-row td {
    padding: 0.375rem 0.375rem;
    font-size: 0.6875rem;
  }
  
  .booking-status {
    padding: 0.125rem 0.375rem;
    font-size: 0.625rem;
  }
  
  .check-expired-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8125rem;
  }
  
  .loading-state,
  .error-state,
  .empty-state {
    padding: 2rem;
  }
}

@media (max-width: 480px) {
  .flex-1.p-8 {
    padding: 0.375rem;
  }
  
  .technician-dashboard-layout {
    padding: 0.25rem;
  }
  
  .booking-main {
    padding: 0.375rem;
  }
  
  .booking-title {
    font-size: 1rem;
    margin-bottom: 0.625rem;
    text-align: left;
  }
  
  .title-search-row {
    gap: 0.625rem;
  }
  
  .search-wrapper {
    flex: 1 1 auto;
    width: auto;
    min-width: 0;
    height: 50px;
  }
  
  .search-input {
    font-size: 0.75rem;
    padding: 0 8px 0 38px;
  }
  
  
  .booking-table {
    min-width: 600px;
    font-size: 0.625rem;
  }
  
  .table-header th,
  .table-row td {
    padding: 0.25rem 0.25rem;
    font-size: 0.625rem;
  }
  
  .booking-status {
    padding: 0.125rem 0.25rem;
    font-size: 0.5625rem;
  }
  
  .check-expired-btn {
    padding: 0.3rem 0.6rem;
    font-size: 0.75rem;
  }
  
  .loading-state,
  .error-state,
  .empty-state {
    padding: 1.5rem;
  }
  
  .loading-spinner {
    width: 32px;
    height: 32px;
  }
}

@media (max-width: 360px) {
  .flex-1.p-8 {
    padding: 0.25rem;
  }
  .layout-container{
    flex-direction: row !important;
  }
  
  .technician-dashboard-layout {
    padding: 0.125rem;
  }
  
  .booking-main {
    padding: 0.25rem;
  }
  
  .booking-title {
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    text-align: left;
  }
  
  .title-search-row {
    gap: 0.5rem;
  }
  
  .search-wrapper {
    flex: 1 1 auto;
    width: auto;
    min-width: 0;
    height: 50px;
  }
  
  .search-input {
    font-size: 0.6875rem;
    padding: 0 6px 0 36px;
  }
  
  
  .booking-table {
    min-width: 550px;
    font-size: 0.5625rem;
  }
  
  .table-header th,
  .table-row td {
    padding: 0.125rem 0.125rem;
    font-size: 0.5625rem;
  }
  .search-icon {
    left: 2px;
    font-size: 0.75rem;
    padding: 20px;
  }
  
  .booking-status {
    padding: 0.125rem 0.125rem;
    font-size: 0.5rem;
  }
  
  .check-expired-btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.6875rem;
  }
  
  .loading-state,
  .error-state,
  .empty-state {
    padding: 1rem;
  }
  
  .loading-spinner {
    width: 28px;
    height: 28px;
  }
}
</style> 