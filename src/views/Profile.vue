<template>
  <div class="min-h-screen bg-gray-50 container">
    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 side-bar-color min-h-screen p-6">
        <nav class="space-y-4">
          <a href="#" 
             :class="[
               'flex items-center space-x-3 py-2 px-3 rounded-lg transition-colors',
               activeTab === 'profile' ? 'bg-purple-200 text-purple-700 font-medium' : 'text-gray-700 hover:text-purple-700'
             ]"
             @click="activeTab = 'profile'">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
            </svg>
            <span>My Profile</span>
          </a>
          <a href="#" 
             :class="[
               'flex items-center space-x-3 py-2 px-3 rounded-lg transition-colors',
               activeTab === 'settings' ? 'bg-purple-200 text-purple-700 font-medium' : 'text-gray-700 hover:text-purple-700'
             ]"
             @click="activeTab = 'settings'">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
            </svg>
            <span>Settings</span>
          </a>
          <a href="#" 
             :class="[
               'flex items-center space-x-3 py-2 px-3 rounded-lg transition-colors',
               activeTab === 'availability' ? 'bg-purple-200 text-purple-700 font-medium' : 'text-gray-700 hover:text-purple-700'
             ]"
             @click="activeTab = 'availability'">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
            </svg>
            <span>Availability</span>
          </a>
          <a href="#" 
             :class="[
               'flex items-center space-x-3 py-2 px-3 rounded-lg transition-colors',
               activeTab === 'booking' ? 'bg-purple-200 text-purple-700 font-medium' : 'text-gray-700 hover:text-purple-700'
             ]"
             @click="activeTab = 'booking'">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
            </svg>
            <span>My Booking</span>
            <svg class="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </a>
          <a href="#" 
             :class="[
               'flex items-center space-x-3 py-2 px-3 rounded-lg transition-colors',
               activeTab === 'payment' ? 'bg-purple-200 text-purple-700 font-medium' : 'text-gray-700 hover:text-purple-700'
             ]"
             @click="activeTab = 'payment'">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
            </svg>
            <span>Payment</span>
          </a>
          <a href="#" 
             :class="[
               'flex items-center space-x-3 py-2 px-3 rounded-lg transition-colors',
               activeTab === 'reviews' ? 'bg-purple-200 text-purple-700 font-medium' : 'text-gray-700 hover:text-purple-700'
             ]"
             @click="activeTab = 'reviews'">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span>My Reviews</span>
          </a>
          <a href="#" 
             :class="[
               'flex items-center space-x-3 py-2 px-3 rounded-lg transition-colors',
               activeTab === 'logout' ? 'bg-purple-200 text-purple-700 font-medium' : 'text-gray-700 hover:text-purple-700'
             ]"
             @click="handleLogout">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"/>
            </svg>
            <span>Logout</span>
          </a>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-8 bg-white">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <p class="text-lg text-gray-600">Loading profile data...</p>
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
              <h2 class="text-2xl font-bold title">Personal Information</h2>
              <button class="bg-purple-300 text-white px-4 py-2 rounded-lg hover:bg-purple-400 transition-colors">
                Edit
              </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <!-- Form Fields -->
              <div class="lg:col-span-2 space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" :value="technicianData.fullName" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" readonly />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" :value="technicianData.email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" readonly />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" value="+20 111 222 5555" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option :selected="technicianData.specialization">{{ technicianData.specialization }}</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                  <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option :selected="technicianData.experience">{{ technicianData.experience }} years</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Base Visit Price</label>
                  <input type="text" :value="technicianData.basePrice + ' EGP'" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">About</label>
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
                <button class="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                  Upload
                </button>
              </div>
            </div>
          </div>

          <!-- Change Address Section -->
          <div class="mb-8 border-t pt-8">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-bold text-purple-800">Change Address</h3>
              <button class="bg-purple-300 text-white px-4 py-2 rounded-lg hover:bg-purple-400 transition-colors">
                Edit
              </button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" :value="technicianData.government" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Area</label>
                <input type="text" :value="technicianData.district" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Street Name</label>
                <input type="text" value="Tahrir Street" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
            </div>
            
            <div class="flex items-center space-x-6">
              <span class="text-gray-700 font-medium">Willing to Travel?</span>
              <label class="flex items-center space-x-2">
                <input type="radio" name="travel" value="yes" :checked="technicianData.willingToTravel === 'yes'" class="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500" />
                <span class="text-gray-700">Yes</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="radio" name="travel" value="no" :checked="technicianData.willingToTravel === 'no'" class="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500" />
                <span class="text-gray-700">No</span>
              </label>
            </div>
          </div>

          <!-- Account Status -->
          <div class="mb-8 border-t pt-8">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-bold text-purple-800">Account Status</h3>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-gray-700 font-medium">Status:</span>
              <span :class="[
                'px-3 py-1 rounded-full text-sm font-medium',
                technicianData.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              ]">
                {{ technicianData.status === 'approved' ? 'Approved' : 'Pending Approval' }}
              </span>
            </div>
          </div>

          <!-- Change Password Section -->
          <div class="mb-8 border-t pt-8">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-bold text-purple-800">Change Password</h3>
              <button class="bg-purple-300 text-white px-4 py-2 rounded-lg hover:bg-purple-400 transition-colors">
                Edit
              </button>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
                <input type="password" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input type="password" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <div class="text-center pt-6">
            <button class="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium text-lg">
              Save Changes
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

const router = useRouter();
const activeTab = ref('profile');
const loading = ref(true);
const error = ref('');
const technicianData = ref(null);

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
