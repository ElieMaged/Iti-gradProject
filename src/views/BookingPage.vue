<template>
  <div class="booking-page" :class="{ 'loading': isLoading }">
    <!-- Header -->
    <div class="header">
      <h1 class="page-title">{{ $t('completeYourBooking') }}</h1>
    </div>

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

    <!-- Main Booking Card -->
    <div class="booking-card">
      <div v-if="errorMsg" class="error-message">{{ errorMsg }}</div>

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
              <input type="radio" value="Cash on Visit" v-model="form.payment" @change="handlePaymentMethodChange" />
              <span class="payment-text">{{ $t('cashOnVisit') }}</span>
            </label>
            <label class="payment-option">
              <input type="radio" value="Credit Card" v-model="form.payment" @change="handlePaymentMethodChange" />
              <span class="payment-text">{{ $t('creditCard') || 'Credit Card' }}</span>
              <i class="fas fa-credit-card payment-icon"></i>
            </label>
          </div>
          
          <div v-if="form.payment === 'Credit Card' && (technician.basePrice || technician.visitPrice)" class="payment-summary">
            <div class="payment-amount">
              <span>{{ $t('totalAmount') }}:</span>
              <span class="amount">{{ technician.visitPrice || technician.basePrice }} {{ $t('egp') }}</span>
            </div>
            <div class="payment-amount">
              <span>USD Equivalent:</span>
              <span class="amount">${{ ((parseFloat((technician.visitPrice || technician.basePrice).replace(/[^\d.]/g, '')) / 31)).toFixed(2) }} USD</span>
            </div>
            <div class="payment-note">{{ $t('creditCardPaymentNote') || 'Your payment will be processed securely' }}</div>
          </div>
        </div>
        
        <!-- Credit Card Form -->
        <div v-show="form.payment === 'Credit Card'" class="credit-card-container">
          <div class="credit-card-form">
            <div class="form-row">
              <div class="form-group card-number-group">
                <label for="cardNumber">
                  <i class="fas fa-credit-card"></i>
                  {{ $t('cardNumber') || 'Card Number' }}
                </label>
                <input 
                  id="cardNumber"
                  v-model="form.cardNumber" 
                  type="text" 
                  class="form-input card-input"
                  :class="{ 'error': cardErrors.cardNumber }"
                  placeholder="1234 5678 9012 3456"
                  maxlength="19"
                  @input="formatCardNumber"
                  @blur="validateCardNumber"
                />
                <span v-if="cardErrors.cardNumber" class="error-message">{{ cardErrors.cardNumber }}</span>
                <div class="card-type-indicator">
                  <i v-if="detectedCardType" :class="getCardIcon()"></i>
          </div>
          </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="expiryDate">
                  <i class="fas fa-calendar-alt"></i>
                  {{ $t('expiryDate') || 'Expiry Date' }}
                </label>
                <input 
                  id="expiryDate"
                  v-model="form.expiryDate" 
                  type="text" 
                  class="form-input card-input"
                  :class="{ 'error': cardErrors.expiryDate }"
                  placeholder="MM/YY"
                  maxlength="5"
                  @input="formatExpiryDate"
                  @blur="validateExpiryDate"
                />
                <span v-if="cardErrors.expiryDate" class="field-error">{{ cardErrors.expiryDate }}</span>
              </div>
              
              <div class="form-group">
                <label for="cvv">
                  <i class="fas fa-lock"></i>
                  {{ $t('cvv') || 'CVV' }}
                </label>
                <input 
                  id="cvv"
                  v-model="form.cvv" 
                  type="text" 
                  class="form-input card-input"
                  :class="{ 'error': cardErrors.cvv }"
                  placeholder="123"
                  maxlength="4"
                  @input="formatCVV"
                  @blur="validateCVV"
                />
                <span v-if="cardErrors.cvv" class="error-message">{{ cardErrors.cvv }}</span>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="cardholderName">
                  <i class="fas fa-user"></i>
                  {{ $t('cardholderName') || 'Cardholder Name' }}
                </label>
                <input 
                  id="cardholderName"
                  v-model="form.cardholderName" 
                  type="text" 
                  class="form-input card-input"
                  :class="{ 'error': cardErrors.cardholderName }"
                  placeholder="John Doe"
                  @blur="validateCardholderName"
                />
                <span v-if="cardErrors.cardholderName" class="error-message">{{ cardErrors.cardholderName }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Confirm Booking Button -->
        <button 
          v-if="form.payment === 'Cash on Visit' || form.payment === 'Credit Card'" 
          class="confirm-btn"
          :class="{ 'loading': isLoading }"
          :disabled="isLoading"
          type="submit"
        >
          <span v-if="!isLoading">{{ $t('confirmBooking') }}</span>
          <span v-else>{{ $t('processingPayment') || 'Processing Payment...' }}</span>
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
// Removed stockTechnicians import - only show registered technicians
import { auth } from '../firebase';
import LocationMap from '../components/LocationMap.vue'
import { getGovernmentNames, getDistrictsForGovernment } from '../data/egyptianLocations.js'

const { t } = useI18n();
const route = useRoute()
const router = useRouter()
const technician = ref({})
const errorMsg = ref('')

const technicianAvailability = ref(null)
const dateAvailability = ref({})

// Form data
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
  payment: 'Cash on Visit',
  // Credit card fields
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: ''
})

