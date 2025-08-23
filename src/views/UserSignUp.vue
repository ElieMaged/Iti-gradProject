<template>
  <div>
    <!-- Loading state while auth is initializing -->
    <div v-if="authLoading" class="loading-container">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>
    </div>
    
    <!-- Main content when auth is ready -->
    <div v-else>
    <!-- Test: Simple element to confirm template is rendering -->
    <div style="position: fixed; top: 20px; right: 20px; background: orange; color: black; z-index: 10000; padding: 10px; font-weight: bold;">
      USERSIGNUP TEMPLATE RENDERING
    </div>
    
    <!-- Debug: UserSignUp component template rendering -->
    <div style="position: fixed; top: 0; right: 0; background: blue; color: white; z-index: 9999; padding: 10px;">
      UserSignUp Component Loaded - Route: {{ $route.path }}
    </div>
    
    <div class="signup-container">
      <form class="signup-form" @submit.prevent="handleRegister">
        <div class="form-header">
          <img class="logo" src="/logo/ace04d3b268cf810c91d002fdf7454a6ef778f27.png" alt="BoltFix Logo">
          <h1 class="title">{{ $t('userRegistration') }}</h1>
          <p class="subtitle">{{ $t('createAccount') }}</p>
        </div>
        
        <div class="form-grid">
          <!-- Personal Information -->
          <div class="form-section">
            <h3 class="section-title">{{ $t('personalInformation') }}</h3>
            
            <div class="form-group">
              <label for="firstName" class="form-label">{{ $t('firstName') }}</label>
              <input 
                type="text" 
                id="firstName" 
                v-model="formData.firstName" 
                class="form-input" 
                :placeholder="$t('firstName')" 
                required 
              />
            </div>

            <div class="form-group">
              <label for="lastName" class="form-label">{{ $t('lastName') }}</label>
              <input 
                type="text" 
                id="lastName" 
                v-model="formData.lastName" 
                class="form-input" 
                :placeholder="$t('lastName')" 
                required 
              />
            </div>

            <div class="form-group">
              <label for="email" class="form-label">{{ $t('emailAddress') }}</label>
              <input 
                type="email" 
                id="email" 
                v-model="formData.email" 
                class="form-input" 
                autocomplete="email"
                inputmode="email"
                autocapitalize="none"
                spellcheck="false"
                pattern="^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
                :title="$t('enterValidEmail') || 'Enter a valid email address (e.g., name@example.com)'"
                :placeholder="$t('emailAddress')" 
                required 
              />
            </div>

            <div class="form-group">
              <label for="phone" class="form-label">{{ $t('phoneNumber') }}</label>
              <input 
                type="tel" 
                id="phone" 
                v-model="formData.phone" 
                @input="validatePhoneNumber"
                :class="['form-input', { 'error': phoneError }]"
                :placeholder="$t('phoneNumber')" 
                inputmode="tel"
                pattern="^(01[0125][0-9]{8}|(?:\\+20|0020)1[0125][0-9]{8})$"
                :title="$t('enterValidEgyptianPhone')"
                required 
              />
              <p v-if="phoneError" class="error-message">
                {{ $t('enterValidEgyptianPhone') || 'Please enter a valid Egyptian phone number (e.g., 01XXXXXXXXX, +201XXXXXXXXX, or 00201XXXXXXXXX)' }}
              </p>
            </div>

            <div class="form-group">
              <label for="password" class="form-label">{{ $t('password') }}</label>
              <input 
                type="password" 
                id="password" 
                v-model="formData.password" 
                class="form-input" 
                :placeholder="$t('password')" 
                required 
              />
              <!-- Password validation indicators -->
              <div class="password-validation" v-if="formData.password">
                <div class="validation-item" :class="{ 'valid': passwordValidation.length }">
                  <span class="validation-icon">{{ passwordValidation.length ? '✓' : '✗' }}</span>
                  <span class="validation-text">{{ $t('atLeast8Characters') }}</span>
                </div>
                <div class="validation-item" :class="{ 'valid': passwordValidation.uppercase }">
                  <span class="validation-icon">{{ passwordValidation.uppercase ? '✓' : '✗' }}</span>
                  <span class="validation-text">{{ $t('oneUppercaseLetter') }}</span>
                </div>
                <div class="validation-item" :class="{ 'valid': passwordValidation.lowercase }">
                  <span class="validation-icon">{{ passwordValidation.lowercase ? '✓' : '✗' }}</span>
                  <span class="validation-text">{{ $t('oneLowercaseLetter') }}</span>
                </div>
                <div class="validation-item" :class="{ 'valid': passwordValidation.number }">
                  <span class="validation-icon">{{ passwordValidation.number ? '✓' : '✗' }}</span>
                  <span class="validation-text">{{ $t('oneNumber') }}</span>
                </div>
                <div class="validation-item" :class="{ 'valid': passwordValidation.special }">
                  <span class="validation-icon">{{ passwordValidation.special ? '✓' : '✗' }}</span>
                  <span class="validation-text">{{ $t('oneSpecialCharacter') }}</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPass" class="form-label">{{ $t('confirmPassword') }}</label>
              <input 
                type="password" 
                id="confirmPass" 
                v-model="formData.confirmPass" 
                class="form-input" 
                :class="{ 'error': formData.confirmPass && !passwordValidation.match }" 
                :placeholder="$t('confirmPassword')" 
                required 
              />
              <p v-if="formData.confirmPass && !passwordValidation.match" class="error-message">
                {{ $t('passwordsDoNotMatch') }}
              </p>
            </div>
          </div>

          <!-- Additional Information -->
          <div class="form-section">
            <h3 class="section-title">{{ $t('additionalInformation') }}</h3>
            
            <div class="form-group">
              <label for="gender" class="form-label">{{ $t('gender') }}</label>
              <select 
                id="gender" 
                v-model="formData.gender" 
                class="form-input" 
                required
              >
                <option value="" disabled selected>{{ $t('gender') }}</option>
                <option value="male">{{ $t('male') }}</option>
                <option value="female">{{ $t('female') }}</option>
                <option value="other">{{ $t('other') }}</option>
              </select>
            </div>

            <div class="form-group">
              <label for="age" class="form-label">{{ $t('age') }}</label>
              <input 
                type="number" 
                id="age" 
                v-model="formData.age" 
                class="form-input" 
                :placeholder="$t('age')" 
                min="18"
                max="120"
                required 
              />
            </div>

            <div class="form-group">
              <label for="address" class="form-label">{{ $t('address') }}</label>
              <input 
                type="text" 
                id="address" 
                v-model="formData.address" 
                class="form-input" 
                :placeholder="$t('address')" 
                required 
              />
            </div>

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

        <div class="form-footer">
          <div class="checkbox-group">
            <input v-model="formData.agreeTerms" type="checkbox" class="form-checkbox" id="agreeTerms" required />
            <label class="checkbox-label" for="agreeTerms">
              {{ $t('agreeTermsAndConditions') }}
              <span class="terms-link" @click="openTermsModal">{{ $t('termsAndConditions') }}</span> 
              {{ $t('andPrivacyPolicy') }}
            </label>
          </div>
          
          <button type="submit" class="submit-btn" :disabled="loading">
            <span>{{ loading ? $t('registering') : $t('register') }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="arrow-icon" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0z"/>
            </svg>
          </button>
          
          <p v-if="error" class="error-text">{{ error }}</p>
          <p v-if="success" class="success-text">{{ success }}</p>
          <p class="login-link">{{ $t('haveAccount') }} <a href="/userlogin">{{ $t('signIn') }}</a></p>
        </div>
      </form>
    </div>
  </div>
  </div>
</template>

<script setup>
console.log('=== USERSIGNUP COMPONENT SCRIPT SETUP START ===');
import { ref, computed, reactive, watch, onMounted } from 'vue';

import { useRouter } from 'vue-router';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ensureUserRole, fetchUserRole } from '../utils/userRole';
import { sendWelcomeEmail } from '../utils/emailService';
import { useI18n } from 'vue-i18n';
import { getGovernmentNames, getDistrictsForGovernment, governmentNamesAr, districtsAr } from '../data/egyptianLocations';
import { authState, waitForAuth } from '../utils/auth';

