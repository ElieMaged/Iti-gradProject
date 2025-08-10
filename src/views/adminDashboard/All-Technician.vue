<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="technicians-main mx-12 p-4">
      <TopBar :title="$t('technicianManagement')" />
      <div class="technicians-container">
        <div class="subtitle-search-row">
          <div class="technicians-subtitle">{{ $t('allTechnicians') }}</div>
          <div class="search-wrapper">
            <input 
              type="text" 
              v-model="searchQuery" 
              :placeholder="$t('search')" 
              class="search-input" 
            />
            <span class="search-icon"><i class="fas fa-search"></i></span>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>{{ $t('loadingTechnicians') }}</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <p class="error-message">{{ $t('failedToFetchTechnicians') }}</p>
          <button @click="fetchTechnicians" class="retry-btn">{{ $t('retry') }}</button>
        </div>

        <!-- Technicians Table -->
        <div v-else-if="filteredTechnicians.length > 0" class="table-wrapper">
          <table class="technicians-table">
            <thead>
              <tr class="table-header">
                <th>{{ $t('no') }}</th>
                <th>{{ $t('technician') }}</th>
                <th>{{ $t('specialization') }}</th>
                <th>{{ $t('location') }}</th>
                <th>{{ $t('mail') }}</th>
                <th>{{ $t('experience') }}</th>
                <th>{{ $t('basePrice') }}</th>
                <th>{{ $t('action') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(technician, index) in paginatedTechnicians"
                :key="technician.id"
                class="table-row"
              >
                <td>{{ (currentPage - 1) * techniciansPerPage + index + 1 }}</td>
                <td class="technician-cell">
                  <img :src="technician.avatar" :alt="technician.name" class="technician-avatar">
                  {{ technician.name }}
                </td>
                <td>{{ technician.specialization }}</td>
                <td>{{ technician.location }}</td>
                <td>{{ technician.email }}</td>
                <td>{{ technician.experience }} {{ $t('years') }}</td>
                <td>${{ technician.basePrice }}</td>
                <td class="action-cell">
                  <a @click="viewTechnician(technician)" class="action-btn view-btn" :title="$t('viewTechnician')">
                    <i class="fas fa-eye"></i>
                  </a>
                  <button @click="deleteTechnician(technician)" class="action-btn delete-btn" :title="$t('deleteTechnician')">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <pagination
          v-if="totalPages > 1"
          :total-pages="totalPages"
          :initial-page="currentPage"
          @page-changed="handlePageChange"
        />

        <!-- Empty State -->
        <div v-else class="empty-state">
          <p>{{ $t('noTechniciansFound') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminSidebar from '../../components/admin-sidebar.vue';
import Pagination from '../../components/pagination.vue';
import TopBar from '../../components/TopBar.vue';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default {
  components: { AdminSidebar, Pagination, TopBar },
  data() {
    return {
      searchQuery: '',
      technicians: [],
      loading: true,
      error: null,
      currentPage: 1,
      techniciansPerPage: 15
    };
  },
  computed: {
    filteredTechnicians() {
      if (!this.searchQuery.trim()) return this.technicians;
      const q = this.searchQuery.toLowerCase();
      return this.technicians.filter(technician =>
        technician.name?.toLowerCase().includes(q) ||
        technician.email?.toLowerCase().includes(q) ||
        technician.specialization?.toLowerCase().includes(q) ||
        technician.location?.toLowerCase().includes(q)
      );
    },
    
    paginatedTechnicians() {
      const startIndex = (this.currentPage - 1) * this.techniciansPerPage;
      const endIndex = startIndex + this.techniciansPerPage;
      return this.filteredTechnicians.slice(startIndex, endIndex);
    },
    
    totalPages() {
      return Math.ceil(this.filteredTechnicians.length / this.techniciansPerPage);
    }
  },
  async mounted() {
    await this.fetchTechnicians();
  },
  methods: {
    async fetchTechnicians() {
      try {
        this.loading = true;
        this.error = null;
        
        console.log('🔍 Fetching technicians from Firebase...');
        
        const techniciansCollection = collection(db, 'technicians');
        const snapshot = await getDocs(techniciansCollection);
        
        this.technicians = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log('📄 Technician data:', { id: doc.id, ...data });
          
          return {
            id: doc.id,
            name: data.fullName || 'Unknown',
            avatar: data.profilePhotoUrl || 'https://randomuser.me/api/portraits/men/1.jpg',
            specialization: data.specialization || 'N/A',
            location: `${data.government || 'N/A'}, ${data.district || 'N/A'}`,
            email: data.email || 'N/A',
            experience: data.experience || 'N/A',
            basePrice: data.basePrice || 'N/A',
            bio: data.bio || 'No bio available',
            willingToTravel: data.willingToTravel || 'No',
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          };
        });
        
        console.log('✅ Technicians loaded:', this.technicians.length);
        
      } catch (error) {
        console.error('❌ Error fetching technicians:', error);
        this.error = 'Failed to fetch technicians';
      } finally {
        this.loading = false;
      }
    },
    
    viewTechnician(technician) {
      this.$router.push(`/technician-profile/${technician.id}`);
    },
    
    async deleteTechnician(technician) {
      if (!confirm(this.$t('confirmDeleteTechnician', { name: technician.name }))) {
        return;
      }

      try {
        console.log('🗑️ Deleting technician:', technician.name, 'with ID:', technician.id);
        
        // Remove from technicians collection
        const technicianDoc = doc(db, 'technicians', technician.id);
        await deleteDoc(technicianDoc);
        console.log('✅ Technician document deleted from Firestore');

        // Remove from local array immediately for UI update
        const index = this.technicians.findIndex(t => t.id === technician.id);
        if (index > -1) {
          this.technicians.splice(index, 1);
          console.log('✅ Technician removed from local array');
        }

        // Show success message
        alert(this.$t('technicianDeletedSuccess', { name: technician.name }));
        
      } catch (error) {
        console.error('❌ Error deleting technician:', error);
        alert(this.$t('failedToDeleteTechnician'));
      }
    },
    
    handlePageChange(page) {
      this.currentPage = page;
      // Scroll to top of table when changing pages
      this.$nextTick(() => {
        const tableWrapper = this.$el.querySelector('.table-wrapper');
        if (tableWrapper) {
          tableWrapper.scrollIntoView({ behavior: 'smooth' });
        }
      });
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
  
  .technicians-main {
    margin:20px;
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .technicians-main {
    margin-top: 70px;
    padding: 0.25rem;
  }
  
  .table-header th,
  .table-row td {
    padding: 0.25rem 0.25rem;
    font-size: 0.7rem;
  }
  
  .technician-avatar {
    width: 2rem;
    height: 2rem;
  }
}

@media (max-width: 360px) {
  .technicians-main {
    margin-top: 60px;
  }
}
.technicians-main {
  flex: 1;
  padding: 2.5rem;
  font-size: 1.2em;
}
.dark .technicians-main {
  background-color: var(--primary-bg);
}
.dark .technicians-container {
  background-color: var(--primary-bg);
}
.technicians-title {
  font-size: 2rem;
  font-weight: bold;
  color: #7c6bb0;
  margin-bottom: 0;
}
.dark .technicians-title {
  color: var(--primary-color);
}
.subtitle-search-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.technicians-subtitle {
  font-size: 1.2rem;
  font-weight: 600;
  color: #7c6bb0;
}
.dark .technicians-subtitle {
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
  background-color: var(--input-bg);
  color: var(--text-muted);
}
.dark .search-input::placeholder {
  color: var(--text-muted);
}
.search-input:focus {
  border: 1.5px solid #6B5FA7;
}
.dark .search-input:focus {
  border: 1.5px solid var(--primary-text);
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
/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.dark .loading-state {
  background-color: var(--grey-bg);
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
.dark .loading-spinner {
  border: 4px solid var(--grey-bg);
  border-top: 4px solid var(--primary-text);
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
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.dark .error-state {
  background-color: var(--grey-bg);
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
.dark .retry-btn {
  background-color: var(--primary-text);
  color: var(--primary-bg);
}   
.retry-btn:hover {
  background: #6b5fa7;
}
.dark .retry-btn:hover {
  background-color: var(--primary-text);
  color: var(--primary-bg);
}
/* Empty State */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  color: #666;
  font-size: 1.1rem;
}
.dark .empty-state {
  background-color: var(--grey-bg);
}
.table-wrapper {
  overflow-x: auto;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.dark .table-wrapper {
  background-color: var(--grey-bg);
}
.technicians-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 0.75rem;
}
.dark .technicians-table {
  background-color: var(--grey-bg);
}
.table-header {
  background: rgba(124, 107, 176, 0.2);
  color: #333;
}
.dark .table-header {
  background-color: var(--grey-bg);
}
.table-header th {
  padding: 0.75rem 1rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
}
.dark .table-header th {
  color: var(--primary-text);
}
.table-row {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s;
}
.dark .table-row {
  background-color: var(--input-bg);
}
.table-row:hover {
  background: #ede7f6;
}
.dark .table-row:hover {
  background-color: var(--icon-color);
}
.table-row td {
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  color: #333;
  text-align: center;
  vertical-align: middle;
}
.dark .table-row td {
  color: var(--text-muted);
}
.technician-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.technician-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  object-fit: cover;
}
.action-cell {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s;
  font-size: 1rem;
}

.view-btn {
  color: #3b82f6;
}

.view-btn:hover {
  background: #dbeafe;
}

.delete-btn {
  color: #ef4444;
}

.delete-btn:hover {
  background: #fee2e2;
}

@media (max-width: 768px) {
  .technicians-main {
    padding: 1rem;
    font-size: 1.2em;
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
  .table-wrapper {
    font-size: 0.8rem;
  }
  .table-header th,
  .table-row td {
    padding: 0.5rem 0.5rem;
  }
  
  /* Improved mobile table responsiveness */
  .technicians-table {
    min-width: 600px;
  }
  
  .table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .technician-cell {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .technician-avatar {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .action-cell {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .action-btn {
    padding: 0.2rem;
  }
}

/* Pagination styles */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}
</style>
