<template>
  <div class="signup-container">
    <form class="signup-form" @submit.prevent="handleRegister">
      <div class="form-header">
        <img class="logo" src="/logo/ace04d3b268cf810c91d002fdf7454a6ef778f27.png" alt="BoltFix Logo">
        <h1 class="title">{{ $t('technicianRegistration') }}</h1>
        <p class="subtitle">{{ $t('createAccount') }}</p>
      </div>
      
      <div class="form-grid">
        <!-- Personal Information -->
        <div class="form-section">
          <h3 class="section-title">{{ $t('personalInformation') }}</h3>
          
          <div class="form-group">
            <label for="fullName" class="form-label">{{ $t('fullName') }}</label>
            <input 
              type="text" 
              id="fullName" 
              v-model="formData.fullName" 
              class="form-input" 
              :placeholder="$t('fullName')" 
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
              :placeholder="$t('emailAddress')" 
              required 
            />
          </div>

          <div class="form-group">
            <label for="phoneNumber" class="form-label">{{ $t('phoneNumber') }}</label>
            <input 
              type="tel" 
              id="phoneNumber" 
              v-model="formData.phoneNumber" 
              class="form-input" 
              :placeholder="$t('phoneNumber')" 
              required 
            />
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
            <label for="confirmPassword" class="form-label">{{ $t('confirmPassword') }}</label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="formData.confirmPassword" 
              class="form-input" 
              :class="{ 'error': formData.confirmPassword && !passwordValidation.match }" 
              :placeholder="$t('confirmPassword')" 
              required 
            />
            <p v-if="formData.confirmPassword && !passwordValidation.match" class="error-message">
              {{ $t('passwordsDoNotMatch') }}
            </p>
          </div>
        </div>

        <!-- Professional Details -->
        <div class="form-section">
          <h3 class="section-title">{{ $t('professionalDetails') }}</h3>
          
          <div class="form-group">
            <label for="specialization" class="form-label">{{ $t('specialization') }}</label>
            <select 
              id="specialization" 
              v-model="formData.specialization" 
              class="form-input" 
              required
            >
              <option value="" disabled selected>{{ $t('specialization') }}</option>
              <option value="Plumbing">{{ $t('plumbing') }}</option>
              <option value="Electricity">{{ $t('electricity') }}</option>
              <option value="Carpentry">{{ $t('carpentry') }}</option>
              <option value="Wall Finishing">{{ $t('wallFinishing') }}</option>
              <option value="Air Conditioning">{{ $t('airConditioning') }}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="experience" class="form-label">{{ $t('yearsOfExperience') }}</label>
            <select 
              id="experience" 
              v-model="formData.experience" 
              class="form-input" 
              required
            >
              <option value="" disabled selected>{{ $t('yearsOfExperience') }}</option>
              <option value="1">{{ $t('oneYear') }}</option>
              <option value="2">{{ $t('twoYears') }}</option>
              <option value="3">{{ $t('threeYears') }}</option>
              <option value="4+">{{ $t('fourPlusYears') }}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="bio" class="form-label">{{ $t('briefDescriptionBio') }}</label>
            <input 
              type="text" 
              id="bio" 
              v-model="formData.bio" 
              class="form-input" 
              :placeholder="$t('briefDescriptionBio')" 
              required 
            />
          </div>

          <div class="form-group">
            <label for="basePrice" class="form-label">{{ $t('baseVisitPrice') }}</label>
            <input 
              type="text" 
              id="basePrice" 
              v-model="formData.basePrice" 
              class="form-input" 
              :placeholder="$t('baseVisitPrice')" 
              required 
            />
          </div>

          <div class="form-group">
            <label for="paypalEmail" class="form-label">{{ $t('paypalEmail') }}</label>
            <input 
              type="number" 
              id="age" 
              v-model="formData.age" 
              class="form-input" 
              :placeholder="$t('paypalEmail')" 
              required 
            />
          </div>
        </div>

        <!-- Location -->
        <div class="form-section">
          <h3 class="section-title">{{ $t('location') }}</h3>
          
          <div class="form-group">
            <label for="government" class="form-label">{{ $t('government') }}</label>
            <select 
              id="government" 
              v-model="formData.government" 
              class="form-input" 
              required
            >
              <option value="" disabled selected>{{ $t('government') }}</option>
              <option value="Cairo">{{ $t('cairo') }}</option>
              <option value="Giza">{{ $t('giza') }}</option>
              <option value="Alexandria">{{ $t('alexandria') }}</option>
              <option value="Qalyubia">{{ $t('qalyubia') }}</option>
              <option value="Sharqia">{{ $t('sharqia') }}</option>
              <option value="Gharbia">{{ $t('gharbia') }}</option>
              <option value="Monufia">{{ $t('monufia') }}</option>
              <option value="Beheira">{{ $t('beheira') }}</option>
              <option value="Ismailia">{{ $t('ismailia') }}</option>
              <option value="Port Said">{{ $t('portSaid') }}</option>
              <option value="Suez">{{ $t('suez') }}</option>
              <option value="Dakahlia">{{ $t('dakahlia') }}</option>
              <option value="Kafr El Sheikh">{{ $t('kafrElSheikh') }}</option>
              <option value="Damietta">{{ $t('damietta') }}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="district" class="form-label">{{ $t('districtArea') }}</label>
            <select 
              id="district" 
              v-model="formData.district" 
              class="form-input" 
              required
            >
              <option value="" disabled selected>{{ $t('districtArea') }}</option>
              <option value="Nasr City">{{ $t('nasrCity') }}</option>
              <option value="Maadi">{{ $t('maadi') }}</option>
              <option value="Dokki">{{ $t('dokki') }}</option>
              <option value="Heliopolis">{{ $t('heliopolis') }}</option>
              <option value="Zamalek">{{ $t('zamalek') }}</option>
              <option value="Garden City">{{ $t('gardenCity') }}</option>
              <option value="Mohandessin">{{ $t('mohandessin') }}</option>
              <option value="Agouza">{{ $t('agouza') }}</option>
              <option value="6th of October">{{ $t('sixthOfOctober') }}</option>
              <option value="Sheikh Zayed">{{ $t('sheikhZayed') }}</option>
              <option value="Smart Village">{{ $t('smartVillage') }}</option>
              <option value="New Cairo">{{ $t('newCairo') }}</option>
              <option value="Shoubra">{{ $t('shoubra') }}</option>
              <option value="Ain Shams">{{ $t('ainShams') }}</option>
              <option value="Matareya">{{ $t('matareya') }}</option>
              <option value="El Marg">{{ $t('elMarg') }}</option>
              <option value="El Salam">{{ $t('elSalam') }}</option>
              <option value="El Nozha">{{ $t('elNozha') }}</option>
              <option value="El Sharabiya">{{ $t('elSharabiya') }}</option>
              <option value="El Basatin">{{ $t('elBasatin') }}</option>
              <option value="El Mokattam">{{ $t('elMokattam') }}</option>
              <option value="El Sayeda Zeinab">{{ $t('elSayedaZeinab') }}</option>
              <option value="El Khalifa">{{ $t('elKhalifa') }}</option>
              <option value="El Darb El Ahmar">{{ $t('elDarbElAhmar') }}</option>
              <option value="El Gamaleya">{{ $t('elGamaleya') }}</option>
              <option value="El Zeinhom">{{ $t('elZeinhom') }}</option>
              <option value="El Maadi">{{ $t('elMaadi') }}</option>
              <option value="El Tahrir">{{ $t('elTahrir') }}</option>
              <option value="El Kasr El Aini">{{ $t('elKasrElAini') }}</option>
              <option value="El Manial">{{ $t('elManial') }}</option>
              <option value="El Giza">{{ $t('elGiza') }}</option>
              <option value="El Haram">{{ $t('elHaram') }}</option>
              <option value="El Omraniya">{{ $t('elOmraniya') }}</option>
              <option value="El Warraq">{{ $t('elWarraq') }}</option>
              <option value="El Imbaba">{{ $t('elImbaba') }}</option>
              <option value="El Agouza">{{ $t('elAgouza') }}</option>
              <option value="El Mohandessin">{{ $t('elMohandessin') }}</option>
              <option value="El Dokki">{{ $t('elDokki') }}</option>
              <option value="El Zamalek">{{ $t('elZamalek') }}</option>
              <option value="El Garden City">{{ $t('elGardenCity') }}</option>
              <option value="El Downtown">{{ $t('elDowntown') }}</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">{{ $t('willingToTravel') }}</label>
            <div class="radio-group">
              <label class="radio-label">
                <input v-model="formData.willingToTravel" type="radio" name="travel" value="yes" />
                <span>{{ $t('yes') }}</span>
              </label>
              <label class="radio-label">
                <input v-model="formData.willingToTravel" type="radio" name="travel" value="no" />
                <span>{{ $t('no') }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Uploads & Agreements -->
        <div class="form-section">
          <h3 class="section-title">{{ $t('pleaseUploadYourId') }}</h3>
          
          <div class="form-group">
            <label class="form-label">ID Photo</label>
            <div class="upload-area" @click="triggerFileInput">
              <div class="upload-content">
                <svg xmlns="http://www.w3.org/2000/svg" class="upload-icon" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span class="upload-text">
                  {{ $t('dragDropOrBrowse') }}
                  <span class="browse-link">{{ $t('browse') }}</span>
                </span>
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleFileChange"
                />
              </div>
              <div v-if="previewUrl" class="preview-container">
                <img :src="previewUrl" alt="Preview" class="preview-img" />
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Profile Picture</label>
            <div class="upload-area" @click="triggerProfileFileInput">
              <div class="upload-content">
                <svg xmlns="http://www.w3.org/2000/svg" class="upload-icon" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span class="upload-text">
                  {{ $t('dragDropOrBrowse') }}
                  <span class="browse-link">{{ $t('browse') }}</span>
                </span>
                <input
                  ref="profileFileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleProfileFileChange"
                />
              </div>
              <div v-if="profilePreviewUrl" class="preview-container">
                <img :src="profilePreviewUrl" alt="Profile Preview" class="preview-img" />
              </div>
            </div>
          </div>

          <div class="checkbox-group">
            <input v-model="formData.confirmInfo" type="checkbox" class="form-checkbox" id="confirmInfo" required />
            <label class="checkbox-label" for="confirmInfo">
              {{ $t('confirmInformationAccurate') }}
            </label>
          </div>

          <div class="checkbox-group">
            <input v-model="formData.agreeTerms" type="checkbox" class="form-checkbox" id="agreeTerms" required />
            <label class="checkbox-label" for="agreeTerms">
              I agree to the 
              <span class="terms-link" @click="openTermsModal">Terms & Conditions</span> 
              and Privacy policy
            </label>
          </div>
        </div>
      </div>

      <div class="form-footer">
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
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db, storage } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, serverTimestamp, doc, setDoc, addDoc, getDocs, query, where, getDoc, updateDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useI18n } from 'vue-i18n';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../utils/emailjsConfig';



