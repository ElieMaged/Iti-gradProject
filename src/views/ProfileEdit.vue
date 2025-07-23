<template>
  <!-- Top Bar -->
  <div class="bg-primary text-white text-sm">
    <div class="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
      <div class="flex items-center space-x-6">
        <span class="flex items-center"><i class="fas fa-phone mr-2"></i>{{ $t('phoneNumber') }}</span>
        <span class="flex items-center"><i class="fas fa-envelope mr-2"></i>{{ $t('emailAddress') }}</span>
        <span class="flex items-center"><i class="fas fa-map-marker-alt mr-2"></i>{{ $t('address') }}</span>
      </div>
      <div class="flex items-center space-x-3">
        <a href="#" class="text-white hover:text-secondary transition-colors"><i class="fab fa-facebook-f"></i></a>
        <a href="#" class="text-white hover:text-secondary transition-colors"><i class="fab fa-twitter"></i></a>
        <a href="#" class="text-white hover:text-secondary transition-colors"><i class="fab fa-linkedin-in"></i></a>
        <a href="#" class="text-white hover:text-secondary transition-colors"><i class="fab fa-youtube"></i></a>
      </div>
    </div>
  </div>
  <!-- Header -->
  <div class="bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
      <div class="flex items-center">
        <div class="text-3xl font-bold">
          <span class="text-primary">{{ $t('b') }}</span>
          <span class="text-secondary">{{ $t('boltFix') }}</span>
        </div>
      </div>
      <nav class="flex items-center space-x-8">
        <a href="#" class="text-text-main hover:text-secondary transition-colors font-medium">{{ $t('home') }}</a>
        <a href="#" class="text-text-main hover:text-secondary transition-colors font-medium">{{ $t('aboutUs') }}</a>
        <a href="#" class="text-text-main hover:text-secondary transition-colors font-medium">{{ $t('services') }}</a>
        <a href="#" class="text-text-main hover:text-secondary transition-colors font-medium">{{ $t('contactUs') }}</a>
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
      <a href="profile-view" class="sidebar-item w-full py-4 px-8 flex items-center space-x-4 text-lg font-medium text-secondary">
        <i class="fas fa-user text-xl"></i>
        <span>{{ $t('myProfile') }}</span>
      </a>
      <a href="profile-edit" class="sidebar-item active w-full py-4 px-8 flex items-center space-x-4 text-lg font-medium">
        <i class="fas fa-cog text-xl"></i>
        <span>{{ $t('settings') }}</span>
      </a>
      <a href="previous-services" class="sidebar-item w-full py-4 px-8 flex items-center space-x-4 text-lg font-medium text-secondary">
        <i class="fas fa-calendar-check text-xl"></i>
        <span>{{ $t('history') }}</span>
      </a>
      <a href="payment" class="sidebar-item w-full py-4 px-8 flex items-center space-x-4 text-lg font-medium text-secondary">
        <i class="fas fa-credit-card text-xl"></i>
        <span>{{ $t('payment') }}</span>
      </a>
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
            <h1 class="text-3xl font-bold text-text-main mb-2">{{ $t('editProfile') }}</h1>
            <h2 class="text-xl font-bold text-secondary">{{ $t('updatePersonalInformation') }}</h2>
          </div>
          <!-- Profile Content -->
          <div class="flex gap-8">
            <!-- Left Column - Information -->
            <div class="flex-1 space-y-6">
              <div>
                <label class="block text-sm font-bold text-text-main mb-2">{{ $t('fullName') }}</label>
                <input v-model="formData.fullName" type="text" class="input-field w-full px-4 py-3 rounded-lg text-sm">
              </div>
              <div>
                <label class="block text-sm font-bold text-text-main mb-2">{{ $t('emailAddress') }}</label>
                <input v-model="formData.email" type="email" class="input-field w-full px-4 py-3 rounded-lg text-sm">
              </div>
              <div>
                <label class="block text-sm font-bold text-text-main mb-2">{{ $t('phoneNumber') }}</label>
                <input v-model="formData.phone" type="text" class="input-field w-full px-4 py-3 rounded-lg text-sm">
              </div>
              <div>
                <label class="block text-sm font-bold text-text-main mb-2">{{ $t('gender') }}</label>
                <select v-model="formData.gender" class="input-field w-full px-4 py-3 rounded-lg text-sm">
                  <option value="Male">{{ $t('male') }}</option>
                  <option value="Female">{{ $t('female') }}</option>
                </select>
              </div>
              <!-- Address Section -->
              <div class="space-y-4">
                <h3 class="text-lg font-bold text-text-main border-b border-gray-200 pb-2">{{ $t('addressInformation') }}</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-bold text-text-main mb-2">{{ $t('government') }}</label>
                    <select v-model="formData.government" id="government" class="input-field w-full px-4 py-3 rounded-lg text-sm">
                      <option value="">{{ $t('selectGovernment') }}</option>
                      <option value="Cairo">{{ $t('cairo') }}</option>
                      <option value="Giza">{{ $t('giza') }}</option>
                      <option value="Alexandria">{{ $t('alexandria') }}</option>
                      <option value="Dakahlia">{{ $t('dakahlia') }}</option>
                      <option value="Red Sea">{{ $t('redSea') }}</option>
                      <option value="Beheira">{{ $t('beheira') }}</option>
                      <option value="Fayoum">{{ $t('fayoum') }}</option>
                      <option value="Gharbiya">{{ $t('gharbiya') }}</option>
                      <option value="Ismailia">{{ $t('ismailia') }}</option>
                      <option value="Menoufia">{{ $t('menoufia') }}</option>
                      <option value="Minya">{{ $t('minya') }}</option>
                      <option value="Qaliubiya">{{ $t('qaliubiya') }}</option>
                      <option value="New Valley">{{ $t('newValley') }}</option>
                      <option value="Suez">{{ $t('suez') }}</option>
                      <option value="Aswan">{{ $t('aswan') }}</option>
                      <option value="Assiut">{{ $t('assiut') }}</option>
                      <option value="Beni Suef">{{ $t('beniSuef') }}</option>
                      <option value="Port Said">{{ $t('portSaid') }}</option>
                      <option value="Damietta">{{ $t('damietta') }}</option>
                      <option value="Sharkia">{{ $t('sharkia') }}</option>
                      <option value="South Sinai">{{ $t('southSinai') }}</option>
                      <option value="Kafr Al sheikh">{{ $t('kafrAlsheikh') }}</option>
                      <option value="Matrouh">{{ $t('matrouh') }}</option>
                      <option value="Luxor">{{ $t('luxor') }}</option>
                      <option value="Qena">{{ $t('qena') }}</option>
                      <option value="North Sinai">{{ $t('northSinai') }}</option>
                      <option value="Sohag">{{ $t('sohag') }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-text-main mb-2">{{ $t('cityDistrict') }}</label>
                    <input v-model="formData.city" type="text" class="input-field w-full px-4 py-3 rounded-lg text-sm">
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-text-main mb-2">{{ $t('streetAddress') }}</label>
                    <input v-model="formData.address" type="text" class="input-field w-full px-4 py-3 rounded-lg text-sm">
                  </div>
                </div>
              </div>
              <!-- Change Password Section -->
              <div class="space-y-4">
                <h3 class="text-lg font-bold text-text-main border-b border-gray-200 pb-2">{{ $t('changePassword') }}</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-bold text-text-main mb-2">{{ $t('currentPassword') }}</label>
                    <input v-model="formData.currentPassword" type="password" :placeholder="$t('enterCurrentPassword')" class="input-field w-full px-4 py-3 rounded-lg text-sm">
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-text-main mb-2">{{ $t('newPassword') }}</label>
                    <input v-model="formData.newPassword" type="password" :placeholder="$t('enterNewPassword')" class="input-field w-full px-4 py-3 rounded-lg text-sm">
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-bold text-text-main mb-2">{{ $t('confirmNewPassword') }}</label>
                  <input v-model="formData.confirmPassword" type="password" :placeholder="$t('confirmNewPassword')" class="input-field w-full px-4 py-3 rounded-lg text-sm">
                </div>
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
              <button @click="saveChanges" class="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors">{{ $t('saveChanges') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue';
const profileImageUrl = ref(null);
const fileInput = ref(null);
const formData = reactive({
  fullName: 'Omar Yasser',
  email: 'omar@gmail.com',
  phone: '+20 011 555 2323',
  gender: 'Male',
  government: 'Cairo',
  city: 'Dokki',
  address: '15 El-Tahrir Street',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

onMounted(() => {
  // Load profile image from localStorage if exists
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
      // Save image to localStorage immediately
      localStorage.setItem('profileImageUrl', e.target.result);
    };
    reader.readAsDataURL(file);
  }
}
function saveChanges() {
  // Validate required fields
  const requiredFields = ['fullName', 'email', 'phone', 'government'];
  const missingFields = requiredFields.filter(field => !formData[field]);
  if (missingFields.length > 0) {
    alert(this.$t('pleaseFillRequiredFields') + missingFields.join(', '));
    return;
  }
  // Validate password change if any password field is filled
  if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      alert(this.$t('pleaseFillAllPasswordFields'));
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      alert(this.$t('newPasswordAndConfirmPasswordDoNotMatch'));
      return;
    }
    if (formData.newPassword.length < 6) {
      alert(this.$t('newPasswordMustBeAtLeast6Characters'));
      return;
    }
  }
  // Save profile data to localStorage
  localStorage.setItem('profileData', JSON.stringify(formData));
  // Save profile image to localStorage if available
  if (profileImageUrl.value) {
    localStorage.setItem('profileImageUrl', profileImageUrl.value);
  }
  // Simulate saving (replace with actual API call if needed)
  alert(this.$t('profileUpdated'));
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
  background-color: white;
  border: 1px solid #e0e0e0;
  color: #333333;
  transition: all 0.2s ease;
}
.input-field:focus {
  outline: none;
  border-color: #7c6bb0;
  box-shadow: 0 0 0 2px rgba(124, 107, 176, 0.2);
}
.input-field:disabled {
  background-color: #f5f5f5;
  color: #666666;
  cursor: not-allowed;
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