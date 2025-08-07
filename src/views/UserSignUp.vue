<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ensureUserRole, fetchUserRole } from '../utils/userRole';
import { sendWelcomeEmail } from '../utils/emailService';
import { useI18n } from 'vue-i18n';
import { computed, watch, reactive, onMounted } from 'vue';
import emailjs from '@emailjs/browser';
import { getGovernmentNames, getDistrictsForGovernment, governmentNamesAr, districtsAr } from '../data/egyptianLocations';

const formData = reactive({
  fullName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  specialization: '',
  experience: '',
  bio: '',
  basePrice: '',
  government: '',
  district: '',
  willingToTravel: '',
  confirmInfo: false,
  agreeTerms: false,
  idPhotoBase64: null, // New field to store Base64 string
  profilePhotoBase64: null, // New field to store profile picture Base64 string
  paypalEmail: '' // New field for PayPal email
});
const { t, locale } = useI18n();
const email = ref('');
const password = ref('');
const confirmPass = ref('');
const firstName = ref('');
const lastName = ref('');
const gender = ref('');
const age = ref('');
const address = ref('');
const area = ref('');
const city = ref('');
const phone = ref('');
const error = ref('');
const errors = ref({});
const showTermsModal = ref(false);
const router = useRouter();
const cityOptions = computed(() => {
  if (!selectedDistrict.value) return [];
  return getCitiesForDistrict(selectedDistrict.value);
});
const governmentOptions = getGovernmentNames();
const districtOptions = computed(() => {
  return formData.government ? getDistrictsForGovernment(formData.government) : [];
});
watch(() => formData.government, () => { formData.district = ''; })

// Validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8;
};

const validateAge = (age) => {
  const ageNum = parseInt(age);
  return ageNum >= 18 && ageNum <= 120;
};

const validateRequired = (value, fieldName) => {
  // Handle different data types
  if (value === null || value === undefined) {
    return false;
  }
  
  // For strings, check if trimmed length is greater than 0
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  
  // For numbers, check if it's not 0 and not NaN
  if (typeof value === 'number') {
    return value !== 0 && !isNaN(value);
  }
  
  // For other types, check if the value exists
  return Boolean(value);
};

const validateName = (name) => {
  return name.length >= 2 && /^[a-zA-Z\s]+$/.test(name);
};

// Main validation function
const validateForm = () => {
  errors.value = {};

  // First Name validation
  if (!validateRequired(firstName.value, 'firstName')) {
    errors.value.firstName = 'First name is required';
  } else if (!validateName(firstName.value)) {
    errors.value.firstName = 'First name must be at least 2 characters and contain only letters';
  }

  // Last Name validation
  if (!validateRequired(lastName.value, 'lastName')) {
    errors.value.lastName = 'Last name is required';
  } else if (!validateName(lastName.value)) {
    errors.value.lastName = 'Last name must be at least 2 characters and contain only letters';
  }

  // Email validation
  if (!validateRequired(email.value, 'email')) {
    errors.value.email = 'Email is required';
  } else if (!validateEmail(email.value)) {
    errors.value.email = 'Please enter a valid email address';
  }

  // Password validation
  if (!validateRequired(password.value, 'password')) {
    errors.value.password = 'Password is required';
  } else if (!validatePassword(password.value)) {
    errors.value.password = 'Password must be at least 8 characters long';
  }

  // Confirm Password validation
  if (!validateRequired(confirmPass.value, 'confirmPass')) {
    errors.value.confirmPass = 'Please confirm your password';
  } else if (password.value !== confirmPass.value) {
    errors.value.confirmPass = 'Passwords do not match';
  }

  // Gender validation
  if (!validateRequired(gender.value, 'gender')) {
    errors.value.gender = 'Please select your gender';
  }

  // Age validation
  if (!validateRequired(age.value, 'age')) {
    errors.value.age = 'Age is required';
  } else if (!validateAge(age.value)) {
    errors.value.age = 'Age must be between 18 and 120';
  }

  // Address validation
  if (!validateRequired(address.value, 'address')) {
    errors.value.address = 'Address is required';
  }

  // Area validation
  if (!validateRequired(area.value, 'area')) {
    errors.value.area = 'Area is required';
  }

  // City validation
  if (!validateRequired(city.value, 'city')) {
    errors.value.city = 'City is required';
  }

  // Phone validation
  if (!validateRequired(phone.value, 'phone')) {
    errors.value.phone = 'Phone number is required';
  }

  return Object.keys(errors.value).length === 0;
};



