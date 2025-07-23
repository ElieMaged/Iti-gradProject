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
                        <h2 class="text-2xl font-bold text-secondary">Personal Information</h2>
                    </div>
                    <div class="flex flex-col md:flex-row gap-8 items-start">
                        <!-- Info -->
                        <div class="flex-1 space-y-4">
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">Full Name</label>
                                <input type="text" value="Mohamed ali ahmed" class="input-field w-full px-4 py-2 rounded-lg text-sm" />
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">Email Address</label>
                                <input type="email" value="mohamedx@gmail.com" class="input-field w-full px-4 py-2 rounded-lg text-sm" />
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">Phone Number</label>
                                <input type="text" value="+20 111 222 5555" class="input-field w-full px-4 py-2 rounded-lg text-sm" />
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">Specialization</label>
                                <select class="input-field w-full px-4 py-2 rounded-lg text-sm">
                                    <option>Plumbing</option>
                                    <option>Electrician</option>
                                    <option>Carpentry</option>
                                    <option>Painting</option>
                                    <option>AC Technician</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">Years of Experience</label>
                                <select class="input-field w-full px-4 py-2 rounded-lg text-sm">
                                    <option>1 year</option>
                                    <option>2 years</option>
                                    <option>3 years</option>
                                    <option>4 years</option>
                                    <option selected>5 years</option>
                                    <option>6 years</option>
                                    <option>7 years</option>
                                    <option>8 years</option>
                                    <option>9 years</option>
                                    <option>10+ years</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">Base Visit Price</label>
                                <input type="text" value="250 EGP" class="input-field w-full px-4 py-2 rounded-lg text-sm" />
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">About</label>
                                <textarea class="input-field w-full px-4 py-2 rounded-lg text-sm" rows="2">Experienced plumber specializing in residential plumbing repairs and installations.</textarea>
                            </div>
                        </div>
                        <!-- Profile Image -->
                        <div class="flex-shrink-0">
                            <div ref="profileImage" class="w-40 h-40 object-cover rounded-lg shadow-md overflow-hidden flex items-center justify-center">
                                <img :src="profileImageUrl" alt="Technician Photo" class="w-full h-full object-cover">
                            </div>
                            <input ref="fileInput" type="file" class="hidden" @change="onFileChange" />
                            <button ref="uploadBtn" type="button" class="mt-2 px-4 py-2 bg-secondary text-white rounded" @click="triggerFileInput">Upload Photo</button>
                        </div>
                    </div>
                    <!-- Address Section -->
                    <div class="mt-10">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-bold text-text-main">Change Address</h3>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">City</label>
                                <select class="input-field w-full px-4 py-2 rounded-lg text-sm">
                                    <option value="">Select Government</option>
                                            <option value="Cairo" selected>Cairo</option>
                                            <option value="Giza">Giza</option>
                                            <option value="Alexandria">Alexandria</option>
                                            <option value="Dakahlia">Dakahlia</option>
                                            <option value="Red Sea">Red Sea</option>
                                            <option value="Beheira">Beheira</option>
                                            <option value="Fayoum">Fayoum</option>
                                            <option value="Gharbiya">Gharbiya</option>
                                            <option value="Ismailia">Ismailia</option>
                                            <option value="Menoufia">Menoufia</option>
                                            <option value="Minya">Minya</option>
                                            <option value="Qaliubiya">Qaliubiya</option>
                                            <option value="New Valley">New Valley</option>
                                            <option value="Suez">Suez</option>
                                            <option value="Aswan">Aswan</option>
                                            <option value="Assiut">Assiut</option>
                                            <option value="Beni Suef">Beni Suef</option>
                                            <option value="Port Said">Port Said</option>
                                            <option value="Damietta">Damietta</option>
                                            <option value="Sharkia">Sharkia</option>
                                            <option value="South Sinai">South Sinai</option>
                                            <option value="Kafr Al sheikh">Kafr Al sheikh</option>
                                            <option value="Matrouh">Matrouh</option>
                                            <option value="Luxor">Luxor</option>
                                            <option value="Qena">Qena</option>
                                            <option value="North Sinai">North Sinai</option>
                                            <option value="Sohag">Sohag</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">Area</label>
                                <select class="input-field w-full px-4 py-2 rounded-lg text-sm">
                                    <option>Dokki</option>
                                    <option>Maadi</option>
                                    <option>Zamalek</option>
                                    <option>6th of October</option>
                                    <option>Nasr City</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">Street Name</label>
                                <select class="input-field w-full px-4 py-2 rounded-lg text-sm">
                                    <option>Tahrir Street</option>
                                    <option>El Haram Street</option>
                                    <option>El Merghany Street</option>
                                    <option>El Nasr Road</option>
                                    <option>El Thawra Street</option>
                                </select>
                            </div>
                        </div>
                        <div class="mb-4">
                            <span class="block text-sm font-bold text-text-main mb-1">Willing to Travel ?</span>
                            <div class="flex items-center gap-6">
                                <label class="inline-flex items-center">
                                    <input type="radio" name="travel" class="form-radio text-secondary" checked>
                                    <span class="ml-2">Yes</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input type="radio" name="travel" class="form-radio text-secondary">
                                    <span class="ml-2">No</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <!-- Change Password Section -->
                    <div class="mt-10">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-bold text-text-main">Change Password</h3>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">Old Password</label>
                                <input type="password" class="input-field w-full px-4 py-2 rounded-lg text-sm" />
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">New Password</label>
                                <input type="password" class="input-field w-full px-4 py-2 rounded-lg text-sm" />
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-end mt-8">
                        <button class="bg-secondary text-white px-10 py-2 rounded-full text-lg font-medium hover:bg-opacity-90 transition-colors">Save Changes</button>
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