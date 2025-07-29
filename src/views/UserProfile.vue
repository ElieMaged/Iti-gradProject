<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <Sidebar 
      :activeMenu="activeMenu" 
      :activeBookingStatus="activeBookingStatus"
      userType="user"
      @navigate="handleSidebarNavigate" 
    />
    
    <!-- Main Content -->
    <div class="flex-1 p-8">
      <div class="user-profile-layout">
        <div class="profile-main">
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-8">
            <p class="text-lg text-gray-600">Loading profile data...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-8">
            <p class="text-lg text-red-600">{{ error }}</p>
          </div>

          <!-- Profile Content -->
          <div v-else-if="userData">
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
                    <input type="text" :value="userData.fullName || userData.displayName" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" readonly />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" :value="userData.email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" readonly />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input type="tel" :value="userData.phoneNumber || 'Not provided'" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" readonly />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input type="text" :value="userData.address || 'Not provided'" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" readonly />
                  </div>
                </div>

                <!-- Profile Picture -->
                <div class="flex flex-col items-center">
                  <div class="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <img v-if="userData.photoURL" :src="userData.photoURL" alt="Profile" class="w-32 h-32 rounded-full object-cover" />
                    <i v-else class="fas fa-user text-4xl text-gray-400"></i>
                  </div>
                  <p class="text-sm text-gray-600">Profile Picture</p>
                </div>
              </div>
            </div>

            <!-- Account Statistics -->
            <div class="mb-8">
              <h3 class="text-xl font-semibold mb-4">Account Statistics</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white p-6 rounded-lg shadow-sm border">
                  <div class="flex items-center">
                    <div class="p-2 bg-blue-100 rounded-lg">
                      <i class="fas fa-calendar text-blue-600"></i>
                    </div>
                    <div class="ml-4">
                      <p class="text-sm font-medium text-gray-600">Total Bookings</p>
                      <p class="text-2xl font-semibold text-gray-900">{{ totalBookings }}</p>
                    </div>
                  </div>
                </div>
                
                <div class="bg-white p-6 rounded-lg shadow-sm border">
                  <div class="flex items-center">
                    <div class="p-2 bg-green-100 rounded-lg">
                      <i class="fas fa-check-circle text-green-600"></i>
                    </div>
                    <div class="ml-4">
                      <p class="text-sm font-medium text-gray-600">Completed</p>
                      <p class="text-2xl font-semibold text-gray-900">{{ completedBookings }}</p>
                    </div>
                  </div>
                </div>
                
                <div class="bg-white p-6 rounded-lg shadow-sm border">
                  <div class="flex items-center">
                    <div class="p-2 bg-yellow-100 rounded-lg">
                      <i class="fas fa-star text-yellow-600"></i>
                    </div>
                    <div class="ml-4">
                      <p class="text-sm font-medium text-gray-600">Reviews Given</p>
                      <p class="text-2xl font-semibold text-gray-900">{{ totalReviews }}</p>
                    </div>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import Sidebar from '../components/Sidebar.vue'

const router = useRouter()
const auth = getAuth()

const activeMenu = ref('profile')
const activeBookingStatus = ref('')
const loading = ref(true)
const error = ref('')
const userData = ref(null)
const totalBookings = ref(0)
const completedBookings = ref(0)
const totalReviews = ref(0)

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        loading.value = true
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          userData.value = { ...userDoc.data(), ...user }
        } else {
          userData.value = user
        }
        
        // TODO: Fetch booking statistics
        // For now, set default values
        totalBookings.value = 0
        completedBookings.value = 0
        totalReviews.value = 0
        
      } catch (err) {
        console.error('Error loading user data:', err)
        error.value = 'Failed to load profile data'
      } finally {
        loading.value = false
      }
    } else {
      router.push('/userlogin')
    }
  })
})

function handleSidebarNavigate(route) {
  if (route === 'logout') {
    auth.signOut()
    router.push('/')
    return
  }
  
  if (route.startsWith('/')) {
    router.push(route)
  } else {
    // Handle other navigation
    switch (route) {
      case 'profile':
        router.push('/user-profile')
        break
      case 'settings':
        router.push('/profile-edit')
        break
      case 'reviews':
        router.push('/user-reviews')
        break
      default:
        console.log('Unknown route:', route)
    }
  }
}
</script>

<style scoped>
.user-profile-layout {
  max-width: 1200px;
  margin: 0 auto;
}

.profile-main {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.title {
  color: #374151;
}

@media (max-width: 768px) {
  .profile-main {
    padding: 1rem;
  }
  
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>