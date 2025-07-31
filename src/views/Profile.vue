<template>
  <div id="profile-container">
    <div id="profile-layout">  
      <!-- Main Content -->
      <main id="profile-main">
        <!-- Loading State -->
        <div v-if="loading" id="loading-container">
          <p id="loading-text">{{ $t('loadingProfileData') }}</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" id="error-container">
          <p id="error-text">{{ error }}</p>
        </div>

        <!-- Profile Content -->
        <div v-else-if="technicianData">
          <!-- Personal Information Section -->
          <div id="personal-info-section">
            <div id="section-header">
              <h2 id="section-title">{{ $t('personalInformation') }}</h2>
              <button id="edit-button">
                {{ $t('edit') }}
              </button>
            </div>

            <div id="profile-grid">
              <!-- Form Fields -->
              <div id="form-fields">
                <div class="form-field">
                  <label class="field-label">{{ $t('fullName') }}</label>
                  <input type="text" :value="technicianData.fullName" class="form-input" readonly />
                </div>
                
                <div class="form-field">
                  <label class="field-label">{{ $t('emailAddress') }}</label>
                  <input type="email" :value="technicianData.email" class="form-input" readonly />
                </div>
                
                <div class="form-field">
                  <label class="field-label">{{ $t('phoneNumber') }}</label>
                  <input type="tel" :value="technicianData.phone || '+20 111 222 5555'" class="form-input" />
                </div>

                <div class="form-field">
                  <label class="field-label">{{ $t('specialization') }}</label>
                  <select class="form-select">
                    <option :selected="technicianData.specialization">{{ technicianData.specialization }}</option>
                  </select>
                </div>
                
                <div class="form-field">
                  <label class="field-label">{{ $t('yearsOfExperience') }}</label>
                  <select class="form-select">
                    <option :selected="technicianData.experience">{{ technicianData.experience }} {{ $t('years') }}</option>
                  </select>
                </div>

                <div class="form-field">
                  <label class="field-label">{{ $t('baseVisitPrice') }}</label>
                  <input type="text" :value="technicianData.basePrice + ' ' + $t('egp')" class="form-input" />
                </div>

                <div class="form-field">
                  <label class="field-label">{{ $t('about') }}</label>
                  <textarea rows="3" class="form-textarea">{{ technicianData.bio }}</textarea>
                </div>
              </div>

              <!-- Profile Picture -->
              <div id="profile-picture-section">
                <div id="profile-picture-container">
                  <img v-if="technicianData.idPhotoUrl" :src="technicianData.idPhotoUrl" alt="Profile" id="profile-image" />
                  <div v-else id="profile-placeholder">
                    <svg id="profile-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>
                <button id="change-photo-button">
                  {{ $t('changePhoto') }}
                </button>
              </div>
            </div>
          </div>

          <!-- Account Status -->
          <div id="account-status-section">
            <div id="status-header">
              <h3 id="status-title">{{ $t('accountStatus') }}</h3>
            </div>
            <div id="status-content">
              <span id="status-label">{{ $t('status') }}:</span>
              <span :id="technicianData.status === 'approved' ? 'status-approved' : 'status-pending'">
                {{ technicianData.status === 'approved' ? $t('approved') : $t('pendingApproval') }}
              </span>
            </div>
          </div>

          <!-- Save Changes Button -->
          <div id="save-button-container">
            <button id="save-button">
              {{ $t('saveChanges') }}
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useI18n } from 'vue-i18n';
import Sidebar from '../components/Sidebar.vue';

const router = useRouter();
const { locale } = useI18n();
const activeTab = ref('profile');
const activeBookingStatus = ref('');
const isBookingDropdownOpen = ref(false);
const loading = ref(true);
const error = ref('');
const technicianData = ref(null);

function getRoute(path) {
  return locale.value === 'ar' ? `/ar/${path}` : `/${path}`;
}

function toggleBookingDropdown() {
  isBookingDropdownOpen.value = !isBookingDropdownOpen.value;
  activeTab.value = 'booking';
}

onMounted(async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      router.push('/userlogin');
      return;
    }
    // Fetch technician data from Firestore
    const techniciansRef = collection(db, 'technicians');
    const q = query(techniciansRef, where('uid', '==', currentUser.uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      technicianData.value = { id: doc.id, ...doc.data() };
    } else {
      error.value = 'Technician profile not found';
    }
  } catch (err) {
    error.value = 'Error loading profile: ' + err.message;
  } finally {
    loading.value = false;
  }
});

const handleLogout = async () => {
  try {
    await signOut(auth);
    router.push('/');
  } catch (err) {
    console.error('Logout error:', err);
  }
};
</script>

<style scoped>
/* Additional custom styles can be added here */
input, select, textarea {
  border-radius: 4rem;
  background-color: #D0D1D1;
}

button {
  background-color: #625397;
  border-radius: 3rem;
}

.side-bar-color {
  background-color: #D3CFE2;
}

a {
  color: black;
}

a:hover {
  background-color: #625397;
  color: white;
}

.title {
  color: #625397;
}
</style>

