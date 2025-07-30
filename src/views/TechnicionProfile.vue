<template>
  <div v-if="loading">
    <p>Loading...</p>
  </div>
  <div v-else-if="error">
    <p>{{ error }}</p>
  </div>
  <div v-else class="admin-dashboard-layout">
    <!-- Sidebar -->
    <Sidebar :activeMenu="activeMenu" @navigate="handleSidebarNavigate" />
    <!-- Main Content -->
    <div id="admin-profile-container" class="p-4 mr-20">
      <div id="admin-profile-wrapper">
        <div id="admin-profile-card">
          <h2 id="admin-profile-title">{{ $t('personalInformation') }}</h2>
          <div id="admin-profile-content">
            <div id="admin-profile-info">
              <div class="info-block">
                <span class="info-label">{{ $t('fullName') }}</span>
                <span class="info-value">{{ form.fullName || 'Not provided' }}</span>
              </div>
              <div class="info-block">
                <span class="info-label">{{ $t('emailAddress') }}</span>
                <span class="info-value">{{ form.email || 'Not provided' }}</span>
              </div>
              <div class="info-block">
                <span class="info-label">{{ $t('phoneNumber') }}</span>
                <span class="info-value">{{ form.phone || 'Not provided' }}</span>
              </div>
              <div class="info-block">
                <span class="info-label">{{ $t('specialization') }}</span>
                <span class="info-value">{{ form.specialization || 'Not provided' }}</span>
              </div>
              <div class="info-block">
                <span class="info-label">{{ $t('yearsOfExperience') }}</span>
                <span class="info-value">{{ form.experience || 'Not provided' }}</span>
              </div>
              <div class="info-block">
                <span class="info-label">{{ $t('baseVisitPrice') }}</span>
                <span class="info-value">{{ form.basePrice ? `${form.basePrice} EGP` : 'Not provided' }}</span>
              </div>
              <div class="info-block">
                <span class="info-label">{{ $t('city') }}</span>
                <span class="info-value">{{ form.government || 'Not provided' }}</span>
              </div>
              <div class="info-block">
                <span class="info-label">{{ $t('area') }}</span>
                <span class="info-value">{{ form.district || 'Not provided' }}</span>
              </div>
              <div class="info-block">
                <span class="info-label">{{ $t('willingToTravel') }}</span>
                <span class="info-value">{{ form.willingToTravel || 'Not provided' }}</span>
              </div>
              <div class="info-block">
                <span class="info-label">{{ $t('about') }}</span>
                <span class="info-value">{{ form.bio || 'Not provided' }}</span>
              </div>
            </div>
                          <div id="admin-profile-image">
                <img v-if="profileImageUrl" :src="profileImageUrl" alt="Profile" class="w-full h-full object-cover rounded" />
                <i v-else class="fas fa-user" id="profile-icon"></i>
              </div>
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
      activeMenu: 'technicianprofile',
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

<style scoped>
.admin-dashboard-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
  background: #faf8fd;
}

.dark .admin-dashboard-layout {
  background-color: var(--primary-bg);
}

#admin-profile-container {
  background-color: #f9fafb;
  min-height: 100vh;
  font-family: sans-serif;
  flex: 1;
}

.dark #admin-profile-container {
  background-color: var(--primary-bg);
}

#admin-profile-wrapper {
  max-width: 1000px;
}

#admin-profile-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  padding: 2rem;
}

.dark #admin-profile-card {
  background-color: var(--grey-bg);
}

#admin-profile-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #7c6bb0;
  margin-bottom: 1.5rem;
}

.dark #admin-profile-title {
  color: var(--white);
}

/* RTL Support for Arabic */
[dir="rtl"] #admin-profile-title {
  text-align: right;
}

[dir="rtl"] .info-label {
  text-align: right;
}

[dir="rtl"] .info-value {
  text-align: right;
}

#admin-profile-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (min-width: 768px) {
  #admin-profile-content {
    flex-direction: row;
    align-items: flex-start;
  }
}

#admin-profile-info {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.info-block {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 1.125rem;
  font-weight: bold;
  color: #333;
}

.dark .info-label {
  color: var(--white);
}

.info-value {
  font-size: 1rem;
  color: #4b5563;
  margin-top: 0.25rem;
}

.dark .info-value {
  color: var(--primary-text-dark);
}

#admin-profile-image {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10rem;
  height: 10rem;
  background-color: #e5e7eb;
  border-radius: 0.5rem;
  margin: 0 auto;
}

.dark #admin-profile-image {
  background-color: var(--primary-bg);
}

#profile-icon {
  font-size: 3.5rem;
  color: #9ca3af;
}

.dark #profile-icon {
  color: var(--white);
}
</style>