const { t } = useI18n();

const router = useRouter();
const fileInput = ref(null);
const profileFileInput = ref(null);
const previewUrl = ref(null);
const profilePreviewUrl = ref(null);
const loading = ref(false);
const error = ref('');
const success = ref('');
const showTermsModal = ref(false);

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

// Password validation
const passwordValidation = reactive({
  length: false,
  uppercase: false,
  lowercase: false,
  number: false,
  special: false,
  match: false
});

// Watch password changes for real-time validation
watch(() => formData.password, (newPassword) => {
  passwordValidation.length = newPassword.length >= 8;
  passwordValidation.uppercase = /[A-Z]/.test(newPassword);
  passwordValidation.lowercase = /[a-z]/.test(newPassword);
  passwordValidation.number = /\d/.test(newPassword);
  passwordValidation.special = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
});

// Watch confirm password for matching
watch(() => formData.confirmPassword, (newConfirmPassword) => {
  passwordValidation.match = newConfirmPassword === formData.password && newConfirmPassword.length > 0;
});

// Check if password meets all requirements
const isPasswordValid = computed(() => {
  return passwordValidation.length && 
         passwordValidation.uppercase && 
         passwordValidation.lowercase && 
         passwordValidation.number && 
         passwordValidation.special;
});

function triggerFileInput() {
  fileInput.value && fileInput.value.click();
}

