<template>
  <div class="admin-dashboard-layout">
    <userSidebar :activeTab="activeTab" @navigate="handleSidebarNavigate" />
    <div class="edit-profile-main p-4">
      <div class="edit-profile-wrapper">
        <div class="edit-profile-card">
          <div class="edit-profile-header">
            <h2>{{ $t('editProfileTitle') }}</h2>
          </div>
          
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-8">
            <div class="loading-spinner mx-auto mb-4"></div>
            <p class="text-lg text-gray-600">{{ $t('loadingProfileData') }}</p>
          </div>
          
          <!-- Error State -->
          <div v-else-if="error" class="text-center py-8">
            <p class="text-lg text-red-600 mb-4">{{ error }}</p>
            <button @click="loadUserData" class="bg-secondary text-white px-4 py-2 rounded-lg">
              {{ $t('retry') }}
            </button>
          </div>
          
          <!-- Success Message -->
          <div v-if="saveSuccess" class="success-message mb-4">
            <i class="fas fa-check-circle text-green-500 mr-2"></i>
            <span class="text-green-600 font-medium">{{ $t('profileSavedSuccessfully') }}</span>
          </div>
          
          <!-- Form Content -->
          <form v-if="!loading && !error" class="edit-profile-form" @submit.prevent="saveProfile">
            <div class="edit-profile-content">
                <div class="edit-profile-fields">
              <div class="flex flex-col items-center">
                <div class="profile-img-wrapper w-40 h-40 rounded-full overflow-hidden shadow-md mb-4">
                    <img :src="profileImageUrl || '/src/assets/Avatar.png'" alt="Profile Photo" class="w-full h-full object-cover" />
                  </div>
                  <input ref="fileInput" type="file" class="hidden" @change="onFileChange" accept="image/*" />
                  <button type="button" class="upload-btn bg-secondary text-white rounded px-4 py-2 mb-2" @click="triggerFileInput">{{ $t('uploadPhotoButton') }}</button>
                </div>
                <div>
                  <label for="fullName">{{ $t('fullNameLabel') }}</label>
                  <input type="text" id="fullName" v-model="form.fullName" required class="input-field" />
                </div>
                <div>
                  <label for="email">{{ $t('emailAddressLabel') }}</label>
                  <input type="email" id="email" v-model="form.email" required class="input-field" />
                </div>
                <div>
                  <label for="phone">{{ $t('phoneNumberLabel') }}</label>
                  <input type="text" id="phone" v-model="form.phone" required class="input-field" />
                </div>
                <div>
                  <label for="gender">{{ $t('gender') }}</label>
                  <select id="gender" v-model="form.gender" required class="input-field">
                    <option value="">{{ $t('selectGender') }}</option>
                    <option value="male">{{ $t('male') }}</option>
                    <option value="female">{{ $t('female') }}</option>
                    <option value="other">{{ $t('other') }}</option>
                  </select>
                </div>
                <div>
                  <label for="age">{{ $t('age') }}</label>
                  <input type="number" id="age" v-model="form.age" min="18" max="120" required class="input-field" />
                </div>
                <div>
                  <label for="address">{{ $t('address') }}</label>
                  <input type="text" id="address" v-model="form.address" required class="input-field" />
                </div>
                <div>
                  <label for="area">{{ $t('area') }}</label>
                  <input type="text" id="area" v-model="form.area" required class="input-field" />
                </div>
              <div>
                  <label for="city">{{ $t('city') }}</label>
                  <input type="text" id="city" v-model="form.city" required class="input-field" />
              </div>
              </div>
             
            </div>
            <div class="edit-profile-actions">
              <button type="submit" class="save-btn" :disabled="saving">
                <span v-if="saving" class="flex items-center">
                  <div class="loading-spinner-small mr-2"></div>
                  {{ $t('saving') }}
                </span>
                <span v-else>{{ $t('saveChangesButton') }}</span>
              </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { auth, db } from '../firebase';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import userSidebar from '../components/userSidebar.vue';

const router = useRouter();
const activeTab = ref('settings');
const loading = ref(true);
const saving = ref(false);
const error = ref('');
const saveSuccess = ref(false);
const profileImageUrl = ref('');
const fileInput = ref(null);

const form = ref({
  fullName: '',
  email: '',
  phone: '',
  gender: '',
  age: '',
  address: '',
  area: '',
  city: '',
});

const handleSidebarNavigate = (route) => {
  router.push(route);
};

