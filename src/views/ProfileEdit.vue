<template>
  <div class="admin-dashboard-layout">
    <userSidebar :activeTab="activeTab" @navigate="handleSidebarNavigate" />
    <div class="edit-profile-main mr-20 p-4">
      <div class="edit-profile-wrapper">
        <div class="edit-profile-card">
          <div class="edit-profile-header">
            <h2 class="page-title">{{ $t('editProfileTitle') }}</h2>
          </div>
          <form class="edit-profile-form" @submit.prevent="saveProfile">
            <div class="edit-profile-content">
                <!-- Profile Image Section - Will be moved to top on mobile -->
                <div class="edit-profile-image-section profile-image-mobile">
                  <div class="profile-image-container">
                    <img v-if="profileImageUrl" :src="profileImageUrl" alt="Profile" class="profile-image" />
                    <i v-else class="fas fa-user profile-image-placeholder"></i>
                    <div v-if="uploading" class="upload-overlay">
                      <i class="fas fa-spinner fa-spin"></i>
                    </div>
                  </div>
                  <button type="button" class="upload-btn" @click="triggerFileInput" :disabled="uploading">
                    {{ uploading ? $t('uploading') : $t('uploadPhotoButton') }}
                  </button>
                  <input ref="fileInput" type="file" accept="image/*" class="hidden-input" @change="onFileChange" />
                  <div v-if="selectedFile" class="preview-info">
                    <small>File selected: {{ selectedFile.name }}</small>
                  </div>
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
              <button type="submit" class="save-btn" :disabled="uploading || saving">
                {{ saving ? $t('saving') : $t('saveChangesButton') }}
              </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script >
import { auth, db } from '../firebase';
import { ref, onMounted, nextTick } from 'vue';
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
      uploading: false,
      saving: false,
      selectedFile: null,
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
  beforeUnmount() {
    // Clean up any resources if needed
  },
  methods: {
    handleSidebarNavigate(route) {
      this.$router.push(route);
    },
    async loadUserData() {
      try {
        this.loading = true;
        
        // Check if user is authenticated
        if (!auth.currentUser) {
          this.$router.push('/userlogin');
          return;
        }
        
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
      if (this.$refs.fileInput) {
        this.$refs.fileInput.click();
      }
    },
    onFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB');
        return;
      }

      // Store the selected file without preview
      this.selectedFile = file;
      console.log('File selected:', file.name);
    },
    async uploadImageToStorage() {
      if (!this.selectedFile) {
        console.log('No file selected, returning existing URL:', this.profileImageUrl);
        return this.profileImageUrl; // Return existing URL if no new file
      }

      // Check if user is authenticated
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }

      try {
        this.uploading = true;
        console.log('Starting image upload...');
        
        // Convert file to base64 for storage in Firestore
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
          reader.onload = async (event) => {
            try {
              const base64Data = event.target.result;
              console.log('File converted to base64');
              
              // Store the base64 data directly in Firestore
              // This avoids Firebase Storage CORS issues
              resolve(base64Data);
            } catch (error) {
              reject(error);
            }
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(this.selectedFile);
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error(`Failed to upload image: ${error.message}`);
      } finally {
        this.uploading = false;
      }
    },
    async saveProfile() {
      try {
        this.saving = true;
        console.log('Starting profile save...');
        
        // Check if user is authenticated
        if (!auth.currentUser) {
          console.log('User not authenticated, redirecting...');
          this.$router.push('/userlogin');
          return;
        }
        
        // Upload image if a new one was selected
        let finalImageUrl = this.profileImageUrl;
        if (this.selectedFile) {
          console.log('File selected, converting to base64...');
          finalImageUrl = await this.uploadImageToStorage();
          console.log('Final image data length:', finalImageUrl ? finalImageUrl.length : 0);
        } else {
          console.log('No new file selected, keeping existing image data');
        }
        
        // Update user document
        console.log('Updating user document in Firestore...');
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const updateData = {
          ...this.form,
          profileImageUrl: finalImageUrl,
          updatedAt: new Date()
        };
        console.log('Update data:', updateData);
        
        await updateDoc(userRef, updateData);
        console.log('User document updated successfully');
        
        // Update local state
        this.profileImageUrl = finalImageUrl;
        this.selectedFile = null;
        
        // Clear the file input
        if (this.$refs.fileInput) {
          this.$refs.fileInput.value = '';
        }
        
        console.log('Profile saved successfully!');
        alert('Profile saved successfully!');
      } catch (error) {
        console.error('Error saving profile:', error);
        alert(`Failed to save profile: ${error.message}`);
      } finally {
        this.saving = false;
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
/* Standardized Page Title Styles */
.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 2rem;
  text-align: left;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
}

.dark .page-title {
  color: var(--primary-color);
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
  position: relative;
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
.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
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
.upload-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
.dark .upload-btn {
  background: var(--primary);
  color: var(--primary-text);
}
.dark .upload-btn:disabled {
  background: var(--text-muted);
}
.upload-btn:hover:not(:disabled) {
  background: #5a4e99;
}
.dark .upload-btn:hover:not(:disabled) {
  background: var(--primary);
  color: var(--primary-text);
}
.hidden-input {
  display: none;
}
.preview-info {
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
}
.dark .preview-info {
  color: var(--text-muted);
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
.save-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
.dark .save-btn {
  background: var(--primary);
  color: var(--primary-text);
}
.dark .save-btn:disabled {
  background: var(--text-muted);
}
.save-btn:hover:not(:disabled) {
  background: #5a4e99;
}
.dark .save-btn:hover:not(:disabled) {
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
  
  .page-title {
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
  
  .page-title {
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