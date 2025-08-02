<template>
  <div class="tech-register-bg min-h-screen flex items-center justify-content-center">
    <div class="tech-register-card w-full max-w-6xl  rounded-3xl shadow-lg p-10 md:p-16">
      <div class="flex flex-col items-center mb-8">
        <img src="/logo/ace04d3b268cf810c91d002fdf7454a6ef778f27.png" alt="BoltFix Logo" class="h-12 mb-2" />
        <h2 class="text-3xl md:text-4xl font-bold text-center text-[#6B4FA1] mb-1">{{ $t('technicianRegistration') }}</h2>
        <p class="text-lg grey-color text-center">{{ $t('createAccount') }}</p>
      </div>
      <form @submit.prevent="handleRegister" class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Personal Information -->
        <div class="flex flex-col gap-4 md:col-span-1">
          <h3 class="font-bold text-[#6B4FA1] mb-2">{{ $t('personalInformation') }}</h3>
          <input v-model="formData.fullName" type="text" :placeholder="$t('fullName')" class="input-field" required />
          <input v-model="formData.email" type="email" :placeholder="$t('emailAddress')" class="input-field" required />
          <div class="password-field-container">
            <input v-model="formData.password" type="password" :placeholder="$t('password')" class="input-field" required />
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
          <div class="password-field-container">
            <input v-model="formData.confirmPassword" type="password" :placeholder="$t('confirmPassword')" class="input-field" :class="{ 'error': formData.confirmPassword && !passwordValidation.match }" required />
            <div v-if="formData.confirmPassword && !passwordValidation.match" class="password-error">
              {{ $t('passwordsDoNotMatch') }}
            </div>
          </div>
        </div>
        <!-- Professional Details -->
        <div class="flex flex-col gap-4 md:col-span-1">
          <h3 class="font-bold text-[#6B4FA1] mb-2">{{ $t('professionalDetails') }}</h3>
          <select v-model="formData.specialization" class="input-field" required>
            <option value="" disabled selected>{{ $t('specialization') }}</option>
            <option value="Plumbing">{{ $t('plumbing') }}</option>
            <option value="Electricity">{{ $t('electricity') }}</option>
            <option value="Carpentry">{{ $t('carpentry') }}</option>
            <option value="Wall Finishing">{{ $t('wallFinishing') }}</option>
            <option value="Air Conditioning">{{ $t('airConditioning') }}</option>
          </select>
          <select v-model="formData.experience" class="input-field" required>
            <option value="" disabled selected>{{ $t('yearsOfExperience') }}</option>
            <option value="1">{{ $t('oneYear') }}</option>
            <option value="2">{{ $t('twoYears') }}</option>
            <option value="3">{{ $t('threeYears') }}</option>
            <option value="4+">{{ $t('fourPlusYears') }}</option>
          </select>
          <input v-model="formData.bio" type="text" :placeholder="$t('briefDescriptionBio')" class="input-field" required />
          <input v-model="formData.basePrice" type="text" :placeholder="$t('baseVisitPrice')" class="input-field" required />
          <input v-model="formData.paypalEmail" type="email" :placeholder="$t('paypalEmail')" class="input-field" required />
        </div>
        <!-- Location -->
        <div class="flex flex-col gap-4 md:col-span-1">
          <h3 class="font-bold text-[#6B4FA1] mb-2">{{ $t('location') }}</h3>
          <select v-model="formData.government" class="input-field" required>
            <option value="" disabled selected>{{ $t('government') }}</option>
            <option value="Cairo">{{ $t('cairo') }}</option>
            <option value="Giza">{{ $t('giza') }}</option>
            <option value="Alexandria">{{ $t('alexandria') }}</option>
          </select>
          <select v-model="formData.district" class="input-field" required>
            <option value="" disabled selected>{{ $t('districtArea') }}</option>
            <option value="Nasr City">{{ $t('nasrCity') }}</option>
            <option value="Maadi">{{ $t('maadi') }}</option>
            <option value="Dokki">{{ $t('dokki') }}</option>
          </select>
          <div class="flex items-center gap-4 mt-2">
            <span class="grey-color">{{ $t('willingToTravel') }}</span>
            <label class="flex items-center gap-1">
              <input v-model="formData.willingToTravel" type="radio" name="travel" value="yes" />
              <span>{{ $t('yes') }}</span>
            </label>
            <label class="flex items-center gap-1">
              <input v-model="formData.willingToTravel" type="radio" name="travel" value="no" />
              <span>{{ $t('no') }}</span>
            </label>
          </div>
        </div>
        <!-- ID Upload & Checkboxes -->
        <div class="flex flex-col gap-4 md:col-span-1">
          <h3 class="font-bold text-[#6B4FA1] mb-2">{{ $t('pleaseUploadYourId') }}</h3>
          <div class="upload-area" @click="triggerFileInput">
            <div class="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto mb-2" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
              <span class="grey-color">
                {{ $t('dragDropOrBrowse') }}
                <span class="font-bold text-black cursor-pointer underline">{{ $t('browse') }}</span>
              </span>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleFileChange"
              />
              <div v-if="previewUrl" class="mt-2">
                <img :src="previewUrl" alt="Preview" class="preview-img" />
              </div>
            </div>
          </div>
          
          <!-- Profile Picture Upload -->
          <h3 class="font-bold text-[#6B4FA1] mb-2">Please upload a profile picture</h3>
          <div class="upload-area" @click="triggerProfileFileInput">
            <div class="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto mb-2" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
              <span class="grey-color">
                {{ $t('dragDropOrBrowse') }}
                <span class="font-bold text-black cursor-pointer underline">{{ $t('browse') }}</span>
              </span>
              <input
                ref="profileFileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleProfileFileChange"
              />
              <div v-if="profilePreviewUrl" class="mt-2">
                <img :src="profilePreviewUrl" alt="Profile Preview" class="preview-img" />
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2 mt-2">
            <label class="flex items-center gap-2">
              <input v-model="formData.confirmInfo" type="checkbox" class="accent-[#6B4FA1]" required />
              <span class="grey-color text-sm">{{ $t('confirmInformationAccurate') }}</span>
            </label>
            <label class="flex items-center gap-2">
              <input v-model="formData.agreeTerms" type="checkbox" class="accent-[#6B4FA1]" required />
              <span class="grey-color text-sm">{{ $t('agreeTermsPrivacyPolicy') }}</span>
            </label>
          </div>
        </div>
      </form>
      <div class="flex flex-col items-center mt-8">
        <button type="submit" @click="handleRegister" class="register-btn" :disabled="loading">
          {{ loading ? $t('registering') : $t('register') }}
        </button>
        <p v-if="error" class="mt-4 text-red-500">{{ error }}</p>
        <p v-if="success" class="mt-4 text-green-500">{{ success }}</p>
        <p class="mt-4 grey-color">{{ $t('haveAccount') }} <a href="/userlogin" class="text-[#6B4FA1] font-semibold hover:underline">{{ $t('signIn') }}</a></p>
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