const loadUserData = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    const currentUser = auth.currentUser;
    if (!currentUser) {
      error.value = 'User not authenticated';
      router.push('/userlogin');
      return;
    }

    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      form.value = {
        fullName: userData.fullName || '',
        email: userData.email || currentUser.email || '',
        phone: userData.phone || '',
        gender: userData.gender || '',
        age: userData.age || '',
        address: userData.address || '',
        area: userData.area || '',
        city: userData.city || '',
      };
      profileImageUrl.value = userData.profileImageUrl || '';
    } else {
      // If no document exists, create one with basic info
      form.value = {
        fullName: '',
        email: currentUser.email || '',
        phone: '',
        gender: '',
        age: '',
        address: '',
        area: '',
        city: '',
      };
    }
  } catch (err) {
    console.error('Error loading user data:', err);
    error.value = 'Failed to load user data: ' + err.message;
  } finally {
    loading.value = false;
  }
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const onFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
      profileImageUrl.value = e.target.result;
        };
        reader.readAsDataURL(file);
      }
};

const saveProfile = async () => {
  try {
    saving.value = true;
    saveSuccess.value = false;
    error.value = '';
    
    const currentUser = auth.currentUser;
    if (!currentUser) {
      error.value = 'User not authenticated';
      return;
    }

    const userRef = doc(db, 'users', currentUser.uid);
    
    // Prepare data to save
    const userData = {
      ...form.value,
      profileImageUrl: profileImageUrl.value,
      updatedAt: new Date(),
      uid: currentUser.uid
    };

    // Use setDoc with merge option to create or update the document
    await setDoc(userRef, userData, { merge: true });
    
    saveSuccess.value = true;
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      saveSuccess.value = false;
    }, 3000);
    
  } catch (err) {
    console.error('Error saving profile:', err);
    error.value = 'Failed to save profile: ' + err.message;
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loadUserData();
    } else {
      loading.value = false;
      error.value = 'Please log in to edit your profile.';
      setTimeout(() => {
        router.push('/userlogin');
      }, 2000);
    }
  });
});
</script>

<style scoped>
.admin-dashboard-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
  background: #faf8fd;
}
.dark .admin-dashboard-layout {
  background: var(--primary-bg);
}
.edit-profile-main {
  flex: 1;
  background: #f9fafb;
}
.dark .edit-profile-main {
  background: var(--primary-bg);
}
.dark .edit-profile-card {
  background: var(--grey-bg);
}
.edit-profile-wrapper {
  max-width: 1000px;
  margin: 0 auto;
}
.edit-profile-card {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 10px 15px rgba(0,0,0,0.08);
  padding: 2rem;
}
.dark .edit-profile-header h2 {
  color: var(--primary-text);
}
.dark .edit-profile-card {
  background: var(--grey-bg);
}
.edit-profile-header h2 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #7c6bb0;
  margin-bottom: 1.5rem;
}
.edit-profile-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.edit-profile-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
@media (min-width: 768px) {
  .edit-profile-content {
    flex-direction: row;
    align-items: flex-start;
  }
}
.edit-profile-fields {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.2rem;
}
.edit-profile-fields label {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}
.dark .edit-profile-fields label {
  color: var(--primary-text-dark);
}

/* Input field styling with border */
.input-field {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 0.3rem solid #e0e0e0;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: #f8f9fa;
  color: #333;
  transition: border-color 0.2s;
}

.dark .input-field {
  background: var(--input-bg);
  color: var(--text-muted);
  border-color: #4a5568;
}

.input-field:focus {
  border-color: #7c6bb0;
  outline: none;
}

.dark .input-field:focus {
  border-color: var(--secondary);
  outline: none;
}