const handleRegister = async () => {
  error.value = '';
  
  // Validate form
  if (!validateForm()) {
    return;
  }

  try {
    // Create user account with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    
    // Create user document in Firestore
    const userDoc = {
      fullName: `${firstName.value} ${lastName.value}`,
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      gender: gender.value,
      age: parseInt(age.value),
      address: getDistrictsForGovernment(formData.government)[formData.district] || '',
      area: getDistrictsForGovernment(formData.government)[formData.district] || '',
      city: getGovernmentNames()[formData.government] || '',
      phone: phone.value,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);
    
    // Enforce persistent admin role for elie1400674@gmail.com
    await ensureUserRole(userCredential.user);
    await fetchUserRole(userCredential.user);
    
    // Send welcome email using EmailJS
    try {
      await sendWelcomeEmail(email.value, firstName.value, lastName.value);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the registration if email fails
    }
    
    router.push('/'); // Redirect to home page after registration
  } catch (err) {
    console.error('Registration error:', err);
    error.value = err.message;
  }
};

const openTermsModal = () => {
  showTermsModal.value = true;
};

const closeTermsModal = () => {
  showTermsModal.value = false;
};




</script>

<template>

<body>
    
<div class="signup-container">
<form class="signup-form" @submit.prevent="handleRegister">
    <div class="form-header">
      <img class="logo" src="../assets/logo-secondary.png" alt="BoltFix Logo">
      <h1 class="title">{{ $t('signUp') }}</h1>
      <p class="subtitle">{{ $t('createAccount') }}</p>
    </div>
    
    <div class="form-grid">
    <!-- first name -->
      <div class="form-group">
        <label for="firstName" class="form-label">{{ $t('firstName') }}</label>
        <input 
          type="text" 
          id="firstName" 
          v-model="firstName" 
          class="form-input" 
          :class="{ 'error': errors.firstName }"
          :placeholder="$t('firstName')" 
          required 
        />
        <p v-if="errors.firstName" class="error-message">{{ errors.firstName }}</p>
  </div>

  <!-- last name -->
      <div class="form-group">
        <label for="lastName" class="form-label">{{ $t('lastName') }}</label>
        <input 
          type="text" 
          id="lastName" 
          v-model="lastName" 
          class="form-input" 
          :class="{ 'error': errors.lastName }"
          :placeholder="$t('lastName')" 
          required 
        />
        <p v-if="errors.lastName" class="error-message">{{ errors.lastName }}</p>
      </div>

      <!-- email -->
      <div class="form-group">
        <label for="email" class="form-label">{{ $t('email') }}</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          class="form-input" 
          :class="{ 'error': errors.email }"
          :placeholder="$t('email')" 
          required 
        />
        <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
      </div>

      <!-- phone -->
      <div class="form-group">
        <label for="phone" class="form-label">{{ $t('phone') }}</label>
        <input 
          type="text" 
          id="phone" 
          v-model="phone" 
          class="form-input" 
          :class="{ 'error': errors.phone }"
          :placeholder="$t('phone')" 
          required 
        />
        <p v-if="errors.phone" class="error-message">{{ errors.phone }}</p>
      </div>

      <!-- gender -->
      <div class="form-group">
        <label for="gender" class="form-label">{{ $t('gender') }}</label>
        <select 
          id="gender" 
          v-model="gender" 
          class="form-input" 
          :class="{ 'error': errors.gender }"
          required
        >
          <option value="">{{ $t('selectGender') }}</option>
          <option value="male">{{ $t('male') }}</option>
          <option value="female">{{ $t('female') }}</option>
          <option value="other">{{ $t('other') }}</option>
        </select>
        <p v-if="errors.gender" class="error-message">{{ errors.gender }}</p>
      </div>

      <!-- age -->
      <div class="form-group">
        <label for="age" class="form-label">{{ $t('age') }}</label>
        <input 
          type="number" 
          id="age" 
          v-model="age" 
          min="18" 
          max="120"
          class="form-input" 
          :class="{ 'error': errors.age }"
          :placeholder="$t('age')" 
          required 
        />
        <p v-if="errors.age" class="error-message">{{ errors.age }}</p>
  </div>

      <!-- Governorate & District (Location) -->
      <div class="form-group">
        <label for="government" class="form-label">{{ $t('government') }}</label>
        <select 
          id="government" 
          v-model="formData.government" 
          class="form-input" 
          required
        >
          <option value="" disabled selected>{{ $t('government') }}</option>
          <option v-for="gov in governmentOptions" :key="gov" :value="gov">
            {{ locale === 'ar' ? governmentNamesAr[gov] : gov }}
          </option>
        </select>
      </div>
      <div class="form-section location-section full-width">
  <div class="form-row">
    <div class="form-group">
      <label for="district" class="form-label">{{ $t('districtArea') }}</label>
      <select 
        id="district" 
        v-model="formData.district" 
        class="form-input" 
        required
        :disabled="!formData.government"
      >
        <option value="" disabled selected>{{ $t('districtArea') }}</option>
        <option v-for="district in districtOptions" :key="district" :value="district">
          {{ locale === 'ar' ? (districtsAr[formData.government]?.[district] || district) : district }}
        </option>
      </select>
    </div>
  </div>
