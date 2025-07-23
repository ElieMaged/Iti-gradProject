<template>
  <div class="tech-register-bg flex items-center justify-content-center">
    <div class="tech-register-card w-full max-w-6xl bg-white rounded-3xl shadow-lg p-10 md:p-16">
      <div class="flex flex-col items-center mb-8">
        <img src="/logo/ace04d3b268cf810c91d002fdf7454a6ef778f27.png" alt="BoltFix Logo" class="h-12 mb-2" />
        <h2 class="text-3xl md:text-4xl font-bold text-center text-[#6B4FA1] mb-1">{{ $t('technicianRegistration') }}</h2>
        <p class="text-lg text-gray-500 text-center">{{ $t('createAccount') }}</p>
      </div>
      <form @submit.prevent="handleRegister" class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Personal Information -->
        <div class="flex flex-col gap-4 md:col-span-1">
          <h3 class="font-bold text-[#6B4FA1] mb-2">{{ $t('personalInformation') }}</h3>
          <input v-model="formData.fullName" type="text" :placeholder="$t('fullName')" class="input-field" required />
          <input v-model="formData.email" type="email" :placeholder="$t('emailAddress')" class="input-field" required />
          <input v-model="formData.password" type="password" :placeholder="$t('password')" class="input-field" required />
          <input v-model="formData.confirmPassword" type="password" :placeholder="$t('confirmPassword')" class="input-field" required />
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
            <span class="text-gray-700">{{ $t('willingToTravel') }}</span>
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
              <span class="text-gray-500">
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
          <div class="flex flex-col gap-2 mt-2">
            <label class="flex items-center gap-2">
              <input v-model="formData.confirmInfo" type="checkbox" class="accent-[#6B4FA1]" required />
              <span class="text-gray-700 text-sm">{{ $t('confirmInformationAccurate') }}</span>
            </label>
            <label class="flex items-center gap-2">
              <input v-model="formData.agreeTerms" type="checkbox" class="accent-[#6B4FA1]" required />
              <span class="text-gray-700 text-sm">{{ $t('agreeTermsPrivacyPolicy') }}</span>
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
        <p class="mt-4 text-gray-700">{{ $t('haveAccount') }} <a href="/userlogin" class="text-[#6B4FA1] font-semibold hover:underline">{{ $t('signIn') }}</a></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const router = useRouter();
const fileInput = ref(null);
const previewUrl = ref(null);
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
  agreeTerms: false
});

function triggerFileInput() {
  fileInput.value && fileInput.value.click();
}

function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    previewUrl.value = URL.createObjectURL(file);
    formData.idPhoto = file; // Store the file for upload
  }
}

async function handleRegister() {
  error.value = '';
  success.value = '';
  
  // Validation
  if (formData.password !== formData.confirmPassword) {
    error.value = $t('passwordsDoNotMatch');
    return;
  }
  
  if (!formData.confirmInfo || !formData.agreeTerms) {
    error.value = $t('pleaseConfirmCheckboxes');
    return;
  }
  
  loading.value = true;
  
  try {
    console.log('Starting registration process...');
    
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      formData.email, 
      formData.password
    );
    // Save technician data to Firestore
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
      idPhotoUrl: previewUrl.value, // For now, just store the preview URL
      status: 'pending', // Admin approval status
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, 'technicians'), technicianData);
    
    success.value = $t('registrationSuccessful');
    
    // Redirect after a short delay
    setTimeout(() => {
      router.push('/profile');
    }, 2000);
    
  } catch (err) {
    console.error('Registration error:', err);
    
    // Provide more specific error messages
    // if (err.code === 'permission-denied') {
    //   error.value = 'Permission denied. Please check your Firebase Firestore rules.';
    // } else if (err.code === 'unavailable') {
    //   error.value = 'Firestore is currently unavailable. Please try again later.';
    // } else if (err.code === 'auth/email-already-in-use') {
    //   error.value = 'An account with this email already exists.';
    // } else if (err.code === 'auth/weak-password') {
    //   error.value = 'Password should be at least 6 characters long.';
    // } else if (err.message.includes('Missing or insufficient permissions')) {
    //   error.value = 'Database permissions error. Please contact support or try again later.';
    // } else {
      error.value = $t('registrationFailed', { err: err.message });
    // }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.tech-register-bg {
  background-color: #d3cfe2;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tech-register-card {
  width: 100%;
  max-width: 72rem;
  background-color: white;
  border-radius: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
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