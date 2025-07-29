<template>
  <div class="bg-gray-50">
    <div class="flex">
      <!-- Sidebar -->
      <Sidebar />

      <!-- Main Content -->
      <main class="flex-1 p-8 bg-white">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <p class="text-lg text-gray-600">{{ $t('loadingProfileData') }}</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8">
          <p class="text-lg text-red-600">{{ error }}</p>
        </div>

        <!-- Profile Content -->
        <div v-else-if="technicianData">
          <!-- Personal Information Section -->
          <div class="mb-8">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold title">{{ $t('personalInformation') }}</h2>
              <button class="bg-purple-300 text-white px-4 py-2 rounded-lg hover:bg-purple-400 transition-colors">
                {{ $t('edit') }}
              </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <!-- Form Fields -->
              <div class="lg:col-span-2 space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('fullName') }}</label>
                  <input type="text" :value="technicianData.fullName" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" readonly />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('emailAddress') }}</label>
                  <input type="email" :value="technicianData.email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" readonly />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('phoneNumber') }}</label>
                  <input type="tel" :value="technicianData.phone || '+20 111 222 5555'" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('specialization') }}</label>
                  <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option :selected="technicianData.specialization">{{ technicianData.specialization }}</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('yearsOfExperience') }}</label>
                  <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option :selected="technicianData.experience">{{ technicianData.experience }} {{ $t('years') }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('baseVisitPrice') }}</label>
                  <input type="text" :value="technicianData.basePrice + ' ' + $t('egp')" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('about') }}</label>
                  <textarea rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">{{ technicianData.bio }}</textarea>
                </div>
              </div>

              <!-- Profile Picture -->
              <div class="flex flex-col items-center space-y-4">
                <div class="w-36 h-36 rounded-lg overflow-hidden bg-gray-200">
                  <img v-if="technicianData.idPhotoUrl" :src="technicianData.idPhotoUrl" alt="Profile" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
                    <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>
                <button class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  {{ $t('changePhoto') }}
                </button>
              </div>
            </div>
          </div>

          <!-- Account Status -->
          <div class="mb-8 border-t pt-8">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-bold text-purple-800">{{ $t('accountStatus') }}</h3>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-gray-700 font-medium">{{ $t('status') }}:</span>
              <span :class="[
                'px-3 py-1 rounded-full text-sm font-medium',
                technicianData.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              ]">
                {{ technicianData.status === 'approved' ? $t('approved') : $t('pendingApproval') }}
              </span>
            </div>
          </div>

          <!-- Save Changes Button -->
          <div class="flex justify-end">
            <button class="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium text-lg">
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