.edit-profile-image-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  min-width: 140px;
}
.profile-image-container {
  width: 120px;
  height: 120px;
  background: #e5e7eb;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.dark .profile-image-container {
  background: var(--input-bg);
}
.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.profile-image-placeholder {
  font-size: 3.5rem;
  color: #9ca3af;
}
.dark .profile-image-placeholder {
  color: var(--text-muted);
}
.upload-btn {
  background: #7c6bb0;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.dark .upload-btn {
  background: var(--primary);
  color: var(--primary-text);
}
.upload-btn:hover {
  background: #5a4e99;
}
.dark .upload-btn:hover {
  background: var(--primary);
  color: var(--primary-text);
}
.hidden-input {
  display: none;
}
.edit-profile-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
}
.save-btn {
  background: #7c6bb0;
  color: #fff;
  border: none;
  border-radius: 2rem;
  padding: 0.75rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.dark .save-btn {
  background: var(--primary);
  color: var(--primary-text);
}
.save-btn:hover:not(:disabled) {
  background: #5a4e99;
}
.dark .save-btn:hover:not(:disabled) {
  background: var(--primary);
  color: var(--primary-text);
}

/* Success Message */
.success-message {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark .success-message {
  background: #064e3b;
  border-color: #059669;
}

/* Loading Spinner */
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #7c6bb0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* RTL Support for Arabic */
[dir="rtl"] .edit-profile-header h2 { text-align: right; }
[dir="rtl"] .edit-profile-fields label { text-align: right; }
[dir="rtl"] .edit-profile-section h3 { text-align: right; }
[dir="rtl"] .edit-profile-actions { justify-content: flex-start; }
[dir="rtl"] .edit-profile-content { direction: rtl; }
[dir="rtl"] .edit-profile-fields { direction: rtl; }

/* Responsive Design */
@media (max-width: 1200px) {
  .edit-profile-container {
    padding: 1.5rem;
  }
  
  .edit-profile-fields {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }
  
  .profile-image-container {
    width: 100px;
    height: 100px;
  }
  
  .profile-image-placeholder {
    font-size: 3rem;
  }
}

@media (max-width: 768px) {
  .edit-profile-container {
    padding: 1rem;
    margin: 0.5rem;
  }
  
  .edit-profile-header h2 {
    font-size: 1.5rem;
  }
  
  .edit-profile-content {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .edit-profile-fields {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .edit-profile-fields label {
    font-size: 0.95rem;
  }
  
  .input-field {
    padding: 0.75rem;
    font-size: 0.95rem;
  }
  
  .profile-image-container {
    width: 90px;
    height: 90px;
  }
  
  .profile-image-placeholder {
    font-size: 2.5rem;
  }
  
  .upload-btn {
    padding: 0.6rem 1.25rem;
    font-size: 0.9rem;
  }
  
  .edit-profile-actions {
    margin-top: 1.5rem;
  }
  
  .save-btn {
    padding: 0.6rem 2rem;
    font-size: 1rem;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .edit-profile-container {
    padding: 0.75rem;
    margin: 0.25rem;
  }
  
  .edit-profile-header h2 {
    font-size: 1.25rem;
  }
  
  .edit-profile-content {
    gap: 1rem;
  }
  
  .edit-profile-fields {
    gap: 0.75rem;
  }
  
  .edit-profile-fields label {
    font-size: 0.9rem;
  }
  
  .input-field {
    padding: 0.6rem;
    font-size: 0.9rem;
  }
  
  .profile-image-container {
    width: 80px;
    height: 80px;
  }
  
  .profile-image-placeholder {
    font-size: 2.25rem;
  }
  
  .upload-btn {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
  
  .edit-profile-actions {
    margin-top: 1rem;
  }
  
  .save-btn {
    padding: 0.5rem 1.5rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 360px) {
  .edit-profile-container {
    padding: 0.5rem;
    margin: 0.125rem;
  }
  
  .edit-profile-header h2 {
    font-size: 1.1rem;
  }
  
  .edit-profile-fields {
    gap: 0.6rem;
  }
  
  .edit-profile-fields label {
    font-size: 0.85rem;
  }
  
  .input-field {
    padding: 0.5rem;
    font-size: 0.85rem;
  }
  
  .profile-image-container {
    width: 70px;
    height: 70px;
  }
  
  .profile-image-placeholder {
    font-size: 2rem;
  }
  
  .upload-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
  
  .save-btn {
    padding: 0.4rem 1.25rem;
    font-size: 0.85rem;
  }
}

/* Landscape orientation adjustments */
@media (max-width: 768px) and (orientation: landscape) {
  .edit-profile-container {
    padding: 0.75rem;
  }
  
  .edit-profile-content {
    flex-direction: row;
    gap: 1rem;
  }
  
  .edit-profile-fields {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .profile-image-container {
    width: 80px;
    height: 80px;
  }
  
  .save-btn {
    width: auto;
  }
}

/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .profile-image {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .input-field {
    transition: none;
  }
  
  .upload-btn,
  .save-btn {
    transition: none;
  }
  
  .loading-spinner,
  .loading-spinner-small {
    animation: none;
  }
}

/* Additional mobile optimizations */
@media (max-width: 320px) {
  .edit-profile-main {
    padding: 0.5rem;
  }
  
  .edit-profile-card {
    padding: 0.75rem;
  }
  
  .edit-profile-header h2 {
    font-size: 1.1rem;
  }
  
  .edit-profile-fields {
    gap: 0.5rem;
  }
  
  .edit-profile-fields label {
    font-size: 0.8rem;
  }
  
  .input-field {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
  
  .profile-img-wrapper {
    width: 80px;
    height: 80px;
  }
  
  .upload-btn {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
  
  .save-btn {
    padding: 0.5rem 1.25rem;
    font-size: 0.8rem;
  }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .input-field {
    min-height: 44px;
  }
  
  .upload-btn,
  .save-btn {
    min-height: 44px;
  }
}
</style> 