<template>
  <div class="admin-dashboard-layout">
    <!-- Sidebar -->
    <userSidebar :activeTab="activeTab" />
    <!-- Main Content -->
    <div id="admin-profile-container" class="p-4 mr-20">
      <div id="admin-profile-wrapper">
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
          
          <!-- Profile Content -->
          <div v-else>
            <div id="admin-profile-card">
              <h2 class="page-title">{{ $t('personalInformation') }}</h2>
              <div id="admin-profile-content">
                <!-- Profile Image - Will be moved to top on mobile -->
                <div id="admin-profile-image" class="profile-image-mobile">
                  <img v-if="profileImageUrl" :src="profileImageUrl" alt="Profile" class="w-full h-full object-cover rounded" />
                  <i v-else class="fas fa-user" id="profile-icon"></i>
                </div>
                <div id="admin-profile-info">
                  <div class="info-block">
                    <span class="info-label">{{ $t('fullName') }}</span>
                    <span class="info-value">{{ form.fullName || 'Not provided' }}</span>
                  </div>
                  <div class="info-block">
                    <span class="info-label">{{ $t('emailAddress') }}</span>
                    <span class="info-value">{{ form.email || 'Not provided' }}</span>
                  </div>
                  <div class="info-block">
                    <span class="info-label">{{ $t('phoneNumber') }}</span>
                    <span class="info-value">{{ form.phone || 'Not provided' }}</span>
                  </div>
                  <div class="info-block">
                    <span class="info-label">{{ $t('gender') }}</span>
                    <span class="info-value">{{ form.gender || 'Not provided' }}</span>
                  </div>
                  <div class="info-block">
                    <span class="info-label">{{ $t('address') }}</span>
                    <span class="info-value">{{ form.address || 'Not provided' }}</span>
                  </div>
                  <div class="info-block">
                    <span class="info-label">{{ $t('city') }}</span>
                    <span class="info-value">{{ form.city || 'Not provided' }}</span>
                  </div>
                  <div class="info-block">
                    <span class="info-label">{{ $t('area') }}</span>
                    <span class="info-value">{{ form.area || 'Not provided' }}</span>
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeTab = ref('profile');
const profileImageUrl = ref('');
const loading = ref(true);
const error = ref(null);
const form = ref({
  fullName: '',
  email: '',
  phone: '',
  gender: '',
  address: '',
  city: '',
  area: ''
});

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

    console.log('Fetching profile for user:', user.uid);
    
    // Fetch user data from Firestore
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      console.log('User data from Firestore:', userData);
      
      // Set profile data from Firebase
      form.value = {
        fullName: userData.fullName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'N/A',
        email: userData.email || user.email || 'N/A',
        phone: userData.phone || 'N/A',
        gender: userData.gender || 'N/A',
        address: userData.address || `${userData.district || ''}${userData.district && userData.government ? ', ' : ''}${userData.government || ''}`.trim() || 'N/A',
        city: userData.city || 'N/A',
        area: userData.area || 'N/A'
      };
      
      // Set profile image if exists
      if (userData.profileImageUrl) {
        profileImageUrl.value = userData.profileImageUrl;
      }
      
      console.log('Profile data set:', form.value);
    } else {
      console.log('No user document found, using auth data');
      // Fallback to auth data if no Firestore document
      form.value = {
        fullName: user.displayName || 'N/A',
        email: user.email || 'N/A',
        phone: user.phoneNumber || 'N/A',
        gender: user.gender || 'N/A',
        address: user.address || 'N/A',
        city: user.city || 'N/A',
        area: user.area || 'N/A'
      };
    }
    
  } catch (err) {
    console.error('Error fetching user profile:', err);
    error.value = 'Failed to load profile data: ' + err.message;
  } finally {
    loading.value = false;
  }
}

function handleSidebarNavigate(route) {
  router.push(route);
}

function triggerFileInput() {
  // This would need a ref to the file input element
  // For now, we'll implement this when needed
}

function onFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profileImageUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('User authenticated:', user.uid);
      fetchUserProfile();
    } else {
      console.log('No user authenticated');
      router.push('/userlogin');
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
  background-color: var(--primary-bg);
}

#admin-profile-container {
  background-color: #f9fafb;
  min-height: 100vh;
  font-family: sans-serif;
  flex: 1;
}

.dark #admin-profile-container {
  background-color: var(--primary-bg);
}


#admin-profile-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  width: auto;
}

.dark #admin-profile-card {
  background-color: var(--grey-bg);
}

/* Standardized Page Title Styles */
.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 2rem;
  text-align: left;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
}

.dark .page-title {
  color: var(--primary-color);
}

/* RTL Support for Arabic */
[dir="rtl"] #admin-profile-title {
  text-align: right;
}

[dir="rtl"] .info-label {
  text-align: right;
}

[dir="rtl"] .info-value {
  text-align: right;
}

#admin-profile-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (min-width: 768px) {
  #admin-profile-content {
    flex-direction: row;
    align-items: flex-start;
  }
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .layout {
    flex-direction: column;
    min-height: auto;
  }
  .admin-dashboard-layout {
    flex-direction: column;
  }
  
  #admin-profile-container {
    margin-top: 80px;
    padding: 1rem;
    margin-right: 0;
  }
  
  #admin-profile-wrapper {
    max-width: 100%;
  }
  
  #admin-profile-card {
    padding: 1.5rem;
    border-radius: 0.75rem;
  }
  
  .page-title {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
  
  /* Mobile: Image at top, info below */
  #admin-profile-content {
    flex-direction: column;
  }
  
  .profile-image-mobile {
    order: -1;
    margin-bottom: 1.5rem;
  }
  
  #admin-profile-image {
    width: 8rem;
    height: 8rem;
    margin: 0 auto;
  }
  
  #admin-profile-info {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .info-block {
    padding: 0.75rem;
    background-color: #f8f9fa;
    border-radius: 0.5rem;
  }
  
  .dark .info-block {
    background-color: var(--secondary-bg);
  }
  
  .info-label {
    font-size: 1rem;
  }
  
  .info-value {
    font-size: 0.875rem;
  }
  
  #profile-icon {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  #admin-profile-container {
    margin-top: 60px;
    padding: 0.75rem;
  }
  
  #admin-profile-card {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.125rem;
  }
  
  .info-block {
    padding: 0.5rem;
  }
  
  .info-label {
    font-size: 0.875rem;
  }
  
  .info-value {
    font-size: 0.75rem;
  }
  
  #admin-profile-image {
    width: 6rem;
    height: 6rem;
  }
  
  #profile-icon {
    font-size: 2rem;
  }
}

#admin-profile-info {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.info-block {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 1.125rem;
  font-weight: bold;
  color: #333;
}

.dark .info-label {
  color: var(--white);
}

.info-value {
  font-size: 1rem;
  color: #4b5563;
  margin-top: 0.25rem;
}

.dark .info-value {
  color: var(--muted-text);
}

#admin-profile-image {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10rem;
  height: 10rem;
  background-color: #e5e7eb;
  border-radius: 0.5rem;
  margin: 0 auto;
}

.dark #admin-profile-image {
  background-color: var(--primary-bg);
}

#profile-icon {
  font-size: 3.5rem;
  color: #9ca3af;
}

.dark #profile-icon {
  color: var(--grey-bg);
}
</style>