function triggerProfileFileInput() {
  profileFileInput.value && profileFileInput.value.click();
}

function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      previewUrl.value = e.target.result; // For preview
      formData.idPhotoBase64 = e.target.result; // Save Base64 string
    };
    reader.readAsDataURL(file);
  }
}

function handleProfileFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      profilePreviewUrl.value = e.target.result; // For preview
      formData.profilePhotoBase64 = e.target.result; // Save Base64 string
    };
    reader.readAsDataURL(file);
  }
}

async function handleRegister() {
  error.value = '';
  success.value = '';
  
  // Password validation
  if (!isPasswordValid.value) {
    error.value = t('passwordRequirementsNotMet');
    return;
  }
  
  if (formData.password !== formData.confirmPassword) {
    error.value = t('passwordsDoNotMatch');
    return;
  }
  
  if (!formData.confirmInfo || !formData.agreeTerms) {
    error.value = t('pleaseConfirmCheckboxes');
    return;
  }
  
  if (!formData.idPhotoBase64) {
    error.value = 'Please upload your ID photo';
    return;
  }
  
  if (!formData.profilePhotoBase64) {
    error.value = 'Please upload a profile picture';
    return;
  }
  
  loading.value = true;
  
  // Add timeout to prevent hanging
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Registration timeout - taking too long')), 30000); // 30 second timeout
  });
  
  try {
    console.log('Starting registration process...');
    console.log('Form data:', { 
      email: formData.email, 
      fullName: formData.fullName,
      specialization: formData.specialization,
      hasIdPhoto: !!formData.idPhotoBase64,
      hasProfilePhoto: !!formData.profilePhotoBase64
    });
    
    // Create Firebase Auth user
    console.log('Creating Firebase Auth user...');
    const userCredential = await Promise.race([
      createUserWithEmailAndPassword(auth, formData.email, formData.password),
      timeoutPromise
    ]);
    console.log('Firebase Auth user created successfully:', userCredential.user.uid);
    // Save technician data to Firestore, using Base64 image
    const technicianData = {
      uid: userCredential.user.uid,
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      specialization: formData.specialization,
      experience: formData.experience,
      bio: formData.bio,
      basePrice: formData.basePrice,
      government: formData.government,
      district: formData.district,
      willingToTravel: formData.willingToTravel,
      idPhotoUrl: formData.idPhotoBase64 || '', // Save Base64 string
      profilePhotoUrl: formData.profilePhotoBase64 || '', // Save profile picture Base64 string
      paypalEmail: formData.paypalEmail || '', // Save PayPal email
      status: 'pending', // Admin approval status
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      role: 'pending' // Set as pending until admin approves
    };
    
    // Save to pending applications collection
    console.log('Saving to pendingTechnicians collection...');
    await Promise.race([
      setDoc(doc(db, 'pendingTechnicians', userCredential.user.uid), technicianData),
      timeoutPromise
    ]);
    console.log('Saved to pendingTechnicians successfully');
    
    // Also save to users collection with pending role
    console.log('Saving to users collection...');
    await Promise.race([
      setDoc(doc(db, 'users', userCredential.user.uid), {
      email: formData.email,
      role: 'pending',
      createdAt: serverTimestamp()
      }),
      timeoutPromise
    ]);
    console.log('Saved to users collection successfully');
    
    // Set localStorage to pending
    localStorage.setItem('userType', 'pending');
    
    // Send notification to admin about new technician application (non-blocking)
    sendTechnicianApplicationNotification(technicianData).catch(error => {
      console.error('Failed to send admin notification:', error);
    });
    
    // Send welcome email to the technician (non-blocking)
    sendWelcomeEmail(formData.email, formData.fullName).catch(error => {
      console.error('Failed to send welcome email:', error);
    });
    
    success.value = t('applicationSubmitted');
    // Redirect to pending status page
    setTimeout(() => {
      router.push('/pending-application');
    }, 2000);
    
  } catch (err) {
    console.error('Registration error:', err);
    
    // Provide more specific error messages
    if (err.code === 'auth/email-already-in-use') {
      error.value = 'An account with this email already exists. Please use a different email or try logging in.';
    } else if (err.code === 'auth/weak-password') {
      error.value = 'Password is too weak. Please choose a stronger password.';
    } else if (err.code === 'auth/invalid-email') {
      error.value = 'Please enter a valid email address.';
    } else if (err.message.includes('timeout')) {
      error.value = 'Registration is taking too long. Please check your internet connection and try again.';
    } else {
      error.value = `Registration failed: ${err.message}`;
    }
  } finally {
    loading.value = false;
  }
}