</div>

      <!-- password -->
      <div class="form-group">
        <label for="password" class="form-label">{{ $t('password') }}</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          class="form-input" 
          :class="{ 'error': errors.password }"
          :placeholder="$t('password')" 
          required 
        />
        <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
  </div>

      <!-- confirm password -->
      <div class="form-group">
        <label for="confirmPass" class="form-label">{{ $t('confirmPassword') }}</label>
        <input 
          type="password" 
          id="confirmPass" 
          v-model="confirmPass" 
          class="form-input" 
          :class="{ 'error': errors.confirmPass }"
          :placeholder="$t('confirmPassword')" 
          required 
        />
        <p v-if="errors.confirmPass" class="error-message">{{ errors.confirmPass }}</p>
      </div>
  </div>

    <div class="form-footer">
      <div class="checkbox-group">
            <input v-model="formData.agreeTerms" type="checkbox" class="form-checkbox" id="agreeTerms" required />
            <label class="checkbox-label" for="agreeTerms">
              {{ $t('agreeTermsAndConditions') }}
              <span class="terms-link" @click="openTermsModal">{{ $t('termsAndConditions') }}</span> 
              {{ $t('andPrivacyPolicy') }}
            </label>
          </div>

             <button type="submit" class="submit-btn">
         <span>{{ $t('register') }}</span>
         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="arrow-icon" viewBox="0 0 16 16">
   <path fill-rule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0z"/>
         </svg>
       </button>

       

       

      

      <p v-if="error" class="error-text">{{ error }}</p>
      <p class="login-link">{{ $t('haveAccount') }} <a href="/userlogin">{{ $t('signIn') }}</a></p>
    </div>

</form>
</div>

