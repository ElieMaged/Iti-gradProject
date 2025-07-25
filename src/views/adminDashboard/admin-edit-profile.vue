<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="edit-profile-main">
      <div class="edit-profile-wrapper">
        <div class="edit-profile-card">
          <div class="edit-profile-header">
            <h2>Edit Profile</h2>
          </div>
          <form class="edit-profile-form" @submit.prevent="updateProfile">
            <div class="edit-profile-content">
              <div class="edit-profile-fields">
                <div>
                  <label for="name">Full Name</label>
                  <input type="text" id="name" v-model="form.name" required />
                </div>
                <div>
                  <label for="email">Email Address</label>
                  <input type="email" id="email" v-model="form.email" required />
                </div>
                <div>
                  <label for="phone">Phone Number</label>
                  <input type="text" id="phone" v-model="form.phone" required />
                </div>
                <div>
                  <label for="nationalId">National ID</label>
                  <input type="text" id="nationalId" v-model="form.nationalId" required />
                </div>
              </div>
              <div class="edit-profile-image-section">
                <div class="profile-image-container">
                  <img v-if="profileImage" :src="profileImage" alt="Profile" class="profile-image" />
                  <i v-else class="fas fa-user profile-image-placeholder"></i>
                </div>
                <button type="button" class="upload-btn" @click="triggerUpload">Upload</button>
                <input ref="fileInput" type="file" accept="image/*" class="hidden-input" @change="handleImageUpload" />
              </div>
            </div>
            <div class="edit-profile-section">
              <h3>Change Address</h3>
              <div class="edit-profile-address">
                <div>
                  <label for="city">City</label>
                  <select id="city" v-model="form.city">
                    <option value="">Select Government</option>
                    <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
                  </select>
                </div>
                <div>
                  <label for="area">Area</label>
                  <select id="area" v-model="form.area">
                    <option v-for="area in areas" :key="area" :value="area">{{ area }}</option>
                  </select>
                </div>
                <div>
                  <label for="street">Street Name</label>
                  <select id="street" v-model="form.street">
                    <option v-for="street in streets" :key="street" :value="street">{{ street }}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="edit-profile-section">
              <h3>Change Password</h3>
              <div class="edit-profile-password">
                <div>
                  <label for="oldPassword">Old Password</label>
                  <input type="password" id="oldPassword" v-model="form.oldPassword" />
                </div>
                <div>
                  <label for="newPassword">New Password</label>
                  <input type="password" id="newPassword" v-model="form.newPassword" />
                </div>
              </div>
            </div>
            <div class="edit-profile-actions">
              <button type="submit" class="save-btn">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminSidebar from '../../components/admin-sidebar.vue';
export default {
  components: { AdminSidebar },
  data() {
    return {
      profileImage: null,
      form: {
        name: 'Mohamed Ali Mohamed',
        email: 'mohamed@gmail.com',
        phone: '+20 011 555 2323',
        nationalId: '60504441591478',
        city: 'Cairo',
        area: 'Dokki',
        street: 'Tahrir Street',
        oldPassword: '',
        newPassword: ''
      },
      cities: ["Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira", "Fayoum", "Gharbiya", "Ismailia", "Menoufia", "Minya", "Qaliubiya", "New Valley", "Suez", "Aswan", "Assiut", "Beni Suef", "Port Said", "Damietta", "Sharkia", "South Sinai", "Kafr Al sheikh", "Matrouh", "Luxor", "Qena", "North Sinai", "Sohag"],
      areas: ["Dokki", "Maadi", "Zamalek", "6th of October", "Nasr City"],
      streets: ["Tahrir Street", "El Haram Street", "El Merghany Street", "El Nasr Road", "El Thawra Street"]
    };
  },
  methods: {
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
    updateProfile() {
      // Handle form submission logic
      console.log('Form submitted:', this.form);
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
.edit-profile-main {
  flex: 1;
  padding: 2rem;
  background: #f9fafb;
}
.edit-profile-wrapper {
  max-width: 900px;
  margin: 0 auto;
}
.edit-profile-card {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 10px 15px rgba(0,0,0,0.08);
  padding: 2rem;
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
.edit-profile-fields input:focus {
  border-color: #7c6bb0;
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
.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.profile-image-placeholder {
  font-size: 3.5rem;
  color: #9ca3af;
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
.upload-btn:hover {
  background: #5a4e99;
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
.edit-profile-address select:focus {
  border-color: #7c6bb0;
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
.edit-profile-password input:focus {
  border-color: #7c6bb0;
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
.save-btn:hover {
  background: #5a4e99;
}
</style>
  