<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <Sidebar :activeMenu="activeMenu" @navigate="handleSidebarNavigate" />
    <!-- Main Content -->
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
                  <label class="block text-sm font-bold text-text-main mb-1">{{ $t('specializationLabel') }}</label>
                  <select v-model="form.specialization" class="input-field w-full px-4 py-2 rounded-lg text-sm">
                    <option value="Plumbing">{{ $t('specializationPlumbing') }}</option>
                    <option value="Electricity">{{ $t('specializationElectrician') }}</option>
                    <option value="Carpentry">{{ $t('specializationCarpentry') }}</option>
                    <option value="Painting">{{ $t('specializationPainting') }}</option>
                    <option value="Air Conditioning">{{ $t('specializationACTechnician') }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-bold text-text-main mb-1">{{ $t('yearsOfExperienceLabel') }}</label>
                  <select v-model="form.experience" class="input-field w-full px-4 py-2 rounded-lg text-sm">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4+">4+</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-bold text-text-main mb-1">{{ $t('baseVisitPriceLabel') }}</label>
                  <input v-model="form.basePrice" type="text" class="input-field w-full px-4 py-2 rounded-lg text-sm" />
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
              <div>
                <label class="block text-sm font-bold text-text-main mb-1">{{ $t('willingToTravelLabel') }}</label>
                <div class="flex items-center gap-6">
                  <label class="inline-flex items-center">
                    <input v-model="form.willingToTravel" type="radio" value="yes" class="form-radio text-secondary" />
                    <span class="ml-2">{{ $t('yes') }}</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input v-model="form.willingToTravel" type="radio" value="no" class="form-radio text-secondary" />
                    <span class="ml-2">{{ $t('no') }}</span>
                  </label>
                </div>
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

<script>
import Sidebar from '../components/Sidebar.vue';
export default {
  components: { Sidebar },
  data() {
    return {
      activeMenu: 'technicianeditprofile',
      profileImageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      form: {
        fullName: '',
        email: '',
        phone: '',
        specialization: '',
        experience: '',
        basePrice: '',
        bio: '',
        government: '',
        district: '',
        willingToTravel: '',
      }
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
    },
    saveProfile() {
      // Implement save logic here (e.g., update Firestore)
      alert('Profile saved!');
    }
  }
}
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
</style> 