<!-- Terms and Conditions Modal -->
    <div v-if="showTermsModal" class="modal-overlay" @click="closeTermsModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">{{ $t('terms.title') }}</h2>
          <button class="modal-close" @click="closeTermsModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="terms-content">
            <h3>{{ $t('terms.generalTerms') }}</h3>
            <h4>{{ $t('terms.definitions') }}</h4>
            <ul>
              <li>{{ $t('terms.platform') }}</li>
              <li>{{ $t('terms.user') }}</li>
              <li>{{ $t('terms.technician') }}</li>
              <li>{{ $t('terms.booking') }}</li>
            </ul>
            <h4>{{ $t('terms.accountCreation') }}</h4>
            <ul>
              <li>{{ $t('terms.accountCreation1') }}</li>
              <li>{{ $t('terms.accountCreation2') }}</li>
              <li>{{ $t('terms.accountCreation3') }}</li>
            </ul>
            <h4>{{ $t('terms.privacy') }}</h4>
            <ul>
              <li>{{ $t('terms.privacy1') }}</li>
              <li>{{ $t('terms.privacy2') }}</li>
            </ul>
            <h4>{{ $t('terms.prohibitedConduct') }}</h4>
            <ul>
              <li>{{ $t('terms.prohibited1') }}</li>
              <li>{{ $t('terms.prohibited2') }}</li>
              <li>{{ $t('terms.prohibited3') }}</li>
            </ul>
            <h4>{{ $t('terms.accountTermination') }}</h4>
            <ul>
              <li>{{ $t('terms.accountTermination1') }}</li>
            </ul>
            <h3>{{ $t('terms.userTerms') }}</h3>
            <h4>{{ $t('terms.bookingService') }}</h4>
            <ul>
              <li>{{ $t('terms.bookingService1') }}</li>
              <li>{{ $t('terms.bookingService2') }}</li>
            </ul>
            <h4>{{ $t('terms.payment') }}</h4>
            <ul>
              <li>{{ $t('terms.payment1') }}</li>
              <li>{{ $t('terms.payment2') }}</li>
            </ul>
            <h4>{{ $t('terms.cancellationRefunds') }}</h4>
            <ul>
              <li>{{ $t('terms.cancellation1') }}</li>
              <li>{{ $t('terms.cancellation2') }}</li>
              <li>{{ $t('terms.cancellation3') }}</li>
            </ul>
            <h4>{{ $t('terms.ratingsFeedback') }}</h4>
            <ul>
              <li>{{ $t('terms.ratings1') }}</li>
              <li>{{ $t('terms.ratings2') }}</li>
            </ul>
            <h3>{{ $t('terms.technicianTerms') }}</h3>
            <h4>{{ $t('terms.commissionPolicy') }}</h4>
            <ul>
              <li>{{ $t('terms.commission1') }}</li>
              <li>{{ $t('terms.commission2') }}</li>
            </ul>
            <h4>{{ $t('terms.paymentMethods') }}</h4>
            <ul>
              <li>{{ $t('terms.paymentMethods1') }}</li>
              <li>{{ $t('terms.paymentMethods2') }}</li>
            </ul>
            <h4>{{ $t('terms.earningsTransfer') }}</h4>
            <ul>
              <li>{{ $t('terms.earnings1') }}</li>
              <li>{{ $t('terms.earnings2') }}</li>
            </ul>
            <h4>{{ $t('terms.serviceExpectations') }}</h4>
            <ul>
              <li>{{ $t('terms.serviceExpectations1') }}</li>
              <li>{{ $t('terms.serviceExpectations2') }}</li>
            </ul>
            <h4>{{ $t('terms.responsibility') }}</h4>
            <ul>
              <li>{{ $t('terms.responsibility1') }}</li>
              <li>{{ $t('terms.responsibility2') }}</li>
            </ul>
            <p class="terms-footer">
              {{ $t('terms.footer') }}
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn" @click="closeTermsModal">{{ $t('terms.iUnderstand') }}</button>
        </div>
      </div>
    </div>

</body>

</template>

