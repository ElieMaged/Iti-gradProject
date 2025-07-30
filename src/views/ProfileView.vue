<template>
  <!-- Main Container -->
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <userSidebar :activeTab="activeTab" />
    <!-- Main Content -->
    <div class="flex-1">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-xl shadow-lg p-8">
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
            <!-- Header --> 
            <div class="mb-8">
              <h1 class="text-3xl font-bold text-text-main mb-2">{{ $t('helloUser', {
                name: profileData.fullName ||
                  $t('user')
              }) }}</h1>
              <h2 class="text-xl font-bold text-secondary">{{ $t('yourPersonalInformation') }}</h2>
            </div>
            <!-- Profile Content -->
            <div class="flex gap-8">
              <!-- Left Column - Information -->
              <div class="flex-1 space-y-6">
                <div>
                  <label class="block text-sm font-bold text-text-main mb-2">{{ $t('fullName') }}</label>
                  <input type="text" :value="profileData.fullName" disabled
                    class="input-field w-full px-4 py-3 rounded-lg text-sm">
                </div>
                <div>
                  <label class="block text-sm font-bold text-text-main mb-2">{{ $t('emailAddress') }}</label>
                  <input type="email" :value="profileData.email" disabled
                    class="input-field w-full px-4 py-3 rounded-lg text-sm">
                </div>
                <div>
                  <label class="block text-sm font-bold text-text-main mb-2">{{ $t('phoneNumber') }}</label>
                  <input type="text" :value="profileData.phone" disabled
                    class="input-field w-full px-4 py-3 rounded-lg text-sm">
                </div>
                <div>
                  <label class="block text-sm font-bold text-text-main mb-2">{{ $t('gender') }}</label>
                  <input type="text" :value="profileData.gender" disabled
                    class="input-field w-full px-4 py-3 rounded-lg text-sm">
                </div>
                <div>
                  <label class="block text-sm font-bold text-text-main mb-2">{{ $t('address') }}</label>
                  <input type="text" :value="profileData.address" disabled
                    class="input-field w-full px-4 py-3 rounded-lg text-sm">
                </div>
              </div>
              <!-- Right Column - Profile Image -->
              <div class="flex flex-col items-center space-y-4">
                              <div class="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden"
                id="profileImage">
                <img v-if="profileImageUrl && profileImageUrl !== 'https://randomuser.me/api/portraits/men/32.jpg'" :src="profileImageUrl" alt="Profile"
                  class="w-full h-full object-cover rounded-full" />
                <i v-else class="fas fa-user text-4xl text-gray-500"></i>
              </div>
                <button @click="triggerFileInput"
                  class="bg-secondary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors">{{
                    $t('uploadPhoto') }}</button>
                <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileChange" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import userSidebar from '../components/userSidebar.vue';

const { locale } = useI18n();
const router = useRouter();
const activeTab = ref('profile');
const profileImageUrl = ref(null);
const fileInput = ref(null);
const loading = ref(true);
const error = ref(null);
const profileData = ref({
  fullName: '',
  email: '',
  phone: '',
  gender: '',
  address: ''
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
      profileData.value = {
        fullName: userData.fullName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'N/A',
        email: userData.email || user.email || 'N/A',
        phone: userData.phone || 'N/A',
        gender: userData.gender || 'N/A',
        address: userData.address || `${userData.district || ''}${userData.district && userData.government ? ', ' : ''}${userData.government || ''}`.trim() || 'N/A'
      };
      
      // Set profile image if exists
      if (userData.profileImageUrl) {
        profileImageUrl.value = userData.profileImageUrl;
      }
      
      console.log('Profile data set:', profileData.value);
    } else {
      console.log('No user document found, using auth data');
      // Fallback to auth data if no Firestore document
      profileData.value = {
        fullName: 'N/A',
        email: user.email || 'N/A',
        phone: 'N/A',
        gender: 'N/A',
        address: 'N/A'
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
      console.log('User authenticated:', user.uid);
      fetchUserProfile();
    } else {
      console.log('No user authenticated');
      router.push('/userlogin');
    }
  });
});

function triggerFileInput() {
  fileInput.value && fileInput.value.click();
}

function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      profileImageUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function getRoute(path) {
  return locale.value === 'ar' ? `/ar/${path}` : `/${path}`;
}
</script>

<style scoped>
.sidebar-item {
  transition: all 0.2s ease;
}

.sidebar-item:hover {
  background-color: #c5b7e6;
  color: white;
}

.sidebar-item.active {
  background-color: #7c6bb0;
  color: white;
}

.input-field {
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  color: #666666;
}

.input-field:disabled {
  cursor: not-allowed;
  background-color: #f5f5f5;
  color: #666666;
}

.bg-primary {
  background-color: #ffd54f;
}

.bg-secondary {
  background-color: #7c6bb0;
}

.bg-sidebar {
  background-color: #ede7f6;
}

.text-primary {
  color: #ffd54f;
}

.text-secondary {
  color: #7c6bb0;
}

.text-text-main {
  color: #333333;
}

.text-muted {
  color: #aaaaaa;
}

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
</style>