<template>
  <div class="booking-page">
    <!-- Header -->
    <div class="header">
      <h1 class="page-title">{{ $t('completeYourBooking') }}</h1>
    </div>

    <!-- Main Booking Card -->
    <div class="booking-card">
      <div v-if="errorMsg" class="error-message">{{ errorMsg }}</div>
      
      <!-- Progress Indicator -->
      <div class="progress-indicator">
        <div class="progress-step active">
          <div class="step-circle">1</div>
          <span class="step-text">{{ $t('detailsAndPayment') }}</span>
        </div>
        <div class="progress-line"></div>
        <div class="progress-step">
          <div class="step-circle">2</div>
          <span class="step-text">{{ $t('confirmation') }}</span>
        </div>
      </div>

      <!-- Technician Details Section -->
      <div class="technician-section">
        <div class="technician-info">
          <img 
            :src="technician.image || '/images/Avatar.png'" 
            alt="Technician" 
            class="technician-photo"
            @error="$event.target.src = '/images/Avatar.png'"
          />
          <div class="technician-details">
            <h3 class="technician-name">{{ technician.name }}</h3>
            <p class="technician-role">{{ technician.specialization || 'Technician' }}</p>
          </div>
        </div>
        
        <div class="available-appointments">
          <h4 class="appointment-title">{{ $t('availableAppointment') || 'Available Appointment' }}</h4>
          <div class="date-navigation">
            <button @click="previousDates" class="nav-arrow">
              <i class="fas fa-chevron-left"></i>
            </button>
            <div class="date-slots">
    
              <div v-for="(date, index) in visibleDates" :key="index" class="date-slot">
                <div class="day-name">{{ formatDay(date) }}</div>
                <div class="date-number">{{ formatDateNumber(date) }}</div>
                <div class="time-slot">{{ availableTimes[selectedTimeIndex] }}</div>
              </div>
            
            </div>
            <button @click="nextDates" class="nav-arrow">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Booking Form -->
      <form class="booking-form" @submit.prevent="confirmBooking">
        <!-- Your Details Section -->
        <div class="form-section">
          <h3 class="section-title">{{ $t('yourDetails') || 'Your Details' }}</h3>
          <div class="form-row">
            <div class="form-group">
              <label>{{ $t('date') }}</label>
              <select v-model="form.date" class="form-input">
                <option v-for="date in availableDates" :key="date" :value="date">{{ formatDate(date) }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>{{ $t('time') }}</label>
              <select v-model="form.time" class="form-input">
                <option v-for="time in availableTimes" :key="time" :value="time">{{ time }}</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>{{ $t('fullName') }}</label>
              <input v-model="form.fullName" :placeholder="$t('enterFullName')" class="form-input" required />
            </div>
            <div class="form-group">
              <label>{{ $t('phoneNumber') }}</label>
              <input v-model="form.phone" :placeholder="$t('enterPhoneNumber')" class="form-input" required />
            </div>
          </div>
          <div class="form-group full-width">
            <label>{{ $t('note') }}</label>
            <textarea v-model="form.note" :placeholder="$t('enterNote')" class="form-input textarea"></textarea>
          </div>
        </div>

        <!-- Location Details Section -->
        <div class="form-section">
          <h3 class="section-title">{{ $t('locationDetails') || 'Location Details' }}</h3>
          <div class="form-row">
            <div class="form-group">
              <label>{{ $t('city') }}</label>
              <select v-model="form.city" class="form-input">
                <option value="Cairo">{{ $t('cairo') }}</option>
                <option value="Giza">{{ $t('giza') }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>{{ $t('area') }}</label>
              <select v-model="form.area" class="form-input">
                <option value="Giza">{{ $t('giza') }}</option>
                <option value="Maadi">{{ $t('maadi') }}</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>{{ $t('street') }}</label>
              <input v-model="form.street" :placeholder="$t('elSodanStreet')" class="form-input" />
            </div>
            <div class="form-group">
              <label>{{ $t('detailedBuildingAddress') }}</label>
              <input v-model="form.building" :placeholder="$t('building5')" class="form-input" />
            </div>
          </div>
        </div>

        <!-- Payment Method Section -->
        <div class="form-section">
          <h3 class="section-title">{{ $t('choosePaymentMethod') }}</h3>
          <div class="payment-methods">
            <label class="payment-option">
              <input type="radio" value="Paypal" v-model="form.payment" @change="handlePaymentMethodChange" />
              <span class="payment-text">{{ $t('paypal') }}</span>
              <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" class="paypal-logo" />
            </label>
            <label class="payment-option">
              <input type="radio" value="Cash" v-model="form.payment" @change="handlePaymentMethodChange" />
              <span class="payment-text">{{ $t('cashOnVisit') }}</span>
            </label>
          </div>
          
          <div v-if="form.payment === 'Paypal' && (technician.basePrice || technician.visitPrice)" class="payment-summary">
            <div class="payment-amount">
              <span>{{ $t('totalAmount') }}:</span>
              <span class="amount">{{ technician.visitPrice || technician.basePrice }} {{ $t('egp') }}</span>
            </div>
            <div class="payment-amount">
              <span>USD Equivalent:</span>
              <span class="amount">${{ ((parseFloat((technician.visitPrice || technician.basePrice).replace(/[^\d.]/g, '')) / 31)).toFixed(2) }} USD</span>
            </div>
            <div class="payment-note">{{ $t('paypalPaymentNote') }}</div>
          </div>
        </div>
        
        <!-- PayPal Button Container -->
        <div v-show="form.payment === 'Paypal'" class="paypal-container">
          <div v-if="!paypalLoaded" class="paypal-loading">
            Loading payment system...
          </div>
          <div id="paypal-button-container"></div>
        </div>
        
        <!-- Confirm Booking Button -->
        <button v-if="form.payment === 'Cash'" class="confirm-btn" type="submit">
          {{ $t('confirmBooking') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { stockTechnicians } from '../assets/stockTechnicians'
import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth } from '../firebase';
import emailjs from 'emailjs-com';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const route = useRoute()
const router = useRouter()
const technician = ref({})
const errorMsg = ref('')
const paypalLoaded = ref(false)

// Date and time management
const currentDateOffset = ref(0)

// Dynamically generate the next three days for the date dropdown
const availableDates = computed(() => {
  const days = [];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  for (let i = 1; i <= 3; i++) {
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + i);
    const month = nextDay.getMonth() + 1;
    const date = nextDay.getDate();
    const year = nextDay.getFullYear();
    const dayOfWeek = dayNames[nextDay.getDay()];
    days.push(`${month}/${date}/${year} ${dayOfWeek}`);
  }
  return days;
});

// Visible dates for the date navigation
const visibleDates = computed(() => {
  const days = [];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  for (let i = 1; i <= 7; i++) {
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + i + currentDateOffset.value);
    const month = nextDay.getMonth() + 1;
    const date = nextDay.getDate();
    const year = nextDay.getFullYear();
    const dayOfWeek = dayNames[nextDay.getDay()];
    days.push(`${month}/${date}/${year} ${dayOfWeek}`);
  }
  return days.slice(0, 3); // Show only 3 days
});

const availableTimes = [
  '01:00 PM - 11:00 PM',
  '12:00 PM - 12:00 PM',
  '03:00 PM - 05:00 PM'
]
const selectedTimeIndex = ref(0)

const form = ref({
  date: '', // will be set on mount
  time: availableTimes[0],
  fullName: '',
  phone: '',
  email: '', // <-- Add email field
  note: '',
  city: 'Cairo',
  area: 'Giza',
  street: '',
  building: '',
  payment: 'Paypal'
})

// Helper functions for date formatting
function formatDay(dateString) {
  const date = new Date(dateString.split(' ')[0])
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[date.getDay()]
}

function formatDate(dateString) {
  const [datePart] = dateString.split(' ')
  const [month, day, year] = datePart.split('/')
  const date = new Date(year, month - 1, day)
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return `${month}/${day}/${year} ${days[date.getDay()]}`
}

function formatDateNumber(dateString) {
  const [datePart] = dateString.split(' ')
  const [month, day] = datePart.split('/')
  return `${month}/${day}`
}

function previousDates() {
  if (currentDateOffset.value > 0) {
    currentDateOffset.value--
  }
}

function nextDates() {
  currentDateOffset.value++
}

onMounted(async () => {
  const id = route.query.techId
  if (!id) {
    errorMsg.value = 'Technician ID is missing. Please try again or contact support.';
    return;
  }
  // Try to find in stockTechnicians first
  const stock = stockTechnicians.find(t => t.id === id)
  if (stock) {
    technician.value = stock
  } else {
    // Try to fetch from Firestore (pendingTechnicians or technicians)
    let docRef = doc(db, 'technicians', id);
    let docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      // Try pendingTechnicians (if not yet approved)
      docRef = doc(db, 'pendingTechnicians', id);
      docSnap = await getDoc(docRef);
    }
    if (docSnap.exists()) {
      const techData = docSnap.data();
      technician.value = {
        ...techData,
        uid: id, // Ensure uid is set for consistency
        name: techData.fullName || techData.name, // Map fullName to name for consistency
        image: techData.idPhotoUrl || techData.profileImage || techData.image || '/images/Avatar.png' // Map image field
      };
      console.log('Technician data loaded:', technician.value);
      console.log('Technician image:', technician.value.image);
    } else {
      errorMsg.value = 'Technician not found. Please try again or contact support.';
    }
  }
  // Set default date to the first available date
  if (availableDates.value.length > 0) {
    form.value.date = availableDates.value[0];
  }
  
  // Load PayPal script
  loadPayPalScript();
})

