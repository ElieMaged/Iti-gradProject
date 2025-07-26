<template>
  <div class="booking-wrapper">
    <h1 class="booking-title">{{ $t('completeYourBooking') }}</h1>
    <div v-if="errorMsg" class="error-message" style="color: red; text-align: center; margin-bottom: 1rem;">{{ errorMsg }}</div>
    <div v-if="!errorMsg" class="booking-card">
      <div class="booking-steps">
        <div class="step active">1 <span>{{ $t('detailsAndPayment') }}</span></div>
        <div class="step">2 <span>{{ $t('confirmation') }}</span></div>
      </div>
      <div class="booking-main">
        <div class="booking-profile">
          <img :src="technician.image" alt="Technician" class="profile-img" />
          <div class="profile-info">
            <div class="profile-name">{{ technician.name }}</div>
            <div class="profile-role">{{ technician.specialization || 'Technician' }}</div>
            <div class="profile-price" v-if="technician.basePrice">
              {{ $t('baseVisitPrice') }}: {{ technician.basePrice }} {{ $t('egp') }}
            </div>
          </div>
        </div>
        <form class="booking-form" @submit.prevent="confirmBooking">
          <div class="form-section">
            <label>{{ $t('date') }}</label>
            <select v-model="form.date">
              <option v-for="date in availableDates" :key="date" :value="date">{{ date }}</option>
            </select>
            <label>{{ $t('time') }}</label>
            <select v-model="form.time">
              <option v-for="time in availableTimes" :key="time" :value="time">{{ time }}</option>
            </select>
          </div>
          <div class="form-section">
            <label>{{ $t('fullName') }}</label>
            <input v-model="form.fullName" :placeholder="$t('enterFullName')" required />
            <label>{{ $t('phoneNumber') }}</label>
            <input v-model="form.phone" :placeholder="$t('enterPhoneNumber')" required />
            <label>{{ $t('yourEmail') }}</label>
            <input v-model="form.email" type="email" :placeholder="$t('yourEmail')" required />
          </div>
          <div class="form-section">
            <label>{{ $t('note') }}</label>
            <input v-model="form.note" :placeholder="$t('enterNote')" />
          </div>
          <div class="form-section">
            <label>{{ $t('city') }}</label>
            <select v-model="form.city">
              <option value="Cairo">{{ $t('cairo') }}</option>
              <option value="Giza">{{ $t('giza') }}</option>
            </select>
            <label>{{ $t('area') }}</label>
            <select v-model="form.area">
              <option value="Giza">{{ $t('giza') }}</option>
              <option value="Maadi">{{ $t('maadi') }}</option>
            </select>
            <label>{{ $t('street') }}</label>
            <input v-model="form.street" :placeholder="$t('elSodanStreet')" />
            <label>{{ $t('detailedBuildingAddress') }}</label>
            <input v-model="form.building" :placeholder="$t('building5')" />
          </div>
          <div class="form-section">
            <label>{{ $t('choosePaymentMethod') }}</label>
            <div class="payment-methods">
              <label><input type="radio" value="Paypal" v-model="form.payment" @change="handlePaymentMethodChange" /> {{ $t('paypal') }} <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" class="paypal-logo" /></label>
              <label><input type="radio" value="Cash" v-model="form.payment" @change="handlePaymentMethodChange" /> {{ $t('cashOnVisit') }}</label>
            </div>
            <div v-if="form.payment === 'Paypal' && technician.basePrice" class="payment-summary">
              <div class="payment-amount">
                <span>{{ $t('totalAmount') }}:</span>
                <span class="amount">{{ technician.basePrice }} {{ $t('egp') }}</span>
              </div>
              <div class="payment-amount">
                <span>USD Equivalent:</span>
                <span class="amount">${{ ((parseFloat(technician.basePrice.replace(/[^\d.]/g, '')) / 31)).toFixed(2) }} USD</span>
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
          
          <button v-if="form.payment === 'Cash'" class="confirm-btn" type="submit">{{ $t('confirmBooking') }}</button>
        </form>
      </div>
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