console.log('=== USERSIGNUP IMPORTS COMPLETED ===');

const { t, locale } = useI18n();
const router = useRouter();

// Debug component mounting
console.log('UserSignUp component script setup executed');

  // Add comprehensive debugging
  onMounted(async () => {
    console.log('UserSignUp component mounted');
    console.log('Current route:', router.currentRoute.value.path);
    console.log('Auth state on mount:', {
      isAuthenticated: authState.isAuthenticated,
      userType: authState.userType,
      user: authState.user ? authState.user.email : null,
      isLoading: authState.isLoading
    });
    
    // Wait for auth to be ready
    await waitForAuth();
    authLoading.value = false; // Set loading to false after auth is ready
    console.log('Auth state after waiting:', {
      isAuthenticated: authState.isAuthenticated,
      userType: authState.userType,
      user: authState.user ? authState.user.email : null,
      isLoading: authState.isLoading
    });
  });

console.log('=== USERSIGNUP COMPONENT SCRIPT SETUP END ===');

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPass: '',
  gender: '',
  age: '',
  address: '', 
  government: '',
  district: '',
  agreeTerms: false,
});

const error = ref('');
const errors = ref({});
const showTermsModal = ref(false);
const phoneError = ref(false);
const loading = ref(false);
const success = ref('');
const authLoading = ref(true); // New loading state for auth initialization

