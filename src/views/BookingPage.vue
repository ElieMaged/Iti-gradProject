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
            :src="technician.profilePhotoUrl  || '/images/Avatar.png'" 
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
                <div class="time-slot">
                  <span v-if="dateAvailability[date]" class="text-green-600">
                    {{ dateAvailability[date] }}
                  </span>
                  <span v-else class="text-gray-400 text-sm">
                    Unavailable
                  </span>
                </div>
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
              <select v-model="form.date" class="form-input" :disabled="availableDates.length === 0">
                <option v-if="availableDates.length === 0" value="">No available dates</option>
                <option v-for="date in availableDates" :key="date" :value="date">{{ formatDate(date) }}</option>
              </select>
              <div v-if="availableDates.length === 0" class="text-sm text-red-500 mt-1">
                This technician has not set their availability yet. Please contact them directly or try again later.
              </div>
            </div>
            <div class="form-group">
              <label>{{ $t('time') }}</label>
              <select v-model="form.time" class="form-input" :disabled="availableTimes.length === 0">
                <option v-if="availableTimes.length === 0" value="">No available times for this date</option>
                <option v-for="time in availableTimes" :key="time" :value="time">{{ time }}</option>
              </select>
              <div v-if="availableTimes.length === 0" class="text-sm text-red-500 mt-1">
                All time slots for this date are already booked. Please choose a different date or time.
              </div>
              <div v-else-if="availableTimes.length > 0" class="text-sm text-green-600 mt-1">
                {{ availableTimes.length }} time slot(s) available for this date
              </div>
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
          <div class="form-row">
            <div class="form-group">
              <label>{{ $t('emailAddress') }}</label>
              <input v-model="form.email" type="email" :placeholder="$t('enterEmailAddress')" class="form-input" required />
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
              <select v-model="form.city" class="form-input" @change="updateCities">
                <option value="">{{ $t('selectCity') || 'Select City' }}</option>
                <option v-for="governorate in availableGovernorates" :key="governorate" :value="governorate">
                  {{ governorate }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>{{ $t('area') }}</label>
              <select v-model="form.area" class="form-input">
                <option value="">{{ $t('selectArea') || 'Select Area' }}</option>
                <option v-for="city in availableCities" :key="city" :value="city">{{ city }}</option>
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
          
          <!-- Location Map Component -->
          <LocationMap 
            :city="form.city"
            :area="form.area"
            :street="form.street"
            :building="form.building"
            @locationDetected="handleLocationDetected"
            @updateCity="form.city = $event"
            @updateArea="form.area = $event"
            @updateStreet="form.street = $event"
            @updateBuilding="form.building = $event"
          />
        </div>

        <!-- Payment Method Section -->
        <div class="form-section">
          <h3 class="section-title">{{ $t('choosePaymentMethod') }}</h3>
          <div class="payment-methods">
            <label class="payment-option">
              <input type="radio" value="PayPal" v-model="form.payment" @change="handlePaymentMethodChange" />
              <span class="payment-text">{{ $t('paypal') }}</span>
              <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" class="paypal-logo" />
            </label>
            <label class="payment-option">
              <input type="radio" value="Cash on Visit" v-model="form.payment" @change="handlePaymentMethodChange" />
              <span class="payment-text">{{ $t('cashOnVisit') }}</span>
            </label>
          </div>
          
          <div v-if="form.payment === 'PayPal' && (technician.basePrice || technician.visitPrice)" class="payment-summary">
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
        <div v-show="form.payment === 'PayPal'" class="paypal-container">
          <div v-if="!paypalLoaded && !errorMsg" class="paypal-loading">
            <div class="loading-spinner"></div>
            <p>Loading payment system...</p>
            <p class="loading-note">This may take a few seconds</p>
          </div>
          <div v-if="errorMsg && form.payment === 'PayPal'" class="paypal-error">
            <div class="error-icon">⚠️</div>
            <p>{{ errorMsg }}</p>
            <button @click="retryPayPalLoading" class="retry-btn">Retry Payment System</button>
          </div>
          <div id="paypal-button-container"></div>
          

        </div>
        
        <!-- Confirm Booking Button -->
        <button v-if="form.payment === 'Cash on Visit'" class="confirm-btn" type="submit">
          {{ $t('confirmBooking') }}
        </button>


        

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { collection, doc, getDoc, addDoc, serverTimestamp, query, getDocs, where, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase'
import { useI18n } from 'vue-i18n'
import { stockTechnicians } from '../assets/stockTechnicians'

import { auth } from '../firebase';
import { paypalHelper } from '../utils/paypalHelper';
import { paypalTester } from '../utils/paypalTest';
import LocationMap from '../components/LocationMap.vue'
import { getGovernmentNames, getDistrictsForGovernment } from '../data/egyptianLocations.js'

const { t } = useI18n();
const route = useRoute()
const router = useRouter()
const technician = ref({})
const errorMsg = ref('')
const paypalLoaded = ref(false)
const technicianAvailability = ref(null)
const dateAvailability = ref({})

// Form data - moved before watch functions
const form = ref({
  date: '', // will be set on mount
  time: '',
  fullName: '',
  phone: '',
  email: '', // <-- Add email field
  note: '',
  city: 'Cairo',
  area: 'Giza',
  street: '',
  building: '',
  payment: 'PayPal'
})

// Location data management
const availableGovernorates = ref(getGovernmentNames())
const availableCities = ref([])

// Function to update available districts based on selected government
function updateCities() {
  if (form.value.city) {
    availableCities.value = getDistrictsForGovernment(form.value.city);
  } else {
    availableCities.value = [];
  }
}

// Watch for governorate changes to update cities
watch(() => form.value.city, () => {
  updateCities();
  // Reset area when governorate changes
  form.value.area = '';
});
const isProcessingPayment = ref(false)

// Date and time management
const currentDateOffset = ref(0)

// Dynamically generate available dates based on technician availability
const availableDates = computed(() => {
  const days = [];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  
  // Check next 14 days (2 weeks) for availability
  for (let i = 1; i <= 14; i++) {
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + i);
    
    const month = nextDay.getMonth() + 1;
    const date = nextDay.getDate();
    const year = nextDay.getFullYear();
    const dayOfWeek = dayNames[nextDay.getDay()];
    const dayName = dayNames[nextDay.getDay()].toLowerCase();
    
    // Check if technician is available on this day
    if (technicianAvailability.value && 
        technicianAvailability.value[dayName] && 
        technicianAvailability.value[dayName].available) {
    days.push(`${month}/${date}/${year} ${dayOfWeek}`);
  }
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

// Dynamic available times based on technician availability
const availableTimes = ref([])
const selectedTimeIndex = ref(0)

// Function to pre-populate form with user data
function populateFormWithUserData() {
  console.log('=== POPULATING FORM WITH USER DATA ===');
  console.log('Current user:', auth.currentUser);
  
  if (auth.currentUser) {
    console.log('User is logged in, pre-populating form...');
    console.log('User email:', auth.currentUser.email);
    console.log('User display name:', auth.currentUser.displayName);
    
    // Pre-populate email if user is logged in
    if (auth.currentUser.email) {
      form.value.email = auth.currentUser.email;
      console.log('Email field populated with:', form.value.email);
    }
    
    // Pre-populate name if available
    if (auth.currentUser.displayName) {
      form.value.fullName = auth.currentUser.displayName;
      console.log('Name field populated with:', form.value.fullName);
    }
  } else {
    console.log('No user logged in, form will be empty');
  }
  
  console.log('Final form data:', form.value);
  console.log('=== END FORM POPULATION ===');
}

// Function to get day name from date string
function getDayName(dateString) {
  const [datePart] = dateString.split(' ')
  const [month, day, year] = datePart.split('/')
  const date = new Date(year, month - 1, day)
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[date.getDay()]
}

// Function to generate time slots based on availability
function generateTimeSlots(startTime, endTime) {
  const slots = []
  const start = new Date(`2000-01-01 ${startTime}`)
  const end = new Date(`2000-01-01 ${endTime}`)
  
  // Generate 1-hour slots
  let current = new Date(start)
  while (current < end) {
    const slotStart = current.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
    
    current.setHours(current.getHours() + 1)
    const slotEnd = current.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
    
    slots.push(`${slotStart} - ${slotEnd}`)
  }
  
  return slots
}

// Function to fetch technician availability
async function fetchTechnicianAvailability(technicianId) {
  try {
    const availabilityRef = doc(db, 'technicianAvailability', technicianId)
    const availabilitySnap = await getDoc(availabilityRef)
    
    if (availabilitySnap.exists()) {
      const data = availabilitySnap.data()
      technicianAvailability.value = data
      return data
    }
    technicianAvailability.value = null
    return null
  } catch (error) {
    console.error('Error fetching technician availability:', error)
    technicianAvailability.value = null
    return null
  }
}

// Function to get available time for a specific date
async function getAvailableTimeForDate(dateString) {
  if (!technicianAvailability.value) return null
  
  const dayName = getDayName(dateString)
  const dayAvailability = technicianAvailability.value[dayName]
  
  if (dayAvailability && dayAvailability.available) {
    // Check if there are any available slots after filtering out booked ones
    const allTimeSlots = generateTimeSlots(dayAvailability.startTime, dayAvailability.endTime)
    const existingBookings = await fetchExistingBookings(technician.value.uid, dateString)
    
    const availableSlots = allTimeSlots.filter(timeSlot => {
      return !existingBookings.some(booking => booking.time === timeSlot)
    })
    
    if (availableSlots.length > 0) {
      return `${availableSlots.length} slot(s) available`
    } else {
      return 'Fully booked'
    }
  }
  
  return null
}

// Function to update date availability for visible dates
async function updateDateAvailability() {
  if (!technician.value.uid || !technicianAvailability.value) return
  
  const newDateAvailability = {}
  
  for (const date of visibleDates.value) {
    const availability = await getAvailableTimeForDate(date)
    newDateAvailability[date] = availability
  }
  
  dateAvailability.value = newDateAvailability
}

// Function to fetch existing bookings for a technician on a specific date
async function fetchExistingBookings(technicianId, selectedDate) {
  try {
    // Convert date format from MM/DD/YYYY to YYYY-MM-DD for Firestore query
    const [month, day, year] = selectedDate.split(' ')[0].split('/')
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    
    console.log('Fetching existing bookings for:', technicianId, 'on date:', formattedDate)
    
    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('technicianId', '==', technicianId),
      where('date', '==', formattedDate),
      where('status', 'in', ['pending', 'upcoming', 'completed']) // Only check active bookings
    )
    
    const snapshot = await getDocs(bookingsQuery)
    const existingBookings = []
    
    snapshot.forEach(doc => {
      const booking = doc.data()
      existingBookings.push({
        id: doc.id,
        time: booking.time,
        status: booking.status
      })
    })
    
    console.log('Found existing bookings:', existingBookings)
    return existingBookings
  } catch (error) {
    console.error('Error fetching existing bookings:', error)
    return []
  }
}

// Function to update available times based on selected date
async function updateAvailableTimes(selectedDate) {
  if (!technician.value.uid || !selectedDate) {
    availableTimes.value = []
    return
  }
  
  const dayName = getDayName(selectedDate)
  const availability = await fetchTechnicianAvailability(technician.value.uid)
  
  if (availability && availability[dayName] && availability[dayName].available) {
    const { startTime, endTime } = availability[dayName]
    const allTimeSlots = generateTimeSlots(startTime, endTime)
    
    // Fetch existing bookings for this technician on this date
    const existingBookings = await fetchExistingBookings(technician.value.uid, selectedDate)
    
    // Filter out already booked time slots
    const availableTimeSlots = allTimeSlots.filter(timeSlot => {
      const isBooked = existingBookings.some(booking => booking.time === timeSlot)
      if (isBooked) {
        console.log(`Time slot ${timeSlot} is already booked`)
      }
      return !isBooked
    })
    
    availableTimes.value = availableTimeSlots
    
    // Set default time if available
    if (availableTimes.value.length > 0) {
      form.value.time = availableTimes.value[0]
      selectedTimeIndex.value = 0
    } else {
      form.value.time = ''
      console.log('No available time slots for this date')
    }
  } else {
    availableTimes.value = []
    form.value.time = ''
  }
}

// Watch for date changes to update available times
watch(() => form.value.date, async (newDate) => {
  if (newDate) {
    await updateAvailableTimes(newDate)
  }
})

// Watch for technician data changes to fetch availability
watch(() => technician.value.uid, async (newUid) => {
  if (newUid) {
    await fetchTechnicianAvailability(newUid)
    if (form.value.date) {
      await updateAvailableTimes(form.value.date)
    }
  }
})

// Watch for available times changes to reinitialize PayPal
watch(() => availableTimes.value, () => {
  if (form.value.payment === 'PayPal' && paypalLoaded.value) {
    setTimeout(() => {
      initializePayPalButton();
    }, 100);
  }
})

// Watch for technician availability changes to update available dates
watch(() => technicianAvailability.value, async () => {
  // When availability changes, update the selected date if current date is no longer available
  if (form.value.date && availableDates.value.length > 0) {
    const isCurrentDateAvailable = availableDates.value.includes(form.value.date);
    if (!isCurrentDateAvailable) {
      form.value.date = availableDates.value[0];
      updateAvailableTimes(form.value.date);
    }
  }
  
  // Update date availability for visible dates
  await updateDateAvailability()
})

// Watch for visible dates changes to update availability display
watch(() => visibleDates.value, async () => {
  await updateDateAvailability()
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
  const id = route.query.techId || route.query.technicianId
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
                profilePhotoUrl: techData.profileImage || techData.image || techData.idPhotoUrl || '/images/Avatar.png' // Map to profilePhotoUrl for template consistency
              };
              console.log('Technician data loaded:', technician.value);
        console.log('Technician profile photo:', technician.value.profilePhotoUrl);
    } else {
      errorMsg.value = 'Technician not found. Please try again or contact support.';
      return;
    }
  }
  
  // Fetch technician availability first
  if (technician.value.uid) {
    await fetchTechnicianAvailability(technician.value.uid);
    await updateDateAvailability();
  }
  
  // Set default date to the first available date
  if (availableDates.value.length > 0) {
    form.value.date = availableDates.value[0];
    // Initialize availability times for the default date
    await updateAvailableTimes(form.value.date);
  } else {
    // No available dates found
    errorMsg.value = 'This technician has not set their availability yet. Please contact them directly or try again later.';
  }
  
  // Load PayPal script with delay to ensure page is ready
  setTimeout(() => {
    loadPayPalScript();
  }, 500);
  
  populateFormWithUserData(); // Call the new function here
  
  // Initialize available cities for default governorate
  updateCities();
})

