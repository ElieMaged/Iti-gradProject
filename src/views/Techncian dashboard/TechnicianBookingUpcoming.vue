<template>
  <div class="flex min-h-screen layout-container">
    <!-- Sidebar -->
    <Sidebar :activeMenu="'booking'" :activeBookingStatus="'upcoming'" @navigate="handleSidebarNavigate" />
    <!-- Main Content -->
    <div class="flex-1 main-layout">
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
import { ref, computed, onMounted } from 'vue';
import { collection, getDocs, query, where, updateDoc, doc, writeBatch, getDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
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
    
    // Fetch technician details for each booking
    const bookingsWithTechDetails = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const bookingData = { id: doc.id, ...doc.data() };
                try {
                  const technicianDoc = await getDoc(doc(db, 'technicians', bookingData.technicianId));
                  if (technicianDoc.exists()) {
                    const techData = technicianDoc.data();
                    console.log('Technician data found:', techData);
                    console.log('All technician fields:', Object.keys(techData));
                    
                    // Get the technician's login email (the email they used to register/login)
                    const loginEmail = techData.email || techData.userEmail || techData.technicianEmail || techData.contactEmail;
                    console.log('Technician login email:', loginEmail);
                    
                    // Debug price fields - look for costpervisit specifically
                    console.log('CostPerVisit field value:', techData.costpervisit);
                    console.log('BasePrice field value:', techData.basePrice);
                    console.log('VisitPrice field value:', techData.visitPrice);
                    console.log('Price field value:', techData.price);
                    
                    // Try to get price from costpervisit first, then fallback to other fields
                    const price = techData.costpervisit || techData.basePrice || techData.visitPrice || techData.price;
                    console.log('Selected price value:', price);
                    
                    bookingData.technicianEmail = loginEmail || 'N/A';
            
            // Try multiple specialization field names
            const specialization = techData.specialization || 
                                 techData.service || 
                                 techData.services || 
                                 techData.category || 
                                 techData.type || 
                                 techData.jobType || 
                                 techData.workType || 
                                 techData.profession || 
                                 techData.trade || 
                                 techData.skill || 
                                 techData.skills || 
                                 'N/A';
            
            bookingData.specialization = specialization;
            // Use the technician's base price from their profile
            bookingData.price = price || 'N/A';
                    console.log('Technician details mapped:', {
                      email: bookingData.technicianEmail,
                      specialization: bookingData.specialization,
                      price: bookingData.price,
                      allFields: Object.keys(techData)
                    });
                  } else {
                    bookingData.technicianEmail = 'N/A';
                    bookingData.specialization = 'N/A';
                    bookingData.price = 'N/A';
                  }
                } catch (error) {
                  console.error('Error fetching technician details:', error);
                  bookingData.technicianEmail = 'N/A';
                  bookingData.specialization = 'N/A';
                  bookingData.price = 'N/A';
                }
                return bookingData;
              })
            );
    
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
      });
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
    margin-right: 0;
    padding: 0.75rem;
  }
  
  .booking-main {
    padding: 1rem;
  }
  
  .booking-container {
    max-width: 100%;
  }
  
  .title-search-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .search-wrapper {
    width: 100%;
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
    width: 100%;
    height: 50px;
  }
  
  .search-input {
    font-size: 0.875rem;
    padding: 0 12px 0 45px;
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
  
  .booking-status {
    padding: 0.125rem 0.5rem;
    font-size: 0.6875rem;
  }
  
  .check-expired-btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
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
    padding: 0 10px 0 40px;
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
    width: 100%;
    height: 50px;
  }
  
  .search-input {
    font-size: 0.75rem;
    padding: 0 8px 0 38px;
  }
  
  .search-icon {
    left: 4px;
    font-size: 0.8125rem;
    padding: 4px;
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
    padding: 0 6px 0 36px;
  }
  
  .search-icon {
    left: 2px;
    font-size: 0.75rem;
    padding: 3px;
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