<template>
    <body class="bg-gray-50 font-sans">
    

    <!-- Main Container -->
    <div class="flex min-h-screen">
        <!-- Sidebar -->
        <Sidebar
            :activeMenu="activeMenu"
            @navigate="handleSidebarNavigate"
        />
        <!-- Main Content -->
        <div class="flex-1 p-8">
            <div class="max-w-4xl mx-auto">
                <div class="bg-white rounded-xl shadow-lg p-8">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold text-secondary">{{ $t('editProfileTitle') }}</h2>
                    </div>
                    <div class="flex flex-col md:flex-row gap-8 items-start">
                        <!-- Info -->
                        <div class="flex-1 space-y-4">
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">{{ $t('fullNameLabel') }}</label>
                                <input type="text" value="Mohamed ali ahmed" class="input-field w-full px-4 py-2 rounded-lg text-sm" />
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">{{ $t('emailAddressLabel') }}</label>
                                <input type="email" value="mohamedx@gmail.com" class="input-field w-full px-4 py-2 rounded-lg text-sm" />
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">{{ $t('phoneNumberLabel') }}</label>
                                <input type="text" value="+20 111 222 5555" class="input-field w-full px-4 py-2 rounded-lg text-sm" />
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">{{ $t('specializationLabel') }}</label>
                                <select class="input-field w-full px-4 py-2 rounded-lg text-sm">
                                    <option>{{ $t('specializationPlumbing') }}</option>
                                    <option>{{ $t('specializationElectrician') }}</option>
                                    <option>{{ $t('specializationCarpentry') }}</option>
                                    <option>{{ $t('specializationPainting') }}</option>
                                    <option>{{ $t('specializationACTechnician') }}</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">{{ $t('yearsOfExperienceLabel') }}</label>
                                <select class="input-field w-full px-4 py-2 rounded-lg text-sm">
                                    <option>{{ $t('yearsOfExperience1') }}</option>
                                    <option>{{ $t('yearsOfExperience2') }}</option>
                                    <option>{{ $t('yearsOfExperience3') }}</option>
                                    <option>{{ $t('yearsOfExperience4') }}</option>
                                    <option selected>{{ $t('yearsOfExperience5') }}</option>
                                    <option>{{ $t('yearsOfExperience6') }}</option>
                                    <option>{{ $t('yearsOfExperience7') }}</option>
                                    <option>{{ $t('yearsOfExperience8') }}</option>
                                    <option>{{ $t('yearsOfExperience9') }}</option>
                                    <option>{{ $t('yearsOfExperience10') }}</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">{{ $t('baseVisitPriceLabel') }}</label>
                                <input type="text" value="250 EGP" class="input-field w-full px-4 py-2 rounded-lg text-sm" />
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">{{ $t('aboutLabel') }}</label>
                                <textarea class="input-field w-full px-4 py-2 rounded-lg text-sm" rows="2">{{ $t('aboutDescription') }}</textarea>
                            </div>
                        </div>
                        <!-- Profile Image -->
                        <div class="flex-shrink-0">
                            <div ref="profileImage" class="w-40 h-40 object-cover rounded-lg shadow-md overflow-hidden flex items-center justify-center">
                                <img :src="profileImageUrl" alt="Technician Photo" class="w-full h-full object-cover">
                            </div>
                            <input ref="fileInput" type="file" class="hidden" @change="onFileChange" />
                            <button ref="uploadBtn" type="button" class="mt-2 px-4 py-2 bg-secondary text-white rounded" @click="triggerFileInput">{{ $t('uploadPhotoButton') }}</button>
                        </div>
                    </div>
                    <!-- Address Section -->
                    <div class="mt-10">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-bold text-text-main">{{ $t('changeAddressTitle') }}</h3>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">{{ $t('cityLabel') }}</label>
                                <select class="input-field w-full px-4 py-2 rounded-lg text-sm">
                                    <option value="">{{ $t('selectGovernment') }}</option>
                                            <option value="Cairo" selected>{{ $t('cairo') }}</option>
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
                                <label class="block text-sm font-bold text-text-main mb-1">{{ $t('areaLabel') }}</label>
                                <select class="input-field w-full px-4 py-2 rounded-lg text-sm">
                                    <option>{{ $t('dokki') }}</option>
                                    <option>{{ $t('maadi') }}</option>
                                    <option>{{ $t('zamalek') }}</option>
                                    <option>{{ $t('6thOfOctober') }}</option>
                                    <option>{{ $t('nasrCity') }}</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">{{ $t('streetNameLabel') }}</label>
                                <select class="input-field w-full px-4 py-2 rounded-lg text-sm">
                                    <option>{{ $t('tahrirStreet') }}</option>
                                    <option>{{ $t('elHaramStreet') }}</option>
                                    <option>{{ $t('elMerghanyStreet') }}</option>
                                    <option>{{ $t('elNasrRoad') }}</option>
                                    <option>{{ $t('elThawraStreet') }}</option>
                                </select>
                            </div>
                        </div>
                        <div class="mb-4">
                            <span class="block text-sm font-bold text-text-main mb-1">{{ $t('willingToTravelLabel') }}</span>
                            <div class="flex items-center gap-6">
                                <label class="inline-flex items-center">
                                    <input type="radio" name="travel" class="form-radio text-secondary" checked>
                                    <span class="ml-2">{{ $t('yes') }}</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input type="radio" name="travel" class="form-radio text-secondary">
                                    <span class="ml-2">{{ $t('no') }}</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <!-- Change Password Section -->
                    <div class="mt-10">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-bold text-text-main">{{ $t('changePasswordTitle') }}</h3>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">{{ $t('oldPasswordLabel') }}</label>
                                <input type="password" class="input-field w-full px-4 py-2 rounded-lg text-sm" />
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">{{ $t('newPasswordLabel') }}</label>
                                <input type="password" class="input-field w-full px-4 py-2 rounded-lg text-sm" />
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-end mt-8">
                        <button class="bg-secondary text-white px-10 py-2 rounded-full text-lg font-medium hover:bg-opacity-90 transition-colors">{{ $t('saveChangesButton') }}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
   