// Watch for technician data changes to initialize PayPal when data is available
watch(() => technician.value, (newTechnician) => {
  if (newTechnician && (newTechnician.visitPrice || newTechnician.basePrice) && form.value.payment === 'Paypal') {
    console.log('Technician data loaded, initializing PayPal...');
    setTimeout(() => {
      if (paypalLoaded.value) {
        initializePayPalButton();
      }
    }, 100);
  }
}, { deep: true })

// Watch for payment method changes
watch(() => form.value.payment, (newPayment) => {
  if (newPayment === 'Paypal') {
    // Initialize PayPal button after a short delay to ensure script is loaded
    setTimeout(() => {
      if (paypalLoaded.value) {
        initializePayPalButton();
      }
    }, 100);
  }
});

function loadPayPalScript() {
  if (window.paypal) {
    paypalLoaded.value = true;
    if (form.value.payment === 'Paypal') {
      // Add a small delay to ensure DOM is ready
      setTimeout(() => {
        initializePayPalButton();
      }, 100);
    }
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://www.paypal.com/sdk/js?client-id=test&currency=USD&intent=capture';
  script.async = true;
  script.onload = () => {
    paypalLoaded.value = true;
    if (form.value.payment === 'Paypal') {
      // Add a small delay to ensure DOM is ready
      setTimeout(() => {
        initializePayPalButton();
      }, 100);
    }
  };
  script.onerror = () => {
    console.error('Failed to load PayPal script');
    errorMsg.value = 'Failed to load payment system. Please try again.';
  };
  document.head.appendChild(script);
}

function initializePayPalButton() {
  console.log('Initializing PayPal button...');
  console.log('PayPal available:', !!window.paypal);
  console.log('Technician base price:', technician.value.basePrice);
  
  if (!window.paypal) {
    console.log('PayPal not loaded yet, waiting...');
    return;
  }
  
  if (!technician.value.visitPrice && !technician.value.basePrice) {
    console.log('No technician price available');
    return;
  }

  // Wait for next tick to ensure DOM is updated
  setTimeout(() => {
    // Clear existing buttons
    const container = document.getElementById('paypal-button-container');
    console.log('PayPal container found:', !!container);
    
    if (!container) {
      console.error('PayPal container not found');
      errorMsg.value = 'Payment system error. Please refresh the page and try again.';
      return;
    }
    
    // Check if container is visible
    const containerParent = container.closest('.paypal-container');
    if (containerParent && containerParent.style.display === 'none') {
      console.log('PayPal container is hidden, waiting...');
      setTimeout(() => {
        initializePayPalButton();
      }, 100);
      return;
    }
    
    container.innerHTML = '';

    try {
      window.paypal.Buttons({
        createOrder: function(data, actions) {
          // Convert visitPrice or basePrice to number (remove any currency symbols)
          const priceString = technician.value.visitPrice || technician.value.basePrice;
          const amount = parseFloat(priceString.replace(/[^\d.]/g, ''));
          
          // Convert EGP to USD (approximate rate: 1 USD = 31 EGP)
          const usdAmount = (amount / 31).toFixed(2);
          
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: usdAmount,
                currency_code: 'USD'
              },
              payee: {
                email_address: 'elie1400674@gmail.com'
              },
              description: `Booking with ${technician.value.name} - ${form.value.date} at ${form.value.time}`
            }]
          });
        },
        onApprove: function(data, actions) {
          return actions.order.capture().then(function(details) {
            // Payment successful
            console.log('Payment completed:', details);
            
            // Create booking with payment details
            createBookingWithPayment(details);
          });
        },
        onError: function(err) {
          console.error('PayPal error:', err);
          errorMsg.value = t('paypalPaymentFailed');
        }
      }).render('#paypal-button-container');
      
      console.log('PayPal button rendered successfully');
    } catch (error) {
      console.error('Error initializing PayPal button:', error);
      errorMsg.value = 'Payment system error. Please try again.';
    }
  }, 100);
}