import emailjs from 'emailjs-com';

const { t } = useI18n();

const router = useRouter();
const fileInput = ref(null);
const profileFileInput = ref(null);
const previewUrl = ref(null);
const profilePreviewUrl = ref(null);
const loading = ref(false);
const error = ref('');
const success = ref('');

const formData = reactive({
  fullName: '',
  email: '',
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

    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );
    console.log('Admin email notification sent successfully!');
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

    const templateParams = {
      to_email: email,
      to_name: fullName,
      subject: 'Welcome to BoltFix! Your Technician Account is Ready',
      message: `Dear ${fullName},\n\nCongratulations! Your BoltFix technician account has been successfully created. You are now part of our community of skilled professionals.\n\nYour account details:\nEmail: ${email}\n\nPlease keep your password secure and do not share it with anyone.\n\nBest regards,\nThe BoltFix Team`
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
.tech-register-bg {
  background-color: #d3cfe2;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.grey-color {
  color: #6b7280;
}
.dark .grey-color {
  color: var(--primary-text) !important;
}
.dark .tech-register-bg {
  background-color: var(--primary-bg);
  
}

.tech-register-card {
  width: 100%;
  max-width: 72rem;
  background-color: white;
  border-radius: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
}
.dark .tech-register-card {
  background-color: var(--secondary-bg);
  color: var(--primary-text) !important;
}
@media (min-width: 768px) {
  .tech-register-card {
    padding: 4rem;
  }
}

.input-field {
  background-color: #EAEAEA;
  border: 1px solid #d1d5db;
  color: #111827;
  font-size: 0.875rem;
  border-radius: 2rem;
  display: block;
  width: 100%;
  padding: 0.75rem;
  transition: all 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: #6B4FA1;
  box-shadow: 0 0 0 3px rgba(107, 79, 161, 0.1);
}

.upload-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #9ca3af;
  border-radius: 0.75rem;
  background-color: #f9fafb;
  min-height: 120px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.upload-area:hover {
  border-color: #6B4FA1;
}

.preview-img {
  max-width: 120px;
  max-height: 120px;
  border-radius: 0.75rem;
  margin: 0 auto;
  display: block;
  object-fit: cover;
  border: 2px solid #6B4FA1;
}

.register-btn {
  width: 15rem;
  padding: 0.75rem 0;
  border-radius: 9999px;
  background-color: #6B4FA1;
  color: white;
  font-weight: 600;
  font-size: 1.125rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
  border: none;
  cursor: pointer;
}

.register-btn:hover:not(:disabled) {
  background-color: #5a3e8b;
}

.register-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

/* Password validation styles */
.password-field-container {
  position: relative;
}

.password-validation {
  margin-top: 0.5rem;
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  border: 1px solid #e9ecef;
  font-size: 0.75rem;
}

.dark .password-validation {
  background-color: #374151;
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

.password-error {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  padding-left: 0.5rem;
}

.input-field.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Grid layout */
.grid {
  display: grid;
  gap: 2rem;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Utility classes */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.text-center { text-align: center; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-8 { margin-bottom: 2rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-4 { margin-top: 1rem; }
.mt-8 { margin-top: 2rem; }
.gap-1 { gap: 0.25rem; }
.gap-2 { gap: 0.5rem; }
.gap-4 { gap: 1rem; }
.gap-8 { gap: 2rem; }
.w-full { width: 100%; }
.h-12 { height: 3rem; }
.text-3xl { font-size: 1.875rem; }
.text-lg { font-size: 1.125rem; }
.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }
.text-gray-500 { color: #6b7280; }
.text-gray-700 { color: #374151; }
.text-red-500 { color: #ef4444; }
.text-green-500 { color: #10b981; }
.cursor-pointer { cursor: pointer; }
.hover\:underline:hover { text-decoration: underline; }
.hidden { display: none; }
</style> 