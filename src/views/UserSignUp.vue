<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ensureUserRole, fetchUserRole } from '../utils/userRole';
import emailjs from 'emailjs-com';

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
const error = ref('');
const errors = ref({});
const showTermsModal = ref(false);
const router = useRouter();

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

  return Object.keys(errors.value).length === 0;
};

// Function to send welcome email to the user
async function sendWelcomeEmail(userEmail, firstName, lastName) {
  try {
    console.log('=== SENDING WELCOME EMAIL TO USER ===');
    console.log('Email:', userEmail);
    console.log('Name:', firstName, lastName);

    const fullName = `${firstName} ${lastName}`.trim();
    
    const templateParams = {
      to_email: userEmail,
      to_name: fullName || 'Valued Customer',
      subject: 'Welcome to BoltFix! Your Account is Ready',
      message: `Dear ${fullName || 'Valued Customer'},\n\nWelcome to BoltFix! Your account has been successfully created and you're now ready to connect with skilled technicians for all your home service needs.\n\nYour account details:\nEmail: ${userEmail}\n\nYou can now:\n- Browse available technicians\n- Book appointments\n- Track your bookings\n- Leave reviews\n\nThank you for choosing BoltFix!\n\nBest regards,\nThe BoltFix Team`
    };

    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );
    console.log('Welcome email sent successfully!');
    return true;
  } catch (error) {
    console.error('=== ERROR SENDING WELCOME EMAIL ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    return false;
  }
}

