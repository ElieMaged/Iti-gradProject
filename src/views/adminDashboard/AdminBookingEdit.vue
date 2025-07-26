<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="booking-main">
      <div class="booking-container">
        <div class="header-section">
          <div class="back-button" @click="goBack">
            <i class="fas fa-arrow-left"></i>
            <span>Back to Upcoming Bookings</span>
          </div>
          <h2 class="booking-title">Edit Booking</h2>
        </div>

        <div v-if="loading" class="loading">
          <i class="fas fa-spinner fa-spin"></i>
          <span>Loading booking details...</span>
        </div>

        <div v-else-if="booking" class="booking-edit-form">
          <form @submit.prevent="saveChanges">
            <div class="form-grid">
              <div class="form-section">
                <h3>Booking Information</h3>
                <div class="form-group">
                  <label>Booking ID:</label>
                  <input type="text" :value="booking.id" disabled class="form-input disabled" />
                </div>
                <div class="form-group">
                  <label>Status:</label>
                  <select v-model="editedBooking.status" class="form-input">
                    <option value="pending">Pending</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Date:</label>
                  <input type="date" v-model="editedBooking.date" class="form-input" required />
                </div>
                <div class="form-group">
                  <label>Time:</label>
                  <input type="time" v-model="editedBooking.time" class="form-input" required />
                </div>
                <div class="form-group">
                  <label>Payment Method:</label>
                  <select v-model="editedBooking.payment" class="form-input">
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Online Payment">Online Payment</option>
                  </select>
                </div>
              </div>

              <div class="form-section">
                <h3>User Information</h3>
                <div class="form-group">
                  <label>Name:</label>
                  <input type="text" v-model="editedBooking.userName" class="form-input" required />
                </div>
                <div class="form-group">
                  <label>Email:</label>
                  <input type="email" v-model="editedBooking.userEmail" class="form-input" required />
                </div>
                <div class="form-group">
                  <label>Phone:</label>
                  <input type="tel" v-model="editedBooking.userPhone" class="form-input" required />
                </div>
              </div>

              <div class="form-section">
                <h3>Technician Information</h3>
                <div class="form-group">
                  <label>Name:</label>
                  <input type="text" v-model="editedBooking.technicianName" class="form-input" required />
                </div>
                <div class="form-group">
                  <label>Specialization:</label>
                  <input type="text" v-model="editedBooking.specialization" class="form-input" />
                </div>
              </div>

              <div class="form-section">
                <h3>Service Details</h3>
                <div class="form-group">
                  <label>Address:</label>
                  <textarea v-model="editedBooking.address" class="form-input" rows="3"></textarea>
                </div>
                <div class="form-group">
                  <label>Price:</label>
                  <input type="number" v-model="editedBooking.price" class="form-input" step="0.01" min="0" />
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="goBack">
                <i class="fas fa-times"></i>
                Cancel
              </button>
              <button type="submit" class="save-btn" :disabled="saving">
                <i class="fas fa-save"></i>
                {{ saving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
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
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import AdminSidebar from '../../components/admin-sidebar.vue';

const route = useRoute();
const router = useRouter();
const booking = ref(null);
const loading = ref(true);
const saving = ref(false);
const editedBooking = reactive({});

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
  margin-bottom: 2rem;
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

.booking-edit-form {
  background: #fff;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.form-section {
  background: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
}

.form-section h3 {
  margin: 0 0 1rem 0;
  color: #7c6bb0;
  font-size: 1.1rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #666;
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

.form-input.disabled {
  background-color: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

.form-input textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.cancel-btn, .save-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
}

.cancel-btn {
  background: #6b7280;
  color: #fff;
}

.cancel-btn:hover {
  background: #4b5563;
}

.save-btn {
  background: #10b981;
  color: #fff;
}

.save-btn:hover {
  background: #059669;
}

.save-btn:disabled {
  background: #d1fae5;
  cursor: not-allowed;
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
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style> 