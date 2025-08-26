<template>
  <div class="flex min-h-screen layout-container">
    <!-- Sidebar -->
    <Sidebar :activeMenu="'booking'" :activeBookingStatus="'pending'" @navigate="handleSidebarNavigate" />
    <!-- Main Content -->
    <div class="flex-1 main-layout ">
      <div class="technician-dashboard-layout p-4 mx-12">
        <div class="booking-main">
          <div class="booking-container">
            <div class="title-search-row">
              <TopBar :title="$t('pendingBookings')" />
              <div class="search-wrapper">
                <input v-model="searchQuery" class="search-input" type="text" :placeholder="$t('search')" />
                <span class="search-icon"><i class="fas fa-search"></i></span>
              </div>

            </div>
            <div v-if="loading" class="loading-state">
              <div class="loading-spinner"></div>
              <p>{{ $t('loadingBookings') }}</p>
            </div>
            <div v-else-if="error" class="error-state">
              <p class="error-message">{{ error }}</p>
              <button @click="fetchBookings" class="retry-btn">{{ $t('retry') }}</button>
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
                      <tr v-for="(booking) in filteredBookings" :key="booking.id" class="table-row">
                        <td>{{ booking.userName }}</td>
                        <td>{{ booking.userPhone || 'N/A' }}</td>
                    <td>{{ booking.userEmail || 'N/A' }}</td>
                        <td>{{ booking.date }}</td>
                        <td>{{ booking.time }}</td>
                        <td>{{ booking.address && booking.address.trim() ? booking.address : 'Address not provided' }}</td>
                        <td>{{ booking.price || 'N/A' }}</td>
                        <td><span class="status-pending">{{ booking.status }}</span></td>
                        <td class="action-buttons">
                          <button class="accept-btn" @click="acceptBooking(booking.id)" :disabled="actionLoading === booking.id">
                            <span class="hidden sm:inline">{{ $t('accept') }}</span>
                            <span class="sm:hidden">✓</span>
                          </button>
                          <button class="reject-btn" @click="rejectBooking(booking.id)" :disabled="actionLoading === booking.id">
                            <span class="hidden sm:inline">{{ $t('reject') }}</span>
                            <span class="sm:hidden">✕</span>
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
                    </div>
                    <span class="status-pending text-sm">{{ booking.status }}</span>
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
                  
                  <div class="flex space-x-2 mt-4">
                    <button 
                      class="accept-btn flex-1" 
                      @click="acceptBooking(booking.id)" 
                      :disabled="actionLoading === booking.id"
                    >
                      <span class="hidden sm:inline">{{ $t('accept') }}</span>
                      <span class="sm:hidden">✓ {{ $t('accept') }}</span>
                    </button>
                    <button 
                      class="reject-btn flex-1" 
                      @click="rejectBooking(booking.id)" 
                      :disabled="actionLoading === booking.id"
                    >
                      <span class="hidden sm:inline">{{ $t('reject') }}</span>
                      <span class="sm:hidden">✕ {{ $t('reject') }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <p>{{ $t('noPendingBookings') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc, addDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'vue-router';
import Sidebar from '../../components/Sidebar.vue';
import TopBar from '../../components/TopBar.vue';


const router = useRouter();
const searchQuery = ref('');
const bookings = ref([]);
const loading = ref(true);
const error = ref(null);
const technicianUid = ref(null);
const actionLoading = ref(null);

const filteredBookings = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return bookings.value.filter(b =>
    Object.values(b).some(val => String(val).toLowerCase().includes(q))
  );
});

function handleSidebarNavigate(path) {
  router.push(path);
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
      
      // If booking date is in the past, mark it as expired
      if (bookingDate < today) {
        expiredBookings.push({
          id: doc.id,
          ...booking
        });
        console.log('✅ Found expired booking:', booking.date, 'for booking ID:', doc.id);
      }
    });
    
    console.log('Total expired bookings found:', expiredBookings.length);
    
    // Update expired bookings to completed status
    for (const booking of expiredBookings) {
      try {
        console.log('Updating expired booking to completed:', booking.id);
        await updateDoc(doc(db, 'bookings', booking.id), { 
          status: 'complete',
          completedAt: new Date()
        });
        console.log('✅ Successfully updated booking to completed:', booking.id);
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
      where('status', '==', 'pending')
    );
    const snapshot = await getDocs(q);
    
    console.log('Found bookings:', snapshot.docs.length);
    
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
    
    console.log('Bookings with technician details:', bookingsWithTechDetails);
    bookings.value = bookingsWithTechDetails;
  } catch (e) {
    console.error('Error fetching bookings:', e);
    error.value = 'Failed to fetch bookings: ' + e.message;
  } finally {
    loading.value = false;
  }
}

