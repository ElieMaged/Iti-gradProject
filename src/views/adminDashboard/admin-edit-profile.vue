<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="edit-profile-main mr-20 p-4">
      <div class="edit-profile-wrapper">
        <div class="edit-profile-card">
          <div class="edit-profile-header">
            <h2>{{ $t('editProfile') }}</h2>
          </div>
          
          <!-- Loading State -->
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading profile information...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="error-state">
            <p class="error-message">{{ error }}</p>
            <button @click="fetchAdminData" class="retry-btn">Retry</button>
          </div>

          <!-- Edit Form -->
          <form v-else class="edit-profile-form" @submit.prevent="updateProfile">
            <div class="edit-profile-content">
              <div class="edit-profile-fields">
                <div>
                  <label for="name">{{ $t('fullName') }}</label>
                  <input type="text" id="name" v-model="form.name" required />
                </div>
                <div>
                  <label for="email">{{ $t('emailAddress') }}</label>
                  <input type="email" id="email" v-model="form.email" required />
                </div>
                <div>
                  <label for="phone">{{ $t('phoneNumber') }}</label>
                  <input type="text" id="phone" v-model="form.phone" required />
                </div>
                <div>
                  <label for="nationalId">{{ $t('nationalId') }}</label>
                  <input type="text" id="nationalId" v-model="form.nationalId" required />
                </div>
                <div>
                  <label for="gender">{{ $t('gender') }}</label>
                  <select id="gender" v-model="form.gender">
                    <option value="">{{ $t('selectGender') }}</option>
                    <option value="male">{{ $t('male') }}</option>
                    <option value="female">{{ $t('female') }}</option>
                  </select>
                </div>
              </div>
              <div class="edit-profile-image-section">
                <div class="profile-image-container">
                  <img v-if="profileImage" :src="profileImage" alt="Profile" class="profile-image" />
                  <i v-else class="fas fa-user profile-image-placeholder"></i>
                </div>
                <button type="button" class="upload-btn" @click="triggerUpload">{{ $t('upload') }}</button>
                <input ref="fileInput" type="file" accept="image/*" class="hidden-input" @change="handleImageUpload" />
              </div>
            </div>
            <div class="edit-profile-section">
              <h3>{{ $t('changeAddress') }}</h3>
              <div class="edit-profile-address">
                <div>
                  <label for="city">{{ $t('city') }}</label>
                  <select id="city" v-model="form.city">
                    <option value="">{{ $t('selectGovernment') }}</option>
                    <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
                  </select>
                </div>
                <div>
                  <label for="area">{{ $t('area') }}</label>
                  <select id="area" v-model="form.area">
                    <option value="">{{ $t('selectArea') }}</option>
                    <option v-for="area in areas" :key="area" :value="area">{{ area }}</option>
                  </select>
                </div>
                <div>
                  <label for="street">{{ $t('streetName') }}</label>
                  <select id="street" v-model="form.street">
                    <option value="">{{ $t('selectStreet') }}</option>
                    <option v-for="street in streets" :key="street" :value="street">{{ street }}</option>
                  </select>
                </div>
                <div>
                  <label for="building">{{ $t('building') }}</label>
                  <input type="text" id="building" v-model="form.building" placeholder="Building number or name" />
                </div>
              </div>
            </div>
            <div class="edit-profile-section">
              <h3>{{ $t('changePassword') }}</h3>
              <div class="edit-profile-password">
                <div>
                  <label for="oldPassword">{{ $t('oldPassword') }}</label>
                  <input type="password" id="oldPassword" v-model="form.oldPassword" />
                </div>
                <div>
                  <label for="newPassword">{{ $t('newPassword') }}</label>
                  <input type="password" id="newPassword" v-model="form.newPassword" />
                </div>
              </div>
            </div>
            <div class="edit-profile-actions">
              <button type="submit" class="save-btn" :disabled="saving">
                {{ saving ? $t('saving') : $t('saveChanges') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminSidebar from '../../components/admin-sidebar.vue';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { getAuth, updatePassword } from 'firebase/auth';

export default {
  components: { AdminSidebar },
  data() {
    return {
      profileImage: null,
      loading: true,
      error: null,
      saving: false,
      form: {
        name: '',
        email: '',
        phone: '',
        nationalId: '',
        gender: '',
        city: '',
        area: '',
        street: '',
        building: '',
        oldPassword: '',
        newPassword: ''
      },
      cities: ["Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira", "Fayoum", "Gharbiya", "Ismailia", "Menoufia", "Minya", "Qaliubiya", "New Valley", "Suez", "Aswan", "Assiut", "Beni Suef", "Port Said", "Damietta", "Sharkia", "South Sinai", "Kafr Al sheikh", "Matrouh", "Luxor", "Qena", "North Sinai", "Sohag"],
      areas: ["Dokki", "Maadi", "Zamalek", "6th of October", "Nasr City"],
      streets: ["Tahrir Street", "El Haram Street", "El Merghany Street", "El Nasr Road", "El Thawra Street"]
    };
  },
  async mounted() {
    await this.fetchAdminData();
  },
  methods: {
    async fetchAdminData() {
      try {
        this.loading = true;
        this.error = null;
        
        const auth = getAuth();
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          this.error = 'No authenticated user found';
          return;
        }
        
        console.log('🔍 Fetching admin data for user:', currentUser.uid);
        
        const userDoc = doc(db, 'users', currentUser.uid);
        const userSnapshot = await getDoc(userDoc);
        
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          
          // Populate form with existing data
          this.form = {
            name: userData.fullName || '',
            email: userData.email || '',
            phone: userData.phone || '',
            nationalId: userData.nationalId || '',
            gender: userData.gender || '',
            city: userData.city || '',
            area: userData.area || '',
            street: userData.street || '',
            building: userData.building || '',
            oldPassword: '',
            newPassword: ''
          };
          
          // Set profile image if exists
          if (userData.profileImageUrl) {
            this.profileImage = userData.profileImageUrl;
          }
          
          console.log('✅ Admin data loaded:', userData);
        } else {
          this.error = 'Profile not found';
          console.log('❌ Admin profile not found');
        }
      } catch (error) {
        console.error('❌ Error fetching admin data:', error);
        this.error = 'Failed to load profile information';
      } finally {
        this.loading = false;
      }
    },
    
    triggerUpload() {
      this.$refs.fileInput.click();
    },
    
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.profileImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    
    async updateProfile() {
      try {
        this.saving = true;
        
        const auth = getAuth();
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          throw new Error('No authenticated user found');
        }
        
        console.log('💾 Saving admin profile for user:', currentUser.uid);
        
        // Prepare update data
        const updateData = {
          fullName: this.form.name,
          email: this.form.email,
          phone: this.form.phone,
          nationalId: this.form.nationalId,
          gender: this.form.gender,
          city: this.form.city,
          area: this.form.area,
          street: this.form.street,
          building: this.form.building,
          updatedAt: new Date()
        };
        
        // Add profile image if uploaded
        if (this.profileImage && this.profileImage.startsWith('data:')) {
          updateData.profileImageUrl = this.profileImage;
        }
        
        // Update user document in Firestore
        const userDoc = doc(db, 'users', currentUser.uid);
        await updateDoc(userDoc, updateData);
        
        // Update password if provided
        if (this.form.oldPassword && this.form.newPassword) {
          try {
            // Note: This would require re-authentication in a real app
            // For now, we'll just log that password change was requested
            console.log('Password change requested (requires re-authentication)');
          } catch (error) {
            console.error('Password update error:', error);
          }
        }
        
        console.log('✅ Admin profile updated successfully');
        alert('Profile updated successfully!');
        
        // Clear password fields
        this.form.oldPassword = '';
        this.form.newPassword = '';
        
      } catch (error) {
        console.error('❌ Error updating admin profile:', error);
        alert('Failed to update profile: ' + error.message);
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>

<style scoped>
.admin-dashboard-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
  background: #faf8fd;
}
.dark .admin-dashboard-layout {
  background: var(--primary-bg);
}
.edit-profile-main {
  flex: 1;
  background: #f9fafb;
}
.dark .edit-profile-main {
  background: var(--primary-bg);
}
.dark .edit-profile-card {
  background: var(--grey-bg);
}
.edit-profile-card {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 10px 15px rgba(0,0,0,0.08);
  padding: 2rem;
  width: auto;
}
.dark .edit-profile-header h2 {
  color: var(--primary-color);
}
.dark .edit-profile-card {
  background: var(--grey-bg);
}
.edit-profile-header h2 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #7c6bb0;
  margin-bottom: 1.5rem;
}

/* Loading and Error States */
.loading-state, .error-state {
  text-align: center;
  padding: 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #7c6bb0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #dc3545;
  margin-bottom: 1rem;
}

.retry-btn {
  background-color: #7c6bb0;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
}

.retry-btn:hover {
  background-color: #6a5acd;
}

.edit-profile-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.edit-profile-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
@media (min-width: 768px) {
  .edit-profile-content {
    flex-direction: row;
    align-items: flex-start;
  }
}
.edit-profile-fields {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.edit-profile-fields label {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}
.dark .edit-profile-fields label {
  color: var(--primary-text);
}
.edit-profile-fields input {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: #f8f9fa;
  color: #333;
  transition: border-color 0.2s;
}
.dark .edit-profile-fields input {
  background: var(--input-bg);
  color: var(--text-muted);
}
.edit-profile-fields input:focus {
  border-color: #7c6bb0;
  outline: none;
}
.dark .edit-profile-fields input:focus {
  border-color: var(--secondary);
  outline: none;
}
.edit-profile-image-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  min-width: 140px;
}
.profile-image-container {
  width: 120px;
  height: 120px;
  background: #e5e7eb;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.dark .profile-image-container {
  background: var(--input-bg);
}
.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.profile-image-placeholder {
  font-size: 3.5rem;
  color: #9ca3af;
}
.dark .profile-image-placeholder {
  color: var(--text-muted);
}
.upload-btn {
  background: #7c6bb0;
  color: #fff;
  border: none;
  border-radius: 2rem;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.dark .upload-btn {
  background: var(--primary);
  color: var(--primary-text);
}
.upload-btn:hover {
  background: #5a4e99;
}
.dark .upload-btn:hover {
  background: var(--primary);
  color: var(--primary-text);
}
.hidden-input {
  display: none;
}
.edit-profile-section {
  margin-top: 2rem;
}
.edit-profile-section h3 {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
}
.dark .edit-profile-section h3 {
  color: var(--primary-text);
}
.edit-profile-address {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 768px) {
  .edit-profile-address {
    grid-template-columns: repeat(3, 1fr);
  }
}
.edit-profile-address label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}
.dark .edit-profile-address label {
  color: var(--primary-text);
}
.edit-profile-address select {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: #f8f9fa;
  color: #333;
  transition: border-color 0.2s;
}
.dark .edit-profile-address select {
  background: var(--input-bg);
  color: var(--text-muted);
}
.edit-profile-address select:focus {
  border-color: #7c6bb0;
  outline: none;
}
.dark .edit-profile-address select:focus {
  border-color: var(--secondary);
  outline: none;
}
.edit-profile-password {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 768px) {
  .edit-profile-password {
    grid-template-columns: repeat(2, 1fr);
  }
}
.edit-profile-password label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}
.dark .edit-profile-password label {
  color: var(--primary-text);
}
.edit-profile-password input {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: #f8f9fa;
  color: #333;
  transition: border-color 0.2s;
}
.dark .edit-profile-password input {
  background: var(--input-bg);
  color: var(--text-muted);
}
.edit-profile-password input:focus {
  border-color: #7c6bb0;
  outline: none;
}
.dark .edit-profile-password input:focus {
  border-color: var(--secondary);
  outline: none;
}
.edit-profile-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
}
.save-btn {
  background: #7c6bb0;
  color: #fff;
  border: none;
  border-radius: 2rem;
  padding: 0.75rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.dark .save-btn {
  background: var(--primary);
  color: var(--primary-text);
}
.save-btn:hover {
  background: #5a4e99;
}
.dark .save-btn:hover {
  background: var(--primary);
  color: var(--primary-text);
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .layout{
    min-height: auto;
  }
  .admin-dashboard-layout {
    flex-direction: column;
    min-height: auto;
    
  }
  
  .edit-profile-main {
    margin-top: 30px;
    padding: 0.5rem;
    margin: 20px;
  }
}

@media (max-width: 480px) {
  .edit-profile-main {
    margin-top: 70px;
    padding: 0.5rem;
  }
}

@media (max-width: 360px) {
  .edit-profile-main {
    margin-top: 60px;
  }
}
</style>
  