<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="pending-main">
      <div class="pending-container">
        <h2 class="pending-title">Pending Technician Applications</h2>
        <div class="subtitle-search-row">
          <div class="pending-subtitle">Review Applications</div>
          <div class="search-wrapper">
            <input 
              type="text" 
              placeholder="Search applications" 
              v-model="searchQuery"
              class="search-input"
            />
            <span class="search-icon"><i class="fas fa-search"></i></span>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading pending applications...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <p class="error-message">{{ error }}</p>
          <button @click="fetchPendingApplications" class="retry-btn">Retry</button>
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
                <img :src="application.idPhotoUrl || 'https://randomuser.me/api/portraits/men/1.jpg'" 
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
                <span class="info-label">Specialization:</span>
                <span class="info-value">{{ application.specialization }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Experience:</span>
                <span class="info-value">{{ application.experience }} years</span>
              </div>
              <div class="info-row">
                <span class="info-label">Location:</span>
                <span class="info-value">{{ application.government }}, {{ application.district }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Base Price:</span>
                <span class="info-value">${{ application.basePrice }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Willing to Travel:</span>
                <span class="info-value">{{ application.willingToTravel === 'yes' ? 'Yes' : 'No' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Bio:</span>
                <span class="info-value bio-text">{{ application.bio }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Applied:</span>
                <span class="info-value">{{ formatDate(application.createdAt) }}</span>
              </div>
            </div>

            <div class="card-actions">
              <button @click="viewIdPhoto(application)" class="action-btn view-btn">
                <i class="fas fa-id-card"></i> View ID
              </button>
              <button @click="acceptApplication(application)" class="action-btn accept-btn">
                <i class="fas fa-check"></i> Accept
              </button>
              <button @click="rejectApplication(application)" class="action-btn reject-btn">
                <i class="fas fa-times"></i> Reject
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <p>No pending technician applications found.</p>
        </div>
        
        <pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @prev-page="prevPage"
          @next-page="nextPage"
        />
      </div>
    </div>

    <!-- ID Photo Modal -->
    <div v-if="showIdModal" class="modal-overlay" @click="closeIdModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>ID Photo - {{ selectedApplication?.fullName }}</h3>
          <button @click="closeIdModal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <img v-if="selectedApplication?.idPhotoUrl" 
               :src="selectedApplication.idPhotoUrl" 
               alt="ID Photo" 
               class="id-photo" />
          <p v-else class="no-photo">No ID photo uploaded</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminSidebar from '../../components/admin-sidebar.vue';
import Pagination from '../../components/pagination.vue';
import { collection, getDocs, doc, deleteDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default {
  name: 'AdminPendingTech',
  components: {
    AdminSidebar,
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
  background: #faf8fd;
}

.pending-main {
  flex: 1;
  padding: 2.5rem;
}

.pending-container {
  max-width: 80rem;
  margin: 0 auto;
}

.pending-title {
  font-size: 2rem;
  font-weight: bold;
  color: #7c6bb0;
  margin-bottom: 0;
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

.search-input:focus {
  border: 1.5px solid #6B5FA7;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #b6a7e6;
  font-size: 1.1rem;
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

.application-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-header {
  background: linear-gradient(135deg, #7c6bb0, #6b5fa7);
  color: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.applicant-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.applicant-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
}

.applicant-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
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

.info-row:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.info-label {
  font-weight: 600;
  color: #6b7280;
  min-width: 120px;
}

.info-value {
  color: #374151;
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

.id-photo {
  max-width: 100%;
  max-height: 60vh;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.no-photo {
  color: #6b7280;
  font-style: italic;
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
