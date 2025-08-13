<template>

  <div class="admin-dashboard-layout">
    <Sidebar :activeMenu="activeMenu" @navigate="handleSidebarNavigate" />
    <div class="edit-profile-main mx-12 p-4">
      <div class="edit-profile-header">
        <TopBar :title="$t('editProfileTitle')" />
      </div>
      <div class="edit-profile-wrapper">
        <div class="edit-profile-card">
          <form class="edit-profile-form" @submit.prevent="saveProfile">
            <div class="edit-profile-content">
              <!-- Profile Image - Will be moved to top on mobile -->
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
                  <label for="specialization">{{ $t('specializationLabel') }}</label>
                  <select id="specialization" v-model="form.specialization" required>
                    <option value="">{{ $t('selectSpecialization') }}</option>
                    <option value="Plumbing">{{ $t('specializationPlumbing') }}</option>
                    <option value="Electricity">{{ $t('electricityTitle') }}</option>
                    <option value="Carpentry">{{ $t('specializationCarpentry') }}</option>
                    <option value="Painting">{{ $t('specializationPainting') }}</option>
                    <option value="Air Conditioning">{{ $t('specializationACTechnician') }}</option>
                    <option value="Electrical Appliances">{{ $t('electricalApplianceTechnician') }}</option>
                  </select>
                </div>
                <div>
                  <label for="experience">{{ $t('yearsOfExperienceLabel') }}</label>
                  <select id="experience" v-model="form.experience" required>
                    <option value="">{{ $t('selectExperience') }}</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4+">4+</option>
                  </select>
                </div>
                <div>
                  <label for="basePrice">{{ $t('baseVisitPriceLabel') }}</label>
                  <input type="text" id="basePrice" v-model="form.basePrice" required />
                </div>
                <div>
                  <label for="bio">{{ $t('aboutLabel') }}</label>
                  <textarea id="bio" v-model="form.bio" rows="3"></textarea>
                </div>
                <div>
                  <label for="city">{{ $t('cityLabel') }}</label>
                  <select id="city" v-model="form.government">
                    <option value="">{{ $t('selectGovernment') }}</option>
                    <option value="Cairo">{{ $t('cairo') }}</option>
                    <option value="Giza">{{ $t('giza') }}</option>
                    <option value="Alexandria">{{ $t('alexandria') }}</option>
                  </select>
                </div>
                <div>
                  <label for="area">{{ $t('areaLabel') }}</label>
                  <select id="area" v-model="form.district">
                    <option value="">{{ $t('selectArea') }}</option>
                    <option value="Nasr City">{{ $t('nasrCity') }}</option>
                    <option value="Maadi">{{ $t('maadi') }}</option>
                    <option value="Dokki">{{ $t('dokki') }}</option>
                  </select>
                </div>
                <div>
                  <label for="willingToTravel">{{ $t('willingToTravelLabel') }}</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" v-model="form.willingToTravel" value="yes" />
                      <span>{{ $t('yes') }}</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" v-model="form.willingToTravel" value="no" />
                      <span>{{ $t('no') }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="edit-profile-actions">
              <button type="submit" class="save-btn" :disabled="loading">{{ loading ? $t('saving') : $t('saveChangesButton') }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import TopBar from '../../components/TopBar.vue';

import { db } from '../../firebase';
import Sidebar from '../../components/Sidebar.vue';

const router = useRouter();
const activeMenu = ref('technicianeditprofile');
const profileImageUrl = ref('https://randomuser.me/api/portraits/men/32.jpg');
const fileInput = ref(null);
const loading = ref(false);
const error = ref(null);
const currentUser = ref(null);

const form = ref({
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
});

async function fetchTechnicianData() {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      router.push('/userlogin');
      return;
    }

    currentUser.value = user;
    
    // Fetch existing technician data from Firestore
    const technicianRef = doc(db, 'technicians', user.uid);
    const technicianSnap = await getDoc(technicianRef);
    
    if (technicianSnap.exists()) {
      const technicianData = technicianSnap.data();
      console.log('Fetched technician data:', technicianData);
      
      // Populate form with existing data
      form.value = {
        fullName: technicianData.fullName || '',
        email: technicianData.email || user.email || '',
        phone: technicianData.phone || '',
        specialization: technicianData.specialization || '',
        experience: technicianData.experience || '',
        basePrice: technicianData.basePrice || '',
        bio: technicianData.bio || '',
        government: technicianData.government || '',
        district: technicianData.district || '',
        willingToTravel: technicianData.willingToTravel || '',
      };
      
      // Set profile image if exists
      if (technicianData.profilePhotoUrl) {
        profileImageUrl.value = technicianData.profilePhotoUrl;
      } else if (technicianData.idPhotoUrl) {
        profileImageUrl.value = technicianData.idPhotoUrl;
      }
    } else {
      // Set default email from auth
      form.value.email = user.email || '';
    }
    
  } catch (err) {
    console.error('Error fetching technician data:', err);
    error.value = 'Failed to load technician data: ' + err.message;
  }
}

function triggerFileInput() {
  fileInput.value && fileInput.value.click();
}

function onFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profileImageUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

async function saveProfile() {
  try {
    loading.value = true;
    error.value = null;
    
    if (!currentUser.value) {
      error.value = 'User not authenticated';
      return;
    }

    console.log('Saving technician profile data:', form.value);
    
    // Update technician document in Firestore
    const technicianRef = doc(db, 'technicians', currentUser.value.uid);
    await setDoc(technicianRef, {
      ...form.value,
      profilePhotoUrl: profileImageUrl.value,
      updatedAt: new Date()
    }, { merge: true });
    
    // Also update the user document to keep it in sync
    const userRef = doc(db, 'users', currentUser.value.uid);
    await setDoc(userRef, {
      ...form.value,
      profilePhotoUrl: profileImageUrl.value,
      updatedAt: new Date()
    }, { merge: true });
    
    console.log('Technician profile saved successfully!');
    alert('Profile saved successfully!');
    
  } catch (err) {
    console.error('Error saving technician profile:', err);
    error.value = 'Failed to save profile: ' + err.message;
    alert('Failed to save profile: ' + err.message);
  } finally {
    loading.value = false;
  }
}

function handleSidebarNavigate(route) {
  router.push(route);
}

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('Technician authenticated:', user.uid);
      fetchTechnicianData();
    } else {
      console.log('No technician authenticated');
      router.push('/userlogin');
    }
  });
});
</script>

<style scoped>

.admin-dashboard-layout {
  display: flex;
  min-height: auto;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
  background-color: #f9fafb;
  margin-left: 14rem;
  height: 100vh;
}
.dark .admin-dashboard-layout {
  background: var(--primary-bg);
}
.edit-profile-main {
  flex: 1;
  background-color: #f9fafb;
}
.dark .edit-profile-main {
  background: var(--primary-bg);
}
.dark .edit-profile-card {
  background: var(--grey-bg);
}
.edit-profile-wrapper {
  margin: 0 auto;
}
.edit-profile-card {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 10px 15px rgba(0,0,0,0.08);
  padding: 2rem;
  width: auto;
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
.radio-group {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}
.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #333;
  cursor: pointer;
}
.dark .radio-option {
  color: var(--primary-text);
}
.radio-option input[type="radio"] {
  width: auto;
  margin: 0;
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

/* Responsive Design */
@media (max-width: 1200px) {
  .edit-profile-wrapper {
    max-width: 900px;
  }
  
  .edit-profile-fields {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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