// Credit card validation
const cardErrors = ref({
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: ''
})

const detectedCardType = ref('')

// Loading state for booking confirmation
const isLoading = ref(false)

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

// Date and time management
const currentDateOffset = ref(0)

// Responsive breakpoint: detect mobile (< 768px). iPad portrait (768px) is NOT mobile
const isMobile = ref(typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false)
let mqListener = null

onMounted(() => {
  if (typeof window !== 'undefined') {
    const mq = window.matchMedia('(max-width: 767px)')
    // Save listener to remove later
    mqListener = (e) => {
      isMobile.value = e.matches
    }
    // Newer browsers
    if (mq.addEventListener) {
      mq.addEventListener('change', mqListener)
    } else if (mq.addListener) {
      // Fallback
      mq.addListener(mqListener)
    }
    // Ensure initial state
    isMobile.value = mq.matches
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    const mq = window.matchMedia('(max-width: 767px)')
    if (mq && mqListener) {
      if (mq.removeEventListener) {
        mq.removeEventListener('change', mqListener)
      } else if (mq.removeListener) {
        mq.removeListener(mqListener)
      }
    }
  }
})

// Dynamically generate available dates based on technician availability
const availableDates = computed(() => {
  const days = [];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  
  // Check today and next 13 days (2 weeks) for availability
  for (let i = 0; i < 14; i++) {
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
  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + i + currentDateOffset.value);
    const month = nextDay.getMonth() + 1;
    const date = nextDay.getDate();
    const year = nextDay.getFullYear();
    const dayOfWeek = dayNames[nextDay.getDay()];
    days.push(`${month}/${date}/${year} ${dayOfWeek}`);
  }
  // Show 3 cards on mobile (in column), 3 on larger screens (in row)
  return days.slice(0, 3);
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

// Credit Card Validation and Formatting Functions
function formatCardNumber(event) {
  let value = event.target.value.replace(/\D/g, '')
  value = value.replace(/(\d{4})/g, '$1 ').trim()
  form.value.cardNumber = value
  detectCardType(value.replace(/\s/g, ''))
}

function validateCardNumber() {
  const cardNumber = form.value.cardNumber.replace(/\s/g, '')
  cardErrors.value.cardNumber = ''
  
  if (!cardNumber) {
    cardErrors.value.cardNumber = 'Card number is required'
    return false
  }
  
  if (cardNumber.length < 13 || cardNumber.length > 19) {
    cardErrors.value.cardNumber = 'Card number must be between 13 and 19 digits'
    return false
  }
  
  return true
}

function formatExpiryDate(event) {
  let value = event.target.value.replace(/\D/g, '')
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2, 4)
  }
  form.value.expiryDate = value
}