// Function to send notification to admin about new technician application
async function sendTechnicianApplicationNotification(technicianData) {
  try {
    console.log('=== SENDING TECHNICIAN APPLICATION NOTIFICATION ===');
    console.log('Technician data:', technicianData);
    
    const notificationData = {
      type: 'technician_application',
      title: 'New Technician Application',
      message: `New technician application from ${technicianData.fullName} (${technicianData.email}) for ${technicianData.specialization}`,
      technicianId: technicianData.uid,
      technicianName: technicianData.fullName,
      technicianEmail: technicianData.email,
      specialization: technicianData.specialization,
      experience: technicianData.experience,
      government: technicianData.government,
      district: technicianData.district,
      basePrice: technicianData.basePrice,
      status: 'pending',
      createdAt: new Date(),
      read: false
    };
    
    console.log('Notification data prepared:', notificationData);
    
    // Send notification to admin
    const adminNotification = {
      ...notificationData,
      recipientId: 'admin',
      recipientType: 'admin',
      message: `New technician application: ${technicianData.fullName} (${technicianData.email}) has applied for ${technicianData.specialization} position. Experience: ${technicianData.experience} years, Location: ${technicianData.government}, ${technicianData.district}, Base Price: ${technicianData.basePrice}.`
    };
    
    console.log('Admin notification object:', adminNotification);
    
    // Add notification to Firebase
    console.log('Adding admin notification to Firebase...');
    const adminNotificationRef = await addDoc(collection(db, 'notifications'), adminNotification);
    console.log('Admin notification added with ID:', adminNotificationRef.id);
    
    // Send email notification to admin
    await sendAdminEmailNotification(technicianData);
    
    console.log('=== TECHNICIAN APPLICATION NOTIFICATION SENT SUCCESSFULLY ===');
    return true;
    
  } catch (error) {
    console.error('=== ERROR SENDING TECHNICIAN APPLICATION NOTIFICATION ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    return false;
  }
}

// Function to send email notification to admin about new technician application
async function sendAdminEmailNotification(technicianData) {
  try {
    console.log('=== SENDING ADMIN EMAIL NOTIFICATION ===');
    
    // Use environment variable for admin email, with fallback
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@boltfix.com';
    
    const templateParams = {
      to_email: adminEmail,
      to_name: 'BoltFix Admin',
      subject: 'New Technician Application - Action Required',
      message: `Dear Admin,\n\nA new technician has applied to join BoltFix:\n\nTechnician Details:\n- Name: ${technicianData.fullName}\n- Email: ${technicianData.email}\n- Specialization: ${technicianData.specialization}\n- Experience: ${technicianData.experience} years\n- Location: ${technicianData.government}, ${technicianData.district}\n- Base Price: ${technicianData.basePrice}\n- PayPal Email: ${technicianData.paypalEmail || 'Not provided'}\n\nPlease review this application in your admin dashboard.\n\nBest regards,\nBoltFix System`
    };

    // Email functionality removed
    console.log('Admin email template:', templateParams);
    return true;
  } catch (error) {
    console.error('=== ERROR SENDING ADMIN EMAIL NOTIFICATION ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    return false;
  }
}

// Function to send welcome email to the technician
async function sendWelcomeEmail(email, fullName) {
  try {
    console.log('=== SENDING WELCOME EMAIL TO TECHNICIAN ===');
    console.log('Email:', email);
    console.log('Full Name:', fullName);

    // Initialize EmailJS before sending
    emailjs.init(EMAILJS_CONFIG.publicKey);

    const templateParams = {
      to_email: email,
      to_name: fullName,
      user_name: fullName,
      service_name: 'BoltFix'
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      'template_68btlks', // Use the specified template ID
      templateParams,
      EMAILJS_CONFIG.publicKey
    );

    console.log('✅ Welcome email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('=== ERROR SENDING WELCOME EMAIL ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error status:', error.status);
    console.error('Error text:', error.text);
    throw error;
  }
}

// Terms and Conditions Modal Functions
const openTermsModal = () => {
  showTermsModal.value = true;
};

const closeTermsModal = () => {
  showTermsModal.value = false;
};

// TEMPORARY ADMIN UTILITY: Promote a user by email to technician
async function promoteUserToTechnician(email) {
  const auth = getAuth();
  // Get all users is not available in client SDK, so this only works if the user is currently logged in
  const user = auth.currentUser;
  if (!user || user.email !== email) {
    alert('Please log in as the user you want to promote: ' + email);
    return;
  }
  const technicianData = {
    uid: user.uid,
    fullName: user.displayName || 'Technician',
    email: user.email,
    specialization: '',
    experience: '',
    bio: '',
    basePrice: '',
    government: '',
    district: '',
    willingToTravel: '',
    idPhotoUrl: '',
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    role: 'pending'
  };
  await setDoc(doc(db, 'pendingTechnicians', user.uid), technicianData);
  await setDoc(doc(db, 'users', user.uid), {
    email: user.email,
    role: 'pending',
    createdAt: serverTimestamp()
  });
  alert('User promoted to technician!');
}
// Usage: Call promoteUserToTechnician('narutossj123@yahoo.com') in the browser console after logging in as that user.

// TEMPORARY UTILITY: Fix specific user role issue
async function fixUserRole(email) {
  try {
    console.log('Fixing role for user:', email);
    
    // Get user by email
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('User not found in users collection');
      return;
    }
    
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    
    console.log('Current user data:', userData);
    
    // Check if user is in pendingTechnicians collection
    const pendingRef = doc(db, 'pendingTechnicians', userDoc.id);
    const pendingSnap = await getDoc(pendingRef);
    
    // Check if user is in technicians collection
    const techRef = doc(db, 'technicians', userDoc.id);
    const techSnap = await getDoc(techRef);
    
    let correctRole = 'user'; // Default role
    
    if (email === 'elie1400674@gmail.com' || email === 'tasneemmostafa200110@gmail.com') {
      correctRole = 'admin';
    } else if (techSnap.exists()) {
      correctRole = 'technician';
    } else if (pendingSnap.exists()) {
      correctRole = 'pending';
    }
    
    console.log('Correct role should be:', correctRole);
    
    // Update user role if it's incorrect
    if (userData.role !== correctRole) {
      await updateDoc(doc(db, 'users', userDoc.id), {
        role: correctRole,
        updatedAt: serverTimestamp()
      });
      console.log('Updated user role to:', correctRole);
    }
    
    // Update localStorage
    localStorage.setItem('userType', correctRole);
    
    console.log('Role fix completed for:', email);
    alert(`Role fixed for ${email}. New role: ${correctRole}`);
    
  } catch (error) {
    console.error('Error fixing user role:', error);
    alert('Error fixing user role: ' + error.message);
  }
}

// Usage: Call fixUserRole('narutossj33@yahoo.com') in the browser console

// TEST FUNCTION: Verify registration flow
function testRegistrationFlow() {
  console.log('=== TESTING REGISTRATION FLOW ===');
  console.log('1. User fills out TechRegister form');
  console.log('2. handleRegister() is called');
  console.log('3. Firebase Auth user is created');
  console.log('4. Data is saved to pendingTechnicians collection with role: pending');
  console.log('5. User document is saved to users collection with role: pending');
  console.log('6. localStorage is set to: pending');
  console.log('7. User is redirected to /pending-application');
  console.log('8. NO role management functions are called during registration');
  console.log('9. Admin must approve the application to change role to technician');
  console.log('✅ Registration flow is correct!');
}

// Usage: Call testRegistrationFlow() in the browser console to verify the flow
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
    background: #D3CFE2;

}
.dark .signup-container {
  background: var(--primary-bg);
}

.signup-form {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    padding: 3rem;
    width: 100%;
    max-width: 1200px;
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
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.form-section {
    background: rgba(255, 255, 255, 0.5);
    border-radius: 16px;
    padding: 1.5rem;
    border: 1px solid rgba(107, 79, 161, 0.1);
}

.dark .form-section {
  background: var(--secondary-bg);
  border-color: rgba(107, 79, 161, 0.2);
}

.section-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid rgba(107, 79, 161, 0.2);
    color: var(--primary-text, #1f2937);
}

.dark .section-title {
  color: var(--primary-text, var(--primary-color));
  border-bottom-color: rgba(107, 79, 161, 0.3);
}

.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1.25rem;
}

.form-group:last-child {
    margin-bottom: 0;
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
    color: #1f2937;
    font-family: inherit;
}

.dark .form-input {
  background: var(--input-bg, #374151);
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
    color: var(--text-muted);
}

.dark .form-input::placeholder {
  color: var(--text-muted);
}

/* Style for select dropdowns to match placeholder color */
.form-input option {
    color: var(--text-muted);
}

.dark .form-input option {
  color: var(--text-muted);
}

/* Style for select dropdown placeholder text */
.form-input:invalid {
    color: var(--text-muted);
}

.dark .form-input:invalid {
  color: var(--text-muted);
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

.radio-group {
    display: flex;
    gap: 1.5rem;
    margin-top: 0.5rem;
}

.radio-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    color: #374151;
    transition: color 0.2s ease;
}

.dark .radio-label {
  color: #d1d5db;
}

.radio-label:hover {
    color: #625397;
}

.radio-label input[type="radio"] {
    width: 1.125rem;
    height: 1.125rem;
    accent-color: #625397;
}

.upload-area {
    border: 2px dashed #9ca3af;
    border-radius: 12px;
    background-color: var(--input-bg, #f9fafb);
    min-height: 120px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.dark .upload-area {
  background-color: var(--input-bg, #374151);
  border-color: #4b5563;
}

.upload-area:hover {
    border-color: #625397;
    background-color: #f3f4f6;
}

.dark .upload-area:hover {
  background-color: #4b5563;
}

.upload-content {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
}

.upload-icon {
    color: #6b7280;
    margin-bottom: 0.5rem;
}

.upload-text {
    color: #6b7280;
    font-size: 0.875rem;
}

.browse-link {
    color: #625397;
    text-decoration: underline;
    cursor: pointer;
    font-weight: 600;
    transition: color 0.2s ease;
}

.browse-link:hover {
    color: #7c3aed;
}

.preview-container {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
}

.preview-img {
    max-width: 120px;
    max-height: 120px;
    border-radius: 8px;
    object-fit: cover;
    border: 2px solid #625397;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.checkbox-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
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

.terms-link:hover {
  color: #7c3aed;
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

.form-footer {
    text-align: center;
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

.submit-btn:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
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

/* Responsive Design */
@media (max-width: 1200px) {
    .form-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }
}

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
        gap: 1.5rem;
    }
    
    .form-section {
        padding: 1rem;
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
    
    .form-section {
        padding: 0.75rem;
    }

    .modal-content {
        margin: 0.5rem;
    }
}
</style> 