<style scoped>
body {
    background: #D3CFE2;
    min-height: 100vh;
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.dark body {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.signup-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    box-sizing: border-box;
}

.signup-form {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    padding: 3rem;
    width: 100%;
    max-width: 800px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.dark .signup-form {
  background: var(--secondary-bg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.form-header {
    text-align: center;
    margin-bottom: 2.5rem;
}

.logo {
    width: 120px;
    height: auto;
    margin-bottom: 1.5rem;
    display: inline;
}

.title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #625397;
    margin: 0 0 0.5rem 0;
    letter-spacing: -0.02em;
}

.dark .title {
  color: var(--primary-color);
}

.subtitle {
    font-size: 1.1rem;
    color: #6b7280;
    margin: 0;
    font-weight: 400;
}

.dark .subtitle {
  color: #9ca3af;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
 }

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group.full-width {
    grid-column: 1 / -1;
}

.form-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
    display: block;
}

.dark .form-label {
  color: #d1d5db;
}

.form-input {
    padding: 0.875rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.2s ease;
    background: var(--input-bg, #ffffff);
    color:  #1f2937;
    font-family: inherit;
}

.dark .form-input {
  background: var(--input-bg, #374151);
  border-color: #4b5563;
  color: var(--text-muted);
}

.form-input:focus {
    outline: none;
    border-color: #625397;
    box-shadow: 0 0 0 3px rgba(98, 83, 151, 0.1);
}

.dark .form-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(98, 83, 151, 0.2);
}

.form-input::placeholder {
    color: var(--text-muted, #9ca3af);
}

.dark .form-input::placeholder {
  color: var(--text-muted, #6b7280);
}

/* Style for select dropdowns to match placeholder color */
.form-input option {
    color: var(--text-muted, #9ca3af);
}

.dark .form-input option {
  color: var(--text-muted, #6b7280);
}

/* Style for select dropdown placeholder text */
.form-input:invalid {
    color: var(--text-muted, #9ca3af);
}

.dark .form-input:invalid {
  color: var(--text-muted, #6b7280);
}

.form-input.error {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.dark .form-input.error {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

.error-message {
    color: #ef4444;
    font-size: 0.75rem;
    margin-top: 0.25rem;
    font-weight: 500;
}

.form-footer {
    text-align: center;
}

.checkbox-group {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
}

.form-checkbox {
    width: 1.25rem;
    height: 1.25rem;
    accent-color: #625397;
}

.checkbox-label {
    font-size: 0.875rem;
    color: #6b7280;
    cursor: pointer;
    user-select: none;
}

.dark .checkbox-label {
  color: #9ca3af;
}

.terms-link {
    color: #625397;
    text-decoration: underline;
    cursor: pointer;
    font-weight: 600;
    transition: color 0.2s ease;
}

.dark .terms-link {
  color: var(--primary-color);
}

.terms-link:hover {
    color: #7c3aed;
}

.submit-btn {
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 1rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    width: 100%;
    max-width: 300px;
    justify-content: center;
}

.dark .submit-btn {
  background: var(--primary-color);
}

.submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(98, 83, 151, 0.3);
}

.submit-btn:active {
    transform: translateY(0);
}

.arrow-icon {
    transition: transform 0.2s ease;
}

.submit-btn:hover .arrow-icon {
    transform: translateX(4px);
}




.error-text {
    color: #ef4444;
    font-size: 0.875rem;
    margin: 0.5rem 0;
    font-weight: 500;
}

.login-link {
    color: #6b7280;
    font-size: 0.875rem;
    margin: 0;
}

.dark .login-link {
  color: #9ca3af;
}

.login-link a {
    color: #625397;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s ease;
 }

.dark .login-link a {
  color: var(--primary-color);
 }

.login-link a:hover {
    color: #7c3aed;
    text-decoration: underline;
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
}

.modal-content {
    background: white;
    border-radius: 16px;
    max-width: 800px;
    width: 100%;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.dark .modal-content {
  background: #1f2937;
  color: #f9fafb;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
}

.dark .modal-header {
  background: #374151;
  border-bottom-color: #4b5563;
}

.modal-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
}

.dark .modal-title {
  color: #f9fafb;
}

.modal-close {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    color: #6b7280;
    transition: all 0.2s ease;
}

.modal-close:hover {
    background: #e5e7eb;
    color: #374151;
}

.dark .modal-close:hover {
  background: #4b5563;
  color: #f9fafb;
}

.modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 2rem;
}

.terms-content {
    line-height: 1.6;
}

.terms-content h3 {
    color: #625397;
    font-size: 1.25rem;
    font-weight: 700;
    margin: 2rem 0 1rem 0;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 0.5rem;
}

.dark .terms-content h3 {
  color: var(--primary-color);
  border-bottom-color: #4b5563;
}

.terms-content h4 {
    color: #374151;
    font-size: 1.1rem;
    font-weight: 600;
    margin: 1.5rem 0 0.75rem 0;
}

.dark .terms-content h4 {
  color: #d1d5db;
}

.terms-content ul {
    margin: 0.75rem 0;
    padding-left: 1.5rem;
}

.terms-content li {
    margin-bottom: 0.5rem;
    color: #4b5563;
}

.dark .terms-content li {
  color: #9ca3af;
}

.terms-content strong {
    color: #1f2937;
    font-weight: 600;
}

.dark .terms-content strong {
  color: #f9fafb;
}

.terms-footer {
    margin-top: 2rem;
    padding: 1rem;
    background: #f3f4f6;
    border-radius: 8px;
    font-weight: 600;
    color: #374151;
    text-align: center;
}

.dark .terms-footer {
  background: #374151;
  color: #f9fafb;
}

.modal-footer {
    padding: 1.5rem 2rem;
    border-top: 1px solid #e5e7eb;
    background: #f9fafb;
    text-align: center;
}

.dark .modal-footer {
  background: #374151;
  border-top-color: #4b5563;
}

.modal-btn {
    background: #625397;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.75rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.dark .modal-btn {
  background: var(--primary-color);
}

.modal-btn:hover {
    background: #7c3aed;
    transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 768px) {
    .signup-container {
        padding: 1rem;
    }
    
    .signup-form {
        padding: 2rem;
        border-radius: 16px;
    }
    
    .title {
        font-size: 2rem;
    }
    
    .form-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .submit-btn {
        padding: 0.875rem 1.5rem;
        font-size: 0.875rem;
    }

    .modal-content {
        margin: 1rem;
        max-height: 95vh;
    }

    .modal-header,
    .modal-body,
    .modal-footer {
        padding: 1rem;
    }
}

@media (max-width: 480px) {
    .signup-form {
        padding: 1.5rem;
    }
    
    .title {
        font-size: 1.75rem;
    }
    
    .logo {
        width: 100px;
    }

    .modal-content {
        margin: 0.5rem;
    }
 }
</style>