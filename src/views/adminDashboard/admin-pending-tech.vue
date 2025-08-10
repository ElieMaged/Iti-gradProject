<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="pending-main mx-12 p-4">
      <TopBar :title="$t('pendingTechnicianApplications')" />
      <div class="pending-container">
        <div class="subtitle-search-row">
          <div class="pending-subtitle">{{ $t('reviewApplications') }}</div>
          <div class="search-wrapper">
            <input 
              type="text" 
              :placeholder="$t('searchApplications')" 
              v-model="searchQuery"
              class="search-input"
            />
            <span class="search-icon"><i class="fas fa-search"></i></span>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>{{ $t('loadingPendingApplications') }}</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <p class="error-message">{{ error }}</p>
          <button @click="fetchPendingApplications" class="retry-btn">{{ $t('retry') }}</button>
        </div>

        <!-- Applications List -->
        <div v-else-if="applications.length > 0" class="applications-grid">
          <div 
            v-for="(application, index) in paginatedApplications" 
            :key="application.id" 
            class="application-card"
          >
            <div class="card-header">
              <div class="applicant-info">
                <img :src="application.profilePhotoUrl || application.idPhotoUrl || 'https://randomuser.me/api/portraits/men/1.jpg'" 
                     :alt="application.fullName" 
                     class="applicant-avatar" />
                <div>
                  <h3 class="applicant-name">{{ application.fullName }}</h3>
                  <p class="applicant-email">{{ application.email }}</p>
                </div>
              </div>
              <div class="application-number">#{{ (currentPage - 1) * itemsPerPage + index + 1 }}</div>
            </div>

            <div class="card-content">
              <div class="info-row">
                <span class="info-label">{{ $t('specialization') }}:</span>
                <span class="info-value">{{ application.specialization }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">{{ $t('experience') }}:</span>
                <span class="info-value">{{ application.experience }} {{ $t('years') }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">{{ $t('location') }}:</span>
                <span class="info-value">{{ application.government }}, {{ application.district }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">{{ $t('basePrice') }}:</span>
                <span class="info-value">${{ application.basePrice }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">{{ $t('willingToTravel') }}:</span>
                <span class="info-value">{{ application.willingToTravel === 'yes' ? $t('yes') : $t('no') }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">{{ $t('bio') }}:</span>
                <span class="info-value bio-text">{{ application.bio }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">{{ $t('applied') }}:</span>
                <span class="info-value">{{ formatDate(application.createdAt) }}</span>
              </div>
            </div>

            <div class="card-actions">
              <button @click="viewIdPhoto(application)" class="action-btn view-btn">
                <i class="fas fa-images"></i> {{ $t('viewPhotos') }}
              </button>
              <button @click="acceptApplication(application)" class="action-btn accept-btn">
                <i class="fas fa-check"></i> {{ $t('accept') }}
              </button>
              <button @click="rejectApplication(application)" class="action-btn reject-btn">
                <i class="fas fa-times"></i> {{ $t('reject') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <p>{{ $t('noPendingApplications') }}</p>
        </div>
        
        <pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @prev-page="prevPage"
          @next-page="nextPage"
        />
      </div>
    </div>

    <!-- Photos Modal -->
    <div v-if="showIdModal" class="modal-overlay" @click="closeIdModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Application Photos - {{ selectedApplication?.fullName }}</h3>
          <button @click="closeIdModal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="photos-container">
            <!-- Profile Photo Section -->
            <div class="photo-section">
              <h4 class="photo-title">Profile Picture</h4>
              <div class="photo-wrapper">
                <img v-if="selectedApplication?.profilePhotoUrl" 
                     :src="selectedApplication.profilePhotoUrl" 
                     alt="Profile Photo" 
                     class="application-photo" />
                <p v-else class="no-photo">No profile picture uploaded</p>
              </div>
            </div>
            
            <!-- ID Photo Section -->
            <div class="photo-section">
              <h4 class="photo-title">ID Photo</h4>
              <div class="photo-wrapper">
                <img v-if="selectedApplication?.idPhotoUrl" 
                     :src="selectedApplication.idPhotoUrl" 
                     alt="ID Photo" 
                     class="application-photo" />
                <p v-else class="no-photo">No ID photo uploaded</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminSidebar from '../../components/admin-sidebar.vue';
import TopBar from '../../components/TopBar.vue';
import Pagination from '../../components/pagination.vue';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../../utils/emailjsConfig';

export default {
  name: 'AdminPendingTech',
  components: {
    AdminSidebar,
    TopBar,
    Pagination
  },
  data() {
    return {
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 6,
      applications: [],
      loading: true,
      error: null,
      showIdModal: false,
      selectedApplication: null
    };
  },
  computed: {
    filteredApplications() {
      if (!this.searchQuery.trim()) return this.applications;
      const q = this.searchQuery.toLowerCase();
      return this.applications.filter(app =>
        app.fullName?.toLowerCase().includes(q) ||
        app.email?.toLowerCase().includes(q) ||
        app.specialization?.toLowerCase().includes(q) ||
        app.government?.toLowerCase().includes(q)
      );
    },
    totalPages() {
      return Math.ceil(this.filteredApplications.length / this.itemsPerPage);
    },
    paginatedApplications() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredApplications.slice(start, end);
    }
  },
  async mounted() {
    await this.fetchPendingApplications();
  },
  methods: {
    async fetchPendingApplications() {
      try {
        this.loading = true;
        this.error = null;
        
        console.log('🔍 Fetching pending technician applications...');
        
        const pendingCollection = collection(db, 'pendingTechnicians');
        const snapshot = await getDocs(pendingCollection);
        
        this.applications = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log('✅ Pending applications loaded:', this.applications.length);
        
      } catch (error) {
        console.error('❌ Error fetching applications:', error);
        this.error = 'Failed to fetch applications';
      } finally {
        this.loading = false;
      }
    },

    // Function to send acceptance email to technician
    async sendAcceptanceEmail(application) {
      try {
        console.log('=== SENDING ACCEPTANCE EMAIL TO TECHNICIAN ===');
        console.log('Application:', application);
        console.log('Technician Email:', application.email);
        console.log('Technician Name:', application.fullName);

        // Initialize EmailJS before sending
        emailjs.init(EMAILJS_CONFIG.publicKey);

        const templateParams = {
          to_email: application.email,
          to_name: application.fullName,
          user_name: application.fullName,
          service_name: 'BoltFix',
          specialization: application.specialization,
          experience: application.experience
        };

        const response = await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          'template_rn9r37x', // Use the specified template ID
          templateParams,
          EMAILJS_CONFIG.publicKey
        );

        console.log('✅ Acceptance email sent successfully:', response);
        return response;
      } catch (error) {
        console.error('=== ERROR SENDING ACCEPTANCE EMAIL ===');
        console.error('Error details:', error);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error status:', error.status);
        console.error('Error text:', error.text);
        throw error;
      }
    },

    // Function to send application status notification to technician
    async sendApplicationStatusNotification(application, status) {
      try {
        console.log('=== SENDING APPLICATION STATUS NOTIFICATION ===');
        console.log('Application:', application);
        console.log('Status:', status);
        
        const notificationData = {
          type: 'application_status_update',
          title: status === 'approved' ? 'Application Approved!' : 'Application Rejected',
          message: status === 'approved' 
            ? `Your technician application has been approved! You can now start accepting bookings.`
            : `Your technician application has been rejected. You can contact support for more information.`,
          technicianId: application.id,
          technicianName: application.fullName,
          technicianEmail: application.email,
          specialization: application.specialization,
          experience: application.experience,
          status: status,
          createdAt: new Date(),
          read: false
        };
        
        console.log('Notification data prepared:', notificationData);
        
        // Send notification to the technician
        const technicianNotification = {
          ...notificationData,
          recipientId: application.id, // The technician's UID
          recipientType: 'technician',
          message: status === 'approved' 
            ? `Congratulations! Your technician application for ${application.specialization} has been approved. You can now start accepting bookings and earning money.`
            : `Unfortunately, your technician application for ${application.specialization} has been rejected. You can contact support at support@boltfix.com for more information.`
        };
        
        console.log('Technician notification object:', technicianNotification);
        
        // Send notification to admin
        const adminNotification = {
          ...notificationData,
          recipientId: 'admin',
          recipientType: 'admin',
          message: `Application ${status}: ${application.fullName} (${application.email}) for ${application.specialization} position.`
        };
        
        console.log('Admin notification object:', adminNotification);
        
        // Add notifications to Firebase
        console.log('Adding technician notification to Firebase...');
        const technicianNotificationRef = await addDoc(collection(db, 'notifications'), technicianNotification);
        console.log('Technician notification added with ID:', technicianNotificationRef.id);
        
        console.log('Adding admin notification to Firebase...');
        const adminNotificationRef = await addDoc(collection(db, 'notifications'), adminNotification);
        console.log('Admin notification added with ID:', adminNotificationRef.id);
        
        console.log('=== APPLICATION STATUS NOTIFICATIONS SENT SUCCESSFULLY ===');
        return true;
        
      } catch (error) {
        console.error('=== ERROR SENDING APPLICATION STATUS NOTIFICATION ===');
        console.error('Error details:', error);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        return false;
      }
    },

    async acceptApplication(application) {
      if (!confirm(`Are you sure you want to accept ${application.fullName} as a technician?`)) {
        return;
      }

      try {
        console.log('✅ Accepting application for:', application.fullName);
        
        // Move to technicians collection
        await setDoc(doc(db, 'technicians', application.id), {
          ...application,
          status: 'approved',
          role: 'technician',
          approvedAt: new Date(),
          updatedAt: new Date()
        });
        
        // Update user role in users collection
        await updateDoc(doc(db, 'users', application.id), {
          role: 'technician',
          updatedAt: new Date()
        });
        
        // Remove from pending applications
        await deleteDoc(doc(db, 'pendingTechnicians', application.id));
        
        // Send notification to technician
        await this.sendApplicationStatusNotification(application, 'approved');
        
        // Send acceptance email to technician
        try {
          await this.sendAcceptanceEmail(application);
          console.log('✅ Acceptance email sent successfully to:', application.email);
        } catch (emailError) {
          console.error('❌ Failed to send acceptance email:', emailError);
          // Don't fail the acceptance if email fails
        }
        
        // Remove from local array
        const index = this.applications.findIndex(app => app.id === application.id);
        if (index > -1) {
          this.applications.splice(index, 1);
        }
        
        alert(`Application for ${application.fullName} has been approved!`);
        
      } catch (error) {
        console.error('❌ Error accepting application:', error);
        alert('Failed to accept application. Please try again.');
      }
    },

    async rejectApplication(application) {
      if (!confirm(`Are you sure you want to reject ${application.fullName}'s application?`)) {
        return;
      }

      try {
        console.log('❌ Rejecting application for:', application.fullName);
        
        // Update user role to rejected
        await updateDoc(doc(db, 'users', application.id), {
          role: 'rejected',
          updatedAt: new Date()
        });
        
        // Remove from pending applications
        await deleteDoc(doc(db, 'pendingTechnicians', application.id));
        
        // Send notification to technician
        await this.sendApplicationStatusNotification(application, 'rejected');
        
        // Remove from local array
        const index = this.applications.findIndex(app => app.id === application.id);
        if (index > -1) {
          this.applications.splice(index, 1);
        }
        
        alert(`Application for ${application.fullName} has been rejected.`);
        
      } catch (error) {
        console.error('❌ Error rejecting application:', error);
        alert('Failed to reject application. Please try again.');
      }
    },

    viewIdPhoto(application) {
      this.selectedApplication = application;
      this.showIdModal = true;
    },

    closeIdModal() {
      this.showIdModal = false;
      this.selectedApplication = null;
    },

    formatDate(timestamp) {
      if (!timestamp) return 'N/A';
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString();
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  },
  watch: {
    searchQuery() {
      this.currentPage = 1;
    }
  }
};
</script>

<style scoped>
.admin-dashboard-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
  margin-left: 14rem; /* reserve space for fixed sidebar */
  background: #faf8fd;

}
.dark .admin-dashboard-layout {
  background: var(--primary-bg);
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
  
  .pending-main {
    padding: 0.5rem;
    margin: 20px;
  }
}

@media (max-width: 480px) {
  .pending-main {
    margin-top: 70px;
    padding: 0.25rem;
  }
}

@media (max-width: 360px) {
  .pending-main {
    margin-top: 60px;
  }
}

.pending-main {
  flex: 1;
  padding: 2.5rem;
}


.pending-title {
  font-size: 2rem;
  font-weight: bold;
  color: #7c6bb0;
  margin-bottom: 0;
  width: auto;
}
.dark .pending-title {
  color: var(--primary-color);
}

.subtitle-search-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.pending-subtitle {
  font-size: 1.2rem;
  font-weight: 600;
  color: #7c6bb0;
}
.dark .pending-subtitle {
color: var(--primary-color);
}

.search-wrapper {
  display: flex;
  align-items: center;
  width: 411px;
  height: 50px;
  padding: 10px;
  gap: 8px;
  flex-shrink: 0;
  margin-bottom: 16px;
  position: relative;
}

.search-input {
  width: 100%;
  height: 100%;
  border-radius: 48px;
  border: 1px solid var(--border-border-primary, #C2C3C4);
  background: var(--grey-50, #EAEAEA);
  font-size: 1rem;
  color: #6B5FA7;
  outline: none;
  padding: 0 16px 0 40px;
  transition: border 0.2s;
}
.dark .search-input {
  background-color: var(--input-bg) !important;
  color: var(--text-muted) !important;
}

.search-input:focus {
  border: 1.5px solid #6B5FA7;
}
.dark .search-input:focus {
  border: 1.5px solid var(--primary-color) !important;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #b6a7e6;
  font-size: 1.1rem;
}
.dark .search-icon {
  color: var(--icon-color);
}

.applications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.application-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}
.dark .application-card {
  background-color: var(--grey-bg) !important;
}

.application-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
.dark .application-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15) !important;
}

.card-header {
  background: var(--primary-color);
  color: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dark .card-header {
  background-color: var(--primary) !important;
}

.applicant-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.dark .applicant-info {
  background-color: var(--primary) !important;
}

.applicant-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
}
.dark .applicant-avatar {
  border: 2px solid var(--primary-color) !important;
}

.applicant-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}
.dark .applicant-name {
  color: var(--primary-text);
}

.applicant-email {
  font-size: 0.9rem;
  opacity: 0.9;
  margin: 0;
}

.application-number {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-weight: 600;
}
.dark .application-number {
  background-color: var(--icon-color) !important;
}

.card-content {
  padding: 1.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
}
.dark .info-row {
  border-bottom: 1px solid var(--input-bg) !important;
}

.info-row:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.info-label {
  font-weight: 600;
  color: #6b7280;
  min-width: 120px;
}
.dark .info-label {
  color: var(--primary-text);
}

.info-value {
  color: var(--grey-50);
  text-align: right;
  flex: 1;
}

.bio-text {
  font-style: italic;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-actions {
  padding: 1rem 1.5rem;
  background: #f9fafb;
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}
.dark .card-actions {
  background-color: var(--grey-bg) !important;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
}

.view-btn {
  background: #3b82f6;
  color: white;
}

.view-btn:hover {
  background: #2563eb;
}

.accept-btn {
  background: #10b981;
  color: white;
}

.accept-btn:hover {
  background: #059669;
}

.reject-btn {
  background: #ef4444;
  color: white;
}

.reject-btn:hover {
  background: #dc2626;
}

.loading-state, .error-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
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

.error-message {
  color: #dc2626;
  font-weight: 600;
  margin-bottom: 1rem;
}

.retry-btn {
  background: #7c6bb0;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
}

.retry-btn:hover {
  background: #5a4a8c;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  color: #374151;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
}

.modal-close:hover {
  color: #374151;
}

.modal-body {
  padding: 1.5rem;
  text-align: center;
}

.photos-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.photo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.photo-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
  text-align: center;
}

.photo-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.application-photo {
  max-width: 100%;
  max-height: 300px;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  object-fit: cover;
}

.no-photo {
  color: #6b7280;
  font-style: italic;
  padding: 2rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 2px dashed #d1d5db;
  text-align: center;
  width: 100%;
}

/* Responsive design for photos */
@media (max-width: 768px) {
  .photos-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .application-photo {
    max-height: 250px;
  }
}

@media (max-width: 768px) {
  .pending-main {
    padding: 1rem;
  }
  .subtitle-search-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .search-wrapper {
    width: 100%;
    max-width: none;
  }
  .applications-grid {
    grid-template-columns: 1fr;
  }
  .card-actions {
    flex-direction: column;
  }
}
</style>