function handlePaymentMethodChange() {
  if (form.value.payment === 'Paypal') {
    // Add a longer delay to ensure DOM is fully updated
    setTimeout(() => {
      if (paypalLoaded.value) {
        initializePayPalButton();
      }
    }, 200);
  }
}

async function createBookingWithPayment(paymentDetails) {
  const bookingData = {
    technicianId: technician.value.uid || technician.value.id,
    technicianName: technician.value.name,
    userName: form.value.fullName,
    userEmail: form.value.email,
    userPhone: form.value.phone,
    date: form.value.date,
    time: form.value.time,
    payment: form.value.payment,
    paymentDetails: {
      paypalOrderId: paymentDetails.id,
      paypalPayerId: paymentDetails.payer.payer_id,
      amount: paymentDetails.purchase_units[0].amount.value,
      currency: paymentDetails.purchase_units[0].amount.currency_code,
      status: paymentDetails.status,
      captureId: paymentDetails.purchase_units[0].payments.captures[0]?.id
    },
    status: 'pending',
    createdAt: serverTimestamp()
  };

  try {
    // Save booking to Firestore
    const bookingRef = await addDoc(collection(db, 'bookings'), bookingData);
    
    // Create payment transaction record for admin wallet
    const paymentTransaction = {
      bookingId: bookingRef.id,
      technicianId: technician.value.uid || technician.value.id,
      technicianName: technician.value.name,
      userEmail: form.value.email,
      userName: form.value.fullName,
      amount: parseFloat(paymentDetails.purchase_units[0].amount.value),
      currency: paymentDetails.purchase_units[0].amount.currency_code,
      originalAmountEGP: parseFloat((technician.value.visitPrice || technician.value.basePrice).replace(/[^\d.]/g, '')),
      exchangeRate: 31, // EGP to USD rate used
      paypalOrderId: paymentDetails.id,
      paypalPayerId: paymentDetails.payer.payer_id,
      status: 'pending', // pending, approved, rejected
      adminAction: null, // approved, rejected
      adminActionDate: null,
      adminActionBy: null,
      createdAt: serverTimestamp(),
      paymentDate: serverTimestamp(),
      paymentMethod: 'PayPal',
      creditsEarned: parseFloat((technician.value.visitPrice || technician.value.basePrice).replace(/[^\d.]/g, '')) // Credits in EGP
    };
    
    await addDoc(collection(db, 'paymentTransactions'), paymentTransaction);
    
    // Create credit record for admin wallet
    const creditRecord = {
      bookingId: bookingRef.id,
      transactionId: bookingRef.id, // Corrected to use bookingRef.id
      amount: parseFloat((technician.value.visitPrice || technician.value.basePrice).replace(/[^\d.]/g, '')),
      currency: 'EGP',
      credits: parseFloat((technician.value.visitPrice || technician.value.basePrice).replace(/[^\d.]/g, '')),
      status: 'pending',
      paymentMethod: 'PayPal',
      paypalOrderId: paymentDetails.id,
      technicianName: technician.value.name,
      userEmail: form.value.email,
      userName: form.value.fullName,
      createdAt: serverTimestamp(),
      approvedAt: null,
      approvedBy: null
    };
    
    await addDoc(collection(db, 'adminCredits'), creditRecord);
    
    // Send confirmation email
    if (form.value.email) {
      sendConfirmationEmail(form.value.email, technician.value.name, form.value.date, form.value.time, form.value.payment);
    }
    
    // Redirect to confirmation page
    router.push('/bookingconfirmation');
    
  } catch (error) {
    console.error('Error creating booking:', error);
    errorMsg.value = t('bookingCreationFailed');
  }
}

