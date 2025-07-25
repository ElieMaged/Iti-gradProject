<template>
  <!-- Top Bar -->
  <div class="bg-primary text-white text-sm">
    <div class="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
      <div class="flex items-center space-x-6">
        <span class="flex items-center">
          <i class="fas fa-phone mr-2"></i>
          925-465-3762
        </span>
        <span class="flex items-center">
          <i class="fas fa-envelope mr-2"></i>
          boltfix@gmail.com
        </span>
        <span class="flex items-center">
          <i class="fas fa-map-marker-alt mr-2"></i>
          4096 Modesto, CA 95350, USA
        </span>
      </div>
      <div class="flex items-center space-x-3">
        <a href="#" class="text-white hover:text-secondary transition-colors">
          <i class="fab fa-facebook-f"></i>
        </a>
        <a href="#" class="text-white hover:text-secondary transition-colors">
          <i class="fab fa-twitter"></i>
        </a>
        <a href="#" class="text-white hover:text-secondary transition-colors">
          <i class="fab fa-linkedin-in"></i>
        </a>
        <a href="#" class="text-white hover:text-secondary transition-colors">
          <i class="fab fa-youtube"></i>
        </a>
      </div>
    </div>
  </div>
  <!-- Header -->
  <div class="bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
      <div class="flex items-center">
        <div class="text-3xl font-bold">
          <span class="text-primary">B</span>
          <span class="text-secondary">BoltFix</span>
        </div>
      </div>
      <nav class="flex items-center space-x-8">
        <router-link :to="getRoute('home')" class="text-text-main hover:text-secondary transition-colors font-medium">{{ $t('home') }}</router-link>
        <router-link :to="getRoute('aboutUs')" class="text-text-main hover:text-secondary transition-colors font-medium">{{ $t('aboutUs') }}</router-link>
        <router-link :to="getRoute('services')" class="text-text-main hover:text-secondary transition-colors font-medium">{{ $t('services') }}</router-link>
        <router-link :to="getRoute('contactUs')" class="text-text-main hover:text-secondary transition-colors font-medium">{{ $t('contactUs') }}</router-link>
      </nav>
      <div class="flex items-center space-x-4">
        <i class="fas fa-bell text-xl text-secondary cursor-pointer"></i>
        <i class="fas fa-user text-xl text-secondary cursor-pointer"></i>
      </div>
    </div>
  </div>
  <!-- Main Container -->
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <div class="w-64 bg-sidebar flex flex-col items-center pt-10">
      <router-link :to="getRoute('profile-view')" class="sidebar-item active w-full py-4 px-8 flex items-center space-x-4 text-lg font-medium">
        <i class="fas fa-user text-xl"></i>
        <span>{{ $t('myProfile') }}</span>
      </router-link>
      <router-link :to="{ path: '/profile-edit' }" class="sidebar-item w-full py-4 px-8 flex items-center space-x-4 text-lg font-medium text-secondary">
        <i class="fas fa-cog text-xl"></i>
        <span>{{ $t('settings') }}</span>
      </router-link>
      <router-link :to="getRoute('previous-services')" class="sidebar-item w-full py-4 px-8 flex items-center space-x-4 text-lg font-medium text-secondary">
        <i class="fas fa-calendar-check text-xl"></i>
        <span>{{ $t('history') }}</span>
      </router-link>
      <router-link :to="getRoute('payment')" class="sidebar-item w-full py-4 px-8 flex items-center space-x-4 text-lg font-medium text-secondary">
        <i class="fas fa-credit-card text-xl"></i>
        <span>{{ $t('payment') }}</span>
      </router-link>
      <a href="#" class="sidebar-item w-full py-4 px-8 flex items-center space-x-4 text-lg font-medium text-secondary">
        <i class="fas fa-sign-out-alt text-xl"></i>
        <span>{{ $t('logout') }}</span>
      </a>
    </div>
    <!-- Main Content -->
    <div class="flex-1 p-8">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-xl shadow-lg p-8">
          <!-- Header -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-text-main mb-2">{{ $t('helloUser', { name: profileData.fullName || $t('user') }) }}</h1>
            <h2 class="text-xl font-bold text-secondary">{{ $t('yourPersonalInformation') }}</h2>
          </div>
          <!-- Profile Content -->
          <div class="flex gap-8">
            <!-- Left Column - Information -->
            <div class="flex-1 space-y-6">
              <div>
                <label class="block text-sm font-bold text-text-main mb-2">{{ $t('fullName') }}</label>
                <input type="text" :value="profileData.fullName" disabled class="input-field w-full px-4 py-3 rounded-lg text-sm">
              </div>
              <div>
                <label class="block text-sm font-bold text-text-main mb-2">{{ $t('emailAddress') }}</label>
                <input type="email" :value="profileData.email" disabled class="input-field w-full px-4 py-3 rounded-lg text-sm">
              </div>
              <div>
                <label class="block text-sm font-bold text-text-main mb-2">{{ $t('phoneNumber') }}</label>
                <input type="text" :value="profileData.phone" disabled class="input-field w-full px-4 py-3 rounded-lg text-sm">
              </div>
              <div>
                <label class="block text-sm font-bold text-text-main mb-2">{{ $t('gender') }}</label>
                <input type="text" :value="profileData.gender" disabled class="input-field w-full px-4 py-3 rounded-lg text-sm">
              </div>
              <div>
                <label class="block text-sm font-bold text-text-main mb-2">{{ $t('address') }}</label>
                <input type="text" :value="profileData.address" disabled class="input-field w-full px-4 py-3 rounded-lg text-sm">
              </div>
            </div>
            <!-- Right Column - Profile Image -->
            <div class="flex flex-col items-center space-y-4">
              <div class="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden" id="profileImage">
                <img v-if="profileImageUrl" :src="profileImageUrl" alt="Profile" class="w-full h-full object-cover rounded-full" />
                <i v-else class="fas fa-user text-4xl text-gray-500"></i>
              </div>
              <button @click="triggerFileInput" class="bg-secondary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors">{{ $t('uploadPhoto') }}</button>
              <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileChange" />
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

const { locale } = useI18n();
const router = useRouter();

const profileImageUrl = ref(null);
const fileInput = ref(null);
const profileData = ref({
  fullName: '',
  email: '',
  phone: '',
  gender: '',
  address: ''
});

onMounted(() => {
  // Load profile data
  const savedData = localStorage.getItem('profileData');
  if (savedData) {
    const data = JSON.parse(savedData);
    // Compose address for display
    profileData.value = {
      fullName: data.fullName || '',
      email: data.email || '',
      phone: data.phone || '',
      gender: data.gender || '',
      address: `${data.address || ''}${data.city ? ', ' + data.city : ''}${data.government ? ', ' + data.government : ''}`
    };
  }
  // Load profile image
  const savedImage = localStorage.getItem('profileImageUrl');
  if (savedImage) {
    profileImageUrl.value = savedImage;
  }
});

function triggerFileInput() {
  fileInput.value && fileInput.value.click();
}
function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
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
</style> 