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
            
            <!-- Auto-checking status -->
            <div class="action-row">
              <div class="auto-check-status">
                <i class="fas fa-sync-alt"></i>
                <span>Auto-checking expired bookings every 2 minutes</span>
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
            <div v-else-if="filteredBookings.length > 0">
              <!-- Desktop Table -->
              <div class="hidden md:block">
                <div class="table-wrapper">
                  <table class="booking-table">
                    <thead>
                      <tr class="table-header">
                        <th>{{ $t('userName') }}</th>
                        <th>{{ $t('Phone') }}</th>
                    <th>{{ $t('userEmail') }}</th>
                        <th>{{ $t('date') }}</th>
                        <th>{{ $t('time') }}</th>
                        <th>{{ $t('address') }}</th>
                        <th>{{ $t('price') }}</th>
                        <th>{{ $t('status') }}</th>
                        <th>{{ $t('actions') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="booking in filteredBookings" :key="booking.id" class="table-row">
                        <td>{{ booking.userName }}</td>
                        <td>{{ booking.userPhone || 'N/A' }}</td>
                    <td>{{ booking.userEmail || 'N/A' }}</td>
                        <td>{{ booking.date }}</td>
                        <td>{{ booking.time }}</td>
                        <td>{{ booking.address && booking.address.trim() ? booking.address : 'Address not provided' }}</td>
                        <td>{{ booking.price || 'N/A' }}</td>
                        <td><span class="status-upcoming">{{ booking.status }}</span></td>
                        <td class="action-buttons">
                          <button 
                            class="complete-btn"
                            @click="markBookingAsCompleted(booking.id)" 
                            :disabled="markingCompleted === booking.id"
                          >
                            <i v-if="markingCompleted === booking.id" class="fas fa-spinner fa-spin mr-1"></i>
                            <i v-else class="fas fa-check mr-1"></i>
                            <span class="hidden sm:inline">{{ markingCompleted === booking.id ? $t('marking') : $t('completed') }}</span>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Mobile Cards -->
              <div class="md:hidden space-y-4">
                <div v-for="booking in filteredBookings" :key="booking.id" class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <div class="flex justify-between items-start mb-3">
                    <div>
                      <h3 class="font-semibold text-lg">{{ booking.userName }}</h3>
                      <p class="text-gray-600 dark:text-gray-300">{{ booking.userPhone || 'N/A' }}</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ booking.userEmail || 'N/A' }}</p>
                    </div>
                    <span class="status-upcoming text-sm">{{ booking.status }}</span>
                  </div>
                  
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-500 dark:text-gray-400">{{ $t('date') }}:</span>
                      <span>{{ booking.date }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-500 dark:text-gray-400">{{ $t('time') }}:</span>
                      <span>{{ booking.time }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-500 dark:text-gray-400">{{ $t('price') }}:</span>
                      <span>{{ booking.price || 'N/A' }}</span>
                    </div>
                    <div class="pt-2">
                      <p class="text-gray-500 dark:text-gray-400">{{ $t('address') }}:</p>
                      <p>{{ booking.address && booking.address.trim() ? booking.address : 'Address not provided' }}</p>
                    </div>
                  </div>
                  
                  <div class="mt-4">
                    <button 
                      class="complete-btn w-full" 
                      @click="markBookingAsCompleted(booking.id)" 
                      :disabled="markingCompleted === booking.id"
                    >
                      <i v-if="markingCompleted === booking.id" class="fas fa-spinner fa-spin mr-1"></i>
                      <i v-else class="fas fa-check mr-1"></i>
                      {{ markingCompleted === booking.id ? $t('marking') : $t('completed') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <p>{{ $t('noUpcomingBookings') }}</p>
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

const showNotification = ref(false);
const notificationMessage = ref('');
const notificationType = ref('info');
const markingCompleted = ref(null);

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

// Function to mark a specific booking as completed
async function markBookingAsCompleted(bookingId) {
  try {
    markingCompleted.value = bookingId;
    
    console.log(' Marking booking as completed:', bookingId);
    
    const updateData = { 
      status: 'complete',
      completedAt: new Date(),
      manuallyCompleted: true,
      completedBy: technicianUid.value
    };
    
    await updateDoc(doc(db, 'bookings', bookingId), updateData);
    
    console.log(' Successfully marked booking as completed:', bookingId);
    showToast(' Booking marked as completed successfully', 'success');
    
    // Refresh the bookings list to show updated state
    await fetchBookings();
    
  } catch (error) {
    console.error(' Error marking booking as completed:', error);
    showToast(' Failed to mark booking as completed', 'error');
  } finally {
    markingCompleted.value = null;
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
    console.log('Technician UID:', technicianUid.value);
    
    // Log all upcoming bookings for debugging
    upcomingSnapshot.docs.forEach(doc => {
      const booking = doc.data();
      console.log('Upcoming booking:', {
        id: doc.id,
        date: booking.date,
        time: booking.time,
        status: booking.status,
        technicianId: booking.technicianId
      });
    });
    
    // Also check if there are any bookings with different status values that might be "upcoming"
    const allBookingsQuery = query(
      collection(db, 'bookings'),
      where('technicianId', '==', technicianUid.value)
    );
    const allBookingsSnapshot = await getDocs(allBookingsQuery);
    
    console.log('All bookings for technician:', allBookingsSnapshot.docs.length);
    const statusCounts = {};
    allBookingsSnapshot.docs.forEach(doc => {
      const booking = doc.data();
      const status = booking.status || 'undefined';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    console.log('Status distribution:', statusCounts);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for comparison
    
    console.log('Today (start of day):', today.toDateString());
    console.log('Today timestamp:', today.getTime());
    
    const expiredBookings = [];
    
    upcomingSnapshot.docs.forEach(doc => {
      const booking = doc.data();
      
      // Handle different date formats - booking.date could be a string or timestamp
      let bookingDate;
      if (typeof booking.date === 'string') {
        // If it's a string like "2024-01-15", parse it
        bookingDate = new Date(booking.date);
      } else if (booking.date && booking.date.toDate) {
        // If it's a Firestore timestamp, convert to Date
        bookingDate = booking.date.toDate();
      } else if (booking.date && booking.date.seconds) {
        // If it's a timestamp object with seconds
        bookingDate = new Date(booking.date.seconds * 1000);
      } else {
        // Fallback to direct Date constructor
        bookingDate = new Date(booking.date);
      }
      
      // Check if the date is valid
      if (isNaN(bookingDate.getTime())) {
        console.warn('Invalid booking date:', booking.date, 'for booking ID:', doc.id);
        console.warn('Date type:', typeof booking.date);
        console.warn('Date value:', booking.date);
        return; // Skip this booking
      }
      
      bookingDate.setHours(0, 0, 0, 0); // Set to start of day for comparison
      
      console.log('Checking booking date:', booking.date, 'vs today:', today.toDateString());
      console.log('Parsed booking date:', bookingDate.toDateString());
      
      // Check if booking date is in the past OR if it's today but the time has passed
      let isExpired = false;
      
      console.log('Date comparison for booking', doc.id, ':', {
        bookingDate: bookingDate.toDateString(),
        bookingTimestamp: bookingDate.getTime(),
        today: today.toDateString(),
        todayTimestamp: today.getTime(),
        isPast: bookingDate < today,
        isToday: bookingDate.getTime() === today.getTime()
      });
      
      if (bookingDate < today) {
        // Booking date is in the past
        isExpired = true;
        console.log(' Found expired booking (past date):', booking.date, 'for booking ID:', doc.id);
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
        
        // Add buffer time (15 minutes) to allow for travel and preparation
        const bufferMinutes = 15;
        const adjustedCurrentTime = currentTime + bufferMinutes;
        
        if (bookingTimeMinutes > 0 && adjustedCurrentTime > bookingTimeMinutes) {
          isExpired = true;
          console.log(' Found expired booking (time passed):', booking.date, booking.time, 'for booking ID:', doc.id);
          console.log('Current time (with buffer):', adjustedCurrentTime, 'minutes, Booking time:', bookingTimeMinutes, 'minutes');
        }
        
        // Also check if it's past business hours (after 6 PM) and mark as expired
        if (currentTime > 18 * 60) { // After 6 PM
          isExpired = true;
          console.log(' Found expired booking (past business hours):', booking.date, booking.time, 'for booking ID:', doc.id);
        }
      }
      
      if (isExpired) {
        expiredBookings.push({
          id: doc.id,
          ...booking
        });
        console.log(' Added to expired list:', doc.id, 'with date:', booking.date);
      } else {
        console.log(' Booking is not expired:', doc.id, 'with date:', booking.date);
      }
    });
    
    console.log('Total expired bookings found:', expiredBookings.length);
    console.log('Expired booking IDs:', expiredBookings.map(b => b.id));
    
    // Update expired bookings to completed status using batch operations for better reliability
    console.log(' Starting to update', expiredBookings.length, 'expired bookings...');
    
    if (expiredBookings.length > 0) {
      try {
        // Use batch operations for better reliability
        const batch = writeBatch(db);
        
        expiredBookings.forEach(booking => {
          const bookingRef = doc(db, 'bookings', booking.id);
          const updateData = { 
            status: 'complete',
            completedAt: new Date(),
            movedFromUpcoming: true,
            movedAt: new Date()
          };
          
          console.log(' Adding to batch:', booking.id, updateData);
          batch.update(bookingRef, updateData);
        });
        
        // Commit the batch
        console.log(' Committing batch update...');
        await batch.commit();
        
        console.log(' Successfully moved all expired bookings to completed status');
        showToast(` Successfully moved ${expiredBookings.length} expired booking${expiredBookings.length > 1 ? 's' : ''} to completed`, 'success');
        
      } catch (batchError) {
        console.error(' Batch update failed, trying individual updates:', batchError);
        
        // Fallback to individual updates if batch fails
        let successCount = 0;
        for (const booking of expiredBookings) {
          try {
            const updateData = { 
              status: 'complete',
              completedAt: new Date(),
              movedFromUpcoming: true,
              movedAt: new Date()
            };
            
            await updateDoc(doc(db, 'bookings', booking.id), updateData);
            successCount++;
            console.log(' Successfully moved booking to completed:', booking.id);
            
          } catch (updateError) {
            console.error(' Error updating expired booking:', booking.id, updateError);
            
            // Try to get the current document to see what's happening
            try {
              const currentDoc = await getDoc(doc(db, 'bookings', booking.id));
              if (currentDoc.exists()) {
                console.log(' Current document data:', currentDoc.data());
              } else {
                console.log(' Document no longer exists:', booking.id);
              }
            } catch (getError) {
              console.error(' Error getting current document:', getError);
            }
          }
        }
        
        if (successCount > 0) {
          showToast(` Moved ${successCount} out of ${expiredBookings.length} expired bookings to completed`, 'success');
        }
      }
    }
    
    console.log('=== EXPIRED BOOKINGS CHECK COMPLETE ===');
    return expiredBookings.length;
    
  } catch (error) {
    console.error(' Error checking expired bookings:', error);
    return 0;
  }
}

// Function to fetch bookings
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
    console.log(' Checking for expired bookings in fetchBookings...');
    const expiredCount = await checkAndUpdateExpiredBookings();
    if (expiredCount > 0) {
      console.log(` Updated ${expiredCount} expired bookings to completed status`);
    } else {
      console.log(' No expired bookings found');
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
        // Immediately check for expired bookings when component loads
        checkAndUpdateExpiredBookings().then(expiredCount => {
          if (expiredCount > 0) {
            console.log(` Found ${expiredCount} expired bookings on load, moved to completed`);
            showToast(` Found ${expiredCount} expired booking${expiredCount > 1 ? 's' : ''} and moved to completed`, 'success');
            // Refresh the bookings list to show updated state
            fetchBookings();
          }
        });
        
        // Set up automatic checking for expired bookings every 2 minutes (more frequent)
        const autoCheckInterval = setInterval(async () => {
          if (technicianUid.value) {
            console.log(' Auto-checking for expired bookings...');
            const expiredCount = await checkAndUpdateExpiredBookings();
            if (expiredCount > 0) {
              console.log(` Auto-moved ${expiredCount} expired bookings to completed`);
              showToast(` Automatically moved ${expiredCount} expired booking${expiredCount > 1 ? 's' : ''} to completed`, 'success');
              // Refresh the bookings list
              await fetchBookings();
            }
          }
        }, 2 * 60 * 1000); // Check every 2 minutes
        
        // Clean up interval when component unmounts
        onUnmounted(() => {
          clearInterval(autoCheckInterval);
        });
        
        // Also check when page becomes visible (user returns to tab)
        const handleVisibilityChange = () => {
          if (!document.hidden && technicianUid.value) {
            console.log(' Page became visible, checking for expired bookings...');
            checkAndUpdateExpiredBookings().then(expiredCount => {
              if (expiredCount > 0) {
                console.log(` Found ${expiredCount} expired bookings, refreshing list...`);
                showToast(` Found ${expiredCount} expired booking${expiredCount > 1 ? 's' : ''} when returning to page`, 'info');
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
    console.log(' Component activated, checking for expired bookings...');
    const expiredCount = await checkAndUpdateExpiredBookings();
    if (expiredCount > 0) {
      console.log(` Found ${expiredCount} expired bookings, refreshing list...`);
      showToast(` Found ${expiredCount} expired booking${expiredCount > 1 ? 's' : ''} when navigating to page`, 'info');
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
  padding: 0.75rem 0.5rem;
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
  padding: 0.75rem 0.5rem;
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

.complete-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #10b981;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  font-weight: 500;
  min-width: 100px;
  justify-content: center;
}

.dark .complete-btn {
  background: #059669;
  color: var(--primary-text);
}

.complete-btn:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dark .complete-btn:hover:not(:disabled) {
  background: #047857;
}

.complete-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.complete-btn i {
  font-size: 0.875rem;
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
   
   .complete-btn {
     padding: 0.375rem 0.75rem;
     font-size: 0.8125rem;
     min-width: 80px;
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
   
   .complete-btn {
     padding: 0.25rem 0.5rem;
     font-size: 0.75rem;
     min-width: 70px;
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
   
   .complete-btn {
     padding: 0.125rem 0.375rem;
     font-size: 0.6875rem;
     min-width: 60px;
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
   
   .complete-btn {
     padding: 0.125rem 0.25rem;
     font-size: 0.625rem;
     min-width: 50px;
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