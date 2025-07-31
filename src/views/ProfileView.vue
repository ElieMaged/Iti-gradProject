<template>
  <div class="admin-dashboard-layout">
    <userSidebar :activeTab="activeTab" />
    <div class="profile-main p-4">
      <div class="profile-wrapper">
        
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div class="loading-spinner mx-auto mb-4"></div>
          <p class="text-lg text-gray-600">{{ $t('loadingProfileData') }}</p>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <p class="text-lg text-red-600 mb-4">{{ error }}</p>
          <button @click="fetchUserProfile" class="bg-secondary text-white px-4 py-2 rounded-lg">
            {{ $t('retry') }}
          </button>
        </div>
        
        <!-- Incomplete Profile State -->
        <div v-else-if="!isProfileComplete" class="text-center py-12">
          <div class="incomplete-profile-card">
            <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
            <h2 class="text-xl font-bold text-red-600 mb-2">{{ $t('incompleteProfile') }}</h2>
            <p class="text-gray-600 mb-6">{{ $t('pleaseFillOutSettings') }}</p>
            <button @click="goToSettings" class="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors">
              {{ $t('goToSettings') }}
            </button>
          </div>
        </div>
        
          <!-- Profile Content -->
        <div v-else class="profile-card">
          <div class="profile-header">
            <h2 class="profile-title">{{ $t('personalInformation') }}</h2>
              </div>
          
          <div class="profile-content">
            <!-- Profile Image Section -->
            <div class="profile-image-section">
              <div class="profile-image-container">
                <img 
                  v-if="profileImageUrl && profileImageUrl !== ''" 
                  :src="profileImageUrl" 
                  alt="Profile Photo" 
                  class="profile-image" 
                />
                <div v-else class="profile-image-placeholder">
                  <i class="fas fa-user"></i>
              </div>
              </div>
              <div class="profile-image-info">
                <h3 class="profile-name">{{ form.fullName || $t('fullName') }}</h3>
                <p class="profile-role">{{ $t('user') }}</p>
              </div>
            </div>
            
            <!-- Profile Information Section -->
            <div class="profile-info-section">
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-icon">
                    <i class="fas fa-user"></i>
                  </div>
                  <div class="info-content">
                    <label class="info-label">{{ $t('fullName') }}</label>
                    <span class="info-value">{{ form.fullName || $t('notProvided') }}</span>
                  </div>
                </div>
                
                <div class="info-item">
                  <div class="info-icon">
                    <i class="fas fa-envelope"></i>
                  </div>
                  <div class="info-content">
                    <label class="info-label">{{ $t('emailAddress') }}</label>
                    <span class="info-value">{{ form.email || $t('notProvided') }}</span>
                  </div>
                </div>
                
                <div class="info-item">
                  <div class="info-icon">
                    <i class="fas fa-phone"></i>
                  </div>
                  <div class="info-content">
                    <label class="info-label">{{ $t('phoneNumber') }}</label>
                    <span class="info-value">{{ form.phone || $t('notProvided') }}</span>
                  </div>
                </div>
                
                <div class="info-item">
                  <div class="info-icon">
                    <i class="fas fa-venus-mars"></i>
                  </div>
                  <div class="info-content">
                    <label class="info-label">{{ $t('gender') }}</label>
                    <span class="info-value">{{ form.gender || $t('notProvided') }}</span>
                  </div>
                </div>
                
                <div class="info-item">
                  <div class="info-icon">
                    <i class="fas fa-map-marker-alt"></i>
                  </div>
                  <div class="info-content">
                    <label class="info-label">{{ $t('address') }}</label>
                    <span class="info-value">{{ form.address || $t('notProvided') }}</span>
                  </div>
                </div>
                
                <div class="info-item">
                  <div class="info-icon">
                    <i class="fas fa-city"></i>
                  </div>
                  <div class="info-content">
                    <label class="info-label">{{ $t('city') }}</label>
                    <span class="info-value">{{ form.city || $t('notProvided') }}</span>
                  </div>
                </div>
                
                <div class="info-item">
                  <div class="info-icon">
                    <i class="fas fa-map"></i>
                  </div>
                  <div class="info-content">
                    <label class="info-label">{{ $t('area') }}</label>
                    <span class="info-value">{{ form.area || $t('notProvided') }}</span>
                  </div>
                </div>
                
                <div class="info-item">
                  <div class="info-icon">
                    <i class="fas fa-birthday-cake"></i>
                  </div>
                  <div class="info-content">
                    <label class="info-label">{{ $t('age') }}</label>
                    <span class="info-value">{{ form.age || $t('notProvided') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import userSidebar from '../components/userSidebar.vue';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();
const activeTab = ref('profile');
const profileImageUrl = ref('');
const loading = ref(true);
const error = ref(null);
const form = ref({
  fullName: '',
  email: '',
  phone: '',
  gender: '',
  age: '',
  address: '',
  city: '',
  area: ''
});

// Check if profile is complete
const isProfileComplete = computed(() => {
  const requiredFields = ['fullName', 'email', 'phone', 'gender', 'address', 'city', 'area'];
  return requiredFields.every(field => {
    const value = form.value[field];
    return value && value.trim() !== '' && value !== 'N/A' && value !== 'Not provided' && value !== t('notProvided');
  });
});

const goToSettings = () => {
  router.push('/profile-edit');
};

async function fetchUserProfile() {
  try {
    loading.value = true;
    error.value = null;
    
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      error.value = 'User not authenticated';
      router.push('/userlogin');
      return;
    }

    // Fetch user data from Firestore
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      
      // Set profile data from Firebase
      form.value = {
        fullName: userData.fullName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || '',
        email: userData.email || user.email || '',
        phone: userData.phone || '',
        gender: userData.gender || '',
        age: userData.age || '',
        address: userData.address || '',
        city: userData.city || '',
        area: userData.area || ''
      };
      
      // Set profile image if exists
      if (userData.profileImageUrl) {
        profileImageUrl.value = userData.profileImageUrl;
      }
    } else {
      // Fallback to auth data if no Firestore document
      form.value = {
        fullName: '',
        email: user.email || '',
        phone: '',
        gender: '',
        age: '',
        address: '',
        city: '',
        area: ''
      };
    }
    
  } catch (err) {
    console.error('Error fetching user profile:', err);
    error.value = 'Failed to load profile data: ' + err.message;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      fetchUserProfile();
    } else {
      loading.value = false;
      error.value = 'Please log in to view your profile.';
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

.profile-main {
  background-color: #f9fafb;
  min-height: 100vh;
  font-family: sans-serif;
  flex: 1;
  margin-left: 0;
  transition: margin-left 0.3s ease;
}

@media (min-width: 769px) {
  .profile-main {
    margin-left: 20rem;
  }
}

.dark .admin-dashboard-layout {
  background-color: var(--primary-bg);
}

.dark .profile-main {
  background-color: var(--primary-bg);
}

.profile-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.profile-card {
  background-color: white;
  border-radius: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 2.5rem;
  margin-top: 1rem;
}

.dark .profile-card {
  background-color: var(--grey-bg);
}

.profile-header {
  margin-bottom: 2rem;
}

.profile-title {
  font-size: 2rem;
  font-weight: bold;
  color: #7c6bb0;
  margin: 0;
}

.dark .profile-title {
  color: var(--white);
}

.profile-content {
  display: flex;
  gap: 3rem;
  align-items: flex-start;
}

/* Profile Image Section */
.profile-image-section {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.profile-image-container {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.profile-image-placeholder i {
  font-size: 4rem;
  color: white;
}

.profile-image-info {
  text-align: center;
}

.profile-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.dark .profile-name {
  color: var(--white);
}

.profile-role {
  font-size: 1rem;
  color: #7c6bb0;
  margin: 0;
  font-weight: 500;
}

/* Profile Information Section */
.profile-info-section {
  flex: 1;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 1rem;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.dark .info-item {
  background: var(--input-bg);
  border-color: #4a5568;
}

.info-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.info-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c6bb0 0%, #625397 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon i {
  font-size: 1.2rem;
  color: white;
}

.info-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dark .info-label {
  color: var(--text-muted);
}

.info-value {
  font-size: 1.125rem;
  font-weight: 500;
  color: #374151;
  word-break: break-word;
}

.dark .info-value {
  color: var(--primary-text-dark);
}

/* Incomplete Profile Styles */
.incomplete-profile-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  padding: 3rem 2rem;
  max-width: 500px;
  margin: 0 auto;
}

.dark .incomplete-profile-card {
  background-color: var(--grey-bg);
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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* RTL Support for Arabic */
[dir="rtl"] .profile-title {
  text-align: right;
}

[dir="rtl"] .profile-image-info {
  text-align: center;
}

[dir="rtl"] .info-item {
  flex-direction: row-reverse;
}

[dir="rtl"] .info-content {
  text-align: right;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .profile-wrapper {
    max-width: 1000px;
  }
  
  .profile-card {
    padding: 2rem;
  }
  
  .profile-content {
    gap: 2rem;
  }
  
  .profile-image-container {
    width: 180px;
    height: 180px;
  }
  
  .info-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.25rem;
  }
}

@media (max-width: 768px) {
  .profile-main {
    padding: 1rem;
  }
  
  .profile-card {
    padding: 1.5rem;
    margin-top: 0.5rem;
  }
  
  .profile-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .profile-content {
    flex-direction: column;
    gap: 2rem;
    align-items: center;
  }
  
  .profile-image-container {
    width: 150px;
    height: 150px;
  }
  
  .profile-image-placeholder i {
    font-size: 3rem;
  }
  
  .profile-name {
    font-size: 1.25rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .info-item {
    padding: 1.25rem;
  }
  
  .info-icon {
    width: 45px;
    height: 45px;
  }
  
  .info-icon i {
    font-size: 1.1rem;
  }
  
  .info-label {
    font-size: 0.8rem;
  }
  
  .info-value {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .profile-main {
    padding: 0.75rem;
  }
  
  .profile-card {
    padding: 1rem;
    margin-top: 0.25rem;
  }
  
  .profile-title {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
  
  .profile-content {
    gap: 1.5rem;
  }
  
  .profile-image-container {
    width: 120px;
    height: 120px;
  }
  
  .profile-image-placeholder i {
    font-size: 2.5rem;
  }
  
  .profile-name {
    font-size: 1.1rem;
  }
  
  .profile-role {
    font-size: 0.85rem;
  }
  
  .info-grid {
    gap: 0.75rem;
  }
  
  .info-item {
    padding: 1rem;
  }
  
  .info-icon {
    width: 40px;
    height: 40px;
  }
  
  .info-icon i {
    font-size: 1rem;
  }
  
  .info-label {
    font-size: 0.75rem;
  }
  
  .info-value {
    font-size: 0.9rem;
  }
}



@media (max-width: 360px) {
  .profile-main {
    padding: 0.5rem;
  }
  
  .profile-card {
    padding: 0.75rem;
  }
  
  .profile-title {
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
  }
  
  .profile-content {
    gap: 1rem;
  }
  
  .profile-image-container {
    width: 100px;
    height: 100px;
  }
  
  .profile-image-placeholder i {
    font-size: 2rem;
  }
  
  .profile-name {
    font-size: 1rem;
  }
  
  .info-grid {
    gap: 0.5rem;
  }
  
  .info-item {
    padding: 0.75rem;
  }
  
  .info-icon {
    width: 35px;
    height: 35px;
  }
  
  .info-icon i {
    font-size: 0.9rem;
  }
  
  .info-label {
    font-size: 0.7rem;
  }
  
  .info-value {
    font-size: 0.85rem;
  }
}

/* Landscape orientation adjustments */
@media (max-width: 768px) and (orientation: landscape) {
  .profile-content {
    flex-direction: row;
    gap: 1.5rem;
  }
  
  .profile-image-container {
    width: 120px;
    height: 120px;
  }
  
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
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
  .info-item {
    transition: none;
  }
  
  .loading-spinner {
    animation: none;
  }
}

/* Additional mobile optimizations */
@media (max-width: 320px) {
  .profile-main {
    padding: 0.5rem;
  }
  
  .profile-card {
    padding: 0.75rem;
  }
  
  .profile-title {
    font-size: 1rem;
    margin-bottom: 0.75rem;
  }
  
  .profile-content {
    gap: 1rem;
  }
  
  .profile-image-container {
    width: 80px;
    height: 80px;
  }
  
  .profile-image-placeholder i {
    font-size: 1.75rem;
  }
  
  .profile-name {
    font-size: 0.9rem;
  }
  
  .profile-role {
    font-size: 0.75rem;
  }
  
  .info-grid {
    gap: 0.5rem;
  }
  
  .info-item {
    padding: 0.75rem;
  }
  
  .info-icon {
    width: 35px;
    height: 35px;
  }
  
  .info-icon i {
    font-size: 0.9rem;
  }
  
  .info-label {
    font-size: 0.7rem;
  }
  
  .info-value {
    font-size: 0.8rem;
  }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .info-item {
    min-height: 44px;
  }
}
</style>