const governmentOptions = getGovernmentNames();
const districtOptions = computed(() => {
  return formData.government ? getDistrictsForGovernment(formData.government) : [];
});
watch(() => formData.government, () => { formData.district = ''; });

// Validation functions
// Stricter email validation: basic RFC-like pattern + extra guards for dots/hyphens
const validateEmail = (email) => {
  if (!email) return false;
  const trimmed = String(email).trim();
  // Basic pattern
  const basic = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!basic.test(trimmed)) return false;
  const [local, domain] = trimmed.split('@');
  // No consecutive dots
  if (local.includes('..') || domain.includes('..')) return false;
  // Local part cannot start/end with dot
  if (local.startsWith('.') || local.endsWith('.')) return false;
  // Domain labels cannot start/end with hyphen and must be non-empty
  const labels = domain.split('.');
  if (labels.some(label => !label || label.startsWith('-') || label.endsWith('-'))) return false;
  return true;
};
const passwordValidation = reactive({
  length: false,
  uppercase: false,
  lowercase: false,
  number: false,
  special: false,
  match: false,
});

// Real-time checks
watch(() => formData.password, (newPassword) => {
  passwordValidation.length = newPassword.length >= 8;
  passwordValidation.uppercase = /[A-Z]/.test(newPassword);
  passwordValidation.lowercase = /[a-z]/.test(newPassword);
  passwordValidation.number = /\d/.test(newPassword);
  passwordValidation.special = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  // update match as well when password changes
  passwordValidation.match = formData.confirmPass === newPassword && formData.confirmPass.length > 0;
});

watch(() => formData.confirmPass, (newConfirm) => {
  passwordValidation.match = newConfirm === formData.password && newConfirm.length > 0;
});

const isPasswordValid = computed(() => {
  return (
    passwordValidation.length &&
    passwordValidation.uppercase &&
    passwordValidation.lowercase &&
    passwordValidation.number &&
    passwordValidation.special
  );
});

const validatePassword = (password) => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  );
};

const validateAge = (age) => {
  const ageNum = parseInt(age);
  return ageNum >= 18 && ageNum <= 120;
};
const validateName = (name) => name.length >= 2 && /^[a-zA-Z\s]+$/.test(name);
const validateRequired = (value) => value !== null && value !== undefined && String(value).trim().length > 0;
// Egyptian phone validation: supports local (11 digits starting 01x) and international (+20 or 0020)
const validateEgyptianPhone = (phone) => {
  if (!phone) return false;
  const cleaned = String(phone).replace(/\s|-/g, '');
  const local = /^01[0125][0-9]{8}$/; // e.g., 010xxxxxxxx, 011xxxxxxxx, 012xxxxxxxx, 015xxxxxxxx
  const intl = /^(?:\+20|0020)1[0125][0-9]{8}$/; // e.g., +2010xxxxxxxx or 002010xxxxxxxx
  return local.test(cleaned) || intl.test(cleaned);
};

// Phone number validation with real-time feedback
const validatePhoneNumber = () => {
  if (!formData.phone) {
    phoneError.value = false;
    return false;
  }
  
  // Remove any non-digit characters except + for validation
  const cleanedPhone = formData.phone.replace(/[^\d+]/g, '');
  
  // Check if the phone number matches Egyptian format (local, +20, or 0020)
  const phoneRegex = /^(01[0125]\d{8}|\+?201[0125]\d{8}|00201[0125]\d{8})$/;
  phoneError.value = !phoneRegex.test(cleanedPhone);
  
  return !phoneError.value;
};

