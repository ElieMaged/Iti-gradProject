<template>
  <div class="flex min-h-screen">
    <!-- Main Content -->
    <div class="flex-1 p-8">
      <div class="user-dashboard-layout">
        <div class="booking-main">
          <div class="booking-container">
            <div class="title-search-row">
              <h2 class="booking-title">Completed Bookings</h2>
              <div class="search-wrapper">
                <input v-model="searchQuery" class="search-input" type="text" placeholder="Search" />
                <span class="search-icon"><i class="fas fa-search"></i></span>
              </div>
              <div class="filter-controls">
                <select
                  v-model="statusFilter"
                  class="filter-select"
                  aria-label="Filter bookings by status"
                  title="Filter by status"
                >
                  <option value="completed">Completed ({{ statusCounts.completed }})</option>
                  <option value="pending" disabled>Pending (0)</option>
                  <option value="upcoming" disabled>Upcoming (0)</option>
                  <option value="cancelled" disabled>Cancelled (0)</option>
                </select>
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
                    <th>Technician Email</th>
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
                  <tr v-for="(booking, index) in filteredBookings" :key="booking.id" class="table-row">
                    <td>{{ booking.technicianName }}</td>
                    <td>{{ booking.technicianEmail || 'N/A' }}</td>
                    <td>{{ booking.specialization || 'N/A' }}</td>
                    <td>{{ booking.date }}</td>
                    <td>{{ booking.time }}</td>
                    <td>{{ booking.address && booking.address.trim() ? booking.address : 'Address not provided' }}</td>
                    <td>{{ booking.price || 'N/A' }}</td>
                    <td><span class="status-completed">{{ booking.status === 'complete' ? 'Complete' : booking.status }}</span></td>
                    <td>
                      <button @click="addReview(booking)" class="review-btn">
                        Add Review
                      </button>
                    </td>
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

const router = useRouter();
const searchQuery = ref('');
const bookings = ref([]);
const statusFilter = ref('completed');
const loading = ref(true);
const error = ref(null);
const userUid = ref(null);

const filteredBookings = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return bookings.value.filter(b =>
    Object.values(b).some(val => String(val).toLowerCase().includes(q))
  );
});

// Counts for dropdown labels (completed view focuses on completed)
const statusCounts = computed(() => ({
  completed: bookings.value.length,
  pending: 0,
  upcoming: 0,
  cancelled: 0,
}));

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
      where('status', 'in', ['completed', 'complete']) // Include both statuses
    );
    const snapshot = await getDocs(q);
    
    console.log('Found completed/complete bookings for user:', snapshot.docs.length);
    
    // Fetch technician details for each booking
    const bookingsWithTechDetails = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const bookingData = { id: doc.id, ...doc.data() };
        
        // Debug: Log the raw booking data to see what's actually stored
        console.log('=== COMPLETED BOOKING DATA DEBUG (USER) ===');
        console.log('Booking ID:', bookingData.id);
        console.log('Raw booking data:', bookingData);
        console.log('User email from booking:', bookingData.userEmail);
        console.log('User email type:', typeof bookingData.userEmail);
        console.log('Address field:', bookingData.address);
        console.log('Address type:', typeof bookingData.address);
        console.log('Address length:', bookingData.address ? bookingData.address.length : 'undefined');
        console.log('All booking fields:', Object.keys(bookingData));
        
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
        console.log('=== END COMPLETED BOOKING DATA DEBUG (USER) ===');
        
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

function addReview(booking) {
  // Navigate to review page or open review modal
  // You can implement this based on your review system
  router.push({
    path: '/add-review',
    query: { 
      bookingId: booking.id,
      technicianId: booking.technicianId,
      technicianName: booking.technicianName
    }
  });
}

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userUid.value = user.uid;
      fetchBookings();
    } else {
      error.value = 'User not authenticated.';
      loading.value = false;
    }
  });
});
</script>

