<template>
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
          <h2 id="admin-profile-title">{{ $t('personalInformation') }}</h2>
          <div id="admin-profile-content">
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
            <div id="admin-profile-image">
              <img v-if="profileImageUrl" :src="profileImageUrl" alt="Profile" class="w-full h-full object-cover rounded" />
              <i v-else class="fas fa-user" id="profile-icon"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userSidebar from '../components/userSidebar.vue';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const activeTab = ref('profile');
const profileImageUrl = ref(null);
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

export default {
  components: { userSidebar },
  data() {
    return {
      activeTab: 'profile',
      profileImageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      loading: true,
      error: '',
      form: {
  fullName: '',
  email: '',
  phone: '',
  gender: '',
        address: '',
        city: '',
        area: '',
      }
    }
  },
  async mounted() {
    try {
      const user = auth.currentUser;
      if (!user) {
        this.error = 'Not logged in.';
        this.loading = false;
        return;
      }
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        this.form.fullName = data.fullName || '';
        this.form.email = data.email || '';
        this.form.phone = data.phone || '';
        this.form.gender = data.gender || '';
        this.form.address = data.address || '';
        this.form.city = data.city || '';
        this.form.area = data.area || '';
        this.profileImageUrl = data.profileImageUrl || this.profileImageUrl;
      } else {
        this.error = 'User profile not found.';
      }
    } catch (e) {
      this.error = 'Error loading profile.';
    } finally {
      this.loading = false;
    }
  },
  methods: {
    handleSidebarNavigate(route) {
      this.$router.push(route);
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    onFileChange(e) {
      const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
        reader.onload = (e) => {
          this.profileImageUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}
  }
}
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

#admin-profile-wrapper {
  max-width: 1000px;
}

#admin-profile-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  padding: 2rem;
}

.dark #admin-profile-card {
  background-color: var(--grey-bg);
}

#admin-profile-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #7c6bb0;
  margin-bottom: 1.5rem;
}

.dark #admin-profile-title {
  color: var(--white);
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
  color: var(--primary-text-dark);
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

/* Responsive Design */
@media (max-width: 1200px) {
  #admin-profile-container {
    padding: 1.5rem;
  }
  
  #admin-profile-info {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.25rem;
  }
  
  #admin-profile-image {
    width: 8rem;
    height: 8rem;
  }
  
  #profile-icon {
    font-size: 3rem;
  }
}

@media (max-width: 768px) {
  #admin-profile-container {
    padding: 1rem;
    margin: 0.5rem;
  }
  
  #admin-profile-title {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
  
  #admin-profile-content {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  #admin-profile-info {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .info-block {
    gap: 0.5rem;
  }
  
  .info-label {
    font-size: 1rem;
  }
  
  .info-value {
    font-size: 0.95rem;
  }
  
  #admin-profile-image {
    width: 6rem;
    height: 6rem;
  }
  
  #profile-icon {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  #admin-profile-container {
    padding: 0.75rem;
    margin: 0.25rem;
  }
  
  #admin-profile-title {
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
  }
  
  #admin-profile-content {
    gap: 1rem;
  }
  
  #admin-profile-info {
    gap: 0.75rem;
  }
  
  .info-block {
    gap: 0.4rem;
  }
  
  .info-label {
    font-size: 0.9rem;
  }
  
  .info-value {
    font-size: 0.85rem;
  }
  
  #admin-profile-image {
    width: 5rem;
    height: 5rem;
  }
  
  #profile-icon {
    font-size: 2.25rem;
  }
}

@media (max-width: 360px) {
  #admin-profile-container {
    padding: 0.5rem;
    margin: 0.125rem;
  }
  
  #admin-profile-title {
    font-size: 1rem;
    margin-bottom: 0.6rem;
  }
  
  #admin-profile-content {
    gap: 0.75rem;
  }
  
  #admin-profile-info {
    gap: 0.6rem;
  }
  
  .info-block {
    gap: 0.3rem;
  }
  
  .info-label {
    font-size: 0.85rem;
  }
  
  .info-value {
    font-size: 0.8rem;
  }
  
  #admin-profile-image {
    width: 4.5rem;
    height: 4.5rem;
  }
  
  #profile-icon {
    font-size: 2rem;
  }
}

/* Landscape orientation adjustments */
@media (max-width: 768px) and (orientation: landscape) {
  #admin-profile-container {
    padding: 0.75rem;
  }
  
  #admin-profile-content {
    flex-direction: row;
    gap: 1rem;
  }
  
  #admin-profile-info {
    grid-template-columns: repeat(2, 1fr);
  }
  
  #admin-profile-image {
    width: 5rem;
    height: 5rem;
  }
}

/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  #admin-profile-image img {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  #admin-profile-container {
    transition: none;
  }
}
</style>