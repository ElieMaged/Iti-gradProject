<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="technician-profile-bg mx-12 p-4">
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
                <div class="profile-info-block mb-4">
                  <div class="profile-label">Full Name</div>
                  <div class="profile-value">{{ technician.fullName }}</div>
                </div>
                <div class="profile-info-block mb-4">
                  <div class="profile-label">Email Address</div>
                  <div class="profile-value">{{ technician.email }}</div>
                </div>
                <div class="profile-info-block mb-4">
                  <div class="profile-label">Specialization</div>
                  <div class="profile-value">{{ technician.specialization }}</div>
                </div>
                <div class="profile-info-block mb-4">
                  <div class="profile-label">Experience</div>
                  <div class="profile-value">{{ technician.experience }} years</div>
                </div>
                <div class="profile-info-block mb-4">
                  <div class="profile-label">Location</div>
                  <div class="profile-value">{{ technician.government }}, {{ technician.district }}</div>
                </div>
                <div class="profile-info-block mb-4">
                  <div class="profile-label">Base Price</div>
                  <div class="profile-value">${{ technician.basePrice }}</div>
                </div>
                <div class="profile-info-block mb-4">
                  <div class="profile-label">Willing to Travel</div>
                  <div class="profile-value">{{ technician.willingToTravel === 'yes' ? 'Yes' : 'No' }}</div>
                </div>
                <div class="profile-info-block mb-4">
                  <div class="profile-label">About</div>
                  <div class="profile-value">{{ technician.bio || 'No bio available' }}</div>
                </div>
                <div class="profile-info-block mb-4">
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

              <div class="flex items-center gap-2 mt-4">
                <button class="back-btn" @click="$router.push('/all-technician')">Back to Technicians</button>
                <button class="delete-btn" @click="handleDelete" style="margin-top: 0;">Delete Account</button>
              </div>
            </div>
            <div class="profile-photo-col">
              <div class="photo-section">
                <h3 class="photo-title">Profile Picture</h3>
                <img :src="technician.profilePhotoUrl || 'https://randomuser.me/api/portraits/men/1.jpg'"
                     alt="Profile Picture"
                     class="profile-photo profile-picture" />
              </div>
              <div class="photo-section">
                <h3 class="photo-title">ID Photo</h3>
                <img :src="technician.idPhotoUrl || 'https://randomuser.me/api/portraits/men/1.jpg'"
                     alt="ID Photo"
                     class="profile-photo id-photo"
                     @click="openIdPhotoModal" />
              </div>
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
    
    <!-- ID Photo Full Screen Modal -->
    <div v-if="showIdPhotoModal" class="modal-overlay" @click="closeIdPhotoModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>ID Photo - Full Screen View</h3>
          <button class="close-btn" @click="closeIdPhotoModal">&times;</button>
        </div>
        <div class="modal-body"
             @wheel="handleWheel"
             @mousedown="handleMouseDown"
             @mousemove="handleMouseMove"
             @mouseup="handleMouseUp"
             @mouseleave="handleMouseUp">
          <img :src="technician.idPhotoUrl || 'https://randomuser.me/api/portraits/men/1.jpg'"
               alt="ID Photo Full Screen"
               class="full-screen-image"
               :style="{
                 transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                 cursor: isDragging ? 'grabbing' : 'grab'
               }" />
        </div>
        <div class="modal-controls">
          <button @click="zoomIn" class="control-btn">Zoom In (+)</button>
          <button @click="zoomOut" class="control-btn">Zoom Out (-)</button>
          <button @click="resetZoom" class="control-btn">Reset</button>
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
      editData: {},
      showIdPhotoModal: false,
      zoomLevel: 1,
      position: { x: 0, y: 0 },
      isDragging: false,
      dragStart: { x: 0, y: 0 }
    };
  },
  async mounted() {
    console.log('🎯 Technician Profile Component Mounted');
    console.log('📍 Route params:', this.$route.params);
    console.log('📍 Route path:', this.$route.path);
    await this.fetchTechnician();
  },
  methods: {
    async fetchTechnician() {
      try {
        this.loading = true;
        this.error = null;
        
        const technicianId = this.$route.params.id;
        console.log('🔍 Fetching technician with ID:', technicianId);
        
        if (!technicianId) {
          console.error('❌ No technician ID in route params');
          this.error = 'No technician ID provided';
          return;
        }
        
        const technicianDoc = doc(db, 'technicians', technicianId);
        const technicianSnap = await getDoc(technicianDoc);
        
        if (technicianSnap.exists()) {
          this.technician = {
            id: technicianSnap.id,
            ...technicianSnap.data()
          };
          console.log('✅ Technician loaded:', this.technician);
        } else {
          console.log('❌ Technician not found in Firestore');
          this.technician = null;
          this.error = 'Technician not found';
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
    },
    
    openIdPhotoModal() {
      this.showIdPhotoModal = true;
      this.zoomLevel = 1;
      this.position = { x: 0, y: 0 };
    },
    
    closeIdPhotoModal() {
      this.showIdPhotoModal = false;
    },
    
    zoomIn() {
      this.zoomLevel = Math.min(this.zoomLevel + 0.2, 3);
    },
    
    zoomOut() {
      this.zoomLevel = Math.max(this.zoomLevel - 0.2, 0.5);
    },
    
    resetZoom() {
      this.zoomLevel = 1;
      this.position = { x: 0, y: 0 };
    },
    
    handleMouseDown(event) {
      this.isDragging = true;
      this.dragStart = {
        x: event.clientX - this.position.x,
        y: event.clientY - this.position.y
      };
    },
    
    handleMouseMove(event) {
      if (this.isDragging) {
        this.position = {
          x: event.clientX - this.dragStart.x,
          y: event.clientY - this.dragStart.y
        };
      }
    },
    
    handleMouseUp() {
      this.isDragging = false;
    },
    
    handleWheel(event) {
      event.preventDefault();
      const zoomFactor = event.deltaY < 0 ? 0.1 : -0.1;
      this.zoomLevel = Math.min(Math.max(this.zoomLevel + zoomFactor, 0.5), 3);
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
  margin-left: 14rem;
}

.technician-profile-bg {
  flex: 1;
  padding: 2rem 0;
}


.technician-profile-container {
  background: #fff;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: auto;
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
  flex-direction: row;
  gap: 2rem;
  justify-content: center;
  align-items: center;
}

.photo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.photo-title {
  font-weight: 600;
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

.profile-photo {
  width: 300px;
  height: 200px;
  border-radius: 0;
  object-fit: cover;
  border: 4px solid #e5e7eb;
}

.id-photo {
  border-radius: 0;
  width: 300px;
  height: 200px;
  object-fit: cover;
  cursor: pointer;
}

.profile-picture {
  border-radius: 0;
}

.delete-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
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
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background: #6b5fa7;
}

@media (max-width: 768px) {
  .technician-profile-bg {
    padding: 1rem;
    margin: 0;
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
  
  .profile-photo-col {
    flex-direction: column;
  }
  
  .profile-photo {
    width: 250px;
    height: 160px;
  }
  
  .id-photo {
    width: 250px;
    height: 160px;
  }
}

/* Full Screen Image Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 1rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.full-screen-image {
  max-width: 100%;
  max-height: 70vh;
  transition: transform 0.2s ease;
  user-select: none;
}

.modal-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid #eee;
}

.control-btn {
  background: #7c6bb0;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.control-btn:hover {
  background: #6b5fa7;
}
</style>