<style scoped>
.user-bookings-page {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.sidebar-container {
  flex-shrink: 0;
}

.main-content {
  flex: 1;
  padding: 2rem;  
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
  text-align: center;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 2rem;
  text-align: left;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
}

.dark .page-title {
  color: var(--primary-color);
}

.page-description {
  color: var(--primary-color);
  font-size: 1.1rem;
  text-align: left;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
}

.dark .page-description {
  color: var(--primary-color);
}

.bookings-container {
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  padding: 0;
}
.dark .bookings-container {
  background: transparent;
}

.bookings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}


.bookings-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.dark .bookings-header h2 {
  color: var(--text-main) !important;
}

.dark .bookings-header {
 color: var(--primary-color);
}

.filter-controls {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 0.9rem;
}

.table-wrapper {
  overflow-x: auto;
}

.booking-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  border-radius: 0;
  overflow: visible;
  box-shadow: none;
  background: transparent;
}

.table-header {
  background: rgba(124, 107, 176, 0.2);
  color: #333;
  font-weight: 600;
  text-align: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  border-radius: 12px;
}

.dark .table-header {
  background: rgba(124, 107, 176, 0.25);
  color: var(--text-main) !important;
}

/* Center header text like booking-pending */
.table-header th {
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.dark .table-header th {
  color: var(--text-main) !important;
}

.table-header th {
  padding: 0.75rem 1.5rem;
}

.table-row {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s ease;
}

.table-row:last-child {
  border-bottom: none;
}

/* Add vertical borders between columns like booking-pending */
.booking-table th,
.booking-table td {
  padding: 0.5rem;
  border-right: 1px solid #e5e7eb;

}

.booking-table th:last-child,
.booking-table td:last-child {
  border-right: none;
}


.table-row:hover {
  background: #ede7f6;
}
.dark .table-row {
  background: var(--gray-200);
}

/* Zebra striping similar to booking-pending */
.table-row:nth-child(even) {
  background: #faf5ff;
}

/* Dark mode: match pending table aesthetics */
.dark .table-wrapper {
  background: transparent;
  box-shadow: none;
}

.dark .booking-table {
  background: transparent;
}

.dark .booking-table th,
.dark .booking-table td {
  border-right: 1px solid #3f3f46;
}

.dark .table-row:hover {
  background: rgba(124, 107, 176, 0.15);
}

.dark .table-row:nth-child(even) {
  background: rgba(124, 107, 176, 0.07);
}

/* Dark mode table text */
.dark .table-row td,
.dark .table-header th {
  color: var(--text-main) !important;
}

/* Dark mode status pills - keep same palette for contrast */
.dark .status-pending {
  background: #fef3c7;
  color: #92400e;
}
.dark .status-upcoming {
  background: #dbeafe;
  color: #bfdbfe; /* keep legible but we will override text to main */
  color: #1e40af;
}
.dark .status-completed {
  background: #d1fae5;
  color: #065f46;
}
.dark .status-cancelled {
  background: #fee2e2;
  color: #991b1b;
}


/* Center cells and vertically middle align like booking-pending */
.table-cell {
  padding: 0.75rem 1.5rem;
  color: #333;
  font-size: 0.9rem;
  text-align: center;
  vertical-align: middle;
}

/* Ensure table body cells are centered and vertically aligned */
.table-row td {
  text-align: center;
  vertical-align: middle;
}

/* Pill status styles to mirror booking-pending */
.status-pending {
  background: #fef3c7;
  color: #92400e;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
}

.status-upcoming {
  background: #dbeafe;
  color: #1e40af;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
}

.status-completed {
  background: #d1fae5;
  color: #065f46;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
}

.status-cancelled {
  background: #fee2e2;
  color: #991b1b;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
}

.booking-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.cancel-btn, .book-again-btn, .view-profile-btn {
  padding: 0.5rem 0.5rem;
  border: none;
  border-radius: 25px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 85px;
  height: 25px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cancel-btn {
  background: #ef4444;
  color: white;
}

.cancel-btn:hover:not(:disabled) {
  background: #dc2626;
}

.cancel-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.book-again-btn {
  background: #10b981;
  color: white;
}

.book-again-btn:hover {
  background: #059669;
}

.view-profile-btn {
  background: #3b82f6;
  color: white;
}

.view-profile-btn:hover {
  background: #2563eb;
}

/* Loading and Error States */
.loading-state, .error-state {
  text-align: center;
  padding: 3rem;
}

.loading-spinner {
  border: 3px solid #e5e7eb;
  border-top: 3px solid #7c6bb0;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}


@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #dc2626;
  margin-bottom: 1rem;
}

.retry-btn {
  background: #7c6bb0;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}
.dark .retry-btn {
  background: var(--primary-color);
}
.retry-btn:hover {
  background: #6b5fa7;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem;
}

.empty-icon {
  font-size: 4rem;
  color: #9ca3af;
  margin-bottom: 1rem;
}
.dark .empty-icon {
  color: var(--icon-color);
}
.empty-state h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}
.dark .empty-state h3 {
  color: var(--muted-text);
}
.empty-state p {
  color: #666;
  margin-bottom: 2rem;
}
.dark .empty-state p {
  color: var(--muted-text);
}
.browse-services-btn {
  background: #7c6bb0;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}
.dark .browse-services-btn {
  background: var(--primary-color);
}
.browse-services-btn:hover {
  background: #6b5fa7;
}

/* Responsive Layout Styles */
.admin-dashboard-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
  background: #faf8fd;
}

.dark .admin-dashboard-layout {
  background-color: var(--primary-bg);
}

.user-bookings-main {
  background-color: #f9fafb;
  min-height: 100vh;
  font-family: sans-serif;
  flex: 1;
}

.dark .user-bookings-main {
  background-color: var(--primary-bg);
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .layout {
    flex-direction: column;
    min-height: auto;
  }
  .admin-dashboard-layout {
    flex-direction: column;
  }
  
  .user-bookings-main {
    margin-top: 80px;
    padding: 1rem;
    margin-right: 0;
  }
  
  .page-header {
    margin-bottom: 1.5rem;
    text-align: left;
  }
  
  .page-title {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    text-align: center;
  }
  
  .page-description {
    color: var(--primary-color);
    font-size: 1rem;
    text-align: left;
  }
  
  .bookings-container {
    padding: 1.5rem;
    border-radius: 0.75rem;
  }
  
  .bookings-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .bookings-header h2 {
    font-size: 1.25rem;
  }
  
  .filter-controls {
    width: 100%;
  }
  
  .filter-select {
    width: 100%;
    padding: 0.75rem;
  }
  
  .table-wrapper {
    overflow-x: auto;
  }

  .booking-table {
    display: block;
    width: 100%;
  }

  .table-header {
    display: none;
  }

  .table-row {
    display: block;
    margin-bottom: 1rem;
    padding: 1rem;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .table-row td {
    display: block;
    text-align: left;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e5e7eb;
    position: relative;
  }

  .table-row td:before {
    content: attr(data-label);
    font-weight: 600;
    color: #666;
    margin-right: 0.5rem;
  }

  .table-row td:last-child {
    border-bottom: none;
  }

  .booking-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .cancel-btn, .book-again-btn, .view-profile-btn {
    width: 100%;
    padding: 0.75rem;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .user-bookings-main {
    margin-top: 60px;
    padding: 0.75rem;
  }
  
  .bookings-container {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.25rem;
    text-align: center;
  }
  
  .page-description {
    color: var(--primary-color);
    font-size: 0.875rem;
    text-align: left;
  }
  
  .bookings-header h2 {
    font-size: 1.125rem;
  }
  
  .table-row {
    padding: 0.75rem;
  }
  
  .table-row td {
    font-size: 0.875rem;
  }
  
  .cancel-btn, .book-again-btn, .view-profile-btn {
    font-size: 0.875rem;
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 0.75rem;
  }
  
  .page-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .filter-controls {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .filter-select {
    width: 100%;
    padding: 0.6rem;
    font-size: 0.9rem;
  }
  
  .table-cell {
    padding-left: 45%;
    font-size: 0.85rem;
  }
  
  .table-cell:before {
    width: 45%;
    font-size: 0.8rem;
  }
  
  .booking-actions {
    gap: 0.5rem;
  }
  
  .action-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }
  
  .empty-state {
    padding: 2rem 1rem;
  }
  
  .empty-icon {
    font-size: 3rem;
  }
  
  .empty-state h3 {
    font-size: 1.25rem;
  }
  
  .empty-state p {
    font-size: 0.9rem;
  }
  
  .browse-services-btn {
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }
  
  .loading-spinner {
    width: 35px;
    height: 35px;
  }
  
  .error-message {
    padding: 0.75rem;
    font-size: 0.85rem;
  }
  
  .retry-btn {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 360px) {
  .main-content {
    padding: 0.5rem;
  }
  
  .page-title {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
  }
  
  .filter-controls {
    gap: 0.5rem;
  }
  
  .filter-select {
    padding: 0.5rem;
    font-size: 0.85rem;
  }
  
  .table-cell {
    padding-left: 40%;
    font-size: 0.8rem;
  }
  
  .table-cell:before {
    width: 40%;
    font-size: 0.75rem;
  }
  
  .action-btn {
    padding: 0.4rem 0.6rem;
    font-size: 0.75rem;
  }
  
  .empty-state {
    padding: 1.5rem 0.75rem;
  }
  
  .empty-icon {
    font-size: 2.5rem;
  }
  
  .empty-state h3 {
    font-size: 1.1rem;
  }
  
  .empty-state p {
    font-size: 0.85rem;
  }
  
  .browse-services-btn {
    padding: 0.5rem 1.25rem;
    font-size: 0.85rem;
  }
  
  .loading-spinner {
    width: 30px;
    height: 30px;
  }
  
  .error-message {
    padding: 0.6rem;
    font-size: 0.8rem;
  }
  
  .retry-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}

/* Landscape orientation adjustments */
@media (max-width: 768px) and (orientation: landscape) {
  .main-content {
    padding: 0.75rem;
  }
  
  .filter-controls {
    flex-direction: row;
    gap: 1rem;
  }
  
  .filter-select {
    width: auto;
    flex: 1;
  }
  
  .booking-actions {
    flex-direction: row;
  }
  
  .action-btn {
    flex: 1;
  }
}

/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .table-cell {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .action-btn,
  .browse-services-btn,
  .retry-btn {
    transition: none;
  }
  
  .loading-spinner {
    animation: none;
  }
}

/* Additional mobile optimizations */
@media (max-width: 320px) {
  .main-content {
    padding: 0.5rem;
  }
  
  .page-title {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }
  
  .page-description {
    color: var(--primary-color);
    font-size: 0.85rem;
  }
  
  .bookings-container {
    padding: 0.75rem;
  }
  
  .bookings-header {
    gap: 0.5rem;
  }
  
  .bookings-header h2 {
    font-size: 1rem;
  }
  
  .filter-controls {
    gap: 0.4rem;
  }
  
  .filter-select {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
  
  .table-row {
    padding: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  .table-cell {
    padding: 0.3rem 0;
    padding-left: 30%;
    font-size: 0.8rem;
  }
  
  .table-cell:before {
    width: 25%;
    font-size: 0.7rem;
  }
  
  .booking-actions {
    gap: 0.3rem;
    margin-top: 0.5rem;
  }
  
  .action-btn {
    padding: 0.4rem 0.6rem;
    font-size: 0.75rem;
  }
  
  .empty-state {
    padding: 1rem 0.5rem;
  }
  
  .empty-icon {
    font-size: 2.5rem;
  }
  
  .empty-state h3 {
    font-size: 1rem;
  }
  
  .empty-state p {
    font-size: 0.8rem;
  }
  
  .browse-services-btn {
    padding: 0.5rem 1.25rem;
    font-size: 0.8rem;
  }
  
  .loading-spinner {
    width: 30px;
    height: 30px;
  }
  
  .error-message {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
  
  .retry-btn {
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
  }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .action-btn,
  .browse-services-btn,
  .retry-btn {
    min-height: 44px;
  }
  
  .filter-select {
    min-height: 44px;
  }
}
</style> 