// Main validation function
const validateForm = () => {
  errors.value = {};

  if (!validateRequired(formData.firstName)) {
    errors.value.firstName = t('firstNameRequired');
  } else if (!validateName(formData.firstName)) {
    errors.value.firstName = t('firstNameInvalid');
  }

  if (!validateRequired(formData.lastName)) {
    errors.value.lastName = t('lastNameRequired');
  } else if (!validateName(formData.lastName)) {
    errors.value.lastName = t('lastNameInvalid');
  }

  // Normalize whitespace before validating
  if (typeof formData.email === 'string') formData.email = formData.email.trim();
  if (!validateRequired(formData.email)) {
    errors.value.email = t('emailRequired');
  } else if (!validateEmail(formData.email)) {
    errors.value.email = t('emailInvalid');
  }

  if (!validateRequired(formData.password)) {
    errors.value.password = t('passwordRequired');
  } else if (!validatePassword(formData.password)) {
    errors.value.password = t('passwordInvalid');
  }

  if (!validateRequired(formData.confirmPass)) {
    errors.value.confirmPass = t('confirmPasswordRequired');
  } else if (formData.password !== formData.confirmPass) {
    errors.value.confirmPass = t('passwordsDontMatch');
  }

  if (!validateRequired(formData.gender)) {
    errors.value.gender = t('genderRequired');
  }

  if (!validateRequired(formData.age)) {
    errors.value.age = t('ageRequired');
  } else if (!validateAge(formData.age)) {
    errors.value.age = t('ageInvalid');
  }

  if (!validateRequired(formData.government)) {
    errors.value.government = t('governmentRequired');
  }

  if (!validateRequired(formData.district)) {
    errors.value.district = t('districtRequired');
  }

  if (!validateRequired(formData.phone)) {
    errors.value.phone = t('phoneRequired');
  } else if (!validatePhoneNumber()) {
    errors.value.phone = t('enterValidEgyptianPhone');
  }

  if (!formData.agreeTerms) {
    errors.value.agreeTerms = t('mustAgreeTerms');
  }

  if (!validateRequired(formData.address)) {
    errors.value.address = t('addressRequired');
  }

  return Object.keys(errors.value).length === 0;
};

const handleRegister = async () => {
  error.value = '';
  success.value = '';
  loading.value = true;

  if (!validateForm()) {
    loading.value = false;
    return;
  }

  try {
    // Create user account with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

    // Create user document in Firestore
    const userDoc = {
      fullName: `${formData.firstName} ${formData.lastName}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      gender: formData.gender,
      age: parseInt(formData.age),
      address: `${formData.address},`+ formData.government+ formData.district,
      area: getDistrictsForGovernment(formData.government)[formData.district] || formData.district,
      city: getGovernmentNames()[formData.government] || formData.government,
      phone: formData.phone,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);

    await ensureUserRole(userCredential.user);
    await fetchUserRole(userCredential.user);

    try {
      await sendWelcomeEmail(formData.email, formData.firstName, formData.lastName);
      success.value = t('registrationSuccess');
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    router.push('/');
  } catch (err) {
    console.error('Registration error:', err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const openTermsModal = () => {
  showTermsModal.value = true;
};

const closeTermsModal = () => {
  showTermsModal.value = false;
};
</script>

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
    color:  #676869;
}

.dark .form-input::placeholder {
  color: var(--text-muted, #6b7280);
}

/* Style for select dropdowns to match placeholder color */
.form-input option {
    color: black;
}

/* Style for select dropdown placeholder text */
.form-input:invalid {
    color: var(--text-muted, #9ca3af);
}

.dark .form-input:invalid {
  color: var(--text-muted, #6b7280);
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

/* Password validation checklist */
.password-validation {
    margin-top: 0.75rem;
    padding: 1rem;
    background-color: var(--input-bg, #f8f9fa);
    border-radius: 8px;
    border: 1px solid #e9ecef;
    font-size: 0.75rem;
}

.dark .password-validation {
  background-color: var(--input-bg, #374151);
  border-color: #4b5563;
}

.validation-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
    color: #6b7280;
    transition: color 0.2s ease;
}

.validation-item:last-child {
    margin-bottom: 0;
}

.validation-item.valid {
    color: #10b981;
}

.validation-icon {
    font-weight: bold;
    font-size: 0.875rem;
}

.validation-text {
    font-size: 0.75rem;
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

.success-text {
    color: #10b981;
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

/* Loading styles */
.loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #D3CFE2;
}

.dark .loading-container {
    background: var(--primary-bg);
}

.loading-spinner {
    text-align: center;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #625397;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-spinner p {
    color: #625397;
    font-weight: 600;
}

.dark .loading-spinner p {
    color: var(--primary-color);
}
</style>