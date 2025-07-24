<template>
        <body class="bg-gray-50 font-sans">
    

    <!-- Main Container -->
    <div class="flex min-h-screen">
        <!-- Sidebar -->
        <Sidebar
            :activeMenu="activeMenu"
            @navigate="handleSidebarNavigate"
        />

        <div class="flex-1 p-8">
            <div class="max-w-4xl bg-white mx-auto">
                <div class=" rounded-xl shadow-lg p-8">
                    <h2 class="text-2xl font-bold text-secondary mb-6">Personal Information</h2>
                    <div class="flex flex-col md:flex-row gap-8 items-start">
                        <!-- Info -->
                        <div class="flex-1 space-y-4">
                            <div>
                                <span class="block text-lg font-bold text-text-main">Full Name</span>
                                <span class="block text-base text-gray-700 mt-1">Mohamed Ali Mohamed</span>
                            </div>
                            <div>
                                <span class="block text-lg font-bold text-text-main">Email Address</span>
                                <span class="block text-base text-gray-700 mt-1">mohamed@gmail.com</span>
                            </div>
                            <div>
                                <span class="block text-lg font-bold text-text-main">Phone Number</span>
                                <span class="block text-base text-gray-700 mt-1">+20 011 555 2323</span>
                            </div>
                            <div class="flex gap-12">
                                <div>
                                    <span class="block text-lg font-bold text-text-main">Service</span>
                                    <span class="block text-base text-gray-700 mt-1">Plumbing</span>
                                </div>
                                <div>
                                    <span class="block text-lg font-bold text-text-main">Rate Per Visit</span>
                                    <span class="block text-base text-gray-700 mt-1">250 EGP</span>
                                </div>
                            </div>
                            <div>
                                <span class="block text-lg font-bold text-text-main">About</span>
                                <span class="block text-base text-gray-500 mt-1">Experienced plumber specializing in residential plumbing repairs and installations.</span>
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
                activeMenu: 'technicionprofile',
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
.bg-gray-50 {
  background: var(--primary-bg) !important;
}
.dark .bg-gray-50 {
  background: var(--primary-bg) !important;
}
.bg-white {
  background: var(--secondary-bg) !important;
}
.dark .bg-white {
  background: var(--secondary-bg) !important;
}
.text-gray-700  {
  color: var(--primary-text) !important;
}
.dark .text-gray-700 {
  color: var(--primary-text) !important;
}

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

  .dark .bg-white.rounded-xl.shadow-lg.p-8 {
    background: var(--secondary-bg) !important;
    color: var(--primary-text) !important;
  }
  .w-40.h-40 {
    width: 120px !important;
    height: 120px !important;
  }
  .flex-col.md\:flex-row {
    flex-direction: column !important;
    gap: 1.5rem !important;
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