function validateExpiryDate() {
  const expiry = form.value.expiryDate
  cardErrors.value.expiryDate = ''
  
  if (!expiry) {
    cardErrors.value.expiryDate = 'Expiry date is required'
    return false
  }
  
  const [month, year] = expiry.split('/')
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear() % 100
  const currentMonth = currentDate.getMonth() + 1
  
  if (!month || !year) {
    cardErrors.value.expiryDate = 'Please enter a valid expiry date (MM/YY)'
    return false
  }
  
  const monthNum = parseInt(month)
  const yearNum = parseInt(year)
  
  if (monthNum < 1 || monthNum > 12) {
    cardErrors.value.expiryDate = 'Invalid month'
    return false
  }
  
  if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
    cardErrors.value.expiryDate = 'Card has expired'
    return false
  }
  
  return true
}

function formatCVV(event) {
  let value = event.target.value.replace(/\D/g, '')
  form.value.cvv = value
}

function validateCVV() {
  const cvv = form.value.cvv
  cardErrors.value.cvv = ''
  
  if (!cvv) {
    cardErrors.value.cvv = 'CVV is required'
    return false
  }
  
  if (cvv.length < 3 || cvv.length > 4) {
    cardErrors.value.cvv = 'CVV must be 3 or 4 digits'
    return false
  }
  
  return true
}

function validateCardholderName() {
  const name = form.value.cardholderName
  cardErrors.value.cardholderName = ''
  
  if (!name) {
    cardErrors.value.cardholderName = 'Cardholder name is required'
    return false
  }
  
  if (name.length < 2) {
    cardErrors.value.cardholderName = 'Cardholder name must be at least 2 characters'
    return false
  }
  
  return true
}

function detectCardType(cardNumber) {
  const patterns = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/,
    diners: /^3(?:0[0-5]|[68])/,
    jcb: /^(?:2131|1800|35\d{3})/
  }
  
  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(cardNumber)) {
      detectedCardType.value = type
      return
    }
  }
  detectedCardType.value = ''
}

function getCardIcon() {
  const icons = {
    visa: 'fab fa-cc-visa',
    mastercard: 'fab fa-cc-mastercard',
    amex: 'fab fa-cc-amex',
    discover: 'fab fa-cc-discover',
    diners: 'fab fa-cc-diners-club',
    jcb: 'fab fa-cc-jcb'
  }
  return icons[detectedCardType.value] || 'fas fa-credit-card'
}