function sendConfirmationEmail(userEmail, technicianName, date, time, payment) {
  const data = {
    to_email: userEmail,
    technician_name: technicianName,
    date,
    time,
    payment
  };
  console.log('EmailJS data:', data);
  emailjs.send(
    '123321',
    'template_68btlks',
    data,
    'kGW9e5lc8iBvIT3Qw'
  ).then((response) => {
    console.log('Email sent!', response.status, response.text);
  }, (err) => {
    console.error('Failed to send email:', err);
  });
}

async function confirmBooking() {
  // This function is now only for cash payments
  if (form.value.payment !== 'Cash') {
    return;
  }

  const bookingData = {
    technicianId: technician.value.uid || technician.value.id,
    technicianName: technician.value.name,
    userName: form.value.fullName,
    userEmail: form.value.email,
    userPhone: form.value.phone,
    date: form.value.date,
    time: form.value.time,
    payment: form.value.payment,
    status: 'pending',
    createdAt: serverTimestamp()
  };

  try {
    await addDoc(collection(db, 'bookings'), bookingData);
    
    // Send confirmation email
    if (form.value.email) {
      sendConfirmationEmail(form.value.email, technician.value.name, form.value.date, form.value.time, form.value.payment);
    }
    
    router.push('/bookingconfirmation');
  } catch (e) {
    console.error('Booking Firestore error:', e);
    errorMsg.value = t('bookingCreationFailed');
  }
}
</script>

