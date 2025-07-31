<template>
  <div class="admin-dashboard-layout">
    <userSidebar :activeTab="activeTab" @navigate="handleSidebarNavigate" />
    <div class="edit-profile-main mr-20 p-4">
      <div class="edit-profile-wrapper">
        <div class="edit-profile-card">
          <div class="edit-profile-header">
            <h2>{{ $t('editProfileTitle') }}</h2>
          </div>
          <form class="edit-profile-form" @submit.prevent="saveProfile">
            <div class="edit-profile-content">
                <!-- Profile Image Section - Will be moved to top on mobile -->
                <div class="edit-profile-image-section profile-image-mobile">
                  <div class="profile-image-container">
                    <img v-if="profileImageUrl" :src="profileImageUrl" alt="Profile" class="profile-image" />
                    <i v-else class="fas fa-user profile-image-placeholder"></i>
                  </div>
                  <button type="button" class="upload-btn" @click="triggerFileInput">{{ $t('uploadPhotoButton') }}</button>
                  <input ref="fileInput" type="file" accept="image/*" class="hidden-input" @change="onFileChange" />
                </div>
                <div class="edit-profile-fields">
                <div>
                  <label for="fullName">{{ $t('fullNameLabel') }}</label>
                  <input type="text" id="fullName" v-model="form.fullName" required />
                </div>
                <div>
                  <label for="email">{{ $t('emailAddressLabel') }}</label>
                  <input type="email" id="email" v-model="form.email" required />
                </div>
                <div>
                  <label for="phone">{{ $t('phoneNumberLabel') }}</label>
                  <input type="text" id="phone" v-model="form.phone" required />
                </div>
                <div>
                  <label for="gender">{{ $t('gender') }}</label>
                  <select id="gender" v-model="form.gender" required>
                    <option value="">{{ $t('selectGender') }}</option>
                    <option value="male">{{ $t('male') }}</option>
                    <option value="female">{{ $t('female') }}</option>
                    <option value="other">{{ $t('other') }}</option>
                  </select>
                </div>
                <div>
                  <label for="age">{{ $t('age') }}</label>
                  <input type="number" id="age" v-model="form.age" min="18" max="120" required />
                </div>
                <div>
                  <label for="address">{{ $t('address') }}</label>
                  <input type="text" id="address" v-model="form.address" required />
                </div>
                <div>
                  <label for="area">{{ $t('area') }}</label>
                  <input type="text" id="area" v-model="form.area" required />
                </div>
              <div>
                  <label for="city">{{ $t('city') }}</label>
                  <input type="text" id="city" v-model="form.city" required />
              </div>
              </div>
            </div>
            <div class="edit-profile-actions">
              <button type="submit" class="save-btn">{{ $t('saveChangesButton') }}</button>
          </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script >
import { auth, db } from '../firebase';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import userSidebar from '../components/userSidebar.vue';

export default {
  components: {
    userSidebar
  },
  data() {
    return {
      activeTab: 'settings',
      loading: true,
      error: '',
      profileImageUrl: '',
      form: {
        fullName: '',
        email: '',
        phone: '',
        gender: '',
        age: '',
        address: '',
        area: '',
        city: '',
      }
    }
  },
  async mounted() {
    await this.loadUserData();
  },
  methods: {
    handleSidebarNavigate(route) {
      this.$router.push(route);
    },
    async loadUserData() {
      try {
        this.loading = true;
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          this.form = {
            fullName: userData.fullName || '',
            email: userData.email || '',
            phone: userData.phone || '',
            gender: userData.gender || '',
            age: userData.age || '',
            address: userData.address || '',
            area: userData.area || '',
            city: userData.city || '',
          };
          this.profileImageUrl = userData.profileImageUrl || '';
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        this.error = 'Failed to load user data';
      } finally {
        this.loading = false;
      }
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
    async saveProfile() {
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          ...this.form,
          profileImageUrl: this.profileImageUrl,
          updatedAt: new Date()
        });
        alert('Profile saved successfully!');
      } catch (error) {
        console.error('Error saving profile:', error);
        alert('Failed to save profile. Please try again.');
      }
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
.edit-profile-wrapper {
  max-width: 1000px;
  margin: 0 auto;
}
.edit-profile-card {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 10px 15px rgba(0,0,0,0.08);
  padding: 2rem;
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
.edit-profile-fields input,
.edit-profile-fields select,
.edit-profile-fields textarea {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: #f8f9fa;
  color: #333;
  transition: border-color 0.2s;
}
.dark .edit-profile-fields input,
.dark .edit-profile-fields select,
.dark .edit-profile-fields textarea {
  background: var(--input-bg);
  color: var(--text-muted );
}
.edit-profile-fields input:focus,
.edit-profile-fields select:focus,
.edit-profile-fields textarea:focus {
  border-color: #7c6bb0;
  outline: none;
}
.dark .edit-profile-fields input:focus,
.dark .edit-profile-fields select:focus,
.dark .edit-profile-fields textarea:focus {
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
  border-radius: 0.5rem;
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

/* RTL Support for Arabic */
[dir="rtl"] .edit-profile-header h2 { text-align: right; }
[dir="rtl"] .edit-profile-fields label { text-align: right; }
[dir="rtl"] .edit-profile-section h3 { text-align: right; }
[dir="rtl"] .edit-profile-actions { justify-content: flex-start; }
[dir="rtl"] .edit-profile-content { direction: rtl; }
[dir="rtl"] .edit-profile-fields { direction: rtl; }

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .layout {
    flex-direction: column;
    min-height: auto;
  }
  .admin-dashboard-layout {
    flex-direction: column;
  }
  
  .edit-profile-main {
    margin-top: 80px;
    padding: 1rem;
    margin-right: 0;
  }
  
  .edit-profile-wrapper {
    max-width: 100%;
  }
  
  .edit-profile-card {
    padding: 1.5rem;
    border-radius: 0.75rem;
  }
  
  .edit-profile-header h2 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
  
  /* Mobile: Image at top, form fields below */
  .edit-profile-content {
    flex-direction: column;
  }
  
  .profile-image-mobile {
    order: -1;
    margin-bottom: 1.5rem;
  }
  
  .edit-profile-image-section {
    margin-top: 0;
    margin-bottom: 1.5rem;
  }
  
  .edit-profile-fields {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .edit-profile-fields > div {
    padding: 0.75rem;
    background-color: #f8f9fa;
    border-radius: 0.5rem;
  }
  
  .dark .edit-profile-fields > div {
    background-color: var(--secondary-bg);
  }
  
  .edit-profile-fields label {
    font-size: 1rem;
  }
  
  .edit-profile-fields input,
  .edit-profile-fields select {
    font-size: 0.875rem;
  }
  
  .profile-image-container {
    width: 8rem;
    height: 8rem;
  }
  
  .profile-image-placeholder {
    font-size: 2.5rem;
  }
  
  .upload-btn {
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
  }
}

@media (max-width: 480px) {
  .edit-profile-main {
    margin-top: 60px;
    padding: 0.75rem;
  }
  
  .edit-profile-card {
    padding: 1rem;
  }
  
  .edit-profile-header h2 {
    font-size: 1.125rem;
  }
  
  .edit-profile-fields > div {
    padding: 0.5rem;
  }
  
  .edit-profile-fields label {
    font-size: 0.875rem;
  }
  
  .edit-profile-fields input,
  .edit-profile-fields select {
    font-size: 0.75rem;
  }
  
  .profile-image-container {
    width: 6rem;
    height: 6rem;
  }
  
  .profile-image-placeholder {
    font-size: 2rem;
  }
  
  .upload-btn {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
  }
}
</style> 