const handleRegister = async () => {
  error.value = '';
  
  // Validate form
  if (!validateForm()) {
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    
    // Create user document in Firestore
    const userDoc = {
      fullName: `${firstName.value} ${lastName.value}`,
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      gender: gender.value,
      age: parseInt(age.value),
      address: address.value,
      area: area.value,
      city: city.value,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);
    
    // Send welcome email using reactive form data
    await sendWelcomeEmail(email.value, firstName.value, lastName.value);
    
    // Enforce persistent admin role for elie1400674@gmail.com
    await ensureUserRole(userCredential.user);
    await fetchUserRole(userCredential.user);
    router.push('/'); // Redirect to home page after registration
  } catch (err) {
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

      <!-- address -->
      <div class="form-group">
        <label for="address" class="form-label">{{ $t('address') }}</label>
        <input 
          type="text" 
          id="address" 
          v-model="address" 
          class="form-input" 
          :class="{ 'error': errors.address }"
          :placeholder="$t('address')" 
          required 
        />
        <p v-if="errors.address" class="error-message">{{ errors.address }}</p>
      </div>

      <!-- area -->
      <div class="form-group">
        <label for="area" class="form-label">{{ $t('area') }}</label>
        <input 
          type="text" 
          id="area" 
          v-model="area" 
          class="form-input" 
          :class="{ 'error': errors.area }"
          :placeholder="$t('area')" 
          required 
        />
        <p v-if="errors.area" class="error-message">{{ errors.area }}</p>
      </div>

      <!-- city -->
      <div class="form-group">
        <label for="city" class="form-label">{{ $t('city') }}</label>
        <input 
          type="text" 
          id="city" 
          v-model="city" 
          class="form-input" 
          :class="{ 'error': errors.city }"
          :placeholder="$t('city')" 
          required 
        />
        <p v-if="errors.city" class="error-message">{{ errors.city }}</p>
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
        <input type="checkbox" class="form-checkbox" id="exampleCheck1" required>
        <label class="checkbox-label" for="exampleCheck1">
          I agree to the 
          <span class="terms-link" @click="openTermsModal">Terms & Conditions</span> 
          and Privacy policy
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
      <h2 class="modal-title">Terms and Conditions</h2>
      <button class="modal-close" @click="closeTermsModal">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
      </button>
    </div>
    <div class="modal-body">
      <div class="terms-content">
        <h3>1. General Terms</h3>
        
        <h4>1.1 Definitions</h4>
        <ul>
          <li><strong>Platform:</strong> Refers to the Bolt Fix website.</li>
          <li><strong>User:</strong> A person who books maintenance services through the platform.</li>
          <li><strong>Technician:</strong> A service provider registered on the platform.</li>
          <li><strong>Booking:</strong> A confirmed request for a maintenance service.</li>
        </ul>

        <h4>1.2 Account Creation</h4>
        <ul>
          <li>All users and technicians must register with accurate and complete information.</li>
          <li>Each individual may only have one account.</li>
          <li>By registering, you agree to these terms and all platform policies.</li>
        </ul>

        <h4>1.3 Privacy</h4>
        <ul>
          <li>All personal data is securely stored and protected.</li>
          <li>Data will not be shared with third parties without user consent.</li>
        </ul>

        <h4>1.4 Prohibited Conduct</h4>
        <ul>
          <li>Providing false information or impersonating others is not allowed.</li>
          <li>Completing services or payments outside the platform is strictly prohibited.</li>
          <li>Abusive or inappropriate behavior may lead to account suspension or termination.</li>
        </ul>

        <h4>1.5 Account Termination</h4>
        <ul>
          <li>The platform reserves the right to suspend or delete any account that violates the terms.</li>
        </ul>

        <h3>2. User Terms</h3>

        <h4>2.1 Booking a Service</h4>
        <ul>
          <li>Users can select technicians based on location, availability, and service type.</li>
          <li>All bookings must be confirmed and completed through the platform.</li>
        </ul>

        <h4>2.2 Payment</h4>
        <ul>
          <li>Users can pay in cash after the service is delivered or online via PayPal before the service.</li>
          <li>A booking is considered confirmed only after payment or explicit confirmation.</li>
        </ul>

        <h4>2.3 Cancellation and Refunds</h4>
        <ul>
          <li>Users may cancel bookings within a specific time frame before the scheduled appointment.</li>
          <li>No refunds are available after the service has been completed.</li>
          <li>Complaints can be submitted through the platform for review.</li>
        </ul>

        <h4>2.4 Ratings and Feedback</h4>
        <ul>
          <li>Users may rate and review technicians after each service.</li>
          <li>Feedback contributes to service quality monitoring and technician performance.</li>
        </ul>

        <h3>3. Technician Terms</h3>

        <h4>3.1 Commission Policy</h4>
        <ul>
          <li>The platform charges a 25% commission on each completed booking.</li>
          <li>The remaining 75% is transferred to the technician.</li>
        </ul>

        <h4>3.2 Payment Methods</h4>
        <ul>
          <li>Technicians must add a valid PayPal account to receive online payments.</li>
          <li>If the user pays in cash, the technician collects the full amount directly, and the platform will deduct its 25% commission later from future settlements.</li>
        </ul>

        <h4>3.3 Earnings Transfer</h4>
        <ul>
          <li>For PayPal payments, the technician's 75% share will be transferred within 24–48 hours after the service is confirmed.</li>
          <li>For cash payments, the platform will deduct the commission later from upcoming earnings.</li>
        </ul>

        <h4>3.4 Service Expectations</h4>
        <ul>
          <li>Technicians are expected to arrive on time and complete the job professionally.</li>
          <li>Multiple negative reviews may result in account review or suspension.</li>
        </ul>

        <h4>3.5 Responsibility</h4>
        <ul>
          <li>Technicians are responsible for the quality and completeness of their work.</li>
          <li>Any misconduct or violation may result in penalties or account removal.</li>
        </ul>

        <p class="terms-footer">
          By using the Bolt Fix platform, all users and technicians agree to the terms and conditions listed above.
        </p>
      </div>
    </div>
    <div class="modal-footer">
      <button class="modal-btn" @click="closeTermsModal">I Understand</button>
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
    background: #ffffff;
    color: #1f2937;
    font-family: inherit;
}

.dark .form-input {
  background: #374151;
  border-color: #4b5563;
  color: #f9fafb;
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
    color: #9ca3af;
}

.dark .form-input::placeholder {
  color: #6b7280;
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
  background: linear-gradient(135deg, var(--primary-color) 0%, #7c3aed 100%);
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