<style scoped>
.booking-page {
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

.booking-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem;
}

.error-message {
  background: #fee;
  color: #c53030;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  text-align: center;
  border: 1px solid #feb2b2;
}

/* Progress Indicator */
.progress-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3rem;

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
  width: 400px;
  height: 2px;
  background: #e5e7eb;
  margin: 0;
  align-self: flex-start;
  margin-top: 24px;
}

/* Technician Section */
.technician-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 3rem;
  padding: 2rem;
  background: #f8fafc;
  border-radius: 12px;
}

.technician-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.technician-photo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #7c6bb1;
}

.technician-details h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  color: #1f2937;
  font-weight: 600;
}

.technician-role {
  margin: 0;
  color: #6b7280;
  font-size: 1rem;
}

.available-appointments {
  flex: 1;
  margin-left: 2rem;
}

.appointment-title {
  margin: 0 0 1rem 0;
  color: #1f2937;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
}

.date-navigation {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-arrow {
  background: #7c6bb1;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.nav-arrow:hover {
  background: #6b5fa7;
}

.date-slots {
  display: flex;
  gap: 1rem;
  flex: 1;
}

.date-slot {
  flex: 1;
  text-align: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.day-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.date-number {
  font-weight: 500;
  color: #7c6bb1;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
}

.time-slot {
  font-size: 0.9rem;
  color: #6b7280;
}

/* Form Sections */
.booking-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  background: #f8fafc;
  padding: 2rem;
  border-radius: 12px;
}

.section-title {
  margin: 0 0 1.5rem 0;
  color: #1f2937;
  font-size: 1.3rem;
  font-weight: 600;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 500;
  color: #374151;
  font-size: 0.95rem;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #7c6bb1;
  box-shadow: 0 0 0 3px rgba(124, 107, 176, 0.1);
}

.form-input.textarea {
  min-height: 100px;
  resize: vertical;
}

/* Payment Methods */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.payment-option:hover {
  border-color: #7c6bb1;
}

.payment-option input[type="radio"] {
  width: 20px;
  height: 20px;
  accent-color: #7c6bb1;
}

.payment-text {
  font-weight: 500;
  color: #374151;
}

.paypal-logo {
  height: 20px;
  margin-left: auto;
}

.payment-summary {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1rem;
}

.payment-amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.payment-amount:last-of-type {
  margin-bottom: 1rem;
}

.amount {
  font-weight: 600;
  color: #7c6bb1;
  font-size: 1.1rem;
}

.payment-note {
  font-size: 0.9rem;
  color: #6b7280;
  font-style: italic;
}

/* PayPal Container */
.paypal-container {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1rem;
}

.paypal-loading {
  text-align: center;
  padding: 1rem;
  color: #6b7280;
  font-style: italic;
}

/* Confirm Button */
.confirm-btn {
  background: #7c6bb1;
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  align-self: flex-end;
  margin-top: 1rem;
}

.confirm-btn:hover {
  background: #6b5fa7;
}

/* Responsive Design */
@media (max-width: 768px) {
  .booking-page {
    padding: 1rem 0 2rem 0;
  }
  
  .page-title {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  .booking-card {
    margin: 0 1rem;
    padding: 1.5rem 1rem;
    border-radius: 12px;
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
    margin: 0;
    align-self: flex-start;
    margin-top: 20px;
  }
  
  .technician-section {
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .technician-info {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .technician-photo {
    width: 100px;
    height: 100px;
  }
  
  .technician-details h3 {
    font-size: 1.3rem;
  }
  
  .available-appointments {
    margin-left: 0;
  }
  
  .appointment-title {
    text-align: center;
    margin-bottom: 1rem;
  }
  
  .date-navigation {
    flex-direction: column;
    gap: 1rem;
  }
  
  .date-slots {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .date-slot {
    padding: 0.75rem;
  }
  
  .nav-arrow {
    align-self: center;
  }
  
  .booking-form {
    gap: 1.5rem;
  }
  
  .form-section {
    padding: 1.5rem;
  }
  
  .section-title {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .form-group.full-width {
    margin-top: 1rem;
  }
  
  .form-input {
    padding: 0.875rem 1rem;
    font-size: 1rem;
  }
  
  .form-input.textarea {
    min-height: 80px;
  }
  
  .payment-methods {
    gap: 0.75rem;
  }
  
  .payment-option {
    padding: 0.875rem;
  }
  
  .payment-summary {
    padding: 1rem;
  }
  
  .payment-amount {
    font-size: 0.9rem;
  }
  
  .amount {
    font-size: 1rem;
  }
  
  .paypal-container {
    padding: 1rem;
  }
  
  .confirm-btn {
    width: 100%;
    padding: 1rem;
    font-size: 1rem;
    margin-top: 1.5rem;
  }
}

@media (max-width: 480px) {
  .booking-page {
    padding: 0.5rem 0 1.5rem 0;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .booking-card {
    margin: 0 0.5rem;
    padding: 1rem 0.75rem;
  }
  
  .technician-section {
    padding: 1rem;
  }
  
  .technician-photo {
    width: 80px;
    height: 80px;
  }
  
  .technician-details h3 {
    font-size: 1.2rem;
  }
  
  .form-section {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 1rem;
  }
  
  .form-input {
    padding: 0.75rem 0.875rem;
    font-size: 0.95rem;
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
    margin: 0;
    align-self: flex-start;
    margin-top: 17px;
  }
  
  .date-slot {
    padding: 0.5rem;
  }
  
  .day-name {
    font-size: 0.9rem;
  }
  
  .date-number {
    font-size: 0.8rem;
  }
  
  .time-slot {
    font-size: 0.8rem;
  }
  
  .nav-arrow {
    width: 35px;
    height: 35px;
  }
  
  .payment-option {
    padding: 0.75rem;
  }
  
  .payment-text {
    font-size: 0.9rem;
  }
  
  .paypal-logo {
    height: 18px;
  }
}

@media (max-width: 360px) {
  .booking-card {
    margin: 0 0.25rem;
    padding: 0.75rem 0.5rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .technician-photo {
    width: 70px;
    height: 70px;
  }
  
  .technician-details h3 {
    font-size: 1.1rem;
  }
  
  .form-section {
    padding: 0.75rem;
  }
  
  .form-input {
    padding: 0.625rem 0.75rem;
    font-size: 0.9rem;
  }
  
  .step-circle {
    width: 30px;
    height: 30px;
    font-size: 0.8rem;
  }
  
  .progress-line {
    width: 25px;
    margin: 0;
    align-self: flex-start;
    margin-top: 15px;
  }
  
  .day-name {
    font-size: 0.85rem;
  }
  
  .date-number {
    font-size: 0.75rem;
  }
  
  .time-slot {
    font-size: 0.75rem;
  }
}
</style> 