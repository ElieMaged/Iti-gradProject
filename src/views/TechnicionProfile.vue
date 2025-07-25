<template>
  <div v-if="loading" class="flex min-h-screen items-center justify-center"><p>Loading...</p></div>
  <div v-else-if="error" class="flex min-h-screen items-center justify-center"><p class="text-red-500">{{ error }}</p></div>
  <div v-else class="flex min-h-screen">
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
          <div class="mt-10">
            <h3 class="text-xl font-bold mb-4">{{ $t('upcomingBookings') }}</h3>
            <div v-if="upcomingBookings.length === 0" class="text-gray-500">{{ $t('noUpcomingBookings') }}</div>
            <div v-for="booking in upcomingBookings" :key="booking.id" class="bg-gray-100 rounded-lg p-4 mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div><b>{{ $t('user') }}:</b> {{ booking.userName }} ({{ booking.userEmail }})</div>
                <div><b>{{ $t('date') }}:</b> {{ booking.date }}</div>
                <div><b>{{ $t('time') }}:</b> {{ booking.time }}</div>
                <div><b>{{ $t('payment') }}:</b> {{ booking.payment }}</div>
              </div>
              <div class="flex gap-2 mt-2 md:mt-0">
                <button class="bg-green-500 text-white px-4 py-2 rounded" @click="confirmBooking(booking.id)">{{ $t('confirm') }}</button>
                <button class="bg-red-500 text-white px-4 py-2 rounded" @click="cancelBooking(booking.id)">{{ $t('cancel') }}</button>
              </div>
            </div>

            <h3 class="text-xl font-bold mb-4 mt-8">{{ $t('pendingBookings') }}</h3>
            <div v-if="pendingBookings.length === 0" class="text-gray-500">{{ $t('noPendingBookings') }}</div>
            <div v-for="booking in pendingBookings" :key="booking.id" class="bg-yellow-100 rounded-lg p-4 mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div><b>{{ $t('user') }}:</b> {{ booking.userName }} ({{ booking.userEmail }})</div>
                <div><b>{{ $t('date') }}:</b> {{ booking.date }}</div>
                <div><b>{{ $t('time') }}:</b> {{ booking.time }}</div>
                <div><b>{{ $t('payment') }}:</b> {{ booking.payment }}</div>
              </div>
              <div class="flex gap-2 mt-2 md:mt-0">
                <span class="text-yellow-800 font-bold">{{ $t('pendingStatus') }}</span>
              </div>
            </div>

            <h3 class="text-xl font-bold mb-4 mt-8">{{ $t('completedBookings') }}</h3>
            <div v-if="completedBookings.length === 0" class="text-gray-500">{{ $t('noCompletedBookings') }}</div>
            <div v-for="booking in completedBookings" :key="booking.id" class="bg-green-100 rounded-lg p-4 mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div><b>{{ $t('user') }}:</b> {{ booking.userName }} ({{ booking.userEmail }})</div>
                <div><b>{{ $t('date') }}:</b> {{ booking.date }}</div>
                <div><b>{{ $t('time') }}:</b> {{ booking.time }}</div>
                <div><b>{{ $t('payment') }}:</b> {{ booking.payment }}</div>
              </div>
              <div class="flex gap-2 mt-2 md:mt-0">
                <span class="text-green-800 font-bold">{{ $t('completedStatus') }}</span>
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
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

export default {
  components: { Sidebar },
  data() {
    return {
      activeMenu: 'technicianeditprofile',
      profileImageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      loading: true,
      error: '',
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
      },
      allBookings: [] // <-- all bookings for this technician
    }
  },
  async mounted() {
    try {
      const user = auth.currentUser;
      if (!user) {
        this.error = 'Not logged in.';
        this.loading = false;
        return;
      }
      const docRef = doc(db, 'technicians', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        this.form.fullName = data.fullName || '';
        this.form.email = data.email || '';
        this.form.phone = data.phone || '';
        this.form.specialization = data.specialization || '';
        this.form.experience = data.experience || '';
        this.form.basePrice = data.basePrice || '';
        this.form.bio = data.bio || '';
        this.form.government = data.government || '';
        this.form.district = data.district || '';
        this.form.willingToTravel = data.willingToTravel || '';
        this.profileImageUrl = data.idPhotoUrl || this.profileImageUrl;
      } else {
        this.error = 'Technician profile not found.';
      }
      // Fetch all bookings for this technician (except cancelled)
      const q = query(collection(db, 'bookings'), where('technicianId', '==', user.uid));
      const snap = await getDocs(q);
      this.allBookings = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(b => b.status !== 'cancelled');
    } catch (e) {
      this.error = 'Error loading profile.';
    } finally {
      this.loading = false;
    }
  },
  computed: {
    upcomingBookings() {
      return this.allBookings.filter(b => b.status === 'new');
    },
    pendingBookings() {
      return this.allBookings.filter(b => b.status === 'pending');
    },
    completedBookings() {
      return this.allBookings.filter(b => b.status === 'completed');
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
    },
    async confirmBooking(bookingId) {
      await updateDoc(doc(db, 'bookings', bookingId), { status: 'pending' });
      const idx = this.allBookings.findIndex(b => b.id === bookingId);
      if (idx !== -1) {
        this.allBookings[idx] = { ...this.allBookings[idx], status: 'pending' };
        this.allBookings = [...this.allBookings]; // force reactivity
      }
    },
    async cancelBooking(bookingId) {
      await updateDoc(doc(db, 'bookings', bookingId), { status: 'cancelled' });
      this.allBookings = this.allBookings.filter(b => b.id !== bookingId);
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