async function acceptBooking(id) {
  actionLoading.value = id;
  try {
    // Find the booking data before updating
    const booking = bookings.value.find(b => b.id === id);
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    // Update booking status
    await updateDoc(doc(db, 'bookings', id), { status: 'upcoming' });
    
    // Get technician name
    const technicianName = booking.technicianName || 'Technician';
    
    // Update technician availability to remove the booked time slot
    await updateTechnicianAvailability(booking);
    
    // Send notification to user
    await sendBookingStatusNotification(booking, 'accepted', technicianName);
    
    // Remove from pending list
    bookings.value = bookings.value.filter(b => b.id !== id);
    
    console.log('✅ Booking accepted, availability updated, and notification sent');
  } catch (e) {
    console.error('❌ Error accepting booking:', e);
    alert('Failed to accept booking: ' + e.message);
  } finally {
    actionLoading.value = null;
  }
}

// Function to update technician availability when accepting a booking
async function updateTechnicianAvailability(booking) {
  try {
    console.log('=== UPDATING TECHNICIAN AVAILABILITY ===');
    console.log('Booking data:', booking);
    
    if (!booking.date || !booking.time || !booking.technicianId) {
      console.log('⚠️ Missing booking data for availability update');
      return;
    }
    
    // Get the day name from the booking date
    const bookingDate = new Date(booking.date);
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[bookingDate.getDay()];
    
    console.log('Booking date:', booking.date);
    console.log('Booking time:', booking.time);
    console.log('Day name:', dayName);
    
    // Get current technician availability
    const availabilityRef = doc(db, 'technicianAvailability', booking.technicianId);
    const availabilitySnap = await getDoc(availabilityRef);
    
    if (!availabilitySnap.exists()) {
      console.log('⚠️ No availability document found for technician');
      return;
    }
    
    const currentAvailability = availabilitySnap.data();
    console.log('Current availability:', currentAvailability);
    
    // Check if the technician is available on this day
    if (!currentAvailability[dayName] || !currentAvailability[dayName].available) {
      console.log('⚠️ Technician not available on this day');
      return;
    }
    
    const { startTime, endTime } = currentAvailability[dayName];
    console.log('Current time range:', startTime, '-', endTime);
    
    // Parse the booking time to check if it falls within the available range
    const bookingTime = booking.time;
    
    // Convert time formats for comparison (e.g., "03:00 PM" to 24-hour format)
    const parseTime = (timeStr) => {
      const time = new Date(`2000-01-01 ${timeStr}`);
      return time.getHours() * 60 + time.getMinutes(); // Convert to minutes for easier comparison
    };
    
    const bookingTimeMinutes = parseTime(bookingTime);
    const startTimeMinutes = parseTime(startTime);
    const endTimeMinutes = parseTime(endTime);
    
    console.log('Time comparison:', {
      bookingTime: bookingTime,
      bookingTimeMinutes: bookingTimeMinutes,
      startTime: startTime,
      startTimeMinutes: startTimeMinutes,
      endTime: endTime,
      endTimeMinutes: endTimeMinutes
    });
    
    // Check if booking time is within the available range
    if (bookingTimeMinutes < startTimeMinutes || bookingTimeMinutes >= endTimeMinutes) {
      console.log('⚠️ Booking time is outside available range');
      return;
    }
    
    // For now, we'll mark the entire day as unavailable when a booking is accepted
    // This is a simplified approach - in a more complex system, you might want to
    // track specific time slots that are booked
    const updatedAvailability = {
      [dayName]: {
        available: false,
        startTime: '',
        endTime: '',
        bookedSlots: currentAvailability[dayName].bookedSlots || []
      }
    };
    
    // Add the booked time slot to the bookedSlots array
    if (!updatedAvailability[dayName].bookedSlots.includes(bookingTime)) {
      updatedAvailability[dayName].bookedSlots.push(bookingTime);
    }
    
    console.log('Updated availability data:', updatedAvailability);
    
    // Update the availability document
    await updateDoc(availabilityRef, updatedAvailability);
    
    console.log('✅ Technician availability updated successfully');
    
  } catch (error) {
    console.error('❌ Error updating technician availability:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    // Don't throw the error - availability update failure shouldn't prevent booking acceptance
  }
}

async function rejectBooking(id) {
  actionLoading.value = id;
  try {
    // Find the booking data before deleting
    const booking = bookings.value.find(b => b.id === id);
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    // Get technician name
    const technicianName = booking.technicianName || 'Technician';
    
    // Send notification to user before deleting
    await sendBookingStatusNotification(booking, 'rejected', technicianName);
    
    // Delete the booking
    await deleteDoc(doc(db, 'bookings', id));
    
    // Remove from pending list
    bookings.value = bookings.value.filter(b => b.id !== id);
    
    console.log('✅ Booking rejected and notification sent');
  } catch (e) {
    console.error('❌ Error rejecting booking:', e);
    alert('Failed to reject booking: ' + e.message);
  } finally {
    actionLoading.value = null;
  }
}

// Function to send booking status notification to user
async function sendBookingStatusNotification(booking, status, technicianName) {
  try {
    console.log('=== SENDING BOOKING STATUS NOTIFICATION ===');
    console.log('Booking:', booking);
    console.log('Status:', status);
    console.log('Technician name:', technicianName);
    
    // Get the user's email from the booking
    const userEmail = booking.userEmail;
    
    if (!userEmail) {
      console.error('❌ No user email found in booking data');
      return false;
    }
    
    // Try to find the user's UID - first check if it's in the booking data
    let userUid = booking.userId;
    
    // If not in booking data, try to find it by email
    if (!userUid) {
      try {
        // Query the users collection to find the user by email
        const usersQuery = query(
          collection(db, 'users'),
          where('email', '==', userEmail)
        );
        const userSnapshot = await getDocs(usersQuery);
        
        if (!userSnapshot.empty) {
          userUid = userSnapshot.docs[0].id;
          console.log('✅ Found user UID:', userUid, 'for email:', userEmail);
        } else {
          console.log('⚠️ No user found with email:', userEmail);
          // Try to find in technicians collection as well
          const techQuery = query(
            collection(db, 'technicians'),
            where('email', '==', userEmail)
          );
          const techSnapshot = await getDocs(techQuery);
          if (!techSnapshot.empty) {
            userUid = techSnapshot.docs[0].id;
            console.log('✅ Found user UID in technicians:', userUid, 'for email:', userEmail);
          }
        }
      } catch (userError) {
        console.error('❌ Error looking up user by email:', userError);
      }
    } else {
      console.log('✅ User UID found in booking data:', userUid);
    }
    
    const notificationData = {
      type: 'booking_status_update',
      title: status === 'accepted' ? 'Booking Accepted!' : 'Booking Rejected',
      message: status === 'accepted' 
        ? `Your booking with ${technicianName} for ${booking.date} at ${booking.time} has been accepted!`
        : `Your booking with ${technicianName} for ${booking.date} at ${booking.time} has been rejected.`,
      bookingId: booking.id,
      technicianId: booking.technicianId,
      technicianName: technicianName,
      customerEmail: booking.userEmail,
      customerName: booking.userName,
      bookingDate: booking.date,
      bookingTime: booking.time,
      status: status,
      createdAt: new Date(),
      read: false
    };
    
    console.log('Notification data prepared:', notificationData);
    
    // Send notification to the user if we found their UID
    if (userUid) {
      const userNotification = {
        ...notificationData,
        recipientId: userUid,
        recipientType: 'user',
        message: status === 'accepted' 
          ? `Great news! Your booking with ${technicianName} for ${booking.date} at ${booking.time} has been accepted. Please prepare for your appointment.`
          : `Unfortunately, your booking with ${technicianName} for ${booking.date} at ${booking.time} has been rejected. You can try booking with another technician.`
      };
      
      console.log('User notification object:', userNotification);
      
      console.log('Adding user notification to Firebase...');
      const userNotificationRef = await addDoc(collection(db, 'notifications'), userNotification);
      console.log('User notification added with ID:', userNotificationRef.id);
    } else {
      console.log('⚠️ Skipping user notification - no UID found');
    }
    
    // Send fallback notification using email as recipientId
    const fallbackNotification = {
      ...notificationData,
      recipientId: userEmail, // Use email as recipientId for fallback
      recipientType: 'user',
      recipientEmail: userEmail, // Add email field for easier lookup
      message: status === 'accepted' 
        ? `Great news! Your booking with ${technicianName} for ${booking.date} at ${booking.time} has been accepted. Please prepare for your appointment.`
        : `Unfortunately, your booking with ${technicianName} for ${booking.date} at ${booking.time} has been rejected. You can try booking with another technician.`
    };
    
    console.log('Fallback notification object:', fallbackNotification);
    console.log('Adding fallback notification to Firebase...');
    const fallbackNotificationRef = await addDoc(collection(db, 'notifications'), fallbackNotification);
    console.log('Fallback notification added with ID:', fallbackNotificationRef.id);
    
    // Send email notification to user
    await sendBookingStatusEmail(booking, status, technicianName);
    
    // Send notification to admin
    const adminNotification = {
      ...notificationData,
      recipientId: 'admin',
      recipientType: 'admin',
      message: `Booking ${status}: ${booking.userName} (${booking.userEmail}) booked ${technicianName} for ${booking.date} at ${booking.time}.`
    };
    
    console.log('Admin notification object:', adminNotification);
    
    console.log('Adding admin notification to Firebase...');
    const adminNotificationRef = await addDoc(collection(db, 'notifications'), adminNotification);
    console.log('Admin notification added with ID:', adminNotificationRef.id);
    
    console.log('=== BOOKING STATUS NOTIFICATIONS SENT SUCCESSFULLY ===');
    return true;
    
  } catch (error) {
    console.error('=== ERROR SENDING BOOKING STATUS NOTIFICATION ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    return false;
  }
}

// Function to send email notification for booking status
async function sendBookingStatusEmail(booking, status, technicianName) {
  try {
    console.log('=== SENDING BOOKING STATUS EMAIL ===');
    console.log('Sending email to:', booking.userEmail);
    
    const emailData = {
      to_email: booking.userEmail,
      to_name: booking.userName,
      technician_name: technicianName,
      booking_date: booking.date,
      booking_time: booking.time,
      booking_status: status === 'accepted' ? 'ACCEPTED' : 'REJECTED',
      status_message: status === 'accepted' 
        ? 'Your booking has been accepted! Please prepare for your appointment.'
        : 'Your booking has been rejected. You can try booking with another technician.',
      customer_name: booking.userName,
      customer_email: booking.userEmail,
      customer_phone: booking.userPhone || 'Not provided',
      booking_address: booking.address || 'Address not provided',
      payment_method: booking.payment || 'Not specified'
    };
    
    console.log('Email data:', emailData);
    
    // Email functionality removed
    console.log('✅ Email template prepared:', emailData);
    return true;
    
  } catch (error) {
    console.error('❌ Error sending email:', error);
    console.error('Email error details:', {
      code: error.code,
      message: error.message,
      status: error.status
    });
    return false;
  }
}



onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      technicianUid.value = user.uid;
      console.log('Technician authenticated with UID:', user.uid);
      console.log('Technician email:', user.email);
      fetchBookings();
    } else {
      error.value = 'Technician not authenticated.';
      loading.value = false;
    }
  });
});
</script>

