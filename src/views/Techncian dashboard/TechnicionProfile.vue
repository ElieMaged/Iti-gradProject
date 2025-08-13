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
    <div id="admin-profile-container" class="p-4 mx-12">
      <!-- Top bar for technician dashboard -->
      <TopBar :title="$t('personalInformation')" />
      <div id="admin-profile-wrapper">
        <div id="admin-profile-card">
          <div id="admin-profile-content">
            <!-- Profile Image - Will be moved to top on mobile -->
            <div id="admin-profile-image" class="profile-image-mobile">
              <img v-if="profileImageUrl" :src="profileImageUrl" alt="Profile" class="w-full h-full object-cover rounded" />
              <i v-else class="fas fa-user" id="profile-icon"></i>
            </div>
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '../../components/Sidebar.vue';
import TopBar from '../../components/TopBar.vue';
import { auth, db } from '../../firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

export default {
  components: { Sidebar, TopBar },
  data() {
    return {
      activeMenu: 'technicianprofile',
      profileImageUrl: '/images/Avatar.png',
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
this.profileImageUrl = data.profilePhotoUrl || this.profileImageUrl;      } else {
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
  margin-left: 14rem;
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


#admin-profile-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  width: auto;
}

.dark #admin-profile-card {
  background-color: var(--grey-bg);
}

.page-title {
  color: var(--primary-color);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  font-family: Outfit, sans-serif;
}

.dark .page-title {
  color: var(--primary-color);
}

/* RTL Support for Arabic */
[dir="rtl"] .page-title {
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
  color: var(--text-muted);
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

/* Responsive Design */
@media (max-width: 1200px) {
  #admin-profile-wrapper {
    max-width: 95%;
  }
  
  #admin-profile-info {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.25rem;
  }
}

@media (max-width: 1024px) {
  #admin-profile-container {
    padding: 1rem;
  }
  
  #admin-profile-card {
    padding: 1.5rem;
  }
  
  #admin-profile-info {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .info-label {
    font-size: 1rem;
  }
  
  .info-value {
    font-size: 0.875rem;
  }
}

@media (max-width: 900px) {
  .admin-dashboard-layout {
    flex-direction: column;
    
  }
  
  #admin-profile-container {
    margin-right: 0;
    padding: 1rem;
  }
  
  #admin-profile-wrapper {
    max-width: 100%;
  }
  
  #admin-profile-content {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  /* Mobile: Image at top, info below */
  .profile-image-mobile {
    order: -1;
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  #admin-profile-image {
    width: 8rem;
    height: 8rem;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #e5e7eb;
    border-radius: 0.5rem;
  }
  
  #profile-icon {
    font-size: 3rem;
  }
}
@media (max-width: 768px) {
  .admin-dashboard-layout {
    flex-direction: column;
    margin-left: 0;
    height: auto;
    min-height: auto;
    margin-top: 40px;
  }
  .mx-12{
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  .title-search-row{
    flex-wrap: nowrap;
    flex-direction: row;
    align-items: center;
    width: 100%;
  }
  .edit-profile-main {
    margin-left: 0;
    margin-right: 0;
    padding: 1rem;
  }
  
  .edit-profile-card {
    padding: 1.5rem;
    border-radius: 0.75rem;
  }
  
  .edit-profile-content {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .edit-profile-fields {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .edit-profile-image-section {
    order: -1;
    align-self: center;
  }
  
  /* Mobile: Image at top, fields below */
  .profile-image-mobile {
    order: -1;
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .profile-image-container {
    width: 100px;
    height: 100px;
  }
  
  .profile-image-placeholder {
    font-size: 2.5rem;
  }
  
  /* Mobile: Image at top, fields below */
  .profile-image-mobile {
    order: -1;
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .edit-profile-address {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .edit-profile-header h2 {
    font-size: 1.25rem;
    text-align: left;
  }
  
  .edit-profile-actions {
    justify-content: center;
  }
  
  .save-btn {
    width: 100%;
    max-width: 300px;
    padding: 0.875rem 2rem;
    font-size: 1rem;
  }
  
  .radio-group {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .radio-option {
    padding: 0.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 0.5rem;
    background: #f8f9fa;
  }
  
  .dark .radio-option {
    background: var(--input-bg);
    border-color: var(--border-color);
  }
}

@media (max-width: 480px) {
  .admin-dashboard-layout {
    margin: 0;        /* remove any left/top margins */
    height: auto;     /* no fixed viewport height */
    min-height: auto;
  }
  .edit-profile-main {
    padding: 0.5rem;
    margin: 0;        /* ensure no extra margins on content */
    height: auto;
    min-height: auto;
  }
  
  .edit-profile-card {
    padding: 1rem;
    border-radius: 0.5rem;
  }
  
  .edit-profile-header h2 {
    font-size: 1.125rem;
    margin-bottom: 1rem;
  }
  
  .edit-profile-fields label {
    font-size: 0.875rem;
  }
  
  .edit-profile-fields input,
  .edit-profile-fields select,
  .edit-profile-fields textarea {
    padding: 0.75rem;
    font-size: 0.875rem;
  }
  
  .edit-profile-address label {
    font-size: 0.875rem;
  }
  
  .edit-profile-address select {
    padding: 0.75rem;
    font-size: 0.875rem;
  }
  
  .profile-image-container {
    width: 80px;
    height: 80px;
  }
  
  .profile-image-placeholder {
    font-size: 2rem;
  }
  
  /* Mobile: Image at top, fields below */
  .profile-image-mobile {
    order: -1;
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .upload-btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
  
  .save-btn {
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
  }
  
  .edit-profile-section h3 {
    font-size: 1rem;
  }
}

@media (max-width: 360px) {
  .edit-profile-card {
    padding: 0.75rem;
  }
  
  .edit-profile-fields {
    gap: 0.75rem;
  }
  
  .edit-profile-fields input,
  .edit-profile-fields select,
  .edit-profile-fields textarea {
    padding: 0.625rem;
    font-size: 0.8125rem;
  }
  
  .profile-image-container {
    width: 70px;
    height: 70px;
  }
  
  .profile-image-placeholder {
    font-size: 1.75rem;
  }
  
  /* Mobile: Image at top, fields below */
  .profile-image-mobile {
    order: -1;
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .upload-btn {
    padding: 0.375rem 0.75rem;
    font-size: 0.8125rem;
  }
  
  .save-btn {
    padding: 0.625rem 1.25rem;
    font-size: 0.8125rem;
  }
}
</style>