const availableTimes = [
  '01:00 PM - 11:00 PM',
  '12:00 PM - 12:00 PM',
  '03:00 PM - 05:00 PM'
]

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
        name: techData.fullName || techData.name // Map fullName to name for consistency
      };
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
  if (newTechnician && newTechnician.basePrice && form.value.payment === 'Paypal') {
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
  
  if (!technician.value.basePrice) {
    console.log('No technician base price available');
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
          // Convert basePrice to number (remove any currency symbols)
          const amount = parseFloat(technician.value.basePrice.replace(/[^\d.]/g, ''));
          
          // Convert EGP to USD (approximate rate: 1 USD = 31 EGP)
          const usdAmount = (amount / 31).toFixed(2);
          
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: usdAmount,
                currency_code: 'USD'
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
      originalAmountEGP: parseFloat(technician.value.basePrice.replace(/[^\d.]/g, '')),
      exchangeRate: 31, // EGP to USD rate used
      paypalOrderId: paymentDetails.id,
      paypalPayerId: paymentDetails.payer.payer_id,
      status: 'pending', // pending, approved, rejected
      adminAction: null, // approved, rejected
      adminActionDate: null,
      adminActionBy: null,
      createdAt: serverTimestamp(),
      paymentDate: serverTimestamp()
    };
    
    await addDoc(collection(db, 'paymentTransactions'), paymentTransaction);
    
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
.booking-wrapper {
  background: #f7f7fa;
  min-height: 100vh;
  padding: 2rem 0 4rem 0;
}
.dark .booking-wrapper {
  background: var(--primary-bg) !important;
}
.booking-title {
  text-align: center;
  color: #7c6bb1;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
}
.dark .booking-title {
  color: var(--primary-text) !important;
}

.booking-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  max-width: 800px;
  margin: 0 auto;
  padding: 2.5rem 2rem;
}
.dark .booking-card {
  background: var(--secondary-bg) !important;
  color: var(--primary-text) !important;
}
.booking-steps {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  color: #a49ad6;
  font-weight: 600;
}
.dark .booking-steps {
  color: var(--primary-text) !important;
}
.step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.step.active {
  color: #7c6bb1;
  font-weight: bold;
}
.dark .step.active {
  color: var(--primary-text) !important;
}
.booking-main {
  display: flex;
  gap: 2rem;
}
.booking-profile {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
}
.dark .booking-profile {
  background: var(--secondary-bg) !important;
}
.profile-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #eee;
}
.profile-info {
  text-align: center;
}
.profile-name {
  font-size: 1.1rem;
  font-weight: bold;
}
.profile-role {
  font-size: 1rem;
  color: #625397;
  font-weight: 600;
}
.dark .profile-role {
  color: var(--primary-text) !important;
}
.profile-price {
  font-size: 0.9rem;
  color: #7c6bb1;
  font-weight: 600;
  margin-top: 0.5rem;
}
.dark .profile-price {
  color: var(--primary-color) !important;
}
.booking-form {
  flex: 3;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: flex-start;
}
.dark .booking-form {
  background: var(--secondary-bg) !important;
  color: var(--primary-text) !important;
}
.form-section {
  flex: 1 1 220px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
input, select {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}
.dark input, select {
  border: 1px solid var(--primary-bg) !important;
  color: var(--primary-text) !important;
}
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.paypal-logo {
  height: 22px;
  margin-left: 0.5rem;
  vertical-align: middle;
}
.payment-summary {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
}
.dark .payment-summary {
  background: var(--primary-bg) !important;
  border-color: var(--border-color) !important;
}
.payment-amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.amount {
  color: #7c6bb1;
  font-size: 1.2rem;
}
.dark .amount {
  color: var(--primary-color) !important;
}
.payment-note {
  font-size: 0.9rem;
  color: #6c757d;
  font-style: italic;
}
.dark .payment-note {
  color: var(--secondary-text) !important;
}
.paypal-container {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #fff;
}
.dark .paypal-container {
  background: var(--secondary-bg) !important;
  border-color: var(--border-color) !important;
}

.paypal-loading {
  text-align: center;
  padding: 1rem;
  color: #666;
  font-style: italic;
}
.dark .paypal-loading {
  color: var(--secondary-text) !important;
}
.confirm-btn {
  background: #7c6bb1;
  color: #fff;
  border: none;
  padding: 0.9rem 2.5rem;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1.5rem;
  align-self: flex-end;
  transition: background 0.2s;
}
.dark .confirm-btn {
  background: var(--primary-color) !important;
  color: var(--primary-text) !important;
}
.confirm-btn:hover {
  background: #4a3f7a;
}
.dark .confirm-btn:hover {
  background: var(--primary-color) !important;
}
</style> 