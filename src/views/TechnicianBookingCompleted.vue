<template>
  <div class="flex min-h-screen layout-container">
    <!-- Sidebar -->
    <Sidebar :activeMenu="'booking'" :activeBookingStatus="'completed'" @navigate="handleSidebarNavigate" />
    <!-- Main Content -->
    <div class="flex-1 p-4 mr-20">
      <div class="admin-dashboard-layout">
        <div class="booking-main">
          <div class="booking-container">
            <div class="title-search-row">
              <h2 class="page-title">{{ $t('completedBookings') }}</h2>
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
            <div v-else-if="filteredBookings.length > 0" class="table-wrapper">
              <table class="booking-table">
                <thead>
                  <tr class="table-header">
                    <th>{{ $t('userName') }}</th>
                    <th>{{ $t('userEmail') }}</th>
                    <th>{{ $t('technicianName') }}</th>
                    <th>{{ $t('technicianEmail') }}</th>
                    <th>{{ $t('specialization') }}</th>
                    <th>{{ $t('date') }}</th>
                    <th>{{ $t('time') }}</th>
                    <th>{{ $t('address') }}</th>
                    <th>{{ $t('price') }}</th>
                    <th>{{ $t('status') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(booking, index) in filteredBookings" :key="booking.id" class="table-row">
                    <td>{{ booking.userName }}</td>
                    <td>{{ booking.userEmail || 'N/A' }}</td>
                    <td>{{ booking.technicianName }}</td>
                    <td>{{ booking.technicianEmail || 'N/A' }}</td>
                    <td>{{ booking.specialization || 'N/A' }}</td>
                    <td>{{ booking.date }}</td>
                    <td>{{ booking.time }}</td>
                    <td>{{ booking.address && booking.address.trim() ? booking.address : 'Address not provided' }}</td>
                    <td>{{ booking.price || 'N/A' }}</td>
                    <td><span class="status-completed">{{ booking.status === 'complete' ? $t('complete') : booking.status }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="empty-state">
              <p>{{ $t('noCompletedBookings') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { collection, getDocs, query, where, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'vue-router';
import Sidebar from '../components/Sidebar.vue';

const router = useRouter();
const searchQuery = ref('');
const bookings = ref([]);
const loading = ref(true);
const error = ref(null);
const technicianUid = ref(null);

const filteredBookings = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return bookings.value.filter(b =>
    Object.values(b).some(val => String(val).toLowerCase().includes(q))
  );
});

function handleSidebarNavigate(path) {
  router.push(path);
}

async function fetchBookings() {
  try {
    loading.value = true;
    error.value = null;
    if (!technicianUid.value) {
      error.value = 'Technician not authenticated.';
      return;
    }
    const q = query(
      collection(db, 'bookings'),
      where('technicianId', '==', technicianUid.value),
      where('status', 'in', ['completed', 'complete']) // Include both statuses
    );
    const snapshot = await getDocs(q);
    
    console.log('Found completed/complete bookings:', snapshot.docs.length);
    
    // Fetch technician details for each booking
    const bookingsWithTechDetails = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const bookingData = { id: doc.id, ...doc.data() };
        
        // Debug: Log the raw booking data to see what's actually stored
        console.log('=== COMPLETED BOOKING DATA DEBUG ===');
        console.log('Booking ID:', bookingData.id);
        console.log('Raw booking data:', bookingData);
        console.log('User email from booking:', bookingData.userEmail);
        console.log('User email type:', typeof bookingData.userEmail);
        console.log('Address field:', bookingData.address);
        console.log('Address type:', typeof bookingData.address);
        console.log('Address length:', bookingData.address ? bookingData.address.length : 'undefined');
        console.log('All booking fields:', Object.keys(bookingData));
        
        // Try to get technician details from technicians collection
        try {
          console.log('=== TECHNICIAN LOOKUP DEBUG ===');
          console.log('Looking up technician with ID:', bookingData.technicianId);
          
          const technicianDoc = await getDoc(doc(db, 'technicians', bookingData.technicianId));
          if (technicianDoc.exists()) {
            const techData = technicianDoc.data();
            console.log('=== TECHNICIAN DATA DEBUG ===');
            console.log('Technician ID:', bookingData.technicianId);
            console.log('Technician document exists:', technicianDoc.exists());
            console.log('Technician data found:', techData);
            console.log('All technician fields:', Object.keys(techData));
            console.log('Email field value:', techData.email);
            console.log('UserEmail field value:', techData.userEmail);
            console.log('TechnicianEmail field value:', techData.technicianEmail);
            console.log('ContactEmail field value:', techData.contactEmail);
            
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
            
            // Use the correct field names based on the technician document structure
            // Try multiple possible field names for email
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
            console.log('=== END TECHNICIAN DATA DEBUG ===');
          } else {
            console.log('⚠️ Technician document not found for ID:', bookingData.technicianId);
            bookingData.technicianEmail = 'N/A';
            bookingData.specialization = 'N/A';
            bookingData.price = 'N/A';
          }
        } catch (error) {
          console.error('❌ Error fetching technician details:', error);
          console.error('Error details:', {
            code: error.code,
            message: error.message,
            stack: error.stack
          });
          bookingData.technicianEmail = 'N/A';
          bookingData.specialization = 'N/A';
          bookingData.price = 'N/A';
        }
        
        // Debug: Log the final booking data
        console.log('Final booking data with address:', bookingData.address);
        console.log('=== END COMPLETED BOOKING DATA DEBUG ===');
        
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
      fetchBookings();
    } else {
      error.value = 'Technician not authenticated.';
      loading.value = false;
    }
  });
});
</script>

<style scoped>
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
  max-width: 80rem;
  margin: 0 auto;
}

.title-search-row {
  display: flex;
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
  padding: 8px;
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

.status-completed {
  background: #dcfce7;
  color: #166534;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.dark .status-completed {
  background: #166534;
  color: #dcfce7;
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
  
  .admin-dashboard-layout {
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
    max-width: 400px;
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
  
  .admin-dashboard-layout {
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
    left: 8px;
    font-size: 1rem;
    padding: 6px;
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
  
  .status-completed {
    padding: 0.125rem 0.5rem;
    font-size: 0.6875rem;
  }
}

@media (max-width: 600px) {
  .flex-1.p-8 {
    padding: 0.5rem;
  }
  
  .admin-dashboard-layout {
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
    left: 6px;
    font-size: 0.875rem;
    padding: 5px;
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
  
  .status-completed {
    padding: 0.125rem 0.375rem;
    font-size: 0.625rem;
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
  
  .admin-dashboard-layout {
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
  
  .status-completed {
    padding: 0.125rem 0.25rem;
    font-size: 0.5625rem;
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
  
  .admin-dashboard-layout {
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
    padding: 6px;
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
  
  .status-completed {
    padding: 0.125rem 0.125rem;
    font-size: 0.5rem;
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