<template>
  <div class="flex min-h-screen">
    <userSidebar :activeTab="activeTab" />
    <div class="flex-1 p-8">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-xl shadow-lg p-8">
          <div class="profile-hero mb-6">
            <h2 class="profile-title text-2xl font-bold text-secondary">{{ $t('editProfileTitle') }}</h2>
          </div>
          <div class="profile-main flex flex-col md:flex-row gap-8 items-start">
            <div class="profile-card flex-1 flex flex-col gap-6">
              <div class="flex flex-col items-center">
                <div class="profile-img-wrapper w-40 h-40 rounded-full overflow-hidden shadow-md mb-4">
                  <img :src="profileImageUrl" alt="Technician Photo" class="w-full h-full object-cover" />
                </div>
                <input ref="fileInput" type="file" class="hidden" @change="onFileChange" />
                <button class="upload-btn bg-secondary text-white rounded px-4 py-2 mb-2" @click="triggerFileInput">{{ $t('uploadPhotoButton') }}</button>
              </div>
              <div class="profile-fields space-y-4">
                <div>
                  <label class="block text-sm font-bold text-text-main mb-1">{{ $t('fullNameLabel') }}</label>
                  <input v-model="form.fullName" type="text" class="input-field w-full px-4 py-2 rounded-lg text-sm" />
                </div>
                <div>
                  <label class="block text-sm font-bold text-text-main mb-1">{{ $t('emailAddressLabel') }}</label>
                  <input v-model="form.email" type="email" class="input-field w-full px-4 py-2 rounded-lg text-sm" />
                </div>
                <div>
                  <label class="block text-sm font-bold text-text-main mb-1">{{ $t('phoneNumberLabel') }}</label>
                  <input v-model="form.phone" type="text" class="input-field w-full px-4 py-2 rounded-lg text-sm" />
                </div>
                <div>
                  <label class="block text-sm font-bold text-text-main mb-1">{{ $t('gender') }}</label>
                  <select v-model="form.gender" class="input-field w-full px-4 py-2 rounded-lg text-sm">
                    <option value="">{{ $t('selectGender') }}</option>
                    <option value="Male">{{ $t('male') }}</option>
                    <option value="Female">{{ $t('female') }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-bold text-text-main mb-1">{{ $t('aboutLabel') }}</label>
                  <textarea v-model="form.bio" class="input-field w-full px-4 py-2 rounded-lg text-sm" rows="2"></textarea>
                </div>
              </div>
            </div>
            <!-- Address Section -->
            <div class="profile-address flex-1 space-y-4">
              <div>
                <label class="block text-sm font-bold text-text-main mb-1">{{ $t('cityLabel') }}</label>
                <select v-model="form.government" class="input-field w-full px-4 py-2 rounded-lg text-sm">
                  <option value="Cairo">{{ $t('cairo') }}</option>
                  <option value="Giza">{{ $t('giza') }}</option>
                  <option value="Alexandria">{{ $t('alexandria') }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-bold text-text-main mb-1">{{ $t('areaLabel') }}</label>
                <select v-model="form.district" class="input-field w-full px-4 py-2 rounded-lg text-sm">
                  <option value="Nasr City">{{ $t('nasrCity') }}</option>
                  <option value="Maadi">{{ $t('maadi') }}</option>
                  <option value="Dokki">{{ $t('dokki') }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="flex justify-end mt-8">
            <button class="bg-secondary text-white px-10 py-2 rounded-full text-lg font-medium hover:bg-opacity-90 transition-colors" @click="saveProfile">{{ $t('saveChangesButton') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import userSidebar from '../components/userSidebar.vue';

const router = useRouter();
const activeTab = ref('settings');
const profileImageUrl = ref('https://randomuser.me/api/portraits/men/32.jpg');
const fileInput = ref(null);
const loading = ref(false);
const error = ref(null);
const currentUser = ref(null);

const form = ref({
  fullName: '',
  email: '',
  phone: '',
  bio: '',
  government: '',
  district: '',
  gender: ''
});

async function fetchUserData() {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      router.push('/userlogin');
      return;
    }

    currentUser.value = user;
    
    // Fetch existing user data from Firestore
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      console.log('Fetched user data:', userData);
      
      // Populate form with existing data
      form.value = {
        fullName: userData.fullName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || '',
        email: userData.email || user.email || '',
        phone: userData.phone || '',
        bio: userData.bio || '',
        government: userData.government || '',
        district: userData.district || '',
        gender: userData.gender || ''
      };
      
      // Set profile image if exists
      if (userData.profileImageUrl) {
        profileImageUrl.value = userData.profileImageUrl;
      }
    } else {
      // Set default email from auth
      form.value.email = user.email || '';
    }
    
  } catch (err) {
    console.error('Error fetching user data:', err);
    error.value = 'Failed to load user data: ' + err.message;
  }
}

function triggerFileInput() {
  fileInput.value && fileInput.value.click();
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

async function saveProfile() {
  try {
    loading.value = true;
    error.value = null;
    
    if (!currentUser.value) {
      error.value = 'User not authenticated';
      return;
    }

    console.log('Saving profile data:', form.value);
    
    // Update user document in Firestore
    const userRef = doc(db, 'users', currentUser.value.uid);
    await setDoc(userRef, {
      ...form.value,
      profileImageUrl: profileImageUrl.value,
      updatedAt: new Date()
    }, { merge: true });
    
    console.log('Profile saved successfully!');
    alert('Profile saved successfully!');
    
  } catch (err) {
    console.error('Error saving profile:', err);
    error.value = 'Failed to save profile: ' + err.message;
    alert('Failed to save profile: ' + err.message);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('User authenticated:', user.uid);
      fetchUserData();
    } else {
      console.log('No user authenticated');
      router.push('/userlogin');
    }
  });
});
</script>

<style lang="scss" scoped>
@import '../style.css';
.profile-img-wrapper {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1rem;
}
.upload-btn {
  margin-bottom: 1rem;
}

/* Add .3rem border to all input fields in settings */
.input-field {
  border: 0.3rem solid #e5e7eb !important;
  border-radius: 0.5rem;
}

.input-field:focus {
  border-color: #7c6bb0 !important;
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(124, 107, 176, 0.25);
}
</style> 