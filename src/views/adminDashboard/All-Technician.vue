<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="technicians-main">
      <div class="technicians-container">
        <h2 class="technicians-title">Technician Management</h2>
        <div class="subtitle-search-row">
          <div class="technicians-subtitle">All Technicians</div>
          <div class="search-wrapper">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search" 
              class="search-input" 
            />
            <span class="search-icon"><i class="fas fa-search"></i></span>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading technicians...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <p class="error-message">{{ error }}</p>
          <button @click="fetchTechnicians" class="retry-btn">Retry</button>
        </div>

        <!-- Technicians Table -->
        <div v-else-if="filteredTechnicians.length > 0" class="table-wrapper">
          <table class="technicians-table">
            <thead>
              <tr class="table-header">
                <th>No</th>
                <th>Technician</th>
                <th>Specialization</th>
                <th>Location</th>
                <th>Email</th>
                <th>Experience</th>
                <th>Base Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(technician, index) in filteredTechnicians" 
                :key="technician.id" 
                class="table-row"
              >
                <td>{{ index + 1 }}</td>
                <td class="technician-cell">
                  <img :src="technician.avatar" :alt="technician.name" class="technician-avatar">
                  {{ technician.name }}
                </td>
                <td>{{ technician.specialization }}</td>
                <td>{{ technician.location }}</td>
                <td>{{ technician.email }}</td>
                <td>{{ technician.experience }} years</td>
                <td>${{ technician.basePrice }}</td>
                <td class="action-cell">
                  <a @click="viewTechnician(technician)" class="action-btn view-btn">
                    <i class="fas fa-eye"></i>
                  </a>
                  <button @click="deleteTechnician(technician)" class="action-btn delete-btn">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <p>No technicians found in the database.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminSidebar from '../../components/admin-sidebar.vue';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default {
  components: { AdminSidebar },
  data() {
    return {
      searchQuery: '',
      technicians: [],
      loading: true,
      error: null
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
            avatar: data.idPhotoUrl || 'https://randomuser.me/api/portraits/men/1.jpg',
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
      if (!confirm(`Are you sure you want to delete ${technician.name}? This action cannot be undone.`)) {
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
        alert(`Technician ${technician.name} has been deleted successfully from the database!`);
        
      } catch (error) {
        console.error('❌ Error deleting technician:', error);
        alert('Failed to delete technician. Please try again.');
      }
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

.technicians-main {
  flex: 1;
  padding: 2.5rem;
}

.technicians-container {
  max-width: 80rem;
  margin: 0 auto;
}

.technicians-title {
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

.technicians-subtitle {
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
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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

.table-wrapper {
  overflow-x: auto;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.technicians-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 0.75rem;
}

.table-header {
  background: rgba(124, 107, 176, 0.2);
  color: #333;
}

.table-header th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
}

.table-row {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s;
}

.table-row:hover {
  background: #ede7f6;
}

.table-row td {
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  color: #333;
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
}
</style>