// Cleanup function to prevent memory leaks
onUnmounted(() => {
  // Clear any timeouts
  if (window.paypalLoadingTimeout) {
    clearTimeout(window.paypalLoadingTimeout);
  }
  
  // Reset PayPal state
  paypalLoaded.value = false;
  errorMsg.value = '';
})

// Watch for technician data changes to initialize PayPal when data is available
watch(() => technician.value, (newTechnician) => {
  if (newTechnician && (newTechnician.visitPrice || newTechnician.basePrice) && form.value.payment === 'PayPal') {
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
  if (newPayment === 'PayPal') {
    // Initialize PayPal button after a short delay to ensure script is loaded
    setTimeout(() => {
      if (paypalLoaded.value) {
        initializePayPalButton();
      }
    }, 100);
  }
});

function loadPayPalScript() {
  console.log('🔄 Starting PayPal script loading...');
  
  // Check if PayPal is already loaded
  if (window.paypal) {
    console.log('✅ PayPal already loaded');
    paypalLoaded.value = true;
    if (form.value.payment === 'PayPal') {
      setTimeout(() => {
        initializePayPalButton();
      }, 100);
    }
    return;
  }

  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  
  // Validate client ID
  if (!clientId || clientId === 'YOUR_PAYPAL_CLIENT_ID' || clientId.trim() === '') {
    console.error('❌ PayPal Client ID not configured');
    errorMsg.value = 'Payment system not configured. Please contact support.';
    paypalLoaded.value = false; // Ensure loading state is cleared
    return;
  }

  console.log('🔧 PayPal Client ID found, loading script...');

  // Remove any existing PayPal scripts to prevent conflicts
  const existingScripts = document.querySelectorAll('script[src*="paypal.com"]');
  existingScripts.forEach(script => {
    console.log('🗑️ Removing existing PayPal script:', script.src);
    script.remove();
  });

  // Create new script element with better error handling
  const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture&components=buttons,funding-eligibility`;
  script.async = true;
  script.defer = true;
  
  // Add loading timeout with better error handling
  window.paypalLoadingTimeout = setTimeout(() => {
    if (!paypalLoaded.value) {
      console.error('⏰ PayPal script loading timeout after 10 seconds');
      errorMsg.value = 'Payment system failed to load. Please refresh the page and try again.';
      paypalLoaded.value = false; // Ensure loading state is cleared
      
      // Show error in the container
      const container = document.getElementById('paypal-button-container');
      if (container) {
        container.innerHTML = '<div class="text-red-500 text-center p-4">Payment system failed to load. Please refresh the page and try again.</div>';
      }
    }
  }, 10000); // 10 second timeout

  script.onload = () => {
    if (window.paypalLoadingTimeout) {
      clearTimeout(window.paypalLoadingTimeout);
    }
    console.log('📦 PayPal script loaded successfully');
    
    // Add a small delay to ensure PayPal object is available
    setTimeout(() => {
      // Verify PayPal object is available
      if (window.paypal) {
        console.log('✅ PayPal object available');
        paypalLoaded.value = true;
        if (form.value.payment === 'PayPal') {
          setTimeout(() => {
            initializePayPalButton();
          }, 200);
        }
      } else {
        console.error('❌ PayPal object not available after script load');
        errorMsg.value = 'Payment system error. Please try again.';
        paypalLoaded.value = false; // Ensure loading state is cleared
        
        // Show error in the container
        const container = document.getElementById('paypal-button-container');
        if (container) {
          container.innerHTML = '<div class="text-red-500 text-center p-4">Payment system error. Please try again.</div>';
        }
      }
    }, 500); // Wait 500ms for PayPal object to be available
  };

  script.onerror = (error) => {
    if (window.paypalLoadingTimeout) {
      clearTimeout(window.paypalLoadingTimeout);
    }
    console.error('❌ Failed to load PayPal script:', error);
    errorMsg.value = 'Failed to load payment system. Please check your internet connection and try again.';
    paypalLoaded.value = false; // Ensure loading state is cleared
    
    // Show error in the container
    const container = document.getElementById('paypal-button-container');
    if (container) {
      container.innerHTML = '<div class="text-red-500 text-center p-4">Failed to load payment system. Please check your internet connection and try again.</div>';
    }
  };

  // Add script to document
  console.log('📎 Adding PayPal script to document');
  document.head.appendChild(script);
}

function initializePayPalButton() {
  // Prevent initialization if payment is in progress
  if (isProcessingPayment.value) {
    console.log('Payment in progress, skipping PayPal button initialization');
    return;
  }
  
  console.log('Initializing PayPal button...');
  
  // Multiple validation checks
  if (!window.paypal) {
    console.error('PayPal SDK not available');
    errorMsg.value = 'Payment system not available. Please refresh the page.';
    return;
  }

  if (!technician.value.visitPrice && !technician.value.basePrice) {
    console.error('No technician price available');
    errorMsg.value = 'Technician pricing not available. Please try again later.';
    return;
  }

  // Check if times are available
  if (availableTimes.value.length === 0) {
    console.log('No available times for booking');
    const container = document.getElementById('paypal-button-container');
    if (container) {
      container.innerHTML = '<div class="text-red-500 text-center p-4">No available time slots for the selected date. Please choose a different date.</div>';
    }
    return;
  }

  // Wait for DOM to be ready
  setTimeout(() => {
    const container = document.getElementById('paypal-button-container');
    
    if (!container) {
      console.error('PayPal container not found');
      errorMsg.value = 'Payment system error. Please refresh the page and try again.';
      return;
    }

    // Check if container is visible
    const containerParent = container.closest('.paypal-container');
    if (containerParent && containerParent.style.display === 'none') {
      console.log('PayPal container is hidden, retrying...');
      setTimeout(() => {
        initializePayPalButton();
      }, 200);
      return;
    }

    // Clear existing content and destroy any existing PayPal buttons
    container.innerHTML = '';
    
    // Destroy any existing PayPal buttons to prevent conflicts
    if (window.paypal && window.paypal.Buttons) {
      try {
        // Remove any existing PayPal elements
        const existingButtons = container.querySelectorAll('[data-paypal-button]');
        existingButtons.forEach(button => button.remove());
      } catch (error) {
        console.log('Error cleaning up existing PayPal buttons:', error);
      }
    }

    try {
      console.log('🔧 Creating PayPal button...');
      console.log('Window PayPal object:', window.paypal);
      console.log('PayPal FUNDING object:', window.paypal?.FUNDING);
      console.log('PayPal FUNDING.PAYPAL:', window.paypal?.FUNDING?.PAYPAL);
      console.log('PayPal FUNDING.CARD:', window.paypal?.FUNDING?.CARD);
      
      // Test button eligibility with different configurations
      console.log('🔍 Testing PayPal eligibility with different configurations...');
      
      const testConfigurations = [
        { name: 'Default (All Methods)', funding: undefined },
        { name: 'PayPal Only', funding: window.paypal.FUNDING.PAYPAL },
        { name: 'Card Only', funding: window.paypal.FUNDING.CARD },
        { name: 'PayPal + Card', funding: [window.paypal.FUNDING.PAYPAL, window.paypal.FUNDING.CARD] }
      ];
      
      let eligibleConfigurations = [];
      
      testConfigurations.forEach(config => {
        try {
          const buttonConfig = {
            createOrder: () => Promise.resolve('test'),
            onApprove: () => Promise.resolve()
          };
          
          // Only add fundingSource if it's defined
          if (config.funding !== undefined) {
            buttonConfig.fundingSource = config.funding;
          }
          
          const testButton = window.paypal.Buttons(buttonConfig);
          
          if (testButton.isEligible && typeof testButton.isEligible === 'function') {
            try {
              const isEligible = testButton.isEligible();
              console.log(`🔍 ${config.name} eligibility:`, isEligible);
              
              if (isEligible) {
                eligibleConfigurations.push(config);
                console.log(`✅ ${config.name} is eligible`);
              } else {
                console.log(`❌ ${config.name} is not eligible`);
              }
            } catch (eligibilityError) {
              console.error(`❌ Error testing ${config.name} eligibility:`, eligibilityError);
            }
          }
        } catch (error) {
          console.error(`❌ Error creating ${config.name} test button:`, error);
        }
      });
      
      console.log('📊 Eligible configurations:', eligibleConfigurations);
      
      if (eligibleConfigurations.length === 0) {
        console.error('❌ No PayPal configurations are eligible');
        console.log('🔍 This could be due to:');
        console.log('- Geographic restrictions');
        console.log('- Account limitations');
        console.log('- Amount restrictions');
        console.log('- PayPal account status issues');
        
        // Show user-friendly message with alternatives
        const container = document.getElementById('paypal-button-container');
        if (container) {
          container.innerHTML = `
            <div class="text-center p-4">
              <div class="text-red-500 mb-2">PayPal is not available for this transaction.</div>
              <div class="text-sm text-gray-600 mb-3">
                This could be due to geographic restrictions, account limitations, or amount restrictions.
              </div>
              <div class="text-sm text-gray-600">
                Please try:
                <ul class="list-disc list-inside mt-1">
                  <li>Using a different payment method</li>
                  <li>Contacting support for assistance</li>
                  <li>Checking your PayPal account status</li>
                </ul>
              </div>
            </div>
          `;
        }
      } else {
        console.log('✅ Found eligible configurations:', eligibleConfigurations.map(c => c.name));
      }
      
      // Create PayPal button with enhanced error handling
      // Let PayPal show all available payment methods by default
      const paypalButton = window.paypal.Buttons({
        // Use Smart Payment Buttons with enhanced configuration
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'pay'
        },
        
        // Allow all payment methods including PayPal, credit cards, and debit cards
        
        // Add render method for additional debugging
        render: function(container) {
          console.log('🎨 PayPal button render method called');
          console.log('Container element:', container);
          return true;
        },
        
        createOrder: function(data, actions) {
          try {
            console.log('🔄 Starting PayPal order creation...');
            
            // Validate form data
            if (!form.value.date || !form.value.time) {
              throw new Error('Please select a date and time before proceeding with payment.');
            }

            // Convert price to number with better parsing
            const priceString = technician.value.visitPrice || technician.value.basePrice;
            console.log('Original price string:', priceString);
            const amount = parseFloat(priceString.replace(/[^\d.]/g, ''));
            console.log('Parsed amount (EGP):', amount);
            
            if (isNaN(amount) || amount <= 0) {
              throw new Error('Invalid technician pricing. Please contact support.');
            }

            // Convert EGP to USD (approximate rate: 1 USD = 31 EGP)
            const usdAmount = (amount / 31).toFixed(2);
            console.log('Converted USD amount:', usdAmount);
            
            // Add geographic and amount validation
            const amountNum = parseFloat(usdAmount);
            if (amountNum < 0.01) {
              console.warn('⚠️ Amount is too low for PayPal (minimum $0.01)');
              throw new Error('Payment amount is too low. Please contact support.');
            } else if (amountNum > 10000) {
              console.warn('⚠️ Amount is very high for PayPal (maximum $10,000)');
              throw new Error('Payment amount is too high. Please contact support.');
            }
            
            // Log geographic information for debugging
            console.log('🌍 Geographic Info:', {
              userAgent: navigator.userAgent,
              language: navigator.language,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              amount: usdAmount
            });
            
            // Check if amount meets PayPal requirements
            if (amountNum < 0.01) {
              console.warn('⚠️ Amount is too low for PayPal (minimum $0.01)');
            } else if (amountNum > 10000) {
              console.warn('⚠️ Amount is very high for PayPal (maximum $10,000)');
            } else {
              console.log('✅ Amount is within PayPal limits');
            }
            
            console.log('Creating PayPal order:', {
              amount: usdAmount,
              technician: technician.value.name,
              date: form.value.date,
              time: form.value.time
            });

            const orderData = {
              purchase_units: [{
                amount: {
                  value: usdAmount,
                  currency_code: 'USD'
                },
                payee: {
                  email_address: 'narutossj23@yahoo.com'
                },
                description: `Booking with ${technician.value.name} - ${form.value.date} at ${form.value.time}`,
                custom_id: `booking_${Date.now()}`,
                invoice_id: `INV_${Date.now()}`
              }],
              application_context: {
                shipping_preference: 'NO_SHIPPING',
                user_action: 'PAY_NOW',
                return_url: window.location.origin + '/bookingconfirmation',
                cancel_url: window.location.origin + '/bookingpage',
                // Add these to improve payment flow reliability
                brand_name: 'BoltFix',
                landing_page: 'LOGIN',
                user_action: 'CONTINUE'
              }
            };
            
            console.log('PayPal order data:', orderData);
            console.log('Actions object:', actions);
            console.log('Actions.order object:', actions.order);
            
            const orderPromise = actions.order.create(orderData);
            console.log('Order creation promise:', orderPromise);
            
            return orderPromise.then(orderId => {
              console.log('✅ PayPal order created successfully:', orderId);
              return orderId;
            }).catch(error => {
              console.error('❌ PayPal order creation failed:', error);
              throw error;
            });
          } catch (error) {
            console.error('Error creating PayPal order:', error);
            errorMsg.value = error.message || 'Error creating payment. Please try again.';
            throw error;
          }
        },

        onApprove: async (data, actions) => {
          // Prevent multiple payment attempts
          if (isProcessingPayment.value) {
            console.log('Payment already in progress, ignoring duplicate request');
            return;
          }
          
          isProcessingPayment.value = true;
          
          // Add a small delay to ensure PayPal window is fully loaded
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Show payment instructions to user
          const container = document.getElementById('paypal-button-container');
          if (container) {
            container.innerHTML = `
              <div class="text-center p-4">
                <div class="text-blue-600 mb-2">Processing Payment...</div>
                <div class="text-sm text-gray-600">
                  Please complete your payment in the PayPal window.<br>
                  <strong>Important:</strong> Do not close the PayPal window until payment is finished.<br>
                  The window will close automatically when payment is complete.
                </div>
                <div class="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <i class="fas fa-exclamation-triangle text-yellow-600"></i>
                  <span class="text-sm text-yellow-800">
                    Keep the PayPal window open until you see a confirmation message.
                  </span>
                </div>
              </div>
            `;
          }
          
          try {
            console.log('PayPal payment approved, capturing order...');
            const captureStartTime = Date.now();
            
            // Show loading state with timeout protection
            const container = document.getElementById('paypal-button-container');
            if (container) {
              container.innerHTML = '<div class="text-center p-4"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div><p class="mt-2">Processing payment...</p></div>';
            }

            // Single timeout mechanism to prevent infinite loading
            let captureCompleted = false;
            const captureTimeout = setTimeout(() => {
              if (!captureCompleted) {
                console.error('Payment capture timeout - clearing loading state');
                captureCompleted = true;
                if (container) {
                  container.innerHTML = '<div class="text-center p-4 text-red-500">Payment processing timed out. Please try again.</div>';
                }
                errorMsg.value = 'Payment processing timed out. Please try again.';
              }
            }, 8000); // 8 second timeout

            // Wrap the capture call with better error handling and retry mechanism
            let order;
            let retryCount = 0;
            const maxRetries = 3;
            
                        try {
              while (retryCount < maxRetries) {
                try {
                  console.log(`Starting PayPal capture (attempt ${retryCount + 1}/${maxRetries})...`);
                  order = await Promise.race([
                    actions.order.capture(),
                    new Promise((_, reject) => 
                      setTimeout(() => reject(new Error('PayPal capture timeout')), 10000)
                    )
                  ]);
                  break; // Success, exit retry loop
                } catch (captureError) {
                  retryCount++;
                  console.log(`Capture attempt ${retryCount} failed:`, captureError.message);
                  
                  if (retryCount >= maxRetries) {
                    throw captureError; // Re-throw if all retries failed
                  }
                  
                  // Wait before retry
                  await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
                }
              }
                
              if (!captureCompleted) {
                captureCompleted = true;
                clearTimeout(captureTimeout);
                const captureEndTime = Date.now();
                console.log(`Payment captured successfully in ${captureEndTime - captureStartTime}ms:`, order);
              }
            } catch (captureError) {
              if (!captureCompleted) {
                captureCompleted = true;
                clearTimeout(captureTimeout);
                console.error('PayPal capture failed:', captureError);
                
                // Handle specific PayPal errors
                if (captureError.message.includes('Target window is closed') || 
                    captureError.message.includes('postrobot_method')) {
                  throw new Error('Payment window was closed too early. Please try again and keep the PayPal window open until you see a confirmation message.');
                } else if (captureError.message.includes('network')) {
                  throw new Error('Network error during payment. Please check your connection and try again.');
                } else if (captureError.message.includes('timeout')) {
                  throw new Error('Payment timed out. Please try again.');
                } else {
                  throw new Error(`Payment capture failed: ${captureError.message}`);
                }
              }
            }
            
            // Reset payment processing flag
            isProcessingPayment.value = false;
            
            // Validate payment response
            if (!order || !order.id || order.status !== 'COMPLETED') {
              throw new Error('Payment was not completed successfully.');
            }

            // Extract payment details
            const paymentAmount = parseFloat(order.purchase_units[0].amount.value);
            const paypalOrderId = order.id;
            
            // Validate payment amount
            if (isNaN(paymentAmount) || paymentAmount <= 0) {
              throw new Error('Invalid payment amount received.');
            }

            console.log('Payment details:', {
              amount: paymentAmount,
              orderId: paypalOrderId,
              status: order.status
            });

            // Split the payment between accounts (non-blocking)
            splitPaymentToAccounts(paypalOrderId, paymentAmount, technician.value.uid)
              .then(splitSuccess => {
                if (splitSuccess) {
                  console.log('Payment split successfully between accounts');
                } else {
                  console.warn('Payment split failed, but payment was successful');
                }
              })
              .catch(error => {
                console.error('Error in payment split:', error);
              });
            
            // Create booking data with enhanced validation
            const bookingData = {
              technicianId: technician.value.uid || technician.value.id,
              technicianName: technician.value.name,
              userId: auth.currentUser?.uid,
              userName: form.value.fullName,
              userEmail: form.value.email,
              userPhone: form.value.phone,
              date: form.value.date,
              time: form.value.time,
              address: constructAddress(form.value),
              price: technician.value.visitPrice || technician.value.basePrice || 'N/A',
              note: form.value.note || '',
              payment: form.value.payment,
              paymentDetails: {
                paypalOrderId: paypalOrderId,
                paypalPayerId: order.payer.payer_id,
                amount: paymentAmount,
                currency: order.purchase_units[0].amount.currency_code,
                status: order.status,
                captureId: order.purchase_units[0].payments.captures[0]?.id,
                paymentMethod: 'PayPal',
                transactionTime: new Date().toISOString()
              },
              status: 'pending',
              createdAt: serverTimestamp(),
              paymentSplit: splitSuccess
            };
            
            console.log('Creating PayPal booking with data:', bookingData);
            
            // Save booking to Firestore with timeout (non-blocking)
            let bookingRef;
            const bookingSaveStartTime = Date.now();
            
            // Make booking save non-blocking with shorter timeout
            const bookingSavePromise = addDoc(collection(db, 'bookings'), bookingData)
              .then(ref => {
                const bookingSaveEndTime = Date.now();
                console.log(`PayPal booking saved with ID: ${ref.id} in ${bookingSaveEndTime - bookingSaveStartTime}ms`);
                return ref;
              })
              .catch(firestoreError => {
                console.error('Error saving booking to Firestore:', firestoreError);
                // Record failed transaction but don't fail the payment
                recordFailedTransaction({
                  message: 'Payment successful but booking save failed',
                  error: firestoreError,
                  orderId: paypalOrderId
                });
                return null;
              });
            
            // Wait for booking save with timeout, but don't block the flow
            try {
              bookingRef = await Promise.race([
                bookingSavePromise,
                new Promise((_, reject) => setTimeout(() => reject(new Error('Booking save timeout')), 5000))
              ]);
            } catch (timeoutError) {
              console.warn('Booking save timed out, continuing with payment success');
              bookingRef = null;
            }
            
            // Update booking data with the Firestore ID
            if (bookingRef) {
              bookingData.id = bookingRef.id;
            } else {
              // If booking save failed, still proceed with payment success
              bookingData.id = `temp_${Date.now()}`;
              console.log('Using temporary booking ID due to save timeout');
            }
            
            // Send notifications (non-blocking)
            sendPaymentNotifications(
              bookingData.paymentDetails,
              technician.value.uid || technician.value.id,
              technician.value.name
            ).catch(notificationError => {
              console.error('Error sending payment notifications:', notificationError);
            });

            sendBookingRequestNotification(bookingData).catch(notificationError => {
              console.error('Error sending booking request notification:', notificationError);
            });
            
            sendBookingRequestEmail(bookingData).catch(emailError => {
              console.error('Error sending booking request email:', emailError);
            });
            
            // Store booking data and redirect immediately
            localStorage.setItem('bookingData', JSON.stringify(bookingData));
            console.log('PayPal booking completed successfully');
            
            // Clear any loading states and show success immediately
            if (container) {
              container.innerHTML = '<div class="text-center p-4 text-green-500">Payment successful! Redirecting...</div>';
            }
            
            // Reset payment processing flag
            isProcessingPayment.value = false;
            
            // Redirect to confirmation page immediately
            const redirectStartTime = Date.now();
            router.push('/bookingconfirmation');
            const redirectEndTime = Date.now();
            console.log(`Redirect initiated in ${redirectEndTime - redirectStartTime}ms`);
            
          } catch (err) {
            console.error('Error capturing PayPal payment:', err);
            
            // Clear timeout if it exists
            if (typeof captureTimeout !== 'undefined') {
              clearTimeout(captureTimeout);
            }
            
            // Record failed transaction
            recordFailedTransaction(err);
            
            // Show user-friendly error message
            const errorMessage = err.message || 'Payment failed. Please try again.';
            errorMsg.value = errorMessage;
            
            // Clear loading state and show error
            if (container) {
              container.innerHTML = '<div class="text-center p-4 text-red-500">Payment failed. Please try again.</div>';
            }
            
            // Reset payment processing flag
            isProcessingPayment.value = false;
            
            // Re-initialize PayPal button for retry
            setTimeout(() => {
              initializePayPalButton();
            }, 1000);
          }
        },

        onError: function(err) {
          console.error('PayPal error:', err);
          
          // Log specific card field errors for debugging
          if (err.message && (err.message.includes('scf_') || err.message.includes('credit_form'))) {
            console.log('🔍 PayPal Card Field Error Details:', {
              error: err.message,
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent,
              url: window.location.href
            });
          }
          
          // Handle window closure errors with alternative approach
          if (err.message && (err.message.includes('window') || err.message.includes('postrobot'))) {
            console.log('🔄 Window closure detected, trying alternative payment approach...');
            
            // Try to reinitialize with a different configuration
            setTimeout(() => {
              tryAlternativePaymentFlow();
            }, 1000);
            return;
          }
          
          // Record failed transaction
          recordFailedTransaction(err);
          
          // Show user-friendly error message
          let errorMessage = 'Payment failed. Please try again.';
          let detailedMessage = '';
          
          if (err.message) {
            if (err.message.includes('popup')) {
              errorMessage = 'Payment popup was blocked.';
              detailedMessage = 'Please allow popups for this site and try again.';
            } else if (err.message.includes('network')) {
              errorMessage = 'Network error occurred.';
              detailedMessage = 'Please check your internet connection and try again.';
            } else if (err.message.includes('timeout')) {
              errorMessage = 'Payment timed out.';
              detailedMessage = 'Please try again.';
            } else if (err.message.includes('window is closed')) {
              errorMessage = 'Payment window was closed.';
              detailedMessage = 'Please complete the payment without closing the PayPal window.';
            } else if (err.message.includes('card') || err.message.includes('credit') || err.message.includes('debit')) {
              errorMessage = 'Card payment failed.';
              detailedMessage = 'Please check your card details and try again, or use PayPal account payment instead.';
            } else if (err.message.includes('scf_') || err.message.includes('credit_form')) {
              errorMessage = 'Card payment processing failed.';
              detailedMessage = 'This may be due to geographic restrictions or card limitations. Please try using PayPal account payment instead.';
            } else if (err.message.includes('add this card') || err.message.includes('card details')) {
              errorMessage = 'Card payment failed.';
              detailedMessage = 'Please check your card details or try using PayPal account payment instead.';
            }
          }
          
          errorMsg.value = errorMessage;
          
          // Reset payment processing flag
          isProcessingPayment.value = false;
          
          // Show detailed error message with retry button
          const container = document.getElementById('paypal-button-container');
          if (container) {
            container.innerHTML = `
              <div class="text-center p-4">
                <div class="text-red-500 mb-2">${errorMessage}</div>
                <div class="text-sm text-gray-600 mb-3">
                  ${detailedMessage}
                </div>
                <button onclick="window.location.reload()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Try Again
                </button>
              </div>
            `;
          }
          
          // Re-initialize PayPal button for retry after a delay
          // For window closure errors, retry immediately
          const retryDelay = (err.message && (err.message.includes('window') || err.message.includes('postrobot'))) ? 2000 : 5000;
          setTimeout(() => {
            console.log('🔄 Retrying PayPal button initialization...');
            initializePayPalButton();
          }, retryDelay);
        },

        onCancel: function(data) {
          console.log('PayPal payment cancelled by user');
          isProcessingPayment.value = false;
          errorMsg.value = 'Payment was cancelled. You can try again or choose a different payment method.';
        }
      });

      // Render the button with error handling
      console.log('🔍 Rendering PayPal button...');
      console.log('PayPal button object:', paypalButton);
      
      // Try to render the button directly without eligibility check
      // The eligibility check can be unreliable, so we'll render and handle errors
      paypalButton.render('#paypal-button-container')
        .then(() => {
          console.log('✅ PayPal button rendered successfully');
          console.log('✅ PayPal button is ready for transactions');
        })
        .catch((error) => {
          console.error('❌ Error rendering PayPal button:', error);
          
                    // Check if it's a funding source eligibility issue
          if (error.message && error.message.includes('not eligible')) {
            console.log('🔍 Funding source eligibility issue detected');
            console.log('🔄 Trying fallback with different funding sources...');
            
            const fallbackOptions = [
              { name: 'PayPal + Card', sources: [window.paypal.FUNDING.PAYPAL, window.paypal.FUNDING.CARD] },
              { name: 'PayPal Only', sources: window.paypal.FUNDING.PAYPAL },
              { name: 'Card Only', sources: window.paypal.FUNDING.CARD }
            ];
            
            let fallbackIndex = 0;
            
            function tryNextFallback() {
              if (fallbackIndex >= fallbackOptions.length) {
                console.log('❌ All fallback options failed');
                const container = document.getElementById('paypal-button-container');
                if (container) {
                  container.innerHTML = '<div class="text-center p-4 text-red-500">PayPal is not available for this transaction. Please choose a different payment method.</div>';
                }
                return;
              }
              
              const option = fallbackOptions[fallbackIndex];
              console.log(`🔄 Trying fallback: ${option.name}`);
              
              const fallbackButton = window.paypal.Buttons({
                fundingSource: option.sources,
                createOrder: paypalButton.createOrder,
                onApprove: paypalButton.onApprove,
                onError: paypalButton.onError,
                onCancel: paypalButton.onCancel
              });
              
              fallbackButton.render('#paypal-button-container')
                .then(() => {
                  console.log(`✅ PayPal fallback "${option.name}" rendered successfully`);
                })
                .catch((fallbackError) => {
                  console.error(`❌ Fallback "${option.name}" failed:`, fallbackError);
                  fallbackIndex++;
                  tryNextFallback();
                });
            }
            
            tryNextFallback();
          } else {
            // Handle other types of errors
            errorMsg.value = 'Payment button failed to load. Please refresh the page and try again.';
            
            const container = document.getElementById('paypal-button-container');
            if (container) {
              container.innerHTML = '<div class="text-center p-4 text-red-500">Payment button failed to load. Please refresh the page and try again.</div>';
            }
          }
        });
      
    } catch (error) {
      console.error('Error initializing PayPal button:', error);
      errorMsg.value = 'Payment system error. Please try again.';
      
      const container = document.getElementById('paypal-button-container');
      if (container) {
        container.innerHTML = '<div class="text-center p-4 text-red-500">Payment system error. Please refresh the page and try again.</div>';
      }
    }
  }, 300); // Increased delay for better reliability
}

function handlePaymentMethodChange() {
  if (form.value.payment === 'PayPal') {
    // Clear any existing error messages
    errorMsg.value = '';
    
    // Add a longer delay to ensure DOM is fully updated
    setTimeout(() => {
      if (paypalLoaded.value) {
        initializePayPalButton();
      } else {
        // If PayPal is not loaded yet, try loading it
        loadPayPalScript();
      }
    }, 300);
  }
}



// Retry PayPal loading
function retryPayPalLoading() {
  console.log('🔄 Retrying PayPal loading...');
  errorMsg.value = ''; // Clear error message
  paypalLoaded.value = false; // Reset loading state
  
  // Clear the container
  const container = document.getElementById('paypal-button-container');
  if (container) {
    container.innerHTML = '';
  }
  
  // Reload PayPal script
  setTimeout(() => {
    loadPayPalScript();
  }, 100);
}

async function createBookingWithPayment(paymentDetails) {
  try {
    loading.value = true;
    
    // Create booking data
  const bookingData = {
    technicianId: technician.value.uid || technician.value.id,
    technicianName: technician.value.name,
    userId: auth.currentUser?.uid, // Add current user's UID
    userName: form.value.fullName,
    userEmail: form.value.email,
    userPhone: form.value.phone,
    date: form.value.date,
    time: form.value.time,
    address: constructAddress(form.value),
    price: technician.value.visitPrice || technician.value.basePrice || 'N/A',
    note: form.value.note || '',
    payment: form.value.payment,
    paymentDetails: {
        ...paymentDetails,
        paymentMethod: form.value.payment
    },
    status: 'pending',
    createdAt: serverTimestamp()
  };

    console.log('Creating booking with payment details:', bookingData);
    console.log('Complete form data:', form.value);
    console.log('User email being saved:', bookingData.userEmail);
    console.log('Form email value:', form.value.email);
    console.log('Technician ID being saved:', bookingData.technicianId);
    console.log('Technician UID:', technician.value.uid);
    console.log('Technician ID:', technician.value.id);
    console.log('Technician name:', technician.value.name);
    console.log('Address being saved:', bookingData.address);
    console.log('Address type:', typeof bookingData.address);
    console.log('Address length:', bookingData.address ? bookingData.address.length : 'undefined');

    // Save booking to Firestore
    const bookingRef = await addDoc(collection(db, 'bookings'), bookingData);
    console.log('Booking saved with ID:', bookingRef.id);
    
    // Update booking data with the Firestore ID
    bookingData.id = bookingRef.id;

    // Send payment notifications for cash payments
    if (form.value.payment === 'Cash on Visit') {
      await sendPaymentNotifications(
        bookingData.paymentDetails,
        technician.value.uid || technician.value.id,
        technician.value.name
      );
    }
    
    // Send booking request notifications
    await sendBookingRequestNotification(bookingData);
    
    // Store booking data and redirect
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    router.push('/bookingconfirmation');
    
  } catch (error) {
    console.error('Error creating booking:', error);
    errorMsg.value = t('bookingError');
  } finally {
    loading.value = false;
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
  console.log('Email data:', data);
  // Email functionality removed
}

async function confirmBooking() {
  // This function is for cash payments
  if (form.value.payment !== 'Cash on Visit') {
    return;
  }

  // Validate that a date is selected
  if (!form.value.date || availableDates.value.length === 0) {
    errorMsg.value = 'Please select an available date for booking.';
    return;
  }

  // Validate that a time is selected
  if (!form.value.time || availableTimes.value.length === 0) {
    errorMsg.value = 'Please select an available time slot for booking.';
    return;
  }

  const bookingData = {
    technicianId: technician.value.uid || technician.value.id,
    technicianName: technician.value.name,
    userId: auth.currentUser?.uid, // Add current user's UID
    userName: form.value.fullName,
    userEmail: form.value.email,
    userPhone: form.value.phone,
    date: form.value.date,
    time: form.value.time,
    address: constructAddress(form.value),
    price: technician.value.visitPrice || technician.value.basePrice || 'N/A',
    note: form.value.note || '',
    payment: form.value.payment,
    status: 'pending',
    createdAt: serverTimestamp()
  };

  try {
    console.log('Creating cash booking with data:', bookingData);
    console.log('Complete form data:', form.value);
    console.log('User email being saved:', bookingData.userEmail);
    console.log('Form email value:', form.value.email);
    console.log('Technician ID being saved:', bookingData.technicianId);
    console.log('Technician UID:', technician.value.uid);
    console.log('Technician ID:', technician.value.id);
    console.log('Technician name:', technician.value.name);
    console.log('Address being saved:', bookingData.address);
    console.log('Address type:', typeof bookingData.address);
    console.log('Address length:', bookingData.address ? bookingData.address.length : 'undefined');
    
    // Save booking to Firestore
    const bookingRef = await addDoc(collection(db, 'bookings'), bookingData);
    console.log('Cash booking saved with ID:', bookingRef.id);
    
    // Update booking data with the Firestore ID
    bookingData.id = bookingRef.id;
    
    // Send confirmation email to customer
    if (form.value.email) {
      sendConfirmationEmail(form.value.email, technician.value.name, form.value.date, form.value.time, form.value.payment);
    }
    
    // Send booking request notifications to technician and admin
    console.log('Sending booking request notifications...');
    await sendBookingRequestNotification(bookingData);
    
    // Send booking request email to technician
    console.log('Sending booking request email...');
    await sendBookingRequestEmail(bookingData);
    
    // Store booking data for confirmation page
    const confirmationData = {
      technicianName: technician.value.name,
      date: form.value.date,
      time: form.value.time,
      payment: form.value.payment
    };
    localStorage.setItem('bookingData', JSON.stringify(confirmationData));
    
    console.log('Cash booking completed successfully');
    router.push('/bookingconfirmation');
  } catch (e) {
    console.error('Booking Firestore error:', e);
    errorMsg.value = t('bookingCreationFailed');
  }
}

// Function to try alternative payment flow
function tryAlternativePaymentFlow() {
  console.log('🔄 Trying alternative payment flow...');
  
  const container = document.getElementById('paypal-button-container');
  if (!container) return;
  
  // Clear existing content
  container.innerHTML = '';
  
  // Create alternative PayPal button with different configuration
  const alternativeButton = window.paypal.Buttons({
    style: {
      layout: 'horizontal',
      color: 'gold',
      shape: 'rect',
      label: 'paypal'
    },
    
    createOrder: function(data, actions) {
      // Same order creation logic
      const priceString = technician.value.visitPrice || technician.value.basePrice;
      const amount = parseFloat(priceString.replace(/[^\d.]/g, ''));
      const usdAmount = (amount / 31).toFixed(2);
      
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: usdAmount,
            currency_code: 'USD'
          },
          payee: {
            email_address: 'narutossj23@yahoo.com'
          },
          description: `Booking with ${technician.value.name} - ${form.value.date} at ${form.value.time}`,
          custom_id: `booking_${Date.now()}`,
          invoice_id: `INV_${Date.now()}`
        }],
        application_context: {
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
          return_url: window.location.origin + '/bookingconfirmation',
          cancel_url: window.location.origin + '/bookingpage',
          brand_name: 'BoltFix',
          landing_page: 'LOGIN'
        }
      });
    },
    
    onApprove: async function(data, actions) {
      // Same approval logic as main button
      if (isProcessingPayment.value) return;
      isProcessingPayment.value = true;
      
      try {
        const order = await actions.order.capture();
        // Handle successful payment (same as main flow)
        console.log('✅ Alternative payment flow successful:', order);
        // Continue with booking creation...
      } catch (error) {
        console.error('❌ Alternative payment flow failed:', error);
        errorMsg.value = 'Payment failed. Please try again or contact support.';
      } finally {
        isProcessingPayment.value = false;
      }
    },
    
    onError: function(err) {
      console.error('Alternative payment flow error:', err);
      errorMsg.value = 'Payment system unavailable. Please try again later.';
    }
  });
  
  // Render the alternative button
  alternativeButton.render('#paypal-button-container')
    .then(() => {
      console.log('✅ Alternative payment flow initialized');
    })
    .catch(error => {
      console.error('❌ Failed to initialize alternative payment flow:', error);
      container.innerHTML = '<div class="text-center p-4 text-red-500">Payment system temporarily unavailable. Please try again later.</div>';
    });
}

function recordFailedTransaction(error) {
  console.error('PayPal transaction failed:', error);
  const errorMessage = error.message || JSON.stringify(error);
  const errorDetails = {
    errorMessage: errorMessage,
    errorCode: error.code,
    errorDetails: error.details,
    timestamp: serverTimestamp()
  };

  addDoc(collection(db, 'failedPayPalTransactions'), errorDetails)
    .then(() => {
      console.log('Failed PayPal transaction recorded successfully.');
    })
    .catch(err => {
      console.error('Error recording failed PayPal transaction:', err);
    });
}

// After successful PayPal payment, split the amount
async function splitPaymentToAccounts(paypalOrderId, totalAmountUSD, technicianId) {
  try {
    console.log('Splitting payment:', totalAmountUSD, 'USD between accounts');
    
    // Get technician's PayPal email from their profile (with timeout)
    let technicianPayPalEmail = '';
    try {
      const technicianDocPromise = getDoc(doc(db, 'technicians', technicianId));
      const technicianDoc = await Promise.race([
        technicianDocPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
      ]);
      
      if (technicianDoc.exists()) {
        const technicianData = technicianDoc.data();
        technicianPayPalEmail = technicianData.paypalEmail || technicianData.email || '';
        console.log('Technician PayPal email:', technicianPayPalEmail);
      }
    } catch (error) {
      console.error('Error fetching technician PayPal email:', error);
      // Use a default email if we can't fetch the technician's email
      technicianPayPalEmail = 'technician@default.com';
    }
    
    if (!technicianPayPalEmail) {
      console.error('No technician PayPal email found');
      return false;
    }
    
    // Calculate split amounts (25% platform fee, 75% technician)
    const platformFeeUSD = totalAmountUSD * 0.25; // 25% to platform
    const technicianAmountUSD = totalAmountUSD * 0.75; // 75% to technician
    
    console.log('Platform fee (25%):', platformFeeUSD, 'USD');
    console.log('Technician payment (75%):', technicianAmountUSD, 'USD');
    
    // Store split information directly in Firebase (client-side)
    const splitRecord = {
      paypalOrderId: paypalOrderId,
      totalAmountUSD: totalAmountUSD,
      platformFeeUSD: platformFeeUSD,
      technicianAmountUSD: technicianAmountUSD,
      platformAccount: "narutossj23@yahoo.com", // Your platform account
      technicianAccount: technicianPayPalEmail, // Technician's PayPal account
      splitPercentage: {
        platform: 25,
        technician: 75
      },
      status: 'pending',
      createdAt: serverTimestamp(),
      transactionType: 'payment_split'
    };
    
    // Add to paymentSplits collection with timeout
    const addDocPromise = addDoc(collection(db, 'paymentSplits'), splitRecord);
    await Promise.race([
      addDocPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
    ]);
    
    console.log('Payment split recorded successfully:', splitRecord);
    return true;
    
  } catch (error) {
    console.error('Error splitting payment:', error);
    return false;
  }
}

// Send payment notifications to technician and admin
async function sendPaymentNotifications(paymentDetails, technicianId, technicianName) {
  try {
    console.log('Sending payment notifications...');
    
    const notificationData = {
      type: 'payment_received',
      title: 'Payment Received',
      message: `Payment of ${paymentDetails.amount} ${paymentDetails.currency} received for booking`,
      paymentMethod: paymentDetails.paymentMethod,
      amount: paymentDetails.amount,
      currency: paymentDetails.currency,
      paypalOrderId: paymentDetails.paypalOrderId,
      technicianId: technicianId,
      technicianName: technicianName,
      customerName: form.value.fullName,
      customerEmail: form.value.email,
      createdAt: serverTimestamp(),
      read: false
    };
    
    // Send notification to technician
    const technicianNotification = {
      ...notificationData,
      recipientId: technicianId,
      recipientType: 'technician',
      message: `You have received a payment of ${paymentDetails.amount} ${paymentDetails.currency} from ${form.value.fullName} for a booking. Payment method: ${paymentDetails.paymentMethod}`
    };
    
    // Send notification to admin
    const adminNotification = {
      ...notificationData,
      recipientId: 'admin',
      recipientType: 'admin',
      message: `Payment received: ${paymentDetails.amount} ${paymentDetails.currency} from ${form.value.fullName} to ${technicianName}. Payment method: ${paymentDetails.paymentMethod}`
    };
    
    // Add notifications to Firebase
    await addDoc(collection(db, 'notifications'), technicianNotification);
    await addDoc(collection(db, 'notifications'), adminNotification);
    
    console.log('Payment notifications sent successfully');
    return true;
    
  } catch (error) {
    console.error('Error sending payment notifications:', error);
    return false;
  }
}

// Send booking request notifications to technician
async function sendBookingRequestNotification(bookingData) {
  try {
    console.log('=== SENDING BOOKING REQUEST NOTIFICATION ===');
    console.log('Booking data received:', bookingData);
    console.log('Technician ID from booking:', bookingData.technicianId);
    console.log('Technician name from booking:', bookingData.technicianName);
    
    // Try to find the technician's actual UID by multiple methods
    let technicianUid = bookingData.technicianId;
    let technicianEmail = '';
    
    try {
      // Method 1: Try to get technician data from the technicians collection using the booking's technicianId
      const technicianDoc = await getDoc(doc(db, 'technicians', bookingData.technicianId));
      if (technicianDoc.exists()) {
        const techData = technicianDoc.data();
        technicianEmail = techData.email;
        console.log('Found technician data by ID:', techData);
        console.log('Technician email:', technicianEmail);
        
        // Use the technician's actual UID from Firebase Auth, not the document ID
        if (techData.uid) {
          technicianUid = techData.uid;
          console.log('Using technician UID from data:', technicianUid);
        } else {
          // If no uid field, try to find the technician by email in the technicians collection
          const techEmailQuery = query(
            collection(db, 'technicians'),
            where('email', '==', techData.email)
          );
          const techEmailSnapshot = await getDocs(techEmailQuery);
          if (!techEmailSnapshot.empty) {
            const techDoc = techEmailSnapshot.docs[0];
            const techDocData = techDoc.data();
            if (techDocData.uid) {
              technicianUid = techDocData.uid;
              console.log('Found technician UID by email lookup:', technicianUid);
            }
          }
        }
      } else {
        console.log('Technician document not found by ID, trying to find by name...');
        
        // Method 2: Try to find technician by name in technicians collection
        const techNameQuery = query(
          collection(db, 'technicians'),
          where('fullName', '==', bookingData.technicianName)
        );
        const techNameSnapshot = await getDocs(techNameQuery);
        if (!techNameSnapshot.empty) {
          const techDoc = techNameSnapshot.docs[0];
          const techData = techDoc.data();
          technicianEmail = techData.email;
          // Use the technician's actual UID, not the document ID
          if (techData.uid) {
            technicianUid = techData.uid;
          } else {
            technicianUid = techDoc.id; // Fallback to document ID if no uid field
          }
          console.log('Found technician by name:', technicianUid, technicianEmail);
        } else {
          console.log('Technician not found by name, trying to find by email...');
          
          // Method 3: Try to find technician by email (common emails)
          const commonEmails = ['maged@yahoo.com', 'magedishak@yahoo.com', 'maged.ishak@yahoo.com'];
          for (const email of commonEmails) {
            const techEmailQuery = query(
              collection(db, 'technicians'),
              where('email', '==', email)
            );
            const techEmailSnapshot = await getDocs(techEmailQuery);
            if (!techEmailSnapshot.empty) {
              const techDoc = techEmailSnapshot.docs[0];
              const techData = techDoc.data();
              technicianEmail = techData.email;
              // Use the technician's actual UID, not the document ID
              if (techData.uid) {
                technicianUid = techData.uid;
              } else {
                technicianUid = techDoc.id; // Fallback to document ID if no uid field
              }
              console.log('Found technician by email:', technicianUid, technicianEmail);
              break;
            }
          }
        }
      }
    } catch (error) {
      console.error('Error looking up technician:', error);
    }
    
    // If we still don't have a technician email, try to get it from the technician name
    if (!technicianEmail && bookingData.technicianName) {
      try {
        const techQuery = query(
          collection(db, 'technicians'),
          where('fullName', '==', bookingData.technicianName)
        );
        const techSnapshot = await getDocs(techQuery);
        if (!techSnapshot.empty) {
          const techDoc = techSnapshot.docs[0];
          const techData = techDoc.data();
          technicianEmail = techData.email;
          // Use the technician's actual UID, not the document ID
          if (techData.uid) {
            technicianUid = techData.uid;
          } else {
            technicianUid = techDoc.id; // Fallback to document ID if no uid field
          }
          console.log('Found technician email by name:', technicianEmail);
        }
      } catch (error) {
        console.error('Error finding technician email by name:', error);
      }
    }
    
    console.log('Final technician UID:', technicianUid);
    console.log('Final technician email:', technicianEmail);
    
    const notificationData = {
      type: 'booking_request',
      title: 'New Booking Request',
      message: `New booking request from ${bookingData.userName} for ${bookingData.date} at ${bookingData.time}`,
      bookingId: bookingData.id || 'pending',
      technicianId: technicianUid,
      technicianName: bookingData.technicianName,
      technicianEmail: technicianEmail,
      customerName: bookingData.userName,
      customerEmail: bookingData.userEmail,
      customerPhone: bookingData.userPhone,
      bookingDate: bookingData.date,
      bookingTime: bookingData.time,
      paymentMethod: bookingData.payment,
      status: 'pending',
      createdAt: serverTimestamp(),
      read: false
    };
    
    console.log('Notification data prepared:', notificationData);
    
    // Send notification to technician using their actual UID
    const technicianNotification = {
      ...notificationData,
      recipientId: technicianUid,
      recipientType: 'technician',
      message: `New booking request from ${bookingData.userName} for ${bookingData.date} at ${bookingData.time}. Payment method: ${bookingData.payment}`
    };
    
    console.log('Technician UID for notification:', technicianUid);
    console.log('Technician notification object:', technicianNotification);
    
    // Send notification to admin
    const adminNotification = {
      ...notificationData,
      recipientId: 'admin',
      recipientType: 'admin',
      message: `New booking request: ${bookingData.userName} booked ${bookingData.technicianName} for ${bookingData.date} at ${bookingData.time}. Payment method: ${bookingData.payment}`
    };
    
    console.log('Admin notification object:', adminNotification);
    
    // Add notifications to Firebase
    console.log('Adding technician notification to Firebase...');
    const techNotificationRef = await addDoc(collection(db, 'notifications'), technicianNotification);
    console.log('Technician notification added with ID:', techNotificationRef.id);
    
    // Also send a notification using technician's email as recipientId for fallback
    if (technicianEmail) {
      const emailNotification = {
        ...notificationData,
        recipientId: technicianEmail,
        recipientType: 'technician',
        recipientEmail: technicianEmail,
        message: `New booking request from ${bookingData.userName} for ${bookingData.date} at ${bookingData.time}. Payment method: ${bookingData.payment}`
      };
      
      console.log('Adding email fallback notification to Firebase...');
      const emailNotificationRef = await addDoc(collection(db, 'notifications'), emailNotification);
      console.log('Email fallback notification added with ID:', emailNotificationRef.id);
    }
    
    console.log('Adding admin notification to Firebase...');
    const adminNotificationRef = await addDoc(collection(db, 'notifications'), adminNotification);
    console.log('Admin notification added with ID:', adminNotificationRef.id);
    
    console.log('=== BOOKING REQUEST NOTIFICATIONS SENT SUCCESSFULLY ===');
    return true;
    
  } catch (error) {
    console.error('=== ERROR SENDING BOOKING REQUEST NOTIFICATION ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    return false;
  }
}

// Send booking request email to technician
async function sendBookingRequestEmail(bookingData) {
  try {
    console.log('Sending booking request email to technician...');
    
    // Get technician's email from their profile
    const technicianDoc = await getDoc(doc(db, 'technicians', bookingData.technicianId));
    if (!technicianDoc.exists()) {
      console.error('Technician not found');
      return false;
    }
    
    const technicianData = technicianDoc.data();
    const technicianEmail = technicianData.email;
    
    if (!technicianEmail) {
      console.error('Technician email not found');
      return false;
    }
    
    // Email template for booking request
    const emailTemplate = {
      to_email: technicianEmail,
      to_name: technicianData.fullName || technicianData.name,
      customer_name: bookingData.userName,
      customer_email: bookingData.userEmail,
      customer_phone: bookingData.userPhone,
      booking_date: bookingData.date,
      booking_time: bookingData.time,
      payment_method: bookingData.payment,
      subject: 'New Booking Request - BoltFix'
    };
    
    // Email functionality removed
    console.log('Booking request email template:', emailTemplate);
    return true;
    
  } catch (error) {
    console.error('Error sending booking request email:', error);
    return false;
  }
}

// Test notification function
async function testNotification() {
  try {
    console.log('=== TESTING BOOKING REQUEST NOTIFICATION ===');
    
    const testBookingData = {
      id: 'test-booking-id',
      technicianId: 'test-technician-id',
      technicianName: 'Maged Ishak',
      userName: 'Test User',
      userEmail: 'narutossj23@yahoo.com',
      userPhone: '1234567890',
      date: '2023-10-27',
      time: '10:00 AM',
      payment: 'PayPal',
      status: 'pending'
    };
    
    console.log('Test booking data:', testBookingData);
    
    // Test the notification function
    const result = await sendBookingRequestNotification(testBookingData);
    
    if (result) {
      alert('✅ Test notification sent successfully! Check console for details.');
    } else {
      alert('❌ Test notification failed! Check console for errors.');
    }
    
  } catch (error) {
    console.error('❌ Error in test notification:', error);
    alert('❌ Test notification error: ' + error.message);
  }
}

// Manual notification test function
async function createManualNotification() {
  try {
    console.log('=== CREATING MANUAL NOTIFICATION ===');
    
    // Find Maged Ishak in the technicians collection
    const techQuery = query(
      collection(db, 'technicians'),
      where('fullName', '==', 'Maged Ishak')
    );
    const techSnapshot = await getDocs(techQuery);
    
    if (techSnapshot.empty) {
      alert('❌ Maged Ishak not found in technicians collection');
      return;
    }
    
    const techDoc = techSnapshot.docs[0];
    const techData = techDoc.data();
    const technicianUid = techDoc.id;
    const technicianEmail = techData.email;
    
    console.log('Found technician:', { uid: technicianUid, email: technicianEmail, data: techData });
    
    // Create a test notification
    const testNotification = {
      type: 'booking_request',
      title: 'Test Booking Request',
      message: 'This is a test booking request notification',
      bookingId: 'test-manual-booking',
      technicianId: technicianUid,
      technicianName: 'Maged Ishak',
      technicianEmail: technicianEmail,
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      customerPhone: '1234567890',
      bookingDate: '2023-10-27',
      bookingTime: '10:00 AM',
      paymentMethod: 'Cash',
      status: 'pending',
      recipientId: technicianUid,
      recipientType: 'technician',
      createdAt: serverTimestamp(),
      read: false
    };
    
    console.log('Creating manual notification:', testNotification);
    
    const notificationRef = await addDoc(collection(db, 'notifications'), testNotification);
    console.log('Manual notification created with ID:', notificationRef.id);
    
    alert(`✅ Manual notification created successfully!\nTechnician UID: ${technicianUid}\nNotification ID: ${notificationRef.id}`);
    
  } catch (error) {
    console.error('Manual notification error:', error);
    alert('❌ Manual notification error: ' + error.message);
  }
}



function constructAddress(formData) {
  console.log('=== CONSTRUCTING ADDRESS ===');
  console.log('Form data for address:', {
    street: formData.street,
    building: formData.building,
    area: formData.area,
    city: formData.city
  });
  
  const addressParts = [];
  if (formData.street) {
    addressParts.push(formData.street);
  }
  if (formData.building) {
    addressParts.push(formData.building);
  }
  if (formData.area) {
    addressParts.push(formData.area);
  }
  if (formData.city) {
    addressParts.push(formData.city);
  }
  
  const finalAddress = addressParts.join(', ');
  console.log('Address parts:', addressParts);
  console.log('Final constructed address:', finalAddress);
  console.log('=== END ADDRESS CONSTRUCTION ===');
  
  return finalAddress;
}

// Handle location detection from LocationMap component
function handleLocationDetected(locationData) {
  console.log('Location detected in BookingPage:', locationData);
  
  if (locationData.addressDetails) {
    // Auto-fill form fields with detected location details
    const { city, area, street, building } = locationData.addressDetails;
    
    if (city) form.value.city = city;
    if (area) form.value.area = area;
    if (street) form.value.street = street;
    if (building) form.value.building = building;
    
    console.log('Form auto-filled with detected location:', {
      city: form.value.city,
      area: form.value.area,
      street: form.value.street,
      building: form.value.building
    });
  }
  
  // Store coordinates for potential future use
  if (locationData.latitude && locationData.longitude) {
    console.log('Coordinates stored:', {
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      accuracy: locationData.accuracy
    });
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
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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
  flex-shrink: 0;
}

.nav-arrow:hover {
  background: #6b5fa7;
}

.date-slots {
  display: flex;
  gap: 1rem;
  flex: 1;
  justify-content: center;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.date-slots::-webkit-scrollbar {
  display: none;
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

.payment-info {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 6px;
}

.payment-info i {
  margin-top: 0.125rem;
  flex-shrink: 0;
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
  padding: 2rem;
  color: #6b7280;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #7c6bb1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-note {
  font-size: 0.875rem;
  color: #9ca3af;
  margin-top: 0.5rem;
}

.paypal-error {
  text-align: center;
  padding: 2rem;
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.error-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.retry-btn {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 1rem;
}

.retry-btn:hover {
  background: #b91c1c;
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

/* Test Button */
.test-btn {
  background: #f59e0b;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  align-self: flex-end;
  margin-top: 1rem;
  margin-left: 1rem;
}

.test-btn:hover {
  background: #d97706;
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
    flex-direction: row;
    gap: 0.5rem;
  }
  
  .date-slots {
    flex-direction: row;
    gap: 0.5rem;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .date-slots::-webkit-scrollbar {
    display: none;
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
    min-width: 80px;
    flex-shrink: 0;
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
  
  .date-slot {
    padding: 0.4rem;
    min-width: 70px;
    flex-shrink: 0;
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