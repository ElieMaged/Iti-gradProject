<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="booking-main">
      <div class="booking-container">
        <div class="header-section">
          <div class="header-left">
            <div class="back-button" @click="goBack">
              <i class="fas fa-arrow-left"></i>
              <span>Back to Upcoming Bookings</span>
            </div>
            <h2 class="booking-title">{{ isEditMode ? 'Edit Booking' : 'Booking Details' }}</h2>
          </div>
          <div v-if="!isEditMode" class="edit-toggle">
            <button class="edit-toggle-btn" @click="toggleEditMode">
              <i class="fas fa-pen"></i>
              Edit
            </button>
          </div>
        </div>

        <div v-if="loading" class="loading">
          <i class="fas fa-spinner fa-spin"></i>
          <span>Loading booking details...</span>
        </div>

        <div v-else-if="booking" class="booking-details">
          <form v-if="isEditMode" @submit.prevent="saveChanges">
            <div class="details-grid">
              <div class="detail-card">
                <h3>Booking Information</h3>
                <div class="detail-row">
                  <span class="label">Booking ID:</span>
                  <span class="value">{{ booking.id }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Status:</span>
                  <select v-model="editedBooking.status" class="form-input">
                    <option value="pending">Pending</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div class="detail-row">
                  <span class="label">Date:</span>
                  <input type="date" v-model="editedBooking.date" class="form-input" required />
                </div>
                <div class="detail-row">
                  <span class="label">Time:</span>
                  <input type="time" v-model="editedBooking.time" class="form-input" required />
                </div>
                                 <div class="detail-row">
                   <span class="label">Payment Method:</span>
                   <select v-model="editedBooking.payment" class="form-input">
                     <option value="Cash">Cash</option>
                     <option value="Bank Transfer">Bank Transfer</option>
                     <option value="Online Payment">Online Payment</option>
                   </select>
                 </div>
              </div>

              <div class="detail-card">
                <h3>User Information</h3>
                <div class="detail-row">
                  <span class="label">Name:</span>
                  <input type="text" v-model="editedBooking.userName" class="form-input" required />
                </div>
                <div class="detail-row">
                  <span class="label">Email:</span>
                  <input type="email" v-model="editedBooking.userEmail" class="form-input" required />
                </div>
                <div class="detail-row">
                  <span class="label">Phone:</span>
                  <input type="tel" v-model="editedBooking.userPhone" class="form-input" required />
                </div>
              </div>

              <div class="detail-card">
                <h3>Technician Information</h3>
                <div class="detail-row">
                  <span class="label">Name:</span>
                  <input type="text" v-model="editedBooking.technicianName" class="form-input" required />
                </div>
                <div class="detail-row">
                  <span class="label">Specialization:</span>
                  <input type="text" v-model="editedBooking.specialization" class="form-input" />
                </div>
              </div>

              <div class="detail-card">
                <h3>Service Details</h3>
                <div class="detail-row">
                  <span class="label">Address:</span>
                  <textarea v-model="editedBooking.address" class="form-input" rows="3"></textarea>
                </div>
                <div class="detail-row">
                  <span class="label">Price:</span>
                  <input type="number" v-model="editedBooking.price" class="form-input" step="0.01" min="0" />
                </div>
              </div>
            </div>

            <div class="actions-section">
              <button type="button" class="cancel-btn" @click="cancelEdit">
                <i class="fas fa-times"></i>
                Cancel Edit
              </button>
              <button type="submit" class="save-btn" :disabled="saving">
                <i class="fas fa-save"></i>
                {{ saving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>

          <div v-else>
            <div class="details-grid">
              <div class="detail-card">
                <h3>Booking Information</h3>
                <div class="detail-row">
                  <span class="label">Booking ID:</span>
                  <span class="value">{{ booking.id }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Status:</span>
                  <span class="status-badge">{{ booking.status }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Date:</span>
                  <span class="value">{{ booking.date }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Time:</span>
                  <span class="value">{{ booking.time }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Payment Method:</span>
                  <span class="value">{{ booking.payment }}</span>
                </div>
              </div>

              <div class="detail-card">
                <h3>User Information</h3>
                <div class="detail-row">
                  <span class="label">Name:</span>
                  <span class="value">{{ booking.userName }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Email:</span>
                  <span class="value">{{ booking.userEmail }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Phone:</span>
                  <span class="value">{{ booking.userPhone }}</span>
                </div>
              </div>

              <div class="detail-card">
                <h3>Technician Information</h3>
                <div class="detail-row">
                  <span class="label">Name:</span>
                  <span class="value">{{ booking.technicianName }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Specialization:</span>
                  <span class="value">{{ booking.specialization || 'Not specified' }}</span>
                </div>
              </div>

              <div class="detail-card">
                <h3>Service Details</h3>
                <div class="detail-row">
                  <span class="label">Address:</span>
                  <span class="value">{{ booking.address || 'Not specified' }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Price:</span>
                  <span class="value">{{ booking.price || 'Not specified' }}</span>
                </div>
              </div>
            </div>

            <div class="actions-section">
              <button 
                class="cancel-btn" 
                @click="cancelBooking" 
                :disabled="actionLoading"
              >
                <i class="fas fa-times"></i>
                Cancel Booking
              </button>
            </div>
          </div>
        </div>

        <div v-else class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <span>Booking not found</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import AdminSidebar from '../../components/admin-sidebar.vue';

const route = useRoute();
const router = useRouter();
const booking = ref(null);
const loading = ref(true);
const actionLoading = ref(false);
const saving = ref(false);
const editedBooking = reactive({});

const isEditMode = computed(() => {
  return route.query.edit === 'true';
});

onMounted(async () => {
  await fetchBookingDetails();
});

async function fetchBookingDetails() {
  try {
    const bookingId = route.params.id;
    const bookingDoc = await getDoc(doc(db, 'bookings', bookingId));
    
    if (bookingDoc.exists()) {
      booking.value = { id: bookingDoc.id, ...bookingDoc.data() };
      // Initialize editedBooking with current values
      Object.assign(editedBooking, booking.value);
    } else {
      booking.value = null;
    }
  } catch (error) {
    console.error('Error fetching booking details:', error);
    booking.value = null;
  } finally {
    loading.value = false;
  }
}

function goBack() {
  router.push('/booking-upcoming');
}

function toggleEditMode() {
  router.push({
    name: 'admin-booking-details',
    params: { id: route.params.id },
    query: { edit: 'true' }
  });
}

function cancelEdit() {
  router.push({
    name: 'admin-booking-details',
    params: { id: route.params.id }
  });
}

async function saveChanges() {
  saving.value = true;
  try {
    const bookingId = route.params.id;
    const updateData = { ...editedBooking };
    delete updateData.id; // Remove the ID from the update data
    
    await updateDoc(doc(db, 'bookings', bookingId), updateData);
    alert('Booking updated successfully!');
    router.push('/booking-upcoming');
  } catch (error) {
    console.error('Error updating booking:', error);
    alert('Failed to update booking. Please try again.');
  } finally {
    saving.value = false;
  }
}

async function cancelBooking() {
  if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
    return;
  }
  
  actionLoading.value = true;
  try {
    await deleteDoc(doc(db, 'bookings', booking.value.id));
    alert('Booking cancelled successfully!');
    router.push('/booking-upcoming');
  } catch (error) {
    console.error('Error cancelling booking:', error);
    alert('Failed to cancel booking. Please try again.');
  } finally {
    actionLoading.value = false;
  }
}
</script>

<style scoped>
.admin-dashboard-layout {
  display: flex;
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

.header-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b5fa7;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s;
}

.back-button:hover {
  color: #5a4f8f;
}

.booking-title {
  font-size: 2rem;
  font-weight: bold;
  color: #7c6bb0;
  margin: 0;
}

.loading, .error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem;
  font-size: 1.1rem;
  color: #666;
}

.error-message {
  color: #ef4444;
}

.booking-details {
  background: #fff;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.detail-card {
  background: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
}

.detail-card h3 {
  margin: 0 0 1rem 0;
  color: #7c6bb0;
  font-size: 1.1rem;
  font-weight: 600;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.detail-row:last-child {
  border-bottom: none;
}

.label {
  font-weight: 500;
  color: #666;
}

.value {
  color: #333;
  font-weight: 500;
}

.status-badge {
  background: #22c55e;
  color: #fff;
  padding: 0.2rem 0.6rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.actions-section {
  display: flex;
  justify-content: center;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.cancel-btn {
  background: #ef4444;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cancel-btn:hover {
  background: #dc2626;
}

.cancel-btn:disabled {
  background: #fecaca;
  cursor: not-allowed;
}

.edit-toggle-btn {
  background: #f59e0b;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.edit-toggle-btn:hover {
  background: #d97706;
}

.save-btn {
  background: #10b981;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.save-btn:hover {
  background: #059669;
}

.save-btn:disabled {
  background: #d1fae5;
  cursor: not-allowed;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #6b5fa7;
  box-shadow: 0 0 0 3px rgba(107, 95, 167, 0.1);
}

.form-input textarea {
  resize: vertical;
  min-height: 80px;
}

@media (max-width: 768px) {
  .booking-main {
    padding: 1rem;
  }
  
  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style> 