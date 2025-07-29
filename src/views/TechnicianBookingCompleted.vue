<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <Sidebar :activeMenu="'booking'" :activeBookingStatus="'completed'" @navigate="handleSidebarNavigate" />
    <!-- Main Content -->
    <div class="flex-1 p-8">
      <div class="admin-dashboard-layout">
        <div class="booking-main">
          <div class="booking-container">
            <div class="title-search-row">
              <h2 class="booking-title">Completed Bookings</h2>
              <div class="search-wrapper">
                <input v-model="searchQuery" class="search-input" type="text" placeholder="Search" />
                <span class="search-icon"><i class="fas fa-search"></i></span>
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
                    <td><span class="status-completed">{{ booking.status === 'complete' ? 'Complete' : booking.status }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="empty-state">
              <p>No completed bookings found.</p>
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

.status-completed {
  background: #dcfce7;
  color: #166534;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
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