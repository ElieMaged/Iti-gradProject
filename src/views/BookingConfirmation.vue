<template>
  <div class="confirmation-page">
    <!-- Header -->
    <div class="header">
      <h1 class="page-title">{{ $t('completeYourBooking') }}</h1>
    </div>

    <!-- Main Confirmation Card -->
    <div class="confirmation-card">
      <!-- Progress Indicator -->
      <div class="progress-indicator">
        <div class="progress-step">
          <div class="step-circle">1</div>
          <span class="step-text">{{ $t('detailsAndPayment') }}</span>
        </div>
        <div class="progress-line"></div>
        <div class="progress-step active">
          <div class="step-circle">2</div>
          <span class="step-text">{{ $t('confirmation') }}</span>
        </div>
      </div>

      <!-- Success Section -->
      <div class="success-section">
                 <div class="success-icon">
                  <img class="stary" src="../../public/images/star-circle.png" alt="">
         </div>
        <div class="success-message">
          <h2 class="success-title">Request Submitted</h2>
          <p class="success-description">Your request has been submitted successfully. Our technician will contact you shortly.</p>
        </div>
      </div>

      <!-- What Happens Next Section -->
      <div class="next-steps-section">
        <h2 class="section-title">{{ $t('whatHappensNext') }}</h2>
        <p class="next-steps-description">Sit tight while our technician responds to your request!</p>
      </div>

      <!-- Booking Summary Section -->
      <div class="booking-summary-section">
        <h2 class="section-title">Booking Summary</h2>
        <div class="summary-details">
          <div class="summary-item">
            <span class="summary-label">Technician:</span>
            <span class="summary-value">{{ booking.technicianName }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Date And Time:</span>
            <span class="summary-value">{{ booking.date }} - {{ booking.time }}</span>
          </div>

          <div class="summary-item">
            <span class="summary-label">Payment Method:</span>
            <span class="summary-value">{{ booking.payment }}</span>
          </div>
          
          <!-- Total Amount Information -->
          <div v-if="booking.adminAmount && booking.technicianAmount" class="total-amount-section">
            <div class="summary-item">
              <span class="summary-label">Total Amount:</span>
              <span class="summary-value total-amount">{{ (booking.adminAmount + booking.technicianAmount) }} EGP</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Back To Home Button -->
      <button class="back-to-home-btn" @click="goHome">
        Back to Home
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const booking = ref({
  technicianName: '',
  technicianRole: '',
  date: '',
  time: '',
  technicianPhone: '',
  payment: '',
  adminAmount: null,
  technicianAmount: null
});

onMounted(() => {
  const stored = localStorage.getItem('bookingData');
  console.log('Stored booking data:', stored);
  if (stored) {
    const parsedData = JSON.parse(stored);
    console.log('Parsed booking data:', parsedData);
    Object.assign(booking.value, parsedData);
  } else {
    console.log('No booking data found in localStorage');
  }
});

function goHome() {
  router.push('/');
}
</script>

<style scoped>
.confirmation-page {
  background: #f7f7fa;
  min-height: 100vh;
  padding: 2rem 0 4rem 0;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  color: #7c6bb1;
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
}

.confirmation-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem;
}

/* Progress Indicator */
.progress-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3rem;
  gap: 2rem;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.step-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  color: white;
  background: #e5e7eb;
}

.progress-step.active .step-circle {
  background: #7c6bb1;
}

.step-text {
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 500;
}

.progress-step.active .step-text {
  color: #7c6bb1;
  font-weight: 600;
}

.progress-line {
  width: 300px;
  height: 2px;
  background: #e5e7eb;
  margin: 0rem;
}

/* Success Section */
.success-section {
  text-align: center;
  margin-bottom: 3rem;
}

.success-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem auto;
}

.success-icon svg {
  width: 100%;
  height: 100%;
}

.success-title {
  color: #7c6bb1;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
}

.success-description {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
  line-height: 1.5;
}

/* Next Steps Section */
.next-steps-section {
  background: #f8fafc;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  text-align: center;
}

.section-title {
  color: #7c6bb1;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
}

.next-steps-description {
  color: #374151;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  text-align: center;
}

/* Booking Summary Section */
.booking-summary-section {
  background: #f8fafc;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  text-align: center;
}

.summary-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.summary-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
  width: 100%;
  max-width: 500px;
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-label {
  font-weight: 600;
  color: #374151;
  font-size: 1rem;
  min-width: 140px;
  text-align: left;
}

.summary-value {
  color: #6b7280;
  font-size: 1rem;
  text-align: right;
  flex: 1;
  margin-left: 1rem;
}

/* Total Amount Section */
.total-amount-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
  width: 100%;
  max-width: 500px;
}

.total-amount {
  font-weight: 700;
  color: #1f2937;
  font-size: 1.1rem;
}

/* Back To Home Button */
.back-to-home-btn {
  background: #7c6bb1;
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  display: block;
}

.back-to-home-btn:hover {
  background: #6b5fa7;
}

/* Responsive Design */
@media (max-width: 768px) {
  .confirmation-page {
    padding: 1rem 0 2rem 0;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .confirmation-card {
    margin: 0 1rem;
    padding: 2rem 1.5rem;
  }
  
  .progress-indicator {
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .step-circle {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .step-text {
    font-size: 0.8rem;
  }
  
  .progress-line {
    width: 50px;
  }
  
  .success-icon {
    width: 70px;
    height: 70px;
  }
  
  .success-title {
    font-size: 1.3rem;
  }
  
  .next-steps-section,
  .booking-summary-section {
    padding: 1.5rem;
  }
  
  .section-title {
    font-size: 1.1rem;
  }
  
  .summary-item {
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
    text-align: center;
  }
  
  .summary-label {
    text-align: center;
    min-width: auto;
  }
  
  .summary-value {
    text-align: center;
    margin-left: 0;
  }
  
  .back-to-home-btn {
    padding: 0.875rem 2rem;
    font-size: 1rem;
  }
}
.stary {
  height:5rem;
  width: 100%;
}
@media (max-width: 480px) {
  .confirmation-card {
    margin: 0 0.5rem;
    padding: 1.5rem 1rem;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .step-circle {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
  }
  
  .step-text {
    font-size: 0.75rem;
  }
  
  .progress-line {
    width: 30px;
  }
  
  .success-icon {
    width: 60px;
    height: 60px;
  }
  
  .success-title {
    font-size: 1.2rem;
  }
  
  .next-steps-section,
  .booking-summary-section {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 1rem;
  }
  
  .summary-label,
  .summary-value {
    font-size: 0.9rem;
  }
}

</style> 