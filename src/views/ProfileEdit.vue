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
              <div class="edit-profile-image-section">
                <div class="profile-image-container">
                  <img v-if="profileImageUrl" :src="profileImageUrl" alt="Profile" class="profile-image" />
                  <i v-else class="fas fa-user profile-image-placeholder"></i>
                </div>
                <button type="button" class="upload-btn" @click="triggerFileInput">{{ $t('uploadPhotoButton') }}</button>
                <input ref="fileInput" type="file" accept="image/*" class="hidden-input" @change="onFileChange" />
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

<script>
import userSidebar from '../components/userSidebar.vue';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

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
  color: var(--primary-text);
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
  color: var(--primary-text-dark);
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
  color: var(--text-muted);
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
</style> 