</body>
</template>

<script>
    import Sidebar from '../components/Sidebar.vue';

    export default {
        components: {
            Sidebar
        },
        data() {
            return {
                activeMenu: 'technicianeditprofile',
                profileImageUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
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

<style lang="scss" scoped>
@import '../style.css';

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
.bg-white {
  background-color: var(--primary-bg) !important;
}
.dark-mode .bg-white {
  background-color: var(--secondary-bg) !important;
}

        
/* Responsive styles for full page (sidebar + main content) */
@media (max-width: 900px) {
  .flex {
    flex-direction: column !important;
  }
  .sidebar {
    width: 100% !important;
    max-height: 220px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 1rem 0 !important;
    margin-bottom: 1rem;
  }
  .flex-1.p-8 {
    padding: 1.5rem !important;
  }
  .max-w-4xl.mx-auto {
    max-width: 100% !important;
    margin: 0 !important;
  }
  .bg-white.rounded-xl.shadow-lg.p-8 {
    padding: 1.5rem !important;
  }
  .w-40.h-40 {
    width: 120px !important;
    height: 120px !important;
  }
}

@media (max-width: 768px) {
  .flex-1.p-8 {
    padding: 1rem !important;
  }
  .bg-white.rounded-xl.shadow-lg.p-8 {
    padding: 1rem !important;
  }
  .text-2xl {
    font-size: 1.2rem !important;
  }
  .text-lg {
    font-size: 1rem !important;
  }
  .input-field {
    font-size: 0.95rem !important;
    padding: 0.5rem 0.75rem !important;
  }
  .w-40.h-40 {
    width: 80px !important;
    height: 80px !important;
  }
  .px-10.py-2 {
    padding: 0.5rem 1.2rem !important;
    font-size: 1rem !important;
  }
}

@media (max-width: 600px) {
  .flex-1.p-8 {
    padding: 0.5rem !important;
  }
  .bg-white.rounded-xl.shadow-lg.p-8 {
    padding: 0.5rem !important;
  }
  .text-2xl {
    font-size: 1rem !important;
  }
  .text-lg {
    font-size: 0.9rem !important;
  }
  .input-field {
    font-size: 0.9rem !important;
    padding: 0.4rem 0.5rem !important;
  }
  .w-40.h-40 {
    width: 60px !important;
    height: 60px !important;
  }
  .px-10.py-2 {
    padding: 0.4rem 0.8rem !important;
    font-size: 0.95rem !important;
  }
}
</style>