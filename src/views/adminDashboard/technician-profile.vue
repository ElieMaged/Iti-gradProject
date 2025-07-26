<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="technician-profile-bg">
      <div class="technician-profile-main">
        <div class="technician-profile-container">
          <div class="header-row">
            <h2 class="profile-title">Technician Management</h2>
            <div class="action-buttons">
              <button v-if="!isEditing" @click="startEditing" class="edit-btn">
                <i class="fas fa-edit"></i> Edit Profile
              </button>
              <button v-if="isEditing" @click="saveChanges" class="save-btn" :disabled="saving">
                <i class="fas fa-save"></i> {{ saving ? 'Saving...' : 'Save Changes' }}
              </button>
              <button v-if="isEditing" @click="cancelEditing" class="cancel-btn">
                <i class="fas fa-times"></i> Cancel
              </button>
            </div>
          </div>
          
          <div class="profile-section-title">Personal Information</div>
          
          <!-- Loading State -->
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading technician profile...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="error-state">
            <p class="error-message">{{ error }}</p>
            <button @click="fetchTechnician" class="retry-btn">Retry</button>
          </div>

          <!-- Technician Profile -->
          <div v-else-if="technician" class="profile-content-row">
            <div class="profile-info">
              <!-- View Mode -->
              <div v-if="!isEditing">
                <div class="profile-info-block">
                  <div class="profile-label">Full Name</div>
                  <div class="profile-value">{{ technician.fullName }}</div>
                </div>
                <div class="profile-info-block">
                  <div class="profile-label">Email Address</div>
                  <div class="profile-value">{{ technician.email }}</div>
                </div>
                <div class="profile-info-block">
                  <div class="profile-label">Specialization</div>
                  <div class="profile-value">{{ technician.specialization }}</div>
                </div>
                <div class="profile-info-block">
                  <div class="profile-label">Experience</div>
                  <div class="profile-value">{{ technician.experience }} years</div>
                </div>
                <div class="profile-info-block">
                  <div class="profile-label">Location</div>
                  <div class="profile-value">{{ technician.government }}, {{ technician.district }}</div>
                </div>
                <div class="profile-info-block">
                  <div class="profile-label">Base Price</div>
                  <div class="profile-value">${{ technician.basePrice }}</div>
                </div>
                <div class="profile-info-block">
                  <div class="profile-label">Willing to Travel</div>
                  <div class="profile-value">{{ technician.willingToTravel === 'yes' ? 'Yes' : 'No' }}</div>
                </div>
                <div class="profile-info-block">
                  <div class="profile-label">About</div>
                  <div class="profile-value">{{ technician.bio || 'No bio available' }}</div>
                </div>
                <div class="profile-info-block">
                  <div class="profile-label">Status</div>
                  <div class="profile-value">
                    <span :class="[
                      'status-badge',
                      technician.status === 'approved' ? 'status-approved' : 'status-pending'
                    ]">
                      {{ technician.status === 'approved' ? 'Approved' : 'Pending' }}
                    </span>
                  </div>
                </div>
                <div class="profile-info-block">
                  <div class="profile-label">Joined</div>
                  <div class="profile-value">{{ formatDate(technician.createdAt) }}</div>
                </div>
              </div>

              <!-- Edit Mode -->
              <div v-else class="edit-form">
                <div class="profile-info-block">
                  <div class="profile-label">Full Name</div>
                  <input v-model="editData.fullName" type="text" class="edit-input" />
                </div>
                <div class="profile-info-block">
                  <div class="profile-label">Email Address</div>
                  <input v-model="editData.email" type="email" class="edit-input" />
                </div>
                <div class="profile-info-block">
                  <div class="profile-label">Specialization</div>
                  <select v-model="editData.specialization" class="edit-input">
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Wall Finishing">Wall Finishing</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="Air Conditioning">Air Conditioning</option>
                  </select>
                </div>
                <div class="profile-info-block">
                  <div class="profile-label">Experience (years)</div>
                  <input v-model.number="editData.experience" type="number" class="edit-input" min="0" max="50" />
                </div>
                <div class="profile-info-block">
                  <div class="profile-label">Government</div>
                  <input v-model="editData.government" type="text" class="edit-input" />
                </div>
                <div class="profile-info-block">
                  <div class="profile-label">District</div>
                  <input v-model="editData.district" type="text" class="edit-input" />
                </div>
                <div class="profile-info-block">
                  <div class="profile-label">Base Price ($)</div>
                  <input v-model.number="editData.basePrice" type="number" class="edit-input" min="0" />
                </div>
                <div class="profile-info-block">
                  <div class="profile-label">Willing to Travel</div>
                  <select v-model="editData.willingToTravel" class="edit-input">
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div class="profile-info-block">
                  <div class="profile-label">About</div>
                  <textarea v-model="editData.bio" class="edit-textarea" rows="4"></textarea>
                </div>
                <div class="profile-info-block">
                  <div class="profile-label">Status</div>
                  <select v-model="editData.status" class="edit-input">
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <button class="delete-btn" @click="handleDelete">Delete Account</button>
            </div>
            <div class="profile-photo-col">
              <img :src="technician.idPhotoUrl || 'https://randomuser.me/api/portraits/men/1.jpg'" 
                   alt="Technician Photo" 
                   class="profile-photo" />
            </div>
          </div>

          <!-- Not Found State -->
          <div v-else class="not-found">
            <h3>Technician not found</h3>
            <p>The technician you're looking for doesn't exist.</p>
            <button @click="$router.push('/all-technician')" class="back-btn">Back to Technicians</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminSidebar from '../../components/admin-sidebar.vue';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default {
  components: { AdminSidebar },
  data() {
    return {
      technician: null,
      loading: true,
      error: null,
      isEditing: false,
      saving: false,
      editData: {}
    };
  },
  async mounted() {
    await this.fetchTechnician();
  },
  methods: {
    async fetchTechnician() {
      try {
        this.loading = true;
        this.error = null;
        
        const technicianId = this.$route.params.id;
        console.log('🔍 Fetching technician with ID:', technicianId);
        
        const technicianDoc = doc(db, 'technicians', technicianId);
        const technicianSnap = await getDoc(technicianDoc);
        
        if (technicianSnap.exists()) {
          this.technician = {
            id: technicianSnap.id,
            ...technicianSnap.data()
          };
          console.log('✅ Technician loaded:', this.technician);
        } else {
          console.log('❌ Technician not found');
          this.technician = null;
        }
        
      } catch (error) {
        console.error('❌ Error fetching technician:', error);
        this.error = 'Failed to fetch technician profile';
      } finally {
        this.loading = false;
      }
    },
    
    startEditing() {
      this.editData = {
        fullName: this.technician.fullName || '',
        email: this.technician.email || '',
        specialization: this.technician.specialization || '',
        experience: this.technician.experience || 0,
        government: this.technician.government || '',
        district: this.technician.district || '',
        basePrice: this.technician.basePrice || 0,
        willingToTravel: this.technician.willingToTravel || 'no',
        bio: this.technician.bio || '',
        status: this.technician.status || 'pending'
      };
      this.isEditing = true;
    },
    
    cancelEditing() {
      this.isEditing = false;
      this.editData = {};
    },
    
    async saveChanges() {
      try {
        this.saving = true;
        
        // Validate required fields
        if (!this.editData.fullName || !this.editData.email || !this.editData.specialization) {
          alert('Please fill in all required fields (Full Name, Email, Specialization)');
          return;
        }
        
        console.log('💾 Saving technician changes:', this.editData);
        
        // Update in Firebase
        const technicianDoc = doc(db, 'technicians', this.technician.id);
        await updateDoc(technicianDoc, {
          ...this.editData,
          updatedAt: new Date()
        });
        
        // Update local data
        this.technician = {
          ...this.technician,
          ...this.editData,
          updatedAt: new Date()
        };
        
        console.log('✅ Technician updated successfully');
        
        // Exit edit mode
        this.isEditing = false;
        this.editData = {};
        
        // Show success message
        alert('Technician profile updated successfully!');
        
      } catch (error) {
        console.error('❌ Error updating technician:', error);
        alert('Failed to update technician profile. Please try again.');
      } finally {
        this.saving = false;
      }
    },
    
    async handleDelete() {
      if (!this.technician) return;
      
      if (!confirm(`Are you sure you want to delete ${this.technician.fullName}? This action cannot be undone.`)) {
        return;
      }

      try {
        console.log('🗑️ Deleting technician:', this.technician.fullName);
        
        // Remove from technicians collection
        const technicianDoc = doc(db, 'technicians', this.technician.id);
        await deleteDoc(technicianDoc);
        console.log('✅ Technician deleted from Firestore');

        // Show success message and redirect
        alert(`Technician ${this.technician.fullName} has been deleted successfully!`);
        this.$router.push('/all-technician');
        
      } catch (error) {
        console.error('❌ Error deleting technician:', error);
        alert('Failed to delete technician. Please try again.');
      }
    },
    
    formatDate(timestamp) {
      if (!timestamp) return 'N/A';
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString();
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

.technician-profile-bg {
  flex: 1;
  padding: 2.5rem;
}

.technician-profile-main {
  max-width: 80rem;
  margin: 0 auto;
}

.technician-profile-container {
  background: #fff;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.profile-title {
  font-size: 2rem;
  font-weight: bold;
  color: #7c6bb0;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.edit-btn, .save-btn, .cancel-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.edit-btn {
  background: #3b82f6;
  color: white;
}

.edit-btn:hover {
  background: #2563eb;
}

.save-btn {
  background: #10b981;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: #059669;
}

.save-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.cancel-btn {
  background: #6b7280;
  color: white;
}

.cancel-btn:hover {
  background: #4b5563;
}

.profile-section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #7c6bb0;
  margin-bottom: 1.5rem;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #7c6bb0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.error-message {
  color: #ef4444;
  margin-bottom: 1rem;
  text-align: center;
}

.retry-btn {
  background: #7c6bb0;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-btn:hover {
  background: #6b5fa7;
}

.profile-content-row {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  align-items: start;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-info-block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.profile-info-flex {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.profile-label {
  font-weight: 600;
  color: #6b7280;
  font-size: 0.9rem;
}

.profile-value {
  color: #1f2937;
  font-size: 1rem;
  line-height: 1.5;
}

/* Edit Form Styles */
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.edit-input, .edit-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
  background: #fff;
}

.edit-input:focus, .edit-textarea:focus {
  outline: none;
  border-color: #7c6bb0;
  box-shadow: 0 0 0 3px rgba(124, 107, 176, 0.1);
}

.edit-textarea {
  resize: vertical;
  min-height: 100px;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-approved {
  background-color: #d1fae5;
  color: #065f46;
}

.status-pending {
  background-color: #fef3c7;
  color: #92400e;
}

.profile-photo-col {
  display: flex;
  justify-content: center;
}

.profile-photo {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e5e7eb;
}

.delete-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

.delete-btn:hover {
  background: #dc2626;
}

.not-found {
  text-align: center;
  padding: 3rem;
}

.not-found h3 {
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.not-found p {
  color: #9ca3af;
  margin-bottom: 1.5rem;
}

.back-btn {
  background: #7c6bb0;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background: #6b5fa7;
}

@media (max-width: 768px) {
  .technician-profile-bg {
    padding: 1rem;
  }
  
  .header-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .action-buttons {
    width: 100%;
    justify-content: flex-start;
  }
  
  .profile-content-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .profile-info-flex {
    grid-template-columns: 1fr;
  }
  
  .profile-photo {
    width: 150px;
    height: 150px;
  }
}
</style>