function validateCreditCardForm() {
  const isCardNumberValid = validateCardNumber()
  const isExpiryValid = validateExpiryDate()
  const isCVVValid = validateCVV()
  const isNameValid = validateCardholderName()
  
  return isCardNumberValid && isExpiryValid && isCVVValid && isNameValid
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
  const [datePart] = dateString.split(' ')
  const [month, day, year] = datePart.split('/')
  const date = new Date(year, month - 1, day)
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

function handlePaymentMethodChange() {
  // Clear any existing error messages
  errorMsg.value = '';
  
  // Clear credit card errors when switching payment methods
  if (form.value.payment === 'Credit Card') {
    cardErrors.value = {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    };
  }
}

async function confirmBooking() {
  // This function is for cash payments and credit card payments
  if (form.value.payment !== 'Cash on Visit' && form.value.payment !== 'Credit Card') {
    return;
  }

  // Set loading state for credit card payments
  if (form.value.payment === 'Credit Card') {
    isLoading.value = true;
  }

  // Validate credit card if payment method is Credit Card
  if (form.value.payment === 'Credit Card') {
    if (!validateCreditCardForm()) {
      errorMsg.value = 'Please fix the credit card errors before proceeding.';
      isLoading.value = false; // Reset loading state on validation error
      return;
    }
  }

  // Validate that a date is selected
  if (!form.value.date || availableDates.value.length === 0) {
    errorMsg.value = 'Please select an available date for booking.';
    isLoading.value = false;
    return;
  }
  
  // Validate that a time is selected
  if (!form.value.time || availableTimes.value.length === 0) {
    errorMsg.value = 'Please select an available time slot for booking.';
    isLoading.value = false;
    return;
  }

  // Validate required fields before creating booking data
  if (!technician.value.uid && !technician.value.id) {
    errorMsg.value = 'Technician information is missing. Please try again.';
    isLoading.value = false;
    return;
  }

  if (!auth.currentUser?.uid) {
    errorMsg.value = 'User authentication required. Please log in again.';
    isLoading.value = false;
    return;
  }

  if (!form.value.fullName || !form.value.email || !form.value.phone) {
    errorMsg.value = 'Please fill in all required fields (name, email, phone).';
    isLoading.value = false;
    return;
  }

  if (!form.value.date || !form.value.time) {
    errorMsg.value = 'Please select a date and time for your booking.';
    isLoading.value = false;
    return;
  }
          
  // Ensure all numeric values are valid numbers
  const basePrice = parseFloat((technician.value.visitPrice || technician.value.basePrice || '0').replace(/[^\d.]/g, '')) || 0;
  const adminAmount = Math.round(basePrice * 0.25 * 100) / 100; // Round to 2 decimal places
  const technicianAmount = Math.round(basePrice * 0.75 * 100) / 100; // Round to 2 decimal places

            // Construct detailed location information
            const fullAddress = constructAddress(form.value);
            const locationDetails = {
              street: form.value.street || '',
              building: form.value.building || '',
              area: form.value.area || '',
              city: form.value.city || '',
              fullAddress: fullAddress || 'Address not provided'
            };

            const bookingData = {
              technicianId: technician.value.uid || technician.value.id,
              technicianName: technician.value.name || 'Unknown Technician',
              userId: auth.currentUser.uid,
              userName: form.value.fullName.trim(),
              userEmail: form.value.email.trim(),
              userPhone: form.value.phone.trim(),
              date: form.value.date,
              time: form.value.time,
              address: fullAddress || 'Address not provided',
              locationDetails: locationDetails,
              price: technician.value.visitPrice || technician.value.basePrice || 'N/A',
              note: form.value.note || '',
              payment: form.value.payment,
              status: 'pending',
              createdAt: serverTimestamp(),
              // Payment splitting data - ensure all are numbers
              basePrice: basePrice,
              adminAmount: adminAmount,
              technicianAmount: technicianAmount,
              paymentSplit: {
                admin: adminAmount,
                technician: technicianAmount,
                total: basePrice
              }
            };

  // Debug: Log the booking data to check for any undefined values
  console.log('Booking data validation:');
  console.log('- technicianId:', bookingData.technicianId);
  console.log('- technicianName:', bookingData.technicianName);
  console.log('- userId:', bookingData.userId);
  console.log('- userName:', bookingData.userName);
  console.log('- userEmail:', bookingData.userEmail);
  console.log('- userPhone:', bookingData.userPhone);
  console.log('- date:', bookingData.date);
  console.log('- time:', bookingData.time);
  console.log('- address:', bookingData.address);
  console.log('- locationDetails:', bookingData.locationDetails);
  console.log('- basePrice:', bookingData.basePrice, 'type:', typeof bookingData.basePrice);
  console.log('- adminAmount:', bookingData.adminAmount, 'type:', typeof bookingData.adminAmount);
  console.log('- technicianAmount:', bookingData.technicianAmount, 'type:', typeof bookingData.technicianAmount);

  try {
    console.log('Creating booking with payment splitting:', bookingData);
    console.log('Payment split - Admin (25%):', adminAmount, 'EGP');
    console.log('Payment split - Technician (75%):', technicianAmount, 'EGP');

    // Save booking to Firestore
    const bookingRef = await addDoc(collection(db, 'bookings'), bookingData);
    console.log('Booking saved with ID:', bookingRef.id);
    
    // Update booking data with the Firestore ID
    bookingData.id = bookingRef.id;

    // Process payment splitting
    await processPaymentSplitting(bookingData);
    
    // Send confirmation email to customer
    if (form.value.email) {
      try {
        const { sendBookingConfirmationEmail } = await import('../utils/emailService.js')
        await sendBookingConfirmationEmail({
          userEmail: form.value.email,
          userName: form.value.fullName,
          technicianName: technician.value.name,
          date: form.value.date,
          time: form.value.time,
          payment: form.value.payment,
          bookingId: bookingData.id
        })
      } catch (e) {
        console.error('Error sending confirmation email:', e)
      }
    }
    
    // Send booking request notifications to technician and admin
    console.log('Sending booking request notifications...');
    await sendBookingRequestNotification(bookingData);
    // Notify user of accepted booking
    try {
      const userNotification = {
        type: 'booking_confirmed',
        title: 'Booking Confirmed',
        message: `Your booking with ${technician.value.name} on ${form.value.date} at ${form.value.time} has been accepted.`,
        bookingId: bookingData.id,
        recipientId: auth.currentUser.uid,
        recipientType: 'user',
        technicianId: bookingData.technicianId,
        technicianName: bookingData.technicianName,
        createdAt: serverTimestamp(),
        read: false
      }
      await addDoc(collection(db, 'notifications'), userNotification)
    } catch (e) {
      console.error('Error sending user confirmation notification:', e)
    }
    
    // Send booking request email to technician
    console.log('Sending booking request email...');
    await sendBookingRequestEmail(bookingData);
    
    // Store booking data for confirmation page
    const confirmationData = {
      technicianName: technician.value.name,
      date: form.value.date,
      time: form.value.time,
      payment: form.value.payment,
      adminAmount: adminAmount,
      technicianAmount: technicianAmount
    };
    localStorage.setItem('bookingData', JSON.stringify(confirmationData));
    
    console.log('Booking completed successfully with payment splitting');
    
    // Add delay for credit card payments before navigation
    if (form.value.payment === 'Credit Card') {
      // Wait for 2 seconds before navigating
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Reset loading state and navigate
    isLoading.value = false;
    router.push('/bookingconfirmation');
  } catch (e) {
    console.error('Booking Firestore error:', e);
    console.error('Error details:', {
      code: e.code,
      message: e.message,
      stack: e.stack
    });
    
    // Reset loading state on error
    isLoading.value = false;
    
    // Provide more specific error messages
    if (e.code === 'permission-denied') {
      errorMsg.value = 'Permission denied. Please check your authentication.';
    } else if (e.code === 'invalid-argument') {
      errorMsg.value = 'Invalid data provided. Please check your booking information.';
    } else if (e.code === 'unavailable') {
      errorMsg.value = 'Service temporarily unavailable. Please try again.';
    } else {
      errorMsg.value = `Booking creation failed: ${e.message}`;
    }
  }
}

// Process payment splitting between admin and technician
async function processPaymentSplitting(bookingData) {
  try {
    console.log('Processing payment splitting for booking:', bookingData.id);
    
    const { adminAmount, technicianAmount, basePrice } = bookingData;
    
    // Validate the data before processing
    if (!bookingData.id || !bookingData.technicianId || !bookingData.userName) {
      throw new Error('Missing required booking data for payment splitting');
    }
    
    if (typeof adminAmount !== 'number' || typeof technicianAmount !== 'number' || typeof basePrice !== 'number') {
      throw new Error('Invalid payment amounts for splitting');
    }
    
    // Add credits to admin
    const adminCreditData = {
      amount: adminAmount,
      credits: adminAmount,
      type: 'booking_payment',
      bookingId: bookingData.id,
      technicianId: bookingData.technicianId,
      technicianName: bookingData.technicianName || 'Unknown Technician',
      customerName: bookingData.userName,
      customerEmail: bookingData.userEmail,
      paymentMethod: bookingData.payment,
      status: 'approved',
      createdAt: serverTimestamp(),
      description: `25% of booking payment (${basePrice} EGP) from ${bookingData.userName}`
    };
    
    console.log('Creating admin credit record:', adminCreditData);
    await addDoc(collection(db, 'adminCredits'), adminCreditData);
    console.log('Admin credits added:', adminAmount, 'EGP');
    
    // Add credits to technician
    const technicianCreditData = {
      technicianId: bookingData.technicianId,
      technicianName: bookingData.technicianName || 'Unknown Technician',
      amount: technicianAmount,
      credits: technicianAmount,
      type: 'booking_payment',
      bookingId: bookingData.id,
      customerName: bookingData.userName,
      customerEmail: bookingData.userEmail,
      paymentMethod: bookingData.payment,
      status: 'approved',
      createdAt: serverTimestamp(),
      description: `75% of booking payment (${basePrice} EGP) from ${bookingData.userName}`
    };
    
    console.log('Creating technician credit record:', technicianCreditData);
    await addDoc(collection(db, 'technicianCredits'), technicianCreditData);
    console.log('Technician credits added:', technicianAmount, 'EGP');
    
    // Create payment split record
    const paymentSplitData = {
      bookingId: bookingData.id,
      technicianId: bookingData.technicianId,
      technicianName: bookingData.technicianName || 'Unknown Technician',
      customerName: bookingData.userName,
      customerEmail: bookingData.userEmail,
      totalAmount: basePrice,
      adminAmount: adminAmount,
      technicianAmount: technicianAmount,
      paymentMethod: bookingData.payment,
      status: 'completed',
      createdAt: serverTimestamp(),
      description: `Payment split for booking ${bookingData.id}`
    };
    
    console.log('Creating payment split record:', paymentSplitData);
    await addDoc(collection(db, 'paymentSplits'), paymentSplitData);
    console.log('Payment split record created');
    
    // Send admin notification about payment received
    await sendAdminPaymentNotification(bookingData);
    
    console.log('Payment splitting completed successfully');
    return true;
    
    } catch (error) {
    console.error('Error processing payment splitting:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
}

// Send admin notification about payment received
async function sendAdminPaymentNotification(bookingData) {
  try {
    console.log('Sending admin payment notification...');
    
    const { adminAmount, technicianAmount, basePrice } = bookingData;
    
    const adminNotification = {
      type: 'payment_received',
      title: 'Payment Received from Booking',
      message: `Payment of ${basePrice} EGP received from ${bookingData.userName}. Admin share: ${adminAmount} EGP, Technician share: ${technicianAmount} EGP`,
      bookingId: bookingData.id,
      technicianId: bookingData.technicianId,
      technicianName: bookingData.technicianName,
      customerName: bookingData.userName,
      customerEmail: bookingData.userEmail,
      paymentMethod: bookingData.payment,
      totalAmount: basePrice,
      adminAmount: adminAmount,
      technicianAmount: technicianAmount,
      recipientId: 'admin',
      recipientType: 'admin',
      status: 'unread',
      createdAt: serverTimestamp(),
      read: false
    };
    
    await addDoc(collection(db, 'notifications'), adminNotification);
    console.log('Admin payment notification sent successfully');
    
  } catch (error) {
    console.error('Error sending admin payment notification:', error);
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
      message: `${bookingData.userName} has requested a booking from ${bookingData.date} at ${bookingData.time}. Payment method: ${bookingData.payment}. Please log in to your dashboard to accept or reject this booking.`
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
        message: `${bookingData.userName} has requested a booking from ${bookingData.date} at ${bookingData.time}. Payment method: ${bookingData.payment}. Please log in to your dashboard to accept or reject this booking.`
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
    console.log('=== SENDING BOOKING REQUEST EMAIL TO TECHNICIAN ===');
    console.log('Booking data for email:', bookingData);
    
    // Get technician's email from their profile
    const technicianDoc = await getDoc(doc(db, 'technicians', bookingData.technicianId));
    if (!technicianDoc.exists()) {
      console.error('❌ Technician not found');
      return false;
    }
    
    const technicianData = technicianDoc.data();
    const technicianEmail = technicianData.email;
    
    if (!technicianEmail) {
      console.error('❌ Technician email not found');
      return false;
    }
    
    console.log('Technician email found:', technicianEmail);
    console.log('Technician data:', technicianData);
    console.log('Location details being sent:', bookingData.locationDetails);
    
    // Import and use the email service function
    const { sendBookingRequestEmail: sendEmail } = await import('../utils/emailService.js');
    
    // Send email using the email service
    const response = await sendEmail(bookingData, technicianData);
    
    console.log('✅ Booking request email sent successfully:', response);
    return true;
    
  } catch (error) {
    console.error('❌ Error sending booking request email:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      status: error.status,
      text: error.text
    });
    return false;
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

onMounted(async () => {
  const id = route.query.techId || route.query.technicianId
  if (!id) {
    errorMsg.value = 'Technician ID is missing. Please try again or contact support.';
    return;
  }
  
  // No stock technicians - only show registered technicians
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
      profilePhotoUrl: techData.profilePhotoUrl || techData.image || techData.idPhotoUrl || '/images/Avatar.png' // Map to profilePhotoUrl for template consistency
    };
    console.log('Technician data loaded:', technician.value);
    console.log('Technician profile photo:', technician.value.profilePhotoUrl);
  } else {
    errorMsg.value = 'Technician not found. Please try again or contact support.';
    return;
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
  
  populateFormWithUserData(); // Call the new function here
  
  // Initialize available cities for default governorate
  updateCities();
})

// Cleanup function to prevent memory leaks
onUnmounted(() => {
  errorMsg.value = '';
})

// Watch for technician data changes
watch(() => technician.value, (newTechnician) => {
  // Check if times are available
  if (availableTimes.value.length === 0) {
    console.log('No available times for booking');
    return;
  }
})
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
  flex-direction: row;
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

.payment-icon {
  margin-left: 0.5rem;
  color: #6b7280;
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

/* Credit Card Container */
.credit-card-container {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1rem;
}

.credit-card-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-number-group {
  position: relative;
}

.card-type-indicator {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 1.2rem;
}

.card-input {
  padding-right: 2.5rem;
}

/* Dropdown Icons */
       .form-input[type="select"],
       select.form-input {
         appearance: none;
         -webkit-appearance: none;
         -moz-appearance: none;
         background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
         background-position: right 5px center;
         background-repeat: no-repeat;
         background-size: 20px 16px;
         padding-right: 3rem;
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

.confirm-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  opacity: 0.7;
}

.confirm-btn.loading {
  cursor: wait;
  opacity: 0.8;
}

/* Loading cursor for the entire page during booking */
.booking-page.loading {
  cursor: wait;
}

.booking-page.loading * {
  cursor: wait !important;
}

/* Error styling */
.error {
  border-color: #dc2626 !important;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.field-error {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

/* Dark Mode Styles */
.dark .booking-page {
   background: var(--primary-bg, #181824);
  color: var(--primary-text, #e5e7eb);
}


.dark .header {
  background: transparent;
}

.dark .page-title {
  color: var(--primary, #a89af7);
}

.dark .booking-card {
  background: #2D2E30;
  color: var(--primary-text, #e5e7eb);
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.dark .error-message {
  background: #2d2323;
  color: #f87171;
  border-color: #f87171;
}

.dark .field-error {
  color: #f87171;
}

.dark .progress-indicator {
  background: transparent;
}

.dark .step-circle {
  background: var(--border-color, #35355a);
  color: var(--primary-text, #e5e7eb);
}

.dark .progress-step.active .step-circle {
  background: var(--primary, #a89af7);
  color: #181824;
}

.dark .step-text {
  color: var(--text-muted, #b3b3c6);
}

.dark .progress-step.active .step-text {
  color: var(--primary, #a89af7);
}

.dark .progress-line {
  background: var(--border-color, #35355a);
}

.dark .technician-section {
  background: #484B4D;
  color: var(--primary-text, #e5e7eb);
}

.dark .technician-photo {
  border-color: var(--primary, #a89af7);
}

.dark .technician-details h3 {
  color: var(--primary-text, #e5e7eb);
}

.dark .technician-role {
  color: var(--text-muted, #b3b3c6);
}

.dark .available-appointments {
  background: transparent;
}

.dark .appointment-title {
  color: var(--primary-text, #e5e7eb);
}

.dark .date-slot {
  background: var(--secondary-bg, #23233a);
  color: var(--primary-text, #e5e7eb);
  border-color: var(--border-color, #7B6FA8);
}

.dark .day-name {
  color: #aaaaaa
  
}

.dark .date-number {
  color: var(--primary, #a89af7);
}

.dark .time-slot {
  color: var(--text-muted, #b3b3c6);
}

.dark .form-section {
    background: #484B4D;

  color: var(--primary-text, #e5e7eb);
}

.dark .section-title {
  color: var(--primary-text, #e5e7eb);
}

.dark .form-group label {
  color: #aaaaaa;
}

.dark .form-input {
  background:#484B4D;
  color: #aaaaaa;
  border-color: #e0e0e0;
}

.dark .form-input:focus {
  border-color: var(--primary, #a89af7);
  box-shadow: 0 0 0 3px rgba(168, 154, 247, 0.1);
}

.dark .form-input.textarea {
 background: #484B4D;
  color: var(--primary-text, #e5e7eb);
}

       .dark .form-input[type="select"],
       .dark select.form-input {
         appearance: none;
         -webkit-appearance: none;
         -moz-appearance: none;
         background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23aaaaaa' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
         background-position: right 5px center;
         background-repeat: no-repeat;
         background-size: 20px 16px;
         padding-right: 3rem;
       }

.dark .payment-methods {
  background: transparent;
}

.dark .payment-option {
  background: var(--secondary-bg, #23233a);
  color: var(--primary-text, #e5e7eb);
  border-color: var(--border-color, #35355a);
}

.dark .payment-option:hover {
  border-color: var(--primary, #a89af7);
}

.dark .payment-text {
  color: var(--primary-text, #e5e7eb);
}

.dark .payment-icon {
  color: var(--primary, #a89af7);
}

.dark .payment-summary {
  background: var(--secondary-bg, #23233a);
  border-color: var(--border-color, #35355a);
  color: var(--primary-text, #e5e7eb);
}

.dark .amount {
  color: var(--primary, #a89af7);
}

.dark .payment-note {
  color: var(--text-muted, #b3b3c6);
}

.dark .credit-card-container {
  background: var(--secondary-bg, #23233a);
  border-color: var(--border-color, #35355a);
  color: var(--primary-text, #e5e7eb);
}

.dark .card-type-indicator {
  color: var(--primary, #a89af7);
}

.dark .confirm-btn {
  background: var(--primary, #a89af7);
  color: var(--primary-text, #181824);
}

.dark .confirm-btn:hover {
  background: #7c6bb1;
  color: #fff;
}

.dark .confirm-btn:disabled {
  background: #4b5563;
  color: #9ca3af;
}

.dark .confirm-btn.loading {
  opacity: 0.8;
}

/* Dark mode for map itself */
.dark .map-container iframe,
.dark .map-container .leaflet-container,
.dark .map-container .gm-style {
  background: #484B4D;
  color:#484B4D;
  border-color: #35355a !important;
}

</style>
<style scoped>
/* Inline form field errors: simple red text under inputs */
.form-group .error-message,
.form-group .field-error {
  display: block;
  text-align: start;
  font-size: 0.8rem;
  line-height: 1.2;
  color: #ef4444; /* red-500 */
  background: transparent;
  border: none;
  padding: 0;
}

/* Dark mode inline error text color */
.dark .form-group .error-message,
.dark .form-group .field-error {
  color: #f87171; /* red-400 */
}

/* Responsive adjustments */

/* Tablets */
@media (max-width: 1024px) {
  .booking-card {
    padding: 1rem 1.25rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .date-slots {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
  }
}

/* Mobile */
@media (max-width: 767px) {
  .header {
    text-align: center;
  }
  .page-title {
    font-size: 1.25rem;
  }

  .progress-indicator {
    display: flex;
    flex-direction: row; /* keep horizontal layout */
    justify-content: center;
    align-items: center;
    gap: 0.5rem; /* tighter spacing on mobile */
  }
  .progress-line {
    display: block; /* keep the connector visible */
    width: 36px;    /* shorter connector on mobile */
    height: 2px;
    margin-top: 14px;
  }
  .progress-step .step-circle {
    width: 28px;
    height: 28px;
    font-size: 0.875rem;
  }
  .progress-step .step-text {
    font-size: 0.7rem;
  }

  .technician-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .technician-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .available-appointments .date-navigation {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .date-slots {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .date-slot {
    min-width: 90px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .form-group {
    width: 100%;
  }

  .payment-methods {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .confirm-btn {
    width: 100%;
  }

  .map-container,
  .map-container iframe {
    width: 100% !important;
    height: 240px !important;
  }
}

/* Small phones */
@media (max-width: 480px) {
  .page-title {
    font-size: 1.1rem;
  }
  .technician-photo {
    width: 56px;
    height: 56px;
  }
  .date-slots {
    flex-direction: column;
  }
}
</style>