<style scoped>
.main-layout {
  margin-left: 14rem;
  background-color: #faf8fd;
}
.layout-container{
  background-color: #faf8fd;
}
.dark .main-layout {
  background-color: var(--primary-bg);
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
  padding: 20px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.search-icon:hover {
  background-color: rgba(182, 167, 230, 0.1);
}

.dark .search-icon {
  color: var(--text-muted);
}

.dark .search-icon:hover {
  background-color: rgba(255, 255, 255, 0.1);
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
  color: var(--primary-color);
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

.status-pending {
  background: #fef3c7;
  color: #92400e;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.dark .status-pending {
  background: #92400e;
  color: #fef3c7;
}

.accept-btn {
  background: #22c55e;
  color: #fff;
  border: none;
  padding: 0.3rem 0.4rem;
  border-radius: 1rem;
  margin-right: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
  min-width: 60px;
  text-align: center;
}

.dark .accept-btn {
  background: #16a34a;
  color: #fff;
}

.accept-btn:disabled {
  background: #a7f3d0;
  cursor: not-allowed;
}

.dark .accept-btn:disabled {
  background: #166534;
  color: #9ca3af;
}

.reject-btn {
  background: #ef4444;
  color: #fff;
  border: none;
  padding: 0.3rem 0.5rem;
  border-radius: 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
  min-width: 60px;
  text-align: center;
}

.dark .reject-btn {
  background: #dc2626;
  color: #fff;
}

.reject-btn:disabled {
  background: #fecaca;
  cursor: not-allowed;
}

.dark .reject-btn:disabled {
  background: #7f1d1d;
  color: #9ca3af;
}

@media (max-width: 1200px) {
  .booking-container {
    max-width: 95%;
  }
  
  .booking-title {
    font-size: 1.75rem;
  }
  
  .search-wrapper {
    width: 100%;
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
    width: 100%;
    height: 45px;
  }
  
  .search-input {
    padding: 0 16px 0 60px;
  }
  
  .search-icon {
    padding: 20px;
  }
  
  .table-header th,
  .table-row td {
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 900px) {
  .main-layout{
    margin-left: 0 !important;
  }
  .flex {
    flex-direction: column;
  }
  
  .flex-1.p-8 {
    padding: 1rem;
  }
  
  .technician-dashboard-layout {
    margin-right: 0;
    padding: 0.75rem;
    margin-left: 0 !important;
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
    gap: 1rem;
    margin-top: 10px;
  }
  
  .search-wrapper {
    width: 100%;
    max-width: none;
  }
  
  .booking-title {
    font-size: 1.375rem;
    text-align: left;
    width: 100%;
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
    width: 100%;
    height: 50px;
  }
  
  .search-input {
    font-size: 0.875rem;
    padding: 0 12px 0 60px;
  }
  
  .search-icon {
    font-size: 1rem;
    padding: 20px;
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
  
  .status-pending {
    padding: 0.125rem 0.5rem;
    font-size: 0.6875rem;
  }
  
  .accept-btn,
  .reject-btn {
    padding: 0.25rem 0.6rem;
    font-size: 0.75rem;
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
    width: 100%;
    height: 50px;
  }
  
  .search-input {
    font-size: 0.8125rem;
    padding: 0 10px 0 60px;
  }
  
  .search-icon {
    font-size: 0.875rem;
    padding: 20px;
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
  
  .status-pending {
    padding: 0.125rem 0.375rem;
    font-size: 0.625rem;
  }
  
  .accept-btn,
  .reject-btn {
    padding: 0.2rem 0.5rem;
    font-size: 0.6875rem;
  }
  
  .loading-state,
  .error-state,
  .empty-state {
    padding: 2rem;
  }
}

@media (max-width: 480px) {
  .table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .booking-table {
    min-width: 1000px;
  }
  
  .action-buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
    padding: 0.25rem 0;
    min-width: 120px;
  }
  
  .accept-btn,
  .reject-btn {
    width: 100%;
    margin: 0.125rem 0;
  }
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
    flex-wrap: nowrap;
  }
  
  .search-wrapper {
    width: 100%;
    height: 50px;
  }
  
  .search-input {
    font-size: 0.75rem;
    padding: 0 8px 0 60px;
  }
  
  .search-icon {
    left: 4px;
    font-size: 0.8125rem;
    padding: 20px;
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
  
  .status-pending {
    padding: 0.125rem 0.25rem;
    font-size: 0.5625rem;
  }
  
  .accept-btn,
  .reject-btn {
    padding: 0.15rem 0.4rem;
    font-size: 0.625rem;
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
    flex-direction: row;
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
    width: 100%;
    height: 50px;
  }
  
  .search-input {
    font-size: 0.6875rem;
    padding: 0 6px 0 60px;
  }
  
  .search-icon {
    left: 2px;
    font-size: 0.75rem;
    padding: 20px;
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
  
  .status-pending {
    padding: 0.125rem 0.125rem;
    font-size: 0.5rem;
  }
  
  .accept-btn,
  .reject-btn {
    padding: 0.125rem 0.3rem;
    font-size: 0.5625rem;
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